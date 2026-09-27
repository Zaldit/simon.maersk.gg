import { getCollection, type CollectionEntry } from 'astro:content';
import type { LabelData } from '../components/svg/CenterLabel.astro';
import { yearsShort, type Span } from './format';
import { commitSha, latestPressing, pad2 } from './build';

export type RecordEntry = CollectionEntry<'records'>;
type Data = RecordEntry['data'];
export type CareerData = Extract<Data, { type: 'career' }>;
export type ExperimentData = Extract<Data, { type: 'experiment' }>;
export type PlayingData = Extract<Data, { type: 'playing' }>;
export type Career = RecordEntry & { data: CareerData };
export type Experiment = RecordEntry & { data: ExperimentData };
export type Playing = RecordEntry & { data: PlayingData };
export type Side = CareerData['sides'][number];

const byCat = (a: { data: { cat?: string | undefined } }, b: { data: { cat?: string | undefined } }) =>
  (a.data.cat ?? '').localeCompare(b.data.cat ?? '', 'en', { numeric: true });

export async function getRecords() {
  const all = await getCollection('records');
  const career = all.filter((r): r is Career => r.data.type === 'career').sort(byCat);
  const experiments = all.filter((r): r is Experiment => r.data.type === 'experiment').sort(byCat);
  const playing = all
    .filter((r): r is Playing => r.data.type === 'playing')
    .sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
  return { career, experiments, playing };
}

/** "HLV-004" → "hlv-004" */
export const slug = (cat: string) => cat.toLowerCase();
/** "01-hard-techno" → "hard-techno" */
export const genreSlug = (id: string) => id.replace(/^\d+-/, '');

export const careerHref = (r: Career) => `/records/${slug(r.data.cat)}/`;
export const sideHref = (r: Career, side: string) => `/records/${slug(r.data.cat)}/${side.toLowerCase()}/`;
export const experimentHref = (r: Experiment) => `/experiments/${slug(r.data.cat)}/`;
export const genreHref = (r: Playing) => `/playing/#${genreSlug(r.id)}`;

/** The record index used to seed the cover drawing: "HLV-004" → 4. */
export const seedOf = (cat: string) => Number.parseInt(cat.replace(/\D/g, ''), 10) || 1;

/** Sides with content (the empty Side D is decorative). */
export const realSides = (r: Career) => r.data.sides.filter((s) => s.status !== 'empty');

export const featuredSide = (r: Career): Side =>
  realSides(r).find((s) => s.side === r.data.featuredSide) ?? realSides(r)[0] ?? r.data.sides[0]!;

export const sideTitle = (s: Side) => s.title ?? `Side ${s.side}`;
export const sideShort = (s: Side) => s.short ?? sideTitle(s);

/**
 * The roles on a record. Every side uses its short name except the last, which
 * is spelled out: "BI Developer → Senior Full Stack Engineer" (career captions)
 * or "BI Developer · Full Stack Engineer · Senior Full Stack Engineer" (index).
 */
export function roleLine(r: Career, joiner: ' → ' | ' · ' = ' → '): string {
  const sides = realSides(r);
  if (sides.length === 0) return '';
  const names = sides.map((s, i) => (i === sides.length - 1 ? sideTitle(s) : sideShort(s)));
  return joiner === ' → ' && names.length > 2 ? `${names[0]} → ${names[names.length - 1]}` : names.join(joiner);
}

/** "Audo, again" when an earlier career record has the same company. */
export function companyCaption(r: Career, all: Career[]): string {
  const i = all.indexOf(r);
  const before = all.slice(0, i).some((o) => o.data.company === r.data.company);
  return before ? `${r.data.company}, again` : r.data.company;
}

export const recordSpan = (r: Career): Span => r.data.years;
export const sideSpan = (r: Career, s: Side): Span => s.years ?? r.data.years;

/** Centre label for a career record's side. */
export function careerLabel(r: Career, s: Side = featuredSide(r)): LabelData {
  const sides = r.data.sides;
  return {
    cat: r.data.cat,
    line: r.data.companyShort ?? r.data.company,
    years: yearsShort(r.data.years),
    side: s.side,
    count: `${sides.indexOf(s) + 1}/${sides.length}`,
  };
}

export function experimentLabel(r: Experiment): LabelData {
  return { variant: 'white', cat: r.data.cat, title: r.data.labelTitle ?? r.data.handTitle };
}

/** Runout etching: "{sha} · pressing {n} · HLV-004 · side B ·" */
export function careerEtch(r: Career, s: Side): string {
  const pressing = latestPressing ? ` · pressing ${pad2(latestPressing.number)}` : '';
  return `${commitSha}${pressing} · ${r.data.cat} · side ${s.side} ·`;
}
export const experimentEtch = () => `${commitSha} · test pressing ·`;
