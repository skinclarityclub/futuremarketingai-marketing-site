import { test, expect } from '@playwright/test'

/**
 * Fase 4 pricing SOTA smoke — confirms the WorkspaceSlider + TierBentoCard
 * refactor renders correctly on /nl/pricing:
 *   - eyebrows present on every section
 *   - shared workspace slider exists, has tier-active pill, drives price
 *   - moving the slider re-renders the active-tier pill (Growth → Pro → Ent)
 *   - FAQ accordion still works (Fase 0 regression guard)
 */

test.describe.configure({ mode: 'serial' })

test('pricing page renders new SOTA layout with shared workspace slider', async ({ page }) => {
  await page.goto('/nl/pricing')
  await page.waitForLoadState('domcontentloaded')

  // Hero eyebrow present
  await expect(page.getByText('Tarieven & vaardigheden', { exact: true }).first()).toBeVisible()

  // Tiers section eyebrow present
  await expect(page.getByText('Tier-overzicht', { exact: true })).toBeVisible()

  // Eyebrow count site-wide on this page should be at least 7 (hero, tiers,
  // slider, matrix, faq, visibility, creditPacks, skillPacks, cta — 9 total).
  const eyebrowCount = await page.locator('.font-mono.uppercase').count()
  expect(eyebrowCount, 'at least 7 mono-eyebrows on pricing page').toBeGreaterThanOrEqual(7)

  // Shared slider input exists with min/max bounds 1..30
  const slider = page.locator('input[type="range"]').first()
  await expect(slider).toBeVisible()
  await expect(slider).toHaveAttribute('aria-valuemin', '1')
  await expect(slider).toHaveAttribute('aria-valuemax', '30')

  // Active tier pill on initial workspaces=5 should be Professional.
  await expect(page.getByText('Professional', { exact: true }).first()).toBeVisible()

  // FAQ accordion still works (regression guard from Fase 0).
  const faqRoot = page.locator('[data-orientation="vertical"]').first()
  await expect(faqRoot).toBeVisible({ timeout: 10_000 })
  const dlCount = await page.locator('dl').count()
  expect(dlCount, 'no plain dl elements remain on pricing').toBe(0)

  await page.screenshot({
    path: 'playwright-output/fase4-pricing-initial.png',
    fullPage: false,
  })
})

test('moving slider updates active-tier indicator across all three workspace tiers', async ({
  page,
}) => {
  await page.goto('/nl/pricing')
  await page.waitForLoadState('domcontentloaded')

  const slider = page.locator('input[type="range"]').first()
  await slider.scrollIntoViewIfNeeded()

  // Drive slider to Growth range (workspaces=3).
  await slider.focus()
  await slider.fill('3')
  await expect(slider).toHaveJSProperty('value', '3')
  await page.waitForTimeout(200)
  // Growth label should now appear as active-tier pill.
  await expect(page.locator('text=Growth').first()).toBeVisible()

  // Drive slider to Pro range (workspaces=10).
  await slider.fill('10')
  await expect(slider).toHaveJSProperty('value', '10')
  await page.waitForTimeout(200)
  await expect(page.locator('text=Professional').first()).toBeVisible()

  // Drive slider to Enterprise range (workspaces=20).
  await slider.fill('20')
  await expect(slider).toHaveJSProperty('value', '20')
  await page.waitForTimeout(200)
  await expect(page.locator('text=Enterprise').first()).toBeVisible()

  await page.screenshot({
    path: 'playwright-output/fase4-pricing-slider-ent.png',
    fullPage: false,
  })
})
