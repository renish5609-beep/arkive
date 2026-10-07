import { loadSelectedProjects, resolveProjectSelection } from "../lib/cli-project";

const selection = resolveProjectSelection(process.argv.slice(2), { allowAllByDefault: true });
const projects = loadSelectedProjects(selection);

const count = <T,>(items: T[], predicate: (item: T) => boolean) => items.filter(predicate).length;

console.log("ARKIVE RESEARCH STATUS");
console.log("======================");

for (const project of projects) {
  const { manifest, people, places, sources, relationships, mentions, matchCandidates, researchQueue } = project;

  const resolvedMentions = count(mentions, (mention) => mention.linked_entity_id !== null);
  const unresolvedMentions = mentions.length - resolvedMentions;

  const pending = count(matchCandidates, (c) => c.review_status === "pending");
  const highPending = count(matchCandidates, (c) => c.review_status === "pending" && c.confidence === "high");
  const accepted = count(matchCandidates, (c) => c.review_status === "accepted");
  const rejected = count(matchCandidates, (c) => c.review_status === "rejected");
  const needsEvidence = count(matchCandidates, (c) => c.review_status === "needs_more_evidence");

  const open = count(researchQueue, (item) => item.status === "open");
  const blocked = count(researchQueue, (item) => item.status === "blocked");
  const resolved = count(researchQueue, (item) => item.status === "resolved");

  console.log("");
  console.log(`[${manifest.project_number}] ${manifest.slug} — ${manifest.title}`);
  console.log("CANONICAL DATA");
  console.log(`People: ${people.length}`);
  console.log(`Places: ${places.length}`);
  console.log(`Sources: ${sources.length}`);
  console.log(`Relationships: ${relationships.length}`);
  console.log("EVIDENCE");
  console.log(`Mentions: ${mentions.length}`);
  console.log(`Resolved mentions: ${resolvedMentions}`);
  console.log(`Unresolved mentions: ${unresolvedMentions}`);
  console.log("ENTITY RESOLUTION");
  console.log(`Pending matches: ${pending}`);
  console.log(`High-confidence pending: ${highPending}`);
  console.log(`Accepted: ${accepted}`);
  console.log(`Rejected: ${rejected}`);
  console.log(`Needs more evidence: ${needsEvidence}`);
  console.log("RESEARCH QUEUE");
  console.log(`Open: ${open}`);
  console.log(`Blocked: ${blocked}`);
  console.log(`Resolved: ${resolved}`);
}

console.log("");
console.log("Note: match scores are heuristics for review, not historical verification.");
