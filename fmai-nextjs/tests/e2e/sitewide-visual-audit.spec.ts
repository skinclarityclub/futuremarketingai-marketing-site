import { test, expect, type Page } from '@playwright/test'

type Route = {
  path: string
  slug: string
  expectedHeading?: RegExp
  expectStatus?: number
}

const NL_ROUTES: Route[] = [
  { path: '/nl', slug: 'home', expectedHeading: /clyde|marketing|medewerker/i },
  { path: '/nl/memory', slug: 'memory' },
  { path: '/nl/pricing', slug: 'pricing' },
  { path: '/nl/about', slug: 'about' },
  { path: '/nl/how-it-works', slug: 'how-it-works' },
  { path: '/nl/contact', slug: 'contact' },
  { path: '/nl/apply', slug: 'apply' },
  { path: '/nl/assessment', slug: 'assessment' },
  { path: '/nl/assessment/result?a=wl&st=sc&t=62&s=75&d=55&tl=70&tm=45', slug: 'assessment-result' },
  { path: '/nl/founding-member', slug: 'founding-member' },
  { path: '/nl/case-studies/skinclarity-club', slug: 'case-study-skc' },
  { path: '/nl/skills', slug: 'skills-index' },
  { path: '/nl/skills/clyde', slug: 'skill-clyde' },
  { path: '/nl/skills/social-media', slug: 'skill-social-media' },
  { path: '/nl/skills/ad-creator', slug: 'skill-ad-creator' },
  { path: '/nl/skills/lead-qualifier', slug: 'skill-lead-qualifier' },
  { path: '/nl/skills/email-management', slug: 'skill-email' },
  { path: '/nl/skills/voice-agent', slug: 'skill-voice' },
  { path: '/nl/skills/reporting', slug: 'skill-reporting' },
  { path: '/nl/skills/research', slug: 'skill-research' },
  { path: '/nl/skills/blog-factory', slug: 'skill-blog-factory' },
  { path: '/nl/skills/seo-geo', slug: 'skill-seo-geo' },
  { path: '/nl/skills/manychat', slug: 'skill-manychat' },
  { path: '/nl/skills/reel-builder', slug: 'skill-reel-builder' },
  { path: '/nl/blog', slug: 'blog-index' },
  { path: '/nl/roadmap', slug: 'roadmap' },
  { path: '/nl/logo-lab', slug: 'logo-lab' },
  { path: '/nl/legal', slug: 'legal-index' },
  { path: '/nl/legal/privacy', slug: 'legal-privacy' },
  { path: '/nl/legal/terms', slug: 'legal-terms' },
  { path: '/nl/legal/cookies', slug: 'legal-cookies' },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

type Finding = {
  page: string
  viewport: string
  severity: 'error' | 'warning' | 'info'
  category: string
  detail: string
}

const findings: Finding[] = []

function record(page: string, viewport: string, severity: Finding['severity'], category: string, detail: string) {
  findings.push({ page, viewport, severity, category, detail })
}

async function auditPage(page: Page, route: Route, viewport: { name: string; width: number; height: number }) {
  const consoleErrors: string[] = []
  const pageErrors: string[] = []
  const failedRequests: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text()
      if (
        !text.includes('Failed to load resource: net::ERR_FAILED') &&
        !text.includes('favicon') &&
        !text.includes('manifest') &&
        !text.toLowerCase().includes('speed-insights')
      ) {
        consoleErrors.push(text)
      }
    }
  })
  page.on('pageerror', (err) => pageErrors.push(err.message))
  page.on('requestfailed', (req) => {
    const url = req.url()
    if (
      !url.includes('favicon') &&
      !url.includes('manifest') &&
      !url.includes('speed-insights') &&
      !url.includes('vitals') &&
      !url.includes('analytics')
    ) {
      failedRequests.push(`${req.failure()?.errorText || 'fail'}: ${url}`)
    }
  })

  await page.setViewportSize({ width: viewport.width, height: viewport.height })

  const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' })
  const status = response?.status() ?? 0
  const expectedStatus = route.expectStatus ?? 200
  if (status !== expectedStatus) {
    record(route.slug, viewport.name, 'error', 'http', `Status ${status}, expected ${expectedStatus}`)
  }

  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
    record(route.slug, viewport.name, 'warning', 'load', 'networkidle timeout (15s)')
  })

  const title = await page.title()
  if (!title || title.length < 5) {
    record(route.slug, viewport.name, 'warning', 'seo', `Title te kort: "${title}"`)
  }

  const h1Count = await page.locator('h1').count()
  if (h1Count === 0) {
    record(route.slug, viewport.name, 'warning', 'a11y', 'Geen <h1> op pagina')
  } else if (h1Count > 1) {
    record(route.slug, viewport.name, 'info', 'a11y', `${h1Count}× <h1> (>1 is meestal niet ideaal)`)
  }

  if (route.expectedHeading) {
    const bodyText = await page.locator('body').textContent()
    if (bodyText && !route.expectedHeading.test(bodyText)) {
      record(route.slug, viewport.name, 'warning', 'content', `Expected pattern ${route.expectedHeading} niet gevonden`)
    }
  }

  const brokenImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'))
    return imgs
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => (img as HTMLImageElement).src)
  })
  for (const src of brokenImages) {
    record(route.slug, viewport.name, 'error', 'images', `Broken image: ${src}`)
  }

  const hasNav = (await page.locator('header').count()) > 0
  if (!hasNav) record(route.slug, viewport.name, 'warning', 'chrome', 'Geen <header> element')
  const hasFooter = (await page.locator('footer').count()) > 0
  if (!hasFooter) record(route.slug, viewport.name, 'warning', 'chrome', 'Geen <footer> element')

  const html = await page.content()
  if (html.includes('MISSING_MESSAGE') || html.includes('IntlError')) {
    record(route.slug, viewport.name, 'error', 'i18n', 'MISSING_MESSAGE in HTML')
  }
  if (html.includes('undefined</') || html.includes('>undefined<')) {
    record(route.slug, viewport.name, 'error', 'render', '"undefined" string in rendered HTML')
  }
  if (html.includes('&#10003;')) {
    record(route.slug, viewport.name, 'warning', 'anti-slop', '&#10003; (checkmark glyph) in HTML')
  }

  for (const err of consoleErrors) {
    record(route.slug, viewport.name, 'warning', 'console', err.slice(0, 800))
  }
  for (const err of pageErrors) {
    record(route.slug, viewport.name, 'error', 'js-error', err.slice(0, 200))
  }
  for (const fail of failedRequests) {
    record(route.slug, viewport.name, 'warning', 'network', fail.slice(0, 200))
  }

  try {
    await page.screenshot({
      path: `playwright-output/audit-final/${viewport.name}/${route.slug}.png`,
      fullPage: true,
      timeout: 25000,
      animations: 'disabled',
    })
  } catch (e) {
    record(route.slug, viewport.name, 'warning', 'screenshot', `Full-page screenshot failed: ${(e as Error).message.slice(0, 120)}`)
    try {
      await page.screenshot({
        path: `playwright-output/audit-final/${viewport.name}/${route.slug}.png`,
        fullPage: false,
        timeout: 10000,
        animations: 'disabled',
      })
    } catch (e2) {
      record(route.slug, viewport.name, 'error', 'screenshot', `Viewport screenshot also failed: ${(e2 as Error).message.slice(0, 120)}`)
    }
  }
}

test.describe('Site-wide visual + functional audit (NL, desktop + mobile)', () => {
  for (const route of NL_ROUTES) {
    for (const viewport of VIEWPORTS) {
      test(`${route.slug} @ ${viewport.name}`, async ({ page }) => {
        await auditPage(page, route, viewport)
      })
    }
  }

  test.afterAll(async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const grouped = findings.reduce<Record<string, Finding[]>>((acc, f) => {
      const key = `${f.page} :: ${f.viewport}`
      acc[key] = acc[key] || []
      acc[key].push(f)
      return acc
    }, {})

    const errCount = findings.filter((f) => f.severity === 'error').length
    const warnCount = findings.filter((f) => f.severity === 'warning').length
    const infoCount = findings.filter((f) => f.severity === 'info').length

    const lines: string[] = []
    lines.push('# Site-wide audit findings')
    lines.push('')
    lines.push(`Errors: ${errCount}  |  Warnings: ${warnCount}  |  Info: ${infoCount}`)
    lines.push('')
    if (findings.length === 0) {
      lines.push('🎉 Geen findings. Alle 33 pages × 2 viewports schoon.')
    } else {
      for (const [key, items] of Object.entries(grouped)) {
        lines.push(`## ${key}`)
        for (const item of items) {
          lines.push(`- **[${item.severity}/${item.category}]** ${item.detail}`)
        }
        lines.push('')
      }
    }

    const outDir = 'playwright-output/audit-final'
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(path.join(outDir, 'findings.md'), lines.join('\n'))
    await fs.writeFile(path.join(outDir, 'findings.json'), JSON.stringify(findings, null, 2))
    console.log(`\n=== AUDIT FINDINGS: ${errCount} errors, ${warnCount} warnings, ${infoCount} info ===`)
    console.log(`Report: ${path.join(outDir, 'findings.md')}`)
  })
})
