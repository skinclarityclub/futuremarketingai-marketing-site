# Project Research Summary

**Project:** FMai Website -- Next.js Migration
**Domain:** B2B marketing website migration (Vite SPA to Next.js SSR/SSG) with SEO/GEO/LLMEO focus
**Researched:** 2026-03-18
**Confidence:** HIGH

## Executive Summary

This project migrates the FutureMarketingAI demo website from a Vite/React SPA to Next.js 16 with App Router. The current SPA is invisible to search engines and AI crawlers -- the migration exists to fix that. The recommended approach is a **server-first, client-islands architecture** where every page defaults to a React Server Component (handling metadata, structured data, and static content) with interactive elements isolated in `"use client"` islands. The stack is well-established: Next.js 16.1 with React 19.2, next-intl for i18n (replacing i18next), motion 12.x (renamed framer-motion), Tailwind CSS 4, and the existing AI SDK 6 chatbot engine largely unchanged. All core technologies are current stable releases with verified compatibility.

The migration is not a rewrite -- it is a re-architecture. The existing ~50+ components, 3 Zustand stores, 17 chatbot tools, and 30+ translation files carry over with structural changes rather than logic rewrites. The critical risk is "use client" overuse: marking everything client-side to make it compile fast, which would produce a Next.js app with zero SEO benefit -- the exact same problem the migration is supposed to solve. The second major risk is Framer Motion hydration mismatches causing CLS regressions (199 files use Framer Motion today). Both risks are preventable by establishing the server/client boundary architecture in Phase 1 before any component migration begins.

The SEO/GEO/LLMEO layer is the reason this migration exists and must not be deferred. Every page needs metadata, structured data (JSON-LD), semantic HTML, and locale-specific URLs from day one. The differentiators -- FAQ schema, llms.txt, prompt-aligned content, and a content hub -- build on top of this foundation and should follow shortly after the core migration ships.

## Key Findings

### Recommended Stack

The stack centers on Next.js 16.1 (Turbopack default, React 19.2, React Compiler) with next-intl 4.8 for i18n, motion 12.x for animations, and Tailwind CSS 4 with CSS-first configuration. The AI SDK 6 chatbot engine migrates with near-zero changes to a Route Handler. Schema-dts provides type-safe JSON-LD. Velite handles MDX blog content (replacing the abandoned Contentlayer).

**Core technologies:**

- **Next.js 16.1:** SSR/SSG framework with built-in Metadata API, sitemap, robots.txt -- eliminates 4+ third-party SEO packages
- **next-intl 4.8:** Purpose-built App Router i18n with Server Component support, replacing i18next (3 packages with 1)
- **motion 12.x:** Renamed framer-motion, same API, requires `"use client"` wrappers for RSC interop
- **Tailwind CSS 4:** CSS-first config via `@theme` directive, 5x faster builds with Oxide engine
- **AI SDK 6 + Anthropic:** Already in use, chatbot engine maps directly to Route Handlers
- **Velite 0.2:** MDX content processing for blog (pre-1.0 but best current option; Contentlayer is dead)
- **schema-dts 1.1:** Google-maintained TypeScript types for JSON-LD structured data

**Drop:** Three.js/Spline (heavy 3D), GSAP (redundant with motion), D3 (recharts covers it), react-icons (lucide-react covers it), i18next stack (replaced by next-intl).

### Expected Features

**Must have (table stakes):**

- SSR/SSG for all pages (the entire migration rationale)
- Per-page metadata with title, description, OG tags in all 3 locales
- Locale-prefixed URL routing (/en/, /nl/, /es/) with hreflang tags
- XML sitemap with locale alternates
- robots.txt with explicit AI crawler allow-policy
- Organization + WebSite + Service JSON-LD schemas
- Semantic HTML (replace div-soup with main, section, article, nav)
- next/image and next/font for Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1)
- Canonical URLs and proper 404/error pages

**Should have (differentiators):**

- FAQ sections with FAQPage schema on every service page (78% AI citation rate for Q&A format)
- Quick-answer blocks above the fold (direct answers in first 40-60 words)
- llms.txt and llms-full.txt (low effort, forward-looking AI discoverability)
- HowTo schema on methodology pages
- Dynamic OG image generation for social sharing
- Content freshness signals (dateModified in JSON-LD)
- Entity-first content architecture (consistent "Future Marketing AI" identity across all pages)

**Defer (v2+):**

- CMS integration (use file-based MDX first)
- Programmatic SEO / auto-generated pages (inappropriate for 4-service B2B site)
- Advanced AI citation tracking (tooling is immature in 2026)
- Topical authority content hub (highest effort, requires sustained publishing)

### Architecture Approach

The architecture follows a **server-first, client-islands** pattern. Every `page.tsx` is a Server Component that handles metadata and static content. Interactive elements (animations, chatbot, calculator, demo) are isolated in `"use client"` components pushed as deep into the tree as possible. The `[locale]` dynamic segment at the app root provides i18n routing via next-intl middleware. Zustand stores remain client-only, wrapped in a hydration-safe provider. The chatbot engine stays server-side in a Route Handler with the same request/response contract it has today.

**Major components:**

1. **Server Page Shells** (`app/[locale]/**/page.tsx`) -- metadata, structured data, static SEO content
2. **Client Islands** (components/) -- Framer Motion animations, interactive forms, chatbot widget
3. **Chatbot Engine** (`lib/chatbot/` + `app/api/chatbot/route.ts`) -- AI SDK streaming, 17 tools, persona routing (server-only)
4. **SEO Infrastructure** (`lib/metadata.ts` + `components/seo/`) -- shared metadata generator, JSON-LD components
5. **i18n Layer** (next-intl middleware + `messages/`) -- locale routing, merged translation files

### Critical Pitfalls

1. **"use client" overuse** -- Marking pages/layouts client-side to quickly silence errors defeats the migration. Establish server/client boundaries in Phase 1 with documented patterns before migrating any components.
2. **Framer Motion CLS** -- 199 files use Framer Motion. Server-rendered initial states cause layout shift on hydration. Use `initial={false}` above-fold, `whileInView` below-fold, and reserve container dimensions.
3. **Zustand persist hydration errors** -- 3 stores use `persist` with localStorage. Use `skipHydration: true` and delayed rehydration via `useEffect` to prevent server/client state mismatches.
4. **i18next incompatibility with RSC** -- i18next does not work with Server Components. Switch to next-intl in Phase 1; the translation JSON files migrate with minimal reformatting.
5. **Tailwind v3 to v4 visual regressions** -- CSS-first config is a fundamentally different approach. Migrate design tokens to `@theme` early, or use `@config` bridge as temporary fallback.
6. **Chatbot streaming in Route Handlers** -- Subtle differences from Vite edge functions. Start with minimal Route Handler (1 tool), verify streaming, then add complexity incrementally.

## Implications for Roadmap

### Phase 1: Foundation and Infrastructure

**Rationale:** Everything depends on i18n routing, Tailwind config, and the server/client boundary strategy. These must be solid before any component migration.
**Delivers:** Next.js project scaffold with working locale routing, design system, provider setup, and documented architecture patterns.
**Addresses:** SSR/SSG foundation, locale-prefixed routing, next-intl setup, translation file migration, Tailwind CSS 4 config, Zustand hydration pattern.
**Avoids:** "use client" overuse (by defining boundaries upfront), i18next incompatibility (by switching early), Tailwind visual regressions (by validating tokens early), Zustand hydration errors (by setting up patterns before store consumers exist).

### Phase 2: Core UI and Page Migration

**Rationale:** With infrastructure in place, migrate shared components first (they are used by all pages), then pages themselves. SEO metadata must be implemented per-page during migration, not deferred.
**Delivers:** All existing pages server-rendered with metadata, structured data, and semantic HTML. Shared UI components (Button, Card, Modal) and animation wrappers working.
**Addresses:** Semantic HTML, per-page metadata, Organization/WebSite/Service JSON-LD, next/image + next/font optimization, proper 404/error pages.
**Avoids:** Framer Motion CLS (by creating animation wrappers first and testing CLS per page).

### Phase 3: Interactive Features Migration

**Rationale:** Chatbot, calculator, and demo features are complex client-side systems that need the page shells from Phase 2 to exist. They should be migrated as a dedicated effort, not mixed with page migration.
**Delivers:** Working chatbot with streaming, all 17 tools, demo mode, calculator wizard, Calendly integration.
**Addresses:** Chatbot Route Handler, AI SDK streaming, tool serialization, demo orchestrator, calculator.
**Avoids:** Chatbot streaming breakage (by starting minimal and adding complexity), API key exposure (by keeping server-only env vars).

### Phase 4: SEO Differentiation and GEO/LLMEO

**Rationale:** With all pages and features migrated, add the differentiators that drive AI discoverability beyond basic SEO. These require pages to exist but are otherwise independent.
**Delivers:** FAQ schema on all service pages, llms.txt, quick-answer blocks, HowTo schema, dynamic OG images, breadcrumb schema, content freshness signals.
**Addresses:** GEO optimization, LLMEO features, FAQ sections, entity-first content, prompt-aligned headings.
**Avoids:** Over-engineering content strategy before the foundation is solid.

### Phase 5: Blog/Content Hub

**Rationale:** The blog is the longest dependency chain and highest effort, but also the largest long-term impact for topical authority. It requires Velite/MDX setup and a content strategy. The infrastructure should be built even if content populates gradually.
**Delivers:** Blog infrastructure with MDX, article schema, author attribution, ISR for blog pages.
**Addresses:** Content hub structure, Article schema, author/expert attribution, comparison content, topical authority foundation.

### Phase 6: Polish, Performance, and Cutover

**Rationale:** Final integration testing, analytics migration, performance benchmarking, and domain switch. Must come last because it validates everything.
**Delivers:** Production-ready site with analytics, monitoring, cookie consent, cross-browser testing, and domain cutover.
**Addresses:** Sentry migration, Vercel Analytics, Speed Insights, cookie consent, sitemap validation, robots.txt verification, Core Web Vitals benchmarking.

### Phase Ordering Rationale

- **Phase 1 before everything:** i18n routing and layout are dependencies for every page. Tailwind config affects every component. Getting these wrong means rework on everything built on top.
- **Phase 2 before 3:** Interactive features (chatbot, calculator) live inside page shells. The shells must exist first.
- **Phase 3 can partially overlap Phase 2:** Marketing pages and chatbot migration are independent work streams. But both need shared UI components from early Phase 2.
- **Phase 4 after 2-3:** GEO/LLMEO features (FAQ schema, llms.txt) require content pages to exist. They are additive, not structural.
- **Phase 5 semi-independent:** Blog infrastructure can start during Phase 4, but content creation is ongoing post-launch.
- **Phase 6 last:** Cannot benchmark what is not built. Domain switch is the final gate.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 3 (Interactive Features):** The chatbot has 17 tools, persona routing, and complexity detection. Route Handler streaming behavior and tool serialization across the server/client boundary need hands-on validation. Run `/gsd:research-phase` here.
- **Phase 5 (Blog/Content Hub):** Velite is pre-1.0. MDX integration with Next.js 16 specifically needs validation. Content strategy (what to write, publishing cadence) is a business decision that needs input beyond technical research.

Phases with standard patterns (skip research-phase):

- **Phase 1 (Foundation):** Next.js scaffolding, next-intl setup, and Tailwind config are thoroughly documented with official guides.
- **Phase 2 (Page Migration):** Server/client component patterns and Metadata API are core Next.js features with extensive documentation.
- **Phase 4 (SEO/GEO):** JSON-LD, FAQ schema, and llms.txt are well-documented standards.
- **Phase 6 (Polish):** Analytics, Sentry, and Vercel deployment are standard integrations.

## Confidence Assessment

| Area         | Confidence  | Notes                                                                                                                                                                                                                                              |
| ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH        | All core technologies verified against official docs. Next.js 16.1, React 19.2, next-intl 4.8, motion 12.x -- all current stable. Only Velite (pre-1.0) is a minor risk.                                                                           |
| Features     | MEDIUM-HIGH | SEO table stakes are well-established. GEO/LLMEO features are based on 2025-2026 industry research -- the field is still evolving, but the recommended approaches (FAQ schema, structured data, entity-first content) have measurable impact data. |
| Architecture | HIGH        | Server-first with client islands is the official Next.js pattern. The existing codebase analysis (199 Framer Motion files, 3 Zustand stores, 17 chatbot tools) provides concrete migration paths.                                                  |
| Pitfalls     | HIGH        | Pitfalls are sourced from official docs, known Next.js issues (e.g., #49279), and direct codebase analysis. Recovery strategies are documented for each.                                                                                           |

**Overall confidence:** HIGH

### Gaps to Address

- **Velite stability:** Pre-1.0 library for blog content processing. If it breaks with Next.js 16 during implementation, fallback is `@next/mdx` directly (more manual but stable). Validate during Phase 5 planning.
- **GEO measurement:** No established tooling for measuring AI citation rates in 2026. Tracking whether GEO efforts actually drive citations requires manual monitoring (checking ChatGPT, Perplexity responses). Revisit quarterly for new tools.
- **3D/Spline dependencies:** Research recommends dropping Three.js and Spline, but needs codebase audit to confirm they are not used for critical visuals. If they power a key animation, replace with CSS/motion alternative rather than just removing.
- **llms.txt adoption:** Speculative standard with 951 domains as of mid-2025. Zero cost to implement but no confirmed impact. Include it but do not invest significant effort.
- **Content strategy:** Technical infrastructure for the blog is clear, but what to write, how often, and in which languages is a business decision outside technical research scope.

## Sources

### Primary (HIGH confidence)

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- framework version, breaking changes, new features
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- SEO metadata implementation
- [Next.js Vite Migration Guide](https://nextjs.org/docs/app/guides/migrating/from-vite) -- migration patterns
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- architecture patterns
- [next-intl App Router Docs](https://next-intl.dev/docs/getting-started/app-router) -- i18n implementation
- [AI SDK Next.js Getting Started](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) -- chatbot migration
- [Tailwind CSS v4 Docs](https://tailwindcss.com/blog/tailwindcss-v4) -- styling migration
- [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) -- animation library migration
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/) -- monitoring setup
- [schema-dts GitHub](https://github.com/google/schema-dts) -- structured data types

### Secondary (MEDIUM confidence)

- [Search Engine Land: GEO Mastering Guide 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) -- GEO strategy
- [Search Engine Land: LLM Optimization 2026](https://searchengineland.com/llm-optimization-tracking-visibility-ai-discovery-463860) -- LLMEO approach
- [Frase.io: FAQ Schema for AI Search](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo) -- FAQ citation data
- [GEO Schema Markup Impact Study](https://relixir.ai/blog/schema-markup-boost-geo-performance-2025-data) -- 28% citation lift data
- Codebase analysis: 199 Framer Motion files, 3 persist stores, 10 namespaces x 3 locales, 17 chatbot tools

### Tertiary (LOW confidence)

- [llms.txt Proposal](https://searchengineland.com/llms-txt-proposed-standard-453676) -- speculative standard, 951 domains
- [Velite Introduction](https://velite.js.org/guide/introduction) -- pre-1.0 content tool

---

_Research completed: 2026-03-18_
_Ready for roadmap: yes_
