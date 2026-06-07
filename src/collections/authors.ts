import type { CollectionConfig } from "payload";
import { slug } from "@/fields/slug";
import { allowAnyone, allowEditors } from "./utils";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: allowEditors,
    read: allowAnyone,
    update: allowEditors,
    delete: allowEditors,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    slug({ trackingField: "name" }),
    {
      name: "legacyId",
      type: "text",
      required: false,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "images",
      filterOptions: {
        mimeType: { contains: "image" },
      },
    },
    {
      name: "legacyProfilePicture",
      type: "text",
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "yearOfLife",
      type: "text",
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "bio",
      type: "richText",
    },
  ],
};
