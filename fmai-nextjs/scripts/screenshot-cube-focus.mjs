import { chromium } from 'playwright'

const url = 'http://localhost:3000/nl/memory'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})
const page = await ctx.newPage()

await page.goto(url, { waitUntil: 'networkidle' })

await page.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})

await page.waitForTimeout(1000)

// Scroll the first trigger article into viewport center (slide 1 = Vandaag)
const firstArticle = page.locator('[data-layer-index="0"]').first()
await firstArticle.evaluate((el) => {
  el.scrollIntoView({ block: 'center', behavior: 'instant' })
})
await page.waitForTimeout(1500)

// Screenshot the cube area only (left column)
const cubeColumn = page.locator('.lg\\:sticky.lg\\:top-28').first()
await cubeColumn.screenshot({ path: './cube-slide1-focus.png' })
console.log('saved cube-slide1-focus.png')

// Full cube + trigger column section
await layersSection.screenshot({ path: './cube-section-full.png' })
console.log('saved cube-section-full.png')

await browser.close()
