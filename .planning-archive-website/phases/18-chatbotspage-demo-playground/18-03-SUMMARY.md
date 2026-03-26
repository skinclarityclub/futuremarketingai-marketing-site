---
phase: 18-chatbotspage-demo-playground
plan: 03
subsystem: ui
tags: [react, i18n, chatbot, demo-playground, scroll-to-tab, page-restructure]

requires:
  - phase: 18-chatbotspage-demo-playground
    provides: DemoPlayground, PersonaSelector, DemoContextCard, ProgressiveCTA, MultiPlatformShowcase components
provides:
  - Restructured ChatbotsPage with live demo playground as primary section
  - Hero CTA scroll-to-demo integration
  - Use case cards scroll-to-tab coordination
  - Full EN/NL/ES i18n for demo playground, multi-platform showcase, and updated hero
affects: [19-homepage-concierge-demo-guide]

tech-stack:
  added: []
  patterns:
    - scrollIntoView with requestAnimationFrame for post-render scroll targeting
    - USE_CASE_TO_PERSONA mapping for cross-section tab coordination

key-files:
  created: []
  modified:
    - src/pages/ChatbotsPage.tsx
    - public/locales/en/chatbots.json
    - public/locales/nl/chatbots.json
    - public/locales/es/chatbots.json

key-decisions:
  - 'Hero CTA uses scrollIntoView to #demo-playground instead of route navigation'
  - 'Use case cards map to persona IDs via USE_CASE_TO_PERSONA Record for scroll-to-tab'

patterns-established:
  - 'Cross-section coordination: use case cards trigger tab change + scroll via lifted state + requestAnimationFrame'

requirements-completed: [REQ-CHATBOT-PLAYGROUND]

duration: 4min
completed: 2026-03-13
---

# Phase 18 Plan 03: Page Integration & i18n Summary

**ChatbotsPage restructured with DemoPlayground + MultiPlatformShowcase wired in, hero scroll-to-demo CTA, use case scroll-to-tab links, and full EN/NL/ES i18n coverage**

## Performance

- **Duration:** 4 min (continuation from checkpoint approval)
- **Started:** 2026-03-13T19:45:00Z
- **Completed:** 2026-03-13T19:49:30Z
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 4

## Accomplishments

- Updated hero i18n keys across EN/NL/ES with new demo-focused copy ("Experience AI Chatbots in Action", "Try a Demo Below")
- Restructured ChatbotsPage section order: Hero -> DemoPlayground + ProgressiveCTA -> MultiPlatformShowcase -> UseCases -> Process -> Pricing -> FAQ -> FinalCTA
- Hero CTA scrolls smoothly to demo playground section
- Use case cards (customer_service, lead_qualification, faq_automation) scroll to matching demo tab
- Product Demo Media section removed and replaced by DemoPlayground
- User verified complete visual rendering including tab switching, i18n, and responsive layout

## Task Commits

Each task was committed atomically:

1. **Task 1: Add i18n keys for demo playground to EN/NL/ES chatbots.json** - `52e885d` (feat)
2. **Task 2: Restructure ChatbotsPage and update barrel exports** - `9de88bc` (feat)
3. **Task 3: Visual verification of complete demo playground** - checkpoint:human-verify (approved)

## Files Created/Modified

- `public/locales/en/chatbots.json` - Updated hero keys, added demo and multi_platform i18n sections (EN)
- `public/locales/nl/chatbots.json` - Updated hero keys, added demo and multi_platform i18n sections (NL)
- `public/locales/es/chatbots.json` - Updated hero keys, added demo and multi_platform i18n sections (ES)
- `src/pages/ChatbotsPage.tsx` - Restructured with DemoPlayground, MultiPlatformShowcase, ProgressiveCTA, scroll-to-tab, removed ProductMedia

## Decisions Made

- Hero CTA uses scrollIntoView to #demo-playground instead of route navigation -- keeps users on page for immediate demo engagement
- Use case cards map to persona IDs via USE_CASE_TO_PERSONA Record for scroll-to-tab coordination
- requestAnimationFrame wraps scrollIntoView after setActiveTab to ensure React has rendered tab change before scrolling

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ChatbotsPage demo playground fully functional with all 3 persona demos
- Phase 18 complete -- all 3 plans executed
- Ready for Phase 19 (Homepage Concierge Demo Guide)

---

_Phase: 18-chatbotspage-demo-playground_
_Completed: 2026-03-13_

## Self-Check: PASSED
