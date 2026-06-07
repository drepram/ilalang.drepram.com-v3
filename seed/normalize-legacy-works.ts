import "dotenv/config";
import payload from "payload";
import config from "@payload-config";
import { createLegacyRichText, parseLegacyWorkContent, richTextToRawText } from "@/utils/work-content";

const run = async () => {
  await payload.init({ config });

  const works = await payload.find({
    collection: "works",
    where: { legacyId: { exists: true } },
    limit: 1000,
    pagination: false,
  });

  for (const work of works.docs as any[]) {
    const rawText = richTextToRawText(work.content);
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
