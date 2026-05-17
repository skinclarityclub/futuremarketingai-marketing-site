import { test, expect } from '@playwright/test'

test.describe('Conversion polish — P1-A trust anchors', () => {
  test('NL /assessment intro shows 3 trust anchors below bullets', async ({ page }) => {
    await page.goto('/nl/assessment')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Privacy-first, EU-gehost, geen tracking-cookies')).toBeVisible()
    await expect(page.getByText('Persona gevalideerd tegen 1 betalende klant')).toBeVisible()
    await expect(page.getByText('Antwoorden 12 maanden bewaard, dan verwijderd')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start de scan' })).toBeVisible()
  })

  test('EN /assessment intro shows 3 trust anchors', async ({ page }) => {
    await page.goto('/en/assessment')
    await expect(page.getByText('Privacy-first, EU-hosted, no tracking cookies')).toBeVisible()
    await expect(page.getByText('Persona validated against 1 paying client')).toBeVisible()
    await expect(page.getByText('Answers stored for 12 months, then deleted')).toBeVisible()
  })

  test('ES /assessment intro shows 3 trust anchors', async ({ page }) => {
    await page.goto('/es/assessment')
    await expect(page.getByText('Privacidad primero, alojado en la UE, sin cookies de seguimiento')).toBeVisible()
    await expect(page.getByText('Persona validada con 1 cliente de pago')).toBeVisible()
    await expect(page.getByText('Respuestas guardadas 12 meses, luego eliminadas')).toBeVisible()
  })
})

test.describe('Conversion polish — P1-B LeadMagnetCTA badges', () => {
  test('NL / inline LeadMagnetCTA shows all 3 badges on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/nl', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'Gratis AI Readiness Scan' }).first()
    await expect(card).toBeVisible()
    await expect(card.getByText('Gratis', { exact: true })).toBeVisible()
    await expect(card.getByText('5 min', { exact: true })).toBeVisible()
    await expect(card.getByText('Geen account', { exact: true })).toBeVisible()
  })

  test('EN / inline LeadMagnetCTA badges localized', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'Free AI Readiness Scan' }).first()
    await expect(card.getByText('Free', { exact: true })).toBeVisible()
    await expect(card.getByText('No account', { exact: true })).toBeVisible()
  })

  // Sidebar variant on /pricing shows 2 pills only (free + fast), NO noAccount.
  test('NL /pricing sidebar LeadMagnetCTA shows 2 badges, hides noAccount', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/nl/pricing', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'Gratis AI Readiness Scan' }).first()
    await expect(card).toBeVisible()
    await expect(card.getByText('Gratis', { exact: true })).toBeVisible()
    await expect(card.getByText('5 min', { exact: true })).toBeVisible()
    // Critical: noAccount pill is intentionally hidden on sidebar variant
    await expect(card.getByText('Geen account', { exact: true })).toHaveCount(0)
  })

  test('EN /founding-member sidebar variant shows 2 badges only', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en/founding-member', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'Free AI Readiness Scan' }).first()
    await expect(card.getByText('Free', { exact: true })).toBeVisible()
    await expect(card.getByText('5 min', { exact: true })).toBeVisible()
    await expect(card.getByText('No account', { exact: true })).toHaveCount(0)
  })
})

test.describe('Conversion polish — P1-C newsletter confirm retry', () => {
  // Retry once: Turbopack first-compile of /newsletter/confirm under parallel
  // worker load can blow the 5s assertion timeout. Solo, every test passes < 15s.
  test.describe.configure({ retries: 1 })


  test('NL /newsletter/confirm without token shows retry form in error state', async ({ page }) => {
    await page.goto('/nl/newsletter/confirm', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByLabel('E-mailadres')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Stuur nieuwe link' })).toBeVisible()
  })

  test('EN retry-form renders with English copy', async ({ page }) => {
    await page.goto('/en/newsletter/confirm', { waitUntil: 'domcontentloaded' })
    await expect(page.getByLabel('Email address')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send new link' })).toBeVisible()
  })

  test('rate-limit path: stubbed 429 surfaces errorRate state', async ({ page }) => {
    // Intercept the network call so the test does not actually hit upstash + send mail.
    await page.route('**/api/newsletter/resend-confirm', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, error: 'rate_limited' }),
      }),
    )
    await page.goto('/nl/newsletter/confirm', { waitUntil: 'domcontentloaded' })
    await page.getByLabel('E-mailadres').fill('test@example.com')
    await page.getByRole('button', { name: 'Stuur nieuwe link' }).click()
    await expect(page.getByText('Te veel pogingen. Probeer het over een uur opnieuw.')).toBeVisible()
  })

  test('success path: stubbed 200 surfaces inbox-check confirmation', async ({ page }) => {
    await page.route('**/api/newsletter/resend-confirm', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      }),
    )
    await page.goto('/nl/newsletter/confirm', { waitUntil: 'domcontentloaded' })
    await page.getByLabel('E-mailadres').fill('test@example.com')
    await page.getByRole('button', { name: 'Stuur nieuwe link' }).click()
    await expect(page.getByText('Check je inbox. We stuurden een nieuwe bevestigingslink.')).toBeVisible()
  })
})

test.describe('Conversion polish — P1-E progress bar position', () => {
  // Progress bar is only rendered while a question is active, not on the intro.
  // We start the scan, pick the first option, then assert the bar's position.
  async function startScan(page: import('@playwright/test').Page) {
    await page.goto('/nl/assessment', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Start de scan' }).click()
    // Wait for the progressbar to appear (i.e. we're now in question mode)
    await page.getByRole('progressbar').waitFor({ state: 'visible', timeout: 10000 })
  }

  test('mobile viewport (375px): progress bar fixed at top below header', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await startScan(page)
    const bar = page.getByRole('progressbar')
    const box = await bar.boundingBox()
    expect(box, 'progress bar must have a bounding box').not.toBeNull()
    // Under a 64px (h-16) site header — allow tolerance for backdrop blur padding
    expect(box!.y).toBeGreaterThanOrEqual(60)
    expect(box!.y).toBeLessThanOrEqual(90)
  })

  test('desktop viewport (1280px): progress bar stays at the bottom of the page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await startScan(page)
    const bar = page.getByRole('progressbar')
    const box = await bar.boundingBox()
    expect(box).not.toBeNull()
    // Bottom-fixed: y should be in the lower half of the 800px viewport
    expect(box!.y).toBeGreaterThan(600)
  })
})

test.describe('Conversion polish — P1-G privacy assessment section', () => {
  test('NL /legal/privacy contains assessment subsection with key data lifecycle facts', async ({ page }) => {
    await page.goto('/nl/legal/privacy')
    const heading = page.getByRole('heading', { name: '9. AI Readiness Assessment' })
    await expect(heading).toBeVisible()
    await heading.scrollIntoViewIfNeeded()
    const body = page.getByText(/12 maanden bewaard/i)
    await expect(body).toBeVisible()
    await expect(page.getByText(/Supabase \(EU-regio\)/i)).toBeVisible()
    await expect(page.getByText('10. Contact en toezichthouder')).toBeVisible()
  })

  test('EN /legal/privacy contains assessment subsection', async ({ page }) => {
    await page.goto('/en/legal/privacy')
    await expect(page.getByRole('heading', { name: '9. AI Readiness Assessment' })).toBeVisible()
    await expect(page.getByText(/Supabase \(EU region\)/i)).toBeVisible()
    await expect(page.getByText('10. Contact and supervisory authority')).toBeVisible()
  })

  test('ES /legal/privacy contains assessment subsection', async ({ page }) => {
    await page.goto('/es/legal/privacy')
    await expect(page.getByRole('heading', { name: '9. AI Readiness Assessment' })).toBeVisible()
    await expect(page.getByText(/Supabase \(región UE\)/i)).toBeVisible()
    await expect(page.getByText('10. Contacto y autoridad de control')).toBeVisible()
  })
})
