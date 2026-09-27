# HALVTONE

A personal site framed as the record crate of a fictional techno label. Every piece of content is a record. The design handoff lives in [`handoff/`](handoff/README.md).

Astro + TypeScript, static output, plain CSS. No UI libraries.

## Develop

```sh
npm install
npm run dev          # http://localhost:4321, specimens at /dev/specimens
npm run build        # astro check + static build into dist/
npm run preview
```

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`
- Node: 22 (from `.node-version`)
- Optional env var `PRODUCTION_BRANCH` (default `main`). Builds on any other branch show a small "test pressing · <branch>" stamp on the crate lip.

`public/_redirects` sends `/index` to `/index/`, because Pages otherwise treats `/index` as the home page.

## Add a record

Add one file to `src/content/records/`. No other code changes are needed. The schema is in `src/content.config.ts`.

- **Career** (`type: career`, catalog `HLV-001`–`099`): company, years, cover stage 0–3, `coverSeries` (the numbers the cover is drawn from), and `sides[]` (each role: story, outcome, tracks, why I moved on).
- **Experiment** (`type: experiment`, catalog `HLV-X01`–): headline, handwritten title, optional scatter chart data, findings. The MDX body is the intro.
- **What I'm playing** (`type: playing`): one file per genre. Files sort by name (`01-…`, `02-…`); the first is the insert shown in the crate.

Everything in `[brackets]` is placeholder copy. Site-wide copy (label name, credits, welcome line) is in `src/site.ts`.

## Press a release

```sh
npm run press -- "Added HLV-X02"
```

This appends `{ number, description, sha }` to `src/content/pressings.json` (sha = the current HEAD), commits that file, and tags `pressing-N`. Nothing is pushed. The build never reads git tags; the runout etching uses `CF_PAGES_COMMIT_SHA`, or `git rev-parse` locally.
