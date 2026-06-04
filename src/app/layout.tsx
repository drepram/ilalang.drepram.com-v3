import type { ReactNode } from "react";
import { defaultMetadata } from "@/utils/meta";
import "./(frontend)/globals.css";

export const metadata = defaultMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
