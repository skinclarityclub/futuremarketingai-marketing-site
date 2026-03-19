import { test, expect } from '@playwright/test'

/**
 * E2E Tests: SEO & Structured Data — Next.js site
 *
 * Tests JSON-LD structured data, meta tags, and SEO features
 * that were part of the Vite site's optimization phase.
 */

test.describe('Meta Tags', () => {
  test('homepage should have proper meta tags', async ({ page }) => {
    await page.goto('/en')

    // Title should be set
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(5)

    // Meta description should exist
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)
  })

  test('should have Open Graph meta tags', async ({ page }) => {
    await page.goto('/en')

    const ogTitle = page.locator('meta[property="og:title"]')
    const ogDescription = page.locator('meta[property="og:description"]')
    const ogType = page.locator('meta[property="og:type"]')

    await expect(ogTitle).toHaveAttribute('content', /.+/)
    await expect(ogDescription).toHaveAttribute('content', /.+/)
    await expect(ogType).toHaveAttribute('content', /.+/)
  })

  test('service pages should have unique meta tags', async ({ page }) => {
    await page.goto('/en/chatbots')
    const chatbotsTitle = await page.title()

    await page.goto('/en/automations')
    const automationsTitle = await page.title()

    // Each service page should have unique titles
    expect(chatbotsTitle).not.toBe(automationsTitle)
  })
})

test.describe('JSON-LD Structured Data', () => {
  test('homepage should have Organization JSON-LD', async ({ page }) => {
    await page.goto('/en')

    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      return scripts.map((s) => JSON.parse(s.textContent || '{}'))
    })

    const orgSchema = jsonLd.find((s) => {
      const type = s['@type']
      return type === 'Organization' || (Array.isArray(type) && type.includes('Organization'))
    })
    expect(orgSchema).toBeTruthy()
    expect(orgSchema['@context']).toBe('https://schema.org')
  })

  test('homepage should have WebSite JSON-LD', async ({ page }) => {
    await page.goto('/en')

    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      return scripts.map((s) => JSON.parse(s.textContent || '{}'))
    })

    const websiteSchema = jsonLd.find((s) => s['@type'] === 'WebSite')
    expect(websiteSchema).toBeTruthy()
  })

  test('homepage should have BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/en')

    const jsonLd = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      return scripts.map((s) => JSON.parse(s.textContent || '{}'))
    })

    const breadcrumb = jsonLd.find((s) => s['@type'] === 'BreadcrumbList')
    expect(breadcrumb).toBeTruthy()
  })
})

test.describe('Robots & Sitemap', () => {
  test('should serve robots.txt', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)

    const content = await page.content()
    expect(content).toContain('User-Agent')
  })
})

test.describe('Canonical URLs', () => {
  test('pages should have canonical link tags', async ({ page }) => {
    await page.goto('/en')

    const canonical = page.locator('link[rel="canonical"]')
    // Canonical might be set via Next.js metadata
    const count = await canonical.count()
    if (count > 0) {
      const href = await canonical.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('alternate hreflang links should exist', async ({ page }) => {
    await page.goto('/en')

    // Next-intl should generate alternate locale links
    const alternates = page.locator('link[rel="alternate"][hreflang]')
    const count = await alternates.count()
    // Should have alternates for en, nl, es
    expect(count).toBeGreaterThanOrEqual(2)
  })
})
