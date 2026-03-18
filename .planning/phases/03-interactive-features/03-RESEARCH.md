# Phase 3: Interactive Features - Research

**Researched:** 2026-03-18
**Domain:** Interactive feature migration (animations, chatbot engine, demo mode, Calendly, cookie consent) from Vite SPA to Next.js App Router
**Confidence:** HIGH

## Summary

Phase 3 migrates all interactive features from the existing Vite/React SPA (`src/`) into the Next.js App Router project (`fmai-nextjs/`). The core challenge is converting a fully client-side architecture into Server Component pages with targeted "use client" islands. The most complex piece is the flagship chatbot engine -- currently served via a Vite dev-server middleware at `/api/chatbot` using AI SDK v6's `streamText` with Anthropic, 17 tools across 6 personas, a side panel for tool results, and a state-machine-driven demo mode. This must become a Next.js Route Handler with identical streaming behavior. Motion v12 (the renamed Framer Motion) requires "use client" wrappers since it uses browser APIs. Calendly uses `react-calendly` which needs client-only rendering. Cookie consent uses `react-cookie-consent` with localStorage.

The existing codebase is well-structured: the chatbot engine (`src/lib/chatbot/`) is already a standalone module with clean separation between engine, tools, personas, knowledge bases, and prompt building. The `handleChatRequest` function already accepts a standard `Request` object and returns a `Response` -- it maps almost 1:1 to a Next.js Route Handler. The main migration work is: (1) creating the Route Handler, (2) wrapping all interactive components as client islands, (3) adapting imports from `framer-motion` to `motion/react`, and (4) ensuring hydration safety for all client components.

**Primary recommendation:** Migrate the chatbot engine nearly verbatim into a Next.js Route Handler at `app/api/chatbot/route.ts`, wrap all interactive UI components as "use client" islands, and use a `MotionWrapper` pattern for reusable animation components shared across Server Component pages.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                     | Research Support                                                                                                                                  |
| ------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| INT-01 | Flagship concierge chatbot with SSR chrome and client hydration | Route Handler pattern + ChatWidget as client island; server-render the chat button chrome, hydrate on interaction                                 |
| INT-02 | All 17 chatbot tools migrated to Next.js Route Handlers         | Engine's `handleChatRequest` maps directly to `app/api/chatbot/route.ts` POST handler; all tool definitions are pure functions, no DOM dependency |
| INT-03 | 3-persona demo playground on Chatbots page                      | DemoPlayground + PersonaSelector + ChatWidget as client islands embedded in server-rendered Chatbots page                                         |
| INT-04 | Guided demo mode with 3 scenarios and state machine             | DemoOrchestrator + chatbotStore demo state already fully client-side; migrate as-is inside client island                                          |
| INT-05 | Motion v12 animations with "use client" wrapper pattern         | ScrollReveal, AnimatePresence wrappers as "use client" components; import from `motion/react`                                                     |
| INT-08 | Calendly CTA integration with modal pattern                     | CalendlyModal as "use client" island with dynamic import; calendlyConfig migrates unchanged                                                       |
| INT-09 | Cookie consent                                                  | CookieConsentBanner as "use client" island in root layout; replace localStorage with cookie-based approach for SSR safety                         |

</phase_requirements>

## Standard Stack

### Core

| Library              | Version  | Purpose                                                   | Why Standard                                                                                        |
| -------------------- | -------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| motion               | ^12.37.0 | Animation library (renamed from framer-motion)            | Import from `motion/react`; v12 has zero breaking changes from framer-motion v11, supports React 19 |
| ai                   | ^6.0.116 | AI SDK core -- streamText, tool(), convertToModelMessages | Already used in Vite codebase; provides streaming + tool execution                                  |
| @ai-sdk/react        | ^3.0.118 | useChat hook for client-side streaming UI                 | Already used via usePersonaChat; DefaultChatTransport pattern                                       |
| @ai-sdk/anthropic    | ^3.0.58  | Anthropic provider for AI SDK                             | Model routing (haiku/sonnet) via complexity detector                                                |
| zod                  | ^4.3.6   | Schema validation for tool input schemas                  | Already used for all 17 tool definitions                                                            |
| react-calendly       | ^4.4.0   | Calendly InlineWidget integration                         | Already used; needs "use client" + dynamic import for SSR safety                                    |
| react-cookie-consent | ^10.0.1  | Cookie consent banner (GDPR/CCPA)                         | v10 is latest; simple, customizable; already used in Vite codebase                                  |
| react-markdown       | ^10.1.0  | Markdown rendering in chat messages                       | Already used in ChatMessages component                                                              |
| lucide-react         | ^0.545.0 | Icon library                                              | Already used throughout chatbot UI and demo components                                              |

### Supporting

| Library        | Version | Purpose                                     | When to Use                                                                 |
| -------------- | ------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| zustand        | ^5.0.12 | State management for chatbot and demo state | Already in Next.js project; chatbotStore needs migration with skipHydration |
| tailwind-merge | ^3.5.0  | Class name merging                          | Already in Next.js project                                                  |

### Alternatives Considered

| Instead of           | Could Use                      | Tradeoff                                                                                                                            |
| -------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| react-calendly       | Calendly embed script directly | react-calendly provides React lifecycle management, prefill support, event tracking hooks; raw script is harder to integrate        |
| react-cookie-consent | Custom implementation          | Library handles GDPR edge cases (consent before cookies), decline button, expiry; not worth hand-rolling                            |
| motion               | CSS animations                 | Motion provides AnimatePresence (exit animations), layout animations, scroll-triggered reveals; CSS cannot replicate these patterns |

**Installation (in fmai-nextjs/):**

```bash
npm install motion ai @ai-sdk/react @ai-sdk/anthropic zod react-calendly react-cookie-consent react-markdown lucide-react
```

## Architecture Patterns

### Recommended Project Structure

```
fmai-nextjs/src/
├── app/
│   ├── api/
│   │   └── chatbot/
│   │       └── route.ts              # POST handler -- migrated engine
│   └── [locale]/
│       ├── (services)/
│       │   └── chatbots/
│       │       └── page.tsx           # Server page with DemoPlayground island
│       └── layout.tsx                 # Add ChatWidget + CookieConsent islands
├── components/
│   ├── chatbot/
│   │   ├── ChatWidget.tsx             # "use client" -- floating + embedded modes
│   │   ├── ChatHeader.tsx             # "use client"
│   │   ├── ChatMessages.tsx           # "use client"
│   │   ├── ChatInput.tsx              # "use client"
│   │   ├── FloatingButton.tsx         # "use client"
│   │   ├── SidePanel.tsx              # "use client"
│   │   ├── SuggestedPrompts.tsx       # "use client"
│   │   ├── DemoPlayground.tsx         # "use client"
│   │   ├── PersonaSelector.tsx        # "use client"
│   │   ├── DemoContextCard.tsx        # "use client"
│   │   ├── demo/
│   │   │   ├── DemoOrchestrator.tsx   # "use client"
│   │   │   ├── DemoProgress.tsx       # "use client"
│   │   │   ├── DemoScenarioCard.tsx   # "use client"
│   │   │   ├── DemoCheckpoint.tsx     # "use client"
│   │   │   ├── DemoCompletionCard.tsx # "use client"
│   │   │   └── scenarios.ts           # Pure data -- no directive needed
│   │   ├── tool-results/
│   │   │   ├── index.tsx              # "use client"
│   │   │   ├── ProductCard.tsx        # "use client"
│   │   │   ├── LeadScoreCard.tsx      # etc.
│   │   │   ├── ... (7 tool result cards)
│   │   │   └── NavigationButton.tsx   # "use client"
│   │   └── ProgressiveCTA.tsx         # "use client"
│   ├── interactive/
│   │   ├── CalendlyModal.tsx          # "use client" + dynamic import
│   │   ├── CookieConsentBanner.tsx    # "use client"
│   │   └── ScrollReveal.tsx           # "use client" animation wrapper
│   └── motion/
│       ├── MotionDiv.tsx              # "use client" re-export of motion.div
│       ├── AnimatePresenceWrapper.tsx # "use client" re-export
│       └── useMotionSafe.ts           # "use client" hook
├── hooks/
│   ├── usePersonaChat.ts              # "use client" hook
│   ├── useCalendlyBooking.ts          # "use client" hook
│   └── useReducedMotion.ts            # "use client" hook
├── lib/
│   └── chatbot/
│       ├── engine.ts                  # Server-only -- the core engine
│       ├── tool-executor.ts           # Server-only
│       ├── persona-router.ts          # Server-only
│       ├── prompt-builder.ts          # Server-only
│       ├── topic-router.ts            # Server-only
│       ├── complexity-detector.ts     # Server-only
│       ├── security.ts                # Server-only
│       ├── rate-limiter.ts            # Server-only
│       ├── types.ts                   # Shared types
│       ├── tools/                     # Server-only (6 tool files)
│       ├── personas/                  # Server-only (6 persona files)
│       └── knowledge/                 # Server-only (6 KB files)
├── config/
│   └── calendlyConfig.ts             # Pure data -- no directive needed
└── stores/
    └── chatbotStore.ts               # "use client" with skipHydration
```

### Pattern 1: Route Handler for Chatbot Engine

**What:** Migrate `handleChatRequest` from Vite middleware to Next.js Route Handler
**When to use:** All chatbot API requests

The existing engine already accepts `Request` and returns `Response` -- this is a near-1:1 migration.

```typescript
// app/api/chatbot/route.ts
import { handleChatRequest } from '@/lib/chatbot/engine'

export async function POST(request: Request) {
  return handleChatRequest(request)
}
```

Key changes needed in the engine:

- Remove CORS headers (same-origin in Next.js, no CORS needed)
- Remove OPTIONS handler (not needed for same-origin)
- The `ANTHROPIC_API_KEY` env var must be in `.env.local` (Next.js auto-loads it server-side)
- All imports from `ai`, `@ai-sdk/anthropic`, `zod` work identically on the server

### Pattern 2: "use client" Animation Wrappers

**What:** Thin client-component wrappers that re-export Motion components
**When to use:** Any page needing animations while keeping the page itself as a Server Component

```typescript
// components/motion/ScrollReveal.tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
}: ScrollRevealProps) {
  const shouldReduce = useReducedMotion()
  // ... identical logic to existing src/components/common/ScrollReveal.tsx
  // but import from 'motion/react' instead of 'framer-motion'
}
```

```typescript
// components/motion/MotionDiv.tsx
'use client'

import { motion } from 'motion/react'
export const MotionDiv = motion.div
export const MotionSpan = motion.span
```

Usage in Server Component pages:

```typescript
// app/[locale]/page.tsx (Server Component)
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export default function HomePage() {
  return (
    <main>
      <ScrollReveal>
        <h1>Server-rendered content with client animation</h1>
      </ScrollReveal>
    </main>
  )
}
```

### Pattern 3: Chatbot as Client Island in Layout

**What:** Floating chatbot button + panel rendered as a client island in the root layout
**When to use:** Global chatbot available on all pages

```typescript
// app/[locale]/layout.tsx
import { ChatWidgetIsland } from '@/components/chatbot/ChatWidgetIsland'
import { CookieConsentBanner } from '@/components/interactive/CookieConsentBanner'

export default async function LocaleLayout({ children, params }) {
  // ... existing server logic
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
          <ChatWidgetIsland />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Pattern 4: useChat Transport with Next.js Route Handler

**What:** The useChat hook from @ai-sdk/react connects to the Route Handler
**When to use:** All chatbot interactions

```typescript
// hooks/usePersonaChat.ts
'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useMemo } from 'react'
import { useChatbotStore } from '@/stores/chatbotStore'

export function usePersonaChat(personaId: string, pageContext?: { pathname: string }) {
  const { sessionId, messageCounts, incrementMessageCount, demoMode } = useChatbotStore()

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chatbot', // Same path -- now a Route Handler
        body: {
          personaId,
          sessionId,
          context: pageContext
            ? { currentPage: pageContext.pathname, demoMode: demoMode || undefined }
            : demoMode
              ? { demoMode: true }
              : undefined,
        },
      }),
    [personaId, sessionId, pageContext?.pathname, demoMode]
  )

  // ... identical to existing implementation
}
```

### Pattern 5: Calendly as Dynamic Import Client Island

**What:** Calendly widget loaded only on client, never SSR'd
**When to use:** Calendly modal from CTA buttons

```typescript
// components/interactive/CalendlyModal.tsx
'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

// Dynamic import prevents SSR of Calendly (requires DOM)
const InlineWidget = dynamic(
  () => import('react-calendly').then(mod => ({ default: mod.InlineWidget })),
  { ssr: false, loading: () => <CalendlyLoadingSkeleton /> }
)

export function CalendlyModal({ isOpen, onClose, url, prefill }: CalendlyModalProps) {
  const t = useTranslations('calendly')
  // ... rest identical, but use next-intl's useTranslations instead of react-i18next
}
```

### Anti-Patterns to Avoid

- **Marking entire pages as "use client":** The chatbots page should remain a Server Component; only the DemoPlayground section is a client island. This preserves SSR and SEO benefits.
- **Importing motion in Server Components:** Motion uses browser APIs. Always wrap in "use client" components or use the MotionDiv re-export pattern.
- **Using localStorage directly in component body:** Cookie consent and chatbot store must use useEffect or skipHydration to avoid SSR/client mismatch.
- **Creating a separate API for each tool:** All 17 tools should go through the single `/api/chatbot` Route Handler. The engine already handles tool routing internally.
- **Duplicating the engine for Server Actions:** The chatbot needs streaming responses. Route Handlers support streaming natively. Server Actions would add complexity without benefit for this use case.

## Don't Hand-Roll

| Problem                     | Don't Build                     | Use Instead                                       | Why                                                                        |
| --------------------------- | ------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| Streaming AI responses      | Custom SSE implementation       | AI SDK `streamText` + `toUIMessageStreamResponse` | Handles backpressure, error recovery, tool execution, multi-step reasoning |
| Chat UI state               | Custom message state management | `useChat` from `@ai-sdk/react`                    | Handles optimistic updates, streaming append, error states, abort          |
| Tool execution pipeline     | Custom tool dispatch            | AI SDK `tool()` + `createPersonaTools`            | Zod validation, type safety, auto-execution in streaming                   |
| Exit animations             | CSS transitions                 | Motion `AnimatePresence`                          | CSS cannot animate elements being removed from DOM                         |
| Scroll-triggered animations | IntersectionObserver + CSS      | Motion `whileInView`                              | Handles threshold, once-only, reduced motion preferences                   |
| Cookie consent GDPR         | Custom consent logic            | `react-cookie-consent`                            | Handles decline, expiry, consent-before-cookies, re-prompt                 |
| Calendly widget lifecycle   | iframe management               | `react-calendly` InlineWidget                     | Handles prefill, event callbacks, theme params, loading states             |

**Key insight:** The entire chatbot engine (engine.ts, tool-executor.ts, persona-router.ts, prompt-builder.ts, topic-router.ts, complexity-detector.ts, security.ts, rate-limiter.ts, 6 persona files, 6 tool files, 6 knowledge files) is pure server-side TypeScript with zero DOM dependencies. It can be copied nearly verbatim into `fmai-nextjs/src/lib/chatbot/`. The only change needed is removing the CORS headers from the engine response.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Zustand Persisted Stores

**What goes wrong:** chatbotStore uses `persist` middleware with localStorage. Server renders default state, client reads localStorage and gets different state, causing hydration error.
**Why it happens:** Server has no access to localStorage; client rehydrates with stored values.
**How to avoid:** Use the `skipHydration` pattern already established in Phase 1. The chatbotStore must use `skipHydration: true` in its persist config and call `useChatbotStore.persist.rehydrate()` in a useEffect.
**Warning signs:** Console errors about "Text content did not match" or "Hydration failed" on pages with the chatbot.

### Pitfall 2: Motion Import Path (framer-motion vs motion/react)

**What goes wrong:** Using `import { motion } from 'framer-motion'` in the Next.js project causes larger bundle or compatibility issues.
**Why it happens:** Framer Motion was renamed to Motion. The `framer-motion` package still works but is a compatibility shim. The canonical import is `motion/react`.
**How to avoid:** Global find-replace: change all `from 'framer-motion'` to `from 'motion/react'` during migration. The API is identical.
**Warning signs:** Bundle analyzer showing duplicate motion code.

### Pitfall 3: Calendly Widget Not Loading (SSR Attempt)

**What goes wrong:** Calendly InlineWidget renders on server where `window` is undefined, causing crash or blank widget.
**Why it happens:** react-calendly uses browser DOM APIs internally.
**How to avoid:** Always use `dynamic(() => import('react-calendly'), { ssr: false })` or wrap in a component that only renders after mount (useEffect + state flag).
**Warning signs:** "window is not defined" error during build or SSR.

### Pitfall 4: Chat API Route Missing Environment Variable

**What goes wrong:** Chatbot returns 500 error because `ANTHROPIC_API_KEY` is not available.
**Why it happens:** In Vite, env vars are loaded via `import.meta.env`. In Next.js, server-side env vars must be in `.env.local` (not prefixed with `NEXT_PUBLIC_`).
**How to avoid:** Add `ANTHROPIC_API_KEY` to `fmai-nextjs/.env.local`. The `@ai-sdk/anthropic` provider reads `process.env.ANTHROPIC_API_KEY` automatically.
**Warning signs:** 500 errors from `/api/chatbot`; "API key not found" in server logs.

### Pitfall 5: createPortal in SidePanel SSR

**What goes wrong:** SidePanel uses `createPortal(... , document.body)` which fails during SSR.
**Why it happens:** `document` is not available on the server.
**How to avoid:** The existing code already has a guard (`typeof document !== 'undefined'`). Ensure this is preserved. Since SidePanel is inside a "use client" ChatWidget, it will only render on the client, but the guard is still good practice.
**Warning signs:** "document is not defined" during server rendering.

### Pitfall 6: Animation Layout Shift Above the Fold

**What goes wrong:** Content animated with `initial={{ opacity: 0, y: 30 }}` causes CLS (Cumulative Layout Shift) because the element is invisible then appears.
**Why it happens:** Motion's initial state hides content that then animates in, causing visual shift.
**How to avoid:** For above-the-fold content, either (a) don't animate or (b) use `opacity` only (no `y`/`x` offset) so the element occupies its space even when invisible. Reserve slide-in animations for below-fold content using `whileInView`.
**Warning signs:** Lighthouse CLS score > 0.1; visible content jump on page load.

### Pitfall 7: useTranslations vs useTranslation

**What goes wrong:** Vite components use `useTranslation('namespace')` from react-i18next. Next.js project uses `useTranslations('namespace')` from next-intl. Different API.
**Why it happens:** Different i18n libraries between Vite and Next.js projects.
**How to avoid:** During migration, systematically replace `useTranslation` with `useTranslations` from next-intl. Key differences: (a) next-intl returns `t('key')` directly, no `{ t }` destructure needed for simple cases; (b) no `returnObjects: true` -- use `t.raw('key')` for arrays; (c) namespace is the first argument like before.
**Warning signs:** TypeScript errors about missing `t` function; runtime "key not found" warnings.

## Code Examples

### Route Handler (chatbot engine migration)

```typescript
// app/api/chatbot/route.ts
// Source: Migrated from src/lib/chatbot/engine.ts
import { handleChatRequest } from '@/lib/chatbot/engine'

export const runtime = 'nodejs' // Required for AI SDK streaming
export const maxDuration = 30 // Vercel function timeout

export async function POST(request: Request) {
  return handleChatRequest(request)
}
```

### Engine modification (remove CORS)

```typescript
// lib/chatbot/engine.ts -- only change needed
// REMOVE: const CORS_HEADERS = { ... }
// REMOVE: headers: CORS_HEADERS from all Response.json() calls
// REMOVE: OPTIONS handler
// KEEP: everything else identical
```

### ChatWidget Island wrapper

```typescript
// components/chatbot/ChatWidgetIsland.tsx
'use client'

import { usePathname } from 'next/navigation'
import { ChatWidget } from './ChatWidget'

export function ChatWidgetIsland() {
  const pathname = usePathname()

  return (
    <ChatWidget
      mode="floating"
      personaId="flagship"
      personaName="FMai Concierge"
      suggestedPrompts={[
        'What services does FMai offer?',
        'Show me a case study',
        'Start guided demo',
      ]}
      pageContext={{ pathname }}
    />
  )
}
```

### Cookie Consent with next-intl

```typescript
// components/interactive/CookieConsentBanner.tsx
'use client'

import { useEffect, useState } from 'react'
import CookieConsent from 'react-cookie-consent'
import { useTranslations } from 'next-intl'

export function CookieConsentBanner() {
  const t = useTranslations('common')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevent SSR mismatch

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('cookie_consent.accept')}
      declineButtonText={t('cookie_consent.decline')}
      enableDeclineButton
      cookieName="futuremarketingai-cookie-consent"
      expires={365}
      // ... style props identical to existing
    >
      {/* ... content */}
    </CookieConsent>
  )
}
```

### DemoPlayground migration pattern

```typescript
// In chatbots page.tsx (Server Component):
import { DemoPlayground } from '@/components/chatbot/DemoPlayground'

export default function ChatbotsPage() {
  return (
    <main>
      {/* Server-rendered SEO content */}
      <section>
        <h1>AI Chatbots</h1>
        {/* ... server-rendered hero, features, etc. */}
      </section>

      {/* Client island for interactive demo */}
      <DemoPlayground />
    </main>
  )
}
```

## State of the Art

| Old Approach                             | Current Approach                        | When Changed      | Impact                                                     |
| ---------------------------------------- | --------------------------------------- | ----------------- | ---------------------------------------------------------- |
| `import { motion } from 'framer-motion'` | `import { motion } from 'motion/react'` | Motion v12 (2024) | Package rename; API identical; better tree-shaking         |
| Vite dev middleware for API              | Next.js Route Handler                   | Next.js 13+       | Native streaming support, no CORS needed, auto env loading |
| `react-i18next` useTranslation           | `next-intl` useTranslations             | Phase 1 decision  | RSC-compatible i18n; already migrated in Phase 1           |
| Direct Anthropic SDK                     | AI SDK v6 with providers                | Already in v1     | Unified streaming, tool execution, model routing           |

**Deprecated/outdated:**

- `framer-motion` package name: Still works but is a shim redirecting to `motion`. Use `motion` directly.
- AI SDK v5 REST-based approach: v6 supports Server Actions natively, but Route Handlers still work perfectly for streaming chat.
- `react-cookie-consent` v9: v10 is current; minor API improvements.

## Open Questions

1. **react-calendly React 19 compatibility**
   - What we know: react-calendly v4.4.0 was last published 9+ months ago. The Next.js project uses React 19.2.3.
   - What's unclear: Whether react-calendly has explicit React 19 peer dependency support.
   - Recommendation: Install and test. If incompatible, fall back to direct Calendly embed script (inject via useEffect + script tag). The existing ad-blocker fallback already provides a direct link pattern.

2. **AI SDK v6 Server Actions vs Route Handlers**
   - What we know: AI SDK v6 promotes Server Actions as the primary pattern. The existing engine uses `streamText` + `toUIMessageStreamResponse` which is the Route Handler pattern.
   - What's unclear: Whether Server Actions would provide benefits for this use case.
   - Recommendation: Keep Route Handlers. The existing engine.ts is already structured as a Request->Response handler. Converting to Server Actions would require restructuring for no clear benefit, and Route Handlers give explicit control over streaming, rate limiting, and error handling.

3. **Analytics initialization after cookie consent**
   - What we know: Current code initializes GA4, Hotjar, and web vitals after consent. These use `import.meta.env` (Vite) for environment checks.
   - What's unclear: Whether analytics SDKs (react-ga4, hotjar) are needed in the Next.js project at this phase.
   - Recommendation: Defer analytics integration to Phase 6 (Performance/Polish). For Phase 3, cookie consent should persist the user preference and call a placeholder function. The consent mechanism itself is what INT-09 requires.

## Sources

### Primary (HIGH confidence)

- Existing Vite codebase at `src/lib/chatbot/` -- Full engine, tools, personas, knowledge bases examined
- Existing Vite codebase at `src/components/chatbot/` -- All UI components examined
- Existing Vite codebase at `src/components/common/CalendlyModal.tsx`, `CookieConsent.tsx`, `ScrollReveal.tsx`
- Existing Vite `package.json` -- All dependency versions verified
- Existing Next.js `fmai-nextjs/package.json` -- Current project dependencies
- [AI SDK Getting Started: Next.js App Router](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) -- Route Handler pattern
- [Motion for React installation](https://motion.dev/docs/react-installation) -- Import from `motion/react`
- [Motion changelog](https://motion.dev/changelog) -- v12.37.0 latest

### Secondary (MEDIUM confidence)

- [react-calendly npm](https://www.npmjs.com/package/react-calendly) -- v4.4.0, last updated 9+ months ago
- [react-cookie-consent npm](https://www.npmjs.com/package/react-cookie-consent) -- v10.0.1 latest
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) -- framer-motion to motion migration

### Tertiary (LOW confidence)

- react-calendly React 19 compatibility -- No explicit confirmation found; needs runtime validation

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- All libraries already in use in Vite codebase; versions verified
- Architecture: HIGH -- Server/client boundary patterns established in Phase 1; Route Handler is standard Next.js
- Chatbot migration: HIGH -- Engine already uses Request/Response pattern; near-1:1 migration
- Animation migration: HIGH -- Motion v12 is API-compatible; only import path changes
- Calendly/Cookie: MEDIUM -- Libraries work but React 19 compatibility unverified for react-calendly
- Pitfalls: HIGH -- Based on direct codebase analysis and known Next.js patterns

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable libraries, well-understood patterns)
