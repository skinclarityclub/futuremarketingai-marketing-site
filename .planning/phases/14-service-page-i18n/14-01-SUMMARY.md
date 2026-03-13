---
phase: 14-service-page-i18n
plan: 01
subsystem: ui
tags: [react-i18next, useTranslation, i18n, automations, localization]

requires:
  - phase: 11-living-system-full-rebuild
    provides: i18n infrastructure and namespace pattern from MarketingMachinePage
provides:
  - EN/NL/ES automations.json namespace files with ~73 strings each
  - AutomationsPage.tsx fully internationalized with useTranslation
affects: [14-02-chatbots-i18n, 14-03-voice-agents-i18n]

tech-stack:
  added: []
  patterns: [key-based mapping for const arrays with t() inside component]

key-files:
  created:
    - public/locales/en/automations.json
    - public/locales/nl/automations.json
    - public/locales/es/automations.json
  modified:
    - src/pages/AutomationsPage.tsx

key-decisions:
  - 'Key arrays and icon mappings at module level, t() calls inside component via key-based mapping pattern'
  - 'returnObjects used for pricing tier features arrays'
  - 'NL prices use dot-separator (1.000) matching Dutch locale convention'

patterns-established:
  - 'Service page i18n: KEYS array + ICONS record at module scope, .map(key => t()) inside component'
  - 'Pricing features loaded via t(key, { returnObjects: true }) as string[]'

requirements-completed: [REQ-SERVICE-I18N]

duration: 4min
completed: 2026-03-13
---

# Phase 14 Plan 01: AutomationsPage i18n Summary

**AutomationsPage internationalized with ~73 strings per language (EN/NL/ES) using key-based mapping pattern for const arrays and useTranslation hook**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-13T15:29:33Z
- **Completed:** 2026-03-13T15:34:05Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created 3 locale namespace files (EN/NL/ES) with ~73 translation strings each
- Refactored AutomationsPage to use useTranslation with key-based mapping pattern for all 5 const arrays
- All hardcoded English strings replaced with t() calls (SEO meta tags excepted per project decision)
- Build passes with zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create automations.json locale files (EN/NL/ES)** - `eb98503` (feat)
2. **Task 2: Refactor AutomationsPage.tsx to use useTranslation** - `6129a45` (feat)

## Files Created/Modified

- `public/locales/en/automations.json` - English translation strings for AutomationsPage
- `public/locales/nl/automations.json` - Dutch translation strings for AutomationsPage
- `public/locales/es/automations.json` - Spanish translation strings for AutomationsPage
- `src/pages/AutomationsPage.tsx` - Internationalized component using useTranslation

## Decisions Made

- Key arrays and icon mappings kept at module level (not translatable), t() calls inside component via key-based mapping pattern
- Used returnObjects for pricing tier features arrays (concise, matches existing PricingPage pattern)
- NL prices use dot-separator (1.000) matching Dutch locale convention; ES prices also use dot-separator

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Pattern established for Plans 02 (ChatbotsPage) and 03 (VoiceAgentsPage)
- Key-based mapping pattern can be directly replicated for remaining service pages

## Self-Check: PASSED

- All 4 files verified on disk
- Commits eb98503 and 6129a45 confirmed in git log

---

_Phase: 14-service-page-i18n_
_Completed: 2026-03-13_
