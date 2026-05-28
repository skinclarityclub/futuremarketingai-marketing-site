import { chromium } from 'playwright'

const TARGETS = [
  { url: 'http://localhost:3000/nl/apply', out: './apply-wizard-step1.png' },
  {
    url: 'http://localhost:3000/nl/apply?from=assessment&a=data-led&st=scaling&lc=tools',
    out: './apply-wizard-handoff.png',
  },
]

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

for (const { url, out } of TARGETS) {
  // Clear sessionStorage between runs
  await page.goto('http://localhost:3000/nl', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => window.sessionStorage.clear())
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
      el.style.display = 'none'
    })
  })
  await page.waitForTimeout(800)
  await page.screenshot({ path: out, fullPage: true })
  console.log(`saved: ${out}`)
}

await browser.close()
