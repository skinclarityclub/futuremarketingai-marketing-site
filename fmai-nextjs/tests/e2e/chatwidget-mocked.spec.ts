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
      await expect(w.locator('textarea')).toBeFocused()
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
    const rows = w
      .locator('button')
      .filter({ has: page.locator('svg') })
      .filter({ hasText: /\?|Laat een echte klant zien/ })
    await expect(rows).toHaveCount(3)
    // polled: the panel scales in for 220ms
    await expect
      .poll(async () => {
        const b = await Promise.all([0, 1, 2].map((i) => rows.nth(i).boundingBox()))
        const same = new Set(b.map((x) => Math.round(x!.x))).size === 1
        return same && b[1]!.y > b[0]!.y && b[2]!.y > b[1]!.y
      })
      .toBe(true)
    await expect(w.getByText('Of volg een korte rondleiding')).toBeVisible()
    await expect
      .poll(async () => (await rows.first().boundingBox())!.height)
      .toBeGreaterThanOrEqual(40)
    expect(mock.calls()).toBe(0)
  })
})

test.describe('errors and the limit', () => {
  test('500 shows "Geen antwoord ontvangen" under the question and Opnieuw resends', async ({
    page,
  }) => {
    const m = await mockChatbot(page, async (r, n) =>
      n === 1
        ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
        : r.fulfill({
            status: 200,
            headers: SSE_HEADERS,
            body: uiStream({ text: 'Vier niveaus.' }),
          })
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
    const retry = w.getByRole('button', { name: 'Opnieuw', exact: true })
    // polled: the panel scales in; the hit area is padding around a text-xs label
    await expect.poll(async () => (await retry.boundingBox())!.height).toBeGreaterThanOrEqual(40)
    await retry.click()
    await expect(w.getByText('Vier niveaus.')).toBeVisible()
    expect(m.calls()).toBe(2)
  })

  test('a failed attempt does not count toward the 15', async ({ page }) => {
    const m = await mockChatbot(page, async (r, n) =>
      n === 1
        ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
        : r.fulfill({
            status: 200,
            headers: SSE_HEADERS,
            body: uiStream({ text: `Antwoord ${n}.` }),
          })
    )
    const w = await openWidget(page)
    await send(w, 'Vraag 1')
    await w.getByRole('button', { name: 'Opnieuw', exact: true }).click()
    await expect(w.getByText('Antwoord 2.', { exact: true })).toBeVisible()
    // 11 replies so far (1 retry + 10): the warning belongs to reply 12, not earlier
    for (let i = 2; i <= 11; i++) {
      await send(w, `Vraag ${i}`)
      await expect(w.getByText(`Antwoord ${i + 1}.`, { exact: true })).toBeVisible()
    }
    await expect(w.getByText('Nog 3 berichten in dit gesprek.')).toHaveCount(0)
    await send(w, 'Vraag 12')
    await expect(w.getByText('Nog 3 berichten in dit gesprek.')).toBeVisible()
    expect(m.calls()).toBe(13)
  })

  test('a failure hides the regenerate action on the previous answer', async ({ page }) => {
    const m = await mockChatbot(page, async (r, n) =>
      n === 1
        ? r.fulfill({
            status: 200,
            headers: SSE_HEADERS,
            body: uiStream({ text: 'Eerste antwoord.' }),
          })
        : r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
    )
    const w = await openWidget(page)
    await send(w, 'Vraag een')
    await expect(w.getByText('Eerste antwoord.')).toBeVisible()
    await expect(w.getByRole('button', { name: /Opnieuw genereren/ })).toHaveCount(1)
    await send(w, 'Vraag twee')
    await expect(w.getByText('Geen antwoord ontvangen')).toBeVisible()
    await expect(w.getByRole('button', { name: /Opnieuw genereren/ })).toHaveCount(0)
    expect(m.calls()).toBe(2)
  })

  test('400 on personal data says so, without a retry button', async ({ page }) => {
    const m = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: "Please don't share personal information like email" }),
      })
    )
    const w = await openWidget(page)
    await send(w, 'mail me op a@b.nl')
    await expect(w.getByText(/Clyde kan geen persoonlijke gegevens/)).toBeVisible()
    await expect(w.getByText('Geen antwoord ontvangen')).toHaveCount(0)
    await expect(w.getByRole('button', { name: 'Opnieuw', exact: true })).toHaveCount(0)
    expect(m.calls()).toBe(1)
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
    await expect(w.getByText('Verder praten?')).toBeVisible()
    for (let i = 13; i <= 15; i++) {
      await send(w, `Vraag ${i}`)
      await expect(w.getByText(`Antwoord ${i}.`, { exact: true })).toBeVisible()
    }
    await expect(w.locator('textarea')).toBeDisabled()
    await expect(w.getByText('Dit gesprek zit vol.').first()).toBeVisible()
    await expect(w.getByRole('link', { name: 'Aanvraag starten' })).toHaveAttribute(
      'href',
      /\/nl\/apply$/
    )
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

test.describe('focus on desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('following a page link does not pull focus to the launcher', async ({ page }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page)
    const link = page.locator('footer a[href="/nl/how-it-works"]').first()
    await link.focus()
    await page.keyboard.press('Enter')
    await page.waitForURL(/\/nl\/how-it-works/)
    await expect(w).toBeHidden()
    const launcher = page.locator('[data-clyde-launcher]').first()
    await expect(launcher).toBeVisible()
    await expect(launcher).not.toBeFocused()
    expect(mock.calls()).toBe(0)
  })

  test('Escape outside the panel leaves it open, inside it closes', async ({ page }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page)
    await page.locator('footer a').first().focus()
    await page.keyboard.press('Escape')
    await expect(w).toBeVisible()
    await w.locator('textarea').focus()
    await page.keyboard.press('Escape')
    await expect(w).toBeHidden()
    await expect(page.locator('[data-clyde-launcher]').first()).toBeFocused()
    expect(mock.calls()).toBe(0)
  })
})

test.describe('phone modal', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('page behind is inert while open, Shift+Tab wraps, inert is gone after close', async ({
    page,
  }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page)
    await expect(page.locator('#main')).toHaveAttribute('inert', '')
    await expect(page.locator('header').first()).toHaveAttribute('inert', '')
    await expect(page.locator('footer').first()).toHaveAttribute('inert', '')
    // Shift+Tab from the first focusable wraps to the last
    const focusables =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    await w.locator(focusables).first().focus()
    await page.keyboard.press('Shift+Tab')
    const lastIsFocused = await page.evaluate((sel) => {
      const panel = document.querySelector('[data-chatwidget-panel]')!
      const items = Array.from(panel.querySelectorAll<HTMLElement>(sel)).filter(
        (el) => el.tabIndex >= 0 && el.offsetParent !== null
      )
      return document.activeElement === items[items.length - 1]
    }, focusables)
    expect(lastIsFocused).toBe(true)
    await w.locator('button[aria-label="Sluit chat"]').click()
    await expect(w).toBeHidden()
    await expect(page.locator('#main')).not.toHaveAttribute('inert', '')
    expect(mock.calls()).toBe(0)
  })

  test('after Opnieuw focus is back in the composer', async ({ page }) => {
    const m = await mockChatbot(page, async (r, n) =>
      n === 1
        ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
        : r.fulfill({ status: 200, headers: SSE_HEADERS, body: uiStream({ text: 'Klaar.' }) })
    )
    const w = await openWidget(page)
    await send(w, 'Hallo')
    await w.getByRole('button', { name: 'Opnieuw', exact: true }).click()
    await expect(w.getByText('Klaar.')).toBeVisible()
    await expect(w.locator('textarea')).toBeFocused()
    expect(m.calls()).toBe(2)
  })
})

test.describe('whisper animates', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the whisper element exists, hidden, before the stage flips', async ({ page }) => {
    const { mock } = await setup(page)
    await page.clock.install()
    await page.addInitScript(
      (c) => {
        try {
          localStorage.setItem('cookieConsent', c)
        } catch {}
      },
      JSON.stringify({ necessary: true, analytics: false, marketing: false })
    )
    await page.goto('/nl', { waitUntil: 'load' })
    await page.waitForLoadState('networkidle')
    const text = page.getByText(WHISPERS.nl['/'])
    // mounted in advance: an element inserted with the stage change would skip its transition
    await expect(text).toHaveCount(1)
    const pill = text.locator('xpath=ancestor::span[contains(@class,"clyde-status")]')
    await expect(pill).toHaveCSS('opacity', '0')
    await page.clock.fastForward(21_000)
    await expect(pill).toHaveCSS('opacity', '1')
    expect(mock.calls()).toBe(0)
  })
})
