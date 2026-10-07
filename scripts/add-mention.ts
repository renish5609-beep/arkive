import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeHistoricalName } from "../lib/entity-resolution";
import { listProjectSlugs, requireProject } from "../lib/projects";
import type { ArchivalMention, MentionEntityType } from "../lib/types";

const ENTITY_TYPES: MentionEntityType[] = ["person", "place", "institution", "household", "unknown"];

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (!flag.startsWith("--")) {
      throw new Error(`Unexpected argument: ${flag}`);
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }
    args[flag.slice(2)] = value;
    i += 1;
  }
  return args;
}

function fail(message: string): never {
  console.error(`Refused: ${message}`);
  process.exit(1);
}

let args: Record<string, string>;
try {
  args = parseArgs(process.argv.slice(2));
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

const projectSlug = args.project;
const sourceId = args.source;
const entityType = args.type as MentionEntityType | undefined;
const rawName = args["raw-name"] ?? null;
const address = args.address ?? null;
const linkedEntity = args.entity ?? null;

// Structural validation before anything is written. Mentions are always
// scoped to one project, so --project is required, not inferred.
if (!projectSlug) {
  fail(`--project is required. Available projects: ${listProjectSlugs().join(", ") || "none"}`);
}
if (!listProjectSlugs().includes(projectSlug)) {
  fail(`unknown project "${projectSlug}". Available projects: ${listProjectSlugs().join(", ") || "none"}`);
}

const project = requireProject(projectSlug);
const mentionPath = resolve(`data/projects/${projectSlug}/mentions.json`);

if (!sourceId) fail("--source is required");
if (!project.sources.some((source) => source.id === sourceId)) {
  fail(`source ${sourceId} does not exist in project "${projectSlug}"`);
}
if (!entityType || !ENTITY_TYPES.includes(entityType)) {
  fail(`--type must be one of: ${ENTITY_TYPES.join(", ")}`);
}
if (!rawName && !address) {
  fail("a mention needs --raw-name or --address to be meaningful");
}
if (linkedEntity) {
  const exists =
    project.people.some((person) => person.id === linkedEntity) ||
    project.places.some((place) => place.id === linkedEntity);
  if (!exists) fail(`linked entity ${linkedEntity} does not exist in project "${projectSlug}"`);
}

// Next deterministic ID: highest existing number + 1, scoped to this project
const highest = project.mentions.reduce((max, mention) => {
  const match = /^(?:[a-z0-9]+_)?mention_(\d+)$/.exec(mention.id);
  return match ? Math.max(max, Number(match[1])) : max;
}, 0);
const prefix = projectSlug === "quakertown" ? "" : `${projectSlug.replace(/-/g, "_")}_`;
const nextId = `${prefix}mention_${String(highest + 1).padStart(3, "0")}`;

const mention: ArchivalMention = {
  id: nextId,
  source_id: sourceId,
  entity_type: entityType,
  raw_name: rawName,
  normalized_name: normalizeHistoricalName(rawName),
  date_text: args.date ?? null,
  address_text: address,
  occupation_text: args.occupation ?? null,
  relationship_text: args.relationship ?? null,
  page_or_locator: args.locator ?? null,
  excerpt: null,
  linked_entity_id: linkedEntity,
  // New mentions start unverified until a human reviews the source
  verification_status: "unverified",
  notes: args.notes ?? "",
};

const existing = JSON.parse(readFileSync(mentionPath, "utf8")) as ArchivalMention[];
existing.push(mention);
writeFileSync(mentionPath, JSON.stringify(existing, null, 2) + "\n");

console.log(`Added ${nextId} to project "${projectSlug}" from ${sourceId}`);
console.log(JSON.stringify(mention, null, 2));
