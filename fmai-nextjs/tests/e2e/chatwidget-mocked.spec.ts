import { readFileSync } from 'node:fs'
import { test, expect, type Locator, type Page } from '@playwright/test'
import { PROACTIVE_PROMPTS, WHISPERS } from '../../src/components/chatbot/widget-copy'
import { SSE_HEADERS, mockChatbot, openWidget, send, uiStream } from './helpers/chatbot-mock'
import {
  BOOK,
  CASE,
  PRICING,
  QUALIFY,
  REMEMBER_OFFER,
  ROI,
  ROI_NEEDS_INPUT,
  SKILLS,
} from './helpers/chatbot-fixtures'

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
            () => !!document.activeElement?.closest('[data-chatwidget-panel]'),
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
        ? r.fulfill({
            status: 500,
            contentType: 'application/json',
            body: '{"error":"x"}',
          })
        : r.fulfill({
            status: 200,
            headers: SSE_HEADERS,
            body: uiStream({ text: 'Vier niveaus.' }),
          }),
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
        ? r.fulfill({
            status: 500,
            contentType: 'application/json',
            body: '{"error":"x"}',
          })
        : r.fulfill({
            status: 200,
            headers: SSE_HEADERS,
            body: uiStream({ text: `Antwoord ${n}.` }),
          }),
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
        : r.fulfill({
            status: 500,
            contentType: 'application/json',
            body: '{"error":"x"}',
          }),
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
        body: JSON.stringify({
          error: "Please don't share personal information like email",
        }),
      }),
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
        body: JSON.stringify({
          error: 'Rate limit exceeded',
          resetAt: Date.now() + 90_000,
        }),
      }),
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
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body: uiStream({ text: `Antwoord ${n}.` }),
      }),
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
      /\/nl\/apply$/,
    )
    expect(m.calls()).toBe(15)
  })
})

test.describe('one proactive hint', () => {
  const whisper = (page: Page) => page.getByText(WHISPERS.nl['/'])
  const consent = JSON.stringify({
    necessary: true,
    analytics: false,
    marketing: false,
  })

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
        (el) => el.tabIndex >= 0 && el.offsetParent !== null,
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
        ? r.fulfill({
            status: 500,
            contentType: 'application/json',
            body: '{"error":"x"}',
          })
        : r.fulfill({
            status: 200,
            headers: SSE_HEADERS,
            body: uiStream({ text: 'Klaar.' }),
          }),
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
      JSON.stringify({ necessary: true, analytics: false, marketing: false }),
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

test.describe('tool results render in the conversation', () => {
  async function ask(page: Page, tool: string, input: object, output: unknown, text: string) {
    const mock = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body: uiStream({ tool, input, output, text }),
      }),
    )
    const w = await openWidget(page)
    await send(w, 'vraag')
    return { mock, w }
  }

  test.describe('desktop', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test('case result is a card in the chat, widget stays 420 wide', async ({ page }) => {
      const { mock, w } = await ask(
        page,
        'get_case_study',
        { studyId: 'skc' },
        CASE,
        'Hier is de case.',
      )
      await expect(w.locator('[role="log"]').getByText('SkinClarity Club').first()).toBeVisible()
      expect((await w.boundingBox())!.width).toBeLessThanOrEqual(422)
      await expect(page.getByText('Bekijk details')).toHaveCount(0)
      expect(mock.calls()).toBe(1)
    })

    test('qualify_lead shows no score and no JSON, its offer is the application card', async ({ page }) => {
      const { mock, w } = await ask(
        page,
        'qualify_lead',
        { brandCount: 6, teamSize: 8 },
        QUALIFY,
        'Lijkt een goede match.',
      )
      const log = w.locator('[role="log"]')
      await expect(log.getByText('Lijkt een goede match.')).toBeVisible()
      // page-wide: the old panel sat outside the log
      await expect(page.getByText(/LEAD SCORE|HOT|strong/i)).toHaveCount(0)
      await expect(log.locator('pre')).toHaveCount(0)
      await expect(log.locator('[data-tool-card="book_call"]')).toHaveCount(1)
      // an offer gets the booking chips, not none
      await expect(w.getByRole('button', { name: 'Laat de case study zien' })).toBeVisible()
      expect(mock.calls()).toBe(1)
    })

    test('a fit offer next to book_call in one reply shows one application card', async ({ page }) => {
      const mock = await mockChatbot(page, (r) =>
        r.fulfill({
          status: 200,
          headers: SSE_HEADERS,
          body: uiStream({
            tools: [
              { tool: 'remember_context', input: { teamSize: 8, brandCount: 6 }, output: REMEMBER_OFFER },
              { tool: 'book_call', input: { reason: 'kennismaking' }, output: BOOK },
            ],
            text: 'Dit past goed bij jullie bureau.',
          }),
        }),
      )
      const w = await openWidget(page)
      await send(w, 'Wij zijn 8 mensen met 6 merken, plan een gesprek')
      const log = w.locator('[role="log"]')
      await expect(log.getByText('Dit past goed bij jullie bureau.')).toBeVisible()
      await expect(log.locator('[data-tool-card="remember_context"]')).toBeVisible()
      await expect(log.locator('[data-tool-card="book_call"]')).toHaveCount(1)
      expect(mock.calls()).toBe(1)
    })

    test('roi without stated hours shows no card and no figures', async ({ page }) => {
      const { mock, w } = await ask(
        page,
        'get_roi_estimate',
        { teamSize: 8 },
        ROI_NEEDS_INPUT,
        'Hoeveel uur per week besteedt jullie team aan marketing?',
      )
      const log = w.locator('[role="log"]')
      await expect(log.getByText(/Hoeveel uur per week/)).toBeVisible()
      await expect(log.locator('[data-tool-card]')).toHaveCount(0)
      await expect(log.locator('[data-roi-figure]')).toHaveCount(0)
      await expect(log.locator('pre')).toHaveCount(0)
      expect(mock.calls()).toBe(1)
    })
  })

  test.describe('phone', () => {
    test.use({ viewport: { width: 390, height: 844 } })

    test('result stays in the chat, nothing covers the input', async ({ page }) => {
      const { mock, w } = await ask(
        page,
        'get_case_study',
        { studyId: 'skc' },
        CASE,
        'Hier is de case.',
      )
      await expect(w.locator('[role="log"]').getByText('SkinClarity Club').first()).toBeVisible()
      const ta = w.locator('textarea')
      await expect(ta).toBeVisible()
      await ta.click({ timeout: 3000 })
      await expect(ta).toBeFocused()
      expect(mock.calls()).toBe(1)
    })
  })
})

const CARDS = [
  { tool: 'get_skills', out: SKILLS },
  { tool: 'get_case_study', out: CASE },
  { tool: 'get_pricing_info', out: PRICING },
  { tool: 'get_roi_estimate', out: ROI },
  { tool: 'book_call', out: BOOK },
]

test.describe('compact cards', () => {
  async function show(page: Page, tool: string, out: unknown) {
    const mock = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body: uiStream({ tool, input: {}, output: out, text: 'Hier.' }),
      }),
    )
    const w = await openWidget(page)
    await send(w, 'vraag')
    const card = w.locator('[role="log"] [data-tool-card]').last()
    await expect(card).toBeVisible()
    // the card animates in; wait for the text answer so the height is final
    await expect(w.locator('[role="log"]').getByText('Hier.')).toBeVisible()
    return { mock, w, card }
  }

  test.describe('desktop', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    for (const { tool, out } of CARDS) {
      test(`${tool} stays compact`, async ({ page }) => {
        const { mock, card } = await show(page, tool, out)
        await expect(card).toHaveAttribute('data-tool-card', tool)
        expect((await card.boundingBox())!.height).toBeLessThanOrEqual(360)
        expect(mock.calls()).toBe(1)
      })
    }

    test('case shows at most 3 bullets and the honesty line', async ({ page }) => {
      const { card } = await show(page, 'get_case_study', CASE)
      await expect(card.locator('li')).toHaveCount(3)
      await expect(card.getByText(/^Gemeten resultaten/)).toBeVisible()
      await expect(card.getByText('Uitdaging')).toHaveCount(0)
    })

    test('the case card is its own block, not inside the text bubble', async ({ page }) => {
      const { w, card } = await show(page, 'get_case_study', CASE)
      await expect(card.locator('xpath=ancestor::*[@data-assistant-bubble]')).toHaveCount(0)
      const bubble = w.locator('[role="log"] [data-assistant-bubble]').last()
      const [c, b] = [await card.boundingBox(), await bubble.boundingBox()]
      expect(c!.width).toBeGreaterThan(b!.width)
    })

    test('pricing shows 4 rows', async ({ page }) => {
      const { card } = await show(page, 'get_pricing_info', PRICING)
      await expect(card.locator('li')).toHaveCount(4)
    })

    test('skills shows 5 rows and a coming soon pill', async ({ page }) => {
      const { card } = await show(page, 'get_skills', SKILLS)
      await expect(card.locator('li')).toHaveCount(5)
      await expect(card.getByText('Binnenkort')).toHaveCount(1)
    })

    test('roi shows the own hours and the price, and claims no saving', async ({ page }) => {
      const { card } = await show(page, 'get_roi_estimate', ROI)
      await expect(card.locator('[data-roi-figure]')).toHaveCount(3)
      await expect(card.getByText('40 uur')).toBeVisible()
      await expect(card.getByText('173 uur')).toBeVisible()
      await expect(card.getByText('€2.394')).toBeVisible()
      await expect(card.getByText('abonnement per maand (6 merken)')).toBeVisible()
      await expect(card.getByText(/nog niet gemeten/)).toBeVisible()
      await expect(card.getByText(/besparing|ROI|%|terugverdien/i)).toHaveCount(0)
    })
  })

  for (const { tool, out, name, href } of [
    {
      tool: 'get_case_study',
      out: CASE,
      name: /Lees de case/,
      href: /\/nl\/case-studies\/skinclarity-club$/,
    },
    {
      tool: 'get_skills',
      out: SKILLS,
      name: /Alle vaardigheden/,
      href: /\/skills$/,
    },
    {
      tool: 'get_pricing_info',
      out: PRICING,
      name: /Alle prijzen/,
      href: /\/pricing$/,
    },
    {
      tool: 'book_call',
      out: BOOK,
      name: /Aanvraag starten/,
      href: /\/nl\/apply$/,
    },
  ]) {
    test(`${tool} link goes to the right page`, async ({ page }) => {
      const { card } = await show(page, tool, out)
      await expect(card.getByRole('link', { name })).toHaveAttribute('href', href)
    })
  }

  test('skills card shows live skills before coming-soon ones', async ({ page }) => {
    const live = (i: number) => ({
      name: `Live ${i}`,
      description: 'Beschrijving.',
      url: `/nl/skills/live-${i}`,
      status: 'live',
    })
    const soon = (i: number) => ({ ...live(i), name: `Soon ${i}`, status: 'coming_soon' })
    const { card } = await show(page, 'get_skills', {
      ...SKILLS,
      services: [soon(1), soon(2), live(1), live(2), live(3), live(4), live(5), live(6)],
    })
    await expect(card.locator('li')).toHaveCount(5)
    await expect(card.getByText('Live 5')).toBeVisible()
    await expect(card.getByText('Binnenkort')).toHaveCount(0)
    await expect(card.getByText('Soon 1')).toHaveCount(0)
  })

  test('a single skill keeps its link to all skills', async ({ page }) => {
    const { card } = await show(page, 'get_skills', {
      name: 'Social Media',
      description: 'Posts en carrousels.',
      features: ['Content kalender'],
      url: '/nl/skills/social-media',
    })
    await expect(card.getByRole('link', { name: /Alle vaardigheden/ })).toHaveAttribute(
      'href',
      /\/skills$/,
    )
  })

  test('a single tier keeps its link to all prices', async ({ page }) => {
    const { card } = await show(page, 'get_pricing_info', {
      name: 'Growth',
      description: '€499 per werkruimte',
      features: ['2-4 merken'],
    })
    await expect(card.getByRole('link', { name: /Alle prijzen/ })).toHaveAttribute(
      'href',
      /\/pricing$/,
    )
  })

  test.describe('phone', () => {
    test.use({ viewport: { width: 390, height: 844 } })

    for (const { tool, out } of CARDS) {
      test(`${tool} fits at 390`, async ({ page }) => {
        const { w, mock } = await show(page, tool, out)
        const fits = await w
          .locator('[role="log"]')
          .evaluate((el) => el.scrollWidth <= el.clientWidth)
        expect(fits).toBe(true)
        expect(mock.calls()).toBe(1)
      })
    }
  })
})

test.describe('memory chip and sheet', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  const SEEDED = {
    v: 1,
    profile: { agencyName: 'Studio Noord', niche: 'skincare', brandCount: 6, teamSize: 8 },
  }
  const remember = (remembered: object) => ({
    tool: 'remember_context',
    input: remembered,
    output: { remembered },
  })
  const stored = (page: Page) =>
    page.evaluate(
      () => JSON.parse(localStorage.getItem('clyde:memory') ?? '{"profile":{}}').profile,
    )

  test('seeded memory shows the chip; sheet lists and forgets', async ({ page }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page, '/nl', { memory: SEEDED })
    await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
    await expect(w.getByText('Wat Clyde onthoudt')).toBeVisible()
    await expect(
      w.getByRole('region', { name: 'Wat Clyde onthoudt' }).getByText('Studio Noord'),
    ).toBeVisible()
    await w.getByRole('button', { name: 'Wis alles' }).click()
    await expect(w.getByRole('button', { name: /Onthoudt/ })).toHaveCount(0)
    expect(await stored(page)).toEqual({})
    expect(mock.calls()).toBe(0)
  })

  test('sheet closes on Escape, keeps the chat open and returns focus to the chip', async ({
    page,
  }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page, '/nl', { memory: SEEDED })
    const chip = w.getByRole('button', { name: 'Onthoudt 4 dingen' })
    await chip.click()
    const sheet = w.getByRole('region', { name: 'Wat Clyde onthoudt' })
    await expect(sheet).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(sheet).toHaveCount(0)
    await expect(w).toBeVisible()
    await expect(chip).toBeFocused()
    expect(mock.calls()).toBe(0)
  })

  test('memory plus card in one turn', async ({ page }) => {
    const mock = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body: uiStream({
          tools: [
            remember({ agencyName: 'Studio Noord' }),
            { tool: 'get_case_study', input: {}, output: CASE },
          ],
          text: 'Hier.',
        }),
      }),
    )
    const w = await openWidget(page)
    await send(w, 'vraag')
    const log = w.locator('[role="log"]')
    await expect(log.getByText('Onthouden: Studio Noord')).toBeVisible()
    await expect(log.locator('[data-tool-card="get_case_study"]')).toBeVisible()
    await expect(w.getByRole('button', { name: 'Onthoudt 1 ding' })).toBeVisible()
    await expect(log.locator('pre')).toHaveCount(0)
    expect(mock.calls()).toBe(1)
  })

  test('Wis alles stays wiped during the conversation', async ({ page }) => {
    const mock = await mockChatbot(page, (r, n) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body:
          n === 1
            ? uiStream({ ...remember({ agencyName: 'Studio Noord' }), text: 'Genoteerd.' })
            : uiStream({ text: 'Prima.' }),
      }),
    )
    const w = await openWidget(page)
    await send(w, 'een')
    await w.getByRole('button', { name: 'Onthoudt 1 ding' }).click()
    await w.getByRole('button', { name: 'Wis alles' }).click()
    await send(w, 'twee')
    await expect(w.locator('[role="log"]').getByText('Prima.')).toBeVisible()
    await expect(w.getByRole('button', { name: /Onthoudt/ })).toHaveCount(0)
    expect(await stored(page)).toEqual({})
    expect(mock.calls()).toBe(2)
  })

  test('a new capture merges into the seeded profile instead of replacing it', async ({ page }) => {
    const mock = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body: uiStream({ ...remember({ goal: 'meer leads' }), text: 'Genoteerd.' }),
      }),
    )
    const w = await openWidget(page, '/nl', { memory: SEEDED })
    await send(w, 'ons doel is meer leads')
    await expect(w.getByRole('button', { name: 'Onthoudt 5 dingen' })).toBeVisible()
    await expect.poll(() => stored(page)).toEqual({ ...SEEDED.profile, goal: 'meer leads' })
    expect(mock.calls()).toBe(1)
  })

  test('a capture that streams while the chat is closed still reaches the chip and storage', async ({
    page,
  }) => {
    let answered = false
    const mock = await mockChatbot(page, async (r) => {
      await new Promise((res) => setTimeout(res, 1500))
      await r
        .fulfill({
          status: 200,
          headers: SSE_HEADERS,
          body: uiStream({ ...remember({ agencyName: 'Studio Noord' }), text: 'Genoteerd.' }),
        })
        .catch(() => {})
      answered = true
    })
    const w = await openWidget(page)
    await send(w, 'Wij zijn Studio Noord')
    await page.getByRole('button', { name: 'Sluit chat' }).first().click()
    await expect(page.locator('[data-chatwidget-panel]')).toHaveCount(0)
    await expect.poll(() => answered).toBe(true)
    // saved while the panel was still closed
    await expect.poll(() => stored(page)).toEqual({ agencyName: 'Studio Noord' })
    await page.locator('button[aria-label^="Open chat met Clyde"]').first().click()
    const w2 = page.locator('[data-chatwidget-panel]').first()
    await expect(w2.locator('[role="log"]').getByText('Onthouden: Studio Noord')).toBeVisible()
    await expect(w2.getByRole('button', { name: 'Onthoudt 1 ding' })).toBeVisible()
    expect(mock.calls()).toBe(1)
  })

  test('after Wis alles a new capture shows the chip but leaves the sheet closed', async ({
    page,
  }) => {
    const mock = await mockChatbot(page, (r, n) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body:
          n === 1
            ? uiStream({ ...remember({ agencyName: 'Studio Noord' }), text: 'Genoteerd.' })
            : uiStream({ ...remember({ teamSize: 5 }), text: 'Vijf mensen, genoteerd.' }),
      }),
    )
    const w = await openWidget(page)
    await send(w, 'een')
    await w.getByRole('button', { name: 'Onthoudt 1 ding' }).click()
    await w.getByRole('button', { name: 'Wis alles' }).click()
    await send(w, 'we zijn met 5')
    await expect(w.locator('[role="log"]').getByText('Vijf mensen, genoteerd.')).toBeVisible()
    const chip = w.getByRole('button', { name: 'Onthoudt 1 ding' })
    await expect(chip).toBeVisible()
    await expect(chip).toHaveAttribute('aria-expanded', 'false')
    await expect(w.getByRole('region', { name: 'Wat Clyde onthoudt' })).toHaveCount(0)
    expect(mock.calls()).toBe(2)
  })

  test('after Wis alles one Escape closes the chat', async ({ page }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page, '/nl', { memory: SEEDED })
    await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
    await w.getByRole('button', { name: 'Wis alles' }).click()
    await expect(w.getByRole('button', { name: /Onthoudt/ })).toHaveCount(0)
    await expect(w.locator('textarea')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-chatwidget-panel]')).toHaveCount(0)
    expect(mock.calls()).toBe(0)
  })

  test('the sheet close button is named for the sheet, not the chat', async ({ page }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page, '/nl', { memory: SEEDED })
    await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
    const sheet = w.getByRole('region', { name: 'Wat Clyde onthoudt' })
    await expect(sheet.getByRole('button', { name: 'Sluit geheugen' })).toBeVisible()
    await expect(sheet.getByRole('button', { name: 'Sluit chat' })).toHaveCount(0)
    await expect(w.getByRole('button', { name: 'Sluit chat' })).toHaveCount(1)
    expect(mock.calls()).toBe(0)
  })

  test('counts carry units in the remembered line and in the sheet', async ({ page }) => {
    const mock = await mockChatbot(page, (r) =>
      r.fulfill({
        status: 200,
        headers: SSE_HEADERS,
        body: uiStream({
          ...remember({ agencyName: 'Studio Noord', niche: 'skincare', brandCount: 6, teamSize: 8 }),
          text: 'Genoteerd.',
        }),
      }),
    )
    const w = await openWidget(page)
    await send(w, 'wij zijn Studio Noord')
    await expect(
      w.locator('[role="log"]').getByText('Onthouden: Studio Noord · skincare · 6 merken · 8 mensen'),
    ).toBeVisible()
    await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
    const sheet = w.getByRole('region', { name: 'Wat Clyde onthoudt' })
    await expect(sheet.getByText('6 merken', { exact: true })).toBeVisible()
    await expect(sheet.getByText('8 mensen', { exact: true })).toBeVisible()
    expect(mock.calls()).toBe(1)
  })

  test('the sheet note says what is true: saved with consent, session only without', async ({
    page,
  }) => {
    const { mock } = await setup(page)
    const w = await openWidget(page, '/nl', { memory: SEEDED })
    await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
    const sheet = w.getByRole('region', { name: 'Wat Clyde onthoudt' })
    await expect(sheet.getByText('Alleen in deze browser, voor je volgende bezoek.')).toBeVisible()
    await sheet.getByRole('button', { name: 'Sluit geheugen' }).click()
    await page.evaluate(() => localStorage.removeItem('cookieConsent'))
    await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
    await expect(sheet.getByText('Alleen voor dit gesprek.')).toBeVisible()
    await expect(sheet.getByText('voor je volgende bezoek')).toHaveCount(0)
    expect(mock.calls()).toBe(0)
  })
})

// Memory is a floating-widget feature: embedded captures are never persisted, so a chip or
// sheet there would promise "voor je volgende bezoek" for data that is not saved. Pin the
// wiring: of the two ChatInput render paths only the floating one gets the chip.
test('memory chip is wired into the floating ChatInput only', async () => {
  const src = readFileSync('src/components/chatbot/ChatWidget.tsx', 'utf8')
  expect(src.match(/<ChatInput\b/g)).toHaveLength(2)
  expect(src.match(/footerEnd=/g)).toHaveLength(1)
  expect(src.match(/footerEnd=\{isFlagship \? <MemoryChip\b/g)).toHaveLength(1)
})
