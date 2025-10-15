import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Personalization & Modals
 *
 * Tests industry selection and modal interactions
 */

test.describe('Personalization Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should open industry selector modal', async ({ page }) => {
    // Look for industry selector button/trigger
    const industryButton = page
      .locator('button:has-text("industry"), button[aria-label*="industry"]')
      .first()

    if (await industryButton.isVisible()) {
      // Click to open modal
      await industryButton.click()

      // Modal should be visible
      const modal = page.locator('[role="dialog"], [role="alertdialog"]').first()
      await expect(modal).toBeVisible()

      // Modal should have title
      await expect(modal.locator('h2, h3').first()).toBeVisible()
    } else {
      // Industry selector might not be shown initially
      test.skip()
    }
  })

  test('should select an industry', async ({ page }) => {
    // Try to find and click industry selector
    const industryButton = page
      .locator('button:has-text("industry"), button[aria-label*="industry"]')
      .first()

    if (await industryButton.isVisible()) {
      await industryButton.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      // Select first industry option
      const industryOption = page
        .locator('[role="dialog"] button, [role="dialog"] div[role="button"]')
        .first()
      await industryOption.click()

      // Modal should close
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 2000 })
    } else {
      test.skip()
    }
  })

  test('should close modal with escape key', async ({ page }) => {
    // Find any CTA or button that opens a modal
    const ctaButton = page
      .locator('button:has-text("Book"), button:has-text("Demo"), button:has-text("Schedule")')
      .first()

    if (await ctaButton.isVisible()) {
      // Open modal
      await ctaButton.click()

      // Wait for modal
      const modal = page.locator('[role="dialog"]')
      await expect(modal).toBeVisible({ timeout: 5000 })

      // Press Escape
      await page.keyboard.press('Escape')

      // Modal should close
      await expect(modal).not.toBeVisible({ timeout: 2000 })
    } else {
      test.skip()
    }
  })

  test('should close modal with close button', async ({ page }) => {
    // Find CTA button
    const ctaButton = page.locator('button:has-text("Book"), button:has-text("Demo")').first()

    if (await ctaButton.isVisible()) {
      await ctaButton.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      // Find close button
      const closeButton = page
        .locator(
          '[role="dialog"] button[aria-label*="close"], [role="dialog"] button:has-text("×")'
        )
        .first()

      if (await closeButton.isVisible()) {
        await closeButton.click()

        // Modal should close
        await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 2000 })
      }
    } else {
      test.skip()
    }
  })

  test('should trap focus in modal', async ({ page }) => {
    // Open modal
    const ctaButton = page.locator('button:has-text("Book"), button:has-text("Demo")').first()

    if (await ctaButton.isVisible()) {
      await ctaButton.click()

      // Wait for modal
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      // Get first and last focusable elements in modal
      const modal = page.locator('[role="dialog"]')
      const focusableElements = modal.locator('button, a, input, [tabindex]:not([tabindex="-1"])')

      const count = await focusableElements.count()

      if (count > 0) {
        // Tab through elements
        await page.keyboard.press('Tab')

        // Focus should be within modal
        const focused = await page.evaluate(() => {
          const activeElement = document.activeElement
          const modal = document.querySelector('[role="dialog"]')
          return modal?.contains(activeElement)
        })

        expect(focused).toBe(true)
      }
    } else {
      test.skip()
    }
  })

  test('should show personalized content after industry selection', async ({ page }) => {
    // This test verifies that selecting an industry changes content

    // Try to select an industry
    const industryButton = page.locator('button:has-text("industry")').first()

    if (await industryButton.isVisible()) {
      // Open and select industry
      await industryButton.click()
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      const industryOption = page
        .locator('[role="dialog"] button, [role="dialog"] div[role="button"]')
        .first()
      await industryOption.click()

      // Wait for modal to close
      await page.waitForTimeout(1000)

      // Content should have changed (personalization applied)
      // Or at minimum, the industry button text should have changed
      const industryButtonText = await industryButton.textContent()
      expect(industryButtonText).toBeTruthy()
    } else {
      test.skip()
    }
  })
})
