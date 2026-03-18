# Requirements: FMai Website — Next.js Migration

**Defined:** 2026-03-18
**Core Value:** Every page must be fully indexable by search engines and AI crawlers, with structured data, semantic HTML, and optimized content

## v1 Requirements

Requirements for the Next.js migration. Each maps to roadmap phases.

### SEO Infrastructure

- [x] **SEO-01**: All pages server-rendered via Next.js App Router (SSR/SSG)
- [x] **SEO-02**: Per-page metadata (title, description, OG tags) localized for EN/NL/ES
- [x] **SEO-03**: Locale-prefixed URL routing (/en/, /nl/, /es/) with next-intl
- [x] **SEO-04**: Hreflang tags and canonical URLs via metadata alternates
- [x] **SEO-05**: XML sitemap with locale alternates for all pages
- [x] **SEO-06**: robots.txt with AI crawler allow-policy (allow retrieval bots, block training bots)
- [x] **SEO-07**: Semantic HTML structure across all pages (proper h1-h6, nav, main, section, article)
- [x] **SEO-08**: All images use next/image with explicit dimensions
- [x] **SEO-09**: Typography via next/font (DM Sans, JetBrains Mono) with zero layout shift
- [x] **SEO-10**: Custom 404 and error pages with proper HTTP status codes
- [x] **SEO-11**: Open Graph images for all pages (static or generated)
- [x] **SEO-12**: Dynamic OG image generation with Satori for branded social previews
- [ ] **SEO-13**: Core Web Vitals green scores (LCP <2.5s, INP <200ms, CLS <0.1)

### Structured Data

- [x] **SCHEMA-01**: Organization JSON-LD on all pages
- [x] **SCHEMA-02**: WebSite JSON-LD on homepage with SearchAction
- [x] **SCHEMA-03**: WebPage JSON-LD on all subpages
- [x] **SCHEMA-04**: Service JSON-LD per service page (Automations, Chatbots, Voice Agents, Marketing Machine)
- [x] **SCHEMA-05**: BreadcrumbList JSON-LD generated from route structure
- [ ] **SCHEMA-06**: FAQPage JSON-LD with 5-8 FAQ items per service page
- [ ] **SCHEMA-07**: HowTo JSON-LD on How It Works page
- [x] **SCHEMA-08**: dateModified in JSON-LD on all pages for content freshness

### GEO/LLMEO

- [x] **GEO-01**: llms.txt at domain root with site summary and key page links
- [x] **GEO-02**: llms-full.txt with expanded content for AI crawlers
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

- [x] **INT-01**: Flagship concierge chatbot with SSR chrome and client hydration
- [x] **INT-02**: All 17 chatbot tools migrated to Next.js Route Handlers
- [x] **INT-03**: 3-persona demo playground on Chatbots page
- [x] **INT-04**: Guided demo mode with 3 scenarios and state machine
- [x] **INT-05**: motion v12 animations with "use client" wrapper pattern
- [x] **INT-06**: Zustand stores migrated with hydration-safe patterns
- [x] **INT-07**: i18next → next-intl translation migration (EN/NL/ES, all namespaces)
- [x] **INT-08**: Calendly CTA integration with modal pattern
- [x] **INT-09**: Cookie consent

### Page Migration

- [x] **PAGE-01**: Homepage with service cards, orbit visual, gradient mesh
- [x] **PAGE-02**: Automations service page
- [x] **PAGE-03**: Chatbots service page with demo playground
- [x] **PAGE-04**: Voice Agents service page
- [x] **PAGE-05**: Marketing Machine service page
- [x] **PAGE-06**: About page
- [x] **PAGE-07**: Pricing page with comparison tables
- [x] **PAGE-08**: How It Works page
- [x] **PAGE-09**: Contact page
- [x] **PAGE-10**: Legal page
- [x] **PAGE-11**: Content/copy rework for SEO on all pages

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

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| SEO-01      | Phase 1 | Complete |
| SEO-02      | Phase 2 | Complete |
| SEO-03      | Phase 1 | Complete |
| SEO-04      | Phase 2 | Complete |
| SEO-05      | Phase 2 | Complete |
| SEO-06      | Phase 2 | Complete |
| SEO-07      | Phase 2 | Complete |
| SEO-08      | Phase 2 | Complete |
| SEO-09      | Phase 1 | Complete |
| SEO-10      | Phase 2 | Complete |
| SEO-11      | Phase 4 | Complete |
| SEO-12      | Phase 4 | Complete |
| SEO-13      | Phase 6 | Pending  |
| SCHEMA-01   | Phase 2 | Complete |
| SCHEMA-02   | Phase 2 | Complete |
| SCHEMA-03   | Phase 2 | Complete |
| SCHEMA-04   | Phase 2 | Complete |
| SCHEMA-05   | Phase 2 | Complete |
| SCHEMA-06   | Phase 4 | Pending  |
| SCHEMA-07   | Phase 4 | Pending  |
| SCHEMA-08   | Phase 2 | Complete |
| GEO-01      | Phase 4 | Complete |
| GEO-02      | Phase 4 | Complete |
| GEO-03      | Phase 4 | Pending  |
| GEO-04      | Phase 4 | Pending  |
| GEO-05      | Phase 4 | Pending  |
| BLOG-01     | Phase 5 | Pending  |
| BLOG-02     | Phase 5 | Pending  |
| BLOG-03     | Phase 5 | Pending  |
| BLOG-04     | Phase 5 | Pending  |
| BLOG-05     | Phase 5 | Pending  |
| INT-01      | Phase 3 | Complete |
| INT-02      | Phase 3 | Complete |
| INT-03      | Phase 3 | Complete |
| INT-04      | Phase 3 | Complete |
| INT-05      | Phase 3 | Complete |
| INT-06      | Phase 1 | Complete |
| INT-07      | Phase 1 | Complete |
| INT-08      | Phase 3 | Complete |
| INT-09      | Phase 3 | Complete |
| PAGE-01     | Phase 2 | Complete |
| PAGE-02     | Phase 2 | Complete |
| PAGE-03     | Phase 2 | Complete |
| PAGE-04     | Phase 2 | Complete |
| PAGE-05     | Phase 2 | Complete |
| PAGE-06     | Phase 2 | Complete |
| PAGE-07     | Phase 2 | Complete |
| PAGE-08     | Phase 2 | Complete |
| PAGE-09     | Phase 2 | Complete |
| PAGE-10     | Phase 2 | Complete |
| PAGE-11     | Phase 2 | Complete |

**Coverage:**

- v1 requirements: 51 total
- Mapped to phases: 51
- Unmapped: 0

---

_Requirements defined: 2026-03-18_
_Last updated: 2026-03-18 after roadmap creation_
