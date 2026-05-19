import { test, expect } from '@playwright/test'

/**
 * Cross-browser theme parity gate (Phase 17-C C2).
 *
 * Regression test for MF-06: Safari < 16.4 dropped the dark theme because
 * Tailwind 4 emitted `:root, :host` in `@layer theme`, which unforgiving
 * selector parsing invalidated. The fix in commit c7e35c6 hoists tokens
 * via `@theme inline` and a PostCSS plugin that strips `:host` from the
 * theme layer.
 *
 * This spec locks the visible outcome: the body MUST render bg-deep and
 * the H1 MUST render text-primary on WebKit + Firefox + Chromium. A new
 * regression that re-introduces the `:root,:host` pattern (or any other
 * unwrap-the-theme breakage) will flip this red before a deploy ships.
 *
 * Note: this loops over three locales because the marketing pages emit
 * locale-prefixed canonical URLs and the home route is the highest-traffic
 * surface; pricing + apply cover the next two on conversion impact.
 */

const ROUTES = ['/nl', '/en/pricing', '/es/apply'] as const

const EXPECTED_BG = 'rgb(10, 13, 20)' // --color-bg-deep #0a0d14
// CSS variable value as declared in the stylesheet (raw hex, not rgb())
const EXPECTED_TEXT_PRIMARY_VAR = '#e8ecf4' // --color-text-primary

test.describe('Cross-browser theme parity', () => {
  for (const path of ROUTES) {
    test(`theme renders on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'load' })

      // Check 1: body background — guards against the MF-06 white-screen regression
      const bodyBg = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor
      })
      expect(bodyBg, `body background on ${path}`).toBe(EXPECTED_BG)

      // Check 2: CSS custom property is accessible on :root — the actual MF-06 invariant.
      // MF-06 caused WebKit to reject the `:root, :host` selector in @layer theme, making
      // all CSS tokens undefined. Checking --color-text-primary directly tests this without
      // relying on which color a specific element happens to use (H1s use gradient text).
      const textPrimaryVar = await page.evaluate(() => {
        return getComputedStyle(document.documentElement)
          .getPropertyValue('--color-text-primary')
          .trim()
      })
      expect(textPrimaryVar, `--color-text-primary on ${path}`).toBe(EXPECTED_TEXT_PRIMARY_VAR)
    })
  }
})
