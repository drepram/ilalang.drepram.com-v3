import fs from "node:fs";
import { unstable_cache } from "next/cache";
import { parse } from "csv-parse/sync";
import { env } from "@/utils/env";

type LegacyPostRow = {
  id: string;
  title: string;
  content: string;
  published: string;
  authorId: string;
  createdAt: string;
  userId: string;
  highlighted: string;
};

const loadLegacyPostMap = unstable_cache(
  async () => {
    const raw = fs.readFileSync(env.ilalangPostsCsv, "utf8");
    const rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    }) as LegacyPostRow[];

    return Object.fromEntries(rows.map((row) => [row.id, row]));
  },
  ["legacy-post-map"],
  { revalidate: 300 },
);

export const fetchLegacyPostRow = async (legacyId: string) => {
  const rows = await loadLegacyPostMap();
  return rows[legacyId] ?? null;
};
