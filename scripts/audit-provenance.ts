import {
  georeferenceQueue,
  locationEvidence,
  mentions,
  people,
  places,
  relationships,
  researchQueue,
  sources,
} from "../lib/quakertown";

// Failures block the audit. Warnings flag thin evidence for research.
// The audit checks every canonical record, so records added in this phase
// are covered without needing separate tracking.
const failures: string[] = [];
const warnings: string[] = [];

const sourceIds = new Set(sources.map((source) => source.id));

for (const person of people) {
  if (person.source_ids.length === 0) {
    failures.push(`Person ${person.id} (${person.name}) has no source provenance`);
  }
  for (const sourceId of person.source_ids) {
    if (!sourceIds.has(sourceId)) {
      failures.push(`Person ${person.id} cites missing source ${sourceId}`);
    }
  }

  const personMentions = mentions.filter((mention) => mention.linked_entity_id === person.id);
  if (personMentions.length === 0) {
    warnings.push(`Person ${person.id} (${person.name}) has no archival mentions`);
  }
}

for (const place of places) {
  if (place.source_ids.length === 0) {
    failures.push(`Place ${place.id} (${place.name}) has no source provenance`);
  }
  for (const sourceId of place.source_ids) {
    if (!sourceIds.has(sourceId)) {
      failures.push(`Place ${place.id} cites missing source ${sourceId}`);
    }
  }

  const hasEvidence = locationEvidence.some((item) => item.place_id === place.id);
  const hasQueueItem =
    georeferenceQueue.some((item) => item.place_id === place.id) ||
    researchQueue.some((item) => item.entity_ids.includes(place.id));
  if (!hasEvidence && !hasQueueItem) {
    warnings.push(
      `Place ${place.id} (${place.name}) lacks location evidence and any georeference or research item`
    );
  }
}

for (const relationship of relationships) {
  if (relationship.source_ids.length === 0) {
    failures.push(`Relationship ${relationship.id} has no source provenance`);
  }
  for (const sourceId of relationship.source_ids) {
    if (!sourceIds.has(sourceId)) {
      failures.push(`Relationship ${relationship.id} cites missing source ${sourceId}`);
    }
  }

  // Weak evidence: none of the relationship's sources has a mention that
  // is linked to either endpoint of the relationship.
  const endpoints = new Set([relationship.from_entity_id, relationship.to_entity_id]);
  const supported = mentions.some(
    (mention) =>
      relationship.source_ids.includes(mention.source_id) &&
      mention.linked_entity_id !== null &&
      endpoints.has(mention.linked_entity_id)
  );
  if (!supported) {
    warnings.push(
      `Relationship ${relationship.id} is not corroborated by any linked archival mention (evidence is source-level only)`
    );
  }
}

console.log("ARKIVE PROVENANCE AUDIT");
console.log("=======================");
console.log(`Canonical records checked: ${people.length + places.length + relationships.length}`);
console.log(`Failures: ${failures.length}`);
console.log(`Warnings: ${warnings.length}`);

if (failures.length > 0) {
  console.log("\nFailures:");
  for (const failure of failures) console.log(`  - ${failure}`);
}

if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`  - ${warning}`);
}

console.log(failures.length === 0 ? "\nAUDIT PASSED" : "\nAUDIT FAILED");
process.exit(failures.length === 0 ? 0 : 1);
