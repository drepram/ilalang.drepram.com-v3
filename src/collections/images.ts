import type { CollectionConfig } from "payload";
import { allowAnyone, allowEditors } from "./utils";

export const Images: CollectionConfig = {
  slug: "images",
  upload: {
    staticDir: "image",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    {
      name: "source",
      type: "text",
    },
  ],
  access: {
    create: allowEditors,
    read: allowAnyone,
    update: allowEditors,
    delete: allowEditors,
  },
};
