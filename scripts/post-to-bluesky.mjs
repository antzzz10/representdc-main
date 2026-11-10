#!/usr/bin/env node
// Post one message to RepresentDC's bill-tracker Bluesky account (@bills.representdc.org).
//
// Run only by .github/workflows/post-to-bluesky.yml, which is dispatched by hand: by
// Andria from the GitHub app, or by Claude after her explicit yes to the exact text.
// Never scheduled. (Decided 2026-11-10: posting from the bills account on her phone meant
// logging out of her own.)
//
// Environment:
//   POST_TEXT       the post, exactly as approved
//   BLUESKY_SECRET  an app password for the account (Bluesky → Settings → Privacy and
//                   security → App passwords), never the account's main password.
//                   "handle:app-password" is also accepted.
//   DRY_RUN         anything but "false" checks length and links and prints the record;
//                   nothing is sent. Live posting needs an explicit "false" (fails closed).
//
// No dependencies: two calls to Bluesky's public XRPC API.

const HANDLE = 'bills.representdc.org';
const SERVICE = 'https://bsky.social/xrpc';
const MAX_GRAPHEMES = 300;
const MAX_BYTES = 3000; // the post schema's separate UTF-8 limit

const text = (process.env.POST_TEXT || '').replace(/\r\n/g, '\n').trim();
const dryRun = process.env.DRY_RUN !== 'false';

function fail(message) {
  console.error(`::error::${message}`);
  process.exit(1);
}

if (!text) fail('POST_TEXT is empty.');

const graphemes = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)].length;
if (graphemes > MAX_GRAPHEMES) fail(`Post is ${graphemes} characters; Bluesky's limit is ${MAX_GRAPHEMES}.`);
const bytes = new TextEncoder().encode(text).length;
if (bytes > MAX_BYTES) fail(`Post is ${bytes} bytes; Bluesky's limit is ${MAX_BYTES}.`);

// Bluesky shows a URL as a link only when the record carries a "facet" for it, located by
// UTF-8 byte offsets (not character offsets). Linked: explicit http(s):// URLs, kept whole
// (path, query, fragment), and bare addresses on RepresentDC's own domain
// (billtracker.representdc.org). Nothing else is guessed: a TLD list links the wrong
// thing ("example.company" became example.com) and misses real ones (Codex, 2026-11-10).
const encoder = new TextEncoder();
const byteIndex = charIndex => encoder.encode(text.slice(0, charIndex)).length;

// Trailing sentence punctuation isn't part of a URL; a closing parenthesis is, only when
// the URL itself opened one ("…/a_(b)").
function trimUrl(raw) {
  let url = raw;
  for (;;) {
    const last = url.slice(-1);
    if (/[.,;:!?'"]/.test(last)) { url = url.slice(0, -1); continue; }
    if (last === ')' && (url.match(/\(/g) || []).length < (url.match(/\)/g) || []).length) { url = url.slice(0, -1); continue; }
    return url;
  }
}

// Links are found word by word: the post is split on whitespace and each word is judged
// whole, so a word yields at most one link and links never overlap or start mid-address
// (Codex, 2026-11-10). A word is linked if it is an explicit http(s):// URL, or a bare
// address whose written hostname is exactly representdc.org or a subdomain of it, matching
// what it parses to (so Unicode or %-encoded dots, longer hostnames, ports, user@ parts and
// look-alike prefixes stay plain text).
const facets = [];
for (const word of text.matchAll(/\S+/g)) {
  const lead = word[0].match(/^[("'\[]*/)[0].length; // opening punctuation isn't part of a link
  const raw = trimUrl(word[0].slice(lead));
  if (!raw) continue;
  const start = word.index + lead;
  const explicit = /^https?:\/\//i.test(raw);
  let uri;
  if (explicit) {
    uri = raw.replace(/^https?/i, m => m.toLowerCase());
    try {
      new URL(uri);
    } catch {
      fail(`"${raw}" looks like a link but isn't a valid URL. Nothing was posted.`);
    }
  } else {
    const writtenHost = raw.split(/[/?#]/)[0].toLowerCase();
    if (!/^([a-z0-9-]+\.)*representdc\.org$/.test(writtenHost)) continue;
    let parsed;
    try {
      parsed = new URL(`https://${raw}`);
    } catch {
      continue;
    }
    if (parsed.hostname !== writtenHost || parsed.port || parsed.username) continue;
    uri = `https://${raw}`;
  }
  facets.push({
    index: { byteStart: byteIndex(start), byteEnd: byteIndex(start + raw.length) },
    features: [{ $type: 'app.bsky.richtext.facet#link', uri }]
  });
}

const record = {
  $type: 'app.bsky.feed.post',
  text,
  createdAt: new Date().toISOString(),
  langs: ['en'],
  ...(facets.length ? { facets } : {})
};

// The post text is echoed between stop-commands markers, so a line in it that looks like
// a GitHub workflow command ("::error::…") is printed, not obeyed.
const stopToken = `post-${Date.now()}-${Math.random().toString(36).slice(2)}`;
console.log(`Post (${graphemes}/${MAX_GRAPHEMES} characters, ${bytes} bytes), ${facets.length} link(s):`);
if (process.env.GITHUB_ACTIONS) console.log(`::stop-commands::${stopToken}`);
console.log(text);
facets.forEach(f => console.log(`  link → ${f.features[0].uri}`));
if (process.env.GITHUB_ACTIONS) console.log(`::${stopToken}::`);

if (dryRun) {
  console.log('\nDRY RUN: nothing was posted.');
  process.exit(0);
}

const secret = process.env.BLUESKY_SECRET || '';
if (!secret) fail('BLUESKY_SECRET is not set.');
const [identifier, password] = secret.includes(':') ? secret.split(/:(.*)/s) : [HANDLE, secret];
// GitHub masks the whole secret, not a piece of it; mask the password on its own too.
if (process.env.GITHUB_ACTIONS && password) console.log(`::add-mask::${password.trim()}`);

async function xrpc(method, body, token) {
  const res = await fetch(`${SERVICE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  // Only the status and Bluesky's short error code (e.g. AuthenticationRequired), never
  // the free-text message: the log of a public repository is public.
  if (!res.ok) fail(`${method} failed: HTTP ${res.status} ${String(data.error || '').replace(/[^\w.-]/g, '').slice(0, 60)}`.trim());
  return data;
}

const session = await xrpc('com.atproto.server.createSession', { identifier: identifier.trim(), password: password.trim() });
if (session.handle !== HANDLE) fail(`Signed in as ${session.handle}, expected ${HANDLE}. Nothing was posted.`);

// No duplicates. A rerun after a lost response, or a second dispatch of the same approved
// text, would otherwise post it twice. If the account already has this exact text among
// its 50 most recent posts, stop and point to it. The workflow runs one post at a time, so
// a second identical dispatch always sees the first. A deliberate repeat of an earlier
// post needs different wording.
async function recentPosts(did, token) {
  const url = `${SERVICE}/com.atproto.repo.listRecords?repo=${encodeURIComponent(did)}&collection=app.bsky.feed.post&limit=50`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) fail(`listRecords failed: HTTP ${res.status}. Nothing was posted, to avoid a duplicate.`);
  const body = await res.json().catch(() => null);
  // Fail closed: without a real listing, a duplicate can't be ruled out.
  if (!Array.isArray(body?.records)) fail('listRecords returned no record list. Nothing was posted, to avoid a duplicate.');
  return body.records;
}
// Compared after the same normalization the new text gets (line endings, outer spaces).
const normalize = t => String(t || '').replace(/\r\n/g, '\n').trim();
const existing = (await recentPosts(session.did, session.accessJwt))
  .find(r => normalize(r.value?.text) === text);
if (existing) {
  console.log(`Already posted: https://bsky.app/profile/${HANDLE}/post/${existing.uri.split('/').pop()}`);
  console.log('Nothing new was posted.');
  process.exit(0);
}

const created = await xrpc('com.atproto.repo.createRecord', {
  repo: session.did,
  collection: 'app.bsky.feed.post',
  record
}, session.accessJwt);

const rkey = created.uri.split('/').pop();
console.log(`\nPosted: https://bsky.app/profile/${HANDLE}/post/${rkey}`);
