let counter = 0;
/** Unique ids for SVG defs (textPath, clipPath) within a build. */
export const uid = (prefix: string) => `${prefix}-${(++counter).toString(36)}`;
