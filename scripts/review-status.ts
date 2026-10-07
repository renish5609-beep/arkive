import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateExternalReviews } from "../lib/external-reviews";
import { listProjectSlugs } from "../lib/projects";
import type { ExternalReview } from "../lib/types";

// Reads only what has actually been recorded. Counts are never estimated.
const reviews = JSON.parse(
  readFileSync(resolve("data/external-reviews.json"), "utf8")
) as ExternalReview[];
const impact = JSON.parse(
  readFileSync(resolve("data/project-impact.json"), "utf8")
) as {
  educators_contacted: number;
  classrooms_using: number;
  community_contributors: number;
  presentations: number;
};

const errors = validateExternalReviews(reviews, listProjectSlugs());

console.log("ARKIVE EXTERNAL VALIDATION");
console.log("==========================");
console.log(`External reviews: ${reviews.length}`);
console.log(`Educators contacted: ${impact.educators_contacted}`);
console.log(`Classrooms using: ${impact.classrooms_using}`);
console.log(`Community contributors: ${impact.community_contributors}`);
console.log(`Presentations: ${impact.presentations}`);
console.log("");
console.log("Counts reflect recorded events only. A zero means nothing has been recorded yet.");

if (errors.length > 0) {
  console.log("");
  console.log("Malformed review records:");
  for (const error of errors) console.log(`  - ${error}`);
  console.log("REVIEW STATUS FAILED");
  process.exit(1);
}

console.log("Review records are well formed.");
