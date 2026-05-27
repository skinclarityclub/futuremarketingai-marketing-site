import { chromium } from 'playwright'

const browser = await chromium.launch()

// Desktop header on homepage
const ctxDesk = await browser.newContext({
  viewport: { width: 1440, height: 800 },
  deviceScaleFactor: 2,
})
const pageDesk = await ctxDesk.newPage()
await pageDesk.goto('http://localhost:3000/nl', { waitUntil: 'networkidle' })
await pageDesk.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})
await pageDesk.waitForTimeout(800)
const header = pageDesk.locator('header').first()
await header.screenshot({ path: './header-desktop-v2.png' })
console.log('saved header-desktop-v2.png')

// Pricing page founding tier card
await pageDesk.goto('http://localhost:3000/nl/pricing', { waitUntil: 'networkidle' })
await pageDesk.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})
await pageDesk.evaluate(() => {
  document.querySelector('[aria-labelledby="pricing-tiers"]')?.scrollIntoView({ block: 'center' })
})
await pageDesk.waitForTimeout(1500)
const tiers = pageDesk.locator('[aria-labelledby="pricing-tiers"]').first()
await tiers.screenshot({ path: './pricing-tiers-v2.png' })
console.log('saved pricing-tiers-v2.png')

// Mobile header
const ctxMob = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
const pageMob = await ctxMob.newPage()
await pageMob.goto('http://localhost:3000/nl', { waitUntil: 'networkidle' })
await pageMob.evaluate(() => {
  document.querySelectorAll('[role="dialog"], [aria-label*="ookie"], [class*="cookie" i]').forEach((el) => {
    el.style.display = 'none'
  })
})
await pageMob.waitForTimeout(800)
// open mobile menu
const burger = pageMob.locator('button[aria-label*="enu" i]').first()
const burgerCount = await burger.count()
if (burgerCount > 0) {
  await burger.click()
  await pageMob.waitForTimeout(800)
}
await pageMob.screenshot({ path: './header-mobile-open-v2.png' })
console.log('saved header-mobile-open-v2.png')

await browser.close()
