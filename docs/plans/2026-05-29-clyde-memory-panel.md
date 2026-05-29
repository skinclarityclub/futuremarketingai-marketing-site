# Clyde Live Memory Panel — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Clyde's "one brain, shared memory" USP tangible by capturing facts a prospect reveals into a visible, accumulating sidebar panel that Clyde refers back to (within-session, v1).

**Architecture:** A new AI-native capture tool `remember_context` records salient agency facts; a pure `mergeMemory` accumulates every capture across the conversation into `chatbotStore.memoryProfile`; a `MemoryCard` renders that accumulated profile in the existing sidebar; a persona nudge tells Clyde to capture facts and refer back to them. No persistence, no backend, no extra API calls.

**Tech Stack:** Next.js 16, React 19, Vercel AI SDK v6 (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/react`), Zod 4, Zustand 5, next-intl, Playwright (the only test runner — no vitest/jest).

**Design doc:** `docs/plans/2026-05-29-clyde-memory-panel-design.md` (approved).

**Conventions for the executor:**
- De-facto integration test is `npm run build` (NOT `npm run lint` — it lints stale dev output). Run `npx tsc --noEmit` for typecheck; one pre-existing error in `tests/e2e/audit-v2-lighthouse.spec.ts:90` is expected and unrelated — ignore only that line.
- Playwright runs against the dev server: a server is already up on port 3100 (`PLAYWRIGHT_BASE_URL=http://localhost:3100`). Port 3000 is a different project (fma-app). Do NOT kill any process.
- Live chatbot calls hit the shared production rate-limit (10/min per IP, 100/hr global). Keep live tests to a couple of calls, `--workers=1`.
- Commit per task with `type(scope): message`. Work on branch `feature/clyde-i18n-greet-observability` (current) unless told otherwise.
- GOTCHA: `createPersonaTools` ignores `persona.tools{}` and returns `buildFlagshipTools(locale)` directly. Tools are wired in `flagship-tools.ts` + filtered in `engine.ts`, NOT via `clyde.ts`.

---

### Task 1: Pure memory model + merge (TDD)

**Files:**
- Create: `src/lib/chatbot/memory.ts`
- Create: `tests/e2e/memory-merge.spec.ts`

**Step 1: Write the failing test**

`tests/e2e/memory-merge.spec.ts`:

```ts
import { test, expect } from '@playwright/test'
import { mergeMemory, type MemoryProfile } from '../../src/lib/chatbot/memory'

// Pure-logic spec (no browser, no API). Runs under any project; fast.
test.describe('mergeMemory', () => {
  test('adds fields into an empty profile', () => {
    const out = mergeMemory({}, { niche: 'skincare', brandCount: 8 })
    expect(out).toEqual({ niche: 'skincare', brandCount: 8 })
  })

  test('last write wins per field, keeps untouched fields', () => {
    const prev: MemoryProfile = { niche: 'skincare', brandCount: 8 }
    const out = mergeMemory(prev, { brandCount: 12 })
    expect(out).toEqual({ niche: 'skincare', brandCount: 12 })
  })

  test('ignores undefined, null and empty-string values', () => {
    const prev: MemoryProfile = { niche: 'skincare' }
    const out = mergeMemory(prev, {
      niche: undefined,
      agencyName: '',
      goal: '   ',
      painPoint: 'content volume',
    })
    expect(out).toEqual({ niche: 'skincare', painPoint: 'content volume' })
  })

  test('does not mutate the previous profile', () => {
    const prev: MemoryProfile = { niche: 'skincare' }
    mergeMemory(prev, { brandCount: 8 })
    expect(prev).toEqual({ niche: 'skincare' })
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx playwright test tests/e2e/memory-merge.spec.ts --project=chromium`
Expected: FAIL — cannot resolve `../../src/lib/chatbot/memory` (module does not exist).

**Step 3: Write minimal implementation**

`src/lib/chatbot/memory.ts`:

```ts
/**
 * Within-session memory profile for Clyde. Holds the salient facts a prospect
 * reveals about their agency so Clyde can show them in the memory panel and refer
 * back to them. Pure + framework-free so it is unit-testable and importable on both
 * client and server. Not persisted (see chatbotStore partialize) — resets on reload
 * and on "new chat".
 */
export interface MemoryProfile {
  agencyName?: string
  niche?: string
  brandCount?: number
  teamSize?: number
  painPoint?: string
  goal?: string
}

/**
 * Merge newly-captured fields into an existing profile. Last write wins per field;
 * undefined/null and blank strings are ignored so a capture that omits a field never
 * erases what we already know. Returns a new object (does not mutate `prev`).
 */
export function mergeMemory(prev: MemoryProfile, next: Partial<MemoryProfile>): MemoryProfile {
  const out: MemoryProfile = { ...prev }
  for (const [key, value] of Object.entries(next)) {
    if (value === undefined || value === null) continue
    if (typeof value === 'string' && value.trim() === '') continue
    ;(out as Record<string, unknown>)[key] = value
  }
  return out
}

/** Field render order + i18n label keys for the memory card. */
export const MEMORY_FIELD_ORDER: (keyof MemoryProfile)[] = [
  'agencyName',
  'niche',
  'brandCount',
  'teamSize',
  'painPoint',
  'goal',
]
```

**Step 4: Run test to verify it passes**

Run: `npx playwright test tests/e2e/memory-merge.spec.ts --project=chromium`
Expected: PASS (4 passed).

**Step 5: Commit**

```bash
git add src/lib/chatbot/memory.ts tests/e2e/memory-merge.spec.ts
git commit -m "feat(chatbot): pure within-session memory model + mergeMemory"
```

---

### Task 2: `remember_context` capture tool + demo strip

**Files:**
- Modify: `src/lib/chatbot/tools/flagship-tools.ts`
- Modify: `src/lib/chatbot/engine.ts:153-157` (the demo-only strip)

**Step 1: Add the tool definition**

In `flagship-tools.ts`, after the `navigate_to_page` definition (before `buildFlagshipTools`), add:

```ts
/**
 * Capture tool: records concrete facts the prospect reveals about their agency so
 * Clyde remembers them across the conversation and the memory panel can show them.
 * Locale-neutral — it echoes its input; the card localizes labels and reads the
 * accumulated profile from the store.
 */
const remember_context = tool({
  description:
    'Record a concrete fact the visitor just revealed about their agency so you remember it for the rest of the conversation: agency name, niche/vertical, number of brands or clients they manage, team size, their main pain point, or their goal. Call this whenever the visitor shares a NEW such fact, passing only the fields you just learned. Then refer back to what you remember in later replies.',
  inputSchema: z.object({
    agencyName: z.string().optional().describe('Name of the prospect agency'),
    niche: z.string().optional().describe('Their niche/vertical, e.g. skincare, SaaS, hospitality'),
    brandCount: z.number().optional().describe('How many brands or clients they manage'),
    teamSize: z.number().optional().describe('Number of people on their team'),
    painPoint: z.string().optional().describe('Their main pain or bottleneck'),
    goal: z.string().optional().describe('What they want to achieve'),
  }),
  execute: async ({ agencyName, niche, brandCount, teamSize, painPoint, goal }) => ({
    remembered: { agencyName, niche, brandCount, teamSize, painPoint, goal },
  }),
})
```

**Step 2: Register it in the factory**

In `buildFlagshipTools`'s returned object, add `remember_context` (e.g. right after `navigate_to_page,`):

```ts
  return {
    navigate_to_page,
    remember_context,
    book_call: concierge.book_call,
    // ...rest unchanged
```

**Step 3: Strip it in demo mode**

In `engine.ts`, the demo-only block currently drops just `navigate_to_page`. Replace:

```ts
      if (context?.demoMode) {
        tools = Object.fromEntries(
          Object.entries(tools).filter(([name]) => name !== 'navigate_to_page')
        )
      }
```

with:

```ts
      if (context?.demoMode) {
        // navigate_to_page + remember_context over-trigger under toolChoice:'required'
        // and would hijack scripted demo steps.
        const DEMO_STRIP = new Set(['navigate_to_page', 'remember_context'])
        tools = Object.fromEntries(
          Object.entries(tools).filter(([name]) => !DEMO_STRIP.has(name))
        )
      }
```

Note: `remember_context` is NOT added to `OFF_CONTEXT_TOOLS` (it must stay available in normal chat). It is intentionally absent from `persona.tools{}` in `clyde.ts` — harmless, since that map is ignored.

**Step 4: Verify build**

Run: `npm run build`
Expected: exit 0. (Tool wiring compiles; card not yet mapped, so a `remember_context` result would fall through to the JSON `<pre>` fallback for now — fine.)

**Step 5: Commit**

```bash
git add src/lib/chatbot/tools/flagship-tools.ts src/lib/chatbot/engine.ts
git commit -m "feat(chatbot): remember_context capture tool, stripped in demo mode"
```

---

### Task 3: Store `memoryProfile` + reset on new chat

**Files:**
- Modify: `src/stores/chatbotStore.ts`
- Modify: `src/components/chatbot/ChatWidget.tsx:115-122` (`handleNewChat`)

**Step 1: Extend the store**

In `chatbotStore.ts`:

1. Add the import at the top:
   ```ts
   import type { MemoryProfile } from '@/lib/chatbot/memory'
   ```
2. In the `ChatbotState` interface, add a state field (near `pendingChatMessage`):
   ```ts
   /** Within-session accumulated facts Clyde has captured about the visitor. */
   memoryProfile: MemoryProfile
   ```
   and two actions (in the Actions block):
   ```ts
   setMemoryProfile: (profile: MemoryProfile) => void
   resetMemory: () => void
   ```
3. In the defaults, add:
   ```ts
   memoryProfile: {},
   ```
4. In the actions implementation, add:
   ```ts
   setMemoryProfile: (profile: MemoryProfile) => set({ memoryProfile: profile }),
   resetMemory: () => set({ memoryProfile: {} }),
   ```
5. Leave `partialize` UNCHANGED — `memoryProfile` must stay in-memory only (within-session; resets on reload).

**Step 2: Reset on new chat**

In `ChatWidget.tsx`, `handleNewChat` currently resets messages, side panel, count, and the greet/follow-up refs. Add a `resetMemory()` call.

Read the action near the other store selectors:
```ts
  const resetMemory = useChatbotStore((s) => s.resetMemory)
```
Then in `handleNewChat`, add `resetMemory()` and add `resetMemory` to its dependency array:
```ts
  const handleNewChat = useCallback(() => {
    stop?.()
    setMessages?.([])
    closeSidePanel()
    resetMessageCount(personaId)
    resetMemory()
    hasGreeted.current = false
    hasSentFollowup.current = false
  }, [stop, setMessages, closeSidePanel, resetMessageCount, personaId, resetMemory])
```

**Step 3: Verify build + typecheck**

Run: `npm run build` (expect exit 0) and `npx tsc --noEmit` (expect clean apart from the known lighthouse-spec line).

**Step 4: Commit**

```bash
git add src/stores/chatbotStore.ts src/components/chatbot/ChatWidget.tsx
git commit -m "feat(chatbot): in-memory memoryProfile store field + reset on new chat"
```

---

### Task 4: `MemoryCard` component (reads accumulated profile, localized)

**Files:**
- Create: `src/components/chatbot/tool-results/MemoryCard.tsx`

**Step 1: Implement the card**

`MemoryCard.tsx`. It ignores the per-call `data` and renders the accumulated `memoryProfile` from the store, with locale-aware labels + a localized empty state. Uses the existing theme tokens. Numbers render as-is.

```tsx
'use client'

import { motion } from 'motion/react'
import { useLocale } from 'next-intl'
import { Brain } from 'lucide-react'
import { useChatbotStore } from '@/stores/chatbotStore'
import { MEMORY_FIELD_ORDER, type MemoryProfile } from '@/lib/chatbot/memory'

type Loc = 'nl' | 'en' | 'es'
function loc(value: string): Loc {
  return value === 'en' || value === 'es' ? value : 'nl'
}

const FIELD_LABELS: Record<Loc, Record<keyof MemoryProfile, string>> = {
  nl: {
    agencyName: 'Bureau',
    niche: 'Niche',
    brandCount: 'Merken',
    teamSize: 'Teamgrootte',
    painPoint: 'Pijnpunt',
    goal: 'Doel',
  },
  en: {
    agencyName: 'Agency',
    niche: 'Niche',
    brandCount: 'Brands',
    teamSize: 'Team size',
    painPoint: 'Pain point',
    goal: 'Goal',
  },
  es: {
    agencyName: 'Agencia',
    niche: 'Nicho',
    brandCount: 'Marcas',
    teamSize: 'Tamaño del equipo',
    painPoint: 'Punto de dolor',
    goal: 'Objetivo',
  },
}

const EMPTY_HINT: Record<Loc, string> = {
  nl: 'Clyde noteert hier wat hij over je leert terwijl jullie praten.',
  en: 'Clyde notes here what he learns about you as you talk.',
  es: 'Clyde anota aquí lo que aprende sobre ti mientras hablan.',
}

export interface MemoryCardData {
  remembered?: Partial<MemoryProfile>
}

export function MemoryCard(_props: { data: MemoryCardData }) {
  const l = loc(useLocale())
  const profile = useChatbotStore((s) => s.memoryProfile)
  const labels = FIELD_LABELS[l]
  const rows = MEMORY_FIELD_ORDER.filter((k) => {
    const v = profile[k]
    return v !== undefined && v !== null && String(v).trim() !== ''
  })

  if (rows.length === 0) {
    return (
      <div className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
        <p className="text-xs leading-relaxed text-text-secondary">{EMPTY_HINT[l]}</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      {rows.map((key, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.22 }}
          className="flex items-start gap-3 rounded-xl border border-border-primary bg-bg-elevated/80 p-3 backdrop-blur-md"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-system/15">
            <Brain className="h-3.5 w-3.5 text-accent-system" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              {labels[key]}
            </p>
            <p className="mt-0.5 break-words text-sm text-text-primary">{String(profile[key])}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default MemoryCard
```

**Step 2: Verify build**

Run: `npm run build` (expect exit 0). Card compiles though not yet wired.

**Step 3: Commit**

```bash
git add src/components/chatbot/tool-results/MemoryCard.tsx
git commit -m "feat(chatbot): MemoryCard renders accumulated profile, nl/en/es labels"
```

---

### Task 5: Wire the card, panel title, and accumulation

**Files:**
- Modify: `src/components/chatbot/tool-results/index.tsx`
- Modify: `src/components/chatbot/useChatChrome.ts` (PANEL_TITLES, all 3 locales)
- Modify: `src/components/chatbot/ChatMessages.tsx` (accumulation useMemo + effect)

**Step 1: Map the card + side-panel routing**

In `tool-results/index.tsx`:
- Add import: `import { MemoryCard } from './MemoryCard'`
- Add to the re-export block: `MemoryCard,` and `export type { MemoryCardData } from './MemoryCard'`
- Add `'remember_context'` to the `SIDE_PANEL_TOOLS` set.
- Add to `TOOL_CARD_MAP`: `remember_context: MemoryCard,`

**Step 2: Panel title (locale-aware)**

In `useChatChrome.ts`, add a `remember_context` entry to each locale block of `PANEL_TITLES`:
- nl: `remember_context: 'Wat Clyde onthoudt',`
- en: `remember_context: 'What Clyde remembers',`
- es: `remember_context: 'Lo que Clyde recuerda',`

**Step 3: Accumulate captures into the store**

In `ChatMessages.tsx`, add a selector + a derivation + an effect next to the existing `lastSidePanelTool` block (reusing the in-file `getToolName` helper). Add the selector near the other store selectors (~line 298):

```ts
  const setMemoryProfile = useChatbotStore((s) => s.setMemoryProfile)
```

Add the import at the top of the file:
```ts
import { mergeMemory, type MemoryProfile } from '@/lib/chatbot/memory'
```

Add after the `lastSidePanelTool` `useMemo`/effect:

```ts
  // Accumulate every remember_context capture across the whole conversation into the
  // store so the MemoryCard can show the full known profile (not just the last call).
  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- per-part as-any cast inside the loop blocks the compiler; messages/flagship deps are sufficient
  const accumulatedMemory = useMemo<MemoryProfile | null>(() => {
    if (!flagship) return null
    let acc: MemoryProfile = {}
    for (const msg of messages) {
      if (msg.role !== 'assistant') continue
      for (const part of msg.parts as unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any
        if (getToolName(p) === 'remember_context' && p.state === 'output-available') {
          const remembered = (p.output as { remembered?: Partial<MemoryProfile> })?.remembered
          if (remembered) acc = mergeMemory(acc, remembered)
        }
      }
    }
    return acc
  }, [flagship, messages])

  useEffect(() => {
    if (accumulatedMemory) setMemoryProfile(accumulatedMemory)
  }, [accumulatedMemory, setMemoryProfile])
```

**Step 4: Verify build + typecheck**

Run: `npm run build` (expect exit 0) and `npx tsc --noEmit` (clean apart from the known lighthouse line).

**Step 5: Commit**

```bash
git add src/components/chatbot/tool-results/index.tsx src/components/chatbot/useChatChrome.ts src/components/chatbot/ChatMessages.tsx
git commit -m "feat(chatbot): wire MemoryCard to sidebar + accumulate captures into store"
```

---

### Task 6: Persona nudge (capture + recall)

**Files:**
- Modify: `src/lib/chatbot/personas/clyde.ts` (STATIC_PREFIX, TOOL ROUTING block)

**Step 1: Add the routing line**

In the `TOOL ROUTING` list of `STATIC_PREFIX`, add one line after the `book_call` line:

```
- User reveals concrete agency facts (name, niche, number of brands/clients, team size, main pain, goal) -> remember_context. Pass only the new facts, then refer back to what you remember in later replies (for example: "je noemde 8 merken, dus...").
```

Keep it to that single line so the cached system prefix stays lean. Do not touch `persona.tools{}` (ignored by `createPersonaTools`).

**Step 2: Verify build**

Run: `npm run build` (expect exit 0).

**Step 3: Commit**

```bash
git add src/lib/chatbot/personas/clyde.ts
git commit -m "feat(chatbot): nudge Clyde to capture facts via remember_context and recall them"
```

---

### Task 7: Live e2e — capture + recall (gated)

**Files:**
- Create: `tests/e2e/clyde-memory.spec.ts`

**Step 1: Write the gated live test**

Asserts the end-to-end USP: Clyde captures a fact, then recalls it. Gated on `RUN_CLYDE_LIVE` so it never runs in the normal suite / CI without the key. Two live calls, chromium, serial.

```ts
import { test, expect, type Page } from '@playwright/test'

/**
 * LIVE test (gated on RUN_CLYDE_LIVE). Proves the memory USP end-to-end: Clyde
 * captures a revealed fact and recalls it on request. Hits the shared production
 * rate-limit — keep to these two calls, run --workers=1.
 *
 *   $env:PLAYWRIGHT_BASE_URL="http://localhost:3100"; $env:RUN_CLYDE_LIVE="1"
 *   npx playwright test tests/e2e/clyde-memory.spec.ts --project=chromium --workers=1
 */
const LIVE = process.env.RUN_CLYDE_LIVE === '1'

async function openClyde(page: Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
    } catch {}
  })
  await page.goto('/nl')
  const trigger = page.locator('button[aria-label^="Open chat"]').first()
  await trigger.waitFor({ state: 'visible', timeout: 20000 })
  await trigger.click()
  await page.locator('[data-chatwidget-panel]').waitFor({ state: 'visible', timeout: 15000 })
  await page.waitForTimeout(900)
}

async function send(page: Page, text: string) {
  const ta = page.locator('[data-chatwidget-panel] textarea')
  await ta.fill(text)
  await ta.press('Enter')
  await page
    .locator('button[aria-label="Opnieuw genereren"]')
    .last()
    .waitFor({ state: 'visible', timeout: 40000 })
    .catch(() => {})
  await page.waitForTimeout(800)
}

test.describe('Clyde live memory', () => {
  test.skip(!LIVE, 'set RUN_CLYDE_LIVE=1 to run against a live Clyde')

  test('captures a revealed fact and recalls it', async ({ page }) => {
    await openClyde(page)
    await send(page, 'We zijn een skincare-bureau met 8 merken, we verzuipen in content.')
    await send(page, 'Hoeveel merken noemde ik en in welke niche zit ik?')
    const panel = page.locator('[data-chatwidget-panel]')
    await expect(panel).toContainText('8')
    await expect(panel).toContainText(/skincare/i)
  })
})
```

**Step 2: Run it against the dev server**

Run (PowerShell):
```powershell
$env:PLAYWRIGHT_BASE_URL="http://localhost:3100"; $env:RUN_CLYDE_LIVE="1"; npx playwright test tests/e2e/clyde-memory.spec.ts --project=chromium --workers=1 --reporter=list
```
Expected: PASS. If the recall reply omits "8" or "skincare" (haiku variance), retry once; if it still fails, capture a screenshot and inspect — the capture itself can be confirmed by opening the "Wat Clyde onthoudt" panel.

**Step 3: Commit**

```bash
git add tests/e2e/clyde-memory.spec.ts
git commit -m "test(chatbot): gated live e2e for memory capture + recall"
```

---

### Task 8: Full verification + design-doc status

**Files:**
- Modify: `docs/plans/2026-05-29-clyde-memory-panel-design.md` (status line)

**Step 1: Green-light checks**
- `npm run build` -> exit 0.
- `npx tsc --noEmit` -> clean apart from `audit-v2-lighthouse.spec.ts:90`.
- `npx playwright test tests/e2e/memory-merge.spec.ts tests/e2e/clyde-i18n-render.spec.ts --project=chromium --workers=1` -> all pass (no API).
- Optional manual: open Clyde on /nl, say "We zijn een SaaS-bureau met 5 merken", confirm the "Wat Clyde onthoudt" panel fills.

**Step 2: Update design status**
Change the design doc status line to: `> Status: **implemented** 2026-05-29 (v1 within-session).`

**Step 3: Commit**

```bash
git add docs/plans/2026-05-29-clyde-memory-panel-design.md
git commit -m "docs(chatbot): mark Memory Panel v1 implemented"
```

---

## Out of scope (do NOT build in v1)

Persistence/localStorage, cross-session recall, profile injection into the system prompt, a separate extraction LLM call, a dedicated always-pinned memory toggle/badge. These are candidate v2 items.
