#!/usr/bin/env node

/**
 * Adds one news link to www.representdc.org/news by hand.
 *
 * For articles from outlets the scan is not allowed to read (hand-link.mjs explains).
 * The owner supplies the link, headline, outlet and date; this checks them, adds the
 * article to the archive as a confirmed item, rebuilds the article list, pushes both
 * files in one commit and waits until the live site serves the change.
 *
 * No model is called and no outlet is fetched. It never bootstraps the archive: with no
 * archive on gh-pages it stops, like a scan does.
 *
 * Usage:  NEWS_LINK=... NEWS_TITLE=... NEWS_SOURCE=... [NEWS_DATE=YYYY-MM-DD] node scripts/news/add-link.mjs
 *    or:  node scripts/news/add-link.mjs <link> <title> <source> [YYYY-MM-DD]
 * Env:    GITHUB_TOKEN (to push), DRY_RUN=1 to do everything except the push.
 * Normally run by .github/workflows/add-news-link.yml.
 */

import { appendFileSync } from 'node:fs';
import { publishFeed, verifyLive } from './publish.mjs';
import { ArchiveError } from './archive.mjs';
import { validateHandLink, composeHandLink, windowDaysBySource } from './hand-link.mjs';

const DRY_RUN = process.env.DRY_RUN === '1';
// This writer's own id. It goes in the feed's `handAdded.id`, NOT in `runId`: runId
// names the scan that built the feed, and the page and the scan's own live check read it.
const ID = process.env.GITHUB_RUN_ID
  ? `add-link-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? '1'}`
  : `add-link-local-${Date.now()}`;

// How long to wait for the public page. The defaults are verifyLive's own (10 minutes).
// NEWS_LIVE_WAIT_MS exists for the tests, like NEWS_REMOTE in publish.mjs.
const LIVE_WAIT = process.env.NEWS_LIVE_WAIT_MS
  ? { timeoutMs: Number(process.env.NEWS_LIVE_WAIT_MS), intervalMs: 50, requestTimeoutMs: 200 }
  : {};

const [, , argLink, argTitle, argSource, argDate] = process.argv;
const input = {
  link: process.env.NEWS_LINK ?? argLink,
  title: process.env.NEWS_TITLE ?? argTitle,
  source: process.env.NEWS_SOURCE ?? argSource,
  date: process.env.NEWS_DATE ?? argDate,
};

/** Git errors can quote the remote URL, and the remote URL carries the push token. */
const redact = (message) => String(message ?? '').replace(/x-access-token:[^@\s]+@/g, 'x-access-token:***@');

function report(lines, { failed = false } = {}) {
  const text = lines.join('\n');
  (failed ? console.error : console.log)(text);
  if (process.env.GITHUB_STEP_SUMMARY) {
    // Plain text in a code block: the title is typed by hand and must not render as Markdown.
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Add a news link\n\n\`\`\`text\n${text.replace(/```/g, "'''")}\n\`\`\`\n`);
  }
  if (failed) process.exitCode = 1;
}

async function main() {
  const now = Date.now();
  const checked = validateHandLink(input, now);
  if (!checked.ok) {
    report(['Not added. Please fix:', ...checked.errors.map((e) => `- ${e}`), '', 'Nothing was changed.'], { failed: true });
    return;
  }
  const { entry } = checked;
  const windows = windowDaysBySource();

  let outcome = null;
  const result = await publishFeed(
    (current, currentArchive) => {
      // Decided against the branch as it is on THIS attempt (rule 2 in publish.mjs).
      outcome = composeHandLink({ current, currentArchive, entry, now, windows, id: ID });
      if (outcome.status === 'already-there' || DRY_RUN) return null;
      return { feed: outcome.feed, archive: outcome.archive };
    },
    // withArchive with no bootstrap: a missing, unreadable or shrunken archive stops
    // this writer exactly as it stops a scan.
    { message: `Add news link by hand: ${entry.source}`, withArchive: true },
  );

  // The host on its own line, first: a link can read as one site and go to another, and
  // this is where the owner checks where it really goes.
  const what = [`Link goes to: ${entry.host}`, '', `  ${entry.title}`, `  ${entry.source}, ${entry.pubDate.slice(0, 10)}`, `  ${entry.link}`];

  if (outcome.status === 'already-there') {
    report(['Already there. This link is in the news archive, so nothing was changed.', '', ...what]);
    return;
  }

  const effects = [
    outcome.status === 'promoted' ? 'The scan had seen this link once; it is now confirmed.' : 'Added to the permanent news archive.',
    outcome.shows
      ? 'It shows on the news page.'
      : 'It will NOT show on the news page: it is older than the page keeps articles, or newer articles fill the list. It is still in the archive.',
    outcome.summaryDropped
      ? 'The AI summary is off the page until the next scan writes a new one (twice a day), because the list of articles changed.'
      : outcome.displayedChanged
        ? 'There was no summary on the page to remove.'
        : 'The list of articles on the page did not change, so the summary stays.',
  ];

  if (DRY_RUN) {
    report(['Preview only. Nothing was changed. A real run would do this:', '', ...what, '', ...effects.map((e) => `- ${e}`)]);
    return;
  }

  if (!result.pushed) {
    report(['Nothing was pushed: the files on the site already matched.', '', ...what]);
    return;
  }

  // The scan's live check looks for its runId. This writer leaves runId alone, so it
  // looks for its own id in `handAdded` instead.
  const live = await verifyLive(ID, { matches: (body) => body?.handAdded?.id === ID, ...LIVE_WAIT });
  if (!live.live) {
    // The same standing as a scan's "pushed-not-live": the push worked, the public page
    // has not shown it yet, and the run ends red so it is not mistaken for finished.
    // The wording has to carry the difference: the link WAS saved, so do not add it again.
    report(
      [
        'The link WAS saved. Do not add it again.',
        'This run is marked failed only because the public page had not caught up when it stopped waiting.',
        'Check https://www.representdc.org/news in a few minutes. If the link is still missing after an hour, tell Claude.',
        '',
        ...what,
        '',
        ...effects.map((e) => `- ${e}`),
      ],
      { failed: true },
    );
    return;
  }
  report(['Done. The link is live at https://www.representdc.org/news', '', ...what, '', ...effects.map((e) => `- ${e}`)]);
}

main().catch((err) => {
  const lines = err instanceof ArchiveError
    ? ['Not added. The news archive on the site cannot be used:', `  ${redact(err.message)}`, '', 'Nothing was changed.']
    : ['Not added. Something went wrong:', `  ${redact(err.message)}`, '', 'Nothing was changed unless a line above says it was saved.'];
  report(lines, { failed: true });
});
