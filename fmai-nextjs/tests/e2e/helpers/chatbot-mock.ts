import { expect, type Locator, type Page, type Route } from '@playwright/test'

export const SSE_HEADERS = {
  'content-type': 'text/event-stream',
  'x-vercel-ai-ui-message-stream': 'v1',
}

/** AI SDK UI message stream, in the order the SDK itself emits it. */
export const uiStream = (opts: {
  text?: string
  tool?: string
  input?: object
  output?: unknown
  /** Several tool calls in one turn; `tool` stays as the one-call shorthand. `errorText` fails that call. */
  tools?: Array<{ tool: string; input?: object; output?: unknown; errorText?: string }>
}): string => {
  const c: object[] = [{ type: 'start', messageId: 'mock-' + Math.random().toString(36).slice(2) }]
  const tools =
    opts.tools ?? (opts.tool ? [{ tool: opts.tool, input: opts.input, output: opts.output }] : [])
  tools.forEach((t, i) => {
    c.push(
      { type: 'start-step' },
      {
        type: 'tool-input-available',
        toolCallId: `t${i + 1}`,
        toolName: t.tool,
        input: t.input ?? {},
      },
      t.errorText
        ? { type: 'tool-output-error', toolCallId: `t${i + 1}`, errorText: t.errorText }
        : { type: 'tool-output-available', toolCallId: `t${i + 1}`, output: t.output },
      { type: 'finish-step' }
    )
  })
  if (opts.text) {
    c.push(
      { type: 'start-step' },
      { type: 'text-start', id: 'x1' },
      { type: 'text-delta', id: 'x1', delta: opts.text },
      { type: 'text-end', id: 'x1' },
      { type: 'finish-step' }
    )
  }
  c.push({ type: 'finish' })
  return c.map((x) => `data: ${JSON.stringify(x)}\n\n`).join('') + 'data: [DONE]\n\n'
}

/** Answers every /api/chatbot request; the real API is never reached. n is 1-based. */
export async function mockChatbot(
  page: Page,
  handler: (route: Route, n: number) => Promise<void>
): Promise<{ calls: () => number }> {
  let n = 0
  await page.route('**/api/chatbot**', async (route) => {
    n += 1
    await handler(route, n)
  })
  return { calls: () => n }
}

export async function openWidget(
  page: Page,
  path = '/nl',
  opts?: { memory?: object; counts?: Record<string, number> }
): Promise<Locator> {
  await page.addInitScript(
    ({ consent, memory, counts }) => {
      try {
        localStorage.setItem('cookieConsent', consent)
        if (memory) localStorage.setItem('clyde:memory', memory)
        if (counts)
          localStorage.setItem(
            'chatbot-store',
            JSON.stringify({
              state: { sessionId: 'mock', personaId: 'clyde', messageCounts: counts },
              version: 0,
            })
          )
      } catch {}
    },
    {
      // analytics/marketing off: the test bot must not land in GA4
      consent: JSON.stringify({ necessary: true, analytics: false, marketing: false }),
      memory: opts?.memory ? JSON.stringify(opts.memory) : null,
      counts: opts?.counts ?? null,
    }
  )
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  const panel = page.locator('[data-chatwidget-panel]').first()
  // A click before hydration is lost, so retry until the panel opens.
  await expect(async () => {
    await page.locator('button[aria-label^="Open chat met Clyde"]').first().click({ timeout: 2000 })
    await expect(panel).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 40000 })
  return panel
}

/** Types and submits the way a user does: Enter in the textarea. */
export async function send(panel: Locator, text: string): Promise<void> {
  const box = panel.locator('textarea')
  await box.fill(text)
  await box.press('Enter')
}
