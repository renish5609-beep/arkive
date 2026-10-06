import Link from "next/link";
import { notFound } from "next/navigation";
import { people, places, relationships, getSourceById } from "@/lib/quakertown";

export default async function SourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const source = getSourceById(id);

  if (!source) notFound();

  const linkedPeople = people.filter((person) =>
    person.source_ids.includes(source.id)
  );
  const linkedPlaces = places.filter((place) =>
    place.source_ids.includes(source.id)
  );
  const linkedRelationships = relationships.filter((relationship) =>
    relationship.source_ids.includes(source.id)
  );

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          ARKIVE
        </Link>
        <Link href="/#provenance" className="text-sm underline underline-offset-4">
          Back to sources
        </Link>
      </nav>

      <article className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-45">
          {source.source_type.replaceAll("_", " ")}
        </div>

        <h1 className="mt-5 text-4xl font-medium tracking-[-0.03em] md:text-6xl">
          {source.title}
        </h1>

        <div className="mt-6 grid gap-3 text-sm opacity-65 md:grid-cols-2">
          {source.creator && <div>Creator: {source.creator}</div>}
          {source.date && <div>Date: {source.date}</div>}
          {source.archive && <div>Archive: {source.archive}</div>}
          {source.rights && <div>Rights: {source.rights}</div>}
          {source.accessed_date && (
            <div>Accessed: {source.accessed_date}</div>
          )}
        </div>

        {source.citation && (
          <section className="mt-10 border-l-2 border-black/20 pl-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
              Citation
            </div>
            <p className="mt-2 leading-7 opacity-75">{source.citation}</p>
          </section>
        )}

        <p className="mt-10 max-w-3xl text-lg leading-8 opacity-75">
          {source.notes}
        </p>

        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block bg-black px-5 py-3 text-sm text-white transition hover:opacity-80"
          >
            Open original archival source
          </a>
        )}

        <section className="mt-16 border-t border-black/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">
            Provenance graph
          </p>
          <h2 className="mt-3 text-3xl font-medium">
            Records supported by this source
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-black/15 p-5">
              <div className="text-3xl font-medium">{linkedPeople.length}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">
                People
              </div>
            </div>
            <div className="border border-black/15 p-5">
              <div className="text-3xl font-medium">{linkedPlaces.length}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">
                Places
              </div>
            </div>
            <div className="border border-black/15 p-5">
              <div className="text-3xl font-medium">
                {linkedRelationships.length}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">
                Relationships
              </div>
            </div>
          </div>

          {linkedPeople.length > 0 && (
            <div className="mt-10">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
                People
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {linkedPeople.map((person) => (
                  <Link
                    key={person.id}
                    href={`/records/${person.id}`}
                    className="border border-black/15 px-3 py-2 text-sm hover:bg-black hover:text-white"
                  >
                    {person.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
