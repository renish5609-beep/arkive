// Compatibility shim for pre-multiproject imports.
// New code should use lib/projects.ts.
import { isMappablePlace } from "@/lib/geo";
import { formatVerification } from "@/lib/format";
import {
  getProjectEntityName,
  getProjectGeoreferenceQueueItemForPlace,
  getProjectLocationEvidenceForPlace,
  getProjectMentionsForEntity,
  getProjectOpenResearchItemsForEntity,
  getProjectPersonById,
  getProjectPlaceById,
  getProjectRelationshipsForEntity,
  getProjectSourceById,
  getProjectSourcesForIds,
  requireProject,
} from "@/lib/projects";

const quakertown = requireProject("quakertown");

export const people = quakertown.people;
export const places = quakertown.places;
export const sources = quakertown.sources;
export const relationships = quakertown.relationships;
export const locationEvidence = quakertown.locationEvidence;
export const georeferenceQueue = quakertown.georeferenceQueue;
export const mentions = quakertown.mentions;
export const matchCandidates = quakertown.matchCandidates;
export const researchQueue = quakertown.researchQueue;

export { formatVerification };

export function getMentionById(id: string) {
  return mentions.find((mention) => mention.id === id);
}

export function getMentionsForEntity(entityId: string) {
  return getProjectMentionsForEntity(quakertown, entityId);
}

export function getMatchCandidatesForMention(mentionId: string) {
  return matchCandidates.filter(
    (candidate) => candidate.left_mention_id === mentionId || candidate.right_mention_id === mentionId
  );
}

export function getOpenResearchItemsForEntity(entityId: string) {
  return getProjectOpenResearchItemsForEntity(quakertown, entityId);
}

export function getPersonById(id: string) {
  return getProjectPersonById(quakertown, id);
}

export function getPlaceById(id: string) {
  return getProjectPlaceById(quakertown, id);
}

export function getSourceById(id: string) {
  return getProjectSourceById(quakertown, id);
}

export function getEntityName(entityId: string) {
  return getProjectEntityName(quakertown, entityId);
}

export function getRelationshipsForEntity(entityId: string) {
  return getProjectRelationshipsForEntity(quakertown, entityId);
}

export function getSourcesForIds(sourceIds: string[]) {
  return getProjectSourcesForIds(quakertown, sourceIds);
}

export function getLocationEvidenceForPlace(placeId: string) {
  return getProjectLocationEvidenceForPlace(quakertown, placeId);
}

export function getGeoreferenceQueueItemForPlace(placeId: string) {
  return getProjectGeoreferenceQueueItemForPlace(quakertown, placeId);
}

export { isMappablePlace };
