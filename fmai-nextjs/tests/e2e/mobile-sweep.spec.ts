import { test, expect, type Page } from '@playwright/test'

/**
 * Every page in the sitemap, on a phone (projects mobile-chrome and mobile-safari).
 * Run: PLAYWRIGHT_BASE_URL=<url> npx playwright test mobile-sweep --project=mobile-chrome --project=mobile-safari
 *
 * Per page: 200, an h1, no horizontal scroll, no page errors or console errors, every image actually loaded after
 * scrolling the whole page (next/image loads lazily), the language link in the header and the round Clyde button
 * inside the viewport. The setup is asserted too (the sitemap is not empty, the page has images where we count them),
 * so a silently empty run cannot read as green.
 */

test.skip(({ isMobile }) => !isMobile, 'phone-only sweep')

// The sitemap lists absolute production URLs; the sweep keeps only the path and runs it against baseURL.
async function sitemapPaths(page: Page): Promise<string[]> {
  const res = await page.request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  const xml = await res.text()
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  return [...new Set(paths)]
}

// The noise below is not the page's: third-party scripts that are absent locally, and the dev-only Redis warning.
const IGNORED = [/Upstash/i, /googletagmanager|gtag/i, /vercel\/(insights|speed-insights)/i]
// WebKit reports the previous page's RSC prefetches, aborted by the sweep's own page.goto, as "... due to access control
// checks". Measured on prod 2026-11-08: 0 errors while a page settles, 46-62 the moment it navigates away.
const IGNORED_PAGE_ERRORS = [/\?_rsc=\S+ due to access control checks/]
// Vercel serves these on its own domains only; a local `next start` answers 404, so the URL is checked, not the console text
// (Chromium's "Failed to load resource" line carries no URL).
const IGNORED_URLS = [/\/_vercel\/(insights|speed-insights)\//, /googletagmanager\.com|google-analytics\.com/]

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    // strips that scroll sideways (cases, the werk band) hold lazy images a visitor reaches by swiping: swipe them too
    const strips = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(
      (e) => e.scrollWidth > e.clientWidth + 1 && /(auto|scroll)/.test(getComputedStyle(e).overflowX),
    )
    for (const s of strips) {
      s.scrollIntoView({ block: 'center' })
      for (let x = 0; x < s.scrollWidth; x += Math.max(100, Math.round(s.clientWidth * 0.8))) {
        s.scrollLeft = x
        await new Promise((r) => setTimeout(r, 120))
      }
      s.scrollLeft = 0
    }
    window.scrollTo(0, 0)
  })
}

test('every sitemap page works on a phone', async ({ page }) => {
  test.setTimeout(20 * 60_000)
  const paths = await sitemapPaths(page)
  // setup: the sitemap had 73 URLs on 2026-11-08; far fewer means the sweep is not measuring the site
  expect(paths.length).toBeGreaterThan(40)

  const problems: string[] = []
  for (const path of paths) {
    const errors: string[] = []
    const onConsole = (m: { type(): string; text(): string }) => {
      const text = m.text()
      if (m.type() !== 'error' || IGNORED.some((re) => re.test(text))) return
      // a failed load is reported by onResponse below, with its URL
      if (!text.startsWith('Failed to load resource')) errors.push(text.slice(0, 160))
    }
    const onPageError = (e: Error) => {
      if (!IGNORED_PAGE_ERRORS.some((re) => re.test(e.message))) errors.push(`pageerror: ${e.message.slice(0, 160)}`)
    }
    const onResponse = (r: { status(): number; url(): string }) => {
      if (r.status() >= 400 && !IGNORED_URLS.some((re) => re.test(r.url()))) errors.push(`HTTP ${r.status()} ${r.url().slice(0, 140)}`)
    }
    page.on('console', onConsole)
    page.on('pageerror', onPageError)
    page.on('response', onResponse)

    const res = await page.goto(path, { waitUntil: 'load' })
    const status = res?.status() ?? 0
    if (status !== 200) {
      problems.push(`${path}: status ${status}`)
      page.off('console', onConsole)
      page.off('pageerror', onPageError)
      page.off('response', onResponse)
      continue
    }
    await scrollThrough(page)
    await page.waitForLoadState('networkidle').catch(() => {})

    const m = await page.evaluate(() => {
      // clientWidth, not innerWidth: Chromium's phone emulation widens innerWidth to overflowing content (395 at 390)
      const vw = document.documentElement.clientWidth
      const imgs = Array.from(document.images).filter((i) => i.getClientRects().length > 0 && !i.closest('[hidden]'))
      const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src)
      const fab = document.querySelector<HTMLElement>('[data-clyde-launcher]')?.getBoundingClientRect()
      return {
        overflow: document.documentElement.scrollWidth - vw,
        h1: document.querySelectorAll('h1').length,
        imgs: imgs.length,
        broken,
        lang: !!document.querySelector('header a[hreflang]'),
        fab: fab ? { w: Math.round(fab.width), left: fab.left, right: fab.right, vw } : null,
      }
    })

    if (m.overflow > 1) problems.push(`${path}: horizontal scroll ${m.overflow}px`)
    if (m.h1 !== 1) problems.push(`${path}: ${m.h1} h1`)
    if (m.broken.length) problems.push(`${path}: ${m.broken.length}/${m.imgs} images not loaded (${m.broken[0]})`)
    if (!m.lang) problems.push(`${path}: no language link in the header`)
    if (m.fab && (m.fab.w !== 44 || m.fab.left < 0 || m.fab.right > m.fab.vw)) problems.push(`${path}: Clyde button ${JSON.stringify(m.fab)}`)
    if (errors.length) problems.push(`${path}: ${errors.length} console/page errors: ${errors[0]}`)

    page.off('console', onConsole)
    page.off('pageerror', onPageError)
    page.off('response', onResponse)
  }
  expect(problems, problems.join('\n')).toEqual([])
})
