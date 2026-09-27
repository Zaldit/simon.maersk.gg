/**
 * One file per record in src/content/records/. Adding a record = adding a file.
 *
 * Every record has { cat, type, size, title?, company?, years?, sides[], coverSeries[], sticker? }
 * (README "State Management"); the extra fields per type below carry what the
 * pages print. Anything in [brackets] is placeholder copy.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/, 'Use YYYY or YYYY-MM');
const span = z.object({ from: yearMonth, to: yearMonth.optional() });

const track = z.object({
  /** "B1" */
  id: z.string(),
  title: z.string(),
  feat: z.array(z.string()).default([]),
});

const side = z.object({
  side: z.string().regex(/^[A-Z]$/),
  /** Full title, e.g. "Business Intelligence Developer". */
  title: z.string().optional(),
  /** Short label for the side tabs, e.g. "BI Developer". Defaults to the title. */
  short: z.string().optional(),
  years: span.optional(),
  status: z.enum(['done', 'in-progress', 'empty']).default('done'),
  story: z.array(z.string()).default([]),
  outcome: z.object({ value: z.string(), caption: z.string() }).optional(),
  tracks: z.array(track).default([]),
  whyMovedOn: z.string().optional(),
});

const sticker = z.object({
  kind: z.enum(['dot', 'return', 'headline', 'experiment']),
  text: z.string().optional(),
  /** Headline sticker: the small mono line under the text. */
  sub: z.string().optional(),
});

const base = {
  /** Catalog number: SLM-001–099 career, SLM-X01– experiments. */
  cat: z.string(),
  size: z.enum(['small', 'large', 'large-spine', 'double']).default('large'),
  title: z.string().optional(),
  sticker: sticker.optional(),
  /** Left out of the build: no page, not in the crate or the index. */
  hidden: z.boolean().default(false),
};

const career = z.object({
  ...base,
  type: z.literal('career'),
  company: z.string(),
  /** Shorter company name for tight covers, e.g. "Mediq". */
  companyShort: z.string().optional(),
  /** Small line under the company on the office-report cover, e.g. "Supply chain". */
  coverSub: z.string().optional(),
  years: span,
  /** Drawing rule: 0 report line · 1 bars · 2 halftone field · 3 radial. */
  coverStage: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  /** Values that draw the cover. 0–1, or raw numbers (scaled by the max). */
  coverSeries: z.array(z.number()).min(1),
  /** The side printed on the centre label and opened first. */
  featuredSide: z.string().optional(),
  /** Hand-numbered edition, e.g. "043/300". */
  edition: z.string().optional(),
  /** One line in the inspection side column. */
  summary: z.string(),
  sides: z.array(side).min(1),
});

const scatterPoint = z.object({
  bpm: z.number(),
  /** Camelot minor key, 1A–12A. */
  key: z.string().regex(/^(1[0-2]|[1-9])A$/),
  artist: z.string().optional(),
  title: z.string().optional(),
});

const experiment = z.object({
  ...base,
  type: z.literal('experiment'),
  /** Page headline, e.g. "Every track on my DJ USB, sorted by speed and key". */
  headline: z.string(),
  /** Handwritten on the white label and sleeve. */
  handTitle: z.string(),
  /** Shorter handwritten title for the disc label. Defaults to handTitle. */
  labelTitle: z.string().optional(),
  /** Note after the catalog number in the meta line, e.g. "placeholder data". */
  note: z.string().optional(),
  chart: z
    .object({
      kind: z.literal('scatter'),
      summary: z.string(),
      points: z.array(scatterPoint),
      highlight: z
        .object({
          bpm: z.tuple([z.number(), z.number()]),
          keys: z.tuple([z.string(), z.string()]),
          label: z.string(),
        })
        .optional(),
    })
    .optional(),
  findings: z.array(z.string()).default([]),
  sides: z.array(side).default([]),
  coverSeries: z.array(z.number()).default([]),
});

const playing = z.object({
  ...base,
  type: z.literal('playing'),
  /** Inserts aren't catalogued; files sort by name (01-…, 02-…). */
  cat: z.string().optional(),
  /** Genre name. */
  title: z.string(),
  description: z.string(),
  tracks: z
    .array(
      z.object({
        artist: z.string(),
        title: z.string(),
        bpm: z.number(),
        /** 1–10, how intense it feels. */
        energy: z.number().min(1).max(10),
      }),
    )
    .min(1),
  sides: z.array(side).default([]),
  coverSeries: z.array(z.number()).default([]),
});

const records = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/records' }),
  schema: z.discriminatedUnion('type', [career, experiment, playing]),
});

export const collections = { records };
