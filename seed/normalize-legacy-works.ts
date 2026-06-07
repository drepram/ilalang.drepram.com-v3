import "dotenv/config";
import fs from "node:fs";
import payload from "payload";
import { parse } from "csv-parse/sync";
import config from "@payload-config";
import { env } from "@/utils/env";
import { createLegacyRichText, parseLegacyWorkContent, richTextToRawText } from "@/utils/work-content";

type PostCsvRow = {
  id: string;
  title: string;
  content: string;
  published: string;
  authorId: string;
  createdAt: string;
  userId: string;
  highlighted: string;
};

const readCsv = <T>(filePath: string): T[] => {
  const raw = fs.readFileSync(filePath, "utf8");
  return parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as T[];
};

const sanitizeImportedContent = (content: string) => content.replace(/<br\s*\/?>/gi, "\n").trim();

const run = async () => {
  await payload.init({ config });

  const workId = process.env.WORK_ID;
  const workSlug = process.env.WORK_SLUG;
  const filters = [{ legacyId: { exists: true } }];

  if (workId) {
    filters.push({ id: { equals: workId } });
  }

  if (workSlug) {
    filters.push({ slug: { equals: workSlug } });
  }

  let originalContentByLegacyId: Map<string, string> | null = null;

  if (env.ilalangPostsCsv && fs.existsSync(env.ilalangPostsCsv)) {
    const posts = readCsv<PostCsvRow>(env.ilalangPostsCsv);
    originalContentByLegacyId = new Map(
      posts.map((row) => [row.id, sanitizeImportedContent(row.content || "")]),
    );
    console.log(`Loaded ${originalContentByLegacyId.size} original legacy work records from CSV source.`);
  } else {
    console.warn(
      `Original legacy CSV source not found at ${env.ilalangPostsCsv}. Falling back to current stored rich text content.`,
    );
  }

  const works = await payload.find({
    collection: "works",
    where: filters.length === 1 ? filters[0] : { and: filters },
    limit: 1000,
    pagination: false,
  });

  const docs = works.docs as any[];
  const total = docs.length;
  let successCount = 0;
  let failureCount = 0;

  if (workId || workSlug) {
    console.log(`Applying filters: WORK_ID=${workId || "-"}, WORK_SLUG=${workSlug || "-"}`);
  }

  console.log(`Found ${total} legacy works to normalize.`);

  if (total === 0) {
    return;
  }

  for (const [index, work] of docs.entries()) {
    const title = work.title || work.slug || work.id;
    console.log(`Normalizing ${index + 1}/${total}: ${title}`);

    try {
      const rawText =
        (work.legacyId && originalContentByLegacyId?.get(work.legacyId)) || richTextToRawText(work.content);
      const parsed = parseLegacyWorkContent(rawText);

      await payload.update({
        collection: "works",
        id: work.id,
        data: {
          title: work.title,
          slug: work.slug,
          legacyId: work.legacyId,
          author: typeof work.author === "object" ? work.author.id : work.author,
          content: createLegacyRichText(parsed.body),
          source: parsed.source || work.source || "",
          translator: parsed.translator || work.translator || "",
          footnotes: parsed.footnotes,
        },
      });

      successCount += 1;
      console.log(`Completed ${successCount}/${total}: ${title}`);
    } catch (error) {
      failureCount += 1;
      console.error(`Failed to normalize work ${work.id} (${title})`);
      console.error(error);
    }
  }

  console.log(`Normalization finished. Success: ${successCount}, Failures: ${failureCount}, Total: ${total}`);

  if (failureCount > 0) {
    throw new Error(`Normalization completed with ${failureCount} failure(s).`);
  }
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
