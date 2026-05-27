import { chromium } from 'playwright'

const url = 'http://localhost:3000/nl/case-studies/skinclarity-club'
const out = process.argv[2] ?? './case-skc-v1.png'

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
    }, 70)
  })
})
await page.waitForTimeout(1800)
await page.screenshot({ path: out, fullPage: true })

await browser.close()
console.log(`saved: ${out}`)
