import { test, expect, type Page } from '@playwright/test'

/**
 * GA4 loads only after analytics consent (basic Consent Mode v2). Before a choice,
 * and after "Alles weigeren", the page must not contact Google at all — not even the
 * cookieless pings advanced mode would send. Google is aborted at the network layer so
 * test runs never reach the real GA4 property; the request event still fires.
 */

const GOOGLE = /^https:\/\/([a-z0-9-]+\.)*(googletagmanager\.com|google-analytics\.com|analytics\.google\.com)\//
const SETTLE_MS = 2500

function trackGoogle(page: Page): string[] {
  const hits: string[] = []
  page.on('request', (req) => {
    if (GOOGLE.test(req.url())) hits.push(req.url())
  })
  return hits
}

test.beforeEach(async ({ context }) => {
  await context.route(GOOGLE, (route) => route.abort())
})

const banner = (page: Page) => page.locator('[role="dialog"][aria-modal="false"]')

test('no stored consent: nothing reaches Google', async ({ page }) => {
  const hits = trackGoogle(page)
  await page.goto('/nl')
  await expect(banner(page)).toBeVisible({ timeout: 15000 })
  await page.waitForTimeout(SETTLE_MS)
  expect(hits).toEqual([])
})

test('accept: gtag loads with consent defaulted to denied, then analytics granted', async ({ page }) => {
  const hits = trackGoogle(page)
  await page.goto('/nl')
  await expect(banner(page)).toBeVisible({ timeout: 15000 })
  await page.getByRole('button', { name: 'Alles accepteren' }).click()

  await expect.poll(() => hits.some((u) => u.includes('googletagmanager.com/gtag/js'))).toBe(true)
  const consent = await page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((entry) => Array.from(entry as ArrayLike<unknown>))
      .filter((args) => args[0] === 'consent')
  )
  expect(consent[0]).toEqual([
    'consent',
    'default',
    { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' },
  ])
  expect(consent[1]).toEqual(['consent', 'update', { analytics_storage: 'granted' }])
})

test('reject: nothing reaches Google, also after a reload', async ({ page }) => {
  const hits = trackGoogle(page)
  await page.goto('/nl')
  await expect(banner(page)).toBeVisible({ timeout: 15000 })
  await page.getByRole('button', { name: 'Alles weigeren' }).click()
  await page.waitForTimeout(SETTLE_MS)
  await page.reload()
  await page.waitForTimeout(SETTLE_MS)
  expect(hits).toEqual([])
})

test('returning visitor with analytics consent: gtag loads on mount, no banner', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('cookieConsent', JSON.stringify({ functional: true, analytics: true, marketing: false }))
  )
  const hits = trackGoogle(page)
  await page.goto('/nl')
  await expect.poll(() => hits.some((u) => u.includes('googletagmanager.com/gtag/js'))).toBe(true)
  await expect(banner(page)).toHaveCount(0)
})

test('revoke via the footer: _ga cookies are wiped and Google stays away after a reload', async ({
  page,
  context,
  baseURL,
}) => {
  // Seed once; the guard keeps the reload from overwriting the rejection.
  await page.addInitScript(() => {
    if (localStorage.getItem('cookieConsent') === null) {
      localStorage.setItem('cookieConsent', JSON.stringify({ functional: true, analytics: true, marketing: true }))
    }
  })
  await context.addCookies([
    { name: '_ga', value: 'GA1.1.111.222', url: baseURL },
    { name: '_ga_08FEWKC77B', value: 'GS1.1.333', url: baseURL },
  ])
  await page.goto('/nl')

  await page.getByRole('button', { name: 'Cookies aanpassen' }).click()
  await expect(banner(page)).toBeVisible({ timeout: 15000 })
  await page.getByRole('button', { name: 'Alles weigeren' }).click()

  await expect
    .poll(async () => (await context.cookies()).filter((c) => c.name.startsWith('_ga')).map((c) => c.name))
    .toEqual([])

  const hits = trackGoogle(page)
  await page.reload()
  await page.waitForTimeout(SETTLE_MS)
  expect(hits).toEqual([])
})
