import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { fetchWorkBySlug, fetchWorkSlugs } from "@/utils/payload-cache";
import RichText from "@/components/rich-text";
import {
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
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => <p className="mb-6 whitespace-pre-wrap leading-[2]">{children}</p>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#b98f5a] pl-4 italic text-[#4f4134]">
              {children}
            </blockquote>
          ),
          div: ({ children, node }) => {
            const align = typeof node?.properties?.align === "string" ? node.properties.align : undefined;
            return <div className={`mb-6 whitespace-pre-wrap ${alignmentClass(align)}`}>{children}</div>;
          },
          ol: ({ children }) => <ol className="mb-6 list-decimal pl-8">{children}</ol>,
          ul: ({ children }) => <ul className="mb-6 list-disc pl-8">{children}</ul>,
          hr: () => <hr className="my-8 border-[#d8c6a7]" />,
          pre: ({ children, node }) => {
            const align = typeof node?.properties?.align === "string" ? node.properties.align : undefined;
            return (
              <pre
                className={`native-poem markdown-content mb-6 whitespace-pre-wrap break-normal bg-transparent p-0 font-inherit ${alignmentClass(align)}`}
              >
              {children}
              </pre>
            );
          },
          code: ({ children }) => <code className="bg-transparent px-0 font-inherit">{children}</code>,
        }}
      >
        {parsedLegacyContent.body}
      </ReactMarkdown>
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
