/**
 * Phase 12-02 visual verification: capture pricing tier-matrix in NL/EN/ES.
 * Used to confirm zero English label leak in NL render after i18n refactor.
 */
import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'node:fs'

const OUT_DIR = 'test-results/phase-12'
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const LOCALES = ['nl', 'en', 'es']

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

for (const locale of LOCALES) {
  const page = await ctx.newPage()
  const url = `http://localhost:3000/${locale}/pricing`
  console.log(`[${locale}] navigating to ${url}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })

  // Wait for skills tier matrix to mount
  // Find element by visible header text per locale
  const headerByLocale = {
    nl: 'Beschikbaarheid per tier',
    en: 'Availability per tier',
    es: 'Disponibilidad por tier',
  }
  const heading = page.getByText(headerByLocale[locale], { exact: false }).first()
  await heading.waitFor({ state: 'visible', timeout: 30000 })
  await heading.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)

  // Capture the section (heading + table). Find nearest enclosing section.
  const section = await heading.evaluateHandle((el) => {
    let n = el
    while (n && n.tagName !== 'SECTION') n = n.parentElement
    return n ?? el
  })
  const out = `${OUT_DIR}/pricing-matrix-${locale}.png`
  await section.asElement().screenshot({ path: out })
  console.log(`[${locale}] captured ${out}`)
  await page.close()
}

await browser.close()
console.log('done')
