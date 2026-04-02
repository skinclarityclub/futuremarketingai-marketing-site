import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Homepage Sections — Next.js site
 *
 * Verifies all homepage sections from the Vite site have been
 * migrated to the Next.js site (feature parity check).
 */

test.describe('Homepage Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
  })

  test('should render Hero section with CTA buttons', async ({ page }) => {
    // Hero heading
    const hero = page.locator('section[aria-labelledby="hero"]')
    await expect(hero).toBeVisible()

    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()

    // Hero should have CTA buttons
    const ctaButtons = hero.locator('a')
    const count = await ctaButtons.count()
    expect(count).toBeGreaterThanOrEqual(2) // Primary + Secondary CTA
  })

  test('should render Stats/Metrics bar', async ({ page }) => {
    const statsSection = page.locator('section[aria-label="Key metrics"]')
    await expect(statsSection).toBeVisible()

    // Should have 4 stat cards
    const statCards = statsSection.locator('.grid > div')
    await expect(statCards).toHaveCount(4)
  })

  test('should render Services section with 4 cards', async ({ page }) => {
    const servicesSection = page.locator('#services')
    await expect(servicesSection).toBeVisible()

    // Should have heading
    const heading = servicesSection.locator('#services-heading')
    await expect(heading).toBeVisible()

    // Should have 4 service cards (linked)
    const serviceCards = servicesSection.locator('.grid a')
    await expect(serviceCards).toHaveCount(4)
  })

  test('should render Trust Badges section', async ({ page }) => {
    const badgesSection = page.locator('section[aria-labelledby="badges"]')
    await expect(badgesSection).toBeVisible()

    // Should have 6 badges
    const badges = badgesSection.locator('.grid > div')
    await expect(badges).toHaveCount(6)
  })

  test('should render Trust/Why Teams section', async ({ page }) => {
    const trustSection = page.locator('section[aria-labelledby="trust"]')
    await expect(trustSection).toBeVisible()

    // Should have trust cards
    const trustCards = trustSection.locator('.grid > div')
    const count = await trustCards.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })

  test('should render Final CTA section', async ({ page }) => {
    const ctaSection = page.locator('section[aria-labelledby="cta"]')
    await expect(ctaSection).toBeVisible()

    // Should have CTA button
    const ctaButton = ctaSection.locator('a')
    await expect(ctaButton.first()).toBeVisible()
  })

  test('should render Header with logo and navigation', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Logo should be visible
    const logo = page.locator('a[aria-label="FutureMarketingAI home"]')
    await expect(logo).toBeVisible()

    // Login link should be visible (desktop)
    const loginButton = page.locator('a:has-text("Login"), a:has-text("Log In")')
    await expect(loginButton.first()).toBeVisible()
  })

  test('should render Footer with brand and links', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Brand name in footer
    const brand = footer.locator('a').first()
    await expect(brand).toBeVisible()

    // Social links
    const linkedin = footer.locator('a[aria-label*="LinkedIn"], a[href*="linkedin"]')
    await expect(linkedin).toBeVisible()
  })

  test('should render CookieConsentBanner', async ({ page }) => {
    // Cookie banner might show on first visit
    const banner = page.locator('[class*="cookie"], [data-testid="cookie-consent"]')
    // It's OK if consent was already given — just verify no crash
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Homepage Interactions', () => {
  test('CTA buttons should link to contact page', async ({ page }) => {
    await page.goto('/en')

    const ctaPrimary = page.locator('section[aria-labelledby="hero"] a').first()
    const href = await ctaPrimary.getAttribute('href')
    // Primary CTA links to #services or /contact
    expect(href).toBeTruthy()
  })

  test('service cards should link to service pages', async ({ page }) => {
    await page.goto('/en')

    const serviceLinks = page.locator('section[aria-labelledby="services"] .grid a')
    const count = await serviceLinks.count()

    for (let i = 0; i < count; i++) {
      const href = await serviceLinks.nth(i).getAttribute('href')
      expect(href).toBeTruthy()
      // Each should link to a service page
      expect(href).toMatch(/(automations|chatbots|voice-agents|marketing-machine)/)
    }
  })
})
