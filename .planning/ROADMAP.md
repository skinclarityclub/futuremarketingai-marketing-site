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
| 10    | 1/3                            | In Progress |            | 0%       |

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

- [ ] **Phase 10: Homepage Restructuring & Marketing Machine Page** — Restructure homepage as general FutureAI hub, create dedicated /marketing-machine page with moved content, dynamic branding per route, full i18n (EN/NL/ES)
  - **Goal:** Transform homepage from marketing-focused to general FutureAI overview. Create /marketing-machine page with relocated SocialProof/Features content + demo CTA. Ensure all translations consistent across EN/NL/ES.
  - **Requirement IDs:** REQ-HOMEPAGE-RESTRUCTURE
  - **Depends on:** Phase 9
  - **Plans:** 3 plans
    - [ ] 10-01-PLAN.md — Homepage hub restructuring (Hero rework, service cards grid, SimpleHeader branding)
    - [ ] 10-02-PLAN.md — MarketingMachinePage creation + routing (relocated components, App.tsx route)
    - [ ] 10-03-PLAN.md — i18n sync (NL/ES hero_landing fix, service card translations, ES structural fixes)
