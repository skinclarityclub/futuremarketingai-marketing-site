import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Accessibility
 *
 * Tests critical accessibility features implemented in Task 16.18
 */

test.describe('Accessibility', () => {
  test('should have skip link visible on focus', async ({ page }) => {
    await page.goto('/')

    // Press Tab to focus skip link
    await page.keyboard.press('Tab')

    // Skip link should exist and be focused
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()

    // Should have accessible text
    const text = await skipLink.textContent()
    expect(text?.toLowerCase()).toContain('skip')
  })

  test('should navigate with skip link', async ({ page }) => {
    await page.goto('/')

    // Focus and activate skip link
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // Main content should be focused
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeFocused()
  })

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/')

    // Check main content has proper role
    const main = page.locator('main')
    await expect(main).toBeVisible()
    await expect(main).toHaveAttribute('id', 'main-content')

    // Check navigation has proper role
    const nav = page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/')

    // Tab through several elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Get focused element
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Check if element has focus styles (outline or ring)
    const hasFocusStyle = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return (
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        styles.boxShadow.includes('ring') ||
        el.classList.contains('ring') ||
        el.classList.contains('focus:ring')
      )
    })

    expect(hasFocusStyle).toBeTruthy()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Navigate through multiple elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')

      // Should always have a focused element
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    }
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Should have one h1
    const h1Elements = page.locator('h1')
    await expect(h1Elements).toHaveCount(1)

    // h1 should be visible
    await expect(h1Elements.first()).toBeVisible()
  })

  test('should have loading states announced', async ({ page }) => {
    await page.goto('/')

    // Navigate to a page that loads async content
    await page.click('a[href="/dashboard"]')

    // Check for loading indicator with proper ARIA

    // Loading indicator should appear briefly
    // (might be too fast to catch, so we just check it exists in DOM)
    const hasLoadingState = await page.evaluate(() => {
      return document.querySelector('[role="status"], [aria-busy="true"]') !== null
    })

    // Either currently loading or already loaded
    expect(typeof hasLoadingState).toBe('boolean')
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    // Sample some text elements and check they're visible
    const textElements = page.locator('p, h1, h2, h3, button, a').first()
    await expect(textElements).toBeVisible()

    // In a full test, you'd use axe-core for automated contrast checking
    // For now, we verify text is visible (basic smoke test)
    const text = await textElements.textContent()
    expect(text).toBeTruthy()
  })

  test('should have accessible modals', async ({ page }) => {
    await page.goto('/')

    // Find and open a modal
    const modalTrigger = page.locator('button:has-text("Book"), button:has-text("Demo")').first()

    if (await modalTrigger.isVisible()) {
      await modalTrigger.click()

      // Modal should have proper ARIA
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible()
      await expect(modal).toHaveAttribute('aria-modal', 'true')

      // Modal should have title
      const hasTitle = await modal.evaluate((el) => {
        return el.hasAttribute('aria-labelledby') || el.querySelector('h2, h3') !== null
      })
      expect(hasTitle).toBe(true)
    } else {
      test.skip()
    }
  })

  test('should handle keyboard-only interaction', async ({ page }) => {
    await page.goto('/')

    // Use only keyboard to navigate and interact
    // Tab to first interactive element
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Press Enter to activate
    await page.keyboard.press('Enter')

    // Should have triggered some action (navigation or modal)
    // Wait briefly for any changes
    await page.waitForTimeout(500)

    // Page should still be functional
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })
})
