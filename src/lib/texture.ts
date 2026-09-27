/**
 * Photocopy grain and stamp-ink unevenness, as tiling SVG noise data URIs.
 * feTurbulence (fractalNoise, 2 octaves) → feColorMatrix that maps noise to a
 * flat colour with alpha = slope·a + offset (README "Texture").
 */
type RGB = readonly [number, number, number];

function noise(rgb: RGB, slope: number, offset: number, frequency: number): string {
  const [r, g, b] = rgb;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>` +
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frequency}' numOctaves='2' stitchTiles='stitch'/>` +
    `<feColorMatrix values='0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${slope} ${offset}'/></filter>` +
    `<rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
}

export const textures = {
  /** Paper surfaces: dark specks, alpha = 1.1a − .3; used at opacity .55, multiply. */
  grainLight: noise([0.07, 0.07, 0.06], 1.1, -0.3, 0.8),
  /** Dark surfaces: light specks, alpha = 1.4a − .62; used at opacity .38. */
  grainDark: noise([0.92, 0.9, 0.86], 1.4, -0.62, 0.8),
  /** Stamp knockout in paper colour, alpha = 7a − 4, baseFrequency .55. */
  inkPaper: noise([0.922, 0.902, 0.859], 7, -4, 0.55),
  /** White speckle over accent stickers. */
  inkWhite: noise([1, 1, 1], 7, -4.1, 0.6),
} as const;

/** Custom properties injected once into :root by the base layout. */
export const textureCss =
  `:root{` +
  `--tex-grain-light:${textures.grainLight};` +
  `--tex-grain-dark:${textures.grainDark};` +
  `--tex-ink-paper:${textures.inkPaper};` +
  `--tex-ink-white:${textures.inkWhite};` +
  `}`;
