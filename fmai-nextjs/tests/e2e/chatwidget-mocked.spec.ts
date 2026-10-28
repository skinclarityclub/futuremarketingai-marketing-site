import { test, expect, type Page } from '@playwright/test'
import { SSE_HEADERS, mockChatbot, openWidget, send, uiStream } from './helpers/chatbot-mock'

// Every test answers /api/chatbot itself: zero paid calls, and it proves none leaked.
async function setup(page: Page) {
  const real: string[] = []
  page.on('request', (r) => {
    if (r.url().includes('/api/chatbot') && !r.failure()) real.push(r.url())
  })
  const mock = await mockChatbot(page, (r) => r.abort())
  return { mock, real }
}

for (const [name, viewport] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
] as const) {
  test.describe(name, () => {
    test.use({ viewport })

    test('header: AI label, two buttons, no online status', async ({ page }) => {
      const { mock } = await setup(page)
      const w = await openWidget(page)
      await expect(w.getByText('AI', { exact: true })).toBeVisible()
      await expect(w.getByText('Nu online')).toHaveCount(0)
      await expect(w.locator('button[aria-label*="inimal"]')).toHaveCount(0)
      await expect(w.getByText('Clyde is AI en kan zich vergissen.')).toBeVisible()
      const close = w.locator('button[aria-label="Sluit chat"]')
      // polled: the panel scales in from 0.98 for 220ms
      await expect.poll(async () => (await close.boundingBox())!.width).toBeGreaterThanOrEqual(40)
      await expect.poll(async () => (await close.boundingBox())!.height).toBeGreaterThanOrEqual(40)
      await expect(w.getByText('Shift+Enter')).toHaveCount(0)
      expect(mock.calls()).toBe(0)
    })

    test('launcher does not claim to be online', async ({ page }) => {
      const { mock } = await setup(page)
      await page.goto('/nl', { waitUntil: 'domcontentloaded' })
      const launcher = page.locator('button[aria-label^="Open chat met Clyde"]').first()
      await launcher.hover()
      await expect(launcher).not.toContainText(/online/i)
      expect(mock.calls()).toBe(0)
    })

    test('greeting has no actions', async ({ page }) => {
      const { mock } = await setup(page)
      const w = await openWidget(page)
      await expect(w.getByText(/een AI-collega/)).toBeVisible()
      await expect(w.getByRole('button', { name: /Opnieuw genereren|Kopieer/ })).toHaveCount(0)
      expect(mock.calls()).toBe(0)
    })

    test('modal only on phones, focus kept inside', async ({ page }) => {
      const { mock } = await setup(page)
      const w = await openWidget(page)
      if (viewport.width >= 1024) {
        await expect(w).not.toHaveAttribute('aria-modal', 'true')
      } else {
        await expect(w).toHaveAttribute('aria-modal', 'true')
        await expect(w.locator('textarea')).toBeFocused()
        for (let i = 0; i < 15; i++) {
          await page.keyboard.press('Tab')
          const inside = await page.evaluate(
            () => !!document.activeElement?.closest('[data-chatwidget-panel]')
          )
          expect(inside).toBe(true)
        }
      }
      expect(mock.calls()).toBe(0)
    })

    test('Escape closes and focus returns to the launcher', async ({ page }) => {
      const { mock } = await setup(page)
      const w = await openWidget(page)
      await page.keyboard.press('Escape')
      await expect(w).toBeHidden()
      const launcher = page.locator('button[aria-label^="Open chat met Clyde"]').first()
      await expect(launcher).toBeFocused()
      expect(mock.calls()).toBe(0)
    })
  })
}

test.describe('errors and the limit', () => {
  test('500 shows "Geen antwoord ontvangen" under the question and Opnieuw resends', async ({ page }) => {
    const m = await mockChatbot(page, async (r, n) =>
      n === 1
        ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
        : r.fulfill({ status: 200, headers: SSE_HEADERS, body: uiStream({ text: 'Vier niveaus.' }) })
    )
    const w = await openWidget(page)
    await send(w, 'Wat kost het?')
    await expect(w.getByText('Geen antwoord ontvangen')).toBeVisible()
    await expect(w.locator('[role="alert"]').filter({ hasText: 'Er ging iets mis' })).toHaveCount(0)
    await w.getByRole('button', { name: 'Opnieuw', exact: true }).click()
    await expect(w.getByText('Vier niveaus.')).toBeVisible()
    expect(m.calls()).toBe(2)
  })

  test('429 says when to retry, without a retry button', async ({ page }) => {
    const m = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Rate limit exceeded', resetAt: Date.now() + 90_000 }),
      })
    )
    const w = await openWidget(page)
    await send(w, 'Hallo')
    await expect(w.getByText('Probeer het over 2 minuten opnieuw.')).toBeVisible()
    await expect(w.getByRole('button', { name: 'Opnieuw', exact: true })).toHaveCount(0)
    expect(m.calls()).toBe(1)
  })

  test('stale persisted count does not lock the input', async ({ page }) => {
    const m = await mockChatbot(page, (r) => r.abort())
    const w = await openWidget(page, '/nl', { counts: { clyde: 15 } })
    await expect(w.locator('textarea')).toBeEnabled()
    await expect(w.getByText(/demolimiet/i)).toHaveCount(0)
    expect(m.calls()).toBe(0)
  })

  test('warning at 3 left, full at 15, link goes to /nl/apply', async ({ page }) => {
    const m = await mockChatbot(page, (r, n) =>
      r.fulfill({ status: 200, headers: SSE_HEADERS, body: uiStream({ text: `Antwoord ${n}.` }) })
    )
    const w = await openWidget(page)
    for (let i = 1; i <= 12; i++) {
      await send(w, `Vraag ${i}`)
      await expect(w.getByText(`Antwoord ${i}.`, { exact: true })).toBeVisible()
    }
    await expect(w.getByText('Nog 3 berichten in dit gesprek.')).toBeVisible()
    for (let i = 13; i <= 15; i++) {
      await send(w, `Vraag ${i}`)
      await expect(w.getByText(`Antwoord ${i}.`, { exact: true })).toBeVisible()
    }
    await expect(w.locator('textarea')).toBeDisabled()
    await expect(w.getByText('Dit gesprek zit vol.').first()).toBeVisible()
    await expect(w.getByRole('link', { name: 'Aanvraag starten' })).toHaveAttribute('href', /\/nl\/apply$/)
    expect(m.calls()).toBe(15)
  })
})
