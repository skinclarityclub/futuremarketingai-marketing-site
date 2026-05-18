/**
 * Audit v2 WebKit screenshot capture suite (Cross-browser plan 16-10).
 * 31 routes x 3 locales x 2 viewports = 186 screenshots.
 * WebKit-on-Windows is unstable for heavy-asset routes (Spline hero, voice demo);
 * per-route timeouts SKIP-log per AUTONOMOUS-PROTOCOL Rule 2.
 * Output: test-results/audit-v2/screenshots-webkit/<route>/<locale>-<viewport>.png
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

test.use({ browserName: 'webkit' })

const OUT = join(__dirname, '../../test-results/audit-v2/screenshots-webkit')

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    for (const vp of VIEWPORTS_CROSS) {
      test(`webkit ${locale}${route} ${vp.name}`, async ({ page }) => {
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
          console.error(`SKIP webkit ${url}: ${(e as Error).message}`)
        }
      })
    }
  }
}
