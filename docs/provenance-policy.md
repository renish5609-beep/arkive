# Provenance policy

Last updated: 2026-10-06

This policy explains how Arkive decides what goes into a historical reconstruction, how confident it is, and how mistakes are corrected. It is written for historians, educators, students, and community members. You do not need to know how the software works to read it.

## 1. What qualifies as a source

A source is a record that someone other than Arkive created, and that can be checked. Examples:

- oral history interviews and their transcripts, such as the University of North Texas Oral History Program collections;
- government and local records, such as deeds, plats, tax records, and county histories;
- maps, including period fire insurance and city maps;
- census records, city directories, and newspapers;
- photographs and their catalog descriptions;
- historical marker research and narratives from official bodies.

These do not count as sources on their own:

- general websites, blog posts, or unsourced genealogy pages;
- AI-generated text of any kind;
- search-engine snippets, which can change or disappear;
- a modern map showing a street that still exists today.

Where Arkive holds only a short description of a source, the record says so. A description is not the same as the source itself.

## 2. Source fact and Arkive interpretation

Arkive keeps two kinds of statement apart:

- **Source fact:** what a source says, close to its own wording. Example: "The source description names Alberta Woods alongside William Evelyn Woods."
- **Arkive interpretation:** a conclusion Arkive draws from one or more sources. Example: "These two people lived in the same household."

Interpretations must cite their sources. When a source does not support an interpretation, Arkive records a research question instead of stating the interpretation as fact.

## 3. Verification states

Every record has one of four verification states. The state describes how far a person has checked the record. It does not describe how important the record is.

| State | What it means |
| --- | --- |
| **Unverified** | Entered, but no person has checked it against its source yet. |
| **Machine suggested** | Proposed by an automated process. Treat it as a lead for research. |
| **Human reviewed** | A person has checked it against the source description. This is not a claim that every archival detail was checked. |
| **Verified** | A person has checked it against the original archival material. |

Arkive does not move a record to a higher state without a recorded review. Where a state is lower than the research would ideally require, the record keeps that lower state and says why.

## 4. Entity-match policy

Some people or places appear in more than one source under slightly different names. Arkive tracks these as **mentions** first, and only links them to one record when a source supports it.

- Automated match scores are heuristics. They help prioritize research. They are not historical proof.
- A match stays **pending** until a person reviews it against the sources.
- Arkive never merges two records automatically, and never because two names look alike.
- Where a pair of mentions conflicts (for example, two different addresses in the same period), the conflict stays visible to reviewers.
- A rejected match is recorded with a reason, so the same pair is not proposed again without new evidence.

## 5. Georeference policy

A historical location is shown on the map only when the evidence supports a placement.

- **Unresolved:** the evidence does not support a location. The place is listed by name on the map page, and no marker is drawn.
- **Approximate:** the evidence supports an area or a relative position, such as "a block and a half from the college". It is drawn with a dashed marker and, where possible, an uncertainty circle.
- **Exact:** coordinates come from a documented source: a modern address that was geocoded and checked, a georeferenced archival map, an explicit archival coordinate, or an independent human review.

A modern street name is not evidence of a historical location, and a geocoder result is not evidence on its own. Arkive records how each coordinate was derived, who reviewed it, and when.

## 6. Corrections

Anyone can report a correction through the [feedback page](https://github.com/renish5609-beep/arkive/issues/new/choose).

1. A reviewer checks the report against the cited source.
2. If the source supports the correction, the record is changed, and the change is recorded in the project history.
3. If the source does not support it, the reviewer replies with the reason, and the report is closed.
4. Nothing changes automatically. Submitted corrections do not affect the canonical dataset until they are reviewed.

Arkive keeps its own mistakes visible. A correction does not erase the earlier version from the project history.

## 7. Source removal and broken links

Archive links change over time. Arkive checks source links with a tool (`npm run check:links`), and the results are reported rather than acted on automatically.

- **Healthy:** the link opens.
- **Redirect:** the link moves. The new address is recorded for review.
- **Broken:** the link returns an error. The source is kept, and the record notes that the link needs repair.
- **Unreachable:** the check could not reach the site. This is often temporary, so it is not treated as a failure.

If a source is withdrawn or no longer available, Arkive keeps the citation and its notes, and says that the source can no longer be checked. Arkive does not delete a source that a record depends on.

## 8. Sensitive material

Some records concern displacement, segregation, and the loss of homes. Arkive aims to describe these people and communities with care. It preserves the context of each source, names who is speaking and when, and avoids language that sensationalizes suffering.

## 9. Date of last update

This policy was last updated on **2026-10-06**. Changes to the policy are recorded in [CHANGELOG.md](../CHANGELOG.md).
