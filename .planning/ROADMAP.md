# Roadmap — FMai Website v1.0

## Progress

| Phase | Name                           | Status   | Plans      | Progress |
| ----- | ------------------------------ | -------- | ---------- | -------- |
| 1     | Website Rebrand                | Complete | —          | 100%     |
| 2     | Service Pages                  | Complete | —          | 100%     |
| 3     | Design Overhaul & FMai Rebrand | Complete | 2026-03-13 | 100%     |
| 4     | Upwork & Fiverr Setup          | Pending  | —          | 0%       |
| 5     | Cold Email Campaign            | Pending  | —          | 0%       |
| 6     | Voice Agent Partnership        | Pending  | —          | 0%       |
| 7     | SKC Case Study Development     | Pending  | —          | 0%       |
| 8     | Language Expansion             | Pending  | —          | 0%       |
| 9     | Living System Page Conversion  | Complete | 2026-03-13 | 100%     |
| 10    | 3/3                            | Complete | 2026-03-13 | 0%       |
| 11    | 7/7                            | Complete | 2026-03-13 | 0%       |
| 12    | Design Polish & Media          | Complete | 2026-03-13 | 100%     |
| 13    | 2/2                            | Complete | 2026-03-13 | 0%       |
| 14    | 3/3                            | Complete | 2026-03-13 | 0%       |
| 15    | 3/3                            | Complete | 2026-03-13 | 0%       |
| 16    | 3/3                            | Complete | 2026-03-13 | 0%       |
| 17    | 4/4                            | Complete | 2026-03-13 | 0%       |
| 18    | 3/3                            | Complete | 2026-03-13 | 0%       |
| 19    | 2/2                            | Complete | 2026-03-13 | 0%       |
| 20    | 3/3                            | Complete | 2026-03-14 | 33%      |
| 21    | 3/3                            | Complete | 2026-03-16 | 0%       |

## Phases

- [x] **Phase 1: Website Rebrand** — Update meta tags, i18n brand keys, hero, header navigation
- [x] **Phase 2: Service Pages** — Build /automations, /chatbots, /voice-agents pages
- [x] **Phase 3: Design Overhaul & FMai Rebrand** — Transform site to Living System design, rebrand to FMai, build /marketing-machine (completed 2026-03-13)
  - **Goal:** Replace indigo/violet/pink glassmorphism with Living System teal/amber palette. Create shared components. Fix critical UX issues. Rebrand to FMai.
  - **Requirement IDs:** REQ-DESIGN, REQ-COMPONENTS, REQ-UX-FIXES, REQ-BRAND
- [ ] **Phase 4: Upwork & Fiverr Setup** — Launch freelance profiles and gigs
- [ ] **Phase 5: Cold Email Campaign** — Build ICP list, set up outreach sequences
- [ ] **Phase 6: Voice Agent Partnership** — Referral model with friend for voice agent delivery
- [ ] **Phase 7: SKC Case Study Development** — Track and publish pilot results at 8-12 weeks
- [ ] **Phase 8: Language Expansion** — German, Spanish improvements, French
- [x] **Phase 9: Living System Page Conversion** — Convert all existing pages from indigo/violet/purple glassmorphism to Living System teal/amber tokens (completed 2026-03-13)
  - **Goal:** Replace all old indigo/violet/purple/blue glassmorphism classes across homepage, header, footer, and service pages with Living System teal/amber design tokens. Eliminate 819 legacy color references across 126 files.
  - **Requirement IDs:** REQ-PAGE-CONVERSION
  - **Depends on:** Phase 3
  - **Plans:** 5 plans
    - [ ] 09-01-PLAN.md — Homepage Header, Hero, Mobile Hero, Footer conversion
    - [ ] 09-02-PLAN.md — Homepage SocialProof, FeaturesSection, FeatureShowcase conversion
    - [ ] 09-03-PLAN.md — Service pages (Automations, Chatbots, VoiceAgents) conversion + CTAButton migration
    - [ ] 09-04-PLAN.md — Supporting pages (About, Pricing, Contact, HowItWorks, Legal) conversion
    - [ ] 09-05-PLAN.md — Common components (LoadingFallback, FloatingNav, CookieConsent) + CSS + visual audit

- [x] **Phase 10: Homepage Restructuring & Marketing Machine Page** — Restructure homepage as general FutureAI hub, create dedicated /marketing-machine page with moved content, dynamic branding per route, full i18n (EN/NL/ES) (completed 2026-03-13)
  - **Goal:** Transform homepage from marketing-focused to general FutureAI overview. Create /marketing-machine page with relocated SocialProof/Features content + demo CTA. Ensure all translations consistent across EN/NL/ES.
  - **Requirement IDs:** REQ-HOMEPAGE-RESTRUCTURE
  - **Depends on:** Phase 9
  - **Plans:** 3 plans
    - [ ] 10-01-PLAN.md — Homepage hub restructuring (Hero rework, service cards grid, SimpleHeader branding)
    - [ ] 10-02-PLAN.md — MarketingMachinePage creation + routing (relocated components, App.tsx route)
    - [ ] 10-03-PLAN.md — i18n sync (NL/ES hero_landing fix, service card translations, ES structural fixes)

- [x] **Phase 11: Living System Full Rebuild** — Structural rebuild of all pages to match prototype-2-living-system.html design. All existing content/functionality preserved, only layout/styling/animations rebuilt. (completed 2026-03-13)
  - **Goal:** Complete structural rebuild — not color swap — of every page to match the Living System prototype (prototype-2-living-system.html). All existing page content, routes, i18n, and functionality must be preserved; only the visual structure, layout, and animations change.
  - **Design reference:** `prototype-2-living-system.html` (root of repo)
  - **Requirement IDs:** REQ-LIVING-SYSTEM-REBUILD
  - **Depends on:** Phase 10
  - **Scope:**
    - **Homepage (Hero.tsx, LandingPage.tsx):** Replace centered layout with left-aligned hero + right-side orbit visual (spinning rings with dots). Remove 4 background layers (NeuralNetwork, HolographicGrid, FloatingParticles, GradientOrbs) and replace with animated gradient mesh blobs (warm/cool/mixed, blurred, floating). Rebuild service cards as 2x2 numbered grid (01-04) with gradient border hover effect and arrow circles — not 4-column icon cards.
    - **Navigation (SimpleHeader.tsx):** Rebuild nav to match prototype — backdrop-blur with gradient underline hover on links, FMai logo with gradient "ai" suffix, warm gradient primary CTA button (not flat teal).
    - **Footer (Footer.tsx):** Fix remaining slate/indigo hardcoded colors (text-slate-300, border-slate-600, hover:text-indigo-400). Convert fully to Living System tokens.
    - **Service pages (AutomationsPage, ChatbotsPage, VoiceAgentsPage):** Structural rebuild of layouts to match prototype aesthetic — gradient mesh blob backgrounds, card redesign with gradient borders, warm CTA buttons. Not just color tokens.
    - **Supporting pages (AboutPage, PricingPage, HowItWorksPage, ContactPage, LegalPage):** Same structural rebuild — match prototype card styling, typography hierarchy, button design.
    - **MarketingMachinePage:** Add i18n support (currently hardcoded EN). Rebuild layout to match prototype aesthetic.
    - **Typography:** Switch body font from Inter to DM Sans (as prototype). Keep Space Grotesk for headings, JetBrains Mono for data.
    - **Shared components:** Evaluate SystemPanel, StatusIndicator, MetricDisplay, SectionContainer — build if useful for consistency, or intentionally skip and document why.
    - **Button design:** Primary CTAs use warm gradient (amber→darker amber, rounded-14px) not flat teal. Secondary CTAs use glass effect (backdrop-blur, subtle border).
    - **Card design:** All cards use gradient border-on-hover pattern from prototype (::before pseudo-element with mask). Numbered with service-number pattern.
    - **Animations:** Smooth CSS animations (fadeIn, fadeInUp, blob floating) — remove heavy Framer Motion where simple CSS suffices.
    - **Mobile:** SimplifiedHeroMobile.tsx must also be rebuilt to match new design language.
  - **Plans:** 7 plans
    - [ ] 11-01-PLAN.md — Foundation: DM Sans typography, Tailwind config (card/btn radius), CSS animations, GradientMesh component
    - [ ] 11-02-PLAN.md — Global chrome: CTAButton warm gradient + glass, SimpleHeader backdrop-blur nav, Footer token cleanup
    - [ ] 11-03-PLAN.md — Homepage: Hero left-aligned + OrbitVisual, 2x2 numbered service cards, GradientMesh wired globally
    - [ ] 11-04-PLAN.md — Service pages: Automations, Chatbots, VoiceAgents structural rebuild (card-gradient-border, CSS animations)
    - [ ] 11-05-PLAN.md — Supporting pages: About, Pricing, HowItWorks, Contact, Legal structural rebuild
    - [ ] 11-06-PLAN.md — MarketingMachinePage i18n (EN/NL/ES) + structural rebuild
    - [ ] 11-07-PLAN.md — Mobile hero rebuild + full-site visual verification checkpoint

- [x] **Phase 12: Design Polish & Media** — Premium hero visual (Spline 3D or Rive), product screenshots/demo video on service pages, micro-interactions (scroll reveals, card hover parallax), typography fine-tuning. (completed 2026-03-13)
  - **Goal:** Elevate the site from "well-structured" to "premium agency" level. Add interactive 3D hero visual, real product media (screenshots, demo videos), scroll-triggered animations, and typography polish. Research already gathered in phase directory.
  - **Requirement IDs:** REQ-HERO-3D, REQ-SCROLL-MICRO, REQ-PRODUCT-MEDIA, REQ-TYPOGRAPHY-POLISH
  - **Research:** `.planning/phases/12-design-polish-media/RESEARCH-NOTES.md`
  - **Depends on:** Phase 11
  - **Plans:** 4 plans
    - [ ] 12-01-PLAN.md — Foundation components: SplineHero, ScrollReveal, ProductMedia, useTilt hook + Spline dependency
    - [ ] 12-02-PLAN.md — Homepage wiring: SplineHero in Hero.tsx, ScrollReveal on sections, card tilt, CTAButton arrow animation
    - [ ] 12-03-PLAN.md — Service & supporting pages: ScrollReveal + card-tilt + ProductMedia placeholders + typography polish
    - [ ] 12-04-PLAN.md — Barrel exports + full-site visual verification checkpoint

- [x] **Phase 13: Dead Code Cleanup & Media Fix** — Remove orphaned Phase 3 components, delete useTilt hook, create placeholder media assets so ProductMedia doesn't 404. Gap closure from v1.0 audit. (completed 2026-03-13)
  - **Goal:** Clean up dead code from superseded Phase 3 components and fix ProductMedia 404s by providing lightweight placeholder assets. Resolve REQ-COMPONENTS (remove dead code) and REQ-PRODUCT-MEDIA (fix broken video elements).
  - **Requirement IDs:** REQ-COMPONENTS, REQ-PRODUCT-MEDIA
  - **Gap Closure:** v1.0 milestone audit — orphaned components, missing media directory
  - **Depends on:** Phase 12
  - **Plans:** 2 plans
    - [ ] 13-01-PLAN.md — Dead code deletion (4 orphaned components + useTilt hook + barrel export cleanup)
    - [ ] 13-02-PLAN.md — Placeholder media assets (8 files in public/media/ for ProductMedia components)

- [x] **Phase 14: Service Page i18n** — Wire useTranslation into AutomationsPage, ChatbotsPage, VoiceAgentsPage. Extract hardcoded English strings, add NL/ES translations. Gap closure from v1.0 audit. (completed 2026-03-13)
  - **Goal:** Make all service pages multilingual (EN/NL/ES) so the language switcher works consistently across the entire site. Currently these 3 pages have all text hardcoded in English.
  - **Requirement IDs:** REQ-SERVICE-I18N
  - **Gap Closure:** v1.0 milestone audit — broken service page language switch flow
  - **Depends on:** Phase 12
  - **Plans:** 3 plans
    - [ ] 14-01-PLAN.md — AutomationsPage i18n (EN/NL/ES namespace + component refactor)
    - [ ] 14-02-PLAN.md — ChatbotsPage i18n (EN/NL/ES namespace + component refactor)
    - [ ] 14-03-PLAN.md — VoiceAgentsPage i18n (EN/NL/ES namespace + component refactor)

- [x] **Phase 15: Chatbot Engine Foundation** — Build the shared persona-driven chatbot backend: Vercel AI SDK streaming, Claude integration, prompt caching, tool calling framework, persona router, rate limiting, security guardrails. (completed 2026-03-13)
  - **Goal:** Create a single API endpoint (`/api/chatbot`) that serves multiple chatbot personas with streaming responses, dual-model routing (Haiku/Sonnet), prompt caching, and tool execution. This is the backend foundation all chatbot personas depend on.
  - **Design reference:** `docs/plans/2026-03-13-chatbot-showcase-design.md`
  - **Requirement IDs:** REQ-CHATBOT-ENGINE
  - **Depends on:** Phase 14
  - **Key patterns adopted from SKC Sindy:** Hybrid prompt caching (static prefix + dynamic knowledge), zero-latency topic router, dual-model complexity routing, tool availability matrix, persona detection by request param.
  - **Scope:**
    - `api/chatbot.ts` — Single Vercel serverless endpoint with SSE streaming
    - `src/lib/chatbot/engine.ts` — Core engine: persona loading, model routing, streaming orchestration
    - `src/lib/chatbot/types.ts` — TypeScript types (ChatRequest, ChatResponse, PersonaConfig, ToolDefinition, etc.)
    - `src/lib/chatbot/persona-router.ts` — Persona config loading + validation
    - `src/lib/chatbot/topic-router.ts` — Zero-latency keyword-based knowledge selection (SKC pattern)
    - `src/lib/chatbot/prompt-builder.ts` — Hybrid prompt caching: static prefix (cached) + dynamic knowledge (per-request)
    - `src/lib/chatbot/tool-executor.ts` — Central tool execution with Zod validation + persona gating
    - `src/lib/chatbot/rate-limiter.ts` — Session limits (15 msg) + global limits (100/hr) + per-IP limits
    - `src/lib/chatbot/security.ts` — Input validation, PII blocking, output sanitization, prompt injection defense
    - `src/lib/chatbot/complexity-detector.ts` — Keyword + length based routing to Haiku vs Sonnet
    - Dependencies: `@ai-sdk/anthropic`, `ai` (Vercel AI SDK), `zod`
    - Remove: `openai` package dependency
  - **Plans:** 3 plans
    - [ ] 15-01-PLAN.md — Foundation: install deps + types.ts + security.ts + rate-limiter.ts + complexity-detector.ts
    - [ ] 15-02-PLAN.md — Persona infrastructure: topic-router.ts + prompt-builder.ts + persona-router.ts + tool-executor.ts
    - [ ] 15-03-PLAN.md — Engine wiring: engine.ts + api/chatbot.ts + index.ts + vercel.json CSP update

- [x] **Phase 16: Chatbot Personas & Knowledge** — Build all 5 persona configurations: system prompts, tool definitions, knowledge bases, topic routers, and conversation starters for concierge, e-commerce, lead-gen, support, and demo-guide personas. (completed 2026-03-13)
  - **Goal:** Create complete persona configs that plug into the Phase 15 engine. Each persona has: system prompt (with prompt-cache-friendly static prefix), tools with Zod schemas, knowledge base content, topic router keywords, suggested conversation starters (EN/NL/ES), and demo scenario descriptions.
  - **Design reference:** `docs/plans/2026-03-13-chatbot-showcase-design.md`
  - **Requirement IDs:** REQ-CHATBOT-PERSONAS
  - **Depends on:** Phase 15
  - **Parallel:** Can execute in parallel with Phase 17 (both depend only on Phase 15)
  - **Scope:**
    - `src/lib/chatbot/personas/concierge.ts` — Website concierge: FMai services, pricing, case studies, navigation. Tools: `get_services`, `book_call`, `navigate_to_page`, `get_case_study`
    - `src/lib/chatbot/personas/ecommerce.ts` — E-commerce advisor demo: mock skincare catalog (anonymized SKC data). Tools: `search_products`, `get_product_details`, `build_routine`, `add_to_cart_suggestion`
    - `src/lib/chatbot/personas/leadgen.ts` — Lead qualification demo: B2B SaaS scenario. Tools: `qualify_lead`, `get_pricing_info`, `schedule_demo`, `get_roi_estimate`
    - `src/lib/chatbot/personas/support.ts` — Knowledge base support demo: mock helpdesk. Tools: `search_knowledge_base`, `create_ticket`, `check_status`, `escalate_to_human`
    - `src/lib/chatbot/personas/demo-guide.ts` — Demo guide (ARIA v2): marketing machine demo flow. Tools: `navigate_to_page`, `explain_module`, `get_roi_info`, `book_demo`
    - `src/lib/chatbot/personas/index.ts` — Persona registry + factory
    - `src/lib/chatbot/knowledge/` — Knowledge base content files per persona
    - `src/lib/chatbot/tools/` — Tool executor implementations per persona (concierge-tools.ts, ecommerce-tools.ts, etc.)
    - i18n: Conversation starters + demo scenario descriptions in EN/NL/ES
  - **Plans:** 3 plans
    - [ ] 16-01-PLAN.md — Concierge + E-commerce personas (knowledge, tools, config, i18n starters)
    - [ ] 16-02-PLAN.md — Lead-gen + Support personas (knowledge, tools, config, i18n starters)
    - [ ] 16-03-PLAN.md — Demo Guide persona + registry index + tool-executor wiring + barrel exports

- [x] **Phase 17: ChatWidget UI Components** — Build the shared ChatWidget React component supporting floating mode (concierge/demo-guide) and embedded mode (demo playground). Includes message rendering with streaming, tool result cards, and suggested conversation starters. (completed 2026-03-13)
  - **Goal:** Create a single, configurable ChatWidget that works in two modes: floating (FAB + panel, for homepage concierge and demo guide) and embedded (inline, for /chatbots demo playground). Uses Vercel AI SDK `useChat` hook for streaming. Renders tool results as visual cards.
  - **Design reference:** `docs/plans/2026-03-13-chatbot-showcase-design.md`
  - **Requirement IDs:** REQ-CHATWIDGET-UI
  - **Depends on:** Phase 15
  - **Parallel:** Can execute in parallel with Phase 16 (both depend only on Phase 15)
  - **Scope:**
    - `src/components/chatbot/ChatWidget.tsx` — Main component with floating/embedded modes, Living System design tokens
    - `src/components/chatbot/ChatMessages.tsx` — Message list with streaming text display, typing indicators
    - `src/components/chatbot/ChatInput.tsx` — Input field with suggested conversation starters, send button
    - `src/components/chatbot/ChatHeader.tsx` — Persona name/avatar, minimize/close, demo mode badge + message counter
    - `src/components/chatbot/FloatingButton.tsx` — FAB for floating mode (replaces old FloatingActionButton)
    - `src/components/chatbot/tool-results/ProductCard.tsx` — E-commerce product display (image, price, description, CTA)
    - `src/components/chatbot/tool-results/LeadScoreCard.tsx` — Lead qualification score visualization
    - `src/components/chatbot/tool-results/KBArticleCard.tsx` — Knowledge base article preview
    - `src/components/chatbot/tool-results/TicketCard.tsx` — Support ticket status display
    - `src/components/chatbot/tool-results/ServiceCard.tsx` — FMai service info display (concierge)
    - `src/components/chatbot/tool-results/index.ts` — Barrel exports + ToolResultRenderer component
    - `src/stores/chatStore.ts` — New Zustand store: per-persona message history, streaming state, session management
    - `src/hooks/usePersonaChat.ts` — Hook wrapping Vercel AI SDK `useChat` with persona config
    - Styling: Living System design (dark surface, teal/amber accents, gradient borders, DM Sans)

- [x] **Phase 18: ChatbotsPage Demo Playground** — Restructure /chatbots page with interactive demo playground (3 switchable personas), multi-platform visual showcase, progressive CTAs, and updated marketing copy. (completed 2026-03-13)
  - **Goal:** Transform the /chatbots service page from static marketing into an interactive experience. Visitors can try 3 live chatbot demos (e-commerce, lead-gen, support) via tab switching. Each demo has scenario context, suggested starters, and session limits. Multi-platform showcase visualizes the 1-backend-multi-platform architecture. Progressive CTAs convert demo users to leads.
  - **Design reference:** `docs/plans/2026-03-13-chatbot-showcase-design.md`
  - **Requirement IDs:** REQ-CHATBOT-PLAYGROUND
  - **Depends on:** Phase 16, Phase 17
  - **Parallel:** Can execute in parallel with Phase 19 (both depend on Phase 16+17)
  - **Scope:**
    - `src/components/chatbot/DemoPlayground.tsx` — Full demo section: tab selector, context card, embedded ChatWidget, message counter, progressive CTAs
    - `src/components/chatbot/PersonaSelector.tsx` — Tab component for switching between e-commerce/leadgen/support demos
    - `src/components/chatbot/DemoContextCard.tsx` — Scenario description + capabilities list per active persona
    - `src/components/chatbot/ProgressiveCTA.tsx` — CTA that changes based on message count (subtle → strong → gate)
    - `src/components/chatbot/MultiPlatformShowcase.tsx` — Animated visual: 1 backend → website + Shopify + WhatsApp, with SKC case study
    - Update `src/pages/ChatbotsPage.tsx` — New hero copy, wire DemoPlayground + MultiPlatformShowcase, update use-cases to link to demos
    - i18n: Update `public/locales/{en,nl,es}/chatbots.json` with new demo copy, scenario descriptions, CTA text
    - Conversion funnel: Messages 1-4 pure demo, msg 5 subtle CTA, msg 10 stronger CTA, msg 15 gate with Calendly
  - **Plans:** 3 plans
    - [ ] 18-01-PLAN.md — Store extension + DemoPlayground + PersonaSelector + DemoContextCard (core orchestration)
    - [ ] 18-02-PLAN.md — ProgressiveCTA + MultiPlatformShowcase (conversion + marketing components)
    - [ ] 18-03-PLAN.md — ChatbotsPage wiring + i18n (EN/NL/ES) + barrel exports + visual verification

- [x] **Phase 19: Homepage Concierge + Demo Guide + ARIA Cleanup** — Wire concierge persona as floating chatbot on marketing pages, demo-guide persona on demo pages, remove all old ARIA code and OpenAI dependencies. (completed 2026-03-13)
  - **Goal:** Replace the entire ARIA system with the new persona-driven chatbot. Concierge persona floats on marketing pages (/, /pricing, /about, /chatbots, etc.). Demo-guide persona activates on demo pages (/explorer, /calculator, /dashboard) with page-context awareness and module follow-up behavior (preserved from ARIA). Clean removal of all old code.
  - **Design reference:** `docs/plans/2026-03-13-chatbot-showcase-design.md`
  - **Requirement IDs:** REQ-CHATBOT-CONCIERGE, REQ-ARIA-CLEANUP
  - **Depends on:** Phase 16, Phase 17
  - **Parallel:** Can execute in parallel with Phase 18 (both depend on Phase 16+17)
  - **Scope:**
    - Wire ChatWidget (floating mode) into `src/App.tsx` with persona switching based on route (marketing → concierge, demo → demo-guide)
    - Page context detection: concierge knows which marketing page visitor is on, demo-guide knows which demo step
    - Demo-guide: preserve ARIA's module follow-up behavior, contextual greetings, journey nudges — but powered by new engine
    - **Remove:** `src/components/ai-assistant/` (entire directory), `src/services/llmService.ts`, `src/utils/conversationEngine.ts`, `src/utils/intentRecognition.ts`, `src/utils/questionMatcher.ts`, `src/stores/chatStore.ts` (old), `src/stores/journeyStore.ts`, `src/types/chat.ts` (old), `src/config/knowledgeBase.json`, `src/config/conversationPersonality.ts`, `src/config/platformKnowledge.ts`, `src/config/assistantJourneys.ts`, `src/hooks/useModuleFollowUp.ts`, `src/hooks/useJourneyNudges.ts`, `src/hooks/useAchievementTracking.ts`, `api/chat.ts`
    - Remove `openai` package from dependencies
    - Update `src/App.tsx` to use new ChatWidget instead of AIJourneyAssistant
    - Verify all demo pages still work correctly without ARIA coupling
  - **Plans:** 2 plans
    - [ ] 19-01-PLAN.md — Wire ChatWidget floating mode with route-based persona switching + pageContext plumbing
    - [ ] 19-02-PLAN.md — Systematic ARIA cleanup (refactor shared deps, delete all ARIA files, clean barrels/i18n)

- [x] **Phase 20: Flagship Concierge Chatbot** — Unlimited multi-tool assistant with expandable side panel, navigation actions, and all persona capabilities. The "best of the best" main chatbot combining all tools, no message limit, rich UI with info panels and page navigation. (completed 2026-03-14)
  - **Goal:** Transform the floating concierge from a basic chat window into a flagship showcase — unlimited messages, all tools from every persona (navigation, product search, lead qualification, support tickets, booking, ROI calculation), expandable side panel for rich content (case studies, product cards, module details), and proactive page navigation buttons. This is the live demo of what FMai builds for clients.
  - **Requirement IDs:** REQ-FLAGSHIP-PERSONA, REQ-TOOL-CONSOLIDATION, REQ-UNLIMITED-MODE, REQ-SIDE-PANEL, REQ-NAVIGATION-ACTIONS, REQ-ARIA-REVIVAL, REQ-CONTEXT-AWARENESS, REQ-FLAGSHIP-WIRING
  - **Depends on:** Phase 19
  - **Plans:** 3 plans
    - [ ] 20-01-PLAN.md — Flagship persona backend (merged tools, KB, curated prompt, persona-aware rate limiter)
    - [ ] 20-02-PLAN.md — Side panel + navigation buttons + ChatWidget flagship mode
    - [ ] 20-03-PLAN.md — App.tsx flagship wiring + context-awareness hook + ARIA feature revival

- [x] **Phase 21: Guided Demo Mode** — Add guided demo mode to the flagship chatbot: hybrid orchestration (scripted user messages + real AI tool calls), 3 scenario-based flows, BookingCard with Calendly embed in side panel, progress indicators, checkpoints, and premium UX animations. (planned 2026-03-16) (completed 2026-03-16)
  - **Goal:** Walk prospects through realistic business scenarios with a single button press, showcasing all chatbot capabilities (17 tools, side panel, booking) using real AI responses. Two entry points: welcome message CTA + suggested prompt. Three scenarios: New Client Journey, E-commerce Brand, Client Support.
  - **Design reference:** `docs/plans/2026-03-16-guided-demo-mode-design.md`
  - **Implementation reference:** `docs/plans/2026-03-16-guided-demo-implementation.md`
  - **Requirement IDs:** REQ-DEMO-SCENARIOS, REQ-DEMO-STATE, REQ-BOOKING-SIDEPANEL, REQ-DEMO-UI-COMPONENTS, REQ-DEMO-ORCHESTRATOR, REQ-DEMO-ENTRY-POINTS, REQ-DEBUG-CLEANUP
  - **Depends on:** Phase 20
  - **Plans:** 3 plans
    - [ ] 21-01-PLAN.md — Foundation: scenario data + Zustand store extension + BookingCard + debug cleanup
    - [ ] 21-02-PLAN.md — Demo UI components: DemoScenarioCard + DemoCheckpoint + DemoProgress + DemoCompletionCard + pulseGlow CSS
    - [ ] 21-03-PLAN.md — Integration: DemoOrchestrator state machine + ChatWidget wiring + entry points + E2E test
