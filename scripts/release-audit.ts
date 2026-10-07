import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { GET as exportGET } from "../app/api/export/[slug]/route";
import { GET as projectGET } from "../app/api/projects/[slug]/route";
import { listProjectSlugs, requireProject } from "../lib/projects";
import { validateAllProjects } from "../lib/validate-project";

// Critical checks fail the audit. Warnings are reported but do not fail it.
// Network link health is intentionally not checked here (see check:links).
const failures: string[] = [];
const warnings: string[] = [];

const root = resolve(".");
const REQUIRED_PROJECT_FILES = [
  "project.json",
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

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

// 1. At least one project exists, every data directory is complete, and no
//    leftover portability smoke-test project remains.
const slugs = listProjectSlugs();
if (slugs.length === 0) {
  failures.push("No projects were discovered under data/projects/");
}
if (slugs.includes("portability-smoke-test")) {
  failures.push('A leftover "portability-smoke-test" project directory was found. Delete it before release.');
}

const projectsDir = join(root, "data/projects");
for (const slug of existsSync(projectsDir) ? readdirSync(projectsDir, { withFileTypes: true }) : []) {
  if (!slug.isDirectory()) continue;
  const dir = join(projectsDir, slug.name);
  for (const file of REQUIRED_PROJECT_FILES) {
    if (!existsSync(join(dir, file))) {
      failures.push(`Project directory "${slug.name}" is missing required file ${file}`);
    }
  }
}

const projects = slugs.map((slug) => requireProject(slug));

// 2. Dataset validation, including manifest validation and cross-project
//    slug/number conflicts.
const validation = validateAllProjects(projects);
for (const error of validation.errors) failures.push(`Validation: ${error}`);
for (const warning of validation.warnings) warnings.push(`Validation: ${warning}`);

// 3. Provenance: every source needs a usable URL, and it must be https
for (const project of projects) {
  for (const source of project.sources) {
    if (!source.url) {
      warnings.push(`[${project.manifest.slug}] Source ${source.id} has no URL. Keep it only if no online copy exists.`);
    } else if (!source.url.startsWith("https://")) {
      failures.push(`[${project.manifest.slug}] Source ${source.id} URL is not an absolute https address: ${source.url}`);
    }
  }
}

// 4. Duplicate IDs across every dataset file, within each project
for (const slug of slugs) {
  const dataDir = join(root, "data/projects", slug);
  const seenIds = new Map<string, string>();
  for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".json") && f !== "project.json")) {
    const rows = JSON.parse(readFileSync(join(dataDir, file), "utf8")) as { id?: string }[];
    const ids = new Set<string>();
    for (const row of rows) {
      if (!row.id) continue;
      if (ids.has(row.id)) failures.push(`[${slug}] Duplicate ID ${row.id} within ${file}`);
      ids.add(row.id);
      const prior = seenIds.get(row.id);
      if (prior && prior !== file) failures.push(`[${slug}] ID ${row.id} appears in both ${prior} and ${file}`);
      seenIds.set(row.id, file);
    }
  }
}

// 5. Export and project-summary serialization, called in-process for every project
async function checkExports() {
  for (const slug of slugs) {
    const json = await exportGET(new Request(`http://localhost/api/export/${slug}?format=json`), {
      params: Promise.resolve({ slug }),
    });
    try {
      const body = JSON.parse(await json.text()) as Record<string, unknown>;
      for (const key of [
        "project",
        "people",
        "places",
        "relationships",
        "sources",
        "mentions",
        "match_candidates",
        "location_evidence",
      ]) {
        if (!(key in body)) failures.push(`[${slug}] JSON export is missing "${key}"`);
      }
    } catch {
      failures.push(`[${slug}] JSON export does not parse`);
    }

    for (const entity of ["people", "places", "relationships", "mentions", "sources"]) {
      const csv = await exportGET(
        new Request(`http://localhost/api/export/${slug}?format=csv&entity=${entity}`),
        { params: Promise.resolve({ slug }) }
      );
      const text = await csv.text();
      const header = text.split("\r\n")[0];
      const project = requireProject(slug);
      const recordCount = { people: project.people, places: project.places, relationships: project.relationships, mentions: project.mentions, sources: project.sources }[entity as "people" | "places" | "relationships" | "mentions" | "sources"].length;
      // An empty CSV is only a bug if the project actually has records of
      // that type. A project with zero people legitimately exports an empty
      // people CSV, since there are no columns to derive a header from.
      if (recordCount > 0 && (!header || header.length === 0)) {
        failures.push(`[${slug}] CSV export for ${entity} has no header, but ${recordCount} record(s) exist`);
      }
      if (csv.status !== 200) failures.push(`[${slug}] CSV export for ${entity} returned ${csv.status}`);
    }

    const project = await projectGET(new Request(`http://localhost/api/projects/${slug}`), {
      params: Promise.resolve({ slug }),
    });
    const summary = (await project.json()) as { export_urls?: Record<string, string> };
    if (!summary.export_urls || Object.keys(summary.export_urls).length === 0) {
      failures.push(`[${slug}] Project endpoint returned no export URLs`);
    }
  }

  const unknown = await projectGET(new Request("http://localhost/api/projects/does-not-exist"), {
    params: Promise.resolve({ slug: "does-not-exist" }),
  });
  if (unknown.status !== 404) {
    failures.push(`Unknown project API request did not return 404 (got ${unknown.status})`);
  }
}

// 6. Production metadata
const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
if (/Create Next App/i.test(layout)) failures.push("app/layout.tsx still contains Create Next App metadata");

// 7. README current commands
const readme = readFileSync(join(root, "README.md"), "utf8");
const requiredCommands = [
  "npm run validate:data",
  "npm run audit:provenance",
  "npm run research:status",
  "npm run georef:status",
  "npm run review:status",
  "npm run check:release",
  "npm run check:links",
  "npm run create:project",
  "npm run validate:project",
];
for (const command of requiredCommands) {
  if (!readme.includes(command)) failures.push(`README does not mention "${command}"`);
}

// 8. Public-facing copy: placeholders, TODOs, and localhost-only URLs
const publicFiles = [...walk(join(root, "app")), ...walk(join(root, "components"))].filter(
  (file) => /\.(tsx|ts)$/.test(file) && !file.includes(`${sep}api${sep}`)
);

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

// 9. Homepage project count must be derived, not hardcoded. We can't execute
//    React here, so this is a static-analysis proxy: the homepage source must
//    actually call listProjectManifests() to enumerate projects.
const homepage = readFileSync(join(root, "app/page.tsx"), "utf8");
if (!homepage.includes("listProjectManifests()")) {
  failures.push("app/page.tsx does not appear to derive its project list from listProjectManifests()");
}

async function main() {
  await checkExports();

  console.log("ARKIVE RELEASE AUDIT");
  console.log("====================");
  console.log(`Projects discovered: ${slugs.join(", ") || "none"}`);
  console.log(
    `Canonical records validated: ${projects.reduce((sum, p) => sum + p.people.length + p.places.length + p.relationships.length, 0)}`
  );
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
