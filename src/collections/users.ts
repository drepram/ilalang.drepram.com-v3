import type { CollectionConfig } from "payload";
import { allowSuperadmins, allowSuperadminsOrSelf } from "./utils";
import { env } from "@/utils/env";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: {
    tokenExpiration: 28800,
    cookies: {
      sameSite: env.secureCookies ? "None" : "Lax",
      secure: env.secureCookies,
      domain: env.cookieDomain || undefined,
    },
  },
  fields: [
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      saveToJWT: true,
      options: [
        { label: "Super Admin", value: "superadmin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
  access: {
    read: allowSuperadminsOrSelf,
    create: allowSuperadmins,
    update: allowSuperadmins,
    delete: allowSuperadmins,
  },
};
