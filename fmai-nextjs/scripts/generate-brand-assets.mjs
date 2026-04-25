#!/usr/bin/env node
/**
 * generate-brand-assets.mjs
 *
 * WHY: Phase 12-01 needs static og-image.png (1200x630) + logo.png (512x512) shipped
 * to public/. Audit B-5 flagged that OrganizationJsonLd.logo + every social-share card
 * 404s because those files do not exist on disk.
 *
 * HOW: Render branded SVG to PNG via sharp. Sharp ships transitively with next 16,
 * so no new dependency. Reproducible, deterministic — re-runnable any time the
 * brand visual language shifts.
 *
 * Usage: node scripts/generate-brand-assets.mjs
 *        (Run from fmai-nextjs/ directory.)
 */

import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = resolve(__dirname, '..', 'public')

// Design tokens from src/app/globals.css @theme block (single source of truth).
const COLORS = {
  bgDeep: '#0a0d14',
  accentSystem: '#00d4aa',
  accentHuman: '#f5a623',
  textPrimary: '#e8ecf4',
  textSecondary: '#9ba3b5',
}

// ---------- og-image.png (1200x630) ----------

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${COLORS.accentSystem}" />
      <stop offset="100%" stop-color="${COLORS.accentHuman}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="${COLORS.accentSystem}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="${COLORS.bgDeep}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="${COLORS.bgDeep}" />
  <rect width="1200" height="630" fill="url(#glow)" />

  <!-- Top-left wordmark -->
  <text x="64" y="98"
        font-family="JetBrains Mono, Menlo, Consolas, monospace"
        font-size="32"
        font-weight="500"
        fill="${COLORS.accentSystem}">future-marketing.ai</text>

  <!-- Center: Clyde headline -->
  <text x="600" y="340"
        text-anchor="middle"
        font-family="DM Sans, Inter, -apple-system, sans-serif"
        font-size="180"
        font-weight="700"
        fill="${COLORS.accentSystem}"
        letter-spacing="-4">Clyde</text>

  <!-- Subhead -->
  <text x="600" y="420"
        text-anchor="middle"
        font-family="DM Sans, Inter, -apple-system, sans-serif"
        font-size="46"
        font-weight="500"
        fill="${COLORS.textPrimary}">Jouw AI Marketing Medewerker</text>

  <!-- Bottom-right tagline -->
  <text x="1136" y="566"
        text-anchor="end"
        font-family="DM Sans, Inter, -apple-system, sans-serif"
        font-size="26"
        font-weight="400"
        fill="${COLORS.textSecondary}">Voor Nederlandse bureaus</text>

  <!-- Accent gradient line -->
  <rect x="0" y="628" width="1200" height="2" fill="url(#accentLine)" />
</svg>`

// ---------- logo.png (512x512) ----------

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <!-- Transparent background, FMai mark in accent-system teal -->
  <!-- Rounded square frame -->
  <rect x="32" y="32" width="448" height="448" rx="80" ry="80"
        fill="none"
        stroke="${COLORS.accentSystem}"
        stroke-width="12" />
  <!-- "F" wordmark (geometric) -->
  <g fill="${COLORS.accentSystem}">
    <!-- Vertical bar -->
    <rect x="156" y="128" width="48" height="256" />
    <!-- Top horizontal bar -->
    <rect x="156" y="128" width="200" height="48" />
    <!-- Middle horizontal bar -->
    <rect x="156" y="232" width="160" height="44" />
  </g>
  <!-- "M" mark counter-balance dot -->
  <circle cx="376" cy="384" r="16" fill="${COLORS.accentSystem}" />
</svg>`

async function generate() {
  // og-image.png
  const ogPng = await sharp(Buffer.from(ogSvg))
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(resolve(PUBLIC_DIR, 'og-image.png'), ogPng)

  // logo.png with transparent background
  const logoPng = await sharp(Buffer.from(logoSvg))
    .png({ compressionLevel: 9 })
    .toBuffer()
  await writeFile(resolve(PUBLIC_DIR, 'logo.png'), logoPng)

  // Report
  const ogMeta = await sharp(resolve(PUBLIC_DIR, 'og-image.png')).metadata()
  const logoMeta = await sharp(resolve(PUBLIC_DIR, 'logo.png')).metadata()
  // eslint-disable-next-line no-console
  console.log(
    `og-image.png  ${ogMeta.width}x${ogMeta.height}  ${(ogPng.length / 1024).toFixed(1)} KB`
  )
  // eslint-disable-next-line no-console
  console.log(
    `logo.png      ${logoMeta.width}x${logoMeta.height}  ${(logoPng.length / 1024).toFixed(1)} KB`
  )
}

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
