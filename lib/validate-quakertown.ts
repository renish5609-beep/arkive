import {
  georeferenceQueue,
  isMappablePlace,
  locationEvidence,
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
    locationEvidence: number;
    georeferenceQueue: number;
    mappablePlaces: number;
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

function hasNumericCoordinates(
  latitude: number | null,
  longitude: number | null
) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

export function validateQuakertownData(): QuakertownValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceIds = new Set(sources.map((source) => source.id));
  const placeIds = new Set(places.map((place) => place.id));
  const personIds = new Set(people.map((person) => person.id));
  const entityIds = new Set([...personIds, ...placeIds]);
  const evidenceById = new Map(
    locationEvidence.map((item) => [item.id, item] as const)
  );

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

    // 9.2 Place status consistency
    // Any single non-null coordinate counts as "has coordinates" here,
    // so a lone latitude or longitude on an unresolved place is caught.
    const hasCoordinates =
      place.latitude !== null || place.longitude !== null;
    const hasEvidence = place.location_evidence_ids.length > 0;
    const isLocated =
      place.georeference_status === "exact" ||
      place.georeference_status === "approximate";

    if (place.georeference_status === "unresolved" && hasCoordinates) {
      errors.push(
        `Place ${place.id} is unresolved but has coordinates; upgrade its status with evidence or clear the coordinates`
      );
    }

    if (isLocated && !hasNumericCoordinates(place.latitude, place.longitude)) {
      errors.push(
        `Place ${place.id} is ${place.georeference_status} but is missing a coordinate`
      );
    }

    if (isLocated && !hasEvidence) {
      errors.push(
        `Place ${place.id} is ${place.georeference_status} but has no location evidence`
      );
    }

    // Every evidence ID referenced by a place must exist and point back here
    for (const evidenceId of place.location_evidence_ids) {
      const evidence = evidenceById.get(evidenceId);

      if (!evidence) {
        errors.push(
          `Place ${place.id} references missing location evidence ${evidenceId}`
        );
      } else if (evidence.place_id !== place.id) {
        errors.push(
          `Place ${place.id} references location evidence ${evidenceId}, which points to ${evidence.place_id}`
        );
      }
    }

    if (isMissingCoordinates(place)) {
      warnings.push(`Place ${place.id} has no coordinates yet (not georeferenced)`);
    }

    if (place.source_ids.length === 0) {
      warnings.push(`Place ${place.id} has no linked sources`);
    }
  }

  // 9.1 Location evidence integrity
  for (const id of findDuplicates(locationEvidence.map((item) => item.id))) {
    errors.push(`Duplicate location evidence ID: ${id}`);
  }

  for (const evidence of locationEvidence) {
    if (!placeIds.has(evidence.place_id)) {
      errors.push(
        `Location evidence ${evidence.id} references missing place ${evidence.place_id}`
      );
    }

    for (const sourceId of evidence.source_ids) {
      if (!sourceIds.has(sourceId)) {
        errors.push(
          `Location evidence ${evidence.id} references missing source ${sourceId}`
        );
      }
    }

    if (evidence.status === "unresolved") {
      if (evidence.latitude !== null || evidence.longitude !== null) {
        errors.push(
          `Location evidence ${evidence.id} is unresolved but has coordinates`
        );
      }
    } else if (!hasNumericCoordinates(evidence.latitude, evidence.longitude)) {
      errors.push(
        `Location evidence ${evidence.id} is ${evidence.status} but lacks numeric coordinates`
      );
    }

    if (!hasValidCoordinate(evidence.latitude, 90)) {
      errors.push(
        `Location evidence ${evidence.id} has latitude ${evidence.latitude} outside -90 to 90`
      );
    }

    if (!hasValidCoordinate(evidence.longitude, 180)) {
      errors.push(
        `Location evidence ${evidence.id} has longitude ${evidence.longitude} outside -180 to 180`
      );
    }

    if (
      evidence.radius_meters !== null &&
      !(Number.isFinite(evidence.radius_meters) && evidence.radius_meters > 0)
    ) {
      errors.push(
        `Location evidence ${evidence.id} has non-positive radius_meters ${evidence.radius_meters}`
      );
    }

    if (evidence.status === "approximate" && evidence.radius_meters === null) {
      warnings.push(
        `Location evidence ${evidence.id} is approximate but has no radius_meters`
      );
    }
  }

  // 9.3 Queue integrity
  for (const id of findDuplicates(georeferenceQueue.map((item) => item.id))) {
    errors.push(`Duplicate georeference queue ID: ${id}`);
  }

  const activeQueuePlaces = new Set<string>();

  for (const item of georeferenceQueue) {
    const place = places.find((candidate) => candidate.id === item.place_id);

    if (!place) {
      errors.push(
        `Georeference queue item ${item.id} references missing place ${item.place_id}`
      );
      continue;
    }

    if (item.status !== "resolved") {
      if (activeQueuePlaces.has(item.place_id)) {
        errors.push(
          `Place ${item.place_id} has more than one active georeference queue item`
        );
      }
      activeQueuePlaces.add(item.place_id);
    }

    if (item.status === "resolved" && place.georeference_status === "unresolved") {
      errors.push(
        `Georeference queue item ${item.id} is resolved but place ${place.id} remains unresolved`
      );
    }
  }

  for (const place of places) {
    if (
      place.georeference_status === "unresolved" &&
      !georeferenceQueue.some((item) => item.place_id === place.id)
    ) {
      warnings.push(`Unresolved place ${place.id} has no georeference queue item`);
    }
  }

  // Relationship and source integrity (unchanged)
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
    ...locationEvidence.flatMap((evidence) => evidence.source_ids),
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
      locationEvidence: locationEvidence.length,
      georeferenceQueue: georeferenceQueue.length,
      mappablePlaces: places.filter(isMappablePlace).length,
    },
  };
}
