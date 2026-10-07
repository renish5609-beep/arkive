import { notFound, redirect } from "next/navigation";
import { loadProject } from "@/lib/projects";

// Legacy compatibility route. The canonical URL is now
// /projects/quakertown/records/<id>; this keeps old links working.
export function generateStaticParams() {
  const project = loadProject("quakertown");
  if (!project) return [];
  return [...project.people, ...project.places].map((entity) => ({ id: entity.id }));
}

export default async function LegacyRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = loadProject("quakertown");
  const exists =
    project && (project.people.some((person) => person.id === id) || project.places.some((place) => place.id === id));

  if (!exists) notFound();

  redirect(`/projects/quakertown/records/${id}`);
}
