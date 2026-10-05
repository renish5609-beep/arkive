import { people, places, relationships, sources } from "@/lib/quakertown";

function formatVerification(status: string) {
  return status.replaceAll("_", " ");
}

function getPersonRelationships(personId: string) {
  return relationships.filter(
    (relationship) => relationship.from_entity_id === personId
  );
}

function getEntityName(entityId: string) {
  const person = people.find((item) => item.id === entityId);
  if (person) return person.name;

  const place = places.find((item) => item.id === entityId);
  if (place) return place.name;

  return entityId;
}

export default function Home() {
  const sourceTypeCount = new Set(
    sources.map((source) => source.source_type)
  ).size;

  const linkedRelationshipCount = relationships.length;

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <div className="text-xl font-semibold tracking-tight">ARKIVE</div>

        <div className="hidden gap-8 text-sm md:flex">
          <a href="#project" className="hover:opacity-60">
            Reconstruction
          </a>
          <a href="#records" className="hover:opacity-60">
            Archive
          </a>
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
            href="#method"
            className="border border-black/20 px-6 py-3 text-sm transition hover:bg-black hover:text-white"
          >
            View methodology
          </a>
        </div>
      </section>

      <section
        id="project"
        className="border-y border-black/10 bg-[#e7e0d3] px-6 py-20 md:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.25fr]">
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

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-black/10 pt-6 md:grid-cols-4">
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
                  {linkedRelationshipCount}
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
          </div>

          <div className="flex min-h-[430px] items-center justify-center border border-black/15 bg-[#d6cebd] p-10">
            <div className="max-w-lg text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-40">
                Spatial reconstruction
              </div>

              <div className="mt-4 text-3xl font-medium">
                Historical map layer coming next
              </div>

              <p className="mx-auto mt-4 max-w-md leading-7 opacity-60">
                Homes, schools, relocation paths, and historical sites will be
                placed into a spatial reconstruction linked directly to source
                evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="records" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Reconstructed Records
          </p>

          <h2 className="mt-3 text-4xl font-medium tracking-tight">
            People behind the archive
          </h2>

          <p className="mt-4 max-w-2xl leading-7 opacity-60">
            Each record is connected to source material, verification status,
            places, and historical relationships rather than presented as an
            isolated biography.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {people.map((person) => {
            const personSources = sources.filter((source) =>
              person.source_ids.includes(source.id)
            );

            const personRelationships = getPersonRelationships(person.id);

            const years =
              person.birth_year !== null || person.death_year !== null
                ? `${person.birth_year ?? "?"}–${person.death_year ?? "?"}`
                : "Dates unknown";

            return (
              <article
                key={person.id}
                className="border border-black/15 bg-white/30 p-7"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide opacity-40">
                      {years}
                    </div>

                    <h3 className="mt-3 text-2xl font-medium">{person.name}</h3>

                    <p className="mt-2 opacity-60">
                      {person.occupation ?? "Historical record"}
                    </p>
                  </div>

                  <span className="border border-black/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">
                    {formatVerification(person.verification_status)}
                  </span>
                </div>

                <p className="mt-6 text-sm leading-7 opacity-70">
                  {person.notes}
                </p>

                <div className="mt-7 grid gap-6 border-t border-black/10 pt-6 md:grid-cols-2">
                  <div>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-40">
                      Evidence
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {personSources.length > 0 ? (
                        personSources.map((source) => (
                          <a
                            key={source.id}
                            href={source.url ?? "#"}
                            target={source.url ? "_blank" : undefined}
                            rel={source.url ? "noreferrer" : undefined}
                            className="border border-black/10 px-2 py-1 text-xs transition hover:bg-black hover:text-white"
                          >
                            {source.source_type.replaceAll("_", " ")}
                          </a>
                        ))
                      ) : (
                        <span className="text-xs opacity-40">
                          No linked sources yet
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-xs opacity-40">
                      {personSources.length} linked source
                      {personSources.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-40">
                      Relationships
                    </div>

                    {personRelationships.length > 0 ? (
                      <div className="space-y-2">
                        {personRelationships.map((relationship) => (
                          <div
                            key={relationship.id}
                            className="border-l border-black/20 pl-3 text-sm"
                          >
                            <div className="font-medium">
                              {relationship.relationship_type.replaceAll(
                                "_",
                                " "
                              )}
                            </div>

                            <div className="mt-1 opacity-60">
                              {getEntityName(relationship.to_entity_id)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs opacity-40">
                        No linked relationships yet
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#ebe5da] px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
            Provenance
          </p>

          <h2 className="mt-3 text-4xl font-medium tracking-tight">
            Evidence, not generated history.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 opacity-65">
            Arkive distinguishes between archival evidence, human-reviewed
            connections, and unverified machine suggestions. Historical claims
            remain tied to their underlying sources.
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

                {source.notes && (
                  <p className="mt-5 text-sm leading-7 opacity-70">
                    {source.notes}
                  </p>
                )}

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-block text-sm underline underline-offset-4"
                  >
                    View original source
                  </a>
                )}
              </article>
            ))}
          </div>
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