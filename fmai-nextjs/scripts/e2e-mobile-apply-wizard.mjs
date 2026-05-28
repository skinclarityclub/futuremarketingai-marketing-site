import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = '.mobile-test/apply-wizard'
mkdirSync(OUT_DIR, { recursive: true })

const SCENARIOS = [
  { label: 'cold', url: '/apply' },
  { label: 'handoff', url: '/apply?from=assessment&a=data-led&st=scaling&lc=tools' },
]
const LOCALES = ['nl', 'en', 'es']
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const browser = await chromium.launch()
const consoleErrors = []

for (const { label, url } of SCENARIOS) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => consoleErrors.push(`[${locale}/${label}] PAGE ERROR: ${e.message}`))
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text()
        if (txt.includes('va.vercel-scripts.com')) return
        consoleErrors.push(`[${locale}/${label}] CONSOLE ERROR: ${txt}`)
      }
    })

    // Clear sessionStorage between runs
    await page.goto(`${BASE_URL}/${locale}`, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => window.sessionStorage.clear())

    const fullUrl = `${BASE_URL}/${locale}${url}`
    console.log(`\n=== ${locale.toUpperCase()}/${label} — ${fullUrl}`)
    await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForLoadState('load').catch(() => {})

    await page.evaluate(() => {
      const accept = Array.from(document.querySelectorAll('button')).find((b) =>
        /accept|accepteren|aceptar/i.test(b.textContent || ''),
      )
      if (accept) accept.click()
    })
    await page.waitForTimeout(500)

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let total = 0
        const step = 220
        const timer = setInterval(() => {
          window.scrollBy(0, step)
          total += step
          if (total >= document.body.scrollHeight) {
            clearInterval(timer)
            window.scrollTo(0, 0)
            resolve(true)
          }
        }, 60)
      })
    })
    await page.waitForTimeout(400)
    await page.screenshot({ path: join(OUT_DIR, `${locale}-${label}.png`), fullPage: true })
    console.log(`  ${locale}-${label}: saved`)

    await ctx.close()
  }
}

await browser.close()

if (consoleErrors.length > 0) {
  console.log('\n⚠ ERRORS:')
  consoleErrors.forEach((e) => console.log('  ' + e))
  process.exit(1)
}
console.log('\n✓ done — geen JS errors')
