import { people, sources } from "@/lib/quakertown";

export default function Home() {
  const sourceTypeCount = new Set(
    sources.map((source) => source.source_type)
  ).size;

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <div className="text-xl font-semibold tracking-tight">ARKIVE</div>

        <div className="hidden gap-8 text-sm md:flex">
          <a href="#project" className="hover:opacity-60">
            Project
          </a>
          <a href="#records" className="hover:opacity-60">
            Records
          </a>
          <a href="#method" className="hover:opacity-60">
            Method
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

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:px-12 md:pt-28">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] opacity-60">
          Computational Public History
        </p>

        <h1 className="max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-8xl">
          Reconstructing communities from fragmented historical records.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 opacity-70 md:text-xl">
          Arkive connects maps, oral histories, census records, photographs,
          directories, and archival documents into verified historical
          reconstructions.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#project"
            className="bg-black px-6 py-3 text-sm text-white transition hover:opacity-80"
          >
            Explore first project
          </a>

          <a
            href="#method"
            className="border border-black/20 px-6 py-3 text-sm transition hover:bg-black hover:text-white"
          >
            How Arkive works
          </a>
        </div>
      </section>

      <section
        id="project"
        className="border-y border-black/10 bg-[#e7e0d3] px-6 py-20 md:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
              Project 001
            </p>

            <h2 className="text-4xl font-medium tracking-tight md:text-6xl">
              Quakertown Reconstructed
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 opacity-70">
              A source-traceable reconstruction of Denton&apos;s historic
              Quakertown community, connecting residents, homes, relationships,
              archival evidence, and displacement over time.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-black/10 pt-6">
              <div>
                <div className="text-3xl font-medium">{people.length}</div>
                <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                  Records
                </div>
              </div>

              <div>
                <div className="text-3xl font-medium">{sourceTypeCount}</div>
                <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                  Source types
                </div>
              </div>

              <div>
                <div className="text-3xl font-medium">1920s</div>
                <div className="mt-1 text-xs uppercase tracking-wide opacity-50">
                  Focus period
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-[430px] items-center justify-center border border-black/15 bg-[#d6cebd] p-10">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-40">
                Historical reconstruction
              </div>

              <div className="mt-4 text-3xl font-medium">
                Interactive map coming next
              </div>

              <p className="mx-auto mt-4 max-w-md leading-7 opacity-60">
                Residents, historical addresses, relocation patterns, and
                archival evidence will be connected spatially here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="records" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
              Reconstructed Records
            </p>

            <h2 className="mt-3 text-4xl font-medium tracking-tight">
              People behind the archive
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {people.map((person) => {
            const personSources = sources.filter((source) =>
              person.source_ids.includes(source.id)
            );

            const years =
              person.birth_year !== null || person.death_year !== null
                ? `${person.birth_year ?? "?"}–${person.death_year ?? "?"}`
                : "Dates unknown";

            return (
              <article
                key={person.id}
                className="border border-black/15 bg-white/30 p-6 transition hover:-translate-y-1 hover:bg-white/60"
              >
                <div className="text-xs uppercase tracking-wide opacity-40">
                  {years}
                </div>

                <h3 className="mt-4 text-2xl font-medium">{person.name}</h3>

                <p className="mt-2 opacity-60">
                  {person.occupation ?? "Historical record"}
                </p>

                <div className="mt-8 border-t border-black/10 pt-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-40">
                    Evidence
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {personSources.length > 0 ? (
                      personSources.map((source) => (
                        <span
                          key={source.id}
                          className="border border-black/10 px-2 py-1 text-xs"
                        >
                          {source.source_type.replaceAll("_", " ")}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs opacity-40">
                        No linked sources yet
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="method"
        className="border-t border-black/10 bg-[#181815] px-6 py-24 text-[#f4f0e7] md:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Method
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            From archival fragments to verified historical data.
          </h2>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              ["01", "Ingest", "Collect records from archives and primary sources."],
              [
                "02",
                "Connect",
                "Resolve people, places, dates, addresses, and relationships.",
              ],
              [
                "03",
                "Verify",
                "Preserve provenance and require human review of uncertain links.",
              ],
              [
                "04",
                "Reconstruct",
                "Turn evidence into explorable maps, timelines, and datasets.",
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