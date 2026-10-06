# Contributing to Arkive

Thank you for helping. Arkive is a research project, and two kinds of contribution matter: code, and historical data. They have different rules, because a wrong line of code is a bug, while a wrong historical claim can misrepresent real people.

## Code contributions

1. Fork the repository and create a branch for one change, for example `fix/mobile-nav`.
2. Install dependencies with `npm install`.
3. Before you open a pull request, run:
   ```bash
   npm run lint
   npm run build
   npm run check:release
   ```
4. Keep each commit to one logical change. Write a short, specific message that says what changed and why, for example "Fix mobile menu overlap on 375 px screens".
5. Do not reformat or refactor unrelated files in the same change.
6. Describe how you tested the change, including the widths or routes you checked.

## Historical-data contributions

These rules apply to every change to `data/projects/quakertown/`, and to any proposed new record.

- **Source provenance.** Every person, place, relationship, and claim must cite at least one source ID that exists in `sources.json`.
- **No inferred claims without evidence.** Do not infer dates, occupations, family ties, ownership, or addresses unless a source states them.
- **Concise notes.** Notes should say exactly what the source supports, and nothing beyond it.
- **Uncertainty preserved.** If a source is ambiguous, record the ambiguity. Do not resolve it to make the record look complete.
- **No fabricated coordinates.** A coordinate needs documented provenance: a modern address that was geocoded, an archival map that was georeferenced, an explicit archival coordinate, or an independent human review. A street name that still exists today is not evidence of a historical location. Leave the location `unresolved` when the evidence is insufficient.
- **Do not change verification state upward** without the evidence to support it.

Run the checks before you open a pull request:

```bash
npm run validate:data
npm run audit:provenance
```

## Entity resolution

- Automated match scores are heuristics for prioritizing review. They are not evidence.
- New candidate matches stay `pending` until a person reviews them against the sources.
- Do not collapse two mentions into one entity because the names look similar.
- Do not set `linked_entity_id` on a mention unless a source supports the link.

## Sensitive historical material

Quakertown's history includes displacement, segregation, and the loss of homes. Write about individuals and communities with care:

- Do not sensationalize people or their suffering.
- Preserve the source context, including who is speaking and when.
- Describe people by the terms their sources use, and note when a term is the source's rather than ours.

## Reporting problems

Use the issue forms in the repository. For historical corrections, name the record, the claim, the proposed change, and the source. Submitted corrections are reviewed before they affect the canonical dataset.
