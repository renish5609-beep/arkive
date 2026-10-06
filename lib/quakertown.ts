import peopleData from "@/data/projects/quakertown/people.json";
import placesData from "@/data/projects/quakertown/places.json";
import sourcesData from "@/data/projects/quakertown/sources.json";
import relationshipsData from "@/data/projects/quakertown/relationships.json";

import type {
  HistoricalPerson,
  HistoricalPlace,
  HistoricalSource,
  HistoricalRelationship,
} from "./types";

export const people = peopleData as HistoricalPerson[];
export const places = placesData as HistoricalPlace[];
export const sources = sourcesData as HistoricalSource[];
export const relationships =
  relationshipsData as HistoricalRelationship[];

export function formatVerification(status: string) {
  return status.replaceAll("_", " ");
}

export function getPersonById(id: string) {
  return people.find((person) => person.id === id);
}

export function getPlaceById(id: string) {
  return places.find((place) => place.id === id);
}

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}

export function getEntityName(entityId: string) {
  const person = getPersonById(entityId);
  if (person) return person.name;

  const place = getPlaceById(entityId);
  if (place) return place.name;

  return entityId;
}

export function getRelationshipsForEntity(entityId: string) {
  return relationships.filter(
    (relationship) =>
      relationship.from_entity_id === entityId ||
      relationship.to_entity_id === entityId
  );
}

export function getSourcesForIds(sourceIds: string[]) {
  return sources.filter((source) => sourceIds.includes(source.id));
}

export function isMappablePlace(place: HistoricalPlace) {
  return (
    typeof place.latitude === "number" &&
    Number.isFinite(place.latitude) &&
    typeof place.longitude === "number" &&
    Number.isFinite(place.longitude)
  );
}
