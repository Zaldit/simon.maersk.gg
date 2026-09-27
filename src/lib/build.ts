/**
 * Values baked in at build time.
 *
 * Cloudflare Pages clones shallowly, so nothing here reads git tags. The SHA
 * comes from CF_PAGES_COMMIT_SHA, falling back to `git rev-parse` locally, and
 * the pressing history comes from src/content/pressings.json (written by
 * `npm run press`).
 */
import { execSync } from 'node:child_process';
import pressingsJson from '../content/pressings.json';

export interface Pressing {
  number: number;
  description: string;
  sha: string;
}

function localSha(): string | undefined {
  try {
    return execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

/** Short SHA of the commit being deployed. */
export const commitSha: string =
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 7) || localSha() || '0000000';

/** The production branch configured in Cloudflare Pages. Override with PRODUCTION_BRANCH. */
const productionBranch = process.env.PRODUCTION_BRANCH || 'main';
const branch = process.env.CF_PAGES_BRANCH;

/** Branch name on Cloudflare Pages preview deploys; undefined on production and locally. */
export const previewBranch: string | undefined =
  process.env.CF_PAGES === '1' && branch && branch !== productionBranch ? branch : undefined;

/** Newest first. */
export const pressings: Pressing[] = [...(pressingsJson as Pressing[])].sort(
  (a, b) => b.number - a.number,
);

export const latestPressing: Pressing | undefined = pressings[0];

export const pad2 = (n: number) => String(n).padStart(2, '0');
