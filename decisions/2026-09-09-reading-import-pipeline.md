# Decision: Automated import pipeline for Reading articles, replacing hand-written JSX

**Date:** 2026-09-09
**Context:** The first Reading article (`decisions/2026-09-09-reading-section.md`) was
built by hand-transcribing pasted text into a bespoke JSX file — slow, error-prone (see
that decision's fidelity caveat), and with no answer at all for embedded images. Andria
asked for a systematic/automated way to bring in more historical articles, many with
images and tables, without painful copy-paste.

## Content format: Markdown, not per-article JSX

**Chosen:** Article bodies move from one hand-written JSX file per piece to one
`src/reading/<slug>.md` file per piece, rendered by a single generic
`src/reading/Article.jsx` using `react-markdown` + `remark-gfm` (adds ~48KB gzip to the
bundle — the tradeoff for native table/image syntax and text that Andria can edit
directly without touching React). Metadata (title, author, date, source) stays in the
`READING` registry (`src/data/reading.js`) rather than YAML frontmatter in the `.md`
file, so an import script only has to write a plain markdown body — no frontmatter
parser needed, and the registry stays the single place reviewing a new piece's metadata.

**Routing:** `App.jsx` now has one dynamic `/reading/:slug` route instead of one
explicit route per article — `Article.jsx` looks up the slug in `READING` and loads the
matching `.md` via `import.meta.glob('./*.md', { eager: true })`. The existing article
(`republicans-supported-dc-autonomy`) was migrated to this format; its old bespoke
`RepublicansSupportedAutonomy.jsx` was deleted.

## Import source: fetch a live URL, not a pasted doc

**Chosen:** Andria confirmed incoming articles are live URLs of already-published
pieces (like the first one), not Word/Google docs. The import script targets that case.

## Images: downloaded and self-hosted, not hotlinked

**Chosen:** confirmed — `public/reading-assets/<slug>/` holds a local copy of every
image found in the extracted article body, and the markdown is rewritten to reference
those local paths. Protects the site if a source page changes or removes an image.

## The script: `scripts/import-article.mjs`

`node scripts/import-article.mjs <url> <slug>` (also `npm run import:article -- <url>
<slug>`):

1. Fetches the page, runs `@mozilla/readability` (via `jsdom`) to strip nav/ads/related-
   posts and keep the article body.
2. Downloads every `<img>` in that extracted body to `public/reading-assets/<slug>/`,
   rewriting `src` to the local path before conversion.
3. Converts the resulting HTML to Markdown with `turndown` + `turndown-plugin-gfm`
   (tables, strikethrough survive the conversion).
4. Writes `src/reading/<slug>.md` and prints a draft registry entry (title, author from
   the page's byline, best-effort published date from meta tags, source name/URL) to
   paste into `src/data/reading.js` after filling in the one field it can't guess: the
   hub-card dek.

This is dev tooling — it added `jsdom`, `@mozilla/readability`, `turndown`, and
`turndown-plugin-gfm` as devDependencies only; nothing it uses ships in the site bundle.
Verified end-to-end against a real Wikipedia article (image download + rewrite worked;
table conversion was messy on that page's complex infobox specifically — a source-markup
quirk, not a script bug. A simpler single-purpose table like the Edelman piece's poll
tables should convert cleanly). Test output was deleted, not committed.

## Update 2026-09-10 — first real bugs found and fixed

Andria noticed the live article was missing images and a lot of inline links. Root
causes, found by re-running the real source URL through the pipeline and diffing:

1. **Links were never recoverable from the hand-transcription.** The very first
   version of this article was typed from plain text pasted into chat, before this
   script existed — plain text has no `href`s to lose. Re-running
   `import-article.mjs` against the real URL recovered all ~150 inline citation links
   automatically. This is fully fixed by using the pipeline instead of pasted text,
   which was already the plan going forward.
2. **Images were being fetched at thumbnail resolution.** Wix (this article's host)
   serves embedded images through a resize transform baked into the URL path
   (`.../media/<id>~mv2.png/v1/fill/w_49,h_31,.../<id>~mv2.png`); the literal `src`
   the script was grabbing was a 49×31px placeholder, not the source image.
   **Fixed in the script**: `resolveOriginalImageUrl()` strips the transform segment
   for `static.wixstatic.com` URLs before fetching, recovering the original upload
   (confirmed: a 49×31px/2KB thumbnail became a 2075×1292px/135KB original). This fix
   is generic to any Wix-hosted source, not just this article.
3. **Readability silently dropped part of one list.** A "Democrats: / Republicans:"
   list of 14 governor names (each just a hyperlinked name + a few words) came back
   with only 2 of 14 entries — Readability's boilerplate/spam heuristics treat short,
   link-dense list items as nav or ad content and prune them. Confirmed by comparing
   Readability's extracted content against the raw fetched HTML (all 14 names and
   their real citation links were present in the raw page). **Not fixed in the
   script** — recovered by hand for this article by pulling the raw HTML directly.
   This is a known, recurring risk for any future import: short link-heavy lists may
   come back incomplete, and the failure is silent (no error, just fewer items).
4. **Two data tables and all section headers were structurally non-semantic in the
   source.** Wix's table-plugin markup isn't a real `<table>` `turndown-plugin-gfm`
   recognizes, so it passed through as raw, unconverted HTML — which `react-markdown`
   doesn't render (no `rehype-raw` is configured, deliberately, to avoid needing to
   trust raw HTML in imported content). Section headers were bold paragraphs, not
   `<h2>`, and "bulleted" lists were plain paragraphs starting with a literal
   `-`/`o ` character, not real `<ul>/<li>`. **Not fixed in the script** — hand-converted
   for this article (real GFM tables, real `##` headings, real `- ` list syntax).
   This is a Wix-editor-wide pattern (their rich-text editor doesn't always emit
   semantic HTML for headings/lists/tables), so it will very likely recur on the next
   Wix-hosted import.

**Open question for the next Wix import:** items 3 and 4 above are not yet automated.
Options, not yet decided: (a) add post-process heuristics to the script — promote
short bold-only paragraphs to `##` headings, promote paragraphs starting with `-`/`o `
to real list items, and either convert Wix's `table-plugin-cell` markup to GFM tables
or add `rehype-raw` to `Article.jsx` to render it as-is; (b) leave this as a manual
review-and-patch step per Wix article, same as this one, and only automate it once a
second Wix source proves the pattern is worth the investment. Andria hasn't chosen
between these yet.

## What the script does *not* do

- **Doesn't touch `src/data/reading.js`.** It only prints a suggested entry — Andria (or
  whoever runs the import) still reviews and pastes it in, because the dek needs a human
  and the auto-extracted author/date are best-effort guesses worth a glance before they're
  live.
- **Doesn't fact-check.** Per the existing Reading citation standard (see the other
  2026-09-09 decision note), a guest reprint is held to a full-attribution bar, not a
  per-claim primary-source bar — but the script's own output note tells the runner to
  spot-check facts and quotes against the source before publishing, since a scraped page
  can carry the original's errors *or* extraction artifacts.
- **Doesn't handle Word/Google Docs.** Out of scope per Andria's answer that incoming
  articles are live URLs; would need a different front end (pandoc/mammoth or Docs
  export) feeding the same Markdown+assets output if that changes later.
