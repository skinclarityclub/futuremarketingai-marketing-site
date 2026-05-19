#!/usr/bin/env node
/**
 * Phase 16 audit-v2 gallery index generator.
 *
 * Walks the three engine-specific screenshot trees:
 *   test-results/audit-v2/screenshots/         (Chromium, 5 viewports)
 *   test-results/audit-v2/screenshots-webkit/  (WebKit, 2 viewports)
 *   test-results/audit-v2/screenshots-firefox/ (Firefox, 2 viewports)
 *
 * For each engine, lists every route subdirectory and renders the PNGs in
 * that directory as a responsive thumbnail grid. Empty route directories
 * receive a red SKIPPED badge so Wave 2 reviewers see at a glance what was
 * not captured.
 *
 * No external CDN, no JS frameworks, no fancy dependencies. Just plain
 * HTML + inline CSS so the file works when opened from disk on any
 * reviewer's laptop with Obsidian closed.
 *
 * Output: test-results/audit-v2/screenshots/index.html
 *
 * Usage:
 *   node scripts/audit/generate-gallery-index.mjs
 *
 * Run from repo `fmai-nextjs/` working directory.
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join, relative, sep } from 'path'

const ROOT = 'test-results/audit-v2'
const DIRS = ['screenshots', 'screenshots-webkit', 'screenshots-firefox']
const OUT_INDEX = join(ROOT, 'screenshots', 'index.html')

/**
 * Walks a single engine directory and returns:
 *   { routeKey: { name, pngs: [{ name, relHref }] } }
 * The relHref is relative to the gallery index file (which lives at
 * test-results/audit-v2/screenshots/index.html).
 */
function collect(baseDir) {
  if (!existsSync(baseDir)) return {}
  const out = {}
  let routeEntries
  try {
    routeEntries = readdirSync(baseDir)
  } catch {
    return {}
  }
  for (const routeName of routeEntries) {
    const routeDir = join(baseDir, routeName)
    let st
    try {
      st = statSync(routeDir)
    } catch {
      continue
    }
    if (!st.isDirectory()) continue
    let files
    try {
      files = readdirSync(routeDir)
    } catch {
      files = []
    }
    const pngs = files
      .filter((f) => f.toLowerCase().endsWith('.png'))
      .sort()
      .map((f) => {
        const abs = join(baseDir, routeName, f)
        // gallery index lives at test-results/audit-v2/screenshots/index.html
        // relative href from there to file under siblings (screenshots-webkit/...)
        const galleryDir = join(ROOT, 'screenshots')
        const rel = relative(galleryDir, abs).split(sep).join('/')
        return { name: f, relHref: rel }
      })
    out[routeName] = { name: routeName, pngs }
  }
  return out
}

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderRoute(engine, route) {
  const safeRoute = htmlEscape(route.name)
  const hasShots = route.pngs.length > 0
  if (!hasShots) {
    return `        <article class="route empty">
          <header><code>${safeRoute}</code> <span class="badge skipped">SKIPPED</span></header>
          <p class="reason">No PNGs captured. See BUDGET.log or 01-baseline-snapshot.md for skip reason.</p>
        </article>`
  }
  const thumbs = route.pngs
    .map((p) => {
      const href = htmlEscape(p.relHref)
      const name = htmlEscape(p.name)
      return `          <a class="thumb" href="${href}" target="_blank" title="${name}">
            <img loading="lazy" src="${href}" alt="${name}">
            <span class="label">${name}</span>
          </a>`
    })
    .join('\n')
  return `        <article class="route">
          <header><code>${safeRoute}</code> <span class="badge ok">${route.pngs.length} shots</span></header>
          <div class="grid">
${thumbs}
          </div>
        </article>`
}

function renderEngine(engineDir, groups) {
  const routeKeys = Object.keys(groups).sort()
  const totalShots = routeKeys.reduce((acc, k) => acc + groups[k].pngs.length, 0)
  const totalRoutes = routeKeys.length
  const skipped = routeKeys.filter((k) => groups[k].pngs.length === 0).length
  if (totalRoutes === 0) {
    return `      <section class="engine">
        <h2>${htmlEscape(engineDir)}</h2>
        <p class="empty-engine">Directory missing or empty. Run the corresponding spec file to populate it.</p>
      </section>`
  }
  const articles = routeKeys.map((k) => renderRoute(engineDir, groups[k])).join('\n')
  return `      <section class="engine">
        <h2>${htmlEscape(engineDir)} <small>(${totalShots} shots across ${totalRoutes} routes, ${skipped} skipped)</small></h2>
${articles}
      </section>`
}

function buildHtml(groupsPerEngine) {
  const generatedAt = new Date().toISOString()
  let totalShots = 0
  let totalSkipped = 0
  for (const d of DIRS) {
    const g = groupsPerEngine[d] || {}
    for (const k of Object.keys(g)) {
      totalShots += g[k].pngs.length
      if (g[k].pngs.length === 0) totalSkipped += 1
    }
  }
  const sections = DIRS.map((d) => renderEngine(d, groupsPerEngine[d] || {})).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Phase 16 audit-v2 - screenshot gallery</title>
  <style>
    :root {
      --bg: #0a0d14;
      --surface: #111520;
      --elevated: #1a1f2e;
      --text: #e8ecf4;
      --muted: #8c98ad;
      --teal: #00d4aa;
      --amber: #f5a623;
      --red: #ef4444;
      --green: #22c55e;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
    header.page { padding: 24px 32px; border-bottom: 1px solid #232938; background: var(--surface); position: sticky; top: 0; z-index: 10; }
    header.page h1 { margin: 0 0 4px; font-size: 18px; }
    header.page p { margin: 0; color: var(--muted); font-size: 13px; }
    main { padding: 24px 32px 64px; max-width: 1600px; margin: 0 auto; }
    .engine { margin: 0 0 48px; }
    .engine h2 { font-size: 16px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 1px solid #232938; color: var(--teal); }
    .engine h2 small { color: var(--muted); font-weight: normal; font-size: 12px; margin-left: 8px; }
    .route { background: var(--surface); border: 1px solid #232938; border-radius: 6px; padding: 12px; margin: 0 0 16px; }
    .route header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .route header code { font-family: ui-monospace, "JetBrains Mono", monospace; font-size: 13px; color: var(--text); }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
    .badge.ok { background: rgba(34, 197, 94, 0.15); color: var(--green); }
    .badge.skipped { background: rgba(239, 68, 68, 0.15); color: var(--red); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; }
    .thumb { display: block; background: var(--elevated); border-radius: 4px; overflow: hidden; text-decoration: none; color: var(--muted); transition: transform 0.15s ease; }
    .thumb:hover { transform: scale(1.02); }
    .thumb img { width: 100%; height: 140px; object-fit: cover; object-position: top; display: block; }
    .thumb .label { display: block; padding: 6px 8px; font-size: 11px; font-family: ui-monospace, monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .route.empty { border-left: 3px solid var(--red); }
    .route.empty .reason { color: var(--muted); font-size: 12px; margin: 0; }
    .empty-engine { color: var(--muted); font-style: italic; padding: 12px; background: var(--surface); border-radius: 6px; }
  </style>
</head>
<body>
  <header class="page">
    <h1>Phase 16 audit-v2 - screenshot gallery</h1>
    <p>Generated ${htmlEscape(generatedAt)} - total ${totalShots} shots across ${DIRS.length} engines (${totalSkipped} route-dirs skipped)</p>
  </header>
  <main>
${sections}
  </main>
</body>
</html>
`
}

function main() {
  const groupsPerEngine = {}
  for (const d of DIRS) {
    groupsPerEngine[d] = collect(join(ROOT, d))
  }
  const galleryDir = join(ROOT, 'screenshots')
  if (!existsSync(galleryDir)) mkdirSync(galleryDir, { recursive: true })
  const html = buildHtml(groupsPerEngine)
  writeFileSync(OUT_INDEX, html, 'utf8')

  // Stdout summary so the executor can scrape PNG counts for BUDGET.log.
  let total = 0
  for (const d of DIRS) {
    const g = groupsPerEngine[d] || {}
    let count = 0
    for (const k of Object.keys(g)) count += g[k].pngs.length
    total += count
    console.log(`${d}=${count}`)
  }
  console.log(`total=${total}`)
  console.log(`Gallery index written to ${OUT_INDEX}`)
}

main()
