---
phase: 09-living-system-page-conversion
plan: 04
subsystem: ui
tags: [react, tailwind, living-system, design-tokens, page-conversion]

# Dependency graph
requires:
  - phase: 03-design-overhaul
    provides: Living System design tokens (bg-bg-deep, accent-system, accent-human, border-border-primary), SystemPanel, CTAButton components

provides:
  - AboutPage converted to Living System tokens with accent-human badge and bg-bg-surface cards
  - ContactPage converted with bg-bg-elevated form inputs and accent-system focus states
  - PricingPage converted with accent-system/5 transparency notice and CTAButton CTA
  - HowItWorksPage converted with bg-bg-surface step cards and accent-system icon containers
  - LegalPage converted with bg-bg-deep wrapper, border-border-primary tables, accent-system links

affects:
  - 09-living-system-page-conversion (plan 05 — final audit/cleanup of remaining pages)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CTAButton with calendly prop replaces all old gradient anchor CTA buttons
    - bg-bg-elevated + border-border-primary + rounded-sm for form inputs with accent-system focus ring
    - accent-human/10 border-accent-human/20 for human-centric/warm content badges
    - bg-accent-system/5 border-accent-system/20 for informational notices and highlights

key-files:
  created: []
  modified:
    - src/pages/AboutPage.tsx
    - src/pages/ContactPage.tsx
    - src/pages/PricingPage.tsx
    - src/pages/HowItWorksPage.tsx
    - src/pages/LegalPage.tsx

key-decisions:
  - 'AboutPage hero badge uses accent-human (amber) not accent-system (teal) — human/team-centric content gets warm accent'
  - 'ContactPage form inputs use bg-bg-elevated (one step above bg-bg-surface) to distinguish from panel background'
  - 'LegalPage keeps ReactMarkdown component map pattern — individual elements styled with Living System classes'
  - 'CTAButton with calendly prop replaces old external /demo link buttons across all converted pages'

patterns-established:
  - 'Informational notice boxes: bg-accent-system/5 border border-accent-system/20 rounded-sm'
  - 'Human/warmth badges: bg-accent-human/10 border border-accent-human/20'
  - 'Form inputs: bg-bg-elevated border border-border-primary rounded-sm with focus:ring-accent-system focus:border-accent-system'

requirements-completed:
  - REQ-PAGE-CONVERSION

# Metrics
duration: 4min
completed: 2026-03-13
---

# Phase 9 Plan 04: Supporting Pages Living System Conversion Summary

**5 supporting pages (About, Contact, Pricing, HowItWorks, Legal) converted from glassmorphism to Living System tokens — zero old palette classes, all CTAs use CTAButton with Calendly modal**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-13T01:18:47Z
- **Completed:** 2026-03-13T01:22:44Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- All 5 supporting pages use `bg-bg-deep` page wrapper — glassmorphism gradients fully removed
- Form inputs in ContactPage properly styled with `bg-bg-elevated` + `accent-system` focus states
- All old CTA buttons replaced with CTAButton component using `calendly` prop for modal integration
- LegalPage ReactMarkdown component map fully converted — tables, links, code blocks all use Living System tokens
- TypeScript compiles cleanly — unused `ArrowRight` import auto-fixed in HowItWorksPage

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert AboutPage and ContactPage to Living System tokens** - `016f18b` (feat)
2. **Task 2: Convert PricingPage, HowItWorksPage, and LegalPage to Living System tokens** - `aa91304` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/pages/AboutPage.tsx` — bg-bg-deep wrapper, accent-human badge, bg-bg-surface mission/CTA panels, timeline nodes accent-system
- `src/pages/ContactPage.tsx` — bg-bg-surface form panel, bg-bg-elevated inputs, accent-system focus ring, CTAButton for Calendly
- `src/pages/PricingPage.tsx` — bg-bg-deep wrapper, accent-system/5 transparency notice, accent-human badge, CTAButton CTA
- `src/pages/HowItWorksPage.tsx` — bg-bg-surface step cards, accent-system/20 icon containers, accent-system step labels, CTAButton CTA
- `src/pages/LegalPage.tsx` — bg-bg-deep throughout, bg-bg-surface content card, border-border-primary tables, accent-system links

## Decisions Made

- AboutPage hero badge uses `accent-human` (amber) not `accent-system` (teal) — the badge text references the team/founding mission so the warm human accent is more appropriate
- ContactPage form inputs use `bg-bg-elevated` rather than `bg-bg-surface` to visually distinguish the input field from the panel background it sits within
- CTAButton with `calendly` prop replaces all old `/demo` external link buttons — consistent modal pattern across all pages
- LegalPage ReactMarkdown component map preserved as-is, only class names updated — avoids restructuring working markdown rendering

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused ArrowRight import in HowItWorksPage**

- **Found during:** Task 2 (HowItWorksPage conversion)
- **Issue:** ArrowRight was imported but no longer used after replacing the old CTA anchor with CTAButton (which manages its own arrow icon internally)
- **Fix:** Removed ArrowRight from the import statement
- **Files modified:** src/pages/HowItWorksPage.tsx
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** aa91304 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug/unused import)
**Impact on plan:** Minor cleanup necessary for TypeScript compliance. No scope creep.

## Issues Encountered

None — all pages converted cleanly. TypeScript error on unused import was caught during verification and fixed before committing.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All 5 supporting pages are Living System compliant
- Phase 09 plan 05 (final wave cleanup / remaining page audit) can proceed immediately
- No blockers

---

_Phase: 09-living-system-page-conversion_
_Completed: 2026-03-13_
