import { test, expect } from '@playwright/test'

/**
 * Founding A1.4 pricing smoke on /nl/pricing (plan A1.4 §1, §3, §8):
 *   - H1 "Wat kost Clyde?" and the #founding block (target of the /founding-member 301)
 *   - €1.297 excl. btw, the counter counts signed spots only (0 van 3)
 *   - the worked example shows Founding at 5, 10 and 15 client brands
 *   - the balanced month per brand is on the page; the old tiers are not
 *   - the slider drives the Founding total (5 included, €199 per extra, max 15)
 *   - FAQ accordion still works (Fase 0 regression guard)
 */

test.describe.configure({ mode: 'serial' })

test('pricing page renders Founding A1.4', async ({ page }) => {
  await page.goto('/nl/pricing')
  await page.waitForLoadState('domcontentloaded')

  await expect(page.getByRole('heading', { level: 1, name: 'Wat kost Clyde?' })).toBeVisible()
  const founding = page.locator('section#founding')
  await expect(founding).toBeVisible()
  await expect(founding).toContainText('€1.297')
  await expect(founding).toContainText('excl. btw')
  await expect(founding).toContainText('0 van 3 plekken bezet')

  // Worked example: 15 brands = 1297 + 10 x 199.
  const example = page.getByRole('region', { name: 'Wat je per klantmerk betaalt' })
  await expect(example.getByRole('row', { name: /^5 klantmerken/ })).toContainText('€1.297')
  await expect(example.getByRole('row', { name: /15 klantmerken/ })).toContainText('€3.287')
  await expect(example.getByRole('row', { name: /15 klantmerken/ })).toContainText('22.500')

  await expect(page.locator('section#month')).toContainText('YouTube Shorts')
  await expect(page.getByText('Reguliere pakketten volgen na het Founding-cohort', { exact: false }).first()).toBeVisible()

  // The old tiers and the half-price month are gone from the page.
  const body = await page.locator('main').innerText()
  for (const gone of ['Growth', 'Professional', 'Enterprise', '€997', '€499', '€3.997', 'halve prijs']) {
    expect(body, `"${gone}" must not be on /nl/pricing`).not.toContain(gone)
  }

  const slider = page.locator('input[type="range"]').first()
  await expect(slider).toHaveAttribute('min', '1')
  await expect(slider).toHaveAttribute('max', '15')

  const faqRoot = page.locator('[data-orientation="vertical"]').first()
  await expect(faqRoot).toBeVisible({ timeout: 10_000 })
  expect(await page.locator('dl').count(), 'no plain dl elements remain on pricing').toBe(0)
})

test('slider updates the founding total and the credit pool', async ({ page }) => {
  await page.goto('/nl/pricing')
  await page.waitForLoadState('domcontentloaded')

  const slider = page.locator('input[type="range"]').first()
  await slider.scrollIntoViewIfNeeded()
  const total = page.locator('[aria-live="polite"]').filter({ hasText: 'Founding per maand' })

  await slider.fill('3')
  await expect(total).toContainText('€1.297')
  await expect(page.getByText(/De basisprijs dekt tot 5 klantmerken/)).toBeVisible()

  await slider.fill('6')
  await expect(total).toContainText('€1.496', { timeout: 2_000 })

  await slider.fill('15')
  await expect(total).toContainText('€3.287', { timeout: 2_000 })
  await expect(page.getByText(/22\.500 credits per maand/)).toBeVisible()
})

test('/founding-member is a 301 to /pricing#founding', async ({ request }) => {
  for (const locale of ['nl', 'en']) {
    const res = await request.get(`/${locale}/founding-member`, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(res.headers()['location']).toBe(`/${locale}/pricing#founding`)
  }
})
