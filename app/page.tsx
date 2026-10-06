import Link from "next/link";
import ArchiveExplorer from "@/components/archive-explorer";
import ReconstructionMapShell from "@/components/reconstruction-map-shell";
import {
  georeferenceQueue,
  locationEvidence,
  matchCandidates,
  mentions,
  people,
  places,
  relationships,
  researchQueue,
  sources,
} from "@/lib/quakertown";
import { validateQuakertownData } from "@/lib/validate-quakertown";

export default function Home() {
  const dataHealth = validateQuakertownData();

  const sourceTypeCount = new Set(
    sources.map((source) => source.source_type)
  ).size;

  const exactCount = places.filter(
    (place) => place.georeference_status === "exact"
  ).length;
  const approximateCount = places.filter(
    (place) => place.georeference_status === "approximate"
  ).length;
  const unresolvedPlaces = places.filter(
    (place) => place.georeference_status === "unresolved"
  );
  const openResearchCount = georeferenceQueue.filter(
    (item) => item.status === "open"
  ).length;

  const priorityByPlace = new Map(
    georeferenceQueue.map((item) => [item.place_id, item.priority] as const)
  );

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          ARKIVE
        </Link>

        <div className="hidden gap-8 text-sm md:flex">
          <a href="#project" className="hover:opacity-60">
            Reconstruction
          </a>
          <a href="#records" className="hover:opacity-60">
            Archive
          </a>
          <a href="#provenance" className="hover:opacity-60">
            Sources
          </a>
          <Link href="/review" className="hover:opacity-60">
            Review
          </Link>
          <a href="#method" className="hover:opacity-60">
            Methodology
          </a>
        </div>

        <a
          href="https://github.com/renish5609-beep/arkive"
          target="_blank"
          rel="noreferrer"
          className="text-sm underline underline-offset-4"
        >
          Open source
        </a>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-12 md:pt-24">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
            Computational Public History
          </p>

          <span className="border border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
            Source traceable
          </span>
        </div>

        <h1 className="max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl">
          Reconstructing communities from fragmented historical records.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 opacity-70 md:text-xl">
          Arkive connects maps, oral histories, census records, photographs,
          directories, and archival documents into structured historical
          reconstructions where every claim can be traced back to evidence.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#project"
            className="bg-black px-6 py-3 text-sm text-white transition hover:opacity-80"
          >
            Explore first reconstruction
          </a>

          <a
            href="#records"
            className="border border-black/20 px-6 py-3 text-sm transition hover:bg-black hover:text-white"
          >
            Search the archive
          </a>
        </div>
      </section>

      <section
        id="project"
        className="border-y border-black/10 bg-[#e7e0d3] px-6 py-20 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
                Project 001
              </p>

              <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
                Quakertown Reconstructed
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 opacity-70">
                A source-traceable reconstruction of Denton&apos;s historic
                Quakertown community, connecting residents, homes,
                relationships, archival evidence, and displacement over time.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-black/10 pt-6">
                <div>
                  <div className="text-3xl font-medium">{people.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                    People
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-medium">{places.length}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                    Places
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-medium">
                    {relationships.length}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                    Relationships
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-medium">{sourceTypeCount}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                    Source types
                  </div>
                </div>
              </div>

              <div className="mt-8 border border-black/10 bg-[#f4f0e7]/45 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
                  Georeferencing status
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <div className="text-2xl font-medium">{exactCount}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-50">
                      Exact
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium">{approximateCount}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-50">
                      Approximate
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium">
                      {unresolvedPlaces.length}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-50">
                      Unresolved
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-medium">{openResearchCount}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-50">
                      Research queue
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 opacity-65">
                  Historical locations remain unresolved until the evidence
                  supports a defensible placement.
                </p>
              </div>
            </div>

            <div>
              <ReconstructionMapShell
                places={places}
                relationships={relationships}
                sources={sources}
                locationEvidence={locationEvidence}
              />
              <div className="mt-4 flex flex-wrap justify-between gap-3 text-xs opacity-50">
                <span>Live OpenStreetMap base layer</span>
                <span>Exact and approximate locations only; unresolved sites are not drawn</span>
              </div>

              <div className="mt-6 border border-black/10 bg-[#f4f0e7]/45 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
                  Awaiting georeference
                </div>
                {unresolvedPlaces.length > 0 ? (
                  <ul className="mt-4 divide-y divide-black/10">
                    {unresolvedPlaces.map((place) => {
                      const priority = priorityByPlace.get(place.id);

                      return (
                        <li
                          key={place.id}
                          className="flex items-start justify-between gap-4 py-3 text-sm"
                        >
                          <span>{place.name}</span>
                          {priority && (
                            <span className="shrink-0 border border-black/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] opacity-60">
                              {priority} priority
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm opacity-60">
                    Every recorded place has a georeferenced location.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="records" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Reconstructed Records
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight">
            Search the people behind the archive
          </h2>
          <p className="mt-4 max-w-2xl leading-7 opacity-60">
            Search reconstructed records while retaining their provenance,
            verification state, and historical relationships.
          </p>
        </div>

        <ArchiveExplorer
          people={people}
          places={places}
          relationships={relationships}
          sources={sources}
          mentions={mentions}
          researchQueue={researchQueue}
        />
      </section>

      <section
        id="provenance"
        className="border-t border-black/10 bg-[#ebe5da] px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Provenance
          </p>

          <h2 className="mt-3 text-4xl font-medium tracking-tight">
            Evidence, not generated history.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 opacity-65">
            Arkive distinguishes archival evidence, human-reviewed connections,
            and uncertain suggestions. Historical claims remain connected to
            their underlying sources.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {sources.map((source) => (
              <article
                key={source.id}
                className="border border-black/15 bg-white/25 p-6"
              >
                <div className="text-xs uppercase tracking-[0.14em] opacity-40">
                  {source.source_type.replaceAll("_", " ")}
                </div>
                <h3 className="mt-3 text-xl font-medium">{source.title}</h3>
                {source.archive && (
                  <p className="mt-2 text-sm opacity-55">{source.archive}</p>
                )}
                <p className="mt-5 text-sm leading-7 opacity-70">
                  {source.notes}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <Link
                    href={`/sources/${source.id}`}
                    className="font-medium underline underline-offset-4"
                  >
                    View provenance record
                  </Link>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4 opacity-60"
                    >
                      Original source
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 px-6 py-16 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
              Data Health
            </p>
            <span className="border border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">
              {dataHealth.valid ? "Valid" : "Issues detected"}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-black/10 pt-6 md:grid-cols-5">
            <div>
              <div className="text-2xl font-medium">{dataHealth.stats.people}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                People
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">{dataHealth.stats.places}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Places
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">{dataHealth.stats.sources}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Sources
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">
                {dataHealth.stats.relationships}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Relationships
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">
                {dataHealth.errors.length}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Errors
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">
                {dataHealth.warnings.length}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Warnings
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">
                {dataHealth.stats.locationEvidence}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Location evidence
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">
                {dataHealth.stats.mappablePlaces}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Mappable places
              </div>
            </div>
            <div>
              <div className="text-2xl font-medium">{openResearchCount}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                Open georeference tasks
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-black/10 pt-6 md:grid-cols-3">
            <div className="text-2xl font-medium">{mentions.length}</div>
            <div className="text-xs uppercase tracking-wide opacity-50">Archival mentions</div>
            <div className="text-2xl font-medium">
              {matchCandidates.filter((c) => c.review_status === "pending").length}
            </div>
            <div className="text-xs uppercase tracking-wide opacity-50">Pending matches</div>
            <div className="text-2xl font-medium">
              {researchQueue.filter((item) => item.status !== "resolved").length}
            </div>
            <div className="text-xs uppercase tracking-wide opacity-50">Open research questions</div>
          </div>

          <div className="mt-10 border border-black/10 bg-[#f4f0e7]/45 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
              Dataset
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 opacity-65">
              Exports keep source IDs and verification metadata, so downstream users can
              trace where each claim came from. Match scores are heuristics, not verification.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <a href="/api/export/quakertown?format=json" className="underline underline-offset-4">JSON (full dataset)</a>
              <a href="/api/export/quakertown?format=csv&entity=people" className="underline underline-offset-4">CSV people</a>
              <a href="/api/export/quakertown?format=csv&entity=places" className="underline underline-offset-4">CSV places</a>
              <a href="/api/export/quakertown?format=csv&entity=relationships" className="underline underline-offset-4">CSV relationships</a>
              <a href="/api/export/quakertown?format=csv&entity=mentions" className="underline underline-offset-4">CSV mentions</a>
              <a href="/api/export/quakertown?format=csv&entity=sources" className="underline underline-offset-4">CSV sources</a>
            </div>
          </div>

          {dataHealth.errors.length > 0 && (
            <div className="mt-8 border border-black/15 bg-white/25 p-5 font-mono text-xs leading-6">
              <div className="mb-2 font-semibold uppercase tracking-[0.14em] opacity-60">
                Developer detail
              </div>
              <ul className="space-y-1">
                {dataHealth.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section
        id="method"
        className="border-t border-black/10 bg-[#181815] px-6 py-24 text-[#f4f0e7] md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Methodology
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            From archival fragments to verified historical data.
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              [
                "01",
                "Ingest",
                "Collect oral histories, maps, directories, records, photographs, and archival documents.",
              ],
              [
                "02",
                "Resolve",
                "Identify people, places, names, dates, addresses, and possible record matches.",
              ],
              [
                "03",
                "Verify",
                "Preserve source provenance and separate reviewed evidence from uncertain suggestions.",
              ],
              [
                "04",
                "Reconstruct",
                "Connect verified records into maps, timelines, relationships, and reusable historical datasets.",
              ],
            ].map(([number, title, body]) => (
              <div key={number} className="border-t border-white/20 pt-5">
                <div className="text-xs opacity-40">{number}</div>
                <h3 className="mt-5 text-xl font-medium">{title}</h3>
                <p className="mt-3 leading-7 opacity-60">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
