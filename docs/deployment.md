# Deployment

This document explains how to deploy Arkive. The site is a standard Next.js 16 application, so it runs on Vercel or on any Node.js host that supports Next.js.

## Environment variables

Arkive currently requires **no environment variables**. Local development and the production build run without any configuration.

One optional variable exists:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | The public address of the site, for example `https://arkive.example`. When set, it becomes the `metadataBase` for page metadata and social preview links. Leave it unset until a production domain exists. |

Do not invent a production domain. If you do not have one, leave `NEXT_PUBLIC_SITE_URL` unset.

## Before you deploy

Run the release check locally. It must pass before a deployment:

```bash
npm install
npm run check:release
```

Then review the source link report. It does not block a release, but broken links should be repaired:

```bash
npm run check:links
```

## Deploy to Vercel (one-click)

1. Push the repository to GitHub. The repository is `https://github.com/renish5609-beep/arkive`.
2. Sign in to [vercel.com](https://vercel.com) with a GitHub account that can access the repository.
3. Choose **Add New... > Project**, then select the `arkive` repository.
4. Vercel detects Next.js automatically. Keep these defaults:
   - Framework preset: **Next.js**
   - Root directory: `./`
   - Build command: `npm run build`
   - Output directory: leave as detected
   - Install command: `npm install`
5. Leave environment variables empty, or add `NEXT_PUBLIC_SITE_URL` once a domain exists.
6. Choose **Deploy**. Vercel returns a preview URL when the build finishes.

Every later push to `main` creates a new deployment automatically.

## Deploy with the Vercel CLI

Use this path if you prefer the command line.

```bash
npm install -g vercel
vercel login
vercel          # creates a preview deployment from the current directory
vercel --prod   # promotes a deployment to production, after the preview is checked
```

The CLI must be authenticated with your own account. Do not share tokens in the repository.

## Smoke test after deployment

Open each address below on the deployment URL, and confirm the page loads without errors:

- `/` (homepage)
- `/projects/quakertown` (project page, map, archive)
- `/records/place_005` (a georeferenced place)
- `/records/person_004` (a person record)
- `/sources/source_004` (a source record)
- `/api/export/quakertown?format=json` (should download a JSON file)
- `/api/export/quakertown?format=csv&entity=people` (should download a CSV file)
- `/api/projects/quakertown` (should return JSON)
- `/feedback`
- A narrow mobile viewport (about 390 px wide)

## Things to verify in production

- The map loads its OpenStreetMap tiles, and the attribution in the bottom-right corner is visible.
- Leaflet loads dynamically on the client. The map shows its loading text, then the map.
- All source links point to absolute `https` addresses.
- No page refers to `localhost`. `npm run release:audit` checks this.

## Status

At the time of writing, Arkive has **not been deployed**. No Vercel project is linked, no Vercel CLI is installed in this environment, and no deployment credentials are stored in the repository. The production build passes locally, which is the last verified step. The next step is the one-click deployment above.
