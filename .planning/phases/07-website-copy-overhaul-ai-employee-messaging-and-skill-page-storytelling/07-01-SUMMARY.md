---
phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling
plan: 01
subsystem: i18n
tags: [next-intl, translation, i18n, skill-pages, json]

requires:
  - phase: 06-vite-feature-parity
    provides: Skill pages with shared PricingTiers, TrustMetrics, SocialProof, FeatureShowcase components
provides:
  - All 8 skill pages fully using t() translation functions for every visible string
  - Full skills-chatbot and skills-email namespaces in all 3 locale JSON files
  - Pricing, trust, social proof, showcase keys added to content-creator, voice-agent, lead-qualifier, social-media namespaces
affects: [07-02, 07-03, 07-04, copy-rewrite, clyde-messaging]

tech-stack:
  added: []
  patterns:
    [
      pricing-tiers-translation-pattern,
      trust-metrics-translation-pattern,
      feature-showcase-translation-pattern,
    ]

key-files:
  created: []
  modified:
    - fmai-nextjs/src/app/[locale]/(skills)/skills/chatbot/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/email/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/content-creator/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/voice-agent/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx
    - fmai-nextjs/src/app/[locale]/(skills)/skills/social-media/page.tsx
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'Chatbot and email pages use same namespace key structure as other skill pages (use_cases, pricing, trust, cta)'
  - 'Pricing tier features use indexed keys (features_0, features_1, etc.) matching existing pattern from research'
  - 'Trust metrics use descriptive keys per page (inquiries/availability/response_time for chatbot, open_rates/replies/sending for email)'
  - 'SocialProof and FeatureShowcase receive translated strings as props rather than internal t() calls'

patterns-established:
  - "Pricing translation: t('pricing.tiers.{tier}.{field}') with features_0..features_N indexed keys"
  - "Trust metrics translation: t('trust.metrics.{metric_key}.{value|label|description}')"
  - "Feature showcase translation: t('showcase.items.{key}.{title|description}') with icon staying hardcoded"

requirements-completed: [WEB-01]

duration: 11min
completed: 2026-03-20
---

# Phase 7 Plan 1: Translation Architecture Fix Summary

**All 8 skill pages converted to full t() translation with pricing, trust, social proof, and showcase keys in EN/NL/ES**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-20T22:23:24Z
- **Completed:** 2026-03-20T22:34:51Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Chatbot and email pages converted from fully hardcoded English to getTranslations-based i18n with complete namespaces
- Full skills-chatbot and skills-email namespaces created in en.json, nl.json, and es.json with natural Dutch and Spanish translations
- Hardcoded props extracted from content-creator (social proof, showcase, product media, pricing), voice-agent (pricing, trust), lead-qualifier (pricing, trust), and social-media (social proof, showcase, pricing, trust)

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert chatbot and email pages to use translation keys** - `b1fd039` (feat)
2. **Task 2: Extract hardcoded props from content-creator, voice-agent, lead-qualifier, social-media pages** - `3914d6d` (feat)

## Files Created/Modified

- `fmai-nextjs/src/app/[locale]/(skills)/skills/chatbot/page.tsx` - Added getTranslations import, replaced all hardcoded strings with t() calls
- `fmai-nextjs/src/app/[locale]/(skills)/skills/email/page.tsx` - Added getTranslations import, replaced all hardcoded strings with t() calls
- `fmai-nextjs/src/app/[locale]/(skills)/skills/content-creator/page.tsx` - SocialProof, FeatureShowcase, ProductMedia, PricingTiers props to t() calls
- `fmai-nextjs/src/app/[locale]/(skills)/skills/voice-agent/page.tsx` - PricingTiers, TrustMetrics props to t() calls
- `fmai-nextjs/src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx` - PricingTiers, TrustMetrics props to t() calls
- `fmai-nextjs/src/app/[locale]/(skills)/skills/social-media/page.tsx` - SocialProof, FeatureShowcase, PricingTiers, TrustMetrics props to t() calls
- `fmai-nextjs/messages/en.json` - Full skills-chatbot/skills-email namespaces + pricing/trust/showcase/social_proof keys for 4 other skills
- `fmai-nextjs/messages/nl.json` - Dutch translations for all new keys
- `fmai-nextjs/messages/es.json` - Spanish translations for all new keys

## Decisions Made

- Used indexed feature keys (features_0, features_1, etc.) to match the research doc pattern for PricingTiers props
- Icons in FeatureShowcase stay hardcoded (emoji strings) since they are not language-dependent
- BreadcrumbJsonLd items kept as hardcoded English (navigation structure, not user-facing copy)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 8 skill pages fully internationalized, ready for Clyde copy rewrite in plans 02/03/04
- Translation key structure is consistent across all namespaces for systematic JSON file rewriting

---

_Phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling_
_Completed: 2026-03-20_
