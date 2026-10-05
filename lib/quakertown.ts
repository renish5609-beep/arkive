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