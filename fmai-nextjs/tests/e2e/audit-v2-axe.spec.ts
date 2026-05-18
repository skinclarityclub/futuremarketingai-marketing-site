/**
 * Audit v2 axe-core a11y capture suite (Accessibility plan 16-08).
 * 31 routes x 3 locales = 93 axe JSON reports at 1440x900.
 * Uses WCAG 2.0 A + AA + WCAG 2.2 AA tag set to match EAA legal scope.
 * Per-route failures SKIP-log; partial reports better than no reports.
 * Output: test-results/audit-v2/axe/<route>-<locale>.json
 */
import { test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import {
  ROUTES,
  LOCALES,
  VIEWPORT_AUDIT,
  BASE_URL,
  safeRouteKey,
  localizedUrl,
} from './_audit-v2-config'

const OUT = join(__dirname, '../../test-results/audit-v2/axe')

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    test(`a11y ${locale}${route}`, async ({ page }) => {
      await page.setViewportSize({ width: VIEWPORT_AUDIT.width, height: VIEWPORT_AUDIT.height })
      const url = localizedUrl(BASE_URL, locale, route)
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
          .analyze()
        if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
        const file = `${safeRouteKey(route)}-${locale}.json`
        writeFileSync(join(OUT, file), JSON.stringify(results, null, 2), 'utf8')
      } catch (e) {
        console.error(`SKIP axe ${url}: ${(e as Error).message}`)
      }
    })
  }
}
