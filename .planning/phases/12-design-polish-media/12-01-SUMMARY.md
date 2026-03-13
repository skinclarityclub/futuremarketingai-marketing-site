---
phase: 12-design-polish-media
plan: 01
subsystem: ui
tags: [spline, 3d, framer-motion, scroll-animation, reduced-motion, parallax, react]

requires:
  - phase: 11-living-system-full-rebuild
    provides: OrbitVisual component, useReducedMotion hooks, design tokens
provides:
  - SplineHero lazy-loaded 3D wrapper with OrbitVisual fallback
  - ScrollReveal reusable scroll-triggered animation wrapper
  - ProductMedia video/poster with reduced-motion support
  - useTilt mouse-tracking card parallax hook
affects: [12-02, 12-03]

tech-stack:
  added: ['@splinetool/react-spline@4.1.0', '@splinetool/runtime@1.12.69']
  patterns:
    [
      'Suspense + lazy for heavy 3D runtime',
      'useMotionSafe wrapper for scroll animations',
      'useReducedMotion for media fallback',
    ]

key-files:
  created:
    - src/components/common/SplineHero.tsx
    - src/components/common/ScrollReveal.tsx
    - src/components/common/ProductMedia.tsx
    - src/hooks/useTilt.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - 'SplineHero uses React.lazy + Suspense with OrbitVisual fallback — zero JS cost until Spline runtime loads'
  - 'ScrollReveal delegates reduced-motion to useMotionSafe — returns empty props when motion disabled'
  - 'useTilt is caller-guarded — hook returns values unconditionally, callers apply desktop-only check'

patterns-established:
  - 'Suspense fallback pattern: heavy 3D wrapped in lazy() with existing SVG as fallback'
  - 'Motion-safe wrapper: all scroll animations go through useMotionSafe for accessibility'

requirements-completed: [REQ-HERO-3D, REQ-SCROLL-MICRO, REQ-PRODUCT-MEDIA]

duration: 2min
completed: 2026-03-13
---

# Phase 12 Plan 01: Foundation Components Summary

**SplineHero 3D wrapper, ScrollReveal scroll animation, ProductMedia video/poster, and useTilt parallax hook — all with reduced-motion support**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-13T13:53:43Z
- **Completed:** 2026-03-13T13:56:14Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Installed Spline runtime packages for future 3D hero scenes
- Created 3 reusable UI components (SplineHero, ScrollReveal, ProductMedia) with accessibility built-in
- Created useTilt hook for desktop card parallax effects
- All components type-check cleanly and integrate with existing hooks

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Spline + create SplineHero, ScrollReveal, ProductMedia** - `eaa703a` (feat)
2. **Task 2: Create useTilt hook** - `7903da1` (feat)

## Files Created/Modified

- `src/components/common/SplineHero.tsx` - Lazy-loaded Spline 3D with OrbitVisual Suspense fallback
- `src/components/common/ScrollReveal.tsx` - Reusable whileInView animation with direction and delay options
- `src/components/common/ProductMedia.tsx` - Video/poster component respecting prefers-reduced-motion
- `src/hooks/useTilt.ts` - Mouse-tracking perspective transform for card parallax
- `package.json` - Added @splinetool/react-spline and @splinetool/runtime
- `package-lock.json` - Lock file updated with Spline dependencies

## Decisions Made

- SplineHero uses React.lazy + Suspense with OrbitVisual fallback — zero JS cost until Spline runtime loads
- ScrollReveal delegates reduced-motion handling to existing useMotionSafe hook
- useTilt is caller-guarded — hook returns values unconditionally, callers decide when to apply (desktop-only pattern)
- Components not exported from index.ts — Plans 02/03 import directly to avoid shared file conflicts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 4 foundation files ready for Plans 02 and 03 to consume
- Plans 02 and 03 can run in parallel since they import directly (no shared barrel export)
- Spline scene URLs needed at integration time (Plan 02/03 will provide)

---

_Phase: 12-design-polish-media_
_Completed: 2026-03-13_
