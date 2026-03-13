---
phase: 09-living-system-page-conversion
plan: 03
subsystem: ui
tags: [react, tailwind, framer-motion, living-system, glassmorphism-removal, CTAButton, Calendly]

# Dependency graph
requires:
  - phase: 03-design-overhaul
    provides: CTAButton component, Living System design tokens, SystemPanel, CalendlyModal

provides:
  - AutomationsPage converted to Living System tokens with CTAButton for all CTAs
  - ChatbotsPage converted to Living System tokens with CTAButton for all CTAs
  - VoiceAgentsPage converted to Living System tokens with CTAButton for all CTAs
  - Zero glassmorphism classes remaining in all 3 service pages

affects: [09-living-system-page-conversion, service-pages, conversion-funnel]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Service page CTA pattern: CTAButton with calendly prop replaces all hand-rolled Calendly modal state'
    - 'Feature cards pattern: bg-bg-surface border border-border-primary rounded-sm (no backdrop-blur)'
    - 'Hero badge pattern: accent-system/10 bg + accent-system/20 border + rounded-sm'
    - 'Process step number accent: text-accent-system/30 for muted step numbers'
    - 'Pricing highlight pattern: border-accent-system/50 + shadow-glow-sm + accent-system badge'

key-files:
  created: []
  modified:
    - src/pages/AutomationsPage.tsx
    - src/pages/ChatbotsPage.tsx
    - src/pages/VoiceAgentsPage.tsx

key-decisions:
  - 'Pricing card CTA uses CTAButton with w-full justify-center className to maintain full-width appearance'
  - 'Pricing highlighted badge uses bg-accent-system text-bg-deep instead of gradient — consistent with Living System'
  - 'Final CTA sections use bg-accent-system/5 border border-border-primary rounded-sm instead of gradient-to-r'

patterns-established:
  - 'Full service page conversion pattern established across 3 pages — consistent template for remaining pages'

requirements-completed: [REQ-PAGE-CONVERSION]

# Metrics
duration: 5min
completed: 2026-03-13
---

# Phase 09 Plan 03: Service Pages Living System Conversion Summary

**Three service pages (Automations, Chatbots, Voice Agents) fully converted from glassmorphism to Living System tokens — zero old palette classes, all Calendly CTAs replaced with CTAButton**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-13T01:18:45Z
- **Completed:** 2026-03-13T01:23:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Eliminated all glassmorphism classes (bg-white/5, backdrop-blur-sm, border-white/10, rounded-xl, slate/blue gradients) from 3 service pages
- Replaced all 9+ hand-rolled Calendly buttons with CTAButton calendly prop — removed useState, CalendlyModal JSX, and CalendlyModal imports from all 3 pages
- Applied full Living System token set: bg-bg-deep page wrapper, bg-bg-surface cards, text-text-primary/secondary/muted hierarchy, accent-system icons and badges, border-border-primary, rounded-sm

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert AutomationsPage to Living System tokens** - `92940cd` (feat)
2. **Task 2: Convert ChatbotsPage and VoiceAgentsPage to Living System tokens** - `145c8b1` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/pages/AutomationsPage.tsx` - Full Living System conversion: bg-bg-deep, SystemPanel surfaces, CTAButton for all 4 CTAs (hero, 3 pricing cards, final CTA)
- `src/pages/ChatbotsPage.tsx` - Full Living System conversion: bg-bg-deep, SystemPanel surfaces, CTAButton for all 4 CTAs (hero, 3 pricing cards, final CTA)
- `src/pages/VoiceAgentsPage.tsx` - Full Living System conversion: bg-bg-deep, SystemPanel surfaces, CTAButton for all 4 CTAs (hero, 3 pricing cards, final CTA)

## Decisions Made

- Pricing card CTAs use `CTAButton` with `className="w-full justify-center"` to maintain the full-width block appearance of the original buttons
- Highlighted pricing tier badges converted from `bg-gradient-to-r from-blue-500 to-purple-600 rounded-full` to `bg-accent-system text-bg-deep rounded-sm` — stays consistent with Living System sharp corners
- Final CTA section background changed from `bg-gradient-to-r from-blue-500/10 to-purple-500/10` to `bg-accent-system/5 border border-border-primary rounded-sm`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused ArrowRight import from ChatbotsPage**

- **Found during:** Task 2 (ChatbotsPage conversion)
- **Issue:** `ArrowRight` was imported but no longer used after converting the `<a href="/demo">` link to `<CTAButton href="/demo" arrow>` which uses its own internal ArrowRight
- **Fix:** Removed `ArrowRight` from lucide-react import
- **Files modified:** src/pages/ChatbotsPage.tsx
- **Verification:** TypeScript compile check passed — only pre-existing HowItWorksPage error remains (out of scope)
- **Committed in:** 145c8b1 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - unused import bug)
**Impact on plan:** Minor cleanup required for TypeScript compliance. No scope creep.

## Issues Encountered

- Pre-commit hook (lint-staged + prettier) reformatted files during first commit attempt, causing a git stash conflict. Resolved by re-staging the formatted files and committing again — lint-staged formatting is accounted for in final committed state.
- Pre-existing TypeScript error in `HowItWorksPage.tsx` (unused ArrowRight import) is out of scope — logged but not fixed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 3 service pages are now Living System compliant — zero old palette classes
- CTAButton pattern fully established across service pages for future pages
- Ready for Plan 04 (remaining pages conversion) or any subsequent page work
- Pre-existing HowItWorksPage unused import should be cleaned up in a future pass

---

_Phase: 09-living-system-page-conversion_
_Completed: 2026-03-13_
