import { test, expect, type Page } from '@playwright/test'

/**
 * GA4 key event `apply_submit` (Tracking T4): sent once after a successful application,
 * only while analytics consent is granted, with `branch` as the only parameter (no PII).
 * The apply API is mocked so no real application is ever submitted, and Google is
 * aborted so no hit reaches the GA4 property. The event is read from window.dataLayer.
 */

const GOOGLE = /^https:\/\/([a-z0-9-]+\.)*(googletagmanager\.com|google-analytics\.com|analytics\.google\.com)\//

test.beforeEach(async ({ context }) => {
  await context.route(GOOGLE, (route) => route.abort())
})

const seedConsent = (page: Page) =>
  page.addInitScript(() => {
    // Guard keeps a reload (or the revoke below) from re-granting.
    if (localStorage.getItem('cookieConsent') === null) {
      localStorage.setItem('cookieConsent', JSON.stringify({ functional: true, analytics: true, marketing: false }))
    }
  })

async function mockApply(page: Page, mode: 'ok' | 'error') {
  await page.route('**/api/apply', (route) =>
    mode === 'ok'
      ? route.fulfill({
          json: { branch: 'review', score: 1, maxScore: 17, calendlyUrl: 'https://cal.com/example' },
        })
      : route.fulfill({ status: 500, json: { error: 'boom' } }),
  )
}

async function completeWizard(page: Page, afterLoad?: () => Promise<void>) {
  await page.goto('/nl/apply')
  await afterLoad?.()
  await page.fill('#apply-name', 'Jan de Vries')
  await page.fill('#apply-email', 'jan@testbureau.nl')
  await page.fill('#apply-agency', 'TestBureau NL')
  await page.fill('#apply-role', 'CEO')
  await page.getByRole('button', { name: /volgende/i }).click()
  await page.locator('#main').getByRole('button', { name: /Nee, korte vragenlijst/i }).first().click()
  const pick = (text: RegExp) => page.locator('#main').getByRole('button', { name: text }).first().click()
  await pick(/nog niet zeker/i)
  await pick(/Minder dan/i)
  await pick(/Solo/i)
  await page.getByRole('radio', { name: '1 van 5' }).click()
  await pick(/verkennen/i)
  await page.getByRole('button', { name: /volgende/i }).click()
  await page.getByRole('button', { name: /verstuur aanvraag/i }).click()
}

const applySubmits = (page: Page) =>
  page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .filter((args) => args[0] === 'event' && args[1] === 'apply_submit')
      .map((args) => args[2]),
  )

const banner = (page: Page) => page.locator('[role="dialog"][aria-modal="false"]')

test('consent granted: one apply_submit with only the branch', async ({ page }) => {
  await seedConsent(page)
  await mockApply(page, 'ok')
  await completeWizard(page)
  await expect(page.getByText(/bedankt|daley reviewt/i).first()).toBeVisible({ timeout: 15_000 })
  expect(await applySubmits(page)).toEqual([{ branch: 'review' }])
})

test('no consent choice: no apply_submit', async ({ page }) => {
  await mockApply(page, 'ok')
  await completeWizard(page)
  await expect(page.getByText(/bedankt|daley reviewt/i).first()).toBeVisible({ timeout: 15_000 })
  expect(await applySubmits(page)).toEqual([])
})

test('consent granted then revoked: no apply_submit', async ({ page }) => {
  await seedConsent(page)
  await mockApply(page, 'ok')
  // Revoke on the loaded page (no reload), so gtag is still defined when the form is sent.
  await completeWizard(page, async () => {
    await expect.poll(() => page.evaluate(() => typeof window.gtag)).toBe('function')
    await page.getByRole('button', { name: 'Cookies aanpassen' }).click()
    await expect(banner(page)).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: 'Alles weigeren' }).click()
  })
  await expect(page.getByText(/bedankt|daley reviewt/i).first()).toBeVisible({ timeout: 15_000 })
  // gtag still exists after a revocation; the event must be dropped anyway.
  expect(await page.evaluate(() => typeof window.gtag)).toBe('function')
  expect(await applySubmits(page)).toEqual([])
})

test('apply API error: no apply_submit', async ({ page }) => {
  await seedConsent(page)
  await mockApply(page, 'error')
  await completeWizard(page)
  await expect(page.locator('#apply-problem')).toBeVisible({ timeout: 15_000 })
  expect(await applySubmits(page)).toEqual([])
})
