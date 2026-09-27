#!/usr/bin/env node
/**
 * Press a new release of the site.
 *
 *   npm run press -- "Added HLV-X02"
 *   npm run press -- "Added HLV-X02" --dry-run
 *
 * 1. Checks the working tree is clean (commit your changes first).
 * 2. Appends { number, description, sha } to src/content/pressings.json, where
 *    sha is the short hash of HEAD: the commit being pressed.
 * 3. Commits only that file as "Pressing NN: <description>".
 * 4. Tags that commit pressing-N.
 *
 * Nothing is pushed. The build reads pressings.json, never git tags, because
 * Cloudflare Pages clones shallowly and tags may be missing.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../src/content/pressings.json', import.meta.url));
const REL = 'src/content/pressings.json';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const description = args
  .filter((a) => a !== '--dry-run')
  .join(' ')
  .trim();

const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const fail = (msg) => {
  console.error(`press: ${msg}`);
  process.exit(1);
};

if (!description) fail('describe the pressing, e.g. npm run press -- "Added HLV-X02"');

const dirty = git('status', '--porcelain', '--untracked-files=no');
if (dirty) fail(`commit or stash your changes first:\n${dirty}`);

const pressings = JSON.parse(readFileSync(FILE, 'utf8'));
if (!Array.isArray(pressings)) fail(`${REL} must be a JSON array`);

const number = pressings.reduce((max, p) => Math.max(max, p.number), 0) + 1;
const sha = git('rev-parse', '--short=7', 'HEAD');
const tag = `pressing-${number}`;
const nn = String(number).padStart(2, '0');

if (git('tag', '--list', tag)) fail(`tag ${tag} already exists`);

const entry = { number, description, sha };
console.log(`Pressing ${nn}: ${description} (${sha}) → tag ${tag}`);
if (dryRun) process.exit(0);

pressings.push(entry);
writeFileSync(FILE, `${JSON.stringify(pressings, null, 2)}\n`);
git('commit', '-m', `Pressing ${nn}: ${description}`, '--', REL);
git('tag', '-a', tag, '-m', `Pressing ${nn}: ${description}`);
console.log(`Committed and tagged ${tag}. Push with: git push --follow-tags`);
