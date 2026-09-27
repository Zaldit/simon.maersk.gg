/** The 12 minor keys in Camelot order (1A–12A), in plain words. */
export const MINOR_KEYS = [
  'A♭ minor',
  'E♭ minor',
  'B♭ minor',
  'F minor',
  'C minor',
  'G minor',
  'D minor',
  'A minor',
  'E minor',
  'B minor',
  'F♯ minor',
  'D♭ minor',
] as const;

/** '8A' → 7 (zero-based row in Camelot order). */
export function camelotIndex(camelot: string): number {
  const n = Number.parseInt(camelot, 10);
  return Number.isFinite(n) ? (((n - 1) % 12) + 12) % 12 : 0;
}

/** Fixed speed scale on every genre insert, so sheets compare honestly. */
export const PLAYING_BPM = { min: 118, max: 154 } as const;
