#!/usr/bin/env node
// Fetches a published article by URL, extracts the main content (stripping
// nav/ads/etc.), converts it to Markdown with tables intact, and downloads
// every embedded image to a local, self-hosted copy. Output is a draft —
// review it, fill in the dek, and add the printed registry entry to
// src/data/reading.js before it's live.
//
// Usage: node scripts/import-article.mjs <url> <slug>

import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const [, , url, slug] = process.argv

if (!url || !slug) {
  console.error('Usage: node scripts/import-article.mjs <url> <slug>')
  console.error('  slug becomes the route: /reading/<slug>')
  process.exit(1)
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('slug must be lowercase letters, numbers, and hyphens only')
  process.exit(1)
}

async function fetchDocument(pageUrl) {
  const res = await fetch(pageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RepresentDCArticleImport/1.0)' },
  })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`)
  const html = await res.text()
  return new JSDOM(html, { url: pageUrl })
}

function extractPublishedDate(document) {
  const metaSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="date"]',
    'meta[name="publish-date"]',
    'meta[itemprop="datePublished"]',
  ]
  for (const selector of metaSelectors) {
    const value = document.querySelector(selector)?.getAttribute('content')
    if (value) return value.slice(0, 10)
  }
  const timeEl = document.querySelector('time[datetime]')
  if (timeEl) return timeEl.getAttribute('datetime').slice(0, 10)
  return null
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

async function downloadImages(contentDom, pageUrl, slug) {
  const assetsDir = path.join(ROOT, 'public', 'reading-assets', slug)
  await mkdir(assetsDir, { recursive: true })

  const images = [...contentDom.window.document.querySelectorAll('img')]
  let count = 0
  for (const img of images) {
    const src = img.getAttribute('src')
    if (!src) continue
    let absoluteUrl
    try {
      absoluteUrl = resolveOriginalImageUrl(new URL(src, pageUrl).href)
    } catch {
      continue
    }
    try {
      const res = await fetch(absoluteUrl)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const contentType = res.headers.get('content-type')?.split(';')[0]
      const ext = EXT_BY_CONTENT_TYPE[contentType] || path.extname(new URL(absoluteUrl).pathname).replace('.', '') || 'jpg'
      count += 1
      const filename = `image-${count}.${ext}`
      const buffer = Buffer.from(await res.arrayBuffer())
      await writeFile(path.join(assetsDir, filename), buffer)
      img.setAttribute('src', `/reading-assets/${slug}/${filename}`)
      console.log(`  downloaded ${absoluteUrl} -> public/reading-assets/${slug}/${filename}`)
    } catch (err) {
      console.warn(`  skipped image ${absoluteUrl}: ${err.message}`)
    }
  }
  return count
}

async function main() {
  console.log(`Fetching ${url} ...`)
  const dom = await fetchDocument(url)
  const { document } = dom.window

  const publishedDate = extractPublishedDate(document)

  const reader = new Readability(document)
  const article = reader.parse()
  if (!article) {
    throw new Error('Readability could not extract article content from this page')
  }

  // Re-parse the extracted content on its own so image src rewrites don't
  // touch anything outside the article body (nav, related-posts images, etc).
  const contentDom = new JSDOM(`<!doctype html><body>${article.content}</body>`, { url })
  const imageCount = await downloadImages(contentDom, url, slug)

  const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' })
  turndown.use(gfm)
  const markdown = turndown.turndown(contentDom.window.document.body.innerHTML).trim()

  const mdPath = path.join(ROOT, 'src', 'reading', `${slug}.md`)
  await writeFile(mdPath, markdown + '\n')

  console.log(`\nWrote src/reading/${slug}.md (${imageCount} image${imageCount === 1 ? '' : 's'} downloaded)`)
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
        sourceName: article.siteName || new URL(url).hostname.replace(/^www\./, ''),
        sourceUrl: url,
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
