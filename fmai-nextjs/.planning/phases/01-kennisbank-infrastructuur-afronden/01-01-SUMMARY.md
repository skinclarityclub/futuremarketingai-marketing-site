---
phase: 01-kennisbank-infrastructuur-afronden
plan: 01
subsystem: seo
tags: [next-intl, schema-dts, json-ld, defined-term, geo, i18n, glossary]

# Dependency graph
requires:
  - phase: 01-research
    provides: KB-05 term inventory + sticky-header anchor pitfall (scroll-margin)
provides:
  - GLOSSARY_TERMS registry (4 KB-05 terms, id + category, copy-free)
  - glossary i18n namespace in NL/EN/ES (name + definition per term)
  - Glossary presentational component (per-term anchors + scroll-mt-28)
  - DefinedTermSetJsonLd emitter (locale-scoped DefinedTermSet/DefinedTerm)
affects: [01-03-resources-hub, geo-citation, resources-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prop-driven pure presentational component: page owns i18n (getTranslations), component renders resolved copy"
    - "Data/copy split: structural registry in src/lib, all copy in messages namespace"
    - "Locale-scoped JSON-LD @ids: ${SITE_URL}/${locale}/resources#${id}"

key-files:
  created:
    - src/lib/glossary.ts
    - src/components/resources/Glossary.tsx
    - src/components/seo/DefinedTermSetJsonLd.tsx
  modified:
    - messages/nl.json
    - messages/en.json
    - messages/es.json

key-decisions:
  - "Glossary kept as pure prop-driven component (page resolves copy) instead of a Server Component reading getTranslations itself — keeps it reusable by Plan 03 without a translation dependency"
  - "DefinedTerm @ids are locale-scoped to match localePrefix:'always' routing and the rendered anchor ids"
  - "Term anchor keys kept stable across locales (e.g. ai-marketing-medewerker) even where the display name translates — the id is a URL fragment, the name is copy"

patterns-established:
  - "Pattern: glossary data module exports only ids + category; copy lives in i18n namespace"
  - "Pattern: scroll-mt-28 mandatory on each anchored term container to clear the sticky header"

requirements-completed: [KB-05]

# Metrics
duration: 4min
completed: 2026-06-02
---

# Phase 1 Plan 01: GEO/Agency Glossary (KB-05) Summary

**GEO/agency glossary shipped as a copy-free data registry, an NL/EN/ES i18n namespace, a pure prop-driven Glossary component with per-term scroll-safe anchors, and a locale-scoped DefinedTermSet/DefinedTerm JSON-LD emitter.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-02T10:01:16Z
- **Completed:** 2026-06-02T10:05:02Z
- **Tasks:** 3
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- `GLOSSARY_TERMS` registry with the 4 KB-05 terms (geo, ai-marketing-medewerker, citation-monitoring, tier-caps), structure-only so copy stays in i18n.
- Complete `glossary` namespace in NL/EN/ES with the Clyde / AI Marketing Medewerker positioning encoded and no em-dashes.
- `Glossary.tsx` renders a `<dl>` with one `id` + `scroll-mt-28` container per term, copy via props (page owns translation).
- `DefinedTermSetJsonLd.tsx` emits a DefinedTermSet with one DefinedTerm per term and correct locale-scoped `@id`s, wired through the typed `JsonLd` emitter.

## Task Commits

Each task was committed atomically:

1. **Task 1: Glossary data module (GLOSSARY_TERMS)** - `7c5ea16` (feat)
2. **Task 2: Glossary i18n copy in nl/en/es** - `3d6b9e6` (content)
3. **Task 3: Glossary component + DefinedTermSet JSON-LD** - `1b67798` (feat)

## Files Created/Modified
- `src/lib/glossary.ts` - GlossaryTermRef interface + GLOSSARY_TERMS (4 terms, id + category only)
- `src/components/resources/Glossary.tsx` - Pure presentational `<dl>` with per-term anchors + scroll-mt-28
- `src/components/seo/DefinedTermSetJsonLd.tsx` - DefinedTermSet/DefinedTerm JSON-LD emitter
- `messages/nl.json` - glossary namespace (authoritative NL copy)
- `messages/en.json` - glossary namespace (EN)
- `messages/es.json` - glossary namespace (ES)

## Decisions Made
- Glossary stays prop-driven (page resolves copy) rather than calling `getTranslations` internally — keeps it a pure, reusable component for Plan 03's `/resources` hub.
- Term anchor ids are stable across locales; only the display `name` translates, since the id doubles as the URL fragment and DefinedTerm `@id`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- A pre-existing TypeScript error in `tests/e2e/audit-v2-lighthouse.spec.ts` (line 90, `timeout` not in `TestDetails`) surfaced during the full `tsc --noEmit`. It is unrelated to this plan (last touched by commit `0f070f9`) and out of scope per the scope boundary. Logged to `deferred-items.md`; not fixed. All new glossary files compile clean.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plan 03 (`/resources` hub) can import `Glossary`, `DefinedTermSetJsonLd`, and `GLOSSARY_TERMS` without modification.
- The resources page must resolve glossary copy via `getTranslations('glossary')` and pass a `terms` array (mapped from `GLOSSARY_TERMS`) plus `heading`/`intro` to both components.
- No blockers.

## Self-Check: PASSED

- Files: all 3 created files present on disk.
- Commits: 7c5ea16, 3d6b9e6, 1b67798 all exist in git history.

---
*Phase: 01-kennisbank-infrastructuur-afronden*
*Completed: 2026-06-02*
