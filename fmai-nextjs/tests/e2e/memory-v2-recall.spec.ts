import { test, expect, type Page } from '@playwright/test'

// Gated live test: seeds a persisted profile, then proves a RETURNING visitor gets
// the personalized welcome-back (client-side) and Clyde recalls a seeded fact from
// the system-prompt injection (one live API turn). Set RUN_CLYDE_LIVE=1 to run.
const LIVE = process.env.RUN_CLYDE_LIVE === '1'

async function openClydeWithSeededMemory(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
      localStorage.setItem(
        'clyde:memory',
        JSON.stringify({
          v: 1,
          profile: { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6, teamSize: 3 },
        })
      )
    } catch {
      /* ignore */
    }
  })
  await page.goto('/nl')
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(900)
}

test.describe('Clyde memory v2 — cross-session', () => {
  test.skip(!LIVE, 'set RUN_CLYDE_LIVE=1 to run against a live Clyde')

  test('returning visitor: welcome-back + Clyde recalls a seeded fact', async ({ page }) => {
    await openClydeWithSeededMemory(page)
    const panel = page.locator('[data-chatwidget-panel]')
    // Personalized welcome-back (client-side, no API)
    await expect(panel).toContainText('Welkom terug')
    await expect(panel).toContainText('Duinrust')
    // One live turn proves system-prompt injection (no facts re-stated by the user)
    const ta = panel.locator('textarea')
    await ta.fill('Wat raad je ons aan als eerste stap?')
    await ta.press('Enter')
    await page
      .locator('button[aria-label="Stop generatie"]')
      .waitFor({ state: 'hidden', timeout: 60000 })
      .catch(() => {})
    await page.waitForTimeout(1000)
    await expect(panel).toContainText(/horeca|6/)
  })
})
