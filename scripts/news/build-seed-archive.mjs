#!/usr/bin/env node

/**
 * Builds scripts/news/seed-archive.json from downloaded run records. One-off, kept so
 * the seed's derivation can be repeated and checked.
 *
 * The seed is what the scan's memory starts from on the first run after 2026-11-21,
 * when gh-pages has no api/news-archive.json yet (fetch-news.mjs, loadSeed). It is never
 * read again once that file exists, and the pipeline never reads the run records.
 *
 * Rule, the same two-yes rule the live archive uses (archive.mjs): an article is seeded
 * only if at least two different runs PUBLISHED it. `firstSeen` is the start of the
 * first such run and `confirmedAt` the start of the second. Runs that pushed nothing
 * (not-published, dry-run) do not count.
 *
 * Two of today's rules are applied to the old records, so the seed cannot bring back
 * what the pipeline has since stopped publishing:
 *   - multi-story roundups ("The Needle: ...") are left out, as isRoundup has skipped
 *     them since 2026-11-04;
 *   - titles are entity-decoded, as feeds.mjs has done since 2026-10-07 (older records
 *     hold "DC&#8217;s").
 *
 * Usage: node scripts/news/build-seed-archive.mjs <folder of run records> [output file]
 * The folder is searched recursively for run-record.json files (the workflow's
 * `run-record-<id>-<attempt>` artifacts, unzipped).
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { archivable, validateArchive, ARCHIVE_VERSION, CONFIRM_AFTER_YES } from './archive.mjs';
import { decodeEntities } from './feeds.mjs';
import { isRoundup } from './summarize.mjs';

// Published twice by earlier runs but plainly not statehood coverage (the outlet's own
// crossword and print-edition notices). Left out of the permanent record, 2026-11-21.
const NOT_STATEHOOD = new Set([
  'https://51st.news/the-51sts-first-crossword-puzzle/',
  'https://51st.news/the-51st-in-print/',
]);

const PUSHED_OUTCOMES = new Set(['published', 'published-empty', 'summary-withheld', 'summary-disabled', 'pushed-not-live']);

const [, , runsDir, outArg] = process.argv;
if (!runsDir) {
  console.error('Usage: node scripts/news/build-seed-archive.mjs <folder of run records> [output file]');
  process.exit(1);
}
const outPath = outArg ?? fileURLToPath(new URL('./seed-archive.json', import.meta.url));

function findRecords(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return findRecords(path);
    return name === 'run-record.json' ? [path] : [];
  });
}

const runs = findRecords(runsDir)
  .map((path) => JSON.parse(readFileSync(path, 'utf8')))
  .filter((r) => PUSHED_OUTCOMES.has(r.outcome) && Number.isFinite(new Date(r.startedAt).getTime()))
  .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

// link -> { article as first published, the distinct runs that published it, in order }
const seen = new Map();
const runIds = new Set();
for (const run of runs) {
  // A record downloaded twice must not count as two runs.
  if (runIds.has(run.runId)) continue;
  runIds.add(run.runId);
  for (const article of run.articles ?? []) {
    if (!archivable(article, new Date(run.startedAt).getTime()) || isRoundup(article.title)) continue;
    if (NOT_STATEHOOD.has(article.link)) continue;
    const entry = seen.get(article.link) ?? { article, startedAt: [] };
    entry.startedAt.push(new Date(run.startedAt).toISOString());
    seen.set(article.link, entry);
  }
}

const items = [...seen.values()]
  .filter((entry) => entry.startedAt.length >= CONFIRM_AFTER_YES)
  .map(({ article, startedAt }) => ({
    link: article.link,
    title: decodeEntities(article.title),
    source: article.source,
    pubDate: new Date(article.pubDate).toISOString(),
    firstSeen: startedAt[0],
    confirmedAt: startedAt[CONFIRM_AFTER_YES - 1],
  }))
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

const seed = validateArchive({ version: ARCHIVE_VERSION, items, pending: [], feedHealth: {} });
writeFileSync(outPath, `${JSON.stringify(seed, null, 2)}\n`);

const bySource = {};
for (const item of items) bySource[item.source] = (bySource[item.source] ?? 0) + 1;
console.log(`${runIds.size} publishing runs read, ${seen.size} distinct articles published, ${items.length} published by ${CONFIRM_AFTER_YES}+ runs`);
console.log(`by source: ${JSON.stringify(bySource)}`);
if (items.length) console.log(`published ${items.at(-1).pubDate.slice(0, 10)} to ${items[0].pubDate.slice(0, 10)}`);
console.log(`wrote ${outPath}`);
