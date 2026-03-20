---
phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling
plan: 04
subsystem: i18n
tags: [next-intl, i18n, dutch, spanish, clyde, translations, copywriting]

requires:
  - phase: 07-02
    provides: English homepage Clyde messaging rewrite (en.json home namespace)
  - phase: 07-03
    provides: English skill pages Clyde messaging with task_demo sections (en.json 8 skill namespaces)
provides:
  - Native Dutch rewrite of all Clyde messaging (home + 8 skills) in nl.json
  - Native Spanish rewrite of all Clyde messaging (home + 8 skills) in es.json
  - Full multilingual Clyde branding across EN/NL/ES
affects: []

tech-stack:
  added: []
  patterns:
    - Native rewrite approach for i18n (not direct translation)
    - Culturally adapted task_demo examples per language

key-files:
  created: []
  modified:
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'Dutch task_demo examples use Dutch business names (Bakkerij De Groot, Amsterdam context)'
  - 'Spanish task_demo examples use Spanish business names (Panaderia El Buen Pan, Madrid context)'
  - "Dutch copy uses informal 'jij/je' register (zakelijk maar toegankelijk) throughout"
  - "Spanish copy uses tuteo ('tu agencia') for approachable professional tone"
  - 'Clyde stays Clyde in all 3 languages - 242 mentions in each NL and ES file'

patterns-established:
  - 'Clyde naming convention: never translate, only adapt surrounding copy'
  - 'Per-locale task_demo commands: same structure, culturally adapted examples'

requirements-completed: [WEB-01]

duration: 17min
completed: 2026-03-21
---

# Phase 7 Plan 4: NL/ES Native Clyde Rewrite Summary

**Native Dutch and Spanish rewrites of all Clyde messaging across homepage and 8 skill pages with culturally adapted task_demo examples**

## Performance

- **Duration:** 17 min
- **Started:** 2026-03-20T23:01:07Z
- **Completed:** 2026-03-20T23:17:47Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Rewrote all 9 namespaces in nl.json with native Dutch Clyde messaging (242 Clyde mentions)
- Rewrote all 9 namespaces in es.json with native Spanish Clyde messaging (242 Clyde mentions)
- Both files have identical key structure to en.json across all 9 namespaces
- Replaced old per-skill pricing tiers with simplified pricing CTA in both languages
- Added task_demo sections with culturally adapted business examples

## Task Commits

Each task was committed atomically:

1. **Task 1: Native Dutch rewrite of all Clyde messaging** - `ea72598` (feat)
2. **Task 2: Native Spanish rewrite of all Clyde messaging** - `e5715c2` (feat)

## Files Created/Modified

- `fmai-nextjs/messages/nl.json` - Full native Dutch Clyde rewrite (home + 8 skills, 375 insertions, 489 deletions)
- `fmai-nextjs/messages/es.json` - Full native Spanish Clyde rewrite (home + 8 skills, 387 insertions, 501 deletions)

## Decisions Made

- Dutch copy uses informal register ("jij/je") for approachable professional tone matching Dutch marketing convention
- Spanish copy uses tuteo ("tu agencia") rather than usted for the same approachable feel
- Task_demo examples adapted per locale: Dutch uses Amsterdam-based business (Bakkerij De Groot), Spanish uses Madrid-based (Panaderia El Buen Pan)
- "Clyde" remains untranslated in both languages per locked decision

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 3 locales (EN/NL/ES) now have complete Clyde messaging across homepage and all 8 skill pages
- Phase 7 (Website Copy Overhaul) is complete: all 4 plans executed
- Full multilingual Clyde branding ready for production

---

_Phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling_
_Completed: 2026-03-21_
