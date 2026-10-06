# Impact thresholds

This document defines when Arkive may claim an external activity. The definitions are deliberately conservative. A claim is recorded only when its definition is met.

## Definitions

**External review.** A historian, educator, archivist, or relevant expert actually reviewed the product and provided substantive feedback.

**Educator use.** An educator used Arkive for preparation, demonstration, or instruction.

**Classroom use.** Students actually interacted with Arkive as part of a class or activity.

**Community contributor.** A person outside the developer contributed a source, correction, verified record, or meaningful research contribution.

**Presentation.** Arkive was presented to an organized group or event.

## What does not count

- Page views. They are not a primary measure of impact.
- A sent email. A sent email is not a review.
- A reply. A reply is not a partnership.
- A GitHub star, a fork, or a download, unless it is tied to one of the activities above.
- Feedback that does not come from a person who used or examined the project.

## How these are recorded

- External reviews: one record each in `data/external-reviews.json`.
- Other events: counts in `data/project-impact.json`, each non-zero count accompanied by a tagged note in its `notes` array (`classroom:`, `presentation:`, `contributor:`, `educators:`).
- `npm run audit:impact` fails when a count is larger than its evidence.

## Public display

- Do not display zeros as achievements.
- Do not display an organization name without permission.
- Until there is real external activity, the public project page focuses on dataset and research metrics.
