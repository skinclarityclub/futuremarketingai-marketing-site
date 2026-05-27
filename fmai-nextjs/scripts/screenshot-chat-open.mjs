import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const outDir = './.clyde-verify/chat-open'
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()

async function captureChatOpen({ url, viewport, name, sendMessage = false }) {
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
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  // Click the Clyde pill to open the chat panel
  const trigger = page.locator('[aria-label^="Open chat met Clyde"]').first()
  await trigger.click()
  await page.waitForTimeout(1500)

  if (sendMessage) {
    const input = page.locator('textarea, input[type="text"]').first()
    await input.fill('Welke vaardigheden heb je?')
    await page.waitForTimeout(300)
    await input.press('Enter')
    await page.waitForTimeout(4000)
  }

  const out = `${outDir}/${name}.png`
  await page.screenshot({ path: out, fullPage: false })

  // Tight crop of the chat panel for clearer detail
  const panel = page.locator('[role="dialog"][aria-label*="Chat"]').first()
  const bbox = await panel.boundingBox().catch(() => null)
  if (bbox) {
    const pad = 12
    await page.screenshot({
      path: `${outDir}/${name}-panel.png`,
      clip: {
        x: Math.max(0, bbox.x - pad),
        y: Math.max(0, bbox.y - pad),
        width: Math.min(viewport.width, bbox.width + pad * 2),
        height: Math.min(viewport.height, bbox.height + pad * 2),
      },
    })
    console.log(`saved: ${out} + panel crop ${bbox.width}x${bbox.height}`)
  } else {
    // Fallback: crop the right-side area where the panel lives
    const panelWidth = Math.min(viewport.width, 520)
    await page.screenshot({
      path: `${outDir}/${name}-panel.png`,
      clip: {
        x: viewport.width - panelWidth,
        y: 0,
        width: panelWidth,
        height: viewport.height,
      },
    })
    console.log(`saved: ${out} + right-side fallback crop`)
  }
  await ctx.close()
}

// Desktop chat-open empty state (welcome + suggested prompts)
await captureChatOpen({
  url: `${base}/nl`,
  viewport: { width: 1440, height: 900 },
  name: 'desktop-chat-empty',
})

// Desktop chat after sending a message (response + tool results)
await captureChatOpen({
  url: `${base}/nl`,
  viewport: { width: 1440, height: 900 },
  name: 'desktop-chat-active',
  sendMessage: true,
})

// Mobile chat-open empty
await captureChatOpen({
  url: `${base}/nl`,
  viewport: { width: 375, height: 812 },
  name: 'mobile-chat-empty',
})

// Voice-agent chat (page-aware welcome)
await captureChatOpen({
  url: `${base}/nl/skills/voice-agent`,
  viewport: { width: 1440, height: 900 },
  name: 'desktop-chat-voice-agent',
})

await browser.close()
console.log(`\nAll screenshots saved to ${outDir}/`)
