/**
 * Audit v2 Firefox screenshot capture suite (Cross-browser plan 16-10).
 * 31 routes x 3 locales x 2 viewports = 186 screenshots.
 * Per-route timeouts SKIP-log per AUTONOMOUS-PROTOCOL Rule 2.
 * Output: test-results/audit-v2/screenshots-firefox/<route>/<locale>-<viewport>.png
 */
import { test } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import {
  ROUTES,
  LOCALES,
  VIEWPORTS_CROSS,
  BASE_URL,
  safeRouteKey,
  localizedUrl,
} from './_audit-v2-config'

test.use({ browserName: 'firefox' })

const OUT = join(__dirname, '../../test-results/audit-v2/screenshots-firefox')

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS_CROSS) {
      test(`firefox ${locale}${route} ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        const url = localizedUrl(BASE_URL, locale, route)
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
          await page.waitForTimeout(500)
          const dir = join(OUT, safeRouteKey(route))
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
          await page.screenshot({
            path: join(dir, `${locale}-${vp.name}.png`),
            fullPage: true,
          })
        } catch (e) {
          console.error(`SKIP firefox ${url}: ${(e as Error).message}`)
        }
      })
    }
  }
}
