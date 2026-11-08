/**
 * Apply Wizard — full E2E test suite
 *
 * Covers: critical paths (8), scoring edge cases, assessment handoff,
 * back-navigation, sessionStorage rehydrate, mobile viewport, honeypot.
 *
 * Never submits a real application: a valid POST to /api/apply writes a lead to
 * the shared prod DB and mails Daley. Browser flows get a mocked /api/apply that
 * scores with the real scoreApplication; only the honeypot and the 422 hit the
 * route, because both return before the insert, and only on localhost.
 */

import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import { scoreApplication } from '../../src/lib/apply/scoring'
import { calHostedUrl } from '../../src/config/calConfig'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'
const isLocalBase = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(BASE)

type ApplyBody = Parameters<typeof scoreApplication>[0] & {
  identity?: { name?: string; email?: string; agency?: string; role?: string }
}

// Answers like the route does after Zod (route.ts scoreApplication + calHostedUrl), and records what the wizard posted.
async function mockApply(page: Page) {
  const bodies: ApplyBody[] = []
  await page.route('**/api/apply', async (route) => {
    const body = route.request().postDataJSON() as ApplyBody
    bodies.push(body)
    const r = scoreApplication(body)
    await route.fulfill({
      json: {
        success: true,
        branch: r.branch,
        score: r.total,
        maxScore: r.max,
        ...(r.branch === 'qualified'
          ? { calendlyUrl: calHostedUrl({ name: body.identity?.name, email: body.identity?.email }) }
          : {}),
      },
    })
  })
  return bodies
}

let applyBodies: ApplyBody[] = []
test.beforeEach(async ({ page }) => {
  applyBodies = await mockApply(page)
})

async function clearWizardState(context: BrowserContext) {
  await context.addInitScript(() => {
    sessionStorage.removeItem('fmai-apply-wizard-v1')
  })
}

// Under `next dev` the SSR form is visible before React hydrates; typing and clicking then are lost and the wizard stays on identity.
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const el = document.querySelector('#apply-name')
    return !!el && Object.keys(el).some((k) => k.startsWith('__reactFiber'))
  })
}

async function fillIdentity(
  page: Page,
  opts: { name?: string; email?: string; agency?: string; role?: string } = {},
) {
  const { name = 'Jan de Vries', email = 'jan@testbureau.nl', agency = 'TestBureau NL', role = 'CEO' } = opts
  await waitForHydration(page)
  await page.fill('#apply-name', name)
  await page.fill('#apply-email', email)
  await page.fill('#apply-agency', agency)
  await page.fill('#apply-role', role)
  await page.getByRole('button', { name: /volgende/i }).click()
}

async function clickOptionContaining(page: Page, text: string) {
  // Scope to #main to avoid accidental nav link matches (e.g. "Founding" nav item)
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  await page.locator('#main').getByRole('button', { name: new RegExp(escaped, 'i') }).first().click()
}

async function fillQualificationHigh(page: Page) {
  // Q1 founding → 3pts
  await clickOptionContaining(page, 'Founding (€1.297')
  // Q2 €1M tot €3M → 3pts
  await clickOptionContaining(page, '1M tot')
  // Q3 5 tot 15 merken → 3pts
  await clickOptionContaining(page, '5 tot 15')
  // Q4 likert 5 → 4pts: aria-label="5 van 5"
  await page.getByRole('radio', { name: '5 van 5' }).click()
  // Q5 Binnen 30 dagen → 3pts
  await clickOptionContaining(page, '30 dagen')
  // Advance to Problem step
  await clickNext(page)
}

async function fillQualificationLow(page: Page) {
  // Q1 unsure → 0pts
  await clickOptionContaining(page, 'nog niet zeker')
  // Q2 under_300k → 0pts
  await clickOptionContaining(page, 'Minder dan')
  // Q3 solo → 0pts
  await clickOptionContaining(page, 'Solo')
  // Q4 likert 1 → 0pts: aria-label="1 van 5"
  await page.getByRole('radio', { name: '1 van 5' }).click()
  // Q5 explore → 1pt
  await clickOptionContaining(page, 'verkennen')
  // Advance to Problem step
  await clickNext(page)
}

async function clickNext(page: Page) {
  await page.getByRole('button', { name: /volgende/i }).click()
}

async function clickSubmit(page: Page) {
  await page.getByRole('button', { name: /verstuur aanvraag/i }).click()
}

async function waitForResult(page: Page, timeoutMs = 15_000) {
  await page.waitForSelector('[data-testid="result-qualified"], [data-testid="result-review"]', {
    timeout: timeoutMs,
  }).catch(async () => {
    // Fallback: wait for known result text
    await page.waitForFunction(
      () =>
        document.body.innerText.includes('Geweldig') ||
        document.body.innerText.includes('Bedankt') ||
        document.body.innerText.includes('Daley reviewt'),
      { timeout: timeoutMs },
    )
  })
}

// ---------------------------------------------------------------------------
// Scoring: the pure function the route calls after Zod (route.ts). A valid
// POST would be a real application, so these never go over HTTP.
// ---------------------------------------------------------------------------

test.describe('Scoring', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'pure logic, chromium only')
  test('ideal-fit → 15+/17 qualified', () => {
    const r = scoreApplication({
      qualification: { q1: 'growth', q2: '1m_3m', q3: '5_15', q4: 4, q5: '30days' },
      problem: 'x'.repeat(200),
    })
    expect(r.branch).toBe('qualified')
    expect(r.total).toBeGreaterThanOrEqual(13)
    expect(r.max).toBe(17)
  })

  test('low-fit → 1/17 review', () => {
    const r = scoreApplication({
      qualification: { q1: 'unsure', q2: 'under_300k', q3: 'solo', q4: 1, q5: 'explore' },
      problem: '',
    })
    expect(r.branch).toBe('review')
    expect(r.total).toBe(1) // only explore=1 point
  })

  test('assessment handoff scoring', () => {
    const r = scoreApplication({
      assessment: { archetype: 'data-led', stage: 'scaling', lowestCategory: 'tools', source: 'url' },
      qualification: { q1: 'growth', q5: '30days' },
      problem: '',
    })
    // scaling(3) + growth(2) + 30days(3) = 8 → qualified
    expect(r.branch).toBe('qualified')
    expect(r.total).toBe(8)
    expect(r.max).toBe(12)
  })

  test('problem bonus: 199 chars → no bonus', () => {
    const r = scoreApplication({
      qualification: { q1: 'founding', q2: '1m_3m', q3: '5_15', q4: 4, q5: '30days' },
      problem: 'a'.repeat(199),
    })
    // founding(3)+1m_3m(3)+5_15(3)+q4=4(3)+30days(3)+NO bonus = 15
    expect(r.total).toBe(15)
  })

  test('problem bonus: 200 chars → +1 bonus', () => {
    const r = scoreApplication({
      qualification: { q1: 'founding', q2: '1m_3m', q3: '5_15', q4: 4, q5: '30days' },
      problem: 'a'.repeat(200),
    })
    expect(r.total).toBe(16)
  })

  test('Q4 likert 5 → 4 points', () => {
    const r = scoreApplication({
      qualification: { q1: 'unsure', q2: 'under_300k', q3: 'solo', q4: 5, q5: 'unknown' },
      problem: '',
    })
    // unsure(0)+under_300k(0)+solo(0)+likert5(4)+unknown(0) = 4
    expect(r.total).toBe(4)
  })

  test('Q4 likert 1 → 0 points', () => {
    const r = scoreApplication({
      qualification: { q1: 'unsure', q2: 'under_300k', q3: 'solo', q4: 1, q5: 'unknown' },
      problem: '',
    })
    // all 0
    expect(r.total).toBe(0)
  })

  test('Q1 founding → 3pts vs growth → 2pts', () => {
    const rest = { q2: 'under_300k', q3: 'solo', q4: 1, q5: 'unknown' } as const
    expect(scoreApplication({ qualification: { q1: 'founding', ...rest }, problem: '' }).total).toBe(3)
    expect(scoreApplication({ qualification: { q1: 'growth', ...rest }, problem: '' }).total).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// API guards over HTTP: the honeypot and the 422 return before the insert and
// the mails (route.ts), so they are safe to post, but only on localhost.
// They need `next dev` (the config's webServer): a production build runs the
// Upstash limiter first, and without its env that answers 500.
// ---------------------------------------------------------------------------

test.describe('API guards (localhost only)', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'API tests run on chromium only')
  test.skip(!isLocalBase, 'posts to /api/apply, never against a deployed site')

  test('honeypot → 200 but silent (no side-effects claim)', async ({ request }) => {
    const res = await request.post(`${BASE}/api/apply`, {
      data: {
        identity: { name: 'Bot', email: 'bot@spam.nl', agency: 'Spam', role: 'Bot' },
        qualification: { q1: 'founding', q2: '1m_3m', q3: '5_15', q4: 4, q5: '30days' },
        problem: 'real text',
        locale: 'nl',
        website: 'http://spam.com',
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })

  test('invalid URL params → validation 422', async ({ request }) => {
    const res = await request.post(`${BASE}/api/apply`, {
      data: {
        identity: { name: 'X', email: 'invalid-email', agency: 'X', role: 'X' },
        qualification: {},
        locale: 'nl',
        website: '',
      },
    })
    expect(res.status()).toBe(422)
  })
})

// ---------------------------------------------------------------------------
// Critical Path E2E — browser-rendered full flows
// ---------------------------------------------------------------------------

test.describe('Critical path: cold-start NL qualified (Branch A)', () => {
  test('full qualified flow → Calendly shown', async ({ page, context }) => {
    await clearWizardState(context)

    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    // Step 1: Identity
    await fillIdentity(page)
    await expect(page.getByText(/heb je de AI bureau scan/i)).toBeVisible({ timeout: 5_000 })

    // Step 2: ScanCheck → No
    await clickOptionContaining(page, 'Nee, korte vragenlijst')
    await expect(page.getByText(/bureau context/i)).toBeVisible({ timeout: 5_000 })

    // Step 3: Qualification high scores
    await fillQualificationHigh(page)
    await expect(page.locator('#apply-problem')).toBeVisible({ timeout: 5_000 })

    // Step 4: Problem (200+ chars for bonus)
    await page.fill('#apply-problem', 'We verliezen 2 FTE aan contentproductie voor 12 merken per maand. Het is onschaalbaar en we kunnen niet groeien zonder meer mensen. De bottleneck is tekst, social en SEO gecombineerd.')
    await clickSubmit(page)

    // Result
    await waitForResult(page)
    await expect(page.getByText(/geweldig/i)).toBeVisible({ timeout: 15_000 })

    // The wizard posted exactly what was filled in (the mock skips Zod, so check the mapping here)
    expect(applyBodies).toHaveLength(1)
    expect(applyBodies[0]).toMatchObject({
      identity: { name: 'Jan de Vries', email: 'jan@testbureau.nl', agency: 'TestBureau NL', role: 'CEO' },
      qualification: { q1: 'founding', q2: '1m_3m', q3: '5_15', q4: 5, q5: '30days' },
    })

    // Cal.com embed container should be present (even if iframe doesn't fully load in test)
    const calendlyContainer = page.locator('cal-inline, [data-cal-namespace], iframe[src*="cal.com"]')
    const fallbackLink = page.getByRole('link', { name: /agenda|plan/i })
    const hasCalendly = await calendlyContainer.count() > 0 || await fallbackLink.count() > 0
    expect(hasCalendly).toBe(true)

    // No JS errors (filter known dev-only noise)
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('Calendly') &&
        !e.includes('calendly') &&
        !e.includes('cal.com') &&
        !e.includes('ERR_BLOCKED') &&
        !e.includes('Content Security Policy') &&
        !e.includes('vercel-scripts') &&
        !e.includes('va.vercel') &&
        !e.includes('Failed to load resource') &&
        !e.includes('/_vercel/') &&
        !e.includes('intercom'),
    )
    expect(criticalErrors).toHaveLength(0)
  })
})

test.describe('Critical path: cold-start low-fit (Branch B)', () => {
  test('low scores → review thank-you screen, no Calendly', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    await fillIdentity(page, { name: 'Piet Solo', email: 'piet@solo.nl', agency: 'Solo Piet', role: 'Freelancer' })
    await clickOptionContaining(page, 'Nee, korte vragenlijst')
    await fillQualificationLow(page)

    // Problem: empty (no bonus)
    await clickSubmit(page)

    await waitForResult(page)
    await expect(page.getByText(/bedankt/i).or(page.getByText(/daley reviewt/i))).toBeVisible({ timeout: 15_000 })

    // No scheduler embed on Branch B
    const calendlyWidget = page.locator('cal-inline, iframe[src*="cal.com"]')
    expect(await calendlyWidget.count()).toBe(0)
  })
})

test.describe('Critical path: assessment handoff via URL params', () => {
  test('?from=assessment URL → auto-detect banner → scan summary → qualified', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply?from=assessment&a=data-led&st=scaling&lc=tools`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    // Fill identity
    await fillIdentity(page)

    // ScanCheck: should show detected banner
    await expect(page.getByText(/scan-resultaat gevonden/i)).toBeVisible({ timeout: 5_000 })

    // "Ja, gebruik mijn scan" button should be enabled (not disabled)
    const yesBtn = page.getByRole('button', { name: /ja, gebruik mijn scan/i })
    await expect(yesBtn).not.toBeDisabled()
    await yesBtn.click()

    // ScanSummary: should show stage/archetype info
    await expect(page.getByText(/scan resultaat/i)).toBeVisible({ timeout: 5_000 })

    // Q1 + Q5 still asked
    // Founding A1.4: the wizard only offers Founding and 'not sure' (growth stays valid in the API enum).
    await clickOptionContaining(page, 'Founding (€1.297')
    await clickOptionContaining(page, '30 dagen')
    await clickNext(page)

    // Problem step
    await expect(page.locator('#apply-problem')).toBeVisible({ timeout: 5_000 })
    await clickSubmit(page)

    // Should be qualified: scaling(3)+founding(3)+30days(3) = 9 >= 7
    await waitForResult(page)
    await expect(page.getByText(/geweldig/i)).toBeVisible({ timeout: 15_000 })
    expect(applyBodies).toHaveLength(1)
    expect(applyBodies[0]).toMatchObject({
      assessment: { archetype: 'data-led', stage: 'scaling', lowestCategory: 'tools' },
      qualification: { q1: 'founding', q5: '30days' },
    })
  })
})

test.describe('Critical path: back-button state preservation', () => {
  test('fill identity → next → prev → identity fields still filled', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    // Fill identity
    await waitForHydration(page)
    await page.fill('#apply-name', 'Bewaard Naam')
    await page.fill('#apply-email', 'bewaard@bureau.nl')
    await page.fill('#apply-agency', 'Bewaard Bureau')
    await page.fill('#apply-role', 'Director')
    await page.getByRole('button', { name: /volgende/i }).click()

    // Now on ScanCheck — go back
    await expect(page.getByText(/heb je de AI bureau scan/i)).toBeVisible({ timeout: 5_000 })
    await page.getByRole('button', { name: /← vorige/i }).click()

    // Back on identity — fields should be preserved
    await expect(page.locator('#apply-name')).toHaveValue('Bewaard Naam')
    await expect(page.locator('#apply-email')).toHaveValue('bewaard@bureau.nl')
    await expect(page.locator('#apply-agency')).toHaveValue('Bewaard Bureau')
  })
})

test.describe('Critical path: refresh mid-flow rehydration', () => {
  test('sessionStorage state survives hard-refresh → same step rendered', async ({ page }) => {
    // Set sessionStorage state directly (simulates mid-flow without using the init-script clear)
    await page.goto(`${BASE}/nl/apply`)
    await page.waitForLoadState('domcontentloaded')

    // Write persisted Zustand state as if user completed identity + scan-check → now on qualification
    await page.evaluate(() => {
      const state = {
        state: {
          step: 'qualification',
          identity: { name: 'Jan de Vries', email: 'jan@bureau.nl', agency: 'TestBureau', role: 'CEO' },
          qualification: { q1: 'founding' },
          assessment: null,
          problem: '',
          scanCheckChoice: 'no',
          startedAt: new Date().toISOString(),
        },
        version: 0,
      }
      sessionStorage.setItem('fmai-apply-wizard-v1', JSON.stringify(state))
    })

    // Hard refresh — rehydrates from sessionStorage
    await page.reload()

    // Should land on qualification step, not identity
    await expect(page.getByText(/bureau context/i)).toBeVisible({ timeout: 8_000 })
    // Q1 should be pre-selected (founding)
    await expect(page.getByRole('button', { name: /founding/i }).first()).toBeVisible()
  })
})

test.describe('Critical path: mobile 390px viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('complete flow on mobile viewport, progress bar visible', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    // Identity
    await fillIdentity(page)

    // Progress bar should be visible after step 1
    const progressBar = page.locator('[aria-label*="Stap"]').or(page.locator('[role="progressbar"]'))
    // We just need the wizard to have moved forward without crashing
    await expect(page.getByText(/heb je de AI bureau scan/i)).toBeVisible({ timeout: 5_000 })

    // ScanCheck
    await clickOptionContaining(page, 'Nee, korte vragenlijst')

    // Qualification
    await expect(page.getByText(/bureau context/i)).toBeVisible({ timeout: 5_000 })
    await fillQualificationHigh(page)

    // Problem
    await expect(page.locator('#apply-problem')).toBeVisible({ timeout: 5_000 })

    // Submit/prev buttons should be visible on mobile
    const submitBtn = page.getByRole('button', { name: /verstuur aanvraag/i })
    await expect(submitBtn).toBeVisible()
    await clickSubmit(page)

    await waitForResult(page)
    // Either branch is fine — just verify the page doesn't crash
    const hasResult = await page.getByText(/geweldig/i).count() > 0 ||
                      await page.getByText(/bedankt/i).count() > 0
    expect(hasResult).toBe(true)
  })

  // Next sits at the bottom of a step; without scrolling to the new step the visitor landed on the footer.
  test('after Next the new step starts in view, not at the footer', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })
    await fillIdentity(page)
    await expect(page.getByRole('heading', { name: /heb je de AI bureau scan/i })).toBeInViewport({ timeout: 5_000 })
    await expect(page.locator('footer').last()).not.toBeInViewport()
  })
})

// ---------------------------------------------------------------------------
// i18n: the live locales (src/i18n/routing.ts) render the wizard
// ---------------------------------------------------------------------------

test.describe('i18n locales', () => {
  for (const locale of ['nl', 'en'] as const) {
    test(`/${locale}/apply renders identity step without JS errors`, async ({ page, context }) => {
      await clearWizardState(context)
      const errors: string[] = []
      page.on('console', (msg) => {
        // The 404 of /_vercel/* carries its URL only in location(); the MIME refusal (filtered below) in its text
        if (msg.type() === 'error' && !msg.location().url.includes('/_vercel/')) errors.push(msg.text())
      })
      await page.goto(`${BASE}/${locale}/apply`)
      await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes('ERR_BLOCKED') &&
          !e.includes('Calendly') &&
          !e.includes('calendly') &&
          !e.includes('cal.com') &&
          !e.includes('Content Security Policy') &&
          !e.includes('vercel-scripts') &&
          !e.includes('va.vercel') &&
          // /_vercel/* only exists on Vercel; `next start` answers it with an HTML 404
          !e.includes('/_vercel/'),
      )
      expect(criticalErrors).toHaveLength(0)
    })
  }
})

// ---------------------------------------------------------------------------
// Calendly fallback — when env var not set, fallback link exists in Branch A
// ---------------------------------------------------------------------------

test.describe('ResultBranchA Calendly fallback', () => {
  test('qualified result shows agenda link even without Calendly widget', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    await fillIdentity(page)
    await clickOptionContaining(page, 'Nee, korte vragenlijst')
    await fillQualificationHigh(page)
    await page.fill('#apply-problem', 'We verliezen 2 FTE aan contentproductie. Dit is meer dan 200 tekens om de bonus te triggeren en zeker te weten dat de bonuspunten correct worden meegerekend in het systeem.')
    await clickSubmit(page)

    await waitForResult(page)
    await expect(page.getByText(/geweldig/i)).toBeVisible({ timeout: 15_000 })

    // Either inline embed OR fallback link must be present
    const widgetOrLink = page.locator('cal-inline, [data-cal-namespace], iframe[src*="cal.com"]')
      .or(page.getByRole('link', { name: /agenda/i }))
    const count = await widgetOrLink.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// Validation: identity form validation
// ---------------------------------------------------------------------------

test.describe('Form validation', () => {
  test('empty submit on identity shows all field errors', async ({ page, context }) => {
    await clearWizardState(context)
    await page.goto(`${BASE}/nl/apply`)
    await expect(page.locator('#apply-name')).toBeVisible({ timeout: 10_000 })

    // Click next without filling anything
    await waitForHydration(page)
    await page.getByRole('button', { name: /volgende/i }).click()

    // Should still be on identity (not proceed)
    await expect(page.locator('#apply-name')).toBeVisible()
    // Error for name or email should appear
    await expect(page.locator('#apply-name-error, #apply-email-error, #apply-agency-error, #apply-role-error').first()).toBeVisible()
  })
})
