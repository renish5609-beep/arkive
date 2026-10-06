import { validateQuakertownData } from "../lib/validate-quakertown";

const result = validateQuakertownData();

console.log("Quakertown dataset validation");
console.log("-----------------------------");
console.log(`Status:        ${result.valid ? "VALID" : "ISSUES DETECTED"}`);
console.log(`People:        ${result.stats.people}`);
console.log(`Places:        ${result.stats.places}`);
console.log(`Sources:       ${result.stats.sources}`);
console.log(`Relationships: ${result.stats.relationships}`);
console.log(`Errors:        ${result.errors.length}`);
console.log(`Warnings:      ${result.warnings.length}`);

if (result.errors.length > 0) {
  console.log("\nErrors:");
  for (const error of result.errors) {
    console.log(`  - ${error}`);
  }
}

if (result.warnings.length > 0) {
  console.log("\nWarnings:");
  for (const warning of result.warnings) {
    console.log(`  - ${warning}`);
  }
}

process.exit(result.valid ? 0 : 1);
