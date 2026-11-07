import { test, expect } from '@playwright/test'

/**
 * Daley 2026-11-08: "op mobile in de hamburger menu is de cta knop niet meteen in beeld". The moment the menu opens,
 * its button must be visible and clickable on the smallest phones, without scrolling the menu.
 * Red before: on 375x667 and 390x664 the button sat at 727-775px, under the fold of the menu.
 */
for (const vp of [
  { width: 375, height: 667 },
  { width: 390, height: 664 },
]) {
  test(`menu button in view at ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp)
    // consent given: on a first visit the cookie banner sits above everything by design, the menu included
    await page.addInitScript(() => localStorage.setItem('cookieConsent', 'true'))
    await page.goto('/nl/skills/strategy')
    await page.locator('button[aria-controls="mobile-menu"]').click()
    const menu = page.locator('#mobile-menu')
    const cta = menu.locator('a[href$="/apply"]')
    const scroller = menu.locator('.overflow-y-auto')

    // setup: the links overflow the panel at this size, else a pinned button proves nothing
    await expect.poll(() => scroller.evaluate((e) => e.scrollHeight > e.clientHeight + 20)).toBe(true)

    // the panel animates open for 300 ms (clipped until then): poll until the button's centre is the button itself
    await expect
      .poll(() =>
        cta.evaluate((el) => {
          const r = el.getBoundingClientRect()
          const hit = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2)
          return !!hit && el.contains(hit)
        }),
      )
      .toBe(true)
    const box = (await cta.boundingBox())!
    expect(box.y + box.height).toBeLessThanOrEqual(vp.height)

    // the last link is still reachable: scroll the list, it ends above the pinned row
    const last = menu.locator('.overflow-y-auto a').last()
    await scroller.evaluate((e) => e.scrollTo(0, e.scrollHeight))
    const lb = (await last.boundingBox())!
    expect(lb.y + lb.height).toBeLessThanOrEqual(box.y)
  })
}
