import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArchiveExplorer from "@/components/archive-explorer";
import DatasetLinks from "@/components/dataset-links";
import GeoreferenceStatus from "@/components/georeference-status";
import ProvenanceList from "@/components/provenance-list";
import ReconstructionMapShell from "@/components/reconstruction-map-shell";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getProjectMetrics } from "@/lib/project-metrics";
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
    title: project.manifest.title,
    description: project.manifest.summary,
    openGraph: {
      title: `${project.manifest.title} | Arkive`,
      description: project.manifest.summary,
    },
  };
}

function MetricCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="border border-black/15 p-5">
      <div className="text-3xl font-medium">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-60">{label}</div>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = loadProject(slug);
  if (!project) notFound();

  const { manifest, people, places, sources, relationships, locationEvidence, georeferenceQueue, mentions, researchQueue } =
    project;
  const metrics = getProjectMetrics(project);

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:px-12 md:pt-24">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
              Project {manifest.project_number}
            </p>
            {manifest.status === "pilot" && (
              <span className="border border-dashed border-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.14em] opacity-70">
                Pilot case study
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-4xl text-5xl font-medium leading-[1] tracking-[-0.04em] md:text-7xl">
            {manifest.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 opacity-80">{manifest.historical_context}</p>

          {manifest.context_note && (
            <div className="mt-10 max-w-3xl border-l-2 border-black/25 pl-5">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
                Why this community matters
              </div>
              <p className="mt-2 text-sm leading-7 opacity-80">{manifest.context_note}</p>
            </div>
          )}

          <div className="mt-10 border-l-2 border-black/25 pl-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">Current scope</div>
            <p className="mt-2 max-w-3xl text-sm leading-7 opacity-80">{manifest.research_scope}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 opacity-70">{manifest.source_note}</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 opacity-70">
              Verification labels describe the status of Arkive&apos;s evidence links; they do not
              capture every{" "}
              <a href="/about#historical-uncertainty" className="underline underline-offset-4">
                historical uncertainty
              </a>{" "}
              involved in interpreting the past.
            </p>
          </div>
        </section>

        <section className="border-y border-black/10 bg-[#e7e0d3] px-6 py-16 md:px-12" aria-labelledby="impact-heading">
          <div className="mx-auto max-w-7xl">
            <h2 id="impact-heading" className="text-2xl font-medium">
              Project status
            </h2>
            <p className="mt-2 text-sm opacity-70">Counts are derived from the dataset.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <MetricCard value={metrics.people} label="People documented" />
              <MetricCard value={metrics.places} label="Places reconstructed" />
              <MetricCard value={metrics.sources} label="Archival sources" />
              <MetricCard value={metrics.relationships} label="Relationships" />
              <MetricCard value={metrics.mentions} label="Archival mentions" />
              <MetricCard value={metrics.mappablePlaces} label="Georeferenced places" />
              <MetricCard value={metrics.openResearchQuestions} label="Open research questions" />
              <MetricCard value={metrics.pendingMatches} label="Pending identity matches" />
            </div>
          </div>
        </section>

        <section id="map" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 md:px-12" aria-labelledby="map-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Map</p>
          <h2 id="map-heading" className="mt-3 text-3xl font-medium">
            Spatial reconstruction
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
            Historical sites are withheld from the map until their locations are georeferenced and
            reviewed. Exact and approximate locations are shown with different marker styles.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="min-w-0">
              {metrics.mappablePlaces > 0 ? (
                <>
                  <ReconstructionMapShell
                    places={places}
                    relationships={relationships}
                    sources={sources}
                    locationEvidence={locationEvidence}
                  />
                  <p className="mt-3 text-sm opacity-75" role="status">
                    Map currently contains {metrics.exactPlaces} exact and {metrics.approximatePlaces}{" "}
                    approximate historical locations.
                  </p>
                </>
              ) : (
                <div className="flex h-[540px] flex-col items-center justify-center border border-black/15 bg-[#d8d0bf] p-8 text-center">
                  <p className="max-w-sm text-sm leading-6 opacity-70" role="status">
                    No locations in this project have enough reviewed spatial evidence to map yet.
                  </p>
                </div>
              )}
            </div>
            <GeoreferenceStatus places={places} openResearchCount={metrics.openGeoreferenceTasks} />
          </div>
        </section>

        <section id="archive" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 md:px-12" aria-labelledby="archive-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Archive</p>
          <h2 id="archive-heading" className="mt-3 text-3xl font-medium">
            Search the reconstructed records
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
            Each record keeps its provenance, verification state, and relationships. Filter by
            verification state, archival mentions, or open research questions.
          </p>
          <div className="mt-8">
            {people.length > 0 ? (
              <ArchiveExplorer
                projectSlug={slug}
                people={people}
                places={places}
                relationships={relationships}
                sources={sources}
                mentions={mentions}
                researchQueue={researchQueue}
              />
            ) : (
              <p className="border border-black/15 bg-white/25 p-6 text-sm opacity-70">
                This project does not yet have any canonical person records. See the sources and
                research queue below for what is currently supported.
              </p>
            )}
          </div>
        </section>

        <section
          id="sources"
          className="border-t border-black/10 bg-[#ebe5da] px-6 py-16 md:px-12 scroll-mt-8"
          aria-labelledby="sources-heading"
        >
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Sources</p>
            <h2 id="sources-heading" className="mt-3 text-3xl font-medium">
              Provenance summary
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
              Records link to the archival sources that support them. The reconstruction draws on{" "}
              {metrics.sources} sources. Arkive records each source and links to the original archive
              where one exists.
            </p>
            <div className="mt-8">
              <ProvenanceList projectSlug={slug} sources={sources} />
            </div>
            <p className="mt-6 text-sm opacity-75">
              {georeferenceQueue.length} georeference tasks and {researchQueue.length} research items
              are tracked openly. See the{" "}
              <a href={`/projects/${slug}/review`} className="underline underline-offset-4">
                entity resolution queue
              </a>{" "}
              and the{" "}
              <a href="/about" className="underline underline-offset-4">
                methodology
              </a>
              .
            </p>
          </div>
        </section>

        <section id="dataset" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 md:px-12" aria-labelledby="dataset-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Dataset</p>
          <h2 id="dataset-heading" className="mt-3 text-3xl font-medium">
            Download the data
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
            {metrics.people} people, {metrics.places} places, {metrics.relationships} relationships,{" "}
            {metrics.sources} sources, and {metrics.mentions} archival mentions, with source IDs
            preserved.
          </p>
          <div className="mt-8">
            <DatasetLinks projectSlug={slug} />
          </div>
          <p className="mt-6 text-sm opacity-75">
            The machine-readable project summary is available at{" "}
            <a href={`/api/projects/${slug}`} className="underline underline-offset-4">
              /api/projects/{slug}
            </a>
            .
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
          <div className="flex flex-wrap gap-4 border-t border-black/10 pt-10 text-sm">
            <a href="/about" className="bg-black px-5 py-3 text-white hover:opacity-80">
              Read the methodology
            </a>
            <a href="/feedback" className="border border-black/20 px-5 py-3 hover:bg-black hover:text-white">
              Report a correction
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
