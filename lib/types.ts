export type VerificationStatus =
  | "unverified"
  | "machine_suggested"
  | "human_reviewed"
  | "verified";

export interface HistoricalPerson {
  id: string;
  name: string;
  aliases: string[];
  birth_year: number | null;
  death_year: number | null;
  occupation: string | null;
  residences: string[];
  relationships: string[];
  source_ids: string[];
  verification_status: VerificationStatus;
  notes: string;
}

export type GeoreferenceStatus =
  | "unresolved"
  | "approximate"
  | "exact";

export type GeoreferenceMethod =
  | "modern_address_geocode"
  | "historical_map"
  | "intersection"
  | "parcel"
  | "relative_description"
  | "archival_coordinate"
  | "human_review";

export interface LocationEvidence {
  id: string;
  place_id: string;
  status: GeoreferenceStatus;
  method: GeoreferenceMethod;
  latitude: number | null;
  longitude: number | null;
  radius_meters: number | null;
  source_ids: string[];
  evidence_text: string;
  reviewer: string | null;
  reviewed_date: string | null;
  notes: string;
}

export interface GeoreferenceQueueItem {
  id: string;
  place_id: string;
  priority: "high" | "medium" | "low";
  research_question: string;
  suggested_sources: string[];
  status: "open" | "blocked" | "resolved";
  notes: string;
}

export interface HistoricalPlace {
  id: string;
  name: string;
  historical_address: string | null;
  modern_address: string | null;
  latitude: number | null;
  longitude: number | null;
  place_type: string;
  source_ids: string[];
  verification_status: VerificationStatus;
  notes: string;
  georeference_status: GeoreferenceStatus;
  location_evidence_ids: string[];
}

export interface HistoricalSource {
  id: string;
  title: string;
  source_type: string;
  creator: string | null;
  date: string | null;
  archive: string | null;
  url: string | null;
  citation: string | null;
  rights: string | null;
  accessed_date: string | null;
  notes: string;
}

export interface HistoricalRelationship {
  id: string;
  from_entity_id: string;
  to_entity_id: string;
  relationship_type: string;
  start_year: number | null;
  end_year: number | null;
  source_ids: string[];
  verification_status: VerificationStatus;
  notes: string;
}

export type MentionEntityType =
  | "person"
  | "place"
  | "institution"
  | "household"
  | "unknown";

export type MatchReviewStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "needs_more_evidence";

export type MatchConfidence = "low" | "medium" | "high";

export interface ArchivalMention {
  id: string;
  source_id: string;
  entity_type: MentionEntityType;
  raw_name: string | null;
  normalized_name: string | null;
  date_text: string | null;
  address_text: string | null;
  occupation_text: string | null;
  relationship_text: string | null;
  page_or_locator: string | null;
  excerpt: string | null;
  linked_entity_id: string | null;
  verification_status: VerificationStatus;
  notes: string;
}

export interface EntityMatchCandidate {
  id: string;
  left_mention_id: string;
  right_mention_id: string;
  proposed_entity_id: string | null;
  confidence: MatchConfidence;
  confidence_score: number;
  reasons: string[];
  conflicting_evidence: string[];
  source_ids: string[];
  review_status: MatchReviewStatus;
  reviewer: string | null;
  reviewed_date: string | null;
  notes: string;
}

export interface ResearchQueueItem {
  id: string;
  kind:
    | "person_identity"
    | "place_identity"
    | "relationship"
    | "source_followup"
    | "biographical_field";
  entity_ids: string[];
  mention_ids: string[];
  question: string;
  priority: "high" | "medium" | "low";
  status: "open" | "blocked" | "resolved";
  suggested_sources: string[];
  notes: string;
}


export interface ExternalReview {
  id: string;
  reviewer_role: string;
  organization: string | null;
  date: string;
  scope: string;
  feedback_summary: string;
  changes_made: string[];
  permission_to_name: boolean;
  public_name: string | null;
}
