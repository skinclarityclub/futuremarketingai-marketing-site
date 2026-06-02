# Phase 3: Cornerstone-content (flagship) - Research

**Researched:** 2026-06-02
**Domain:** SKC-grade MDX cornerstone authoring on a shipped Next.js 16 blog renderer + `/resources` hub; GEO/AI-search subject-matter (NL authoritative)
**Confidence:** HIGH (codebase mechanics, read directly), HIGH (GEO subject facts, live-grounded with citations 2026-06-02)

## Summary

Phase 3 is almost entirely a **content-authoring** phase on infrastructure that already shipped in Phase 1. There is NO new component, renderer, or schema work required for the happy path. Every cornerstone is an `.mdx` file under `content/blog/` whose frontmatter drives the rich renderer (TOC, key takeaways, FAQ, citations, Article + FAQPage JSON-LD) and whose body uses the MDX componentmap (`Callout`, `ComparisonTable`, `CtaBlock`). The first real article (`content/blog/geo-generative-engine-optimization.mdx`) already proves the entire chain end-to-end and is the canonical template to mirror. The work is: write 7 strong NL articles that satisfy the requirements, wire pillar/cluster links via two frontmatter fields, and prove each one live (build, JSON-LD, hub appearance, mobile, CWV).

Two structural facts must shape the plan. First, **pillar/cluster linking is purely frontmatter-driven**: a pillar sets `pillar: true` + a `category`; a cluster sets `clusterOf: "<pillar-slug>"`. The `/resources` hub (`getPillarPosts` + `getClusterPosts`) groups them into three buckets keyed strictly by `category in {geo, ai-marketing-automation, agency-ops}`, and a bucket only shows clusters whose `clusterOf` matches a pillar that lives in that same bucket. Second, **the Clyde comparison money-page (CONT-07) maps to the `product-clyde` pillar but the `comparisons` blog category** (decided in Phase 2, 02-01-SUMMARY). Because the hub has no `comparisons`/`product-clyde` bucket and only shows `category===bucketId` pillars, CONT-07 will NOT appear in the hub as written. This is a concrete planning gap (Success Criterion 4 says every cornerstone "verschijnt in de /resources-hub onder juiste pillar") that the plan MUST resolve — see Open Question 1 and Pitfall 1.

The GEO subject matter (CONT-01..04, and the comparison's GEO-tool claims) is a fast-moving 2026 topic. All statistics, tool names, and "GEO favors X" claims MUST come from the live-grounded research captured in this document (citations below), NOT from training knowledge. The research surfaced concrete, citeable facts (the original GEO paper by Aggarwal et al. 2023; ~35-40% visibility lift; AI Overviews on ~48% of tracked queries; zero-click >64%; the GEO tool landscape: Profound, Peec AI, AthenaHQ, Siftly, Otterly, Scrunch, Rankscale, SE Ranking, Conductor, Semrush) that should populate the `citations` frontmatter and back the prose.

**Primary recommendation:** Author 7 NL `.mdx` cornerstones mirroring `geo-generative-engine-optimization.mdx` verbatim in structure (full frontmatter + explicit `<h2 id>` anchors + block-YAML object arrays + exactly one `<CtaBlock href="/apply">`). Wire pillars (`pillar: true`) and clusters (`clusterOf`) per the map in this doc. Resolve the CONT-07 hub-visibility gap in the plan (recommended: a `clusterOf` on the comparison page + place it in a hub-visible category, OR extend the hub bucket set). Ground every stat/claim in the cited sources. Validate per page: `npm run build`, Schema Markup Validator for FAQPage, Rich Results Test for Article, visual hub check, testing-playbook mobile, Lighthouse CWV.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | GEO pillar-gids ("wat is GEO") | **ALREADY EXISTS** as `content/blog/geo-generative-engine-optimization.mdx` (`pillar: true`, `category: geo`, 8 min). Plan must DECIDE: deepen this to the 1500-3000w pillar bar (it is currently shorter, ~3 sections) or treat it as done. It is the template for all others. |
| CONT-02 | "GEO vs SEO: waar investeren in 2026" cluster | New `.mdx`, `category: geo`, `clusterOf: geo-generative-engine-optimization`. Grounded facts: SEO=rankings/clicks vs GEO=citations/mentions; GEO extends not replaces SEO; metrics differ. Citations §1.1, §1.3 below. |
| CONT-03 | "Hoe meet je zichtbaarheid in AI Overviews" cluster | New `.mdx`, `category: geo`, `clusterOf: geo-...`. Grounded: citation rate, AI SOV, brand mentions vs website citations, GSC+GA4+rank-tracker triangulation, manual sampling, run-prompts-5-10x for stochasticity. Citations §2.1-2.5. |
| CONT-04 | "GEO monitoring tools voor ChatGPT en Perplexity" cluster | New `.mdx`, `category: geo`, `clusterOf: geo-...`. Use `ComparisonTable` for the tool matrix. Grounded tool list: Profound, Peec AI, AthenaHQ, Siftly, Otterly, Scrunch, Rankscale, SE Ranking, Conductor, Semrush. Citations §3.1-3.3. |
| CONT-05 | "AI marketing automation voor bureaus" pillar-gids | DEEPEN existing `content/blog/ai-marketing-automation-guide.mdx` (currently OLD frontmatter — see Pitfall 3) OR author fresh. `pillar: true`, `category: ai-marketing-automation`. Positioning: "AI Marketing Medewerker"/"Clyde"/"vaardigheden"/"merken". |
| CONT-06 | "Wat is een AI Marketing Medewerker (Clyde)" cluster | New `.mdx`, `category: ai-marketing-automation`, `clusterOf: <CONT-05 pillar slug>`. Anchors the Clyde positioning; reuse glossary term "AI Marketing Medewerker" definition. |
| CONT-07 | Comparison money-page "Clyde vs Jasper vs ChatGPT vs Semrush" | New `.mdx` using `ComparisonTable` (columns + boolean/string rows, `highlightColumn` for Clyde). Pillar = `product-clyde`, blog category = `comparisons` (Phase 2 decision). **Hub-visibility gap — see Pitfall 1 / Open Q1.** Exactly one `/apply` CTA. Claims about Jasper/ChatGPT/Semrush must be defensible (see Pitfall 5). |
| CONT-08 | Interne links pillar↔cluster consistent + één /apply-CTA elke cornerstone | Mechanism: `pillar`/`clusterOf`/`relatedSlugs` frontmatter + the hub. `CtaBlock` defaults `href="/apply"`; enforce exactly one per file. The renderer auto-derives nothing for in-body cross-links — add them as prose `<a>`/MDX links + `relatedSlugs`. |
</phase_requirements>

## User Constraints

No CONTEXT.md exists for this phase (no `/gsd:discuss-phase` run). Project-wide constraints from `fmai-nextjs/CLAUDE.md` + root `CLAUDE.md` + global `~/.claude/CLAUDE.md` the planner MUST honor:

### Locked (project-wide, treat as locked)
- **NL is source-of-truth.** All cornerstone copy authored in NL first. EN/ES are explicitly **out of scope** for this phase (I18N-01 is v2). Do NOT author en/es versions of these articles now.
- **No em-dashes (—)** anywhere in user-facing copy (titles, descriptions, body, FAQ, takeaways, citations, comparison cells). Use comma, period, colon. Scan every file.
- **Canonical domain** `future-marketing.ai` only. Never `futuremarketingai.com`.
- **Key-phrase glossary (enforced):** "AI Marketing Medewerker" / "Clyde" (never "AI tool" / "platform"); "vaardigheden" (never "features"); "merken" / "klantportfolio" (never "klanten" for an agency's end-clients); "Plan een gesprek" / "Apply" (never "Sign up" / "Try free"); avoid bare "unlimited" — use "zonder plafond voor zover infra reikt".
- **Exactly one `/apply` CTA per cornerstone** (CONT-08, Success Criterion 4). Application-gated funnel only; no self-service signup links.
- **No `any` types, no `@ts-ignore`, no secrets in `NEXT_PUBLIC_*`.** (Mostly irrelevant for pure MDX, relevant only if a component is touched.)
- **Pricing SSoT:** `fma-app/src/lib/skills.ts`, mirrored in `fmai-nextjs/src/lib/pricing-data.ts`. Any price/tier/credit claim on the comparison page must match the mirror (Founding 997 fixed; Growth 499/ws; Professional 399/ws; Enterprise 299/ws). Do NOT invent or hardcode divergent numbers.
- **Subject-matter research provider:** for FMai audit/batch-research use Gemini grounded or Perplexity (this doc used Perplexity research, grounded). Never use training knowledge for GEO stats/tool names/SOTA.

### Claude's Discretion (planner decides)
- Exact word counts per article (pillars must hit 1500-3000w; clusters can be shorter but substantive).
- How many sections / which `<h2 id>` anchors per article (drives `tableOfContents`).
- Whether to deepen the existing GEO pillar (CONT-01) and AI-automation guide (CONT-05) or rewrite.
- Comparison table columns/rows composition (within defensible-claims constraint).
- How to resolve the CONT-07 hub-visibility gap (Open Q1 offers concrete options).

### Deferred Ideas (OUT OF SCOPE)
- EN/ES translations of cornerstones (I18N-01, v2).
- Citation-monitoring dashboard / re-measurement (SCALE-01, v2).
- Auto-publish engine, multi-tenant publishing, WF7 wiring (Phases 4-6).
- Off-site authority playbook (Phase 7).

## Existing Code Reconnaissance (the shipped machine Phase 3 authors against)

### Frontmatter schema (`src/lib/blog.ts`) — the exact fields a cornerstone provides

`BlogPostMeta` (blog.ts:26-53), parsed by `toMeta` (blog.ts:81-106) via `gray-matter`. Every field below is consumed by the renderer.

| Frontmatter key | Type | Required? | Consumed by | Notes |
|-----------------|------|-----------|-------------|-------|
| `title` | string | yes | `<h1>`, metadata title, OG, ArticleJsonLd headline | |
| `description` | string | yes | meta description, OG/Twitter, ArticleJsonLd | |
| `author` | string | yes | byline + ArticleJsonLd. Use `"Daley Maat"` to unify with the Daley Person `@id` (ArticleJsonLd.tsx:45-52). | |
| `publishedAt` | string (ISO date) | yes | byline date, OG publishedTime, Article datePublished | |
| `updatedAt` | string (ISO date) | falls back to `publishedAt` | Article dateModified, OG modifiedTime | `dateModified` freshness is a GEO signal — set it. |
| `category` | string | yes | category pill (`getCategoryLabel`), **hub bucketing** | MUST be a `BLOG_CATEGORIES` id. For hub visibility use `geo`/`ai-marketing-automation`/`agency-ops`. |
| `tags` | string[] | yes (can be small) | currently not rendered on page; metadata only | |
| `locale` | string | yes | `generateStaticParams` only generates this locale; `getAllPosts(locale)` filters on it | Use `"nl"`. |
| `heroImage` | string (root-relative or http) | optional | OG/Twitter image (1200x630), ArticleJsonLd image | Falls back to `/og-image.png`. The renderer does NOT render an inline hero `<img>` — only OG/JSON-LD use it. |
| `readTime` | number | optional | byline "N min read" | Falls back to word-count estimate (200 wpm). |
| `keyTakeaways` | string[] | optional | `<KeyTakeaways>` box near top + AI-citation anchor | 3-4 concise, quotable claims. |
| `faqs` | `{question, answer}[]` | optional | `<BlogFaq>` accordion + **`<FaqJsonLd>` (FAQPage)** | Drives the valid FAQPage schema (Success Criterion 4). 3-6 Q&A. |
| `citations` | `{title, url?, source?, year?}[]` | optional | `<Citations>` source list (E-E-A-T + AI-citation safety) | Populate from the grounded sources in this doc. |
| `tableOfContents` | `{id, title, level: 2\|3}[]` | optional | `<TableOfContents>` nav | Each `id` MUST match an `<h2 id>`/`<h3 id>` in the body. **Block-YAML only.** |
| `pillar` | boolean | optional | `getPillarPosts` filter; ArticleJsonLd type (`pillar→Article`); hub | `true` for CONT-01/05. |
| `clusterOf` | string (pillar slug) | optional | `getClusterPosts(pillarSlug)` for the hub | Set to the parent pillar's slug for CONT-02/03/04/06/07. |
| `relatedSlugs` | string[] | optional | **currently NOT rendered anywhere** | Reserve for internal-link intent; in-body links are what actually link pages today. |
| `schemaType` | `'Article' \| 'BlogPosting'` | optional | ArticleJsonLd `@type` | Pillars: `Article`. Clusters: `BlogPosting` (or omit → defaults via `pillar`). |

`slug` is derived from the filename (`<slug>.mdx`), NOT a frontmatter field. The slug IS the URL: `/{locale}/blog/{slug}`.

### MDX componentmap (`mdx-components.tsx`) — exact props (verified from source)

Available in every MDX body: `Callout`, `ComparisonTable`, `KeyTakeaways`, `TableOfContents`, `CtaBlock`, `Citations`, `BlogFaq`. In practice a cornerstone body only needs `Callout`, `ComparisonTable` (CONT-07/CONT-04), and `CtaBlock` — the other four are driven from frontmatter by the page renderer (do NOT duplicate them in the body).

| Component | Props (verified) | Usage in MDX |
|-----------|------------------|--------------|
| `Callout` | `variant?: 'info'\|'warning'\|'tip'\|'success'` (default `info`), `title?: string`, `children` | `<Callout variant="tip" title="...">body</Callout>`. NOTE: prop is `variant`, NOT `type` (02-summary deviation 1). |
| `CtaBlock` | `title: string`, `body?: string`, `href?: string` (default `/apply`), `label: string` | `<CtaBlock title="..." body="..." label="Plan een gesprek" href="/apply" />`. Props are `body`/`label`/`href`, NOT `description`/`buttonText`/`buttonHref` (02-summary deviation 2). Routes via next-intl CTAButton (locale auto-prefixed). |
| `ComparisonTable` | `columns: string[]`, `rows: {label: string, values: (string\|boolean)[]}[]`, `highlightColumn?: number`, `caption?: string` | Booleans render as check/dash. First conceptual column is the row label (no header). `highlightColumn={0}` to highlight Clyde. **Inline-object array props in MDX are JSX expressions (NOT frontmatter), so they parse fine** — block-YAML rule applies only to FRONTMATTER object arrays, not MDX-body props. |

### Renderer (`src/app/[locale]/(blog)/blog/[slug]/page.tsx`) — what it emits automatically

- `generateStaticParams` from `getPostSlugsWithLocales()` — a new `.mdx` is statically generated automatically, no route changes.
- `generateMetadata`: title/description/canonical/hreflang (only for locales that have the slug)/OG/Twitter from frontmatter.
- Page body order: ArticleJsonLd → BreadcrumbJsonLd → (FaqJsonLd if `faqs`) → breadcrumb nav → header (eyebrow, category pill, h1, description, author/date/readTime) → TableOfContents (if `tableOfContents`) → KeyTakeaways (if `keyTakeaways`) → `<BlogContent><Post /></BlogContent>` (the MDX body) → BlogFaq (if `faqs`) → Citations (if `citations`).
- `revalidate = 3600`, `dynamicParams = false`.
- **No rehype-slug**: markdown headings get NO auto ids. Author headings as explicit `<h2 id="...">` so TOC anchors resolve (01-02 decision). `BlogContent` applies `prose` styling to the body.

### `/resources` hub (`src/app/[locale]/(marketing)/resources/page.tsx`) — how pillar/cluster appear

- Buckets are hardcoded: `PILLAR_BUCKETS = ['geo', 'ai-marketing-automation', 'agency-ops']` (page.tsx:29).
- For each bucket: `bucketPillars = getPillarPosts(locale).filter(p => p.category === bucketId)`; then `clusterPosts = bucketPillars.flatMap(pillar => getClusterPosts(pillar.slug, locale))`.
- A `PillarHubCard` lists `[...pillarPosts, ...clusterPosts]` linked via next-intl `Link href={`/blog/${slug}`}`.
- **Consequences for the plan:**
  1. A pillar shows in the hub only if its `category` is one of the three bucket ids.
  2. A cluster shows only if its `clusterOf` points at a pillar that is itself in one of those buckets.
  3. CONT-07 (`category: comparisons`, `pillar: product-clyde`) appears in NO bucket → hub-visibility gap (Pitfall 1).
  4. CONT-06 (`category: ai-marketing-automation`, `clusterOf: <CONT-05 pillar>`) appears IFF its `clusterOf` equals the CONT-05 pillar's slug and that pillar has `category: ai-marketing-automation`. Keep the slugs aligned.

### Existing content
- `content/blog/geo-generative-engine-optimization.mdx` — the CONT-01 GEO pillar (already shipped, `pillar:true`, full frontmatter). **The canonical template.** ~3 sections; may need deepening to hit the 1500-3000w pillar bar.
- `content/blog/ai-marketing-automation-guide.mdx` — OLD frontmatter (no keyTakeaways/faqs/citations/tableOfContents/pillar). Candidate for the CONT-05 pillar but must be upgraded to the full schema (Pitfall 3).

## Standard Stack

No new libraries. Everything is shipped and proven in Phase 1.

| Library | Version | Purpose | Why standard |
|---------|---------|---------|--------------|
| `@next/mdx` | as installed | MDX compile + `@content/*` alias | project stack; renderer imports `@content/blog/${slug}.mdx` |
| `gray-matter` | as installed | frontmatter parse in `blog.ts` | project stack |
| `next-intl` | 4.8 | locale routing; CtaBlock/PillarHubCard links auto-prefix locale | project stack |
| `schema-dts` | as installed | typed JSON-LD via existing SEO components | project stack |
| Tailwind 4 | — | `prose` styling via `BlogContent` + theme tokens | project stack |

**Installation:** none.

## Architecture Patterns

### Recommended file structure (DELTA — content only)
```
content/blog/
├── geo-generative-engine-optimization.mdx   # CONT-01 (exists; maybe deepen) — PILLAR, category geo
├── geo-vs-seo-waar-investeren-2026.mdx       # CONT-02 — cluster, clusterOf: geo-generative-engine-optimization
├── zichtbaarheid-meten-ai-overviews.mdx      # CONT-03 — cluster, clusterOf: geo-...
├── geo-monitoring-tools-chatgpt-perplexity.mdx # CONT-04 — cluster, clusterOf: geo-..., uses ComparisonTable
├── ai-marketing-automation-voor-bureaus.mdx  # CONT-05 — PILLAR, category ai-marketing-automation (deepen existing guide or new)
├── wat-is-een-ai-marketing-medewerker.mdx     # CONT-06 — cluster, clusterOf: <CONT-05 slug>
└── clyde-vs-jasper-chatgpt-semrush.mdx        # CONT-07 — comparison, ComparisonTable, see Open Q1 for hub wiring
```
(Slugs are illustrative; planner finalizes. Keep them keyword-aligned, kebab-case, NL where natural. Slug = URL = stable identity.)

### Pattern 1: The cornerstone MDX template (mirror the shipped GEO pillar)
**What:** Full block-YAML frontmatter (all schema fields) + body of `<h2 id>` sections + prose + one `Callout` + exactly one `<CtaBlock href="/apply">` at the end. Frontmatter-driven blocks (TOC, takeaways, FAQ, citations) are NEVER repeated in the body — the page renderer emits them.
**Example:** `content/blog/geo-generative-engine-optimization.mdx` (read in full; copy its shape).
```yaml
---
title: "..."
description: "..."          # no em-dash
author: "Daley Maat"
publishedAt: "2026-06-02"
updatedAt: "2026-06-02"
category: "geo"             # BLOG_CATEGORIES id; drives hub bucket
tags: ["GEO", "..."]
locale: "nl"
heroImage: "/og-image.png"
readTime: 9
pillar: true                # or omit + clusterOf for clusters
clusterOf: "geo-generative-engine-optimization"   # clusters only
schemaType: "Article"       # pillars Article, clusters BlogPosting
relatedSlugs: []
keyTakeaways:               # block YAML
  - "..."
tableOfContents:            # block YAML — ids match <h2 id> below
  - id: "..."
    title: "..."
    level: 2
faqs:                       # block YAML — drives FAQPage JSON-LD
  - question: "..."
    answer: "..."
citations:                  # block YAML — from grounded sources
  - title: "..."
    url: "https://..."
    source: "..."
    year: 2026
---

<h2 id="...">...</h2>
...prose...
<Callout variant="tip">...</Callout>
...prose...
<CtaBlock title="..." body="..." label="Plan een gesprek" href="/apply" />
```

### Pattern 2: ComparisonTable for money-page + tools cluster (CONT-07, CONT-04)
**What:** `columns` = the things compared; `rows` = dimensions, each `values` aligned to columns; booleans → check/dash; `highlightColumn` = your product (Clyde at index 0). One `caption` for sourcing/date.
**Example (CONT-07 skeleton — claims must be verified, see Pitfall 5):**
```jsx
<ComparisonTable
  columns={["Clyde", "Jasper", "ChatGPT", "Semrush"]}
  highlightColumn={0}
  caption="Vergelijking op basis van publieke productinformatie, juni 2026."
  rows={[
    { label: "AI Marketing Medewerker (geen losse tool)", values: [true, false, false, false] },
    { label: "Werkt per merk / klantportfolio", values: [true, false, false, false] },
    { label: "Content genereren", values: [true, true, true, false] },
    { label: "GEO/SEO-tracking", values: ["Ingebouwd", false, false, true] },
    // ...
  ]}
/>
```
**For CONT-04** (tools cluster) the columns are the GEO tools (Profound, Peec AI, Otterly, ...) and rows are capabilities (ChatGPT tracking, Perplexity tracking, citation rate, AI SOV, content generation). Source from §3 below.

### Pattern 3: Pillar↔cluster internal linking (CONT-08)
**What:** Three mechanisms, only two of which actually render today:
1. **In-body prose links** (the real cross-linking): in each cluster body, link back to the pillar (`[GEO-gids](/nl/blog/geo-generative-engine-optimization)` or via MDX). In the pillar body, link out to each cluster. These render as `prose-a` styled `<a>`. **This is what satisfies "interne links pillar↔cluster consistent".**
2. **Hub grouping** (auto): correct `category` + `clusterOf` makes pillar+clusters appear bundled in the same `PillarHubCard`.
3. **`relatedSlugs`** frontmatter: set it for intent/future use, but note it is NOT rendered by the current renderer (verified) — do not rely on it for the linking criterion.
**Locale note:** in-body absolute links should include the locale (`/nl/blog/...`) since they are raw MDX `<a>`, not next-intl `Link`. The shipped GEO pillar uses `CtaBlock href="/apply"` (locale auto-prefixed by CTAButton) but raw prose links are not auto-prefixed.

### Anti-Patterns to Avoid
- **Inline flow-mapping in frontmatter** (`tableOfContents: [{id: x, title: y}]`): breaks the Turbopack build — `@next/mdx` has no remark-frontmatter and hands inline `{ }` to acorn as JSX (01-02 deviation 3). Use block YAML for ALL frontmatter object arrays.
- **Duplicating frontmatter blocks in the body**: do not write a `<KeyTakeaways>`/`<TableOfContents>`/`<BlogFaq>`/`<Citations>` in the MDX body — the page renderer already emits them from frontmatter; duplicating renders twice.
- **More than one CtaBlock** (or a second `/apply` link styled as a CTA): violates CONT-08 / Success Criterion 4. Exactly one.
- **Markdown `##` headings without ids**: no rehype-slug → TOC anchors break. Use explicit `<h2 id>`.
- **Em-dashes** in any string. Scan each file (`U+2014`).
- **`category: comparisons` or `guides` for content that must appear in the hub**: those are not hub buckets (Pitfall 1).
- **Inventing competitor capabilities or prices** on CONT-07 (Pitfall 5) or diverging from the pricing mirror.

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Article/FAQPage JSON-LD | Custom `<script>` | renderer emits `ArticleJsonLd` + `FaqJsonLd` from frontmatter automatically | shipped, typed, escaped |
| Route/sitemap for new article | New route or sitemap entry | nothing — `getPostSlugsWithLocales` + sitemap blog loop pick up any `.mdx` | shipped Phase 1 |
| TOC / takeaways / FAQ / citations rendering | Hand-write in body | frontmatter fields → page renderer | shipped; body duplication is a bug |
| Comparison table UI | Hand-write `<table>` | `<ComparisonTable>` | shipped, themed, accessible (check/dash with aria-labels) |
| CTA button + funnel routing | Hand-write `<a href>` | `<CtaBlock href="/apply">` | shipped; locale auto-prefix; one-per-page convention baked in |
| Hub appearance | Edit hub per article | correct `pillar`/`clusterOf`/`category` frontmatter | hub auto-groups (except the comparisons gap) |
| Pricing numbers | Re-type from memory | `src/lib/pricing-data.ts` mirror (SSoT `fma-app/skills.ts`) | business-critical, must not drift |

**Key insight:** Phase 3 is "fill the proven template with researched, on-brand NL content." The ONLY code-adjacent decision is the CONT-07 hub-visibility gap (Open Q1). Everything else is authoring + per-page proof.

## Common Pitfalls

### Pitfall 1: CONT-07 will not appear in the /resources hub (Success Criterion 4 risk)
**What goes wrong:** The comparison page maps to pillar `product-clyde` and blog category `comparisons` (Phase 2 decision, 02-01-SUMMARY). The hub only renders buckets `geo`/`ai-marketing-automation`/`agency-ops` and only pillars where `category===bucketId`. So a `category: comparisons` page is invisible in the hub — yet Success Criterion 4 requires every cornerstone to "verschijnt in de /resources-hub onder juiste pillar."
**Why it happens:** Pillar-slug axis (`product-clyde`) and blog-category axis (`comparisons`) were intentionally decoupled in Phase 2, but the hub buckets on the category axis and has no comparisons/product-clyde bucket.
**How to avoid (plan must pick one):** see Open Question 1. Cleanest low-risk option: give CONT-07 `clusterOf: <CONT-05 ai-marketing-automation pillar slug>` and `category: ai-marketing-automation` so it surfaces as a cluster under the AI-automation pillar bucket (the Clyde comparison is naturally an AI-marketing-automation artifact). Alternative: add a 4th hub bucket. Either way, decide explicitly and verify it renders.
**Warning sign:** plan ships CONT-07 with `category: comparisons` and no hub wiring; verification of "appears in hub" fails.

### Pitfall 2: TOC anchor / heading id mismatch
**What goes wrong:** `tableOfContents[].id` does not exactly match an `<h2 id>` in the body → TOC links scroll nowhere.
**How to avoid:** Author headings as `<h2 id="exact-id">` and copy that id verbatim into `tableOfContents`. Verify each id resolves (01-02 proved 3/3).
**Warning sign:** clicking a TOC item does nothing.

### Pitfall 3: `ai-marketing-automation-guide.mdx` uses the old schema
**What goes wrong:** Reusing it as the CONT-05 pillar without upgrading leaves it without keyTakeaways/faqs/citations/tableOfContents/pillar → it renders thin, no FAQPage schema, won't be a hub pillar.
**How to avoid:** Either fully upgrade its frontmatter to the current schema (add `pillar: true`, `category: ai-marketing-automation`, the four block-YAML arrays) and deepen the body, or author a fresh `ai-marketing-automation-voor-bureaus.mdx` and decide what to do with the old file (leave as a thin legacy post, or delete). Recommend: author fresh on the exact target keyword; downgrade or remove the old generic guide to avoid a duplicate-intent competitor.
**Warning sign:** two AI-automation articles competing for the same keyword.

### Pitfall 4: Component prop-name drift (cost Phase 1 two rebuild cycles)
**What goes wrong:** Using `type` on Callout, or `description`/`buttonText`/`buttonHref` on CtaBlock → build error or silent miss.
**How to avoid:** Callout = `variant`/`title`/`children`. CtaBlock = `title`/`body`/`label`/`href`. ComparisonTable = `columns`/`rows`/`highlightColumn`/`caption`. (All verified from source in this doc.)

### Pitfall 5: Indefensible competitor / stat claims (legal + AI-trust risk)
**What goes wrong:** The comparison money-page or GEO clusters assert competitor capabilities, prices, or GEO statistics that are wrong or stale → undermines the very AI-citation goal (engines favor verifiable, cited content; CJR 2025 flags citation accuracy problems) and risks comparative-advertising issues.
**How to avoid:** (a) Every GEO stat/claim sourced from the grounded research in this doc (cite it in `citations`). (b) Competitor rows phrased as defensible, category-level differentiators ("AI Marketing Medewerker vs losse tool", "werkt per merk") rather than precise feature assertions about Jasper/Semrush internals; caption the table with "op basis van publieke productinformatie, <maand jaar>". (c) Clyde's own prices/tiers/credits from the pricing mirror only. (d) Re-ground any competitor specifics at authoring time (this research focused on GEO facts, not on Jasper/Semrush feature matrices — those need a fresh grounded check before authoring CONT-07).
**Warning sign:** a boolean `true/false` claim about a competitor with no public source.

### Pitfall 6: Stale GEO facts from training knowledge
**What goes wrong:** Authoring GEO prose from model memory yields outdated tool names/stats (training cutoff Jan 2026; GEO moves monthly).
**How to avoid:** Use only the cited 2026 facts in this doc; re-ground at authoring time for anything not covered here. Flag LOW-confidence claims in prose softly ("ongeveer", "rond").

## Subject-Matter Facts for Authoring (live-grounded 2026-06-02, cite these)

> All facts below are from Perplexity grounded research (2026-06-02). They populate the `citations` frontmatter and back the prose. Numbers are approximate/dataset-dependent — phrase softly. Full citation URLs in Sources.

### §1 GEO vs SEO (CONT-01, CONT-02)
- **Definition:** GEO = structuring content + digital presence so AI answer engines (ChatGPT Search, Perplexity, Google AI Overviews/AI Mode, Gemini, Claude, Copilot) retrieve, cite and recommend your brand when synthesizing answers. Original framework: Aggarwal et al., "GEO: Generative Engine Optimization," 2023 (Princeton / Georgia Tech / Allen AI). [arxiv 2311.09735]
- **Effect size:** targeted GEO can raise visibility in generative responses by ~35-40%; models favor content easy to justify with citations + statistics. [arxiv 2311.09735]
- **GEO extends, not replaces, SEO:** semantic structure, clean IA, link integrity, quality content remain prerequisites for being crawled/cited. GEO adds machine-readability + entity signals + earned-media emphasis. [searchengineland 469142; mabbly; adobe SEO 2026]
- **Metric shift:** SEO = rankings/impressions/CTR/sessions; GEO = brand mentions, website citations, AI share of voice, citation rate, AI-referred traffic/conversions. [mabbly; conductor; searchengineland 476642]
- **Behavioral shift:** Gartner projected ~25% traditional-search volume decline by 2026; Google zero-click ~64.8% in 2026; AI Overviews reduce organic CTR ~18% on average (pos-1 from ~31.7% to ~19.8%); AI Mode ~93% zero-click. [emarketed/gartner; digitalapplied; pillitteri]
- **Adoption:** AI Overviews on ~48% of tracked queries (BrightEdge), >2B monthly users (Digiday); AI Mode >200M MAU; ChatGPT Search ~250-500M weekly search-intent queries; Perplexity ~230M MAU (Q1 2026). [brightedge; digiday; digitalapplied; margen]
- **Structural tactic:** front-load answers — 55% of AI Overview citations come from the top 30% of a page (CXL); 44.2% of ChatGPT citations from first 30% (Kevin Indig). Answer in first ~150-200 words; use standalone FAQ-style blocks. [cxl]
- **Earned-media bias:** AI search favors earned media (~84% of AI citations); journalism ~27%; paid content ~0. → GEO needs digital PR, not just on-site. [arxiv 2509.08919; muckrack]

### §2 Measuring AI visibility (CONT-03)
- **Two dimensions:** brand mentions (named in answer text, no link needed) vs website citations (explicit URL/domain reference). [conductor]
- **Core metrics:** citation rate (share of tracked prompts citing a brand URL, per engine); AI share of voice (brand mentions / total brand mentions, "open denominator"); AI impressions / answer share; AI-referred traffic & conversions (GA4 referrer filtering for perplexity.ai / chat.openai.com). [siftly; waikay; nightwatch; margen]
- **Per-engine:** Google AI Overviews + AI Mode show 3-5 sources; track via Semrush Position Tracking / Organic Research, STAT, + GSC + GA4 triangulation. ChatGPT citations inconsistent → lean on brand mentions + simulation (Profound, Peec AI). Perplexity exposes citations richly → best for measurement + GEO experiments (the original paper showed up to 37% lift on Perplexity). [semrush; getstat; siftly; tryprofound; arxiv 2311.09735]
- **Method caveats:** AI answers are non-deterministic — run each prompt 5-10x and compute frequencies (Waikay); models update often → continuous monitoring; tools sample/simulate, not full logs; citation accuracy still imperfect (CJR). [waikay; cjr]
- **Conversion note:** Perplexity-referred traffic ~0.2-0.6% of total but converts ~3.1x Google organic; AI-Overview-surviving clicks convert ~23% better. [margen; digitalapplied]

### §3 GEO monitoring tools (CONT-04) — the comparison set
- **Enterprise/independent:** Profound (10+ AI platforms incl ChatGPT/Perplexity/Gemini/AI Overviews; unique prompt-volume data; measurement + content actions); Peec AI (most-accurate monitoring, 115+ languages, repeated-prompt simulation, competitor benchmarking); AthenaHQ (AEO/GEO "agents", monitoring + automated optimization). [tryprofound; peec.ai; athenahq; getairefs]
- **Mid-market/SMB measurement:** Siftly, Otterly, Scrunch, Rankscale (mentions/citations/gap analysis, lighter on execution). [siftly; otterly; scrunch; rankscale; stackmatix]
- **SEO suites + AI modules:** Semrush (AI Overview presence + citations alongside rank data), SE Ranking ("AI SEO" module), Conductor (AI mention + citation tracking integrated with SEO). [seranking; conductor; stackmatix]
- **Suggested ComparisonTable rows for CONT-04:** ChatGPT tracking / Perplexity tracking / Google AI Overviews tracking / citation rate / AI share of voice / prompt-volume data / content generation / multi-language. Columns: Profound, Peec AI, Otterly, Scrunch, Semrush (pick 4-5). Caption with date + "publieke productinformatie".

## State of the Art

| Old approach | Current approach (2026) | Impact on Phase 3 |
|--------------|-------------------------|-------------------|
| Optimize per keyword for ranking | Optimize per question + entity for AI citation | Cornerstones should answer-first, define entities, use FAQ blocks |
| FAQ rich result in SERP | FAQ rich result deprecated (~May-June 2026); FAQPage markup still valuable for AI citation | Validate FAQPage via Schema Markup Validator, NOT Rich Results Test FAQ-appearance (carried from Phase 1 research) |
| Success = clicks/rankings | Success = AI citations / mentions / share of voice | Frame cornerstone value as citation-worthiness; KeyTakeaways = quotable anchors |
| On-site SEO only | On-site + earned media (AI favors earned media ~84%) | Ties into Phase 7 off-site playbook; cornerstones are the on-site half |

**Deprecated/outdated:** FAQ rich result as a success metric (validate schema correctness instead).

## Open Questions

1. **How to make CONT-07 (comparison) appear in the /resources hub? (BLOCKING for Success Criterion 4)**
   - What we know: hub buckets on `category in {geo, ai-marketing-automation, agency-ops}`; only shows `category===bucketId` pillars + their clusters. `comparisons`/`product-clyde` have no bucket.
   - Options: (A) **RECOMMENDED** — author CONT-07 with `category: "ai-marketing-automation"` + `clusterOf: "<CONT-05 pillar slug>"` so it renders as a cluster under the AI-automation bucket; keep the `product-clyde` pillar association conceptual (the Phase-2 spine maps it, but the BLOG taxonomy puts it under ai-marketing-automation). (B) Add a 4th hub bucket (`comparisons` or `product-clyde`) — small edit to `PILLAR_BUCKETS` + a `resources.pillars.*` i18n entry in nl/en/es, but expands hub scope. (C) Accept it lives only at `/blog` + sitemap, and reinterpret Success Criterion 4 — NOT recommended (criterion is explicit).
   - Recommendation: Option A unless the user wants a distinct comparisons bucket. Decide in the plan; it is the one real wiring decision.

2. **Deepen the existing GEO pillar (CONT-01) to 1500-3000w, or accept it as the pillar?**
   - What we know: it exists, full schema, ~3 sections (likely under 1500w). Success Criterion 1 requires pillars 1500-3000w.
   - Recommendation: deepen it (add 2-4 sections: measuring GEO, GEO tactics, GEO vs SEO summary linking to clusters) so it hits the bar AND serves as the hub of the GEO cluster. Update `updatedAt`.

3. **Reuse or replace `ai-marketing-automation-guide.mdx` for CONT-05?**
   - Recommendation: author fresh `ai-marketing-automation-voor-bureaus.mdx` on the target keyword; retire/thin the old generic guide to avoid duplicate intent (Pitfall 3).

4. **CONT-07 competitor-claim sourcing depth.**
   - This research covered GEO facts, not Jasper/Semrush/ChatGPT feature matrices. The plan should include a grounded-research step at authoring time for defensible competitor rows + a dated caption. Clyde data from pricing mirror.

5. **Internal-link convention for cross-links in MDX bodies.**
   - `relatedSlugs` is not rendered. The linking criterion (CONT-08) is met by in-body prose links. Decide a consistent convention (locale-prefixed `/nl/blog/<slug>` raw links) and apply it both directions (pillar→clusters, cluster→pillar).

## Validation Architecture

> `workflow.nyquist_validation` is **false** in `.planning/config.json` — formal test-map section skipped. Per-page proof obligations below come straight from the phase Success Criteria.

Per cornerstone (the de-facto integration test for this content-centric project):
- **Build:** `npm run build` exits 0 and the article is statically generated for `nl` (Success Criterion: build pass).
- **Renderer:** TOC anchors resolve (each `tableOfContents.id` → `<h2 id>`); KeyTakeaways/BlogFaq/Citations render; exactly one CtaBlock → `/nl/apply`.
- **JSON-LD:** Article via Google Rich Results Test (supported); FAQPage via Schema Markup Validator validator.schema.org (FAQ rich result deprecated 2026 — validate syntax, not appearance).
- **Hub:** the article appears in `/nl/resources` under the correct bucket (verify after wiring, esp. CONT-07 per Open Q1).
- **Internal links:** pillar links to each of its clusters and back (CONT-08).
- **Mobile:** testing-playbook per page (project rule: mobile-test each walkthrough page before review).
- **CWV/Lighthouse:** not regressed vs baseline (static MDX should be neutral; verify no heavy hero asset added).
- **Copy gates:** no em-dashes (scan U+2014); key-phrase glossary honored; one /apply CTA; canonical domain only.

## Sources

### Primary (HIGH confidence — codebase, read directly 2026-06-02)
- `src/lib/blog.ts` — `BlogPostMeta` schema, `toMeta`, `getPillarPosts`/`getClusterPosts`, `BLOG_CATEGORIES`
- `mdx-components.tsx` + `src/components/blog/{ComparisonTable,CtaBlock,Callout,KeyTakeaways,TableOfContents,Citations,BlogFaq,BlogContent}.tsx` — exact component props
- `src/app/[locale]/(blog)/blog/[slug]/page.tsx` — renderer order + JSON-LD emission + static params
- `src/app/[locale]/(marketing)/resources/page.tsx` + `src/components/resources/PillarHubCard.tsx` — hub bucketing logic
- `src/components/seo/{ArticleJsonLd,FaqJsonLd}.tsx` — JSON-LD shape + Daley author `@id`
- `content/blog/geo-generative-engine-optimization.mdx` — the canonical cornerstone template
- `src/lib/pricing-data.ts` + `src/lib/constants.ts` — pricing mirror (SSoT fma-app/skills.ts), founding counters
- `.planning/phases/01-*/01-RESEARCH.md`, `01-02-SUMMARY.md`, `01-03-SUMMARY.md`, `02-RESEARCH.md`, `02-01-SUMMARY.md` — shipped state + decisions (block-YAML, explicit ids, product-clyde→comparisons mapping)

### Secondary (MEDIUM-HIGH — live-grounded web, Perplexity research 2026-06-02, multi-source)
- arxiv 2311.09735 (Aggarwal et al., GEO original paper) + collaborate.princeton.edu/...geo-generative-engine-optimization
- arxiv 2509.08919 (earned-media bias), arxiv 2510.11438 (AutoGEO)
- searchengineland.com/...469142 (GEO 2026 guide), /...476642 (GEO metrics)
- cxl.com/blog/google-ai-overview-citation-sources (front-loading citation data)
- siftly.ai, peec.ai, tryprofound.com, athenahq.ai, scrunch.com, otterly.ai, rankscale.ai, seranking.com, conductor.com (GEO tool landscape)
- digitalapplied.com (AI search stats 2026), brightedge.com (AI Overview presence), digiday.com (2B AI Overview users), margen.net (Perplexity stats), pasqualepillitteri.it (AI Mode zero-click), emarketed.com/...gartner (25% decline), bain.com (zero-click), waikay.io / nightwatch.io (AI SOV), cjr.org (citation accuracy), adobe SEO 2026, mabbly.com (GEO vs SEO)

### Tertiary (LOW — needs re-grounding at authoring time)
- Jasper / Semrush / ChatGPT specific feature & price claims for CONT-07 — NOT covered by this research; re-ground before authoring (Pitfall 5, Open Q4).

## Metadata

**Confidence breakdown:**
- Codebase mechanics (schema, components, renderer, hub): HIGH — every relevant file read directly; the GEO pillar proves the chain end-to-end.
- Pillar/cluster linking + hub bucketing: HIGH — logic read from `resources/page.tsx`; the CONT-07 gap is a verified consequence, not a guess.
- GEO subject facts (stats, tools, sources): HIGH (multi-source live-grounded, 2026-06-02), but inherently fast-moving — phrase softly, cite, re-ground specifics.
- CONT-07 competitor claims: LOW until re-grounded at authoring time.

**Research date:** 2026-06-02
**Valid until:** 2026-06-16 (codebase stable ~30d; GEO subject facts ~14d — re-ground stats/tool names before authoring if more than 2 weeks elapse)
