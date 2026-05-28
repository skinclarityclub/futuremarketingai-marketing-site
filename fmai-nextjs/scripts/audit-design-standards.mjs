import { chromium } from 'playwright'

const PAGES = [
  { path: '/', label: 'home' },
  { path: '/about', label: 'about' },
  { path: '/how-it-works', label: 'how-it-works' },
  { path: '/pricing', label: 'pricing' },
  { path: '/founding-member', label: 'founding-member' },
  { path: '/memory', label: 'memory' },
  { path: '/case-studies/skinclarity-club', label: 'case-skc' },
  { path: '/apply', label: 'apply' },
  { path: '/contact', label: 'contact' },
  { path: '/assessment', label: 'assessment' },
  { path: '/skills', label: 'skills-index' },
  { path: '/blog', label: 'blog' },
  { path: '/roadmap', label: 'roadmap' },
  { path: '/legal', label: 'legal' },
  { path: '/legal/cookies', label: 'cookies' },
  { path: '/legal/privacy', label: 'privacy' },
]

const browser = await chromium.launch()
const consoleErrors = []
const results = []

for (const { path, label } of PAGES) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => consoleErrors.push(`[${label}] PAGE ERROR: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const txt = msg.text()
      if (txt.includes('va.vercel-scripts.com')) return
      consoleErrors.push(`[${label}] CONSOLE ERROR: ${txt}`)
    }
  })

  const url = `http://localhost:3000/nl${path === '/' ? '' : path}`
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForLoadState('load').catch(() => {})
  await page.waitForTimeout(800)

  const check = await page.evaluate(() => {
    const hasScarcityBadge = !!Array.from(document.querySelectorAll('span,div')).find((el) => {
      const txt = (el.textContent || '').trim().toLowerCase()
      return /founding (open|abierto) [·.] \d+\/\d+ (bezet|reserved|reservadas)/.test(txt)
    })
    const hasEyebrowAccent = !!document.querySelector('p.font-mono.uppercase, span.font-mono.uppercase')
    const hasH1 = !!document.querySelector('h1')
    const hasFinalCta = (() => {
      const sections = document.querySelectorAll('section')
      if (!sections.length) return false
      const last = sections[sections.length - 1]
      const hasCtaLink = !!last.querySelector('a[href*="/apply"]')
      return hasCtaLink
    })()
    const hasFooter = !!document.querySelector('footer')
    const h1Text = document.querySelector('h1')?.textContent?.trim().substring(0, 50) ?? ''
    return { hasScarcityBadge, hasEyebrowAccent, hasH1, hasFinalCta, hasFooter, h1Text }
  })

  results.push({
    label,
    path,
    status: response?.status() ?? 0,
    ...check,
  })

  await ctx.close()
}

await browser.close()

console.log('\n=== CROSS-PAGE DESIGN STANDARDS AUDIT (NL locale) ===')
console.log(
  'page'.padEnd(20) +
    'HTTP'.padEnd(6) +
    'scar'.padEnd(6) +
    'eye'.padEnd(5) +
    'H1'.padEnd(4) +
    'CTA'.padEnd(5) +
    'foot'.padEnd(6) +
    'H1-text',
)
console.log('-'.repeat(120))
for (const r of results) {
  console.log(
    r.label.padEnd(20) +
      String(r.status).padEnd(6) +
      (r.hasScarcityBadge ? '✓' : '✗').padEnd(6) +
      (r.hasEyebrowAccent ? '✓' : '✗').padEnd(5) +
      (r.hasH1 ? '✓' : '✗').padEnd(4) +
      (r.hasFinalCta ? '✓' : '✗').padEnd(5) +
      (r.hasFooter ? '✓' : '✗').padEnd(6) +
      r.h1Text,
  )
}

console.log(`\nTotal: ${results.length}`)
console.log(`HTTP 200: ${results.filter((r) => r.status === 200).length}`)
console.log(`Missing scarcity: ${results.filter((r) => !r.hasScarcityBadge).map((r) => r.label).join(', ')}`)
console.log(`Missing final-CTA: ${results.filter((r) => !r.hasFinalCta).map((r) => r.label).join(', ')}`)
console.log(`Missing H1: ${results.filter((r) => !r.hasH1).map((r) => r.label).join(', ')}`)

if (consoleErrors.length > 0) {
  console.log('\n⚠ ERRORS:')
  consoleErrors.forEach((e) => console.log('  ' + e))
}
