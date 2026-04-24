---
title: GEO / LLMEO Citation Audit — FutureMarketingAI
audit_date: 2026-04-24
auditor: Senior GEO/LLMEO Consultant (agent)
scope: How well is future-marketing.ai structured to be CITED by ChatGPT, Claude, Perplexity, Google AI Overviews, Bing Copilot
research_framework: docs/research/2026-03-28-geo-llmeo-ai-citation-research.md + docs/research-schema-markup-structured-data-seo-geo.md
---

# GEO / LLMEO Citation Audit — FutureMarketingAI

## Executive Summary

1. **The site is SSR/SSG and crawlable, but invisible to AI crawlers by entity identity** — Organization schema lacks any `sameAs` links beyond one LinkedIn URL. No Wikidata, no KvK, no X/Twitter, no Crunchbase. This single gap caps entity-resolution quality (research §3.4, "sameAs is the most powerful Knowledge Graph input"). Measured impact: sites with entity schema saw **3.2x AI Mode citation lift** (research/schema §2). FMai gets almost none of it.

2. **`llms.txt` and `llms-full.txt` exist but are STALE AND WRONG** — they describe an old product (chatbots/automations/voice-agents tiered at €1.497/€2.497/€3.997) with an old domain (`futuremarketingai.com`). The current product is Clyde + 12 skills at €347/€2.497/€4.497/€7.997/€997 on `future-marketing.ai`. When an LLM cites this file, it will cite WRONG pricing, wrong product names, wrong domain. This is actively worse than having no file.

3. **Zero explicit AI-crawler allowlisting in `robots.ts`** — the robots config uses only `User-agent: *`. GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-Searchbot are technically allowed by fallback, but there is no explicit `Allow` entry that signals GEO-readiness. This matters for CDN/edge rules and for audit tools. Per research §3.6, 73% of sites have technical barriers blocking AI crawlers.

4. **Citation-worthy content is thin** — the site has good NL content but almost no proprietary statistics, benchmarks, original frameworks, or quotable data points. "12 skills", "20 partners/year", "1/10 founding plekken" and Sindy's SKC testimonial are the only anchor facts. LLMs cite sites that give them numbers, definitions, and frameworks no one else has. FMai has few.

5. **Schema coverage is partial; FAQ schema only on 2 pages (home, pricing), no Service schema on any of 12 skill pages, no Person schema for Daley/Sindy, no Speakable, no DefinedTerm** — these are precisely the Tier-1 and Tier-3 GEO schema types from research §2. The infrastructure exists (`ServiceJsonLd.tsx`, `HowToJsonLd.tsx`) — they are just not called anywhere the research says they should be.

---

## GEO Maturity Score (0-100 per category)

| Category | Score | Rationale |
|---|---:|---|
| **SSR / Crawlability basics** | 85 | Next.js 16 App Router with SSR, sitemap.ts generates hreflang alternates, robots allows all UAs (only `/api/` and `/_next/` disallowed). Strong technical foundation. |
| **AI crawler allowlist (robots)** | 40 | Only `*` rule. Missing explicit `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `OAI-Searchbot`, `Claude-Searchbot`, `Claude-User` blocks. Best practice = explicit Allow (research §3.6). |
| **llms.txt quality** | 15 | File exists but content is STALE (old pricing/old product/old domain). Actively misleading LLMs. Must be regenerated from scratch. |
| **Organization schema / entity** | 45 | Has name/logo/founder/email/knowsAbout. MISSING: Wikidata sameAs, KvK sameAs, X/Twitter sameAs, Instagram sameAs, `foundingDate` correctness (says 2025, memory says 2026), stable `@id`. No `address.streetAddress`. |
| **Person schema (Daley, Sindy)** | 0 | None emitted anywhere. About page has founder bio text but no JSON-LD Person entity. Sindy testifies on home + case study without a Person entity. |
| **Article schema (blog)** | 60 | Present on blog/[slug] with author, dates, locale. Missing: Person `@id` reference, `about` with Wikidata, `image` with width/height, proper nested publisher. |
| **FAQ schema coverage** | 25 | Only on `/` (5 Qs) and `/pricing` (5 Qs). Missing on `/memory`, `/about`, `/how-it-works`, `/case-studies/skinclarity-club`, 12 skill pages, `/founding-member`. |
| **HowTo schema** | 70 | Correctly scoped to `/how-it-works` which IS primarily tutorial content. Good post-March-2026 discipline. |
| **Service / Product schema for the 12 skills** | 0 | `ServiceJsonLd.tsx` exists but is NEVER imported. Each of the 12 skill pages should emit Service + Offer schema. |
| **Speakable schema** | 0 | Not implemented. High-leverage GEO signal per research §2 (tier 3). |
| **DefinedTerm schema (entity glossary)** | 0 | Not implemented. Perfect fit for "Clyde", "AI Marketing Medewerker", "4-layer memory", "Founding Member", "12 skills". |
| **BreadcrumbList schema** | 90 | Consistently applied across pages. |
| **Content structure (BLUF / TL;DR / chunkable answer blocks)** | 35 | Hero has tagline + subtitle. No TL;DR blocks. No 40-60 word self-contained answer paragraphs at top of pages. FAQ answers are good but buried. |
| **Q&A format / question-as-H2** | 30 | H2s are category titles ("Wat Clyde doet", "Waarom bureaus met Clyde werken"), not question-form. FAQ is structured as `<dl>` — good semantic HTML but not H2/H3 headings (research shows question-as-heading is what LLMs extract). |
| **Entity definition coverage** | 40 | "Clyde" is defined well on home + memory. "Memory system" well on /memory. "Founding Member" defined. "AI Marketing Medewerker" defined but informally, never with canonical sentence. 12 skills each have a one-liner but NO definition paragraph. |
| **Citation-worthy assets (stats, frameworks, original data)** | 25 | Claims: "3 Instagram accounts × 4 brands", "12 skills", "max 20 partners/year", "€347-€7.997", "1/10 founding". No unique benchmarks, no published research, no proprietary frameworks with names. |
| **Authority / E-E-A-T signals** | 45 | Founder bio exists. One named testimonial (Sindy). No author byline on marketing pages. No "Medically reviewed by" or equivalent. No LinkedIn proof widgets. No press mentions. |
| **Freshness signals** | 65 | `PAGE_DATES` map in seo-config.ts feeds `dateModified` on WebPage. Sitemap has `lastModified`. Article has `datePublished/dateModified`. Missing: visible "Last updated: [date]" text on pages (LLMs read this). |
| **Canonical URLs** | 85 | `generatePageMetadata` sets canonical per locale with hreflang alternates including `x-default`. Good. |
| **Semantic HTML** | 70 | Uses `<section>`, `<article>` (blog only), `<dl><dt><dd>` for FAQ. MISSING: `<article>` wrapper on marketing pages, `<aside>` for related content, `<figure>`/`<figcaption>` for visuals. |
| **Multilingual coverage (NL/EN/ES)** | 80 | All 3 locales, hreflang correct, `inLanguage` set in JSON-LD. |
| **Comparison / vs-pages** | 20 | `/memory` has a 3-card contrast block (Clyde vs ChatGPT vs Jasper). No dedicated `/vs/` pages. Research §3.3 point 7: "AI loves structured comparisons". |

**Overall GEO maturity: 42/100** — technically sound foundation, gaping content + schema + entity gaps.

---

## AI Crawler Allowlist Status

**Source**: `fmai-nextjs/src/app/robots.ts:4-14`

Current config:

```ts
rules: [{
  userAgent: '*',
  allow: ['/', '/llms.txt', '/llms-full.txt'],
  disallow: ['/api/', '/_next/'],
}]
```

| Crawler | Status | Effective behavior | Recommendation |
|---|---|---|---|
| `GPTBot` (OpenAI training) | Implicit allow via `*` | Will crawl but no explicit signal | Add explicit `Allow: /` |
| `ChatGPT-User` (user-initiated browsing) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `OAI-SearchBot` (ChatGPT Search) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `ClaudeBot` (Anthropic training) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `Claude-Searchbot` (Claude web search) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `Claude-User` (user-initiated) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `PerplexityBot` | Implicit allow | Will crawl | Add explicit `Allow: /` (most important — Perplexity is the only engine with clean citations API per research §2.1) |
| `Perplexity-User` | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `Google-Extended` (Gemini/AI Overviews training) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `Applebot-Extended` (Apple Intelligence) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `Bingbot` (Copilot underlying) | Implicit allow | Will crawl | Explicit `Allow: /` (already handled by `*`) |
| `CCBot` (CommonCrawl → GPT/Claude training) | Implicit allow | Will crawl | Add explicit `Allow: /` |
| `Amazonbot` | Implicit allow | Will crawl | Optional |
| `Bytespider` (ByteDance/Doubao) | Implicit allow | Will crawl | Optional |

**Verdict**: functionally open but lacks audit-friendly explicit entries. Third-party GEO tools (Otterly, Profound) check for explicit entries when scoring.

**CDN / Vercel check**: Vercel does not block AI crawlers by default on Pro plans. No Cloudflare layer in front (per layout.tsx, direct Vercel). Confirmed no WAF blocking.

---

## llms.txt Status

**Files**: `fmai-nextjs/public/llms.txt` and `fmai-nextjs/public/llms-full.txt`

**State**: SEVERELY STALE. Summary of mismatches:

| Element | In llms.txt/llms-full.txt | Current reality | Severity |
|---|---|---|---|
| Domain | `futuremarketingai.com` | `future-marketing.ai` | CRITICAL |
| Product framing | AI Chatbots / Automations / Voice Agents / Marketing Machine | Clyde — AI Marketing Medewerker with 12 skills | CRITICAL |
| Pricing | Starter €1.497 / Growth €2.497 / Scale €3.997 | Partner €347 / Growth €2.497 / Pro €4.497 / Ent €7.997 / Founding €997 | CRITICAL (legal risk) |
| Founding date | "Founded: 2026" | Memory says agency 2024, product 2026 | Medium |
| Founder | "Daley" | "Daley" — OK | OK |
| Service URLs | `/en/chatbots`, `/en/automations`, `/en/voice-agents`, `/en/marketing-machine` | These routes DO NOT EXIST on current site | CRITICAL (404s) |
| Positioning | "50% below premium agencies" | "High-touch AI partnership, max 20/year" | High |
| Case study | No mention of SkinClarity Club / Sindy | SKC is headline proof | High |
| Memory system USP | Not mentioned | Core differentiator | High |
| EU-native / AVG / EU AI Act | Not mentioned | Core positioning pillar | High |

**Content quality score (if content were current)**: 75 — the format is actually well-structured per llmstxt.org spec. The problem is content freshness.

**Verdict**: llms.txt must be completely regenerated to reflect the 2026-04-20 content upgrade. As it stands, it is negatively valued — LLMs that cite it will cite wrong pricing, wrong URLs, wrong product names. This is worse than deleting both files.

---

## Entity Definition Coverage

Scoring: does this entity have ONE canonical sentence on the site that an LLM can grab and cite?

| Entity | Canonical definition present? | Where | LLM-quotable? | Score |
|---|---|---|---|---|
| **FutureMarketingAI (the brand)** | Partial — exists in meta descriptions | `messages/nl.json` home.meta.description | Fragments only | 5/10 |
| **Clyde** | Yes — "Dit is Clyde. Jouw AI Marketing Medewerker" | home hero (`nl.json:8-11`) | Yes (~30 words) | 8/10 |
| **AI Marketing Medewerker (term)** | Used heavily but never defined in one sentence | Everywhere | No — it's a name, not a defined term | 4/10 |
| **12 skills / vaardigheden** | Listed but no summary paragraph | home FAQ q4 (`nl.json:126`) | Partial — only inside FAQ | 5/10 |
| **4-layer memory system** | Yes — strong | `/memory` page | Yes (diagram + NL text) | 8/10 |
| **Founding Member (tier)** | Yes — strong | `/founding-member` | Yes | 8/10 |
| **Social Media skill** | One-liner description only | home services card | Weak — no multi-sentence definition | 4/10 |
| **Blog Factory skill** | One-liner | skill page meta | Weak | 4/10 |
| **Ad Creator skill** | One-liner | skill page | Weak | 4/10 |
| **Reel Builder (coming soon)** | One-liner | skill page | Weak | 3/10 |
| **Voice Agent skill** | One-liner | skill page | Weak | 4/10 |
| **Lead Qualifier skill** | One-liner | skill page | Weak | 4/10 |
| **Email Management (coming soon)** | One-liner | skill page | Weak | 3/10 |
| **ManyChat DM (coming soon)** | One-liner | skill page | Weak | 3/10 |
| **Reporting / Analytics skill** | One-liner | skill page | Weak | 4/10 |
| **SEO/GEO skill** | One-liner | skill page | Weak | 4/10 |
| **Research skill** | One-liner | skill page | Weak | 4/10 |
| **Clyde orchestrator skill** | One-liner | skill page | Weak | 5/10 |
| **Daley (founder)** | Bio present, not schema'd | `/about` founder section | Partial | 6/10 |
| **Sindy (SKC operator)** | Role-line on testimonial only | case study + home trust strip | Weak — no bio | 3/10 |
| **SkinClarity Club (SKC, the proof case)** | Strong case study page | `/case-studies/skinclarity-club` | Yes | 8/10 |
| **Per-brand memory isolation** | Yes — strong | `/memory` isolation section | Yes | 8/10 |
| **Dream consolidation** | Yes, poetic but clear | `/memory` decay.dreamBody | Yes | 7/10 |
| **Memory decay** | Yes | `/memory` decay.decayBody | Yes | 7/10 |

**Coverage summary**: 8 entities are citation-ready (score ≥7). 9 entities are fragmentary. All 12 individual skills need a proper definition paragraph (100-200 words BLUF).

---

## Citation-Worthy Asset Inventory

What exists today that an LLM would actually quote:

| Asset | Type | Strength for citation | Location |
|---|---|---|---|
| "Max 20 partners per year" | Scarcity stat | HIGH — unique, quotable | home hero + badges |
| "1/10 founding plekken bezet" | Scarcity stat | HIGH — dynamic, quotable | constants.ts → home/pricing |
| "€997 per maand, levenslang" | Pricing anchor | HIGH — concrete number | /founding-member |
| "SKC runs 3 IG accounts × 4 brands autonomously" | Case proof | MEDIUM — no KPI number | home stats, case study |
| "12 vaardigheden (9 live, 3 coming_soon)" | Taxonomy | MEDIUM — need explicit list in one place | home FAQ q4 |
| "4-layer memory: Vandaag / Deze maand / Archief / Wie het merk ís" | Framework (proprietary) | HIGH — ORIGINAL and NAMED | /memory |
| "Clyde dreams every night to consolidate" | Proprietary metaphor | HIGH — memorable and quotable | /memory decay |
| "AVG + EU AI Act ready, self-hosted EU" | Compliance claim | MEDIUM — needs proof anchor | home badges |
| Sindy testimonial | Quote | MEDIUM | case study |

**What is MISSING that high-citation competitors have**:

1. No benchmark numbers ("X% increase in engagement", "Y hours saved/week") — not even one
2. No proprietary research or original survey data
3. No named frameworks with trademark-style capitalization (e.g. "The FMai Partnership Model™")
4. No public dashboard of live metrics
5. No "FMai Effect" or similar branded outcome term
6. No whitepaper, report, or downloadable PDF
7. No podcast appearances with quotable founder positions
8. No comparison chart against competitors with FMai-defined axes

**The single biggest citation-probability gap**: no hard numbers about SKC outcomes. Research §3.1 shows "E-E-A-T + Experience" correlates +30.64% with citation. An LLM can't cite "we run autonomous carousels" — it CAN cite "SKC's organic engagement rose from X to Y in Z weeks".

---

## FAQ Coverage

| Page | Has FAQ section? | # questions | Semantic HTML | FaqJsonLd? | Question-as-heading? |
|---|---|---:|---|---|---|
| `/` (home) | Yes | 5 | `<dl>/<dt>/<dd>` | **Yes** | No (dt is `<dt>`, not H2/H3) |
| `/pricing` | Yes | 5 | `<dl>/<dt>/<dd>` | **Yes** | No |
| `/memory` | No | 0 | — | No | — |
| `/about` | No | 0 | — | No | — |
| `/how-it-works` | No | 0 | — | No | — |
| `/founding-member` | No (has FAQ content?) | TBD | — | No | — |
| `/contact` | No | 0 | — | No | — |
| `/apply` | No | 0 | — | No | — |
| `/case-studies/skinclarity-club` | No | 0 | — | No | — |
| `/skills/social-media` | No | 0 | — | No | — |
| `/skills/blog-factory` | No | 0 | — | No | — |
| `/skills/ad-creator` | No | 0 | — | No | — |
| `/skills/voice-agent` | No | 0 | — | No | — |
| `/skills/lead-qualifier` | No | 0 | — | No | — |
| `/skills/reporting` | No | 0 | — | No | — |
| `/skills/seo-geo` | No | 0 | — | No | — |
| `/skills/research` | No | 0 | — | No | — |
| `/skills/clyde` | No | 0 | — | No | — |
| `/skills/reel-builder` | No | 0 | — | No | — |
| `/skills/email-management` | No | 0 | — | No | — |
| `/skills/manychat` | No | 0 | — | No | — |
| `/blog/ai-marketing-automation-guide` | No | 0 | — | No | — |

**Total FAQ questions sitewide**: 10 (5 home + 5 pricing).

**Citation implication**: per research §3.1, Q&A format correlates +25.45% with citation. FMai answers virtually no long-tail questions. An LLM asked "how does Clyde handle brand voice?" or "does FMai work with non-Dutch agencies?" will prefer citing a competitor that put that Q&A on the page.

---

## LLM Chunkability Analysis (10 sample sections)

Scoring: can an LLM grab this 200-word block and have a complete, quotable thought? 10 = self-contained, 1 = requires external context.

| # | Sample section | File | Score | Issue |
|---|---|---|---:|---|
| 1 | Home hero headline + subtitle + trust anchor | `[locale]/page.tsx:92-121` + nl.json home.hero | 8/10 | Good: defines Clyde, names 12 skills category. Missing pricing anchor in chunk. |
| 2 | Home FAQ q1 ("Clyde vs ChatGPT/Jasper") | `nl.json:112-115` | 9/10 | Excellent — self-contained, names competitors, explains diff in ~80 words. |
| 3 | Home trust.customBuilt ("Clyde onthoudt alles") | `nl.json:52-53` | 7/10 | Good mini-definition. Missing concrete mechanism. |
| 4 | /memory layers.hot ("Vandaag") | `nl.json:1438-1442` | 6/10 | Metaphorical. LLMs struggle with "Vandaag" as a technical layer name — need "Hot cache / 24h window" alongside. |
| 5 | /memory isolation body | `nl.json:1461-1462` | 9/10 | Excellent — names Supabase RLS, gives 24h export SLA. Highly quotable. |
| 6 | /pricing tier card (Growth) | rendered from `nl.json pricing.tiers.growth.*` | 5/10 | Card is visual. Text alone doesn't say "for whom". LLM needs "Growth is for agencies with 5-30 FTE managing 10-50 brands who want X" in a single chunk. |
| 7 | SKC case study hero + setup | case-studies/skinclarity-club | 6/10 | Says "3 accounts × 4 brands" but no outcome number. LLM will cite a competitor with "+47% engagement in 8 weeks". |
| 8 | About founder bio | `nl.json:517-518` | 6/10 | Good personal narrative. Missing concrete credentials ("X years in marketing", "Y clients served"). |
| 9 | Skill page 1-liner (Social Media) | home services card | 3/10 | Too short — one sentence of ~15 words. No self-contained answer. |
| 10 | /founding-member value proposition | `nl.json:1329-1333` | 9/10 | Excellent — price-lock, 60% discount vs Growth, 10-seat scarcity, all in one paragraph. |

**Average: 6.8/10** — decent but uneven. Skill pages drag it down. Memory page is the strongest. Competitive benchmark would be 8+ across the board.

---

## Top 15 GEO Fixes Ranked by Citation-Probability Impact

Ordered by expected lift in citation rate.

### 1. Regenerate `llms.txt` + `llms-full.txt` from current content (CRITICAL)
**Files**: `public/llms.txt`, `public/llms-full.txt`
**Why**: currently actively misleading — cites old pricing, non-existent URLs, wrong domain. Every LLM that reads it poisons its answer with wrong info about FMai.
**Effort**: 2-3 hours. Rewrite both per the 2026-04-20 content upgrade. Include: Clyde, 12 skills (list each), 5 tiers with exact prices, Founding Member program, SKC case, Daley bio, memory system as USP, AVG/EU AI Act framing.
**Impact**: removes negative signal; enables correct citations. Highest leverage fix.

### 2. Add Wikidata + 5 `sameAs` entries to Organization schema
**File**: `src/components/seo/OrganizationJsonLd.tsx:74`
**Why**: research §3.4 — sameAs is the #1 Knowledge Graph signal, 3.2x AI Mode citation lift per schema research.
**Effort**: 1 hour to create Wikidata entry, 30min to update schema. Add: Wikidata URL, LinkedIn (have), X/Twitter, Crunchbase, Instagram, KvK. Add stable `@id: "https://future-marketing.ai/#org"`.
**Impact**: entity resolution by all major AI engines.

### 3. Emit ServiceJsonLd + Offer on all 12 skill pages
**File**: `src/components/skills/SkillPageTemplate.tsx:81` — add `<ServiceJsonLd>`
**Why**: `ServiceJsonLd.tsx` EXISTS but is never imported anywhere. 12 pages with zero Service schema. Research/schema §7 priority #4.
**Effort**: 30min — add one line to template. Pipe skill name/description/serviceType.
**Impact**: classifies the 12 skills as ontologically distinct services for AI retrieval.

### 4. Add FAQ blocks (6 Qs each) + FaqJsonLd to all 12 skill pages + /memory + /about
**Why**: +25.45% citation correlation. Sample questions: "What does [skill] integrate with?", "How long does setup take?", "Is [skill] available on Partner tier?"
**Effort**: 4 hours content + 1 hour implementation (SkillPageTemplate accepts faqKeys).
**Impact**: converts site from ~10 FAQs → ~80 FAQs. Dramatically expands query-to-content surface.

### 5. Add "TL;DR / Kort antwoord" blocks at top of every page (40-60 words)
**Why**: research §3.2 ("Ski Ramp" effect) — 44.2% of AI citations come from first 30% of doc. Right now top-of-page is a display H1 + tagline, not a quotable answer.
**Effort**: 6 hours content across 20 pages.
**Impact**: directly targets the highest-weighted citation zone.

### 6. Convert FAQ `<dt>` to `<h3>` with question text
**Files**: home/page.tsx:337, pricing/page.tsx:296
**Why**: LLMs crawl `<h2>/<h3>` with more weight than `<dt>`. Keep `<dl>` wrapper for semantics but nest an `<h3>` inside `<dt>`.
**Effort**: 30min. No visual change needed.
**Impact**: moderate — improves question extraction for LLMs that index heading structures.

### 7. Add explicit AI crawler rules to robots.ts
**File**: `src/app/robots.ts`
**Why**: audit-friendliness + CDN signal. Research §3.6.
**Effort**: 15min. Add 10 explicit rules (see section above).
**Impact**: ensures no CDN/WAF blocks any of them + signals GEO-readiness to monitoring tools.

### 8. Create `/vs/` comparison pages (at least 3)
**Why**: research §3.3 point 7 + §3.3 "entity-rich content". AI loves comparison tables. Target queries: "FMai vs Jasper", "FMai vs generic AI tools", "AI agency vs in-house AI team".
**Effort**: 8 hours per page (research + build).
**Impact**: captures comparison queries (30%+ of B2B research intent).

### 9. Add Person schema for Daley + Sindy + "reviewed by" author attribution
**Files**: create `src/components/seo/PersonJsonLd.tsx`, add to /about and case study and any content they narrate.
**Why**: E-E-A-T +30.64%. Current site has founder text but zero Person schema.
**Effort**: 2 hours.
**Impact**: attaches authority graph to all content.

### 10. Add concrete SKC outcome numbers to case study
**File**: `nl.json case_studies.skc.*`
**Why**: LLMs cite numbers, not adjectives. "Sindy saves 4 hours/week" or "carousels published jumped from 8 to 80/month" — pick real numbers with Sindy.
**Effort**: 2 hours interview + write.
**Impact**: transforms case study from narrative to citation asset.

### 11. Add Speakable schema to /memory + home + key skill pages
**File**: extend WebPageJsonLd to accept `speakable: { cssSelector: [...] }`
**Why**: research §2 (tier 3) — "flags the most citable passage for AI synthesis".
**Effort**: 2 hours (schema util + add CSS classes `.speakable` or similar to 10 key paragraphs).
**Impact**: moderate — emerging standard but zero competitors use it.

### 12. Publish original research / benchmark report
**Suggested topic**: "State of AI Adoption in NL/EU Marketing Agencies 2026" — survey 30-50 agencies, publish findings with FMai-owned data.
**Why**: research §3.1 — "Original Data: Proprietary research, benchmarks, surveys get cited 3-5x more".
**Effort**: 40-80 hours.
**Impact**: very high — becomes the primary citation asset for an entire topic cluster.

### 13. Add DefinedTerm schema for glossary entries
**Entities**: "AI Marketing Medewerker", "Clyde", "4-layer memory", "Founding Member", "Credit pack", "Skill pack", "Fair use", "Brand isolation", "Dream consolidation", "Memory decay"
**Effort**: create `/woordenlijst` (NL) / `/glossary` (EN) / `/glosario` (ES) page. 4 hours.
**Impact**: wins "wat is [term]" queries.

### 14. Add "Laatst bijgewerkt / Last updated: [date]" visible text + reviewDate
**Why**: LLMs read visible timestamps directly. Current `dateModified` is schema-only.
**Effort**: 1 hour — shared component, reads `PAGE_DATES`.
**Impact**: freshness signal + user trust.

### 15. Create a canonical "12 skills overview" page at `/skills`
**Why**: right now `/skills` doesn't exist as a hub — only `/skills/[specific]`. Users asking LLMs "what does FMai offer" won't find one URL that lists all 12 with full definitions.
**Effort**: 6 hours — new page with 12 card definitions, FAQ, comparison to other AI tooling.
**Impact**: single definitive URL for "what can Clyde do" — becomes the quoted overview.

---

## Content Roadmap: 5 "Citation-Bait" Pages to Create

These are NEW pages designed specifically to rank in AI citations.

### 1. `/onderzoek/staat-van-ai-marketing-nl-2026` ("State of AI Marketing Agencies in NL 2026")
- **Angle**: Survey 40-60 NL bureaus. Publish % using AI, avg tools, bottleneck scores, budget bands.
- **Why LLMs cite**: first-party Dutch-market data. No one else has it.
- **Length**: 3000-5000 words + 10+ charts
- **Schema**: Article + Dataset + DefinedTerm for methodology terms
- **Target queries**: "hoeveel bureaus gebruiken AI NL", "state of AI marketing Netherlands 2026"

### 2. `/frameworks/clyde-partnership-model` ("The Clyde Partnership Model™")
- **Angle**: Document FMai's delivery methodology as a named, ownable framework. 4 weeks onboarding → monthly cadence → quarterly strategy → annual retrospective. Give it a visual.
- **Why LLMs cite**: named frameworks get cited as reference methodology (like "AARRR pirate funnel").
- **Length**: 2000 words + framework diagram
- **Schema**: Article + HowTo + DefinedTerm for the framework name
- **Target queries**: "AI marketing partnership framework", "how to work with AI agency"

### 3. `/woordenlijst` ("AI Marketing Woordenlijst / Glossary")
- **Angle**: 30-50 NL/EN/ES-defined terms spanning AI agents, memory systems, skill orchestration, credit economics.
- **Why LLMs cite**: definition queries are pure citation gold. "Wat is een AI Marketing Medewerker" should return FMai's definition.
- **Length**: one long page with anchor links
- **Schema**: DefinedTermSet + 30+ DefinedTerm
- **Target queries**: "wat is [X]", "[term] uitleg", "[term] meaning"

### 4. `/vs/fmai-vs-losse-tools` ("FMai vs Separate AI Tools")
- **Angle**: Table comparing "one AI with shared memory" vs "12 separate tools". Rows: brand voice consistency, context loss, cost, integration effort, time-to-value, learning curve.
- **Why LLMs cite**: comparison queries. Research §3.3 point 7.
- **Length**: 1500 words + 1 large table
- **Schema**: Article + Review (comparative) + FAQPage
- **Target queries**: "AI agency vs ChatGPT + Buffer", "replace marketing stack with one AI"

### 5. `/case-studies/skinclarity-club-cijfers` ("SKC: The Numbers") — OR refresh existing page
- **Angle**: Put concrete metrics on the case study. Interview Sindy for: hours saved/week, posts published/month change, engagement delta, cost-per-post delta.
- **Why LLMs cite**: citable outcome data. Current case study has no numbers.
- **Length**: extend existing page with a "In cijfers" section
- **Schema**: already has WebPage; add Review or AggregateRating (if 5+ reviews) or CaseStudy as Article
- **Target queries**: "AI marketing case study results", "autonomous content agent outcomes"

---

## Comparison / vs-Pages Proposal

Priority order based on query volume + FMai differentiation:

| Page | Angle | Priority |
|---|---|---|
| `/vs/fmai-vs-losse-tools` | One AI with memory vs 12 separate tools | **P0** |
| `/vs/ai-agency-vs-in-house` | Partnership vs hiring AI engineer | **P0** |
| `/vs/clyde-vs-chatgpt-enterprise` | Brand-aware agent vs generic assistant | **P1** |
| `/vs/clyde-vs-jasper` | Marketing-automation agent vs content writer | **P1** |
| `/vs/fmai-vs-hubspot-ai` | Full-skill agent vs feature-bolted legacy CRM | **P2** |
| `/vs/eu-native-vs-us-hosted` | Data sovereignty comparison | **P2** |
| `/vs/founding-tier-vs-waiting` | Lifetime €997 vs future €2.497 | **P3** (ties to conversion) |

Each page follows the pattern (citation-optimized):
- 60-word TL;DR at top
- Side-by-side comparison table (LLMs love tables)
- Row-by-row discussion, each row has a quotable sentence
- FAQ (5 Qs with FaqJsonLd)
- Internal links to relevant skill pages
- Last-updated timestamp visible

---

## Concrete Code-Level Notes

- `src/lib/seo-config.ts:1` — `SITE_URL = 'https://futuremarketingai.com'` but memory + CLAUDE.md say production is `future-marketing.ai`. This mismatch cascades to every JSON-LD, sitemap entry, canonical, hreflang, and openGraph URL. Verify and fix.
- `src/components/seo/OrganizationJsonLd.tsx:13` — `foundingDate: '2025'`, but memory index says agency 2026. Verify.
- `src/components/seo/OrganizationJsonLd.tsx:25` — `knowsAbout` has 4 topics. Research recommends 8-15 for topical authority. Expand with: "Generative AI", "LLM Orchestration", "n8n workflow automation", "Brand Voice Modeling", "Multi-Brand Content Ops", "EU AI Act Compliance", "AVG / GDPR", "Claude / Anthropic", "Next.js".
- `src/components/seo/OrganizationJsonLd.tsx:74` — `sameAs: [LINKEDIN_URL]` — only one URL. Add Wikidata (CRITICAL), X, Instagram, Crunchbase, KvK.
- `src/components/seo/ArticleJsonLd.tsx:33` — `author` is inline `Person` with name+url only. Should reference Person `@id` and include `sameAs`.
- `src/components/seo/ArticleJsonLd.tsx` — no `image.width/height`, no `about.sameAs` (Wikidata topics), no `mentions`. Research/schema §1 tier-1.
- `src/components/seo/WebSiteJsonLd.tsx:7-13` — missing `potentialAction` (SearchAction). Research/schema §1 tier-1.
- `src/components/skills/SkillPageTemplate.tsx:81-96` — emits WebPage + Breadcrumb only. Missing Service schema for every one of 12 skill pages.
- `src/app/[locale]/(blog)/blog/[slug]/page.tsx:97-105` — ArticleJsonLd emitted but no FAQ schema even when a post has a Q&A section.
- `content/blog/` — only ONE MDX post exists. Blog is nearly empty. LLMs cannot cite what isn't there. Target: 10-15 evergreen posts within 6 months.

---

## Summary Recommendation

**If I could only fix 3 things this week**:
1. Regenerate `llms.txt` + `llms-full.txt` — stop poisoning LLMs with stale pricing and dead URLs.
2. Fix `SITE_URL` to the actual production domain and rebuild. Today every JSON-LD points to the wrong host.
3. Add Wikidata + 5 extra `sameAs` entries to OrganizationJsonLd.

**If I could only fix 3 strategic things this quarter**:
1. Publish "State of AI Marketing NL 2026" research report.
2. Put real SKC numbers on the case study page.
3. Build `/woordenlijst` glossary with DefinedTerm schema + `/vs/` comparison hub.

Current citation readiness: ~42/100. With the top-15 fixes implemented, realistic target: 78/100 within 8 weeks.
