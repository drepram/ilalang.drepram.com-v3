import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { PluggableList } from "unified";
import { fetchWorkBySlug, fetchWorkSlugs } from "@/utils/payload-cache";
import { fetchLegacyPostRow } from "@/utils/legacy-content";
import { poemTextFromRichText } from "@/utils/poem-text";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

export async function generateStaticParams() {
  const works = await fetchWorkSlugs();
  return works.docs.map((work: any) => ({ slug: work.slug }));
}

const legacyMarkdownPlugins: PluggableList = [rehypeRaw];

export default async function WorkPage({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await fetchWorkBySlug(slug);

  if (!result.docs.length) notFound();

  const work: any = result.docs[0];
  const author = typeof work.author === "object" ? work.author : null;
  const legacyPost = work.legacyId ? await fetchLegacyPostRow(work.legacyId) : null;
  const showLegacyBody = Boolean(legacyPost?.content);
  const nativePoemText = !showLegacyBody ? poemTextFromRichText(work.content) : "";
  const source = work.source || "";

  return (
    <section className="mx-auto max-w-screen-sm px-2 sm:px-4">
      <article className="mx-auto max-w-full px-1 sm:px-4">
        {author?.slug ? (
          <header>
            <div className="space-y-1 border-b border-[#d8c6a7] pb-6 pt-2 text-center sm:pb-10 sm:pt-4">
              <div>
                <h1 className="mb-7 mt-2 text-sm sm:mb-10 sm:mt-3">
                  <Link
                    href={`/authors/${author.slug}`}
                    className="text-[#944129] hover:underline"
                  >
                    ← {author.name}
                  </Link>
                </h1>

                <div className="mx-auto max-w-3xl text-[2.2rem] leading-[1.08] sm:text-[3.2rem]">
                      <h1 className="text-3xl font-extrabold leading-tight text-[#2f241c] sm:text-4xl md:text-5xl">{work.title}</h1>
                </div>
              </div>
            </div>
          </header>
        ) : null}

        <div className="divide-y divide-[#d8c6a7] pb-6 sm:pb-8">
  <div className="prose mx-auto overflow-x-auto whitespace-pre break-normal rounded-md pb-6 pt-6 leading-relaxed sm:pb-8 sm:pt-10">
    {showLegacyBody ? (
      <div className="markdown-content min-w-max">
        <ReactMarkdown rehypePlugins={legacyMarkdownPlugins}>
          {legacyPost?.content ?? ""}
        </ReactMarkdown>
      </div>
    ) : (
      <pre className="native-poem markdown-content whitespace-pre break-normal font-inherit">
        {nativePoemText}
      </pre>
    )}

    {!showLegacyBody && source ? (
      <p className="poem-source">
        <strong>Sumber:</strong> {source}
      </p>
    ) : null}
  </div>
</div>
      </article>
    </section>
  );
}
