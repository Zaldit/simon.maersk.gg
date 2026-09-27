import { yearsShort } from './format';
import {
  careerHref,
  companyCaption,
  experimentHref,
  roleLine,
  type Career,
  type Experiment,
  type Playing,
} from './records';

export type Section = 'career' | 'experiments' | 'playing';

export const SECTIONS: { id: Section; label: string }[] = [
  { id: 'career', label: 'Career' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'playing', label: "What I'm playing" },
];

interface Base {
  key: string;
  section: Section;
  href: string;
  /** Caption, first line: company, handwritten title or "Currently playing". */
  name: string;
  /** Caption, second line: years, "Experiment", "8 tracks". */
  meta: string;
  /** Catalog number, shown in the desktop caption (decorative). */
  cat?: string;
  /** Accessible name for the record's link. */
  label: string;
  /** Width in the desktop crate. */
  width: number;
}
export type CrateEntry =
  | (Base & { kind: 'career'; record: Career })
  | (Base & { kind: 'experiment'; record: Experiment })
  | (Base & { kind: 'insert'; genre: Playing });

export function crateEntries(career: Career[], experiments: Experiment[], playing: Playing[]): CrateEntry[] {
  const entries: CrateEntry[] = [];
  for (const r of career) {
    const years = yearsShort(r.data.years);
    entries.push({
      kind: 'career',
      record: r,
      key: r.data.cat,
      section: 'career',
      href: careerHref(r),
      cat: r.data.cat,
      name: companyCaption(r, career),
      meta: years,
      label: `${companyCaption(r, career)}: ${roleLine(r)}, ${years}`,
      width: r.data.size === 'small' ? 190 : 330,
    });
  }
  for (const r of experiments) {
    entries.push({
      kind: 'experiment',
      record: r,
      key: r.data.cat,
      section: 'experiments',
      href: experimentHref(r),
      cat: r.data.cat,
      name: r.data.handTitle,
      meta: 'Experiment',
      label: `Experiment: ${r.data.headline}`,
      width: 330,
    });
  }
  const front = playing[0];
  if (front) {
    const n = front.data.tracks.length;
    entries.push({
      kind: 'insert',
      genre: front,
      key: 'insert',
      section: 'playing',
      href: '/playing/',
      name: 'Currently playing',
      meta: `${n} tracks`,
      label: `What I'm playing: ${playing.length} genres`,
      width: 250,
    });
  }
  return entries;
}

/** The record pulled forward on arrival: the latest career record. */
export function defaultPulled(entries: CrateEntry[]): number {
  let last = 0;
  entries.forEach((e, i) => {
    if (e.section === 'career') last = i;
  });
  return last;
}
