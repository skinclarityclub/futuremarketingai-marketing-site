import { chromium } from 'playwright'

const TARGETS = [
  { url: 'http://localhost:3000/nl/skills', out: './skills-index-v1.png' },
  { url: 'http://localhost:3000/nl/skills/social-media', out: './skill-social-media-v1.png' },
  { url: 'http://localhost:3000/nl/skills/clyde', out: './skill-clyde-v1.png' },
  { url: 'http://localhost:3000/nl/skills/voice-agent', out: './skill-voice-agent-v1.png' },
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
  await page.waitForTimeout(1200)
  await page.screenshot({ path: out, fullPage: true })
  console.log(`saved: ${out}`)
}

await browser.close()
