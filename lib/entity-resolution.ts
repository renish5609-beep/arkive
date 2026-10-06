import type {
  ArchivalMention,
  EntityMatchCandidate,
  MatchConfidence,
} from "@/lib/types";

// Deterministic, rule-based entity resolution. No LLM and no external calls.
// Scores are heuristics for prioritizing human review. They are not evidence
// that two mentions refer to the same historical entity.

const ADDRESS_ABBREVIATIONS: Record<string, string> = {
  street: "st",
  avenue: "ave",
  road: "rd",
  east: "e",
  west: "w",
  north: "n",
  south: "s",
};

export function normalizeHistoricalName(value: string | null): string | null {
  if (value === null) return null;

  const normalized = value
    .toLowerCase()
    .replace(/\b([a-z])\.\s*/g, "$1 ")
    .replace(/[.,'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return normalized.length > 0 ? normalized : null;
}

export function normalizeAddressText(value: string | null): string | null {
  if (value === null) return null;

  const normalized = value
    .toLowerCase()
    .replace(/[.,]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => ADDRESS_ABBREVIATIONS[token] ?? token)
    .join(" ");

  return normalized.length > 0 ? normalized : null;
}

function tokensOf(value: string | null) {
  const normalized = normalizeHistoricalName(value);
  if (!normalized) return new Set<string>();
  return new Set(normalized.split(" "));
}

export function tokenSimilarity(a: string | null, b: string | null): number {
  const tokensA = tokensOf(a);
  const tokensB = tokensOf(b);

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let shared = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) shared += 1;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  return shared / union;
}

export function confidenceForScore(score: number): MatchConfidence {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}

// Two dates are compatible when either is missing or they are equal.
function inSameTimeWindow(left: ArchivalMention, right: ArchivalMention) {
  if (!left.date_text || !right.date_text) return true;
  return left.date_text === right.date_text;
}

export function scoreMentionMatch(
  left: ArchivalMention,
  right: ArchivalMention
): {
  score: number;
  confidence: MatchConfidence;
  reasons: string[];
  conflicts: string[];
} {
  if (left.entity_type !== right.entity_type) {
    return {
      score: 0,
      confidence: "low",
      reasons: [],
      conflicts: [`Different entity types (${left.entity_type} vs ${right.entity_type})`],
    };
  }

  let score = 0;
  const reasons: string[] = [];
  const conflicts: string[] = [];

  // Name evidence
  const leftName = left.normalized_name ?? normalizeHistoricalName(left.raw_name);
  const rightName = right.normalized_name ?? normalizeHistoricalName(right.raw_name);
  const nameSimilarity = tokenSimilarity(leftName, rightName);

  if (leftName && rightName && leftName === rightName) {
    score += 45;
    reasons.push("exact normalized name (+45)");
  } else if (nameSimilarity >= 0.75) {
    score += 30;
    reasons.push("strong token-name similarity (+30)");
  } else if (leftName && rightName && nameSimilarity < 0.25) {
    score -= 50;
    conflicts.push("incompatible names (-50)");
  }

  // Address evidence
  const leftAddress = normalizeAddressText(left.address_text);
  const rightAddress = normalizeAddressText(right.address_text);

  if (leftAddress && rightAddress) {
    if (leftAddress === rightAddress) {
      score += 20;
      reasons.push("same address (+20)");
    } else if (inSameTimeWindow(left, right)) {
      score -= 40;
      conflicts.push("conflicting explicit addresses in same time window (-40)");
    }
  }

  // Occupation evidence
  const leftOccupation = normalizeHistoricalName(left.occupation_text);
  const rightOccupation = normalizeHistoricalName(right.occupation_text);

  if (leftOccupation && rightOccupation) {
    if (leftOccupation === rightOccupation) {
      score += 10;
      reasons.push("compatible occupation (+10)");
    } else {
      score -= 25;
      conflicts.push("incompatible occupation (-25)");
    }
  }

  // Relationship text corroboration
  if (
    left.relationship_text &&
    right.relationship_text &&
    tokenSimilarity(left.relationship_text, right.relationship_text) >= 0.5
  ) {
    score += 10;
    reasons.push("corroborating relationship text (+10)");
  }

  // Temporal context
  if (left.date_text && right.date_text && left.date_text === right.date_text) {
    score += 10;
    reasons.push("temporally compatible source context (+10)");
  }

  const clamped = Math.min(100, Math.max(0, score));

  return {
    score: clamped,
    confidence: confidenceForScore(clamped),
    reasons,
    conflicts,
  };
}

function plausibleOverlap(left: ArchivalMention, right: ArchivalMention) {
  const leftName = left.normalized_name ?? normalizeHistoricalName(left.raw_name);
  const rightName = right.normalized_name ?? normalizeHistoricalName(right.raw_name);
  if (tokenSimilarity(leftName, rightName) > 0) return true;

  const leftAddress = normalizeAddressText(left.address_text);
  const rightAddress = normalizeAddressText(right.address_text);
  return Boolean(leftAddress && rightAddress && leftAddress === rightAddress);
}

export function generateMatchCandidates(
  mentions: ArchivalMention[]
): EntityMatchCandidate[] {
  const candidates: EntityMatchCandidate[] = [];

  // Stable ordering so the same input always yields the same pairs and IDs
  const ordered = [...mentions].sort((a, b) => a.id.localeCompare(b.id));

  for (let i = 0; i < ordered.length; i += 1) {
    for (let j = i + 1; j < ordered.length; j += 1) {
      const left = ordered[i];
      const right = ordered[j];

      // Compare like with like only
      if (left.entity_type !== right.entity_type) continue;
      if (!plausibleOverlap(left, right)) continue;

      const result = scoreMentionMatch(left, right);
      const proposedEntity =
        left.linked_entity_id !== null &&
        left.linked_entity_id === right.linked_entity_id
          ? left.linked_entity_id
          : null;

      candidates.push({
        id: `candidate_${left.id}__${right.id}`,
        left_mention_id: left.id,
        right_mention_id: right.id,
        proposed_entity_id: proposedEntity,
        confidence: result.confidence,
        confidence_score: result.score,
        reasons: result.reasons,
        conflicting_evidence: result.conflicts,
        source_ids: [...new Set([left.source_id, right.source_id])],
        review_status: "pending",
        reviewer: null,
        reviewed_date: null,
        notes: "Heuristic match score for review prioritization. Not a historical verification.",
      });
    }
  }

  return candidates;
}
