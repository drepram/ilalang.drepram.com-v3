import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchAuthorBySlug, fetchAuthorSlugs, fetchWorksByAuthorId } from "@/utils/payload-cache";
import { plainTextFromRichText } from "@/utils/plain-text";

type Params = Promise<{ slug: string }>;

export const revalidate = 300;

export async function generateStaticParams() {
  const authors = await fetchAuthorSlugs();
  return authors.docs.map((author: any) => ({ slug: author.slug }));
}

export default async function AuthorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const result = await fetchAuthorBySlug(slug);

  if (!result.docs.length) notFound();

  const author: any = result.docs[0];
  const works = await fetchWorksByAuthorId(author.id);
  const authorBioText = plainTextFromRichText(author.bio);

  return (
    <section className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
      <div className="author-profile my-8 rounded-2xl border border-[#dac9ab] bg-[rgba(255,252,245,0.9)] p-6 shadow-[0_14px_30px_rgba(42,30,18,0.1)] sm:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center sm:text-left">
            <h1 className="mb-2 text-3xl font-bold text-[#2f241c]">{author.name}</h1>
            <h5 className="mb-2 text-[#6d5e50]">{author.yearOfLife || ""}</h5>
            <hr className="my-4 w-full border-[#ddcbae]" />
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {author.legacyProfilePicture ? (
              <Image
                src={author.legacyProfilePicture}
                alt={`${author.name}'s profile`}
                width={112}
                height={112}
                unoptimized
                className="mx-auto h-28 w-28 shrink-0 rounded-full border-2 border-[#cfb48b] object-cover sm:mx-0"
              />
            ) : null}

            {authorBioText ? (
              <p className="whitespace-pre-line text-left text-sm text-[#5f5244] sm:text-[15px] leading-6">
                {authorBioText}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <main className="mt-6 space-y-6">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {works.docs.map((work: any) => (
            <Link
              key={work.id}
              href={`/works/${work.slug}`}
              className="editor-card cursor-pointer p-6"
            >
              <h3 className="mb-2 text-xl font-bold text-[#2f241c]">{work.title}</h3>
            </Link>
          ))}
        </div>
        {works.docs.length === 0 ? (
          <div className="mt-6 text-[#6d5e50]">Penulis ini belum dimuat karyanya.</div>
        ) : null}
        </div>
      </main>
    </section>
  );
}
