---
phase: 10-homepage-restructuring-marketing-machine-page
plan: '03'
subsystem: i18n
tags: [i18n, translations, nl, es, hero-landing, homepage]

requires:
  - phase: 10-homepage-restructuring-marketing-machine-page
    plan: '01'
    provides: EN common.json hero_landing.services.* keys and updated hero_landing copy

provides:
  - NL common.json synced with EN hero_landing structure (no stale founding-member/wachtlijst copy)
  - ES common.json synced with EN hero_landing structure (no stale Lista-de-Espera copy)
  - ES structural issues fixed (duplicate pricing/actions blocks removed, cookie_consent added)
  - NL and ES services.* keys with proper translations for 4 service cards
  - ES orphaned top-level keys removed (language, buttons, metrics, time, etc.)

affects:
  - Hero.tsx uses landing.hero_landing.* keys — now correct in NL and ES
  - All pages using landing.footer.* keys — ES footer now has complete structure

tech-stack:
  added: []
  patterns:
    - 'Write tool used for full ES rewrite to fix structural JSON issues (duplicate keys)'

key-files:
  created: []
  modified:
    - public/locales/nl/common.json
    - public/locales/es/common.json

key-decisions:
  - 'ES file fully rewritten to remove duplicate top-level keys (JSON does not support duplicate keys — last one wins, earlier keys silently discarded)'
  - 'Orphaned ES top-level keys (language, buttons, metrics, time, validation, success, nav, mobile) removed as they have no EN counterparts and are not referenced by any components'
  - 'ES pricing occurrences = 3 is expected: 1 top-level pricing object + 2 nav string values inside landing.footer'

patterns-established:
  - 'Full-file rewrite approach for JSON files with duplicate top-level keys — cannot use Edit tool to remove a duplicate key since both have same key name'

requirements-completed:
  - REQ-HOMEPAGE-RESTRUCTURE

duration: 7min
completed: 2026-03-13
---

# Phase 10 Plan 03: i18n Locale Sync (NL + ES) Summary

**NL and ES hero_landing keys synced with EN: gateway services pitch, service card translations, and ES structural issues (duplicate blocks, missing cookie_consent) fixed**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-13T02:29:11Z
- **Completed:** 2026-03-13T02:36:14Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Updated NL hero_landing to match EN structure: new badge "AI Implementatie Partner", Dutch gateway services headlines, trust_anchor key, updated CTAs without "Wachtlijst", updated solution_section and final_cta
- Added NL services.\* keys for all 4 service cards (marketing, chat, voice, automations) with Dutch translations
- Fixed ES common.json structural issues: removed duplicate `pricing` block, removed duplicate `actions` block, removed ~12 orphaned top-level keys not present in EN (language, buttons, metrics, time, validation, success, nav, mobile, etc.)
- Added missing ES cookie_consent block (matching EN structure, translated to Spanish)
- Added missing ES keys to align with EN: skipLabel, personalization, language_switcher, industry_selector, trust_badges, case_studies, preferences, aggregate_metrics, progress, landing.mobile.desktop_required, footer (top-level keys)
- Updated ES hero_landing to match EN structure: Spanish gateway services copy, trust_anchor, updated CTAs without "Lista de Espera"
- Added ES services.\* keys for all 4 service cards in Spanish
- Build passes, both files parse as valid JSON

## Task Commits

Each task was committed atomically:

1. **Task 1: Sync NL common.json hero_landing keys + add service card keys** — `bfb2f42` (feat)
2. **Task 2: Fix ES common.json structural issues + sync hero_landing + add service card keys** — `767921a` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `public/locales/nl/common.json` — Updated hero_landing.badge, main_headline, sub_headline, description, trust_anchor, cta, solution_section, final_cta; added services.\* keys
- `public/locales/es/common.json` — Full structural rewrite: removed duplicate keys, removed orphaned keys, added cookie_consent and missing EN-aligned keys; updated hero_landing to match EN; added services.\* keys

## Decisions Made

- ES file required a full rewrite because JSON does not support duplicate top-level keys — in the original file, the second `"pricing"` and second `"actions"` blocks silently overwrote the first ones at parse time. An Edit tool operation cannot distinguish between duplicate keys, so a complete rewrite was necessary.
- Orphaned ES top-level keys (language, buttons, metrics, time, validation, success, nav, mobile at top level) were removed since they have no EN counterparts and are not used by any component — leaving them would create false positive key counts in tooling.
- The 3 occurrences of `"pricing"` string in ES JSON are correct: 1 top-level `pricing` object + 2 occurrences of `"pricing": "Precios"` inside landing.footer navigation sub-objects.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added missing ES keys not mentioned in plan**

- **Found during:** Task 2
- **Issue:** ES file was missing several EN keys beyond just hero_landing: skipLabel, personalization, language_switcher, industry_selector, trust_badges, case_studies, preferences, aggregate_metrics, progress, landing.mobile.desktop_required, and top-level footer keys
- **Fix:** Added all missing keys with Spanish translations during the full ES rewrite
- **Files modified:** public/locales/es/common.json
- **Commit:** 767921a

## Issues Encountered

None beyond the expected structural issues documented in the plan (duplicate keys, orphaned keys).

## User Setup Required

None.

## Next Phase Readiness

- All 3 plans in Phase 10 are now complete
- Homepage hub structure: EN, NL, and ES all show correct gateway services copy
- /marketing-machine page: complete with all sections
- i18n sync: hero_landing keys consistent across all 3 locales
- No "Wachtlijst", "Lista de Espera", or "founding member" copy visible in any language

---

## Self-Check: PASSED

- FOUND: public/locales/nl/common.json
- FOUND: public/locales/es/common.json
- FOUND: .planning/phases/10-homepage-restructuring-marketing-machine-page/10-03-SUMMARY.md
- FOUND commit: bfb2f42 (Task 1 - NL sync)
- FOUND commit: 767921a (Task 2 - ES fix + sync)
- Build: passed (built in 24.04s)
- NL JSON valid: true
- ES JSON valid: true
- NL services keys match EN: true
- ES services keys match EN: true
- No "Wachtlijst" in NL: true
- No "Lista de Espera" in ES: true

_Phase: 10-homepage-restructuring-marketing-machine-page_
_Completed: 2026-03-13_
