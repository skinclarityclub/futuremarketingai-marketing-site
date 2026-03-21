---
phase: 09-codebase-cleanup
plan: 02
subsystem: chatbot, routing
tags: [persona, chatbot, cleanup, redirects, nextjs]

requires:
  - phase: 08-clyde-chatbot-personality
    provides: Clyde persona unification
  - phase: 09-codebase-cleanup (plan 01)
    provides: Vite legacy code deletion
provides:
  - Working DemoPlayground with all 4 tabs using Clyde persona
  - Clean persona system with only clyde.ts (6 orphaned persona files removed)
  - Permanent redirects from old /services routes to /skills routes
  - Updated navigation tools using /skills/* routes
affects: [chatbot, navigation, seo]

tech-stack:
  added: []
  patterns:
    - "Clyde-only persona routing: all persona IDs fall back to clyde"
    - "Flagship tools as unified aggregator for all tool definitions"

key-files:
  created: []
  modified:
    - fmai-nextjs/src/components/chatbot/DemoPlayground.tsx
    - fmai-nextjs/src/components/chatbot/ChatWidget.tsx
    - fmai-nextjs/src/lib/chatbot/engine.ts
    - fmai-nextjs/src/lib/chatbot/tool-executor.ts
    - fmai-nextjs/src/lib/chatbot/tools/flagship-tools.ts
    - fmai-nextjs/src/lib/chatbot/tools/concierge-tools.ts
    - fmai-nextjs/next.config.ts

key-decisions:
  - "DemoPlayground sends personaId='clyde' for all 4 tabs (tabs keep distinct display names and welcome messages)"
  - "Engine falls back to clyde for unknown persona IDs (graceful degradation, no 404)"
  - "Kept knowledge base and tool files (still used by flagship-kb aggregator which feeds Clyde)"
  - "Updated navigation tools to use /skills/* routes instead of old /services routes"
  - "ChatWidget treats clyde as flagship-equivalent for side panel and badge features"

patterns-established:
  - "Persona graceful fallback: unknown persona IDs silently fall back to clyde"

requirements-completed: [WEB-01]

duration: 7min
completed: 2026-03-21
---

# Phase 09 Plan 02: Persona Fix and Orphaned Pages Summary

**Fixed DemoPlayground persona crash by routing all tabs through Clyde, deleted orphaned service pages, updated navigation tools to /skills/* routes**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-21T19:13:24Z
- **Completed:** 2026-03-21T19:20:43Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- DemoPlayground no longer crashes on tab switch -- all 4 tabs send personaId='clyde'
- Engine gracefully falls back to Clyde for any unknown persona ID
- tool-executor cleaned up: only maps 'clyde' and 'flagship' (backward compat)
- Orphaned (services) pages confirmed deleted (done in 09-01), redirects updated to correct skills routes
- Navigation tools updated from old /chatbots, /automations etc. to /skills/chatbot, /skills/ad-creator etc.
- Dead filterToolsByContext function and unused type removed from engine.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix DemoPlayground persona crash and delete orphaned persona files** - `87f95e1` (fix)
2. **Task 2: Handle orphaned (services) pages** - `cf1e8a9` (fix)

## Files Created/Modified
- `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx` - Changed personaId from tab-specific to 'clyde'
- `fmai-nextjs/src/components/chatbot/ChatWidget.tsx` - Added 'clyde' to isFlagship check
- `fmai-nextjs/src/lib/chatbot/engine.ts` - Graceful fallback to clyde, removed dead code
- `fmai-nextjs/src/lib/chatbot/tool-executor.ts` - Simplified to clyde+flagship mapping only
- `fmai-nextjs/src/lib/chatbot/tools/flagship-tools.ts` - Updated navigate_to_page to /skills/* routes
- `fmai-nextjs/src/lib/chatbot/tools/concierge-tools.ts` - Updated routes to /skills/* paths
- `fmai-nextjs/next.config.ts` - Updated redirect destinations to match actual skills routes
- `fmai-nextjs/src/lib/chatbot/knowledge/*.ts` - Restored 5 KB files (needed by flagship-kb aggregator)
- `fmai-nextjs/src/lib/chatbot/tools/*-tools.ts` - Restored 5 tool files (needed by flagship-tools aggregator)

## Decisions Made
- DemoPlayground sends personaId='clyde' for all 4 tabs: tabs keep distinct display names, welcome messages, and starter prompts but all route through the single Clyde persona
- Engine falls back to clyde for unknown persona IDs: graceful degradation instead of 404 error
- Knowledge base and tool files restored: they were deleted in 09-01 but are still transitively needed by flagship-kb and flagship-tools which feed Clyde
- Redirect destinations updated: /chatbots -> /skills/chatbot (was /skills/lead-qualifier), /automations -> /skills/ad-creator (was /skills/content-creator)
- ChatWidget now treats personaId 'clyde' as flagship-equivalent for side panel and badge display

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored knowledge base and tool files deleted in previous phase**
- **Found during:** Task 1 (TypeScript compilation after deleting persona files)
- **Issue:** flagship-kb.ts and flagship-tools.ts import from the 5 per-persona knowledge and tool files. Deleting them broke the build.
- **Fix:** Restored the 10 files (5 KB + 5 tool) from git history since they are still transitively needed by the flagship aggregator that Clyde uses.
- **Files modified:** 10 files in knowledge/ and tools/ directories
- **Verification:** TypeScript compiles clean
- **Committed in:** 87f95e1 (Task 1 commit)

**2. [Rule 1 - Bug] Updated navigate_to_page tool enums to use /skills/* routes**
- **Found during:** Task 2 (checking for stale route references)
- **Issue:** flagship-tools.ts and concierge-tools.ts still had /chatbots, /automations etc. in their navigate_to_page tool enum. These old routes now redirect, causing unnecessary round-trips.
- **Fix:** Updated both files to use /skills/chatbot, /skills/content-creator, etc.
- **Files modified:** flagship-tools.ts, concierge-tools.ts
- **Verification:** TypeScript compiles clean, build succeeds
- **Committed in:** cf1e8a9 (Task 2 commit)

**3. [Rule 1 - Bug] Removed dead filterToolsByContext and unused types from engine.ts**
- **Found during:** Task 1 (engine cleanup)
- **Issue:** filterToolsByContext was dead code (noted in 08-02 decisions) referencing old service routes. AnyToolRecord type unused after removing it.
- **Fix:** Deleted function, type, and constant definitions
- **Files modified:** engine.ts
- **Committed in:** 87f95e1 (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (2 bug fixes, 1 blocking)
**Impact on plan:** All auto-fixes necessary for correctness. No scope creep.

## Issues Encountered
- Service pages were already deleted in 09-01 commit. The `git rm` in Task 2 was a no-op. Redirects already existed in next.config.ts but pointed to wrong skill pages -- updated to match plan.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Chatbot system clean: single Clyde persona, all tools available, graceful fallback
- No orphaned pages or broken navigation
- Ready for 09-03 (contact form email + analytics)

---
*Phase: 09-codebase-cleanup*
*Completed: 2026-03-21*
