import sharp from "sharp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { buildConfig } from "payload";
import path from "path";
import { Authors } from "@/collections/authors";
import { Images } from "@/collections/images";
import { Users } from "@/collections/users";
import { Works } from "@/collections/works";
import { env } from "@/utils/env";

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Images, Authors, Works, Users],
  admin: {
    user: Users.slug,
    suppressHydrationWarning: true,
  },
  secret: env.payloadSecret,
  db: vercelPostgresAdapter({
    pool: {
      connectionString: env.databaseUrl,
    },
    idType: "uuid",
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(process.cwd(), "src/payload.types.ts"),
  },
  cors: [env.nextPublicServerUrl].filter(Boolean),
  csrf: [env.nextPublicServerUrl].filter(Boolean),
});
