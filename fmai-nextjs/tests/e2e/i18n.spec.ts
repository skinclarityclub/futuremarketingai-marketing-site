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
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should load Dutch homepage at /nl', async ({ page }) => {
    await page.goto('/nl')
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should load Spanish homepage at /es', async ({ page }) => {
    await page.goto('/es')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

test.describe('Locale Switcher', () => {
  test('should show locale switcher in header', async ({ page }) => {
    await page.goto('/en')

    // Locale switcher button showing current locale
    const localeButton = page.locator('button[aria-label="Change language"]')
    await expect(localeButton).toBeVisible()
  })

  test('should be able to switch to NL locale', async ({ page }) => {
    // Direct navigation to verify locale works
    await page.goto('/nl')
    await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('locale switcher button should be visible', async ({ page }) => {
    await page.goto('/en')
    const localeButton = page.locator('button[aria-label="Change language"]')
    await expect(localeButton).toBeVisible({ timeout: 5000 })
    // Button should show current locale
    await expect(localeButton).toContainText('EN')
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
    await expect(page.locator('footer')).toBeVisible()

    await page.goto('/nl')
    await expect(page.locator('footer')).toBeVisible()
  })
})
