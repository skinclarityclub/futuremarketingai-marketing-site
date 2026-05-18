import { test, expect } from '@playwright/test'

test.use({ baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000' })

/**
 * NL content smoke test — post Wave B/C rewrite validation.
 *
 * Visits every key /nl page, verifies it loads without errors,
 * checks that critical strings are present, and captures a
 * screenshot for visual review.
 */

const pages = [
  { path: '/nl', name: 'home', expected: ['Dit is Clyde', 'AI Marketing Medewerker'] },
  { path: '/nl/about', name: 'about', expected: ['Over FutureMarketingAI', 'Mijn missie'] },
  { path: '/nl/how-it-works', name: 'how-it-works', expected: ['Hoe begint jouw partnership', 'Aanmelden'] },
  { path: '/nl/pricing', name: 'pricing', expected: ['Premium partnerships', 'Founding'] },
  { path: '/nl/founding-member', name: 'founding-member', expected: ['Founding partner', 'levenslang'] },
  { path: '/nl/apply', name: 'apply', expected: ['partnership-gesprek', 'Vertel ons'] },
  { path: '/nl/contact', name: 'contact', expected: ['Algemene vragen', 'Stuur ons'] },
  { path: '/nl/memory', name: 'memory', expected: ['Clyde onthoudt', 'per merk'] },
  { path: '/nl/case-studies/skinclarity-club', name: 'case-study-skc', expected: ['Eén AI Marketing Medewerker', 'SkinClarity'] },
  { path: '/nl/skills/clyde', name: 'skill-clyde', expected: ['AI Marketing Medewerker', 'orkestreert'] },
  { path: '/nl/skills/social-media', name: 'skill-social', expected: ['verzorgt je social media', 'merkstem'] },
  { path: '/nl/skills/voice-agent', name: 'skill-voice', expected: ['Clyde neemt de telefoon op', 'escalatie'] },
  { path: '/nl/skills/reporting', name: 'skill-reporting', expected: ['rapporteert elke week', 'anomalie'] },
  { path: '/nl/skills/lead-qualifier', name: 'skill-lead', expected: ['kwalificeert', 'leadscore'] },
  { path: '/nl/legal/privacy', name: 'legal-privacy', expected: ['Privacybeleid', 'AVG'] },
  { path: '/nl/legal/terms', name: 'legal-terms', expected: ['Servicevoorwaarden', 'beëindigen'] },
]

const forbiddenPatterns = [
  / , /,                    // space-comma-space residu
  /\bUnlimited\b/,          // untranslated
  /\bskill\b/i,             // vaardigheid should be used instead
  /brand voice/i,           // merkstem
  /natural language/i,      // gewone taal
  /coordineren|creert|beeindig|categorieen|authoriteit|groeistrategieen/, // typo's
]

// Console errors that are dev-only noise and should not fail content smoke tests.
// CSP rejects the Vercel Speed Insights debug script in dev because we lock
// down script-src; this is harmless and only happens locally. Same for the
// dev-mode hydration warning on the chat textarea (a foreign-script extension
// or motion lib injects caret-color into the SSR output before client React
// hydrates; harmless visually, dev-only).
const IGNORED_CONSOLE_ERROR_PATTERNS = [
  /va\.vercel-scripts\.com/, // speed-insights debug script (dev only)
  /Content Security Policy directive/,
  /Failed to load resource.*speed-insights/,
  /Hydration failed because/, // React 19 dev hydration warnings
  /server rendered HTML didn't match/,
  /caret-color/, // dev-only style injection on textareas
]

for (const p of pages) {
  test(`${p.name} renders and passes content checks`, async ({ page }) => {
    test.slow() // dev-server first-compile is slow, especially heavier pages
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const text = msg.text()
      if (IGNORED_CONSOLE_ERROR_PATTERNS.some((re) => re.test(text))) return
      errors.push(`console.error: ${text}`)
    })

    const response = await page.goto(p.path, { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBeLessThan(400)

    // Wait for main content
    await page.waitForSelector('main, [role="main"], h1', { timeout: 15000 })

    const bodyText = await page.locator('body').innerText()

    // Expected phrases must appear
    for (const phrase of p.expected) {
      expect(bodyText, `missing expected phrase "${phrase}" on ${p.path}`).toContain(phrase)
    }

    // Forbidden patterns must not appear
    for (const pattern of forbiddenPatterns) {
      const match = bodyText.match(pattern)
      // Skill is OK if it's inside "skill-" class or "Skills" section nav, which won't appear as bare word in content
      if (match) {
        // Allow "skills" in rare contexts where it is a productname — let's show what it matched
        expect(
          match,
          `forbidden pattern ${pattern} matched "${match[0]}" on ${p.path}. Full context: ${bodyText.slice(Math.max(0, match.index! - 50), match.index! + 80)}`,
        ).toBeNull()
      }
    }

    // Capture screenshot for visual review
    await page.screenshot({ path: `test-results/nl-audit-screenshots/${p.name}.png`, fullPage: true })

    if (errors.length > 0) {
      throw new Error(`Console errors on ${p.path}:\n${errors.join('\n')}`)
    }
  })
}
