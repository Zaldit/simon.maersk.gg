/** Date formatting for record years. Inputs are 'YYYY' or 'YYYY-MM'; a missing end means "now". */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface Span {
  from: string;
  to?: string | undefined;
}

const year = (d: string) => d.slice(0, 4);
const month = (d: string) => {
  const m = Number(d.slice(5, 7));
  return m >= 1 && m <= 12 ? MONTHS[m - 1] : undefined;
};
const long = (d: string) => {
  const m = month(d);
  return m ? `${m} ${year(d)}` : year(d);
};

/** "2019 – 2020", "2023 – now" */
export const yearsShort = ({ from, to }: Span) => `${year(from)} – ${to ? year(to) : 'now'}`;

/** "Nov 2019 – Nov 2020", "Aug 2023 – now" */
export const yearsLong = ({ from, to }: Span) => `${long(from)} – ${to ? long(to) : 'now'}`;

/** "2023–24", "2025–26": the back-cover tracklist style. */
export const yearsCompact = ({ from, to }: Span) => {
  if (!to) return `${year(from)}–`;
  const a = year(from);
  const b = year(to);
  if (a === b) return a;
  return a.slice(0, 2) === b.slice(0, 2) ? `${a}–${b.slice(2)}` : `${a}–${b}`;
};

/** "2019" */
export const yearStart = ({ from }: Span) => year(from);
