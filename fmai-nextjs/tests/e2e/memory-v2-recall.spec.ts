import { test, expect, type Page } from '@playwright/test'

// Gated live test: seeds a persisted profile, then proves a RETURNING visitor (1)
// gets the personalized welcome-back rendered client-side, and (2) when they send a
// message that re-states NOTHING, the request to /api/chatbot carries the remembered
// profile in `context.memoryProfile` — which the server injects into the system
// prompt (see buildMemoryContextLine, covered by memory-injection.spec.ts). That
// transmission + a real 200 response is the deterministic recall proof; we do NOT
// assert on the model's free-text reply (it can match the welcome bubble spuriously).
// Set RUN_CLYDE_LIVE=1 to run (one live API turn).
const LIVE = process.env.RUN_CLYDE_LIVE === '1'

const SEEDED = { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6, teamSize: 3 }
// A question that intentionally re-states NONE of the seeded facts, so any recall
// can only come from the injected memory, not from the message.
const QUESTION = 'Wat raad je ons aan als eerste stap?'

async function openClydeWithSeededMemory(page: Page) {
  await page.addInitScript((seeded) => {
    try {
      localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
      localStorage.setItem('clyde:memory', JSON.stringify({ v: 1, profile: seeded }))
    } catch {
      /* ignore */
    }
  }, SEEDED)
  await page.goto('/nl')
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(900)
}

test.describe('Clyde memory v2 — cross-session', () => {
  test.skip(!LIVE, 'set RUN_CLYDE_LIVE=1 to run against a live Clyde')

  test('returning visitor: welcome-back renders and the remembered profile is sent to the API', async ({
    page,
  }) => {
    await openClydeWithSeededMemory(page)
    const panel = page.locator('[data-chatwidget-panel]')

    // (1) Personalized welcome-back, derived client-side from the persisted profile.
    await expect(panel).toContainText('Welkom terug')
    await expect(panel).toContainText('Duinrust')

    // (2) Send the fact-free question and capture the outgoing request + response.
    // A 200 is a real "turn completed" signal (the previous swallowed waitFor on the
    // Stop button passed even on a failed turn).
    const reqPromise = page.waitForRequest((r) => r.url().includes('/api/chatbot'))
    const respPromise = page.waitForResponse((r) => r.url().includes('/api/chatbot'), {
      timeout: 60000,
    })
    const ta = panel.locator('textarea')
    await ta.fill(QUESTION)
    await ta.press('Enter')

    const req = await reqPromise
    const body = JSON.parse(req.postData() || '{}')
    const resp = await respPromise
    expect(resp.status()).toBe(200)

    // The remembered profile rode along in the request context -> server injects it
    // (buildMemoryContextLine), even though the user re-stated none of it.
    expect(body?.context?.memoryProfile?.agencyName).toBe(SEEDED.agencyName)
    expect(body?.context?.memoryProfile?.niche).toBe(SEEDED.niche)

    // The streamed reply rendered (turn visibly completed), not just an HTTP 200.
    await page
      .locator('[data-chatwidget-panel] button[aria-label="Opnieuw genereren"]')
      .waitFor({ state: 'visible', timeout: 60000 })
  })
})
