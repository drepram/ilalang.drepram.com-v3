import type { Author } from "@/payload.types";
import { plainTextFromRichText } from "@/utils/plain-text";

const fallbackSummary = "Profil penulis di ilalang.";

export const getAuthorBio = (author: Pick<Author, "description" | "bio">) => {
  return plainTextFromRichText(author.bio) || author.description?.trim() || fallbackSummary;
};

export const getAuthorSummary = (author: Pick<Author, "description" | "bio">) => {
  return author.description?.trim() || plainTextFromRichText(author.bio) || fallbackSummary;
};

export const getAuthorExcerpt = (
  author: Pick<Author, "description" | "bio">,
  maxLength = 220,
) => {
  const summary = getAuthorSummary(author).replace(/\s+/g, " ").trim();

  if (summary.length <= maxLength) return summary;

  return `${summary.slice(0, maxLength).trimEnd()}...`;
};
