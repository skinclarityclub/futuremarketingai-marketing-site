---
phase: 01-website-rebrand
plan: 03
subsystem: ui
tags: [next.js, pricing, i18n, homepage, chatbot, agency-positioning]

# Dependency graph
requires:
  - phase: 01-website-rebrand
    provides: 'Plan 01 locale files with pricing/skill translations, Plan 02 skill routes and navigation'
provides:
  - '4-tier pricing page (Founding EUR 997, Starter EUR 1,497, Growth EUR 1,997, Agency EUR 3,497) with skill add-ons grid'
  - 'Homepage skill cards linking to /skills/* pages with agency-focused CTAs'
  - 'Agency chatbot personas (client onboarding, content creation, ROI calculator)'
  - 'Founding Member tier with 10-spot scarcity badge linking to /founding-member'
affects: [phase-2-dashboard, phase-5-gtm]

# Tech tracking
tech-stack:
  added: []
  patterns:
    [
      '4-tier pricing grid with highlighted featured tier',
      'Skill add-on cards grid below pricing tiers',
    ]

key-files:
  created: []
  modified:
    - 'fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/page.tsx'
    - 'fmai-nextjs/messages/nl.json'
    - 'fmai-nextjs/messages/es.json'

key-decisions:
  - 'Used 4-column grid on xl with 2-column on md for pricing tiers'
  - 'Founding Member tier highlighted with accent border and scarcity badge'
  - 'Homepage SERVICE_CARDS replaced with SKILL_CARDS referencing 6 skills'

patterns-established:
  - 'Pricing tier card pattern: GlassCard with badge, price, features list, CTA'
  - 'Skill add-on card pattern: name, price, description linking to /skills/{slug}'

requirements-completed: [WEB-04, WEB-05, WEB-15]

# Metrics
duration: ~25min
completed: 2026-03-20
---

# Phase 1 Plan 3: Pricing Page Redesign + Homepage Updates + Chatbot Personas Summary

**4-tier pricing page with skill add-ons, homepage skill cards with agency CTAs, and agency chatbot personas across EN/NL/ES**

## Performance

- **Duration:** ~25 min (across checkpoint pause)
- **Started:** 2026-03-20
- **Completed:** 2026-03-20
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Pricing page redesigned with 4 agent tiers (Founding Member, Starter, Growth, Agency) and skill add-ons section
- Homepage updated with 6 skill cards linking to /skills/\* pages, agency-focused stats, and updated CTAs
- Chatbot demo personas updated for agency use cases (client onboarding, content creation, ROI calculator)
- Translation key mismatch fixed in NL/ES footer (sections.services -> sections.skills)

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign pricing page for 4 agent tiers** - `5e8cfd7` (feat)
2. **Task 2: Update homepage CTAs and chatbot personas** - `eb9dd71` (feat)
3. **Task 3: Visual verification + translation fix** - `edfc702` (fix)

## Files Created/Modified

- `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx` - Redesigned with 4 tiers + skill add-ons grid
- `fmai-nextjs/src/app/[locale]/page.tsx` - Homepage skill cards, stats, CTAs updated for agency positioning
- `fmai-nextjs/messages/nl.json` - Fixed footer sections key (services -> skills)
- `fmai-nextjs/messages/es.json` - Fixed footer sections key (services -> skills)

## Decisions Made

- Used 4-column xl grid layout for pricing tiers (responsive to 2-col on md, 1-col on mobile)
- Founding Member tier highlighted with accent border and "10 Spots Only" badge
- Homepage SERVICE_CARDS array replaced with SKILL_CARDS referencing the 6 skills from Plan 01

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed footer translation key mismatch in NL/ES**

- **Found during:** Task 3 (visual verification)
- **Issue:** NL and ES locale files used `footer.sections.services` key instead of `footer.sections.skills`, mismatching the EN locale and the Footer component which reads `sections.skills`
- **Fix:** Changed key from `services` to `skills` in both nl.json and es.json
- **Files modified:** fmai-nextjs/messages/nl.json, fmai-nextjs/messages/es.json
- **Verification:** Build succeeds, footer renders correctly in all 3 locales
- **Committed in:** edfc702

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor key name correction for locale consistency. No scope creep.

## Issues Encountered

None beyond the translation key mismatch caught during visual verification.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 (Website Rebrand) is now COMPLETE -- all 3 plans executed
- Website fully rebranded for AaaS agency positioning across EN/NL/ES
- Phase 2 (Dashboard Reframe) can begin -- website positioning language is settled
- Phase 4 (Compliance) and Phase 5 (Go-to-Market) can continue in parallel

## Self-Check: PASSED

All files verified present, all commit hashes found in git log.

---

_Phase: 01-website-rebrand_
_Completed: 2026-03-20_
