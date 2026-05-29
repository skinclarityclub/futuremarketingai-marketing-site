import { test, expect, type Page } from '@playwright/test'

/**
 * Clyde SOTA Audit — regression suite.
 *
 * Chrome tests run WITHOUT an API key (chat chrome only). Live conversation
 * tests talk to Clyde for real via /api/chatbot and require an Anthropic key in
 * the running server's env; they are gated on RUN_CLYDE_LIVE so CI without a key
 * skips cleanly.
 *
 *   1. vercel env pull .env.local --environment=production   (ANTHROPIC_API_KEY)
 *   2. npx next dev -p 3100
 *   3. $env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"
 *   4. $env:RUN_CLYDE_LIVE = "1"
 *   5. npx playwright test tests/e2e/clyde-audit.spec.ts --project=chromium --workers=1
 *
 * Regressions covered (see docs/plans/2026-05-29-clyde-sota-audit-findings.md):
 *   F1 desktop sidebar title is dynamic (not "Details")
 *   F3 off-context tools (skincare product / support ticket) never fire in normal chat
 *   F4 qualify_lead panel title is "Jouw match" (was "ROI berekening")
 *   no raw "CHIPS:" line leaks into the bubble
 */

const LIVE = process.env.RUN_CLYDE_LIVE === '1'

// ── Helpers ────────────────────────────────────────────────────────────────

/** Open Clyde. Pre-seeds cookie consent because the consent banner
 *  (fixed bottom-0, z-9999) overlays the FAB (z-40, lg:bottom-24) and would
 *  otherwise intercept the open click. */
async function openClyde(page: Page, locale = 'nl') {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
    } catch {
      /* storage disabled */
    }
  })
  await page.goto(`/${locale}`)
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await expect(trigger).toBeVisible({ timeout: 20000 })
  await trigger.click()
  const panel = page.locator('[data-chatwidget-panel]')
  await expect(panel).toBeVisible({ timeout: 15000 })
  await page.waitForTimeout(900) // auto-greet settle
  return panel
}

/** Send a message and wait until the response is fully settled (the regenerate
 *  affordance only renders on the last assistant message once not streaming). */
async function sendToClyde(page: Page, text: string) {
  const textarea = page.locator('[data-chatwidget-panel] textarea')
  await textarea.fill(text)
  await textarea.press('Enter')
  await page.waitForTimeout(500)
  await page
    .locator('button[aria-label="Opnieuw genereren"]')
    .first()
    .waitFor({ state: 'visible', timeout: 35000 })
    .catch(() => {})
  await page.waitForTimeout(900)
}

/** Desktop sidebar title (next to the back/close button in the panel header). */
async function sidebarTitle(page: Page): Promise<string | null> {
  const back = page.locator('button[aria-label="Close details panel"]').first()
  if (!(await back.isVisible().catch(() => false))) return null
  return (await back.locator('..').locator('span').first().textContent())?.trim() ?? null
}

function hasSidebar(page: Page) {
  return page.locator('button[aria-label="Close details panel"]').first().isVisible()
}

// ── Chrome tests (no API key) ────────────────────────────────────────────────

test.describe('Clyde audit — chrome (no API key)', () => {
  test('panel opens with a message input and is a dialog', async ({ page }) => {
    const panel = await openClyde(page)
    await expect(panel.locator('textarea')).toBeVisible()
    await expect(panel).toHaveAttribute('aria-modal', 'true')
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

  test('T1: skills → ServiceCard, dynamic title "Onze vaardigheden" (F1)', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Welke vaardigheden hebben jullie?')
    await expect(page.locator('button[aria-label="Close details panel"]').first()).toBeVisible()
    expect(await sidebarTitle(page)).toBe('Onze vaardigheden')
    await expect(page.locator('[data-chatwidget-panel]')).not.toContainText('CHIPS:')
  })

  test('new-chat resets the conversation after a message', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Welke vaardigheden hebben jullie?')
    const newChat = page.locator('button[aria-label="Nieuwe chat starten"]')
    await expect(newChat).toBeVisible()
    await newChat.click()
    await expect(page.locator('button[aria-label="Close details panel"]')).toHaveCount(0)
    await expect(page.locator('[data-chatwidget-panel] textarea')).toBeVisible()
  })

  test('T2: pricing → title "Tarieven"', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Wat kost het voor 4 merken?')
    expect(await sidebarTitle(page)).toBe('Tarieven')
  })

  test('T9: qualify_lead → title "Jouw match" (F4 regression)', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Kwalificeer mij: 50 medewerkers, 5000 euro budget, ik ben de beslisser')
    expect(await sidebarTitle(page)).toBe('Jouw match')
  })

  test('T6: honest-fit → no sidebar, chips, no raw CHIPS line', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Voor wie werkt dit niet?')
    expect(await hasSidebar(page)).toBe(false)
    const txt = await page.locator('[data-chatwidget-panel]').innerText()
    expect(txt).not.toContain('CHIPS:')
    expect(txt.toLowerCase()).toContain('vraag verder') // follow-up chips rendered
  })

  test('GUARD: skincare product query does NOT open a ProductCard (F3)', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Ik zoek een goed product voor mijn droge huid')
    expect(await hasSidebar(page)).toBe(false)
  })

  test('GUARD: password reset does NOT create a support ticket card (F3)', async ({ page }) => {
    await openClyde(page)
    await sendToClyde(page, 'Hoe reset ik mijn wachtwoord?')
    expect(await hasSidebar(page)).toBe(false)
    await expect(page.locator('[data-chatwidget-panel]')).not.toContainText('Ticket created')
  })
})
