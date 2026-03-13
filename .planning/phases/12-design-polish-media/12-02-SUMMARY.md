---
phase: 12-design-polish-media
plan: 02
subsystem: ui
tags: [spline, scroll-reveal, micro-interactions, framer-motion, tailwind, css]

requires:
  - phase: 12-design-polish-media
    provides: SplineHero, ScrollReveal, useTilt foundation components (Plan 01)
provides:
  - SplineHero wired into Hero with OrbitVisual fallback (SPLINE_SCENE_URL constant)
  - ScrollReveal on homepage below-fold sections (service cards, VisionTimeline)
  - CTAButton arrow hover micro-animation (group-hover/cta)
  - card-tilt CSS class for subtle desktop hover depth
affects: [12-03-service-pages, 12-04-typography-polish]

tech-stack:
  added: []
  patterns:
    [named-group-hover for nested group isolation, CSS-only tilt over JS hooks for multiple cards]

key-files:
  created: []
  modified:
    - src/components/landing/Hero.tsx
    - src/components/common/CTAButton.tsx
    - src/index.css

key-decisions:
  - 'CSS card-tilt class on hero service cards instead of useTilt hook — avoids 4 hook instances, saves useTilt for service pages (Plan 03)'
  - 'Tailwind group/cta named group on CTAButton — prevents group-hover conflict with parent group classes on service card Links'
  - 'ScrollReveal wraps Hero.tsx sections (not LandingPage.tsx) — below-fold content lives in Hero component'

patterns-established:
  - 'Named group pattern: group/cta + group-hover/cta for isolated hover scoping in nested group contexts'
  - 'Section-level ScrollReveal wrapping: wrap entire sections, not individual cards, to avoid popcorn effect'

requirements-completed: [REQ-HERO-3D, REQ-SCROLL-MICRO]

duration: 6min
completed: 2026-03-13
---

# Phase 12 Plan 02: Homepage Polish Summary

**SplineHero integration in Hero with OrbitVisual fallback, ScrollReveal on below-fold sections, CTAButton arrow hover animation, and card-tilt CSS class**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-13T13:58:31Z
- **Completed:** 2026-03-13T14:04:21Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Hero.tsx conditionally renders SplineHero or OrbitVisual based on SPLINE_SCENE_URL constant (empty = fallback)
- Service cards grid and VisionTimeline sections wrapped in ScrollReveal with staggered delay
- CTAButton arrow icon shifts right on hover using Tailwind named group (group-hover/cta:translate-x-1)
- card-tilt CSS class added with desktop-only @media (hover: hover) and (pointer: fine) guard

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire SplineHero into Hero.tsx with OrbitVisual fallback + card-tilt class** - `2beaaef` (feat)
2. **Task 2: Add ScrollReveal to homepage sections + CTAButton arrow animation + CSS tilt class** - `c8f4cf2` (feat)

## Files Created/Modified

- `src/components/landing/Hero.tsx` - SplineHero conditional render, ScrollReveal wrapping, card-tilt class on service cards, removed unused motion import
- `src/components/common/CTAButton.tsx` - group/cta named group class, arrow icon wrapped in transition span with group-hover/cta:translate-x-1
- `src/index.css` - card-tilt CSS class with perspective transform and desktop-only media query

## Decisions Made

- CSS card-tilt class on hero service cards instead of useTilt hook — 4 hook instances unnecessary, CSS-only subtle tilt is cleaner for fixed cards. useTilt saved for service page cards in Plan 03.
- Tailwind group/cta named group on CTAButton — prevents group-hover conflict when CTAButton is nested inside elements that also use Tailwind group class (e.g., service card Links).
- ScrollReveal applied in Hero.tsx (not LandingPage.tsx) — the below-fold sections (service cards, VisionTimeline) are inside the Hero component, not LandingPage.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Named group to prevent group-hover conflict**

- **Found during:** Task 2 (CTAButton arrow animation)
- **Issue:** CTAButton uses `group` class for `group-hover:translate-x-1` on arrow, but service card Links also use `group` class — arrow would animate when hovering the card, not just the button
- **Fix:** Used Tailwind named group `group/cta` + `group-hover/cta:translate-x-1` to isolate the hover scope
- **Files modified:** src/components/common/CTAButton.tsx
- **Verification:** Build passes, named groups scope correctly
- **Committed in:** c8f4cf2 (Task 2 commit)

**2. [Rule 3 - Blocking] ScrollReveal in Hero.tsx instead of LandingPage.tsx**

- **Found during:** Task 2 (ScrollReveal wrappers)
- **Issue:** Plan specified wrapping sections in LandingPage.tsx, but all below-fold sections (service cards, VisionTimeline) are inside Hero.tsx
- **Fix:** Imported ScrollReveal in Hero.tsx and wrapped sections there
- **Files modified:** src/components/landing/Hero.tsx
- **Verification:** Build passes, sections correctly wrapped
- **Committed in:** c8f4cf2 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for correctness. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Homepage hero ready for Spline 3D scene — just populate SPLINE_SCENE_URL constant
- ScrollReveal pattern established for reuse on service pages (Plan 03)
- card-tilt CSS class available globally for any card elements
- CTAButton arrow animation active across all pages where arrow prop is used

---

_Phase: 12-design-polish-media_
_Completed: 2026-03-13_
