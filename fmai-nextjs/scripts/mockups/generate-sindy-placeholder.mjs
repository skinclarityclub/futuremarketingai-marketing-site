/**
 * Generates a tasteful 800x800 placeholder JPEG for the Sindy testimonial slot.
 *
 * NOT a real headshot. Soft dark gradient on brand colors with a subtle initial.
 * Output: fmai-nextjs/public/case-studies/skc/sindy-headshot.jpg
 *
 * Replace this with a real headshot before pushing the case-study page to socials,
 * press, or paid acquisition. Tracked in .planning/phases/15-conversion-accelerators/15-VERIFICATION.md
 * Group C #5 (Sindy headshot 800x800 sRGB).
 *
 * Run: node scripts/mockups/generate-sindy-placeholder.mjs
 */
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const OUT = resolve(process.cwd(), 'public/case-studies/skc/sindy-headshot.jpg')

const svg = `
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#1a1f2e" />
      <stop offset="60%" stop-color="#111520" />
      <stop offset="100%" stop-color="#0a0d14" />
    </radialGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d4aa" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#f5a623" stop-opacity="0.75" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)" />
  <circle cx="400" cy="400" r="220" fill="none" stroke="url(#accent)" stroke-width="2" stroke-opacity="0.4" />
  <text
    x="400"
    y="455"
    text-anchor="middle"
    font-family="DM Sans, Helvetica, sans-serif"
    font-size="240"
    font-weight="600"
    fill="url(#accent)"
    fill-opacity="0.85"
  >S</text>
  <text
    x="400"
    y="640"
    text-anchor="middle"
    font-family="DM Sans, Helvetica, sans-serif"
    font-size="22"
    font-weight="500"
    fill="#9ba3b5"
    letter-spacing="3"
  >PLACEHOLDER · SWAP BEFORE LAUNCH</text>
</svg>
`.trim()

const buf = await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toBuffer()

writeFileSync(OUT, buf)
console.log(`Wrote ${OUT} (${buf.length} bytes)`)
