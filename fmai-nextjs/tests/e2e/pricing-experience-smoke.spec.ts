import { test, expect } from '@playwright/test'

/**
 * Golf 5b pricing smoke on /nl/pricing:
 *   - H1 "Wat kost Clyde?" and the #founding block (target of the /founding-member 301)
 *   - the worked example shows Founding at 5, 10 and 15 client brands
 *   - the slider drives the Founding total (10 included, €299 per extra)
 *   - FAQ accordion still works (Fase 0 regression guard)
 */

test.describe.configure({ mode: 'serial' })

test('pricing page renders the golf 5b layout', async ({ page }) => {
  await page.goto('/nl/pricing')
  await page.waitForLoadState('domcontentloaded')

  await expect(page.getByRole('heading', { level: 1, name: 'Wat kost Clyde?' })).toBeVisible()
  await expect(page.locator('section#founding')).toBeVisible()

  // Worked example: 15 brands = 997 + 5 x 299.
  const example = page.getByRole('region', { name: 'Wat je per klantmerk betaalt' })
  await expect(example.getByRole('row', { name: /15 klantmerken/ })).toContainText('€2.492')

  const slider = page.locator('input[type="range"]').first()
  await expect(slider).toHaveAttribute('min', '1')
  await expect(slider).toHaveAttribute('max', '30')

  const faqRoot = page.locator('[data-orientation="vertical"]').first()
  await expect(faqRoot).toBeVisible({ timeout: 10_000 })
  expect(await page.locator('dl').count(), 'no plain dl elements remain on pricing').toBe(0)
})

test('slider updates the founding total and the later tier', async ({ page }) => {
  await page.goto('/nl/pricing')
  await page.waitForLoadState('domcontentloaded')

  const slider = page.locator('input[type="range"]').first()
  await slider.scrollIntoViewIfNeeded()
  const total = page.locator('[aria-live="polite"]').filter({ hasText: 'Founding per maand' })

  await slider.fill('3')
  await expect(total).toContainText('€997')
  await expect(page.getByText(/bij Growth\./)).toBeVisible()

  await slider.fill('15')
  await expect(total).toContainText('€2.492', { timeout: 2_000 })
  await expect(page.getByText(/bij Enterprise\./)).toBeVisible()
})

test('/founding-member is a 301 to /pricing#founding', async ({ request }) => {
  for (const locale of ['nl', 'en']) {
    const res = await request.get(`/${locale}/founding-member`, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(res.headers()['location']).toBe(`/${locale}/pricing#founding`)
  }
})
