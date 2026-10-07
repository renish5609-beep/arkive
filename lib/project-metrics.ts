import { requireProject } from "@/lib/projects";
import type { HistoricalProjectData } from "@/lib/types";

// Every number here is derived from the project's data at call time. Nothing
// is hand-entered, so these counts cannot drift from the data.
export function getProjectMetrics(project: HistoricalProjectData) {
  const exact = project.places.filter((place) => place.georeference_status === "exact").length;
  const approximate = project.places.filter(
    (place) => place.georeference_status === "approximate"
  ).length;
  const unresolved = project.places.filter(
    (place) => place.georeference_status === "unresolved"
  ).length;

  return {
    people: project.people.length,
    places: project.places.length,
    sources: project.sources.length,
    sourceTypes: new Set(project.sources.map((source) => source.source_type)).size,
    relationships: project.relationships.length,
    mentions: project.mentions.length,
    locationEvidence: project.locationEvidence.length,
    exactPlaces: exact,
    approximatePlaces: approximate,
    unresolvedPlaces: unresolved,
    mappablePlaces: exact + approximate,
    openGeoreferenceTasks: project.georeferenceQueue.filter((item) => item.status === "open").length,
    openResearchQuestions: project.researchQueue.filter((item) => item.status !== "resolved").length,
    pendingMatches: project.matchCandidates.filter((c) => c.review_status === "pending").length,
    acceptedMatches: project.matchCandidates.filter((c) => c.review_status === "accepted").length,
  };
}

// Compatibility helper for pre-multiproject call sites.
export function getQuakertownMetrics() {
  return getProjectMetrics(requireProject("quakertown"));
}
