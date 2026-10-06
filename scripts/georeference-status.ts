import {
  georeferenceQueue,
  places,
} from "../lib/quakertown";

const priorityRank = {
  high: 0,
  medium: 1,
  low: 2,
};

const sorted = [...georeferenceQueue].sort((a, b) => {
  const priorityDifference =
    priorityRank[a.priority] - priorityRank[b.priority];

  if (priorityDifference !== 0) return priorityDifference;

  return a.id.localeCompare(b.id);
});

console.log("ARKIVE GEOREFERENCE QUEUE");
console.log("========================");
console.log("");

for (const item of sorted) {
  const place = places.find((candidate) => candidate.id === item.place_id);

  console.log(
    `[${item.priority.toUpperCase()}] ${place?.name ?? item.place_id}`
  );
  console.log(`Status: ${item.status}`);
  console.log(`Question: ${item.research_question}`);
  console.log("");
}

const open = sorted.filter((item) => item.status === "open").length;
const blocked = sorted.filter((item) => item.status === "blocked").length;
const resolved = sorted.filter((item) => item.status === "resolved").length;

console.log("SUMMARY");
console.log(`Open: ${open}`);
console.log(`Blocked: ${blocked}`);
console.log(`Resolved: ${resolved}`);
