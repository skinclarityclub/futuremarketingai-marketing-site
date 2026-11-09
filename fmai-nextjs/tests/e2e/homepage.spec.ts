import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Homepage Sections
 *
 * Golf 10 (Daley 2026-11-08: "/en = /nl-structuur"): /en renders the same twelve sections as /nl, in the same
 * order. The old /en home (ServicesBento with 9 skill links, Pillars bento, Final CTA) is gone on purpose.
 */

const SECTIONS = [
  'hero',
  'een-week-met-clyde',
  'regie',
  'klant',
  'werk',
  'aanvraag',
  'waarom',
  'klanten',
  'start',
  'prijs',
  'vragen',
  'afsluiting',
]

test('/en and /nl render the same twelve sections in the same order', async ({ page }) => {
  for (const locale of ['en', 'nl']) {
    await page.goto(`/${locale}`)
    const ids = await page
      .locator('main section[id]')
      .evaluateAll((els) => els.filter((el) => !el.parentElement?.closest('section')).map((el) => el.id))
    expect(ids, `/${locale}`).toEqual(SECTIONS)
  }
})

test.describe('Homepage Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should render Hero section with CTA buttons', async ({ page }) => {
    await expect(page.locator('#hero h1')).toHaveText('More clients per team member.')
    const ctas = page.locator('#hero .ctas a')
    await expect(ctas.first()).toHaveAttribute('href', '/en/apply')
    await expect(ctas.first()).toContainText('Request a call')
    await expect(ctas.nth(1)).toHaveAttribute('href', '#een-week-met-clyde')
  })

  test('should render the closing section with the call link', async ({ page }) => {
    const cta = page.locator('#afsluiting a[href="/en/apply"]').first()
    await cta.scrollIntoViewIfNeeded()
    await expect(cta).toBeVisible()
    await expect(cta).toContainText('Request a call')
  })

  test('should render Header with logo and navigation', async ({ page }) => {
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Logo link to home (the FMai header has an aria-label or text "FutureMarketingAI")
    const logo = header.locator('a').first()
    await expect(logo).toBeVisible()
  })

  test('should render Footer with brand and links', async ({ page }) => {
    // Use role=contentinfo to target the site footer specifically: card components may use <footer> inside
    // <article>, which makes a plain 'footer' selector ambiguous in strict mode.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const footer = page.getByRole('contentinfo')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeVisible()

    const brand = footer.locator('a').first()
    await expect(brand).toBeVisible()

    const linkedin = footer.locator('a[aria-label*="LinkedIn"], a[href*="linkedin"]')
    await expect(linkedin.first()).toBeVisible()
  })

  test('should render without crash and have body visible', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Homepage Interactions', () => {
  test('hero CTA buttons should have valid hrefs', async ({ page }) => {
    await page.goto('/en')
    const ctaPrimary = page.locator('main a').first()
    const href = await ctaPrimary.getAttribute('href')
    expect(href).toBeTruthy()
  })
})
