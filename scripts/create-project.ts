import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { listProjectManifests } from "../lib/projects";
import type { HistoricalProjectManifest } from "../lib/types";

// Scaffolds a new, empty project. Project discovery is filesystem-based, so
// no registry file needs to be edited afterward. Never writes historical
// content: every data file starts empty, and the manifest text is a
// placeholder clearly marked for editing.

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (!flag.startsWith("--")) continue;
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      console.error(`Refused: missing value for ${flag}`);
      process.exit(1);
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

const args = parseArgs(process.argv.slice(2));
const slug = args.slug;
const number = args.number;
const title = args.title;
const location = args.location;

if (!slug) fail("--slug is required");
if (!/^[a-z0-9-]+$/.test(slug)) fail(`--slug "${slug}" must match [a-z0-9-]+`);
if (!number) fail("--number is required (for example 003)");
if (!title) fail("--title is required");
if (!location) fail("--location is required");

const projectDir = resolve("data/projects", slug);
if (existsSync(projectDir)) {
  fail(`a project directory already exists at data/projects/${slug}`);
}

const existingManifests = listProjectManifests();
if (existingManifests.some((manifest) => manifest.slug === slug)) {
  fail(`project slug "${slug}" is already in use`);
}
if (existingManifests.some((manifest) => manifest.project_number === number)) {
  fail(`project number "${number}" is already in use by "${existingManifests.find((m) => m.project_number === number)?.slug}"`);
}

mkdirSync(projectDir, { recursive: true });

const manifest: HistoricalProjectManifest = {
  slug,
  project_number: number,
  title,
  short_title: title,
  location,
  // Placeholder text. Replace before publishing — do not invent history.
  summary: "PLACEHOLDER — replace with a one-sentence, source-supported summary before publishing.",
  historical_context:
    "PLACEHOLDER — replace with historical context that is directly supported by approved sources. Do not invent facts, dates, or people.",
  status: "pilot",
  date_range: null,
  featured: false,
  source_note:
    "PLACEHOLDER — list the sources this project currently relies on, and note how thoroughly they have been read.",
  research_scope:
    "PLACEHOLDER — state plainly what this reconstruction does and does not yet cover.",
};

writeFileSync(resolve(projectDir, "project.json"), JSON.stringify(manifest, null, 2) + "\n");

const emptyFiles = [
  "people.json",
  "places.json",
  "sources.json",
  "relationships.json",
  "location-evidence.json",
  "georeference-queue.json",
  "mentions.json",
  "match-candidates.json",
  "research-queue.json",
];

for (const file of emptyFiles) {
  writeFileSync(resolve(projectDir, file), "[]\n");
}

console.log(`Created data/projects/${slug}/`);
console.log("");
console.log("Files created:");
console.log("  project.json (placeholder text — edit before publishing)");
for (const file of emptyFiles) console.log(`  ${file}`);
console.log("");
console.log("Next steps:");
console.log(`  1. Edit data/projects/${slug}/project.json: replace every PLACEHOLDER field.`);
console.log("  2. Add sources.json entries only for sources you can actually cite.");
console.log(`  3. Add mentions with: npm run add:mention -- --project ${slug} --source <id> --type <type> --raw-name "..."`);
console.log(`  4. Validate with: npm run validate:data -- --project ${slug}`);
console.log(`  5. Check status with: npm run projects:status`);
