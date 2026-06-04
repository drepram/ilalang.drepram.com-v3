import { notFound, redirect } from "next/navigation";
import { fetchAuthorByLegacyId } from "@/utils/payload-cache";

type Params = Promise<{ id: string }>;

export default async function LegacyAuthorRedirectPage({ params }: { params: Params }) {
  const { id } = await params;
  const result = await fetchAuthorByLegacyId(id);
  const author: any = result.docs[0];
  if (!author?.slug) notFound();
  redirect(`/authors/${author.slug}`);
}
