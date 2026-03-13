---
phase: 19-homepage-concierge-demo-guide
plan: 02
subsystem: ui
tags: [aria-cleanup, dead-code-removal, i18n, react, typescript]

requires:
  - phase: 19-homepage-concierge-demo-guide-01
    provides: ChatWidget floating mode wired into App.tsx replacing AIJourneyAssistant
provides:
  - Complete removal of legacy ARIA chatbot system (50+ files deleted)
  - Clean barrel exports without ARIA references
  - Refactored useCalendlyBooking without journeyStore dependency
  - Refactored StrategicCTA without FloatingElementContext dependency
  - Clean i18n config without ai-assistant namespace
affects: []

tech-stack:
  added: []
  patterns:
    - 'Hardcoded journey defaults in useCalendlyBooking replacing journeyStore dependency'

key-files:
  created: []
  modified:
    - src/hooks/useCalendlyBooking.ts
    - src/components/common/StrategicCTA.tsx
    - src/pages/Explorer.tsx
    - src/App.tsx
    - src/components/index.ts
    - src/hooks/index.ts
    - src/i18n/config.ts

key-decisions:
  - 'useCalendlyBooking uses hardcoded journey defaults (completedSteps: 0, timeOnSite: 0) instead of journeyStore'
  - 'StrategicCTA floating variant coordination logic removed entirely (no chatbotStore replacement needed)'

patterns-established:
  - 'No ARIA code remains in codebase -- all chatbot functionality is persona-driven via chatbot engine'

requirements-completed: [REQ-ARIA-CLEANUP]

duration: 8min
completed: 2026-03-13
---

# Phase 19 Plan 02: ARIA Cleanup Summary

**Complete removal of legacy ARIA chatbot system -- 53 files deleted (12,169 lines), zero dead imports, clean build**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-13T22:13:13Z
- **Completed:** 2026-03-13T22:21:02Z
- **Tasks:** 2
- **Files modified:** 53 (7 modified, 46 deleted)

## Accomplishments

- Refactored 4 shared dependencies (useCalendlyBooking, Explorer, StrategicCTA, App.tsx) to remove ARIA imports before deletion
- Deleted entire src/components/ai-assistant/ directory (26 files), 3 hooks, 2 stores, 5 utils, 1 service, 5 configs, 1 API endpoint, 1 context, 3 locale files
- Cleaned barrel exports in components/index.ts, hooks/index.ts, and removed ai-assistant i18n namespace
- Verified zero TypeScript errors and successful Vite build after all deletions

## Task Commits

Each task was committed atomically:

1. **Task 1: Refactor shared dependencies before deletion** - `b470962` (refactor)
2. **Task 2: Delete all ARIA files, clean barrels, clean i18n** - `f25f1e6` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified

- `src/hooks/useCalendlyBooking.ts` - Removed journeyStore import, hardcoded journey defaults
- `src/pages/Explorer.tsx` - Removed useModuleFollowUp import and call
- `src/components/common/StrategicCTA.tsx` - Removed FloatingElementContext dependency and coordination logic
- `src/App.tsx` - Removed FloatingElementProvider wrapper
- `src/components/index.ts` - Removed AIJourneyAssistant and ai-assistant barrel exports
- `src/hooks/index.ts` - Removed useModuleFollowUp, useAchievementTracking, useJourneyNudges exports
- `src/i18n/config.ts` - Removed ai-assistant namespace from ns array
- 46 files deleted (see commit f25f1e6 for full list)

## Decisions Made

- useCalendlyBooking uses hardcoded journey defaults (completedSteps: 0, timeOnSite: 0) instead of journeyStore -- the journey-aware event type selection now relies only on personalizationStore data (viewedModules, calculatorInputs)
- StrategicCTA floating variant simply removed all coordination logic rather than replacing with chatbotStore -- the CTA can show independently of chat panel state
- openai package was already absent from package.json (no uninstall needed)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All ARIA code fully removed from codebase
- New persona-driven chatbot (from Phases 15-18) is the sole chat system
- ChatWidget floating mode (from Plan 01) works cleanly without ARIA interference
- Phase 19 complete -- ready for milestone completion or next phase

---

_Phase: 19-homepage-concierge-demo-guide_
_Completed: 2026-03-13_
