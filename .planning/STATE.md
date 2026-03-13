---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_plan: Not started
status: completed
stopped_at: Completed 19-02-PLAN.md
last_updated: '2026-03-13T22:28:13.044Z'
progress:
  total_phases: 12
  completed_phases: 12
  total_plans: 42
  completed_plans: 42
---

# Project State

## Current Position

- **Milestone:** v1.0
- **Phase:** 19 — Homepage Concierge + Demo Guide + ARIA Cleanup
- **Current Plan:** Not started
- **Status:** Milestone complete
- **Last completed:** Phase 19 Plan 02 — ARIA Cleanup
- **Last session:** 2026-03-13T22:21:02Z
- **Stopped at:** Completed 19-02-PLAN.md

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
- [13-02]: Minimal valid binary files via base64 decode -- no external tools (sharp/ffmpeg) needed for placeholder media
- [13-02]: WebP 1x1 dark pixel (43 bytes) and MP4 minimal ftyp+moov container (736 bytes) -- smallest valid files browsers accept
- [14-01]: Service page i18n uses KEYS array + ICONS record at module scope, .map(key => t()) inside component
- [14-01]: Pricing tier features loaded via t(key, { returnObjects: true }) as string[]
- [14-01]: NL prices use dot-separator (1.000) matching Dutch locale convention
- [Phase 14]: Pricing tier features use t() with returnObjects for translated arrays; module-level key/config maps keep static config separate from t() text
- [14-03]: VoiceAgentsPage trust metric values (24/7, 500+, 98%) stored in locale files for potential localization
- [Phase 15]: [15-01]: Map.forEach used instead of for-of iteration — avoids downlevelIteration tsconfig requirement
- [Phase 15]: [15-01]: MODEL_IDS uses shorthand IDs (claude-haiku-4-5, claude-sonnet-4-5) — provider resolves to latest
- [Phase 15]: [15-02]: AI SDK v6 uses inputSchema (not parameters) for tool() definitions — DEMO_TOOL updated accordingly
- [Phase 15]: [15-02]: Map.forEach pattern continued from 15-01 to avoid downlevelIteration requirement
- [Phase 15]: [15-03]: maxOutputTokens used instead of maxTokens — AI SDK v6 renamed this parameter
- [Phase 15]: [15-03]: toTextStreamResponse used for simplicity — Phase 17 can switch to toUIMessageStreamResponse if useChat adopted
- [Phase 16]: tools cast as unknown as Record<string, unknown> to bridge AI SDK tool() return type with PersonaConfig generic tools type
- [Phase 16]: [16-01]: Persona vertical slice pattern: knowledge-kb.ts + tools.ts + persona.ts per persona
- [Phase 16]: [16-01]: PRODUCT_CATALOG exported as typed array for tool handler querying
- [Phase 17]: [17-01]: Engine switched from toTextStreamResponse to toUIMessageStreamResponse for useChat compatibility
- [Phase 17]: [17-01]: convertToModelMessages (async) converts UIMessage[] to model messages server-side
- [Phase 17]: [17-01]: chatbotStore uses fmai-chatbot-state localStorage key (separate from old fmai-chat-state)
- [Phase 17]: [17-01]: usePersonaChat uses useChat id param for per-persona message isolation
- [Phase 17]: [17-01]: Demo message limit set at 15 messages per session
- [Phase 16-03]: AnyToolRecord type (Tool<any, any>) used for PERSONA_TOOLS map — each persona has differently-typed Zod schemas
- [Phase 16-03]: Barrel index.ts imports ./personas for side-effect registration — consumers importing from chatbot barrel get personas automatically
- [Phase 17]: [17-02]: ToolResultPlaceholder uses cast via unknown for tool part types -- Plan 03 ToolResultRenderer replaces with proper typed handling
- [Phase 17]: [17-02]: CSS-only animations (fadeIn, chatDotBounce) on messages instead of Framer Motion -- lighter weight per plan spec
- [Phase 17]: [17-02]: Auto-scroll uses 80px threshold from bottom to detect manual scroll-up
- [Phase 17-03]: index.tsx (not index.ts) for barrel+renderer -- file contains JSX for ToolLoadingCard, ToolErrorCard, and ToolResultRenderer
- [Phase 17-04]: FloatingButton uses CSS @keyframes breathe instead of Framer Motion for always-on animation -- lighter weight
- [Phase 17-04]: ChatWidget dual-mode via single component with mode prop -- shared hook/state logic cleaner than separate components
- [Phase 17-04]: Barrel index.ts exports all chatbot components including tool-results for Phase 18/19 consumers
- [Phase 18]: [18-02]: CSS dividers with animated gradient instead of SVG for connection lines -- simpler and responsive-friendly
- [Phase 18]: [18-02]: Inline style tag for brainPulse/expandLine keyframes -- component-scoped CSS animations, no global pollution
- [Phase 18]: Per-persona messageCounts as Record<string, number> with standalone getMessageCount selector export
- [Phase 18]: DemoPlayground activeTab state lifted to parent for scroll-to-tab coordination from use case cards
- [Phase 18]: [18-03]: Hero CTA uses scrollIntoView to #demo-playground instead of route navigation
- [Phase 18]: [18-03]: Use case cards map to persona IDs via USE_CASE_TO_PERSONA Record for scroll-to-tab coordination
- [Phase 19]: [19-01]: isDemoPage uses startsWith array match for /explorer, /calculator, /dashboard, /demo prefixes
- [Phase 19]: [19-01]: Old fmai-chat-state localStorage key cleaned up on mount in existing dark mode useEffect
- [Phase 19]: [19-02]: useCalendlyBooking uses hardcoded journey defaults (completedSteps: 0, timeOnSite: 0) replacing journeyStore dependency
- [Phase 19]: [19-02]: StrategicCTA floating variant removed all FloatingElementContext coordination logic -- CTA shows independently of chat panel

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
- Phase 13 added: Dead Code Cleanup & Media Fix — remove orphaned components, fix media placeholders
- Phase 13 Plan 01 complete: Deleted 4 orphaned Phase 3 components (SystemPanel, StatusIndicator, MetricDisplay, SectionContainer) + useTilt hook; cleaned barrel exports; build passes
- Phase 13 Plan 02 complete: 8 placeholder media files (4 MP4 + 4 WebP) in public/media/ -- zero ProductMedia 404 errors on service pages
- Phase 13 COMPLETE: All 2 plans done -- Dead Code Cleanup & Media Fix finished
- Phase 14 added: Service Page i18n -- wire useTranslation into 3 service pages, extract EN strings, add NL/ES translations
- Phase 14 Plan 01 complete: AutomationsPage internationalized -- ~73 strings extracted to automations.json (EN/NL/ES), key-based mapping pattern for const arrays
- Phase 14 Plan 03 complete: VoiceAgentsPage internationalized -- ~59 strings extracted to voice-agents.json (EN/NL/ES), partnership note + trust metrics fully translated
- Phase 15 added: Chatbot Engine Foundation -- types, security, rate limiting, complexity detection, topic routing, prompt building, persona registry, tool execution, engine orchestration, API endpoint
- Phase 15 Plan 01 complete: Types, security, rate limiting, complexity detection -- 4 foundation modules with PII blocking, 3-level rate limiter, Haiku/Sonnet model routing
- Phase 15 Plan 02 complete: Persona infrastructure -- topic router, prompt builder with cache control, persona registry, tool executor with AI SDK v6 pattern
- Phase 15 Plan 03 complete: Engine orchestration + API endpoint -- handleChatRequest pipeline, Vercel Web API streaming endpoint, barrel exports, CSP cleanup
- Phase 15 COMPLETE: All 3 plans done -- Chatbot Engine Foundation finished (full pipeline from POST /api/chatbot to streaming Claude response)
- Phase 17 added: ChatWidget UI Components -- shared ChatWidget React component for floating and embedded chat modes
- Phase 17 Plan 01 complete: Foundation -- engine switched to toUIMessageStreamResponse, chatbotStore Zustand store, usePersonaChat hook with DefaultChatTransport
- Phase 17 Plan 02 complete: Core Chat UI -- ChatHeader, ChatMessages (parts-based rendering, auto-scroll, typing indicator), ChatInput (local useState, auto-resize), SuggestedPrompts
- Phase 17 Plan 03 complete: Tool Result Cards -- ProductCard, LeadScoreCard, KBArticleCard, TicketCard, ServiceCard + ToolResultRenderer router component
- Phase 17 Plan 04 complete: ChatWidget dual-mode (floating FAB panel + embedded inline) + FloatingButton breathing animation + barrel exports
- Phase 17 COMPLETE: All 4 plans done -- ChatWidget UI Components finished (full component library for Phase 18 demo playground and Phase 19 homepage concierge)
- Phase 18 Plan 01 complete: Demo Playground Core -- DemoPlayground orchestrator with 3 ChatWidgets, PersonaSelector tab bar, DemoContextCard, per-persona message counting
- Phase 18 Plan 02 complete: CTA & Showcase Components -- ProgressiveCTA (4-threshold message system), MultiPlatformShowcase (brain node + 3 platforms + SKC case study)
- Phase 18 Plan 03 complete: Page Integration & i18n -- ChatbotsPage restructured with DemoPlayground + MultiPlatformShowcase, hero scroll-to-demo CTA, use case scroll-to-tab, full EN/NL/ES i18n
- Phase 18 COMPLETE: All 3 plans done -- ChatbotsPage Demo Playground finished (interactive demo with 3 persona tabs, progressive CTAs, multi-platform showcase, full i18n)
- Phase 19 Plan 01 complete: ChatWidget floating mode wired into App.tsx replacing AIJourneyAssistant, route-based concierge/demo-guide persona switching, pageContext forwarding to API
- Phase 19 Plan 02 complete: Complete ARIA cleanup -- 53 files deleted (12,169 lines), refactored useCalendlyBooking/StrategicCTA/Explorer/App.tsx, cleaned barrels and i18n, zero dead imports
- Phase 19 COMPLETE: All 2 plans done -- Homepage Concierge + Demo Guide + ARIA Cleanup finished (persona-driven chatbot replaces entire ARIA system)
