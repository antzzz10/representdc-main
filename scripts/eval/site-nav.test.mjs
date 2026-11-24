// Every page of the site can be reached from the top bar and menu (one list feeds both)
// or from the footer, which are on every page at every width. Added 2026-11-24 after the
// partner map turned out to be in neither: a wide screen has no menu button, so it could
// only be found through other pages. Read from the source, no browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Comments are removed before anything is read, so a link named in a comment does not count.
const read = (path) =>
  readFileSync(new URL(`../../src/${path}`, import.meta.url), 'utf8')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
const app = read('App.jsx');
const nav = read('components/Nav.jsx');
const footer = read('components/Footer.jsx');

// Every <Route>, whatever order its attributes come in. One this cannot read fails the
// test below, so a route written in a new way cannot slip past unnoticed.
const routeTags = [...app.matchAll(/<Route\s[^]*?\/>/g)].map((m) => m[0]);
const routes = routeTags.map((tag) => ({
  tag,
  path: tag.match(/\spath=(?:"([^"]+)"|'([^']+)'|\{'([^']+)'\}|\{"([^"]+)"\})/)?.slice(1).find(Boolean) ?? null,
  redirect: /element=\{\s*<Navigate\b/.test(tag),
}));

// Pages a visitor can land on: not redirects, not addresses with a parameter.
const pages = routes.filter((r) => r.path && !r.redirect && !r.path.includes(':')).map((r) => r.path);

// The menu list itself, not the whole file.
const navList = nav.match(/const NAV_ITEMS = \[([\s\S]*?)\n\]/)?.[1] ?? '';
const navLinks = new Set([...navList.matchAll(/\bto:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]));
const footerLinks = new Set([...footer.matchAll(/<Link\b[^>]*?\sto=["']([^"']+)["']/g)].map((m) => m[1]));

test('every route in App.jsx could be read', () => {
  assert.equal(routeTags.length, (app.match(/<Route\b/g) ?? []).length, 'a <Route> is written in a way this test cannot read');
  for (const route of routes) assert.ok(route.path, `no path read from ${route.tag}`);
  assert.ok(navList.length > 0, 'NAV_ITEMS was not found');
});

test('the route list was read', () => {
  assert.ok(pages.length >= 10, `found ${pages.length} pages`);
  assert.ok(pages.includes('/statehood-partner-map'));
});

test('every page is linked from the bar and menu or from the footer', () => {
  const unreachable = pages.filter((path) => !navLinks.has(path) && !footerLinks.has(path));
  assert.deepEqual(unreachable, []);
});

test('the partner map is in the bar and menu, and in the footer', () => {
  assert.ok(navLinks.has('/statehood-partner-map'));
  assert.ok(footerLinks.has('/statehood-partner-map'));
});

test('the bar and the menu are drawn from the same list', () => {
  assert.equal((nav.match(/NAV_ITEMS[^\n]*\.map\(/g) ?? []).length, 2);
  // Only Home may be left out of the wide bar: the logo beside it is the home link.
  assert.deepEqual([...nav.matchAll(/to: '([^']+)', menuOnly: true/g)].map((m) => m[1]), ['/']);
  assert.match(nav, /<Link to="\/" className="nav-brand"/);
});

test('every bar, menu and footer link goes to a page that exists', () => {
  for (const path of [...navLinks, ...footerLinks]) assert.ok(pages.includes(path), `${path} is not a page`);
});
