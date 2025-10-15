import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Navigation & Routing
 *
 * Tests critical navigation paths and page loading
 */

test.describe('Navigation', () => {
  test('should load homepage successfully', async ({ page }) => {
    // Go to homepage
    await page.goto('/')

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Verify page title
    await expect(page).toHaveTitle(/FutureMarketingAI/)

    // Verify main heading is visible
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('should navigate between all main pages', async ({ page }) => {
    await page.goto('/')

    // Navigate to Explorer
    await page.click('a[href="/explorer"]')
    await expect(page).toHaveURL('/explorer')
    await expect(page.locator('h1')).toBeVisible()

    // Navigate to Calculator
    await page.click('a[href="/calculator"]')
    await expect(page).toHaveURL('/calculator')
    await expect(page.locator('h1')).toBeVisible()

    // Navigate to Dashboard
    await page.click('a[href="/dashboard"]')
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toBeVisible()

    // Navigate back to Home
    await page.click('a[href="/"]')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have working floating navigation', async ({ page }) => {
    await page.goto('/')

    // Floating nav should be visible
    const floatingNav = page
      .locator('nav[aria-label*="navigation"], nav[role="navigation"]')
      .first()
    await expect(floatingNav).toBeVisible()

    // Verify navigation links are present
    const navLinks = floatingNav.locator('a')
    await expect(navLinks).toHaveCount(4) // Home, Explorer, Calculator, Dashboard
  })

  test('should maintain scroll position when navigating', async ({ page }) => {
    await page.goto('/')

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))

    // Navigate to another page
    await page.click('a[href="/explorer"]')
    await expect(page).toHaveURL('/explorer')

    // Should be at top of new page
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(100) // Near top
  })

  test('should handle 404 gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page')

    // Should either show 404 or redirect to home
    // In SPA, typically redirects to home
    await expect(page).toHaveURL(/\/$/)
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Press Tab to focus skip link
    await page.keyboard.press('Tab')

    // Skip link should be visible when focused
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()

    // Press Enter to use skip link
    await page.keyboard.press('Enter')

    // Main content should be focused
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeFocused()
  })
})
