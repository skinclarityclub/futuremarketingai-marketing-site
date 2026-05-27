import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = '.mobile-test/memory'
mkdirSync(OUT_DIR, { recursive: true })

const SECTIONS = [
  { name: '01-hero', selector: '[aria-labelledby="memory-hero"]' },
  { name: '02-layers', selector: '[aria-labelledby="layers-heading"]' },
  { name: '03-progress', selector: '[aria-labelledby="progress-heading"]' },
  { name: '04-isolation', selector: '[aria-labelledby="isolation-heading"]' },
  { name: '05-decay', selector: '[aria-labelledby="decay-heading"]' },
  { name: '06-comparison', selector: '[aria-labelledby="comparison-heading"]' },
  { name: '07-contrast', selector: '[aria-labelledby="contrast-heading"]' },
  { name: '08-cta', selector: '[aria-labelledby="memory-cta"]' },
]

const LOCALES = ['nl', 'en', 'es']

const browser = await chromium.launch()
const consoleErrors = []

for (const locale of LOCALES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => consoleErrors.push(`[${locale}] PAGE ERROR: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`[${locale}] CONSOLE ERROR: ${msg.text()}`)
  })

  const url = `http://localhost:3000/${locale}/memory`
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

  // full-page
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
  await page.screenshot({
    path: join(OUT_DIR, `${locale}-00-fullpage.png`),
    fullPage: true,
  })
  console.log(`  ${locale}-00-fullpage: saved`)

  // sections
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
console.log('\n✓ done — geen JS errors, screenshots in', OUT_DIR)
