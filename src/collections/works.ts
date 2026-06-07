import type { CollectionConfig } from "payload";
import { slug } from "@/fields/slug";
import { allowAnyone, allowEditors } from "./utils";
import { revalidatePath } from "next/cache";

const revalidateWorkPaths = async ({
  doc,
  previousDoc,
  req,
}: {
  doc?: { slug?: string | null; author?: string | { slug?: string | null } | null };
  previousDoc?: { author?: string | { slug?: string | null } | null };
  req: { payload: { findByID: Function } };
}) => {
  try {
    revalidatePath("/");

    if (doc?.slug) {
      revalidatePath(`/works/${doc.slug}`);
    }

    const authorValues = [doc?.author, previousDoc?.author].filter(Boolean);

    for (const authorValue of authorValues) {
      if (typeof authorValue === "object" && authorValue?.slug) {
        revalidatePath(`/authors/${authorValue.slug}`);
        continue;
      }

      if (typeof authorValue === "string") {
        const author = await req.payload.findByID({
          collection: "authors",
          id: authorValue,
          depth: 0,
        });

        if (author?.slug) {
          revalidatePath(`/authors/${author.slug}`);
        }
      }
    }
  } catch {
    // Safe outside request lifecycle.
  }
};

export const Works: CollectionConfig = {
  slug: "works",
  admin: {
    useAsTitle: "title",
  },
  access: {
    create: allowEditors,
    read: allowAnyone,
    update: allowEditors,
    delete: allowEditors,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slug({ trackingField: "title" }),
    {
      name: "legacyId",
      type: "text",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "Only used for poems imported from ilalang v2.",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "source",
      type: "text",
    },
    {
      name: "translator",
      type: "text",
    },
    {
      name: "footnotes",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "showOnHome",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "legacyCreatedAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Only used for imported records.",
      },
    },
    {
      name: "legacyUserId",
      type: "text",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Only used for imported records.",
      },
    },
    {
      name: "importedPublished",
      type: "checkbox",
      defaultValue: false,
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Marks imported publication state from ilalang v2.",
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => revalidateWorkPaths({ doc, previousDoc, req }),
    ],
    afterDelete: [
      async ({ doc, req }) => revalidateWorkPaths({ doc, req }),
    ],
  },
};
