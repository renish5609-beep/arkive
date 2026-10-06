import {
  people,
  places,
  relationships,
  sources,
} from "@/lib/quakertown";
import type { HistoricalPlace } from "@/lib/types";

export interface QuakertownValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    people: number;
    places: number;
    sources: number;
    relationships: number;
  };
}

function findDuplicates(ids: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }

  return [...duplicates];
}

function hasValidCoordinate(value: number | null, limit: number) {
  return value === null || (Number.isFinite(value) && Math.abs(value) <= limit);
}

function isMissingCoordinates(place: HistoricalPlace) {
  return place.latitude === null || place.longitude === null;
}

export function validateQuakertownData(): QuakertownValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceIds = new Set(sources.map((source) => source.id));
  const placeIds = new Set(places.map((place) => place.id));
  const personIds = new Set(people.map((person) => person.id));
  const entityIds = new Set([...personIds, ...placeIds]);

  for (const id of findDuplicates(people.map((person) => person.id))) {
    errors.push(`Duplicate person ID: ${id}`);
  }
  for (const id of findDuplicates(places.map((place) => place.id))) {
    errors.push(`Duplicate place ID: ${id}`);
  }
  for (const id of findDuplicates(sources.map((source) => source.id))) {
    errors.push(`Duplicate source ID: ${id}`);
  }
  for (const id of findDuplicates(
    relationships.map((relationship) => relationship.id)
  )) {
    errors.push(`Duplicate relationship ID: ${id}`);
  }

  for (const person of people) {
    for (const sourceId of person.source_ids) {
      if (!sourceIds.has(sourceId)) {
        errors.push(
          `Person ${person.id} references missing source ${sourceId}`
        );
      }
    }

    for (const placeId of person.residences) {
      if (!placeIds.has(placeId)) {
        errors.push(
          `Person ${person.id} residence references missing place ${placeId}`
        );
      }
    }

    if (person.source_ids.length === 0) {
      warnings.push(`Person ${person.id} has no linked sources`);
    }
  }

  for (const place of places) {
    for (const sourceId of place.source_ids) {
      if (!sourceIds.has(sourceId)) {
        errors.push(`Place ${place.id} references missing source ${sourceId}`);
      }
    }

    if (!hasValidCoordinate(place.latitude, 90)) {
      errors.push(
        `Place ${place.id} has latitude ${place.latitude} outside -90 to 90`
      );
    }

    if (!hasValidCoordinate(place.longitude, 180)) {
      errors.push(
        `Place ${place.id} has longitude ${place.longitude} outside -180 to 180`
      );
    }

    if (isMissingCoordinates(place)) {
      warnings.push(`Place ${place.id} has no coordinates yet (not georeferenced)`);
    }

    if (place.source_ids.length === 0) {
      warnings.push(`Place ${place.id} has no linked sources`);
    }
  }

  for (const relationship of relationships) {
    for (const sourceId of relationship.source_ids) {
      if (!sourceIds.has(sourceId)) {
        errors.push(
          `Relationship ${relationship.id} references missing source ${sourceId}`
        );
      }
    }

    if (!entityIds.has(relationship.from_entity_id)) {
      errors.push(
        `Relationship ${relationship.id} has unknown from_entity_id ${relationship.from_entity_id}`
      );
    }

    if (!entityIds.has(relationship.to_entity_id)) {
      errors.push(
        `Relationship ${relationship.id} has unknown to_entity_id ${relationship.to_entity_id}`
      );
    }

    if (relationship.source_ids.length === 0) {
      warnings.push(`Relationship ${relationship.id} has no source_ids`);
    }
  }

  const referencedSourceIds = new Set([
    ...people.flatMap((person) => person.source_ids),
    ...places.flatMap((place) => place.source_ids),
    ...relationships.flatMap((relationship) => relationship.source_ids),
  ]);

  for (const source of sources) {
    if (!referencedSourceIds.has(source.id)) {
      warnings.push(`Source ${source.id} is not referenced by any record`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      people: people.length,
      places: places.length,
      sources: sources.length,
      relationships: relationships.length,
    },
  };
}
