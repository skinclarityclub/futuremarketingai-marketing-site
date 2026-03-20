---
phase: 01-website-rebrand
plan: 05
subsystem: ui
tags: [chatbot, personas, i18n, agency-positioning]

requires:
  - phase: 01-website-rebrand/01-03
    provides: DemoPlayground UI labels updated to agency personas (Client Onboarding, Content Creation, ROI Calculator)
provides:
  - 3 chatbot persona engine configs rewritten for agency use cases (Onboarding Assistant, Content Creator, ROI Calculator)
  - 3 knowledge bases updated with agency domain content (onboarding, content strategy, ROI calculations)
  - Trilingual starter prompts (EN/NL/ES) for all 3 personas
affects: [chatbot-demo, demo-playground]

tech-stack:
  added: []
  patterns:
    - 'PersonaConfig contract preserved: id, tools, registerPersona unchanged for backward compatibility'

key-files:
  created: []
  modified:
    - fmai-nextjs/src/lib/chatbot/personas/ecommerce.ts
    - fmai-nextjs/src/lib/chatbot/personas/leadgen.ts
    - fmai-nextjs/src/lib/chatbot/personas/support.ts
    - fmai-nextjs/src/lib/chatbot/knowledge/ecommerce-kb.ts
    - fmai-nextjs/src/lib/chatbot/knowledge/leadgen-kb.ts
    - fmai-nextjs/src/lib/chatbot/knowledge/support-kb.ts

key-decisions:
  - 'Kept persona IDs unchanged (ecommerce, leadgen, support) for DemoPlayground compatibility'
  - 'Increased maxTokens for Content Creator (600) and ROI Calculator (600) to accommodate sample content and calculations'
  - 'Set Content Creator temperature to 0.8 for creative output, ROI Calculator to 0.5 for precise calculations'

patterns-established: []

requirements-completed: [WEB-15]

duration: 5min
completed: 2026-03-20
---

# Phase 1 Plan 5: Chatbot Persona Engine Rewrite Summary

**3 chatbot persona engines rewritten from skincare/SaaS/support to agency Onboarding Assistant, Content Creator, and ROI Calculator with trilingual starter prompts and domain-specific knowledge bases**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-20T18:19:54Z
- **Completed:** 2026-03-20T18:24:43Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Replaced Skincare Advisor persona with Onboarding Assistant that guides agencies through brand ingestion and workspace setup
- Replaced Sales Assistant persona with Content Creator that generates sample blog posts, social content, and newsletters from client briefs
- Replaced Support Agent persona with ROI Calculator that compares AI employee costs vs. hiring for agencies
- Updated all 3 knowledge bases with agency-relevant domain content (onboarding steps, content types/strategy, pricing tiers/cost benchmarks)
- All starter prompts in EN/NL/ES reference agency scenarios

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite ecommerce persona as Onboarding Assistant** - `4120424` (feat)
2. **Task 2: Rewrite leadgen and support personas for Content Creator and ROI Calculator** - `5e32d54` (feat)

## Files Created/Modified

- `fmai-nextjs/src/lib/chatbot/personas/ecommerce.ts` - Onboarding Assistant persona with agency onboarding system prompt
- `fmai-nextjs/src/lib/chatbot/personas/leadgen.ts` - Content Creator persona with content generation system prompt
- `fmai-nextjs/src/lib/chatbot/personas/support.ts` - ROI Calculator persona with cost comparison system prompt
- `fmai-nextjs/src/lib/chatbot/knowledge/ecommerce-kb.ts` - Onboarding steps, skills, brand voice, client management, content calendar topics
- `fmai-nextjs/src/lib/chatbot/knowledge/leadgen-kb.ts` - Content types, strategy, SEO, brand voice adaptation, calendar planning topics
- `fmai-nextjs/src/lib/chatbot/knowledge/support-kb.ts` - Pricing tiers, cost benchmarks, time benchmarks, ROI calculations, founding member program topics

## Decisions Made

- Kept persona IDs unchanged (ecommerce, leadgen, support) so DemoPlayground references continue to work without modification
- Increased maxTokens for Content Creator (500 to 600) and ROI Calculator (500 to 600) to allow room for content samples and calculation breakdowns
- Set Content Creator temperature to 0.8 (higher creativity for content generation) and ROI Calculator to 0.5 (precision for calculations)
- Kept existing tool references unchanged (tools work generically for demo purposes)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 (Website Rebrand) is now fully complete: all 5 plans executed
- All chatbot personas aligned with agency AaaS positioning
- Ready for Phase 2 (Dashboard Reframe) which depends on Phase 1 positioning being settled

---

_Phase: 01-website-rebrand_
_Completed: 2026-03-20_
