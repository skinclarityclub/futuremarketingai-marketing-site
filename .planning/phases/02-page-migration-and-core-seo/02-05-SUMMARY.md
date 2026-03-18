---
phase: 02-page-migration-and-core-seo
plan: 05
subsystem: seo
tags: [sitemap, robots, hreflang, 404, error-boundary, next-intl, metadata]

requires:
  - phase: 02-page-migration-and-core-seo
    provides: seo-config.ts with SITE_URL/PAGE_DATES, metadata.ts generator, routing.ts with locales
provides:
  - XML sitemap with 10 pages x 3 locale alternates (30 entries)
  - robots.txt with AI crawler allow/block policy
  - Localized 404 not-found page
  - Client-side error boundary with reset
  - x-default hreflang in all page metadata
affects: [phase-03, phase-04, seo, crawlability]

tech-stack:
  added: []
  patterns: [MetadataRoute.Sitemap, MetadataRoute.Robots, next-intl useTranslations in not-found]

key-files:
  created:
    - fmai-nextjs/src/app/sitemap.ts
    - fmai-nextjs/src/app/robots.ts
    - fmai-nextjs/src/app/[locale]/not-found.tsx
    - fmai-nextjs/src/app/[locale]/error.tsx
  modified:
    - fmai-nextjs/src/lib/metadata.ts

key-decisions:
  - 'No new decisions -- followed plan and existing project decisions exactly'

patterns-established:
  - 'MetadataRoute.Sitemap: default export function returning typed sitemap array'
  - 'MetadataRoute.Robots: default export function with multi-rule AI crawler policy'

requirements-completed: [SEO-04, SEO-05, SEO-06, SEO-10]

duration: 3min
completed: 2026-03-18
---

# Phase 02 Plan 05: Gap Closure Summary

**XML sitemap, robots.txt with AI crawler policy, custom 404/error pages, and x-default hreflang for complete Phase 2 SEO coverage**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-18T03:21:19Z
- **Completed:** 2026-03-18T03:23:47Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- XML sitemap with 10 pages and 3 locale alternates each (30 entries total)
- robots.txt with 3 rule sets: default allow, AI retrieval allow, AI training block
- Localized 404 page using existing error translation keys from en/nl/es message files
- Client-side error boundary with reset button (hardcoded English per project decision)
- x-default hreflang pointing to /en/ path added to all page metadata alternates

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sitemap.ts and robots.ts** - `053fe8d` (feat)
2. **Task 2: Create not-found.tsx, error.tsx, and fix x-default hreflang** - `b4c2fe5` (feat)

## Files Created/Modified

- `fmai-nextjs/src/app/sitemap.ts` - XML sitemap generator with locale alternates and PAGE_DATES
- `fmai-nextjs/src/app/robots.ts` - robots.txt with AI crawler allow/block policy
- `fmai-nextjs/src/app/[locale]/not-found.tsx` - Localized 404 page using next-intl errors namespace
- `fmai-nextjs/src/app/[locale]/error.tsx` - Client error boundary with reset button
- `fmai-nextjs/src/lib/metadata.ts` - Added x-default hreflang to alternates languages map

## Decisions Made

None - followed plan as specified. All existing project decisions honored (hardcoded English in error.tsx per "use client" constraint).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Phase 2 verification gaps are now closed (3/3)
- Phase 2 SEO infrastructure is complete: all 10 pages have metadata, JSON-LD, sitemap coverage, robots policy, custom error pages, and full hreflang with x-default
- Ready for Phase 3 development

---

_Phase: 02-page-migration-and-core-seo_
_Completed: 2026-03-18_
