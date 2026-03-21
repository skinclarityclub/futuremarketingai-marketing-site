---
phase: 08-clyde-chatbot-personality
plan: 01
subsystem: chatbot
tags: [chatbot, persona, clyde, prompt-engineering, context-awareness]

requires:
  - phase: 07-website-copy-overhaul
    provides: Clyde messaging and branding across all pages
provides:
  - Unified Clyde persona replacing 6 separate personas
  - Page-context-aware system prompt injection for 11 routes
  - Single persona registry entry (clyde) with all 17 tools
affects: [08-02, chatbot-widget, demo-playground]

tech-stack:
  added: []
  patterns: [single-persona-with-context-injection, page-context-hints-map]

key-files:
  created:
    - fmai-nextjs/src/lib/chatbot/personas/clyde.ts
  modified:
    - fmai-nextjs/src/lib/chatbot/personas/index.ts
    - fmai-nextjs/src/lib/chatbot/index.ts
    - fmai-nextjs/src/stores/chatbotStore.ts
    - fmai-nextjs/src/lib/chatbot/prompt-builder.ts
    - fmai-nextjs/src/components/chatbot/DemoPlayground.tsx

key-decisions:
  - 'Reused FLAGSHIP_TOPICS knowledge base for Clyde (covers all topics already)'
  - 'maxTokens 300 (between flagship 250 and concierge 500) per design doc'
  - 'PAGE_CONTEXT_HINTS as module-level const outside buildSystemMessages function'
  - 'DemoPlayground updated to use CLYDE_STARTERS for all 4 demo persona tabs'

patterns-established:
  - 'Single persona pattern: one persona file with context injection replaces N separate personas'
  - 'Page context hints: Record<string, string> map at module level for route-based behavior adaptation'

requirements-completed: [WEB-01]

duration: 3min
completed: 2026-03-21
---

# Phase 8 Plan 1: Unified Clyde Persona Summary

**Unified Clyde persona with design-doc system prompt, all 17 tools, maxTokens 300, and page-context-aware prompt injection for 11 routes**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-21T00:05:50Z
- **Completed:** 2026-03-21T00:09:09Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Created unified Clyde persona with exact design-doc system prompt (identity, tone, behavior, restrictions)
- Replaced 6-persona registration with single Clyde persona carrying all 17 tools
- Added PAGE_CONTEXT_HINTS injecting page-specific behavior into system prompts for 11 routes
- Changed chatbotStore default from 'concierge' to 'clyde'

## Task Commits

Each task was committed atomically:

1. **Task 1: Create unified Clyde persona and update persona index** - `98f2b0c` (feat)
2. **Task 2: Update chatbot store default and prompt-builder context** - `9584444` (feat)

## Files Created/Modified

- `fmai-nextjs/src/lib/chatbot/personas/clyde.ts` - Unified Clyde persona with system prompt, 17 tools, temp 0.7, maxTokens 300
- `fmai-nextjs/src/lib/chatbot/personas/index.ts` - Single Clyde import replacing 6 persona imports
- `fmai-nextjs/src/lib/chatbot/index.ts` - Updated barrel exports for Clyde
- `fmai-nextjs/src/stores/chatbotStore.ts` - Default persona changed to 'clyde'
- `fmai-nextjs/src/lib/chatbot/prompt-builder.ts` - PAGE_CONTEXT_HINTS map + pageHint injection
- `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx` - Updated to use CLYDE_STARTERS

## Decisions Made

- Reused FLAGSHIP_TOPICS knowledge base for Clyde since it already covers all topics
- Set maxTokens to 300 per design doc (between flagship 250 and concierge 500)
- Placed PAGE_CONTEXT_HINTS as module-level const for clarity and reusability
- Updated DemoPlayground to use CLYDE_STARTERS for all 4 demo tabs (was blocking import)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed barrel export and DemoPlayground imports**

- **Found during:** Task 1 (persona index rewrite)
- **Issue:** chatbot/index.ts re-exported old persona names; DemoPlayground imported ECOMMERCE/LEADGEN/SUPPORT/CONCIERGE_STARTERS
- **Fix:** Updated chatbot/index.ts to export clydePersona/CLYDE_STARTERS; updated DemoPlayground to use CLYDE_STARTERS for all tabs
- **Files modified:** fmai-nextjs/src/lib/chatbot/index.ts, fmai-nextjs/src/components/chatbot/DemoPlayground.tsx
- **Verification:** npx tsc --noEmit passes with zero errors
- **Committed in:** 98f2b0c (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary for TypeScript compilation. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Clyde persona registered and loadable via getPersona('clyde')
- Ready for 08-02: ChatWidget header branding, context-aware welcome messages, suggested prompts
- Old persona files (concierge.ts, flagship.ts, etc.) still exist but are no longer imported

---

_Phase: 08-clyde-chatbot-personality_
_Completed: 2026-03-21_
