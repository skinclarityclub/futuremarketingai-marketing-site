---
phase: 01-foundation-and-infrastructure
plan: 02
subsystem: i18n
tags: [next-intl, i18n, translations, locale-routing, icu-format, server-components]

requires:
  - phase: 01-01
    provides: 'Next.js 16 scaffold with next-intl stubs, middleware.ts, and locale layout'
provides:
  - '69 translation files merged into 3 locale JSONs (en, nl, es) with 23 namespaces each'
  - 'i18next double-brace syntax converted to next-intl single-brace ICU format (280 conversions)'
  - 'Locale-aware navigation exports (Link, redirect, usePathname, useRouter)'
  - 'Server-side translations via getTranslations with multi-namespace support'
  - 'Static page generation for all 3 locales confirmed via npm run build'
affects: [02-page-migration, all-pages, seo, navigation]

tech-stack:
  added: []
  patterns:
    [
      next-intl-namespaced-translations,
      multi-namespace-server-components,
      icu-message-format,
      locale-aware-navigation,
    ]

key-files:
  created:
    - fmai-nextjs/src/i18n/navigation.ts
  modified:
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json
    - fmai-nextjs/src/app/[locale]/page.tsx

key-decisions:
  - 'Namespace keys preserved as-is including hyphens (how-it-works) -- next-intl handles them natively'
  - 'middleware.ts used instead of proxy.ts as established in Plan 01'

patterns-established:
  - 'useTranslations("namespace") for client, getTranslations("namespace") for server'
  - 'Multi-namespace pages import separate translation instances (hero + common pattern)'
  - 'Locale-aware Link from @/i18n/navigation for all internal links'
  - 'generateMetadata with getTranslations for server-side translated SEO metadata'

requirements-completed: [SEO-03, INT-07]

duration: 2min
completed: 2026-03-18
---

# Phase 1 Plan 2: i18n Translation Migration Summary

**69 i18next translation files merged into 3 next-intl locale JSONs with 280 interpolation conversions, full locale routing at /en/, /nl/, /es/, and server-rendered translations**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T02:02:20Z
- **Completed:** 2026-03-18T02:04:32Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- All 23 namespace translation files (x3 locales = 69 files) merged into 3 single-file locale JSONs
- 280 i18next `{{variable}}` interpolations converted to next-intl `{variable}` ICU format
- Locale-aware navigation helpers (Link, redirect, usePathname, useRouter) exported from @/i18n/navigation
- Homepage demonstrates multi-namespace usage (hero + common) with locale-aware Link components
- `npm run build` generates static pages for all 3 locales successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Merge 69 translation files into 3 locale JSONs** - `da95000` (feat)
2. **Task 2: Configure next-intl routing, navigation, and locale-aware homepage** - `68b7c6b` (feat)

_Note: Task 1 was committed in a prior session; Task 2 committed in this session._

## Files Created/Modified

- `fmai-nextjs/messages/en.json` - All 23 English namespace translations merged (1885 keys)
- `fmai-nextjs/messages/nl.json` - All 23 Dutch namespace translations merged (1961 keys)
- `fmai-nextjs/messages/es.json` - All 23 Spanish namespace translations merged (1860 keys)
- `fmai-nextjs/src/i18n/navigation.ts` - Locale-aware Link, redirect, usePathname, useRouter exports
- `fmai-nextjs/src/app/[locale]/page.tsx` - Updated with multi-namespace translations and locale-aware Links

## Decisions Made

- Namespace keys preserved as-is including hyphens (e.g., "how-it-works") since next-intl handles them natively
- middleware.ts used instead of proxy.ts as established in Plan 01 (STATE.md decision)
- Minor key count differences between locales (EN: 1885, NL: 1961, ES: 1860) are pre-existing in source files -- not introduced by migration

## Deviations from Plan

None - plan executed exactly as written. The plan referenced proxy.ts but middleware.ts was already established in Plan 01 and works correctly.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 23 translation namespaces accessible via `useTranslations('namespace')` and `getTranslations('namespace')`
- Locale routing confirmed: /en/, /nl/, /es/ all generate static pages
- Navigation helpers ready for all page migrations in Phase 2
- The entire i18next stack is fully replaced by next-intl

## Self-Check: PASSED

All files verified present. All commit hashes confirmed in git log.

---

_Phase: 01-foundation-and-infrastructure_
_Completed: 2026-03-18_
