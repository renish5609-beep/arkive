import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatVerification,
  getEntityName,
  getPersonById,
  getRelationshipsForEntity,
  getSourcesForIds,
} from "@/lib/quakertown";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonById(id);

  if (!person) notFound();

  const linkedSources = getSourcesForIds(person.source_ids);
  const linkedRelationships = getRelationshipsForEntity(person.id);

  const years =
    person.birth_year !== null || person.death_year !== null
      ? `${person.birth_year ?? "?"}-${person.death_year ?? "?"}`
      : "Dates unknown";

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          ARKIVE
        </Link>
        <Link href="/#records" className="text-sm underline underline-offset-4">
          Back to archive
        </Link>
      </nav>

      <article className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-45">
            Reconstructed person record
          </div>
          <span className="border border-black/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] opacity-60">
            {formatVerification(person.verification_status)}
          </span>
        </div>

        <h1 className="mt-6 text-5xl font-medium tracking-[-0.04em] md:text-7xl">
          {person.name}
        </h1>

        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm opacity-60">
          <span>{years}</span>
          <span>{person.occupation ?? "Occupation unknown"}</span>
          {person.aliases.length > 0 && (
            <span>Also recorded as {person.aliases.join(", ")}</span>
          )}
        </div>

        <p className="mt-10 max-w-3xl text-lg leading-8 opacity-75">
          {person.notes}
        </p>

        <section className="mt-16 border-t border-black/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">
            Evidence
          </p>
          <h2 className="mt-3 text-3xl font-medium">Linked sources</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {linkedSources.map((source) => (
              <Link
                key={source.id}
                href={`/sources/${source.id}`}
                className="border border-black/15 bg-white/25 p-5 transition hover:bg-white/55"
              >
                <div className="text-[10px] uppercase tracking-[0.14em] opacity-45">
                  {source.source_type.replaceAll("_", " ")}
                </div>
                <div className="mt-2 font-medium">{source.title}</div>
                {source.archive && (
                  <div className="mt-2 text-sm opacity-55">{source.archive}</div>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-black/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">
            Network
          </p>
          <h2 className="mt-3 text-3xl font-medium">Relationships</h2>

          <div className="mt-8 space-y-4">
            {linkedRelationships.length > 0 ? (
              linkedRelationships.map((relationship) => {
                const otherEntity =
                  relationship.from_entity_id === person.id
                    ? relationship.to_entity_id
                    : relationship.from_entity_id;

                return (
                  <div
                    key={relationship.id}
                    className="border border-black/15 bg-white/20 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
                          {relationship.relationship_type.replaceAll("_", " ")}
                        </div>
                        <div className="mt-2 text-xl font-medium">
                          {getEntityName(otherEntity)}
                        </div>
                      </div>
                      <span className="text-xs opacity-45">
                        {formatVerification(
                          relationship.verification_status
                        )}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 opacity-70">
                      {relationship.notes}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm opacity-50">
                No relationships have been linked to this record yet.
              </p>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
