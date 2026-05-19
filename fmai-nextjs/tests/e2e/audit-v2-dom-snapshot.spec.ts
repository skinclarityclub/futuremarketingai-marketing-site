/**
 * Audit v2 DOM snapshot capture suite (SEO plan 16-06 + GEO/LLMEO plan 16-07
 * + Content/i18n plan 16-11 + Accessibility plan 16-08).
 * 31 routes x 3 locales = 93 HTML snapshots at 1440x900.
 * Snapshot is the fully-hydrated rendered DOM after React + next-intl land,
 * NOT the initial server response (Wave 2 SEO team also needs server-only HTML;
 * they can pull that via plain HTTP fetch as needed).
 * Output: test-results/audit-v2/dom/<route>-<locale>.html
 */
import { test } from '@playwright/test'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  ROUTES,
  LOCALES,
  VIEWPORT_AUDIT,
  BASE_URL,
  safeRouteKey,
  localizedUrl,
} from './_audit-v2-config'

const OUT = join(__dirname, '../../test-results/audit-v2/dom')

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    test(`dom ${locale}${route}`, async ({ page }) => {
      await page.setViewportSize({ width: VIEWPORT_AUDIT.width, height: VIEWPORT_AUDIT.height })
      const url = localizedUrl(BASE_URL, locale, route)
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        await page.waitForTimeout(500)
        const html = await page.content()
        if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
        const file = `${safeRouteKey(route)}-${locale}.html`
        writeFileSync(join(OUT, file), html, 'utf8')
      } catch (e) {
        console.error(`SKIP dom ${url}: ${(e as Error).message}`)
      }
    })
  }
}
