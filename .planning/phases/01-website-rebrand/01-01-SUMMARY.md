---
phase: 01-website-rebrand
plan: 01
subsystem: i18n
tags: [next-intl, i18n, seo, copy, agency, aaas]

requires: []
provides:
  - All 3 locale files (EN/NL/ES) rewritten for AaaS agency positioning
  - SEO config updated with AaaS entity description
  - Homepage page.tsx updated with new skill cards, stats, badges arrays
  - Pricing tiers (4 agent tiers) established in translation files
  - 6 skill names established across all locales
affects: [01-02, 01-03, pricing-page, skill-pages, founding-member-page]

tech-stack:
  added: []
  patterns:
    - 'Skills-based naming convention: contentCreator, voiceAgent, leadQualifier, socialMedia, adCreator, reporting'
    - '4-tier pricing model: founding, starter, growth, agency'
    - 'Skill add-ons at EUR 497/mo per skill'

key-files:
  created: []
  modified:
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json
    - fmai-nextjs/src/lib/seo-config.ts
    - fmai-nextjs/src/app/[locale]/page.tsx

key-decisions:
  - 'Used 6 skill names matching AaaS design doc: Content Creator, Voice Agent, Lead Qualifier, Social Media Manager, Ad Creator, Reporting & Analytics'
  - '4 pricing tiers: Founding Member EUR 997, Starter EUR 1,497, Growth EUR 1,997, Agency EUR 3,497 with EUR 497/skill add-ons'
  - "Dutch uses 'AI Marketing Medewerker voor bureaus', Spanish uses 'Empleado de Marketing IA para agencias'"
  - "Badge 'support' replaced with 'dutch' (Dutch Support / Nederlandse Support / Soporte en Neerlandes)"
  - 'How-it-works reframed as 4-step agent onboarding journey with new step keys (choose, activate, connect, working)'

patterns-established:
  - 'Skill key convention: contentCreator, voiceAgent, leadQualifier, socialMedia, adCreator, reporting'
  - 'Pricing tier keys: founding, starter, growth, agency'
  - 'Footer nav uses skill-based keys instead of old service keys'

requirements-completed: [WEB-01, WEB-02, WEB-06, WEB-07, WEB-08, WEB-09, WEB-10, WEB-13, WEB-14]

duration: 24min
completed: 2026-03-20
---

# Phase 1 Plan 1: Core Copy Rebrand Summary

**All 3 locale files (EN/NL/ES) rewritten from "AI automation agency for businesses" to "AI Marketing Employee for agencies" with 4 agent tiers, 6 skills, and agency-targeted FAQ/trust/stats**

## Performance

- **Duration:** 24 min
- **Started:** 2026-03-20T16:52:00Z
- **Completed:** 2026-03-20T17:16:05Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Homepage hero, services (now 6 skills), stats, badges, trust, FAQ, CTA all rewritten for agency audience in EN
- About page rewritten with AaaS mission, agency focus, and "AI Employee Era" timeline
- How-it-works reframed as 4-step agent onboarding journey
- Pricing restructured to 4 tiers (Founding Member/Starter/Growth/Agency) with skill add-ons
- NL and ES translations match EN key structure with proper localization (AVG-First, bureaus, RGPD-First, agencias)
- SEO config updated with AaaS entity description and skill page dates
- Homepage page.tsx SERVICE_CARDS updated to 6 skills, STAT_KEYS and BADGE_KEYS updated

## Task Commits

1. **Task 1: Rewrite EN copy and update SEO config** - `7332c62` (feat)
2. **Task 2: Translate NL and ES locale files** - `88dc0c4` (feat)

## Files Created/Modified

- `fmai-nextjs/messages/en.json` - Complete EN copy rebrand for AaaS agency positioning
- `fmai-nextjs/messages/nl.json` - Complete NL translation with "AI Marketing Medewerker voor bureaus"
- `fmai-nextjs/messages/es.json` - Complete ES translation with "Empleado de Marketing IA para agencias"
- `fmai-nextjs/src/lib/seo-config.ts` - ENTITY_DESCRIPTION updated, PAGE_DATES for skill pages added
- `fmai-nextjs/src/app/[locale]/page.tsx` - SERVICE_CARDS (6 skills), STAT_KEYS, BADGE_KEYS updated, grid changed to 3-col

## Decisions Made

- Used 6 skill names from AaaS design doc rather than inventing new ones
- Kept "Founding Member" in English across NL locale for exclusivity appeal
- Changed homepage grid from 2x2 to 3-column to accommodate 6 skill cards
- Replaced "support" badge with "dutch" (Dutch Support) as a differentiator for European agencies
- How-it-works steps renamed to choose/activate/connect/working (agent onboarding journey)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated homepage SERVICE_CARDS array for 6 skills**

- **Found during:** Task 1 (EN copy rewrite)
- **Issue:** SERVICE_CARDS array referenced old 4 service keys (automations, chatbots, voiceAgents, marketingMachine) that no longer exist in updated en.json
- **Fix:** Updated to 6 skill keys with /skills/\* hrefs, updated grid to 3-column layout
- **Files modified:** fmai-nextjs/src/app/[locale]/page.tsx
- **Verification:** Build succeeds, no missing translation warnings
- **Committed in:** 7332c62 (Task 1 commit)

**2. [Rule 3 - Blocking] Updated homepage STAT_KEYS and BADGE_KEYS**

- **Found during:** Task 1 (EN copy rewrite)
- **Issue:** STAT_KEYS referenced old keys (automations, support, growth, setup) and BADGE_KEYS included "support" which was replaced by "dutch"
- **Fix:** Updated STAT_KEYS to clients/content/hours/languages, BADGE_KEYS to include dutch
- **Files modified:** fmai-nextjs/src/app/[locale]/page.tsx
- **Verification:** Build succeeds
- **Committed in:** 7332c62 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both blocking - key name changes required for build)
**Impact on plan:** Both auto-fixes directly caused by the copy rewrite. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All messaging established in translation files, ready for 01-02 (navigation restructure + skill routes)
- Skill page routes referenced in SERVICE_CARDS (/skills/\*) but pages do not exist yet (01-02 scope)
- Pricing page component needs updating to render new 4-tier structure (01-03 scope)

---

_Phase: 01-website-rebrand_
_Completed: 2026-03-20_
