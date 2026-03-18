---
phase: 04-seo-differentiation-and-geo-llmeo
plan: '02'
subsystem: seo
tags: [llmeo, og-image, satori, next-og, llms-txt, geo]

requires:
  - phase: 02-nextjs-migration
    provides: Next.js app structure with locale routing and middleware
provides:
  - llms.txt and llms-full.txt for AI crawler discoverability
  - Dynamic OG image generation for homepage and 4 service pages
  - Shared OgImageTemplate component for Satori rendering
  - DM Sans variable TTF font for OG image rendering
affects: [04-seo-differentiation-and-geo-llmeo]

tech-stack:
  added: [next/og, satori, DM Sans TTF]
  patterns: [opengraph-image.tsx file convention, shared OG template pattern]

key-files:
  created:
    - fmai-nextjs/public/llms.txt
    - fmai-nextjs/public/llms-full.txt
    - fmai-nextjs/public/fonts/DMSans-Variable.ttf
    - fmai-nextjs/src/lib/og-image.tsx
    - fmai-nextjs/src/app/[locale]/opengraph-image.tsx
    - fmai-nextjs/src/app/[locale]/(services)/automations/opengraph-image.tsx
    - fmai-nextjs/src/app/[locale]/(services)/chatbots/opengraph-image.tsx
    - fmai-nextjs/src/app/[locale]/(services)/voice-agents/opengraph-image.tsx
    - fmai-nextjs/src/app/[locale]/(services)/marketing-machine/opengraph-image.tsx
  modified:
    - fmai-nextjs/middleware.ts

key-decisions:
  - 'DM Sans variable TTF from Google Fonts GitHub (single file covers all weights)'
  - 'Shared OgImageTemplate with Satori-safe CSS only (no grid, no absolute positioning)'
  - 'Middleware matcher updated with opengraph-image bypass to prevent redirect loops'

patterns-established:
  - 'opengraph-image.tsx convention: per-route file with shared template + font loading'
  - 'llms.txt spec: H1, blockquote, H2-grouped absolute-URL links'

requirements-completed: [GEO-01, GEO-02, SEO-11, SEO-12]

duration: 3min
completed: 2026-03-18
---

# Phase 04 Plan 02: LLMEO and OG Image Summary

**llms.txt/llms-full.txt for AI crawler discoverability plus dynamic branded OG images via next/og Satori for homepage and 4 service pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-18T14:16:25Z
- **Completed:** 2026-03-18T14:19:35Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Created llms.txt and llms-full.txt following llmstxt.org spec for AI assistant discoverability
- Built shared OgImageTemplate with FMai brand design (dark background, cyan accent, DM Sans font)
- Added dynamic opengraph-image.tsx for homepage + all 4 service pages using next-intl translations
- Updated middleware matcher to bypass opengraph-image routes (prevents redirect loops)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create llms.txt, llms-full.txt, DM Sans font, middleware update** - `1bf8f1a` (feat)
2. **Task 2: Shared OG template + 5 opengraph-image.tsx files** - `9e8f8cf` (feat)

## Files Created/Modified

- `fmai-nextjs/public/llms.txt` - AI site map for LLM crawlers (llmstxt.org spec)
- `fmai-nextjs/public/llms-full.txt` - Expanded AI content with full page descriptions
- `fmai-nextjs/public/fonts/DMSans-Variable.ttf` - TTF font for Satori OG rendering
- `fmai-nextjs/src/lib/og-image.tsx` - Shared OgImageTemplate (Satori-safe JSX)
- `fmai-nextjs/src/app/[locale]/opengraph-image.tsx` - Root locale OG image (homepage + fallback)
- `fmai-nextjs/src/app/[locale]/(services)/automations/opengraph-image.tsx` - Automations OG image
- `fmai-nextjs/src/app/[locale]/(services)/chatbots/opengraph-image.tsx` - Chatbots OG image
- `fmai-nextjs/src/app/[locale]/(services)/voice-agents/opengraph-image.tsx` - Voice agents OG image
- `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/opengraph-image.tsx` - Marketing machine OG image
- `fmai-nextjs/middleware.ts` - Added opengraph-image bypass to matcher regex

## Decisions Made

- Used DM Sans variable TTF from Google Fonts GitHub repo (single file covers all weights, simpler than per-weight downloads)
- Shared OgImageTemplate uses only Satori-supported CSS (flex layout, no grid/absolute positioning)
- Translation namespaces with hyphens confirmed working: `voice-agents`, `marketing-machine`

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- OG images generate for all key pages with branded design
- llms.txt files serve AI crawlers with full site context
- Ready for any additional SEO/GEO plans in Phase 04

## Self-Check: PASSED

All 10 files verified present. Both task commits (1bf8f1a, 9e8f8cf) confirmed in git log.

---

_Phase: 04-seo-differentiation-and-geo-llmeo_
_Completed: 2026-03-18_
