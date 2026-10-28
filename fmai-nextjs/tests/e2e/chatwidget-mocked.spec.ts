import { test, expect, type Locator, type Page } from '@playwright/test'
import { PROACTIVE_PROMPTS, WHISPERS } from '../../src/components/chatbot/widget-copy'
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

    test('one focus ring, placeholder as on the board', async ({ page }) => {
      const { mock } = await setup(page)
      const w = await openWidget(page)
      const ta = w.locator('textarea')
      await ta.focus()
      expect(await ta.evaluate((e) => getComputedStyle(e).outlineStyle)).toBe('none')
      await expect(ta).toHaveAttribute('placeholder', 'Vraag Clyde iets…')
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

test.describe('greeting prompts', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  test('one column, tour link below', async ({ page }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page)
    const rows = w.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /\?|Laat een echte klant zien/ })
    await expect(rows).toHaveCount(3)
    // polled: the panel scales in for 220ms
    await expect.poll(async () => {
      const b = await Promise.all([0, 1, 2].map((i) => rows.nth(i).boundingBox()))
      const same = new Set(b.map((x) => Math.round(x!.x))).size === 1
      return same && b[1]!.y > b[0]!.y && b[2]!.y > b[1]!.y
    }).toBe(true)
    await expect(w.getByText('Of start een rondleiding')).toBeVisible()
    expect(mock.calls()).toBe(0)
  })
})

test.describe('errors and the limit', () => {
  test('500 shows "Geen antwoord ontvangen" under the question and Opnieuw resends', async ({ page }) => {
    const m = await mockChatbot(page, async (r, n) =>
      n === 1
        ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
        : r.fulfill({ status: 200, headers: SSE_HEADERS, body: uiStream({ text: 'Vier niveaus.' }) })
    )
    const w = await openWidget(page)
    await send(w, 'Wat kost het?')
    const fail = w.getByText('Geen antwoord ontvangen')
    await expect(fail).toBeVisible()
    await expect(fail.locator('xpath=..').locator('svg')).toHaveCount(1)
    const colour = (l: Locator) => l.evaluate((e) => getComputedStyle(e).color)
    await page.evaluate(() => {
      const probe = document.createElement('i')
      probe.className = 'text-error'
      probe.id = 'err-probe'
      document.body.appendChild(probe)
    })
    expect(await colour(fail)).toBe(await colour(page.locator('#err-probe')))
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

test.describe('one proactive hint', () => {
  const whisper = (page: Page) => page.getByText(WHISPERS.nl['/'])
  const consent = JSON.stringify({ necessary: true, analytics: false, marketing: false })

  // The idle timers only exist after hydration, so wait for it, then jump the clock.
  async function visit(page: Page, path = '/nl') {
    await page.addInitScript((c) => {
      try {
        localStorage.setItem('cookieConsent', c)
      } catch {}
    }, consent)
    await page.goto(path, { waitUntil: 'load' })
    await page.waitForLoadState('networkidle')
    await page.clock.fastForward(21_000)
  }

  test('whisper once per session', async ({ page }) => {
    const { mock } = await setup(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.clock.install()
    await visit(page)
    await expect(whisper(page)).toBeVisible()
    await page.reload({ waitUntil: 'load' })
    await page.waitForLoadState('networkidle')
    await page.clock.fastForward(21_000)
    await expect(whisper(page)).toHaveCount(0)
    expect(mock.calls()).toBe(0)
  })

  test('no whisper on phones', async ({ page }) => {
    const { mock } = await setup(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.clock.install()
    await visit(page)
    await expect(whisper(page)).toHaveCount(0)
    expect(mock.calls()).toBe(0)
  })

  test('no cold nudge', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.clock.install()
    const { mock } = await setup(page)
    const w = await openWidget(page, '/nl/pricing')
    await w.locator('button[aria-label="Sluit chat"]').click()
    await expect(w).toBeHidden()
    await page.clock.fastForward(45_000)
    await expect(page.getByText(PROACTIVE_PROMPTS.nl['/pricing']!)).toHaveCount(0)
    expect(mock.calls()).toBe(0)
  })
})
