---
phase: 06-vite-feature-parity
plan: 02
subsystem: ui
tags: [chatbot, demo-playground, multi-platform, pricing, trust-metrics, framer-motion]

requires:
  - phase: 06-01
    provides: shared reusable components (TrustMetrics, PricingTiers, ScrollReveal)
provides:
  - 4-persona DemoPlayground with concierge tab
  - MultiPlatformShowcase architecture diagram component
  - ProgressiveCTA wired to chatbot message store
  - Full chatbots page with pricing tiers and trust metrics sections
affects: [chatbots-page, demo-playground]

tech-stack:
  added: []
  patterns: [dynamic-import-ssr-false, store-driven-progressive-cta]

key-files:
  created:
    - fmai-nextjs/src/components/chatbot/MultiPlatformShowcase.tsx
  modified:
    - fmai-nextjs/src/components/chatbot/DemoPlayground.tsx
    - fmai-nextjs/src/components/chatbot/PersonaSelector.tsx
    - fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'ProgressiveCTA integrated inside DemoPlayground (not page-level) since both share activeTab state and store access'
  - 'MultiPlatformShowcase uses CSS keyframe animations instead of Framer Motion for connection lines (matching Vite approach)'
  - 'Chatbot pricing tiers use EUR 497/997/1997 per month with Starter/Growth/Scale naming'

patterns-established:
  - 'Client island pattern: store-dependent CTAs embedded in client component boundaries'

requirements-completed: [WEB-03]

duration: 7min
completed: 2026-03-20
---

# Phase 6 Plan 2: Chatbot Page Feature Parity Summary

**4-persona DemoPlayground with concierge tab, MultiPlatformShowcase architecture diagram, ProgressiveCTA, pricing tiers, and trust metrics on chatbots page**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-20T20:43:02Z
- **Completed:** 2026-03-20T20:50:29Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Restored 4th persona (concierge) in DemoPlayground and PersonaSelector
- Created MultiPlatformShowcase with animated Claude AI architecture diagram
- Wired ProgressiveCTA with message-count-based progressive CTAs from chatbot store
- Added pricing tiers (3 tiers), trust metrics (3 stats), and multi-platform sections to chatbots page
- Added all translation keys for new sections in EN/NL/ES

## Task Commits

Each task was committed atomically:

1. **Task 1: Restore 4th persona + create MultiPlatformShowcase** - `4ba8af4` (feat) -- absorbed by parallel 06-04 commit due to race condition
2. **Task 2: Wire ProgressiveCTA + add pricing/trust sections** - `221174e` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/chatbot/MultiPlatformShowcase.tsx` - Architecture diagram with CSS-animated connection lines
- `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx` - Added concierge persona + ProgressiveCTA integration
- `fmai-nextjs/src/components/chatbot/PersonaSelector.tsx` - Added concierge to 4-persona array with MessageCircle icon
- `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx` - Added MultiPlatformShowcase, TrustMetrics, PricingTiers sections
- `fmai-nextjs/messages/en.json` - Concierge tab, multi_platform, trust_metrics, pricing translations
- `fmai-nextjs/messages/nl.json` - Dutch translations for new sections
- `fmai-nextjs/messages/es.json` - Spanish translations for new sections

## Decisions Made

- ProgressiveCTA integrated inside DemoPlayground (not page-level) since both share activeTab state and need chatbot store access
- MultiPlatformShowcase uses CSS keyframe animations (brainPulse, expandLine) instead of Framer Motion SVG for connection lines, matching the Vite version approach
- Chatbot pricing set at EUR 497/997/1997 for Starter/Growth/Scale tiers

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added translation keys for new sections**

- **Found during:** Task 1 (concierge persona restoration)
- **Issue:** Translation keys for concierge tab, multi_platform section, and trust_metrics section missing from EN/NL/ES message files
- **Fix:** Added complete translation objects for all three locales
- **Files modified:** fmai-nextjs/messages/en.json, nl.json, es.json
- **Verification:** TypeScript compiles, translation keys referenced correctly
- **Committed in:** 4ba8af4

**2. [Rule 3 - Blocking] ProgressiveCTA requires client-side store access**

- **Found during:** Task 2 (wiring ProgressiveCTA to chatbots page)
- **Issue:** ProgressiveCTA needs messageCount from chatbot store, but chatbots page is a server component
- **Fix:** Embedded ProgressiveCTA inside DemoPlayground (already a client component) instead of page-level placement
- **Verification:** Component renders with store data, no hydration mismatch
- **Committed in:** 221174e

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 blocking)
**Impact on plan:** Both fixes necessary for functionality. No scope creep.

## Issues Encountered

- Task 1 commit absorbed by parallel 06-04 agent commit due to git HEAD race condition during lint-staged execution. Changes are correct and in the tree.
- Pre-existing build errors in ecommerce-tools.ts and support-tools.ts (missing PRODUCT_CATALOG and KB_ARTICLES exports) -- out of scope, not caused by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Chatbots page at full feature parity with Vite version
- All 4 personas functional in DemoPlayground
- Ready for Phase 6 remaining plans (06-03, 06-04)

---

_Phase: 06-vite-feature-parity_
_Completed: 2026-03-20_
