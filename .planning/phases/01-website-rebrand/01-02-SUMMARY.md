---
phase: 01-website-rebrand
plan: 02
subsystem: ui
tags: [next-intl, next.js, routing, navigation, seo, sitemap, redirects]

# Dependency graph
requires:
  - phase: 01-website-rebrand
    provides: '01-RESEARCH.md with route patterns, component structure, and migration strategy'
provides:
  - 'Skills dropdown navigation with 6 skill links replacing Services dropdown'
  - '6 skill page routes at /skills/{slug} with full page scaffolds (hero, features, how-it-works, use-cases, CTA)'
  - 'Founding member landing page at /founding-member with pricing, benefits, FAQ'
  - '301 redirects from old service URLs to new skill URLs'
  - 'Updated sitemap with all new pages'
  - 'Updated SEO config with AaaS entity description and new PAGE_DATES'
  - 'Scaffold translations for all 7 new pages in EN/NL/ES'
affects: [01-03-PLAN, phase-2-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: ['Skill page template pattern (hero + features + how-it-works + use-cases + CTA)']

key-files:
  created:
    - 'fmai-nextjs/src/app/[locale]/(skills)/skills/content-creator/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(skills)/skills/voice-agent/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(skills)/skills/social-media/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(skills)/skills/ad-creator/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(skills)/skills/reporting/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx'
  modified:
    - 'fmai-nextjs/src/components/layout/HeaderClient.tsx'
    - 'fmai-nextjs/src/components/layout/Footer.tsx'
    - 'fmai-nextjs/next.config.ts'
    - 'fmai-nextjs/src/app/sitemap.ts'
    - 'fmai-nextjs/src/lib/seo-config.ts'
    - 'fmai-nextjs/messages/en.json'
    - 'fmai-nextjs/messages/nl.json'
    - 'fmai-nextjs/messages/es.json'

key-decisions:
  - 'Kept HeaderClient.tsx navigation strings hardcoded (not translated via next-intl) per research recommendation'
  - 'Used (skills) route group with nested /skills/ folder for URL structure /skills/{slug}'
  - 'Created full scaffold translations for all 7 new pages in all 3 locales (not placeholders)'
  - "Footer section key renamed from 'services' to 'skills' for semantic clarity"

patterns-established:
  - 'Skill page template: generateStaticParams + generateMetadata + PageShell + WebPageJsonLd + BreadcrumbJsonLd + hero/features/how-it-works/use-cases/CTA sections'
  - 'Founding member page template: hero + pricing GlassCard + benefits grid + FAQ + CTA'

requirements-completed: [WEB-03, WEB-11, WEB-12]

# Metrics
duration: 13min
completed: 2026-03-20
---

# Phase 1 Plan 02: Navigation Restructure + Skill Routes Summary

**Skills dropdown navigation with 6 skill page routes, founding member landing page, 301 redirects from old service URLs, and updated sitemap/SEO config**

## Performance

- **Duration:** 13 min
- **Started:** 2026-03-20T16:52:09Z
- **Completed:** 2026-03-20T17:05:03Z
- **Tasks:** 2
- **Files modified:** 15 (7 created, 8 modified)

## Accomplishments

- Header navigation restructured from Services (4 items) to Skills (6 items) with updated dropdown
- 6 skill page scaffolds created with full section structure and translations in all 3 locales
- Founding member landing page with EUR 997/mo pricing, 6 benefits, FAQ, and CTA
- 301 redirects from /chatbots, /automations, /voice-agents, /marketing-machine to new skill URLs
- Sitemap updated to include all new pages and exclude old service pages
- SEO config updated with AaaS entity description and page dates

## Task Commits

Each task was committed atomically:

1. **Task 1: Restructure navigation and footer** - `b5c5721` (feat)
2. **Task 2: Create skill page routes, founding member page, redirects, and sitemap** - `84d6899` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/layout/HeaderClient.tsx` - SKILL_ITEMS array (6 skills), Skills dropdown, renamed state variables
- `fmai-nextjs/src/components/layout/Footer.tsx` - Updated to skill links, added founding member link
- `fmai-nextjs/src/app/[locale]/(skills)/skills/*/page.tsx` - 6 skill page scaffolds with hero, features, how-it-works, use-cases, CTA
- `fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx` - Founding member landing page
- `fmai-nextjs/next.config.ts` - 4 permanent redirects from old service URLs
- `fmai-nextjs/src/app/sitemap.ts` - Updated pages array with skill and founding-member URLs
- `fmai-nextjs/src/lib/seo-config.ts` - Updated ENTITY_DESCRIPTION and PAGE_DATES
- `fmai-nextjs/messages/en.json` - Scaffold translations for 7 new page namespaces + footer updates
- `fmai-nextjs/messages/nl.json` - Dutch translations for 7 new page namespaces + footer updates
- `fmai-nextjs/messages/es.json` - Spanish translations for 7 new page namespaces + footer updates

## Decisions Made

- Kept HeaderClient.tsx nav strings hardcoded English (per research: matches existing pattern, avoids scope creep)
- Created full scaffold translations rather than empty placeholders to ensure build succeeds and pages render meaningful content
- Used CTA linking to /contact for founding member page (Calendly/Stripe integration deferred to Phase 2)
- Did not delete old service page files (redirects handle the transition; cleanup deferred)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed footer translation key mismatch after linter reformatted en.json**

- **Found during:** Task 2 verification
- **Issue:** Plan 01 had already modified en.json. The linter reformatted it during Task 1 commit, reverting footer nav keys to old names while Footer component referenced new ones
- **Fix:** Re-applied the correct footer nav keys (content_creator, voice_agent, etc.) and sections.skills key
- **Files modified:** fmai-nextjs/messages/en.json
- **Verification:** Build succeeded after fix
- **Committed in:** 84d6899 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor key naming conflict caused by parallel plan execution. Fixed inline, no scope creep.

## Issues Encountered

None beyond the translation key conflict noted above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All skill page routes are live and rendering
- Founding member page is accessible
- Navigation and footer reflect AaaS positioning
- Plan 03 (Pricing page redesign + homepage updates) can proceed
- Old service pages still exist for reference but redirect to new skill pages

---

_Phase: 01-website-rebrand_
_Completed: 2026-03-20_
