---
phase: 01-kennisbank-infrastructuur-afronden
plan: 03
subsystem: seo
tags: [next-intl, json-ld, defined-term, web-page, breadcrumbs, sitemap, hreflang, geo, resources-hub]

# Dependency graph
requires:
  - phase: 01-kennisbank-infrastructuur-afronden (Plan 01)
    provides: GLOSSARY_TERMS registry, glossary i18n namespace, Glossary component, DefinedTermSetJsonLd emitter
  - phase: 01-kennisbank-infrastructuur-afronden (Plan 02)
    provides: First GEO pillar article (content/blog/geo-generative-engine-optimization.mdx) seeding the hub
provides:
  - /resources knowledge-base hub Server Component (KB-04)
  - PillarHubCard component (pillar + cluster bundling, graceful empty state)
  - resources i18n namespace in NL/EN/ES (meta/hero/pillars/glossary copy)
  - /resources wired into sitemap (hreflang nl/en/es) and breadcrumbs
affects: [phase-03-cornerstone-content, geo-citation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hub page composes pure prop-driven primitives (Glossary, PillarHubCard) and resolves all copy via getTranslations"
    - "Pillar buckets keyed by BLOG_CATEGORIES ids; clusters gathered per-pillar via getClusterPosts"
    - "Graceful degradation: buckets render structure even with zero pillar posts (research Pitfall 2)"

key-files:
  created:
    - src/app/[locale]/(marketing)/resources/page.tsx
    - src/components/resources/PillarHubCard.tsx
  modified:
    - messages/nl.json
    - messages/en.json
    - messages/es.json
    - src/lib/breadcrumb-config.ts
    - src/app/sitemap.ts

key-decisions:
  - "PillarHubCard routes via the locale-aware next-intl Link (href=/blog/<slug>) instead of manually prefixing the locale, matching the rest of the site; the locale prop is kept for parity with the hub data model"
  - "Pillar buckets are keyed off the geo / ai-marketing-automation / agency-ops BLOG_CATEGORIES ids, the same taxonomy the glossary categories reuse, so blog + resources stay structurally consistent"
  - "The wrapping glossary section reuses Plan 01's existing h2#glossary-heading via aria-labelledby rather than emitting a duplicate heading"

patterns-established:
  - "Knowledge-base hub pattern: page owns i18n + data fetch, composes pure presentational primitives, emits WebPage + DefinedTermSet + Breadcrumb JSON-LD"
  - "Pillar bucket always renders (title + description + emptyLabel) so taxonomy is visible before cornerstone content lands"

requirements-completed: [KB-04]

# Metrics
duration: ~10min
completed: 2026-06-02
---

# Phase 1 Plan 03: /resources Knowledge-Base Hub (KB-04) Summary

**Shipped the /resources hub that structures pillars -> clusters -> glossary, i18n NL/EN/ES, following the proven memory/page.tsx pattern. It degrades gracefully (buckets render with zero pillar posts), emits WebPage + DefinedTermSet + Breadcrumb JSON-LD, and is wired into the sitemap with hreflang alternates and into breadcrumbs.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-06-02T10:17:56Z
- **Completed:** 2026-06-02T10:28:12Z
- **Tasks:** 3
- **Files modified:** 7 (2 created, 5 modified)

## Accomplishments
- `/resources` Server Component (KB-04) generates statically for nl/en/es, composing three strategic pillar buckets + the glossary.
- `PillarHubCard` bundles each pillar plus its clusters as a GlassCard, links posts via the locale-aware next-intl Link, and shows `emptyLabel` when both arrays are empty (graceful degradation, research Pitfall 2).
- `resources` i18n namespace (meta/hero/pillars/glossary) authored in NL and translated to EN/ES, plus `common.breadcrumbs.resources` in all three locales. No em-dashes; key-phrase glossary honored ("vaardigheden", "Clyde / AI Marketing Medewerker", "merken").
- `/resources` registered in `BREADCRUMB_ROUTES` (parent `/`) and in the sitemap `pages` array; the existing sitemap loop emits hreflang `alternates.languages` for nl/en/es (verified in the built `sitemap.xml`).
- The hub emits `WebPage` (CollectionPage-equivalent WebPage), `DefinedTermSet` (glossary), and `BreadcrumbList` JSON-LD, and renders the visible `<Breadcrumbs>`.

## Task Commits

Each task was committed atomically:

1. **Task 1: resources i18n namespace + breadcrumb + sitemap wiring** - `2ba21a8` (feat)
2. **Task 2: PillarHubCard component (graceful empty state)** - `c375f1d` (feat)
3. **Task 3: /resources hub page composing pillars + clusters + glossary** - `ef198d2` (feat)

## Files Created/Modified
- `src/app/[locale]/(marketing)/resources/page.tsx` - The /resources hub Server Component (KB-04): generateStaticParams/generateMetadata, three pillar buckets keyed by BLOG_CATEGORIES ids, glossary composition, full JSON-LD + Breadcrumbs.
- `src/components/resources/PillarHubCard.tsx` - Pillar bucket card bundling a pillar + its clusters with graceful empty state.
- `messages/nl.json` / `en.json` / `es.json` - `resources` namespace + `common.breadcrumbs.resources` in all three locales (NL authoritative).
- `src/lib/breadcrumb-config.ts` - `/resources` breadcrumb entry (parent `/`).
- `src/app/sitemap.ts` - `/resources` in the pages array (weekly, priority 0.8).

## Decisions Made
- **Locale-aware Link over manual prefix:** PillarHubCard uses `Link` from `@/i18n/navigation` with `href={`/blog/${slug}`}` (the convention used across the site) instead of the plan's `/${locale}/blog/${slug}` suggestion. The next-intl Link auto-prefixes the active locale, so this is both correct and consistent with the codebase. The `locale` prop is retained in the interface for parity with the hub's data model.
- **Bucket taxonomy reuse:** Buckets are keyed off `geo` / `ai-marketing-automation` / `agency-ops` (the BLOG_CATEGORIES ids the glossary categories also use), keeping blog and resources structurally aligned.
- **No duplicate glossary heading:** The wrapping section uses `aria-labelledby="glossary-heading"` to reference the `<h2>` that Plan 01's Glossary already renders, avoiding a second heading.

## Deviations from Plan

### Auto-fixed Issues

None requiring a fix. One intentional, plan-sanctioned choice:

- The plan explicitly allowed either `next-intl Link` or `next/link with locale-prefixed href` for PillarHubCard. Chose the next-intl Link (site convention) with a locale-relative href. This is within the plan's stated latitude, not a deviation.

**Total deviations:** 0
**Impact on plan:** Plan executed as written.

## Issues Encountered
- A pre-existing, unrelated TypeScript error persists in `tests/e2e/audit-v2-lighthouse.spec.ts` (line 90, `timeout` not in `TestDetails`), already documented in Plan 01's SUMMARY and `deferred-items.md`. Out of scope per the scope boundary; not fixed. All new files in this plan compile clean and `npm run build` exits 0.
- A stray dev-server process under `.next-3001/dev` produced lint noise during one ad-hoc grep; it is unrelated to the production build, which completed cleanly (exit 0) on a dedicated run.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- KB-04 complete: `/resources` exposes the pillars -> clusters -> glossary structure in NL/EN/ES (phase success criterion 1), with hreflang in the sitemap (criterion 4) and the per-term linkable glossary from Plan 01 (criterion 2).
- The hub already shows real content from Plan 02's GEO pillar and degrades gracefully where buckets are still empty, so Phase 3 cornerstone content will flow in without page changes.
- Open concern carried from STATE: all Phase 1 work lives on branch `feature/seo-geo-kennisbank`, not `main`. Verify merge status before declaring Phase 1 fully done.

## Self-Check: PASSED

- FOUND: src/app/[locale]/(marketing)/resources/page.tsx
- FOUND: src/components/resources/PillarHubCard.tsx
- FOUND: built route .next/server/app/[locale]/(marketing)/resources/
- FOUND: /en|/nl|/es/resources in built sitemap.xml with hreflang alternates
- FOUND commit: 2ba21a8 (Task 1)
- FOUND commit: c375f1d (Task 2)
- FOUND commit: ef198d2 (Task 3)

---
*Phase: 01-kennisbank-infrastructuur-afronden*
*Completed: 2026-06-02*
