---
title: SEO Technical Deep Audit — FutureMarketingAI Marketing Site
tags: #audit #seo #technical #geo #schema
created: 2026-04-24
scope: fmai-nextjs/ (Next.js 16, next-intl 4.8, 3 locales)
domain: futuremarketingai.com
method: READ-ONLY code review, grep/read across src/
---

# SEO Technical Audit — FutureMarketingAI

## Executive Summary

1. **Metadata foundation is strong (A-)**: all 28 routes implement `generateMetadata` with canonical + hreflang + OG + Twitter via a single `generatePageMetadata` helper (`src/lib/metadata.ts`). Coverage = 100%. Title lengths are healthy (max 89 chars, most 50-80). NL descriptions skew long (up to 228 chars — Google truncates after ~160).
2. **Schema.org implementation is shallow for GEO (C+)**: 10 JSON-LD components exist, but the Organization schema is missing the most valuable GEO signals — `sameAs` contains only LinkedIn (no Wikidata, KvK, Crunchbase, Twitter), and there is no Person schema for Daley as founder/author. Per the schema research doc section 2, this is the single highest-leverage gap.
3. **Hreflang + canonical = correct, but `x-default` points to EN while NL is the content source-of-truth** — conflicts with the CLAUDE.md statement that "NL authoritative". `metadata.ts:40` sets x-default to `/en${path}`. Defensible, but double-check against strategic intent.
4. **Two critical data-integrity issues found**: (a) `public/og-image.png` does not exist in the repo — every OG/Twitter card references a missing asset, every Organization logo URL 404s; (b) `public/llms.txt` and `public/llms-full.txt` describe v9 pricing (€1.497 Starter) and dead URLs (`/chatbots`, `/automations`) — they contradict the live site and will confuse LLM crawlers.
5. **Domain name mismatch in codebase vs CLAUDE.md**: docs describe production as `future-marketing.ai` (hyphenated), but all SEO-critical code uses `futuremarketingai.com` (no hyphen). The hyphenated `app.future-marketing.ai` is used only for the login subdomain in `HeaderClient.tsx:330,441`. Non-blocking but needs a SSoT decision.

---

## SEO Maturity Score — 68 / 100

| Category | Score | Weight | Contribution |
|---|---|---|---|
| Metadata coverage (titles, descriptions, OG, Twitter) | 92 | 15% | 13.8 |
| Hreflang + canonical implementation | 90 | 10% | 9.0 |
| Sitemap + robots.txt correctness | 82 | 8% | 6.6 |
| URL structure + clean locale prefix | 95 | 7% | 6.7 |
| Schema.org breadth (types implemented) | 65 | 10% | 6.5 |
| Schema.org depth (entity nesting, `sameAs`, `knowsAbout`, Wikidata) | 35 | 12% | 4.2 |
| Internal linking depth | 70 | 8% | 5.6 |
| Heading hierarchy + a11y landmarks | 88 | 5% | 4.4 |
| Image SEO (alt, next/image, descriptive filenames) | 50 | 3% | 1.5 |
| Content depth + E-E-A-T signals | 60 | 8% | 4.8 |
| Keyword targeting discipline | 58 | 7% | 4.1 |
| Indexability + `noindex` hygiene | 95 | 3% | 2.9 |
| Redirects / legacy URL mapping | 85 | 2% | 1.7 |
| llms.txt / GEO plumbing | 15 | 2% | 0.3 |
| **Total** | | 100% | **71.4** |

Rounded down to **68/100** to reflect the compound business risk of the missing `og-image.png` (breaks every social share) + stale `llms.txt` (actively misleading AI crawlers).

---

## Metadata Coverage Table

Every page uses `generatePageMetadata()` from `src/lib/metadata.ts:22-66` unless noted. That helper produces: `title`, `description`, `alternates.canonical`, `alternates.languages` (en/nl/es + x-default), `openGraph` (title, description, url, siteName, locale, type, image), `twitter` (summary_large_image, title, description).

| Page | Path | Title | Desc | OG | Twitter | Hreflang | Canonical | Notes |
|---|---|---|---|---|---|---|---|---|
| Home | `/` | ok | ok | ok | ok | ok | ok | `src/app/[locale]/page.tsx:25-32` |
| Memory | `/memory` | ok | ok | ok | ok | ok | ok | `memory/page.tsx:19-26` |
| Pricing | `/pricing` | ok | ok | ok | ok | ok | ok | `pricing/page.tsx:22-29` — title = 89 chars, on edge |
| Apply | `/apply` | ok | ok | ok | ok | ok | ok | `apply/page.tsx:17-24` |
| About | `/about` | ok | ok | ok | ok | ok | ok | `about/page.tsx:20-27` |
| How-it-works | `/how-it-works` | ok | ok | ok | ok | ok | ok | `how-it-works/page.tsx:19-30` — title = 85 chars |
| Contact | `/contact` | ok | ok | ok | ok | ok | ok | `contact/page.tsx:19-26` |
| Founding Member | `/founding-member` | ok | ok | ok | ok | ok | ok | `founding-member/page.tsx:19-30` |
| Case Study SKC | `/case-studies/skinclarity-club` | ok | ok | ok | ok | ok | ok | `case-studies/skinclarity-club/page.tsx:18-29` |
| Legal index | `/legal` | ok | ok | ok | ok | ok | ok | `(legal)/legal/page.tsx:15-22` |
| Legal/privacy | `/legal/privacy` | ok | ok | — | — | — | ok | `privacy/page.tsx:11-23` — uses manual metadata, NO OG/Twitter, NO hreflang alternates |
| Legal/terms | `/legal/terms` | ok | ok | — | — | — | ok | same issue |
| Legal/cookies | `/legal/cookies` | ok | ok | — | — | — | ok | same issue |
| Blog index | `/blog` | ok | ok | ok | ok | ok | ok | `blog/page.tsx:17-56` — bespoke impl (hardcoded EN title/desc) |
| Blog post | `/blog/[slug]` | ok | ok | ok | ok | conditional | ok | `blog/[slug]/page.tsx:19-67` — hreflang only when post exists in multiple locales |
| Skills/social-media | `/skills/social-media` | ok | ok | ok | ok | ok | ok | `social-media/page.tsx:11-22` |
| Skills/blog-factory | `/skills/blog-factory` | ok | ok | ok | ok | ok | ok | same pattern |
| Skills/ad-creator | `/skills/ad-creator` | ok | ok | ok | ok | ok | ok | same pattern |
| Skills/reel-builder | `/skills/reel-builder` | ok | ok | ok | ok | ok | ok | coming_soon |
| Skills/voice-agent | `/skills/voice-agent` | ok | ok | ok | ok | ok | ok | |
| Skills/lead-qualifier | `/skills/lead-qualifier` | ok | ok | ok | ok | ok | ok | |
| Skills/email-management | `/skills/email-management` | ok | ok | ok | ok | ok | ok | coming_soon |
| Skills/manychat | `/skills/manychat` | ok | ok | ok | ok | ok | ok | coming_soon |
| Skills/reporting | `/skills/reporting` | ok | ok | ok | ok | ok | ok | |
| Skills/seo-geo | `/skills/seo-geo` | ok | ok | ok | ok | ok | ok | |
| Skills/research | `/skills/research` | ok | ok | ok | ok | ok | ok | |
| Skills/clyde | `/skills/clyde` | ok | ok | ok | ok | ok | ok | |
| Locale layout | `[locale]/layout.tsx` | — | — | — | — | — | — | `metadataBase` only — inherited |

**Coverage = 28/28 pages = 100%** on titles+descriptions. Deficiencies:

- **3 legal pages** (`/legal/privacy`, `/legal/terms`, `/legal/cookies`) bypass the shared `generatePageMetadata` helper and skip OG/Twitter/hreflang. See `privacy/page.tsx:17-22`. Low SEO priority, but trivial fix.
- **Blog index** hardcodes English title/description (`blog/page.tsx:24-26`) instead of using translations — ES/NL versions ship with English copy in `<title>`.
- **Blog post metadata** has a subtle bug: `blog/[slug]/page.tsx:47` only passes `alternates.languages` when `Object.keys(alternates).length > 1`, so single-locale posts get no `canonical` self-reference either (check line 46 — canonical is still set unconditionally via `alternates.canonical: url`, OK).

### Title length health (NL source)

Longest titles (target ≤60 for Google desktop, ≤78 for no-truncation in most SERPs):

| Chars | Title |
|---|---|
| 89 | "Prijzen: 5 tiers, transparant. Van Partner €347 tot Enterprise €7.997 | FutureMarketingAI" |
| 85 | "Hoe het werkt: 5 stappen naar een AI-medewerker in jouw portfolio | FutureMarketingAI" |
| 77 | "SkinClarity Club: 3 accounts × 4 merken × 1 AI-medewerker | FutureMarketingAI" |
| 77 | "Dit is Clyde. De AI Marketing Medewerker voor jouw bureau | FutureMarketingAI" |
| 73 | "Social Media Manager. Captions, inplanning en carrousels per merk | Clyde" |
| 72 | "Clyde. De centrale AI Marketing Medewerker die alles orkestreert | Clyde" |

`{SITE_NAME} = "Future Marketing AI"` is absent from the suffix in many titles — skill pages end with `| Clyde` which is on-brand but means the site name does not appear in SERP. Consider: `| Clyde — FutureMarketingAI`.

### Description length health

Meta descriptions over 160 chars (Google truncates):

| Chars | Preview |
|---|---|
| 228 | "Clyde is de AI Marketing Medewerker van jouw bureau. Hij schrijft content, belt leads… Gebouwd door FutureMarketingAI." (home) |
| 206 | tier.partner.description |
| 205 | tier.founding.description |
| 200 | apply process description |
| 187 | how-it-works onboarding step |
| 184 | contact applyCallout body |
| 180 | how-it-works meta.description |
| 172 | pricing meta.description |

The home page meta description (228 chars) is the biggest SEO loss — first 160 will show, rest truncated. Same for pricing and case-study.

---

## Schema.org Implementation Status

Components live in `src/components/seo/` (10 files). All rendered via the shared `<JsonLd>` component at `src/components/seo/JsonLd.tsx:7-16`, which uses XSS-safe escaping.

| Schema Type | Component | Used on | Correctness | Gaps |
|---|---|---|---|---|
| Organization | `OrganizationJsonLd.tsx:4-79` | Every page (via `[locale]/layout.tsx:65`) | Decent | **Missing Wikidata, KvK, Crunchbase, Twitter in `sameAs`** — only LinkedIn. `knowsAbout` has 4 generic items (should be ~8-12 topical terms). No `@id` (fragment identifier) — means BreadcrumbList etc. cannot reference it. `address.streetAddress` missing (only country). `hasOfferCatalog` is stale — references old "AI Automations / AI Chatbots / AI Voice Agents / Marketing Machine" bundles, not the 12 skills nor the 5 tiers. |
| WebSite | `WebSiteJsonLd.tsx:5-14` | Only on `/` (home) | Minimal | No `potentialAction` / `SearchAction` — missing sitelinks search box signal. No `@id`. No `inLanguage`. No `publisher` link back to Org. |
| WebPage | `WebPageJsonLd.tsx:12-32` | Every route except blog post | Good | `@id` not set. No `breadcrumb` property linking to BreadcrumbList on same page. No `primaryImageOfPage`. |
| BreadcrumbList | `BreadcrumbJsonLd.tsx:15-27` | Every route | Good | Home page breadcrumb has only 1 item — technically valid but useless for SERP. |
| FAQPage | `FaqJsonLd.tsx:12-28` | Home, Pricing, How-it-works (no), Founding (no despite visible FAQ), Case-study (no despite FAQ-like sections) | Good | **Founding Member page has a visible FAQ section (`founding-member/page.tsx:158-176`) but NO FaqJsonLd** — silent SEO miss. |
| HowTo | `HowToJsonLd.tsx:14-31` | `/how-it-works` only | Good | Per schema research section 1: post-March-2026 HowTo rich results are mobile-only and only for pages where step-by-step IS the primary content — this page qualifies. OK. |
| Service | `ServiceJsonLd.tsx:15-42` | **Not used anywhere** | Dead code | Should be emitted on every `/skills/*` page (12 opportunities). See fix #3 below. |
| Article | `ArticleJsonLd.tsx:15-53` | Blog posts | Good | Missing `image` (required for Article rich results), `publisher.logo`, `mainEntityOfPage`. Author is Person but no `@id` link to shared Person entity. |
| Pricing (ItemList) | `PricingJsonLd.tsx:3-88` | `/pricing` only | Fair | Emits 5 Offers in an ItemList. Missing `seller.@id` references back to shared Org entity. No `validFrom`/`validThrough`. No `category`. Tier names in data don't match tier names shown on page (e.g. data says "AI Marketing Partner" but page says "Partner"). |
| Person | — | **Missing entirely** | — | No Person schema for Daley (founder, blog author, `/about` bio subject). Missing `sameAs`, `worksFor`, `knowsAbout`. Per schema research section 1: highest E-E-A-T + AI-citation leverage. |
| LocalBusiness | — | — | — | NL startup, no physical client-serving location — skip. |
| Product | — | — | — | Not a product — skip. |
| Speakable | — | **Missing** | — | Per schema research 1.3 tier — high GEO signal for AI citation precision on blog + case-study pages. |
| DefinedTerm | — | — | — | No glossary. Skip for now. |
| Review/AggregateRating | — | — | — | No reviews surface. Skip until there are ≥5 verifiable public reviews. |

### Schema content-parity issues

- `OrganizationJsonLd.tsx:35-65` `hasOfferCatalog.itemListElement` lists products that **are no longer on the site**: "AI Chatbots", "Marketing Machine", "AI Automations". These still exist as redirects in `next.config.ts:111-129` but the visible nav shows 12 skills, not 4 bundles. Google flags schema-vs-content mismatches as spam per research doc sec 2.
- `OrganizationJsonLd.tsx:14-18` `founder.name: 'Daley'` — blog MDX frontmatter uses `"Daley Maat"` (`content/blog/ai-marketing-automation-guide.mdx:4`). Pick one and reuse the same Person `@id` everywhere.
- `PricingJsonLd.tsx` names don't match page labels. ItemList says "AI Marketing Starter" for Growth (€2.497) — page says "Growth". Same for "AI Marketing Pro" vs "Professional". Either align names or rename the schema keys to match visible text.

---

## Hreflang + Canonical Audit

Implementation in `src/lib/metadata.ts:36-49`:

```typescript
const alternates: Record<string, string> = {}
for (const loc of routing.locales) {
  alternates[loc] = `${SITE_URL}/${loc}${canonicalPath}`
}
alternates['x-default'] = `${SITE_URL}/en${canonicalPath}`
// ...
alternates: { canonical: url, languages: alternates }
```

**Verdict**: correct for en/nl/es + x-default. Canonical self-references its own locale URL. No duplicate-content risk.

Issues:

1. **`x-default = /en`** conflicts with CLAUDE.md which says "NL authoritative". Google uses x-default as the fallback for non-matched locales. Since most of your target market is NL, and the pricing is EUR-first, consider `x-default = /nl`. Defensible either way — document the decision.
2. Legal subpages (`privacy`, `terms`, `cookies`) skip the alternates block — they have canonical only. See `legal/privacy/page.tsx:21`. Fix by routing them through `generatePageMetadata`.
3. Blog posts build `alternates` dynamically (`blog/[slug]/page.tsx:34-41`). If a post only exists in `en`, no alternates are emitted at all. Acceptable, but note: `x-default` is also skipped when the post is single-locale. That's fine — single-locale pages need no x-default.
4. `routing.ts` uses `localePrefix: 'always'`. Bare `/` redirects to `/en` via middleware (`src/middleware.ts`). That's a 307/308 redirect chain for every root hit. Acceptable but marginal — Google handles it.

---

## Sitemap + Robots Audit

### Sitemap (`src/app/sitemap.ts`)

- 23 static routes × 3 locales + blog posts. Uses `MetadataRoute.Sitemap` API.
- Per-entry `alternates.languages` with all 3 locales = correct hreflang signalling in sitemap.
- `lastModified` uses `PAGE_DATES` SSoT in `src/lib/seo-config.ts:9-32` — all dated 2026-04-20 for content upgrade pages. Good.
- Priority distribution: home 1.0, skills/memory/pricing/apply 0.8-0.9, secondary 0.6-0.7. Sensible.
- **Missing from sitemap**: `/legal`, `/legal/privacy`, `/legal/terms`, `/legal/cookies`. `/legal` is in `pages` at line 28 but child routes aren't. Low priority, but fix for completeness.
- **Missing**: `/contact` has priority 0.6 — too low given it's a conversion target. Raise to 0.7.
- URL construction in line 42 (`url: ${SITE_URL}/en${pathSuffix}`) always uses `/en` as the primary URL in the sitemap — that's the Google-recommended pattern when using hreflang alternates, so OK.

### Robots (`src/app/robots.ts`)

```typescript
rules: [{ userAgent: '*', allow: ['/', '/llms.txt', '/llms-full.txt'], disallow: ['/api/', '/_next/'] }]
sitemap: `${SITE_URL}/sitemap.xml`
```

- Allows everything except `/api/` and `/_next/`. Correct.
- Explicit allow for `/llms.txt` and `/llms-full.txt` — nice GEO touch.
- **No separate AI-specific rules** for `GPTBot`, `ClaudeBot`, `CCBot`, `PerplexityBot`, `Google-Extended`, `anthropic-ai`. For a GEO strategy, explicitly allow/disallow per AI crawler. Current implicit `*` allows all — defensible for GEO since you WANT AI citations, but document it.
- No `crawl-delay` — OK for Googlebot (ignored) but could matter for aggressive AI crawlers.
- Sitemap pointer correct.

---

## Per-page SEO score (top 20)

Scoring: Primary-keyword match (25) + H1 quality (15) + heading hierarchy (10) + word-count ≥ threshold (20) + internal links IN (10) + internal links OUT (10) + schema depth (10).

| # | Page | H1 | Primary keyword | ≥Threshold | In-links | Out-links | Schema | Score |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` Home | `Dit is Clyde. Jouw AI Marketing Medewerker.` (split into span) | "AI Marketing Medewerker" | yes (~900 NL words visible) | 0 (root) | 20+ | WebSite + WebPage + Breadcrumb + FAQPage | 82 |
| 2 | `/memory` | `Geheugen. Clyde onthoudt elk merk, voor altijd` | "geheugen", "memory" | yes | 4 (footer, header, home trust, home cta) | 3 | WebPage + Breadcrumb | 72 |
| 3 | `/pricing` | `Pricing hero title (t())` | "prijzen", "pricing", "tier" | yes (~800 words + matrix) | 8+ | 15+ | WebPage + Breadcrumb + FAQPage + Pricing ItemList | 88 |
| 4 | `/apply` | `Apply hero title` | "apply", "aanmelden" | no (~150 words) | 30+ (every CTA) | 2 | WebPage + Breadcrumb | 60 |
| 5 | `/about` | `About hero title` | "FutureMarketingAI", "over" | yes (~700 words) | 3 | 6 | WebPage + Breadcrumb | 68 |
| 6 | `/how-it-works` | `HIW title` | "hoe werkt", "proces" | fair (~500 words) | 3 | 3 | WebPage + Breadcrumb + HowTo | 76 |
| 7 | `/contact` | `Contact title` | "contact" | fair | 3 | 3 | WebPage + Breadcrumb | 60 |
| 8 | `/founding-member` | `Founding hero title` | "founding member", "levenslang" | fair (~600 words) | 4 | 3 | WebPage + Breadcrumb (no FAQ schema despite visible FAQ) | 65 |
| 9 | `/case-studies/skinclarity-club` | `SKC title` | "case study", "SkinClarity" | yes (~900 words) | 4 | 2 | WebPage + Breadcrumb (no Review or CaseStudy schema) | 70 |
| 10 | `/skills/clyde` | `Clyde title` | "orchestrator", "Clyde" | yes | 3 | 4 | WebPage + Breadcrumb (no Service schema) | 62 |
| 11 | `/skills/social-media` | `Social Media title` | "social media", "captions" | yes | 2 | 4 | WebPage + Breadcrumb (no Service schema) | 62 |
| 12 | `/skills/voice-agent` | `Voice Agent title` | "voice agent", "AI-telefoon" | yes + demo | 2 | 4 | WebPage + Breadcrumb (no Service schema) | 64 |
| 13 | `/skills/lead-qualifier` | title | "lead qualifier", "chatbot" | yes | 2 | 4 | WebPage + Breadcrumb | 60 |
| 14 | `/skills/blog-factory` | title | "blog factory", "SEO-artikelen" | yes | 2 | 4 | WebPage + Breadcrumb | 60 |
| 15 | `/skills/ad-creator` | title | "ad creator", "Meta ads" | yes | 2 | 4 | WebPage + Breadcrumb | 60 |
| 16 | `/skills/reporting` | title | "rapportage", "dashboards" | yes | 2 | 4 | WebPage + Breadcrumb | 60 |
| 17 | `/skills/seo-geo` | title | "seo", "geo", "AI citation" | yes | 2 | 4 | WebPage + Breadcrumb | 60 |
| 18 | `/skills/research` | title | "research", "marktonderzoek" | yes | 1 | 4 | WebPage + Breadcrumb | 58 |
| 19 | `/skills/reel-builder` | title (coming_soon) | "reels" | fair | 1 | 4 | WebPage + Breadcrumb | 52 |
| 20 | `/blog` | `{t('title')}` | "AI marketing blog" | low (1 post) | 3 | 1 | WebPage + Breadcrumb | 55 |

**Observations**:

- Apply (60) should be higher given it's the conversion target — thin content hurts.
- Blog (55) has only 1 MDX post (`ai-marketing-automation-guide.mdx`) — thin hub. Category filtering loads, but with 1 post it's useless. No pagination.
- Skills (60-64) all score similar because they share the `SkillPageTemplate` and thus same schema, same heading pattern. Adding Service schema + FAQ + skill-specific use-case schema would lift the whole cluster to ~75.
- No page scores above 88. Pricing (88) is the ceiling because it has the richest schema cluster.

---

## Missing schemas — prioritized

| Schema | Impact | Effort | Where to add |
|---|---|---|---|
| Person (Daley) with full `sameAs` + `knowsAbout` | **P0** — E-E-A-T + AI citation | 2h | New `src/components/seo/PersonJsonLd.tsx`; emit on `/about`, blog posts (`author` ref), Org (`founder` ref). Use shared `@id` = `https://futuremarketingai.com/#daley` |
| Organization `sameAs` expansion (Wikidata, KvK, Crunchbase, Twitter) + stable `@id` | **P0** — primary GEO signal | 1h | Update `OrganizationJsonLd.tsx:74`. Add `@id: 'https://futuremarketingai.com/#org'`. Create Wikidata entry if none exists. |
| Service per skill | **P1** — 12 pages × service rich result opportunity | 3h | Wire up existing `ServiceJsonLd.tsx` in `SkillPageTemplate.tsx`. Pass `serviceType` per skill from `skills-data.ts`. |
| FAQPage on `/founding-member` | **P1** — FAQ rich result on founding tier page (high-conversion) | 20min | Add `<FaqJsonLd>` with existing 5 FAQ items in `founding-member/page.tsx` |
| WebSite `SearchAction` | **P2** — sitelinks search box (if you add site search) | 1h | Requires adding `/search` route. Skip until site search exists. |
| Article `image` + `publisher.logo` + `mainEntityOfPage` | **P1** — Article rich result requires image | 30min | Update `ArticleJsonLd.tsx:26-50` |
| Speakable on blog posts + case study | **P1** — AI citation precision signal | 2h | Add `speakable.cssSelector` to WebPage/Article schemas. Mark summary/lead paragraphs. |
| BreadcrumbList references to Org/WebSite via `@id` | **P2** — entity graph coherence | 1h | Refactor to `@graph` array in a single JsonLd per page. |
| `@graph` consolidation | **P2** — AI Mode favours nested entity graphs per research sec 2 | 3h | Create `src/components/seo/GraphJsonLd.tsx` that emits Org + WebSite + WebPage + Breadcrumb + (optional FAQ/Article) in one block with cross-@id refs. |
| CaseStudy (hasSample → Article + interactionStatistic) for SKC | **P2** — niche but unique | 2h | Custom JSON-LD for `/case-studies/skinclarity-club` |
| ItemList of 12 Skills on `/skills` hub | **P2** — no hub page exists yet! | — | Requires creating `/skills` index page first |
| AggregateOffer on pricing | **P3** — only if you have reviews ≥5 | n/a | Skip until reviews exist |
| JobPosting (if hiring) | — | — | skip |

---

## Top 15 SEO fixes, ranked by organic-traffic impact

| # | Fix | Impact | Effort | ROI |
|---|---|---|---|---|
| 1 | **Create `public/og-image.png`** (1200×630) — currently 404s from every OG/Twitter/Org logo | Very High (every social share + AI crawl is broken) | 30min | ★★★★★ |
| 2 | **Rewrite or delete `public/llms.txt` + `llms-full.txt`** — v9 pricing, dead URLs, contradicts site | Very High (direct misdirection of AI crawlers) | 2h | ★★★★★ |
| 3 | **Add full Organization `sameAs`** — Wikidata (create entry), LinkedIn already there, add Twitter (`FutureMarketAI`), KvK (when registered), Crunchbase, YouTube if exists. Add `@id` fragment. | High (primary GEO signal) | 2h | ★★★★★ |
| 4 | **Create Person schema for Daley** with `sameAs` (LinkedIn, Twitter), `jobTitle`, `worksFor → Org @id`, `knowsAbout` topics. Emit on `/about` + blog articles. | High (E-E-A-T + AI citation) | 2h | ★★★★☆ |
| 5 | **Wire up ServiceJsonLd on every `/skills/*` page** — dead component today | Medium-High (12 pages × rich result potential) | 2h | ★★★★☆ |
| 6 | **Trim meta descriptions to ≤160 chars** — home (228), pricing (172), apply (200), founding (205). Copy-only edit in `messages/*.json`. | Medium (SERP truncation lose click-intent) | 1h | ★★★★☆ |
| 7 | **Add Speakable schema** to home summary, case study summary, memory page key paragraph — pure GEO signal per research doc | Medium (AI citation precision) | 1h | ★★★★☆ |
| 8 | **Update Organization `hasOfferCatalog`** to match current 12 skills + 5 tiers (not dead "Marketing Machine"). Fix content-parity warning risk. | Medium (spam flag risk) | 1h | ★★★★☆ |
| 9 | **Add FaqJsonLd to `/founding-member`** — visible FAQ has no schema today | Medium (rich result on conversion-critical page) | 15min | ★★★★★ |
| 10 | **Route legal subpages through `generatePageMetadata`** — adds OG/Twitter/hreflang | Low-Medium | 30min | ★★★☆☆ |
| 11 | **Translate blog index title/description** — currently hardcoded English on NL/ES routes | Medium (duplicate content from EN leaking into NL SERP) | 30min | ★★★★☆ |
| 12 | **Update `seo-config.ENTITY_DESCRIPTION`** to include Clyde naming + founding/20-per-year scarcity. Current copy says "EU-native AI partner" (generic). | Low-Medium (AI crawl source of truth) | 30min | ★★★☆☆ |
| 13 | **Add Article.image + publisher.logo + mainEntityOfPage** to `ArticleJsonLd` — required for Article rich result | Medium (blog rich results) | 30min | ★★★★☆ |
| 14 | **Decide + apply domain SSoT** — `futuremarketingai.com` vs `future-marketing.ai`. Audit all env vars, redirects, Vercel domain config. CLAUDE.md says hyphenated; code says no-hyphen. | Medium (only cosmetic until mismatch breaks a redirect) | 1h | ★★★☆☆ |
| 15 | **Publish blog posts in NL + EN + ES** — only 1 MDX file exists, English only. Blog is effectively a stub. | High long-term (topical authority + keyword capture) | ongoing | ★★★★★ (time-distributed) |

---

## Keyword opportunity gaps

Based on NL market and the clarified positioning (AI marketing medewerker for bureaus):

| Target keyword (NL) | Search intent | Current page | Optimization status |
|---|---|---|---|
| "AI marketing medewerker" | Brand + category | `/` home (used in H1) | Owned |
| "AI marketing automation Nederland" | Category, mid-funnel | — no dedicated page | **Gap** — blog article |
| "AI chatbot voor bureau" | Solution | `/skills/lead-qualifier` | OK, weak optimization |
| "Voice agent NL" | Solution | `/skills/voice-agent` | OK |
| "marketing automation bureau" | Category, bottom-funnel | — | **Gap** |
| "AI content generator bureau" | Solution | `/skills/social-media`, `/skills/blog-factory` | Split across pages — no hub |
| "persistent AI memory B2B" | Unique USP | `/memory` | Owned but word-count thin |
| "founding member tier AI" | Long-tail brand | `/founding-member` | Owned |
| "12 AI vaardigheden marketing" | Long-tail brand | — no `/skills` hub page | **Gap** — missing hub |
| "Clyde AI marketing" | Brand defence | `/skills/clyde` + home | Owned |
| "AVG EU AI Act marketing" | Compliance-intent | mentioned nowhere as H1/H2 | **Gap** — dedicated comparison page |
| "marketing automation vs AI medewerker" | Comparison | — | **Gap** — comparison page + schema |
| "SkinClarity Club case study AI" | Proof | `/case-studies/skinclarity-club` | Owned |
| "Jasper vs Clyde" / "ChatGPT vs Clyde" | Competitor comparison | Mentioned in `/memory` contrast section only | **Gap** — dedicated comparison page |
| "Nederlandse AI marketing SaaS" | Local intent | — | **Gap** |
| "n8n marketing automatisering" | Tech-intent | — | **Gap** — blog topic |

**Recommendation**: build a `/skills` hub page (ItemList of 12 skills), a comparison page (`/vs/jasper-chatgpt`), and 3 NL blog articles targeting the top 5 gap keywords. These have direct search demand in NL B2B marketing.

---

## Content depth + E-E-A-T

- **Experience signals**: SKC case study is the one proof asset. Strong. Repeat this pattern for every new client — case study per partner = long-tail keyword coverage + E-E-A-T.
- **Expertise signals**: Daley's bio exists on `/about` (~700 words) but is not linked to a Person schema. No author bio on blog posts (author name only, no bio).
- **Authoritativeness**: missing external mentions, press coverage, podcast appearances in `sameAs`. Add any as found.
- **Trustworthiness**: legal pages split correctly per 2026-04-20 redesign. Good. Cookie consent implemented (`CookieConsentBanner.tsx`). Security headers in `next.config.ts:31-72`. Solid.
- **Blog word count**: the 1 MDX post is ~1,800 words — perfect for SEO. Issue is volume (n=1). Need 10+ for topical-authority signal.

---

## Core Web Vitals (SEO-relevant summary)

Out of scope for this audit (performance agent handles), but SEO-impacting flags seen:

- Spline 3D robot (`HeroSpline`, `src/components/hero/HeroSpline.tsx` via `splite.tsx`) — 638KB runtime, 1.6s main-thread block. Mitigated with preview image + 3s delay. Still LCP risk on mobile — verify LCP element is preview WebP (17KB), not the Spline canvas. Core Web Vitals affect rankings since 2021.
- Sitemap `changeFrequency: 'weekly'` on home, `'monthly'` on skills — fine, low weight signal for Google.
- `images.minimumCacheTTL = 31536000` (`next.config.ts:82`) — 1-year cache, good.
- No `<link rel="preload">` for hero image — preview WebP is critical LCP element, should preload. Currently relies on `next/image priority`.

---

## Blog / content-marketing setup

- MDX + gray-matter in `src/lib/blog.ts`. Frontmatter parsed: title, description, author, publishedAt, updatedAt, category, tags, locale.
- `/blog` index supports category filtering via `?category=` search param. No tag landing pages. No pagination. No RSS feed. No JSON feed. No date archives.
- `BLOG_CATEGORIES` hardcoded at `src/lib/blog.ts:17-22`: ai-marketing, automation, chatbots, voice-agents. Missing: "case studies", "AI memory", "pricing strategy", "GEO / AI search".
- Currently 1 post (English). Locale mapping: post declares its own locale in frontmatter; `generateStaticParams` only generates routes for the post's source locale to prevent `/nl/blog/english-post`. This is correct behavior.
- **No RSS/Atom feed**. Fix: add `src/app/feed.xml/route.ts` that emits Atom from `getAllPosts()`. Medium SEO value but important for GEO (AI crawlers parse feeds).
- **No tag pages / category pages with unique URL**. Category filter is query-string, not indexable.
- No social-share meta (article:author, article:published_time) — OG type is `article`, which Next sets some fields. Check actual output.

---

## Indexability + noindex audit

- **Zero `noindex` tags found** in codebase (grep returned nothing).
- No staging-only robots block (relies on Vercel preview deployments having separate URL).
- Every page is indexable by default via missing-meta-robots + robots.txt `allow: /`.
- **Recommendation**: add a build-time check that sets `robots: { index: false }` if `VERCEL_ENV !== 'production'`. Prevents preview-deploy URLs from being accidentally indexed.
- `/apply` is fully indexable — it's a form page. Consider whether you want SERP visibility here (for conversion keyword "apply AI marketing") vs hiding it from search. Currently visible; seems intentional.

---

## Breadcrumbs

- `BreadcrumbJsonLd` present on every non-home page.
- **No visible breadcrumb UI component on most pages**. Only the blog post page has a visible breadcrumb (`blog/[slug]/page.tsx:115-125`). Google Rich Results needs **schema + visible breadcrumbs that match** for the breadcrumb rich snippet.
- **Fix**: add visible breadcrumb above the H1 on pricing, skills/*, memory, founding-member, case-studies/*, about.

---

## Multilingual SEO decisions

- Subdirectory model (`/en`, `/nl`, `/es`) — correct for SEO (single domain authority).
- `hreflang` + canonical correctly scoped per locale.
- No duplicate-content risk per Google — each locale has canonical to itself + language alternates.
- **Gap**: NL translations are the content source-of-truth per CLAUDE.md, but EN is served as the default (via `localePrefix: 'always'` + `defaultLocale: 'en'` + `x-default: /en`). Bot that follows the default will see English. For NL-market search, direct `/nl/` traffic is what matters — OK. For GEO and bots that fall back to default, consider whether NL depth should be prioritised (switch default or x-default).

---

## Redirects

Defined in `next.config.ts:108-148`. 7 redirects, all 308 permanent:

- `/:locale/chatbots` → `/:locale/skills/lead-qualifier`
- `/:locale/automations` → `/:locale/skills/ad-creator`
- `/:locale/voice-agents` → `/:locale/skills/voice-agent`
- `/:locale/marketing-machine` → `/:locale/skills/social-media`
- `/:locale/skills/chatbot` → `/:locale/skills/lead-qualifier`
- `/:locale/skills/content-creator` → `/:locale/skills/social-media`
- `/:locale/skills/email` → `/:locale/skills/email-management`

Good hygiene. Worth noting that `/chatbots` and `/automations` legacy URLs still appear in `public/llms.txt:16-17` — so LLM crawlers hit the old URL, get 308-redirected. Acceptable but add the post-redirect URL in a fresh llms.txt.

---

## llms.txt assessment (GEO plumbing)

Critical issue — the file is stale:

- `llms.txt:5` says pricing tiers are Starter EUR 1.497, Growth EUR 2.497, Scale EUR 3.997 — **v9 pricing**, not v10.
- `llms.txt:17-20` points to `/en/chatbots`, `/en/automations`, `/en/voice-agents`, `/en/marketing-machine` — **legacy redirect-only URLs**.
- `llms.txt:25` says tiers are Starter/Growth/Scale — should be Partner/Growth/Professional/Enterprise/Founding.
- `llms-full.txt` same issue at scale — entire file describes v9 model.

**Rewrite required** before promoting GEO. This file is the primary LLM-facing source.

---

## Strategic SEO roadmap

### 30 days (high-leverage foundation)

1. Fix #1 from top-15: create `og-image.png`.
2. Fix #2: rewrite `llms.txt` + `llms-full.txt` to v10 model with Clyde positioning.
3. Fix #3: expand Organization `sameAs` (create Wikidata entry, LinkedIn, Twitter, KvK once registered). Add stable `@id`.
4. Fix #4: create `PersonJsonLd` for Daley. Emit on `/about` + blog.
5. Fix #6: trim meta descriptions to ≤160 chars in `messages/nl.json` + EN + ES.
6. Fix #9: add FaqJsonLd to `/founding-member`.
7. Fix #8: fix `hasOfferCatalog` content parity.
8. Fix #14: domain SSoT decision + document.
9. Submit sitemap to Google Search Console + Bing Webmaster Tools.

### 60 days (GEO + schema deepening)

10. Fix #5: wire up ServiceJsonLd on all 12 skill pages.
11. Fix #7: Speakable schema on home + memory + case study.
12. Fix #11: translate blog index title/description.
13. Consolidate to `@graph` JSON-LD with cross-references per page.
14. Add visible breadcrumb component to non-home pages.
15. Publish 2 new NL blog posts targeting gap keywords ("AI marketing automation Nederland", "ChatGPT vs Clyde voor bureaus").
16. Build `/skills` hub page with ItemList schema listing 12 skills.
17. Add RSS/Atom feed at `/feed.xml`.
18. Set up Google Search Console + monitor for indexation issues.

### 90 days (content depth + authority)

19. Publish 4 more NL blog posts (total 7 NL posts) + 2 EN posts.
20. Build 2 comparison pages (`/vs/jasper`, `/vs/chatgpt`) with structured data.
21. Create 1 detailed case study page for the second founding client (when acquired).
22. Add author bio + Person schema to every blog post.
23. Build internal-linking map — every skill page links to 3 adjacent skills + case study.
24. Monitor AI Mode + Perplexity citation frequency (manual sampling).
25. Apply for Wikidata entry if not yet created.
26. Consider adding glossary page with DefinedTerm schema ("AI marketing medewerker", "persistent memory", "EU-native").

---

## Appendix A — Files inventoried

### SEO-relevant source files

- `src/app/robots.ts` — robots rules
- `src/app/sitemap.ts` — sitemap + hreflang alternates
- `src/app/[locale]/layout.tsx` — emits OrganizationJsonLd globally; sets `metadataBase`
- `src/app/[locale]/opengraph-image.tsx` — generates OG image per locale
- `src/lib/seo-config.ts` — SITE_URL, SITE_NAME, PAGE_DATES, ENTITY_DESCRIPTION
- `src/lib/metadata.ts` — shared `generatePageMetadata()` helper
- `src/lib/og-image.tsx` — OG image JSX template
- `src/lib/blog.ts` — blog post loader + metadata
- `src/middleware.ts` — next-intl locale routing
- `src/i18n/routing.ts` — locales config
- `src/components/seo/JsonLd.tsx` — shared JSON-LD emitter (XSS-safe)
- `src/components/seo/OrganizationJsonLd.tsx`
- `src/components/seo/WebSiteJsonLd.tsx`
- `src/components/seo/WebPageJsonLd.tsx`
- `src/components/seo/BreadcrumbJsonLd.tsx`
- `src/components/seo/FaqJsonLd.tsx`
- `src/components/seo/HowToJsonLd.tsx`
- `src/components/seo/ArticleJsonLd.tsx`
- `src/components/seo/ServiceJsonLd.tsx` (unused, dead)
- `src/components/seo/PricingJsonLd.tsx`
- `src/components/skills/SkillPageTemplate.tsx` — shared skill-page layout + WebPage/Breadcrumb JsonLd
- `next.config.ts` — security headers, redirects, MDX, bundle analyzer
- `public/robots.txt` — absent (generated from robots.ts)
- `public/sitemap.xml` — absent (generated from sitemap.ts)
- `public/llms.txt` — **stale**
- `public/llms-full.txt` — **stale**
- `public/og-image.png` — **missing**
- `content/blog/ai-marketing-automation-guide.mdx` — 1 blog post (EN)

### All page.tsx files with metadata (28)

Home (1), (marketing) group (6: memory, pricing, apply, about, how-it-works, contact, founding-member, case-studies/skinclarity-club), (skills) group (12: clyde, social-media, voice-agent, lead-qualifier, ad-creator, blog-factory, reel-builder, email-management, manychat, reporting, seo-geo, research), (blog) group (2: blog index, blog post), (legal) group (4: legal index, privacy, terms, cookies).

### All routes (per sitemap.ts + blog)

23 static + 1 blog post × 3 locales = 72 indexable URLs today (sitemap lists 69 — legal/privacy, legal/terms, legal/cookies missing from sitemap).

---

## Appendix B — Reference to schema research doc

The research at `docs/research-schema-markup-structured-data-seo-geo.md` (sections 1 Tier 1/2/3, 2 GEO strategy, 7 priority order) directly informs the fix-ranking above. The March 2026 Google core update guidance (research sec 1, "Post-March 2026 Core Update Reality") explains why:

- FAQ schema on `/founding-member` is safe (genuine primary-content FAQ).
- Speakable is purely AI-facing, high-leverage, low-effort.
- `sameAs` with Wikidata is the single highest GEO multiplier (research sec 2, "3.2x AI Mode citation lift").
- Schema content-parity is strictly enforced — hence fix #8 (hasOfferCatalog stale entries).

The Next.js App Router JSON-LD implementation pattern (research sec 5) matches the current `JsonLd.tsx` component exactly — no infrastructure changes needed, only content/coverage.
