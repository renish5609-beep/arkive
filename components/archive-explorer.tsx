"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  ArchivalMention,
  HistoricalPerson,
  HistoricalPlace,
  HistoricalRelationship,
  HistoricalSource,
  ResearchQueueItem,
} from "@/lib/types";

interface ArchiveExplorerProps {
  projectSlug: string;
  people: HistoricalPerson[];
  places: HistoricalPlace[];
  relationships: HistoricalRelationship[];
  sources: HistoricalSource[];
  mentions: ArchivalMention[];
  researchQueue: ResearchQueueItem[];
}

function formatVerification(status: string) {
  return status.replaceAll("_", " ");
}

export default function ArchiveExplorer({
  projectSlug,
  people,
  places,
  relationships,
  sources,
  mentions,
  researchQueue,
}: ArchiveExplorerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [mentionFilter, setMentionFilter] = useState("all");
  const [researchFilter, setResearchFilter] = useState("all");

  const filteredPeople = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return people.filter((person) => {
      const personMentions = mentions.filter(
        (mention) => mention.linked_entity_id === person.id
      );
      const openResearch = researchQueue.filter(
        (item) => item.status !== "resolved" && item.entity_ids.includes(person.id)
      );

      const matchesQuery =
        normalized.length === 0 ||
        person.name.toLowerCase().includes(normalized) ||
        person.aliases.some((alias) =>
          alias.toLowerCase().includes(normalized)
        ) ||
        person.occupation?.toLowerCase().includes(normalized) ||
        person.notes.toLowerCase().includes(normalized) ||
        personMentions.some((mention) =>
          (mention.raw_name ?? "").toLowerCase().includes(normalized)
        );

      const matchesStatus =
        status === "all" || person.verification_status === status;

      const matchesMentions =
        mentionFilter === "all" ||
        (mentionFilter === "with" && personMentions.length > 0) ||
        (mentionFilter === "without" && personMentions.length === 0);

      const matchesResearch =
        researchFilter === "all" ||
        (researchFilter === "with" && openResearch.length > 0) ||
        (researchFilter === "without" && openResearch.length === 0);

      return matchesQuery && matchesStatus && matchesMentions && matchesResearch;
    });
  }, [people, query, status, mentionFilter, researchFilter, mentions, researchQueue]);

  const entityName = (entityId: string) => {
    return (
      people.find((person) => person.id === entityId)?.name ??
      places.find((place) => place.id === entityId)?.name ??
      entityId
    );
  };

  return (
    <div>
      <div className="grid gap-3 border-y border-black/10 py-5 md:grid-cols-[1fr_180px_180px_180px]">
        <label>
          <span className="sr-only">Search reconstructed records</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people, occupations, aliases, notes..."
            className="w-full border border-black/15 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-black/35 focus:border-black/40"
          />
        </label>

        <label>
          <span className="sr-only">Filter verification status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full border border-black/15 bg-[#f4f0e7] px-4 py-3 text-sm outline-none focus:border-black/40"
          >
            <option value="all">All verification states</option>
            <option value="verified">Verified</option>
            <option value="human_reviewed">Human reviewed</option>
            <option value="machine_suggested">Machine suggested</option>
            <option value="unverified">Unverified</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by archival mentions</span>
          <select
            value={mentionFilter}
            onChange={(event) => setMentionFilter(event.target.value)}
            className="w-full border border-black/15 bg-[#f4f0e7] px-4 py-3 text-sm outline-none focus:border-black/40"
          >
            <option value="all">Any mention state</option>
            <option value="with">Has archival mentions</option>
            <option value="without">No archival mentions</option>
          </select>
        </label>

        <label>
          <span className="sr-only">Filter by open research questions</span>
          <select
            value={researchFilter}
            onChange={(event) => setResearchFilter(event.target.value)}
            className="w-full border border-black/15 bg-[#f4f0e7] px-4 py-3 text-sm outline-none focus:border-black/40"
          >
            <option value="all">Any research state</option>
            <option value="with">Has open research questions</option>
            <option value="without">No open research questions</option>
          </select>
        </label>
      </div>

      <div className="mt-5 text-xs uppercase tracking-[0.14em] opacity-45">
        {filteredPeople.length} of {people.length} people shown
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {filteredPeople.map((person) => {
          const personSources = sources.filter((source) =>
            person.source_ids.includes(source.id)
          );

          const personRelationships = relationships.filter(
            (relationship) =>
              relationship.from_entity_id === person.id ||
              relationship.to_entity_id === person.id
          );

          const years =
            person.birth_year !== null || person.death_year !== null
              ? `${person.birth_year ?? "?"}-${person.death_year ?? "?"}`
              : "Dates unknown";

          return (
            <article
              key={person.id}
              className="border border-black/15 bg-white/30 p-7 transition hover:bg-white/55"
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
                        <Link
                          key={source.id}
                          href={`/projects/${projectSlug}/sources/${source.id}`}
                          className="border border-black/10 px-2 py-1 text-xs transition hover:bg-black hover:text-white"
                        >
                          {source.source_type.replaceAll("_", " ")}
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs opacity-40">
                        No linked sources yet
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-40">
                    Relationships
                  </div>

                  {personRelationships.length > 0 ? (
                    <div className="space-y-2">
                      {personRelationships.slice(0, 3).map((relationship) => {
                        const otherEntity =
                          relationship.from_entity_id === person.id
                            ? relationship.to_entity_id
                            : relationship.from_entity_id;

                        return (
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
                              {entityName(otherEntity)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xs opacity-40">
                      No linked relationships yet
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/projects/${projectSlug}/records/${person.id}`}
                className="mt-7 inline-block text-sm font-medium underline underline-offset-4"
              >
                Open reconstructed record
              </Link>
            </article>
          );
        })}
      </div>

      {filteredPeople.length === 0 && (
        <div className="mt-6 border border-black/15 p-8 text-center">
          <div className="font-medium">No records match these filters.</div>
          <p className="mt-2 text-sm opacity-60">
            Try a broader name, occupation, alias, or verification state.
          </p>
        </div>
      )}
    </div>
  );
}
