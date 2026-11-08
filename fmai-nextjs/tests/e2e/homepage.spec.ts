import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Homepage Sections
 *
 * Verifies homepage sections render with the ServicesBento structure
 * (9 skill-page links: Clyde tile + 8 live services; the 2 coming-soon tiles link to /skills#binnenkort).
 */

test.describe('Homepage Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should render Hero section with CTA buttons', async ({ page }) => {
    // Desktop hero is role=heading aria-level=1; the one <h1> belongs to the mobile hero.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Hero region has id="hero" wrapping section
    const heroLinks = page.locator('a').filter({ hasText: /Plan een gesprek|Book a call|Agenda una llamada|Meet Clyde/i })
    expect(await heroLinks.count()).toBeGreaterThanOrEqual(1)
  })

  // Sections below the fold are wrapped in LazySection (IntersectionObserver
  // with rootMargin: 200px). LazySection only inserts its children when its
  // wrapper div enters the viewport, so we must scroll progressively until
  // the target selector appears in the DOM, then wait for it to be visible.
  async function scrollUntilVisible(
    page: import('@playwright/test').Page,
    selector: string
  ) {
    const locator = page.locator(selector)
    // 50×500 = 25 000 px scroll budget — W2 homepage has 17 sections,
    // total height ≈ 7000-9000 px depending on viewport.
    for (let i = 0; i < 50; i++) {
      if ((await locator.count()) > 0) break
      await page.evaluate(() => window.scrollBy(0, 500))
      await page.waitForTimeout(150)
    }
    await locator.scrollIntoViewIfNeeded()
    await locator.waitFor({ state: 'visible', timeout: 5000 })
  }

  // The Stats/Metrics bar left on 2026-10-12 (a7fe90e4): no number without a measurement.

  test('should render Services section with 9 skill links', async ({ page }) => {
    await scrollUntilVisible(page,'#services')
    const servicesSection = page.locator('#services')
    await expect(servicesSection).toBeVisible()

    const heading = servicesSection.locator('#services-heading')
    await expect(heading).toBeVisible()

    const serviceCards = servicesSection.locator('.grid a[href*="/skills/"]')
    // Golf 9a (#105): ManyChat folded into lead-qualifier, voice + reel are coming soon
    await expect(serviceCards).toHaveCount(9)
  })

  test('should render Pillars bento section', async ({ page }) => {
    await scrollUntilVisible(page,'section[aria-labelledby="pillars"]')
    const pillarsSection = page.locator('section[aria-labelledby="pillars"]')
    await expect(pillarsSection).toBeVisible()
  })

  test('should render Final CTA section', async ({ page }) => {
    await scrollUntilVisible(page,'section[aria-labelledby="cta"]')
    const ctaSection = page.locator('section[aria-labelledby="cta"]').first()
    await expect(ctaSection).toBeVisible()

    const ctaButton = ctaSection.locator('a').first()
    await expect(ctaButton).toBeVisible()
  })

  test('should render Header with logo and navigation', async ({ page }) => {
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Logo link to home (the FMai header has an aria-label or text "FutureMarketingAI")
    const logo = header.locator('a').first()
    await expect(logo).toBeVisible()
  })

  test('should render Footer with brand and links', async ({ page }) => {
    // W2 reorder: page is much longer (17 sections), so scroll to bottom to
    // trigger any LazySection between hero and footer before asserting.
    // Use role=contentinfo to target the site footer specifically — several
    // card components (CaseStudyCard, ClydeFeaturedTile, etc.) legitimately
    // use <footer> inside <article>, which makes a plain 'footer' selector
    // ambiguous in strict mode.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()

    const brand = footer.locator('a').first()
    await expect(brand).toBeVisible()

    const linkedin = footer.locator('a[aria-label*="LinkedIn"], a[href*="linkedin"]')
    await expect(linkedin.first()).toBeVisible()
  })

  test('should render without crash and have body visible', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Homepage Interactions', () => {
  test('hero CTA buttons should have valid hrefs', async ({ page }) => {
    await page.goto('/en')
    const ctaPrimary = page.locator('main a').first()
    const href = await ctaPrimary.getAttribute('href')
    expect(href).toBeTruthy()
  })

  test('service cards should link to skill pages', async ({ page }) => {
    await page.goto('/en')
    // Inline scroll-and-wait since this is the "Interactions" describe, no
    // beforeEach helper available.
    for (let i = 0; i < 20; i++) {
      if ((await page.locator('#services').count()) > 0) break
      await page.evaluate(() => window.scrollBy(0, 500))
      await page.waitForTimeout(150)
    }
    await page.locator('#services').scrollIntoViewIfNeeded()
    await page.locator('#services').waitFor({ state: 'visible', timeout: 5000 })

    const serviceLinks = page.locator('#services .grid a[href*="/skills/"]')
    await expect(serviceLinks).toHaveCount(9)

    const count = await serviceLinks.count()
    for (let i = 0; i < count; i++) {
      const href = await serviceLinks.nth(i).getAttribute('href')
      expect(href).toBeTruthy()
      expect(href).toMatch(/\/skills\//)
    }
  })
})
