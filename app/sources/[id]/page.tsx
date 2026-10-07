import { notFound, redirect } from "next/navigation";
import { loadProject } from "@/lib/projects";

// Legacy compatibility route. The canonical URL is now
// /projects/quakertown/sources/<id>; this keeps old links working.
export function generateStaticParams() {
  const project = loadProject("quakertown");
  if (!project) return [];
  return project.sources.map((source) => ({ id: source.id }));
}

export default async function LegacySourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = loadProject("quakertown");
  const exists = project && project.sources.some((source) => source.id === id);

  if (!exists) notFound();

  redirect(`/projects/quakertown/sources/${id}`);
}
