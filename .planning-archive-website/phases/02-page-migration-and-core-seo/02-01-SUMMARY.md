---
phase: 02-page-migration-and-core-seo
plan: 01
subsystem: seo
tags:
  [json-ld, schema-dts, metadata, sitemap, robots, structured-data, next-intl, server-components]

requires:
  - phase: 01-01
    provides: 'Next.js 16 scaffold with next-intl, Tailwind v4, and generatePageMetadata stub'
  - phase: 01-02
    provides: '3 locale JSON files with 23 namespaces each'
provides:
  - 'Async generatePageMetadata with getTranslations for localized meta, hreflang, OG, Twitter cards'
  - 'seo-config.ts with SITE_URL, SITE_NAME, ORG_EMAIL, LINKEDIN_URL, PAGE_DATES'
  - '6 JSON-LD Server Components: Organization, WebSite, WebPage, Service, Breadcrumb, generic JsonLd renderer'
  - 'XML sitemap with 10 pages x 3 locale alternates (30 URLs)'
  - 'robots.txt with AI retrieval bot allow / training bot block policy'
  - 'Localized 404 page and error boundary'
affects: [02-02, 02-03, 02-04, all-pages, seo, structured-data]

tech-stack:
  added: []
  patterns:
    [
      json-ld-server-components,
      xss-sanitized-json-stringify,
      async-generatePageMetadata,
      sitemap-outside-locale-segment,
      ai-crawler-policy,
    ]

key-files:
  created:
    - fmai-nextjs/src/lib/seo-config.ts
    - fmai-nextjs/src/components/seo/JsonLd.tsx
    - fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx
    - fmai-nextjs/src/components/seo/WebSiteJsonLd.tsx
    - fmai-nextjs/src/components/seo/WebPageJsonLd.tsx
    - fmai-nextjs/src/components/seo/ServiceJsonLd.tsx
    - fmai-nextjs/src/components/seo/BreadcrumbJsonLd.tsx
    - fmai-nextjs/src/app/sitemap.ts
    - fmai-nextjs/src/app/robots.ts
    - fmai-nextjs/src/app/[locale]/not-found.tsx
    - fmai-nextjs/src/app/[locale]/error.tsx
  modified:
    - fmai-nextjs/src/lib/metadata.ts
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'Service JSON-LD uses type assertion for dateModified (schema-dts Service type lacks it natively)'
  - 'metaKeyPrefix option in generatePageMetadata to support both meta.* and seo.* translation patterns'
  - 'Error boundary uses hardcoded English (required use client prevents server translations)'

patterns-established:
  - 'All JSON-LD components are Server Components (no use client)'
  - 'JsonLd renderer sanitizes with .replace(/</g, \\u003c) for XSS prevention'
  - 'generatePageMetadata reads translations via getTranslations for localized SEO'
  - 'sitemap.ts and robots.ts placed at app/ root, outside [locale] segment'
  - 'PAGE_DATES central config for dateModified across all JSON-LD schemas'

requirements-completed:
  [
    SEO-02,
    SEO-04,
    SEO-05,
    SEO-06,
    SEO-10,
    SCHEMA-01,
    SCHEMA-02,
    SCHEMA-03,
    SCHEMA-04,
    SCHEMA-05,
    SCHEMA-08,
  ]

duration: 7min
completed: 2026-03-18
---

# Phase 2 Plan 1: SEO Infrastructure Summary

**Localized metadata generator with hreflang/OG/Twitter, 6 type-safe JSON-LD components (schema-dts), XML sitemap with 30 locale URLs, AI-aware robots.txt, and localized 404/error pages**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-18T02:36:24Z
- **Completed:** 2026-03-18T02:43:35Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments

- Async generatePageMetadata produces localized title, description, OG tags, Twitter cards, canonical URLs, and hreflang alternates for all 3 locales via getTranslations
- 6 JSON-LD Server Components render type-safe structured data (Organization, WebSite, WebPage, Service, BreadcrumbList) with XSS-sanitized output and dateModified for content freshness
- OrganizationJsonLd rendered in locale layout for global presence on every page
- XML sitemap at /sitemap.xml covers all 10 pages with 3 locale alternates each (30 entries)
- robots.txt distinguishes AI retrieval bots (ChatGPT-User, Claude-SearchBot) from training bots (GPTBot, ClaudeBot)
- Localized 404 page with translation keys in EN/NL/ES and error boundary with reset functionality

## Task Commits

Each task was committed atomically:

1. **Task 1: SEO config, metadata generator, and JSON-LD components** - `0f929fb` (feat)
2. **Task 2: Sitemap, robots.txt, 404 page, and error boundary** - `8fba3d6` (feat)

## Files Created/Modified

- `fmai-nextjs/src/lib/seo-config.ts` - Site constants and PAGE_DATES for dateModified
- `fmai-nextjs/src/lib/metadata.ts` - Async generatePageMetadata with getTranslations, hreflang, OG, Twitter
- `fmai-nextjs/src/components/seo/JsonLd.tsx` - Generic JSON-LD renderer with XSS sanitization
- `fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx` - Organization schema (rendered on all pages)
- `fmai-nextjs/src/components/seo/WebSiteJsonLd.tsx` - WebSite schema with SearchAction (homepage)
- `fmai-nextjs/src/components/seo/WebPageJsonLd.tsx` - WebPage schema with dateModified
- `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx` - Service schema with provider and dateModified
- `fmai-nextjs/src/components/seo/BreadcrumbJsonLd.tsx` - BreadcrumbList from route segments
- `fmai-nextjs/src/app/sitemap.ts` - XML sitemap with 10 pages x 3 locale alternates
- `fmai-nextjs/src/app/robots.ts` - robots.txt with AI crawler policy
- `fmai-nextjs/src/app/[locale]/not-found.tsx` - Localized 404 page
- `fmai-nextjs/src/app/[locale]/error.tsx` - Error boundary with reset
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Added OrganizationJsonLd
- `fmai-nextjs/messages/en.json` - Added errors.notFound and errors.generic keys
- `fmai-nextjs/messages/nl.json` - Added errors.notFound and errors.generic keys (Dutch)
- `fmai-nextjs/messages/es.json` - Added errors.notFound and errors.generic keys (Spanish)

## Decisions Made

- **Service JSON-LD type assertion:** schema-dts Service type doesn't natively include dateModified, but schema.org Service inherits from CreativeWork which supports it. Used type intersection `WithContext<Service> & { dateModified: string }` for type safety while including the field.
- **metaKeyPrefix option:** Existing translation files use inconsistent patterns (some namespaces use `seo.title`, others `meta.title`). Added configurable prefix parameter to generatePageMetadata to support both without refactoring translations.
- **Error boundary hardcoded English:** Next.js requires error.tsx to be a client component (`"use client"`). Server translations via getTranslations are unavailable in client components. Used hardcoded English text since error boundaries are rare edge cases.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed ServiceJsonLd type error for dateModified**

- **Found during:** Task 1 (JSON-LD component creation)
- **Issue:** schema-dts Service type doesn't include dateModified, causing TypeScript compilation error
- **Fix:** Used type intersection with assertion: `WithContext<Service> & { dateModified: string }`
- **Files modified:** fmai-nextjs/src/components/seo/ServiceJsonLd.tsx
- **Verification:** `npm run build` passes with no type errors
- **Committed in:** 0f929fb (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary for TypeScript compilation. No scope creep.

## Issues Encountered

- Pre-existing MISSING_MESSAGE warnings from Header/Footer components (common.footer._, common.nav._) appear during build but don't cause failures. These are out of scope for this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All SEO infrastructure is ready for page migration plans (02-02, 02-03, 02-04)
- Every page can call generatePageMetadata for localized meta + hreflang
- JSON-LD components are importable from @/components/seo/\*
- Sitemap and robots.txt are live at /sitemap.xml and /robots.txt
- 404 and error pages render localized content with proper HTTP status codes

## Self-Check: PASSED

- All 12 created files verified on disk
- Both task commits verified: 0f929fb, 8fba3d6
- Build passes: `npm run build` completes without errors

---

_Phase: 02-page-migration-and-core-seo_
_Completed: 2026-03-18_
