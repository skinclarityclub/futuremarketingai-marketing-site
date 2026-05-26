import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Navigation & Routing
 *
 * Next.js uses next-intl with localePrefix: 'always'; all routes start with /en/.
 */

test.describe('Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    const title = await page.title()
    expect(title.length).toBeGreaterThan(5)

    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should redirect root to default locale', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/en/, { timeout: 10000 })
  })

  test('should navigate between main pages via header', async ({ page }) => {
    await page.goto('/en')

    await page.locator('a[href*="/pricing"]').first().click()
    await expect(page).toHaveURL(/\/en\/pricing/)
    await expect(page.locator('h1').first()).toBeVisible()

    await page.locator('a[href*="/about"]').first().click()
    await expect(page).toHaveURL(/\/en\/about/)
    await expect(page.locator('h1').first()).toBeVisible()

    await page.locator('a[href*="/contact"]').first().click()
    await expect(page).toHaveURL(/\/en\/contact/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should have working header navigation', async ({ page }) => {
    await page.goto('/en')
    const header = page.locator('header').first()
    await expect(header).toBeVisible()
    const navLinks = header.locator('a, button')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(3)
  })

  test('should have footer with navigation links', async ({ page }) => {
    await page.goto('/en')
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()
    const footerLinks = footer.locator('a')
    const count = await footerLinks.count()
    expect(count).toBeGreaterThan(5)
  })

  test('should maintain scroll position (reset on navigate)', async ({ page }) => {
    await page.goto('/en')
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.locator('a[href*="/pricing"]').first().click()
    await expect(page).toHaveURL(/\/en\/pricing/)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100)
  })

  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.goto('/en/non-existent-page-xyz')
    if (response) {
      expect([200, 404]).toContain(response.status())
    }
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Marketing Pages', () => {
  const marketingPages = [
    { path: '/en/about', name: 'About' },
    { path: '/en/pricing', name: 'Pricing' },
    { path: '/en/contact', name: 'Contact' },
    { path: '/en/how-it-works', name: 'How It Works' },
    { path: '/en/memory', name: 'Memory' },
    { path: '/en/apply', name: 'Apply' },
    { path: '/en/founding-member', name: 'Founding Member' },
    { path: '/en/assessment', name: 'Assessment' },
    { path: '/en/roadmap', name: 'Roadmap' },
    { path: '/en/case-studies/skinclarity-club', name: 'Case Study SKC' },
  ]

  for (const { path, name } of marketingPages) {
    test(`should load ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    })
  }
})

test.describe('Skill Pages', () => {
  const skills = [
    'clyde',
    'social-media',
    'blog-factory',
    'lead-qualifier',
    'email-management',
    'manychat',
    'reporting',
    'research',
    'seo-geo',
    'voice-agent',
    'ad-creator',
    'reel-builder',
  ]

  for (const slug of skills) {
    test(`should load /skills/${slug}`, async ({ page }) => {
      await page.goto(`/en/skills/${slug}`)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    })
  }
})

test.describe('Legal Pages', () => {
  const legalPages = [
    { path: '/en/legal', name: 'Legal index' },
    { path: '/en/legal/privacy', name: 'Privacy' },
    { path: '/en/legal/terms', name: 'Terms' },
    { path: '/en/legal/cookies', name: 'Cookies' },
  ]

  for (const { path, name } of legalPages) {
    test(`should load ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }
})
