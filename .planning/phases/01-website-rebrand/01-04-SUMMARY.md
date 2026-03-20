---
phase: 01-website-rebrand
plan: 04
subsystem: i18n
tags: [next-intl, locale, translations, skills, founding-member, how-it-works]

requires:
  - phase: 01-website-rebrand (01-02)
    provides: Skill page route files and founding-member page route file referencing translation namespaces
  - phase: 01-website-rebrand (01-01)
    provides: Core copy rebrand with how-it-works 4-step locale keys
provides:
  - 7 new translation namespaces (6 skills + founding-member) in EN, NL, ES
  - Fixed how-it-works STEP_KEYS to match 4-step agent onboarding flow
  - All skill pages and founding-member page now render with full content
affects: [01-05-PLAN, phase-2-dashboard]

tech-stack:
  added: []
  patterns: [skill-page-namespace-pattern, founding-member-namespace-pattern]

key-files:
  created: []
  modified:
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json
    - fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx

key-decisions:
  - 'All 7 namespaces use identical key structures across EN/NL/ES (29 keys per skill, 39 keys for founding-member)'
  - 'HowToJsonLd updated to describe 4-step agent onboarding instead of old 6-step process'

patterns-established:
  - 'Skill namespace pattern: meta, hero, features.items.{key}, how_it_works.steps.{key}, use_cases.items.{key}, cta'
  - 'Founding-member namespace pattern: meta, hero, pricing, benefits.items.{key}, faq.items.{key}, cta'

requirements-completed: [WEB-03, WEB-05, WEB-14]

duration: 11min
completed: 2026-03-20
---

# Phase 1 Plan 04: Gap Closure Summary

**7 translation namespaces (6 skills + founding-member) added across EN/NL/ES with 4-step how-it-works STEP_KEYS fix**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-20T18:19:35Z
- **Completed:** 2026-03-20T18:30:45Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added 6 skill-page namespaces (skills-content-creator, skills-voice-agent, skills-lead-qualifier, skills-social-media, skills-ad-creator, skills-reporting) to all 3 locale files with agency-focused AaaS content
- Added founding-member namespace with pricing, 6 benefits, 5 FAQ items, and CTAs to all 3 locale files
- Fixed how-it-works STEP_KEYS from 6 old steps (research/content/workflow/publishing/learning/ads) to 4 agent onboarding steps (choose/activate/connect/working)
- Updated HowToJsonLd structured data to describe 4-step agent onboarding
- Verified exact key parity: 29 keys per skill namespace, 39 keys for founding-member across EN/NL/ES
- No MISSING_MESSAGE errors in build output

## Task Commits

Each task was committed atomically:

1. **Task 1: Add 7 missing namespaces to EN locale and fix how-it-works STEP_KEYS** - `6b1ef85` (feat)
2. **Task 2: Add 7 missing namespaces to NL and ES locales** - `3eac90b` (feat)

## Files Created/Modified

- `fmai-nextjs/messages/en.json` - Added 7 new top-level namespaces (skills + founding-member)
- `fmai-nextjs/messages/nl.json` - Added 7 new namespaces with Dutch translations
- `fmai-nextjs/messages/es.json` - Added 7 new namespaces with Spanish translations
- `fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx` - Fixed STEP_KEYS and HOW_TO_STEPS arrays, updated HowToJsonLd

## Decisions Made

- All 7 namespaces follow identical key structures across locales for strict parity
- HowToJsonLd description updated from "6-step process" to "4-step agent onboarding process" to match new content

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing build error in `fmai-nextjs/src/lib/chatbot/tools/ecommerce-tools.ts` (PRODUCT_CATALOG export missing) causes build failure unrelated to this plan's changes. Logged to `deferred-items.md`. No MISSING_MESSAGE translation errors found.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 skill pages now render with full localized content in EN, NL, ES
- Founding-member page renders with pricing, benefits, FAQ in all 3 locales
- How-it-works page shows correct 4-step agent onboarding flow
- Phase 1 Plan 05 (chatbot persona engines) is the final remaining plan
- Pre-existing chatbot build error should be addressed before or during Plan 05

---

_Phase: 01-website-rebrand_
_Completed: 2026-03-20_
