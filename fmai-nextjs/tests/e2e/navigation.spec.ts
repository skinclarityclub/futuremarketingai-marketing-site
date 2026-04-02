import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Navigation & Routing — Next.js site
 *
 * Compares feature parity with Vite site navigation.
 * Next.js uses next-intl with localePrefix: 'always', so all routes start with /en/.
 */

test.describe('Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Verify page title is set
    const title = await page.title()
    expect(title.length).toBeGreaterThan(5)

    // Verify main heading is visible
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should redirect root to default locale', async ({ page }) => {
    await page.goto('/')
    // Middleware redirects / to /en
    await expect(page).toHaveURL(/\/en/, { timeout: 10000 })
  })

  test('should navigate between main pages via header', async ({ page }) => {
    await page.goto('/en')

    // Navigate to Pricing
    await page.click('a[href*="/pricing"]')
    await expect(page).toHaveURL(/\/en\/pricing/)
    await expect(page.locator('h1').first()).toBeVisible()

    // Navigate to About
    await page.click('a[href*="/about"]')
    await expect(page).toHaveURL(/\/en\/about/)
    await expect(page.locator('h1').first()).toBeVisible()

    // Navigate to Contact
    await page.click('a[href*="/contact"]')
    await expect(page).toHaveURL(/\/en\/contact/)
    await expect(page.locator('h1').first()).toBeVisible()

    // Navigate back to Home via logo
    await page.click('a[aria-label="FutureMarketingAI home"]')
    await expect(page).toHaveURL(/\/en$/)
  })

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/en')

    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()

    // Desktop nav links should be present
    const navLinks = nav.locator('a, button')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(3)
  })

  test('should navigate to service pages via Services dropdown', async ({ page }) => {
    await page.goto('/en')

    // Hover over Services to open dropdown
    const servicesButton = page.locator('button:has-text("Services")')
    await servicesButton.hover()

    // Wait for dropdown
    const dropdown = page.locator('[role="menu"]')
    await expect(dropdown).toBeVisible()

    // Click on AI Chatbots
    await page.click('[role="menuitem"]:has-text("AI Chatbots")')
    await expect(page).toHaveURL(/\/en\/chatbots/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should have footer with navigation links', async ({ page }) => {
    await page.goto('/en')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Footer should have service links
    const footerLinks = footer.locator('a')
    const count = await footerLinks.count()
    expect(count).toBeGreaterThan(5)
  })

  test('should maintain scroll position (reset on navigate)', async ({ page }) => {
    await page.goto('/en')

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))

    // Navigate to another page
    await page.click('a[href*="/pricing"]')
    await expect(page).toHaveURL(/\/en\/pricing/)

    // Should be at top of new page
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100)
  })

  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.goto('/en/non-existent-page-xyz')

    // Should show 404 page or redirect
    // Next.js returns 404 status for not-found pages
    if (response) {
      expect([200, 404]).toContain(response.status())
    }

    // Page should still render without crash
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Service Pages', () => {
  const servicePages = [
    { path: '/en/chatbots', name: 'Chatbots' },
    { path: '/en/automations', name: 'Automations' },
    { path: '/en/voice-agents', name: 'Voice Agents' },
    { path: '/en/marketing-machine', name: 'Marketing Machine' },
  ]

  for (const { path, name } of servicePages) {
    test(`should load ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    })
  }
})

test.describe('Marketing Pages', () => {
  const marketingPages = [
    { path: '/en/about', name: 'About' },
    { path: '/en/pricing', name: 'Pricing' },
    { path: '/en/contact', name: 'Contact' },
    { path: '/en/how-it-works', name: 'How It Works' },
  ]

  for (const { path, name } of marketingPages) {
    test(`should load ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    })
  }
})
