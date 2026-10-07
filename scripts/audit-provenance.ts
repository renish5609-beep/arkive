import { loadSelectedProjects, resolveProjectSelection } from "../lib/cli-project";

// Fails if any canonical person/place/relationship lacks source provenance.
// Warns about thinner evidence. Runs across every project by default.
const selection = resolveProjectSelection(process.argv.slice(2), { allowAllByDefault: true });
const projects = loadSelectedProjects(selection);

const failures: string[] = [];
const warnings: string[] = [];
let recordsChecked = 0;

for (const project of projects) {
  const { manifest, people, places, relationships, mentions, locationEvidence, georeferenceQueue, researchQueue, sources } =
    project;
  const sourceIds = new Set(sources.map((source) => source.id));
  const tag = `[${manifest.slug}]`;

  recordsChecked += people.length + places.length + relationships.length;

  for (const person of people) {
    if (person.source_ids.length === 0) {
      failures.push(`${tag} Person ${person.id} (${person.name}) has no source provenance`);
    }
    for (const sourceId of person.source_ids) {
      if (!sourceIds.has(sourceId)) {
        failures.push(`${tag} Person ${person.id} cites missing source ${sourceId}`);
      }
    }

    const personMentions = mentions.filter((mention) => mention.linked_entity_id === person.id);
    if (personMentions.length === 0) {
      warnings.push(`${tag} Person ${person.id} (${person.name}) has no archival mentions`);
    }
  }

  for (const place of places) {
    if (place.source_ids.length === 0) {
      failures.push(`${tag} Place ${place.id} (${place.name}) has no source provenance`);
    }
    for (const sourceId of place.source_ids) {
      if (!sourceIds.has(sourceId)) {
        failures.push(`${tag} Place ${place.id} cites missing source ${sourceId}`);
      }
    }

    const hasEvidence = locationEvidence.some((item) => item.place_id === place.id);
    const hasQueueItem =
      georeferenceQueue.some((item) => item.place_id === place.id) ||
      researchQueue.some((item) => item.entity_ids.includes(place.id));
    if (!hasEvidence && !hasQueueItem) {
      warnings.push(
        `${tag} Place ${place.id} (${place.name}) lacks location evidence and any georeference or research item`
      );
    }
  }

  for (const relationship of relationships) {
    if (relationship.source_ids.length === 0) {
      failures.push(`${tag} Relationship ${relationship.id} has no source provenance`);
    }
    for (const sourceId of relationship.source_ids) {
      if (!sourceIds.has(sourceId)) {
        failures.push(`${tag} Relationship ${relationship.id} cites missing source ${sourceId}`);
      }
    }

    const endpoints = new Set([relationship.from_entity_id, relationship.to_entity_id]);
    const supported = mentions.some(
      (mention) =>
        relationship.source_ids.includes(mention.source_id) &&
        mention.linked_entity_id !== null &&
        endpoints.has(mention.linked_entity_id)
    );
    if (!supported) {
      warnings.push(
        `${tag} Relationship ${relationship.id} is not corroborated by any linked archival mention (evidence is source-level only)`
      );
    }
  }
}

console.log("ARKIVE PROVENANCE AUDIT");
console.log("=======================");
console.log(`Projects checked: ${projects.map((p) => p.manifest.slug).join(", ") || "none"}`);
console.log(`Canonical records checked: ${recordsChecked}`);
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
