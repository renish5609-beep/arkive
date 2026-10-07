import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SourceRecordView } from "@/components/source-detail";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { listProjectManifests, loadProject } from "@/lib/projects";

export function generateStaticParams() {
  return listProjectManifests().flatMap((manifest) => {
    const project = loadProject(manifest.slug);
    if (!project) return [];
    return project.sources.map((source) => ({ slug: manifest.slug, id: source.id }));
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

  const source = project.sources.find((item) => item.id === id);
  if (!source) return {};

  return {
    title: source.title,
    openGraph: { title: `${source.title} | ${project.manifest.title}` },
  };
}

export default async function ProjectSourcePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const project = loadProject(slug);
  if (!project) notFound();

  const source = project.sources.find((item) => item.id === id);
  if (!source) notFound();

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />
      <main>
        <SourceRecordView project={project} source={source} />
      </main>
      <SiteFooter />
    </div>
  );
}
