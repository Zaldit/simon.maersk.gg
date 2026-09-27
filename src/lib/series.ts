/** Seeded randomness and the value series that feed the generated covers. */

/** Park–Miller LCG, as used by the design reference. Returns values in (0, 1]. */
export function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * The placeholder series from the reference (seed = record index).
 * Used once to seed coverSeries in the record files; replace with real per-role data.
 */
export function placeholderSeries(seed: number, n: number): number[] {
  const r = rng(seed * 9301 + 7);
  return Array.from({ length: n }, (_, i) =>
    clamp(
      0.5 + 0.3 * Math.sin(i * 0.29 + seed) + 0.22 * Math.sin(i * 0.83 + seed * 2) + 0.3 * (r() - 0.5),
      0.08,
      1,
    ),
  );
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Normalise a raw series to 0.08–1 and fit it to `n` values.
 * Values already in 0–1 are kept as they are; anything larger is scaled by the max.
 * A longer series is truncated, a shorter one is stretched by linear interpolation.
 */
export function fitSeries(raw: readonly number[], n: number): number[] {
  if (raw.length === 0) return Array.from({ length: n }, () => 0.5);
  const max = Math.max(...raw);
  const scaled = max > 1 ? raw.map((v) => v / max) : [...raw];
  let out: number[];
  if (scaled.length >= n) {
    out = scaled.slice(0, n);
  } else if (scaled.length === 1) {
    out = Array.from({ length: n }, () => scaled[0]!);
  } else {
    out = Array.from({ length: n }, (_, i) => {
      const t = (i / (n - 1)) * (scaled.length - 1);
      const lo = Math.floor(t);
      const hi = Math.min(scaled.length - 1, lo + 1);
      return scaled[lo]! + (scaled[hi]! - scaled[lo]!) * (t - lo);
    });
  }
  return out.map((v) => clamp(v, 0.08, 1));
}

/** Round for compact SVG output. */
export const r2 = (v: number) => Math.round(v * 100) / 100;
export const r3 = (v: number) => Math.round(v * 1000) / 1000;
