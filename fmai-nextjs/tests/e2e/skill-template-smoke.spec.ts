import { test, expect } from '@playwright/test'

const SKILLS = ['clyde', 'social-media', 'voice-agent', 'research'] as const

for (const slug of SKILLS) {
  test(`skill page ${slug} renders with new template parts`, async ({ page }) => {
    await page.goto(`/nl/skills/${slug}`)
    await page.waitForLoadState('domcontentloaded')

    // Hero heading visible
    await expect(page.locator('h1').first()).toBeVisible()

    // Eyebrows present (mono uppercase tracking sections)
    const eyebrowCount = await page.locator('.font-mono.uppercase').count()
    expect(eyebrowCount).toBeGreaterThan(0)

    // FAQ accordion rendered (Radix Root)
    const faqRoot = page.locator('[data-orientation="vertical"]').first()
    await expect(faqRoot).toBeVisible({ timeout: 10_000 })

    // Related skills section heading present
    await expect(page.locator('h2#related-heading, h2[id="related-heading"]')).toBeVisible({ timeout: 10_000 })
  })
}
