/**
 * The news scan's memory (added 2026-11-21).
 *
 * Before this, every run rebuilt api/news.json from whatever each feed listed at that
 * moment, so an article vanished from the page when its outlet's feed scrolled on, and
 * there was no record of how much statehood news there had been. The relevance filter is
 * also unstable (30 of 46 ever-relevant items flipped between runs), so memory cannot
 * simply remember every "yes": one wrong verdict would then stay on the page for a month.
 *
 * api/news-archive.json on gh-pages holds three things:
 *
 *   items       every article CONFIRMED relevant. Permanent: never pruned, never removed
 *               by a later run, never sent to the filter again. Headline, link, source
 *               and dates only. No summaries, no body text.
 *   pending     links the filter has said yes to once. A second yes, from a later run,
 *               confirms them. Pruned when they age out of the display window.
 *   feedHealth  per source, since when it has been failing (null when healthy).
 *
 * Everything here is a pure function: no network, no clock, no file access. publish.mjs
 * owns reading and writing the file; fetch-news.mjs owns the order of operations.
 */

import { MAX_ARTICLES, checkArticles, isHttpsUrl } from './gates.mjs';

export const ARCHIVE_PATH = 'api/news-archive.json';
export const ARCHIVE_VERSION = 1;
/** How long a confirmed article stays on the page. A feed's own larger window wins. */
export const DISPLAY_WINDOW_DAYS = 30;
/** Yes-verdicts, from separate runs, needed before an article is remembered for good. */
export const CONFIRM_AFTER_YES = 2;
/** A source failing for this long is surfaced, even though G5 lets the run publish. */
export const FEED_ALERT_AFTER_DAYS = 2;

const DAY_MS = 24 * 60 * 60 * 1000;
// Same tolerance as G4: clock skew and sloppy timezone offsets, nothing more.
const FUTURE_TOLERANCE_MS = 2 * 60 * 60 * 1000;

/** Thrown for a file that exists but cannot be trusted. Never caught to "start empty". */
export class ArchiveError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ArchiveError';
  }
}

export function emptyArchive() {
  return { version: ARCHIVE_VERSION, items: [], pending: [], feedHealth: {} };
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isIso = (v) => typeof v === 'string' && Number.isFinite(new Date(v).getTime());
const toIso = (v) => new Date(v).toISOString();

function entryProblems(entry, label, extra) {
  const problems = [];
  if (!isObject(entry)) return [`${label} is not an object`];
  if (!isHttpsUrl(entry.link)) problems.push(`${label} link is not https`);
  if (typeof entry.title !== 'string' || !entry.title) problems.push(`${label} missing title`);
  if (typeof entry.source !== 'string' || !entry.source) problems.push(`${label} missing source`);
  for (const field of ['pubDate', 'firstSeen', ...extra]) {
    if (!isIso(entry[field])) problems.push(`${label} ${field} is not a date`);
  }
  return problems;
}

/**
 * Checks shape, and returns the archive unchanged. Throws ArchiveError otherwise.
 *
 * Strict on purpose. A confirmed item is shown on the page without being looked at again,
 * so anything G4 would reject (a non-https link, a missing title, an unparseable date)
 * must not be able to sit in here: it would fail G4 on every later run, and the only
 * cure would be editing the file by hand.
 */
export function validateArchive(archive) {
  if (!isObject(archive)) throw new ArchiveError('archive is not an object');
  if (archive.version !== ARCHIVE_VERSION) {
    throw new ArchiveError(`archive version is ${JSON.stringify(archive.version)}, expected ${ARCHIVE_VERSION}`);
  }
  if (!Array.isArray(archive.items)) throw new ArchiveError('archive.items is not an array');
  if (!Array.isArray(archive.pending)) throw new ArchiveError('archive.pending is not an array');
  if (!isObject(archive.feedHealth)) throw new ArchiveError('archive.feedHealth is not an object');

  const problems = [];
  const seen = new Set();
  archive.items.forEach((item, i) => {
    problems.push(...entryProblems(item, `items[${i}]`, ['confirmedAt']));
    if (seen.has(item?.link)) problems.push(`items[${i}] duplicate link`);
    seen.add(item?.link);
  });
  const seenPending = new Set();
  archive.pending.forEach((entry, i) => {
    problems.push(...entryProblems(entry, `pending[${i}]`, []));
    if (!Number.isInteger(entry?.yes) || entry.yes < 1) problems.push(`pending[${i}] yes is not a positive integer`);
    if (seenPending.has(entry?.link)) problems.push(`pending[${i}] duplicate link`);
    seenPending.add(entry?.link);
  });
  for (const [source, health] of Object.entries(archive.feedHealth)) {
    if (!isObject(health)) problems.push(`feedHealth[${source}] is not an object`);
    else {
      if (health.failingSince !== null && !isIso(health.failingSince)) {
        problems.push(`feedHealth[${source}] failingSince is neither null nor a date`);
      }
      if (typeof health.lastStatus !== 'string') problems.push(`feedHealth[${source}] lastStatus is not a string`);
    }
  }
  if (problems.length) {
    throw new ArchiveError(`archive is malformed: ${problems.slice(0, 5).join('; ')}${problems.length > 5 ? `; and ${problems.length - 5} more` : ''}`);
  }
  return archive;
}

/** Parses the file's text. Any failure is an ArchiveError, never an empty archive. */
export function parseArchive(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new ArchiveError(`archive is not valid JSON: ${err.message}`);
  }
  return validateArchive(parsed);
}

/**
 * Could this candidate pass G4 on its own? Only such articles may be remembered.
 *
 * G4 checks the displayed set, and today a bad item simply fails that one run. Once
 * remembered, the same bad item would come back on every run.
 */
export function archivable(article, now) {
  const ts = new Date(article?.pubDate ?? '').getTime();
  return Boolean(
    article?.title &&
      article?.source &&
      isHttpsUrl(article?.link) &&
      Number.isFinite(ts) &&
      ts <= now + FUTURE_TOLERANCE_MS,
  );
}

function windowMs(source, windowDaysBySource) {
  const days = Object.hasOwn(windowDaysBySource, source) ? windowDaysBySource[source] : DISPLAY_WINDOW_DAYS;
  return Math.max(days, DISPLAY_WINDOW_DAYS) * DAY_MS;
}

function inWindow(entry, now, windowDaysBySource) {
  return new Date(entry.pubDate).getTime() > now - windowMs(entry.source, windowDaysBySource);
}

/**
 * Which candidates still need the filter's verdict. A confirmed link is never asked about
 * again: its verdict is settled, and re-asking is what made the page flicker.
 */
export function splitCandidates(archive, candidates) {
  const confirmed = new Set(archive.items.map((item) => item.link));
  return {
    toFilter: candidates.filter((c) => !confirmed.has(c.link)),
    alreadyConfirmed: candidates.filter((c) => confirmed.has(c.link)),
  };
}

/**
 * Per-source failure tracking. `failingSince` is set on the first failing run, kept while
 * the source keeps failing, and cleared by one good fetch. Sources no longer in the feed
 * list are dropped, so a removed feed does not alert forever.
 */
export function updateFeedHealth(previous, sourceResults, now) {
  const next = {};
  for (const result of sourceResults) {
    const failing = result.status !== 'ok';
    // A newsletter feed carries its own key (`newsletter:<name>`): it can share a display
    // name with a news feed, past or present, and must not inherit that feed's
    // failingSince. The League of Women Voters DC newsletter would otherwise have picked
    // up the date its removed website feed started failing.
    const key = result.healthKey ?? result.source;
    const before = Object.hasOwn(previous, key) ? previous[key] : null;
    next[key] = {
      failingSince: failing ? before?.failingSince ?? toIso(now) : null,
      lastStatus: String(result.status),
    };
  }
  return next;
}

/**
 * The marker api/news.json carries once an archive has been written beside it: that an
 * archive exists, and how many confirmed items it held at the last write.
 *
 * A second line of defence, behind the rule that an absent archive is never seeded
 * without the explicit bootstrap flag (publish.mjs). With the marker present, a missing
 * archive file is a DELETION and not even the flag may reseed over it; and an archive
 * holding fewer items than the marker records has lost some, however valid it looks.
 */
export function archiveMarker(archive) {
  return { initialized: true, items: archive.items.length };
}

/**
 * Reads the marker off a feed. null means the feed has no `archive` field at all. Any
 * other shape than the exact one written above is an error, never "not initialised":
 * a half-edited marker must not quietly switch the protection off.
 */
export function readArchiveMarker(feed) {
  if (feed === null || feed === undefined || feed.archive === undefined) return null;
  const marker = feed.archive;
  const ok =
    isObject(marker) &&
    marker.initialized === true &&
    Number.isInteger(marker.items) &&
    marker.items >= 0 &&
    Object.keys(marker).length === 2;
  if (!ok) {
    throw new ArchiveError(`the archive marker in api/news.json is malformed: ${JSON.stringify(marker)}`);
  }
  return marker;
}

export const NEWSLETTER_HEALTH_PREFIX = 'newsletter:';

/** A feedHealth key as a person should read it: "newsletter:X" becomes "X (newsletter)". */
export function feedLabel(key) {
  return key.startsWith(NEWSLETTER_HEALTH_PREFIX) ? `${key.slice(NEWSLETTER_HEALTH_PREFIX.length)} (newsletter)` : key;
}

/**
 * Sources failing right now, however recently. The failing-feed issue closes only when
 * this is empty: one source recovering while another has been down for a day is not
 * "all recovered".
 */
export function failingSources(feedHealth) {
  return Object.entries(feedHealth)
    .filter(([, health]) => health.failingSince)
    .map(([key, health]) => ({ source: feedLabel(key), key, failingSince: health.failingSince, lastStatus: health.lastStatus }))
    .sort((a, b) => a.source.localeCompare(b.source));
}

/** Sources that have been failing for FEED_ALERT_AFTER_DAYS or more. */
export function longFailingSources(feedHealth, now, afterDays = FEED_ALERT_AFTER_DAYS) {
  return Object.entries(feedHealth)
    .filter(([, health]) => health.failingSince && now - new Date(health.failingSince).getTime() >= afterDays * DAY_MS)
    .map(([key, health]) => ({ source: feedLabel(key), key, failingSince: health.failingSince, lastStatus: health.lastStatus }))
    .sort((a, b) => a.source.localeCompare(b.source));
}

/**
 * Applies one run's observations to an archive. Returns the next archive and the article
 * list to display. Pure, and safe to call again on a newer copy of the archive: that is
 * how a rejected push re-applies this run's changes instead of overwriting a rival's.
 *
 * @param archive  a validated archive (the branch's current copy, or the seed, or empty)
 * @param run.candidates    every fresh article the feeds returned this run
 * @param run.relevantLinks links the filter said yes to this run
 * @param run.sourceResults fetchAllFeeds' per-source report
 * @param run.now           the run's own fixed clock, in ms
 * @param run.windowDaysBySource  each feed's own display window, by source name
 * @param run.keepPending   optional (entry, candidateOrNull) => boolean. Stored pending
 *                          entries it rejects are dropped BEFORE this run's verdicts are
 *                          applied. fetch-news.mjs passes the topic rule here, so a yes
 *                          recorded for a headline the rule blocks cannot count toward
 *                          confirmation. Confirmed items are never passed to it.
 */
export function applyRun(archive, { candidates, relevantLinks, sourceResults, now, windowDaysBySource = {}, keepPending = null }) {
  const relevant = new Set(relevantLinks);
  const items = archive.items.map((item) => ({ ...item }));
  const confirmed = new Set(items.map((item) => item.link));
  const candidateByLink = new Map(candidates.map((c) => [c.link, c]));
  const pending = new Map(
    archive.pending
      .filter((entry) => !keepPending || keepPending(entry, candidateByLink.get(entry.link) ?? null))
      .map((entry) => [entry.link, { ...entry }]),
  );
  const nowIso = toIso(now);

  // Shown this run on the strength of this run's verdict alone, as before memory existed.
  const unconfirmed = [];

  for (const candidate of candidates) {
    if (confirmed.has(candidate.link) || !relevant.has(candidate.link)) continue;

    if (!archivable(candidate, now)) {
      // Displayed and left for G4 to judge, exactly as today, but never remembered.
      unconfirmed.push(candidate);
      continue;
    }

    const stored = pending.get(candidate.link);
    // Outlets rewrite headlines. The title that gets confirmed, and then shown for 30
    // days without being looked at again, must be one that has itself had two yeses:
    // if this run's headline differs from the stored one, the entry takes the current
    // headline and its count starts again. (firstSeen stays: it dates the link.)
    const sameHeadline = stored && stored.title === candidate.title;
    const entry = {
      link: candidate.link,
      title: candidate.title,
      source: candidate.source,
      pubDate: toIso(candidate.pubDate),
      yes: sameHeadline ? stored.yes : 0,
      firstSeen: stored?.firstSeen ?? nowIso,
    };
    entry.yes += 1;

    if (entry.yes >= CONFIRM_AFTER_YES) {
      pending.delete(candidate.link);
      confirmed.add(candidate.link);
      items.push({
        link: entry.link,
        title: entry.title,
        source: entry.source,
        pubDate: entry.pubDate,
        firstSeen: entry.firstSeen,
        confirmedAt: nowIso,
      });
    } else {
      pending.set(candidate.link, entry);
      unconfirmed.push(candidate);
    }
  }

  const nextPending = [...pending.values()].filter(
    (entry) => !confirmed.has(entry.link) && inWindow(entry, now, windowDaysBySource),
  );

  const display = [
    ...items.filter((item) => inWindow(item, now, windowDaysBySource)),
    ...unconfirmed,
  ].map((a) => ({
    title: a.title,
    link: a.link,
    // One format on the page whether the article came from a feed or from memory.
    // Left as given when it does not parse, so G4 sees and rejects it.
    pubDate: Number.isFinite(new Date(a.pubDate).getTime()) ? toIso(a.pubDate) : a.pubDate,
    source: a.source,
  }));

  const seen = new Set();
  const articles = display
    .filter((a) => (seen.has(a.link) ? false : seen.add(a.link)))
    .sort((a, b) => (new Date(b.pubDate).getTime() || 0) - (new Date(a.pubDate).getTime() || 0))
    .slice(0, MAX_ARTICLES);

  return {
    archive: {
      version: ARCHIVE_VERSION,
      items,
      pending: nextPending,
      feedHealth: updateFeedHealth(archive.feedHealth, sourceResults, now),
    },
    articles,
  };
}

/**
 * The boundary check before an archive is written: well formed, and nothing that was
 * confirmed has gone missing or been rewritten. Throws rather than publishing a smaller
 * record, because this file is the only copy.
 */
export function assertArchiveOnlyGrows(previous, next) {
  validateArchive(next);
  if (!previous) return;
  const byLink = new Map(next.items.map((item) => [item.link, item]));
  for (const item of previous.items) {
    const kept = byLink.get(item.link);
    if (!kept) throw new ArchiveError(`refusing to write an archive that drops a confirmed item: ${item.link}`);
    if (JSON.stringify(kept) !== JSON.stringify(item)) {
      throw new ArchiveError(`refusing to write an archive that rewrites a confirmed item: ${item.link}`);
    }
  }
}

/**
 * What one push attempt writes: the feed and the archive, decided against the branch as
 * it is at that moment. fetch-news.mjs calls this from inside publishFeed's `apply`, so
 * it runs again, on fresh state, after every rejected push. Pure, so the retry path can
 * be tested for real (race.test.mjs) rather than mirrored.
 *
 * @param payload            the feed this run built (summary already judged, or null)
 * @param summarisedArticles the exact article objects the summary and the judge saw
 * @param run                this run's observations, as given to applyRun
 * @param current            the branch's current api/news.json, or null
 * @param currentArchive     the branch's current archive, or null on an explicit bootstrap
 * @param seed               used only when currentArchive is null, which publishFeed
 *                           allows only with the bootstrap flag and no marker.
 * @param startedAt          when this run began (Date), for the withholding rule
 * @returns { feed, archive, reason } where reason says why a summary was dropped, if so
 */
export function composePublication({ payload, summarisedArticles, run, current, currentArchive, seed, startedAt, runId }) {
  // Rule 2, for the archive: this run's observations are applied to the archive as the
  // branch holds it NOW. Normally that is the copy read at the start and the result is
  // identical. If another writer changed it in between, the rival's confirmations are
  // kept and this run's are added on top.
  const fresh = applyRun(currentArchive ?? seed, run);
  let feed = { ...payload, articles: fresh.articles };
  let reason = null;

  // The whole objects, in order, not just the links. A rival run can have stored the
  // same link under a different headline, and memory's copy is the one displayed once
  // the article is confirmed: same links, but a title the judge never read. G4's rule is
  // that a summary is only ever published beside exactly what it was written from, so
  // on ANY difference the headlines go out and the summary does not.
  if (JSON.stringify(fresh.articles) !== JSON.stringify(summarisedArticles)) {
    const recheck = checkArticles(fresh.articles, null);
    if (!recheck.pass) throw new Error(`article set rejected after the archive changed: ${recheck.detail}`);
    if (feed.summary) {
      reason = 'the archive changed while this run was working, so its summary no longer matched the displayed articles';
      feed = { ...feed, summaryDecision: 'archive-changed' };
    }
    feed = { ...feed, summary: null, summarySource: null, summaryCheck: null };
  }

  // A kept summary (fetch-news.mjs, summary-memory.mjs) is the text already on the page,
  // left where it is. So it is published only while the branch still shows that exact
  // text. If a withholding, a link added by hand or anything else removed or changed it
  // after this run read the feed, it is not put back. Rule 3 below does not cover this:
  // a withholding is stamped when it starts, which can be before this run started, and
  // pushed after this run read the summary (Codex, 2026-11-25). Checked here because
  // this runs against the branch as it is at every push attempt.
  if (feed.summary && payload.summaryDecision === 'judge-pass-kept' && current?.summary !== feed.summary) {
    reason = 'the summary this run meant to keep is no longer on the page, so it was not put back';
    feed = { ...feed, summary: null, summarySource: null, summaryCheck: null, summaryDecision: 'kept-summary-gone' };
  }

  const archive = {
    version: fresh.archive.version,
    updatedAt: payload.lastUpdated,
    runId,
    items: fresh.archive.items,
    pending: fresh.archive.pending,
    feedHealth: fresh.archive.feedHealth,
  };

  // Rule 3: a withholding that happened after this run started always wins. The run
  // publishes its fresh headlines but leaves the summary off.
  const withheldAt = current?.withheldAt ? new Date(current.withheldAt) : null;
  if (withheldAt && withheldAt > startedAt) {
    return {
      feed: { ...feed, summary: null, summarySource: null, withheldAt: current.withheldAt },
      archive,
      reason: `a withholding at ${current.withheldAt} superseded this run's summary`,
    };
  }
  // Carry the stamp forward even when publishing normally. It records when the last
  // withholding happened, not "currently withheld" — dropping it would let a run that
  // started even earlier come back and republish its own summary over the removal.
  return { feed: current?.withheldAt ? { ...feed, withheldAt: current.withheldAt } : feed, archive, reason };
}
