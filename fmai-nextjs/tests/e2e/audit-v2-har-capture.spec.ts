/**
 * Audit v2 HAR capture suite (Performance plan 16-09 + SEO plan 16-06).
 * 31 routes x 3 locales = 93 HAR files at 1440x900.
 * HAR contains every network request/response (headers, timings, payload sizes)
 * for waterfall analysis. Per-route failures SKIP-log.
 * Output: test-results/audit-v2/har/<route>-<locale>.har
 */
import { test, chromium } from '@playwright/test'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import {
  ROUTES,
  LOCALES,
  VIEWPORT_AUDIT,
  BASE_URL,
  safeRouteKey,
  localizedUrl,
} from './_audit-v2-config'

const OUT = join(__dirname, '../../test-results/audit-v2/har')

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    test(`har ${locale}${route}`, async () => {
      if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
      const harPath = join(OUT, `${safeRouteKey(route)}-${locale}.har`)
      const browser = await chromium.launch()
      const context = await browser.newContext({
        viewport: { width: VIEWPORT_AUDIT.width, height: VIEWPORT_AUDIT.height },
        recordHar: { path: harPath, mode: 'full' },
      })
      const page = await context.newPage()
      const url = localizedUrl(BASE_URL, locale, route)
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        await page.waitForTimeout(500)
      } catch (e) {
        console.error(`SKIP har ${url}: ${(e as Error).message}`)
      } finally {
        await context.close()
        await browser.close()
      }
    })
  }
}
