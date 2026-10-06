import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { GET as exportGET } from "../app/api/export/quakertown/route";
import { GET as projectGET } from "../app/api/projects/quakertown/route";
import { sources } from "../lib/quakertown";
import { validateQuakertownData } from "../lib/validate-quakertown";

// Critical checks fail the audit. Warnings are reported but do not fail it.
// Network link health is intentionally not checked here (see check:links).
const failures: string[] = [];
const warnings: string[] = [];

const root = resolve(".");

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

// 1. Dataset validation
const validation = validateQuakertownData();
for (const error of validation.errors) failures.push(`Validation: ${error}`);
for (const warning of validation.warnings) warnings.push(`Validation: ${warning}`);

// 2. Provenance: every source needs a usable URL, and it must be https
for (const source of sources) {
  if (!source.url) {
    warnings.push(`Source ${source.id} has no URL. Keep it only if no online copy exists.`);
  } else if (!source.url.startsWith("https://")) {
    failures.push(`Source ${source.id} URL is not an absolute https address: ${source.url}`);
  }
}

// 3. Duplicate IDs across every dataset file
const dataDir = join(root, "data/projects/quakertown");
const seenIds = new Map<string, string>();
for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".json"))) {
  const rows = JSON.parse(readFileSync(join(dataDir, file), "utf8")) as { id?: string }[];
  const ids = new Set<string>();
  for (const row of rows) {
    if (!row.id) continue;
    if (ids.has(row.id)) failures.push(`Duplicate ID ${row.id} within ${file}`);
    ids.add(row.id);
    const prior = seenIds.get(row.id);
    if (prior && prior !== file) failures.push(`ID ${row.id} appears in both ${prior} and ${file}`);
    seenIds.set(row.id, file);
  }
}

// 4. Export serialization, called in-process
async function checkExports() {
  const json = await exportGET(new Request("http://localhost/api/export/quakertown?format=json"));
  try {
    const body = JSON.parse(await json.text()) as Record<string, unknown>;
    for (const key of ["project", "people", "places", "relationships", "sources", "mentions", "match_candidates", "location_evidence"]) {
      if (!(key in body)) failures.push(`JSON export is missing "${key}"`);
    }
  } catch {
    failures.push("JSON export does not parse");
  }

  for (const entity of ["people", "places", "relationships", "mentions", "sources"]) {
    const csv = await exportGET(
      new Request(`http://localhost/api/export/quakertown?format=csv&entity=${entity}`)
    );
    const text = await csv.text();
    const header = text.split("\r\n")[0];
    if (!header || header.length === 0) failures.push(`CSV export for ${entity} has no header`);
    if (csv.status !== 200) failures.push(`CSV export for ${entity} returned ${csv.status}`);
  }

  const project = await projectGET(new Request("http://localhost/api/projects/quakertown"));
  const summary = (await project.json()) as { export_urls?: Record<string, string> };
  if (!summary.export_urls || Object.keys(summary.export_urls).length === 0) {
    failures.push("Project endpoint returned no export URLs");
  }
}

// 5. Production metadata
const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
if (/Create Next App/i.test(layout)) failures.push("app/layout.tsx still contains Create Next App metadata");

// 6. README current commands
const readme = readFileSync(join(root, "README.md"), "utf8");
const requiredCommands = [
  "npm run validate:data",
  "npm run audit:provenance",
  "npm run research:status",
  "npm run georef:status",
  "npm run review:status",
  "npm run check:release",
  "npm run check:links",
];
for (const command of requiredCommands) {
  if (!readme.includes(command)) failures.push(`README does not mention "${command}"`);
}

// 7. Public-facing copy: placeholders, TODOs, and localhost-only URLs
const publicFiles = [
  ...walk(join(root, "app")),
  ...walk(join(root, "components")),
].filter((file) => /\.(tsx|ts)$/.test(file) && !file.includes("api"));

for (const file of publicFiles) {
  const text = readFileSync(file, "utf8");
  const relative = file.replace(root + "\\", "").replace(root + "/", "");
  if (/\b(TODO|TBD|coming soon|lorem ipsum)\b/i.test(text)) {
    failures.push(`Public copy in ${relative} contains a placeholder marker`);
  }
  if (/localhost/.test(text)) {
    failures.push(`${relative} contains a localhost-only URL`);
  }
  if (/\b(AI-powered|revolutionary|generated history)\b/i.test(text)) {
    warnings.push(`${relative} contains marketing or stale language to review`);
  }
}

async function main() {
  await checkExports();

console.log("ARKIVE RELEASE AUDIT");
console.log("====================");
console.log(`Canonical records validated: ${validation.stats.people + validation.stats.places + validation.stats.relationships}`);
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

console.log(failures.length === 0 ? "\nRELEASE AUDIT PASSED" : "\nRELEASE AUDIT FAILED");
process.exit(failures.length === 0 ? 0 : 1);
}

main();
