import { test, expect, type Page } from '@playwright/test'

/**
 * Full-Flow E2E Tests: Guided Demo Mode
 *
 * Tests each demo scenario end-to-end with real AI responses:
 * - Verifies scripted messages appear and AI responds
 * - Verifies continue/checkpoint flow advances
 * - Verifies completion card renders with action buttons
 *
 * These tests require the dev server with ANTHROPIC_API_KEY set.
 * AI responses are non-deterministic, so tests include 1 retry.
 */
test.describe.configure({ retries: 1 })

// Generous timeout for AI responses
const AI_RESPONSE_TIMEOUT = 60_000
const STEP_TIMEOUT = 90_000
// Scripted messages have typing delays (800-1200ms) + rendering
const MESSAGE_APPEAR_TIMEOUT = 30_000

// Helper: dismiss cookie consent banner by removing it from DOM entirely
async function dismissCookieConsent(page: Page) {
  // Wait for page to load, then remove the cookie consent container
  // This is more reliable than clicking Accept which may not fully remove the overlay
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
  const btn = page.locator('button[aria-label="Open chat"]')
  await expect(btn).toBeVisible({ timeout: 15_000 })
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible({ timeout: 5_000 })
  return panel
}

// Helper: start demo and select a scenario
async function startDemoAndSelectScenario(page: Page, scenarioText: string) {
  const panel = await openChat(page)

  // Click "Take a guided tour"
  const tourBtn = page.getByRole('button', { name: /Take a guided tour/i })
  await expect(tourBtn).toBeVisible({ timeout: 5_000 })
  await tourBtn.click()

  // Wait for scenario cards
  await expect(page.getByText('Choose a scenario to explore:')).toBeVisible({ timeout: 5_000 })

  // Select the scenario
  await page.getByText(scenarioText).click()

  // Scenario cards should disappear (status → running)
  await expect(page.getByText('Choose a scenario to explore:')).not.toBeVisible({ timeout: 5_000 })

  return panel
}

// Helper: wait for AI to finish responding
// Waits for the "Continue demo" button OR a checkpoint option to appear,
// which signals the orchestrator has advanced past the AI response.
async function waitForDemoStepComplete(page: Page) {
  // Wait for either "Continue demo" or a checkpoint button to appear
  // This is the most reliable signal that the AI finished and the orchestrator advanced
  const continueBtn = page.getByRole('button', { name: /Continue demo/i })
  const checkpointBtn = page
    .locator('[data-chatwidget-panel]')
    .locator('button')
    .filter({
      hasText: /(Show|Book|Check|End|Try)/i,
    })
    .first()

  await expect(continueBtn.or(checkpointBtn)).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
}

// Helper: check if "View details" button appeared (tool was routed to side panel)
// Returns true if found, false if AI responded with text instead of tool call.
// AI behavior is non-deterministic — some steps may not produce tool calls.
async function hasViewDetails(page: Page): Promise<boolean> {
  const buttons = page.locator('[data-chatwidget-panel]').getByText('View details')
  return await buttons
    .last()
    .isVisible()
    .catch(() => false)
}

// Helper: wait for the continue button and click it
async function clickContinueDemo(page: Page) {
  const continueBtn = page.getByRole('button', { name: /Continue demo/i })
  await expect(continueBtn).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  await continueBtn.click()
}

// Helper: wait for a checkpoint and select an option
async function handleCheckpoint(page: Page, optionLabel: string) {
  const option = page.getByRole('button', { name: new RegExp(optionLabel, 'i') })
  await expect(option).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  await option.click()
}

// Helper: check side panel has opened with content (uses .first() to avoid strict mode with mobile+desktop close buttons)
async function verifySidePanelOpen(page: Page) {
  const closeBtn = page.locator('button[aria-label="Close details panel"]').first()
  await expect(closeBtn).toBeVisible({ timeout: 5_000 })
}

// Helper: verify side panel contains specific text (used in extended tests)
export async function verifySidePanelContent(page: Page, texts: (string | RegExp)[]) {
  for (const text of texts) {
    await expect(page.locator('[data-chatwidget-panel]').getByText(text).first()).toBeVisible({
      timeout: 5_000,
    })
  }
}

// ---------------------------------------------------------------------------
// SCENARIO 1: The New Client Journey (6 steps)
// ---------------------------------------------------------------------------
test.describe('Full Flow: New Client Journey', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('complete scenario end-to-end through all 6 steps', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 8) // 6 steps + buffer
    await page.goto('/')

    await startDemoAndSelectScenario(page, 'The New Client Journey')

    // --- Step 1: "What services does FMai offer?" → get_services ---
    await expect(page.getByText(/What services does FMai offer/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)

    // Optionally verify side panel opened with service info
    if (await hasViewDetails(page)) {
      await verifySidePanelOpen(page)
    }

    await clickContinueDemo(page)

    // --- Step 2: "Do you have any case studies?" → get_case_study ---
    await expect(page.getByText(/case studies/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 3: ROI estimate → get_roi_estimate + CHECKPOINT ---
    await expect(page.getByText(/How much could we save/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Show pricing')

    // --- Step 4: "What are your pricing plans?" → get_pricing_info ---
    await expect(page.getByText(/pricing plans/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 5: Lead qualification → qualify_lead + CHECKPOINT ---
    await expect(page.getByText(/evaluate our needs/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Book a call')

    // --- Step 6: "I'd like to book a discovery call" → book_call ---
    await expect(page.getByText(/book a discovery call/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card should appear
    const completionCard = page.getByText(/Demo Complete/i)
    await expect(completionCard).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  })
})

// ---------------------------------------------------------------------------
// SCENARIO 2: E-commerce Brand in Action (6 steps)
// ---------------------------------------------------------------------------
test.describe('Full Flow: E-commerce Brand', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('complete scenario end-to-end through all 6 steps', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 8)
    await page.goto('/')

    await startDemoAndSelectScenario(page, 'E-commerce Brand in Action')

    // --- Step 1: "Show me skincare products for dry skin" → search_products ---
    await expect(page.getByText(/skincare products/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 2: "Build me a morning and evening routine" → build_routine + CHECKPOINT ---
    await expect(page.getByText(/morning and evening routine/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Show Marketing Machine')

    // --- Step 3: "What Marketing Machine modules..." → explain_module ---
    await expect(page.getByText(/Marketing Machine modules/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 4: "Calculate the ROI..." → get_roi_info + CHECKPOINT ---
    await expect(page.getByText(/Calculate the ROI/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Show case study')

    // --- Step 5: "Show me how your case study client used this" → get_case_study ---
    await expect(page.getByText(/case study client/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 6: "Book a demo to see this in action" → book_call ---
    await expect(page.getByText(/Book a demo/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card
    const completionCard = page.getByText(/Demo Complete/i)
    await expect(completionCard).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  })
})

// ---------------------------------------------------------------------------
// SCENARIO 3: Client Support Experience (4 steps)
// ---------------------------------------------------------------------------
test.describe('Full Flow: Client Support', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('complete scenario end-to-end through all 4 steps', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 6)
    await page.goto('/')

    await startDemoAndSelectScenario(page, 'Client Support Experience')

    // --- Step 1: "I need help with my billing..." → search_knowledge_base ---
    await expect(page.getByText(/help with my billing/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 2: "Can you create a support ticket..." → create_ticket + CHECKPOINT ---
    await expect(page.getByText(/create a support ticket/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)

    // Checkpoint: "Want to see ticket tracking and escalation?"
    await handleCheckpoint(page, 'Check ticket status')

    // --- Step 3: "Can I check the status of my ticket?" → check_status ---
    await expect(page.getByText(/check the status/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // --- Step 4: "I need to speak to someone about this urgently" → escalate_to_human ---
    await expect(page.getByText(/speak to someone/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card
    const completionCard = page.getByText(/Demo Complete/i)
    await expect(completionCard).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
  })
})

// ---------------------------------------------------------------------------
// CROSS-SCENARIO TESTS
// ---------------------------------------------------------------------------
test.describe('Demo Flow — Skip to Booking', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('skip-to-booking at first checkpoint ends demo', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 4)
    await page.goto('/')

    await startDemoAndSelectScenario(page, 'Client Support Experience')

    // Step 1
    await expect(page.getByText(/help with my billing/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 2 with checkpoint
    await expect(page.getByText(/create a support ticket/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)

    // Click "End demo" at checkpoint
    await handleCheckpoint(page, 'End demo')

    // Demo should end — badge should switch back from "Demo" to "Concierge"
    const demoBadge = page.locator('[data-chatwidget-panel]').getByText('Demo', { exact: true })
    await expect(demoBadge).not.toBeVisible({ timeout: 5_000 })

    // Chat should still be functional (textarea visible)
    const textarea = page.locator('[data-chatwidget-panel]').locator('textarea')
    await expect(textarea).toBeVisible()
  })
})

test.describe('Demo Flow — Completion Card Actions', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('completion card shows scenario title and action buttons', async ({ page }) => {
    test.setTimeout(STEP_TIMEOUT * 6)
    await page.goto('/')

    await startDemoAndSelectScenario(page, 'Client Support Experience')

    // Run through all 4 steps
    // Step 1
    await expect(page.getByText(/help with my billing/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 2 + checkpoint
    await expect(page.getByText(/create a support ticket/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Check ticket status')

    // Step 3
    await expect(page.getByText(/check the status/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 4
    await expect(page.getByText(/speak to someone/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card should show
    await expect(page.getByText(/Demo Complete/i)).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
    await expect(page.getByText(/Client Support Experience/i).last()).toBeVisible()

    // "Try another" button
    const tryAnother = page.getByRole('button', { name: /Try another/i })
    await expect(tryAnother).toBeVisible()

    // "Book a call" button
    const bookCall = page.getByRole('button', { name: /Book a call/i })
    await expect(bookCall).toBeVisible()

    // "End demo" button
    const endDemo = page.getByRole('button', { name: /End demo/i })
    await expect(endDemo).toBeVisible()
  })
})
