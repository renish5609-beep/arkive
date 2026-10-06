# Application metrics

Last updated: 2026-10-06

This file records only facts that are currently supported by the repository. Dataset counts were produced by the project's own commands. Where a value has not been measured, it says **Not yet measured**. Do not round these numbers up, and do not add figures that are not listed here.

## Technical scope

| Item | Value | How it was measured |
| --- | --- | --- |
| Framework | Next.js 16, React 19, TypeScript, Tailwind CSS 4 | `package.json` |
| Public pages | Homepage, project page, methodology, feedback, review guide, demo, internal review queue, record and source pages | `app/` routes |
| Data export routes | JSON export, five CSV exports, project summary endpoint | `app/api/` routes |
| Command-line tools | 14 npm scripts, including validation, provenance audit, research status, match candidates, source link check, and release audit | `package.json` |
| Automated checks | Dataset validation with errors and warnings; provenance audit; release audit covering exports, metadata, README commands, and public copy | `scripts/` |
| Accessibility work | Labelled filters, a text summary of map contents, a non-JavaScript mobile menu, and visible focus on navigation links | `components/`, `app/` |
| Repository history | 12 commits on `main` | `git log` |

## Historical dataset

| Item | Value |
| --- | --- |
| People | 5 |
| Places | 5 |
| Sources | 6 (5 source types) |
| Relationships | 6 |
| Archival mentions | 13 |
| Location evidence records | 3 |
| Georeferenced places (exact) | 1 |
| Georeferenced places (approximate) | 0 |
| Places still unresolved | 4 |
| Pending identity matches | 8 |
| Accepted identity matches | 0 |
| Open research questions | 6 |

Context for these numbers:

- Most sources are short descriptions. The full oral history transcripts and archival documents have not yet been read.
- Only one place has coordinates, and its geocoding source and reviewer are recorded in the dataset.
- Identity matches are heuristic candidates. None has been accepted, and none has changed a canonical record.

## Open-source outputs

| Item | Status |
| --- | --- |
| Public source repository | `https://github.com/renish5609-beep/arkive` |
| Machine-readable dataset | JSON export, plus five CSV exports, with source IDs preserved |
| Documentation | README, methodology page, data dictionary, provenance policy, contributing guide, changelog, deployment guide |
| Issue forms | Historical correction, source suggestion, and bug or accessibility report |
| License | Not yet added |

## External validation

| Item | Value |
| --- | --- |
| External reviews received | 0 |
| Educators contacted | 0 |
| Classrooms using Arkive | 0 |
| Community contributors | 0 |
| Presentations given | 0 |
| Outreach messages sent | 0 |

These values are recorded in `data/project-impact.json` and `data/external-reviews.json`. They change only when an event actually happens. Outreach templates are ready in `docs/outreach/`, but none has been sent.

## Public usage

| Item | Value |
| --- | --- |
| Deployment | Not yet measured. The site has not been deployed. See `docs/deployment.md`. |
| Page views | Not yet measured |
| Dataset downloads | Not yet measured |
| Feedback received | Not yet measured |

No analytics are installed. Usage will be reported only from data the project collects with the reader's knowledge.
