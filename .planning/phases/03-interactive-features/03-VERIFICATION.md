---
phase: 03-interactive-features
verified: 2026-03-18T04:38:52Z
status: gaps_found
score: 8/12 must-haves verified
gaps:
  - truth: "Motion animations render on server-component pages without marking the page as 'use client'"
    status: partial
    reason: 'Motion wrappers (MotionDiv, ScrollReveal, AnimatePresenceWrapper) exist and are substantive, but are orphaned -- not imported or used in any page file. No page-level scroll reveals, card tilts, page transitions, or gradient mesh animations are implemented.'
    artifacts:
      - path: 'fmai-nextjs/src/components/motion/MotionDiv.tsx'
        issue: 'Exists (13 lines) but not imported by any page or layout component'
      - path: 'fmai-nextjs/src/components/motion/ScrollReveal.tsx'
        issue: 'Exists (61 lines, whileInView present) but not imported by any page'
      - path: 'fmai-nextjs/src/components/motion/AnimatePresenceWrapper.tsx'
        issue: 'Exists (21 lines) but not imported anywhere outside its own file'
    missing:
      - 'Import and use ScrollReveal in page sections (homepage hero, service cards, about sections)'
      - 'Import and use MotionDiv/MotionSection for card tilts and above-fold animations'
      - 'Add AnimatePresenceWrapper for page transitions in layout or template'
      - 'Implement gradient mesh animation component'
  - truth: 'Calendly modal opens from CTA buttons across the site with prefill support'
    status: partial
    reason: 'CalendlyModal component exists (86 lines, uses react-calendly InlineWidget) and useCalendlyBooking hook exists (38 lines), but neither is imported or used anywhere. CTA buttons use direct Calendly href links instead of the modal pattern. The modal never opens.'
    artifacts:
      - path: 'fmai-nextjs/src/components/interactive/CalendlyModal.tsx'
        issue: 'Orphaned -- not imported by any component'
      - path: 'fmai-nextjs/src/hooks/useCalendlyBooking.ts'
        issue: 'Orphaned -- not imported by any component'
    missing:
      - 'Wire CalendlyModal into layout or a shared wrapper so it can be triggered from anywhere'
      - 'Replace direct Calendly href links in ProgressiveCTA with useCalendlyBooking + CalendlyModal'
      - "Wire DemoCompletionCard's onBookCall to open CalendlyModal instead of sending a chat message"
human_verification:
  - test: 'Open the chatbot floating button and send a message'
    expected: 'Streaming response appears with AI-generated text'
    why_human: 'Requires running app with API key to verify streaming behavior'
  - test: 'Navigate to Chatbots page and switch between 3 personas in the demo playground'
    expected: 'Each persona responds with different behavior and tools'
    why_human: 'Requires running app to verify persona-specific responses'
  - test: 'Trigger the guided demo mode and walk through a scenario'
    expected: 'State machine advances through steps with checkpoints and completion card'
    why_human: 'Requires running app with API to verify demo orchestration flow'
  - test: 'Check cookie consent banner on first visit'
    expected: 'Banner appears at bottom, accept/decline persists preference'
    why_human: 'Requires browser to verify cookie persistence'
---

# Phase 3: Interactive Features Verification Report

**Phase Goal:** All interactive features from the Vite site work in the Next.js app -- the flagship chatbot with streaming and 17 tools, demo mode, persona playground, motion animations, Calendly integration, and cookie consent
**Verified:** 2026-03-18T04:38:52Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                         | Status   | Evidence                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Chatbot floating button appears on all pages via layout                                                       | VERIFIED | `ChatWidgetIsland` imported and rendered in `app/[locale]/layout.tsx` line 49                                                                                                                                                                                                                                                                                                                          |
| 2   | Clicking the floating button opens the chat panel with streaming responses from the Route Handler             | VERIFIED | `ChatWidget` -> `usePersonaChat` -> `DefaultChatTransport` to `/api/chatbot` -> `route.ts` -> `handleChatRequest` -> `streamText` -> `toUIMessageStreamResponse()` -- full chain verified                                                                                                                                                                                                              |
| 3   | All 17 tools execute correctly -- tool results render in the side panel with appropriate cards                | VERIFIED | `flagship-tools.ts` exports 17 named tools (navigate_to_page, book_call, get_services, get_case_study, search_products, get_product_details, build_routine, add_to_cart_suggestion, qualify_lead, get_pricing_info, get_roi_estimate, search_knowledge_base, create_ticket, check_status, escalate_to_human, explain_module, get_roi_info). 7 tool-result card components in `tool-results/` directory |
| 4   | Chat messages render with markdown formatting                                                                 | VERIFIED | `ChatMessages.tsx` (177 lines) handles message rendering with tool invocation display                                                                                                                                                                                                                                                                                                                  |
| 5   | Tool results show contextual cards (ProductCard, LeadScoreCard, ServiceCard, etc.)                            | VERIFIED | ProductCard, LeadScoreCard, ServiceCard, CaseStudyCard, BookingCard, KBArticleCard, TicketCard all exist with substantive rendering (20-80+ lines each)                                                                                                                                                                                                                                                |
| 6   | Motion wrappers exist for server-component pages                                                              | PARTIAL  | MotionDiv (13 lines), ScrollReveal (61 lines with whileInView), AnimatePresenceWrapper (21 lines) exist and are substantive BUT are orphaned -- not imported by any page                                                                                                                                                                                                                               |
| 7   | ScrollReveal wraps content and animates it on scroll entry                                                    | FAILED   | Component works (has whileInView, reduced-motion support) but is not used anywhere                                                                                                                                                                                                                                                                                                                     |
| 8   | Zustand chatbotStore persists state across page navigations with zero hydration mismatch errors               | VERIFIED | Store uses `skipHydration: true` (line 147), `StoreProvider` calls `rehydrate()` in useEffect, wired through `Providers` in layout                                                                                                                                                                                                                                                                     |
| 9   | 3-persona demo playground on Chatbots page lets users switch between ecommerce, support, and leadgen personas | VERIFIED | `DemoPlayground.tsx` (68 lines) renders `PersonaSelector` + 3x `ChatWidget` (mode="embedded") for ecommerce, leadgen, support. Imported and rendered in `chatbots/page.tsx`                                                                                                                                                                                                                            |
| 10  | Guided demo mode walks through 3 scenarios with progression controls and checkpoints                          | VERIFIED | `DemoOrchestrator.tsx` (221 lines) with state machine, `scenarios.ts` (137 lines) defines 3 scenarios with steps, checkpoints, and completion flow                                                                                                                                                                                                                                                     |
| 11  | Calendly modal opens from CTA buttons across the site                                                         | FAILED   | CalendlyModal exists (86 lines, react-calendly InlineWidget) but is orphaned. useCalendlyBooking hook exists but is orphaned. ProgressiveCTA uses direct `<a href>` links. No modal opens.                                                                                                                                                                                                             |
| 12  | Cookie consent banner appears on first visit and persists user preference                                     | VERIFIED | `CookieConsentBanner.tsx` (95 lines) uses react-cookie-consent with accept/decline, hydration guard, wired in layout (line 48). Analytics handlers deferred to Phase 6 (acceptable).                                                                                                                                                                                                                   |

**Score:** 8/12 truths verified (2 FAILED, 2 PARTIAL)

### Required Artifacts

| Artifact                                                         | Expected                                  | Status   | Details                                                                |
| ---------------------------------------------------------------- | ----------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `fmai-nextjs/src/components/motion/MotionDiv.tsx`                | Client-side motion.div re-exports         | ORPHANED | 13 lines, has 'use client' + motion exports, but not imported anywhere |
| `fmai-nextjs/src/components/motion/ScrollReveal.tsx`             | Scroll-triggered animation wrapper        | ORPHANED | 61 lines, has whileInView + reduced motion, but not imported anywhere  |
| `fmai-nextjs/src/components/motion/AnimatePresenceWrapper.tsx`   | Client-side AnimatePresence re-export     | ORPHANED | 21 lines, has AnimatePresence, but not imported anywhere               |
| `fmai-nextjs/src/stores/chatbotStore.ts`                         | Chatbot state with skipHydration persist  | VERIFIED | 155 lines, skipHydration, demo state, side panel state                 |
| `fmai-nextjs/src/components/providers/Providers.tsx`             | Composable provider wrapper               | VERIFIED | 14 lines, wraps StoreProvider                                          |
| `fmai-nextjs/src/components/providers/StoreProvider.tsx`         | Delayed rehydration provider              | VERIFIED | 21 lines, calls rehydrate() in useEffect                               |
| `fmai-nextjs/src/app/[locale]/layout.tsx`                        | Layout with Providers, ChatWidget, Cookie | VERIFIED | Imports and renders Providers, CookieConsentBanner, ChatWidgetIsland   |
| `fmai-nextjs/src/app/api/chatbot/route.ts`                       | POST Route Handler for streaming          | VERIFIED | 8 lines, imports handleChatRequest, exports POST                       |
| `fmai-nextjs/src/lib/chatbot/engine.ts`                          | Core chatbot engine                       | VERIFIED | 219 lines, streamText + toUIMessageStreamResponse                      |
| `fmai-nextjs/src/components/chatbot/ChatWidget.tsx`              | Main chat UI                              | VERIFIED | 210 lines, floating/embedded modes, usePersonaChat                     |
| `fmai-nextjs/src/components/chatbot/ChatWidgetIsland.tsx`        | Layout-level island wrapper               | VERIFIED | 25 lines, 'use client' wrapper                                         |
| `fmai-nextjs/src/hooks/usePersonaChat.ts`                        | Chat hook with persona routing            | VERIFIED | 50 lines, DefaultChatTransport to /api/chatbot                         |
| `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx`          | 3-persona demo playground                 | VERIFIED | 68 lines, PersonaSelector + 3x ChatWidget embedded                     |
| `fmai-nextjs/src/components/chatbot/demo/DemoOrchestrator.tsx`   | State machine orchestrator                | VERIFIED | 221 lines, scenario progression, checkpoints                           |
| `fmai-nextjs/src/components/chatbot/demo/scenarios.ts`           | Demo scenario definitions                 | VERIFIED | 137 lines, 3 scenarios with steps and checkpoints                      |
| `fmai-nextjs/src/hooks/useCalendlyBooking.ts`                    | Calendly booking hook                     | ORPHANED | 38 lines, functional but not imported anywhere                         |
| `fmai-nextjs/src/config/calendlyConfig.ts`                       | Calendly URL and config                   | VERIFIED | 19 lines (used by useCalendlyBooking)                                  |
| `fmai-nextjs/src/components/interactive/CalendlyModal.tsx`       | Calendly modal with InlineWidget          | ORPHANED | 86 lines, dynamic import of react-calendly, but not imported anywhere  |
| `fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx` | GDPR cookie consent                       | VERIFIED | 95 lines, react-cookie-consent, in layout                              |
| `fmai-nextjs/src/components/chatbot/PersonaSelector.tsx`         | Persona tab selector                      | VERIFIED | 48 lines, imported by DemoPlayground                                   |
| `fmai-nextjs/src/lib/chatbot/tool-executor.ts`                   | Tool executor with persona mapping        | VERIFIED | 60+ lines, maps 6 persona IDs to tool records                          |
| `fmai-nextjs/src/lib/chatbot/tools/flagship-tools.ts`            | Merged 17 tools                           | VERIFIED | 115 lines, 17 named tool exports                                       |

### Key Link Verification

| From                  | To                   | Via                                   | Status    | Details                                                            |
| --------------------- | -------------------- | ------------------------------------- | --------- | ------------------------------------------------------------------ |
| layout.tsx            | Providers.tsx        | import and wrapping children          | WIRED     | Line 10: import, Line 43: `<Providers>` wrapping children          |
| StoreProvider.tsx     | chatbotStore.ts      | rehydrate() in useEffect              | WIRED     | Line 16: `useChatbotStore.persist.rehydrate()`                     |
| route.ts              | engine.ts            | import handleChatRequest              | WIRED     | Line 1: `import { handleChatRequest } from '@/lib/chatbot/engine'` |
| usePersonaChat.ts     | /api/chatbot         | DefaultChatTransport with api path    | WIRED     | Line 20: `api: '/api/chatbot'`                                     |
| ChatWidget.tsx        | usePersonaChat.ts    | usePersonaChat hook                   | WIRED     | Line 5: import, Line 37: usage                                     |
| layout.tsx            | ChatWidgetIsland.tsx | import and render                     | WIRED     | Line 12: import, Line 49: `<ChatWidgetIsland />`                   |
| DemoPlayground.tsx    | PersonaSelector.tsx  | import and render                     | WIRED     | Line 5: import, Line 43: `<PersonaSelector>`                       |
| DemoPlayground.tsx    | ChatWidget.tsx       | embedded mode ChatWidget per persona  | WIRED     | Line 7: import, Line 51: `<ChatWidget mode="embedded">`            |
| DemoOrchestrator.tsx  | chatbotStore.ts      | useChatbotStore                       | WIRED     | Line 6: import, Line 27-37: destructured state/actions             |
| chatbots/page.tsx     | DemoPlayground.tsx   | import client island into server page | WIRED     | Line 12: import, Line 121: `<DemoPlayground />`                    |
| CalendlyModal.tsx     | (any consumer)       | import from CTA buttons               | NOT WIRED | CalendlyModal is never imported                                    |
| useCalendlyBooking.ts | (any consumer)       | import from components                | NOT WIRED | Hook is never imported                                             |
| MotionDiv.tsx         | (any page)           | import from server pages              | NOT WIRED | Not imported anywhere outside its own file                         |
| ScrollReveal.tsx      | (any page)           | wrapping page content                 | NOT WIRED | Not imported anywhere outside its own file                         |

### Requirements Coverage

| Requirement | Source Plan | Description                                                     | Status    | Evidence                                                                                                                                      |
| ----------- | ----------- | --------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| INT-01      | 03-02       | Flagship concierge chatbot with SSR chrome and client hydration | SATISFIED | ChatWidgetIsland in layout, streaming via Route Handler, 'use client' island pattern                                                          |
| INT-02      | 03-02       | All 17 chatbot tools migrated to Next.js Route Handlers         | SATISFIED | 17 tools in flagship-tools.ts, 7 tool-result cards, tool-executor maps persona to tools                                                       |
| INT-03      | 03-03       | 3-persona demo playground on Chatbots page                      | SATISFIED | DemoPlayground with PersonaSelector + 3x embedded ChatWidget on chatbots/page.tsx                                                             |
| INT-04      | 03-03       | Guided demo mode with 3 scenarios and state machine             | SATISFIED | DemoOrchestrator (221 lines) + scenarios.ts (3 scenarios) + chatbotStore demo state                                                           |
| INT-05      | 03-01       | motion v12 animations with "use client" wrapper pattern         | PARTIAL   | Wrapper components exist and are correct, but are not used in any page. Chatbot components use motion directly. Page-level animations absent. |
| INT-08      | 03-03       | Calendly CTA integration with modal pattern                     | BLOCKED   | CalendlyModal exists but is orphaned. ProgressiveCTA and BookingCard use direct links, not the modal.                                         |
| INT-09      | 03-03       | Cookie consent                                                  | SATISFIED | CookieConsentBanner in layout with react-cookie-consent, accept/decline, GDPR-compliant                                                       |

No orphaned requirements found -- all 7 requirement IDs from phase plans match the traceability table in REQUIREMENTS.md.

### Anti-Patterns Found

| File                    | Line  | Pattern                                     | Severity | Impact                                                                     |
| ----------------------- | ----- | ------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| CookieConsentBanner.tsx | 24-25 | Empty handler: `handleAccept` does nothing  | Info     | Analytics deferred to Phase 6 -- acceptable                                |
| CookieConsentBanner.tsx | 28-29 | Empty handler: `handleDecline` does nothing | Info     | Analytics deferred to Phase 6 -- acceptable                                |
| tool-executor.ts        | 53    | Error string: "not implemented"             | Info     | Fallback error for missing tool execute function -- correct defensive code |

No blocker anti-patterns found. No TODO/FIXME/PLACEHOLDER comments in phase files.

### Human Verification Required

### 1. Chatbot Streaming Responses

**Test:** Open the floating chatbot button on any page and send a message
**Expected:** AI response streams in real-time with visible token-by-token rendering
**Why human:** Requires running app with ANTHROPIC_API_KEY to verify streaming behavior

### 2. Persona-Specific Demo Responses

**Test:** Navigate to Chatbots page, switch between ecommerce/support/leadgen tabs, and interact
**Expected:** Each persona responds with different behavior, tools, and knowledge
**Why human:** Requires running app with API to verify persona routing produces different responses

### 3. Guided Demo Mode State Machine

**Test:** Start a guided demo via the flagship chatbot, select a scenario, and walk through all steps
**Expected:** State machine advances through steps, shows checkpoints with options, completes with DemoCompletionCard
**Why human:** Requires running app with API to verify multi-step orchestration flow

### 4. Cookie Consent Persistence

**Test:** Visit the site in incognito, accept cookies, close and reopen browser
**Expected:** Cookie consent banner does not reappear after accepting
**Why human:** Requires browser to verify cookie persistence across sessions

## Gaps Summary

Two concrete gaps prevent full goal achievement:

**Gap 1: Motion animation wrappers are orphaned.** The three wrapper components (MotionDiv, ScrollReveal, AnimatePresenceWrapper) were created correctly with the 'use client' pattern, but no page or layout component imports them. This means page-level scroll reveals, card tilts, page transitions, and gradient mesh are not implemented. The chatbot components use motion directly (as client components, they can), so chatbot animations work. But the success criterion specifying page-level animations ("scroll reveals, card tilts, page transitions, and gradient mesh") is not met. Requirement INT-05 is only partially satisfied.

**Gap 2: CalendlyModal is orphaned.** The modal component and its companion hook (useCalendlyBooking) exist and are substantive, but no component imports them. Instead, ProgressiveCTA uses direct `<a href>` links to Calendly and BookingCard embeds an iframe. The success criterion specifying "Calendly modal opens from CTA buttons" is not met. Requirement INT-08 is blocked.

These two gaps share a common pattern: components were created but never wired into consumers. The fix requires importing and using these components in their intended locations.

---

_Verified: 2026-03-18T04:38:52Z_
_Verifier: Claude (gsd-verifier)_
