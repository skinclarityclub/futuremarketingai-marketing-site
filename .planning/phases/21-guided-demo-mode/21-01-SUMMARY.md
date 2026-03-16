---
phase: 21-guided-demo-mode
plan: 01
subsystem: ui
tags: [zustand, calendly, chatbot, demo, typescript]

requires:
  - phase: 20-flagship-concierge-chatbot
    provides: Flagship chatbot with tool-results system, side panel routing, chatbotStore
provides:
  - Three typed demo scenario definitions (new-client, ecommerce, support)
  - Zustand demo mode state and actions (ephemeral, not persisted)
  - BookingCard component with Calendly iframe embed
  - book_call routed to side panel via SIDE_PANEL_TOOLS
affects: [21-02-demo-ui-components, 21-03-orchestrator-integration]

tech-stack:
  added: []
  patterns:
    - 'Ephemeral Zustand state excluded from persist partialize'
    - 'Calendly iframe with dark theme params and error fallback'

key-files:
  created:
    - src/components/chatbot/demo/scenarios.ts
    - src/components/chatbot/tool-results/BookingCard.tsx
  modified:
    - src/stores/chatbotStore.ts
    - src/components/chatbot/tool-results/index.tsx

key-decisions:
  - 'BookingCard renders Calendly iframe with dark theme params matching site palette'
  - 'Demo state fields are ephemeral (not persisted) and reset on page reload'
  - 'book_call moved from INLINE_TOOLS to SIDE_PANEL_TOOLS for richer booking experience'
  - 'Task 4 (debug cleanup) was a no-op since debug logging was already absent from ChatMessages'

patterns-established:
  - 'DemoScenario/DemoStep/DemoCheckpoint types for scripted demo flows'
  - 'BOOKING_STEP constant for skip-to-booking checkpoint action'

requirements-completed:
  [REQ-DEMO-SCENARIOS, REQ-DEMO-STATE, REQ-BOOKING-SIDEPANEL, REQ-DEBUG-CLEANUP]

duration: 7min
completed: 2026-03-16
---

# Phase 21 Plan 01: Foundation Data and Components Summary

**Three typed demo scenarios with Zustand demo state, BookingCard Calendly embed, and book_call side panel routing**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-16T16:53:52Z
- **Completed:** 2026-03-16T17:00:41Z
- **Tasks:** 4 (3 executed, 1 no-op)
- **Files modified:** 4

## Accomplishments

- Three demo scenarios defined with type-safe interfaces, correct tool expectations per step, and checkpoint configurations
- Zustand store extended with 5 ephemeral demo state fields and 5 demo actions (excluded from persist)
- BookingCard component with embedded Calendly iframe (dark theme), loading state, and error fallback
- book_call routed to side panel instead of inline rendering

## Task Commits

Each task was committed atomically:

1. **Task 1: Scenario data definitions** - `bb16691` (feat)
2. **Task 2: Zustand store extension** - `c664a6d` (feat)
3. **Task 3: BookingCard + tool routing** - `feba797` (feat)
4. **Task 4: Remove debug logging** - No commit (no-op, debug logging already absent)

## Files Created/Modified

- `src/components/chatbot/demo/scenarios.ts` - DemoScenario/DemoStep/DemoCheckpoint types + 3 scenario data definitions + BOOKING_STEP
- `src/stores/chatbotStore.ts` - Extended with demoMode, demoScenarioId, demoStepIndex, demoStatus, demoStartedAt + 5 actions
- `src/components/chatbot/tool-results/BookingCard.tsx` - Calendly iframe embed card with loading pulse and error fallback CTA
- `src/components/chatbot/tool-results/index.tsx` - BookingCard import/export, book_call moved to SIDE_PANEL_TOOLS, TOOL_CARD_MAP updated

## Decisions Made

- BookingCard uses dark theme Calendly params (bg: 0a0e27, text: e0e0e0, primary: 00d4ff) matching site palette
- Demo state excluded from Zustand persist partialize -- resets on page reload by design
- book_call moved from INLINE_TOOLS to SIDE_PANEL_TOOLS for richer booking UX in side panel
- Task 4 (debug cleanup) confirmed as no-op: ChatMessages.tsx contained no console.log calls

## Deviations from Plan

None - plan executed exactly as written. Task 4 was a no-op since the debug logging targeted for removal was already absent.

## Issues Encountered

- Pre-existing TypeScript errors in `src/lib/chatbot/engine.ts` (lines 134-135) cause `npm run build` to fail. These errors existed before Phase 21 and are unrelated to this plan's changes. Logged to `deferred-items.md`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Scenario data ready for DemoOrchestrator (Plan 02/03)
- Demo store state ready for UI components to consume
- BookingCard ready for side panel rendering when book_call tool fires
- Plan 02 (demo UI components) and Plan 03 (orchestrator + integration) can proceed

## Self-Check: PASSED

All 4 created/modified files verified present. All 3 task commits (bb16691, c664a6d, feba797) verified in git log.

---

_Phase: 21-guided-demo-mode_
_Completed: 2026-03-16_
