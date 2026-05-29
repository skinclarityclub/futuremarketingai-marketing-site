import { test, expect, type Page } from '@playwright/test'

/**
 * Clyde SOTA Audit — live conversational E2E.
 *
 * UNLIKE chatbot.spec.ts (which only tests chrome: open/close/a11y and runs
 * WITHOUT an API key), this suite talks to Clyde for real via /api/chatbot and
 * therefore REQUIRES an Anthropic key in the running server's env.
 *
 * Setup (see docs/plans/2026-05-29-clyde-sota-audit-handover.md):
 *   1. vercel env pull .env.local      (or paste ANTHROPIC_API_KEY)
 *   2. npx next dev -p 3100
 *   3. $env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"
 *   4. npx playwright test tests/e2e/clyde-audit.spec.ts --headed --project=chromium
 *
 * API-dependent tests guard on RUN_CLYDE_LIVE so CI without a key skips cleanly.
 * Set $env:RUN_CLYDE_LIVE = "1" to enable the live conversation tests.
 */

const LIVE = process.env.RUN_CLYDE_LIVE === '1'

// ── Helpers ────────────────────────────────────────────────────────────────

async function openClyde(page: Page, locale = 'nl') {
  await page.goto(`/${locale}`)
  // Dismiss cookie banner if present (blocks pointer events).
  const accept = page.getByRole('button', { name: /Alles accepteren|Accept all|Aceptar todo/i })
  if (await accept.isVisible().catch(() => false)) await accept.click()

  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await expect(trigger).toBeVisible({ timeout: 20000 })
  await trigger.click({ force: true })

  const panel = page.locator('[data-chatwidget-panel]')
  await expect(panel).toBeVisible()
  return panel
}

/**
 * Type a message and submit. Waits for a NEW assistant bubble to settle by
 * counting assistant messages before/after. Tune the settle timeout to the
 * model latency (haiku is fast, ~2-6s).
 */
async function sendToClyde(page: Page, text: string) {
  const panel = page.locator('[data-chatwidget-panel]')
  const textarea = panel.locator('textarea')
  await textarea.fill(text)
  await textarea.press('Enter')
  // Wait for the typing indicator to appear then disappear (response complete).
  // Fallback: fixed settle. Replace with a deterministic wait on a response
  // marker if one is added (e.g. data-message-role="assistant" data-complete).
  await page.waitForTimeout(800)
  await page
    .waitForFunction(
      () => !document.querySelector('[data-chatwidget-panel] [data-typing]'),
      { timeout: 30000 }
    )
    .catch(() => {})
  await page.waitForTimeout(2500)
}

/** Desktop sidebar title. NOTE: no test-id yet — recommend adding
 *  data-sidepanel + data-sidepanel-title in SidePanel.tsx for robust selection.
 *  The title span sits next to the back/close buttons in the panel header. */
async function getSidebarTitle(page: Page): Promise<string | null> {
  const header = page.locator('button[aria-label="Close details panel"]').locator('..')
  const span = header.locator('span').first()
  return (await span.textContent())?.trim() ?? null
}

// ── Chrome tests (run without API key) ───────────────────────────────────────

test.describe('Clyde audit — chrome (no API key)', () => {
  test('new-chat button hidden on empty, visible after greet', async ({ page }) => {
    await openClyde(page)
    // Auto-greet adds 1 assistant message after ~400ms → button appears.
    const newChat = page.locator('button[aria-label="Nieuwe chat starten"]')
    await expect(newChat).toBeVisible({ timeout: 5000 })
  })

  test('new-chat button resets conversation', async ({ page }) => {
    await openClyde(page)
    const newChat = page.locator('button[aria-label="Nieuwe chat starten"]')
    await expect(newChat).toBeVisible({ timeout: 5000 })
    await newChat.click()
    // After reset: greet returns, sidebar closed.
    await expect(page.locator('button[aria-label="Close details panel"]')).toHaveCount(0)
  })

  test('escape closes the panel', async ({ page }) => {
    await openClyde(page)
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-chatwidget-panel]')).not.toBeVisible()
  })
})

// ── Live conversation tests (require RUN_CLYDE_LIVE=1 + API key) ──────────────

test.describe('Clyde audit — live conversation', () => {
  test.skip(!LIVE, 'Set RUN_CLYDE_LIVE=1 and provide ANTHROPIC_API_KEY to run')

  // T1 — skills
  test('T1: skills question → ServiceCard + chips', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Welke vaardigheden hebben jullie?')
    // TODO: assert sidebar opened with ServiceCard (12 skills), title "Onze vaardigheden"
    await expect(page.locator('button[aria-label="Close details panel"]')).toBeVisible()
    expect(await getSidebarTitle(page)).toBe('Onze vaardigheden') // BUG-1: currently "Details" on desktop
    await page.screenshot({ path: 'test-results/clyde-T1-skills.png' })
  })

  // T2 — pricing
  test('T2: pricing question → ServiceCard tarieven, correct prices', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Wat kost het voor 4 merken?')
    await expect(page.locator('button[aria-label="Close details panel"]')).toBeVisible()
    // TODO: assert €997 founding + €499 growth workspace pricing visible, NL
    await page.screenshot({ path: 'test-results/clyde-T2-pricing.png' })
  })

  // T3 — ROI
  test('T3: ROI → LeadScoreCard with plausible numbers', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Bereken de ROI voor 3 man, 12 uur per week')
    await expect(page.locator('button[aria-label="Close details panel"]')).toBeVisible()
    // TODO: assert monthly/annual savings, ROI%, payback present and not NaN/€0
    await page.screenshot({ path: 'test-results/clyde-T3-roi.png' })
  })

  // T4 — case study (proof framing)
  test('T4: proof framing → CaseStudyCard with testimonial', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Heb je concreet bewijs dat dit werkt?')
    await expect(page.locator('button[aria-label="Close details panel"]')).toBeVisible()
    // TODO: assert Sindy testimonial + SKC results rendered
    await page.screenshot({ path: 'test-results/clyde-T4-case.png' })
  })

  // T5 — booking
  test('T5: book → BookingCard, no Calendly, → /apply', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Ik wil een gesprek plannen')
    await expect(page.locator('button[aria-label="Close details panel"]')).toBeVisible()
    // TODO: assert 3 trust signals, apply CTA, NO calendly iframe
    await page.screenshot({ path: 'test-results/clyde-T5-booking.png' })
  })

  // T6 — honest fit (no tool, must answer honestly + chips)
  test('T6: "voor wie werkt dit niet" → honest answer + chips', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Voor wie werkt dit niet?')
    // TODO: assert text mentions a real non-fit (freelancer/1 brand/perfectionist)
    // TODO: assert chips visible AND raw "CHIPS:" string NOT present in bubble text
    const bodyText = await page.locator('[data-chatwidget-panel]').innerText()
    expect(bodyText).not.toContain('CHIPS:')
    await page.screenshot({ path: 'test-results/clyde-T6-fit.png' })
  })

  // VRAAG-1 — irrelevant card guard
  test('GUARD: skincare product query should NOT show ProductCard', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Wat kost een serum?')
    // TODO: assert NO skincare ProductCard appears (agency context).
    await page.screenshot({ path: 'test-results/clyde-guard-product.png' })
  })

  // VRAAG-2 — multi-card transition
  test('MULTI: sequential tools swap the sidebar card cleanly', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Welke vaardigheden hebben jullie?')
    await sendToClyde(page, 'En wat kost het?')
    // TODO: assert sidebar now shows pricing card, no leftover skills content
    await page.screenshot({ path: 'test-results/clyde-multi-swap.png' })
  })
})
