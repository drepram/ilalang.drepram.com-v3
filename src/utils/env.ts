const appEnv = process.env.APP_ENV === "server" ? "server" : "local";
const prefix = appEnv === "server" ? "SERVER" : "LOCAL";

const getEnv = (name: string, fallback = "") =>
  process.env[`${prefix}_${name}`] ?? process.env[name] ?? fallback;

const getBool = (name: string, fallback = false) => {
  const value = getEnv(name);
  if (!value) return fallback;
  return value === "true" || value === "1";
};

export const env = {
  appEnv,
  payloadSecret: getEnv("PAYLOAD_SECRET"),
  databaseUrl: getEnv("DATABASE_URL"),
  nextPublicServerUrl: getEnv("NEXT_PUBLIC_SERVER_URL", "http://localhost:3000"),
  nextPublicSiteUrl: getEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  cookieDomain: getEnv("COOKIE_DOMAIN"),
  secureCookies: getBool("SECURE_COOKIES", appEnv === "server"),
  ilalangAuthorsCsv: getEnv(
    "ILALANG_AUTHORS_CSV",
    "/var/folders/40/526hqzhx5t5c88p4h87h_5c40000gn/T/opencode/ilalang-authors.csv",
  ),
  ilalangPostsCsv: getEnv(
    "ILALANG_POSTS_CSV",
    "/var/folders/40/526hqzhx5t5c88p4h87h_5c40000gn/T/opencode/ilalang-posts.csv",
  ),
};
