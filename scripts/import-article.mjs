#!/usr/bin/env node
// Fetches a published article by URL, extracts the main content (stripping
// nav/ads/etc.), converts it to Markdown with tables intact, and downloads
// every embedded image to a local, self-hosted copy. Output is a draft —
// review it, fill in the dek, and add the printed registry entry to
// src/data/reading.js before it's live.
//
// Usage: node scripts/import-article.mjs <url> <slug> [--force]

import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { writeFile, mkdir, access, rm, rename } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const FETCH_TIMEOUT_MS = 30_000
const MAX_IMAGE_BYTES = 25 * 1024 * 1024 // 25MB
const MONTH_NAMES =
  'January|February|March|April|May|June|July|August|September|October|November|December'

const [, , url, slug, ...rest] = process.argv
const force = rest.includes('--force')

if (!url || !slug) {
  console.error('Usage: node scripts/import-article.mjs <url> <slug> [--force]')
  console.error('  slug becomes the route: /reading/<slug>')
  console.error('  --force overwrites an existing draft at that slug')
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('slug must be lowercase letters, numbers, and hyphens only')
  process.exit(1)
}

let stagingDir

// Runs `run` under a single deadline that covers both the fetch call and
// whatever body-reading the caller does inside it — clearing the timer as
// soon as `fetch()` resolves (headers only) would leave slow response
// bodies unbounded, so the caller must do all of its reading inside `run`.
async function withTimeout(run) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await run(controller.signal)
  } finally {
    clearTimeout(timer)
  }
}

// Reads a response body up to maxBytes, aborting the underlying stream
// instead of buffering past the limit — a Content-Length header can't be
// trusted (absent, or simply wrong), so the only reliable bound is counting
// bytes as they arrive.
async function readBounded(res, maxBytes) {
  if (!res.body) {
    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.byteLength > maxBytes) throw new Error(`response too large (${buffer.byteLength} bytes)`)
    return buffer
  }
  const reader = res.body.getReader()
  const chunks = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel().catch(() => {})
      throw new Error(`response too large (exceeds ${maxBytes} bytes)`)
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

async function fetchDocument(pageUrl) {
  return withTimeout(async (signal) => {
    const res = await fetch(pageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RepresentDCArticleImport/1.0)' },
      signal,
    })
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
    const html = await res.text()
    // res.url is the post-redirect address — use it (not pageUrl) as the
    // DOM's base so Readability and downstream relative-URL resolution point
    // at the page that actually served the content, not wherever the link
    // first went.
    return { dom: new JSDOM(html, { url: res.url }), finalUrl: res.url }
  })
}

// Meta tags are sometimes malformed or truncated (a scraped "publish-date"
// meta has, in practice, come through as a chopped string like "June 11, 2").
// JS's free-form Date parser is lenient enough to accept fragments like that
// and silently produce a plausible-looking wrong date, so this only trusts
// two shapes: a strict ISO date that round-trips, or an unambiguous
// "Month D, YYYY" / "D Month YYYY" string with a real 4-digit year.
// Builds an ISO date only if year/month/day form a real calendar date.
// Date silently rolls an invalid one over (Feb 31, 2024 -> Mar 2, 2024)
// instead of rejecting it, so the roll-over has to be detected by reading
// the fields back and comparing, not just checking getTime() isn't NaN.
function calendarIso(year, monthIndex, day) {
  const date = new Date(Date.UTC(year, monthIndex, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== monthIndex || date.getUTCDate() !== day) {
    return null
  }
  return date.toISOString().slice(0, 10)
}

function parseIsoDate(raw) {
  if (!raw) return null
  const trimmed = raw.trim()

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const [, y, m, d] = isoMatch
    return calendarIso(Number(y), Number(m) - 1, Number(d))
  }

  const mdyMatch = trimmed.match(new RegExp(`\\b(${MONTH_NAMES})\\s+(\\d{1,2}),?\\s+(\\d{4})\\b`))
  if (mdyMatch) {
    const [, monthName, day, year] = mdyMatch
    return calendarIso(Number(year), MONTH_NAMES.split('|').indexOf(monthName), Number(day))
  }

  const dmyMatch = trimmed.match(new RegExp(`\\b(\\d{1,2})\\s+(${MONTH_NAMES})\\s+(\\d{4})\\b`))
  if (dmyMatch) {
    const [, day, monthName, year] = dmyMatch
    return calendarIso(Number(year), MONTH_NAMES.split('|').indexOf(monthName), Number(day))
  }

  return null
}

function extractPublishedDate(document) {
  const metaSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="date"]',
    'meta[name="publish-date"]',
    'meta[itemprop="datePublished"]',
  ]
  for (const selector of metaSelectors) {
    const iso = parseIsoDate(document.querySelector(selector)?.getAttribute('content'))
    if (iso) return iso
  }
  return parseIsoDate(document.querySelector('time[datetime]')?.getAttribute('datetime'))
}

const EXT_BY_CONTENT_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

// Some CDNs serve embedded images through a resize transform baked into the
// URL path — the literal src on the page is a thumbnail, not the source
// image. Strip the transform to fetch the original upload instead.
function resolveOriginalImageUrl(absoluteUrl) {
  const wixMatch = absoluteUrl.match(/^(https:\/\/static\.wixstatic\.com\/media\/[^/]+)\/.*/)
  if (wixMatch) return wixMatch[1]
  return absoluteUrl
}

// A srcset value is a comma-separated list of "<url> <descriptor>?" entries,
// but the url itself can legally contain commas (e.g. a data: URI) — naive
// comma-splitting truncates those. The first candidate is always the
// leading whitespace-delimited token; per the srcset grammar a URL never
// starts or ends with a comma, so a comma glued directly onto the end of
// that token (an entry with no descriptor, e.g. "a.png, b.png 2x") is the
// separator, not part of the URL, and gets stripped.
function firstSrcsetUrl(srcset) {
  const token = srcset?.trim().match(/^(\S+)/)?.[1]
  return token ? token.replace(/,+$/, '') : null
}

// turndown-plugin-gfm only converts a table when its header row uses <th>.
// Some sources emit <td> in the first row instead, which the plugin then
// leaves untouched as raw HTML — and this site's Markdown renderer has no
// raw-HTML table support, so it renders as nothing. Only the first row's own
// cells matter for this — a <th> appearing later (e.g. a row-header column)
// doesn't mean the header row itself was tagged correctly.
function promoteHeaderlessTables(document) {
  for (const table of document.querySelectorAll('table')) {
    const firstRow = table.querySelector('tr')
    if (!firstRow) continue
    const cells = [...firstRow.children]
    if (cells.some((cell) => cell.tagName === 'TH')) continue
    for (const cell of cells) {
      const th = document.createElement('th')
      th.innerHTML = cell.innerHTML
      for (const attr of cell.attributes) th.setAttribute(attr.name, attr.value)
      cell.replaceWith(th)
    }
  }
}

async function downloadImages(contentDom, pageUrl, slug, writeDir) {
  await mkdir(writeDir, { recursive: true })

  const images = [...contentDom.window.document.querySelectorAll('img')]
  let successCount = 0
  const failures = []
  for (const img of images) {
    // An empty src="" attribute is present but unusable — treat it the same
    // as no src at all so the srcset fallback still kicks in.
    const existingSrc = img.getAttribute('src')
    const hadUsableSrc = Boolean(existingSrc)
    const src = existingSrc || firstSrcsetUrl(img.getAttribute('srcset'))
    if (!src) continue
    let absoluteUrl
    try {
      absoluteUrl = resolveOriginalImageUrl(new URL(src, pageUrl).href)
    } catch {
      continue
    }
    // An image with no usable src yet (missing, or srcset-derived) — set
    // one to the resolved remote URL now, so a failed download still leaves
    // a valid (if remote) image reference instead of one Turndown drops.
    if (!hadUsableSrc) img.setAttribute('src', absoluteUrl)

    try {
      const { buffer, contentType } = await withTimeout(async (signal) => {
        const res = await fetch(absoluteUrl, { signal })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const type = res.headers.get('content-type')?.split(';')[0]
        if (!type?.startsWith('image/')) {
          throw new Error(`unexpected content-type "${type || 'unknown'}"`)
        }
        return { buffer: await readBounded(res, MAX_IMAGE_BYTES), contentType: type }
      })
      const ext =
        EXT_BY_CONTENT_TYPE[contentType] ||
        path.extname(new URL(absoluteUrl).pathname).replace('.', '') ||
        'jpg'
      const filename = `image-${successCount + 1}.${ext}`
      await writeFile(path.join(writeDir, filename), buffer)
      successCount += 1
      img.setAttribute('src', `/reading-assets/${slug}/${filename}`)
      img.removeAttribute('srcset')
      console.log(`  downloaded ${absoluteUrl} -> public/reading-assets/${slug}/${filename}`)
    } catch (err) {
      // Leave the resolved remote URL in place (set above) rather than
      // pointing at a local file that was never written.
      failures.push({ url: absoluteUrl, message: err.message })
      console.warn(`  skipped image ${absoluteUrl}: ${err.message}`)
    }
  }
  return { successCount, failures }
}

// Replaces mdPath and assetsDir only after everything (markdown text,
// downloaded images) is ready, and attempts to roll back to the pre-import
// state if any step of the swap itself fails. This is best-effort, not a
// guarantee: the rollback is two separate filesystem operations (not one
// transaction), so a failure during the rollback itself — as opposed to
// the swap it's undoing — can still leave things mismatched. That case is
// logged loudly with exact paths rather than swallowed, since it needs a
// human to reconcile.
async function commitOutputs({ mdPath, markdown, assetsDir, stagingDir, hasImages }) {
  const mdTmpPath = `${mdPath}.import-${process.pid}.tmp`
  await writeFile(mdTmpPath, markdown)

  const assetsBackupDir = `${assetsDir}.import-${process.pid}.bak`
  const hadExistingAssets = await access(assetsDir).then(() => true).catch(() => false)
  if (hadExistingAssets) {
    await rm(assetsBackupDir, { recursive: true, force: true })
    await rename(assetsDir, assetsBackupDir)
  }

  try {
    if (hasImages) {
      await rename(stagingDir, assetsDir)
    } else {
      await rm(stagingDir, { recursive: true, force: true })
    }
    await rename(mdTmpPath, mdPath)
  } catch (err) {
    try {
      await rm(assetsDir, { recursive: true, force: true })
      if (hadExistingAssets) {
        await rename(assetsBackupDir, assetsDir)
      }
      await rm(mdTmpPath, { force: true })
    } catch (rollbackErr) {
      console.error('\nImport failed AND the automatic rollback also failed — manual cleanup needed.')
      console.error(`  markdown: ${mdPath} (should be unchanged) / ${mdTmpPath} (may still exist, delete it)`)
      console.error(
        `  assets: ${assetsDir} (state uncertain)${hadExistingAssets ? ` / pre-import backup possibly still at ${assetsBackupDir}` : ''}`,
      )
      console.error(`  rollback error: ${rollbackErr.message}`)
    }
    throw err
  }

  if (hadExistingAssets) {
    await rm(assetsBackupDir, { recursive: true, force: true }).catch(() => {})
  }
}

async function main() {
  const mdPath = path.join(ROOT, 'src', 'reading', `${slug}.md`)
  const assetsDir = path.join(ROOT, 'public', 'reading-assets', slug)
  stagingDir = path.join(ROOT, 'public', 'reading-assets', `.${slug}.import-${process.pid}`)

  if (!force) {
    const mdExists = await access(mdPath).then(() => true).catch(() => false)
    const assetsExist = await access(assetsDir).then(() => true).catch(() => false)
    if (mdExists || assetsExist) {
      console.error(`Refusing to overwrite existing draft for slug "${slug}".`)
      console.error(`  ${mdExists ? mdPath : assetsDir} already exists — pass --force to replace it.`)
      process.exit(1)
    }
  }

  console.log(`Fetching ${url} ...`)
  const { dom, finalUrl } = await fetchDocument(url)
  const { document } = dom.window

  const publishedDate = extractPublishedDate(document)

  const reader = new Readability(document)
  const article = reader.parse()
  if (!article) {
    throw new Error('Readability could not extract article content from this page')
  }

  // Re-parse the extracted content on its own so image src rewrites don't
  // touch anything outside the article body (nav, related-posts images, etc).
  const contentDom = new JSDOM(`<!doctype html><body>${article.content}</body>`, { url: finalUrl })
  promoteHeaderlessTables(contentDom.window.document)
  const { successCount: imageCount, failures: imageFailures } = await downloadImages(
    contentDom,
    finalUrl,
    slug,
    stagingDir,
  )

  const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' })
  turndown.use(gfm)
  const markdown = turndown.turndown(contentDom.window.document.body.innerHTML).trim() + '\n'

  await commitOutputs({ mdPath, markdown, assetsDir, stagingDir, hasImages: imageCount > 0 })

  console.log(`\nWrote src/reading/${slug}.md (${imageCount} image${imageCount === 1 ? '' : 's'} downloaded)`)
  if (imageFailures.length > 0) {
    console.log(
      `\n${imageFailures.length} image${imageFailures.length === 1 ? '' : 's'} FAILED to download and were left pointing at their original remote URL — fix these before publishing:`,
    )
    for (const failure of imageFailures) {
      console.log(`  - ${failure.url}: ${failure.message}`)
    }
  }
  console.log('\nReview the markdown before publishing — imports are a starting draft, not final copy:')
  console.log('  - Headings/lists/tables convert well; check for any leftover boilerplate (share buttons, related-post links).')
  console.log('  - Confirm every fact and quote against the source; a scraped page can include errors.')
  console.log('\nAdd this to the READING array in src/data/reading.js:\n')
  console.log(
    JSON.stringify(
      {
        slug,
        title: article.title || '<TITLE>',
        dek: '<one-line teaser for the /reading hub card>',
        author: (article.byline || '<AUTHOR>').replace(/^by\s+/i, ''),
        date: publishedDate || '<YYYY-MM-DD — not found on the page, fill in manually>',
        sourceName: article.siteName || new URL(finalUrl).hostname.replace(/^www\./, ''),
        sourceUrl: finalUrl,
      },
      null,
      2,
    ),
  )
}

main().catch(async (err) => {
  console.error(err.message)
  if (stagingDir) await rm(stagingDir, { recursive: true, force: true }).catch(() => {})
  process.exit(1)
})
