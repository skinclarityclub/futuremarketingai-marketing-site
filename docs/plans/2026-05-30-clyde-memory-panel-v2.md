# Clyde Memory Panel v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Clyde remember an agency prospect across sessions: persist the captured `MemoryProfile` to localStorage (consent-gated), inject it into the system prompt for returning recall, greet returning visitors personally, and surface a always-reachable memory badge — with a clear/forget control.

**Architecture:** Builds on the v1 within-session memory (`MemoryProfile`, `mergeMemory`, `chatbotStore.memoryProfile`, `MemoryCard`). Persistence lives in a dedicated `clyde:memory` localStorage entry (separate from the zustand store-persist) so it can be consent-gated and wiped precisely. The profile is hydrated into the store on mount and written back on change when `cookieConsent` exists. On a returning session the profile is sent in the `/api/chatbot` request `context` and injected into the system prompt; the welcome message is derived client-side from the profile.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Zustand 5, next-intl, Playwright (e2e + pure-unit specs), AI SDK v6.

**Design:** `docs/plans/2026-05-30-clyde-memory-panel-v2-design.md` (approved).

**Branch:** `feature/clyde-memory-v2` (stacked on `fix/clyde-nav-ux`; design doc already committed there as `f28e215`).

**Conventions:**
- Tests run on **/nl** against `http://localhost:3100`. Set `$env:PLAYWRIGHT_BASE_URL="http://localhost:3100"`.
- De-facto integration test = `npm run build` (run from the Bash tool, not cmd.exe).
- Pure-unit specs live in `tests/e2e/*.spec.ts` and import modules directly (no `page`), mirroring `tests/e2e/memory-merge.spec.ts`.
- No em-dashes in user-facing copy. No hardcoded user-facing strings outside the locale maps.
- Commit per task (`type(scope): message`, why-focused).

---

## Task 1: Persistence module (pure parse/serialize + consent-gated storage)

**Files:**
- Create: `src/lib/chatbot/memory-persistence.ts`
- Test: `tests/e2e/memory-persistence.spec.ts`

**Step 1: Write the failing test** (pure logic only — parse/serialize/version/corrupt)

```ts
import { test, expect } from '@playwright/test'
import {
  serializeMemory,
  parseMemory,
  MEMORY_STORAGE_KEY,
} from '../../src/lib/chatbot/memory-persistence'

test.describe('memory-persistence (pure)', () => {
  test('serialize then parse round-trips a profile', () => {
    const profile = { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6, teamSize: 3 }
    expect(parseMemory(serializeMemory(profile))).toEqual(profile)
  })

  test('parse returns empty object for null / garbage / wrong version', () => {
    expect(parseMemory(null)).toEqual({})
    expect(parseMemory('not json')).toEqual({})
    expect(parseMemory(JSON.stringify({ v: 99, profile: { agencyName: 'X' } }))).toEqual({})
    expect(parseMemory(JSON.stringify({ v: 1 }))).toEqual({})
  })

  test('parse keeps only known fields', () => {
    const raw = JSON.stringify({ v: 1, profile: { agencyName: 'X', hacker: 'rm -rf' } })
    expect(parseMemory(raw)).toEqual({ agencyName: 'X' })
  })

  test('storage key is stable', () => {
    expect(MEMORY_STORAGE_KEY).toBe('clyde:memory')
  })
})
```

**Step 2: Run it, verify it fails**

Run: `npx playwright test tests/e2e/memory-persistence.spec.ts --project=chromium --workers=1`
Expected: FAIL (module not found).

**Step 3: Write the module**

```ts
import { MEMORY_FIELD_ORDER, type MemoryProfile } from './memory'

export const MEMORY_STORAGE_KEY = 'clyde:memory'
const MEMORY_VERSION = 1

/** Serialize a profile to a versioned JSON payload. */
export function serializeMemory(profile: MemoryProfile): string {
  return JSON.stringify({ v: MEMORY_VERSION, profile })
}

/** Parse a stored payload back to a profile. Returns {} for null/garbage/version
 *  mismatch, and keeps only known fields (no prototype pollution / drift). */
export function parseMemory(raw: string | null): MemoryProfile {
  if (!raw) return {}
  try {
    const data = JSON.parse(raw) as { v?: number; profile?: Record<string, unknown> }
    if (data?.v !== MEMORY_VERSION || !data.profile) return {}
    const out: MemoryProfile = {}
    for (const key of MEMORY_FIELD_ORDER) {
      const v = data.profile[key]
      if (v !== undefined && v !== null) (out as Record<string, unknown>)[key] = v
    }
    return out
  } catch {
    return {}
  }
}

/** True when the visitor has interacted with the cookie banner (functional is
 *  always-on once consent exists). We only persist memory after that. */
export function hasMemoryConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem('cookieConsent') !== null
  } catch {
    return false
  }
}

/** Load the persisted profile (consent-gated, storage-safe). */
export function loadMemory(): MemoryProfile {
  if (typeof window === 'undefined' || !hasMemoryConsent()) return {}
  try {
    return parseMemory(window.localStorage.getItem(MEMORY_STORAGE_KEY))
  } catch {
    return {}
  }
}

/** Persist the profile (consent-gated, storage-safe). No-op without consent. */
export function saveMemory(profile: MemoryProfile): void {
  if (typeof window === 'undefined' || !hasMemoryConsent()) return
  try {
    window.localStorage.setItem(MEMORY_STORAGE_KEY, serializeMemory(profile))
  } catch {
    /* quota / private mode: silently skip */
  }
}

/** Remove the persisted profile. */
export function clearMemory(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(MEMORY_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
```

**Step 4: Run test, verify pass**

Run: `npx playwright test tests/e2e/memory-persistence.spec.ts --project=chromium --workers=1`
Expected: PASS (4 tests).

**Step 5: Commit**

```bash
git add src/lib/chatbot/memory-persistence.ts tests/e2e/memory-persistence.spec.ts
git commit -m "feat(chatbot): consent-gated localStorage persistence for Clyde memory"
```

---

## Task 2: Hydrate on mount + persist on change (ChatWidgetIsland)

**Files:**
- Modify: `src/components/chatbot/ChatWidgetIsland.tsx`

**Step 1: Add store selectors + persistence import**

At the top imports add:
```ts
import { loadMemory, saveMemory } from '@/lib/chatbot/memory-persistence'
```
Add store selectors near the other `useChatbotStore` calls:
```ts
  const memoryProfile = useChatbotStore((s) => s.memoryProfile)
  const setMemoryProfile = useChatbotStore((s) => s.setMemoryProfile)
```

**Step 2: Hydrate once on mount** (before any early return; ChatWidgetIsland has none — it always renders)

```ts
  // Hydrate persisted memory once on mount (client-only, consent-gated).
  const hydratedMemory = useRef(false)
  useEffect(() => {
    if (hydratedMemory.current) return
    hydratedMemory.current = true
    const stored = loadMemory()
    if (Object.keys(stored).length > 0) setMemoryProfile(stored)
  }, [setMemoryProfile])
```

**Step 3: Persist whenever the profile changes**

```ts
  // Persist memory whenever it changes (no-op without consent / in private mode).
  useEffect(() => {
    if (!hydratedMemory.current) return
    saveMemory(memoryProfile)
  }, [memoryProfile])
```

**Step 4: Verify build + tsc**

Run: `npx tsc --noEmit` (expect only the pre-existing `audit-v2-lighthouse.spec.ts:90` error)
Run: `npm run build` (expect exit 0)

**Step 5: Commit**

```bash
git add src/components/chatbot/ChatWidgetIsland.tsx
git commit -m "feat(chatbot): hydrate + persist Clyde memory across sessions"
```

---

## Task 3: "Nieuwe chat" keeps the persistent memory

**Files:**
- Modify: `src/components/chatbot/ChatWidget.tsx:116-124`

**Step 1: Remove the memory reset from handleNewChat**

In `handleNewChat`, delete the `resetMemory()` call (line ~121) and remove `resetMemory` from the dependency array (line ~124). Also remove the now-unused `const resetMemory = useChatbotStore((s) => s.resetMemory)` selector (line ~63) IF nothing else uses it (grep first: `grep -n resetMemory src/components/chatbot/ChatWidget.tsx`).

Result:
```ts
  const handleNewChat = useCallback(() => {
    stop?.()
    setMessages?.([])
    closeSidePanel()
    resetMessageCount(personaId)
    hasGreeted.current = false
    hasSentFollowup.current = false
  }, [stop, setMessages, closeSidePanel, resetMessageCount, personaId])
```

**Step 2: Verify**

Run: `npx tsc --noEmit` (no new errors; no "resetMemory declared but never read")
Run: `npm run build` (exit 0)

**Step 3: Commit**

```bash
git add src/components/chatbot/ChatWidget.tsx
git commit -m "feat(chatbot): new chat keeps persistent memory (only Wis geheugen clears it)"
```

---

## Task 4: Inject the profile into the system prompt (returning recall)

**Files:**
- Modify: `src/lib/chatbot/prompt-builder.ts` (the `buildSystemMessages` builder)
- Modify: `src/components/chatbot/ChatWidget.tsx` (the chat transport `body`/`context`)
- Test: `tests/e2e/memory-injection.spec.ts`

**Step 1: Write the failing unit test for the injection line builder**

First add a pure exported helper in `prompt-builder.ts` (so it is unit-testable):

```ts
import type { MemoryProfile } from './memory'

/** One short system line describing what Clyde already knows about the visitor,
 *  or '' when nothing is known. Only non-empty fields are included. */
export function buildMemoryContextLine(profile: MemoryProfile | undefined): string {
  if (!profile) return ''
  const parts: string[] = []
  if (profile.agencyName) parts.push(`agency "${profile.agencyName}"`)
  if (profile.niche) parts.push(`niche ${profile.niche}`)
  if (profile.brandCount != null) parts.push(`${profile.brandCount} brands`)
  if (profile.teamSize != null) parts.push(`team of ${profile.teamSize}`)
  if (profile.painPoint) parts.push(`pain point: ${profile.painPoint}`)
  if (profile.goal) parts.push(`goal: ${profile.goal}`)
  if (parts.length === 0) return ''
  return `You already know this about the visitor from earlier: ${parts.join(', ')}. Refer to it naturally and do not ask again for what you already know.`
}
```

Test `tests/e2e/memory-injection.spec.ts`:
```ts
import { test, expect } from '@playwright/test'
import { buildMemoryContextLine } from '../../src/lib/chatbot/prompt-builder'

test('empty / undefined profile yields no line', () => {
  expect(buildMemoryContextLine(undefined)).toBe('')
  expect(buildMemoryContextLine({})).toBe('')
})

test('non-empty profile yields a recall line with only known fields', () => {
  const line = buildMemoryContextLine({ agencyName: 'Duinrust', niche: 'horeca', brandCount: 6 })
  expect(line).toContain('Duinrust')
  expect(line).toContain('horeca')
  expect(line).toContain('6 brands')
  expect(line).not.toContain('team of')
})
```

**Step 2: Run, verify fail**

Run: `npx playwright test tests/e2e/memory-injection.spec.ts --project=chromium --workers=1`
Expected: FAIL (export missing).

**Step 3: Wire the line into `buildSystemMessages`**

In `prompt-builder.ts`, inside `buildSystemMessages(persona, topicResult, context)`, after the existing system messages are assembled, append the memory line when present:
```ts
  const memoryLine = buildMemoryContextLine(context?.memoryProfile)
  if (memoryLine) {
    systemMessages.push({ role: 'system', content: memoryLine })
  }
```
(Adapt to the actual return shape — the function already builds an array of `{ role: 'system', content }` messages. Add the typed field `memoryProfile?: MemoryProfile` to the `context` type used by `buildSystemMessages`.)

**Step 4: Send the profile from the client**

In `src/components/chatbot/ChatWidget.tsx`, locate the chat hook config (`useChat`/transport) — grep: `grep -n "useChat\|Transport\|body\|context" src/components/chatbot/ChatWidget.tsx`. The engine already reads `context` from the request body (`engine.ts:50`). Add `memoryProfile` to the `context` object sent with each request, e.g.:
```ts
  const memoryProfile = useChatbotStore((s) => s.memoryProfile)
  // ...in the transport/body config:
  body: { /* ...existing... */ context: { /* ...existing context... */ memoryProfile } }
```
If `context` is built per-send, include `memoryProfile` there. Read the current config first and match its shape exactly.

**Step 5: Run unit test + build**

Run: `npx playwright test tests/e2e/memory-injection.spec.ts --project=chromium --workers=1` → PASS
Run: `npm run build` → exit 0

**Step 6: Commit**

```bash
git add src/lib/chatbot/prompt-builder.ts src/components/chatbot/ChatWidget.tsx tests/e2e/memory-injection.spec.ts
git commit -m "feat(chatbot): inject remembered profile into system prompt for returning recall"
```

---

## Task 5: Personalized welcome-back (client-side, localized)

**Files:**
- Modify: `src/components/chatbot/ChatWidgetIsland.tsx`
- Test: `tests/e2e/memory-welcome-back.spec.ts`

**Step 1: Write the failing unit test**

Add an exported pure helper in `ChatWidgetIsland.tsx` (or a small sibling `welcome-back.ts` if cleaner — prefer a sibling so it is importable without the client component):
- Create `src/components/chatbot/welcome-back.ts`:

```ts
import type { ChatLocale } from './useChatChrome'
import type { MemoryProfile } from '@/lib/chatbot/memory'

/** A localized "welcome back" greeting derived from the stored profile, or null
 *  when there is not enough to personalize (no agencyName). */
export function welcomeBackMessage(locale: ChatLocale, p: MemoryProfile): string | null {
  if (!p.agencyName) return null
  const brands =
    p.brandCount != null && p.niche
      ? { nl: `${p.brandCount} ${p.niche}-merken`, en: `${p.brandCount} ${p.niche} brands`, es: `${p.brandCount} marcas de ${p.niche}` }[locale]
      : null
  if (locale === 'en') {
    return brands
      ? `Welcome back. Still ${brands} at ${p.agencyName}? What can I work on?`
      : `Welcome back, ${p.agencyName}. What can I work on?`
  }
  if (locale === 'es') {
    return brands
      ? `Bienvenido de nuevo. ¿Sigues con ${brands} en ${p.agencyName}? ¿En qué trabajo?`
      : `Bienvenido de nuevo, ${p.agencyName}. ¿En qué trabajo?`
  }
  return brands
    ? `Welkom terug. Nog steeds ${brands} bij ${p.agencyName}? Waar wil je verder?`
    : `Welkom terug, ${p.agencyName}. Waar wil je verder?`
}
```

Test `tests/e2e/memory-welcome-back.spec.ts`:
```ts
import { test, expect } from '@playwright/test'
import { welcomeBackMessage } from '../../src/components/chatbot/welcome-back'

test('null without agencyName', () => {
  expect(welcomeBackMessage('nl', {})).toBeNull()
  expect(welcomeBackMessage('nl', { niche: 'horeca' })).toBeNull()
})

test('localized greetings, no em-dashes', () => {
  const p = { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6 }
  for (const loc of ['nl', 'en', 'es'] as const) {
    const m = welcomeBackMessage(loc, p)!
    expect(m).toContain('Duinrust')
    expect(m).not.toContain('—')
  }
  expect(welcomeBackMessage('nl', p)).toContain('horeca')
  expect(welcomeBackMessage('es', p)).toContain('marcas')
})
```

**Step 2: Run, verify fail** → then create the helper → PASS.

**Step 3: Use it in ChatWidgetIsland**

Where `welcomeMessage` is computed for `<ChatWidget welcomeMessage={...} />`, prefer the welcome-back when a hydrated profile exists:
```ts
  const welcomeMessage =
    welcomeBackMessage(locale, memoryProfile) ??
    (WELCOME_MESSAGES[locale][pathname] ?? WELCOME_MESSAGES[locale].default)
```

**Step 4: Run test + build** → PASS, exit 0.

**Step 5: Commit**

```bash
git add src/components/chatbot/welcome-back.ts src/components/chatbot/ChatWidgetIsland.tsx tests/e2e/memory-welcome-back.spec.ts
git commit -m "feat(chatbot): personalized welcome-back from persisted memory"
```

---

## Task 6: Persistent memory badge in the chat header

**Files:**
- Modify: `src/components/chatbot/ChatHeader.tsx`
- Modify: `src/components/chatbot/useChatChrome.ts` (aria label, 3 locales)

**Step 1: Add a localized aria label** in `useChatChrome.ts` `LABELS` (nl/en/es), e.g. `memoryAria: 'Bekijk wat Clyde onthoudt' / 'View what Clyde remembers' / 'Ver lo que Clyde recuerda'`, and add `memoryAria: string` to the `ChatChromeLabels` interface.

**Step 2: Render the badge** in `ChatHeader.tsx` (near the new-chat/minimize/close buttons): show a small `Brain` (lucide) badge only when the profile is non-empty; clicking opens the memory side panel.

```tsx
import { Brain } from 'lucide-react'
import { useChatbotStore } from '@/stores/chatbotStore'
import { MEMORY_FIELD_ORDER } from '@/lib/chatbot/memory'
// ...
const memoryProfile = useChatbotStore((s) => s.memoryProfile)
const openSidePanel = useChatbotStore((s) => s.openSidePanel)
const memoryCount = MEMORY_FIELD_ORDER.filter((k) => {
  const v = memoryProfile[k]
  return v !== undefined && v !== null && String(v).trim() !== ''
}).length
// ...in the actions row, before new-chat:
{memoryCount > 0 && (
  <button
    type="button"
    aria-label={chrome.memoryAria}
    onClick={() => openSidePanel('remember_context', { remembered: memoryProfile })}
    className="relative rounded p-1 text-accent-system transition-colors hover:text-accent-system/80"
  >
    <Brain className="h-4 w-4" />
    <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-accent-system px-1 text-[9px] font-bold text-bg-deep">
      {memoryCount}
    </span>
  </button>
)}
```
(`MemoryCard` reads the profile from the store, so the `data` passed to `openSidePanel` is only used to satisfy the side-panel content shape; the card ignores it. Confirm against `SidePanel` + `TOOL_CARD_MAP`.)

**Step 3: Verify in browser** (agent-browser): with a seeded profile, the badge shows the count; clicking opens the "Wat Clyde onthoudt" panel even after a conversion card took the panel.

**Step 4: Build** → exit 0.

**Step 5: Commit**

```bash
git add src/components/chatbot/ChatHeader.tsx src/components/chatbot/useChatChrome.ts
git commit -m "feat(chatbot): persistent memory badge in chat header"
```

---

## Task 7: Transparency note + "Wis geheugen" button in the memory card

**Files:**
- Modify: `src/components/chatbot/tool-results/MemoryCard.tsx`

**Step 1: Add localized strings** in `MemoryCard.tsx`:
```ts
const PERSIST_NOTE: Record<Loc, string> = {
  nl: 'Clyde onthoudt dit lokaal in je browser voor je volgende bezoek.',
  en: 'Clyde keeps this locally in your browser for your next visit.',
  es: 'Clyde guarda esto localmente en tu navegador para tu próxima visita.',
}
const CLEAR_LABEL: Record<Loc, string> = {
  nl: 'Wis geheugen',
  en: 'Clear memory',
  es: 'Borrar memoria',
}
```

**Step 2: Render note + button** when `rows.length > 0` (below the rows):
```tsx
import { useChatbotStore } from '@/stores/chatbotStore'
import { clearMemory } from '@/lib/chatbot/memory-persistence'
// ...
const resetMemory = useChatbotStore((s) => s.resetMemory)
const closeSidePanel = useChatbotStore((s) => s.closeSidePanel)
// ...after the rows .map():
<div className="mt-3 space-y-2 border-t border-border-primary pt-3">
  <p className="text-[11px] leading-relaxed text-text-secondary">{PERSIST_NOTE[l]}</p>
  <button
    type="button"
    onClick={() => { resetMemory(); clearMemory(); closeSidePanel() }}
    className="text-xs font-medium text-text-secondary underline-offset-2 transition-colors hover:text-text-primary hover:underline"
  >
    {CLEAR_LABEL[l]}
  </button>
</div>
```

**Step 3: Verify in browser**: clicking "Wis geheugen" empties the panel (back to the empty hint), the header badge disappears, and the `clyde:memory` localStorage entry is gone (`localStorage.getItem('clyde:memory')` === null).

**Step 4: Build** → exit 0.

**Step 5: Commit**

```bash
git add src/components/chatbot/tool-results/MemoryCard.tsx
git commit -m "feat(chatbot): transparency note + wipe control in memory card"
```

---

## Task 8: Gated live e2e — cross-session recall

**Files:**
- Test: `tests/e2e/memory-v2-recall.spec.ts`

**Step 1: Write the gated live test** (mirrors `clyde-memory.spec.ts` gating + open helper)

```ts
import { test, expect, type Page } from '@playwright/test'

const LIVE = process.env.RUN_CLYDE_LIVE === '1'

async function openClydeWithSeededMemory(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('cookieConsent', JSON.stringify({ functional: true, analytics: true, marketing: true }))
      localStorage.setItem('clyde:memory', JSON.stringify({ v: 1, profile: { agencyName: 'Duinrust', niche: 'horeca', brandCount: 6, teamSize: 3 } }))
    } catch { /* ignore */ }
  })
  await page.goto('/nl')
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(900)
}

test.describe('Clyde memory v2 — cross-session', () => {
  test.skip(!LIVE, 'set RUN_CLYDE_LIVE=1 to run against a live Clyde')

  test('returning visitor: welcome-back + Clyde recalls a seeded fact', async ({ page }) => {
    await openClydeWithSeededMemory(page)
    const panel = page.locator('[data-chatwidget-panel]')
    // Personalized welcome-back (client-side, no API)
    await expect(panel).toContainText('Welkom terug')
    await expect(panel).toContainText('Duinrust')
    // One live turn proves system-prompt injection (no facts re-stated by the user)
    const ta = panel.locator('textarea')
    await ta.fill('Wat raad je ons aan als eerste stap?')
    await ta.press('Enter')
    await page.locator('button[aria-label="Stop generatie"]').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(1000)
    await expect(panel).toContainText(/horeca|6/)
  })
})
```

**Step 2: Run gated live**

```bash
$env:PLAYWRIGHT_BASE_URL="http://localhost:3100"; $env:RUN_CLYDE_LIVE="1"
npx playwright test tests/e2e/memory-v2-recall.spec.ts --project=chromium --workers=1 --retries=1
```
Expected: PASS (welcome-back text + Clyde references horeca/6 without the user restating them).

**Step 3: Commit**

```bash
git add tests/e2e/memory-v2-recall.spec.ts
git commit -m "test(chatbot): gated live e2e for cross-session memory recall"
```

---

## Final verification (after all tasks)

1. `npx tsc --noEmit` → only the pre-existing `audit-v2-lighthouse.spec.ts:90` error.
2. `npm run build` → exit 0.
3. No-API specs: `npx playwright test tests/e2e/memory-persistence.spec.ts tests/e2e/memory-injection.spec.ts tests/e2e/memory-welcome-back.spec.ts --project=chromium --workers=1` → all PASS.
4. agent-browser walkthrough (nl + en): chat → reveal an agency → reload page → reopen chat → personalized welcome-back + filled panel + badge; ask a question → Clyde recalls without re-asking; "Wis geheugen" → panel empties, badge gone, `clyde:memory` cleared.
5. Gated live recall e2e (step above) PASS.

## Out of scope (do not build)

Server-side / cross-device persistence, backend memory store, separate extraction pass, inline editing of remembered fields, TTL/expiry. (See design doc scope guard.)
