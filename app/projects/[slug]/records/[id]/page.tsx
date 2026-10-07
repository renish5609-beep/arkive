import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonRecordView, PlaceRecordView } from "@/components/record-sections";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { listProjectManifests, loadProject } from "@/lib/projects";

export function generateStaticParams() {
  return listProjectManifests().flatMap((manifest) => {
    const project = loadProject(manifest.slug);
    if (!project) return [];
    return [...project.people, ...project.places].map((entity) => ({
      slug: manifest.slug,
      id: entity.id,
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}): Promise<Metadata> {
  const { slug, id } = await params;
  const project = loadProject(slug);
  if (!project) return {};

  const person = project.people.find((item) => item.id === id);
  const place = project.places.find((item) => item.id === id);
  const name = person?.name ?? place?.name;
  if (!name) return {};

  return {
    title: name,
    openGraph: { title: `${name} | ${project.manifest.title}` },
  };
}

export default async function ProjectRecordPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const project = loadProject(slug);
  if (!project) notFound();

  const person = project.people.find((item) => item.id === id);
  const place = person ? null : project.places.find((item) => item.id === id);

  if (!person && !place) notFound();

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />
      <main>
        {person ? (
          <PersonRecordView project={project} person={person} />
        ) : (
          <PlaceRecordView project={project} place={place!} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
