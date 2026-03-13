---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: Not started
status: completed
stopped_at: Completed 12-04-PLAN.md
last_updated: '2026-03-13T14:22:21.357Z'
progress:
  total_phases: 5
  completed_phases: 5
  total_plans: 22
  completed_plans: 22
---

# Project State

## Current Position

- **Milestone:** v1.0
- **Phase:** 12 — Design Polish & Media
- **Current Plan:** Not started
- **Status:** Milestone complete
- **Last completed:** Phase 12 Plan 04 — Final integration (barrel exports + human-verified micro-interactions)
- **Last session:** 2026-03-13T14:17:26.599Z
- **Stopped at:** Completed 12-04-PLAN.md

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
- [11-01]: CSS variables updated to match DM Sans as primary font alongside Tailwind config
- [11-02]: brandMiddle displayed between FM and ai only when non-empty — homepage shows FMai, service pages show FM{service}ai
- [11-02]: Removed Sparkles icon entirely — FM+ai text logo is self-sufficient
- [11-03]: Service card order: 01=Automations, 02=Chatbots, 03=Voice Agents, 04=Marketing Machine
- [11-03]: VisionTimeline kept inside Hero section as natural document flow below service cards
- [11-03]: GradientMesh rendered in LandingPage (not App.tsx) since Hero no longer has its own backgrounds
- [Phase 11-04]: Removed fadeInUp motion variant object — hero uses inline CSS animation styles, scroll sections use explicit whileInView props
- [Phase 11-04]: FAQ details elements get card-gradient-border + rounded-card for visual consistency with other cards
- [11-05]: ComparisonTables rebuilt alongside PricingPage — all blue/purple/gradient colors replaced with design tokens
- [11-05]: LegalPage Framer Motion wrappers replaced with CSS fadeIn — lighter weight for text-heavy content
- [11-05]: HowItWorksPage step numbers use accent-human with font-mono — visual hierarchy between labels and system icons
- [11-06]: Pricing tiers driven by TIER_KEYS array + t() with returnObjects — no hardcoded tier data in MarketingMachinePage component
- [11-06]: SEO meta tags kept as hardcoded EN strings — SEO handled separately from UI i18n
- [11-07]: Mobile hero uses single blob-warm (300px, opacity 0.08) instead of GradientMesh for performance
- [11-07]: Framer Motion wrappers replaced with CSS fadeIn/fadeInUp on mobile — lighter weight for touch devices
- [12-01]: SplineHero uses React.lazy + Suspense with OrbitVisual fallback — zero JS cost until Spline runtime loads
- [12-01]: ScrollReveal delegates reduced-motion to useMotionSafe — returns empty props when motion disabled
- [12-01]: useTilt is caller-guarded — hook returns values unconditionally, callers apply desktop-only check
- [12-02]: CSS card-tilt on hero service cards instead of useTilt hook — 4 hook instances unnecessary, useTilt saved for Plan 03 service pages
- [12-02]: Tailwind group/cta named group on CTAButton — isolates hover scope from parent group classes on service card Links
- [12-02]: ScrollReveal wraps Hero.tsx sections (not LandingPage.tsx) — below-fold content lives in Hero component
- [12-03]: Existing Framer Motion whileInView sections left as-is — ScrollReveal only added to sections without scroll triggers
- [12-03]: card-tilt class applied alongside card-gradient-border — harmless no-op until Plan 02 CSS exists, enables parallel plan execution
- [12-03]: ComparisonTables.tsx modified for pricing card-tilt since PricingPage delegates card rendering to that component

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
- Phase 11 added: Living System Full Rebuild — structural rebuild of all pages to match prototype-2 design
- Phase 11 Plan 01 complete: Foundation layer — DM Sans typography, GradientMesh 3-blob component, CSS keyframe animations, card/btn border-radius tokens
- Phase 11 Plan 02 complete: Global chrome components rebuilt — CTAButton warm gradient + glass, SimpleHeader full-width backdrop-blur nav with FM+ai logo, Footer zero hardcoded colors
- Phase 11 Plan 03 complete: Hero rebuilt — left-aligned layout with OrbitVisual orbit rings on right, 2x2 numbered service cards (01-04) with card-gradient-border, 4 Framer Motion background layers removed, GradientMesh wired in LandingPage
- Phase 11 Plan 04 complete: All 3 service pages rebuilt — card-gradient-border + rounded-card on all cards, CSS fadeIn/fadeInUp hero animations, max-w-7xl px-12 layout, font-display on headings
- Phase 11 Plan 05 complete: All 5 supporting pages rebuilt — About, Pricing, HowItWorks, Contact, Legal with card-gradient-border + rounded-card, CSS fadeIn heroes, glass form container, ComparisonTables fully tokenized
- Phase 11 Plan 06 complete: MarketingMachinePage fully internationalized (EN/NL/ES) with card-gradient-border pricing cards, CSS fadeIn hero, max-w-7xl layout
- Phase 11 Plan 07 complete: SimplifiedHeroMobile rebuilt with DM Sans, blob background, CSS animations; full-site visual quality human-approved
- Phase 11 COMPLETE: All 7 plans done — Living System Full Rebuild finished across all pages
- Phase 12 added: Design Polish & Media — Spline/Rive hero visual, product media, micro-interactions, typography polish. Research pre-gathered.
- Phase 12 Plan 01 complete: Foundation components — SplineHero (lazy Spline 3D + OrbitVisual fallback), ScrollReveal (whileInView wrapper), ProductMedia (video/poster + reduced-motion), useTilt (mouse parallax hook)
- Phase 12 Plan 02 complete: Homepage polish — SplineHero wired into Hero (SPLINE_SCENE_URL constant, OrbitVisual fallback), ScrollReveal on service cards + VisionTimeline, CTAButton arrow hover via group-hover/cta, card-tilt CSS class
- Phase 12 Plan 03 complete: Page-level polish — ScrollReveal + card-tilt + ProductMedia placeholders across all 4 service pages and 3 supporting pages, typography polish utilities (font-display tracking, section-gap, hero-heading-xl) in index.css
- Phase 12 Plan 04 complete: Final integration — barrel exports for SplineHero/ScrollReveal/ProductMedia, human-verified micro-interactions across all pages
- Phase 12 COMPLETE: All 4 plans done — Design Polish & Media finished (micro-interactions, scroll reveals, product media placeholders, typography polish)
