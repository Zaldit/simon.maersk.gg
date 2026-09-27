# Handoff: HALVTONE — personal site as a techno record crate

## Overview
A personal creative website for a senior fullstack engineer in Copenhagen. It is not a CV. The whole site is framed as the record crate of a fictional independent techno label, **HALVTONE** (placeholder name, catalog prefix `HLV`). Every piece of content is a record:
- **Career**: 4 records, one per role
- **Experiments**: white-label records, each a small data story
- **What I'm playing**: printed chart inserts, one per genre

The site is updated by adding a record. There are no feeds and no dated timeline.

**Legibility rule (critical):** the visuals carry the vinyl metaphor; every label and nav item uses plain language. With all vinyl vocabulary removed, every screen must still make sense.
- Nav items are "Career", "Experiments" and "What I'm playing".
- The liner notes are labelled "The story". Each role's closing section is labelled "Why I moved on".
- Record formats (7", 12", LP) are never named in the UI; they are shown only through size.
- Catalog numbers, the runout etching and the empty Side D are decorative easter eggs. Nothing depends on them.

## About the Design Files
The file in this bundle is a **design reference built in HTML**. It is a canvas of 9 fixed-size artboards showing the intended look and behavior; it is not production code. Recreate it in the target codebase's environment. If there isn't one yet, a good fit is **Astro or Next.js**, with content as MDX/JSON files (one file per record, so "adding a record" = adding a file) and covers rendered as SVG at build time.

To view: open `Record Crate.dc.html` in a browser with `support.js` next to it. It is a pan/zoom canvas of artboards `1a`–`1i`.

## Fidelity
**High-fidelity**: colors, type, sticker treatments, cover-art rules and the crate layering are final direction. All copy in [brackets] is placeholder content. The chart data, commit hashes and tech-stack credits are invented.

---

## Screens / Views

Artboards are 1440×900 desktop (the identity sheet is 1440×1180) and 390×844 mobile. Page gutters are **56px** on desktop and **24px** on mobile.

### Shared header (all desktop pages)
- Absolute: top 36px, left/right 56px; flex, space-between.
- **Logo lockup**, flex with 10px gap:
  - Mark: 20px circle, 2px `#131211` border, left half filled: `linear-gradient(90deg,#131211 50%,transparent 50%)`, `flex:none`.
  - Wordmark "HALVTONE": Archivo 800, 20px, `font-stretch:75%`, letter-spacing .06em.
- **Right links**: IBM Plex Mono 13px, 28px gap. Contextual, e.g. "Index", "Pressing history", "← Crate", "← Career".

### 1a — Label identity sheet (reference only, not a page)
A 12-column grid with rows of 380/400/400px, cells separated by 1px `rgba(19,17,16,.15)` rules.

1. **Logo**
   - Big lockup: an 84px mark with a 7px border, next to "HALVTONE" in Archivo 850, 104px, stretch 72%, line-height .85, with a misregistration ghost `text-shadow:2px 1px 0 rgba(19,17,16,.16)`.
   - Reversed mark: a 44px black circle holding a paper-coloured half-disc.
   - Concept line: "half filled, half open = using the tools / building them".
2. **Rubber stamp**
   - Rectangular stamp: 4px ink border, radius 5, `rotate(-4deg)`, opacity .88. Text "HALVTONE" + "KØBENHAVN · DK" (mono 700 13px, letter-spacing .3em).
   - Round stamp: 120px, "CATALOG / X01 / HALVTONE", `rotate(8deg)`.
   - Uneven ink: a noise knockout overlay (see Texture).
3. **Centre label template**: see "Centre label" below.
4. **Sticker set**: see "Stickers" below.
5. **Catalog numbers**
   - `HLV-004` in IBM Plex Mono 700, 96px, letter-spacing -.03em, with the ghost shadow.
   - The title is always smaller than the catalog number: Archivo 600, 22px, stretch 75%.
   - Hand-numbered edition "043/300" in Caveat 700, 44px, rotated -5°.
   - Stamped `HLV-X01`: 3px border, mono 700 22px, rotated 3°.
   - Numbering: `001–099` career, `X01–` experiments.
6. **Cover system**: the four generated covers side by side (see Cover art).
7. **Type**, 8. **Palette**: see Design Tokens.

### 1b — Entrance / crate view (desktop)
**Purpose:** landing page. You flip through the crate and pull records out.

- **Welcome line**
  - Absolute top 136, left 56, max-width 820. Archivo 700, 50px, stretch 78%, line-height 1.02, `text-wrap:pretty`, ghost shadow `2px 1px 0 rgba(19,17,16,.12)`.
  - Copy: "My career, experiments and the music I play, pressed as records."
- **Crate area**
  - Absolute top 330, left/right 56, height 540.
  - The item row is absolute: left 24, bottom 40; `display:flex; align-items:flex-end`.
  - Items overlap with **negative margin-left** so exactly **64px** of each earlier item shows: `marginLeft = 64 − previousItemWidth`. Later items stack on top.
  - Items in order:
    1. Divider card **"Career"**: 240×372.
    2. HLV-001: 330×330, ml -176.
    3. HLV-002: **190×190** (small format), ml -266. The taller HLV-001 shows above it.
    4. HLV-003: 330, ml -126.
    5. **HLV-004 (pulled)**: 330, ml -266, `translateY(-80px)`, shadow `-6px 14px 24px rgba(0,0,0,.35)`.
    6. Divider **"Experiments"**: ml **+16**, which leaves the pulled record fully visible.
    7. HLV-X01: ml -176.
    8. HLV-X02: ml -266.
    9. Divider **"What I'm playing"**: ml -266.
    10. Chart insert: 250×340, ml -176, `rotate(1.5deg)`, origin bottom-left.
- **Divider cards**
  - Background `#d6cfbf` (card stock), radius `0 3px 0 0`, shadow `-1px 0 3px rgba(0,0,0,.18)`.
  - Tab: absolute top -34, left 10; height 36; padding 0 18px; radius `6px 6px 0 0`; same fill. Archivo 700, 17px, stretch 80%.
  - Dividers are 42px taller than records, so the tabs always clear them.
- **Record strips**
  - Cover art fills the sleeve; `overflow:hidden`; shadow `-3px 0 8px rgba(0,0,0,.22)`.
  - Catalog number and year run vertically on the visible left edge (`writing-mode:vertical-rl`, mono 600 12px, left 14 / top 14). They are ink on light covers and paper on dark ones.
  - HLV-003 carries a 30px accent dot sticker.
- **White labels (X01, X02)**
  - `#f7f5f0` sleeve with a die-cut hole: a black circle at 33% / 33%, size 34%.
  - Stamped catalog number, vertical, in a 2px ink box, opacity .85.
  - X02 shows the handwritten title "Copenhagen, counted" (Caveat 700, 26px, -4°).
- **Pulled HLV-004**: the full front cover. Details under 1d; here at 330px:
  - "HLV-004": mono 700, 26px.
  - "043/300": Caveat 24px.
  - Headline sticker: 118px wide, `rotate(4deg)`, Archivo 800 13px.
- **Pulled caption**: sits above the pulled record at left 280, top 26 within the crate. Mono 12px: **HLV-004** (700, 15px), "Crayon · 2023 – now", "Open →" (underlined).
- **Chart insert**
  - `#f5f2ea` sheet. Black header band reading "Currently playing" (Archivo 800, 20px).
  - A mini version of the chart, plus the first 3 track lines (mono 10px).
  - Black 54px "×10" sticker with accent text, `rotate(-8deg)`, overhanging the right edge.
- **Crate lip**
  - Absolute bottom 0, height 120, `#131211`, sits above the items and covers their bottom 80px.
  - Left: a paper-ink stamp "HALVTONE · CRATE 01", 3px border, `rotate(-1.5deg)`, opacity .85.
  - Right: "Prefer a list? Plain index →" (mono 14px), linking to the index.

### 1c — Career section
**Purpose:** show the four roles side by side. Record size grows with the career, and the sleeve design drifts from office report to techno.

- **Intro block** (top 124, left 56):
  - Row: 14px accent dot + "Career · 4 records" (mono 12px).
  - "Four jobs, 2019 to now." (Archivo 700, 44px, stretch 78%).
  - "Each record is one role. The bigger the record, the bigger the chapter." (Archivo 17px, `#4a4640`).
- **Record row**: absolute bottom 120, left 56; flex, align-items flex-end, gap 44. Each group is a column with a 20px gap: visual, then caption.
- **Visual construction**: the disc sits behind the sleeve, vertically centred and peeking out on the right. The sleeve sits on top with shadow `2px 3px 8px rgba(0,0,0,.2)`, growing heavier for later records.

| Record | Sleeve | Visual box | Disc | Cover content |
|---|---|---|---|---|
| **HLV-001** (Audo, Interim Supply Chain Controller, Nov 2019 – Nov 2020) | 260 | 316 | 250 | Stage 0 art. Top-left "Audo / Supply chain" (Archivo 600/400, 14px). Top-right "HLV-001" (mono 10). Bottom-left "Nov 2019 – Nov 2020". 22px accent dot. |
| **HLV-002** (Mediq Danmark, Tender & Contract Assistant, Dec 2020 – Apr 2021) | **165** (small format) | 199 | 159 | Stage 1 art. Mono catalog number, "Mediq", "2020 – 2021", 18px dot. |
| **HLV-003** (Audo, BI Analyst, Apr 2021 – Aug 2023) | 260 | 316 | 250 | Spine: `border-right:5px solid #262422`. Stage 2 art with die-cut hole showing the centre label. "HLV-003" (Archivo 800, 22px, paper). Years top-left. **Return sticker** (below the table). |
| **HLV-004** (Crayon, Aug 2023 – now) | 260 | 356 | two discs | 8px spine. Two discs, at right:0 and right:46 (double record). Stage 3 art with die-cut hole. "HLV-004" (mono 700, 24px). "043/300". Headline sticker (104px, -4°). |

- **HLV-003 return sticker**: 74px accent circle reading "Back / at Audo", `rotate(12deg)`, overlapping the sleeve's top edge (left 176, top -16).
- **Captions**:
  - Catalog number: mono 700, 24px.
  - Company: Archivo 700, 17px ("Audo", "Mediq Danmark", "Audo, again", "Crayon").
  - Role: Archivo 14px, `#4a4640`. HLV-004 reads "BI Developer → Senior Full Stack Engineer".
  - Years: mono 12px.

### 1d — Record inspection: HLV-004 front + back
Both covers are 540×540, at left 56 (front) and left 620 (back), top 150, with shadow `4px 8px 22px rgba(0,0,0,.3)`.

**Front cover**
- Stage 3 art. Die-cut hole showing the centre label (Side B), which **rotates slowly**.
- Top-left: paper-ink stamp logo, 2px border, -2°, opacity .8.
- Top-right: "043/300", Caveat 34px, -6°.
- Bottom-left:
  - "HLV-004": mono 700, 58px, ghost `text-shadow:2px 1px 0 rgba(120,116,108,.6)`.
  - "Crayon · Make the Tool · 2023 – now": Archivo 600, 17px.
- Shrinkwrap sheen over everything: `linear-gradient(118deg, transparent 30%, rgba(255,255,255,.09) 42%, transparent 50%, rgba(255,255,255,.05) 70%, transparent 78%)`.
- **Headline sticker** on top of the sheen:
  - 196px wide, padding 14/16, accent fill, `rotate(4deg)`, shadow `0 2px 4px rgba(0,0,0,.35)`.
  - Copy: "From using the tools to building them." (Archivo 800, 22px, line-height 1.02).
  - Below it: "BI → full stack engineering · Side B" (mono 600, 10px).

**Back cover**
- `#161514` background, paper text, padding 34/34/28.
- Header row: "HLV-004" (mono 700, 22px) on the left; "Crayon · Aug 2023 – now" (mono 11px, `#b7b1a5`) on the right.
- **Tracklist**: 2×2 grid, gaps 18/26, mono 11.5px, line-height 1.55.
  - Side headings: Archivo 700, 15px, stretch 78%, followed by the years in mono 11px `#b7b1a5` with margin-left 6px.
  - A · Business Intelligence Developer, 2023–24: A1–A3 [Project n], with "feat. [Collaborator]" lines in `#b7b1a5`.
  - B · Full Stack Engineer, 2025–26: B1–B2.
  - C · Senior Full Stack Engineer: heading on one line; below it, accent tape "in progress" (mono 600 10px, padding 1/6, -3°).
  - D · "Not written yet", then "—". Intentionally empty.
- **Recording credits** block, bottom: 1px top rule at `rgba(235,230,219,.25)`; mono 10px, line-height 1.6, `#cfc9bd`.
  - Copy: "**Recording credits** — Written and produced by [Your Name]. Engineered with TypeScript, React, Node.js, Python, PostgreSQL. Mixed on Azure. Cover art generated from placeholder data. Pressed in Copenhagen."
  - Followed by a "Pressing history" link. **Replace the stack with the real one.**
  - A round logo stamp sits at the right.

**Side column** (left 1196, width 188):
- "HLV-004" (mono 700, 28px).
- "Crayon" (Archivo 700, 20px).
- "Three roles at one company, 2023 – now."
- Black button "Open the record →": padding 14/16, Archivo 600, 15px, paper text.
- "Turn it over" link (mono 12px, underlined).

### 1e — Record opened: Side B, Full Stack Engineer
- **Left**: the HLV-004 sleeve, cropped off the left edge (540px at left -360, top 180). The disc (560px, left 40, top 170, `drop-shadow(4px 10px 18px rgba(0,0,0,.3))`) turns slowly. The **runout etching**, the latest deploy's commit hash, is set in tiny text around the centre label. The grey leader line labelled "a3f9c2e" is a review annotation only; don't ship it.
- **Right column**: left 700, top 120, width 684; column with a 22px gap.
  1. **Side tabs** (Archivo 13px, padding 9/12, 6px gap):
     - "A BI Developer": `#d6cfbf`.
     - **"B Full Stack Engineer"**: active, `#131211` background, paper text.
     - "C Senior": followed by an 8px accent dot for in progress.
     - "D": transparent, 1px dashed `#b7b1a5` border, `#8a857b` text, empty.
  2. Meta line "HLV-004 · Side B · Crayon · 2025 – 2026" (mono 12px), then the title "Full Stack Engineer" (Archivo 750, 56px, stretch 76%, line-height .95).
  3. **"The story"** (Archivo 700, 15px), then 2 paragraphs (Archivo 17px, line-height 1.55).
  4. **Outcome row**: top and bottom 1px rules at `rgba(19,17,16,.2)`, padding 18px 0.
     - "[OUTCOME]": Archivo 800, 46px, stretch 75%.
     - Beside it: "e.g. monthly reporting cut from 3 days to 20 minutes for [N] teams" (mono 12px, `#4a4640`).
  5. **Tracks**: grid `34px 1fr auto`, mono 13px. "B1 [Project 4] — feat. [Collaborator]" etc.
  6. **"Why I moved on"**, then a paragraph: "I didn't leave; the role grew. [What changed — scope, team, ownership.] Side C picks up from here."
- **Content model per role/side**: `{ side, title, company, years, story[], outcome{value, caption}, tracks[{id, title, feat[]}], whyMovedOn }`.

### 1f — Experiment: white label opened (HLV-X01)
- **Left**
  - White sleeve 400×400 (left 56, top 250) with the die-cut hole.
  - Stamped "HLV-X01": 3px border, mono 700 24px, -4°, with an ink knockout.
  - Handwritten title "my USB by tempo + key" (Caveat 700, 40px, -3°).
  - Experiment sticker: a 90px white circle containing a 76px accent ring and the word "Experiment" (Archivo 800, 12px), rotated 7°.
  - The white-label disc (300px) peeks out above the sleeve and turns slowly. Its label has a handwritten title and a stamped catalog number.
- **Right** (left 520, width 864):
  - Meta: "Experiment · HLV-X01 · placeholder data".
  - Title: "Every track on my DJ USB, sorted by speed and key" (Archivo 750, 46px).
  - Intro: "I exported the track list from the USB stick I play from (speed and key come with every track) to see if I keep picking the same kind of track. Each dot is one track."
- **Scatter chart** (420px tall, SVG `viewBox 0 0 760 410`):
  - x axis: speed, 118–150 bpm, gridlines every 5.
  - y axis: 12 minor keys in Camelot order (A♭ minor … D♭ minor), labelled in plain words.
  - Dots: r 5, ink at .82 opacity.
  - An **accent ellipse** marks the cluster (128–136 bpm, keys 6–9), with the label "← the sweet spot".
  - Axis titles: "Speed, beats per minute → slower · faster" and "Musical key".
- **Three findings**, 3-column grid: "01 Most of it sits between 129 and 135 beats per minute." / "02 Only minor keys. Not one cheerful record." / "03 The circled group is over half the USB: tracks that blend into each other easily."
- **Real data source**: an export from the DJ software (e.g. a track-collection XML/CSV with BPM and key fields).

### 1g — What I'm playing: genre chart inserts (interactive)
- **Left column** (left 56, top 140, width 300):
  - Label row: a 14px black dot with accent inset ring, then "What I'm playing".
  - Title: "What's in my bag right now." (44px).
  - Two paragraphs: "Sorted by genre. Pick one on the tabs to see what's in it." / "The line shows how fast each track is; the bars show how intense it feels."
- **Stack of printed inserts**: two decoy sheets sit behind the active one (`#e4dfd3` at +1.2°, `#ece8de` at -.2°). The active sheet is `#f5f2ea`, 960×690, at left 420, top 180, `rotate(-1deg)`.
- **Genre tabs**
  - Absolute: left 444, top 132, 6px gap, the same -1° rotation, radius `6px 6px 0 0`.
  - Active tab: 48px tall, `#131211`, paper text.
  - Inactive tab: 40px tall, 8px top margin, `#d6cfbf`, `white-space:nowrap`; on hover `translateY(-4px)` (180ms).
  - Each tab shows the track count (mono 11px), then the genre name (Archivo 700, 16–17px).
- **Active sheet contents**
  - Black header band, padding 22/32: genre name (Archivo 850, 40px, stretch 72%) and description (15px, `#cfc9bd`) on the left; "{n} tracks · {min}–{max} bpm" (mono 12px) on the right.
  - Legend: "Speed (beats per minute)" (3px black line), "Energy, 1–10" (grey square `#c8c1b2`), "Most intense" (accent ring).
  - Chart, 270px tall, SVG `viewBox 0 0 860 270`:
    - Grey energy bars, 26px wide, height = energy × 21.
    - Black speed line, 3px, with dots r 6 and a 2px paper stroke.
    - Accent ring (r 14) on the highest-energy track.
    - **The speed scale is fixed at 118–154 bpm on every genre**, so sheets compare honestly. Tick labels at 120/130/140/150.
  - Track list: 2 columns, 40px column gap. Rows use grid `30px minmax(0,1fr) auto`, mono 13px, 1px bottom rule. Format: "01 · [Artist] – [Track] · 128 · 4/10" (nowrap).
- **Placeholder genres**: Hard techno (8 tracks), Hypnotic techno (9), Minimal (7), Electro (6), Acid (7), each with a one-line description. Adding a genre = adding one insert (data file).

### 1h — Plain index + pressing history
**Purpose:** a text-only, accessible, keyboard-first list of everything, one click from the crate.

- Background `#f3f0e9`. No grain.
- Grid `minmax(0,1fr) 380px`, gap 80.
- **Left side**
  - "Index" (44px) and "Everything on the site, as a list."
  - Groups: Career / Experiments / What I'm playing. Each group has a mono 12px `#8a857b` heading over a 1px ink rule.
  - Each row is a link with a 1px `rgba(19,17,16,.14)` bottom rule and 11px vertical padding.
  - Career rows: `110px | company (600) | role | years (mono 13)`. Experiment and playing rows: `110px | title | type`.
- **Right side: "Pressing history"** (the changelog)
  - Heading, then "What changed on the site, newest first."
  - Rows: pressing number (mono 700) | description, with the commit hash beneath in `#8a857b`.

### 1i — Crate view (mobile, 390×844)
- **Header**: 16px mark and a 17px wordmark; "Index" link with a 44px hit area.
- **Welcome line**: 29px, top 86.
- **Divider tabs** (top 222): 44px tall. Active is `#d6cfbf`; inactive is `#c9c1b0` with `#3a3732` text. A 6px `#d6cfbf` strip joins them to the crate.
- **The crate is seen from above**: records behind peek over the pulled one as 60px strips at top 278/296/314 (HLV-001 318 wide; HLV-002 198 wide and centred; HLV-003 318 wide). They are followed by the **pulled HLV-004 at 318×318** (shadow `0 14px 26px rgba(0,0,0,.35)`).
- **Caption row**: "Crayon / 2023 – now" and a black "Open →" button, 44px tall.
- **Lip**: 86px, black; "← swipe to flip →" and a "Plain index" link.

---

## Recurring components

### Centre label (SVG, viewBox 0 0 100 100)
- Circle fill paper `#ebe6db`, with an inner ring at r 45.5 (stroke .35).
- Half-disc logo mark at the top (cy 17.5, r 6.5).
- "HALVTONE" at y 32.5: Archivo 800, 6.2, stretch 75%, letter-spacing .8.
- Side letter at left (x 21, Archivo 800, 9).
- Side count "2/4" at right (mono 3.6).
- **Catalog number, largest text**: y 69, mono 700, 11.
- Employer: y 77.5, Archivo 600, 4.8.
- Years: y 84, mono 3.8.
- Spindle hole: r 2.4, ink.

**White label variant:** `#f7f5f0` fill; handwritten title (Caveat 700, about 10.5, -5°) above the spindle; stamped catalog number in a rectangle (3° rotation, opacity .8–.85) below.

### Disc (SVG, viewBox 0 0 200 200)
- Body: `#0e0d0c` circle, r 99.
- Grooves: concentric circles from r 42 to 97, step 1.5, stroke `#272523`, width .4.
- Track gaps: 2–3 darker rings (`#050505`, width 1.4) at radii set by the track count.
- Label: nested at 66,66, size 68×68.
- **Runout etching**: a textPath on a circle at r 38.4 (between label and grooves). Mono 2.5, letter-spacing .5, `#8a857b`. Content: "{shortCommitHash} · pressing {n} · HLV-004 · side B ·", repeated. **It is filled from the latest deploy's git SHA at build time.**
- A static sheen layer sits over the spinning face and does not rotate: two broad arcs at 3.5% and 2.5% white.
- Stylized and flat. **Never photorealistic.**

### Stickers
There is one accent colour. The **treatment** encodes the record type:

| Type | Treatment |
|---|---|
| Career | **Solid accent** circle, ink text |
| Experiment | **White** circle with a stamped **accent ring** (3px), ink text |
| What I'm playing | **Black** circle with **accent** text |

Special stickers:
- **Return** ("Back at Audo"): a small accent circle, about 12° rotation.
- **In progress**: accent tape rectangle, mono 600, about -2°.
- **Headline** on HLV-004: an accent rectangle, radius 2, 3–4° rotation, with a white speckle overlay.

All stickers are slightly crooked and never at 0°.

### Cover art (generative, all SVG viewBox 0 0 100 100)
A seeded series (`seed = record index`) feeds every cover; only the drawing rule changes. That shift in drawing rule is the career story told visually. **Replace the series with real per-role data.**

- **Stage 0 (HLV-001)** — office report: `#f3f0e8` background, 5 hairline gridlines `#cfc9bd`, a 24-point ink polyline (.6), a baseline.
- **Stage 1 (HLV-002)** — bars: paper background, 18 ink bars 2.6 wide with height = value × 46, a baseline.
- **Stage 2 (HLV-003)** — halftone field: ink background, a 14×14 dot grid (step 6.9) with radius `.3 + v×2.7`, dots skipped within r 21 of centre (die-cut).
- **Stage 3 (HLV-004)** — radial: ink background, 120 radial lines from r 21 to r `21+v×27`, paper, .42 wide. A misregistered grey copy (`#5f5b55`) is offset (.8, .5). There is a ring at r 19.5 and crop marks in the corners.

Die-cut hole: a circle at 33%/33%, size 34%, showing the centre label, with `box-shadow: inset 0 0 0 2px rgba(0,0,0,.5)`.

### Texture
- **Photocopy grain**: an SVG `feTurbulence` (fractalNoise, baseFrequency .8, 2 octaves) turned into a tiling data-URI background.
  - Paper surfaces: dark specks, alpha = `1.1a − .3`, opacity .55, `mix-blend-mode:multiply`.
  - Dark surfaces: light specks, alpha = `1.4a − .62`, opacity .38.
- **Stamp ink unevenness**: paper-coloured noise knockout, alpha = `7a − 4`, baseFrequency .55, laid on top of stamps.
- **Misregistration**: a 2px/1px grey ghost `text-shadow` on display type. **The accent is never used for misregistration.**

## Interactions & Behavior
- **Crate hover** (desktop, 1b): each record lifts and tilts from its bottom edge.
  - Records: `transform-origin: 30% 100%`; `translateY(-18px) rotate(-2.5deg)`; shadow grows to `-6px 10px 20px rgba(0,0,0,.3)`; `transition: transform 260ms cubic-bezier(.2,.7,.2,1), box-shadow 260ms`.
  - The pulled record goes to `translateY(-92px) rotate(-1.5deg)`.
  - The chart insert goes to `rotate(-1deg) translateY(-18px)`.
- **Crate navigation**:
  - Clicking a divider tab scrolls or flips the crate to that section.
  - Clicking a record pulls it forward: it becomes the "pulled" state and gets the caption.
  - "Open" goes to the inspection view.
  - Left/right keys and drag flip through the crate; on mobile, swiping does.
- **Inspection**: "Turn it over" flips the sleeve on its Y axis (400ms); under reduced motion it cross-fades instead. "Open the record" goes to 1e.
- **Opened**: the disc slides out of the sleeve on open. Side tabs switch the content (A/B/C; D is empty).
- **Loops**:
  - Centre label in the die-cut: rotates once every 18s, linear, infinite.
  - Opened disc: once every 24s.
  - White-label disc: once every 30s.
  - Never strobe or flash.
- **Experiment chart**: dots drop in one at a time on first view (once, not looped). Hovering a dot shows that track.
- **Playing chart**: switching tabs slides the new sheet up out of the stack (300ms) and redraws the line. Optionally, a small marker walks the points on a 20s loop.
- **`prefers-reduced-motion: reduce`**: no rotation, instant lifts and swaps, charts shown complete.
- **Responsive**: at mobile widths the desktop horizontal crate becomes the vertical from-above crate (1i). All hit targets are at least 44px.

## State Management
- `crate.pulledId`: the record currently pulled forward.
- `crate.section`: career | experiments | playing (driven by divider tabs and scroll).
- `record.face`: front | back (inspection).
- `record.side`: A | B | C | D (opened).
- `playing.genreIndex`: the active insert.
- **Content is data-driven**, one file per record: `{ cat, type: 'career'|'experiment'|'playing', size: 'small'|'large'|'large-spine'|'double', title, company, years, sides[], coverSeries[], sticker? }`.
- **Build-time values**:
  - Latest commit SHA, for the runout etching.
  - Pressing number, for the pressing history.
  - Pressing history entries, generated from tagged releases or commit messages.

## Design Tokens
- **Colors**

  | Name | Value | Use |
  |---|---|---|
  | ink | `#131211` | text, dark sleeves |
  | back sleeve | `#161514` | back-cover background |
  | disc body | `#0e0d0c` | record body |
  | grooves | `#272523` | disc grooves |
  | spine | `#262422` | sleeve spines |
  | paper | `#ebe6db` | main background |
  | index paper | `#f3f0e9` | index background; also the stage-0 cover background (`#f3f0e8`) |
  | insert paper | `#f5f2ea` | chart inserts |
  | white label | `#f7f5f0` | experiment sleeves and labels |
  | card stock | `#d6cfbf` | divider cards, active tab |
  | card stock dark | `#c9c1b0` | inactive tabs |
  | energy bars | `#c8c1b2` | playing chart |
  | muted text | `#4a4640` | secondary text |
  | faint text | `#8a857b` | tertiary text |
  | on-dark muted | `#b7b1a5`, `#cfc9bd` | secondary text on dark |
  | **accent** | `oklch(0.66 0.21 36)` (≈ `#ea5a2a`) | **stickers and chart markers only**; text on it is always ink |

- **Type**

  | Family | Role | Settings |
  |---|---|---|
  | Archivo (variable: wdth 62–125, wght 100–900) | identity, titles, body | `font-stretch` 72–80%; weights 400/600/700/750/800/850 |
  | IBM Plex Mono (400/500/600/700) | catalog numbers, metadata, credits | — |
  | Caveat (500/700) | white-label titles and edition numbers **only** | — |

  - Sizes used: 104 / 96 / 58 / 56 / 50 / 46 / 44 / 40 / 29 / 26 / 24 / 22 / 20 / 17 / 16 / 15 / 14 / 13 / 12 / 11 / 10.
- **Spacing**:
  - Gutters: 56 (desktop), 24 (mobile).
  - Common gaps: 6, 8, 10, 14, 18, 22, 28, 40, 44, 80.
- **Radius**:
  - 0 on sleeves (square).
  - 2–5 on stickers and stamps.
  - `6px 6px 0 0` on tabs.
  - 50% on circles.
- **Shadows**:
  - Strip: `-3px 0 8px rgba(0,0,0,.22)`.
  - Sleeve: `2px 3px 8px rgba(0,0,0,.2)`.
  - Pulled: `-6px 14px 24px rgba(0,0,0,.35)`.
  - Inspection: `4px 8px 22px rgba(0,0,0,.3)`.
  - Sticker: `0 1px 2px rgba(0,0,0,.2)`.

## Assets
- **No raster images**. Covers, labels, discs and charts are generated SVG. Grain is an inline SVG noise data URI. Fonts come from Google Fonts.
- Everything is **original**; it imitates no real label.
- **Placeholders to replace**: label name and prefix (HALVTONE / HLV), all [bracketed] copy, the collaborator names, the chart data (USB export, genre lists), the tech stack in the credits, and the commit hashes.

## Files
- `Record Crate.dc.html`: all 9 artboards (1a–1i). The generation logic for covers, labels, discs, charts and texture lives in the `<script>` class at the bottom.
- `support.js`: the runtime needed to open the HTML reference locally. Not for production.
