import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewQueueView } from "@/components/review-queue";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { listProjectManifests, loadProject } from "@/lib/projects";

export function generateStaticParams() {
  return listProjectManifests().map((manifest) => ({ slug: manifest.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = loadProject(slug);
  if (!project) return {};

  return {
    title: "Entity resolution queue",
    description: `Pending identity matches and open research questions for ${project.manifest.title}. Scores are heuristics, not historical verification.`,
    openGraph: {
      title: `Entity resolution queue | ${project.manifest.title}`,
      description: "Pending identity matches and open research questions. Scores are heuristics, not historical verification.",
    },
  };
}

export default async function ProjectReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = loadProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />
      <main>
        <ReviewQueueView project={project} />
      </main>
      <SiteFooter />
    </div>
  );
}
