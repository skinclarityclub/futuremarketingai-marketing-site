import { chromium } from 'playwright'

const url = 'http://localhost:3000/nl/pricing'
const out = process.argv[2] ?? './pricing-page-v1.png'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

await page.goto(url, { waitUntil: 'networkidle' })

await page.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})

await page.waitForTimeout(2000)
await page.screenshot({ path: out, fullPage: true })

await browser.close()
console.log(`saved: ${out}`)
