import type { ReactNode } from "react";
import Link from "next/link";

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <div className="frontend-shell">
      <div className="site-shell">
        <div className="surface-panel overflow-hidden">
          <header className="border-b border-[#dac9ab] bg-[rgba(255,252,245,0.92)]">
            <div className="px-4 py-3 sm:relative sm:px-8 sm:py-5">
              <div className="flex flex-col items-center gap-2 text-center sm:block">
                <Link href="/" className="text-3xl font-bold tracking-tight text-[#3f2d22] sm:text-4xl">
                  ilalang
                </Link>
                <div className="text-sm text-[#755843] sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 sm:flex sm:items-center sm:gap-4">
                  <Link href="/tentang" className="text-[#755843] hover:text-[#944129]">
                    tentang ilalang
                  </Link>
                  {/* <Link href="/admin">admin</Link> */}
                </div>
              </div>
            </div>
          </header>
          <main className="px-3 pb-8 sm:px-8">{children}</main>
          <footer className="mt-10 border-t border-[#dcc8a9] px-4 py-6 sm:px-8">
            <div className="flex flex-col items-center gap-2 text-sm text-[#665a4d] sm:flex-row sm:justify-between">
              <p>berdiri sejak 17 Agustus 2024</p>
              {/* <Link href="/tentang" className="footer-link">
                tentang ilalang
              </Link> */}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
