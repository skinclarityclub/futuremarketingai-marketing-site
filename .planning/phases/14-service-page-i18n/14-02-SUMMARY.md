---
phase: 14-service-page-i18n
plan: 02
subsystem: ui
tags: [i18n, react-i18next, chatbots, localization, typescript]

requires:
  - phase: 11-living-system-full-rebuild
    provides: ChatbotsPage component with Living System design tokens
provides:
  - EN/NL/ES chatbots.json locale files with ~64 strings each
  - Internationalized ChatbotsPage using useTranslation
affects: [14-service-page-i18n]

tech-stack:
  added: []
  patterns:
    [key-map arrays with t() for dynamic translated content, returnObjects for feature arrays]

key-files:
  created:
    - public/locales/en/chatbots.json
    - public/locales/nl/chatbots.json
    - public/locales/es/chatbots.json
  modified:
    - src/pages/ChatbotsPage.tsx

key-decisions:
  - 'Pricing tier features use t() with returnObjects to retrieve translated string arrays'
  - 'Module-level key/config maps (USE_CASE_KEYS, PRICING_TIER_CONFIG) keep icon and highlight config static while t() provides translated text'

patterns-established:
  - 'Key-map pattern: const arrays of keys + config at module level, t() mapping inside component for reactive translations'

requirements-completed: [REQ-SERVICE-I18N]

duration: 5min
completed: 2026-03-13
---

# Phase 14 Plan 02: ChatbotsPage i18n Summary

**ChatbotsPage fully internationalized with 3 locale files (EN/NL/ES) covering hero, use cases, process, pricing, trust metrics, FAQ, and CTA sections**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-13T15:29:40Z
- **Completed:** 2026-03-13T15:34:37Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created chatbots.json namespace files for EN, NL, and ES with identical key structures (~64 strings each)
- Refactored ChatbotsPage.tsx to replace all hardcoded English strings with t() calls
- Pricing tier features retrieved via returnObjects pattern for translated arrays
- SEO meta tags kept hardcoded EN per project decision [11-06]

## Task Commits

Each task was committed atomically:

1. **Task 1: Create chatbots.json locale files (EN/NL/ES)** - `2f2819a` (feat)
2. **Task 2: Refactor ChatbotsPage.tsx to use useTranslation** - `050c518` (feat)

## Files Created/Modified

- `public/locales/en/chatbots.json` - English translation strings for ChatbotsPage
- `public/locales/nl/chatbots.json` - Dutch translation strings for ChatbotsPage
- `public/locales/es/chatbots.json` - Spanish translation strings for ChatbotsPage
- `src/pages/ChatbotsPage.tsx` - Internationalized component using useTranslation

## Decisions Made

- Pricing tier features use t() with returnObjects to retrieve translated string arrays
- Module-level key/config maps (USE_CASE_KEYS, PRICING_TIER_CONFIG) keep icon and highlight config static while t() provides translated text

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ChatbotsPage fully multilingual, ready for remaining service page i18n (plan 03)
- Pattern established for key-map + t() can be reused on VoiceAgentsPage and AutomationsPage

## Self-Check: PASSED

- All 4 files verified on disk
- Commits `2f2819a` and `050c518` verified in git log

---

_Phase: 14-service-page-i18n_
_Completed: 2026-03-13_
