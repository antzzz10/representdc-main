#!/usr/bin/env node

/**
 * Deploys dist/ to the gh-pages branch.
 *
 * Replaces a bare `gh-pages -d dist --dotfiles` CLI call for two reasons, both from
 * the news pipeline's design (NEWS-AND-ANALYSIS-PRD.md section A):
 *
 * 1. `api/news.json` is written by the news workflow, never by a deploy. The remove
 *    pattern below excludes it so a manual deploy can't roll the feed back, and this
 *    script refuses to run if a build ever starts producing that file.
 *
 * 2. `ghpages.publish()` reports failures through its callback and resolves its promise
 *    anyway (lib/index.js:254). Awaiting it would swallow exactly the rejected push we
 *    rely on seeing when a deploy races the bot. Everything below turns a callback
 *    error into a non-zero exit.
 */

import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ghpages from 'gh-pages';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '../dist');
const NEWS_PATH = 'api/news.json';

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// The news file must never ride along in a deploy: publishing it here would overwrite
// whatever the news workflow last published.
if (existsSync(join(DIST, NEWS_PATH))) {
  console.error(
    `dist/${NEWS_PATH} exists. A deploy must not carry the news feed — it is published\n` +
      'only by .github/workflows/fetch-news.yml. Remove it from the build and retry.',
  );
  process.exit(1);
}

const options = {
  dotfiles: true,
  history: true,
  // Everything on the branch is replaced except the news feed. Verified against the
  // installed gh-pages 6.3.0: patterns are passed to globby, so the negation holds.
  remove: ['**', `!${NEWS_PATH}`],
  message: `Deploy ${new Date().toISOString()}`,
};

ghpages.publish(DIST, options, (err) => {
  if (err) {
    console.error(`\nDeploy failed: ${err.message}`);
    console.error(
      'If this was a rejected push, the news workflow published while this deploy was\n' +
        'running. Nothing was lost — just run `npm run deploy` again.',
    );
    process.exit(1);
  }
  console.log('Deployed to gh-pages.');
});
