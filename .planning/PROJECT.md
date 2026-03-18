# FMai Website — Next.js Migration

## What This Is

A complete migration of the FMai demo/showcase website from Vite/React SPA to Next.js with App Router. The migration preserves all existing functionality (service pages, chatbot, demo playground, guided demo mode) while adding full SEO/GEO/LLMEO capabilities, a blog/content hub, restructured pages, and performance optimizations. The goal is discoverability — ranking on Google for AI agency/marketing automation keywords and getting cited by AI assistants (ChatGPT, Perplexity, Gemini) when users ask about AI marketing services.

## Core Value

Every page must be fully indexable by search engines and AI crawlers, with structured data, semantic HTML, and optimized content — making FMai discoverable wherever potential B2B clients are searching.

## Requirements

### Validated

<!-- From existing Vite site — these work and must be preserved -->

- ✓ Living System design with DM Sans typography, teal/amber palette — existing
- ✓ Homepage with 4 service cards, orbit visual, gradient mesh — existing
- ✓ 4 service pages: Automations, Chatbots, Voice Agents, Marketing Machine — existing
- ✓ Supporting pages: About, Pricing, HowItWorks, Contact, Legal — existing
- ✓ Flagship concierge chatbot with 17 tools, side panel, context-aware behavior — existing
- ✓ 3-persona demo playground on Chatbots page — existing
- ✓ Guided demo mode with 3 scenarios, state machine orchestrator — existing
- ✓ EN/NL/ES internationalization — existing
- ✓ Framer Motion animations, ScrollReveal, card-tilt micro-interactions — existing
- ✓ Calendly CTA integration with modal pattern — existing
- ✓ Cookie consent — existing

### Active

<!-- New capabilities for this migration -->

- [ ] Next.js App Router with SSR/SSG for all pages
- [ ] SEO infrastructure: meta tags, Open Graph, JSON-LD structured data per page
- [ ] Sitemap.xml and robots.txt generation
- [ ] Blog/content hub page structure (content source TBD)
- [ ] Next.js i18n routing for EN/NL/ES with locale-prefixed URLs
- [ ] Image optimization via next/image
- [ ] Core Web Vitals optimization (LCP, FID, CLS targets)
- [ ] Semantic HTML structure across all pages
- [ ] Chatbot SSR enhancement — server-rendered initial load with client hydration
- [ ] Content/copy rework for SEO — keyword-optimized headlines and body text
- [ ] Page structure improvements — navigation, landing page hierarchy
- [ ] LLMEO optimization — AI-crawlable content, FAQ schemas, clear entity definitions
- [ ] API routes migration (chatbot endpoint) to Next.js Route Handlers

### Out of Scope

- Mobile app — web only
- CMS integration — blog structure only, content source decided later
- E-commerce/payments — this is a demo/showcase site
- User accounts/authentication — no login system needed
- Analytics platform migration — handled separately
- Redesign — keeping Living System design, not creating new visual language

## Context

The current Vite/React site is fully built (v1.0 milestone complete, 14 phases, 48 plans). It's a client-side rendered SPA which means zero SEO value — search engines and AI crawlers see an empty shell. The migration to Next.js unlocks server-side rendering, static generation, and proper metadata for every page.

The existing codebase has:

- ~50+ React components across pages, chatbot, and shared UI
- Zustand stores for chatbot state, demo state
- i18next with 3 locale files per namespace
- AI SDK v6 integration for chatbot streaming
- Vercel API endpoint for chatbot backend
- Tailwind CSS with custom design tokens
- Framer Motion throughout

This will be a **new repository** — clean Next.js project with components migrated from the Vite codebase. The old repo stays intact as reference.

Source repo: `C:\Users\daley\Desktop\Futuremarketingai` (this repo — Vite/React)
Target: New repo for Next.js build

## Constraints

- **Stack**: Next.js 15+ with App Router, React 19, TypeScript, Tailwind CSS 4
- **Deployment**: Vercel — same platform, optimized for Next.js
- **Design**: Living System design preserved — no visual redesign
- **i18n**: EN/NL/ES with locale-prefixed URL routing (/en/, /nl/, /es/)
- **Performance**: Core Web Vitals green scores (LCP <2.5s, FID <100ms, CLS <0.1)
- **Quality**: Full SEO optimization before domain switch — no "ship fast, fix later"
- **Compatibility**: Chatbot API routes must maintain same streaming behavior

## Key Decisions

| Decision                       | Rationale                                                            | Outcome   |
| ------------------------------ | -------------------------------------------------------------------- | --------- |
| New repository                 | Clean Next.js setup without Vite config conflicts, fresh git history | — Pending |
| Next.js App Router (not Pages) | Modern architecture, RSC support, better data fetching               | — Pending |
| Blog structure without CMS     | Content source TBD — set up file-based structure, swap source later  | — Pending |
| SSR chatbot enhancement        | Server-render initial chatbot chrome for faster perceived load       | — Pending |
| Quality over speed             | Everything optimized before domain switch                            | — Pending |

---

_Last updated: 2026-03-18 after initialization_
