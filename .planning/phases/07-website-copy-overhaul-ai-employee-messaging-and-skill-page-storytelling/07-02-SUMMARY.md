---
phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling
plan: 02
subsystem: ui
tags: [copy, messaging, clyde, homepage, header, i18n, next-intl]

requires:
  - phase: 07-01
    provides: Translation architecture with full i18n on all 8 skill pages
provides:
  - Clyde-centric English homepage copy in en.json home namespace
  - Meet Clyde CTA routing to /skills/chatbot
  - Header SKILL_ITEMS with Clyde-referenced descriptions
affects: [07-03, 07-04]

tech-stack:
  added: []
  patterns: [wow-then-human-comparison-then-results messaging hierarchy]

key-files:
  created: []
  modified:
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/src/app/[locale]/page.tsx
    - fmai-nextjs/src/components/layout/HeaderClient.tsx

key-decisions:
  - "Clyde introduced by name in hero headline: 'Meet Clyde. Your AI Marketing Employee.'"
  - 'FAQ rewritten with 5 Clyde-specific questions (what is Clyde, brand learning, multi-client, mistakes, vs ChatGPT)'
  - "Header CTA changed from 'See Our Work' to 'Meet Clyde' linking to /skills/chatbot"
  - 'Stats updated to Clyde-relevant metrics: 24/7 availability, 6 skills, 160+ content pieces, <2min response'

patterns-established:
  - 'Clyde messaging: wow first (capability) -> human comparison (24/7, no sick days) -> results (metrics)'
  - "Clyde as colleague, not tool: 'Clyde writes/calls/scores/creates' action verb pattern"

requirements-completed: [WEB-01]

duration: 4min
completed: 2026-03-20
---

# Phase 7 Plan 2: Homepage and Header Clyde Messaging Summary

**Complete English homepage copy rewrite introducing Clyde by name with wow-first messaging hierarchy, plus Clyde-referenced header skill descriptions and Meet Clyde CTA routing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-20T22:38:33Z
- **Completed:** 2026-03-20T22:42:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Homepage hero introduces Clyde by name with "Meet Clyde. Your AI Marketing Employee." headline
- All 6 service cards, 4 trust cards, 4 stats, 6 badges, CTA, and 5 FAQ items rewritten with Clyde-centric language
- Header SKILL_ITEMS (8 skills) all reference Clyde with action verb descriptions
- Primary CTA "Meet Clyde" routes to /skills/chatbot across homepage and header

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite homepage English copy with Clyde messaging** - `95b6bce` (feat)
2. **Task 2: Update header navigation with Clyde skill descriptions** - `014d256` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified

- `fmai-nextjs/messages/en.json` - Complete home namespace rewrite with 32 Clyde references
- `fmai-nextjs/src/app/[locale]/page.tsx` - Hero CTA to /skills/chatbot, secondary CTA to /contact, final CTA to /skills/chatbot
- `fmai-nextjs/src/components/layout/HeaderClient.tsx` - 8 SKILL_ITEMS descriptions + CTA button text updated

## Decisions Made

- Hero headline split: "Meet Clyde." (main) + "Your AI Marketing Employee." (accent) for maximum impact
- FAQ completely rewritten with 5 new Clyde-specific questions replacing generic AI employee questions
- Stats changed from vanity metrics to Clyde-relevant: 24/7 availability, 6 skills, 160+ content pieces/month, <2min response time
- Trust cards reframed from business benefits to Clyde's attributes: always-on, continuous learning, multi-client, enterprise backbone
- Header CTA changed from "See Our Work" (portfolio link) to "Meet Clyde" (demo link at /skills/chatbot)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- English homepage and header fully Clyde-branded, ready for Plan 03 (skill page storytelling)
- NL/ES translations needed in Plan 04 to match the new English copy
- All translation keys remain structurally identical, so NL/ES rewrites can follow the same key structure

---

_Phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling_
_Completed: 2026-03-20_
