---
phase: 01-foundation-and-infrastructure
plan: 03
subsystem: state-management
tags: [zustand, persist, hydration, ssr, client-islands, skipHydration]

requires:
  - phase: 01-01
    provides: 'Next.js 16 scaffold with App Router and locale layout'
provides:
  - 'Hydration-safe Zustand persist stores (chatbot, userPreferences, personalization)'
  - 'StoreProvider with delayed rehydration pattern'
  - 'Composable Providers wrapper for layout'
  - 'Documented server/client boundary example component'
  - 'ICP scoring stub for personalization dependency'
affects: [02-page-migration, chatbot, personalization, icp-calculator]

tech-stack:
  added: []
  patterns:
    [
      skipHydration-persist,
      delayed-rehydrate-in-useEffect,
      client-island-pattern,
      composable-provider-tree,
    ]

key-files:
  created:
    - fmai-nextjs/src/stores/chatbotStore.ts
    - fmai-nextjs/src/stores/userPreferencesStore.ts
    - fmai-nextjs/src/stores/personalizationStore.ts
    - fmai-nextjs/src/utils/icpScoring.ts
    - fmai-nextjs/src/components/providers/StoreProvider.tsx
    - fmai-nextjs/src/components/providers/Providers.tsx
    - fmai-nextjs/src/components/examples/ServerClientExample.tsx
  modified:
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/src/app/[locale]/page.tsx

key-decisions:
  - 'IndustrySelection interface in personalizationStore replaces component-level Industry import (decouples store from UI component)'
  - 'ICP scoring is a stub -- real implementation deferred to later phase migration'
  - 'Providers wrapper pattern for future provider additions (analytics, cookie consent)'

patterns-established:
  - 'skipHydration: true on all Zustand persist stores for SSR safety'
  - 'StoreProvider rehydrates all stores in a single useEffect after initial render'
  - 'Client islands: "use client" components imported by Server Component pages'
  - 'JSDoc documentation on client components explaining why "use client" is needed'

requirements-completed: [INT-06]

duration: 5min
completed: 2026-03-18
---

# Phase 1 Plan 3: Zustand Stores and Server/Client Boundary Summary

**3 Zustand persist stores with skipHydration pattern, StoreProvider delayed rehydration, and documented client island example for server/client boundary**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T02:02:21Z
- **Completed:** 2026-03-18T02:07:24Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- All 3 Zustand stores migrated with skipHydration: true to prevent hydration mismatches
- StoreProvider rehydrates all stores in a single useEffect, ensuring localStorage values only apply after first client render
- ServerClientExample component with comprehensive JSDoc documenting the client island pattern for all future development

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Zustand stores with hydration-safe persist and create provider tree** - `dce19c9` (feat)
2. **Task 2: Create documented server/client boundary pattern with working example** - `b98cd6f` (feat)

## Files Created/Modified

- `fmai-nextjs/src/stores/chatbotStore.ts` - Chatbot state with skipHydration persist (session, persona, demo mode)
- `fmai-nextjs/src/stores/userPreferencesStore.ts` - User preferences with skipHydration persist (personalization level, privacy, GDPR consent)
- `fmai-nextjs/src/stores/personalizationStore.ts` - Personalization state with skipHydration persist (industry, journey tracking, ICP score)
- `fmai-nextjs/src/utils/icpScoring.ts` - ICP scoring stub (placeholder for later migration)
- `fmai-nextjs/src/components/providers/StoreProvider.tsx` - Client provider that rehydrates all stores after initial render
- `fmai-nextjs/src/components/providers/Providers.tsx` - Composable provider wrapper for layout
- `fmai-nextjs/src/components/examples/ServerClientExample.tsx` - Interactive example with JSDoc boundary documentation
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Updated to wrap children with Providers
- `fmai-nextjs/src/app/[locale]/page.tsx` - Added TSDoc and ServerClientExample import

## Decisions Made

- **IndustrySelection over Industry component import:** The original personalizationStore imported Industry from `../components`. Created a standalone IndustrySelection interface in the store to decouple state management from UI components.
- **ICP scoring stub:** The real icpScoring module has complex scoring logic. Created a stub that returns a default mid-range score. Real implementation deferred to the phase that migrates the calculator.
- **Providers wrapper:** Created a Providers component that wraps StoreProvider. This allows future providers (analytics, cookie consent, etc.) to be added without modifying the layout.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created IndustrySelection interface instead of importing Industry from components**

- **Found during:** Task 1 (personalizationStore migration)
- **Issue:** Original store imported `Industry` from `../components` which is a Vite-codebase component. The interface includes UI-specific fields (icon, color).
- **Fix:** Created IndustrySelection interface directly in the store file with the same shape as the original Industry interface.
- **Files modified:** fmai-nextjs/src/stores/personalizationStore.ts
- **Verification:** `npm run build` passes without errors
- **Committed in:** dce19c9 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to avoid cross-codebase imports. No scope creep.

## Issues Encountered

None -- both tasks completed without build or runtime errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 3 stores are ready for use by migrated page components
- Provider tree is in place and composable for future additions
- Server/client boundary pattern documented and demonstrated on homepage
- ICP scoring stub will need replacement when calculator component migrates

## Self-Check: PASSED

- All 9 files verified on disk
- Both task commits verified: dce19c9, b98cd6f
- Build passes: `npm run build` completes without errors

---

_Phase: 01-foundation-and-infrastructure_
_Completed: 2026-03-18_
