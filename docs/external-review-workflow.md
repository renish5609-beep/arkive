# External review workflow

This document describes how outreach and feedback are recorded. Each step is recorded only after it has happened.

## Flow

1. **Outreach sent.** Add an entry to `data/outreach-log.json` with status `sent`.
2. **Reply received.** Change the status to `replied`, and record the reply in `notes`.
3. **Review requested.** Status `review_scheduled` when a date is agreed, or record the reviewer's agreement.
4. **Feedback received.** Summarize it in `feedback_summary` when the review is complete.
5. **`data/external-reviews.json` updated.** Add one record per completed review, using the schema in `lib/types.ts`.
6. **`data/project-impact.json` updated, if applicable.** Change a count only when the event happened. Add a tagged note (for example `classroom: ...`) that describes it.
7. **Concrete issues become GitHub issues or research items.** See `docs/feedback-triage.md`.
8. **Changes made.** Commit each change with a clear message, and record it in `docs/external-review-changes.md`.
9. **Reviewer feedback summarized.** Keep the summary short and accurate.
10. **`docs/application-metrics.md` regenerated.** Run `npm run metrics:generate`.

## Verification after every update

```bash
npm run outreach:status
npm run review:status
npm run audit:impact
npm run metrics:generate
```

`review:status` exits nonzero when a review record is malformed. `audit:impact` exits nonzero when a count is larger than its evidence.

## Privacy and permission

- A reviewer's name is shown publicly only when `permission_to_name` is `true`, and `public_name` is set by the reviewer.
- Without permission, `public_name` stays `null`. Do not show the organization name either, unless the reviewer agrees.
- Record only the information a reviewer has agreed to share.

## Outreach practice

- Contact a small number of relevant people, with a specific ask. Do not send mass email.
- Personalize each message with one sentence explaining why that person is relevant.
- Send one follow-up after a reasonable interval (see `docs/outreach/follow-up-email.md`). Do not send more than one.
- After about 15 to 20 thoughtful contacts with no meaningful engagement, reassess the outreach angle before sending more.
- Do not send anything automatically. Every message is sent by a person.

### First batch (recommended)

- 2 or 3 historians or public historians
- 1 or 2 archive or history staff
- 2 or 3 educators
- 1 digital-humanities educator or researcher

## GitHub issue linkage

When a review identifies a concrete issue:

- open a GitHub issue using the matching form;
- include the review ID in the issue body, but not the reviewer's private details;
- label the issue historical or technical;
- cite the source where one applies.

## Operator checklist

- [ ] Production or demo URL confirmed
- [ ] Review guide URL confirmed
- [ ] Historian email customized
- [ ] Educator email customized
- [ ] First outreach batch: 5 to 10 targeted contacts at most
- [ ] Outreach log updated after each send
- [ ] Follow-up dates recorded
- [ ] Responses recorded accurately
- [ ] Reviews entered only after they are complete
- [ ] Impact audit passes
