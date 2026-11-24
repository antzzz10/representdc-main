// The Follow page's partner links: every one names a group on the partner map and goes
// to an https address. A renamed or removed group would otherwise drop off the page silently.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PARTNER_FOLLOWS, EMAIL_WAY } from '../../src/data/followWays.js';
import { DATA } from '../../src/data/statehoodPartners.js';

const partners = Object.values(DATA).flat();

test('every partner on the Follow page is on the partner map, once, with an https link', () => {
  assert.ok(PARTNER_FOLLOWS.length > 0);
  assert.equal(new Set(PARTNER_FOLLOWS.map((f) => f.id)).size, PARTNER_FOLLOWS.length);
  for (const follow of PARTNER_FOLLOWS) {
    const partner = partners.find((p) => p.id === follow.id);
    assert.ok(partner?.name, `${follow.id} is not on the partner map`);
    assert.notEqual(partner.self, true, 'the page does not list this site as a partner to follow');
    assert.equal(new URL(follow.href).protocol, 'https:');
    assert.ok(follow.cta.trim());
  }
});

test('the Follow page does not point back at the tracker or the news page', () => {
  const page = readFileSync(new URL('../../src/Follow.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /TRACKER_WAY|NEWS_WAY|to="\/news"|billtracker|api\/news\.json/);
  assert.equal(new URL(EMAIL_WAY.href).hostname, 'representdc.beehiiv.com');
});
