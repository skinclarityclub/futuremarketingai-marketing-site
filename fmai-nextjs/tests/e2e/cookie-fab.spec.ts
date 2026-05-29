import { test, expect, type Page } from '@playwright/test'

/**
 * Regression: a first-time visitor (no stored cookie consent) must be able to
 * open Clyde. The consent banner is `fixed bottom-0 z-[9999]`; the FAB lifts
 * clear of it and sits above its z-index while no consent is recorded. A prior
 * bug left the desktop FAB *inside* the banner (lg:bottom-24 = 96px vs a 154px
 * banner), so the banner intercepted the open click. See ClydePresence.
 *
 * These tests intentionally do NOT pre-seed cookieConsent.
 */

// document.elementFromPoint at the FAB centre must resolve to the FAB itself
// (or a descendant), proving the banner does not intercept the click.
async function fabReceivesClick(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const fab = document.querySelector('button[aria-label^="Open chat"]') as HTMLElement | null
    if (!fab) return false
    const r = fab.getBoundingClientRect()
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) as HTMLElement | null
    return !!el && (el === fab || fab.contains(el))
  })
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

for (const vp of VIEWPORTS) {
  test(`first-time visitor can open Clyde on ${vp.name} (cookie banner not blocking FAB)`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/nl')

    // Consent banner should be showing (no consent stored).
    const banner = page.locator('[role="dialog"][aria-modal="false"]')
    await expect(banner).toBeVisible({ timeout: 10000 })

    const fab = page.locator('button[aria-label^="Open chat"]').first()
    await expect(fab).toBeVisible({ timeout: 20000 })
    await page.waitForTimeout(1200) // FAB lift effect settles

    expect(await fabReceivesClick(page)).toBe(true)

    // A real (non-forced) click must open the panel.
    await fab.click()
    await expect(page.locator('[data-chatwidget-panel]')).toBeVisible({ timeout: 5000 })
  })
}
