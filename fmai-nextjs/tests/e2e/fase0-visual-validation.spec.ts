import { test, expect } from '@playwright/test'

/**
 * Fase 0 visual + behavioral validation.
 *
 * Confirms the dl/dt/dd → Radix Accordion swap on:
 *   - /nl/skills/clyde (SkillPageTemplate)
 *   - /nl/pricing
 *   - /nl/founding-member
 *
 * Captures screenshots + asserts accordion semantics. Throwaway spec —
 * removed after Fase 0 push if it adds noise.
 */

const PAGES = [
  { path: '/nl/skills/clyde', name: 'skill-clyde-faq' },
  { path: '/nl/pricing', name: 'pricing-faq' },
  { path: '/nl/founding-member', name: 'founding-faq' },
] as const

test.describe.configure({ mode: 'serial' })

for (const page of PAGES) {
  test(`${page.name} renders FAQ accordion + first item expands on click`, async ({
    page: pwPage,
  }) => {
    await pwPage.goto(page.path)
    await pwPage.waitForLoadState('domcontentloaded')

    // Accordion triggers should exist (Radix renders buttons with data-state).
    const triggers = pwPage.locator('button[data-state]')
    const count = await triggers.count()
    expect(count, `expected ≥ 1 accordion trigger on ${page.path}`).toBeGreaterThan(0)

    // No raw <dl> tags should be present in the FAQ region.
    const dlCount = await pwPage.locator('dl').count()
    expect(dlCount, `${page.path} should not contain any <dl> elements`).toBe(0)

    // First trigger expands on click — content becomes visible.
    const first = triggers.first()
    await first.scrollIntoViewIfNeeded()
    await first.click()
    await expect(first).toHaveAttribute('data-state', 'open')

    await pwPage.screenshot({
      path: `playwright-output/fase0-${page.name}.png`,
      fullPage: false,
    })
  })
}
