import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

await page.goto('http://localhost:3000/nl', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})
await page.waitForTimeout(400)

// 1. Header
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
await page.screenshot({ path: './header-nav-v3.png', clip: { x: 0, y: 0, width: 1440, height: 80 } })
console.log('saved header-nav-v3.png')

// 2. Scroll the whole page first to trigger all reveals
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
await page.waitForTimeout(500)

// 3. Scroll ProcessTimeline into view via JS, then offset DOWN to capture new link below CTA
await page.evaluate(() => {
  const el = document.getElementById('process-timeline')
  if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
})
await page.waitForTimeout(700)
await page.evaluate(() => window.scrollBy(0, 380))
await page.waitForTimeout(400)
await page.screenshot({ path: './process-timeline-link-v2.png', fullPage: false })
console.log('saved process-timeline-link-v2.png')

await browser.close()
