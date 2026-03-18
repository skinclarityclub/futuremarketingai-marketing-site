---
phase: 06-performance-polish-and-cutover
plan: 01
subsystem: infra
tags: [next-dynamic, bundle-analyzer, lazy-loading, core-web-vitals, performance]

requires:
  - phase: 03-interactive-features
    provides: ChatWidgetIsland and CalendlyIsland client components
provides:
  - Bundle analyzer configured with ANALYZE=true env trigger
  - ClientIslands wrapper for lazy-loaded heavy client components
  - Dynamic imports removing chatbot and calendly from initial page bundle
affects: [06-performance-polish-and-cutover]

tech-stack:
  added: ['@next/bundle-analyzer']
  patterns: ['ClientIslands wrapper for ssr:false dynamic imports in Server Component layouts']

key-files:
  created:
    - fmai-nextjs/src/components/providers/ClientIslands.tsx
  modified:
    - fmai-nextjs/next.config.ts
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/package.json

key-decisions:
  - "ClientIslands 'use client' wrapper required because next/dynamic with ssr:false is disallowed in Server Components (Next.js 16)"
  - 'withAnalyze outermost in config chain: withAnalyze(withNextIntl(withMDX(nextConfig)))'

patterns-established:
  - "ClientIslands pattern: heavy client components lazy-loaded via 'use client' wrapper with next/dynamic ssr:false"

requirements-completed: [SEO-13]

duration: 5min
completed: 2026-03-18
---

# Phase 6 Plan 1: Bundle Optimization Summary

**Lazy-load ChatWidgetIsland and CalendlyIsland via next/dynamic with @next/bundle-analyzer configured for analysis**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T15:36:30Z
- **Completed:** 2026-03-18T15:41:30Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Configured @next/bundle-analyzer wrapping the existing config chain (withAnalyze outermost)
- Created ClientIslands wrapper component to lazy-load ChatWidgetIsland and CalendlyIsland with ssr:false
- Removed static imports for heavy client islands from the server layout, reducing initial page bundle
- Verified CookieConsentBanner uses position:fixed (no CLS impact)
- Production build verified: all 42 pages generate successfully

## Task Commits

Each task was committed atomically:

1. **Task 1: Install bundle analyzer and configure next.config.ts** - `f5d8461` (chore)
2. **Task 2: Dynamic import heavy client islands and verify CWV improvements** - `93bc999` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/providers/ClientIslands.tsx` - Client wrapper with dynamic imports for ChatWidgetIsland and CalendlyIsland (ssr:false)
- `fmai-nextjs/next.config.ts` - Added withBundleAnalyzer wrapping config chain, ANALYZE=true triggers treemap
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Replaced static ChatWidgetIsland/CalendlyIsland imports with ClientIslands wrapper
- `fmai-nextjs/package.json` - Added @next/bundle-analyzer dev dependency

## Decisions Made

- **ClientIslands wrapper required:** Next.js 16 disallows `next/dynamic` with `ssr: false` in Server Components. Created a `'use client'` ClientIslands component that wraps both dynamic imports, then imported that from the server layout.
- **withAnalyze outermost:** Bundle analyzer wraps the entire config chain so it can analyze all modules including MDX and i18n.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created ClientIslands wrapper for ssr:false in Server Component**

- **Found during:** Task 2 (dynamic import implementation)
- **Issue:** `next/dynamic` with `ssr: false` is not allowed in Server Components (layout.tsx). Build failed with: "ssr: false is not allowed with next/dynamic in Server Components"
- **Fix:** Created `ClientIslands.tsx` as a `'use client'` component that contains both dynamic imports with ssr:false, then imported ClientIslands from the server layout
- **Files modified:** `fmai-nextjs/src/components/providers/ClientIslands.tsx` (created), `fmai-nextjs/src/app/[locale]/layout.tsx` (modified)
- **Verification:** `npm run build` succeeds, all 42 pages generate
- **Committed in:** 93bc999

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary architectural adaptation for Next.js 16 Server Component constraints. No scope creep.

## Issues Encountered

- Next.js 16 Turbopack build output does not show First Load JS sizes per-route like webpack builds do. Bundle size comparison relies on `ANALYZE=true` treemap analysis rather than build output table.
- Pre-existing MISSING_MESSAGE translation errors for `es` locale and `capabilities_4` keys (out of scope, do not affect build success).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Bundle optimization complete, ready for Plan 02 (remaining polish and cutover tasks)
- ANALYZE=true available for future bundle size auditing

## Self-Check: PASSED

- All created/modified files verified on disk
- Commit f5d8461 (Task 1) verified in git log
- Commit 93bc999 (Task 2) verified in git log

---

_Phase: 06-performance-polish-and-cutover_
_Completed: 2026-03-18_
