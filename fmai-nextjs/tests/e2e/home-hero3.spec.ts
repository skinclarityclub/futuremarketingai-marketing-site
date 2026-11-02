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

  test('the Clyde button is its round mark over the hero, the full pill further down (K1 B)', async ({ page }) => {
    await page.goto('/nl')
    const fab = page.locator('[data-clyde-launcher]')
    await expect(fab).toHaveAttribute('data-quiet', 'true')
    const box = await fab.boundingBox()
    expect(box && Math.round(box.width)).toBe(44)
    expect(box && Math.round(box.height)).toBe(44)
    await page.getByRole('contentinfo').scrollIntoViewIfNeeded()
    await expect(fab).toHaveAttribute('data-quiet', 'false')
  })
})

test.describe('Home hero on /en stays the old one', () => {
  test('old hero, kring poster preload, no hero 3', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('section[aria-label="Hero"]')).toHaveCount(1)
    await expect(page.locator('#hero[data-b]')).toHaveCount(0)
    expect(await page.locator('link[rel="preload"][href*="clyde-kring-poster"]').count()).toBeGreaterThan(0)
    await expect(page.locator('[data-clyde-launcher]')).toHaveAttribute('data-quiet', 'false')
  })
})
