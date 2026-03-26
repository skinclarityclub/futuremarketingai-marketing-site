---
phase: 04-seo-differentiation-and-geo-llmeo
plan: '01'
subsystem: seo
tags: [json-ld, faq-schema, howto-schema, geo, llmeo, structured-data, quick-answer]

requires:
  - phase: 02-seo-foundation
    provides: ServiceJsonLd, WebPageJsonLd, BreadcrumbJsonLd, seo-config.ts, generatePageMetadata
provides:
  - FaqJsonLd reusable component for FAQPage JSON-LD schema
  - HowToJsonLd component for step-based HowTo schema
  - QuickAnswerBlock UI component for GEO quick-answer definitions
  - ENTITY_DESCRIPTION constant for entity-first content
  - Visible FAQ sections on all 4 service pages (22 total Q&As)
  - HowTo structured data on How It Works page (6 steps)
  - Question-based H2 headings on service pages for GEO-05
affects: [04-02-technical-seo, content-strategy, ai-discoverability]

tech-stack:
  added: []
  patterns: [faq-visible-plus-jsonld, quick-answer-block-after-hero, question-format-h2s]

key-files:
  created:
    - fmai-nextjs/src/components/seo/FaqJsonLd.tsx
    - fmai-nextjs/src/components/seo/HowToJsonLd.tsx
    - fmai-nextjs/src/components/ui/QuickAnswerBlock.tsx
  modified:
    - fmai-nextjs/src/lib/seo-config.ts
    - fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx

key-decisions:
  - 'FAQ content hardcoded in English for Phase 4 (i18n deferred to content phase)'
  - 'Visible FAQ sections use dl/dt/dd semantic markup for accessibility'
  - 'QuickAnswerBlock placed after hero, before first body section on all service pages'

patterns-established:
  - 'FAQ pattern: const FAQ_ITEMS array + FaqJsonLd component + visible <section> with dl/dt/dd'
  - 'GEO quick-answer pattern: QuickAnswerBlock after hero for AI-citeable definitions'
  - 'Question-format H2s: replace generic headings with What/How/Why questions for GEO-05'

requirements-completed: [SCHEMA-06, SCHEMA-07, GEO-03, GEO-04, GEO-05]

duration: 5min
completed: 2026-03-18
---

# Phase 4 Plan 01: GEO Content Optimization Summary

**FAQPage and HowTo JSON-LD schema on all service pages plus QuickAnswerBlock GEO definitions and question-format H2 headings for AI discoverability**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T14:16:27Z
- **Completed:** 2026-03-18T14:21:20Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Created FaqJsonLd, HowToJsonLd, and QuickAnswerBlock reusable components
- Added ENTITY_DESCRIPTION constant to seo-config.ts for entity-first content
- All 4 service pages now have visible FAQ sections (22 total Q&As), FAQPage JSON-LD, QuickAnswerBlock, and question-format H2s
- How It Works page has HowTo JSON-LD with 6-step process schema
- Zero TypeScript errors, build succeeds cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FaqJsonLd, HowToJsonLd, QuickAnswerBlock components and update seo-config.ts** - `a2dde6c` (feat)
2. **Task 2: Add FAQPage schema + QuickAnswer blocks + GEO headings to service pages and HowTo schema to How It Works** - `dda971c` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/seo/FaqJsonLd.tsx` - Reusable FAQPage JSON-LD component
- `fmai-nextjs/src/components/seo/HowToJsonLd.tsx` - HowTo JSON-LD component for step-based pages
- `fmai-nextjs/src/components/ui/QuickAnswerBlock.tsx` - Cyan-bordered definition block for GEO quick-answers
- `fmai-nextjs/src/lib/seo-config.ts` - Added ENTITY_DESCRIPTION constant
- `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx` - QuickAnswer + 5 FAQ items + 3 question-format H2s
- `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx` - QuickAnswer + 6 FAQ items + 2 question-format H2s
- `fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx` - QuickAnswer + 5 FAQ items + 2 question-format H2s
- `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx` - QuickAnswer + 6 FAQ items + 2 question-format H2s
- `fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx` - HowToJsonLd with 6 steps

## Decisions Made

- FAQ content hardcoded in English for Phase 4 -- i18n translation deferred to content phase
- Visible FAQ sections use dl/dt/dd semantic markup for accessibility and screen readers
- QuickAnswerBlock placed after hero section, before first body section on all service pages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All GEO content optimization complete for service pages
- Ready for Plan 02 (technical SEO: sitemap, robots, canonical, metadata refinement)
- FAQ content can be i18n-ized in a future content translation phase

## Self-Check: PASSED

- All 3 created files verified on disk
- Both task commits (a2dde6c, dda971c) found in git log

---

_Phase: 04-seo-differentiation-and-geo-llmeo_
_Completed: 2026-03-18_
