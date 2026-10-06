import type { Metadata } from "next";
import ArchiveExplorer from "@/components/archive-explorer";
import DatasetLinks from "@/components/dataset-links";
import GeoreferenceStatus from "@/components/georeference-status";
import ProvenanceList from "@/components/provenance-list";
import ReconstructionMapShell from "@/components/reconstruction-map-shell";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  georeferenceQueue,
  locationEvidence,
  mentions,
  people,
  places,
  relationships,
  researchQueue,
  sources,
} from "@/lib/quakertown";
import { getProjectMetrics } from "@/lib/project-metrics";
import impact from "@/data/project-impact.json";
import externalReviews from "@/data/external-reviews.json";

export const metadata: Metadata = {
  title: "Quakertown Reconstructed",
  description:
    "A source-traceable reconstruction of Denton, Texas's historic Black Quakertown community. Explore people, places, relationships, archival sources, and open research questions.",
  openGraph: {
    title: "Quakertown Reconstructed | Arkive",
    description: "A source-traceable reconstruction of Denton, Texas historic Black Quakertown community, with archival sources, a map of georeferenced places, and open research questions.",
  },
};

function MetricCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="border border-black/15 p-5">
      <div className="text-3xl font-medium">{value}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-60">{label}</div>
    </div>
  );
}

export default function QuakertownProjectPage() {
  const metrics = getProjectMetrics();

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 md:px-12 md:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Project 001</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-medium leading-[1] tracking-[-0.04em] md:text-7xl">
            Quakertown Reconstructed
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 opacity-80">
            Quakertown was a Black community in Denton, Texas. Its residents were displaced
            during the 1920s, and some houses were physically moved. This reconstruction
            connects people, homes, schools, and relationships to the archival sources that
            document them, and it shows where the evidence is still incomplete.
          </p>

          <div className="mt-10 border-l-2 border-black/25 pl-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
              Current scope
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 opacity-80">
              This is an early reconstruction. It currently holds {metrics.people} people,{" "}
              {metrics.places} place records, {metrics.sources} archival sources, and{" "}
              {metrics.relationships} relationships. Most sources are short descriptions, and
              transcripts have not yet been read in full. Coverage is deliberately limited to
              what the sources support.
            </p>
          </div>
        </section>

        <section className="border-y border-black/10 bg-[#e7e0d3] px-6 py-16 md:px-12" aria-labelledby="impact-heading">
          <div className="mx-auto max-w-7xl">
            <h2 id="impact-heading" className="text-2xl font-medium">Project status</h2>
            <p className="mt-2 text-sm opacity-70">
              Counts are derived from the dataset. External activity is recorded only when it has
              actually happened.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <MetricCard value={metrics.people} label="People reconstructed" />
              <MetricCard value={metrics.places} label="Places reconstructed" />
              <MetricCard value={metrics.sources} label="Archival sources" />
              <MetricCard value={metrics.relationships} label="Relationships" />
              <MetricCard value={metrics.mentions} label="Archival mentions" />
              <MetricCard value={metrics.mappablePlaces} label="Georeferenced places" />
              <MetricCard value={metrics.openResearchQuestions} label="Open research questions" />
              <MetricCard value={metrics.pendingMatches} label="Pending identity matches" />
            </div>
            <dl className="mt-8 grid gap-2 border-t border-black/10 pt-6 text-sm md:grid-cols-2">
              <div className="flex justify-between gap-4"><dt className="opacity-70">External reviews</dt><dd>{externalReviews.length}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-70">Educators contacted</dt><dd>{impact.educators_contacted}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-70">Classrooms using Arkive</dt><dd>{impact.classrooms_using}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-70">Community contributors</dt><dd>{impact.community_contributors}</dd></div>
              <div className="flex justify-between gap-4"><dt className="opacity-70">Presentations</dt><dd>{impact.presentations}</dd></div>
            </dl>
          </div>
        </section>

        <section id="map" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 md:px-12" aria-labelledby="map-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Map</p>
          <h2 id="map-heading" className="mt-3 text-3xl font-medium">Spatial reconstruction</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
            Historical sites are withheld from the map until their locations are georeferenced
            and reviewed. Exact and approximate locations are shown with different marker styles.
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="min-w-0">
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
            </div>
            <GeoreferenceStatus places={places} openResearchCount={metrics.openGeoreferenceTasks} />
          </div>
        </section>

        <section id="archive" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 md:px-12" aria-labelledby="archive-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Archive</p>
          <h2 id="archive-heading" className="mt-3 text-3xl font-medium">Search the reconstructed records</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
            Each record keeps its provenance, verification state, and relationships. Filter by
            verification state, archival mentions, or open research questions.
          </p>
          <div className="mt-8">
            <ArchiveExplorer
              people={people}
              places={places}
              relationships={relationships}
              sources={sources}
              mentions={mentions}
              researchQueue={researchQueue}
            />
          </div>
        </section>

        <section id="sources" className="border-t border-black/10 bg-[#ebe5da] px-6 py-16 md:px-12 scroll-mt-8" aria-labelledby="sources-heading">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Sources</p>
            <h2 id="sources-heading" className="mt-3 text-3xl font-medium">Provenance summary</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
              Records link to the archival sources that support them. The reconstruction draws on {metrics.sources} sources.
              Arkive records each source and links to the original archive where one exists.
            </p>
            <div className="mt-8">
              <ProvenanceList sources={sources} />
            </div>
            <p className="mt-6 text-sm opacity-75">
              {georeferenceQueue.length} georeference tasks and {researchQueue.length} research
              items are tracked openly. See the{" "}
              <a href="/review" className="underline underline-offset-4">entity resolution queue</a>{" "}
              and the{" "}
              <a href="/about" className="underline underline-offset-4">methodology</a>.
            </p>
          </div>
        </section>

        <section id="dataset" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-16 md:px-12" aria-labelledby="dataset-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Dataset</p>
          <h2 id="dataset-heading" className="mt-3 text-3xl font-medium">Download the data</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 opacity-75">
            {metrics.people} people, {metrics.places} places, {metrics.relationships} relationships,{" "}
            {metrics.sources} sources, and {metrics.mentions} archival mentions, with source IDs
            preserved.
          </p>
          <div className="mt-8">
            <DatasetLinks />
          </div>
          <p className="mt-6 text-sm opacity-75">
            The machine-readable project summary is available at{" "}
            <a href="/api/projects/quakertown" className="underline underline-offset-4">/api/projects/quakertown</a>.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
          <div className="flex flex-wrap gap-4 border-t border-black/10 pt-10 text-sm">
            <a href="/about" className="bg-black px-5 py-3 text-white hover:opacity-80">Read the methodology</a>
            <a href="/feedback" className="border border-black/20 px-5 py-3 hover:bg-black hover:text-white">Report a correction</a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
