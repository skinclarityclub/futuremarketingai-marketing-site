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
  // The inline variant is only rendered on the homepage (/) — pricing,
  // founding-member and blog all use variant="sidebar" which has no badges.
  test('NL / inline LeadMagnetCTA shows free/5min/no-account badges on desktop', async ({ page }) => {
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
