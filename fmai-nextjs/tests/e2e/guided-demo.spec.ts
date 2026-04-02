import { test, expect, type Page } from '@playwright/test'

/**
 * E2E Tests: Guided Demo Mode — Next.js site
 *
 * Ported from Vite site guided-demo.spec.ts.
 * Tests demo entry points, scenario selection, orchestrator state, and UI.
 */

// Helper: wait for the floating chat button (lazy-loaded)
async function waitForChatButton(page: Page) {
  const btn = page.locator('button[aria-label="Open chat"]')
  await expect(btn).toBeVisible({ timeout: 20000 })
  return btn
}

// Helper: open the chat panel
async function openChat(page: Page) {
  const btn = await waitForChatButton(page)
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible({ timeout: 5000 })
  return panel
}

// Helper: close chat via Escape
async function closeChat(page: Page) {
  await page.keyboard.press('Escape')
  const panel = page.locator('[role="dialog"]')
  await expect(panel).not.toBeVisible({ timeout: 3000 })
}

test.describe('Chat Panel — Open/Close Basics', () => {
  test('floating button visible on homepage', async ({ page }) => {
    await page.goto('/en')
    await waitForChatButton(page)
  })

  test('clicking floating button opens chat panel', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)
    await expect(panel).toBeVisible()

    const textarea = panel.locator('textarea')
    await expect(textarea).toBeVisible()
  })

  test('Escape key closes chat panel', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)
    await closeChat(page)
  })

  test('floating button toggles to close when panel open', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const closeBtn = page.locator('[role="dialog"] button[aria-label="Close chat"]')
    await expect(closeBtn).toBeVisible({ timeout: 10_000 })
  })

  test('welcome message appears when chat opens with no messages', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const welcomeText = page.locator('[data-chatwidget-panel]').getByText(/I can help you explore/i)
    await expect(welcomeText).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Entry Points', () => {
  test('"Take a guided tour" button visible in welcome message', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await expect(tourButton).toBeVisible({ timeout: 5000 })
  })

  test('"Take a guided tour" triggers demo with scenario cards', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    // Scenario cards should appear
    const chooserText = page.getByText('Choose a scenario to explore:')
    await expect(chooserText).toBeVisible({ timeout: 5000 })

    // All 3 scenarios should be visible
    await expect(page.getByText('The New Client Journey')).toBeVisible()
    await expect(page.getByText('E-commerce Brand in Action')).toBeVisible()
    await expect(page.getByText('Client Support Experience')).toBeVisible()
  })

  test('"Start guided demo" suggested prompt triggers demo mode', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const demoPrompt = page.getByRole('button', { name: /Start guided demo/i })
    await expect(demoPrompt).toBeVisible({ timeout: 5000 })
    await demoPrompt.click()

    const chooserText = page.getByText('Choose a scenario to explore:')
    await expect(chooserText).toBeVisible({ timeout: 5000 })
  })

  test('header badge changes to "Demo" in demo mode', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    const badge = page.locator('[data-chatwidget-panel]').getByText('Demo', { exact: true })
    await expect(badge).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Scenario Cards', () => {
  test('scenario cards show correct details', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    // Check step counts
    await expect(page.getByText('6 steps').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('4 steps')).toBeVisible()

    // Check subtitles
    await expect(page.getByText('See how prospects discover and evaluate FutureMarketingAI')).toBeVisible()
    await expect(page.getByText('See how FutureMarketingAI powers a skincare brand')).toBeVisible()
    await expect(page.getByText('See how we handle customer support')).toBeVisible()
  })

  test('clicking a scenario card starts the demo', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5000 })

    // Click shortest scenario (4 steps)
    await page.getByText('Client Support Experience').click()

    // Scenario cards should disappear
    await expect(page.getByText('Choose a scenario to explore:')).not.toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Progress Indicator', () => {
  test('DemoProgress bar appears after selecting a scenario', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5000 })

    await page.getByText('Client Support Experience').click()

    // Progress dots should appear
    const progressContainer = page
      .locator('[data-chatwidget-panel]')
      .locator('.flex.items-center.gap-1\\.5.px-1')
    await expect(progressContainer).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Orchestrator State', () => {
  test('selecting scenario hides cards (transitions to running)', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()
    await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5000 })

    await page.getByText('Client Support Experience').click()

    // Cards disappear
    await expect(page.getByText('Choose a scenario to explore:')).not.toBeVisible({ timeout: 5000 })
  })

  test('suggested prompts are hidden during demo mode', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const demoPrompt = page.getByRole('button', { name: /Start guided demo/i })
    await expect(demoPrompt).toBeVisible({ timeout: 5000 })

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    // Suggested prompts should be hidden
    await expect(demoPrompt).not.toBeVisible({ timeout: 3000 })
  })
})

test.describe('Guided Demo — End Demo Flow', () => {
  test('closing chat panel during demo preserves demo state', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()
    await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5000 })

    // Close chat
    await page.keyboard.press('Escape')
    const panel = page.locator('[role="dialog"]')
    await expect(panel).not.toBeVisible({ timeout: 3000 })

    // Reopen — demo state should be preserved
    const openBtn = page.locator('button[aria-label="Open chat"]')
    await openBtn.click({ force: true })
    await expect(panel).toBeVisible({ timeout: 5000 })

    // Demo should still be in choosing mode
    await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Side Panel Cleanup', () => {
  test('side panel not open during demo scenario selection', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()

    const sidePanel = page.locator('[aria-label="Close details panel"]')
    await expect(sidePanel).not.toBeVisible()
  })
})

test.describe('Guided Demo — Component Rendering', () => {
  test('DemoScenarioCard has proper interactive buttons', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /Take a guided tour/i })
    await tourButton.click()
    await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5000 })

    // Scenario cards should be clickable buttons
    const cards = page.locator('button').filter({ hasText: /steps$/ })
    const count = await cards.count()
    expect(count).toBe(3)
  })
})
