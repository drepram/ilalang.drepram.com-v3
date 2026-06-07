import "dotenv/config";
import fs from "node:fs";
import payload from "payload";
import { parse } from "csv-parse/sync";
import config from "@payload-config";
import { env } from "@/utils/env";
import { formatSlug } from "@/utils/slug";
import { createLegacyRichText, createParagraphRichText, parseLegacyWorkContent } from "@/utils/work-content";

type AuthorCsvRow = {
  id: string;
  name: string;
  profilePicture: string;
  yearOfLife: string;
  bio: string;
  description: string;
};

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

const parseBoolean = (value: string) => value === "true" || value === "t";

const sanitizeImportedContent = (content: string) =>
  content.replace(/<br\s*\/?>/gi, "\n").trim();

const createImportedWorkSlug = (title: string, legacyId: string) => {
  const base = formatSlug(title) || "work";
  return `${base}-${legacyId.slice(-6).toLowerCase()}`;
};

const run = async () => {
  await payload.init({ config });

  const authors = readCsv<AuthorCsvRow>(env.ilalangAuthorsCsv);
  const posts = readCsv<PostCsvRow>(env.ilalangPostsCsv);
  const authorIdMap = new Map<string, string>();

  for (const row of authors) {
    const existing = await payload.find({
      collection: "authors",
      where: { legacyId: { equals: row.id } },
      limit: 1,
    });

    const data = {
      name: row.name,
      slug: formatSlug(row.name),
      legacyId: row.id,
      legacyProfilePicture: row.profilePicture || "",
      yearOfLife: row.yearOfLife || "",
      description: row.description || "",
      bio: createParagraphRichText(row.bio || ""),
    };

    const authorDoc = existing.docs.length
      ? await payload.update({
          collection: "authors",
          id: existing.docs[0].id,
          data,
        })
      : await payload.create({
          collection: "authors",
          data,
        });

    authorIdMap.set(row.id, authorDoc.id);
  }

  for (const row of posts) {
    const authorId = authorIdMap.get(row.authorId);
    if (!authorId) continue;

    const content = sanitizeImportedContent(row.content || "");
    const parsedContent = parseLegacyWorkContent(content);

    const existing = await payload.find({
      collection: "works",
      where: { legacyId: { equals: row.id } },
      limit: 1,
    });

    const data = {
      title: row.title,
      slug: createImportedWorkSlug(row.title, row.id),
      legacyId: row.id,
      author: authorId,
      content: createLegacyRichText(parsedContent.body),
      source: parsedContent.source,
      translator: parsedContent.translator,
      footnotes: parsedContent.footnotes,
      showOnHome: parseBoolean(row.highlighted),
      publishedAt: row.createdAt,
      legacyCreatedAt: row.createdAt,
      legacyUserId: row.userId || "",
      importedPublished: parseBoolean(row.published),
    };

    if (existing.docs.length) {
      await payload.update({
        collection: "works",
        id: existing.docs[0].id,
        data,
      });
    } else {
      await payload.create({
        collection: "works",
        data,
      });
    }
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
