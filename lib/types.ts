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