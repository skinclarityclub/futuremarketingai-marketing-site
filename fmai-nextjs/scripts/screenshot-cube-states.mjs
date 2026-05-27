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

const layers = ['Vandaag', 'Deze maand', 'Archief', 'Wie het merk']
for (let i = 0; i < 4; i++) {
  const buttons = page.locator('[role="tab"]')
  await buttons.nth(i).click()
  await page.waitForTimeout(1200)
  // screenshot the cube area
  const cube = page.locator('[aria-labelledby="layers-heading"]').first()
  await cube.scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await cube.screenshot({ path: `./cube-layer-${i + 1}-${layers[i].replace(/ /g, '-')}.png` })
  console.log(`saved cube-layer-${i + 1}-${layers[i].replace(/ /g, '-')}.png`)
}

await browser.close()
