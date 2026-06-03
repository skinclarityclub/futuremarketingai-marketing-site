# Phase 8: Cornerstone-content batch 2 (agency-ops + product/Clyde pillars + clusters) - Research

**Researched:** 2026-06-02
**Domain:** SKC-grade MDX cornerstone authoring on the already-shipped Next.js 16 blog renderer + `/resources` hub + homepage `KennisbankTeaser`; subject matter = agency operations/proof + AI-marketing-employee positioning (NL authoritative)
**Confidence:** HIGH (codebase mechanics, read directly 2026-06-02), HIGH (NL keyword/search-intent demand, Gemini-grounded 2026-06-02 with citations), MEDIUM (specific Dutch ROI stat figures — grounded but vendor-blog sourced, phrase softly)

## Summary

Phase 8 is the exact same kind of phase as Phase 3: a pure **content-authoring** phase on infrastructure that already shipped and is proven end-to-end. NO new component, renderer, or schema work is required for the happy path. Every cornerstone is one `.mdx` file under `content/blog/` whose block-YAML frontmatter drives the rich renderer (TOC, KeyTakeaways, BlogFaq, Citations, Article/BlogPosting + FAQPage JSON-LD) and whose body uses the MDX componentmap (`Callout`, `ComparisonTable`, exactly one `<CtaBlock href="/apply">`). The canonical templates already exist in-repo: mirror `content/blog/ai-marketing-automation-voor-bureaus.mdx` for a pillar and `content/blog/wat-is-een-ai-marketing-medewerker.mdx` for a cluster, verbatim in shape. The work is: write 2 strong NL pillar guides + 4-6 NL clusters that satisfy the new requirements, wire pillar/cluster links via two frontmatter fields, and prove each one live (build, JSON-LD, hub appearance, homepage teaser appearance, mobile, CWV).

Three structural facts must shape the plan — and two of them are real wiring decisions the Phase-3 plan did not have to solve at this scale. **(1) Hub bucketing** is purely frontmatter+category-driven and the hub renders exactly three buckets: `PILLAR_BUCKETS = ['geo', 'ai-marketing-automation', 'agency-ops']` (`resources/page.tsx:29`). The `agency-ops` bucket already exists with NL/EN/ES copy, so the agency-ops pillar drops straight in. But there is **NO `product-clyde` bucket and no `comparisons` bucket** in the hub. The Phase-2 spine maps the `product-clyde` pillar to blog category `comparisons` (02-01-PLAN <facts>), which has no hub bucket. So a product/Clyde pillar authored with `category: comparisons` (or `product-clyde`) will be **invisible in `/resources`**, violating Success Criterion 4. This is the same gap CONT-07 hit in Phase 3, and Phase 3 resolved it with "Option A" (place the Clyde artifact under `category: ai-marketing-automation` as a cluster). Phase 8 must pick a deliberate resolution for an entire *pillar* (see Open Question 1 + Pitfall 1).

**(2) The homepage `KennisbankTeaser` is hardcoded, not auto-surfacing.** `src/app/[locale]/page.tsx:76-86` builds exactly three teaser cards: the `geo` pillar, the `ai-marketing-automation` pillar, and the single hardcoded comparison slug `clyde-vs-jasper-chatgpt-semrush`. New pillars/clusters do NOT appear automatically. Success Criterion 4 explicitly requires every new cornerstone to appear "automatisch in het homepage KennisbankTeaser-blok." That word "automatisch" is aspirational given the current code; the plan MUST either (a) edit `page.tsx` to add the two new pillars to `kennisbankItems` (low-risk, ~6 lines, recommended), or (b) refactor the teaser feed to derive from `getPillarPosts()` generically. Either way this is a required code edit, not pure authoring (see Open Question 2 + Pitfall 2).

**(3) Subject-matter demand is real but the NL non-branded space is thin and undefined** — which is the opportunity. Gemini-grounded research (2026-06-02) confirms Dutch agency owners search around schalen-zonder-headcount, AI-efficiëntie-bureau, meetbare AI-resultaten, ROI, and (nascently) "AI marketing medewerker / AI agent vs AI tool / autonome agent." For the product/Clyde pillar, AI engines currently have NO settled NL definition of an autonomous "AI marketing medewerker" distinct from a tool — that void is exactly where FMai can win topical authority and become the cited NL source. The plan must avoid cannibalizing the Phase-3 cluster `wat-is-een-ai-marketing-medewerker.mdx` (already live under the ai-marketing-automation pillar); the new product/Clyde pillar must sit one level up (the brand/product pillar) and its clusters must target adjacent, non-overlapping intents (agent vs tool, geheugen/leren, autonome werking).

**Primary recommendation:** Author 2 NL pillar guides (agency-ops/proof + product/Clyde) at 1500-3000w each and 4-6 NL clusters at 900-1500w each, mirroring the two shipped templates verbatim in structure. Map the agency-ops pillar to `category: agency-ops` (drops into the existing hub bucket cleanly). For the product/Clyde pillar, resolve the hub gap by **either** giving it `category: ai-marketing-automation` (Option A, zero code, recommended) **or** adding a real 4th hub bucket `product-clyde` (Option B, ~1 file edit + i18n in 3 locales — the cleaner long-term taxonomy now that 2 product/Clyde cornerstones justify a dedicated bucket). Add the 2 new pillars to the homepage teaser `kennisbankItems`. Ground every stat/claim/competitor row from the cited Gemini research; do not invent SKC result numbers. Validate per page with the exact Phase-3 gates: `npm run build`, em-dash scan (U+2014), `npm run check:palette`, hub + teaser visual check, JSON-LD parse-validity in generated HTML + external Schema Markup Validator, testing-playbook mobile, CWV-neutral argument.

<user_constraints>
## User Constraints

No CONTEXT.md exists for this phase yet (no `/gsd:discuss-phase` run prior to research). Project-wide constraints from `fmai-nextjs/CLAUDE.md` + root `CLAUDE.md` + global `~/.claude/CLAUDE.md` that the planner MUST honor (identical to Phase 3 — these are locked project-wide):

### Locked (project-wide, treat as locked)
- **NL is source-of-truth.** All cornerstone copy authored in NL first. EN/ES are explicitly **out of scope** for this phase (I18N-01 is v2). Do NOT author en/es MDX versions now. (Exception: if Option B adds a hub bucket, the `resources.pillars.product-clyde.*` i18n key DOES need NL+EN+ES values, because the hub page calls `t()` for all locales and a missing key throws — see Pitfall 5.)
- **No em-dashes (—, U+2014)** anywhere in user-facing copy (titles, descriptions, body, FAQ, takeaways, citations, comparison cells). Use comma, period, colon. Scan every file.
- **Canonical domain** `future-marketing.ai` only. Never `futuremarketingai.com`.
- **Key-phrase glossary (enforced):** "AI Marketing Medewerker" / "Clyde" (never "AI tool" / "platform" except contrastively, i.e. describing what Clyde is NOT — the Phase-3 precedent in 03-02/03-05); "vaardigheden" (never "features"); "merken" / "klantportfolio" (never "klanten" for an agency's end-clients); "Plan een gesprek" / "Apply" (never "Sign up" / "Try free"); avoid bare "unlimited" — use "zonder plafond voor zover de infrastructuur reikt".
- **Exactly one `/apply` CTA per cornerstone** via a single `<CtaBlock href="/apply">`. Application-gated funnel only; no self-service signup links.
- **SKC proof rule:** the SkinClarity Club case is told via **Sindy as operator** (founder of SkinClarity Club). **NEVER mention Daley's co-ownership** of SKC. Author is `"Daley Maat"` (byline only, unifies the Person `@id`).
- **No invented proof numbers.** `src/lib/constants.ts` only carries founding-spot counters (`FOUNDING_SPOTS_TAKEN=1`, `FOUNDING_SPOTS_TOTAL=10`, `MAX_PARTNERS_PER_YEAR=10`). There are NO real SKC result metrics in the codebase to cite. Any agency-proof copy must avoid fabricated "X% lift" client figures; use the founding-counter facts, conceptual ROI framing, and grounded *industry* benchmarks phrased softly + cited (never as FMai/SKC's own results).
- **No `any` types, no `@ts-ignore`, no secrets in `NEXT_PUBLIC_*`.** Relevant only if `page.tsx` / hub `page.tsx` is touched for the teaser/bucket wiring (it will be).
- **Pricing SSoT:** `fma-app/src/lib/skills.ts`, mirrored in `fmai-nextjs/src/lib/pricing-data.ts`. Any price/tier/credit claim must match the mirror (Founding 997 fixed; Growth 499/ws; Professional 399/ws; Enterprise 299/ws). Prefer conceptual "werkruimte-geprijsd" framing + deeplink to `/nl/pricing` over hardcoding tariffs (Phase-3 03-02 decision).
- **Subject-matter research provider:** Gemini grounded (`gemini-research.mjs`) for FMai batch/audit research, NOT Perplexity, NOT training knowledge (project feedback `feedback_fmai_research_provider`). This doc used Gemini-grounded (2026-06-02). Re-ground any stat older than ~2 weeks at authoring time.

### Claude's Discretion (planner decides)
- Exact word counts per article (pillars 1500-3000w; clusters 900-1500w substantive, no padding — Phase 3 ran 978-1916w).
- How many clusters per pillar (Success Criterion: 2-3 each). Recommended set below.
- Exact slugs (kebab-case, NL, keyword-aligned). Recommended below; slug = URL = stable identity, choose carefully (cannot change later without redirects).
- Section count / `<h2 id>` anchors per article (drives `tableOfContents`).
- **Resolution of the product/Clyde hub-visibility gap** (Open Q1: Option A `category: ai-marketing-automation`, or Option B add a 4th hub bucket). Both are valid; B is the cleaner taxonomy now that 2 product/Clyde cornerstones exist.
- **How to wire the homepage teaser** (Open Q2: hardcoded add vs generic refactor).
- ComparisonTable usage (if any) for the product/Clyde or agency-ops clusters.

### Deferred Ideas (OUT OF SCOPE)
- EN/ES translations of cornerstones (I18N-01, v2).
- Citation-monitoring dashboard / re-measurement (SCALE-01, v2).
- **Batch 3** (explicitly deferred in ROADMAP): 12 skills-articles (note `/skills/*` pages already exist — deepen vs new decision) + thematic thought-leadership (man vs machine, future of AI). NOT this phase.
- Auto-publish engine, multi-tenant publishing, WF7 wiring (Phases 4-6).
- Off-site authority playbook (Phase 7).
</user_constraints>

<phase_requirements>
## Phase Requirements (PROPOSED — planner to ratify these CONT-09+ IDs into REQUIREMENTS.md)

The roadmap leaves Phase 8 requirement IDs as "TBD (CONT-09+ — gedefinieerd tijdens plan-phase na grounded keyword-research)". This research proposes the concrete set below. They continue the CONT-* series (Phase 3 ended at CONT-08). Recommended shape: **2 pillars + 5 clusters + 1 wiring requirement = 8 new requirements (CONT-09..CONT-16)**. The planner may trim each pillar to 2 clusters (Success Criterion floor) to land at 6 articles; the recommended count is 7 articles (2 pillars + 5 clusters) to give each pillar real cluster depth without bloating.

| ID | Description (one-line) | Type | Pillar / category | clusterOf | Primary keyword (NL, grounded) | Recommended slug |
|----|------------------------|------|-------------------|-----------|-------------------------------|------------------|
| **CONT-09** | Agency-ops/proof pillar guide: how agencies scale a client portfolio with AI without proportional headcount | PILLAR (Article) | `agency-ops` | — | "marketingbureau schalen met AI" | `marketingbureau-schalen-met-ai` |
| **CONT-10** | Cluster: AI efficiency for agencies (which agency work AI takes over, time/cost saved, human-in-the-loop) | cluster (BlogPosting) | `agency-ops` | `marketingbureau-schalen-met-ai` | "AI efficiëntie marketingbureau" | `ai-efficientie-marketingbureau` |
| **CONT-11** | Cluster: proving measurable AI-marketing results for clients (ROI framework, KPI's, how to measure, NL) | cluster (BlogPosting) | `agency-ops` | `marketingbureau-schalen-met-ai` | "meetbare AI marketing resultaten" / "ROI AI marketing" | `meetbare-ai-marketing-resultaten` |
| **CONT-12** | Cluster: agency case-study / proof of AI marketing in practice (SKC via Sindy as operator, no Daley co-ownership) | cluster (BlogPosting) | `agency-ops` | `marketingbureau-schalen-met-ai` | "AI marketing case study Nederland" / "before-after bureau" | `ai-marketing-resultaat-in-de-praktijk` |
| **CONT-13** | Product/Clyde pillar guide: what an AI Marketing Medewerker is as a product category (autonomy + memory + skills), the FMai/Clyde positioning | PILLAR (Article) | **DECISION** (Open Q1) `ai-marketing-automation` OR new `product-clyde` bucket | — | "AI marketing medewerker" (head) | `ai-marketing-medewerker` |
| **CONT-14** | Cluster: AI agent vs AI tool in marketing (the category distinction, why work-model not features) | cluster (BlogPosting) | same as CONT-13 | `ai-marketing-medewerker` | "AI agent vs AI tool marketing" | `ai-agent-vs-ai-tool-marketing` |
| **CONT-15** | Cluster: memory + learning of an AI marketing agent (how Clyde remembers per merk, why it matters) | cluster (BlogPosting) | same as CONT-13 | `ai-marketing-medewerker` | "AI marketing agent geheugen en leren" | `ai-marketing-agent-geheugen-en-leren` |
| **CONT-16** | Hub + homepage-teaser wiring: both pillars + all clusters appear in `/resources` under correct bucket AND in the homepage KennisbankTeaser; bidirectional pillar<->cluster in-body links; one /apply CTA each; no orphan cluster | wiring/integration | both | — | (no keyword — this is the integration sluitsteen, mirrors CONT-08) | n/a |

**Cannibalization guard:** CONT-13 (`ai-marketing-medewerker` pillar) must NOT duplicate the existing Phase-3 cluster `wat-is-een-ai-marketing-medewerker.mdx` (CONT-06, live, `clusterOf: ai-marketing-automation-voor-bureaus`). Resolution: CONT-13 is the **broader product/brand pillar** ("the AI Marketing Medewerker as a product category + Clyde"), CONT-06 stays the focused "what is it" cluster under the *automation* pillar. CONT-13 should in-body-link to CONT-06 (and vice-versa via a related cross-link) rather than re-answer the same query. If the planner judges the overlap too tight, an alternative is to make CONT-13's slug/angle "Clyde" or "autonome AI marketing agent" specifically (product-led) and let CONT-06 own the generic definitional query. Decide explicitly in the plan.

**Note on requirement count vs Success Criteria:** Success Criteria 1+2 require "2-3 clusters" per pillar. The recommended set gives agency-ops 3 clusters (CONT-10/11/12) and product/Clyde 2 clusters (CONT-14/15). That satisfies the floor for both and the ceiling for agency-ops. A 3rd product/Clyde cluster (e.g. "autonome AI marketing agent: hoe werkt het" / `autonome-ai-marketing-agent`) is optional and grounded (Gemini cluster 4) if the planner wants symmetry — propose as CONT-15b/CONT-17 only if added.
</phase_requirements>

## Existing Code Reconnaissance (the shipped machine Phase 8 authors against — all read directly 2026-06-02)

### Frontmatter schema (`src/lib/blog.ts`) — unchanged since Phase 3
`BlogPostMeta` (blog.ts:26-53), parsed by `toMeta` (blog.ts:81-106) via `gray-matter`. The fields a cornerstone provides and who consumes them are identical to Phase 3 (see 03-RESEARCH for the full table). Key reminders:
- `category` MUST be a `BLOG_CATEGORIES` id (blog.ts:55-66). Existing ids: `geo`, `ai-marketing-automation`, `agency-ops`, `comparisons`, `guides`, + legacy. **For hub visibility the category must be one of the 3 `PILLAR_BUCKETS`.** `agency-ops` IS a bucket; `comparisons`/`product-clyde` are NOT.
- `pillar: true` → `getPillarPosts` + ArticleJsonLd `Article` type + hub pillar slot. Set on CONT-09 and CONT-13.
- `clusterOf: "<pillar slug>"` → `getClusterPosts(pillarSlug)` for the hub. Set on every cluster, pointing at its pillar's slug.
- `schemaType`: pillars `Article`, clusters `BlogPosting` (Phase-3 convention 03-03).
- `relatedSlugs`: set for intent but **NOT rendered** by the current renderer (verified). In-body prose links are the real cross-link mechanism.
- `slug` is the filename, NOT a frontmatter field. Slug = URL = stable.
- `author: "Daley Maat"` (unifies Person `@id` in ArticleJsonLd).

### MDX componentmap (`mdx-components.tsx`) — exact props (verified)
Available in every MDX body: `Callout`, `ComparisonTable`, `KeyTakeaways`, `TableOfContents`, `CtaBlock`, `Citations`, `BlogFaq`. A cornerstone body needs only `Callout`, `ComparisonTable` (optional), and exactly one `CtaBlock`. The other four are emitted by the page renderer from frontmatter — **do NOT duplicate them in the body** (renders twice).

| Component | Props (verified from source) | Usage |
|-----------|------------------------------|-------|
| `Callout` | `variant?: 'info'\|'warning'\|'tip'\|'success'` (default `info`), `title?: string`, `children` | `<Callout variant="tip" title="...">body</Callout>`. Prop is `variant`, NOT `type`. |
| `CtaBlock` | `title: string`, `body?: string`, `href?: string` (default `/apply`), `label: string` | `<CtaBlock title="..." body="..." label="Plan een gesprek" href="/apply" />`. Props are `body`/`label`/`href`, NOT `description`/`buttonText`/`buttonHref`. Locale auto-prefixed via CTAButton. |
| `ComparisonTable` | `columns: string[]`, `rows: {label: string, values: (string\|boolean)[]}[]`, `highlightColumn?: number`, `caption?: string` | Booleans → check/dash; first conceptual column is the row label. Inline-object array props in MDX body are JSX expressions (parse fine) — block-YAML rule applies ONLY to FRONTMATTER. Use `'Deels'` strings where a capability is not a clean true/false (Phase-3 03-04/03-06 defensible-claims pattern). |

### Renderer (`src/app/[locale]/(blog)/blog/[slug]/page.tsx`) — what it emits automatically
Unchanged. `generateStaticParams` from `getPostSlugsWithLocales()` picks up any new `.mdx` automatically (no route edits). Emits: ArticleJsonLd (type `Article` if `pillar`/`schemaType:Article`, else `BlogPosting`) → BreadcrumbJsonLd → FaqJsonLd (if `faqs`) → breadcrumb → header → TableOfContents → KeyTakeaways → MDX body → BlogFaq → Citations. `revalidate=3600`, `dynamicParams=false`. **No rehype-slug in the MDX pipeline** for headings → author explicit `<h2 id="...">` so TOC anchors resolve (the id MUST match `tableOfContents[].id` verbatim).

### `/resources` hub (`src/app/[locale]/(marketing)/resources/page.tsx`) — bucketing logic
- `PILLAR_BUCKETS = ['geo', 'ai-marketing-automation', 'agency-ops']` (line 29) — **hardcoded, only 3 buckets.**
- Per bucket: `bucketPillars = getPillarPosts(locale).filter(p => p.category === bucketId)`; `clusterPosts = bucketPillars.flatMap(p => getClusterPosts(p.slug, locale))`.
- Each bucket calls `t(\`pillars.${bucketId}.title\`)` + `.description` (lines 67-68). **If you add a bucket id, the `resources.pillars.<id>` i18n key MUST exist in nl.json AND en.json AND es.json or every-locale render throws** (`agency-ops` already has all three — verified lines ~4010 in each).
- Buckets degrade gracefully to empty state, so a pillar with zero clusters still renders.
- **Consequence:** agency-ops pillar (CONT-09, `category: agency-ops`) + its clusters appear automatically. Product/Clyde pillar (CONT-13) appears ONLY if its `category` is a bucket id → Option A `ai-marketing-automation` (existing bucket) OR Option B add `product-clyde` to `PILLAR_BUCKETS` + i18n.

### Homepage teaser (`src/app/[locale]/page.tsx:73-86` + `src/components/home/KennisbankTeaser.tsx`)
- The teaser COMPONENT is generic (renders any `items: KennisbankCard[]`, self-hides when empty).
- The teaser DATA is **hardcoded** in `page.tsx`:
  ```ts
  const pillars = getPillarPosts(locale)
  const geoPillar = pillars.find((p) => p.category === 'geo')
  const aiPillar = pillars.find((p) => p.category === 'ai-marketing-automation')
  const comparison = getClusterPosts('ai-marketing-automation-voor-bureaus', locale)
    .find((p) => p.slug === 'clyde-vs-jasper-chatgpt-semrush')
  const kennisbankItems: KennisbankCard[] = [
    geoPillar && { ...geoPillar, kind: 'pillar' as const },
    aiPillar && { ...aiPillar, kind: 'pillar' as const },
    comparison && { ...comparison, kind: 'comparison' as const },
  ].filter(...).map(...)
  ```
- **New cornerstones do NOT auto-appear.** Plan must edit this block (add `agencyPillar = pillars.find(p => p.category === 'agency-ops')` and the product/Clyde pillar) so Success Criterion 4's "automatisch in het homepage KennisbankTeaser-blok" is satisfied. The grid is `md:grid-cols-3` — adding 2 more cards yields 5; either accept a 3+2 wrap, feature a curated subset, or bump to a 3-col grid that wraps cleanly. Decide in the plan (visual call; teaser is meant to be a curated teaser, not the full index — featuring the 2 new pillars + keeping 3 existing = 5 cards is fine, or swap the comparison card for the new product/Clyde pillar to keep it at a tidy count). Recommended: add the 2 new pillars (5 total), let the grid wrap.

### Existing content (the 8 Phase-3 cornerstones — templates + cannibalization watch)
- Pillars: `geo-generative-engine-optimization.mdx` (cat geo), `ai-marketing-automation-voor-bureaus.mdx` (cat ai-marketing-automation) — **mirror this one for CONT-09/CONT-13 pillars.**
- Clusters: `geo-vs-seo-waar-investeren-2026.mdx`, `zichtbaarheid-meten-ai-overviews.mdx`, `geo-monitoring-tools-chatgpt-perplexity.mdx`, `wat-is-een-ai-marketing-medewerker.mdx` (**cannibalization watch for CONT-13**), `clyde-vs-jasper-chatgpt-semrush.mdx` (the hardcoded teaser comparison) — **mirror `wat-is-een-ai-marketing-medewerker.mdx` for clusters.**

## Standard Stack
No new libraries. Everything shipped + proven in Phases 1+3.

| Library | Version | Purpose | Why standard |
|---------|---------|---------|--------------|
| `@next/mdx` | 16.2.4 | MDX compile + `@content/*` alias | renderer imports `@content/blog/${slug}.mdx` |
| `gray-matter` | 4.0.3 | frontmatter parse in `blog.ts` | project stack |
| `next-intl` | 4.9.1 | locale routing; CtaBlock/PillarHubCard/teaser links auto-prefix locale | project stack |
| `schema-dts` | 1.1.5 | typed JSON-LD via existing SEO components | project stack |
| Tailwind | 4.2.4 | `prose` styling via `BlogContent` + theme tokens | project stack |

**Installation:** none.

## Architecture Patterns

### Recommended file structure (DELTA — content + at most 2 small code edits)
```
content/blog/
├── marketingbureau-schalen-met-ai.mdx           # CONT-09 — PILLAR, category agency-ops
├── ai-efficientie-marketingbureau.mdx           # CONT-10 — cluster, clusterOf: marketingbureau-schalen-met-ai
├── meetbare-ai-marketing-resultaten.mdx         # CONT-11 — cluster, clusterOf: ^
├── ai-marketing-resultaat-in-de-praktijk.mdx    # CONT-12 — cluster (proof/case), clusterOf: ^  (SKC via Sindy)
├── ai-marketing-medewerker.mdx                  # CONT-13 — PILLAR, category DECISION (Open Q1)
├── ai-agent-vs-ai-tool-marketing.mdx            # CONT-14 — cluster, clusterOf: ai-marketing-medewerker
└── ai-marketing-agent-geheugen-en-leren.mdx     # CONT-15 — cluster, clusterOf: ^

src/app/[locale]/page.tsx                        # CONT-16 — add agency-ops + product/Clyde pillars to kennisbankItems
src/app/[locale]/(marketing)/resources/page.tsx  # CONT-16 — ONLY if Option B (add 'product-clyde' to PILLAR_BUCKETS)
messages/{nl,en,es}.json                          # CONT-16 — ONLY if Option B (resources.pillars.product-clyde.{title,description})
```
(Slugs are the recommended grounded set; planner finalizes. Slug = URL = stable identity.)

### Pattern 1: The cornerstone MDX template (mirror the two shipped exemplars)
**What:** Full block-YAML frontmatter (all schema fields) + body of `<h2 id>` sections + prose + at most one `Callout` + exactly one `<CtaBlock href="/apply">` at the end. Frontmatter-driven blocks (TOC, takeaways, FAQ, citations) are NEVER repeated in the body.
**Pillar template:** `content/blog/ai-marketing-automation-voor-bureaus.mdx` (read in full — copy its shape, including the 6-section TOC, answer-first opening sentence, one `Callout variant="info"`, conceptual pricing + `/nl/pricing` deeplink, in-body forward-links to clusters, single closing CtaBlock).
**Cluster template:** `content/blog/wat-is-een-ai-marketing-medewerker.mdx` (read in full — answer-first first sentence that mirrors the glossary definition, in-body back-link to its pillar + a sibling cluster, single closing CtaBlock).
**Skeleton (block-YAML frontmatter — inline flow `[{...}]` is a build-breaker):**
```yaml
---
title: "..."
description: "..."          # no em-dash, < ~155 chars, answer-first
author: "Daley Maat"
publishedAt: "2026-06-02"
updatedAt: "2026-06-02"
category: "agency-ops"       # bucket id for hub visibility
tags: ["...", "..."]
locale: "nl"
heroImage: "/og-image.png"
readTime: 10
pillar: true                 # pillars only; clusters use clusterOf instead
clusterOf: "marketingbureau-schalen-met-ai"   # clusters only
schemaType: "Article"        # pillars Article, clusters BlogPosting
relatedSlugs: ["...", "..."]
keyTakeaways:                # block YAML, 3-5 quotable claims
  - "..."
tableOfContents:            # block YAML; each id MUST match an <h2 id> below
  - id: "..."
    title: "..."
    level: 2
faqs:                       # block YAML; drives FAQPage JSON-LD; 5 Q&A (Phase-3 standard)
  - question: "..."
    answer: "..."
citations:                  # block YAML; from grounded sources
  - title: "..."
    url: "https://..."
    source: "..."
    year: 2026
---

<h2 id="...">...</h2>
...answer-first prose...
<Callout variant="info">...</Callout>
...prose with in-body /nl/blog/<slug> cross-links...
<CtaBlock title="..." body="..." label="Plan een gesprek" href="/apply" />
```

### Pattern 2: Pillar<->cluster internal linking (CONT-16, mirrors CONT-08)
Three mechanisms; only two render today:
1. **In-body prose links** (the real cross-linking, satisfies the criterion): pillar body links OUT to each of its clusters; each cluster body links BACK to its pillar + (ideally) one sibling cluster. Use locale-prefixed raw links `[anchor text](/nl/blog/<slug>)` (raw MDX `<a>` is NOT auto-locale-prefixed, unlike CtaBlock). Phase 3 proved bidirectionality in rendered `.next` HTML, not just source.
2. **Hub grouping (auto):** correct `category` + `clusterOf` bundles pillar+clusters in one `PillarHubCard`.
3. **`relatedSlugs` frontmatter:** set for intent but NOT rendered — do not rely on it for the criterion.

### Pattern 3: ComparisonTable (optional for batch 2)
Batch 2 has no mandated comparison page (the Clyde-vs-competitors money-page is already CONT-07, live). But a ComparisonTable could strengthen CONT-14 (AI agent vs AI tool: a 2-column "tool vs medewerker" capability matrix) or CONT-10 (AI vs human-only agency ops). Optional; if used, follow the Phase-3 defensible-claims pattern: `highlightColumn` for the medewerker/Clyde column, `'Deels'` strings for uncertain capabilities, dated caption "op basis van publieke productinformatie, juni 2026".

### Anti-Patterns to Avoid
- **Inline flow-mapping in frontmatter** (`tableOfContents: [{id: x}]`) → Turbopack build-breaker (`@next/mdx` hands inline `{}` to acorn as JSX). Block-YAML for ALL frontmatter object arrays.
- **Duplicating frontmatter blocks in the body** (`<KeyTakeaways>`/`<TableOfContents>`/`<BlogFaq>`/`<Citations>`) → renders twice.
- **More than one CtaBlock** or a second `/apply` link styled as a CTA → violates one-CTA criterion.
- **Markdown `##` headings without ids** → no rehype-slug → TOC anchors break. Use explicit `<h2 id>`.
- **Em-dashes** in any string. Scan U+2014.
- **`category: comparisons`/`product-clyde`/`guides` for the product/Clyde pillar** without resolving the hub gap → invisible in hub (Pitfall 1).
- **Adding a bucket id to `PILLAR_BUCKETS` without adding the i18n key in all 3 locales** → `t()` throws on render (Pitfall 5).
- **Forgetting to add new pillars to the hardcoded homepage `kennisbankItems`** → fails "automatisch in teaser" criterion (Pitfall 2).
- **Cannibalizing CONT-06** with CONT-13 (Pitfall 4).
- **Inventing SKC/FMai result metrics** in the proof cluster (CONT-12) — no real numbers exist in the codebase; use Sindy-as-operator narrative + founding counters + softly-cited industry benchmarks (Pitfall 3).
- **Citing grounded industry stats as FMai's own results** (Pitfall 3).

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| Article/FAQPage JSON-LD | Custom `<script>` | renderer emits `ArticleJsonLd` + `FaqJsonLd` from frontmatter | shipped, typed, escaped |
| Route/sitemap for new article | New route/sitemap entry | nothing — `getPostSlugsWithLocales` + sitemap blog loop auto-pick `.mdx` | shipped Phase 1 |
| TOC / takeaways / FAQ / citations rendering | Hand-write in body | frontmatter fields → page renderer | shipped; body duplication is a bug |
| Comparison table UI | Hand-write `<table>` | `<ComparisonTable>` | shipped, themed, accessible |
| CTA button + funnel routing | Hand-write `<a href>` | `<CtaBlock href="/apply">` | shipped; locale auto-prefix; one-per-page convention |
| Hub appearance | Edit hub per article | correct `pillar`/`clusterOf`/`category` (+ bucket exists) | hub auto-groups (except product/Clyde gap) |
| Homepage teaser card rendering | New component | existing `KennisbankTeaser` — just feed it the items | shipped; only the item-selection in page.tsx needs editing |
| Pricing numbers | Re-type from memory | `src/lib/pricing-data.ts` mirror | business-critical; must not drift |

**Key insight:** Phase 8 is "fill the proven template with researched, on-brand NL content + two small wiring edits (homepage teaser items; optionally a 4th hub bucket)." Everything else is authoring + per-page proof.

## Common Pitfalls

### Pitfall 1: Product/Clyde pillar (CONT-13) invisible in `/resources` hub (Success Criterion 4 risk)
**What goes wrong:** Authored with `category: comparisons` or `category: product-clyde`, the pillar matches no `PILLAR_BUCKETS` entry → never rendered in the hub. Same class of gap as Phase-3 CONT-07.
**Why:** Hub buckets on the BLOG category axis (3 ids); the `product-clyde` Phase-2 spine slug lives on a different axis and maps to `comparisons` (no bucket).
**How to avoid (plan must pick one — Open Q1):**
- **Option A (zero code, recommended for speed):** `category: ai-marketing-automation` on CONT-13 + its clusters. They surface in the existing AI-automation bucket alongside the Phase-3 AI-automation cornerstones. Keep the `product-clyde` spine association conceptual. Risk: the AI-automation bucket gets crowded (2 pillars in one bucket — the hub filter `category===bucketId` allows multiple pillars per bucket, renders both, acceptable but visually denser).
- **Option B (small edit, cleaner taxonomy):** add `'product-clyde'` to `PILLAR_BUCKETS` (1 line) + add `resources.pillars.product-clyde.{title,description}` to nl.json/en.json/es.json (3 entries). Then CONT-13 uses `category: product-clyde` and gets its own bucket. This is the principled choice now that there are 2+ product/Clyde cornerstones justifying a dedicated bucket; it also future-proofs batch 3.
**Recommendation:** Option B if the user wants a clean 4-bucket hub; Option A if minimizing code touch. **Decide explicitly in the plan and verify the pillar renders in the hub.**
**Warning sign:** CONT-13 ships with a non-bucket category and no resolution; hub verification fails.

### Pitfall 2: New cornerstones do NOT auto-appear in the homepage teaser (Success Criterion 4 risk)
**What goes wrong:** `kennisbankItems` in `page.tsx` is hardcoded to geo pillar + ai-automation pillar + one comparison slug. New pillars/clusters never show. The word "automatisch" in the criterion is not satisfied by the current code.
**How to avoid:** Edit `page.tsx:76-86` to add `agencyPillar = pillars.find(p => p.category === 'agency-ops')` and the product/Clyde pillar (find by category or slug depending on Option A/B), push them into `kennisbankItems` as `kind: 'pillar'`. Verify they render on `/nl` (home). Keep it a curated teaser (featuring the 4 pillars + the comparison is reasonable; do not dump all clusters into the homepage). A more robust alternative: refactor to `kennisbankItems = getPillarPosts(locale).map(p => ({...p, kind: 'pillar'}))` so future pillars auto-surface — but that changes ordering/count; the curated hardcoded-add is lower-risk.
**Warning sign:** plan authors content but never touches `page.tsx`; homepage still shows the old 3 cards.

### Pitfall 3: Indefensible / fabricated proof numbers in the agency-proof cluster (CONT-12) and ROI cluster (CONT-11)
**What goes wrong:** Asserting specific SKC/FMai result figures ("we lifted SKC's X by Y%") that do not exist anywhere in the codebase, or citing grounded *industry* benchmarks (e.g. "34% lower CPA", "3.2x faster content", "AI ROI 340%") as if they were FMai's own results. Both undermine the AI-citation goal (engines favor verifiable, attributed content) and risk credibility/legal issues. The CLAUDE.md rule also forbids mentioning Daley's SKC co-ownership.
**How to avoid:** (a) Tell the SKC case via **Sindy as operator** (founder of SkinClarity Club), framed as a working example of the model, NOT as a metrics brag. (b) Use only real codebase facts: founding-counter (`1/10 founding plekken`), the working-model description. (c) Any industry stat goes in `citations` with source+year and is phrased as *market context* ("in de markt rapporteren bureaus...", "uit onderzoek blijkt..."), never as FMai's measured outcome. (d) The ROI cluster should teach a *framework* for measuring AI-marketing ROI (KPI's, before/after method) rather than promise a number. This is also the strongest GEO play: a neutral, citeable how-to-measure guide gets cited.
**Warning sign:** a sentence attributing a specific percentage gain to FMai or SKC; any mention of who owns SKC beyond Sindy operating it.

### Pitfall 4: CONT-13 cannibalizes the existing CONT-06 cluster
**What goes wrong:** A new `ai-marketing-medewerker` pillar that re-answers "wat is een AI marketing medewerker" competes with the live Phase-3 cluster `wat-is-een-ai-marketing-medewerker.mdx` for the same NL query → duplicate intent, split authority (Phase-3 03-02 explicitly avoided this for the AI-automation pillar by writing fresh on the exact keyword and retiring the old generic guide).
**How to avoid:** Position CONT-13 one level up: the **product/brand pillar** ("the AI Marketing Medewerker as a product category, and Clyde as FMai's implementation") with breadth across autonomy + memory + skills + how-it-works, in-body-linking DOWN to the focused CONT-06 definition cluster and the CONT-14/15 clusters. Let CONT-06 keep owning the bare definitional query. If overlap still feels tight, narrow CONT-13's angle to "Clyde" / "autonome AI marketing agent" specifically.
**Warning sign:** CONT-13 and CONT-06 have near-identical H1 + answer-first first sentence.

### Pitfall 5: Adding a hub bucket without the i18n key (Option B only) → render crash in all locales
**What goes wrong:** `resources/page.tsx` calls `t(\`pillars.${bucketId}.title\`)` for every bucket and every locale. A missing `resources.pillars.product-clyde.title` key throws at render for nl/en/es (next-intl strict).
**How to avoid:** If Option B, add `resources.pillars.product-clyde.{title,description}` to nl.json, en.json, AND es.json in the same commit. NL is source-of-truth but all three need a value to not throw (EN/ES can be lightly translated, consistent with the existing agency-ops bucket which already has all 3).
**Warning sign:** build/runtime error "MISSING_MESSAGE: resources.pillars.product-clyde.title".

### Pitfall 6: Component prop-name drift + heading/TOC id mismatch + stale stats
(Carried from Phase 3, still apply.) Callout = `variant` not `type`; CtaBlock = `title/body/label/href`; ComparisonTable = `columns/rows/highlightColumn/caption`. Every `tableOfContents[].id` must exactly equal an `<h2 id>`. Re-ground any stat older than ~2 weeks (NL AI-marketing market figures move fast; the grounded numbers below are vendor-blog sourced — phrase softly with "ongeveer/rond", cite, never as FMai's own).

## Subject-Matter Facts for Authoring (Gemini-grounded 2026-06-02 — cite these)

> All facts from Gemini grounded search (2026-06-02). Populate `citations` and back the prose. Numbers are market-context, vendor-blog sourced → phrase softly, attribute, NEVER present as FMai/SKC results.

### Agency-ops / proof pillar + clusters (CONT-09..12)
- **Head keyword + intent:** "marketingbureau schalen met AI" — agency owners want to serve more brands/grow without proportional headcount, keeping margin. Winning angle: an **operating-model** framing (AI-first ops, agents for autonomous tasks, human-in-the-loop), not a tool list. AI engines currently answer with generic "automate repetitive tasks + tool lists" — the void is a concrete NL scaling framework.
- **Cluster intents (grounded):**
  - "AI efficiëntie marketingbureau" — which agency work AI takes over (content, reporting, lead-qualification, data analysis), time/cost saved, human-in-the-loop. Engines answer with "best AI tools" lists; the void is a selection+integration framework with measurable efficiency + GDPR/AVG note.
  - "meetbare AI marketing resultaten" / "ROI AI marketing" / "hoe meet je resultaat van AI marketing" — agencies struggle to quantify AI value beyond vanity metrics. Winning angle: a practical NL ROI-measurement framework (incremental revenue, CLV, CAC, ROAS, conversion lift, time-saved) with before/after method. **Strong GEO play** (neutral how-to-measure guides get cited).
  - "AI marketing case study Nederland" / "before-after bureau" — concrete proof. Winning angle: business-context → AI application → measurable outcome, "before/after" narrative. For FMai: the SKC case via Sindy as operator, framed as a working example (NOT a metrics brag — Pitfall 3).
- **Market-context stats (cite softly, NOT FMai's own):** ~72% of Dutch marketers use AI in 2026 (reported, vendor-blog); biggest barrier is "lack of knowledge" (~54% of Dutch marketers, reported); industry claims of "AI-first agencies ~34% lower CPA" and "~3.2x faster content production" circulate — use ONLY as cited market context, phrased "in de markt wordt gerapporteerd...". (Sources: searchlab.nl, chapmanbright.com, basis.com, martech.org, growthloop.com, thecmo.com — see Sources. These are vendor/marketing-blog grade → MEDIUM confidence, soft phrasing mandatory.)
- **What gets a case study cited by AI engines (use as the CONT-12 structural recipe):** E-E-A-T (author attribution, expert quotes, first-hand/proprietary data), topical authority via interlinked clusters, BLUF/answer-first (key result in first ~100 words of a section), question-based H2/H3, self-contained paragraphs, structured data (lists/tables), factual accuracy + recent stats + cited sources, neutral informational tone, freshness (<3 months strongly favored), schema (Article/FAQPage), strong organic foundation, consistent brand mentions. (Source: martech.org, onely.com, ailabsaudit.com, basis.com.)

### Product/Clyde pillar + clusters (CONT-13..15)
- **Head keyword + intent:** "AI marketing medewerker" — mostly informational ("what is it / capabilities / applications"), nascent commercial intent. **There is NO settled NL definition of an autonomous AI marketing employee distinct from a tool** — current answers focus on AI *assisting* humans and list tools. This void is the topical-authority opportunity: define the category (autonomy + continuous learning + strategic execution, freeing humans for strategy), tailored to NL. Competing pages: Frankwatching, Marketingfacts, tech-news, AI-vendor sites, recruitment platforms.
- **Cluster intents (grounded):**
  - "AI agent vs AI tool marketing" — comparative/informational; users want the fundamental difference. Engines rarely draw the proactive-autonomous-agent vs reactive-tool line. Winning angle: clear delineation (tool = specific pre-programmed task; agent = autonomy + memory + learning + decisions + adapts over time) with practical NL marketing scenarios. (Aligns with the FMai glossary: medewerker vs tool work-model distinction.)
  - "AI marketing agent geheugen en leren" — technical-capability intent (how it retains info, learns, improves). Winning angle: accessible-yet-detailed explanation of memory + learning enabling per-merk personalization + optimization over time. (Maps to Clyde's per-merk langetermijngeheugen USP — links to the `/memory` page.)
  - (optional CONT-17) "autonome AI marketing agent werking" — operational-mechanics intent (how it works end-to-end). Winning angle: data ingestion → strategy → execution → monitoring → optimization, minimal human intervention, NL market.
- **Confidence note:** the product/Clyde keyword query returned 0 grounding sources in one Gemini run (positioning analysis, not web-grounded) — treat the *positioning* insight as HIGH (it matches FMai's own glossary + delivery model) but the *search-volume claim* as LOW; re-ground volume/competition at authoring time if precise numbers are needed. The agency-ops queries were well-grounded (24-25 sources).

## State of the Art
| Old approach | Current (2026) | Impact on Phase 8 |
|--------------|----------------|-------------------|
| Optimize per keyword for ranking | Optimize per question + entity for AI citation | Answer-first, define the category, FAQ blocks, BLUF |
| "AI helps marketers" framing | Autonomous AI employee/agent (memory + learning) framing | Product/Clyde pillar should claim+define the category (engines have no settled NL definition yet) |
| Tool-list content | Operating-model + measurement-framework content | Agency-ops clusters win on framework + proof, not tool lists |
| Case study = brag | Case study = neutral, cited, BLUF, schema'd, fresh | CONT-12 must be citeable, not promotional; Sindy-as-operator |
| FAQ rich result in SERP | FAQ rich result deprecated 2026; FAQPage markup still valuable for AI citation | Validate FAQPage syntax via Schema Markup Validator, not Rich Results appearance |

## Open Questions
1. **Product/Clyde hub-visibility (BLOCKING Success Criterion 4 for CONT-13).** Option A (`category: ai-marketing-automation`, zero code, crowds that bucket) vs Option B (add `product-clyde` to `PILLAR_BUCKETS` + i18n in 3 locales, cleaner taxonomy). Recommendation: **Option B** now that 2+ product/Clyde cornerstones justify a dedicated bucket (and it future-proofs batch 3). Decide in the plan.
2. **Homepage teaser wiring (required for "automatisch in teaser").** Hardcoded-add the 2 new pillars to `kennisbankItems` (low-risk, recommended) vs generic refactor `getPillarPosts().map(...)` (auto-surfaces future pillars but changes count/ordering). Recommendation: hardcoded-add; revisit a generic feed only if the user wants the teaser to scale automatically.
3. **CONT-13 vs CONT-06 boundary (cannibalization).** Make CONT-13 the broad product/brand pillar linking down to CONT-06's focused definition, OR narrow CONT-13 to "Clyde / autonome agent" specifically. Recommendation: broad product pillar + in-body link to CONT-06; verify H1/first-sentence differ.
4. **3rd product/Clyde cluster?** Success Criterion floor is 2 clusters/pillar; agency-ops gets 3, product/Clyde 2. Add optional CONT-17 ("autonome AI marketing agent werking") for symmetry if desired (grounded). Recommendation: optional; 2 is sufficient.
5. **CONT-12 proof depth.** No real SKC metrics exist. Confirm with the user whether ANY verifiable SKC outcome may be cited, or whether the case stays purely qualitative (Sindy-as-operator working-example). Default: qualitative + founding-counter + cited industry context. (Could be a `/gsd:discuss-phase` question.)
6. **ComparisonTable in CONT-14?** A "tool vs medewerker" capability matrix would strengthen the agent-vs-tool cluster and is on-pattern. Recommendation: optional, defensible-claims style if used.

## Validation Architecture
> `workflow.nyquist_validation` is **false** in `.planning/config.json` (carried from Phase 3 — re-confirm at plan time) — formal test-map skipped. Per-page proof obligations come straight from Success Criteria and mirror Phase-3's verified gates (03-VERIFICATION.md).

**Exact commands / gates (reuse Phase-3's, all verified present in package.json):**
- **Build:** `npm run build` exits 0; each new article statically generated for `nl` (the de-facto integration test). Phase 3 ran 122 static pages; +7 articles expected. `postbuild` runs `inline-critical-css.mjs` automatically.
- **Palette gate:** `npm run check:palette` (= `bash scripts/verify-palette.sh`) — must pass (no deprecated colors). Relevant if `page.tsx`/hub touched.
- **Em-dash scan:** grep/scan each new `.mdx` (and any edited tsx/json) for U+2014 — must be zero. Phase 3 used a per-file scan; the executor can `grep -l $'—' content/blog/*.mdx`.
- **JSON-LD:** parse-validity confirmed in generated `.next` HTML (Article on pillars, BlogPosting on clusters, FAQPage when `faqs` present). External validation (Google Rich Results Test for Article; Schema Markup Validator validator.schema.org for FAQPage — FAQ rich result deprecated 2026, validate syntax not appearance) requires a live/deployed URL or paste → deferred-to-human like Phase 3.
- **Hub appearance:** each new cornerstone appears in `/nl/resources` under the correct bucket (verify in generated `resources.html`; for CONT-13 verify the Open-Q1 resolution actually renders it).
- **Homepage teaser appearance:** new pillars appear on `/nl` home (verify the `page.tsx` edit renders them in the teaser).
- **Internal links:** pillar links to each cluster and back (bidirectional), proven against rendered HTML not just MDX source (Phase-3 standard).
- **One CTA:** exactly one `<CtaBlock>` and exactly one `/apply` href per file (Phase-3 checked `CtaBlock=1 && /apply-href=1`).
- **Mobile:** testing-playbook per page (project rule: mobile-test each page before review). Phase 3 screenshotted the pillar + confirmed ComparisonTable mobile-scroll.
- **CWV:** argued-neutral (static-prerendered MDX via identical renderer + inline critical CSS, no new client-JS/assets) like Phase 3; a live Lighthouse run is a deferred-to-human confirmation. The 2 small tsx edits (teaser items / hub bucket array) add no client-JS.
- **No orphan cluster:** every cluster's `clusterOf` points at an existing pillar slug that lives in a rendered bucket (Phase-2 spine already guarantees a parent pillar row; verify the blog wiring).

## Sources

### Primary (HIGH confidence — codebase, read directly 2026-06-02)
- `src/lib/blog.ts` — `BlogPostMeta` schema, `BLOG_CATEGORIES`, `getPillarPosts`/`getClusterPosts`, `toMeta`
- `src/app/[locale]/(marketing)/resources/page.tsx` — `PILLAR_BUCKETS` (3 hardcoded), bucketing logic, `t(pillars.${id})`
- `src/app/[locale]/page.tsx` (lines 73-86, 465-481) — hardcoded `kennisbankItems` (geo + ai-automation + 1 comparison slug); teaser render guard
- `src/components/home/KennisbankTeaser.tsx` — generic teaser component (renders any items, self-hides when empty)
- `content/blog/ai-marketing-automation-voor-bureaus.mdx` — pillar template (read in full)
- `content/blog/wat-is-een-ai-marketing-medewerker.mdx` — cluster template + CONT-06 cannibalization watch (read in full)
- `content/blog/clyde-vs-jasper-chatgpt-semrush.mdx` (frontmatter) — the hardcoded teaser comparison slug
- `src/lib/glossary.ts` — `GLOSSARY_TERMS` (geo, ai-marketing-medewerker, citation-monitoring, tier-caps); categories reuse BLOG taxonomy
- `src/lib/constants.ts` — founding counters (the ONLY real proof numbers); no SKC result metrics exist
- `messages/{nl,en,es}.json` (~line 4007-4013) — `resources.pillars.agency-ops` exists in all 3 locales; no `product-clyde` bucket key
- `package.json` — scripts: `build`, `check:palette`, `check:i18n-orphans`, lint, e2e
- `.planning/phases/02-content-pillar-spine/02-01-PLAN.md` — the 4-pillar spine, `product-clyde` slug → `comparisons` blog category mapping (the hub-gap root cause)
- `.planning/phases/03-cornerstone-content/03-RESEARCH.md` + `03-VERIFICATION.md` — the exact pattern + the verified gate set Phase 8 reuses
- `.planning/STATE.md` + `.planning/ROADMAP.md` (Phase 8 block + batch-3 deferral) + `.planning/REQUIREMENTS.md`

### Secondary (MEDIUM-HIGH — Gemini-grounded web, 2026-06-02, multi-source where cited)
- Agency-ops/proof demand + NL stats (24-25 grounding sources): searchlab.nl, chapmanbright.com, basis.com, martech.org, growthloop.com, thecmo.com, hurree.co, mayple.com, consigo.nl, coodigital.nl, marketingreport.nl, datadream.nl, mediacooks.nl, cmswire.com, digitalmarketinginstitute.com, clickup.com
- "What gets a case study AI-cited": martech.org, onely.com, ailabsaudit.com, basis.com, ppc.land
- Product/Clyde positioning (Gemini analysis; competing-page list Frankwatching/Marketingfacts noted) — **search-volume LOW confidence (0 grounding sources on that run)**; positioning HIGH (matches FMai glossary + delivery model)

### Tertiary (LOW — re-ground at authoring time)
- Precise NL search volumes / competition for the product/Clyde keyword cluster (not web-grounded in this run)
- Specific NL industry percentage stats (vendor-blog grade) — cite softly, attribute, never as FMai's own
- Any verifiable SKC outcome metric — does not exist in codebase; needs user input (Open Q5)

## Metadata
**Confidence breakdown:**
- Codebase mechanics (schema, components, renderer, hub, teaser): HIGH — every relevant file read directly; Phase 3 proved the chain end-to-end and Phase 8 is the same chain.
- Hub + teaser wiring gaps (product/Clyde bucket; hardcoded teaser): HIGH — both verified by reading `resources/page.tsx:29` and `page.tsx:76-86`. These are facts, not guesses.
- Agency-ops subject demand + angles: HIGH (24-25 grounded sources, 2026-06-02), stats MEDIUM (vendor-blog grade, phrase softly).
- Product/Clyde subject demand: positioning HIGH (matches FMai glossary), search-volume LOW (0 grounding sources that run) — re-ground if precise numbers needed.
- Proof-cluster (CONT-12) sourcing: blocked on a user decision (Open Q5) — default to qualitative Sindy-as-operator narrative.

**Research date:** 2026-06-02
**Valid until:** 2026-06-16 (codebase stable ~30d; NL subject demand ~14d — re-ground stats/competition before authoring if more than 2 weeks elapse)
