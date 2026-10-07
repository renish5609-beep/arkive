# Data dictionary

This document describes the structured data behind Arkive. Arkive holds more than one reconstruction project; each project's files live in its own directory under `data/projects/<slug>/` (for example `data/projects/quakertown/`), and the TypeScript types live in `lib/types.ts`. Arkive is an open data project as well as a website, so every field is described here.

Conventions used below:

- **Nullable** means the field may be `null`. A `null` value means the information is not recorded. It does not mean the answer is "no".
- **ID fields** point to other records. Every ID must exist, but only within the same project. See "Project slug namespace" below.
- **Verification states** are described in the [provenance policy](provenance-policy.md).

## HistoricalProjectManifest

File: `project.json`, one per project directory, at `data/projects/<slug>/project.json`.

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `slug` | string | no | The project's directory name and URL segment. Must match the directory it lives in. | `freedmens-town` |
| `project_number` | string | no | A short identifying number, unique across all projects. | `002` |
| `title` | string | no | Full project title, used as the page heading. | `Freedmen's Town Reconstructed` |
| `short_title` | string | no | A shorter form, for compact display. | `Freedmen's Town` |
| `location` | string | no | Where the reconstruction is set. | `Houston, Texas` |
| `summary` | string | no | One or two sentences describing the project. | `A small source-traceable reconstruction of Houston's historic Freedmen's Town...` |
| `historical_context` | string | no | A short paragraph of historical background, supported by the project's sources. | See `data/projects/freedmens-town/project.json`. |
| `status` | ProjectStatus | no | `active_research`, `pilot`, or `archived`. | `pilot` |
| `date_range` | string | yes | The period the reconstruction covers, in plain text. | `1865-mid 20th century` |
| `featured` | boolean | no | Whether the project is highlighted on the homepage and project list. | `true` |
| `source_note` | string | no | What kind of sources the project currently relies on, and how thoroughly they have been read. | See any `project.json`. |
| `research_scope` | string | no | A plain statement of what the reconstruction does and does not yet cover. | `This is a portability pilot, not a comprehensive reconstruction...` |

## HistoricalProjectData

Not a file on disk. This is the shape `lib/projects.ts` assembles in memory after reading a project's ten files: `manifest` (from `project.json`), plus `people`, `places`, `sources`, `relationships`, `locationEvidence`, `georeferenceQueue`, `mentions`, `matchCandidates`, and `researchQueue` (one array per remaining file). Every function that operates on project data takes this shape as its first argument, so project-scoped logic never has to be written twice.

## Project slug namespace

A project's slug is the boundary for every ID in its data. Validation builds its ID sets from one project's files at a time, so:

- the same entity ID (for example `place_001`) may exist in two different projects without colliding;
- a relationship, mention, or match candidate in one project can never reference a record in another project, even accidentally — such a reference simply fails as "missing", because the other project's IDs are never in scope;
- no cross-project identity merging exists yet. The same historical person appearing in two projects remains two separate records.

The directory contract for a project is fixed. Every project under `data/projects/<slug>/` must contain exactly these ten files: `project.json`, `people.json`, `places.json`, `sources.json`, `relationships.json`, `location-evidence.json`, `georeference-queue.json`, `mentions.json`, `match-candidates.json`, `research-queue.json`. Projects are discovered from this directory at runtime; adding one never requires a registry edit. See the top-level README for the `create:project` command that scaffolds a new one.

## Shared values

### `VerificationStatus`

| Value | Meaning |
| --- | --- |
| `unverified` | Recorded but not yet checked by a person against its source. |
| `machine_suggested` | Proposed by an automated process. A lead, not a finding. |
| `human_reviewed` | Checked by a person against the source description. Not a claim of exhaustive archival verification. |
| `verified` | Confirmed by a person against the original archival material. |

### `GeoreferenceStatus`

| Value | Meaning |
| --- | --- |
| `unresolved` | The evidence does not support a location. No marker is drawn. |
| `approximate` | The evidence supports an area or relative position. Drawn with an uncertainty marker. |
| `exact` | Coordinates with documented provenance. |

## HistoricalPerson

File: `people.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `person_` plus a number. | `person_004` |
| `name` | string | no | Name as recorded in the reconstruction. | `William Evelyn Woods` |
| `aliases` | string[] | no (may be empty) | Other names a source uses for this person. Add only when a source supports the variation. | `["Fred Moore"]` |
| `birth_year` | number | yes | Year of birth, only if a source gives it. | `1948` |
| `death_year` | number | yes | Year of death, only if a source gives it. | `null` |
| `occupation` | string | yes | Occupation, only if a source states it. | `Clergyman` |
| `residences` | string[] | no (may be empty) | IDs of place records where the person lived. Each ID must exist. | `["place_001", "place_002"]` |
| `relationships` | string[] | no (may be empty) | Reserved. Relationships are stored in `relationships.json`. | `[]` |
| `source_ids` | string[] | no | Sources that support this record. At least one is expected. | `["source_004"]` |
| `verification_status` | VerificationStatus | no | How far the record has been checked. | `human_reviewed` |
| `notes` | string | no | What the sources support, stated concisely. | `Owner of the Woods House.` |

## HistoricalPlace

File: `places.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `place_` plus a number. | `place_005` |
| `name` | string | no | Name of the site as recorded. | `Maude Woods Clark Hembry House - Solomon Hill` |
| `historical_address` | string | yes | Address as the source gives it. Not a coordinate. | `97 Terry Street, Denton, Texas` |
| `modern_address` | string | yes | Current address, if one is documented. | `1129 East Hickory Street, Denton, Texas` |
| `latitude` | number | yes | Latitude in decimal degrees (-90 to 90). Null unless the location is georeferenced. | `33.2144654` |
| `longitude` | number | yes | Longitude in decimal degrees (-180 to 180). Null unless the location is georeferenced. | `-97.1194724` |
| `place_type` | string | no | Kind of place, such as `residence` or `school`. | `residence` |
| `source_ids` | string[] | no | Sources that support this place record. | `["source_006"]` |
| `verification_status` | VerificationStatus | no | How far the record has been checked. | `human_reviewed` |
| `notes` | string | no | What the sources support. | `Moved in 1921 ...` |
| `georeference_status` | GeoreferenceStatus | no | Spatial confidence. Must match the coordinates and evidence. | `exact` |
| `location_evidence_ids` | string[] | no (may be empty) | IDs of `LocationEvidence` records. Required when status is `exact` or `approximate`. | `["location_evidence_003"]` |

Coordinates may only be set with documented provenance. A street name that still exists is not evidence of a historical location.

## HistoricalRelationship

File: `relationships.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `relationship_` plus a number. | `relationship_006` |
| `from_entity_id` | string | no | ID of a person or place. Must exist. | `place_004` |
| `to_entity_id` | string | no | ID of a person or place. Must exist. | `place_005` |
| `relationship_type` | string | no | Kind of relationship. Common values: `owned`, `relocated_to`, `principal_of`, `parent_of`. | `relocated_to` |
| `start_year` | number | yes | Year the relationship began, if a source gives it. | `1921` |
| `end_year` | number | yes | Year the relationship ended, if a source gives it. | `1921` |
| `source_ids` | string[] | no | Sources that support the relationship. At least one is expected. | `["source_006"]` |
| `verification_status` | VerificationStatus | no | How far the relationship has been checked. | `human_reviewed` |
| `notes` | string | no | Concise statement of what the source supports. | `The house at 97 Terry Street was moved ...` |

## HistoricalSource

File: `sources.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `source_` plus a number. | `source_002` |
| `title` | string | no | Title of the source as its holder gives it. | `OH 1642: Reginald Logan` |
| `source_type` | string | no | Kind of source, such as `oral_history` or `government_record`. | `oral_history` |
| `creator` | string | yes | Interviewer, author, or creating body. | `Sherelyn Yancey` |
| `date` | string | yes | Date of the source, in `YYYY-MM-DD` where known. | `2006-11-28` |
| `archive` | string | yes | Holding institution. | `University of North Texas Oral History Program` |
| `url` | string | yes | Full `https` address of the source. Should be checked with `check:links`. | `https://oralhistory.unt.edu/oh-1642` |
| `citation` | string | yes | Citation for the source. | `Reginald Logan, interview by ...` |
| `rights` | string | yes | Access or rights statement, if recorded. | `Open` |
| `accessed_date` | string | yes | Date Arkive last accessed the source, `YYYY-MM-DD`. | `2026-10-05` |
| `notes` | string | no | What the source covers, in Arkive's words. | `Interview with a descendant ...` |

## ArchivalMention

File: `mentions.json`

A mention is one occurrence of a name, place, or institution in one source. It is not a canonical record. It becomes part of a record only through `linked_entity_id`.

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `mention_` plus a three-digit number. | `mention_010` |
| `source_id` | string | no | Source where the mention appears. Must exist. | `source_005` |
| `entity_type` | `person`, `place`, `institution`, `household`, or `unknown` | no | Kind of thing the mention refers to. | `institution` |
| `raw_name` | string | yes | Name exactly as it appears in the source. | `Original Fred Douglass School` |
| `normalized_name` | string | yes | Lowercase, punctuation-free form of `raw_name`, produced by the normalization rules. Must match them. | `original fred douglass school` |
| `date_text` | string | yes | Date as the source states it. | `1921` |
| `address_text` | string | yes | Address as the source states it. Not a coordinate. | `Corner of Terry Street and Holt Street, Denton, Texas` |
| `occupation_text` | string | yes | Occupation as the source states it. | `Educator` |
| `relationship_text` | string | yes | Relationship as the source states it. | `Relocated from 97 Terry Street in 1921` |
| `page_or_locator` | string | yes | Page, timestamp, or other locator within the source. | `p. 12` |
| `excerpt` | string | yes | Short quotation or paraphrase, labelled as such in `notes`. | `Documents a house built in 1905 ...` |
| `linked_entity_id` | string | yes | Canonical person or place this mention is confirmed to refer to. Null when identity is not established. | `place_005` |
| `verification_status` | VerificationStatus | no | How far the mention has been checked against its source. | `human_reviewed` |
| `notes` | string | no | Context, including what is uncertain. | `Linked to place_005.` |

## EntityMatchCandidate

File: `match-candidates.json`

A candidate is a heuristic proposal that two mentions may refer to the same entity. It is generated by fixed rules and reviewed by a person.

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, derived from the two mention IDs. | `candidate_mention_012__mention_011` |
| `left_mention_id` | string | no | First mention in the pair. Must exist and differ from the right mention. | `mention_011` |
| `right_mention_id` | string | no | Second mention in the pair. | `mention_012` |
| `proposed_entity_id` | string | yes | Canonical entity the pair would link to. Only set when both mentions already link to it. | `null` |
| `confidence` | `low`, `medium`, or `high` | no | Band for the score. Must match `confidence_score`. | `low` |
| `confidence_score` | number | no | Heuristic score from 0 to 100. Not a probability of identity. | `45` |
| `reasons` | string[] | no (may be empty) | Positive evidence the rules found. | `["exact normalized name (+45)"]` |
| `conflicting_evidence` | string[] | no (may be empty) | Negative evidence the rules found. Always shown to reviewers. | `["incompatible names (-50)"]` |
| `source_ids` | string[] | no | Sources of the two mentions. | `["source_006"]` |
| `review_status` | `pending`, `accepted`, `rejected`, or `needs_more_evidence` | no | Human decision. Generation sets `pending` and never overwrites a reviewed decision. | `pending` |
| `reviewer` | string | yes | Who made the decision. Required when accepted. | `null` |
| `reviewed_date` | string | yes | Date of the decision, `YYYY-MM-DD`. Required when accepted. | `null` |
| `notes` | string | no | Reason for the decision. Required in practice when rejected. | `Heuristic score for review prioritization. Not a historical verification.` |

## LocationEvidence

File: `location-evidence.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `location_evidence_` plus a number. | `location_evidence_003` |
| `place_id` | string | no | Place this evidence concerns. Must exist, and must match the place's `location_evidence_ids`. | `place_005` |
| `status` | GeoreferenceStatus | no | Spatial confidence this evidence supports. | `exact` |
| `method` | `modern_address_geocode`, `historical_map`, `intersection`, `parcel`, `relative_description`, `archival_coordinate`, or `human_review` | no | How the location was derived. | `modern_address_geocode` |
| `latitude` | number | yes | Must be null when status is `unresolved`. Required when status is `exact` or `approximate`. | `33.2144654` |
| `longitude` | number | yes | As for `latitude`. | `-97.1194724` |
| `radius_meters` | number | yes | Uncertainty radius. Must be positive when present. Expected for `approximate`. | `null` |
| `source_ids` | string[] | no | Sources the evidence relies on. | `["source_006"]` |
| `evidence_text` | string | no | Plain-language statement of the evidence. | `The relocated house is documented at 1129 East Hickory Street.` |
| `reviewer` | string | yes | Who reviewed the location. | `Claude Code geocode verification` |
| `reviewed_date` | string | yes | Date of review, `YYYY-MM-DD`. | `2026-10-06` |
| `notes` | string | no | How the location was derived, and what it does not establish. | Describes the geocoding query and its limits. |

## GeoreferenceQueueItem

File: `georeference-queue.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `geo_queue_` plus a number. | `geo_queue_002` |
| `place_id` | string | no | Place needing a location. Must exist. | `place_004` |
| `priority` | `high`, `medium`, or `low` | no | How urgently the question matters. | `high` |
| `research_question` | string | no | The question to answer. | `Where was 97 Terry Street located ...?` |
| `suggested_sources` | string[] | no (may be empty) | Places to look for evidence. These are suggestions, not sources. | `["Sanborn or other period maps"]` |
| `status` | `open`, `blocked`, or `resolved` | no | Current state. A resolved item requires its place to have a location. | `open` |
| `notes` | string | no | Context and cautions. | `Do not use a present-day Terry Street result ...` |

## ResearchQueueItem

File: `research-queue.json`

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier, `research_` plus a number. | `research_002` |
| `kind` | `person_identity`, `place_identity`, `relationship`, `source_followup`, or `biographical_field` | no | What the question is about. | `place_identity` |
| `entity_ids` | string[] | no (may be empty) | Canonical records the question concerns. Each must exist. | `["place_003"]` |
| `mention_ids` | string[] | no (may be empty) | Mentions the question concerns. Each must exist. | `["mention_005", "mention_010"]` |
| `question` | string | no | The open question. | `Is the Frederick Douglass Colored School the same institution ...?` |
| `priority` | `high`, `medium`, or `low` | no | How urgently the question matters. | `high` |
| `status` | `open`, `blocked`, or `resolved` | no | Current state. A resolved item needs a resolution note. | `open` |
| `suggested_sources` | string[] | no (may be empty) | Where to look. Suggestions, not evidence. | `["UNT Oral History OH 1212 full transcript"]` |
| `notes` | string | no | Context and cautions. | `Keep the mentions separate until a source confirms identity.` |

## ExternalReview

File: `external-reviews.json` (an array; empty until a review actually happens)

The examples in this table are illustrative. They are not real reviews, and the data file is empty until a review actually happens.

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier for the review. | `review_001` |
| `reviewer_role` | string | no | Role of the reviewer, such as `historian` or `educator`. | `educator` |
| `organization` | string | yes | Organization, only if the reviewer agrees to it being recorded. | `null` |
| `date` | string | no | Date of the review, `YYYY-MM-DD`. | `2026-11-01` |
| `scope` | string | no | What the reviewer looked at. | `Quakertown project page and one source` |
| `feedback_summary` | string | no | Summary of the feedback, written by Arkive. | `Provenance was clear; the map legend was unclear.` |
| `changes_made` | string[] | no (may be empty) | Changes Arkive made in response. | `["Clarified the map legend"]` |
| `permission_to_name` | boolean | no | Whether the reviewer agreed to be named publicly. | `false` |
| `public_name` | string | yes | Name to show publicly. Only when `permission_to_name` is true. | `null` |
| `project_slug` | string | yes | `null` for a platform-wide review of Arkive in general, or a project slug if the review was about one specific project. | `"quakertown"` |

## OutreachLogItem

File: `data/outreach-log.json` (an array; empty until outreach is actually sent)

| Field | Type | Nullable | Meaning | Example |
| --- | --- | --- | --- | --- |
| `id` | string | no | Stable identifier for the outreach entry. | `outreach_001` |
| `category` | `historian`, `educator`, `archive`, `community`, or `digital_humanities` | no | Who was contacted. | `historian` |
| `organization` | string | yes | Organization, if relevant and known. | `null` |
| `contact_name` | string | yes | Name of the contact, if recorded. | `null` |
| `contact_method` | `email`, `form`, `in_person`, or `other` | no | How they were contacted. | `email` |
| `date_sent` | string | no | Date the outreach was sent, `YYYY-MM-DD`. | `2026-11-01` |
| `ask` | string | no | What was asked of them. | `15-20 minute asynchronous review` |
| `status` | `sent`, `replied`, `review_scheduled`, `review_completed`, `declined`, or `no_response` | no | Current state. | `sent` |
| `follow_up_date` | string | yes | Date a follow-up is planned, `YYYY-MM-DD`. | `null` |
| `notes` | string | no | Context. | `""` |
| `project_slug` | string | yes | `null` for platform-wide outreach, or a project slug if the outreach was specifically about one project. | `null` |
