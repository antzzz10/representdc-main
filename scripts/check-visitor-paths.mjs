// Browser check for the visitor paths: the home page picker, and landing on a section of
// the news page while the feed is still loading. Not part of CI. Run by hand after a build:
//
//   npm run build && node scripts/check-visitor-paths.mjs
//
// It serves dist/ with `vite preview` on a spare port, and answers the feed request itself
// after a delay, with made-up headlines, so the page grows above the section the way it
// does for a real visitor on a slow connection. Nothing is fetched from outside.
import { spawn } from 'node:child_process'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const PORT = 4792
const BASE = `http://localhost:${PORT}`
const FEED_DELAY_MS = 1200

const feed = {
  lastUpdated: new Date().toISOString(),
  articles: Array.from({ length: 30 }, (_, i) => ({
    title: `Made-up headline ${i + 1} for the visitor path check`,
    link: `https://example.org/story-${i + 1}`,
    source: 'Example Gazette',
    pubDate: new Date().toISOString(),
  })),
}

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error('vite preview did not start: run `npm run build` first')
}

/** Where the "Analysis & essays" heading sits in the window, and how tall the window is. */
const headingTop = (page) =>
  page.evaluate(() => ({
    top: Math.round(document.querySelector('#analysis h2').getBoundingClientRect().top),
    height: window.innerHeight,
  }))

async function assertHeadingInView(page, when) {
  const { top, height } = await headingTop(page)
  assert.ok(top >= 0 && top < height, `${when}: "Analysis & essays" heading is at ${top}px, outside the ${height}px window`)
}

const feedArrived = (page) => page.waitForSelector('text=Made-up headline 30')

let browser
const results = []
const check = async (name, fn) => {
  await fn()
  results.push(name)
  console.log(`ok  ${name}`)
}

try {
  await waitForServer()
  browser = await chromium.launch()

  for (const viewport of [{ width: 375, height: 812 }, { width: 1280, height: 900 }]) {
    const size = `${viewport.width}px`
    const context = await browser.newContext({ viewport })
    await context.route('**/api/news.json', async (route) => {
      await new Promise((r) => setTimeout(r, FEED_DELAY_MS))
      await route.fulfill({ json: feed })
    })
    // Analytics and fonts are not under test: nothing leaves this machine.
    await context.route((url) => url.hostname !== 'localhost', (route) => route.abort())
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))

    await check(`${size} (a) the Analysis & essays card lands on its section once the feed arrives`, async () => {
      await page.goto(`${BASE}/statehood-curious`)
      await page.click('a[href="/news#analysis"]')
      await feedArrived(page)
      await page.waitForTimeout(600)
      await assertHeadingInView(page, 'after the feed arrived')
    })

    await check(`${size} (c) Back then Forward lands on the section a second time`, async () => {
      await page.goBack()
      await page.waitForURL(`${BASE}/statehood-curious`)
      await page.goForward()
      await page.waitForURL(`${BASE}/news#analysis`)
      await feedArrived(page)
      await page.waitForTimeout(600)
      await assertHeadingInView(page, 'after Back and Forward')
    })

    await check(`${size} (a) opening /news#analysis directly lands on the section`, async () => {
      await page.goto(`${BASE}/news#analysis`)
      await feedArrived(page)
      await page.waitForTimeout(600)
      await assertHeadingInView(page, 'after a direct load')
    })

    await check(`${size} (b) a reader who scrolls before the feed arrives is not moved`, async () => {
      await page.goto(`${BASE}/news#analysis`)
      await page.waitForSelector('#analysis')
      await page.waitForTimeout(300)
      // Stands in for a dragged scrollbar: a change of position with no wheel, touch or key.
      await page.evaluate(() => window.scrollTo(0, 0))
      await feedArrived(page)
      await page.waitForTimeout(600)
      assert.equal(await page.evaluate(() => window.scrollY), 0, 'the reader was pulled away from the top')
    })

    await check(`${size} a later visit to the section, after scrolling /news, still lands on it`, async () => {
      await page.goto(`${BASE}/news`)
      await feedArrived(page)
      await page.evaluate(() => window.scrollTo(0, 300))
      await page.goto(`${BASE}/statehood-curious`)
      await page.click('a[href="/news#analysis"]')
      await feedArrived(page)
      await page.waitForTimeout(600)
      await assertHeadingInView(page, 'on a later visit')
    })

    await check(`${size} /news with no section named opens at the top and stays there`, async () => {
      await page.goto(`${BASE}/news`)
      await feedArrived(page)
      await page.waitForTimeout(300)
      assert.equal(await page.evaluate(() => window.scrollY), 0)
    })

    await check(`${size} (d) each picker card opens its page`, async () => {
      const cards = [
        ['New to D.C.', '/how-congress-controls-dc'],
        ['Statehood-curious', '/statehood-curious'],
        ['Statehood-questioning', '/myths'],
        ['Statehood activist', '/take-action'],
      ]
      for (const [label, path] of cards) {
        await page.goto(`${BASE}/`)
        await page.locator('a.persona-card', { has: page.locator('h3', { hasText: label }) }).click()
        await page.waitForURL(`${BASE}${path}`)
        await page.waitForSelector('.page-hero h1, .myth-hero h1')
      }
    })

    assert.deepEqual(errors, [], 'the pages threw errors')
    await context.close()
  }
  console.log(`\n${results.length} checks passed`)
} catch (error) {
  console.error(`\nFAILED: ${error.message}`)
  process.exitCode = 1
} finally {
  await browser?.close()
  server.kill()
}
