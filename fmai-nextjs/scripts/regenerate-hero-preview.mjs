/**
 * Regenerate public/images/hero-robot-preview.webp from the live hero Spline
 * scene with the cookie banner suppressed (localStorage prefill) and the
 * floating chat button hidden via CSS. Captures the masked scene container so
 * the WebP matches exactly what the user sees while the 3D scene is loading.
 *
 * Usage:  node scripts/regenerate-hero-preview.mjs
 * Requires: dev server on http://localhost:3000, `sharp` (already a Next dep).
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const URL = 'http://localhost:3000/nl'
const OUT_WEBP = resolve('public/images/hero-robot-preview.webp')
const TMP_PNG = resolve('public/images/.hero-robot-preview.tmp.png')

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1100 },
  deviceScaleFactor: 2,
})

// Pre-seed cookie consent so the banner never renders. Mirrors the shape that
// ClientIslands.tsx checks for: localStorage.cookieConsent !== null.
await ctx.addInitScript(() => {
  try {
    window.localStorage.setItem(
      'cookieConsent',
      JSON.stringify({ necessary: true, analytics: false, marketing: false, ts: Date.now() })
    )
  } catch {}
})

const page = await ctx.newPage()
await page.goto(URL, { waitUntil: 'networkidle' })

// Hide the floating chat button + any leftover cookie UI as a belt-and-suspenders.
// Inject via DOM rather than page.addStyleTag — the latter trips on the page's
// CSP when it tries to roundtrip the request, even for pure CSS payloads.
await page.evaluate(() => {
  const style = document.createElement('style')
  style.id = 'preview-screenshot-overrides'
  style.textContent = `
    button[aria-label*="chat" i],
    button[aria-label*="Open chat" i],
    button[aria-label*="Sluit chat" i] { display: none !important; }
    [class*="CookieConsent" i],
    [data-cookie-banner],
    [role="dialog"][aria-label*="cookie" i] { display: none !important; }
  `
  document.head.appendChild(style)
})

// Wait for the Spline runtime to finish shader compile. SplineScene removes
// the `spline-loading` class on the <html> element once phase === 'ready'.
await page.waitForFunction(
  () => !document.documentElement.classList.contains('spline-loading'),
  null,
  { timeout: 20000 }
)

// A couple of frames after onLoad the GPU is still settling — give it a beat.
await page.waitForTimeout(2500)

// Grab the masked Spline scene div — its bounding box (intersected with the
// viewport) is what the preview should cover.
const sceneSelector = 'section[aria-labelledby="hero"] .will-change-transform'
const sceneBox = await page.locator(sceneSelector).first().boundingBox()
if (!sceneBox) {
  throw new Error(`Scene element not found via selector: ${sceneSelector}`)
}

// Clip is clamped to the viewport, so any -5% overflow on the right is dropped
// (matches what real users see — the mask fades that edge anyway).
const clip = {
  x: Math.max(0, sceneBox.x),
  y: Math.max(0, sceneBox.y),
  width: Math.min(sceneBox.width, 1920 - Math.max(0, sceneBox.x)),
  height: Math.min(sceneBox.height, 1100 - Math.max(0, sceneBox.y)),
}

await mkdir(dirname(TMP_PNG), { recursive: true })
await page.screenshot({ path: TMP_PNG, clip, type: 'png' })
await browser.close()

// Crop to bust framing: top 65% of the scene height, centered to a 1.25:1
// aspect. The Spline scene renders the full robot, but the loader preview
// reads stronger when head + chest + arms fill the frame instead of the
// whole body shrinking into it.
const meta = await sharp(TMP_PNG).metadata()
if (!meta.width || !meta.height) throw new Error('Failed to read PNG metadata')
const cropHeight = Math.round(meta.height * 0.65)
const cropWidth = Math.min(meta.width, Math.round(cropHeight * 1.25))
const cropX = Math.max(0, Math.round((meta.width - cropWidth) / 2))

await sharp(TMP_PNG)
  .extract({ left: cropX, top: 0, width: cropWidth, height: cropHeight })
  .webp({ quality: 82, effort: 6 })
  .toFile(OUT_WEBP)
if (existsSync(TMP_PNG)) await rm(TMP_PNG)

console.log(`wrote: ${OUT_WEBP}`)
