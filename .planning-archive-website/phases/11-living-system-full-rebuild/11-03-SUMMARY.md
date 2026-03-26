---
phase: 11-living-system-full-rebuild
plan: 03
subsystem: ui
tags: [hero, orbit-visual, service-cards, gradient-mesh, css-animations]

requires:
  - phase: 11-living-system-full-rebuild
    provides: GradientMesh component, CSS keyframes (fadeIn, fadeInUp, spin), card-gradient-border utility, rounded-card token
  - phase: 11-living-system-full-rebuild
    provides: CTAButton warm gradient, SimpleHeader backdrop-blur nav
provides:
  - Left-aligned Hero layout with OrbitVisual decorative orbit rings
  - 2x2 numbered service card grid (01-04) with gradient border hover
  - GradientMesh wired globally in LandingPage replacing 4 Framer Motion background layers
affects: [11-04, 11-05, 11-06, 11-07]

tech-stack:
  added: []
  patterns:
    [
      CSS fadeIn/fadeInUp animations replacing Framer Motion stagger on hero elements,
      OrbitVisual uses CSS spin keyframe for concentric ring animation,
      Service cards use Link component with card-gradient-border utility class,
    ]

key-files:
  created: [src/components/common/OrbitVisual.tsx]
  modified:
    [src/components/landing/Hero.tsx, src/pages/LandingPage.tsx, src/components/common/index.ts]

key-decisions:
  - 'Service card order: 01=Automations, 02=Chatbots, 03=Voice Agents, 04=Marketing Machine'
  - 'VisionTimeline kept inside Hero section as natural document flow below service cards'
  - 'GradientMesh rendered in LandingPage (not App.tsx) since Hero section no longer has its own backgrounds'

patterns-established:
  - 'Hero uses CSS animation style props instead of Framer Motion variants for fade-in effects'
  - 'Service cards use Link + card-gradient-border + arrow circle pattern'
  - 'OrbitVisual is purely decorative (aria-hidden, hidden below lg breakpoint)'

requirements-completed: [REQ-LIVING-SYSTEM-REBUILD]

duration: 4min
completed: 2026-03-13
---

# Phase 11 Plan 03: Hero Rebuild Summary

**Left-aligned hero with OrbitVisual orbit rings, 2x2 numbered service cards with gradient border hover, GradientMesh wired globally**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-13T03:26:00Z
- **Completed:** 2026-03-13T03:30:20Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Hero content left-aligned with max-w-[720px], OrbitVisual decorating right side on desktop
- Service cards rebuilt from 4-column icon grid to 2x2 numbered layout (01-04) with card-gradient-border hover effect and arrow circles
- Removed all 4 heavy Framer Motion background layers (NeuralNetwork, HolographicGrid, FloatingParticles, GradientOrbs) — ~350 lines of animation code deleted
- GradientMesh rendered globally in LandingPage as lightweight CSS replacement

## Task Commits

Each task was committed atomically:

1. **Task 1: Create OrbitVisual + rebuild Hero layout and service cards** - `5fe4a0f` (feat)
2. **Task 2: Wire GradientMesh globally in LandingPage** - `d204d9e` (feat)

## Files Created/Modified

- `src/components/common/OrbitVisual.tsx` - Decorative spinning orbit rings with 3 concentric circles and FM center text
- `src/components/landing/Hero.tsx` - Rebuilt: left-aligned layout, CSS animations, 2x2 numbered service cards, no background layers
- `src/pages/LandingPage.tsx` - GradientMesh imported and rendered as first child
- `src/components/common/index.ts` - OrbitVisual added to barrel exports

## Decisions Made

- Service card order set to 01=Automations, 02=Chatbots, 03=Voice Agents, 04=Marketing Machine (reordered from previous Marketing-first layout)
- VisionTimeline kept inside Hero section as natural document flow below service cards
- GradientMesh rendered in LandingPage rather than App.tsx, since Hero section no longer manages its own background layers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero section complete with editorial left-aligned layout
- Service cards ready for i18n verification on NL/ES locales
- Remaining plans (04-07) can rebuild service pages, about, pricing, and footer sections
- GradientMesh background active on all pages accessed through LandingPage

---

_Phase: 11-living-system-full-rebuild_
_Completed: 2026-03-13_
