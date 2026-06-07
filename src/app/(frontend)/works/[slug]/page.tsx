import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { fetchWorkBySlug, fetchWorkSlugs } from "@/utils/payload-cache";
import RichText from "@/components/rich-text";
import {
  createLegacyRichText,
  parseLegacyWorkContent,
  richTextToRawText,
} from "@/utils/work-content";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

export async function generateStaticParams() {
  const works = await fetchWorkSlugs();
  return works.docs.map((work: any) => ({ slug: work.slug }));
}

const alignmentClass = (align?: string) => {
  switch ((align || "").toLowerCase()) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "text-left";
  }
};

export default async function WorkPage({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await fetchWorkBySlug(slug);

  if (!result.docs.length) notFound();

  const work: any = result.docs[0];
  const author = typeof work.author === "object" ? work.author : null;
  const rawText = richTextToRawText(work.content);
  const parsedLegacyContent = parseLegacyWorkContent(rawText);
  const renderAsLegacyMarkup = parsedLegacyContent.hasLegacyMarkup;
  const legacyRichText = renderAsLegacyMarkup
    ? createLegacyRichText(parsedLegacyContent.body)
    : null;
  const source = work.source || parsedLegacyContent.source;
  const translator = work.translator || parsedLegacyContent.translator;
  const footnotes =
    Array.isArray(work.footnotes) && work.footnotes.length > 0
      ? work.footnotes
      : parsedLegacyContent.footnotes;

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
  <div className="prose mx-auto overflow-x-auto break-normal rounded-md pb-6 pt-6 leading-relaxed sm:pb-8 sm:pt-10">
    {renderAsLegacyMarkup ? (
      <RichText data={legacyRichText!} className="muted-text native-poem" />
    ) : (
      <RichText data={work.content} className="muted-text" />
    )}

    {source ? (
      <p className="poem-source">
        <strong>Sumber:</strong> {source}
      </p>
    ) : null}

    {translator ? (
      <p className="poem-source mt-3">
        <strong>Penerjemah:</strong> {translator}
      </p>
    ) : null}

    {footnotes.map((footnote: any, index: number) => (
      <div key={`${footnote.label}-${index}`} className="poem-source mt-3">
        <strong>{footnote.label}:</strong>{" "}
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            p: ({ children }) => <>{children}</>,
          }}
        >
          {footnote.value}
        </ReactMarkdown>
      </div>
    ))}
  </div>
</div>
      </article>
    </section>
  );
}
