/**
 * Unit tests for the news pipeline's pure parts: feed parsing and the pre-publish gates.
 *
 * Uses node:test, which ships with Node — no test framework added to the project. Run
 * with `npm run test:news`.
 *
 * Several cases below are real failures this pipeline published before the rewrite;
 * they are named so a future change that reintroduces one fails here first.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { looksLikeFeed, feedIsComplete, parseItems } from '../news/feeds.mjs';
import {
  checkCloserKey,
  checkNumericGrounding,
  checkFormat,
  checkArticles,
  checkSourceHealth,
  checkFilterResponse,
} from '../news/gates.mjs';
import { closerFor, CLOSER_KEYS } from '../news/closers.mjs';
import { headlineBlock } from '../news/summarize.mjs';

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/feeds');
const fixture = (name) => readFileSync(join(FIXTURES, name), 'utf8');

test('feed detection: valid RSS parses', () => {
  const body = fixture('valid-rss.xml');
  assert.equal(looksLikeFeed(body), true);
  const items = parseItems(body);
  assert.equal(items.length, 2);
  assert.match(items[0].title, /DC Vote Urges House Committee/);
  assert.equal(items[0].link, 'https://www.dcvote.org/post/urges');
  // CDATA titles must come through unwrapped.
  assert.match(items[1].title, /^VIDEO: Senator Commits/);
});

test('feed detection: Atom entries parse, including href links', () => {
  const body = fixture('valid-atom.xml');
  assert.equal(looksLikeFeed(body), true);
  const items = parseItems(body);
  assert.equal(items.length, 1);
  assert.equal(items[0].link, 'https://51st.news/council-weighs');
  assert.equal(items[0].pubDate, '2026-09-10T12:00:00Z');
});

test('feed detection: an HTML bot-check page served with HTTP 200 is not a feed', () => {
  // The failure this guards: a dead source used to look like a quiet news day.
  assert.equal(looksLikeFeed(fixture('html-200.html')), false);
});

test('feed detection: a closed feed with no items is healthy, just quiet', () => {
  const body = fixture('empty-but-valid.xml');
  assert.equal(looksLikeFeed(body), true);
  assert.equal(feedIsComplete(body), true);
  assert.equal(parseItems(body).length, 0);
});

test('feed detection: a truncated feed is a failed source, not a quiet one', () => {
  // Both parse to zero items, so completeness is the only thing separating a broken
  // source from a genuinely empty one. Without it, a feed that died mid-stream would
  // count toward G5's "at least one source worked" and read as "no news today".
  const body = fixture('malformed.xml');
  assert.equal(looksLikeFeed(body), true);
  assert.equal(feedIsComplete(body), false);
  assert.equal(parseItems(body).length, 0);
});

test('G1: only approved closer keys pass, and unknown keys fall back to laws', () => {
  assert.equal(checkCloserKey('guard').pass, true);
  assert.equal(checkCloserKey('troops').pass, false);
  const fallback = closerFor('troops');
  assert.equal(fallback.key, 'laws');
  assert.equal(fallback.fellBack, true);
  assert.ok(CLOSER_KEYS.every((k) => closerFor(k).text.length > 0));
});

test('G1: inherited Object keys are not valid closers', () => {
  // Regression: a truthiness lookup treated "constructor" as a known key and would have
  // published `undefined` as the closing sentence.
  for (const key of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
    const result = closerFor(key);
    assert.equal(result.key, 'laws', `${key} must fall back`);
    assert.equal(result.fellBack, true);
    assert.equal(typeof result.text, 'string');
    assert.ok(result.text.length > 0);
    assert.equal(checkCloserKey(key).pass, false);
  }
});

test('G2: catches the January 2021 invention (published 2026-09-05)', () => {
  const headlines = ['More Than a Year Later, National Guard Troops Still Patrol D.C.'];
  const body = 'More than a year after events in January 2021, troops continue to patrol D.C.';
  const result = checkNumericGrounding(body, headlines);
  assert.equal(result.pass, false);
  assert.match(result.detail, /2021/);
});

test('G2: a number that appears in a headline passes', () => {
  const headlines = ['One Year After 700,000 Residents Lost Their Say'];
  assert.equal(checkNumericGrounding('Some 700,000 residents are affected.', headlines).pass, true);
});

test('G2: an invented number is not grounded by digits inside a larger one', () => {
  // Regression: a substring test called "21%" grounded because the headline contained
  // "214-209" — an invented statistic would have published.
  const headlines = ['House votes 214-209 to overturn D.C. policing law'];
  const result = checkNumericGrounding('Turnout rose 21% this year.', headlines);
  assert.equal(result.pass, false);
  assert.match(result.detail, /21/);
  assert.equal(checkNumericGrounding('A 14-day review period applied.', headlines).pass, false);
});

test('G2: accurate compound figures and trailing punctuation still pass', () => {
  // The mirror of the bug above: "The vote was 214-209." was wrongly blocked, because
  // the sentence's final period rode along in the token.
  const headlines = ['House votes 214-209 to overturn D.C. policing law'];
  assert.equal(checkNumericGrounding('The vote was 214-209.', headlines).pass, true);
  assert.equal(checkNumericGrounding('It passed 214-209 after debate.', headlines).pass, true);
  assert.equal(checkNumericGrounding('Some 209 members voted no.', headlines).pass, true);
});

test('G2: known blind spot — "lasted a year" carries no digits and passes', () => {
  // Documented limitation, not an aspiration: the judge (J1) covers this class.
  const headlines = ['What D.C. residents will remember from a year of National Guard occupation'];
  assert.equal(checkNumericGrounding('The deployment, which lasted a year, drew protest.', headlines).pass, true);
});

test('G3: rejects markdown, preambles, overlong and empty bodies; accepts plain prose', () => {
  assert.equal(checkFormat('- one\n- two').pass, false);
  assert.equal(checkFormat("Here's a summary of the week.").pass, false);
  assert.equal(checkFormat('a '.repeat(120)).pass, false);
  // Regression: a reply of only "CLOSER: laws" leaves an empty body, which used to pass
  // every fatal gate and publish the vetted sentence alone as if it were a digest.
  assert.equal(checkFormat('').pass, false);
  assert.equal(checkFormat('Advocates pressed their case.').pass, false);
  assert.equal(
    checkFormat(
      'A senator pledged in late August to prioritize D.C. statehood, while advocacy ' +
        'groups urged a House committee to reject limits on the District.',
    ).pass,
    true,
  );
});

test('G4: rejects http links, future dates and a mismatched article set', () => {
  const good = { title: 't', source: 's', link: 'https://x.org/a', pubDate: 'Wed, 10 Sep 2026 00:00:00 GMT' };
  const now = new Date('2026-09-12T00:00:00Z').getTime();
  assert.equal(checkArticles([good], null, now).pass, true);
  assert.equal(checkArticles([{ ...good, link: 'http://x.org/a' }], null, now).pass, false);
  assert.equal(checkArticles([{ ...good, pubDate: 'Wed, 01 Jan 2031 00:00:00 GMT' }], null, now).pass, false);
  assert.equal(checkArticles([good], ['https://other.org/b'], now).pass, false);
  assert.equal(checkArticles([good], ['https://x.org/a'], now).pass, true);
});

test('G4: an empty article list is allowed here (healthy-empty is decided by G5/G6)', () => {
  assert.equal(checkArticles([], null).pass, true);
});

test('G5: every source failing blocks publication; a partial failure does not', () => {
  assert.equal(checkSourceHealth([{ source: 'A', status: 'not-a-feed' }]).pass, false);
  const partial = checkSourceHealth([
    { source: 'A', status: 'ok' },
    { source: 'B', status: 'http-403' },
  ]);
  assert.equal(partial.pass, true);
  assert.equal(partial.someFailed, true);
});

test('G6: only a clean JSON array passes; malformed replies never mean "no news"', () => {
  assert.equal(checkFilterResponse('I think 0 and 2 qualify', 5).pass, false);
  assert.equal(checkFilterResponse('[0, 9]', 5).pass, false);
  // Regression: extracting the first bracketed run accepted "[[]]" as an empty list, so a
  // malformed answer published as "no relevant news".
  assert.equal(checkFilterResponse('[[]]', 5).pass, false);
  assert.equal(checkFilterResponse('{"indices":[0]}', 5).pass, false);
  // Regression: duplicates published the same article twice and collided as React keys.
  assert.equal(checkFilterResponse('[1, 1]', 5).pass, false);
  // Prose around the array is a malformed reply too, not something to fish an answer out of.
  assert.equal(checkFilterResponse('Here you go: [0, 2]', 5).pass, false);

  const ok = checkFilterResponse('[0, 2]', 5);
  assert.equal(ok.pass, true);
  assert.deepEqual(ok.indices, [0, 2]);

  // What the model actually returns: a fenced block. Rejecting this failed every run.
  const fenced = checkFilterResponse('```json\n[0, 2]\n```', 5);
  assert.equal(fenced.pass, true);
  assert.deepEqual(fenced.indices, [0, 2]);
  // Stripping the fence must not reopen the hole it closed.
  assert.equal(checkFilterResponse('```json\n[[]]\n```', 5).pass, false);
  // A genuine zero-match verdict is valid, and distinct from a malformed reply.
  assert.deepEqual(checkFilterResponse('[]', 5).indices, []);
});

test('prompt: headlines carry dates and ages, the fix for "currently considering"', () => {
  const now = new Date('2026-08-29T00:00:00Z').getTime();
  const block = headlineBlock(
    [
      {
        title: "DC Vote Urges House Committee to Reject Attack on DC's Fiscal Independence",
        source: 'DC Vote',
        pubDate: 'Tue, 21 Jul 2026 11:38:51 +0000',
      },
    ],
    now,
  );
  assert.match(block, /2026-07-21/);
  assert.match(block, /38 days ago/);
});
