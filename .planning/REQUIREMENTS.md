# Requirements: FMai Website — Next.js Migration

**Defined:** 2026-03-18
**Core Value:** Every page must be fully indexable by search engines and AI crawlers, with structured data, semantic HTML, and optimized content

## v1 Requirements

Requirements for the Next.js migration. Each maps to roadmap phases.

### SEO Infrastructure

- [ ] **SEO-01**: All pages server-rendered via Next.js App Router (SSR/SSG)
- [ ] **SEO-02**: Per-page metadata (title, description, OG tags) localized for EN/NL/ES
- [ ] **SEO-03**: Locale-prefixed URL routing (/en/, /nl/, /es/) with next-intl
- [ ] **SEO-04**: Hreflang tags and canonical URLs via metadata alternates
- [ ] **SEO-05**: XML sitemap with locale alternates for all pages
- [ ] **SEO-06**: robots.txt with AI crawler allow-policy (allow retrieval bots, block training bots)
- [ ] **SEO-07**: Semantic HTML structure across all pages (proper h1-h6, nav, main, section, article)
- [ ] **SEO-08**: All images use next/image with explicit dimensions
- [ ] **SEO-09**: Typography via next/font (DM Sans, JetBrains Mono) with zero layout shift
- [ ] **SEO-10**: Custom 404 and error pages with proper HTTP status codes
- [ ] **SEO-11**: Open Graph images for all pages (static or generated)
- [ ] **SEO-12**: Dynamic OG image generation with Satori for branded social previews
- [ ] **SEO-13**: Core Web Vitals green scores (LCP <2.5s, INP <200ms, CLS <0.1)

### Structured Data

- [ ] **SCHEMA-01**: Organization JSON-LD on all pages
- [ ] **SCHEMA-02**: WebSite JSON-LD on homepage with SearchAction
- [ ] **SCHEMA-03**: WebPage JSON-LD on all subpages
- [ ] **SCHEMA-04**: Service JSON-LD per service page (Automations, Chatbots, Voice Agents, Marketing Machine)
- [ ] **SCHEMA-05**: BreadcrumbList JSON-LD generated from route structure
- [ ] **SCHEMA-06**: FAQPage JSON-LD with 5-8 FAQ items per service page
- [ ] **SCHEMA-07**: HowTo JSON-LD on How It Works page
- [ ] **SCHEMA-08**: dateModified in JSON-LD on all pages for content freshness

### GEO/LLMEO

- [ ] **GEO-01**: llms.txt at domain root with site summary and key page links
- [ ] **GEO-02**: llms-full.txt with expanded content for AI crawlers
- [ ] **GEO-03**: Quick-answer blocks (1-2 sentence definitions) above fold on each service page
- [ ] **GEO-04**: Entity-first content — consistent FMai entity definition across all pages
- [ ] **GEO-05**: Prompt-aligned headings — question-based H2/H3 matching AI query patterns

### Content Hub

- [ ] **BLOG-01**: Blog/content hub page structure with MDX support
- [ ] **BLOG-02**: Blog listing page with category filtering
- [ ] **BLOG-03**: Individual blog post template with Article JSON-LD
- [ ] **BLOG-04**: Author attribution with Person schema
- [ ] **BLOG-05**: ISR (Incremental Static Regeneration) for blog pages

### Interactive Features

- [ ] **INT-01**: Flagship concierge chatbot with SSR chrome and client hydration
- [ ] **INT-02**: All 17 chatbot tools migrated to Next.js Route Handlers
- [ ] **INT-03**: 3-persona demo playground on Chatbots page
- [ ] **INT-04**: Guided demo mode with 3 scenarios and state machine
- [ ] **INT-05**: motion v12 animations with "use client" wrapper pattern
- [ ] **INT-06**: Zustand stores migrated with hydration-safe patterns
- [ ] **INT-07**: i18next → next-intl translation migration (EN/NL/ES, all namespaces)
- [ ] **INT-08**: Calendly CTA integration with modal pattern
- [ ] **INT-09**: Cookie consent

### Page Migration

- [ ] **PAGE-01**: Homepage with service cards, orbit visual, gradient mesh
- [ ] **PAGE-02**: Automations service page
- [ ] **PAGE-03**: Chatbots service page with demo playground
- [ ] **PAGE-04**: Voice Agents service page
- [ ] **PAGE-05**: Marketing Machine service page
- [ ] **PAGE-06**: About page
- [ ] **PAGE-07**: Pricing page with comparison tables
- [ ] **PAGE-08**: How It Works page
- [ ] **PAGE-09**: Contact page
- [ ] **PAGE-10**: Legal page
- [ ] **PAGE-11**: Content/copy rework for SEO on all pages

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Strategy

- **CONT-01**: Comparison and "vs" content pages (AI chatbot vs live chat, etc.)
- **CONT-02**: Data-dense content with defensible statistics
- **CONT-03**: Regular publishing cadence for topical authority
- **CONT-04**: CMS integration (Sanity/Contentful) when content volume justifies it

### Analytics

- **ANAL-01**: AI citation tracking (tooling immature in 2026, revisit quarterly)
- **ANAL-02**: Advanced SEO rank tracking per locale

## Out of Scope

| Feature                                 | Reason                                                         |
| --------------------------------------- | -------------------------------------------------------------- |
| Mobile app                              | Web only                                                       |
| E-commerce/payments                     | Demo/showcase site, not transactional                          |
| User accounts/authentication            | No login system needed                                         |
| Programmatic SEO / auto-generated pages | Low-quality pages hurt domain authority for a 4-service agency |
| Separate mobile site (m-dot)            | Responsive design within same routes                           |
| Client-side-only routing for content    | Defeats the migration purpose                                  |
| Keyword stuffing / SEO spam             | Penalized by Google and AI systems                             |
| Full CMS integration                    | Blog structure only, content source TBD                        |
| Visual redesign                         | Keeping Living System design                                   |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| SEO-01      | Phase 1 | Pending |
| SEO-02      | Phase 2 | Pending |
| SEO-03      | Phase 1 | Pending |
| SEO-04      | Phase 2 | Pending |
| SEO-05      | Phase 2 | Pending |
| SEO-06      | Phase 2 | Pending |
| SEO-07      | Phase 2 | Pending |
| SEO-08      | Phase 2 | Pending |
| SEO-09      | Phase 1 | Pending |
| SEO-10      | Phase 2 | Pending |
| SEO-11      | Phase 4 | Pending |
| SEO-12      | Phase 4 | Pending |
| SEO-13      | Phase 6 | Pending |
| SCHEMA-01   | Phase 2 | Pending |
| SCHEMA-02   | Phase 2 | Pending |
| SCHEMA-03   | Phase 2 | Pending |
| SCHEMA-04   | Phase 2 | Pending |
| SCHEMA-05   | Phase 2 | Pending |
| SCHEMA-06   | Phase 4 | Pending |
| SCHEMA-07   | Phase 4 | Pending |
| SCHEMA-08   | Phase 2 | Pending |
| GEO-01      | Phase 4 | Pending |
| GEO-02      | Phase 4 | Pending |
| GEO-03      | Phase 4 | Pending |
| GEO-04      | Phase 4 | Pending |
| GEO-05      | Phase 4 | Pending |
| BLOG-01     | Phase 5 | Pending |
| BLOG-02     | Phase 5 | Pending |
| BLOG-03     | Phase 5 | Pending |
| BLOG-04     | Phase 5 | Pending |
| BLOG-05     | Phase 5 | Pending |
| INT-01      | Phase 3 | Pending |
| INT-02      | Phase 3 | Pending |
| INT-03      | Phase 3 | Pending |
| INT-04      | Phase 3 | Pending |
| INT-05      | Phase 3 | Pending |
| INT-06      | Phase 1 | Pending |
| INT-07      | Phase 1 | Pending |
| INT-08      | Phase 3 | Pending |
| INT-09      | Phase 3 | Pending |
| PAGE-01     | Phase 2 | Pending |
| PAGE-02     | Phase 2 | Pending |
| PAGE-03     | Phase 2 | Pending |
| PAGE-04     | Phase 2 | Pending |
| PAGE-05     | Phase 2 | Pending |
| PAGE-06     | Phase 2 | Pending |
| PAGE-07     | Phase 2 | Pending |
| PAGE-08     | Phase 2 | Pending |
| PAGE-09     | Phase 2 | Pending |
| PAGE-10     | Phase 2 | Pending |
| PAGE-11     | Phase 2 | Pending |

**Coverage:**

- v1 requirements: 51 total
- Mapped to phases: 51
- Unmapped: 0

---

_Requirements defined: 2026-03-18_
_Last updated: 2026-03-18 after roadmap creation_
