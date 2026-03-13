# Roadmap — FMai Website v1.0

## Progress

| Phase | Name                           | Status      | Plans      | Progress |
| ----- | ------------------------------ | ----------- | ---------- | -------- |
| 1     | Website Rebrand                | Complete    | —          | 100%     |
| 2     | Service Pages                  | Complete    | —          | 100%     |
| 3     | Design Overhaul & FMai Rebrand | Complete    | 2026-03-13 | 100%     |
| 4     | Upwork & Fiverr Setup          | Pending     | —          | 0%       |
| 5     | Cold Email Campaign            | Pending     | —          | 0%       |
| 6     | Voice Agent Partnership        | Pending     | —          | 0%       |
| 7     | SKC Case Study Development     | Pending     | —          | 0%       |
| 8     | Language Expansion             | Pending     | —          | 0%       |
| 9     | Living System Page Conversion  | Complete    | 2026-03-13 | 100%     |
| 10    | 3/3                            | Complete    | 2026-03-13 | 0%       |
| 11    | 7/7                            | Complete    | 2026-03-13 | 0%       |
| 12    | Design Polish & Media          | Complete    | 2026-03-13 | 100%     |
| 13    | 1/2                            | In Progress |            | 0%       |
| 14    | Service Page i18n              | Pending     | —          | 0%       |

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

- [ ] **Phase 13: Dead Code Cleanup & Media Fix** — Remove orphaned Phase 3 components, delete useTilt hook, create placeholder media assets so ProductMedia doesn't 404. Gap closure from v1.0 audit.
  - **Goal:** Clean up dead code from superseded Phase 3 components and fix ProductMedia 404s by providing lightweight placeholder assets. Resolve REQ-COMPONENTS (remove dead code) and REQ-PRODUCT-MEDIA (fix broken video elements).
  - **Requirement IDs:** REQ-COMPONENTS, REQ-PRODUCT-MEDIA
  - **Gap Closure:** v1.0 milestone audit — orphaned components, missing media directory
  - **Depends on:** Phase 12
  - **Plans:** 2 plans
    - [ ] 13-01-PLAN.md — Dead code deletion (4 orphaned components + useTilt hook + barrel export cleanup)
    - [ ] 13-02-PLAN.md — Placeholder media assets (8 files in public/media/ for ProductMedia components)

- [ ] **Phase 14: Service Page i18n** — Wire useTranslation into AutomationsPage, ChatbotsPage, VoiceAgentsPage. Extract hardcoded English strings, add NL/ES translations. Gap closure from v1.0 audit.
  - **Goal:** Make all service pages multilingual (EN/NL/ES) so the language switcher works consistently across the entire site. Currently these 3 pages have all text hardcoded in English.
  - **Requirement IDs:** REQ-SERVICE-I18N
  - **Gap Closure:** v1.0 milestone audit — broken service page language switch flow
  - **Depends on:** Phase 12
