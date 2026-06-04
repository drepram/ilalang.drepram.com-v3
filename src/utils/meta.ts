import type { Metadata } from "next";
import { env } from "./env";

export const SITE_NAME = "ilalang";
export const SITE_URL = env.nextPublicSiteUrl;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Repositori karya para ilalang dari 1946 sampai 1965. Melawan kekerasan negara dengan mengabadikan ingatan.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_NAME,
    description:
      "Repositori karya para ilalang dari 1946 sampai 1965. Melawan kekerasan negara dengan mengabadikan ingatan.",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Repositori karya para ilalang dari 1946 sampai 1965. Melawan kekerasan negara dengan mengabadikan ingatan.",
  },
};
