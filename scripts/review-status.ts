import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Reads only what has actually been recorded. Counts are never estimated.
const reviews = JSON.parse(
  readFileSync(resolve("data/external-reviews.json"), "utf8")
) as unknown[];
const impact = JSON.parse(
  readFileSync(resolve("data/project-impact.json"), "utf8")
) as {
  educators_contacted: number;
  classrooms_using: number;
  community_contributors: number;
  presentations: number;
};

console.log("ARKIVE EXTERNAL VALIDATION");
console.log("==========================");
console.log(`External reviews: ${reviews.length}`);
console.log(`Educators contacted: ${impact.educators_contacted}`);
console.log(`Classrooms using: ${impact.classrooms_using}`);
console.log(`Community contributors: ${impact.community_contributors}`);
console.log(`Presentations: ${impact.presentations}`);
console.log("");
console.log("Counts reflect recorded events only. A zero means nothing has been recorded yet.");
