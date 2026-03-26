---
phase: 02-page-migration-and-core-seo
plan: 04
subsystem: pages
tags:
  [
    server-components,
    semantic-html,
    json-ld,
    breadcrumbs,
    i18n,
    contact-form,
    legal,
    pricing,
    about,
    how-it-works,
  ]

requires:
  - phase: 02-01
    provides: 'SEO infrastructure: generatePageMetadata, JSON-LD components, seo-config'
  - phase: 02-02
    provides: 'Shared UI: Header, Footer, PageShell, GlassCard, CTAButton, SectionHeading'
provides:
  - 'About page with company info, mission, timeline, CTA and WebPage + BreadcrumbList JSON-LD'
  - 'Pricing page with 3 gateway tier cards (EUR 1,497 / 2,497 / 3,997) and WebPage JSON-LD'
  - 'How It Works page with 6 numbered process steps in semantic <ol> and WebPage JSON-LD'
  - 'Contact page with accessible form (4 fields, <label htmlFor>) and direct contact info'
  - 'Legal page with 4 legal sections in <article> wrapper and WebPage JSON-LD'
  - 'All 5 pages have localized metadata, BreadcrumbList, and semantic HTML in 3 locales'
affects: [03-interactivity, contact-form-handler, legal-content-updates]

tech-stack:
  added: []
  patterns:
    - 'Route group (marketing) for About/Pricing/How It Works/Contact pages'
    - 'Route group (legal) for Legal page'
    - 'Static contact form (no action handler) for Phase 3 enhancement'
    - 'Numbered step list with <ol> for semantic step ordering'
    - 'Pricing tiers with indexed translation keys (features_0..features_4)'

key-files:
  created:
    - fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx
    - fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx
  modified:
    - fmai-nextjs/src/lib/seo-config.ts
    - fmai-nextjs/src/components/layout/Footer.tsx

key-decisions:
  - 'Pricing tiers use indexed keys (features_0..features_4) instead of arrays for next-intl compatibility'
  - 'Contact form is static HTML with no action handler -- Phase 3 will add the Route Handler'
  - 'Legal page consolidates all legal content on a single page rather than separate routes'

patterns-established:
  - 'All supporting pages follow identical pattern: generateMetadata + generateStaticParams + setRequestLocale + WebPageJsonLd + BreadcrumbJsonLd + PageShell'
  - 'Contact form uses semantic HTML with <label htmlFor> for accessibility'
  - 'Legal content wrapped in <article> with max-w-3xl for readability'

requirements-completed: [SCHEMA-03, SCHEMA-05, PAGE-06, PAGE-07, PAGE-08, PAGE-09, PAGE-10, PAGE-11]

duration: 19min
completed: 2026-03-18
---

# Phase 2 Plan 4: Supporting Pages Migration Summary

**5 supporting pages (About, Pricing, How It Works, Contact, Legal) migrated to Next.js Server Components with WebPage + BreadcrumbList JSON-LD, gateway pricing tiers, accessible contact form, and semantic HTML across 3 locales**

## Performance

- **Duration:** 19 min
- **Started:** 2026-03-18T02:47:19Z
- **Completed:** 2026-03-18T03:06:21Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- About page with hero, mission, 3-era timeline, and founding teams CTA -- fully server-rendered with WebPage and BreadcrumbList JSON-LD
- Pricing page with 3 gateway tier cards (Starter EUR 1,497, Growth EUR 2,497, Scale EUR 3,997) in a responsive 3-column grid with highlighted "Most Popular" badge
- How It Works page with 6 numbered process steps in semantic ordered list and continuous loop indicator
- Contact page with accessible form (name, email, company, message fields with `<label htmlFor>`) and direct contact information cards
- Legal page with 4 sections (Terms, Privacy, Cookies, Disclaimer) in `<article>` wrapper at max-w-3xl for readable prose layout
- All 5 pages generate static HTML for 3 locales (15 total pages), completing the full 10-page site migration

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate About, Pricing, and How It Works pages** - `57cb04b` (feat)
2. **Task 2: Migrate Contact and Legal pages** - `d457390` (feat)

## Files Created/Modified

- `fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx` - About page with hero, mission, timeline, CTA
- `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx` - Pricing page with 3 tier cards and EUR pricing
- `fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx` - How It Works with 6 process steps in `<ol>`
- `fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx` - Contact form with 4 accessible fields and direct contact info
- `fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx` - Legal page with 4 sections in `<article>` wrapper
- `fmai-nextjs/src/lib/seo-config.ts` - Added how-it-works and legal page dates
- `fmai-nextjs/src/components/layout/Footer.tsx` - Fixed translation key for all_rights_reserved

## Decisions Made

- **Pricing tiers use indexed keys:** next-intl does not natively iterate arrays from translation files. Used `features_0` through `features_4` pattern with `Array.from({ length: FEATURE_COUNT })` to render features in a type-safe way.
- **Static contact form:** Form renders with semantic HTML but has no action handler. Phase 3 will add the Route Handler for form submission. This keeps the migration scope clean.
- **Single legal page:** Consolidated Terms, Privacy, Cookies, and Disclaimer onto one page instead of the Vite approach of separate routes per legal document. Simpler URL structure and indexability.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Footer translation key mismatch**

- **Found during:** Task 1 (build verification)
- **Issue:** Footer component used `t('footer.all_rights_reserved')` but the translation key in en.json was `common.footer_all_rights` (underscore, not nested)
- **Fix:** Changed Footer to use `t('footer_all_rights')` to match the existing translation key
- **Files modified:** fmai-nextjs/src/components/layout/Footer.tsx
- **Verification:** `npm run build` passes without MISSING_MESSAGE errors
- **Committed in:** 57cb04b (Task 1 commit)

**2. [Rule 3 - Blocking] Added missing page dates to seo-config**

- **Found during:** Task 1 (page creation)
- **Issue:** seo-config.ts PAGE_DATES map was missing `/how-it-works` and `/legal` entries, causing WebPageJsonLd to fall back to homepage date
- **Fix:** Added both entries with date `2026-03-18`
- **Files modified:** fmai-nextjs/src/lib/seo-config.ts
- **Committed in:** 57cb04b (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes necessary for correct build and accurate JSON-LD dates. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 10 pages are now migrated to Next.js (5 service + 5 supporting)
- Phase 2 page migration is complete -- 30 static pages across 3 locales
- Contact form ready for Phase 3 Route Handler integration
- Legal page ready for content updates as needed
- All pages have WebPage + BreadcrumbList JSON-LD for search engine indexability

## Self-Check: PASSED

- All 5 created page files verified on disk
- Both task commits verified: 57cb04b, d457390
- Build passes: `npm run build` generates 30+ static pages across 3 locales

---

_Phase: 02-page-migration-and-core-seo_
_Completed: 2026-03-18_
