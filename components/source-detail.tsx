import Link from "next/link";
import type { HistoricalProjectData, HistoricalSource } from "@/lib/types";

export function SourceRecordView({
  project,
  source,
}: {
  project: HistoricalProjectData;
  source: HistoricalSource;
}) {
  const slug = project.manifest.slug;

  const linkedPeople = project.people.filter((person) => person.source_ids.includes(source.id));
  const linkedPlaces = project.places.filter((place) => place.source_ids.includes(source.id));
  const linkedRelationships = project.relationships.filter((relationship) =>
    relationship.source_ids.includes(source.id)
  );

  const sourceMentions = project.mentions.filter((mention) => mention.source_id === source.id);
  const unresolvedMentions = sourceMentions.filter((mention) => mention.linked_entity_id === null);
  const canonicalIds = [
    ...new Set(
      sourceMentions
        .map((mention) => mention.linked_entity_id)
        .filter((entityId): entityId is string => entityId !== null)
    ),
  ];
  const canonicalNames = canonicalIds.map((entityId) => {
    const person = project.people.find((item) => item.id === entityId);
    const place = project.places.find((item) => item.id === entityId);
    return { id: entityId, name: person?.name ?? place?.name ?? entityId };
  });

  return (
    <article className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-45">
        {source.source_type.replaceAll("_", " ")}
      </div>

      <h1 className="mt-5 text-4xl font-medium tracking-[-0.03em] md:text-6xl">{source.title}</h1>

      <div className="mt-6 grid gap-3 text-sm opacity-65 md:grid-cols-2">
        {source.creator && <div>Creator: {source.creator}</div>}
        {source.date && <div>Date: {source.date}</div>}
        {source.archive && <div>Archive: {source.archive}</div>}
        {source.rights && <div>Rights: {source.rights}</div>}
        {source.accessed_date && <div>Accessed: {source.accessed_date}</div>}
      </div>

      {source.citation && (
        <section className="mt-10 border-l-2 border-black/20 pl-5">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">Citation</div>
          <p className="mt-2 leading-7 opacity-75">{source.citation}</p>
        </section>
      )}

      <p className="mt-10 max-w-3xl text-lg leading-8 opacity-75">{source.notes}</p>

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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">Provenance graph</p>
        <h2 className="mt-3 text-3xl font-medium">Records supported by this source</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-black/15 p-5">
            <div className="text-3xl font-medium">{linkedPeople.length}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">People</div>
          </div>
          <div className="border border-black/15 p-5">
            <div className="text-3xl font-medium">{linkedPlaces.length}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">Places</div>
          </div>
          <div className="border border-black/15 p-5">
            <div className="text-3xl font-medium">{linkedRelationships.length}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">Relationships</div>
          </div>
        </div>

        {linkedPeople.length > 0 && (
          <div className="mt-10">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">People</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {linkedPeople.map((person) => (
                <Link
                  key={person.id}
                  href={`/projects/${slug}/records/${person.id}`}
                  className="border border-black/15 px-3 py-2 text-sm hover:bg-black hover:text-white"
                >
                  {person.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-16 border-t border-black/10 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-45">Evidence flow</p>
        <h2 className="mt-3 text-3xl font-medium">Mentions extracted from this source</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 opacity-60">
          Each mention is a raw occurrence in this source. A mention is linked to a canonical record
          only when the source supports the identity. Unlinked mentions remain in the research queue.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-black/15 p-5">
            <div className="text-3xl font-medium">{sourceMentions.length}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">Mentions</div>
          </div>
          <div className="border border-black/15 p-5">
            <div className="text-3xl font-medium">{sourceMentions.length - unresolvedMentions.length}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">Linked to records</div>
          </div>
          <div className="border border-black/15 p-5">
            <div className="text-3xl font-medium">{unresolvedMentions.length}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.14em] opacity-45">Unresolved</div>
          </div>
        </div>

        {sourceMentions.length > 0 ? (
          <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
            {sourceMentions.map((mention) => {
              const linked = canonicalNames.find((item) => item.id === mention.linked_entity_id);

              return (
                <li key={mention.id} className="flex flex-wrap items-start justify-between gap-4 py-4 text-sm">
                  <div>
                    <div className="font-medium">{mention.raw_name ?? "Unnamed mention"}</div>
                    <div className="mt-1 text-xs opacity-55">
                      {mention.entity_type}
                      {mention.date_text ? ` · ${mention.date_text}` : ""}
                      {mention.page_or_locator ? ` · ${mention.page_or_locator}` : ""}
                    </div>
                  </div>
                  <div className="text-xs">
                    {linked ? (
                      <Link href={`/projects/${slug}/records/${linked.id}`} className="underline underline-offset-4">
                        Linked: {linked.name}
                      </Link>
                    ) : (
                      <span className="border border-dashed border-black/30 px-2 py-1 uppercase tracking-[0.12em] opacity-70">
                        Unresolved
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-8 text-sm opacity-50">No archival mentions have been extracted from this source yet.</p>
        )}

        {canonicalNames.length > 0 && (
          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-45">
              Canonical records supported by this source
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {canonicalNames.map((item) => (
                <Link
                  key={item.id}
                  href={`/projects/${slug}/records/${item.id}`}
                  className="border border-black/15 px-3 py-2 text-sm hover:bg-black hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
