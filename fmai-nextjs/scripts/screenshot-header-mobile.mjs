import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 390, height: 200 },
  deviceScaleFactor: 2,
  isMobile: true,
})
const page = await ctx.newPage()
await page.goto('http://localhost:3000/nl', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})
await page.waitForTimeout(400)
await page.screenshot({ path: './header-mobile-v4.png', clip: { x: 0, y: 0, width: 390, height: 80 } })
console.log('saved header-mobile-v4.png')
await browser.close()
