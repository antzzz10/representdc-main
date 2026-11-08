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
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { READING, readingRoute } from '../src/data/reading.js';

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
for (const [, path, element] of appSrc.matchAll(routeRe)) {
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

const written = [];
for (const route of [...pages, ...redirects, ...articles]) {
  // <route>.html serves /route; <route>/index.html serves /route/ (Pages would
  // otherwise 404 the trailing-slash form).
  const rel = route.replace(/^\//, '');
  for (const file of [join(DIST, `${rel}.html`), join(DIST, rel, 'index.html')]) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, indexHtml);
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
