/**
 * Phase 12-04 visual verification.
 *
 * Captures the surfaces touched by 12-04 across NL/EN/ES so the phase
 * verifier (or any future regression check) can diff against design
 * intent without reading message files:
 *
 *  - /nl/pricing       credit pack "Max" + tier descriptions "merken"
 *  - /nl/apply         form labels "merken in je portfolio"
 *  - /nl/about         "Mijn missie", "Plan een gesprek", IK voice
 *  - /nl/contact       "Vertel me over je bureau"
 *  - /nl/founding-member "ik Clyde samen vormgeef"
 *  - /nl/legal/privacy "24 april 2026"
 *  - same set for /en/ + /es/ where applicable
 *
 * Usage:
 *   1. Make sure http://localhost:3000 is the fmai-nextjs dev server
 *      (not another project hijacking the port).
 *   2. node scripts/capture-12-04.mjs
 *   3. Inspect test-results/phase-12/12-04-*.png
 */
import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'node:fs'

const OUT_DIR = 'test-results/phase-12'
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const LOCALES = ['nl', 'en', 'es']
const PAGES = ['pricing', 'apply', 'about', 'contact', 'founding-member', 'legal/privacy']

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1800 } })

for (const locale of LOCALES) {
  for (const path of PAGES) {
    const page = await ctx.newPage()
    const url = `http://localhost:3000/${locale}/${path}`
    const slug = path.replace('/', '-')
    const file = `${OUT_DIR}/12-04-${locale}-${slug}.png`
    try {
      console.log(`[${locale}] ${url}`)
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.screenshot({ path: file, fullPage: true })
      console.log(`  -> ${file}`)
    } catch (err) {
      console.error(`  FAILED ${url}: ${err.message}`)
    }
    await page.close()
  }
}

await browser.close()
console.log('Done. Inspect test-results/phase-12/12-04-*.png')
