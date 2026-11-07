import { test, expect, type Page } from '@playwright/test'

// Golf 8b: below 1280px the header links sit behind the menu button, so open it when it shows.
async function clickHeaderLink(page: Page, part: string) {
  const menuButton = page.locator('button[aria-controls="mobile-menu"]')
  if (await menuButton.isVisible()) await menuButton.click()
  await page.locator(`header a[href*="${part}"]:visible`).first().click()
}

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

    await clickHeaderLink(page, '/pricing')
    await expect(page).toHaveURL(/\/en\/pricing/)
    await expect(page.locator('h1').first()).toBeVisible()

    await clickHeaderLink(page, '/about')
    await expect(page).toHaveURL(/\/en\/about/)
    await expect(page.locator('h1').first()).toBeVisible()

    // Contact is not in the header (footer, Company): any visible link to it
    await page.locator('a[href*="/contact"]:visible').first().click()
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
    await clickHeaderLink(page, '/pricing')
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
    { path: '/en/assessment', name: 'Assessment' },
    { path: '/en/case-studies', name: 'Cases' },
    { path: '/en/case-studies/skinclarity-club', name: 'Case Study SKC' },
    { path: '/en/case-studies/saleslobe', name: 'Case Study SalesLobe' },
    { path: '/en/client-portal', name: 'Client Portal' },
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
    'reporting',
    'strategy',
    'seo-geo',
    'ad-creator',
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
