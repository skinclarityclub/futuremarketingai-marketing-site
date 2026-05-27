import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = '.mobile-test/conversion'
mkdirSync(OUT_DIR, { recursive: true })

const PAGES = ['contact', 'assessment']
const LOCALES = ['nl', 'en', 'es']
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

const browser = await chromium.launch()
const consoleErrors = []

for (const path of PAGES) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => consoleErrors.push(`[${locale}/${path}] PAGE ERROR: ${e.message}`))
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text()
        if (txt.includes('va.vercel-scripts.com')) return
        consoleErrors.push(`[${locale}/${path}] CONSOLE ERROR: ${txt}`)
      }
    })

    const url = `${BASE_URL}/${locale}/${path}`
    console.log(`\n=== ${locale.toUpperCase()}/${path}`)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForLoadState('load').catch(() => {})

    await page.evaluate(() => {
      const accept = Array.from(document.querySelectorAll('button')).find((b) =>
        /accept|accepteren|aceptar/i.test(b.textContent || ''),
      )
      if (accept) accept.click()
    })
    await page.waitForTimeout(400)

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
    await page.screenshot({ path: join(OUT_DIR, `${locale}-${path}.png`), fullPage: true })
    console.log(`  ${locale}-${path}: saved`)

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
