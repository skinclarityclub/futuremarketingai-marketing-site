import { test, expect, type Page } from '@playwright/test'

/**
 * Full-Flow E2E Tests: Guided Demo Mode — Next.js site
 *
 * Ported from Vite site demo-full-flow.spec.ts.
 * Tests each demo scenario end-to-end with real AI responses.
 * Requires ANTHROPIC_API_KEY in environment.
 *
 * AI responses are non-deterministic, so tests include 1 retry.
 */
test.describe.configure({ retries: 1 })

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
  const btn = page.locator('button[aria-label="Open chat"]')
  await expect(btn).toBeVisible({ timeout: 20_000 })
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible({ timeout: 5_000 })
  return panel
}

// Helper: start demo and select a scenario
async function startDemoAndSelectScenario(page: Page, scenarioText: string) {
  const panel = await openChat(page)

  const tourBtn = page.getByRole('button', { name: /Take a guided tour/i })
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
      hasText: /(Show|Book|Check|End|Try)/i,
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

    // Step 1: "What services does FMai offer?" → get_services
    await expect(page.getByText(/What services does FMai offer/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)

    if (await hasViewDetails(page)) {
      await verifySidePanelOpen(page)
    }
    await clickContinueDemo(page)

    // Step 2: "Do you have any case studies?" → get_case_study
    await expect(page.getByText(/case studies/i).last()).toBeVisible({
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
    await expect(page.getByText(/evaluate our needs/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Book a call')

    // Step 6: "I'd like to book a discovery call" → book_call
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
    await page.goto('/en')

    await startDemoAndSelectScenario(page, 'E-commerce Brand in Action')

    // Step 1: skincare products → search_products
    await expect(page.getByText(/skincare products/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 2: morning/evening routine → build_routine + CHECKPOINT
    await expect(page.getByText(/morning and evening routine/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Show Marketing Machine')

    // Step 3: Marketing Machine modules → explain_module
    await expect(page.getByText(/Marketing Machine modules/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 4: ROI → get_roi_info + CHECKPOINT
    await expect(page.getByText(/Calculate the ROI/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Show case study')

    // Step 5: case study → get_case_study
    await expect(page.getByText(/case study client/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 6: booking → book_call
    await expect(page.getByText(/Book a demo/i).last()).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

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
    await page.goto('/en')

    await startDemoAndSelectScenario(page, 'Client Support Experience')

    // Step 1: billing → search_knowledge_base
    await expect(page.getByText(/help with my billing/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 2: support ticket → create_ticket + CHECKPOINT
    await expect(page.getByText(/create a support ticket/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Check ticket status')

    // Step 3: ticket status → check_status
    await expect(page.getByText(/check the status/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    // Step 4: escalation → escalate_to_human
    await expect(page.getByText(/speak to someone/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

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
    await page.goto('/en')

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

    await startDemoAndSelectScenario(page, 'Client Support Experience')

    // Run through all 4 steps
    await expect(page.getByText(/help with my billing/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    await expect(page.getByText(/create a support ticket/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await handleCheckpoint(page, 'Check ticket status')

    await expect(page.getByText(/check the status/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })
    await waitForDemoStepComplete(page)
    await clickContinueDemo(page)

    await expect(page.getByText(/speak to someone/i)).toBeVisible({
      timeout: MESSAGE_APPEAR_TIMEOUT,
    })

    // Completion card should show
    await expect(page.getByText(/Demo Complete/i)).toBeVisible({ timeout: AI_RESPONSE_TIMEOUT })
    await expect(page.getByText(/Client Support Experience/i).last()).toBeVisible()

    // Action buttons
    await expect(page.getByRole('button', { name: /Try another/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Book a call/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /End demo/i })).toBeVisible()
  })
})
