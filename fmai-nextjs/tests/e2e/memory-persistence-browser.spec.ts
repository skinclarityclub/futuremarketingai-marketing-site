import { test, expect, type Page } from '@playwright/test'

// Browser regression guards for the cross-session memory invariants. No API calls,
// so these run in the normal suite (not gated behind RUN_CLYDE_LIVE). They pin the
// subtle behaviors that pure specs cannot reach: that opening the chat does NOT
// clobber a hydrated profile, and that "Wis geheugen" leaves no trace.
const SEEDED = { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6, teamSize: 3 }
const BADGE = 'button[aria-label^="Bekijk wat Clyde onthoudt"]'

async function seedConsentAndMemory(page: Page) {
  await page.addInitScript((seeded) => {
    try {
      localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
      localStorage.setItem('clyde:memory', JSON.stringify({ v: 1, profile: seeded }))
    } catch {
      /* ignore */
    }
  }, SEEDED)
}

async function openChat(page: Page) {
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
}

test.describe('Clyde memory v2 — persistence (browser, no API)', () => {
  test('opening the chat does not wipe a hydrated profile', async ({ page }) => {
    await seedConsentAndMemory(page)
    await page.goto('/nl')
    await openChat(page)
    // Let hydration + the message-accumulator effect both settle.
    await page.waitForTimeout(1500)
    const stored = await page.evaluate(() => localStorage.getItem('clyde:memory'))
    expect(stored).toContain('Duinrust')
    await expect(page.locator(BADGE)).toBeVisible()
  })

  test('Wis geheugen removes the localStorage key and the badge', async ({ page }) => {
    await seedConsentAndMemory(page)
    await page.goto('/nl')
    await openChat(page)
    const badge = page.locator(BADGE)
    await badge.click()
    const wipe = page
      .locator('[data-chatwidget-panel]')
      .getByRole('button', { name: 'Wis geheugen' })
    await wipe.click()
    // resetMemory() + the persist-on-change effect must converge on a removed key.
    await page.waitForTimeout(700)
    const stored = await page.evaluate(() => localStorage.getItem('clyde:memory'))
    expect(stored).toBeNull()
    await expect(badge).toHaveCount(0)
  })
})
