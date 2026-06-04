import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

const defaultRevalidate = 300;

const getPayloadClient = async () => getPayload({ config });

const cachedCollectionFind = <TArgs extends Record<string, unknown>>(
  keyParts: string[],
  query: () => Promise<TArgs>,
) => unstable_cache(query, keyParts, { revalidate: defaultRevalidate })();

export const fetchFeaturedWorks = () =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "works",
        where: { showOnHome: { equals: true } },
        depth: 1,
        limit: 100,
        sort: ["title"],
      });
    },
    ["works-featured"],
    { revalidate: defaultRevalidate },
  )();

export const fetchAllAuthors = () =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "authors",
        depth: 0,
        limit: 100,
        sort: ["name"],
      });
    },
    ["authors-all"],
    { revalidate: defaultRevalidate },
  )();

export const fetchWorkSlugs = () =>
  cachedCollectionFind(
    ["works-slugs"],
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "works",
        select: { slug: true },
        pagination: false,
      });
    },
  );

export const fetchAuthorSlugs = () =>
  cachedCollectionFind(
    ["authors-slugs"],
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "authors",
        select: { slug: true },
        pagination: false,
      });
    },
  );

export const fetchWorkBySlug = (slug: string) =>
  cachedCollectionFind(
    ["work", slug],
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "works",
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
      });
    },
  );

export const fetchAuthorBySlug = (slug: string) =>
  cachedCollectionFind(
    ["author", slug],
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "authors",
        where: { slug: { equals: slug } },
        depth: 0,
        limit: 1,
      });
    },
  );

export const fetchWorksByAuthorId = (authorId: string) =>
  (async () => {
    const payload = await getPayloadClient();
    return payload.find({
      collection: "works",
      where: { author: { equals: authorId } },
      depth: 1,
      limit: 500,
      sort: ["-createdAt"],
    });
  })();

export const fetchWorkByLegacyId = (legacyId: string) =>
  cachedCollectionFind(
    ["work-legacy", legacyId],
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "works",
        where: { legacyId: { equals: legacyId } },
        depth: 0,
        limit: 1,
      });
    },
  );

export const fetchAuthorByLegacyId = (legacyId: string) =>
  cachedCollectionFind(
    ["author-legacy", legacyId],
    async () => {
      const payload = await getPayloadClient();
      return payload.find({
        collection: "authors",
        where: { legacyId: { equals: legacyId } },
        depth: 0,
        limit: 1,
      });
    },
  );
