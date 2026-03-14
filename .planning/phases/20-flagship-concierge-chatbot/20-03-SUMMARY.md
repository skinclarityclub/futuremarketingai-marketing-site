---
phase: 20-flagship-concierge-chatbot
plan: 03
subsystem: chatbot
tags: [react-hooks, zustand, context-awareness, i18n, tool-filtering]

requires:
  - phase: 20-flagship-concierge-chatbot-02
    provides: SidePanel, NavigationButton, flagship persona UI components
provides:
  - useConciergeContext hook with page-aware greetings, prompts, and journey tracking
  - chatbotStore visitedPages and toolsUsed tracking (persisted)
  - Engine filterToolsByContext reducing flagship tools by page context
  - App.tsx flagship persona wiring for all marketing pages
  - Complete chatbot barrel exports including SidePanel and NavigationButton
affects: []

tech-stack:
  added: []
  patterns:
    - 'useConciergeContext hook provides page-specific behavior for flagship persona'
    - 'PAGE_GREETINGS/PAGE_PROMPTS records map path -> lang -> content for i18n context'
    - 'filterToolsByContext uses ALWAYS_AVAILABLE + PAGE_TOOLS pattern for tool reduction'

key-files:
  created:
    - src/hooks/useConciergeContext.ts
  modified:
    - src/stores/chatbotStore.ts
    - src/lib/chatbot/engine.ts
    - src/hooks/usePersonaChat.ts
    - src/App.tsx
    - src/components/chatbot/index.ts

key-decisions:
  - 'usePersonaChat maps pathname to currentPage for server-side context matching'
  - 'FOLLOW_UP_PROMPTS activate after 3+ flagship messages to guide toward conversion'
  - 'filterToolsByContext has safety fallback returning all tools if filtering yields empty set'

patterns-established:
  - 'Context-awareness via hook: useConciergeContext provides page-specific greetings (EN/NL/ES), contextual suggested prompts, and journey tracking'
  - 'Tool filtering pattern: ALWAYS_AVAILABLE + PAGE_TOOLS per-path reduces prompt size from ~17 to ~6-8 tools'

requirements-completed: [REQ-ARIA-REVIVAL, REQ-CONTEXT-AWARENESS, REQ-FLAGSHIP-WIRING]

duration: 12min
completed: 2026-03-14
---

# Phase 20 Plan 03: Flagship Wiring + Context-Awareness Summary

**useConciergeContext hook with page-aware greetings (EN/NL/ES), journey tracking, engine tool filtering, and App.tsx flagship persona wiring**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-14T01:30:14Z
- **Completed:** 2026-03-14T01:42:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Context-aware concierge provides page-specific welcome messages and suggested prompts in EN/NL/ES across 8 page paths
- Engine filters flagship tools from ~17 to ~6-8 per request based on current page, reducing prompt size
- Floating chatbot switched from concierge to flagship persona on all marketing pages
- Journey tracking (visitedPages, toolsUsed) persisted in chatbotStore for personalized interactions
- Fixed pathname-to-currentPage mapping in usePersonaChat for correct server-side context matching

## Task Commits

Each task was committed atomically:

1. **Task 1: Context-awareness hook + chatbotStore tracking + engine tool filtering** - `47a58c5` (feat)
2. **Task 2: App.tsx flagship wiring + barrel exports** - `e743b6c` (feat)

## Files Created/Modified

- `src/hooks/useConciergeContext.ts` - Page-aware context hook with greetings, prompts, and journey tracking
- `src/stores/chatbotStore.ts` - Added visitedPages and toolsUsed tracking arrays with persistence
- `src/lib/chatbot/engine.ts` - filterToolsByContext for flagship persona tool reduction by page
- `src/hooks/usePersonaChat.ts` - Fixed context mapping (pathname -> currentPage)
- `src/App.tsx` - Switched floating chatbot to flagship persona with hook-driven props
- `src/components/chatbot/index.ts` - Added SidePanel and NavigationButton barrel exports

## Decisions Made

- usePersonaChat maps `{ pathname }` to `{ currentPage }` for server-side context matching (Rule 1 bug fix -- client and server used different key names)
- Follow-up prompts activate after 3+ flagship messages to guide users toward conversion actions
- filterToolsByContext returns all tools as safety fallback if filtering yields empty set

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pathname-to-currentPage context key mismatch**

- **Found during:** Task 1 (engine tool filtering)
- **Issue:** usePersonaChat sent `{ pathname }` but engine/ChatRequest expected `{ currentPage }` -- context filtering would never match
- **Fix:** Updated usePersonaChat to map `pageContext.pathname` to `context.currentPage`
- **Files modified:** src/hooks/usePersonaChat.ts
- **Verification:** TypeScript compiles, context key matches ChatRequest type
- **Committed in:** 47a58c5 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for context-aware tool filtering to work. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 20 is now complete -- the flagship concierge chatbot is fully wired with context-awareness, all tools, side panel, navigation buttons, and page-specific behavior
- All demo/embedded persona behavior on /chatbots and demo pages remains unchanged
- Full production build passes cleanly

---

_Phase: 20-flagship-concierge-chatbot_
_Completed: 2026-03-14_
