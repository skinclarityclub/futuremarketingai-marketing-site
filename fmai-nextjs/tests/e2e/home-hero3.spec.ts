import { test, expect } from '@playwright/test'

/**
 * Hero 3 on /nl (website-port PR 3, approved 2026-11-02). The old hero, its backdrop and the kring poster preload stay
 * on /en until there are English captures (PLAN-port PR 3, besluit 10).
 */

test.describe('Home hero 3 (/nl)', () => {
  test('one h1, the page title, CTAs and speakable targets', async ({ page }) => {
    await page.goto('/nl')
    await expect(page).toHaveTitle('Clyde, de AI-collega voor marketingbureaus')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('#hero h1')).toHaveText('Meer klanten per teamlid.')
    await expect(page.locator('#hero .ctas a').first()).toHaveAttribute('href', '/nl/apply')
    await expect(page.locator('#hero .ctas a').nth(1)).toHaveAttribute('href', '#een-week-met-clyde')
    await expect(page.locator('#een-week-met-clyde')).toHaveCount(1)
    // WebPageJsonLd names these selectors for speakable; each must hit exactly one element
    await expect(page.locator('.speakable-hero')).toHaveCount(1)
    await expect(page.locator('.speakable-tldr')).toHaveCount(1)
    await expect(page.locator('link[rel="preload"][href*="clyde-kring-poster"]')).toHaveCount(0)
    // the phone LCP (LinkedIn post, a CSS background) is preloaded for phones only (React also hoists a copy into <head>)
    expect(await page.locator('link[rel="preload"][href*="meerkade-li"][media="(max-width: 599px)"]').count()).toBeGreaterThan(0)
  })

  test('the pause button stops the loop and says so (WCAG 2.2.2)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/nl')
    const hero = page.locator('#hero')
    const pause = page.locator('#hero #pause')
    await expect(pause).toHaveAttribute('aria-label', 'Pauzeer de animatie')
    await pause.click()
    await expect(hero).toHaveClass(/is-paused/)
    await expect(pause).toHaveAttribute('aria-label', 'Speel de animatie af')
    const beat = await hero.getAttribute('data-b')
    await page.waitForTimeout(4000)
    await expect(hero).toHaveAttribute('data-b', beat ?? '')
    await pause.click()
    await expect(hero).not.toHaveClass(/is-paused/)
    await expect(pause).toHaveAttribute('aria-label', 'Pauzeer de animatie')
  })

  // Daley 2026-11-08: "de pauze knop voor de animatie linksonder ... dan kan het geheel meer omhoog". Red before: the
  // button sat top-right above the h1 (y 78-122 on 390x844) and the h1 started at y 140.
  test('on a phone the pause button sits bottom-left in the scene and the copy starts under the header', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/nl')
    const hero = (await page.locator('#hero').boundingBox())!
    const stage = (await page.locator('#hero .stage').boundingBox())!
    const pause = (await page.locator('#hero #pause').boundingBox())!
    const h1 = (await page.locator('#hero h1').boundingBox())!
    expect(pause.x).toBeLessThanOrEqual(24)
    expect(pause.y).toBeGreaterThanOrEqual(stage.y)
    expect(pause.y + pause.height).toBeLessThanOrEqual(hero.y + hero.height)
    expect(pause.y + pause.height).toBeGreaterThan(hero.y + hero.height - 80)
    expect(h1.y).toBeLessThan(hero.y + 60)
  })

  test('the Clyde button is its round mark over the hero and further down (Daley 2026-11-08)', async ({ page }) => {
    await page.goto('/nl')
    const fab = page.locator('[data-clyde-launcher]')
    await expect(fab).toHaveAttribute('data-quiet', 'true')
    const box = await fab.boundingBox()
    expect(box && Math.round(box.width)).toBe(44)
    expect(box && Math.round(box.height)).toBe(44)
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded()
    await expect(fab).toHaveAttribute('data-quiet', 'false')
    // quiet now only holds the whisper back; the shape stays the round mark
    const below = await fab.boundingBox()
    expect(below && Math.round(below.width)).toBe(44)
  })

  test('the round mark is there from the first paint, so an early click does not miss a shrinking pill', async ({
    page,
  }) => {
    // No client script runs: this is the server HTML plus CSS, the state before the observer measures.
    // Block only the JS chunks: on Vercel the CSS also lives under /_next/static/chunks/ (no inlined critical CSS there).
    await page.route(/\/_next\/static\/chunks\/.*\.js(\?|$)/, (route) => route.abort())
    await page.goto('/nl')
    const fab = page.locator('[data-clyde-launcher]')
    await expect(fab).not.toHaveAttribute('data-quiet')
    const box = await fab.boundingBox()
    expect(box && Math.round(box.width)).toBe(44)
  })
})

test.describe('Home hero on /en stays the old one', () => {
  test('old hero, kring poster preload, no hero 3', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('section[aria-label="Hero"]')).toHaveCount(1)
    await expect(page.locator('#hero[data-b]')).toHaveCount(0)
    expect(await page.locator('link[rel="preload"][href*="clyde-kring-poster"]').count()).toBeGreaterThan(0)
    // no quiet section on /en, and still the round mark: it is the shape everywhere (Daley 2026-11-08)
    const box = await page.locator('[data-clyde-launcher]').boundingBox()
    expect(box && Math.round(box.width)).toBe(44)
  })
})
