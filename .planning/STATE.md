---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: complete
status: complete
stopped_at: Completed 10-03-PLAN.md — NL and ES hero_landing keys synced, ES structural issues fixed, service card translations added
last_updated: '2026-03-13T02:36:14.000Z'
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 11
  completed_plans: 11
---

# Project State

## Current Position

- **Milestone:** v1.0
- **Phase:** 10 — Homepage Restructuring & Marketing Machine Page
- **Current Plan:** Complete (all 11 plans done)
- **Status:** Complete
- **Last completed:** Phase 10 Plan 03 — NL and ES hero_landing keys synced, ES structural issues fixed, service card translations added
- **Last session:** 2026-03-13T02:37:11.740Z
- **Stopped at:** Completed 10-03-PLAN.md — NL and ES hero_landing keys synced, ES structural issues fixed, service card translations added

## Decisions

- 2026-03-12: Strategic pivot — gateway services + FMai founding-member beta
- 2026-03-13: "Living System" design approved — teal/amber palette, system panels, monospace data
- 2026-03-13: Brand decision — "Future AI" → "FMai" (FM**ai**)
- 2026-03-13: [Phase 03-design-overhaul]: CTAButton self-manages Calendly modal state — callers just pass calendly={true}
- 2026-03-13: [Phase 03-design-overhaul]: SystemPanel uses forwardRef for composability with Framer Motion and ref-consuming libraries
- 2026-03-13: [03-01]: Dropped Satoshi (fontshare) in favor of Space Grotesk (Google Fonts) for display font
- 2026-03-13: [03-01]: gradient-text-success renamed to gradient-text-flow (teal-to-amber Living System flow gradient)
- 2026-03-13: [03-03]: useMotionSafe consolidated into existing useReducedMotion.ts (not a new file) to keep all reduced motion utilities together
- 2026-03-13: [03-03]: Each service page uses a local CALENDLY_URL constant with dark theme params — avoids shared import coupling
- [Phase 09-living-system-page-conversion]: Animated motion.div cards keep className conversion instead of SystemPanel wrapper to preserve Framer Motion animations
- [Phase 09-living-system-page-conversion]: FeatureShowcase removes background glow orbs entirely — cleaner Living System aesthetic without atmospheric glassmorphism effects
- [Phase 09-living-system-page-conversion]: AboutPage hero badge uses accent-human (amber) — human/team-centric content gets warm accent, not teal
- [Phase 09-living-system-page-conversion]: CTAButton with calendly prop replaces all old gradient anchor CTA buttons across supporting pages
- [09-03]: Pricing card CTAs use CTAButton with w-full justify-center className to maintain full-width appearance
- [09-03]: Highlighted pricing badges converted from blue/purple gradient rounded-full to accent-system rounded-sm — consistent with Living System
- [Phase 09-living-system-page-conversion]: CTAButton replaces all hand-rolled Calendly anchor/button elements in SimpleHeader and Hero — no local Calendly state in parents
- [Phase 09-living-system-page-conversion]: SVG inline elements use hex values #00D4AA/#F5A623 directly since SVG stopColor does not support Tailwind class names
- [Phase 09-05]: CookieConsent text elements use inline style={{ color }} because react-cookie-consent injects styles that override Tailwind classes
- [10-01]: MotionLink = motion(Link) pattern for animated service cards — enables both SPA navigation and Framer Motion whileHover animations
- [10-01]: Primary homepage CTA uses #services hash scroll (not /automations) — low-friction above-fold action, Calendly CTA placed after service grid
- [10-01]: solution_section i18n keys preserved in common.json — Plan 02 will reference them on marketing-machine page
- [Phase 10-02]: MarketingMachinePage uses lazy imports for all heavy section components (VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof) with Loader2 Suspense fallback
- [Phase 10-02]: Pricing teaser on /marketing-machine links to /pricing — avoids duplication, consistent with homepage service cards pattern
- [Phase 10]: ES common.json required full rewrite to fix duplicate top-level keys — JSON silently discards duplicate keys, Edit tool cannot distinguish them
- [Phase 10]: Orphaned ES top-level keys (language, buttons, metrics, time, validation, success, nav, mobile) removed — no EN counterparts, not used by any component

## Context

- Phase 1 (Website Rebrand) and Phase 2 (Service Pages) already committed on main
- Phase 3 split into 4 waves: Foundation → Homepage → Marketing Machine → Brand Cleanup
- Wave 1 Foundation: Plan 01 (Design Tokens), Plan 02 (Shared Components), Plan 03 (UX & Accessibility Fixes) — all COMPLETE
- All 5 Living System shared components exported from src/components/common/index.ts
- All Calendly CTAs use modal pattern with dark theme params across VoiceAgents, Automations, Chatbots pages
- 2026-03-13: Phase 9 complete — Living System Page Conversion (all 5 plans executed, all pages converted from old glassmorphism to teal/amber tokens)
- Full-site visual audit passed: zero old indigo/purple/blue palette elements on any page
- Phase 10 in progress — Homepage Restructuring & Marketing Machine Page
- Phase 10 Plan 01 complete: Homepage restructured as FutureAI hub — 4 service cards, VisionTimeline/FeatureShowcase removed, SimpleHeader branding updated, legacy gradient wrapper fixed
- Phase 10 Plan 02 complete: /marketing-machine page created — MarketingMachinePage with VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof, pricing teaser, Calendly CTA; route and marketingPaths registered in App.tsx
- Phase 10 Plan 03 complete: NL and ES hero_landing keys synced with EN — gateway services copy, service card translations, ES structural issues (duplicate pricing/actions blocks, orphaned keys, missing cookie_consent) fixed
- Phase 10 COMPLETE: All 3 plans done, milestone v1.0 complete

### Roadmap Evolution

- Phase 10 added: Homepage Restructuring & Marketing Machine Page
