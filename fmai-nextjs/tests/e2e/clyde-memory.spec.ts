import { test, expect, type Page } from '@playwright/test'

/**
 * LIVE test (gated on RUN_CLYDE_LIVE). Proves the memory USP end-to-end: Clyde
 * captures a revealed fact and recalls it on request. Hits the shared production
 * rate-limit — keep to these two calls, run --workers=1.
 *
 *   $env:PLAYWRIGHT_BASE_URL="http://localhost:3100"; $env:RUN_CLYDE_LIVE="1"
 *   npx playwright test tests/e2e/clyde-memory.spec.ts --project=chromium --workers=1
 */
const LIVE = process.env.RUN_CLYDE_LIVE === '1'

async function openClyde(page: Page) {
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
  await page.goto('/nl')
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(900)
}

async function send(page: Page, text: string) {
  const ta = page.locator('[data-chatwidget-panel] textarea')
  await ta.fill(text)
  await ta.press('Enter')
  await page
    .locator('button[aria-label="Opnieuw genereren"]')
    .last()
    .waitFor({ state: 'visible', timeout: 40000 })
    .catch(() => {})
  await page.waitForTimeout(800)
}

test.describe('Clyde live memory', () => {
  test.skip(!LIVE, 'set RUN_CLYDE_LIVE=1 to run against a live Clyde')

  test('captures a revealed fact and recalls it', async ({ page }) => {
    await openClyde(page)
    await send(page, 'We zijn een skincare-bureau met 8 merken, we verzuipen in content.')
    await send(page, 'Hoeveel merken noemde ik en in welke niche zit ik?')
    const panel = page.locator('[data-chatwidget-panel]')
    await expect(panel).toContainText('8')
    await expect(panel).toContainText(/skincare/i)
  })
})
