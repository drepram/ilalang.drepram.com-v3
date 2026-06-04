import Image from "next/image";
import Link from "next/link";
import { fetchAllAuthors, fetchFeaturedWorks } from "@/utils/payload-cache";

export const revalidate = 300;

export default async function HomePage() {
  const [authors, works] = await Promise.all([fetchAllAuthors(), fetchFeaturedWorks()]);

  return (
    <section className="mx-auto max-w-6xl px-1 sm:px-4">
      <div className="space-y-2 pb-6 pt-5 md:space-y-5 md:pb-8 md:pt-6">
        {/* <h1 className="page-title text-[#2f241c]">mengabadikan ingatan</h1> */}
        <h1 className="text-3xl font-extrabold leading-tight text-[#2f241c] sm:text-4xl md:text-5xl">mengabadikan ingatan</h1>
        <p className="max-w-5xl text-base leading-7 muted-text sm:text-lg">
          Seperti ilalang yang tidak diinginkan petani di ladang mereka, dalam situs ini
          dihimpun sajak-sajak dari para "ilalang" dalam semesta sejarah puitika Indonesia.
          Bukan atas kehendak sendiri, nama dan karya mereka disingkirkan, seluruhnya atas
          pertimbangan politik ingatan, dibayangi kekerasan negara, yang menjadikan para
          perangkai kata sebagai <i>pariah</i>, bahkan harus menggelandang puluhan tahun di luar
          negeri.
        </p>
      </div>

      <div className="divide-y soft-divider">
        <div className="space-y-2 pb-6 pt-5 md:space-y-5 md:pb-8 md:pt-6">
          <h2 className="section-title text-[#2f241c]">Mutiara</h2>
        </div>
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
            {authors.docs.map((author: any) => (
            <div key={author.id} className="w-full">
              <div className="editor-card overflow-hidden h-full">
                {author.legacyProfilePicture ? (
                  <Link href={`/authors/${author.slug}`} className="block" aria-label={`Link to ${author.name}`}>
                    <Image
                      src={author.legacyProfilePicture}
                      alt={author.name}
                      width={960}
                      height={720}
                      unoptimized
                      className="h-[220px] w-full object-cover object-center sm:h-[280px] md:h-36 lg:h-48"
                      loading="lazy"
                    />
                  </Link>
                ) : null}
                <div className="p-5 sm:p-6">
                  <h3 className="mb-3 text-[1.75rem] font-bold leading-[1.08] tracking-tight text-[#2f241c] sm:text-2xl">
                    <Link href={`/authors/${author.slug}`} aria-label={`Link to ${author.name}`}>
                      {author.name}
                    </Link>
                  </h3>
                  <p className="prose mb-0 max-w-none muted-text text-base leading-7 sm:text-[1.05rem] sm:leading-8">
                    {author.description || "Profil penulis di ilalang."}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="divide-y soft-divider">
        <div className="space-y-2 pb-6 pt-5 md:space-y-5 md:pb-8 md:pt-6">
          <h2 className="section-title text-[#2f241c]">Sorotan</h2>
        </div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {works.docs.map((work: any) => {
            const author = typeof work.author === "object" ? work.author : null;
            return (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className="editor-card flex h-full flex-col justify-center p-5 sm:p-6"
              >
                <h3 className="mb-2 text-center text-lg font-bold text-[#2f241c] sm:text-xl">
                  {work.title}
                </h3>
                <small className="text-center text-[#6e6052]">{author?.name || "Penulis"}</small>
              </Link>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
