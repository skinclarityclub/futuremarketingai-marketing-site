import { test, expect, type Page } from '@playwright/test'

/**
 * E2E Tests: Guided Demo Mode — Next.js site
 *
 * The guided demo was rewritten to be NL/agency-first (2 scenarios: "De nieuwe
 * klant" + "Portfolio opschalen"), using only the real agency tools. Clyde's
 * chrome is Dutch on every locale (Clyde reads as a Dutch senior colleague), so
 * these tests run on /nl and assert the Dutch chrome + Dutch scenario copy. The
 * legacy skincare + support scenarios and the "Marketing Machine" were removed.
 */

// Pre-seed cookie consent before every navigation: the consent banner
// (fixed bottom-0, z-9999) overlays the FAB (z-40) and otherwise intercepts the
// open click, so a first-time visitor (and these tests) cannot open Clyde.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
    } catch {
      /* storage disabled */
    }
  })
})

// Helper: wait for the floating chat button (lazy-loaded).
async function waitForChatButton(page: Page) {
  const btn = page.locator('button[aria-label^="Open chat"]').first()
  await expect(btn).toBeVisible({ timeout: 20000 })
  return btn
}

// Helper: open the chat panel.
async function openChat(page: Page) {
  const btn = await waitForChatButton(page)
  await btn.click({ force: true })
  const panel = page.locator('[data-chatwidget-panel]')
  await expect(panel).toBeVisible({ timeout: 5000 })
  return panel
}

// Helper: close chat via Escape
async function closeChat(page: Page) {
  await page.keyboard.press('Escape')
  const panel = page.locator('[data-chatwidget-panel]')
  await expect(panel).not.toBeVisible({ timeout: 3000 })
}

// Helper: open the chat and start the guided tour.
async function startTour(page: Page) {
  await openChat(page)
  const tourButton = page.getByRole('button', { name: /rondleiding/i })
  await expect(tourButton).toBeVisible({ timeout: 5000 })
  await tourButton.click()
  await expect(page.getByText('Kies een scenario om te verkennen:')).toBeVisible({ timeout: 5000 })
}

test.describe('Chat Panel — Open/Close Basics', () => {
  test('floating button visible on homepage', async ({ page }) => {
    await page.goto('/nl')
    await waitForChatButton(page)
  })

  test('clicking floating button opens chat panel', async ({ page }) => {
    await page.goto('/nl')
    const panel = await openChat(page)
    await expect(panel).toBeVisible()

    const textarea = panel.locator('textarea')
    await expect(textarea).toBeVisible()
  })

  test('Escape key closes chat panel', async ({ page }) => {
    await page.goto('/nl')
    await openChat(page)
    await closeChat(page)
  })

  test('floating button toggles to close when panel open', async ({ page }) => {
    await page.goto('/nl')
    await openChat(page)

    const closeBtn = page.locator('[data-chatwidget-panel] button[aria-label="Sluit chat"]')
    await expect(closeBtn).toBeVisible({ timeout: 10_000 })
  })

  test('welcome message appears when chat opens with no messages', async ({ page }) => {
    await page.goto('/nl')
    await openChat(page)

    const welcomeText = page.locator('[data-chatwidget-panel]').getByText(/ik ben Clyde/i)
    await expect(welcomeText).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Entry Points', () => {
  test('"rondleiding" button visible in welcome message', async ({ page }) => {
    await page.goto('/nl')
    await openChat(page)

    const tourButton = page.getByRole('button', { name: /rondleiding/i })
    await expect(tourButton).toBeVisible({ timeout: 5000 })
  })

  test('"rondleiding" triggers demo with scenario cards', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    // Both agency scenarios should be visible
    await expect(page.getByText('De nieuwe klant')).toBeVisible()
    await expect(page.getByText('Portfolio opschalen')).toBeVisible()

    // Legacy off-context scenarios must be gone
    await expect(page.getByText('E-commerce Brand in Action')).toHaveCount(0)
    await expect(page.getByText('Client Support Experience')).toHaveCount(0)
  })

  test('"rondleiding" welcome-message button is the canonical demo entry', async ({ page }) => {
    // The only entry to demo mode is the "rondleiding" button inside the welcome
    // message; the suggested prompts do not trigger the orchestrator.
    await page.goto('/nl')
    await startTour(page)
  })

  test('header badge changes to demo in demo mode', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    // Floating header renders the badge lowercased in the status line ("· demo").
    const badge = page.locator('[data-chatwidget-panel] [role="banner"]').getByText(/demo/i)
    await expect(badge).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Scenario Cards', () => {
  test('scenario cards show correct details', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    // Check step counts (6-step New Client + 4-step Scaling)
    await expect(page.getByText('6 stappen').first()).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('4 stappen')).toBeVisible()

    // Check subtitles
    await expect(
      page.getByText('Zie hoe een bureau FutureMarketingAI ontdekt en beoordeelt')
    ).toBeVisible()
    await expect(page.getByText('Zie hoe Clyde een groeiend merkenportfolio aankan')).toBeVisible()
  })

  test('clicking a scenario card starts the demo', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    // Click the 4-step scenario
    await page.getByText('Portfolio opschalen').click()

    // Scenario cards should disappear
    await expect(page.getByText('Kies een scenario om te verkennen:')).not.toBeVisible({
      timeout: 5000,
    })
  })
})

test.describe('Guided Demo — Progress Indicator', () => {
  test('DemoProgress bar appears after selecting a scenario', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    await page.getByText('Portfolio opschalen').click()

    // Progress dots should appear
    const progressContainer = page
      .locator('[data-chatwidget-panel]')
      .locator('.flex.items-center.gap-1\\.5.px-1')
    await expect(progressContainer).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Orchestrator State', () => {
  test('selecting scenario hides cards (transitions to running)', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    await page.getByText('Portfolio opschalen').click()

    // Cards disappear
    await expect(page.getByText('Kies een scenario om te verkennen:')).not.toBeVisible({
      timeout: 5000,
    })
  })

  test('suggested prompts are hidden during demo mode', async ({ page }) => {
    await page.goto('/nl')
    await openChat(page)

    // Suggested prompts include "Laat me een demo zien" on the homepage
    const demoPrompt = page.getByRole('button', { name: /Laat me een demo zien/i })
    await expect(demoPrompt).toBeVisible({ timeout: 5000 })

    const tourButton = page.getByRole('button', { name: /rondleiding/i })
    await tourButton.click()

    // Suggested prompts should be hidden
    await expect(demoPrompt).not.toBeVisible({ timeout: 3000 })
  })
})

test.describe('Guided Demo — End Demo Flow', () => {
  test('closing chat panel during demo preserves demo state', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    // Close chat
    await page.keyboard.press('Escape')
    const panel = page.locator('[data-chatwidget-panel]')
    await expect(panel).not.toBeVisible({ timeout: 3000 })

    // Reopen — demo state should be preserved
    const openBtn = page.locator('button[aria-label^="Open chat"]').first()
    await openBtn.click({ force: true })
    await expect(panel).toBeVisible({ timeout: 5000 })

    // Demo should still be in choosing mode
    await expect(page.getByText('Kies een scenario om te verkennen:')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Guided Demo — Side Panel Cleanup', () => {
  test('side panel not open during demo scenario selection', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    const sidePanel = page.locator('[aria-label="Close details panel"]')
    await expect(sidePanel).not.toBeVisible()
  })
})

test.describe('Guided Demo — Component Rendering', () => {
  test('DemoScenarioCard has proper interactive buttons', async ({ page }) => {
    await page.goto('/nl')
    await startTour(page)

    // Two scenario cards, each ending in "stappen"
    const cards = page.locator('button').filter({ hasText: /stappen$/ })
    const count = await cards.count()
    expect(count).toBe(2)
  })
})
