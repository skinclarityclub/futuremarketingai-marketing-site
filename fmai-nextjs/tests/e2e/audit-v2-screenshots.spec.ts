/**
 * Audit v2 Chromium screenshot capture suite.
 * 31 routes x 3 locales x 5 viewports = 465 screenshots.
 * Per-route timeouts are SKIP-logged via the catch block (AUTONOMOUS-PROTOCOL Rule 2).
 * Output: test-results/audit-v2/screenshots/<route>/<locale>-<viewport>.png
 */
import { test } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import {
  ROUTES,
  LOCALES,
  VIEWPORTS_FULL,
  BASE_URL,
  safeRouteKey,
  localizedUrl,
} from './_audit-v2-config'

const OUT = join(__dirname, '../../test-results/audit-v2/screenshots')

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS_FULL) {
      test(`${locale}${route} ${vp.name}`, async ({ page }) => {
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
          console.error(`SKIP ${url}: ${(e as Error).message}`)
        }
      })
    }
  }
}
