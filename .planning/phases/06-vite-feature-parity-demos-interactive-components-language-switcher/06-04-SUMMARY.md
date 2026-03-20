---
phase: 06-vite-feature-parity
plan: 04
subsystem: ui
tags: [react, next.js, framer-motion, lucide-react, pricing, timeline]

requires:
  - phase: 06-01
    provides: Shared reusable components (PricingTiers, TrustMetrics, SocialProof, ProductMedia)
provides:
  - VisionTimeline component with 3-era AI adoption timeline
  - FeatureShowcase component with props-based 6-module card grid
  - Marketing machine page with full feature parity (social proof, timeline, pricing, product media)
  - Automations page with full feature parity (icons, trust metrics, pricing, product media)
affects: []

tech-stack:
  added: []
  patterns:
    - Dynamic import with next/dynamic for client-only animated components
    - Server-renderable Lucide icon mapping via Record<string, LucideIcon>

key-files:
  created:
    - fmai-nextjs/src/components/marketing-machine/VisionTimeline.tsx
    - fmai-nextjs/src/components/marketing-machine/FeatureShowcase.tsx
  modified:
    - fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx

key-decisions:
  - 'VisionTimeline uses MotionDiv from existing motion wrapper (not direct framer-motion import)'
  - 'FeatureShowcase is a server component with props-based API (no hardcoded data)'
  - 'Pricing data hardcoded in page files (not from translation keys) matching Vite approach'
  - 'Automation icons use direct Lucide component mapping instead of string-based icon lookup'

patterns-established:
  - 'marketing-machine/ component directory for page-specific components'
  - 'Dynamic import with { ssr: false } for animated client components in server pages'

requirements-completed: [WEB-01, WEB-03]

duration: 4min
completed: 2026-03-20
---

# Phase 6 Plan 4: Marketing Machine + Automations Feature Parity Summary

**VisionTimeline (3-era) and FeatureShowcase (6-module) components plus pricing tiers, trust metrics, social proof, and product media for both remaining service pages**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-20T20:42:41Z
- **Completed:** 2026-03-20T20:46:52Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created VisionTimeline with 3-era horizontal timeline (Manual Marketing -> Basic Automation -> AI Marketing Employee) with animated gradient connector and responsive mobile layout
- Created FeatureShowcase with props-based card grid supporting visual hierarchy via highlighted state
- Enhanced marketing machine page with SocialProof, VisionTimeline, FeatureShowcase, ProductMedia placeholder, and PricingTiers (Starter/Marketing Machine/Scale)
- Enhanced automations page with Lucide icons in automation grid, TrustMetrics (3 stats), ProductMedia placeholder, and PricingTiers (5/10/20 workflows)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create VisionTimeline + FeatureShowcase and enhance marketing machine page** - `81e333b` (feat)
2. **Task 2: Enhance automations page with pricing, trust metrics, product media, and icons** - `4ba8af4` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/marketing-machine/VisionTimeline.tsx` - 3-era animated timeline with horizontal desktop and vertical mobile layouts
- `fmai-nextjs/src/components/marketing-machine/FeatureShowcase.tsx` - Props-based 6-module card grid with orchestrator highlight
- `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx` - Full feature parity with SocialProof, VisionTimeline, FeatureShowcase, ProductMedia, PricingTiers
- `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx` - Full feature parity with Lucide icons, TrustMetrics, ProductMedia, PricingTiers

## Decisions Made

- VisionTimeline uses MotionDiv from existing motion wrapper rather than direct framer-motion import
- FeatureShowcase is a server component accepting features array as props (not hardcoded)
- Pricing data hardcoded in page files matching Vite approach
- Automation icons use direct Lucide component mapping via Record<string, LucideIcon>

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing build errors in chatbot tools (PRODUCT_CATALOG, KB_ARTICLES exports) -- out of scope, not related to this plan

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 4 service pages (chatbots, voice-agents, marketing-machine, automations) now have full feature parity with Vite versions
- Phase 6 plans 2 and 3 remain for interactive demo components

## Self-Check: PASSED

- All 4 key files exist
- Commit 81e333b (Task 1) verified
- Commit 4ba8af4 (Task 2) verified

---

_Phase: 06-vite-feature-parity_
_Completed: 2026-03-20_
