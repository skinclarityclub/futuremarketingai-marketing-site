import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT_DIR = '.mobile-test/skills'
mkdirSync(OUT_DIR, { recursive: true })

// Sample 3 slugs: clyde (flagship), social-media (typical live), voice-agent (custom proof)
const SLUGS = ['clyde', 'social-media', 'voice-agent']
const LOCALES = ['nl', 'en', 'es']

const browser = await chromium.launch()
const consoleErrors = []

for (const slug of SLUGS) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const page = await ctx.newPage()
    page.on('pageerror', (e) => consoleErrors.push(`[${locale}/${slug}] PAGE ERROR: ${e.message}`))
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text()
        if (txt.includes('va.vercel-scripts.com')) return
        consoleErrors.push(`[${locale}/${slug}] CONSOLE ERROR: ${txt}`)
      }
    })

    const url = `http://localhost:3000/${locale}/skills/${slug}`
    console.log(`\n=== ${locale.toUpperCase()}/${slug} — ${url}`)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForLoadState('load').catch(() => {})

    await page.evaluate(() => {
      const accept = Array.from(document.querySelectorAll('button')).find((b) =>
        /accept|accepteren|aceptar/i.test(b.textContent || ''),
      )
      if (accept) accept.click()
    })
    await page.waitForTimeout(600)

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
        }, 80)
      })
    })
    await page.waitForTimeout(600)
    await page.screenshot({ path: join(OUT_DIR, `${locale}-${slug}-fullpage.png`), fullPage: true })
    console.log(`  ${locale}-${slug}: saved`)

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
