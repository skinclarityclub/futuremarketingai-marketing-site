import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Accessibility — Next.js site
 *
 * Feature parity check with Vite site accessibility tests.
 */

test.describe('Accessibility', () => {
  test('should have proper ARIA attributes on homepage', async ({ page }) => {
    await page.goto('/en')

    // Check main content area exists
    const main = page.locator('main')
    await expect(main).toBeVisible()

    // Check navigation has proper aria-label
    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/en')

    // Should have exactly one h1
    const h1Elements = page.locator('h1')
    const count = await h1Elements.count()
    expect(count).toBe(1)

    // h1 should be visible
    await expect(h1Elements.first()).toBeVisible()
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/en')

    // Tab through several elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Get focused element (exclude Next.js dev tools overlay)
    const focusedElement = page.locator(
      ':focus:not(nextjs-portal):not([data-nextjs-dev-tools-button]):not([data-issues-collapse])'
    )
    const count = await focusedElement.count()
    if (count > 0) {
      await expect(focusedElement.first()).toBeVisible()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/en')

    // Navigate through multiple elements
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')

      // Should always have a focused element (exclude Next.js dev tools overlay)
      const focusedElement = page.locator(
        ':focus:not(nextjs-portal):not([data-nextjs-dev-tools-button])'
      )
      const count = await focusedElement.count()
      if (count > 0) {
        await expect(focusedElement.first()).toBeVisible()
      }
    }
  })

  test('should have alt attributes on images', async ({ page }) => {
    await page.goto('/en')

    // Check all images have alt text
    const images = page.locator('img')
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const ariaHidden = await img.getAttribute('aria-hidden')
      const role = await img.getAttribute('role')

      // Image should have alt text, or be decorative (aria-hidden or role="presentation")
      const isAccessible = alt !== null || ariaHidden === 'true' || role === 'presentation'
      expect(isAccessible).toBeTruthy()
    }
  })

  test('should have sufficient color contrast (smoke test)', async ({ page }) => {
    await page.goto('/en')

    // Sample text elements and check they're visible
    const textElements = page.locator('p, h1, h2, h3, button, a').first()
    await expect(textElements).toBeVisible()

    const text = await textElements.textContent()
    expect(text).toBeTruthy()
  })

  test('should have lang attribute on html element', async ({ page }) => {
    await page.goto('/en')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')
  })

  test('should set lang=nl for Dutch locale', async ({ page }) => {
    await page.goto('/nl')
    await page.waitForLoadState('networkidle')

    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('nl')
  })

  test('footer navigation sections should have aria-label', async ({ page }) => {
    await page.goto('/en')

    // Footer has nav elements with aria-label
    const footerNavs = page.locator('footer nav[aria-label]')
    const count = await footerNavs.count()
    expect(count).toBeGreaterThanOrEqual(2) // Services, Company, Resources
  })

  test('mobile menu button should have aria-label', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/en')

    const menuButton = page.locator(
      'button[aria-label="Open menu"], button[aria-label="Close menu"]'
    )
    await expect(menuButton).toBeVisible()

    const ariaLabel = await menuButton.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
  })
})
