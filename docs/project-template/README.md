# Project template

This directory documents the shape of a project, for reference. It is not a live project — Arkive only discovers directories under `data/projects/`, and this one lives under `docs/` so the application never sees it.

In practice, do not hand-edit these `.example` files. Run:

```bash
npm run create:project -- --slug your-slug --number 003 --title "Your Project Title" --location "City, State"
```

That command creates a real project directory under `data/projects/<slug>/` with every required file already present, empty, and ready to fill in.

## Minimum provenance requirements

Before any record is added to a project:

- **Every person, place, and relationship needs at least one source.** `npm run audit:provenance` fails if one does not.
- **Do not infer a fact a source does not state.** No dates, occupations, family ties, ownership, or addresses without direct support.
- **Coordinates need documented provenance.** A geocoded modern address, a georeferenced archival map, an explicit archival coordinate, or an independent human review — nothing else. Leave `latitude`/`longitude` as `null` and `georeference_status` as `"unresolved"` otherwise.
- **Record mentions before records.** A mention is a raw occurrence in a source. Link it to a canonical person or place only when the source actually supports that identity.
- **Preserve uncertainty.** An open question belongs in `research-queue.json`, not in a guessed fact.
- **Preferred sources** are archival collections, oral histories, census and directory records, deeds, maps, and official local, state, or federal records. Do not use unsourced genealogy sites, blogs, AI-generated pages, or search-engine snippets.

See [the provenance policy](../provenance-policy.md) and [the data dictionary](../data-dictionary.md) for full field-level detail.

## Files in this template

- `project.json.example` — the project manifest.
- `people.json.example` — one example person record.
- `places.json.example` — one example place record, unresolved.
- `sources.json.example` — one example source record.
- `relationships.json.example` — one example relationship record.
- `mentions.json.example` — one example archival mention record.

`location-evidence.json`, `georeference-queue.json`, `match-candidates.json`, and `research-queue.json` are not templated here; their shapes are documented in the data dictionary, and a new project starts with each of them as `[]`.
