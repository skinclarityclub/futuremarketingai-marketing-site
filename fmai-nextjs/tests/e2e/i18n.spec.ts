import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Internationalization — Next.js site
 *
 * New test suite unique to Next.js (Vite site was English-only).
 * Tests next-intl locale routing and content switching.
 */

test.describe('Locale Routing', () => {
  test('should redirect / to /en (default locale)', async ({ page }) => {
    await page.goto('/')
    // Middleware redirects / to /en
    await expect(page).toHaveURL(/\/en/, { timeout: 10000 })
  })

  test('should load English homepage at /en', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    // Desktop hero is role=heading aria-level=1; the one <h1> belongs to the mobile hero.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should load Dutch homepage at /nl', async ({ page }) => {
    await page.goto('/nl')
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  // es left the locales on 2026-10-02; next.config.ts sends every /es URL to its /en twin.
  test('should redirect /es to /en', async ({ page }) => {
    await page.goto('/es/pricing')
    await expect(page).toHaveURL(/\/en\/pricing$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})

test.describe('Locale Switcher', () => {
  test('should show locale switcher in header', async ({ page }) => {
    await page.goto('/en')

    // the flag of the current language, its name in the language it switches to (Daley 2026-11-08)
    const sw = page.locator('header').getByRole('link', { name: 'Taal: Engels. Wissel naar Nederlands' })
    await expect(sw).toBeVisible()
    await expect(sw).toHaveAttribute('hreflang', 'nl')
  })

  test('should be able to switch to NL locale', async ({ page }) => {
    // Direct navigation to verify locale works
    await page.goto('/nl')
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('locale switcher keeps the page and changes the locale', async ({ page }) => {
    await page.goto('/nl/pricing')
    await page.locator('header').getByRole('link', { name: 'Language: Dutch. Switch to English' }).click()
    await expect(page).toHaveURL(/\/en\/pricing$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })
})

test.describe('Locale Content', () => {
  test('both EN and NL should render content', async ({ page }) => {
    // EN content
    await page.goto('/en')
    const enTitle = await page.locator('h1').first().textContent()
    expect(enTitle).toBeTruthy()

    // NL content
    await page.goto('/nl')
    const nlTitle = await page.locator('h1').first().textContent()
    expect(nlTitle).toBeTruthy()

    // TODO: once translations are complete, verify enTitle !== nlTitle
  })

  test('footer renders for each locale', async ({ page }) => {
    await page.goto('/en')
    await expect(page.getByRole('contentinfo')).toBeVisible()

    await page.goto('/nl')
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })
})
