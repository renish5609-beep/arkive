import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMatchCandidates } from "../lib/entity-resolution";
import { mentions, matchCandidates } from "../lib/quakertown";
import type { EntityMatchCandidate } from "../lib/types";

// Dry-run by default. Pass --write to update match-candidates.json.
const shouldWrite = process.argv.includes("--write");
const candidatePath = resolve("data/projects/quakertown/match-candidates.json");

function pairKey(candidate: EntityMatchCandidate) {
  return [candidate.left_mention_id, candidate.right_mention_id].sort().join("|");
}

const generated = generateMatchCandidates(mentions);
const generatedKeys = new Set(generated.map(pairKey));

// Reviewed decisions (accepted/rejected/needs_more_evidence) are never replaced.
const reviewed = matchCandidates.filter((candidate) => candidate.review_status !== "pending");
const reviewedKeys = new Set(reviewed.map(pairKey));

// Pending candidates are regenerated from current mentions. Pairs that have
// already been reviewed keep their existing record.
const regenerated = generated.filter((candidate) => !reviewedKeys.has(pairKey(candidate)));

const staleCount = matchCandidates.filter(
  (candidate) =>
    candidate.review_status === "pending" && !generatedKeys.has(pairKey(candidate))
).length;

const next = [...reviewed, ...regenerated].sort((a, b) => a.id.localeCompare(b.id));

const byConfidence = { high: 0, medium: 0, low: 0 };
for (const candidate of regenerated) byConfidence[candidate.confidence] += 1;

console.log("ARKIVE MATCH CANDIDATES");
console.log("=======================");
console.log(shouldWrite ? "Mode: WRITE" : "Mode: dry run (pass --write to save)");
console.log("");
console.log(`Mentions scanned:        ${mentions.length}`);
console.log(`Pairs generated:         ${generated.length}`);
console.log(`Reviewed kept as-is:     ${reviewed.length}`);
console.log(`Pending after run:       ${regenerated.length}`);
console.log(`Stale pending removed:   ${staleCount}`);
console.log("");
console.log("Confidence (pending):");
console.log(`  High:   ${byConfidence.high}`);
console.log(`  Medium: ${byConfidence.medium}`);
console.log(`  Low:    ${byConfidence.low}`);
console.log("");
console.log("Top pending candidates (heuristic score, not certainty):");

const top = [...regenerated]
  .sort((a, b) => b.confidence_score - a.confidence_score || a.id.localeCompare(b.id))
  .slice(0, 5);

if (top.length === 0) console.log("  none");
for (const candidate of top) {
  const left = mentions.find((mention) => mention.id === candidate.left_mention_id);
  const right = mentions.find((mention) => mention.id === candidate.right_mention_id);
  console.log(
    `  [${candidate.confidence_score}/100 ${candidate.confidence}] ${left?.raw_name ?? "?"} <> ${right?.raw_name ?? "?"}`
  );
  if (candidate.conflicting_evidence.length > 0) {
    console.log(`      conflicts: ${candidate.conflicting_evidence.join("; ")}`);
  }
}

if (shouldWrite) {
  writeFileSync(candidatePath, JSON.stringify(next, null, 2) + "\n");
  console.log("");
  console.log(`Wrote ${next.length} candidates to data/projects/quakertown/match-candidates.json`);
} else {
  // Confirm the file on disk matches what the loader sees, to avoid surprises
  const onDisk = JSON.parse(readFileSync(candidatePath, "utf8")) as unknown[];
  console.log("");
  console.log(`No changes written. Candidates currently on disk: ${onDisk.length}`);
}
