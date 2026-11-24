// The photo at the top of the News page: its caption says what the picture shows, the
// credit carries what its licence asks for, and the page shows it whether or not there is
// an AI summary. Read from the source: the data file imports an image, which only the
// site's build can load.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

const src = (path) => new URL(`../../src/${path}`, import.meta.url);
const data = readFileSync(src('data/newsPhoto.js'), 'utf8');
const page = readFileSync(src('NewsAndAnalysis.jsx'), 'utf8');
const field = (name) => data.match(new RegExp(`${name}:\\s*\\n?\\s*'([^']+)'`))?.[1] ?? '';

test('the picture file is in the site and small enough for a phone', () => {
  const file = data.match(/import photo from '\.\.\/(assets\/[^']+)'/)?.[1];
  assert.ok(file, 'the data file imports its picture');
  const { size } = statSync(src(file));
  assert.ok(size > 20_000 && size < 600_000, `${size} bytes`);
});

test('the caption says the photo is from before the vote, and gives the vote date', () => {
  const caption = field('caption');
  assert.match(caption, /three weeks before/);
  assert.match(caption, /April 22, 2021/);
  assert.doesNotMatch(caption, /—/, 'no em-dash in public copy');
  assert.ok(field('alt').length > 30, 'the picture is described for screen readers');
});

test('the credit has the name, the source, the licence and a note of changes', () => {
  assert.ok(field('name'));
  assert.ok(field('title'), 'the licence asks for the work\'s title');
  assert.equal(new URL(field('sourceUrl')).hostname, 'commons.wikimedia.org');
  assert.equal(field('licence'), 'CC BY-SA 2.0');
  assert.equal(new URL(field('licenceUrl')).hostname, 'creativecommons.org');
  assert.ok(field('changes'));
  for (const part of ['credit.title', 'credit.name', 'credit.sourceUrl', 'credit.licence}', 'credit.licenceUrl', 'credit.changes']) {
    assert.ok(page.includes(`NEWS_PHOTO.${part}`), `the page shows ${part}`);
  }
});

test('the photo is on the page unconditionally, above the summary, with its size set', () => {
  const figure = page.indexOf('<figure className="news-photo">');
  assert.ok(figure > 0);
  assert.ok(figure < page.indexOf('{showSummary && ('), 'above the summary');
  assert.ok(figure > page.indexOf('In the news</h2>'), 'under the heading');
  const before = page.slice(page.indexOf('In the news</h2>'), figure);
  assert.doesNotMatch(before, /&&|\?/, 'nothing decides whether the photo shows');
  assert.match(page, /width=\{NEWS_PHOTO\.width\}/);
  assert.match(page, /alt=\{NEWS_PHOTO\.alt\}/);
});
