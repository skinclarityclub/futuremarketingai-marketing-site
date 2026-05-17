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

// Synapse mark — shared between OG image + logo. Static (no animations).
// Mirrors src/app/icon.svg + LogoSynapse component.
//
// Geometry uses a 32-unit grid; pass scale + offset to position it.
function synapseGroup(scale = 1, ox = 0, oy = 0) {
  // 32-grid points
  const A = { x: 8, y: 8 } // top-left teal node
  const B = { x: 16, y: 16 } // center hub
  const C = { x: 24, y: 8 } // firing amber node
  const D = { x: 22, y: 26 } // bottom-right teal node

  const px = (p) => ox + p.x * scale
  const py = (p) => oy + p.y * scale
  const nr = 2.4 * scale
  const haloR = 3.2 * scale
  const lineW = 1 * scale
  const fireW = 1.2 * scale

  return `
    <g stroke="${COLORS.accentSystem}" stroke-width="${lineW}" stroke-linecap="round" opacity="0.55">
      <line x1="${px(A)}" y1="${py(A)}" x2="${px(B)}" y2="${py(B)}"/>
      <line x1="${px(B)}" y1="${py(B)}" x2="${px(C)}" y2="${py(C)}"/>
      <line x1="${px(B)}" y1="${py(B)}" x2="${px(D)}" y2="${py(D)}"/>
    </g>
    <line x1="${px(B)}" y1="${py(B)}" x2="${px(C)}" y2="${py(C)}"
          stroke="${COLORS.accentHuman}" stroke-width="${fireW}" stroke-linecap="round"/>
    <circle cx="${px(A)}" cy="${py(A)}" r="${nr}" fill="${COLORS.accentSystem}"/>
    <circle cx="${px(B)}" cy="${py(B)}" r="${nr}" fill="${COLORS.accentSystem}"/>
    <circle cx="${px(D)}" cy="${py(D)}" r="${nr}" fill="${COLORS.accentSystem}"/>
    <circle cx="${px(C)}" cy="${py(C)}" r="${haloR}" fill="${COLORS.accentHuman}" opacity="0.32"/>
    <circle cx="${px(C)}" cy="${py(C)}" r="${nr}" fill="${COLORS.accentHuman}"/>`
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

  <!-- Synapse mark top-left (scale 2.6 → ~83px viewport at 32-grid) -->
  ${synapseGroup(2.6, 50, 50)}

  <!-- Wordmark next to mark -->
  <text x="180" y="103"
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
// Large Synapse on transparent background — matches header + favicon.
// 32-grid scaled by 14 → 448px content, centered with 32px padding all sides.

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${synapseGroup(14, 32, 32)}
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
  console.log(
    `og-image.png  ${ogMeta.width}x${ogMeta.height}  ${(ogPng.length / 1024).toFixed(1)} KB`
  )
  console.log(
    `logo.png      ${logoMeta.width}x${logoMeta.height}  ${(logoPng.length / 1024).toFixed(1)} KB`
  )
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
