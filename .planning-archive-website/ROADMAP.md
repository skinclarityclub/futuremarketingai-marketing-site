# Roadmap: FMai Website — Next.js Migration

## Milestones

- **v1.0 MVP** - Phases 1-21 (shipped 2026-03-16) — Vite/React SPA complete
- **v2.0 Next.js Migration** - Phases 1-6 (in progress) — SSR/SSG with full SEO/GEO/LLMEO

## Overview

Migrate the FMai demo/showcase website from a Vite/React SPA to Next.js with App Router, transforming an invisible-to-search-engines SPA into a fully indexable, AI-discoverable B2B website. The migration progresses from infrastructure (i18n routing, design system, server/client boundary patterns) through page migration with built-in SEO, interactive feature migration (chatbot with 17 tools as the most complex), SEO differentiation layers (GEO/LLMEO), blog infrastructure, and finally performance validation and domain cutover. This is a new repository -- the existing Vite codebase stays intact as reference.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Infrastructure** - Next.js scaffold, i18n routing with next-intl, Tailwind v4 design system, server/client boundary patterns
- [ ] **Phase 2: Page Migration and Core SEO** - All 10 pages server-rendered with per-page metadata, JSON-LD structured data, and semantic HTML
- [ ] **Phase 3: Interactive Features** - Chatbot engine with 17 tools via Route Handler, demo mode, persona playground, motion v12 animations, Calendly, cookie consent
- [ ] **Phase 4: SEO Differentiation and GEO/LLMEO** - FAQ schema, llms.txt, quick-answer blocks, entity-first content, dynamic OG images
- [ ] **Phase 5: Content Hub** - Blog infrastructure with MDX/Velite, article schema, author attribution, ISR
- [ ] **Phase 6: Performance, Polish, and Cutover** - Core Web Vitals optimization, structured data validation, cross-browser testing, domain cutover

## Phase Details

### Phase 1: Foundation and Infrastructure

**Goal**: A working Next.js foundation exists with locale-routed pages, migrated design system, and documented server/client boundary patterns that prevent "use client" overuse
**Depends on**: Nothing (first phase)
**Requirements**: SEO-01, SEO-03, SEO-09, INT-06, INT-07
**Success Criteria** (what must be TRUE):

1. Next.js app runs locally with App Router and the [locale] dynamic segment routing requests to /en/, /nl/, /es/ URLs correctly
2. A sample page renders server-side with next-intl translations loaded from migrated translation files in all 3 locales (EN/NL/ES)
3. Tailwind CSS 4 is configured with Living System design tokens (DM Sans typography, teal/amber palette) and a reference component renders identically to the Vite version
4. A documented server/client boundary pattern exists with a working example of a Server Component page containing a "use client" island (prevents the critical "use client" overuse pitfall)
5. Zustand stores are migrated with hydration-safe patterns (skipHydration + delayed rehydration) verified with zero server/client mismatch errors
   **Plans**: 3 plans

Plans:

- [ ] 01-01: Next.js project scaffold and App Router configuration
- [ ] 01-02: i18n routing and translation migration (i18next to next-intl, 30+ translation files)
- [ ] 01-03: Design system migration (Tailwind v4, next/font, tokens) and provider setup (Zustand hydration)

### Phase 2: Page Migration and Core SEO

**Goal**: All 10 existing pages are server-rendered with per-page metadata, JSON-LD structured data, and semantic HTML -- every page is fully indexable by search engines and AI crawlers
**Depends on**: Phase 1
**Requirements**: SEO-02, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-10, SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04, SCHEMA-05, SCHEMA-08, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08, PAGE-09, PAGE-10, PAGE-11
**Success Criteria** (what must be TRUE):

1. All 10 pages (Homepage, Automations, Chatbots, Voice Agents, Marketing Machine, About, Pricing, How It Works, Contact, Legal) render server-side with correct content in all 3 locales
2. Every page has unique, localized meta title, description, and Open Graph tags visible in the HTML source
3. JSON-LD structured data renders in page source: Organization on all pages, WebSite with SearchAction on homepage, Service on each service page, WebPage on subpages, BreadcrumbList from route structure, dateModified on all pages
4. XML sitemap is accessible with all pages and locale alternates; robots.txt includes AI crawler allow-policy
5. Custom 404 page returns HTTP 404 status; all images use next/image with explicit dimensions; hreflang and canonical URLs are correct
   **Plans**: 5 plans

Plans:

- [ ] 02-01: SEO infrastructure (shared metadata generator, JSON-LD components, sitemap, robots.txt, error pages)
- [ ] 02-02: Shared UI component migration (layout, cards, buttons, modals) with semantic HTML
- [ ] 02-03: Homepage and 4 service page migration with structured data and SEO copy rework
- [ ] 02-04: Supporting page migration (About, Pricing, How It Works, Contact, Legal) with structured data
- [ ] 02-05: Gap closure -- sitemap.ts, robots.ts, not-found.tsx, error.tsx, x-default hreflang fix

### Phase 3: Interactive Features

**Goal**: All interactive features from the Vite site work in the Next.js app -- the flagship chatbot with streaming and 17 tools, demo mode, persona playground, motion animations, Calendly integration, and cookie consent
**Depends on**: Phase 2
**Requirements**: INT-01, INT-02, INT-03, INT-04, INT-05, INT-08, INT-09
**Success Criteria** (what must be TRUE):

1. Chatbot opens with server-rendered chrome, streams responses via Next.js Route Handler, and all 17 tools execute correctly with results rendering in the side panel
2. 3-persona demo playground on the Chatbots page lets users switch personas and receive persona-specific responses with progressive CTAs
3. Guided demo mode walks through all 3 scenarios with the state machine orchestrator controlling progression and booking flow
4. Motion v12 animations render without layout shift above the fold -- scroll reveals, card tilts, page transitions, and gradient mesh all work
5. Calendly modal opens from CTA buttons across all pages; cookie consent banner appears and persists user preference
   **Plans**: 4 plans

Plans:

- [x] 03-01: Animation wrapper pattern (motion v12 "use client" islands) and shared interactive components
- [ ] 03-02: Chatbot engine migration (Route Handler, AI SDK streaming, 17 tools, side panel, persona routing)
- [ ] 03-03: Demo mode, persona playground, Calendly integration, and cookie consent
- [ ] 03-04: Gap closure -- Wire orphaned ScrollReveal into pages and CalendlyModal into layout/CTAs

### Phase 4: SEO Differentiation and GEO/LLMEO

**Goal**: The site goes beyond basic SEO with AI-optimized content structures that make FMai citeable by AI assistants and prominent in generative search results
**Depends on**: Phase 2 (pages must exist; independent of Phase 3)
**Requirements**: SEO-11, SEO-12, SCHEMA-06, SCHEMA-07, GEO-01, GEO-02, GEO-03, GEO-04, GEO-05
**Success Criteria** (what must be TRUE):

1. Every service page has a 5-8 item FAQ section with valid FAQPage JSON-LD; How It Works page has HowTo JSON-LD
2. llms.txt and llms-full.txt are accessible at the domain root with accurate site summary and key page links
3. Each service page has a quick-answer block (1-2 sentence definition) above the fold and question-based H2/H3 headings matching AI query patterns
4. "Future Marketing AI" entity definition appears consistently across all pages with entity-first content structure
5. Dynamic OG images generate via Satori for all pages with branded social preview design
   **Plans**: 2 plans

Plans:

- [ ] 04-01-PLAN.md — FAQ/HowTo schema + GEO content (QuickAnswer blocks, entity-first, question-based headings)
- [ ] 04-02-PLAN.md — LLMEO artifacts (llms.txt, llms-full.txt) + dynamic OG images (Satori + middleware fix)

### Phase 5: Content Hub

**Goal**: A functional blog infrastructure exists where MDX articles render as fully SEO-optimized pages with proper schema and ISR, ready for content to be published
**Depends on**: Phase 2 (pages must exist; independent of Phases 3-4)
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05
**Success Criteria** (what must be TRUE):

1. Blog listing page displays posts with category filtering, renders server-side, and is included in sitemap
2. Individual blog posts render from MDX files with Article JSON-LD, datePublished, dateModified, and author Person schema
3. Blog pages use ISR so new posts appear without full rebuild
4. At least one seed article is published as proof the full pipeline works end-to-end (MDX to rendered page with schema)
   **Plans**: 2 plans

Plans:

- [ ] 05-01-PLAN.md — Blog infrastructure (@next/mdx setup, blog utilities, listing page with category filter)
- [ ] 05-02-PLAN.md — Blog post template, Article/Person JSON-LD, ISR, sitemap integration, and seed article

### Phase 6: Performance, Polish, and Cutover

**Goal**: The site meets all Core Web Vitals targets, passes structured data validation, works across browsers, and is production-ready for domain cutover from the Vite site
**Depends on**: Phase 3, Phase 4, Phase 5 (everything must be built before final validation)
**Requirements**: SEO-13
**Success Criteria** (what must be TRUE):

1. Core Web Vitals are green on all pages: LCP <2.5s, INP <200ms, CLS <0.1 as measured by Lighthouse
2. All JSON-LD structured data validates with zero errors in Google Rich Results Test
3. Full sitemap and robots.txt are verified complete; hreflang tags are correct across all locale/page combinations
4. Site renders correctly in Chrome, Firefox, Safari, and Edge with no visual regressions compared to the Vite version
   **Plans**: 2 plans

Plans:

- [ ] 06-01-PLAN.md — Performance optimization (bundle analyzer, dynamic imports for chatbot/calendly, CWV tuning)
- [ ] 06-02-PLAN.md — Cross-validation (structured data audit, Lighthouse CWV audit, browser testing) and cutover readiness

## Progress

**Execution Order:**
Phases 1 and 2 are sequential. After Phase 2, Phases 3, 4, and 5 can execute in parallel (all depend on Phase 2 but not on each other). Phase 6 waits for all others.

| Phase                                | Plans Complete | Status      | Completed |
| ------------------------------------ | -------------- | ----------- | --------- |
| 1. Foundation and Infrastructure     | 0/3            | Not started | -         |
| 2. Page Migration and Core SEO       | 0/5            | Not started | -         |
| 3. Interactive Features              | 0/4            | Not started | -         |
| 4. SEO Differentiation and GEO/LLMEO | 0/2            | Not started | -         |
| 5. Content Hub                       | 0/2            | Not started | -         |
| 6. Performance, Polish, and Cutover  | 0/2            | Not started | -         |
