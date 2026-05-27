import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = '.mobile-test/founding'
mkdirSync(OUT_DIR, { recursive: true })

const SECTIONS = [
  { name: '01-hero', selector: '[aria-labelledby="hero"]' },
  { name: '02-pricing', selector: '[aria-labelledby="pricing"]' },
  { name: '03-value', selector: '[aria-labelledby="value-prop"]' },
  { name: '04-scarcity', selector: '[aria-labelledby="scarcity"]' },
  { name: '05-benefits', selector: '[aria-labelledby="benefits"]' },
  { name: '06-proof', selector: '[aria-labelledby="proof"]' },
  { name: '07-faq', selector: '[aria-labelledby="faq"]' },
  { name: '08-quick-apply', selector: '[aria-labelledby="quick-apply"]' },
  { name: '09-cta', selector: '[aria-labelledby="cta"]' },
]

const LOCALES = ['nl', 'en', 'es']

const browser = await chromium.launch()
const consoleErrors = []

for (const locale of LOCALES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => consoleErrors.push(`[${locale}] PAGE ERROR: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text()
      if (txt.includes('va.vercel-scripts.com')) return
      consoleErrors.push(`[${locale}] CONSOLE ERROR: ${txt}`)
    }
  })

  const url = `http://localhost:3000/${locale}/founding-member`
  console.log(`\n=== ${locale.toUpperCase()} — ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForLoadState('load').catch(() => {})

  await page.evaluate(() => {
    const accept = Array.from(document.querySelectorAll('button')).find((b) =>
      /accept|accepteren|aceptar/i.test(b.textContent || ''),
    )
    if (accept) accept.click()
  })
  await page.waitForTimeout(800)

  // Scroll page to trigger reveal animations
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0
      const step = 200
      const timer = setInterval(() => {
        window.scrollBy(0, step)
        total += step
        if (total >= document.body.scrollHeight) {
          clearInterval(timer)
          window.scrollTo(0, 0)
          resolve(true)
        }
      }, 80)
    })
  })
  await page.waitForTimeout(800)
  await page.screenshot({ path: join(OUT_DIR, `${locale}-00-fullpage.png`), fullPage: true })
  console.log(`  ${locale}-00-fullpage: saved`)

  for (const { name, selector } of SECTIONS) {
    try {
      const target = page.locator(selector).first()
      const count = await target.count()
      if (count === 0) {
        console.log(`  ${locale}-${name}: NOT FOUND (${selector})`)
        continue
      }
      await target.scrollIntoViewIfNeeded()
      await page.waitForTimeout(700)
      await target.screenshot({ path: join(OUT_DIR, `${locale}-${name}.png`) })
      console.log(`  ${locale}-${name}: saved`)
    } catch (err) {
      console.log(`  ${locale}-${name}: ERROR ${err.message}`)
    }
  }

  await ctx.close()
}

await browser.close()

if (consoleErrors.length > 0) {
  console.log('\n⚠ ERRORS:')
  consoleErrors.forEach((e) => console.log('  ' + e))
  process.exit(1)
}
console.log('\n✓ done — geen JS errors')
