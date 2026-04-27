/**
 * Generates a placeholder NL Bureau AI Readiness Checklist PDF.
 *
 * Uses the existing Playwright Chromium runtime to render a self-contained HTML
 * document to PDF. Content is real (20 questions, 4 categories, 3-tier action
 * guide per Phase 15-04 RESEARCH.md R-3) so the lead magnet still delivers
 * value when downloaded; only the typographic design is rough. Daley swaps for
 * a Canva-designed v2 before paid acquisition.
 *
 * Output: fmai-nextjs/public/downloads/nl-bureau-ai-readiness-checklist.pdf
 * Run:    node scripts/mockups/generate-checklist-pdf.mjs
 */
import { chromium } from '@playwright/test'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const OUT = resolve(process.cwd(), 'public/downloads/nl-bureau-ai-readiness-checklist.pdf')
const HTML_PATH = resolve(process.cwd(), 'scripts/mockups/checklist-content.html')

const html = readFileSync(HTML_PATH, 'utf8')

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'networkidle' })
await page.pdf({
  path: OUT,
  format: 'A4',
  margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
  printBackground: true,
})
await browser.close()

console.log(`Wrote ${OUT}`)
