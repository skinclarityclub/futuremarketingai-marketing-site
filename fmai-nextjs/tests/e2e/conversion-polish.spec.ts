import { test, expect } from '@playwright/test'

test.describe('Conversion polish — P1-A trust anchors', () => {
  test('NL /assessment intro shows 3 trust anchors below bullets', async ({ page }) => {
    await page.goto('/nl/assessment')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText('Privacy-first, EU-gehost, geen tracking-cookies')).toBeVisible()
    await expect(page.getByText('Resultaten gevalideerd met bureaus in de praktijk')).toBeVisible()
    await expect(page.getByText('Antwoorden 12 maanden bewaard, dan verwijderd')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start de scan' })).toBeVisible()
  })

  test('EN /assessment intro shows 3 trust anchors', async ({ page }) => {
    await page.goto('/en/assessment')
    await expect(page.getByText('Privacy-first, EU-hosted, no tracking cookies')).toBeVisible()
    await expect(page.getByText('Results validated with agencies in practice')).toBeVisible()
    await expect(page.getByText('Answers stored for 12 months, then deleted')).toBeVisible()
  })

  test('ES /assessment intro shows 3 trust anchors', async ({ page }) => {
    await page.goto('/es/assessment')
    await expect(page.getByText('Privacidad primero, alojado en la UE, sin cookies de seguimiento')).toBeVisible()
    await expect(page.getByText('Resultados validados con agencias en la práctica')).toBeVisible()
    await expect(page.getByText('Respuestas guardadas 12 meses, luego eliminadas')).toBeVisible()
  })
})

test.describe('Conversion polish — P1-B LeadMagnetCTA badges', () => {
  test('NL / inline LeadMagnetCTA shows all 3 badges on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/nl', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'AI Bureau Scan' }).first()
    await expect(card).toBeVisible()
    await expect(card.getByText('Gratis', { exact: true })).toBeVisible()
    await expect(card.getByText('5 min', { exact: true })).toBeVisible()
    await expect(card.getByText('Geen account', { exact: true })).toBeVisible()
  })

  test('EN / inline LeadMagnetCTA badges localized', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'AI Agency Scan' }).first()
    await expect(card.getByText('Free', { exact: true })).toBeVisible()
    await expect(card.getByText('No account', { exact: true })).toBeVisible()
  })

  // Sidebar variant on /pricing shows 2 pills only (free + fast), NO noAccount.
  // Skipped in dev: /nl/pricing reliably hangs Turbopack compile (>5min) on
  // first warm; production build is green. Re-enable once Turbopack first-
  // compile latency on this page is fixed upstream.
  test.skip('NL /pricing sidebar LeadMagnetCTA shows 2 badges, hides noAccount', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/nl/pricing', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'Gratis AI Readiness Scan' }).first()
    await expect(card).toBeVisible()
    await expect(card.getByText('Gratis', { exact: true })).toBeVisible()
    await expect(card.getByText('5 min', { exact: true })).toBeVisible()
    // Critical: noAccount pill is intentionally hidden on sidebar variant
    await expect(card.getByText('Geen account', { exact: true })).toHaveCount(0)
  })

  // Sidebar variant currently lives on /blog and /pricing only after Fase 6
  // founding-member SOTA refactor removed its LeadMagnetCTA. /blog is the
  // most-reliable target — pricing first-compile is slow under Turbopack.
  test('EN /blog sidebar variant shows 2 badges only', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en/blog', { waitUntil: 'domcontentloaded' })
    const card = page.locator('aside').filter({ hasText: 'AI Agency Scan' }).first()
    await expect(card.getByText('Free', { exact: true })).toBeVisible()
    await expect(card.getByText('5 min', { exact: true })).toBeVisible()
    await expect(card.getByText('No account', { exact: true })).toHaveCount(0)
  })
})

test.describe('Conversion polish — P1-C newsletter confirm retry', () => {

  // Footer also has an E-mailadres newsletter form (Fase 1c chrome upgrade);
  // scope retry-form lookups to <main> so getByLabel does not double-match.
  test('NL /newsletter/confirm without token shows retry form in error state', async ({ page }) => {
    await page.goto('/nl/newsletter/confirm', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const main = page.getByRole('main')
    await expect(main.getByLabel('E-mailadres')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Stuur nieuwe link' })).toBeVisible()
  })

  test('EN retry-form renders with English copy', async ({ page }) => {
    await page.goto('/en/newsletter/confirm', { waitUntil: 'domcontentloaded' })
    const main = page.getByRole('main')
    await expect(main.getByLabel('Email address')).toBeVisible()
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
    await page.getByRole('main').getByLabel('E-mailadres').fill('test@example.com')
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
    await page.getByRole('main').getByLabel('E-mailadres').fill('test@example.com')
    await page.getByRole('button', { name: 'Stuur nieuwe link' }).click()
    await expect(page.getByText('Check je inbox. We stuurden een nieuwe bevestigingslink.')).toBeVisible()
  })
})

test.describe('Conversion polish — P1-D question-flow consistency', () => {
  // After P1-D, single-select no longer auto-advances; both single and Likert
  // require an explicit "Volgende" click. The "Volgende" button is disabled
  // until a value is picked.
  test('single-select Q1: stays on same question after pick, advances only on Volgende click', async ({ page }) => {
    await page.goto('/nl/assessment', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Start de scan' }).click()
    const next = page.getByRole('button', { name: /Volgende/ })
    await expect(next).toBeDisabled()

    // Pick the first option (A) — OptionButton exposes aria-pressed.
    await page.locator('button[aria-pressed]').first().click()
    await expect(next).toBeEnabled()

    // Wait longer than the legacy 350ms auto-advance window — counter must
    // still show 1/16, proving auto-advance is gone.
    await page.waitForTimeout(600)
    await expect(page.getByText('1 / 16')).toBeVisible()

    // Now click Volgende → counter ticks to 2/16.
    await next.click()
    await expect(page.getByText('2 / 16')).toBeVisible()
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

test.describe('Conversion polish — P2-B share-card + result page', () => {
  test('OG image endpoint returns image/png for valid params', async ({ request }) => {
    // a=wl = tooling-led (Workflow Agency), st=sc = scaling
    const res = await request.get(
      '/api/og/assessment-result?a=wl&st=sc&t=62&s=75&d=55&tl=70&tm=45',
    )
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
    const body = await res.body()
    expect(body.byteLength).toBeGreaterThan(5000)
  })

  test('OG image clamps and falls back gracefully on missing params', async ({ request }) => {
    const res = await request.get('/api/og/assessment-result')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  })

  test('NL /assessment/result renders archetype, total and category bars', async ({ page }) => {
    // a=wl = tooling-led (Workflow-bureau), st=sc = scaling, lowest: team (tm=45)
    await page.goto(
      '/nl/assessment/result?a=wl&st=sc&t=62&s=75&d=55&tl=70&tm=45',
      { waitUntil: 'domcontentloaded' },
    )
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Workflow-bureau')
    await expect(page.getByText('62', { exact: false })).toBeVisible()
    await expect(page.getByText('Strategie', { exact: false })).toBeVisible()
    await expect(page.getByText('Team', { exact: false })).toBeVisible()
    // Lowest category (team = 45) gets the focus pill (NL: focusLabel = 'Groeikans')
    await expect(page.getByText('Groeikans', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /Start de scan/ })).toBeVisible()
  })

  test('NL /assessment/result backwards-compat with legacy p= param', async ({ page }) => {
    // Old p=b URLs map to balanced archetype + scaling stage
    await page.goto(
      '/nl/assessment/result?p=b&t=62&s=75&d=55&tl=70&tm=45',
      { waitUntil: 'domcontentloaded' },
    )
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Allround-bureau')
    await expect(page.getByText('62', { exact: false })).toBeVisible()
  })

  test('result page metadata references the dynamic OG image', async ({ page }) => {
    await page.goto(
      '/en/assessment/result?a=sl&st=em&t=33&s=20&d=40&tl=50&tm=22',
      { waitUntil: 'domcontentloaded' },
    )
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toContain('/api/og/assessment-result')
    expect(ogImage).toContain('a=')
    expect(ogImage).toContain('t=33')
  })

  test('result page is robots noindex (shareable but not crawled)', async ({ page }) => {
    await page.goto('/en/assessment/result?a=ba&st=sc&t=50', { waitUntil: 'domcontentloaded' })
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toContain('noindex')
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
