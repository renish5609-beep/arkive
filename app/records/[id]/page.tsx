import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatVerification,
  getEntityName,
  getGeoreferenceQueueItemForPlace,
  getLocationEvidenceForPlace,
  getMentionsForEntity,
  getOpenResearchItemsForEntity,
  getPersonById,
  getPlaceById,
  getRelationshipsForEntity,
  getSourceById,
  getSourcesForIds,
} from "@/lib/quakertown";
import type { HistoricalPlace } from "@/lib/types";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPersonById(id);

  if (!person) {
    const place = getPlaceById(id);
    if (!place) notFound();
    return <PlaceRecord place={place} />;
  }

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

        <ArchivalMentions entityId={person.id} />

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

function PlaceRecord({ place }: { place: HistoricalPlace }) {
  const linkedSources = getSourcesForIds(place.source_ids);
  const evidence = getLocationEvidenceForPlace(place.id);
  const queueItem = getGeoreferenceQueueItemForPlace(place.id);
  const hasCoordinates =
    typeof place.latitude === "number" && typeof place.longitude === "number";
  const radius = evidence.find((item) => item.radius_meters !== null)?.radius_meters;

  return (
    <main className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <Link href="/" className="text-xl font-semibold tracking-tight">ARKIVE</Link>
        <Link href="/#project" className="text-sm underline underline-offset-4">Back to reconstruction</Link>
      </nav>
      <article className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-45">Reconstructed place record</div>
          <span className="border border-black/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] opacity-60">{formatVerification(place.verification_status)}</span>
        </div>
        <h1 className="mt-6 text-5xl font-medium tracking-[-0.04em] md:text-7xl">{place.name}</h1>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm opacity-60">
          <span>{place.place_type.replaceAll("_", " ")}</span>
          <span>Georeference: {place.georeference_status}</span>
        </div>
        <p className="mt-10 max-w-3xl text-lg leading-8 opacity-75">{place.notes}</p>

        <section className="mt-16 border-t border-black/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">Spatial evidence</p>
          <h2 className="mt-3 text-3xl font-medium">Location provenance</h2>
          <dl className="mt-8 grid gap-x-8 gap-y-5 text-sm md:grid-cols-2">
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Georeference status</dt><dd className="mt-1 font-medium">{place.georeference_status}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Historical address</dt><dd className="mt-1">{place.historical_address ?? "Not recorded"}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Modern address</dt><dd className="mt-1">{place.modern_address ?? "Not recorded"}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Coordinates</dt><dd className="mt-1">{hasCoordinates ? `${place.latitude}, ${place.longitude}` : "Withheld until georeferenced"}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Evidence method</dt><dd className="mt-1">{evidence.length > 0 ? evidence.map((item) => item.method.replaceAll("_", " ")).join("; ") : "None recorded"}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Uncertainty radius</dt><dd className="mt-1">{radius ? `${radius} m` : "Not applicable"}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Review date</dt><dd className="mt-1">{evidence.find((item) => item.reviewed_date)?.reviewed_date ?? "Not yet reviewed"}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.14em] opacity-45">Research queue</dt><dd className="mt-1">{queueItem ? `${queueItem.status} (${queueItem.priority} priority)` : "No open task"}</dd></div>
          </dl>
          {evidence.map((item) => (<div key={item.id} className="mt-8 border-l-2 border-black/20 pl-5"><div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">Evidence text</div><p className="mt-2 leading-7 opacity-75">{item.evidence_text}</p><p className="mt-3 text-sm leading-6 opacity-60">{item.notes}</p></div>))}
          {queueItem && (<div className="mt-8 border border-black/15 p-5"><div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">Research question</div><p className="mt-2 leading-7">{queueItem.research_question}</p></div>)}
        </section>

        <ArchivalMentions entityId={place.id} />

        <section className="mt-16 border-t border-black/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">Evidence</p>
          <h2 className="mt-3 text-3xl font-medium">Linked sources</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {linkedSources.map((source) => (<Link key={source.id} href={`/sources/${source.id}`} className="border border-black/15 bg-white/25 p-5 transition hover:bg-white/55"><div className="text-[10px] uppercase tracking-[0.14em] opacity-45">{source.source_type.replaceAll("_", " ")}</div><div className="mt-2 font-medium">{source.title}</div></Link>))}
          </div>
        </section>
      </article>
    </main>
  );
}

function ArchivalMentions({ entityId }: { entityId: string }) {
  const linkedMentions = getMentionsForEntity(entityId);
  const openItems = getOpenResearchItemsForEntity(entityId);

  return (
    <section className="mt-16 border-t border-black/10 pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">
        Archival mentions
      </p>
      <h2 className="mt-3 text-3xl font-medium">Source mentions</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 opacity-60">
        A mention is a raw occurrence in a source. It becomes part of this record
        only through the linked-entity field, which is set after review.
      </p>

      {linkedMentions.length > 0 ? (
        <div className="mt-8 space-y-4">
          {linkedMentions.map((mention) => {
            const source = getSourceById(mention.source_id);

            return (
              <div key={mention.id} className="border border-black/15 bg-white/20 p-5 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="font-medium">{mention.raw_name ?? "Unnamed mention"}</div>
                  <span className="border border-black/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] opacity-60">
                    {formatVerification(mention.verification_status)}
                  </span>
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-2 md:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] opacity-45">Source</dt>
                    <dd>
                      {source ? (
                        <Link href={`/sources/${source.id}`} className="underline underline-offset-4">
                          {source.title}
                        </Link>
                      ) : (
                        mention.source_id
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] opacity-45">Date</dt>
                    <dd>{mention.date_text ?? "Not recorded"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] opacity-45">Address</dt>
                    <dd>{mention.address_text ?? "Not recorded"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] opacity-45">Occupation</dt>
                    <dd>{mention.occupation_text ?? "Not recorded"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] opacity-45">Relationship text</dt>
                    <dd>{mention.relationship_text ?? "Not recorded"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] opacity-45">Locator</dt>
                    <dd>{mention.page_or_locator ?? "Not recorded"}</dd>
                  </div>
                </dl>
                {mention.notes && <p className="mt-4 leading-6 opacity-65">{mention.notes}</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-8 text-sm opacity-50">No archival mentions are linked to this record yet.</p>
      )}

      <div className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
          Open research questions
        </div>
        {openItems.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {openItems.map((item) => (
              <li key={item.id} className="border-l-2 border-black/20 pl-4 text-sm leading-6">
                <span className="text-[10px] uppercase tracking-[0.14em] opacity-50">
                  {item.priority} priority · {item.status}
                </span>
                <div className="mt-1">{item.question}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm opacity-50">No open research questions for this record.</p>
        )}
      </div>
    </section>
  );
}
