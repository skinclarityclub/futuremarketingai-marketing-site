---
phase: 10-homepage-restructuring-marketing-machine-page
plan: '01'
subsystem: ui
tags: [react, framer-motion, i18n, react-router, homepage, landing-page]

requires:
  - phase: 09-living-system-page-conversion
    provides: Living System teal/amber tokens, CTAButton, SystemPanel, shared components

provides:
  - Homepage restructured as general FutureAI hub with 4-card service grid
  - SimpleHeader brandMiddle returns empty string on / (shows FutureAI)
  - SimpleHeader /marketing-machine route returns 'Marketing' (shows FutureMarketingAI)
  - Service dropdown links to /marketing-machine instead of /demo
  - VisionTimeline and FeatureShowcase removed from homepage
  - EN i18n keys for landing.hero_landing.services.* and updated final_cta/cta.primary

affects:
  - 10-02 (marketing-machine page will use relocated VisionTimeline/FeatureShowcase)
  - SimpleHeader used by all pages

tech-stack:
  added: []
  patterns:
    - 'MotionLink = motion(Link) pattern for animated React Router navigation cards'
    - 'Hash anchor #services scroll with CTAButton href for smooth in-page scroll'

key-files:
  created: []
  modified:
    - src/components/landing/SimpleHeader.tsx
    - src/components/landing/Hero.tsx
    - src/pages/LandingPage.tsx
    - src/components/landing/SimplifiedHeroMobile.tsx
    - public/locales/en/common.json

key-decisions:
  - 'MotionLink = motion(Link) used for service cards — enables both SPA navigation and Framer Motion animations'
  - 'Primary CTA href changed from /automations to #services (smooth scroll to service grid)'
  - 'solution_section i18n keys preserved in common.json for Plan 02 (marketing-machine page) to reference'
  - 'isMobile hook and useIsMobile import kept in LandingPage.tsx — still needed for StickyBottomCTA'

patterns-established:
  - 'Hub page pattern: hero + service cards grid + light Calendly CTA (no heavy sections)'
  - 'brandMiddle empty string = FutureAI on routes not explicitly mapped'

requirements-completed:
  - REQ-HOMEPAGE-RESTRUCTURE

duration: 6min
completed: 2026-03-13
---

# Phase 10 Plan 01: Homepage Restructuring Summary

**Homepage converted from marketing-automation funnel to general FutureAI hub: 4-card service grid (marketing-machine, chatbots, voice-agents, automations), VisionTimeline/FeatureShowcase removed, SimpleHeader branding updated**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-13T02:15:18Z
- **Completed:** 2026-03-13T02:20:50Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Reworked Hero.tsx desktop homepage: replaced VisionTimeline + FeatureShowcase sections with a 4-card animated service grid using MotionLink pattern
- Updated SimpleHeader brandMiddle logic so homepage shows "FutureAI" and /marketing-machine shows "FutureMarketingAI"; fixed service dropdown link from /demo to /marketing-machine
- Removed MobileEvolutionTimeline from LandingPage.tsx, updated SEOHead for general FutureAI hub, fixed legacy gradient wrapper to bg-bg-deep, fixed SimplifiedHeroMobile hardcoded Dutch string with i18n
- Added `landing.hero_landing.services.*` EN i18n keys for 4 service cards plus updated final_cta and cta.primary copy

## Task Commits

Each task was committed atomically:

1. **Task 1: Update SimpleHeader branding logic and service links** — `c7a8b55` (feat)
2. **Task 2: Rework Hero.tsx desktop + LandingPage.tsx + mobile hero for FutureAI hub** — `2697b67` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/components/landing/SimpleHeader.tsx` — brandMiddle: removed path==='/' from Marketing, added /marketing-machine; serviceLinks[3] href /demo → /marketing-machine
- `src/components/landing/Hero.tsx` — removed lazy VisionTimeline/FeatureShowcase imports and sections; added MotionLink service cards grid with #services anchor; updated primary CTA to #services scroll
- `src/pages/LandingPage.tsx` — removed MobileEvolutionTimeline import/render; updated SEOHead for FutureAI; fixed legacy gradient wrapper to bg-bg-deep
- `src/components/landing/SimplifiedHeroMobile.tsx` — replaced hardcoded "Live interactieve demo beschikbaar" with t('landing.hero_landing.badge')
- `public/locales/en/common.json` — added landing.hero_landing.services.\* keys for 4 service cards; updated cta.primary to "Explore Our Services"; updated final_cta for "Book a Free Audit" general pitch

## Decisions Made

- Used `MotionLink = motion(Link)` pattern so service cards get both Framer Motion whileHover animations AND proper SPA navigation via React Router
- Primary CTA changed from `/automations` href to `#services` hash scroll — keeps above-fold CTA low-friction (scroll down), Calendly CTA placed after service cards
- `solution_section` i18n keys (`badge`, `title`, `subtitle`) intentionally preserved in common.json — Plan 02 will use them on the marketing-machine page
- `isMobile` hook and `useIsMobile` import kept in LandingPage.tsx since `StickyBottomCTA` still conditionally renders based on it

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Homepage hub structure complete — service cards grid links correctly to all 4 service routes
- /marketing-machine route does not yet exist — Plan 02 will create MarketingMachinePage with relocated VisionTimeline, FeatureShowcase, and other marketing content
- SimpleHeader already handles /marketing-machine brandMiddle logic, ready for new page
- NL and ES i18n files still have stale hero_landing keys (old "founding member / wachtlijst" copy) — flagged as known gap, Plan 03+ can address

---

_Phase: 10-homepage-restructuring-marketing-machine-page_
_Completed: 2026-03-13_
