---
phase: 02-page-migration-and-core-seo
plan: 02
subsystem: ui
tags: [server-components, semantic-html, header, footer, glass-card, cta-button, i18n, next-intl]

requires:
  - phase: 01-foundation-and-infrastructure
    provides: 'Next.js scaffold, Tailwind v4 tokens, next-intl routing, Providers wrapper'
provides:
  - 'Header Server Component with semantic <header>/<nav> and locale switcher client island'
  - 'Footer Server Component with semantic <footer>/<nav> and 3-column layout'
  - 'PageShell wrapper with semantic <main> and consistent spacing'
  - 'GlassCard Server Component with glass-morphism styling'
  - 'CTAButton Server Component with primary/secondary/ghost variants and locale-aware Link'
  - 'SectionHeading Server Component enforcing h2 hierarchy with aria-labelledby support'
affects: [02-03, 02-04, 03-interactivity, all-page-migrations]

tech-stack:
  added: []
  patterns:
    - 'Server Components for static layout/UI (no "use client" unless needed)'
    - 'Client island pattern: HeaderClient for interactive locale switcher'
    - 'Semantic HTML structure: <header>, <nav>, <footer>, <main>'
    - 'Polymorphic Server Components (GlassCard as prop)'
    - 'Shared translation namespace (common.nav.*, common.footer.*) for layout i18n'

key-files:
  created:
    - fmai-nextjs/src/components/layout/Header.tsx
    - fmai-nextjs/src/components/layout/HeaderClient.tsx
    - fmai-nextjs/src/components/layout/Footer.tsx
    - fmai-nextjs/src/components/layout/PageShell.tsx
    - fmai-nextjs/src/components/ui/GlassCard.tsx
    - fmai-nextjs/src/components/ui/CTAButton.tsx
    - fmai-nextjs/src/components/ui/SectionHeading.tsx
  modified:
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json
    - fmai-nextjs/src/app/[locale]/page.tsx

key-decisions:
  - 'Navigation keys placed under common.nav.* namespace for shared use by Header and Footer'
  - 'HeaderClient as minimal client island containing only locale switcher (no mobile menu yet)'
  - 'CTAButton renders as Link (internal), <a> (external), or <button> (no href) -- polymorphic'

patterns-established:
  - 'Layout components in components/layout/ directory'
  - 'UI primitives in components/ui/ directory'
  - 'Server Components by default for all static UI'
  - 'Client islands only for interactive state (locale switcher, future mobile menu)'

requirements-completed: [SEO-07, SEO-08]

duration: 5min
completed: 2026-03-18
---

# Phase 2 Plan 2: Shared UI Components Summary

**Header/Footer layout with semantic HTML (<header>, <nav>, <footer>, <main>), GlassCard/CTAButton/SectionHeading UI primitives, and locale switcher client island**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T02:36:08Z
- **Completed:** 2026-03-18T02:41:32Z
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments

- Header as Server Component with semantic `<header>`/`<nav>`, floating glass style, and 7 navigation links across all 3 locales
- Footer as Server Component with semantic `<footer>`/`<nav>` in 3-column layout (Company, Services, Legal)
- HeaderClient as minimal client island for EN/NL/ES locale switcher preserving current path
- PageShell wrapper providing semantic `<main>` with consistent spacing for fixed header
- GlassCard, CTAButton, SectionHeading as pure Server Components (zero client JS)
- All components integrated into [locale]/layout.tsx for automatic rendering on every page

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Header, Footer, and PageShell as Server Components** - `0f929fb` (feat)
2. **Task 2: Migrate GlassCard, CTAButton, and SectionHeading UI components** - `ec63095` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/layout/Header.tsx` - Server Component header with semantic nav, floating glass style
- `fmai-nextjs/src/components/layout/HeaderClient.tsx` - Client island for locale switcher (EN/NL/ES)
- `fmai-nextjs/src/components/layout/Footer.tsx` - Server Component footer with 3-column nav layout
- `fmai-nextjs/src/components/layout/PageShell.tsx` - Semantic `<main>` wrapper with consistent padding
- `fmai-nextjs/src/components/ui/GlassCard.tsx` - Glass-morphism card, polymorphic `as` prop
- `fmai-nextjs/src/components/ui/CTAButton.tsx` - CTA with primary/secondary/ghost variants, locale-aware Link
- `fmai-nextjs/src/components/ui/SectionHeading.tsx` - h2 heading with id for aria-labelledby
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Added Header and Footer to layout tree
- `fmai-nextjs/messages/en.json` - Added common.nav._ and common.footer._ keys
- `fmai-nextjs/messages/nl.json` - Added Dutch nav/footer translations
- `fmai-nextjs/messages/es.json` - Added Spanish nav/footer translations

## Decisions Made

- **Navigation keys in common namespace:** Placed under `common.nav.*` and `common.footer.*` so both Header and Footer share the same translation keys without duplication.
- **HeaderClient minimal scope:** Only the locale switcher needs client hooks (`usePathname`, `useRouter`). Mobile menu toggle deferred to Phase 3 interactive features.
- **CTAButton polymorphic rendering:** Renders as `Link` for internal hrefs, `<a>` for external, or `<button>` for actions -- determined by `href` prop presence and value.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed page.tsx generateMetadata to match updated PageMetadataOptions interface**

- **Found during:** Task 1 (build verification)
- **Issue:** page.tsx called `generatePageMetadata({ title, description, locale, path })` but metadata.ts was refactored (from prior plan) to use `{ locale, namespace, path }` interface
- **Fix:** Updated page.tsx to use `{ locale, namespace: "hero", path: "/" }` and added `hero.meta.title`/`hero.meta.description` translation keys
- **Files modified:** `src/app/[locale]/page.tsx`, all 3 message files
- **Verification:** `npm run build` passes
- **Committed in:** 0f929fb (Task 1 commit)

**2. [Rule 3 - Blocking] Committed prior uncommitted SEO components from Plan 01-02**

- **Found during:** Task 1 (layout references OrganizationJsonLd)
- **Issue:** SEO components (OrganizationJsonLd, seo-config.ts, etc.) existed on disk from prior plan execution but were never git-committed
- **Fix:** Included untracked seo/ and types/ files in Task 1 commit
- **Files modified:** src/components/seo/_, src/lib/seo-config.ts, src/types/_
- **Verification:** Build passes with all imports resolved
- **Committed in:** 0f929fb (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary to unblock build. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All shared layout and UI components are available for page migration plans
- Header/Footer render automatically on every page via layout.tsx
- GlassCard, CTAButton, SectionHeading ready for use in Plans 02-03 and 02-04
- PageShell available for individual page wrappers if needed

---

_Phase: 02-page-migration-and-core-seo_
_Completed: 2026-03-18_

## Self-Check: PASSED

- All 7 created component files verified on disk
- Both task commits verified: 0f929fb, ec63095
- Build passes: `npm run build` completes without errors
