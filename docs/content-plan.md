# Content plan: replacing placeholders with actuals

Work through this top to bottom. Phase 1 unblocks everything else; phases 2–4 can run in parallel after that.

Placeholders are written in `[brackets]`. Some invented data has no brackets (cover series, chart data, bpm/energy values); those are listed explicitly below.

## Inventory

| Area | File(s) | Placeholder today |
|---|---|---|
| Identity | `src/site.ts` | Tech stack in the credits |
| Career facts | `src/content/records/slm-001.mdx` … `slm-004.mdx` | Side titles and years, edition `043/300`, title "Make the Tool" (from the handoff; verify) |
| Career stories | same | 6 sides × story, outcome, projects, collaborators, why I moved on; 3 summary lines |
| Cover art | `coverSeries` in each career file | Invented numbers |
| Experiment X01 | `slm-x01.mdx` | Real data since 2026-09-27; findings are drafts to rewrite |
| Experiment X02 | `slm-x02.mdx` | Everything: dataset, headline, intro, findings; no chart yet |
| What I'm playing | `02-hard-techno.mdx` … `06-acid.mdx` (`01-funky.mdx` is real) | 37 `[Artist] – [Track]` rows, invented bpm and energy; possibly the genres themselves |

---

## Phase 1: Decisions

- [x] **Label name and catalog prefix.** Slim Records, wordmark `SLIM`, prefix `SLM`. Old `/records/hlv-*` and `/experiments/hlv-*` URLs redirect in `public/_redirects`. Pressing 01's description keeps its original HLV numbers, since that's what was pressed.
- [x] **Naming people.** Mixed: a real name only when that person has agreed, otherwise their role. Mark each person during the interviews.
- [x] **Disclosure rule for outcomes.** Case by case, decided per side during the interviews.
- [x] **Verify career facts:**
  - [x] SLM-001 Audo CPH: Interim Supply Chain Controller, Nov 2019 – Nov 2020
  - [x] SLM-002 Mediq Danmark: Tender & Contract Assistant, Dec 2020 – Apr 2021
  - [x] SLM-003 Audo CPH: Business Intelligence Analyst, Apr 2021 – Aug 2023
  - [x] SLM-004 SoftwareOne (was Crayon), Aug 2023 – now
    - A · Business Intelligence Developer, 2023–24
    - B · Full Stack Engineer, 2025–26
    - C · Senior Full Stack Engineer, in progress
  - [ ] Edition number `043/300`: revisit after the Side B interview
  - [ ] Title "Make the Tool": revisit after the Side B interview
- [x] **Your name:** Simon Mærsk

## Phase 2: Career copy

One interview per side: Claude asks 6–8 questions, you answer roughly, Claude drafts in the house style (short, plain, no vinyl jargon in the copy), you edit.

Each side needs:
- **The story:** 2 short paragraphs
- **Outcome:** one big value + a one-line caption
- **Projects (tracks):** 2–3, each with collaborators
- **Why I moved on:** one paragraph (not for the current role)

Order, starting with the side that already has the most real structure:

- [x] SLM-004 Side B: Full Stack Engineer (open: the product behind the 3×)
- [ ] SLM-004 Side A: BI Developer
- [ ] SLM-004 Side C: Senior Full Stack Engineer (no "Why I moved on")
- [ ] SLM-004 summary line (currently "Three roles at one company, 2023 – now.")
- [ ] SLM-003: Business Intelligence Analyst + summary line
- [ ] SLM-001: Interim Supply Chain Controller + summary line
- [ ] SLM-002: Tender & Contract Assistant + summary line
- [x] Headline sticker on SLM-004: "From dashboards to full stack."

## Phase 3: Data you can export

### Cover series (one real metric per role)
Raw numbers are fine; the cover rescales them. Stage 0 draws 24 values, stage 1 draws 18, stages 2 and 3 draw 120. Shorter series are stretched.

- [ ] SLM-001 metric: ______ (e.g. orders handled per week)
- [ ] SLM-002 metric: ______ (e.g. tenders per month)
- [ ] SLM-003 metric: ______ (e.g. reports shipped per week)
- [ ] SLM-004 metric: ______ (e.g. commits per week from `git log`)

### What I'm playing
- [ ] Confirm or change the genres: Hard techno, Hypnotic techno, Minimal, Electro, Acid (one file each; the first file is the insert shown in the crate)
- [ ] Export each genre playlist from the DJ software (artist, title, BPM)
- [ ] Energy 1–10 for each track (Mixed In Key rates it; otherwise score by hand)
- [ ] Write a one-line description per genre
- [ ] Ask Claude for an importer script: export → insert files

### Experiment X01: my USB by tempo + key
- [x] Export the full rekordbox collection (`Collection.xml`, 749 tracks after dropping rekordbox's sample loops)
- [x] One-time analysis (no script in the repo): keys were already Camelot; cluster is 135–150 bpm × 5A–8A (29% with 5 bpm columns)
- [x] **Decision:** major keys (85, 11%) fold onto their relative minor. Chart widened to 115–165 bpm (16 tracks fall off); the scatter became a halftone grid (dot area = tracks per 5 bpm × key cell) so density and the cluster read; track names are not published
- [ ] Rewrite the three findings from the real data (drafts are in, based on the numbers)
- [x] Remove `note: placeholder data`

## Phase 4: Experiment X02

- [ ] Pick the dataset (e.g. Copenhagen open data: bike counts, noise, trees): ______
- [ ] Decide the question it answers
- [ ] **Decision:** does it fit the existing scatter chart, or does it need a new chart type? (a new chart is a design change)
- [ ] Write the headline, intro (the MDX body) and three findings
- [ ] Handwritten title: keep "Copenhagen, counted"?
- [x] Fallback if not ready: hidden for now (`hidden: true` in `slm-x02.mdx`). Remove that line to bring it back.

## Phase 5: Finish

- [ ] Replace the tech stack in the credits (`src/site.ts`) with the real one
- [ ] Ask Claude for `npm run placeholders` to list remaining `[...]` (optionally failing production builds while any remain)
- [ ] Remove all `placeholder data` notes and code comments that say "Placeholder"
- [ ] Final read-through on desktop and phone
- [ ] Commit, then `npm run press -- "Real content: …"` for pressing 02, then `git push --follow-tags`
