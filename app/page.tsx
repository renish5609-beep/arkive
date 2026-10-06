import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getProjectMetrics } from "@/lib/project-metrics";
import { validateQuakertownData } from "@/lib/validate-quakertown";

export default function Home() {
  const metrics = getProjectMetrics();
  const dataHealth = validateQuakertownData();

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-12 md:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
            Computational public history
          </p>
          <h1 className="mt-6 max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Reconstructing communities from fragmented historical records.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 opacity-80 md:text-xl">
            Arkive is an open-source computational public-history platform. It reconstructs
            communities from fragmented archival records while preserving the evidence,
            uncertainty, and source provenance behind every connection.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/projects/quakertown" className="bg-black px-6 py-3 text-sm text-white hover:opacity-80">
              Explore Quakertown Reconstructed
            </Link>
            <Link href="/about" className="border border-black/20 px-6 py-3 text-sm hover:bg-black hover:text-white">
              How Arkive works
            </Link>
          </div>
        </section>

        <section className="border-y border-black/10 bg-[#e7e0d3] px-6 py-16 md:px-12" aria-labelledby="three-ideas">
          <div className="mx-auto max-w-7xl">
            <h2 id="three-ideas" className="sr-only">Three ideas</h2>
            <div className="grid gap-10 md:grid-cols-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">What Arkive is</h3>
                <p className="mt-4 leading-7 opacity-80">
                  A research platform for building historical reconstructions from archival
                  records. Each person, place, and relationship is stored with its sources and
                  with how confident the evidence makes us.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">What Quakertown Reconstructed is</h3>
                <p className="mt-4 leading-7 opacity-80">
                  The first case study. It reconstructs Denton, Texas&apos;s historic Black
                  Quakertown community and the displacement of its residents during the 1920s,
                  using oral histories, government records, and archival photographs.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">Why provenance matters</h3>
                <p className="mt-4 leading-7 opacity-80">
                  A claim without a source cannot be checked. Arkive keeps the link from every
                  claim back to its evidence, and it shows where the evidence is incomplete rather
                  than filling gaps with guesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-12" aria-labelledby="project-summary">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Project 001</p>
          <h2 id="project-summary" className="mt-3 text-3xl font-medium">Quakertown Reconstructed</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-black/10 pt-6 md:grid-cols-4">
            <div>
              <div className="text-3xl font-medium">{metrics.people}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-60">People</div>
            </div>
            <div>
              <div className="text-3xl font-medium">{metrics.places}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-60">Places</div>
            </div>
            <div>
              <div className="text-3xl font-medium">{metrics.sources}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-60">Sources</div>
            </div>
            <div>
              <div className="text-3xl font-medium">{metrics.relationships}</div>
              <div className="mt-1 text-xs uppercase tracking-wide opacity-60">Relationships</div>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 opacity-75">
            Historical locations remain unresolved until the evidence supports a defensible
            placement. Currently {metrics.exactPlaces} place is exact, {metrics.approximatePlaces}{" "}
            approximate, and {metrics.unresolvedPlaces} unresolved.
          </p>
          <Link href="/projects/quakertown" className="mt-8 inline-block text-sm font-medium underline underline-offset-4">
            Open the Quakertown project
          </Link>
        </section>

        <section className="border-t border-black/10 px-6 py-16 md:px-12" aria-labelledby="data-health">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="data-health" className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
                Data health
              </h2>
              <span className="border border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">
                {dataHealth.valid ? "Valid" : "Issues detected"}
              </span>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-black/10 pt-6 md:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide opacity-60">Validation errors</dt>
                <dd className="mt-1 text-2xl font-medium">{dataHealth.errors.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide opacity-60">Warnings</dt>
                <dd className="mt-1 text-2xl font-medium">{dataHealth.warnings.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide opacity-60">Archival mentions</dt>
                <dd className="mt-1 text-2xl font-medium">{metrics.mentions}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide opacity-60">Pending identity matches</dt>
                <dd className="mt-1 text-2xl font-medium">{metrics.pendingMatches}</dd>
              </div>
            </dl>
            {dataHealth.errors.length > 0 && (
              <div className="mt-8 border border-black/15 bg-white/25 p-5 font-mono text-xs leading-6">
                <div className="mb-2 font-semibold uppercase tracking-[0.14em] opacity-60">Developer detail</div>
                <ul className="space-y-1">
                  {dataHealth.errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-black/10 bg-[#181815] px-6 py-16 text-[#f4f0e7] md:px-12" aria-labelledby="pipeline">
          <div className="mx-auto max-w-7xl">
            <h2 id="pipeline" className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
              Methodology in brief
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 opacity-85">
              Archival source, raw mention, structured evidence, possible identity match, human
              review, canonical record, then map, relationship graph, or export. Automated match
              scores only prioritize research. They never merge records on their own.
            </p>
            <Link href="/about" className="mt-8 inline-block text-sm font-medium underline underline-offset-4">
              Read the full methodology
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
