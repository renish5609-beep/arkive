import { loadSelectedProjects, resolveProjectSelection } from "../lib/cli-project";

const selection = resolveProjectSelection(process.argv.slice(2), { allowAllByDefault: true });
const projects = loadSelectedProjects(selection);

const priorityRank = { high: 0, medium: 1, low: 2 };

console.log("ARKIVE GEOREFERENCE QUEUE");
console.log("========================");

let totalOpen = 0;
let totalBlocked = 0;
let totalResolved = 0;

for (const project of projects) {
  const sorted = [...project.georeferenceQueue].sort((a, b) => {
    const priorityDifference = priorityRank[a.priority] - priorityRank[b.priority];
    if (priorityDifference !== 0) return priorityDifference;
    return a.id.localeCompare(b.id);
  });

  console.log("");
  console.log(`[${project.manifest.project_number}] ${project.manifest.slug} — ${project.manifest.title}`);
  console.log("");

  for (const item of sorted) {
    const place = project.places.find((candidate) => candidate.id === item.place_id);
    console.log(`[${item.priority.toUpperCase()}] ${place?.name ?? item.place_id}`);
    console.log(`Status: ${item.status}`);
    console.log(`Question: ${item.research_question}`);
    console.log("");
  }

  const open = sorted.filter((item) => item.status === "open").length;
  const blocked = sorted.filter((item) => item.status === "blocked").length;
  const resolved = sorted.filter((item) => item.status === "resolved").length;
  totalOpen += open;
  totalBlocked += blocked;
  totalResolved += resolved;

  console.log("SUMMARY");
  console.log(`Open: ${open}`);
  console.log(`Blocked: ${blocked}`);
  console.log(`Resolved: ${resolved}`);
}

if (selection.isAll && projects.length > 1) {
  console.log("");
  console.log("TOTAL ACROSS PROJECTS");
  console.log(`Open: ${totalOpen}`);
  console.log(`Blocked: ${totalBlocked}`);
  console.log(`Resolved: ${totalResolved}`);
}
