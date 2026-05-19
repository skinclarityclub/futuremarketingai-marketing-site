/**
 * Audit v2 Lighthouse capture suite (Performance plan 16-09 + SEO plan 16-06).
 * Top 10 routes x 3 locales x 2 form-factors = 60 reports.
 * Targets the production URL (https://future-marketing.ai) by default because
 * a local dev-server produces skewed perf scores. Override with
 * AUDIT_LIGHTHOUSE_BASE_URL env var when intentionally auditing localhost.
 *
 * Implementation notes:
 *   - playwright-lighthouse opens its OWN page inside a Lighthouse-controlled
 *     Chromium that is spawned by the test via remote-debugging port. The
 *     `page` fixture from @playwright/test is only used to seed navigation
 *     and to satisfy the lib's signature.
 *   - We deliberately do NOT pass thresholds; this plan captures BASELINE
 *     scores. Wave 2 team 16-09 (Performance) interprets the JSON and sets
 *     thresholds in a follow-up plan.
 *   - Per-route failures are SKIP-logged via the catch block
 *     (AUTONOMOUS-PROTOCOL Rule 2). Partial reports beat zero reports.
 *   - Worker-scoped port + browser fixture avoids port collisions when
 *     Playwright spawns multiple workers in parallel.
 *
 * Output: test-results/audit-v2/lighthouse/<route>-<locale>-<formFactor>.json
 */
import { chromium } from 'playwright'
import type { Browser } from 'playwright'
import { test as base } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  LOCALES,
  LIGHTHOUSE_ROUTES,
  PRODUCTION_URL,
  safeRouteKey,
  localizedUrl,
} from './_audit-v2-config'

const LH_BASE_URL = process.env.AUDIT_LIGHTHOUSE_BASE_URL || PRODUCTION_URL
const OUT = join(__dirname, '../../test-results/audit-v2/lighthouse')

type FormFactor = 'mobile' | 'desktop'
const FORM_FACTORS: FormFactor[] = ['mobile', 'desktop']

// Per-worker remote-debugging port + chromium browser. Lighthouse needs
// CDP access, so we spawn chromium with --remote-debugging-port=<port>.
// Deterministic port-per-worker avoids the get-port dev-dep.
const lighthouseTest = base.extend<
  {},
  { lhPort: number; lhBrowser: Browser }
>({
  lhPort: [
    async ({}, use, workerInfo) => {
      await use(9222 + workerInfo.workerIndex)
    },
    { scope: 'worker' },
  ],
  lhBrowser: [
    async ({ lhPort }, use) => {
      const browser = await chromium.launch({
        args: [`--remote-debugging-port=${lhPort}`],
      })
      await use(browser)
      await browser.close()
    },
    { scope: 'worker' },
  ],
})

// Lighthouse desktop config: emulates a fast desktop with no throttling.
const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop' as const,
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
  },
}

// Lighthouse mobile config: Lighthouse default mobile emulation (Moto G4).
const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile' as const,
    screenEmulation: {
      mobile: true,
      width: 360,
      height: 640,
      deviceScaleFactor: 2.625,
      disabled: false,
    },
  },
}

for (const route of LIGHTHOUSE_ROUTES) {
  for (const locale of LOCALES) {
    for (const formFactor of FORM_FACTORS) {
      lighthouseTest(
        `lh ${formFactor} ${locale}${route}`,
        async ({ lhBrowser, lhPort }) => {
          const url = localizedUrl(LH_BASE_URL, locale, route)
          const ctx = await lhBrowser.newContext()
          const page = await ctx.newPage()
          try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
            const lhConfig = formFactor === 'desktop' ? desktopConfig : mobileConfig
            const result = await playAudit({
              page,
              port: lhPort,
              config: lhConfig,
              ignoreError: true,
              disableLogs: true,
            })
            if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
            const file = `${safeRouteKey(route)}-${locale}-${formFactor}.json`
            writeFileSync(
              join(OUT, file),
              JSON.stringify(result.lhr, null, 2),
              'utf8'
            )
          } catch (e) {
            console.error(
              `SKIP lighthouse ${formFactor} ${url}: ${(e as Error).message}`
            )
          } finally {
            await ctx.close()
          }
        }
      )
    }
  }
}
