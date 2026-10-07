import { loadSelectedProjects, resolveProjectSelection } from "../lib/cli-project";
import { validateAllProjects } from "../lib/validate-project";

// Read-only: validates every discovered project by default.
// Scope to one with: npm run validate:data -- --project <slug>
// (also exposed as npm run validate:project -- --project <slug>)
const selection = resolveProjectSelection(process.argv.slice(2), { allowAllByDefault: true });
const projects = loadSelectedProjects(selection);
const result = validateAllProjects(projects);

console.log("ARKIVE DATASET VALIDATION");
console.log("==========================");

for (const project of projects) {
  const stats = result.perProject[project.manifest.slug];

  console.log("");
  console.log(`[${project.manifest.project_number}] ${project.manifest.slug} — ${project.manifest.title}`);
  console.log(`Status:        ${stats.valid ? "VALID" : "ISSUES DETECTED"}`);
  console.log(`People:        ${stats.stats.people}`);
  console.log(`Places:        ${stats.stats.places}`);
  console.log(`Sources:       ${stats.stats.sources}`);
  console.log(`Relationships: ${stats.stats.relationships}`);
  console.log(`Location evidence: ${stats.stats.locationEvidence}`);
  console.log(`Georeference queue: ${stats.stats.georeferenceQueue}`);
  console.log(`Mappable places:   ${stats.stats.mappablePlaces}`);
  console.log(`Mentions:          ${stats.stats.mentions}`);
  console.log(
    `Match candidates:  ${stats.stats.matchCandidates} (pending ${stats.stats.pendingMatches}, accepted ${stats.stats.acceptedMatches})`
  );
  console.log(`Open research:     ${stats.stats.openResearchItems}`);
  console.log(`Errors:        ${stats.errors.length}`);
  console.log(`Warnings:      ${stats.warnings.length}`);

  if (stats.errors.length > 0) {
    console.log("Errors:");
    for (const error of stats.errors) console.log(`  - ${error}`);
  }
  if (stats.warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of stats.warnings) console.log(`  - ${warning}`);
  }
}

if (selection.isAll) {
  const crossProjectErrors = result.errors.filter((error) => !error.startsWith("["));
  console.log("");
  console.log("CROSS-PROJECT");
  if (crossProjectErrors.length > 0) {
    console.log("Errors:");
    for (const error of crossProjectErrors) console.log(`  - ${error}`);
  } else {
    console.log("No cross-project slug or number conflicts.");
  }
}

console.log("");
console.log(result.valid ? "ALL SELECTED PROJECTS VALID" : "VALIDATION FAILED");
process.exit(result.valid ? 0 : 1);
