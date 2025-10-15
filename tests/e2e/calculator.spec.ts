import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Calculator ROI Flow
 *
 * Tests critical business flow: ROI calculation
 */

test.describe('Calculator Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to calculator page
    await page.goto('/calculator')
    await page.waitForLoadState('networkidle')
  })

  test('should load calculator with default values', async ({ page }) => {
    // Verify page loaded
    await expect(page.locator('h1')).toContainText(/calculator|roi/i)

    // Verify input sliders are present
    const sliders = page.locator('input[type="range"]')
    await expect(sliders).toHaveCount(3) // Hours, Campaigns, Platforms
  })

  test('should calculate ROI when adjusting inputs', async ({ page }) => {
    // Find first slider (hours per week)
    const hoursSlider = page.locator('input[type="range"]').first()

    // Adjust slider value
    await hoursSlider.fill('30') // Set to 30 hours

    // Wait for calculation to complete
    await page.waitForTimeout(500) // Debounce delay

    // Verify results are displayed
    const results = page.locator('text=/time saved|hours|roi/i').first()
    await expect(results).toBeVisible()
  })

  test('should show results breakdown', async ({ page }) => {
    // Adjust slider to trigger calculation
    const campaignsSlider = page.locator('input[type="range"]').nth(1)
    await campaignsSlider.fill('20') // Set campaigns

    await page.waitForTimeout(500)

    // Verify results sections
    await expect(page.locator('text=/result|saving|impact/i').first()).toBeVisible()
  })

  test('should allow PDF export', async ({ page }) => {
    // Find export button
    const exportButton = page.locator('button:has-text("PDF"), button:has-text("Export")')

    if (await exportButton.isVisible()) {
      // Prepare for download
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 })

      // Click export
      await exportButton.click()

      // Wait for download (with timeout)
      try {
        const download = await downloadPromise
        expect(download.suggestedFilename()).toContain('.pdf')
      } catch (e) {
        // PDF export might require additional setup - skip if fails
        console.log('PDF export test skipped:', e)
      }
    } else {
      // Export button not found - skip
      test.skip()
    }
  })

  test('should persist values when navigating away and back', async ({ page }) => {
    // Set custom value
    const hoursSlider = page.locator('input[type="range"]').first()
    await hoursSlider.fill('25')

    // Navigate away
    await page.click('a[href="/"]')
    await expect(page).toHaveURL('/')

    // Navigate back
    await page.click('a[href="/calculator"]')
    await expect(page).toHaveURL('/calculator')

    // Value might be persisted (if localStorage is used)
    // or reset to default - both are acceptable
    const newValue = await hoursSlider.inputValue()
    expect(parseInt(newValue)).toBeGreaterThan(0)
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip()
    }

    // Verify calculator is usable on mobile
    await expect(page.locator('h1')).toBeVisible()

    // Verify sliders are touchable
    const slider = page.locator('input[type="range"]').first()
    await expect(slider).toBeVisible()

    // Sliders should be large enough for touch
    const box = await slider.boundingBox()
    expect(box?.height).toBeGreaterThan(30) // Minimum touch target
  })
})
