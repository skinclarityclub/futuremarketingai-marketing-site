import { chromium } from 'playwright'

const TARGETS = [
  { url: 'http://localhost:3000/nl/roadmap', out: './util-roadmap-v1.png' },
  { url: 'http://localhost:3000/nl/legal', out: './util-legal-v1.png' },
  { url: 'http://localhost:3000/nl/legal/cookies', out: './util-cookies-v1.png' },
  { url: 'http://localhost:3000/nl/legal/privacy', out: './util-privacy-v1.png' },
  { url: 'http://localhost:3000/nl/legal/terms', out: './util-terms-v1.png' },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1200 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

for (const { url, out } of TARGETS) {
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
  await page.waitForTimeout(1000)
  await page.screenshot({ path: out, fullPage: true })
  console.log(`saved: ${out}`)
}

await browser.close()
