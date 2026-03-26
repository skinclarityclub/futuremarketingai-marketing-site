# Feature Landscape: SEO / GEO / LLMEO for Next.js Migration

**Domain:** B2B AI agency marketing website -- Next.js migration with AI discoverability focus
**Researched:** 2026-03-18
**Confidence:** MEDIUM-HIGH (verified against Next.js official docs + multiple 2026 industry sources)

## Table Stakes

Features search engines and AI crawlers expect. Missing any of these means pages are invisible or poorly indexed.

### Traditional SEO Infrastructure

| Feature                                             | Why Expected                                                                                               | Complexity | Notes                                                                                                                                                              |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Server-side rendering (SSR/SSG) for all pages       | Current Vite SPA is invisible to crawlers -- SSR is the entire reason for the migration                    | Low        | Next.js App Router does this by default with React Server Components. Static pages use SSG, dynamic pages use SSR.                                                 |
| Metadata API per page (title, description, OG tags) | Google, social platforms, and AI crawlers all read meta tags to understand page purpose                    | Low        | Use Next.js `generateMetadata` or static `metadata` export in each `page.tsx`. Include `title`, `description`, `openGraph`, `twitter`, `robots` per page.          |
| Open Graph images per page                          | Social sharing and link previews in Slack/LinkedIn/WhatsApp require OG images                              | Med        | Use Next.js `opengraph-image.tsx` convention for auto-generated OG images, or static images per page. B2B prospects share links -- ugly previews kill credibility. |
| Canonical URLs                                      | Prevents duplicate content penalties across locale variants                                                | Low        | Set via metadata API `alternates.canonical`. Critical with 3 locale variants.                                                                                      |
| Hreflang tags for EN/NL/ES                          | Google serves wrong locale without hreflang, killing rankings in each language market                      | Low        | Use `alternates.languages` in metadata. Include `x-default` pointing to EN. Must be consistent across all pages.                                                   |
| XML sitemap with locale alternates                  | Search engines discover and index all pages; locale alternates tell Google about language variants         | Low        | Use Next.js `sitemap.ts` convention. Generate entries for all 3 locales with `alternates.languages` per URL.                                                       |
| robots.txt with AI crawler policy                   | Controls what gets indexed and by whom. Blocking AI crawlers by accident means zero GEO/LLMEO value.       | Low        | Allow: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot. Block training-only bots: GPTBot, Google-Extended, CCBot.    |
| Semantic HTML structure                             | Crawlers use heading hierarchy (h1-h6), sections, articles, nav, main to understand content structure      | Med        | Replace div-soup with semantic elements. One `h1` per page, logical heading hierarchy. Affects both SEO and AI content extraction.                                 |
| next/image for all images                           | Google penalizes slow LCP; unoptimized images are the #1 LCP killer                                        | Low        | Replaces `<img>` tags. Handles lazy loading, WebP/AVIF conversion, responsive sizing. Set explicit width/height to prevent CLS.                                    |
| next/font for typography                            | Eliminates font FOIT/FOUT which causes CLS shifts, a Core Web Vital                                        | Low        | Load Inter and JetBrains Mono via `next/font/google`. Zero-layout-shift font loading.                                                                              |
| Core Web Vitals green scores                        | Google ranking factor since 2021. Targets: LCP <2.5s, INP <200ms, CLS <0.1. 43% of sites fail INP in 2026. | Med        | Next.js provides built-in optimization (RSC reduces JS, Streaming/Suspense for progressive rendering). Heavy Framer Motion usage is the main risk for INP.         |
| 404 and error pages with proper status codes        | SPA returns 200 for all routes including missing pages -- search engines see broken site                   | Low        | Use Next.js `not-found.tsx` convention. Returns proper 404 status code.                                                                                            |

### Structured Data (JSON-LD)

| Feature                          | Why Expected                                                                             | Complexity | Notes                                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Organization schema on all pages | Establishes entity identity for Google Knowledge Panel and AI entity recognition         | Low        | JSON-LD with `@type: Organization`, name, logo, URL, social profiles. Place in root layout.                                                            |
| Service schema per service page  | Google Rich Results for services; AI crawlers extract service descriptions for citations | Med        | `@type: Service` for each of the 4 services (Automations, Chatbots, Voice Agents, Marketing Machine). Include `provider`, `areaServed`, `description`. |
| Breadcrumb schema                | Google displays breadcrumb trail in search results; improves CTR                         | Low        | `@type: BreadcrumbList` generated from route structure.                                                                                                |
| WebPage/WebSite schema           | Baseline structured data that search engines and AI use to classify page type            | Low        | `@type: WebSite` with `potentialAction: SearchAction` on homepage. `@type: WebPage` on subpages.                                                       |

### i18n SEO

| Feature                                        | Why Expected                                                                    | Complexity | Notes                                                                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Locale-prefixed URL routing (/en/, /nl/, /es/) | Google requires unique URLs per language to index multilingual content properly | Med        | Use next-intl with App Router middleware. Each locale gets its own URL path. No cookie/header-only locale detection -- that is invisible to crawlers. |
| Per-locale metadata (title, description, OG)   | Dutch prospects searching in Dutch need Dutch meta descriptions to click        | Med        | `generateMetadata` must load locale-specific translations. All metadata fields localized.                                                             |
| Per-locale sitemap entries                     | Each language variant needs its own sitemap entry with cross-references         | Low        | Sitemap.ts generates 3x entries (one per locale) with `alternates.languages` linking them.                                                            |
| Locale-aware structured data                   | Schema.org `inLanguage` field tells AI crawlers what language content is in     | Low        | Add `inLanguage: "en"` / `"nl"` / `"es"` to all JSON-LD per page.                                                                                     |

## Differentiators

Features that give competitive advantage in AI discoverability. Not expected by crawlers, but significantly increase citation probability by AI assistants like ChatGPT, Perplexity, and Gemini.

### GEO (Generative Engine Optimization)

| Feature                                                | Value Proposition                                                                                                                                                                              | Complexity | Notes                                                                                                                                                                                                                                     |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FAQ sections with FAQPage schema on every service page | FAQ schema has one of the highest AI citation rates -- 78% of AI-generated answers use list/Q&A format. Directly matches how ChatGPT and Perplexity present information.                       | Med        | 5-8 real questions per service page. Schema markup makes them machine-extractable. Content should be self-contained answers (make sense without surrounding context).                                                                     |
| Quick-answer blocks above the fold                     | AI systems extract concise definitions and direct answers. Having a clear 1-2 sentence answer to "What is [service]?" increases citation probability.                                          | Low        | Short definition paragraph at top of each service page, before the detailed content. Acts as the "snippet" AI systems grab.                                                                                                               |
| Data-dense content with statistics                     | GEO research shows content with specific numbers, percentages, and data points is significantly more citation-worthy and verifiable by AI.                                                     | Med        | Include metrics like "reduces manual marketing tasks by 80%" or "average ROI within 90 days." Must be defensible numbers, not invented.                                                                                                   |
| Author/expert attribution on content                   | Expert-attributed content gets cited more often by AI systems. E-E-A-T signal for Google.                                                                                                      | Low        | Author schema on blog posts, "About the team" structured data. Link to LinkedIn profiles.                                                                                                                                                 |
| llms.txt file                                          | Emerging standard for AI-readable site summaries. Major AI crawlers are actively indexing llms.txt files even though no company has officially endorsed it. Low effort, high potential upside. | Low        | Markdown file at `/llms.txt` with site name, description, and curated links to key pages. Also create `/llms-full.txt` with expanded content. Format: H1 title, blockquote summary, H2 sections with `[Title](url): description` entries. |
| Content freshness signals                              | GEO research shows citation priority decays after ~14 days without freshness signals. AI systems prefer recently-updated content.                                                              | Low        | Add `dateModified` to JSON-LD on all pages. Update timestamps when content changes. Blog posts should show publish and update dates.                                                                                                      |
| Comparison and "vs" content                            | AI assistants frequently answer "X vs Y" queries. Having structured comparison content positions FMai as the source for AI marketing comparisons.                                              | Med        | Blog posts or dedicated pages comparing approaches (e.g., "AI chatbot vs traditional live chat"). Use comparison tables with clear data.                                                                                                  |

### LLMEO (LLM Engine Optimization)

| Feature                                   | Value Proposition                                                                                                                                                            | Complexity | Notes                                                                                                                                                                                                               |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entity-first content architecture         | Define what FMai IS clearly and consistently across all pages. AI models build entity graphs -- being a well-defined entity means being cited when the topic comes up.       | Med        | Consistent naming ("Future Marketing AI" or "FMai"), consistent service descriptions, Organization schema with `sameAs` links to social profiles. Every page reinforces the entity.                                 |
| Prompt-aligned content structure          | Structure content to match how people prompt AI: "What is the best AI marketing agency in Netherlands?", "How do AI chatbots work for business?"                             | Med        | Use these natural-language questions as H2/H3 headings. Answer them directly in the first paragraph under each heading. This is how AI systems extract information.                                                 |
| Clear service taxonomy                    | AI systems need to understand what you offer in a structured way. Ambiguous service descriptions get ignored.                                                                | Low        | Define each service with: name, one-sentence description, who it's for, what problem it solves, what the outcome is. Consistent across all pages.                                                                   |
| Topical authority through content hub     | AI systems weight sources that demonstrate deep expertise in a topic. A blog with 10-20 articles on AI marketing creates topical authority that a landing page alone cannot. | High       | Blog/content hub with categorized articles on AI marketing, chatbots, automation, voice AI. Internal linking between related posts. This is the highest-effort differentiator but has the largest long-term impact. |
| HowTo schema on process/methodology pages | Google Rich Results eligibility + AI systems extract step-by-step processes for citation                                                                                     | Low        | `@type: HowTo` on "How It Works" page and any process-oriented content. Define steps with `HowToStep` schema.                                                                                                       |

### Technical Differentiators

| Feature                                  | Value Proposition                                                                                                                                           | Complexity | Notes                                                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Streaming SSR for chatbot                | Server-render chatbot chrome instantly, hydrate interactivity client-side. Perceived performance is dramatically better.                                    | Med        | Use React Suspense boundaries around chatbot. Server renders the shell, client hydrates the AI functionality. Improves LCP for pages with chatbot visible. |
| Dynamic OG image generation              | Auto-generated OG images per page/blog post with consistent branding. Better social sharing = more backlinks = better SEO + more AI training data exposure. | Med        | Use Next.js `opengraph-image.tsx` with Satori for server-side image generation. Brand-consistent templates.                                                |
| Incremental Static Regeneration for blog | Blog pages are static for speed but can revalidate on a schedule. Best of both worlds: CDN performance + content freshness.                                 | Low        | Use `revalidate` in page config or `revalidatePath` for on-demand updates.                                                                                 |
| Vercel Speed Insights integration        | Real-user Core Web Vitals monitoring. Catch regressions before they impact rankings.                                                                        | Low        | Built into Vercel deployment. Tracks LCP, INP, CLS from real users.                                                                                        |

## Anti-Features

Features to explicitly NOT build during migration.

| Anti-Feature                                     | Why Avoid                                                                                                                                           | What to Do Instead                                                                                                                                                   |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client-side-only routing for content pages       | Defeats the entire purpose of the migration. Any page behind client-side routing is invisible to crawlers.                                          | Use Next.js App Router file-based routing. Every content page must be a server-rendered route. Client interactivity via `"use client"` components only where needed. |
| Keyword stuffing / SEO spam content              | Google's helpful content update (2023+) and AI systems both penalize low-quality, keyword-stuffed content. Destroys credibility with B2B prospects. | Write for humans first. Use target keywords naturally. One primary keyword per page with semantic variations.                                                        |
| Programmatic SEO / auto-generated pages          | Low-quality pages hurt domain authority. Google explicitly targets "scaled content abuse." Not appropriate for a 4-service B2B agency site.         | Focus on fewer, higher-quality pages. Each page should provide genuine value. Blog posts should be expert-written or expert-reviewed.                                |
| Separate mobile site or m-dot URLs               | Duplicate content issues, maintenance nightmare, Google uses mobile-first indexing on single URL set                                                | Responsive design within the same Next.js routes. Desktop-first styling with responsive breakpoints. (Already the approach per CLAUDE.md.)                           |
| Heavy client-side animations on content pages    | Framer Motion can destroy INP scores. Content pages need to be fast, not flashy. Demo/showcase pages can be heavier.                                | Use Framer Motion sparingly on content/blog pages. Keep hero animations lightweight. Reserve heavy animations for the demo playground and interactive features.      |
| CMS integration in this phase                    | PROJECT.md explicitly says "content source TBD." Building CMS integration now risks choosing wrong tooling or over-engineering.                     | Use MDX or local Markdown files (via Velite) for blog content. Structure allows easy CMS swap later. File-based is faster to ship and iterate.                       |
| Blocking AI crawlers in robots.txt               | Some sites block all AI bots. For FMai, AI discoverability IS the goal. Blocking them removes any GEO/LLMEO benefit.                                | Explicitly allow AI retrieval bots (ChatGPT-User, Claude-SearchBot, PerplexityBot). Only block training-specific bots (GPTBot, Google-Extended) if desired.          |
| Over-relying on JavaScript for content rendering | Even though Google can render JS, AI crawlers (ChatGPT, Perplexity, Claude) have varying JS support. Content behind JS is risky.                    | Server-render all content. Use RSC by default. Only add `"use client"` for interactive elements. Text content should never depend on client-side JavaScript.         |

## Feature Dependencies

```
SSR/SSG (Next.js App Router) → Everything else (all features depend on server rendering)
    |
    ├→ Metadata API → OG images, hreflang, canonical URLs
    |
    ├→ Locale routing (next-intl) → Per-locale metadata → Per-locale sitemap → Hreflang tags
    |
    ├→ Semantic HTML → JSON-LD structured data → FAQ schema, Service schema, Organization schema
    |
    ├→ next/image + next/font → Core Web Vitals optimization → Vercel Speed Insights monitoring
    |
    ├→ robots.txt with AI bot policy → llms.txt → AI crawler access to all content
    |
    └→ Blog/content hub structure → MDX/Velite setup → Article schema → Content freshness signals
                                                          |
                                                          └→ Author attribution → Topical authority
```

Key dependency chains:

- Locale routing must be in place before any per-locale SEO work (metadata, sitemap, hreflang)
- Semantic HTML is prerequisite for meaningful structured data (JSON-LD describes what semantic elements contain)
- Blog infrastructure is the longest chain and should start early even if content comes later
- robots.txt and llms.txt are independent -- can be done anytime

## MVP Recommendation

### Phase 1 -- Must ship before domain switch (Table Stakes):

1. SSR/SSG for all existing pages via Next.js App Router
2. Metadata API with per-page title, description, OG tags (all 3 locales)
3. Locale-prefixed routing with next-intl (/en/, /nl/, /es/)
4. Hreflang tags + canonical URLs via metadata alternates
5. XML sitemap with locale alternates
6. robots.txt with AI crawler allow-policy
7. Organization + WebSite JSON-LD schema
8. Semantic HTML across all pages
9. next/image and next/font for Core Web Vitals
10. Proper 404/error pages with status codes

### Phase 2 -- High-impact differentiators (ship within weeks of launch):

1. FAQ sections with FAQPage schema on each service page
2. Service schema per service page
3. Breadcrumb schema
4. llms.txt and llms-full.txt
5. Quick-answer blocks on service pages
6. HowTo schema on How It Works page
7. Dynamic OG image generation
8. Content freshness signals (dateModified in JSON-LD)

### Phase 3 -- Content engine (ongoing after launch):

1. Blog/content hub with MDX via Velite
2. Article schema with author attribution
3. Prompt-aligned content (matching AI query patterns)
4. Comparison and "vs" content
5. Data-dense content with statistics
6. Topical authority building through regular publishing

### Defer:

- **CMS integration**: Use file-based MDX first, swap to CMS when content volume justifies it
- **Programmatic SEO**: Not appropriate for this site size and type
- **Advanced analytics/rank tracking for AI citations**: Tooling is immature in 2026, revisit quarterly

## Sources

### Official Documentation (HIGH confidence)

- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- official implementation pattern
- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- metadata and OG images
- [Next.js Internationalization Guide](https://nextjs.org/docs/pages/guides/internationalization) -- i18n routing
- [llms.txt Specification](https://llmstxt.org/) -- proposed standard for AI-readable site summaries
- [Google Local Business Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business) -- schema.org guidance

### Industry Sources (MEDIUM confidence)

- [Search Engine Land: GEO Mastering Guide 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [Search Engine Land: LLM Optimization Tracking 2026](https://searchengineland.com/llm-optimization-tracking-visibility-ai-discovery-463860)
- [Frase.io: FAQ Schema for AI Search](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
- [Robots.txt Strategy 2026](https://witscode.com/blogs/robots-txt-strategy-2026-managing-ai-crawlers/)
- [Anthropic's Claude Bot Framework](https://www.searchenginejournal.com/anthropics-claude-bots-make-robots-txt-decisions-more-granular/568253/)
- [Vercel: Optimizing Core Web Vitals](https://vercel.com/kb/guide/optimizing-core-web-vitals-in-2024)

### Community Sources (LOW-MEDIUM confidence)

- [DEV.to: Next.js SEO Optimization 2026](https://dev.to/texavor/how-to-optimize-seo-with-nextjs-in-2026-1bhl)
- [Djamware: Next.js SEO Guide 2026](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition)
- [next-intl App Router Guide](https://nextjslaunchpad.com/article/nextjs-internationalization-next-intl-app-router-i18n-guide)
- [Semrush: llms.txt Guide](https://www.semrush.com/blog/llms-txt/)
