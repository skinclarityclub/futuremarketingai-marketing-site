---
phase: 03-interactive-features
plan: 04
subsystem: ui
tags: [scroll-reveal, calendly, framer-motion, zustand, client-islands]

requires:
  - phase: 03-interactive-features/01
    provides: ScrollReveal component, CalendlyModal component, useCalendlyBooking hook
  - phase: 03-interactive-features/03
    provides: DemoOrchestrator, ProgressiveCTA, chatbotStore with demo state

provides:
  - ScrollReveal wired into all 9 server-component pages for scroll animations
  - CalendlyModal globally available via CalendlyIsland in layout
  - ProgressiveCTA booking buttons trigger CalendlyModal instead of direct links
  - DemoCompletionCard Book a Call opens CalendlyModal via chatbotStore

affects: [04-seo-optimization, 05-content]

tech-stack:
  added: []
  patterns:
    - Global modal via Zustand store + client island in layout
    - ScrollReveal client island in server-component pages

key-files:
  created:
    - fmai-nextjs/src/components/interactive/CalendlyIsland.tsx
  modified:
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/src/app/[locale]/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx
    - fmai-nextjs/src/stores/chatbotStore.ts
    - fmai-nextjs/src/components/chatbot/ProgressiveCTA.tsx
    - fmai-nextjs/src/components/chatbot/demo/DemoOrchestrator.tsx

key-decisions:
  - "Global Calendly state in chatbotStore (Zustand) instead of local useCalendlyBooking hook for cross-component access"

patterns-established:
  - "Global modal pattern: Zustand store state + client island in layout for app-wide modal access"

requirements-completed: [INT-05, INT-08]

duration: 2min
completed: 2026-03-18
---

# Phase 3 Plan 4: Gap Closure -- ScrollReveal and CalendlyModal Wiring Summary

**ScrollReveal on all 9 pages for scroll animations, CalendlyModal globally available via layout with Zustand-driven open/close from ProgressiveCTA and DemoOrchestrator**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T03:29:29Z
- **Completed:** 2026-03-18T03:30:58Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments

- All 9 server-component pages import and use ScrollReveal for below-fold section animations (Task 1, prior commit)
- CalendlyModal rendered globally via CalendlyIsland client island in layout
- ProgressiveCTA booking buttons (10+ and 15+ message thresholds) open CalendlyModal instead of direct Calendly links
- DemoCompletionCard "Book a call" opens CalendlyModal via chatbotStore.openCalendly() instead of sending a chat message

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire ScrollReveal into all server-component pages** - `44d398f` (feat) -- completed in prior session
2. **Task 2: Wire CalendlyModal into layout, ProgressiveCTA, and DemoOrchestrator** - `0c7c88f` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/interactive/CalendlyIsland.tsx` - Client island wrapping CalendlyModal with chatbotStore state
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Renders CalendlyIsland globally alongside ChatWidgetIsland
- `fmai-nextjs/src/stores/chatbotStore.ts` - Extended with calendlyOpen, calendlyPrefill, openCalendly, closeCalendly
- `fmai-nextjs/src/components/chatbot/ProgressiveCTA.tsx` - Booking buttons use openCalendly() instead of direct links
- `fmai-nextjs/src/components/chatbot/demo/DemoOrchestrator.tsx` - handleCompletionBookCall calls openCalendly() instead of onSendMessage
- `fmai-nextjs/src/app/[locale]/page.tsx` + 8 other pages - ScrollReveal wrapping below-fold sections

## Decisions Made

- Global Calendly state in chatbotStore (Zustand) instead of local useCalendlyBooking hook -- enables any component to open Calendly without prop drilling or separate React state
- useCalendlyBooking hook left in place as standalone option for future local-state use cases

## Deviations from Plan

None - plan executed exactly as written. Most of the CalendlyModal wiring (chatbotStore extension, CalendlyIsland creation, layout integration, ProgressiveCTA updates) was already completed in prior plan work. Only the DemoOrchestrator handleCompletionBookCall change remained.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 3 Interactive Features fully complete with all gaps closed
- All motion animations and Calendly booking flows wired into their consumers
- Ready for Phase 4 SEO optimization

## Self-Check: PASSED

- All key files exist on disk
- Both task commits (44d398f, 0c7c88f) verified in git log
- TypeScript compiles cleanly (zero errors)
- All wiring verified via grep

---
*Phase: 03-interactive-features*
*Completed: 2026-03-18*
