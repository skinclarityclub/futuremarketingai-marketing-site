import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Performance & Error Checks — Next.js site
 *
 * Ensures no console errors, fast loading, and proper asset delivery.
 */

test.describe('Console Errors', () => {
  test('homepage should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Filter out known benign errors (hydration warnings, etc.)
    const criticalErrors = consoleErrors.filter(
      (e) =>
        !e.includes('hydration') &&
        !e.includes('Hydration') &&
        !e.includes('favicon') &&
        !e.includes('404')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should not have broken network requests on homepage', async ({ page }) => {
    const failedRequests: string[] = []
    page.on('requestfailed', (request) => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`)
    })

    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Filter out external/third-party failures
    const internalFailures = failedRequests.filter(
      (r) => r.includes('localhost') || r.includes('future-marketing')
    )
    expect(internalFailures).toHaveLength(0)
  })
})

test.describe('Page Load Performance', () => {
  test('homepage should load within 10 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - start

    // Dev server with cold compile can be slow
    expect(loadTime).toBeLessThan(10000)
  })

  test('service page should load within 10 seconds', async ({ page }) => {
    // Dev server cold-compiles on first visit, so generous timeout
    const start = Date.now()
    await page.goto('/en/chatbots')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(10000)
  })
})

test.describe('Asset Loading', () => {
  test('should load CSS (not unstyled content)', async ({ page }) => {
    await page.goto('/en')

    // Check that body has a background color set (dark theme)
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    // Should not be default white
    expect(bgColor).not.toBe('rgb(255, 255, 255)')
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('should load fonts', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Check that custom font is applied
    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily
    })

    // Should have custom font (DM Sans or similar), not default serif
    expect(fontFamily).not.toContain('Times')
  })
})

test.describe('No OpenAI References', () => {
  test('should not reference openai in page-level scripts (AI SDK excluded)', async ({ page }) => {
    const openaiScripts: string[] = []

    page.on('response', async (response) => {
      const url = response.url()
      if ((url.endsWith('.js') || url.endsWith('.mjs')) && url.includes('localhost')) {
        try {
          const body = await response.text()
          if (body.includes('openai') || body.includes('OpenAI')) {
            openaiScripts.push(url)
          }
        } catch {
          // Ignore network errors
        }
      }
    })

    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    // Vercel AI SDK may reference 'openai' as a provider name — filter those out
    const nonSdkRefs = openaiScripts.filter(
      (url) => !url.includes('_ai_') && !url.includes('ai_dist')
    )
    expect(nonSdkRefs).toHaveLength(0)
  })
})
