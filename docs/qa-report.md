# Arkive QA Report

Status: **FAIL (incomplete).** Automated and production-mode checks pass. Visual browser QA was not performed, so the packet's layout, console, map, keyboard, and mobile requirements are **not verified**. This report does not mark anything as PASS that was not actually observed.

## Environment

Browser: none available. The built-in browser tools were not present in the session, and no browser automation is installed locally.
OS: Windows 11 Home (developer machine)
Commit: `dc6f51f` (baseline), with QA metadata fixes committed on top
Node: v24.16.0 · npm 11.13.0 · Next.js 16.3.8
Mode: production build, served with `npm run start` on port 3100. The development server was not used for these checks.

## Viewport results

The packet requires visual checks at five widths. None was performed.

### 375 x 812
- PASS/FAIL: **Not verified**
- Issues: not observed
- Fixes: none

### 390 x 844
- PASS/FAIL: **Not verified**
- Issues: not observed
- Fixes: none

### 768 x 1024
- PASS/FAIL: **Not verified**
- Issues: not observed
- Fixes: none

### 1024 x 768
- PASS/FAIL: **Not verified**
- Issues: not observed
- Fixes: none

### 1440 x 900
- PASS/FAIL: **Not verified**
- Issues: not observed
- Fixes: none

Layout risks that a visual check should confirm first: the project-page map beside the georeference panel at 1024 px, the four-column status grid, the archive filter row (four controls at medium widths), and the mobile disclosure menu.

## Console

The browser console was not inspected, so no console errors or warnings have been confirmed in either direction.

- Pages not inspected: `/`, `/projects/quakertown`, `/review`
- Errors: **not checked**
- Warnings: **not checked**
- Hydration: **not checked**. Server-rendered HTML contains no obvious mismatches in the sense that the same components render the same markup on each request, but this is not a substitute for a console check.

Known external network requests, to be separated from app errors when checking the console: OpenStreetMap tile requests (`*.tile.openstreetmap.org`), Google Fonts (Geist, loaded at build time), and GitHub links.

## Map

Verified from build output and server responses only:

- Leaflet and the OpenStreetMap tile URL and attribution text are in a separate client chunk. The server HTML contains only the "Loading reconstruction map..." placeholder, so the map is client-only, as designed.
- The page text reads "Map currently contains 1 exact and 0 approximate historical locations."
- The unresolved place list renders as text on the page: Woods House, Woods Family Property, Original Fred Douglass School, and the Maude Woods Clark Hembry House (Quakertown).

Not verified: that tiles load, that the exact marker appears at the right point, that the legend is correct, that popups fit on a small screen, and that the map does not overflow horizontally.

## Routes

Production-mode status codes, from `npm run start`:

| Route | Status |
| --- | --- |
| `/` | 200 |
| `/projects/quakertown` | 200 |
| `/about` | 200 |
| `/demo` | 200 |
| `/feedback` | 200 |
| `/review-guide` | 200 |
| `/review` | 200 |
| `/records/person_001`, `/records/person_003` | 200 |
| `/records/place_001`, `/records/place_005` | 200 |
| `/sources/source_004` | 200 |
| `/api/projects/quakertown` | 200 |
| `/api/export/quakertown?format=json` | 200 |
| `/api/export/quakertown?format=csv&entity=people` (and places, relationships, mentions, sources) | 200 |
| `/records/person_999`, `/sources/source_999` | 404 |

Every demo and review-guide link target was checked for a 200 response in development.

## Metadata (production HTML)

| Route | `<title>` | `og:title` | Notes |
| --- | --- | --- | --- |
| `/` | Arkive - Computational Public History | matches | |
| `/projects/quakertown` | Quakertown Reconstructed \| Arkive | matches | description names Denton, Texas |
| `/about` | Methodology \| Arkive | Methodology \| Arkive | fixed in this QA pass |
| `/feedback` | Feedback and corrections \| Arkive | fixed in this QA pass | |
| `/demo` | Demo walkthrough \| Arkive | fixed in this QA pass | |
| `/review-guide` | Review guide \| Arkive | fixed in this QA pass | |
| `/review` | Entity resolution queue \| Arkive | fixed in this QA pass | had no metadata before |

Also checked: no `localhost`, no "Create Next App", no placeholder domain, and no `TODO` or "coming soon" text in any page above.

Not implemented: `og:url` and `<link rel="canonical">`. Both require a production URL in `metadataBase`, which does not exist yet, so neither has been invented.

## Export endpoints

- JSON: parses, and includes project, people, places, relationships, sources, mentions, match candidates, and location evidence. `Content-Disposition: attachment; filename="arkive-quakertown.json"`.
- CSV (people, places, relationships, mentions, sources): each file parses as RFC 4180 CSV. Column counts are consistent in every row. Quoted fields are escaped, and the mentions export contains fields with embedded commas and quotes. Each has a `Content-Disposition` filename.
- Errors: an unknown `entity` returns HTTP 400 with a JSON message, and an unknown `format` also returns 400 with a JSON message. Neither response contains a stack trace.
- The dataset was not changed during testing.

## Accessibility

Verified in code, not in a browser:

- Search and filter controls have associated labels (visually hidden text inside `<label>`).
- The mobile menu is a native `<details>` element. Its `<summary>` text ("Menu") is its accessible name, and browsers expose its open or closed state.
- External links that open in a new tab carry visually hidden text saying so.
- Navigation links gain an underline on keyboard focus (`focus-visible:underline`). Browser default focus outlines are not removed.
- The map has a text summary of its contents and a text list of unresolved places.
- Headings are ordered on the pages reviewed in source (`h1`, then `h2`, then `h3`).

Not verified: real keyboard traversal, tab order, focus visibility in the browser, screen reader behavior, and colour contrast. No static accessibility audit tool was added, since the packet asks not to add a large dependency for this.

## GitHub issue forms

Parsed with the project's existing YAML library:

- `historical-correction.yml`: valid. Required fields: record, claim, correction, citation.
- `source-suggestion.yml`: valid. Required fields: title, url, coverage.
- `bug-report.yml`: valid. Required fields: page, kind, what-happened.
- `config.yml`: valid. Blank issues are disabled.

`/feedback` links to `https://github.com/renish5609-beep/arkive/issues/new/choose`, which returned HTTP 200 during this check. Whether the issue forms actually render on GitHub is not verified, since that requires a GitHub browser session.

## Source links

`npm run check:links`: 6 checked, 6 healthy, 0 redirects, 0 broken, 0 unreachable. No URLs were changed.

## Deployment

Not deployed. No `.vercel` directory exists, the Vercel CLI is not installed, and no authentication is present. No credentials were requested or stored. See `docs/deployment.md` for the steps.

## License

A `LICENSE` file (MIT) has been in the repository since the initial commit. The README now points to it. This report treats the MIT license as the repository's existing choice, but the project owner should confirm it.

## Final status

**FAIL (incomplete).** Visual browser QA, responsive checks at five widths, console inspection, map visual checks, keyboard testing, and deployment preview are not done. Deterministic checks pass.
