#!/usr/bin/env node

/**
 * Deploys dist/ to the gh-pages branch.
 *
 * Replaces a bare `gh-pages -d dist --dotfiles` CLI call for two reasons, both from
 * the news pipeline's design (NEWS-AND-ANALYSIS-PRD.md section A):
 *
 * 1. `api/news.json` and `api/news-archive.json` are written by the news workflow,
 *    never by a deploy. The remove patterns below exclude both, so a manual deploy can't
 *    roll the feed back or delete the archive, and this script refuses to run if a build
 *    ever starts producing either file. The archive matters most: it is the permanent
 *    record of every confirmed article and gh-pages holds the only copy
 *    (scripts/eval/deploy.test.mjs runs this script against a scratch repo to prove it
 *    survives).
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
// DEPLOY_TEST_DIST and DEPLOY_TEST_REPO exist only for scripts/eval/deploy.test.mjs,
// which points this script at a scratch build and a local bare repo. Unset, as in every
// real deploy, the script publishes dist/ to this checkout's origin.
const DIST = process.env.DEPLOY_TEST_DIST || join(__dirname, '../dist');
// Owned by the news workflow. Kept in step with NEWS_PATH and ARCHIVE_PATH in
// scripts/news/ by the deploy test, which asserts both survive a deploy.
const NEWS_OWNED_PATHS = ['api/news.json', 'api/news-archive.json'];

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// The news files must never ride along in a deploy: publishing one here would overwrite
// whatever the news workflow last published.
for (const path of NEWS_OWNED_PATHS) {
  if (existsSync(join(DIST, path))) {
    console.error(
      `dist/${path} exists. A deploy must not carry the news feed or its archive — they are\n` +
        'published only by .github/workflows/fetch-news.yml. Remove it from the build and retry.',
    );
    process.exit(1);
  }
}

const options = {
  dotfiles: true,
  history: true,
  // Everything on the branch is replaced except the news feed and its archive. Verified
  // against the installed gh-pages 6.3.0: patterns are passed to globby, so the
  // negations hold.
  remove: ['**', ...NEWS_OWNED_PATHS.map((path) => `!${path}`)],
  message: `Deploy ${new Date().toISOString()}`,
  ...(process.env.DEPLOY_TEST_REPO ? { repo: process.env.DEPLOY_TEST_REPO } : {}),
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
