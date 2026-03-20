---
phase: 04-compliance
plan: 02
subsystem: legal
tags: [gdpr, dpa, dpia, privacy, terms-of-service, i18n, next-intl]

requires:
  - phase: 04-compliance
    provides: AI disclosure implementation in chatbot widget (04-01)
provides:
  - DPA (Verwerkersovereenkomst) template for agency client contracts
  - DPIA assessment document for AI agent data processing
  - Comprehensive Terms of Service with AaaS-specific clauses
  - Comprehensive Privacy Policy with AI data processing descriptions
  - Legal page subsection rendering pattern
affects: [05-go-to-market, agency-contracts, client-onboarding]

tech-stack:
  added: []
  patterns: [legal-subsection-rendering, SECTION_SUBSECTIONS-map-pattern]

key-files:
  created:
    - docs/legal/verwerkersovereenkomst-dpa.md
    - docs/legal/dpia-ai-agent-processing.md
  modified:
    - fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'DPA drafted in Dutch (primary legal jurisdiction: Dutch BV) with 8 sub-processors in Annex A'
  - 'DPIA identifies 7 risks across all 6 AI skills with residual risk assessment'
  - 'Legal page uses SECTION_SUBSECTIONS map pattern for known subsection keys per section'
  - 'Terms of service: 7 subsections, Privacy policy: 9 subsections, Cookies/Disclaimer: no subsections'

patterns-established:
  - 'Legal subsection rendering: SECTION_SUBSECTIONS Record maps section keys to subsection arrays, rendered via nested loop'

requirements-completed: [COMP-03, COMP-04, COMP-05, COMP-06]

duration: 9min
completed: 2026-03-20
---

# Phase 4 Plan 2: DPA/DPIA Legal Documents + Legal Page ToS/Privacy Expansion Summary

**Dutch DPA and DPIA documents covering GDPR Art. 28/35, legal page expanded with 16 structured subsections across ToS and privacy policy in EN/NL/ES**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-20T18:06:58Z
- **Completed:** 2026-03-20T18:16:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Complete DPA (Verwerkersovereenkomst) with all 14 GDPR Art. 28 required sections, sub-processor annex listing 8 services, and retention policy annex
- Complete DPIA with 7 identified risks, mitigations, and residual risk assessment covering all 6 AI skills
- Legal page Terms of Service expanded from 1 paragraph to 7 structured subsections (service description, subscriptions, AI disclaimers, liability, data processing, termination, governing law)
- Legal page Privacy Policy expanded from 1 paragraph to 9 structured subsections (data collected, purposes, legal basis, AI processing, sub-processors, retention, rights, transfers, contact)
- All legal content available in 3 locales (EN/NL/ES) with formal language

## Task Commits

Each task was committed atomically:

1. **Task 1: Draft DPA and DPIA legal documents** - `045a84f` (feat)
2. **Task 2: Expand legal page with AaaS-specific ToS and privacy policy** - `faf4309` (feat)

## Files Created/Modified

- `docs/legal/verwerkersovereenkomst-dpa.md` - Complete DPA template in Dutch with 14 sections + 2 annexes
- `docs/legal/dpia-ai-agent-processing.md` - Complete DPIA in Dutch with 5 sections + criteria checklist
- `fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx` - Added SECTION_SUBSECTIONS map and subsection rendering loop
- `fmai-nextjs/messages/en.json` - Expanded legal.sections.terms and privacy with subsections
- `fmai-nextjs/messages/nl.json` - Dutch translations for all legal subsections (formal u-form)
- `fmai-nextjs/messages/es.json` - Spanish translations for all legal subsections (formal usted-form)

## Decisions Made

- DPA drafted in Dutch as primary legal jurisdiction is Netherlands (Dutch BV)
- Sub-processor annex includes 8 services: OpenAI, Anthropic, Supabase, Vercel, Vapi, n8n, Twilio, Stripe
- DPIA identifies 7 risks (not 5 as minimum required) for thorough coverage
- Used SECTION_SUBSECTIONS constant map pattern rather than dynamic key detection for type safety
- Dutch translations use formal "u" form, Spanish uses formal "usted" form as specified

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 4 (Compliance) is now complete: both plans (04-01 AI disclosure, 04-02 legal documents) are done
- DPA template is ready to send to agency clients during GTM outreach (Phase 5)
- Legal page provides comprehensive protection for website visitors

## Self-Check: PASSED

All 6 files verified present. Both task commits (045a84f, faf4309) verified in git history.

---

_Phase: 04-compliance_
_Completed: 2026-03-20_
