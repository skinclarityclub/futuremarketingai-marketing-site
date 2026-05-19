/**
 * Audit v2 Lighthouse capture suite (Performance plan 16-09 + SEO plan 16-06).
 * Top 10 routes x 3 locales x 2 form-factors = 60 reports.
 *
 * Uses Lighthouse Node API + chrome-launcher directly instead of playwright-lighthouse.
 * Reason: playwright-lighthouse's CDP subprocess had ERR_ABORTED on Windows when
 * Lighthouse re-navigated via its own CDP session. Launching Chrome directly with
 * chrome-launcher bypasses Playwright's subprocess sandboxing and resolves this.
 *
 * Targets the production URL (https://future-marketing.ai) by default.
 * Override with AUDIT_LIGHTHOUSE_BASE_URL env var for localhost audits.
 * Override Chromium path with PW_CHROMIUM_PATH env var.
 *
 * Runs serially (one test at a time) to avoid Chrome port collisions.
 * 60 audits take roughly 20-30 min on a local machine.
 *
 * Output: test-results/audit-v2/lighthouse/<route>-<locale>-<formFactor>.json
 */
import { test } from '@playwright/test'
import lighthouse from 'lighthouse'
import { launch as chromeLaunch } from 'chrome-launcher'
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

// Use Playwright's Chromium binary so no system Chrome install is required.
// The path is stable within a given ms-playwright version; update when upgrading Playwright.
const CHROMIUM_PATH =
  process.env.PW_CHROMIUM_PATH ??
  'C:\\Users\\daley\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe'

type FormFactor = 'mobile' | 'desktop'
const FORM_FACTORS: FormFactor[] = ['mobile', 'desktop']

// Serial mode: each test launches + kills Chrome, so concurrent runs would collide.
test.describe.configure({ mode: 'serial' })

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
      test(`lh ${formFactor} ${locale}${route}`, async () => {
        const url = localizedUrl(LH_BASE_URL, locale, route)
        const lhConfig = formFactor === 'desktop' ? desktopConfig : mobileConfig

        let chrome: Awaited<ReturnType<typeof chromeLaunch>> | null = null
        try {
          chrome = await chromeLaunch({
            chromePath: CHROMIUM_PATH,
            chromeFlags: ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check'],
          })

          const result = await lighthouse(
            url,
            { port: chrome.port, output: 'json', logLevel: 'error' },
            lhConfig,
          )

          if (result?.lhr) {
            if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
            const file = `${safeRouteKey(route)}-${locale}-${formFactor}.json`
            writeFileSync(join(OUT, file), JSON.stringify(result.lhr, null, 2), 'utf8')
          }
        } catch (e) {
          console.error(`SKIP lighthouse ${formFactor} ${url}: ${(e as Error).message}`)
        } finally {
          chrome?.kill()
        }
      })
    }
  }
}
