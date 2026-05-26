/**
 * Postbuild script: inline above-the-fold critical CSS into every SSG'd
 * HTML file in .next/server/app/. Removes the 22KB Tailwind CSS render-
 * blocking <link> from the LCP critical path (trace 2026-05-27 measured
 * 1045ms wastedMs).
 *
 * Why this script instead of Next's experimental.optimizeCss:
 *   - In Next 16, optimizeCss is Pages-Router only. No references to it
 *     exist in app-render/static paths. Confirmed via source grep.
 *   - We use Beasties (maintained Critters fork by Chrome team) directly
 *     against the built HTML files.
 *
 * Run via `postbuild` npm hook OR manually after `npm run build`.
 */
import Beasties from 'beasties'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, resolve, relative } from 'node:path'

const BUILD_ROOT = resolve('.next')
const APP_HTML_ROOT = join(BUILD_ROOT, 'server', 'app')

async function findHtmlFiles(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await findHtmlFiles(full, acc)
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      acc.push(full)
    }
  }
  return acc
}

const beasties = new Beasties({
  // Path Beasties uses to resolve CSS file references — e.g. /_next/static/...
  // The HTML has `<link href="/_next/static/chunks/X.css">`, which is served
  // from .next/static/chunks/X.css at runtime, so root = .next.
  path: BUILD_ROOT,
  publicPath: '/_next/',
  // Inline only the rules that match selectors in the above-the-fold HTML.
  pruneSource: false,
  // Keep the original <link> as preload so the rest of the CSS still loads
  // (defaults to swap-with-preload — best of both worlds).
  preload: 'swap-high',
  // Keep @font-face, @keyframes, @supports — needed for hero animations.
  fonts: true,
  inlineFonts: false,
  compress: true,
  // Quiet — only log errors.
  logLevel: 'warn',
})

const htmlFiles = await findHtmlFiles(APP_HTML_ROOT)
console.log(`Found ${htmlFiles.length} HTML files in ${relative(process.cwd(), APP_HTML_ROOT)}`)

let processed = 0
let skipped = 0
let totalBytesBefore = 0
let totalBytesAfter = 0

for (const file of htmlFiles) {
  const original = await readFile(file, 'utf8')
  totalBytesBefore += original.length
  try {
    const transformed = await beasties.process(original)
    if (transformed && transformed !== original) {
      await writeFile(file, transformed, 'utf8')
      totalBytesAfter += transformed.length
      processed++
    } else {
      totalBytesAfter += original.length
      skipped++
    }
  } catch (e) {
    totalBytesAfter += original.length
    skipped++
    console.warn(`  skip ${relative(process.cwd(), file)}: ${e.message?.slice(0, 80)}`)
  }
}

const deltaKB = (totalBytesAfter - totalBytesBefore) / 1024
console.log(`\nProcessed: ${processed}  Skipped: ${skipped}`)
console.log(`HTML delta: ${deltaKB >= 0 ? '+' : ''}${deltaKB.toFixed(1)} KB (inlined CSS adds size, traded for one less round-trip)`)
