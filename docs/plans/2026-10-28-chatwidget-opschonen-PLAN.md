# Clyde-widget opschonen (future-marketing.ai) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Clyde chat widget on future-marketing.ai says it is AI, stops locking visitors out, shows errors at the question, and shows every tool result as a compact card in the chat instead of in a side panel.

**Architecture:** Two stacked PRs. PR 1 (Task 1-6) contains the legal fixes and the bugs; it touches only the widget chrome, the copy and the limit/error state. PR 2 (Task 7-10) removes `SidePanel` and its store state, renders all tool results through the existing `ToolResultRenderer` (the path the embedded mode already uses), compacts the cards, and moves memory into a chip plus a sheet inside the chat column. New logic lives in small pure modules so it can be tested without a browser.

**Tech Stack:** Next.js 16, React 19, next-intl 4.8, AI SDK `ai ~6.0.168` / `@ai-sdk/react ~3.0.170`, zustand persist, Tailwind 4, Playwright 1.59 (also used as the runner for pure-logic specs, like `tests/e2e/memory-merge.spec.ts`).

**Spec (approved by Daley 2026-10-28: "Ik volg jouw voorkeur, maak het zo sota mogelijk dus doe maar"):**
- `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-10-28-clyde-chat-opschonen/index-fmai.html`: proposals 1-6, boards on the right.
- `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-10-28-clyde-chat-opschonen/sota-fmai.md`: SOTA and the file:line findings.
- Board source: `werk/fmai/make-boards.mjs` in that folder. Mock-stream example: `werk/fmai/shots.mjs` in that folder.

All paths below are relative to `fmai-nextjs/` in the worktree `C:/tmp/fmai-chatwidget-audit`, branch `chore/chatwidget-opschonen`, base origin/main 8c42a42. Line numbers are as of 8c42a42.

## Global Constraints

**Calls and copy**
- **Zero paid calls.** Never run a spec that sends a chat message to the real API: `chatbot`, `clyde-audit`, `clyde-capture`, `clyde-memory`, `demo-full-flow`, `guided-demo`, `memory-v2-recall`. Change those by static edit only and prove them with `npx tsc --noEmit`. Every new browser spec answers `**/api/chatbot` with `page.route`.
- **Copy:**
  - NL is authoritative. Every new string exists in nl, en and es.
  - No em-dash (`—`) in any user-facing string.
  - "AI-collega" lowercase with a hyphen; never "AI Collega" standalone (competitor brand).
- **Styling:** theme tokens only (`bg-bg-surface`, `bg-bg-elevated`, `text-accent-system`, `text-text-faint`, …), no new hex colours (`npm run check:palette`).
- **Touch targets:** at least 40×40 CSS px for header buttons, send and close (WCAG 2.2 SC 2.5.8 is 24; we pick 40).

**Process**
- Push, PR and merge only on Daley's explicit yes. A merge to `main` is a deploy of the live site.
- Read code only in this worktree. The local `main` of `C:/Users/daley/Desktop/Futuremarketingai` is stale.
- **Setup, once:** the worktree has no `node_modules`.
  - Run `npm ci` in `fmai-nextjs/`. Never junction or copy them from the main checkout: removing the worktree would delete them.
  - Check free space on C: first; it was 98% full on 2026-10-28.
  - If Playwright reports a missing browser, run `npx playwright install chromium`.

**Gate per PR, all must exit 0**
- `npx tsc --noEmit`
- `npm run lint`
- `npm run check:palette`
- `npm run check:copy`
- `npm run check:i18n-orphans`
- `npm run build`
- `npx playwright test tests/e2e/chat-logic.spec.ts tests/e2e/widget-copy.spec.ts tests/e2e/memory-merge.spec.ts tests/e2e/memory-welcome-back.spec.ts tests/e2e/memory-persistence.spec.ts tests/e2e/clyde-i18n-render.spec.ts tests/e2e/chatwidget-mocked.spec.ts --project=chromium`

**Decisions (Daley, 2026-10-28):**
- **D1.** Memory across visits stays as it is today: it is read whenever `cookieConsent` exists. It now gets a 30-day expiry (Task 9).
- **D2.** The limit stays 15 replies per conversation, and the server stays 15 per hour per session (`src/lib/chatbot/rate-limiter.ts:22-28`, untouched).
- **D3.** 48 hours everywhere. Already 48: `leadgen-tools.ts` `QUALIFY_COPY`, `concierge-kb.ts:117,222`, `lib/email/contact-templates.ts:65-68`. Task 8 changes the two 24-hour outliers: `cardI18n.ts:91` `trustResponse` and `concierge-kb.ts:226`.
- **Spanish says "IA", not "AI".** The es site copy uses "IA" (`ChatWidgetIsland.tsx:87` "compañero de IA", 116× in `messages/es.json`). Every es string below that names AI uses "IA", and every test that checks for the AI word uses the per-locale regex `AI_WORD = { nl: /\bAI\b/, en: /\bAI\b/, es: /\bIA\b/ }`.
- No re-run of the live mobile shots; mobile is covered by the visual proof in Task 6 and 10.

**Test server:** every browser spec runs against a dev server of THIS worktree on port 3123: `PLAYWRIGHT_BASE_URL=http://localhost:3123 npx playwright test …`. Without that variable, `playwright.config.ts:42-47` reuses whatever already listens on port 3000, which may be another checkout.

## Review Focus

1. **A visitor whose old `localStorage['chatbot-store']` holds `messageCounts.clyde >= 15` (written before this deploy) must be able to type.** Pinned in Task 4: "stale persisted count does not lock the input".
2. **A 429 in the middle of a conversation must say when to retry, not "something went wrong"; a 500 must offer Opnieuw, which really resends.** Pinned in Task 4.
3. **A turn with `remember_context` plus a card must render the card inline and update the memory chip, with no panel and no JSON dump.** Pinned in Task 9: "memory plus card in one turn".
4. **At 390px no card may cause horizontal scroll inside the message log.** Pinned in Task 8: "cards fit at 390".
5. **A stored memory profile from before Task 9 (no `savedAt`) must load and not be wiped.** Pinned in Task 9: "legacy profile without savedAt loads".

---

## PR 1: wet en bugs (proposals 1, 5, 6)

### Task 1: Pure limit and error helpers

**Files:**
- Create: `src/lib/chatbot/message-limit.ts`
- Create: `src/lib/chatbot/chat-error.ts`
- Test: `tests/e2e/chat-logic.spec.ts` (pure-logic, no browser; same shape as `tests/e2e/memory-merge.spec.ts`)

**Interfaces:**
- Produces:
  - `export const MESSAGE_LIMIT = 15`
  - `export function limitState(count: number, limit = MESSAGE_LIMIT): { remaining: number; warn: boolean; atLimit: boolean }`. `remaining = max(0, limit - count)`, `warn = remaining > 0 && remaining <= 3`, `atLimit = remaining === 0`.
  - `export type ChatFailure = { kind: 'rate-limit'; minutes: number } | { kind: 'failed' }`
  - `export function classifyChatError(error: Error | undefined, now?: number): ChatFailure | null`
    - `null` without an error.
    - `rate-limit` when `error.message` parses as JSON with `error === 'Rate limit exceeded'` (the body from `src/lib/chatbot/engine.ts:97-104`).
    - `minutes = max(1, ceil((resetAt - now) / 60000))`, and 1 when `resetAt` is missing.
    - Otherwise `failed`.

- [ ] **Step 1: Write the failing tests**

```ts
test('limitState', () => {
  expect(limitState(0)).toEqual({ remaining: 15, warn: false, atLimit: false })
  expect(limitState(12)).toEqual({ remaining: 3, warn: true, atLimit: false })
  expect(limitState(15)).toEqual({ remaining: 0, warn: false, atLimit: true })
  expect(limitState(40)).toEqual({ remaining: 0, warn: false, atLimit: true })
})
test('classifyChatError', () => {
  const now = 1_000_000
  expect(classifyChatError(undefined, now)).toBeNull()
  const body = JSON.stringify({ error: 'Rate limit exceeded', limitType: 'ip', resetAt: now + 150_000 })
  expect(classifyChatError(new Error(body), now)).toEqual({ kind: 'rate-limit', minutes: 3 })
  expect(classifyChatError(new Error(JSON.stringify({ error: 'Rate limit exceeded' })), now)).toEqual({ kind: 'rate-limit', minutes: 1 })
  expect(classifyChatError(new Error('Failed to fetch the chat response.'), now)).toEqual({ kind: 'failed' })
  expect(classifyChatError(new Error('{"error":"Invalid JSON body"}'), now)).toEqual({ kind: 'failed' })
})
```

- [ ] **Step 2: Run, expect FAIL (module not found).** Command: `npx playwright test tests/e2e/chat-logic.spec.ts --project=chromium`.
- [ ] **Step 3: Implement both modules with the signatures above.** Use `JSON.parse` inside `try`; no dependencies.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `feat(chatbot): pure limit and error classification for the widget`

### Task 2: Copy module with AI disclosure, three prompts, localized whispers

**Files:**
- Create: `src/components/chatbot/widget-copy.ts` (pure TS, no React)
- Modify:
  - `src/components/chatbot/ChatWidgetIsland.tsx`: move `WELCOME_MESSAGES` (:25), `SUGGESTED_PROMPTS` (:97), `PROACTIVE_PROMPTS` (:226) and `PROACTIVE_FOLLOWUPS` (:276) out, and import them.
  - `src/components/chatbot/FloatingChatTrigger.tsx`: move `WHISPERS` (:37-48) out.
  - `src/components/chatbot/welcome-back.ts`: every returned string names AI.
  - `src/components/chatbot/useChatChrome.ts`: new keys, see Interfaces.
- Test:
  - Create `tests/e2e/widget-copy.spec.ts`.
  - Extend `tests/e2e/memory-welcome-back.spec.ts`.

**Interfaces:**
- **Produces from `widget-copy.ts`:**
  - `WELCOME_MESSAGES`, `SUGGESTED_PROMPTS`, `PROACTIVE_PROMPTS` and `PROACTIVE_FOLLOWUPS`, with the same types as today.
  - `WHISPERS: Record<ChatLocale, Record<string, string>>`, with the same path keys as today's NL map in all three locales.
  - Import `ChatLocale` from where `ChatWidgetIsland.tsx` imports it today.
- **New `ChatChrome` keys** (in the `ChatChrome` interface at `useChatChrome.ts:107-125` and all three locale objects):

| key | nl | en | es |
|---|---|---|---|
| `aiLabel` | `AI` | `AI` | `IA` |
| `disclosure` | `Clyde is AI en kan zich vergissen.` | `Clyde is AI and can make mistakes.` | `Clyde es una IA y puede equivocarse.` |
| `noAnswer` | `Geen antwoord ontvangen` | `No reply received` | `No se recibió respuesta` |
| `rateLimited(m)` | `Even te veel vragen tegelijk. Probeer het over ${m} ${m === 1 ? 'minuut' : 'minuten'} opnieuw.` | `Too many questions at once. Try again in ${m} ${m === 1 ? 'minute' : 'minutes'}.` | `Demasiadas preguntas a la vez. Inténtalo de nuevo en ${m} ${m === 1 ? 'minuto' : 'minutos'}.` |
| `limitWarning(n)` | `Nog ${n} ${n === 1 ? 'bericht' : 'berichten'} in dit gesprek.` | `${n} ${n === 1 ? 'message' : 'messages'} left in this conversation.` | `${n === 1 ? 'Queda' : 'Quedan'} ${n} ${n === 1 ? 'mensaje' : 'mensajes'} en esta conversación.` |
| `limitReached` | `Dit gesprek zit vol.` | `This conversation is full.` | `Esta conversación está completa.` |
| `keepTalking` | `Verder praten?` | `Want to keep talking?` | `¿Seguimos hablando?` |
| `applyCta` | `Aanvraag starten` | `Start an application` | `Iniciar solicitud` |
| `inputAria` | `Typ een bericht voor Clyde` | `Message Clyde` | `Escribe un mensaje a Clyde` |
| `sendAria` | `Verstuur bericht` | `Send message` | `Enviar mensaje` |
| `stopAria` | `Stop het antwoord` | `Stop the reply` | `Detener la respuesta` |
| `answeringAria` | `Clyde antwoordt…` | `Clyde is replying…` | `Clyde está respondiendo…` |

- **Copy rules:**
  - Every `WELCOME_MESSAGES` value opens with the locale's AI intro.
    - nl: `Hoi, ik ben Clyde, een AI-collega.`, followed by the existing page sentence. The `default` value keeps its own "de AI-collega van je bureau".
    - en and es: the same pattern, using the AI wording of their `default` entry (es: "IA", e.g. `Hola, soy Clyde, un compañero de IA.`).
    - Fix the comment at `ChatWidgetIsland.tsx:22-23` when you move it: Spanish uses "IA", not "AI".
  - Every `SUGGESTED_PROMPTS` list has exactly 3 entries:
    - drop the "demo" chip (the tour stays as a link) and keep the page-specific ones;
    - the `/` list is `Wat kun je voor mijn bureau doen?`, `Wat kost het?`, `Laat een echte klant zien`;
    - mirror these in en and es.
  - `WHISPERS.en` and `WHISPERS.es` translate the NL lines; same keys.

- [ ] **Step 1: Write the failing tests** in `widget-copy.spec.ts`:

```ts
const all = (o: Record<string, Record<string, string | string[]>>) => Object.values(o).flatMap((m) => Object.values(m)).flat()
const AI_WORD = { nl: /\bAI\b/, en: /\bAI\b/, es: /\bIA\b/ } as const
test('every greeting names AI', () => {
  for (const loc of ['nl', 'en', 'es'] as const) for (const g of Object.values(WELCOME_MESSAGES[loc])) expect(g).toMatch(AI_WORD[loc])
})
test('three suggested prompts per path', () => {
  for (const loc of ['nl', 'en', 'es'] as const) for (const list of Object.values(SUGGESTED_PROMPTS[loc])) expect(list).toHaveLength(3)
})
test('whispers exist per locale with identical keys', () => {
  expect(Object.keys(WHISPERS.en).sort()).toEqual(Object.keys(WHISPERS.nl).sort())
  expect(Object.keys(WHISPERS.es).sort()).toEqual(Object.keys(WHISPERS.nl).sort())
})
test('no em-dash in widget copy', () => {
  for (const s of [...all(WELCOME_MESSAGES), ...all(SUGGESTED_PROMPTS), ...all(WHISPERS)]) expect(s).not.toContain('—')
})
```

In `memory-welcome-back.spec.ts`, add `expect(welcomeBackMessage(loc, p)).toMatch(AI_WORD[loc])` inside the existing locale loop, with the same `AI_WORD` map.
- [ ] **Step 2: Run both specs, expect FAIL.**
- [ ] **Step 3: Move the maps, rewrite the copy, and add the chrome keys.** `FloatingChatTrigger` reads `WHISPERS[locale][pathname] ?? WHISPERS[locale]['/']`, with locale from `useLocale()` normalized like the island does.
- [ ] **Step 4: Run both specs plus `clyde-i18n-render.spec.ts` (free, opens without sending), expect PASS.**
- [ ] **Step 5: Commit** `feat(chatbot): every Clyde greeting says it is AI; three prompts; whispers in en/es`

### Task 3: Header in one row, AI label, disclosure line, accessible dialog

**Files:**
- Modify `src/components/chatbot/ChatHeader.tsx:68-160`:
  - remove the status subline ("Nu online") and the minimize button (:139-146);
  - add the `aiLabel` pill after the name;
  - make buttons `h-10 w-10`;
  - the memory button stays until Task 9.
- Modify `src/stores/chatbotStore.ts:22,56,83,104,107`: delete `isMinimized` and `minimize`.
- Modify `src/components/chatbot/ChatWidget.tsx:61,189,199,269-271,291,307`:
  - drop the minimize references;
  - `aria-modal="true"` only below 1024px;
  - focus trap below 1024px;
  - Escape closes and returns focus to the launcher.
- Modify `src/components/chatbot/FloatingChatTrigger.tsx:58`: drop `isMinimized`.
- Modify `src/components/chatbot/ChatInput.tsx:101-147`:
  - aria labels from chrome (`inputAria`, `sendAria`, `stopAria`, `answeringAria`);
  - a `footer?: React.ReactNode` prop rendered in place of the keyboard hint row, defaulting to `chrome.disclosure`;
  - keep the hint only when `footer` is not given;
  - textarea gets `focus-visible:outline-none`, so the focus ring sits only on the pill (`focus-within:` classes stay).
- Modify `src/components/chatbot/ChatMessages.tsx:494-516`: no copy/edit/regenerate actions on messages whose `id` starts with `clyde-` (the client-injected greeting `clyde-welcome` and follow-ups `clyde-followup-*`).
- Test: create `tests/e2e/chatwidget-mocked.spec.ts` plus helper `tests/e2e/helpers/chatbot-mock.ts`.

**Interfaces:**
- **Produces from `helpers/chatbot-mock.ts`**, ported from `werk/fmai/shots.mjs`:
  - `export async function mockChatbot(page: Page, handler: (route: Route, n: number) => Promise<void>): Promise<{ calls: () => number }>`.
  - `export const uiStream = (opts: { text?: string; tool?: string; input?: object; output?: unknown }) => string`. It yields SSE lines in the order `start`, `start-step`, `tool-input-available`, `tool-output-available`, `finish-step`, then `text-start`/`text-delta`/`text-end`, `finish`, `[DONE]`, with headers `content-type: text/event-stream` and `x-vercel-ai-ui-message-stream: v1`.
  - `export async function openWidget(page: Page, path = '/nl', opts?: { memory?: object; counts?: Record<string, number> }): Promise<Locator>`. It seeds `localStorage.cookieConsent = JSON.stringify({ necessary: true, analytics: false, marketing: false })` plus the optional `clyde:memory` / `chatbot-store`, clicks `button[aria-label^="Open chat met Clyde"]`, and returns `[data-chatwidget-panel]`.
- **Every test** in `chatwidget-mocked.spec.ts` asserts at the end that `calls()` equals the number of messages it sent, and that no request left for the real API.

- [ ] **Step 1: Write the failing tests** (desktop 1440×900 and mobile 390×844 projects via `test.use`):

```ts
test('header: AI label, two buttons, no online status', async ({ page }) => {
  await mockChatbot(page, (r) => r.abort())
  const w = await openWidget(page)
  await expect(w.getByText('AI', { exact: true })).toBeVisible()
  await expect(w.getByText('Nu online')).toHaveCount(0)
  await expect(w.locator('button[aria-label="Minimaliseer chat"], button[aria-label*="inimal"]')).toHaveCount(0)
  await expect(w.getByText('Clyde is AI en kan zich vergissen.')).toBeVisible()
  const close = w.locator('button[aria-label="Sluit chat"]')
  expect((await close.boundingBox())!.width).toBeGreaterThanOrEqual(40)
})
test('greeting has no actions', async ({ page }) => {
  await mockChatbot(page, (r) => r.abort())
  const w = await openWidget(page)
  await expect(w.getByText(/een AI-collega/)).toBeVisible()
  await expect(w.getByRole('button', { name: /Opnieuw genereren|Kopieer/ })).toHaveCount(0)
})
test('desktop is non-modal, mobile is modal with focus kept inside', async ({ page }) => { /* 1440: no aria-modal; 390: aria-modal="true", 15× Tab keeps document.activeElement inside [data-chatwidget-panel] */ })
test('Escape closes and focus returns to the launcher', async ({ page }) => { /* press Escape; expect panel hidden and launcher focused */ })
```

- [ ] **Step 2: Run, expect FAIL.** Command: `npx playwright test tests/e2e/chatwidget-mocked.spec.ts --project=chromium`. The webServer starts `npm run dev`.
- [ ] **Step 3: Implement.** The focus trap is a `keydown` listener on the panel. Below 1024px, Tab/Shift+Tab wrap between the first and last focusable element. No new dependency.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `feat(chatbot): one-row header with AI label, disclosure under the input, modal only on phones`

### Task 4: Error at the question, honest limit

**Files:**
- Modify `src/stores/chatbotStore.ts:186-190`: remove `messageCounts` from `partialize`. The count lives as long as the conversation, which is not persisted either. `partialize` only limits writes, so also bump the persist `version` from 0 to 1, with a `migrate` that drops `messageCounts`. Without that, an old stored `{ clyde: 15 }` is still merged in on hydration (Review Focus 1).
- Modify `src/hooks/usePersonaChat.ts:8-9,89`:
  - `isAtLimit` comes from `limitState(messageCount).atLimit`, except for `FLAGSHIP_PERSONA_ID`;
  - also return `limit: ReturnType<typeof limitState>`.
- Modify `src/components/chatbot/ChatWidget.tsx:237-264,336-346` (floating and embedded):
  - delete `errorBanner` and `limitBanner`;
  - pass `failure = classifyChatError(error)` and `onRetry = regenerate` to `ChatMessages`;
  - pass `footer` to `ChatInput`:
    - when `limit.atLimit`: `limitReached` + `keepTalking` + a link `applyCta` to `/{locale}/apply` (next-intl `Link href="/apply"`);
    - when `limit.warn`: `limitWarning(remaining)` in amber + the same link;
    - otherwise the default disclosure.
  - placeholder when at limit: `limitReached`.
- Modify `src/components/chatbot/ChatMessages.tsx`: new props `failure?: ChatFailure | null` and `onRetry?: () => void`. Under the last user message, right-aligned, render:
  - for `failed`: `noAnswer · [retry]`;
  - for `rate-limit`: `rateLimited(minutes)` without a retry button.
- Modify `messages/{nl,en,es}.json`: delete `chat.widget.demoLimitMessage` and `chat.widget.demoLimitCta`. Keep `demoLimitReached` only if the embedded mode still reads it; let `npm run check:i18n-orphans` decide.
- Test: `tests/e2e/chatwidget-mocked.spec.ts`

**Interfaces:**
- Consumes: `limitState`, `classifyChatError`, `ChatFailure` (Task 1); `uiStream`, `mockChatbot`, `openWidget` (Task 3); chrome keys (Task 2).

- [ ] **Step 1: Write the failing tests:**

```ts
test('500 shows "Geen antwoord ontvangen" under the question and Opnieuw resends', async ({ page }) => {
  const m = await mockChatbot(page, async (r, n) => n === 1
    ? r.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"x"}' })
    : r.fulfill({ status: 200, headers: SSE_HEADERS, body: uiStream({ text: 'Vier niveaus.' }) }))
  const w = await openWidget(page)
  await send(w, 'Wat kost het?')
  await expect(w.getByText('Geen antwoord ontvangen')).toBeVisible()
  await expect(w.locator('[role="alert"]').filter({ hasText: 'Er ging iets mis' })).toHaveCount(0)
  await w.getByRole('button', { name: 'Opnieuw' }).click()
  await expect(w.getByText('Vier niveaus.')).toBeVisible()
  expect(m.calls()).toBe(2)
})
test('429 says when to retry', async ({ page }) => { /* body {error:'Rate limit exceeded', resetAt: Date.now()+90_000} -> text "Probeer het over 2 minuten opnieuw." and no Opnieuw button */ })
test('stale persisted count does not lock the input', async ({ page }) => {
  await mockChatbot(page, (r) => r.abort())
  const w = await openWidget(page, '/nl', { counts: { clyde: 15 } })
  await expect(w.locator('textarea')).toBeEnabled()
  await expect(w.getByText(/demolimiet/i)).toHaveCount(0)
})
test('warning at 3 left, full at 15, link goes to /nl/apply', async ({ page }) => { /* 12 mocked text replies -> "Nog 3 berichten in dit gesprek."; 3 more -> textarea disabled, "Dit gesprek zit vol.", link "Aanvraag starten" href ends with /nl/apply; calls() === 15 */ })
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement** per Files.
- [ ] **Step 4: Run, expect PASS. Then run the full gate from Global Constraints.**
- [ ] **Step 5: Commit** `fix(chatbot): limit counts per conversation and warns first; errors show at the question`

### Task 5: One proactive system

**Files:**
- Modify `src/components/chatbot/ChatWidgetIsland.tsx:327,397-443`:
  - delete the 40s cold-timer nudge and the 72% scroll nudge (`NUDGE_DELAY_MS`, both effects);
  - keep the post-navigation nudge (:411-425), which continues a conversation Clyde started by navigating.
- Modify `src/components/chatbot/FloatingChatTrigger.tsx`: show the whisper at most once per browser session (`sessionStorage['clyde:whispered'] = '1'`, read and written in `try/catch`), and never when `matchMedia('(max-width: 639px)')` matches.
- Test: `tests/e2e/chatwidget-mocked.spec.ts`

- [ ] **Step 1: Write the failing tests.** Use `page.clock.install()` and `page.clock.fastForward(21_000)`, never real waits.
  - **"whisper once per session":** 1440, `/nl`, fast-forward 21s, expect `WHISPERS.nl['/']` (imported from `widget-copy.ts`) to be visible in the launcher. Then `page.reload()` in the same context, fast-forward 21s, expect it to be absent.
  - **"no whisper on phones":** 390, fast-forward 21s, expect it to be absent.
  - **"no cold nudge":** open and close the widget on `/nl/pricing`, fast-forward 45s, expect the `PROACTIVE_PROMPTS.nl` text for that path (or its fallback) to be absent.
- [ ] **Step 2: Run, expect FAIL** on the first two (today the whisper repeats and shows on phones).
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `refactor(chatbot): one proactive hint, once per session, not on phones`

### Task 6: PR 1 gate, proof, PR

- [ ] **Step 1:** Run the full gate from Global Constraints. All must exit 0, so paste the tail of each.
- [ ] **Step 2: Statically update the paid specs** that use removed selectors:
  - `tests/e2e/chatbot.spec.ts:63,81` still use `Sluit chat` (unchanged label, so leave them);
  - grep `minimi`, `Nu online` and `demolimiet` in `tests/e2e` and fix every hit.
  - `npx tsc --noEmit` exit 0. Do NOT run these specs.
- [ ] **Step 3: Visual proof** with `werk/fmai/shots.mjs http://localhost:3000` against a local `npm run build && npm run start`:
  - set `BASE` to localhost, and keep `page.route`;
  - compare `desktop-03-welcome`, `desktop-20-error` and `desktop-22-limit` with the boards in `index-fmai.html` (sections 1, 5, 6);
  - look at every shot yourself.
- [ ] **Step 4:** Only on Daley's yes: push `chore/chatwidget-opschonen` and open the PR with title `fix(chatbot): Clyde widget says it is AI, honest limit, errors at the question`.

### Deviations during execution (PR 1, 2026-10-28)

Where the code differs from the task text above, the boards (spec) or a review finding won:
- **Footer:** one row under the input (left: disclosure or limit text; right: slot for the Task 9 chip). The keyboard-hint row is gone everywhere (board `make-boards.mjs:28-32`).
- **Launcher:** the hover "nu online" is gone too (`index-fmai.html:149` calls it a human signal).
- **Prompts:** page-specific lists dropped their trailing "Plan een gesprek" chip to reach 3. The floating greeting shows them as one column of 40px rows with the tour link "Of volg een korte rondleiding →" under them (board 1).
- **Failure line:** red with an icon, "Opnieuw" with a 40px hit area (board 5). A 400 rejection (personal data, too long) gets its own line without retry (`rejectedPersonal`, `rejectedTooLong`). Failed attempts do not count toward the 15.
- **Warn state:** warning + "Verder praten?" + apply link (board 6). The placeholder is "Vraag Clyde iets…".
- **Phone modal:** `inert` on header, `#main` and footer, but not on the cookie banner (`sota-fmai.md:168,179`). Focus returns to the launcher only after the visitor's own close (X, or Escape inside the panel), not after a route change.
- **Lint gate:** "no new errors". `npm run lint` already fails on 8c42a42, with errors in files outside this plan.
- **Test server:** browser specs run against this worktree's dev server on :3123 with `--workers=2`.

---

## PR 2: kaarten in het gesprek (proposals 2, 3, 4)

Branch `feat/chatwidget-kaarten-inline` from the tip of PR 1.

### Task 7: Remove the side panel; every result renders inline

**Files:**
- Delete `src/components/chatbot/SidePanel.tsx`.
- Modify `src/components/chatbot/tool-results/index.tsx:35-56,112-141`:
  - delete `SIDE_PANEL_TOOLS`, `INLINE_TOOLS` and `shouldUseSidePanel`;
  - add `const HIDDEN_TOOLS = new Set(['qualify_lead'])`;
  - `ToolResultRenderer` returns `null` for hidden tools in every state. Without that, a tool with no card falls through to the JSON `<pre>` at :131-136.
- Modify `src/components/chatbot/ChatMessages.tsx:18,59-78,317-350,441-459`:
  - delete `SidePanelTrigger` and the `openSidePanel` effect;
  - rename `lastSidePanelTool` to `lastCardTool`, keeping its conversion-over-memory priority and its use for `chrome.followups`;
  - render every tool part through `ToolResultRenderer`;
  - `handleFollowUp` only calls `sendChatMessage`.
- Modify `src/stores/chatbotStore.ts:40-42,66-67,92-93,154-163`: delete `isSidePanelOpen`, `sidePanelContent`, `openSidePanel` and `closeSidePanel`.
- Modify every caller found by `grep -rn "SidePanel\|sidePanel" src`. As of 8c42a42 that is:
  - `ChatWidget.tsx:62-64,122,281-287`
  - `ChatWidgetIsland.tsx:337,384,391`
  - `demo/DemoOrchestrator.tsx:121-151`
  - `tool-results/ServiceCard.tsx:77-82`
  - `tool-results/MemoryCard.tsx:68,111`
  - `ChatHeader.tsx:113-128`: delete the Brain button and `memoryAriaCount`. The memory chip replaces it in Task 9.
  - `useChatChrome.ts`: `panelTitle`, `viewDetails`, `memoryAria`, `memoryAriaCount`
- Statically update the paid specs that reference the panel:
  - `tests/e2e/clyde-audit.spec.ts:69-113`
  - `clyde-capture.spec.ts:103-112`
  - `demo-full-flow.spec.ts:75-123`
  - `guided-demo.spec.ts:234-240`

  Each check "panel open" becomes "card visible inside `[role=log]`"; delete the `guided-demo` panel-cleanup block. Do not run them.
- Test: `tests/e2e/chatwidget-mocked.spec.ts`

**Interfaces:**
- Produces: `HIDDEN_TOOLS` and `ToolResultRenderer` (same props as today).

- [ ] **Step 1: Write the failing tests:**

```ts
test('case result is a card in the chat, widget stays 420 wide', async ({ page }) => {
  await mockChatbot(page, (r) => r.fulfill({ status: 200, headers: SSE_HEADERS, body: uiStream(CASE) }))
  const w = await openWidget(page)
  await send(w, 'Laat een echte klant zien')
  await expect(w.locator('[role="log"]').getByText('SkinClarity Club').first()).toBeVisible()
  expect((await w.boundingBox())!.width).toBeLessThanOrEqual(422)
  await expect(page.getByText('Bekijk details')).toHaveCount(0)
})
test('qualify_lead shows no score and no JSON', async ({ page }) => { /* QUALIFY fixture -> no /LEAD SCORE|HOT/, no <pre> in the log, the text reply visible */ })
test('phone: result stays in the chat, nothing covers it', async ({ page }) => { /* 390: after CASE, the textarea is still visible and receives a click */ })
```

The `CASE` and `QUALIFY` fixtures copy the outputs in `werk/fmai/shots.mjs` (`SCENARIOS.case`, `SCENARIOS.qualify`). Their shapes mirror `concierge-tools.ts:193` and `leadgen-tools.ts:125`.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** Then `grep -rn "SidePanel\|sidePanel\|shouldUseSidePanel" src tests` must print nothing.
- [ ] **Step 4: Run, expect PASS.** Also `npx tsc --noEmit`.
- [ ] **Step 5: Commit** `refactor(chatbot): tool results render in the conversation; side panel removed`

### Task 8: Compact cards

**Files:**
- **`src/components/chatbot/tool-results/CaseStudyCard.tsx`**
  - header: `client`, with `industry` as the subline;
  - at most 3 `results`, plus the last result if it starts with "Gemeten resultaten" / "Measured" / "Resultados medidos" (the honesty line), rendered as the faint footer text;
  - footer link "Lees de case →" to `url`;
  - drop the challenge and solution blocks.
- **`tool-results/ServiceCard.tsx`**
  - services mode: at most 5 rows, each `name` + one-line `description` + a "binnenkort" pill when `status === 'coming_soon'`, plus the footer link "Alle vaardigheden →" to `/skills`;
  - tiers mode: one row per tier with `name`, `price` and the first feature, with the `highlighted` tier marked, plus the footer link "Alle prijzen →" to `/pricing`;
  - remove the full-width CTA blocks.
- **`tool-results/LeadScoreCard.tsx`**
  - it only serves `get_roi_estimate` now: three figures (`monthlySavings`, `roiPercent`, `paybackPeriodMonths`);
  - one assumptions line from `breakdown` (`hoursSavedPerWeek`, `subscriptionCost`);
  - delete the score/qualification branch.
- **`tool-results/BookingCard.tsx`**: title, the existing trust lines, and one amber button `applyCta` to `url`.
- **D3, 48 hours everywhere:**
  - `cardI18n.ts` `trustResponse`: nl `Reactie binnen 48 uur`, en `Reply within 48 hours`, es `Respuesta en 48 horas`.
  - `src/lib/chatbot/knowledge/concierge-kb.ts:226`: `Response within 48 hours on business days.`
- **`tool-results/cardI18n.ts`**: new labels `readCase`, `allSkills`, `allPricing`, `comingSoon` and `assumptions(hours, subscription)` in nl/en/es; delete keys that no card reads any more (`check:i18n-orphans` only covers `messages/*.json`, so grep `cardI18n` keys yourself).
- Test: `tests/e2e/chatwidget-mocked.spec.ts`

- [ ] **Step 1: Write the failing tests.** Per fixture (`SKILLS`, `CASE`, `PRICING`, `ROI`, `BOOK`, copied from `werk/fmai/shots.mjs` `SCENARIOS`):
  - **"cards stay compact":** at 1440 the last card's height is ≤ 360px; `CASE` shows at most 3 bullet results; `PRICING` shows 4 rows.
  - **"cards fit at 390":** in `[role="log"]`, `scrollWidth <= clientWidth`.
  - **"card links":**
    - `CASE` links to `/nl/case-studies/skinclarity-club`;
    - `SKILLS` has a link ending `/skills`;
    - `PRICING` has a link ending `/pricing`;
    - `BOOK` has a button-link ending `/nl/apply`.
- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** Layout per the board `Case-inline.dc.html` (card radius 14, padding 14, 13px body, dot bullets).
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `feat(chatbot): compact cards for skills, case, pricing, ROI and application`

### Task 9: Memory as a chip and a sheet in the column; 30-day expiry

**Files:**
- **`src/lib/chatbot/memory-persistence.ts:17-60`**
  - `serializeMemory` writes `{ v: 1, profile, savedAt: Date.now() }`;
  - `loadMemory(now = Date.now())` returns `{}` and removes the key when `savedAt` is older than `MEMORY_TTL_MS = 30 * 24 * 60 * 60 * 1000` (D1);
  - a profile without `savedAt` loads, and is stamped on the next save.
- **`tool-results/index.tsx`**: `remember_context` renders `RememberedLine`, a single faint line with the brain icon: `chrome.remembered + ': ' + values joined with ' · '`, using only the fields in that call's `output.remembered`.
- **Create `src/components/chatbot/MemorySheet.tsx`**
  - absolutely positioned above the composer inside the chat column (board `Geheugen.dc.html`);
  - title `Wat Clyde onthoudt`, one row per filled field, in the order `MemoryCard.tsx` lists them today;
  - note `Alleen in deze browser, voor je volgende bezoek.`;
  - a `Wis alles` button that empties the store profile and calls `saveMemory({})`;
  - closes on Escape and returns focus to the chip.
  - **Reuses** `FIELD_LABELS`/`loc` from `MemoryCard.tsx`: export them, then delete the rest of `MemoryCard`.
- **`ChatWidget.tsx` / `ChatInput.tsx` footer**: when `Object.keys(memoryProfile).length > 0`, the right side of the footer shows a chip `memoryChip(n)` (new chrome key, table below) that toggles `MemorySheet`.

New chrome keys:

| key | nl | en | es |
|---|---|---|---|
| `remembered` | `Onthouden` | `Remembered` | `Recordado` |
| `memoryChip(n)` | `Onthoudt ${n} ${n === 1 ? 'ding' : 'dingen'}` | `Remembers ${n} ${n === 1 ? 'thing' : 'things'}` | `Recuerda ${n} ${n === 1 ? 'dato' : 'datos'}` |
| `memoryTitle` | `Wat Clyde onthoudt` | `What Clyde remembers` | `Lo que Clyde recuerda` |
| `memoryNote` | `Alleen in deze browser, voor je volgende bezoek.` | `Only in this browser, for your next visit.` | `Solo en este navegador, para tu próxima visita.` |
| `forgetAll` | `Wis alles` | `Forget all` | `Borrar todo` |

- **Test:**
  - extend `tests/e2e/memory-persistence.spec.ts` (pure);
  - `tests/e2e/chatwidget-mocked.spec.ts`;
  - update `tests/e2e/memory-persistence-browser.spec.ts:8`: `BADGE` becomes the chip selector `button:has-text("Onthoudt")`. That spec sends no message (verify with grep before running it).

- [ ] **Step 1: Write the failing tests:**

```ts
test('legacy profile without savedAt loads', () => { /* store {v:1,profile:{agencyName:'X'}} -> loadMemory() has agencyName 'X' */ })
test('profile older than 30 days is dropped', () => { /* savedAt = now - 31d -> loadMemory(now) is {} and the key is gone */ })
```

```ts
test('seeded memory shows the chip; sheet lists and forgets', async ({ page }) => {
  await mockChatbot(page, (r) => r.abort())
  const w = await openWidget(page, '/nl', { memory: { v: 1, profile: { agencyName: 'Studio Noord', niche: 'skincare', brandCount: 6, teamSize: 8 } } })
  await w.getByRole('button', { name: 'Onthoudt 4 dingen' }).click()
  await expect(w.getByText('Wat Clyde onthoudt')).toBeVisible()
  await w.getByRole('button', { name: 'Wis alles' }).click()
  await expect(w.getByRole('button', { name: /Onthoudt/ })).toHaveCount(0)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('clyde:memory') ?? '{"profile":{}}').profile)).toEqual({})
})
test('memory plus card in one turn', async ({ page }) => { /* one stream with remember_context then get_case_study: the "Onthouden: Studio Noord" line AND the case card are in [role=log]; chip reads "Onthoudt 1 ding"; no <pre> */ })
test('Wis alles stays wiped during the conversation', async ({ page }) => { /* turn 1 with remember_context, click chip, Wis alles, turn 2 plain text: chip absent and stored profile {}. The accumulated-memory effect in ChatMessages must not refill from tool parts older than the wipe. */ })
```

- [ ] **Step 2: Run, expect FAIL.**
- [ ] **Step 3: Implement.** `uiStream` gets an optional `tools: Array<{ tool; input; output }>` for the two-tool turn: extend the helper, and keep `tool` working.
- [ ] **Step 4: Run, expect PASS.**
- [ ] **Step 5: Commit** `feat(chatbot): memory as a chip and sheet inside the chat, expires after 30 days`

### Task 10: PR 2 gate, proof, PR

- [ ] **Step 1:** Run the full gate from Global Constraints and paste the tail of each.
- [ ] **Step 2:** Run `grep -rn "SidePanel\|sidePanel\|Close details panel\|Bekijk details\|LEAD SCORE" src tests`. Expected: no hits.
- [ ] **Step 3: Visual proof:**
  - run `werk/fmai/shots.mjs` against a local `npm run start`, desktop and mobile, all `10-*` scenarios;
  - compare with the boards of sections 2-4;
  - look at every shot yourself, including mobile `10-case` and `05` (they were never captured on live).
- [ ] **Step 4:** Only on Daley's yes: push `feat/chatwidget-kaarten-inline` and open a PR stacked on PR 1, titled `feat(chatbot): results as cards in the conversation, memory chip, no lead score for visitors`.
