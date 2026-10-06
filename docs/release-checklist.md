# Release checklist

Last updated: 2026-10-06. Mark an item only when it has been verified. Details for each item are in [qa-report.md](qa-report.md).

## Checklist

- [ ] **Browser QA complete.** Not done. No browser was available. See the QA report.
- [ ] **Mobile widths checked** (375, 390, 768, 1024, 1440 px). Not done visually.
- [ ] **Console clean.** Not checked in a browser.
- [x] **Production build tested.** `npm run build` passes, and `npm run start` serves all core routes with the expected status codes.
- [ ] **Map tested.** Build output and server HTML confirm that the map is client-only and that its attribution text ships with it. Tiles, marker placement, legend, and popups were not checked visually.
- [x] **Export endpoints tested.** JSON parses. Every CSV has consistent columns. Errors return JSON without stack traces. Content-Disposition filenames are set.
- [x] **Metadata verified.** Titles and Open Graph titles checked in production HTML on every public page. No localhost, Create Next App, or placeholder domain. `og:url` and canonical are not implemented because no production URL exists.
- [x] **Feedback route works.** `/feedback` returns 200. Its GitHub link returned 200 during the check.
- [ ] **GitHub issue forms work.** The three forms and `config.yml` parse as valid YAML with the expected required fields. They have not been opened on GitHub.
- [x] **Source links checked.** All six source URLs are healthy as of this check.
- [ ] **Deployment preview tested.** Not deployed. See `docs/deployment.md`.
- [ ] **Production URL recorded.** None exists. Do not add one until it is real.
- [ ] **License resolved or explicitly pending.** A MIT `LICENSE` file has been in the repository since the initial commit, and the README now refers to it. **Confirm with the project owner that MIT is the intended license.** Until confirmed, treat the license as pending.
- [x] **`check:release` passes.** Verified on this commit. See the final regression run.

## Notes

- Source links marked healthy are healthy only at the time of the check.
- Archival sources keep their own rights. A software license does not change them.
- Items left unchecked are not failures of the code. They are verification steps that need a browser or a deployment.
