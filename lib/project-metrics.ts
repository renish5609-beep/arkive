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

// Every number here is derived from the dataset at build time. Nothing is
// hand-entered, so these counts cannot drift from the data.
export function getProjectMetrics() {
  const exact = places.filter((place) => place.georeference_status === "exact").length;
  const approximate = places.filter(
    (place) => place.georeference_status === "approximate"
  ).length;
  const unresolved = places.filter(
    (place) => place.georeference_status === "unresolved"
  ).length;

  return {
    people: people.length,
    places: places.length,
    sources: sources.length,
    sourceTypes: new Set(sources.map((source) => source.source_type)).size,
    relationships: relationships.length,
    mentions: mentions.length,
    locationEvidence: locationEvidence.length,
    exactPlaces: exact,
    approximatePlaces: approximate,
    unresolvedPlaces: unresolved,
    mappablePlaces: exact + approximate,
    openGeoreferenceTasks: georeferenceQueue.filter((item) => item.status === "open").length,
    openResearchQuestions: researchQueue.filter((item) => item.status !== "resolved").length,
    pendingMatches: matchCandidates.filter((c) => c.review_status === "pending").length,
    acceptedMatches: matchCandidates.filter((c) => c.review_status === "accepted").length,
  };
}
