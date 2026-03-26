---
phase: 03-interactive-features
plan: 03
subsystem: ui
tags: [chatbot, demo-playground, persona-selector, calendly, cookie-consent, zustand, motion-react]

requires:
  - phase: 03-interactive-features/02
    provides: ChatWidget, chatbotStore, usePersonaChat, chatbot engine, all chatbot UI components
  - phase: 03-interactive-features/01
    provides: CalendlyModal, CookieConsentBanner, motion wrappers, Providers
provides:
  - 3-persona demo playground (ecommerce, leadgen, support) with embedded ChatWidget per persona
  - DemoOrchestrator state machine with scenario selection, progression, checkpoints, completion
  - Calendly booking hook (useCalendlyBooking) with prefill support
  - DemoPlayground client island embedded in Chatbots server page
affects: [chatbot-features, booking-flow, services-pages]

tech-stack:
  added: []
  patterns: [indexed-translation-keys-for-capabilities, client-island-in-server-page]

key-files:
  created:
    - fmai-nextjs/src/components/chatbot/DemoPlayground.tsx
    - fmai-nextjs/src/components/chatbot/PersonaSelector.tsx
    - fmai-nextjs/src/components/chatbot/DemoContextCard.tsx
    - fmai-nextjs/src/components/chatbot/demo/DemoOrchestrator.tsx
    - fmai-nextjs/src/components/chatbot/demo/DemoProgress.tsx
    - fmai-nextjs/src/components/chatbot/demo/DemoScenarioCard.tsx
    - fmai-nextjs/src/components/chatbot/demo/DemoCheckpoint.tsx
    - fmai-nextjs/src/components/chatbot/demo/DemoCompletionCard.tsx
    - fmai-nextjs/src/components/chatbot/demo/scenarios.ts
    - fmai-nextjs/src/hooks/useCalendlyBooking.ts
    - fmai-nextjs/src/config/calendlyConfig.ts
  modified:
    - fmai-nextjs/src/stores/chatbotStore.ts
    - fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json

key-decisions:
  - '3 personas (ecommerce, leadgen, support) instead of 4 -- concierge excluded from playground since it serves as the main floating chatbot'
  - 'Indexed translation keys (capabilities_0..capabilities_3) for next-intl compatibility instead of returnObjects'
  - 'DemoPlayground manages its own state (no props) -- self-contained client island'
  - 'Extended chatbotStore with DemoStatus type, demoStartedAt, selectScenario, advanceStep, setDemoStatus, endDemo'

patterns-established:
  - 'Indexed keys for array-like translations: capabilities_0, capabilities_1, etc.'
  - 'Self-contained client island pattern: component manages all internal state, no props from server'

requirements-completed: [INT-03, INT-04, INT-08, INT-09]

duration: 7min
completed: 2026-03-18
---

# Phase 3 Plan 3: Demo Playground and Booking Integration Summary

**3-persona demo playground with DemoOrchestrator state machine, Calendly booking hook, and DemoPlayground embedded as client island in Chatbots server page**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-18T04:25:30Z
- **Completed:** 2026-03-18T04:32:53Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments

- DemoPlayground with 3 persona tabs (ecommerce, leadgen, support) each with embedded ChatWidget
- DemoOrchestrator state machine with 3 scenarios (new-client, ecommerce, support), progression controls, checkpoints, completion card
- Calendly booking integration with useCalendlyBooking hook and calendlyConfig
- DemoPlayground embedded as client island in server-rendered Chatbots page
- Cookie consent verified in layout (INT-09 satisfied from Plan 01)

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate demo playground, persona selector, and demo mode components** - `5fef2f0` (feat)
2. **Task 2: Calendly booking hook, DemoPlayground in Chatbots page, cookie consent verified** - `3656d48` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx` - 3-persona playground with selector and embedded ChatWidget
- `fmai-nextjs/src/components/chatbot/PersonaSelector.tsx` - Tab selector for ecommerce/leadgen/support personas
- `fmai-nextjs/src/components/chatbot/DemoContextCard.tsx` - Context card showing persona capabilities
- `fmai-nextjs/src/components/chatbot/demo/DemoOrchestrator.tsx` - State machine for guided demo mode
- `fmai-nextjs/src/components/chatbot/demo/DemoProgress.tsx` - Step progress indicator
- `fmai-nextjs/src/components/chatbot/demo/DemoScenarioCard.tsx` - Scenario selection cards
- `fmai-nextjs/src/components/chatbot/demo/DemoCheckpoint.tsx` - Checkpoint UI between demo steps
- `fmai-nextjs/src/components/chatbot/demo/DemoCompletionCard.tsx` - Demo completion with booking CTA
- `fmai-nextjs/src/components/chatbot/demo/scenarios.ts` - Pure data: 3 scenario definitions with steps and checkpoints
- `fmai-nextjs/src/hooks/useCalendlyBooking.ts` - Hook for Calendly modal state with prefill
- `fmai-nextjs/src/config/calendlyConfig.ts` - Calendly URL config with env var support
- `fmai-nextjs/src/stores/chatbotStore.ts` - Extended with DemoStatus, demoStartedAt, selectScenario, advanceStep, setDemoStatus, endDemo
- `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx` - Replaced demo placeholder with live DemoPlayground
- `fmai-nextjs/messages/en.json` - Added demo tab/capability/scenario translations
- `fmai-nextjs/messages/nl.json` - Added Dutch demo tab/capability/scenario translations

## Decisions Made

- 3 personas in playground (ecommerce, leadgen, support) -- concierge excluded since it is the main floating chatbot
- Indexed translation keys (capabilities_0..capabilities_3) for next-intl compatibility instead of returnObjects
- DemoPlayground is self-contained (manages own state, no props from server page)
- Extended chatbotStore with full DemoStatus type and orchestration actions for DemoOrchestrator

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added demo translation keys for persona tabs and capabilities**

- **Found during:** Task 1
- **Issue:** Plan assumed translation keys existed; chatbots.demo only had title and placeholder
- **Fix:** Added full tab labels, scenario titles, scenario descriptions, and indexed capabilities for all 3 personas in en.json and nl.json
- **Files modified:** fmai-nextjs/messages/en.json, fmai-nextjs/messages/nl.json
- **Verification:** Build passes, all translation keys resolve
- **Committed in:** 5fef2f0 (Task 1 commit)

**2. [Rule 2 - Missing Critical] Extended chatbotStore with demo orchestration state**

- **Found during:** Task 1
- **Issue:** chatbotStore lacked demoStatus, demoStartedAt, selectScenario, advanceStep, setDemoStatus, endDemo required by DemoOrchestrator
- **Fix:** Added DemoStatus type and all missing state fields and actions to chatbotStore
- **Files modified:** fmai-nextjs/src/stores/chatbotStore.ts
- **Verification:** Build passes, DemoOrchestrator compiles with store imports
- **Committed in:** 5fef2f0 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 missing critical)
**Impact on plan:** Both auto-fixes were essential for the demo components to function. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Phase 3 interactive features complete
- Demo playground, guided demo mode, Calendly booking, and cookie consent all functional
- Ready for Phase 4 (SEO/Performance) or Phase 5 (Content) planning

---

_Phase: 03-interactive-features_
_Completed: 2026-03-18_

## Self-Check: PASSED

All 11 created files verified present. Both task commits (5fef2f0, 3656d48) verified in git log.
