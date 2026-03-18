---
phase: 01-foundation-and-infrastructure
plan: 01
subsystem: infra
tags: [next.js, tailwind-v4, next-intl, next-font, app-router, typescript]

requires: []
provides:
  - 'Next.js 16 project scaffold at fmai-nextjs/ with App Router'
  - 'Tailwind v4 design system with full Living System tokens'
  - 'next/font typography: DM Sans, JetBrains Mono, Space Grotesk'
  - 'next-intl locale routing (en, nl, es) with middleware'
  - 'generatePageMetadata utility for SEO metadata'
  - 'Route group stubs for (marketing), (services), (legal)'
affects: [01-02, 01-03, 02-page-migration, i18n, seo]

tech-stack:
  added:
    [
      next.js 16.1.7,
      next-intl,
      zustand,
      tailwind-merge,
      schema-dts,
      babel-plugin-react-compiler,
      tailwindcss 4,
    ]
  patterns:
    [
      server-components-first,
      locale-prefixed-routing,
      css-variable-fonts,
      tailwind-v4-theme-directive,
    ]

key-files:
  created:
    - fmai-nextjs/src/app/globals.css
    - fmai-nextjs/src/lib/fonts.ts
    - fmai-nextjs/src/lib/metadata.ts
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/src/app/[locale]/page.tsx
    - fmai-nextjs/src/i18n/routing.ts
    - fmai-nextjs/src/i18n/request.ts
    - fmai-nextjs/middleware.ts
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json
  modified:
    - fmai-nextjs/next.config.ts
    - fmai-nextjs/package.json
    - fmai-nextjs/src/app/layout.tsx

key-decisions:
  - 'Used middleware.ts instead of proxy.ts -- Next.js 16 still uses middleware.ts convention'
  - 'Root layout is minimal pass-through; real layout lives in [locale]/layout.tsx per next-intl pattern'
  - 'Tailwind v4 @theme directive for all design tokens instead of tailwind.config.js'

patterns-established:
  - "Server Components by default -- no 'use client' unless required"
  - "Locale routing via next-intl middleware with 'always' prefix strategy"
  - 'Design tokens via Tailwind v4 @theme CSS variables'
  - 'Font loading via next/font CSS variables referenced in @theme'
  - 'Metadata generation via shared generatePageMetadata utility'

requirements-completed: [SEO-01, SEO-09]

duration: 8min
completed: 2026-03-18
---

# Phase 1 Plan 1: Next.js Foundation Summary

**Next.js 16 scaffold with Tailwind v4 Living System tokens, next-intl locale routing (en/nl/es), and DM Sans/JetBrains Mono/Space Grotesk via next/font**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-18T01:41:21Z
- **Completed:** 2026-03-18T01:48:54Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments

- Next.js 16 project scaffolded with App Router, TypeScript, and all Phase 1 dependencies
- Full Living System design token migration from Tailwind v3 config to Tailwind v4 @theme directive (16 colors, 6 shadows, 7 animations, 3 gradients)
- Three Google Fonts loaded via next/font with zero layout shift (CSS variable approach)
- Locale-routed pages at /en/, /nl/, /es/ with server-side rendering and static generation

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 16 project and install dependencies** - `3e74d11` (feat)
2. **Task 2: Tailwind v4 design system, fonts, root layout, and metadata utility** - `ce1a023` (feat)

## Files Created/Modified

- `fmai-nextjs/next.config.ts` - Next.js config with next-intl plugin and React Compiler
- `fmai-nextjs/src/app/globals.css` - Tailwind v4 theme with all Living System design tokens
- `fmai-nextjs/src/lib/fonts.ts` - next/font setup for DM Sans, JetBrains Mono, Space Grotesk
- `fmai-nextjs/src/lib/metadata.ts` - Shared metadata generator with alternates and OpenGraph
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Root layout with font CSS variables and locale setup
- `fmai-nextjs/src/app/[locale]/page.tsx` - Homepage with translated content and token verification
- `fmai-nextjs/src/i18n/routing.ts` - Locale routing config (en, nl, es)
- `fmai-nextjs/src/i18n/request.ts` - Server-side request config for next-intl
- `fmai-nextjs/middleware.ts` - Locale detection and routing middleware
- `fmai-nextjs/messages/en.json` - English translation stubs
- `fmai-nextjs/messages/nl.json` - Dutch translation stubs
- `fmai-nextjs/messages/es.json` - Spanish translation stubs

## Decisions Made

- **middleware.ts over proxy.ts:** Plan referenced a "Next.js 16 rename" to proxy.ts, but Next.js 16.1.7 still uses `middleware.ts` as its middleware filename convention. Used the correct name.
- **Root layout pass-through:** Following next-intl pattern, root `src/app/layout.tsx` is a minimal pass-through that returns children directly; the real layout with fonts/providers lives in `[locale]/layout.tsx`.
- **Tailwind v4 @theme directive:** All design tokens defined via CSS-native `@theme` block instead of JavaScript config, following Tailwind v4 conventions.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Used middleware.ts instead of proxy.ts**

- **Found during:** Task 1 (project scaffold)
- **Issue:** Plan specified renaming middleware to proxy.ts (claiming Next.js 16 rename), but Next.js 16.1.7 MIDDLEWARE_FILENAME constant is still "middleware"
- **Fix:** Created file as middleware.ts instead of proxy.ts
- **Files modified:** middleware.ts
- **Verification:** `npm run build` succeeds, middleware detected as "Proxy (Middleware)"
- **Committed in:** 3e74d11 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary correction -- proxy.ts would not have been detected by Next.js.

## Issues Encountered

None -- both tasks completed without build or runtime errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Foundation is complete: Next.js boots, builds, and serves all 3 locales
- Ready for Plan 02 (i18n full translation migration) and Plan 03 (stores/state management)
- All design tokens validated via build -- visual verification recommended but not blocking

## Self-Check: PASSED

- All 12 created files verified on disk
- Both task commits verified: 3e74d11, ce1a023
- Build passes: `npm run build` completes without errors

---

_Phase: 01-foundation-and-infrastructure_
_Completed: 2026-03-18_
