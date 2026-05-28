import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const outDir = './.clyde-verify'
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()

async function capture({ url, viewport, name, idleAfterMs = 0 }) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  // Pre-seed cookie consent so the banner doesn't cover the FAB.
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
  // Allow hydration + matchMedia to settle (useIsDesktop flips post-mount).
  await page.waitForTimeout(800)
  if (idleAfterMs > 0) await page.waitForTimeout(idleAfterMs)
  const out = `${outDir}/${name}.png`
  await page.screenshot({ path: out, fullPage: false })
  // Also save a zoomed crop around the trigger so we can actually see it.
  const trigger0 = await page.locator('[aria-label^="Open chat met Clyde"]').first()
  const bbox0 = await trigger0.boundingBox()
  if (bbox0) {
    const pad = 40
    await page.screenshot({
      path: `${outDir}/${name}-crop.png`,
      clip: {
        x: Math.max(0, bbox0.x - pad),
        y: Math.max(0, bbox0.y - pad),
        width: Math.min(viewport.width, bbox0.width + pad * 2),
        height: Math.min(viewport.height, bbox0.height + pad * 2),
      },
    })
  }
  // probe for the Clyde trigger
  const trigger = await page.locator('[aria-label^="Open chat met Clyde"]').first()
  const exists = await trigger.count()
  const bbox = exists ? await trigger.boundingBox() : null
  const html = exists ? await trigger.evaluate((el) => el.outerHTML.slice(0, 220)) : null
  console.log(`[${name}] visible=${exists > 0} bbox=${JSON.stringify(bbox)}`)
  if (html) console.log(`  html=${html}`)
  await ctx.close()
}

// Desktop rest state (right viewport edge obelisk)
await capture({
  url: `${base}/nl`,
  viewport: { width: 1440, height: 900 },
  name: 'desktop-rest',
})

// Desktop whispering state (after 21s scroll-idle)
await capture({
  url: `${base}/nl/skills/voice-agent`,
  viewport: { width: 1440, height: 900 },
  name: 'desktop-voice-whisper',
  idleAfterMs: 22000,
})

// Mobile rest state
await capture({
  url: `${base}/nl`,
  viewport: { width: 375, height: 812 },
  name: 'mobile-rest',
})

// Mobile rest WITH cookie banner visible (no consent yet) -- verify FAB
// lifts above the banner instead of being hidden behind it.
async function captureFirstVisit({ url, viewport, name }) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  // No init script -> no cookie consent set -> banner renders.
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  const out = `${outDir}/${name}.png`
  await page.screenshot({ path: out, fullPage: false })
  const trigger = await page.locator('[aria-label^="Open chat met Clyde"]').first()
  const bbox = await trigger.boundingBox()
  console.log(`[${name}] visible=${bbox ? 'true' : 'false'} bbox=${JSON.stringify(bbox)}`)
  if (bbox) {
    const pad = 60
    await page.screenshot({
      path: `${outDir}/${name}-crop.png`,
      clip: {
        x: Math.max(0, bbox.x - pad),
        y: Math.max(0, bbox.y - pad),
        width: Math.min(viewport.width, bbox.width + pad * 2),
        height: Math.min(viewport.height, bbox.height + pad * 2),
      },
    })
  }
  await ctx.close()
}

await captureFirstVisit({
  url: `${base}/nl`,
  viewport: { width: 375, height: 812 },
  name: 'mobile-first-visit-with-banner',
})

// Mobile noticed state (after 9s idle)
await capture({
  url: `${base}/nl/pricing`,
  viewport: { width: 375, height: 812 },
  name: 'mobile-noticed-pricing',
  idleAfterMs: 9000,
})

await browser.close()
console.log(`\nScreenshots saved to ${outDir}/`)
