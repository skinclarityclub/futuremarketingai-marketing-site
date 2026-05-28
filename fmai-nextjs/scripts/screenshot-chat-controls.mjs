import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const outDir = './.clyde-verify/chat-controls'
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()

async function setup(viewport) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ necessary: true, analytics: false, marketing: false })
      )
    } catch {}
  })
  const page = await ctx.newPage()
  return { ctx, page }
}

async function snapPanel(page, name, viewport) {
  const panel = page.locator('[role="dialog"][aria-label*="Chat"]').first()
  const bbox = await panel.boundingBox().catch(() => null)
  if (bbox) {
    const pad = 12
    await page.screenshot({
      path: `${outDir}/${name}.png`,
      clip: {
        x: Math.max(0, bbox.x - pad),
        y: Math.max(0, bbox.y - pad),
        width: Math.min(viewport.width, bbox.width + pad * 2),
        height: Math.min(viewport.height, bbox.height + pad * 2),
      },
    })
    console.log(`saved: ${outDir}/${name}.png ${bbox.width}x${bbox.height}`)
  } else {
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false })
    console.log(`saved: ${outDir}/${name}.png (full)`)
  }
}

async function run() {
  const viewport = { width: 1440, height: 900 }
  const { ctx, page } = await setup(viewport)
  await page.goto(`${base}/nl`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  // Open chat
  await page.locator('[aria-label^="Open chat met Clyde"]').first().click()
  await page.waitForTimeout(1500)

  // Send a quick message to get a real conversation
  const textarea = page.locator('textarea').first()
  await textarea.fill('Hi')
  await textarea.press('Enter')

  // Capture streaming-state with Stop button visible (within 800ms)
  await page.waitForTimeout(700)
  await snapPanel(page, 'desktop-streaming', viewport)

  // Wait for stream to complete (status==ready) — give it ~6 seconds
  await page.waitForTimeout(6000)

  // Capture conversation with regenerate hint (hover last assistant message)
  const lastMsg = page.locator('[role="dialog"] >> nth=-1 >> .. >> .. >> ..').first()
  await snapPanel(page, 'desktop-after-response', viewport)

  // Hover over the user message to reveal Edit button
  const userBubble = page.locator('[role="dialog"] >> text=Hi').first()
  await userBubble.hover().catch(() => {})
  await page.waitForTimeout(400)
  await snapPanel(page, 'desktop-edit-hover', viewport)

  await ctx.close()
}

await run()
await browser.close()
console.log('done')
