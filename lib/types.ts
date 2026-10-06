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