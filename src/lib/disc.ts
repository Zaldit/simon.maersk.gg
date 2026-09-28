/**
 * Radii of a disc's darker track-gap rings (viewBox 0 0 200 200): 2–3 rings
 * splitting the groove band (r 42–97) evenly by the side's track count.
 * Shared by Disc.astro and the side switcher, which re-presses them.
 */
export function gapRadii(trackCount: number): number[] {
  const rings = Math.min(3, Math.max(2, trackCount));
  return Array.from({ length: rings }, (_, i) => Math.round((42 + (55 * (i + 1)) / (rings + 1)) * 10) / 10);
}
