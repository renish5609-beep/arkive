# Changelog

This file lists changes by project phase. The repository has no release tags yet, so entries are grouped by the commit dates in the project history rather than by version numbers.

## Unreleased

Public launch preparation (Phase 3):

- Public methodology page at `/about`, covering the pipeline, verification states, spatial confidence, entity resolution, georeferencing, open data, and limitations.
- Dedicated Quakertown project page at `/projects/quakertown`, with map, archive, provenance summary, dataset downloads, and project status counts.
- Simplified homepage focused on what Arkive is, what the Quakertown reconstruction covers, and why provenance matters.
- Shared site header and footer, with a native disclosure menu for small screens.
- Production-ready metadata: title template, Open Graph, and Twitter card. `metadataBase` is set only when `NEXT_PUBLIC_SITE_URL` is provided.
- Monogram favicon (`app/icon.svg`).
- Feedback and corrections page, GitHub issue forms for historical corrections, source suggestions, and bugs, and `CONTRIBUTING.md`.
- Review guide at `/review-guide` and a demo walkthrough at `/demo`.
- Machine-readable project summary at `/api/projects/quakertown`.
- Data dictionary and provenance policy in `docs/`.
- External validation tracking (`data/external-reviews.json`, `data/project-impact.json`) and a `review:status` command. Both start with zero reviews and zero events.
- Source-link checker (`check:links`), release audit (`release:audit`), and a one-command release check (`check:release`).
- Static generation for known record and source pages.
- Accessibility improvements: labelled filters, underline on keyboard focus for navigation links, and a text summary of map contents.

## Phase 2B: entity resolution and research integrity (2026-10-06)

- Archival mentions and deterministic match candidates, with heuristic scores and conflicting evidence shown.
- Research queue and review page at `/review`.
- Provenance audit (`audit:provenance`) and research status (`research:status`).
- JSON and CSV exports at `/api/export/quakertown`.
- Mention-ingestion helper with validation.

Commit: `8414ef5`

## Phase 2A: provenance-aware georeferencing (2026-10-06)

- Explicit georeference status (unresolved, approximate, exact) with location evidence and a research queue.
- Map styling that distinguishes exact and approximate locations, and lists unresolved places in text.
- Spatial validation and the georeference status command (`georef:status`).

Commit: `4177a2f`

## Phase 1: dataset integrity validation (2026-10-06)

- Quakertown dataset validator and CLI (`validate:data`), with a public Data Health summary.

Commit: `eab8df1`

## Phase 1: reconstruction explorer (2026-10-05)

- Interactive Leaflet and OpenStreetMap map, coordinate-gated markers and relationship lines.
- Searchable archive, person detail pages, and source detail pages.

Commit: `5180712`

## Earlier history (2026-10-05)

- Initial commit, provenance-first historical data model, first sourced Quakertown records, and the first homepage connected to the dataset.
