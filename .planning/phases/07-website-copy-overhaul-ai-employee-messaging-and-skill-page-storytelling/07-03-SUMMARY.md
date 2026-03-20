---
phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling
plan: 03
subsystem: copy
tags: [clyde, messaging, skill-pages, task-demo, pricing]

requires:
  - phase: 07-website-copy-overhaul
    provides: Translation architecture fix (07-01), Homepage/header Clyde rewrite (07-02)
provides:
  - All 8 skill pages with Clyde-centric messaging and task_demo sections
  - Per-skill pricing replaced with link to /pricing
  - "Meet Clyde" CTAs on all skill pages
affects: [07-04, nl-rewrite, es-rewrite]

tech-stack:
  added: []
  patterns:
    [
      task-demo-section-pattern,
      simplified-pricing-cta-pattern,
      dual-cta-pattern,
    ]

key-files:
  created: []
  modified:
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/src/app/[locale]/(skills)/skills/content-creator/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/voice-agent/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/social-media/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/ad-creator/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/reporting/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/chatbot/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/email/page.tsx

key-decisions:
  - 'Per-skill pricing tiers replaced with simplified CTA linking to /pricing to avoid conflict with AaaS agent tier pricing'
  - 'Task-demo section uses GlassCard with accent-system (You) and #00FF88 green (Clyde) color coding'
  - '"Meet Clyde" primary CTA routes to /skills/chatbot where DemoPlayground lives'
  - '"Book a Strategy Call" secondary CTA routes to /contact'
  - 'PricingTiers component import removed from pages that no longer render it'

requirements-completed: [WEB-01]

duration: 16min
completed: 2026-03-20
---

# Phase 7 Plan 3: Skill Pages Clyde Rewrite + Task-Demo Sections Summary

**All 8 skill page EN copy rewritten with Clyde storytelling plus task-result demo sections showing concrete example commands and responses**

## Performance

- **Duration:** 16 min
- **Started:** 2026-03-20T22:39:07Z
- **Completed:** 2026-03-20T22:55:49Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- All 8 skill namespaces in en.json rewritten with Clyde-centric messaging: hero titles ("Clyde Writes Your Content", "Clyde Calls Your Leads"), features describe what Clyde does, how-it-works reframed as working with Clyde, use cases show agency scenarios
- Added task_demo keys to all 8 skill namespaces with skill-specific example commands from CONTEXT.md and detailed Clyde responses showing competence
- Per-skill pricing tiers (EUR 497-2,497 per skill) replaced with simplified CTA linking to /pricing page to avoid conflict with AaaS agent tier pricing (EUR 997-3,497)
- Task-demo UI section added to all 8 skill pages with "You:" command bubble and "Clyde:" response bubble using GlassCard components
- All CTAs updated: primary "Meet Clyde" -> /skills/chatbot, secondary "Book a Strategy Call" -> /contact
- Trust metrics rewritten to reference Clyde's track record
- Unused PricingTiers imports removed from pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite all 8 skill namespace English copy with Clyde messaging** - `57d0d88` (feat)
2. **Task 2: Add task-demo UI section to all 8 skill pages** - `061de4e` (feat)

## Files Created/Modified

- `fmai-nextjs/messages/en.json` - All 8 skill namespaces rewritten with Clyde messaging + task_demo keys + simplified pricing
- `fmai-nextjs/src/app/[locale]/(skills)/skills/content-creator/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons, removed PricingTiers import
- `fmai-nextjs/src/app/[locale]/(skills)/skills/voice-agent/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons, removed PricingTiers import
- `fmai-nextjs/src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons, removed PricingTiers import
- `fmai-nextjs/src/app/[locale]/(skills)/skills/social-media/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons, removed PricingTiers import
- `fmai-nextjs/src/app/[locale]/(skills)/skills/ad-creator/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons
- `fmai-nextjs/src/app/[locale]/(skills)/skills/reporting/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons
- `fmai-nextjs/src/app/[locale]/(skills)/skills/chatbot/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons, removed PricingTiers import
- `fmai-nextjs/src/app/[locale]/(skills)/skills/email/page.tsx` - Task-demo section, simplified pricing CTA, dual CTA buttons, removed PricingTiers import

## Decisions Made

- Per-skill pricing tiers removed in favor of simplified CTA to /pricing page (avoids EUR 497/597/997 per-skill vs EUR 997/1,497/1,997/3,497 agent tier confusion)
- Task-demo section placed after features section for optimal page flow (wow -> features -> see it in action -> how it works)
- "Meet Clyde" CTA routes to /skills/chatbot (has DemoPlayground interactive demo, the closest "meeting Clyde" experience)
- Secondary "Book a Strategy Call" CTA added to all skill pages for different buyer stages
- Trust metrics heading changed from "Results That Speak" to "Clyde's Track Record" for consistency with Clyde positioning

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 8 skill pages have Clyde storytelling in English, ready for NL/ES native rewrites in plan 07-04
- Task-demo section pattern established and consistent across all pages

---

_Phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling_
_Completed: 2026-03-20_
