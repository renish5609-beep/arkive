import { getProjectMetrics } from "../lib/project-metrics";
import { listProjectManifests, requireProject } from "../lib/projects";

const manifests = listProjectManifests();

console.log("ARKIVE PROJECTS");
console.log("===============");

if (manifests.length === 0) {
  console.log("");
  console.log("No projects discovered under data/projects/.");
}

for (const manifest of manifests) {
  const project = requireProject(manifest.slug);
  const metrics = getProjectMetrics(project);

  console.log("");
  console.log(`${manifest.project_number} ${manifest.slug}`);
  console.log(manifest.title);
  console.log(`Status: ${manifest.status}`);
  console.log(`People: ${metrics.people}`);
  console.log(`Places: ${metrics.places}`);
  console.log(`Sources: ${metrics.sources}`);
  console.log(`Relationships: ${metrics.relationships}`);
  console.log(`Mentions: ${metrics.mentions}`);
  console.log(`Mappable places: ${metrics.mappablePlaces}`);
}
