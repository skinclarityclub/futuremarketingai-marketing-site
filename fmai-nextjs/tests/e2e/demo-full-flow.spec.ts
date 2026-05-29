import { test, expect, type Page } from '@playwright/test'

/**
 * Full-Flow E2E Tests: Guided Demo Mode — Next.js site
 *
 * Exercises each rewritten agency scenario end-to-end with real AI responses.
 * Two scenarios remain: "The New Client Journey" (6 steps) and "Scaling Your
 * Portfolio" (4 steps). Both use only the real agency tools.
 *
 * Requires ANTHROPIC_API_KEY in environment. AI responses are non-deterministic,
 * so tests include 1 retry.
 */
test.describe.configure({ retries: 1, mode: 'serial' })
test.skip(
  !process.env.ANTHROPIC_API_KEY,
  'demo-full-flow requires ANTHROPIC_API_KEY for real AI streaming',
)

const AI_RESPONSE_TIMEOUT = 60_000
const STEP_TIMEOUT = 90_000
const MESSAGE_APPEAR_TIMEOUT = 30_000

// Helper: dismiss cookie consent banner
async function dismissCookieConsent(page: Page) {
  await page.waitForTimeout(1_000)
  await page.evaluate(() => {
    document
      .querySelectorAll('.cookie-consent-container, .CookieConsent')
      .forEach((el) => el.remove())
  })
}

// Helper: open chat panel
async function openChat(page: Page) {
  await dismissCookieConsent(page)
  const btn = page.locator('button[aria-label^="Open chat"]').first()
  await expect(btn).toBeVisible({ timeout: 20_000 })
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible({ timeout: 5_000 })
  return panel
}

// Helper: start demo and select a scenario
async function startDemoAndSelectScenario(page: Page, scenarioText: string) {
  const panel = await openChat(page)

  const tourBtn = page.getByRole('button', { name: /take a guided tour/i })
  await expect(tourBtn).toBeVisible({ timeout: 5_000 })
  await tourBtn.click()

  await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5_000 })

  await page.getByText(scenarioText).click()

  await expect(page.getByText('Choose a scenario to explore:')).not.toBeVisible({ timeout: 5_000 })

  return panel
}

// Helper: wait for demo step to complete (Continue button or checkpoint appears)
async function waitForDemoStepComplete(page: Page) {
  const continueBtn = page.getByRole('button', { name: /Continue demo/i })
  const checkpointBtn = page
    .locator('[data-chatwidget-panel]')
    .locator('button')
    .filter({
      hasText: /(Show|Book|Assess|Skip|End|Try)/i,
    })
    .first()

  await expect(continueBtn.or(checkpointBtn)).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
}

// Helper: check if "View details" appeared (tool routed to side panel)
async function hasViewDetails(page: Page): Promise<boolean> {
  const buttons = page.locator('[data-chatwidget-panel]').getByText('View details')
  return await buttons
    .last()
    .isVisible()
    .catch(() => false)
}

// Helper: click continue demo button
async function clickContinueDemo(page: Page) {
  const continueBtn = page.getByRole('button', { name: /Continue demo/i })
  await expect(continueBtn).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  await continueBtn.click()
}

// Helper: handle a checkpoint by selecting an option
async function handleCheckpoint(page: Page, optionLabel: string) {
  const option = page.getByRole('button', { name: new RegExp(optionLabel, 'i') })
  await expect(option).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  await option.click()
}

// Helper: verify side panel opened
async function verifySidePanelOpen(page: Page) {
  const closeBtn = page.locator('button[aria-label="Close details panel"]').first()
  await expect(closeBtn).toBeVisible({ timeout: 5_000 })
}

// ---------------------------------------------------------------------------
// SCENARIO 1: The New Client Journey (6 steps)
// ---------------------------------------------------------------------------
test.describe('Full Flow: New Client Journey', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('complete scenario end-to-end through all 6 steps', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 8)
    await page.goto('/en')

    await startDemoAndSelectScenario(page, 'The New Client Journey')

    // Step 1: "What skills does FutureMarketingAI offer?" → get_skills
    await expect(page.getByText(/What skills does FutureMarketingAI offer/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)

    if (await hasViewDetails(page)) {
      await verifySidePanelOpen(page)
    }
    await clickContinueDemo(page)

    // Step 2: "Do you have a case study?" → get_case_study
    await expect(page.getByText(/case study/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 3: ROI estimate → get_roi_estimate + CHECKPOINT
    await expect(page.getByText(/How much could we save/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Show pricing')

    // Step 4: "What are your pricing plans?" → get_pricing_info
    await expect(page.getByText(/pricing plans/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 5: Lead qualification → qualify_lead + CHECKPOINT
    await expect(page.getByText(/evaluate our fit/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Book a call')

    // Step 6: "I'd like to book an intro call" → book_call
    await expect(page.getByText(/book an intro call/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card should appear
    const completionCard = page.getByText(/Demo Complete/i)
    await expect(completionCard).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  })
})

// ---------------------------------------------------------------------------
// SCENARIO 2: Scaling Your Portfolio (4 steps)
// ---------------------------------------------------------------------------
test.describe('Full Flow: Scaling Your Portfolio', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('complete scenario end-to-end through all 4 steps', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 6)
    await page.goto('/en')

    await startDemoAndSelectScenario(page, 'Scaling Your Portfolio')

    // Step 1: brand-voice separation → get_skills
    await expect(page.getByText(/keep each brand voice separate/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 2: ROI → get_roi_estimate + CHECKPOINT
    await expect(page.getByText(/save in time for a team of 5/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Assess my fit')

    // Step 3: qualify → qualify_lead + CHECKPOINT
    await expect(page.getByText(/Evaluate our fit/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Book a call')

    // Step 4: booking → book_call
    await expect(page.getByText(/I want to book a call/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    const completionCard = page.getByText(/Demo Complete/i)
    await expect(completionCard).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  })
})

// ---------------------------------------------------------------------------
// CROSS-SCENARIO TESTS
// ---------------------------------------------------------------------------
test.describe('Demo Flow — End at Checkpoint', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('"End demo" at a checkpoint ends the demo', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 4)
    await page.goto('/en')

    await startDemoAndSelectScenario(page, 'Scaling Your Portfolio')

    // Step 1 (no checkpoint)
    await expect(page.getByText(/keep each brand voice separate/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 2 with checkpoint
    await expect(page.getByText(/save in time for a team of 5/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)

    // Click "End demo" at checkpoint
    await handleCheckpoint(page, 'End demo')

    // Demo should end — badge should switch back from "Demo" to "Concierge"
    const demoBadge = page.locator('[data-chatwidget-panel]').getByText('Demo', { exact: true })
    await expect(demoBadge).not.toBeVisible({ timeout: 5_000 })

    // Chat should still be functional
    const textarea = page.locator('[data-chatwidget-panel]').locator('textarea')
    await expect(textarea).toBeVisible()
  })
})

test.describe('Demo Flow — Completion Card Actions', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('completion card shows scenario title and action buttons', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 6)
    await page.goto('/en')

    await startDemoAndSelectScenario(page, 'Scaling Your Portfolio')

    // Run through all 4 steps
    await expect(page.getByText(/keep each brand voice separate/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    await expect(page.getByText(/save in time for a team of 5/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Assess my fit')

    await expect(page.getByText(/Evaluate our fit/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Book a call')

    await expect(page.getByText(/I want to book a call/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card should show
    await expect(page.getByText(/Demo Complete/i)).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
    await expect(page.getByText(/Scaling Your Portfolio/i).last()).toBeVisible()

    // Action buttons
    await expect(page.getByRole('button', { name: /Try another/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Book a call/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /End demo/i })).toBeVisible()
  })
})
