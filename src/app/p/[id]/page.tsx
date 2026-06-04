import { notFound, redirect } from "next/navigation";
import { fetchWorkByLegacyId } from "@/utils/payload-cache";

type Params = Promise<{ id: string }>;

export default async function LegacyWorkRedirectPage({ params }: { params: Params }) {
  const { id } = await params;
  const result = await fetchWorkByLegacyId(id);
  const work: any = result.docs[0];
  if (!work?.slug) notFound();
  redirect(`/works/${work.slug}`);
}
