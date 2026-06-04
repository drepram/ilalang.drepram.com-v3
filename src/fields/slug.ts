import type { Field } from "payload";
import { formatSlug } from "@/utils/slug";

const randomSuffix = () => Math.random().toString(36).slice(2, 8);

export const slug = (
  { trackingField = "title" }: { trackingField?: string } = {},
  overrides?: Partial<Field>,
): Field => {
  return {
    name: "slug",
    unique: true,
    type: "text",
    index: true,
    admin: {
      position: "sidebar",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          const trackedValue = formatSlug(data?.[trackingField]);
          const isImported = Boolean(data?.legacyId);

          if (value && (!trackedValue || value !== trackedValue || isImported)) {
            return value;
          }

          if (!trackedValue) return value;
          if (isImported) return value ?? trackedValue;
          return `${trackedValue}-${randomSuffix()}`;
        },
      ],
    },
    ...overrides,
  } as Field;
};
