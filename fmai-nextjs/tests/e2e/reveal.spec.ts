import { test, expect, type Page } from '@playwright/test'

/**
 * ScrollReveal is a CSS view-timeline reveal (.fm-reveal in src/app/motion.css). Content must stay visible
 * wherever the reveal cannot run: no JavaScript, reduced motion, or no `animation-timeline: view()` support
 * (audit MF-01: crawlers and JS-off visitors once saw blank sections behind a JS reveal).
 */

const IDENTITY = new Set(['none', 'matrix(1, 0, 0, 1, 0, 0)'])

async function revealStyles(page: Page) {
  return page.$$eval('.fm-reveal', (els) =>
    els.map((el) => {
      const cs = getComputedStyle(el)
      return { opacity: cs.opacity, transform: cs.transform }
    })
  )
}

// Walk the page down first so lazy images and late content have settled before the reveals are checked.
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
  })
}

test('no JavaScript and reduced motion: every .fm-reveal on /nl is fully visible', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('/nl')
  const styles = await revealStyles(page)
  expect(styles.length).toBeGreaterThan(0)
  for (const s of styles) expect(s.opacity).toBe('1')
  await ctx.close()
})

test('without view-timeline support every .fm-reveal is visible without scrolling', async ({ page }) => {
  await page.goto('/nl')
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'))
  test.skip(supported, 'this engine supports view-timeline; covered by the next test')
  const styles = await revealStyles(page)
  expect(styles.length).toBeGreaterThan(0)
  for (const s of styles) expect(s.opacity).toBe('1')
})

test('with view-timeline support each .fm-reveal ends opaque and untransformed once scrolled into view', async ({
  page,
}) => {
  await page.goto('/nl')
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'))
  test.skip(!supported, 'this engine has no view-timeline; covered by the previous test')
  await scrollThrough(page)
  const reveals = page.locator('.fm-reveal')
  const count = await reveals.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const el = reveals.nth(i)
    await el.evaluate((node) => node.scrollIntoView({ block: 'start' }))
    await expect.poll(() => el.evaluate((node) => getComputedStyle(node).opacity)).toBe('1')
    expect(IDENTITY.has(await el.evaluate((node) => getComputedStyle(node).transform))).toBe(true)
  }
})
