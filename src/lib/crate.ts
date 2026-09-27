/**
 * Crate geometry (frame 1b), shared by the server render and the client script.
 * Items overlap so exactly 64px of each earlier item shows:
 *   marginLeft = 64 − previousItemWidth
 * except the item right after the pulled record, which sits 16px clear of it.
 */
export const PEEK = 64;
export const CLEAR = 16;
export const PULL_LIFT = 80;

export function crateMargins(widths: readonly number[], pulled: number): number[] {
  return widths.map((_, i) => {
    if (i === 0) return 0;
    return i - 1 === pulled ? CLEAR : PEEK - widths[i - 1]!;
  });
}

/** Left edge of every item, relative to the row. */
export function crateOffsets(widths: readonly number[], pulled: number): number[] {
  const margins = crateMargins(widths, pulled);
  const xs: number[] = [];
  let x = 0;
  widths.forEach((w, i) => {
    x += margins[i]!;
    xs.push(x);
    x += w;
  });
  return xs;
}

/** Total row width for a given pulled item. */
export function crateWidth(widths: readonly number[], pulled: number): number {
  const xs = crateOffsets(widths, pulled);
  const last = widths.length - 1;
  return last < 0 ? 0 : xs[last]! + widths[last]!;
}
