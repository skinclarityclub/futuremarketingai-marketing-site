---
phase: 11-living-system-full-rebuild
plan: 06
subsystem: ui
tags: [i18n, react, marketing-machine, translations]

requires:
  - phase: 11-01
    provides: DM Sans typography, CSS keyframe animations, card/btn tokens
  - phase: 11-02
    provides: SimpleHeader, CTAButton rebuilt components
provides:
  - MarketingMachinePage fully internationalized (EN/NL/ES)
  - marketing_machine i18n namespace in all 3 locale files
  - Prototype layout patterns applied to MarketingMachinePage
affects: [11-07]

tech-stack:
  added: []
  patterns:
    [i18n-driven pricing tiers with returnObjects, CSS fadeIn hero on marketing-machine page]

key-files:
  created: []
  modified:
    - src/pages/MarketingMachinePage.tsx
    - public/locales/en/common.json
    - public/locales/nl/common.json
    - public/locales/es/common.json

key-decisions:
  - 'Pricing tiers driven by TIER_KEYS array + t() with returnObjects for features list — no hardcoded tier data in component'
  - 'SEO meta tags kept as hardcoded EN strings (SEO is language-specific and handled separately from UI i18n)'
  - 'Locale files at public/locales/ not src/locales/ — plan referenced wrong path, corrected during execution'

patterns-established:
  - 'i18n pricing pattern: TIER_KEYS const array maps to translation keys, features fetched via returnObjects'

requirements-completed: [REQ-LIVING-SYSTEM-REBUILD]

duration: 3min
completed: 2026-03-13
---

# Phase 11 Plan 06: MarketingMachinePage i18n + Layout Rebuild Summary

**MarketingMachinePage converted to full i18n (EN/NL/ES) with card-gradient-border pricing cards, CSS fadeIn hero, and max-w-7xl layout**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-13T03:33:44Z
- **Completed:** 2026-03-13T03:37:01Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- All hardcoded English strings replaced with t('marketing_machine.\*') translation calls
- marketing_machine namespace added to EN, NL, and ES locale files with natural translations
- Pricing cards and final CTA section use card-gradient-border + rounded-card pattern
- Hero section uses CSS fadeIn/fadeInUp animations instead of Framer Motion wrappers

## Task Commits

Each task was committed atomically:

1. **Task 1: Add i18n keys to locale files** - `b03be2e` (feat)
2. **Task 2: Convert MarketingMachinePage to i18n + rebuild layout** - `7927855` (feat)

## Files Created/Modified

- `public/locales/en/common.json` - Added marketing_machine namespace with all EN strings
- `public/locales/nl/common.json` - Added marketing_machine namespace with Dutch translations
- `public/locales/es/common.json` - Added marketing_machine namespace with Spanish translations
- `src/pages/MarketingMachinePage.tsx` - Full i18n conversion + prototype layout patterns

## Decisions Made

- Pricing tiers driven by TIER_KEYS array + t() with returnObjects for features list — eliminates hardcoded tier data from component
- SEO meta tags kept as hardcoded EN strings (SEO handled separately from UI i18n)
- Locale files at public/locales/ not src/locales/ — plan referenced wrong path, corrected during execution

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected locale file paths**

- **Found during:** Task 1
- **Issue:** Plan referenced src/locales/{lang}/common.json but files are at public/locales/{lang}/common.json
- **Fix:** Used correct public/locales/ paths for all edits
- **Files modified:** public/locales/en/common.json, public/locales/nl/common.json, public/locales/es/common.json
- **Verification:** JSON parse validation passed, marketing_machine key present in all 3 files

---

**Total deviations:** 1 auto-fixed (1 blocking path correction)
**Impact on plan:** Trivial path correction. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- MarketingMachinePage is now fully internationalized and uses prototype layout patterns
- All pages in the site now have consistent i18n support and Living System design
- Ready for Plan 07 (final polish/cleanup)

---

_Phase: 11-living-system-full-rebuild_
_Completed: 2026-03-13_
