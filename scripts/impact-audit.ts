import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateExternalReviews } from "../lib/external-reviews";
import type { ExternalReview, OutreachLogItem } from "../lib/types";

// Fails when published impact counts are larger than the recorded evidence.
// A count above its evidence needs a tagged note in project-impact.json:
//   "external_reviews: ..."  "educators: ..."  "contributor: ..."
//   "classroom: ..."         "presentation: ..."
// Those notes must describe a real event. Feedback alone never counts as a contributor.

interface ImpactFile {
  external_reviews: number;
  educators_contacted: number;
  classrooms_using: number;
  community_contributors: number;
  presentations: number;
  notes: string[];
}

const impact = JSON.parse(readFileSync(resolve("data/project-impact.json"), "utf8")) as ImpactFile;
const reviews = JSON.parse(readFileSync(resolve("data/external-reviews.json"), "utf8")) as ExternalReview[];
const outreach = JSON.parse(readFileSync(resolve("data/outreach-log.json"), "utf8")) as OutreachLogItem[];

const failures: string[] = [];
const warnings: string[] = [];

const hasNote = (tag: string) =>
  impact.notes.some((note) => note.trim().toLowerCase().startsWith(`${tag}:`));

// Integers and non-negative values
for (const key of ["external_reviews", "educators_contacted", "classrooms_using", "community_contributors", "presentations"] as const) {
  const value = impact[key];
  if (!Number.isInteger(value) || value < 0) {
    failures.push(`${key} must be a non-negative integer (found ${value})`);
  }
}

// Review records are the source of truth for external reviews
for (const error of validateExternalReviews(reviews)) failures.push(`External review ${error}`);

if (impact.external_reviews !== reviews.length && !hasNote("external_reviews")) {
  failures.push(
    `external_reviews is ${impact.external_reviews} but ${reviews.length} review record(s) exist; correct the count or add an "external_reviews:" note`
  );
}

// Outreach log integrity
const validStatuses = ["sent", "replied", "review_scheduled", "review_completed", "declined", "no_response"];
const validCategories = ["historian", "educator", "archive", "community", "digital_humanities"];
const validMethods = ["email", "form", "in_person", "other"];
outreach.forEach((item, index) => {
  const label = item.id || `outreach entry ${index + 1}`;
  if (!item.id) failures.push(`${label}: id is empty`);
  if (!validStatuses.includes(item.status)) failures.push(`${label}: unknown status "${item.status}"`);
  if (!validCategories.includes(item.category)) failures.push(`${label}: unknown category "${item.category}"`);
  if (!validMethods.includes(item.contact_method)) failures.push(`${label}: unknown contact_method "${item.contact_method}"`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date_sent)) failures.push(`${label}: date_sent must be YYYY-MM-DD`);
  if (!item.ask || item.ask.trim() === "") failures.push(`${label}: ask is empty`);
});

const educatorOutreach = outreach.filter((item) => item.category === "educator").length;
if (impact.educators_contacted > educatorOutreach && !hasNote("educators")) {
  failures.push(
    `educators_contacted is ${impact.educators_contacted} but only ${educatorOutreach} educator outreach entr${educatorOutreach === 1 ? "y" : "ies"} are logged; add an "educators:" note explaining the other contact method`
  );
}

const completedOutreach = outreach.filter((item) => item.status === "review_completed").length;
if (completedOutreach > reviews.length) {
  failures.push(
    `${completedOutreach} outreach entries are review_completed but only ${reviews.length} review record(s) exist`
  );
}

// Tagged evidence for every non-zero event count
if (impact.community_contributors > 0 && !hasNote("contributor")) {
  failures.push("community_contributors is above zero without a \"contributor:\" note describing a real contribution");
}
if (impact.classrooms_using > 0 && !hasNote("classroom")) {
  failures.push("classrooms_using is above zero without a \"classroom:\" note describing actual classroom use");
}
if (impact.presentations > 0 && !hasNote("presentation")) {
  failures.push("presentations is above zero without a \"presentation:\" note describing an actual event");
}

if (reviews.length === 0 && impact.external_reviews === 0) {
  warnings.push("No external reviews recorded yet. This is the expected starting state.");
}

console.log("ARKIVE IMPACT AUDIT");
console.log("===================");
console.log(`Recorded reviews: ${reviews.length}`);
console.log(`Outreach entries: ${outreach.length}`);
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

console.log(failures.length === 0 ? "\nIMPACT AUDIT PASSED" : "\nIMPACT AUDIT FAILED");
process.exit(failures.length === 0 ? 0 : 1);
