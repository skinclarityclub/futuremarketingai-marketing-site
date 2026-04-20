/**
 * Screenshot capture pipeline for skill pages.
 *
 * USAGE: node scripts/capture-screenshots.ts
 *
 * DEPENDENCIES:
 *   - fma-app must be running on http://localhost:3001 (or set FMA_APP_URL env)
 *   - fma-app must have seeded demo data (SkinClarity Club org + content)
 *   - Logged-in state via FMA_APP_SESSION_COOKIE env or FMA_APP_EMAIL/PASSWORD
 *
 * OUTPUT:
 *   - public/screenshots/skills/{slug}/{variant}.png
 *
 * POST-PROCESSING:
 *   Screenshots are raw captures. Apply premium framing (shadows, callouts,
 *   device mockup) via the frontend-design skill before wiring into skill pages.
 *
 * NOTE: this script is setup-only. Do NOT run it yet — fma-app seed state must
 * be stabilized first (planned in Phase 3, blocker for Task 3.15).
 */

import { chromium, type Browser, type Page } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs/promises'

interface SkillCapture {
  slug: string
  fmaAppRoutes: Array<{
    route: string
    variant: string
    /** Optional CSS selector to crop around */
    focusSelector?: string
    /** Wait for selector before capturing */
    waitFor?: string
  }>
}

const CAPTURES: SkillCapture[] = [
  {
    slug: 'social-media',
    fmaAppRoutes: [
      { route: '/content-engine/content', variant: 'content-calendar', waitFor: '[data-testid="content-calendar"]' },
      { route: '/content-engine/content?view=queue', variant: 'content-queue' },
    ],
  },
  {
    slug: 'reporting',
    fmaAppRoutes: [
      { route: '/analytics/social', variant: 'analytics-dashboard', waitFor: '[data-testid="analytics-overview"]' },
    ],
  },
  {
    slug: 'research',
    fmaAppRoutes: [
      { route: '/intelligence/overview', variant: 'intelligence-feed', waitFor: '[data-testid="intel-feed"]' },
    ],
  },
  {
    slug: 'blog-factory',
    fmaAppRoutes: [
      { route: '/blog-factory', variant: 'blog-factory-list' },
    ],
  },
  {
    slug: 'lead-qualifier',
    fmaAppRoutes: [
      { route: '/lead-qualifier/chatbots', variant: 'chatbot-list' },
    ],
  },
  {
    slug: 'voice-agent',
    fmaAppRoutes: [
      { route: '/voice-agent/agents', variant: 'agent-list' },
    ],
  },
  {
    slug: 'ad-creator',
    fmaAppRoutes: [
      { route: '/ad-creator/library', variant: 'ad-library' },
    ],
  },
  {
    slug: 'seo-geo',
    fmaAppRoutes: [
      { route: '/seo', variant: 'seo-dashboard' },
    ],
  },
  {
    slug: 'clyde',
    fmaAppRoutes: [
      { route: '/ai-copilot', variant: 'copilot-chat' },
    ],
  },
]

const FMA_APP_URL = process.env.FMA_APP_URL ?? 'http://localhost:3001'
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/screenshots/skills')
const VIEWPORT = { width: 1440, height: 900 }

async function authenticate(page: Page): Promise<void> {
  const cookie = process.env.FMA_APP_SESSION_COOKIE
  if (cookie) {
    await page.context().addCookies([
      {
        name: 'session',
        value: cookie,
        domain: new URL(FMA_APP_URL).hostname,
        path: '/',
      },
    ])
    return
  }

  const email = process.env.FMA_APP_EMAIL
  const password = process.env.FMA_APP_PASSWORD
  if (!email || !password) {
    throw new Error(
      'Authentication required. Set FMA_APP_SESSION_COOKIE or FMA_APP_EMAIL/PASSWORD env vars.',
    )
  }

  await page.goto(`${FMA_APP_URL}/login`)
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(`${FMA_APP_URL}/**`, { timeout: 10_000 })
}

async function captureSkill(browser: Browser, capture: SkillCapture): Promise<void> {
  const outDir = path.join(OUTPUT_DIR, capture.slug)
  await fs.mkdir(outDir, { recursive: true })

  const context = await browser.newContext({ viewport: VIEWPORT })
  const page = await context.newPage()

  try {
    await authenticate(page)

    for (const { route, variant, waitFor, focusSelector } of capture.fmaAppRoutes) {
      const url = `${FMA_APP_URL}${route}`
      console.log(`[${capture.slug}] capturing ${url} → ${variant}.png`)
      await page.goto(url, { waitUntil: 'networkidle' })
      if (waitFor) {
        await page.waitForSelector(waitFor, { timeout: 10_000 }).catch(() => {
          console.warn(`  waitFor selector not found: ${waitFor}`)
        })
      }

      const outPath = path.join(outDir, `${variant}.png`)
      if (focusSelector) {
        const element = page.locator(focusSelector).first()
        await element.screenshot({ path: outPath })
      } else {
        await page.screenshot({ path: outPath, fullPage: false })
      }
    }
  } finally {
    await context.close()
  }
}

async function main(): Promise<void> {
  console.log(`Capturing screenshots from ${FMA_APP_URL} to ${OUTPUT_DIR}`)
  const browser = await chromium.launch()
  try {
    for (const capture of CAPTURES) {
      try {
        await captureSkill(browser, capture)
      } catch (error) {
        console.error(`[${capture.slug}] FAILED:`, error instanceof Error ? error.message : error)
      }
    }
  } finally {
    await browser.close()
  }
  console.log('Done. Apply premium framing via frontend-design skill before use.')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
