---
phase: 03-interactive-features
plan: 01
subsystem: ui
tags: [motion, zustand, framer-motion, react-calendly, react-cookie-consent, next-intl]

requires:
  - phase: 01-foundation-and-infrastructure
    provides: Next.js scaffold, locale layout, next-intl setup
  - phase: 02-page-migration-and-core-seo
    provides: All pages migrated with layout structure
provides:
  - Motion wrappers (MotionDiv, ScrollReveal, AnimatePresenceWrapper) for scroll animations
  - chatbotStore with skipHydration persist for chatbot state
  - Providers wrapper in locale layout for client-side providers
  - CalendlyModal shell with dynamic import (ssr false)
  - CookieConsentBanner with GDPR accept/decline
  - All Phase 3 npm dependencies installed
affects: [03-02, 03-03, phase-4, phase-6]

tech-stack:
  added:
    [
      motion,
      ai,
      '@ai-sdk/react',
      '@ai-sdk/anthropic',
      zod,
      react-calendly,
      react-cookie-consent,
      react-markdown,
      lucide-react,
    ]
  patterns:
    [
      client-island motion wrappers,
      skipHydration delayed rehydrate,
      next/dynamic ssr false,
      mounted guard for SSR safety,
    ]

key-files:
  created:
    - fmai-nextjs/src/components/motion/MotionDiv.tsx
    - fmai-nextjs/src/components/motion/ScrollReveal.tsx
    - fmai-nextjs/src/components/motion/AnimatePresenceWrapper.tsx
    - fmai-nextjs/src/hooks/useReducedMotion.ts
    - fmai-nextjs/src/stores/chatbotStore.ts
    - fmai-nextjs/src/components/providers/StoreProvider.tsx
    - fmai-nextjs/src/components/providers/Providers.tsx
    - fmai-nextjs/src/components/interactive/CalendlyModal.tsx
    - fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx
  modified:
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/package.json
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'motion/react imports (not framer-motion) for motion v12 compatibility'
  - 'skipHydration + delayed rehydrate pattern for Zustand persist in SSR'
  - 'Simplified chatbotStore interface vs Vite version (Plan 02 will extend as needed)'
  - 'Mounted guard pattern for CookieConsentBanner and CalendlyModal SSR safety'

patterns-established:
  - 'Client-island motion wrappers: MotionDiv/ScrollReveal/AnimatePresenceWrapper as use-client boundary'
  - 'Mounted guard: useState(false) + useEffect for SSR-unsafe third-party components'
  - 'Providers wrapper: composable provider tree in layout for future extension'

requirements-completed: [INT-05]

duration: 5min
completed: 2026-03-18
---

# Phase 3 Plan 1: Interactive Foundation Summary

**Motion v12 wrappers, Zustand chatbotStore with skipHydration persist, Providers in layout, CalendlyModal and CookieConsentBanner shells**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T03:53:03Z
- **Completed:** 2026-03-18T03:58:08Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments

- Motion wrappers (MotionDiv, ScrollReveal, AnimatePresenceWrapper) as "use client" islands importable from Server Components
- chatbotStore with skipHydration persist ready for chatbot Plan 02
- Providers wrapper wired into locale layout with StoreProvider delayed rehydration
- CalendlyModal shell with next/dynamic ssr:false for react-calendly
- CookieConsentBanner with GDPR accept/decline styled to dark theme
- All Phase 3 npm dependencies installed in one batch

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, create motion wrappers and useReducedMotion hook** - `9c94a7b` (feat)
2. **Task 2: Create chatbotStore, Providers, interactive component shells, and wire into layout** - `c47b300` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/motion/MotionDiv.tsx` - Client-side motion.div/span/section re-exports
- `fmai-nextjs/src/components/motion/ScrollReveal.tsx` - Scroll-triggered animation wrapper with reduced motion support
- `fmai-nextjs/src/components/motion/AnimatePresenceWrapper.tsx` - Client-side AnimatePresence for exit animations
- `fmai-nextjs/src/hooks/useReducedMotion.ts` - Convenience re-export of useReducedMotion
- `fmai-nextjs/src/stores/chatbotStore.ts` - Chatbot state management with skipHydration persist
- `fmai-nextjs/src/components/providers/StoreProvider.tsx` - Delayed rehydration provider for Zustand stores
- `fmai-nextjs/src/components/providers/Providers.tsx` - Composable provider wrapper for layout
- `fmai-nextjs/src/components/interactive/CalendlyModal.tsx` - Modal with dynamically loaded Calendly widget
- `fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx` - GDPR cookie consent with accept/decline
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Updated with Providers wrapper and CookieConsentBanner
- `fmai-nextjs/messages/en.json` - Added cookie_consent and calendly i18n keys
- `fmai-nextjs/messages/nl.json` - Added cookie_consent and calendly i18n keys (Dutch)
- `fmai-nextjs/messages/es.json` - Added cookie_consent and calendly i18n keys (Spanish)

## Decisions Made

- Used motion/react imports (not framer-motion) for motion v12 API
- Simplified chatbotStore interface from Vite version -- Plan 02 will extend as needed
- Added mounted guard pattern for CookieConsentBanner and CalendlyModal to prevent SSR hydration mismatches
- Installed all Phase 3 deps in one batch so Plans 02/03 don't need separate installs

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added missing i18n translation keys**

- **Found during:** Task 2 (CookieConsentBanner and CalendlyModal creation)
- **Issue:** CookieConsentBanner uses `t('cookie_consent.accept')` etc. and CalendlyModal uses `t('modal_title')` but these keys did not exist in any message file
- **Fix:** Added `cookie_consent` keys under `common` namespace and `calendly` namespace to en.json, nl.json, es.json
- **Files modified:** fmai-nextjs/messages/en.json, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/es.json
- **Verification:** Build passes with no missing key errors
- **Committed in:** c47b300 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for runtime correctness. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Motion wrappers ready for scroll animations across all pages (Plan 03 and beyond)
- chatbotStore ready for AI chatbot implementation (Plan 02)
- Providers wrapper extensible for analytics/feature-flag providers (Phase 6)
- CalendlyModal shell ready for integration with CTA buttons
- CookieConsentBanner active in layout, analytics callbacks placeholder for Phase 6

## Self-Check: PASSED

All 9 created files verified on disk. Both task commits (9c94a7b, c47b300) verified in git log.

---

_Phase: 03-interactive-features_
_Completed: 2026-03-18_
