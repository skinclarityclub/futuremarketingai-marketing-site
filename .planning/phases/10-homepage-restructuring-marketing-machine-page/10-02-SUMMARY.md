---
phase: 10-homepage-restructuring-marketing-machine-page
plan: '02'
subsystem: ui
tags: [react, typescript, framer-motion, lazy-loading, routing, landing-page]

# Dependency graph
requires:
  - phase: 10-homepage-restructuring-marketing-machine-page-01
    provides: Homepage restructured as FutureAI hub, VisionTimeline/FeatureShowcase removed from homepage

provides:
  - /marketing-machine page with VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof
  - Route and marketingPaths entry in App.tsx for /marketing-machine
  - Dedicated FutureMarketingAI service page following Living System design tokens

affects:
  - SimpleHeader branding (shows FutureMarketingAI on /marketing-machine — handled in plan 03)
  - LandingFooter (rendered on /marketing-machine via marketingPaths)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Lazy-loaded page assembled from existing relocated components (VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof)
    - Pricing teaser with 3 founding-member tiers matching service page pattern

key-files:
  created:
    - src/pages/MarketingMachinePage.tsx
  modified:
    - src/App.tsx

key-decisions:
  - 'MarketingMachinePage uses lazy imports for all heavy section components (VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof) with Loader2 Suspense fallback'
  - 'All content hardcoded EN — matches existing service page pattern (AutomationsPage, ChatbotsPage, VoiceAgentsPage); i18n for service pages is a known gap not in scope'
  - 'Pricing teaser links to /pricing rather than embedding full pricing logic — consistent with Plan 01 service cards pattern'

patterns-established:
  - 'Service page with lazy-loaded component sections: wrap each in <Suspense fallback={<LoadingSection />}>'
  - 'Section header wrapping: add section/div with motion.div for badge + title + subtitle before lazy-loaded component when needed'

requirements-completed:
  - REQ-HOMEPAGE-RESTRUCTURE

# Metrics
duration: 4min
completed: '2026-03-13'
---

# Phase 10 Plan 02: Marketing Machine Page Summary

**Dedicated /marketing-machine page assembling VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof with hero, pricing teaser, and Calendly CTA — route registered in App.tsx**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-13T02:23:20Z
- **Completed:** 2026-03-13T02:27:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `src/pages/MarketingMachinePage.tsx` with outcome-focused hero ("160 Posts/Month. Zero Manual Work."), SocialProof, VisionTimeline, FeatureShowcase, FeaturesSection, pricing teaser (3 founding-member tiers), and final Calendly CTA
- Added lazy import, marketingPaths entry, and Route for `/marketing-machine` in App.tsx
- Build passes cleanly — 5314 modules, no TypeScript errors, no lint errors

## Task Commits

1. **Task 1: Create MarketingMachinePage.tsx** - `6d41b2f` (feat)
2. **Task 2: Add /marketing-machine route and marketingPaths entry** - `69f74c7` (feat)

## Files Created/Modified

- `src/pages/MarketingMachinePage.tsx` — New dedicated FutureMarketingAI page with all relocated marketing content
- `src/App.tsx` — Lazy import, marketingPaths array entry, Route element for /marketing-machine

## Decisions Made

- Pricing teaser links to /pricing rather than duplicating full pricing component — simpler, avoids duplication, consistent with homepage service cards pattern
- Section header wrapper added before `<FeatureShowcase />` to provide badge + title + subtitle context (the component itself doesn't include a section header)
- All content hardcoded EN — matches existing service page pattern; i18n is a known gap for service pages

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused React import**

- **Found during:** Task 1 (TypeScript verification)
- **Issue:** `import React` was unused — TypeScript reported TS6133 error
- **Fix:** Changed `import React, { lazy, Suspense }` to `import { lazy, Suspense }` (React 17+ JSX transform doesn't require React in scope)
- **Files modified:** src/pages/MarketingMachinePage.tsx
- **Verification:** `npx tsc --noEmit` passes cleanly
- **Committed in:** 6d41b2f (Task 1 commit, after ESLint/Prettier pre-commit hook)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug)
**Impact on plan:** Minor import fix required for TypeScript correctness. No scope creep.

## Issues Encountered

None — both tasks executed cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /marketing-machine page is live and routable
- LandingFooter renders on the page (marketingPaths entry)
- FloatingNav does NOT show on the page (isMarketingRoute = true)
- Plan 03 should update SimpleHeader brandMiddle logic to show "FutureMarketingAI" on /marketing-machine (currently shows "FutureAI")

---

_Phase: 10-homepage-restructuring-marketing-machine-page_
_Completed: 2026-03-13_
