#!/usr/bin/env node

/**
 * Post-build step: give every client-side route a real file so GitHub Pages serves it
 * with HTTP 200, and publish sitemap.xml + robots.txt.
 *
 * Why: before this, every sub-page (/news, /myths, /about, ...) existed only via
 * public/404.html, which stashes the path in sessionStorage and bounces to "/". Pages
 * rendered for people, but the HTTP status was 404, so search engines treated them as
 * missing and link checkers / previews reported them broken (found 2026-11-08,
 * docs/2026-11-08-value-updates-plan.md section A).
 *
 * How: copy dist/index.html to dist/<route>.html and dist/<route>/index.html. GitHub Pages serves /news from
 * news.html with 200 and no trailing-slash redirect (a news/index.html folder would
 * 301 /news -> /news/). BrowserRouter then reads the real URL, and the 404 hack stays
 * only for genuinely unknown paths.
 *
 * Routes come from src/App.jsx itself (every literal `path="..."`), so a new page can't
 * silently miss its file. Redirect-only routes (<Navigate>) still get a file — the
 * client-side redirect then runs — but stay out of the sitemap.
 *
 * Each file also gets its route's own <title> and meta description from
 * src/data/routeMeta.js (redirects get their target's), so search results and link
 * previews don't all show the home page's title. A route without an entry fails the build.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { READING, readingRoute } from '../src/data/reading.js';
import { ROUTE_META } from '../src/data/routeMeta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://www.representdc.org';

const indexPath = join(DIST, 'index.html');
if (!existsSync(indexPath)) {
  console.error('dist/index.html not found — run vite build first.');
  process.exit(1);
}
const indexHtml = readFileSync(indexPath, 'utf8');
const appSrc = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
const SRC_TEXT = appSrc;
const SRC_NAME = 'src/App.jsx';

// Every <Route path="..." element={...} /> in App.jsx, split by whether it redirects.
const routeRe = /<Route\s+path="([^"]+)"\s+element=\{\s*<(\w+)/g;
const pages = [];
const redirects = [];
const redirectTarget = {};
const navigateRe = /<Route\s+path="([^"]+)"\s+element=\{\s*<Navigate\s+to="([^"]+)"/g;
for (const [, path, to] of appSrc.matchAll(navigateRe)) redirectTarget[path] = to;
for (const [, path, element] of appSrc.matchAll(routeRe)) {
  if (path.includes(':') && path !== '/reading/:slug') {
    console.error(`Route ${path} has a parameter with no expansion here — add one to prerender-routes.mjs (and titles to src/data/routeMeta.js).`);
    process.exit(1);
  }
  if (path === '/' || path.includes(':')) continue; // root exists; params expand below
  (element === 'Navigate' ? redirects : pages).push(path);
}
// Completeness: every <Route ...> in the source must have matched the pattern above, so
// a route written another way (single quotes, props in a different order) fails the
// build instead of silently losing its file.
const declared = (SRC_TEXT.match(/<Route\b/g) || []).length;
const matched = [...SRC_TEXT.matchAll(routeRe)].length;
if (declared !== matched) {
  console.error(`${declared} <Route> declarations but only ${matched} matched the pattern in ${SRC_NAME} — update prerender-routes.mjs.`);
  process.exit(1);
}
if (pages.length === 0) {
  console.error('Found no routes in src/App.jsx — the route pattern needs updating.');
  process.exit(1);
}
if (!appSrc.includes('path="/reading/:slug"')) {
  console.error('src/App.jsx no longer has /reading/:slug — update article expansion here.');
  process.exit(1);
}
const articles = READING.map((a) => readingRoute(a.slug));

// Per-route <title> + meta description. The source index.html carries exactly one
// <title> and no description; both are replaced/inserted here.
const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const titleRe = /<title>[^<]*<\/title>/;
if ((indexHtml.match(/<title>/g) || []).length !== 1 || !titleRe.test(indexHtml)) {
  console.error('dist/index.html must contain exactly one <title> — update prerender-routes.mjs.');
  process.exit(1);
}
if (/<meta\s+name="description"/.test(indexHtml)) {
  console.error('index.html already has a meta description; prerender-routes.mjs inserts its own — remove one.');
  process.exit(1);
}
function htmlFor(route) {
  const metaRoute = redirectTarget[route] || route;
  const meta = ROUTE_META[metaRoute];
  if (!meta) {
    console.error(`No title/description for ${metaRoute} in src/data/routeMeta.js — add one.`);
    process.exit(1);
  }
  const head = `<title>${escapeHtml(meta.title)}</title>\n    <meta name="description" content="${escapeHtml(meta.description)}" />`;
  // Callback, not a string: a replacement string would expand $&, $' etc. in the copy.
  return indexHtml.replace(titleRe, () => head);
}
for (const route of redirects) {
  if (!redirectTarget[route]) {
    console.error(`Redirect ${route} has no literal to="..." target in ${SRC_NAME} — update prerender-routes.mjs.`);
    process.exit(1);
  }
}

// The root file is rewritten in place: dist/index.html also serves "/".
writeFileSync(indexPath, htmlFor('/'));

const written = [];
for (const route of [...pages, ...redirects, ...articles]) {
  // <route>.html serves /route; <route>/index.html serves /route/ (Pages would
  // otherwise 404 the trailing-slash form).
  const rel = route.replace(/^\//, '');
  const html = htmlFor(route);
  for (const file of [join(DIST, `${rel}.html`), join(DIST, rel, 'index.html')]) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
  }
  written.push(route);
}

const sitemapUrls = ['/', ...pages, ...articles];
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapUrls.map((u) => `  <url><loc>${ORIGIN}${u === '/' ? '/' : u}</loc></url>`).join('\n') +
  '\n</urlset>\n';
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

console.log(`Prerendered ${written.length} route files (${pages.length} pages, ${redirects.length} redirects, ${articles.length} articles); sitemap has ${sitemapUrls.length} URLs.`);
