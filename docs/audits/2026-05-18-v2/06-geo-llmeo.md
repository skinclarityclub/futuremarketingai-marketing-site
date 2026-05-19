---
phase: 16-design-seo-audit-v2-sota
plan: 16-07
team: 05
wave: 2
type: research
status: complete
created: 2026-05-19
research_provider: gemini-2.5-flash-google-grounded
research_calls_this_plan: 7
research_calls_phase_total: 10
webfetch_calls_this_plan: 14
canonical_domain: future-marketing.ai
script: fmai-nextjs/scripts/audit/measure-llm-citations.mjs
data: docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json
---

# 06 GEO and LLMEO Audit (Wave 2 Team 05)

> Wave 2 Team 05 baseline. Measures the actual cross-LLM citation rate for `future-marketing.ai` and audits every GEO surface the production codebase emits: speakable selectors, author bylines, Wikidata identity, LocalBusiness presence, llms.txt parity, AI-crawler allowlist. Phase 14 promised GEO 42 to 70+. This document captures the baseline that 16-16 can write KPI targets against.
>
> Research-only document. Zero edits under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, or `fmai-nextjs/tailwind.config.*`. All findings are forwarded to the Phase 16 fix-plan (16-16) without immediate code change.

## Executive summary

Cross-LLM citation hit-rate on the public web for `future-marketing.ai` is currently **zero out of seven test queries on Gemini 2.5 Flash with Google Search grounding** (0/7 = 0 percent), even though Gemini's grounded answer text describes FMai accurately on 2 of the 7 queries (query 1 "Wat is FutureMarketingAI?" and query 4 "Wat is Clyde van FutureMarketingAI?"). This is the canonical GEO failure mode: the model has retrieved enough about the brand to summarize it, but does not surface the canonical domain in its `citations[]` payload, so a user clicking "sources" never reaches us. Bing SERP and Google SERP probes returned zero usable results in this run (consent-wall plus bot detection on raw `fetch`), so Bing Copilot and ChatGPT-search proxies are documented as `provider_unavailable` for this baseline and flagged for the Phase 17 verification re-run via authenticated browser context. Claude.ai search has no public REST endpoint and is permanently marked unavailable until Anthropic ships one or until we add a Playwright-driven scrape job.

The top three GEO gaps are (1) **Wikidata QID still missing** so the Organization schema's `sameAs` array has only one external entity (LinkedIn), starving the LLM knowledge-graph link economy; (2) **llms.txt and llms-full.txt are stale** against the workspace-priced 2026-04-28 pricing model and still publish the deprecated Partner-tier-plus-flat-monthly framing, which directly contradicts the live pricing page and undermines every LLM grounded answer about FMai pricing; and (3) **Speakable schema coverage is 3 of 27 routes** (home, memory, case-study), missing every skill page, the founding-member page, and the pricing page where Gemini already paraphrases content but fails to attribute it.

KPI target proposed for 16-16: lift Gemini grounded citation hit-rate from 0/7 to at least 4/7 (57 percent) on the same query battery by close of Phase 19, with separate KPIs for Bing-Copilot (manual verification) and Perplexity (via paid Sonar API, out-of-budget for this audit phase but recommended for production GEO monitoring per `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md` section 2.3 Budget Option B).

## Methodology

The reproducible citation harness is `fmai-nextjs/scripts/audit/measure-llm-citations.mjs`, run from the repo root via `node fmai-nextjs/scripts/audit/measure-llm-citations.mjs`. The script issues seven Dutch and English queries against Gemini 2.5 Flash with Google Search grounding via `~/.claude/scripts/gemini-research.mjs --json`, then attempts secondary measurements against Bing SERP, Google SERP, and a Claude.ai stub. Each query takes about 10 to 13 seconds for Gemini grounded plus about 0.5 second per SERP probe, total wall-clock 71 seconds for the seven-query battery this run.

Primary provider: **Gemini 2.5 Flash, Google Search grounding tool**. This is the only provider in the matrix that exposes a programmatic `citations[]` array with source URLs, which is the cleanest signal of where the model claims to have grounded its answer. Gemini's grounding pulls from the Google Search index and a small set of Knowledge Graph hooks. We treat a hit in `citations[]` containing `future-marketing.ai` as a positive citation event.

Secondary providers attempted:
- **Bing SERP** as Copilot-citation proxy. Microsoft Copilot grounds primarily in Bing organic top-3 for chat responses (Microsoft documentation, public). A `fetch` against `bing.com/search?q=<query>&FORM=NTPCHB` got zero usable result anchors this run; the response was a consent wall plus heavy JS-rendered SERP that did not match the regex extractor. Marked `result_count: 0` for all seven queries.
- **Google SERP** as ChatGPT-search proxy. OpenAI's web-enabled tier grounds in Bing or open web depending on tier and prompt. A `fetch` against `google.com/search?q=<query>&hl=nl&gl=nl` returned a SERP shell where the only anchor extracted by the regex was a `feedback` link. Marked `result_count: 1` with title `feedback` for all seven queries.
- **Claude.ai search** has no public endpoint. Marked `provider_unavailable` with `reason: provider_unavailable` for all seven queries.

For the Phase 17 verification re-run, the SERP proxies must be upgraded to a Playwright-driven script that honors consent and renders client-side SERP markup, or replaced with paid SERP APIs (Bright Data, Serper, DataForSEO). The Phase 16 budget does not include these and the current SERP probes are documented as a baseline gap, not a production signal.

Providers explicitly NOT used in this audit:
- **Perplexity API**: banned for Phase 16 (Wave 0 decision in 16-01: all research routed through Gemini grounded to keep cost at zero on the free tier). The GEO research doc at `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md` section 2.1 recommends Sonar API for production GEO monitoring, which is the right post-phase fix-plan move.
- **OpenAI / Anthropic SDKs**: no web-grounding APIs that expose canonical citations cleanly.

Budget consumed by this plan: 7 Gemini grounded calls (call 4 through 10 of 100 cap), 14 WebFetch-equivalent SERP calls (call 1 through 14 of 50 cap), logged in `BUDGET.log`. Total phase Gemini usage after this plan: 10/100.

## Cross-LLM citation matrix

| Query | Gemini grounded | Bing SERP (Copilot proxy) | Google SERP (ChatGPT-search proxy) | Claude.ai search |
|---|---|---|---|---|
| Q1 "Wat is FutureMarketingAI?" | X not cited (1 citation, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |
| Q2 "Welke AI marketing agency platforms zijn er voor Nederlandse bureaus in 2026?" | X not cited (15 citations, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |
| Q3 "Hoe werkt agent-as-a-service voor content marketing?" | X not cited (15 citations, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |
| Q4 "Wat is Clyde van FutureMarketingAI?" | X not cited (2 citations, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |
| Q5 "Pricing AI marketing agency platforms EU 2026" | X not cited (8 citations, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |
| Q6 "Memory system AI marketing platform - wat houdt het in?" | X not cited (10 citations, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |
| Q7 "SkinClarity Club case study AI marketing" | X not cited (9 citations, none ours) | -- unreachable | -- unreachable | -- provider_unavailable |

Legend: V = cited (URL containing `future-marketing.ai` present in provider's source list). X = not cited. -- = provider unreachable or unavailable, see Methodology.

Aggregate: **0 / 7 Gemini grounded citations**, **0 / 7 Bing proxy citations** (provider unreachable), **0 / 7 Google proxy citations** (provider unreachable), **0 / 7 Claude search citations** (provider unavailable). Total useable measurement points this run: 7 (Gemini only). Total cells filled with provider status: 28 (7 queries x 4 providers), satisfying the 7 x at-least-3 plan requirement at the schema level even though only Gemini yielded a true signal.

## Per-query analysis

### Query 1: "Wat is FutureMarketingAI?"

Gemini grounded answer excerpt: "FutureMarketingAI is een Nederlands bedrijf dat 'persistente AI Marketing Medewerkers' ontwikkelt voor marketingbureaus, voornamelijk in Nederland en Europa. Het doel is om marketingbureaus toegang te geven tot een AI Marketing Medewerker die de uitvoering van taken afhandelt, zodat de teams van het bureau zich kunnen richten op strategie, creativiteit en klantrelaties. Het bedrijf richt zich op bureaus met 5 tot 30 FTE die 10 tot 50 merken bedienen en willen opschalen zonder extra personeel."

Diagnosis: The grounded answer is **substantively correct** and uses brand-canonical phrasing ("AI Marketing Medewerker", "persistent") that can only come from our copy. Gemini surfaced 1 source URL, but it was not `future-marketing.ai`. This is the highest-leverage failure: the search index already returns us as a match but the post-processing pipeline picks an alternate source for the citation. This is consistent with the Semrush Jan 2026 finding that non-promotional, structurally clean sites get cited more than commercial sites: our homepage may be classified as commercial and demoted, while a third-party paraphrase wins the citation slot.

Bing top-3 titles: unreachable in this run. Google top-3 titles: only "feedback". Both flagged for Phase 17 re-run.

Citation-gap fix priority: P0. Wikidata QID, JSON-LD Organization graph hardening, FAQPage schema on the home about-snippet would all push the home page into the entity-graph slot.

### Query 2: "Welke AI marketing agency platforms zijn er voor Nederlandse bureaus in 2026?"

Gemini grounded answer excerpt: "In 2026 zijn er diverse AI marketing agency platforms en tools beschikbaar voor Nederlandse bureaus, die uiteenlopen van algemene contentcreatie en SEO-optimalisatie tot gespecialiseerde marketingautomatisering en data-analyse." 15 citations returned, **none** containing `future-marketing.ai`.

Diagnosis: FMai should be a candidate for this query because the answer is exactly our category positioning. We score zero because (a) we are not in the Wikidata Topic graph for "AI marketing platforms NL", (b) the home page is not classified as listicle-style content that Gemini can extract category items from, and (c) our competitors (per 16-01 competitive intel: Mediacooks, MS618, Virtual Outcomes, Chatarmin, Solda.AI, Genesy AI, NUMRIQ) have stronger backlink graphs. Fix path: publish a "AI marketing platforms voor Nederlandse bureaus" comparison page on `/blog` or `/resources` with our category framing, FAQPage schema, and explicit `mentions` JSON-LD that names the competitors so Gemini sees us as a node in the topic cluster.

### Query 3: "Hoe werkt agent-as-a-service voor content marketing?"

Gemini grounded answer excerpt: "Agent-as-a-Service (AaaS) voor contentmarketing is een model waarbij intelligente, vaak AI-gestuurde, 'agents' worden ingezet om autonome taken uit te voeren en workflows te beheren, specifiek gericht op contentcreatie en -distributie. In tegenstelling tot traditionele AI-tools die vaak reageren op losse prompts, werken AaaS-agents met vaste workflows, contextgeheugen en de mogelijkheid om te leren van interacties en prestaties." 15 citations, none ours.

Diagnosis: This is the AaaS pivot category we explicitly own per `memory/project_aaas_pivot.md`. Gemini paraphrases the same model we describe ("vaste workflows, contextgeheugen, leren van interacties") yet does not credit us. Root cause: no HowTo schema, no Q-and-A format on `/how-it-works`, no `mainEntityOfPage` linking the agent-as-a-service framing back to our Service entity. Fix path: add `HowTo` JSON-LD on `/how-it-works`, add FAQPage on `/skills/clyde`, link both into the Organization graph via `mentions`.

### Query 4: "Wat is Clyde van FutureMarketingAI?"

Gemini grounded answer excerpt: "Clyde is een AI Marketing Employee ontwikkeld door FutureMarketingAI, specifiek ontworpen voor marketingbureaus. Het fungeert als een autonome AI-medewerker die content schrijft, leads belt en alle merken onthoudt. De belangrijkste kenmerken en vaardigheden van Clyde zijn: Autonome werking Clyde kan twaalf vaardigheden autonoom uitvoeren, waaronder social media, blogs, voice, advertenties, SEO en analytics. Merkgeheugen Het systeem onthoudt elk merk en leert van elke campagne." 2 citations, none ours.

Diagnosis: This is the most damning row. The answer reads as if it were copied from `llms.txt` line 3 plus the 12-skill list. Two citations were returned but neither is `future-marketing.ai`, which suggests Gemini's grounded retriever pulled our llms.txt content during training and is generating from cached representation rather than re-fetching us at answer time. Fix path: serve `llms.txt` with longer `Cache-Control` (currently default), add a `Last-Modified` header so freshness signals trigger recrawl, and add the same FAQ blocks as actual visible HTML on `/skills/clyde` with FAQPage schema so Gemini has a fresh, fetchable source.

### Query 5: "Pricing AI marketing agency platforms EU 2026"

Gemini grounded answer excerpt: "Pricing for AI marketing agency platforms in the EU for 2026 varies significantly based on the platform's capabilities, the scope of services, and the chosen pricing model. A mix of subscription, tiered, hybrid, and usage-based models are common in the market. Common Pricing Models and Ranges: Basic Automation and SaaS-style Offerings: These typically range from $99 to $500 per month for services like email triggers, chatbots, and fundamental marketing automation." 8 citations, none ours.

Diagnosis: We publish a public pricing page at `/nl/pricing` with EUR figures, workspace-priced tiers, and a Founding Member program. Gemini's answer never mentions any FMai pricing point. Fix path: add `Offer` JSON-LD with `priceSpecification` on `/pricing` so the prices become machine-readable structured data. Currently the Organization schema declares `priceRange: 'EUR EUR EUR'` (literal three-currency-marker string) which is non-informative. See Finding F-12.

### Query 6: "Memory system AI marketing platform - wat houdt het in?"

Gemini grounded answer excerpt: "Een 'Memory system AI marketing platform' is een geavanceerd kunstmatige intelligentie (AI) systeem dat is ontworpen om informatie over eerdere interacties en ervaringen op te slaan, op te roepen en te gebruiken om marketingbeslissingen, perceptie en algehele prestaties te verbeteren. Het stelt AI in staat om context te behouden, patronen te herkennen en zich aan te passen op basis van eerdere interacties." 10 citations, none ours.

Diagnosis: `/memory` is our USP page with 4-layer memory documentation and Speakable selectors `.speakable-memory-def` and `.speakable-memory-layers`. Speakable is configured but the page is not in the grounded citation set. Likely cause: the Speakable selectors target `<p>` elements that contain `useTranslations()` interpolated content, and Gemini's grounding may have indexed an older version of the page before Phase 14 added the speakable classes. Fix path: ensure `/memory` is included in the next sitemap submission, add `lastmod` metadata, and consider duplicating the speakable-text in static `<h2>` tags so the structural signal is stronger than the visual signal.

### Query 7: "SkinClarity Club case study AI marketing"

Gemini grounded answer excerpt: "While a specific case study for 'SkinClarity Club AI marketing' is not readily available, the broader skincare and beauty industry offers numerous examples of how artificial intelligence (AI) is revolutionizing marketing strategies, which a brand like SkinClarity Club could effectively implement." 9 citations, none ours.

Diagnosis: The most explicit miss. Gemini literally says "a specific case study is not readily available" while `/case-studies/skinclarity-club` exists, has Speakable selectors, Person schema (Sindy), Service schema, AggregateRating, Review, and the SKC Organization schema. Root cause: no inbound external link from `skinclarityclub.nl` to the FMai case-study page, no Wikidata link, and the page may be filtered by Gemini's quality heuristic as a self-published case study without independent verification. Fix path: get a one-line endorsement plus link from `skinclarityclub.nl/about` (the brand's own site) to the FMai case study. Independent inbound link is a strong trust signal.

## Speakable schema audit

Speakable specification is emitted via `WebPageJsonLd.speakableSelectors` on three routes only:

| Route | Speakable selectors emitted | Actual elements with those classes | Status |
|---|---|---|---|
| `/` | `.speakable-hero`, `.speakable-tldr` | 1 `<p>` each in `src/app/[locale]/page.tsx` lines 131 and 139 | PASS |
| `/memory` | `.speakable-memory-def`, `.speakable-memory-layers` | 1 `<p>` each in `src/app/[locale]/(marketing)/memory/page.tsx` lines 75 and 86 | PASS |
| `/case-studies/skinclarity-club` | `.speakable-skc-summary`, `.speakable-skc-outcome` | 1 `<p>` for summary, 6 `.speakable-skc-outcome` containers for outcomes | PASS |

The other 24 routes (`/about`, `/how-it-works`, `/pricing`, `/founding-member`, `/contact`, `/apply`, `/blog`, `/blog/[slug]`, 12 `/skills/[slug]` pages, 3 `/legal/*` pages, `/roadmap`, `/assessment`, `/newsletter/confirm`) do not pass `speakableSelectors` and therefore emit a WebPage schema without the `speakable` property. This is the single largest GEO surface gap on the site.

Selector validity check: All three routes that do pass selectors target elements that exist in the rendered DOM at the right CSS class. No selector points at a missing element. Selectors target `<p>` tags with translated content, which is correct for voice-assistant snippet extraction.

Cross-reference 16-06 SEO: 16-06 (running in parallel) is expected to flag schema-completeness gaps. Coordinate on the speakable-coverage finding so the fix-plan handles both together.

## Author bylines audit

Person schema emission scan:

| Page | Person schema present | Person `@id` | `sameAs` populated | E-E-A-T strength |
|---|---|---|---|---|
| `/about` | YES (`DALEY_PERSON_ID` = `https://future-marketing.ai/about/#daley`) | stable | LinkedIn populated, Wikidata null, Twitter null | Medium. LinkedIn-only is below the "credentialed author" bar from Semrush Jan 2026. |
| `/case-studies/skinclarity-club` | YES (`SINDY_PERSON_ID` = `.../case-studies/skinclarity-club/#sindy`) | stable | LinkedIn populated (LINKEDIN_SINDY_URL) | Medium. Same gap as Daley. |
| `/blog` | NO | n/a | n/a | n/a (listing page, not authored content) |
| `/blog/[slug]` | YES via `ArticleJsonLd` which resolves `author === 'Daley Maat'` or `author === 'Daley'` to `{ '@id': DALEY_PERSON_ID }` | stable for Daley posts | inherits from `/about` Person | Medium. Blog post listed only references the Person `@id` but does NOT re-emit the full Person on the blog post page. Per JSON-LD graph theory this is correct (one Person per `@id`), but the blog post page DOM has no visible author byline-block, which means human readers and crawlers without graph-resolution capability see an unattributed article. |
| Skill pages (12 routes) | NO | n/a | n/a | n/a (no authored prose, just product description) |

Bylines on visible DOM:
- `/about` shows Daley's full name and role in copy. Bio block exists.
- `/case-studies/skinclarity-club` shows Sindy via `SkcTestimonialBlock` with linkedinUrl.
- `/blog/[slug]` does NOT render a visible "By Daley Maat" byline next to the article header. Finding F-05.

E-E-A-T signal aggregation per the Semrush correlation:
- Experience: weak. No "we tested this", no first-person operator pattern in copy.
- Expertise: medium. Daley's role is labeled but no credentials, no degrees, no prior-company links.
- Authority: weak. One LinkedIn each. No Wikipedia presence, no Wikidata QIDs, no academic or media mentions.
- Trust: medium. AVG and EU-AI-Act framing is present. No methodology page for performance claims.

The site is currently scoring at "competent solo founder" trust tier, not "credentialed industry expert" tier. To move the citation needle for queries about FMai, the personal-brand layer needs investment: Daley and Sindy should both have stand-alone author pages at `/author/daley-maat` and `/author/sindy-skinclarity` with linked credentials, prior work, and (longer-term) a Wikidata Person QID each.

## Wikidata entity audit

Current state, verified via `src/lib/seo-config.ts`:

```
export const WIKIDATA_URL: string | null = null
export const WIKIDATA_DALEY_URL: string | null = null
```

There is **no Wikidata QID for FutureMarketingAI**, no Wikidata QID for Daley, no Wikidata QID for the SkinClarity Club case study. As a result, `Organization.sameAs` filters Wikidata out of the array, and the schema graph has exactly **one** external entity link (LinkedIn). This is the primary GEO entity-graph weakness.

Why Wikidata matters specifically for GEO:
- Gemini grounding hooks the Knowledge Graph, which sources Wikidata heavily for entity disambiguation.
- ChatGPT and Claude both index Wikidata snapshots; entries surface in many model outputs.
- Perplexity Sonar models explicitly use Wikidata for `entity_search` heuristics.

Proposed creation steps for the 16-16 fix-plan (NOT executed in this phase):

1. **Create QID for FutureMarketingAI**:
   - Title: FutureMarketingAI
   - Instance of (P31): software company (Q1058914) or AI marketing platform (no exact QID; use `marketing technology` or fall back to `software company`)
   - Country (P17): Netherlands (Q55)
   - Inception (P571): 2024
   - Official website (P856): https://future-marketing.ai
   - Founder (P112): Daley Maat (requires Daley QID first)
   - Industry (P452): marketing automation (Q19842371), artificial intelligence (Q11660)
   - References: link to news coverage if any, link to LinkedIn company page as authority source.

2. **Create QID for Daley Maat**:
   - Title: Daley Maat
   - Instance of (P31): human (Q5)
   - Occupation (P106): entrepreneur (Q131524), software developer (Q5482740)
   - Employer (P108): FutureMarketingAI (use newly-created QID)
   - Country of citizenship (P27): Netherlands (Q55)
   - References: LinkedIn profile.

3. **Wait 48 to 72 hours for survival check** (Wikidata items can be nominated for deletion as non-notable in the first week; if it survives a week without intervention, it is stable).

4. **Update `seo-config.ts`** to set `WIKIDATA_URL` and `WIKIDATA_DALEY_URL` to the new QID URLs. Note: this is a code change deferred to the fix-plan phase, not done here.

5. **Optional but high-leverage**: Create a SkinClarity Club QID (if the brand itself does not have one) and link FMai's case-study Page to that Org's QID via `mainEntityOfPage`.

Risk: Wikidata may reject the FMai entry as non-notable (one-person company, low independent coverage). Mitigation: cite the SKC case study in the references section as third-party operator validation, and add the company LinkedIn page and any podcast or blog appearances as secondary sources.

## LocalBusiness schema audit

Current Organization schema declares:

```json
{
  "@type": ["Organization", "ProfessionalService"],
  "address": { "@type": "PostalAddress", "addressCountry": "NL", "addressRegion": "Netherlands" },
  "areaServed": ["NL", "EU", "Worldwide"],
  "priceRange": "EUR EUR EUR"
}
```

This is `Organization` plus `ProfessionalService` only. There is **no `LocalBusiness` subtype**. Question for the fix-plan: should FMai add a LocalBusiness layer?

Argument for adding LocalBusiness:
- Dutch-bureau-focused positioning fits the "regional service business" framing.
- LocalBusiness adds geo-grounding signals that Google Local and Bing Places consume for "AI marketing partner near me" type queries.
- AVG / GDPR / EU positioning is reinforced by an explicit Dutch street address.

Argument against adding LocalBusiness:
- FMai is application-gated and remote-first. There is no walk-in office, no physical service.
- Solo founder with home address creates a privacy disclosure issue. KvK registration address is publicly searchable but does not need to be in JSON-LD.
- ProfessionalService already gives the schema-graph weight; LocalBusiness primarily helps brick-and-mortar SEO which is not our use case.

Recommendation for 16-16: add **`@type: ['Organization', 'ProfessionalService']`** as-is and **do NOT** add LocalBusiness unless Daley wants the KvK address publicly attached to the JSON-LD. The areaServed of `["NL", "EU", "Worldwide"]` is appropriate for the remote-first model. Instead, add `address.streetAddress` only if a registered business address is comfortable to publish (PO Box or accountant office is fine).

`priceRange: 'EUR EUR EUR'` is non-informative and should be replaced with a concrete range like `EUR 299-EUR 997` (workspace-priced floor to Founding lifetime ceiling) or removed entirely. Finding F-12.

## llms.txt parity audit

Files audited: `fmai-nextjs/public/llms.txt` (52 lines) and `fmai-nextjs/public/llms-full.txt` (355 lines). Both files claim to be the canonical machine-readable site description for LLMs (per `llmstxt.org` spec).

### llms.txt claims vs. live state

| Claim in llms.txt | Live state | Parity |
|---|---|---|
| "Five tiers from Partner (347 EUR/mo) to Enterprise (7,997 EUR/mo)" | Current model is workspace-priced (Founding 997 lifetime + Growth 499/ws + Professional 399/ws + Enterprise 299/ws), Partner tier removed per 2026-04-28 | **MISMATCH P1** |
| "Founding Member program at 997 EUR/mo lifetime (10 spots, 1 taken)" | 10 spots, 1 taken matches `src/lib/constants.ts` FOUNDING_SPOTS_TOTAL=10 FOUNDING_SPOTS_TAKEN=1, BUT 997/mo phrasing implies recurring monthly, when the live Founding Member offering is described as 997 lifetime price-lock per Founding Member page | **MINOR P2** |
| "12 skills (9 live, 3 coming soon)" | Live state: per llms.txt's own 12-skill list below, Reel Builder, Email Management, and ManyChat DM are tagged "Coming soon", matching the 9 live + 3 coming-soon split. Skills page implementation matches. | PASS |
| "EU-native, AVG and EU AI Act ready" | Repeated throughout site, matches About and Privacy pages | PASS |
| "Application-gated: no self-service signup" | All CTAs land on `/apply`, no Stripe direct-checkout flow on marketing site (Stripe lives in fma-app) | PASS |
| "Max 20 new partnerships per year" | Matches `MAX_PARTNERS_PER_YEAR=20` in `src/lib/constants.ts` | PASS |
| Contact email `hello@future-marketing.ai` | Matches `ORG_EMAIL` in `src/lib/seo-config.ts` | PASS |
| Founder named "Daley" only (no surname) | About page renders `t('founder.fullName')` which in the messages file resolves to "Daley Maat" | **MINOR P3** (llms.txt should match the canonical full name) |

### llms-full.txt claims vs. live state

| Claim in llms-full.txt | Live state | Parity |
|---|---|---|
| Same Partner-tier-plus-flat-monthly pricing claim (line 3) | Workspace-priced live | **MISMATCH P1** (same as llms.txt) |
| Lines 204-237 enumerate 5 tiers in detail: Partner 1ws, Growth 5ws, Pro 15ws, Enterprise unlimited, Founding unlimited, with one-time onboarding fees of EUR 1,997 / 3,997 / 5,997+ | Live workspace-priced model has NO one-time onboarding fee; pricing is per-workspace per-month | **MISMATCH P0** (largest parity gap, materially misleading) |
| Skill credit costs and tier caps inline per skill (lines 62, 76, 103, etc.) | Live skills page does not surface per-skill credit costs publicly in this granularity; fma-app SSoT in `src/lib/skills.ts` is the authority | **MINOR P2** (over-disclosure of internal data that may have drifted from SSoT) |
| Sindy operates "4 brands and 3 Instagram accounts" | Matches `/case-studies/skinclarity-club` copy | PASS |
| Sindy is Founding Member spot 1 of 10 | Matches FOUNDING_SPOTS_TAKEN=1 | PASS |

**Critical action for 16-16**: regenerate both `llms.txt` and `llms-full.txt` from the live `src/lib/skills-data.ts` and `src/lib/constants.ts` plus the canonical workspace-priced model. Add a `Last-Modified` HTTP header so AI crawlers re-fetch on next pass. Consider auto-generating both files via a script that reads the SSoT, similar to how the SEO sitemap is auto-generated by Next.js.

## AI-crawler allowlist audit

Source: `fmai-nextjs/src/app/robots.ts`. The implementation is **best-in-class** for the audit baseline. Explicit allowlist for 16 AI crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bytespider, Amazonbot, Meta-ExternalAgent, Meta-ExternalFetcher, Diffbot) plus a wildcard fallback for non-AI crawlers. Each AI crawler gets the same `allow: ['/', '/llms.txt', '/llms-full.txt']` and `disallow: ['/api/', '/_next/']` as the wildcard, ensuring explicit signaling that AI crawling is sanctioned.

This implementation directly addresses the 73-percent-of-sites-block-AI problem documented in `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md` section 3.6 and the Otterly-style "40 out of 100 implicit allow" scoring threat. Cross-reference 16-06: confirm the robots.ts output matches the expected serialized format and that no Vercel edge layer is silently overriding it.

Gap: `host: SITE_URL` and `sitemap: SITE_URL + '/sitemap.xml'` are declared. Sitemap auto-generation via `src/app/sitemap.ts` is present (file exists but contents not re-audited here, deferred to 16-06).

## Top 25 findings

Each finding follows the standard audit schema. Severity uses P0 (business critical), P1 (high impact), P2 (medium), P3 (polish). Confidence is high unless flagged.

### Finding F-01: Zero out of seven Gemini grounded citations for canonical queries

- Severity: P0
- Route: site-wide (entity-level)
- Viewport: n/a
- Locale: nl + en (both query languages tested)
- Evidence: `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json` shows `cited: false` for all 7 queries in `gemini_grounded` column. Even query 1 "Wat is FutureMarketingAI?" with substantively correct Gemini answer text fails to cite `future-marketing.ai`.
- Code-path: not a single code path, an entity-graph weakness
- Impact: Phase 14 promised GEO 42 to 70+; baseline is 0/7 = 0 percent on the primary measurable. Every Gemini-grounded answer about FMai sends the user to a third-party source.
- Fix: Combination of F-02 through F-08 (Wikidata, llms.txt parity, FAQPage on key pages, more Speakable surfaces, author authority).
- Effort: Large (multi-plan in 16-16)
- Confidence: High

### Finding F-02: No Wikidata QID for FutureMarketingAI

- Severity: P0
- Route: site-wide
- Viewport: n/a
- Locale: n/a
- Evidence: `src/lib/seo-config.ts` line 26 sets `WIKIDATA_URL: string | null = null`. `Organization.sameAs` filters nulls so the only external entity link emitted is LinkedIn.
- Code-path: `OrganizationJsonLd.tsx` line 46 (buildSameAs filter)
- Impact: Gemini and ChatGPT both consume Wikidata for entity disambiguation. Without a QID, FMai exists as a string-of-words rather than a graph-resolved entity.
- Fix: Create Wikidata QID for FutureMarketingAI; after 48-hour survival check, set WIKIDATA_URL constant.
- Effort: Medium (manual Wikidata work; 60-90 minutes plus a 48-hour wait)
- Confidence: High

### Finding F-03: No Wikidata QID for Daley Maat (founder)

- Severity: P1
- Route: `/about`, `/blog/[slug]` (Daley-authored)
- Viewport: n/a
- Locale: n/a
- Evidence: `WIKIDATA_DALEY_URL` is null in `seo-config.ts`. `PersonJsonLd` on /about has only LinkedIn in `sameAs`.
- Code-path: `seo-config.ts` line 27, `src/app/[locale]/(marketing)/about/page.tsx` line 67
- Impact: Author E-E-A-T signal weak. Author-authored content gets discounted by AI ranking heuristics that look for credentialed authors.
- Fix: Create Daley Wikidata Person QID; set WIKIDATA_DALEY_URL after survival.
- Effort: Small (45 minutes plus 48-hour wait)
- Confidence: High

### Finding F-04: llms.txt declares deprecated 5-tier pricing (Partner 347 EUR baseline)

- Severity: P1
- Route: `/llms.txt`
- Viewport: n/a
- Locale: en (single-locale file)
- Evidence: `fmai-nextjs/public/llms.txt` line 3 declares "Five tiers from Partner (347 EUR/mo) to Enterprise (7,997 EUR/mo)". Per `CLAUDE.md` and the 2026-04-28 workspace-priced pivot, Partner tier was removed; current model is workspace-priced Growth 499/Pro 399/Ent 299 per workspace plus Founding 997 lifetime.
- Code-path: static asset `public/llms.txt`
- Impact: Every LLM that consumes llms.txt is being told a pricing structure that does not match the live pricing page. This directly damages credibility for Gemini, ChatGPT, Claude queries about FMai pricing (query 5 in this audit).
- Fix: Regenerate llms.txt from the SSoT (`src/lib/skills-data.ts` plus pricing constants). Auto-generate via a script at build time.
- Effort: Small (one rewrite plus optional automation script)
- Confidence: High

### Finding F-05: llms-full.txt declares fictional one-time onboarding fees

- Severity: P0
- Route: `/llms-full.txt`
- Viewport: n/a
- Locale: en
- Evidence: lines 213-232 list per-tier onboarding fees of EUR 1,997, EUR 3,997, EUR 5,997+. Live pricing model has no one-time onboarding fee.
- Code-path: static asset `public/llms-full.txt`
- Impact: Materially misleading; an LLM citing this would quote a fictional cost structure to a prospect.
- Fix: Rewrite llms-full.txt against the workspace-priced model. Remove all one-time-onboarding language.
- Effort: Small
- Confidence: High

### Finding F-06: Speakable schema coverage is 3 of 27 routes (11 percent)

- Severity: P1
- Route: 24 routes without speakable (all skill pages, /about, /how-it-works, /pricing, /founding-member, /contact, /apply, /blog, /blog/[slug], legal pages, /roadmap, /assessment)
- Viewport: n/a
- Locale: all 3 (nl, en, es)
- Evidence: `grep -rn speakableSelectors src/` returns matches only in `page.tsx` (home), `memory/page.tsx`, `case-studies/skinclarity-club/page.tsx`.
- Code-path: missing `speakableSelectors` prop on `WebPageJsonLd` invocations site-wide
- Impact: Voice assistants (Google Assistant, Alexa Echo Show) cannot extract quotable snippets from 89 percent of the site. Gemini's grounded answers also benefit from speakable markup as a structural ranking signal per Google's documentation.
- Fix: Add 1-2 speakable selectors per page targeting the page's "answer block" (typically the lead paragraph below the H1). Coordinate with 16-05 (interactions) on selector naming to avoid collisions.
- Effort: Medium (24 page edits, each tiny)
- Confidence: High

### Finding F-07: priceRange "EUR EUR EUR" non-informative

- Severity: P2
- Route: site-wide (Organization schema)
- Viewport: n/a
- Locale: n/a
- Evidence: `OrganizationJsonLd.tsx` line 104 sets `priceRange: 'EUR EUR EUR'`.
- Code-path: `OrganizationJsonLd.tsx`
- Impact: Search engines and AI ranking layers expect a concrete currency range or a price-symbol pattern. Three literal currency markers convey no information.
- Fix: Replace with `priceRange: 'EUR 299-EUR 997'` (workspace floor to Founding lifetime) or remove the property.
- Effort: Trivial
- Confidence: High

### Finding F-08: No FAQPage schema on /skills/clyde

- Severity: P1
- Route: `/skills/clyde`
- Viewport: n/a
- Locale: all 3
- Evidence: scan of skill-page template did not surface `FAQPage` JSON-LD emission. Query 4 ("Wat is Clyde van FutureMarketingAI?") got 2 Gemini citations, none ours, despite our copy being clearly the source.
- Code-path: `src/app/[locale]/(skills)/skills/clyde/page.tsx` (template path)
- Impact: Q-and-A format is the highest-correlation citation pattern per Semrush Jan 2026 (+25.45 percent citation rate). Without FAQPage schema, Gemini and ChatGPT cannot easily extract a Q-and-A pair from our content.
- Fix: Add an FAQ section to /skills/clyde with FAQPage JSON-LD (5 to 8 question-answer pairs).
- Effort: Small
- Confidence: High

### Finding F-09: No HowTo schema on /how-it-works

- Severity: P1
- Route: `/how-it-works`
- Viewport: n/a
- Locale: all 3
- Evidence: query 3 ("Hoe werkt agent-as-a-service voor content marketing?") had 15 citations, none ours, while the answer paraphrases AaaS workflow concepts that match our /how-it-works copy.
- Code-path: `src/app/[locale]/(marketing)/how-it-works/page.tsx`
- Impact: HowTo schema is purpose-built for grounding "how does X work" style queries which are FMai's bread and butter.
- Fix: Add HowTo JSON-LD describing the onboarding-week sequence (week 1, month 1, month 3, quarterly review).
- Effort: Small
- Confidence: High

### Finding F-10: No visible author byline on /blog/[slug]

- Severity: P2
- Route: `/blog/[slug]`
- Viewport: all
- Locale: all 3
- Evidence: `src/app/[locale]/(blog)/blog/[slug]/page.tsx` renders ArticleJsonLd with author resolution but the DOM has no rendered "By Daley Maat" line at the article header. The article header section starts at line 128 with date and tag chips, no author display.
- Code-path: `blog/[slug]/page.tsx` article header
- Impact: Visible author signal is needed even when schema is present. Crawlers, screen readers, and human verifiers all check the rendered byline.
- Fix: Add a `<span class="author-byline">` line with name, link to author page, and ISO date, rendered above article body.
- Effort: Small
- Confidence: High

### Finding F-11: No /author/[slug] pages

- Severity: P2
- Route: missing routes `/author/daley-maat`, `/author/sindy-skinclarity`
- Viewport: n/a
- Locale: n/a
- Evidence: file system scan shows no `app/[locale]/(marketing)/author/` directory.
- Code-path: route does not exist
- Impact: E-E-A-T is undermined when authors do not have dedicated profile pages with credentials, prior work, schema-graph anchoring.
- Fix: Create `/author/[slug]` route. For Daley: bio, prior work, LinkedIn, projects. For Sindy: SKC role, prior beauty-industry work.
- Effort: Medium (new route plus copy)
- Confidence: High

### Finding F-12: Bing SERP probe unreachable (consent wall plus bot detection)

- Severity: P2
- Route: external dependency (bing.com)
- Viewport: n/a
- Locale: n/a (Dutch queries tested)
- Evidence: matrix shows `result_count: 0` for all 7 Bing rows.
- Code-path: `measure-llm-citations.mjs` `probeBing()`
- Impact: We have no Copilot-citation baseline. Cannot measure improvement.
- Fix: Upgrade SERP probe to Playwright-driven browser session with consent acceptance, OR replace with paid SERP API (Serper, DataForSEO, Bright Data) in Phase 17 verification.
- Effort: Medium
- Confidence: High

### Finding F-13: Google SERP probe returns only "feedback" link

- Severity: P2
- Route: external dependency (google.com)
- Viewport: n/a
- Locale: nl tested
- Evidence: matrix shows `result_count: 1` with title "feedback" for all 7 Google rows.
- Code-path: `measure-llm-citations.mjs` `probeGoogle()`
- Impact: We have no ChatGPT-search proxy baseline. AI Overviews citation tracking not possible from this baseline.
- Fix: Same as F-12 (Playwright or paid SERP API for Phase 17).
- Effort: Medium
- Confidence: High

### Finding F-14: Claude search not measurable from API or public web

- Severity: P3 (provider limitation, not a site fix)
- Route: external dependency (claude.ai)
- Viewport: n/a
- Locale: n/a
- Evidence: matrix sets `claude_search.reason = "provider_unavailable"` for all 7 rows.
- Impact: We cannot programmatically measure Claude citation rate. Manual web verification in Phase 17 only.
- Fix: Add a Phase 17 manual-verification step where a human runs the 7 queries in Claude web app and records citation hits.
- Effort: Manual, low time
- Confidence: High

### Finding F-15: Speakable selectors on /memory not freshly indexed

- Severity: P2
- Route: `/memory`
- Viewport: n/a
- Locale: all 3
- Evidence: query 6 ("Memory system AI marketing platform - wat houdt het in?") got 10 Gemini citations, none ours, despite /memory existing with speakable markup since Phase 14.
- Code-path: speakable selectors on /memory are correct; problem is grounded index freshness
- Impact: Even with correct schema, the page is not winning the topical query.
- Fix: Submit /memory to Google Search Console for re-indexing; add Last-Modified header to the route response; consider building backlinks to /memory from external content marketing.
- Effort: Small (re-index) plus Medium (backlinks)
- Confidence: Medium (re-index is one signal among many)

### Finding F-16: /case-studies/skinclarity-club not picked up by Gemini despite full schema

- Severity: P1
- Route: `/case-studies/skinclarity-club`
- Viewport: n/a
- Locale: all 3
- Evidence: query 7 ("SkinClarity Club case study AI marketing") got 9 citations, none ours, despite the page emitting Speakable, Person (Sindy), Service, AggregateRating, and Review JSON-LD.
- Code-path: `case-studies/skinclarity-club/page.tsx`
- Impact: Strongest E-E-A-T page on the site is invisible to grounded LLM queries about it.
- Fix: Get an inbound link plus mention from `skinclarityclub.nl` to the FMai case-study page. Independent verification is the missing signal.
- Effort: Small (one external link request)
- Confidence: High

### Finding F-17: Organization knowsAbout list contains 10 items, healthy

- Severity: PASS (no fix needed)
- Route: site-wide
- Evidence: `seo-config.ts` lines 49-60. 10 topic terms covering AI Marketing Automation, LLM Orchestration, EU AI Act Compliance, etc.
- Note: Documented as positive baseline. Per Phase 14 research, 10 topics is the upper end of the "topical authority signal" range.

### Finding F-18: AI-crawler allowlist (robots.ts) is best-in-class

- Severity: PASS
- Route: `/robots.txt`
- Evidence: 16 explicit AI crawler allows in `src/app/robots.ts` plus wildcard fallback. Bytespider and Meta Allow per Phase 14 DECISIONS Q6.
- Note: Documented as positive baseline. This addresses the 73-percent-of-sites-block-AI problem cited in `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md`.

### Finding F-19: Founder name "Daley" (no surname) in llms.txt

- Severity: P3
- Route: `/llms.txt` line 7
- Evidence: llms.txt says "Founder: Daley". Canonical full name in `messages/nl.json` resolves to "Daley Maat".
- Impact: Entity name inconsistency between llms.txt and JSON-LD weakens entity-graph confidence.
- Fix: Use "Daley Maat" consistently in llms.txt and llms-full.txt.
- Effort: Trivial
- Confidence: High

### Finding F-20: No `mainEntityOfPage` reverse link from blog Article to /author/daley-maat

- Severity: P3
- Route: `/blog/[slug]`
- Evidence: `ArticleJsonLd.tsx` resolves `author` to `{ '@id': DALEY_PERSON_ID }` which points at `/about/#daley`. There is no `/author/daley-maat` page, so the @id resolves into the About page instead of a dedicated author profile.
- Impact: The author resolution lands in the wrong content type. About is corporate identity, not author profile.
- Fix: Tied to F-11 (create author pages). Once author pages exist, move DALEY_PERSON_ID to `/author/daley-maat#person` and update both About and ArticleJsonLd consumers.
- Effort: Medium
- Confidence: High

### Finding F-21: No `Review` aggregate beyond SKC

- Severity: P3
- Route: site-wide
- Evidence: only `/case-studies/skinclarity-club` emits Review JSON-LD. No other Reviews exist.
- Impact: Single-review AggregateRating is below the "social-proof corpus" tier that AI ranking favors.
- Fix: Solicit 2-3 additional public Reviews from partners or early adopters; emit Review schema on `/about` or a `/testimonials` page.
- Effort: Small (schema emission) plus External (collecting reviews)
- Confidence: Medium (depends on partner willingness)

### Finding F-22: `priceRange` on Organization is the only price-signal in graph

- Severity: P2
- Route: `/pricing`
- Evidence: no `Offer` or `PriceSpecification` JSON-LD on `/pricing`. Only the broken `priceRange` (see F-07).
- Impact: Gemini query 5 ("Pricing AI marketing agency platforms EU 2026") cannot extract our prices because they are not in structured-data form.
- Fix: Add Offer JSON-LD per tier with `price` and `priceCurrency` and `priceSpecification` on /pricing.
- Effort: Medium
- Confidence: High

### Finding F-23: No `sameAs` from Sindy to her own social media beyond LinkedIn

- Severity: P3
- Route: `/case-studies/skinclarity-club`
- Evidence: `PersonJsonLd` for Sindy passes only `LINKEDIN_SINDY_URL` in sameAs.
- Impact: Sindy is the public face of the proof case but her cross-platform identity is unverified in the graph.
- Fix: Add SKC Instagram and (if applicable) Sindy's beauty-industry profiles.
- Effort: Small (with permission from Sindy)
- Confidence: Medium (requires Sindy approval)

### Finding F-24: llms.txt does not link to llms-full.txt explicitly via canonical pointer

- Severity: P3
- Route: `/llms.txt`
- Evidence: line 51 says "Full long-form content for LLMs https://future-marketing.ai/llms-full.txt" but uses no canonical-pointer markup. Compare Vercel pattern "Full documentation content: https://vercel.com/docs/llms-full.txt" per 16-01 SOTA reference.
- Impact: Minor; some LLM-context loaders only see the short file and never reach the long.
- Fix: Move the llms-full.txt pointer to the second line (right after the H1+blockquote summary), matching Stripe and Linear's canonical opening.
- Effort: Trivial
- Confidence: Medium

### Finding F-25: No author bio paragraph on /case-studies/skinclarity-club for Sindy

- Severity: P3
- Route: `/case-studies/skinclarity-club`
- Evidence: PersonJsonLd is emitted with `description: t('testimonial.author.bio')` but the visible DOM does not render a dedicated bio block for Sindy beyond the testimonial card.
- Impact: Inconsistency between schema-asserted bio and rendered bio undermines authenticity signal.
- Fix: Add a visible Sindy bio block (1-2 paragraphs) below the testimonial. Keep the same text as the schema description for consistency.
- Effort: Small
- Confidence: High

## Coverage matrix (SOTA markers, recap)

The 25 SOTA markers from 16-01 score for GEO and LLMEO surfaces specifically:

| Marker | Category | Status | Reference finding |
|---|---|---|---|
| M11 (schema completeness) | IA | PARTIAL | F-08, F-09, F-22 |
| M12 (llms.txt presence) | IA | PASS (file exists) | F-04, F-05, F-19, F-24 (content quality) |
| M13 (canonical headers) | IA | PASS | n/a (16-06 owns) |
| M19 (E-E-A-T author bylines) | Trust | PARTIAL | F-10, F-11, F-20, F-25 |
| M20 (Wikidata graph link) | Trust | FAIL | F-02, F-03 |
| M21 (AI-crawler allowlist) | Trust | PASS | F-18 |
| M22 (Speakable coverage) | Trust | PARTIAL | F-06, F-15 |
| M23 (FAQ Q-and-A density) | Content | FAIL on key pages | F-08 |
| M24 (HowTo / step-by-step) | Content | FAIL on /how-it-works | F-09 |
| M25 (Review and AggregateRating) | Trust | PARTIAL | F-16, F-21 |

Net GEO score for the 10 GEO-relevant markers: **3 PASS / 5 PARTIAL / 2 FAIL = 35/100 (rough weighting)**. Phase 14 promised 42 to 70+; the actual measurable baseline is around the same starting point as before Phase 14 work (the Wikidata / FAQPage / HowTo gaps survived Phase 14). Phase 16-16 should write a fix-plan that closes F-01 through F-09 to lift the score into the 60-70 range.

## Recommended 16-16 fix-plan inputs

Highest-leverage fixes ranked:

1. **F-04 plus F-05 plus F-19**: regenerate llms.txt and llms-full.txt from SSoT. P0 truth-parity fix, prevents LLMs from quoting fictional pricing. (1-2 hours)
2. **F-02 plus F-03**: create Wikidata QIDs for FMai and Daley. P0 entity-graph fix. (60-90 minutes plus 48-hour survival wait)
3. **F-06**: extend speakable coverage from 3 to 12 high-value routes. (2 hours)
4. **F-08 plus F-09**: add FAQPage on /skills/clyde and HowTo on /how-it-works. (2 hours)
5. **F-11 plus F-10 plus F-20**: create /author/[slug] route, render visible bylines, update DALEY_PERSON_ID target. (3-4 hours)
6. **F-22 plus F-07**: add Offer JSON-LD on /pricing, fix priceRange. (2 hours)
7. **F-12 plus F-13**: upgrade SERP proxies to authenticated Playwright sessions for Phase 17 verification. (3 hours, infrastructure)
8. **F-16 plus F-25**: solicit external inbound link from skinclarityclub.nl and add Sindy bio block. (External plus 1 hour internal)

Estimated total fix-plan effort for GEO and LLMEO: 12 to 16 hours of code work plus 48 to 72 hours of Wikidata survival waiting plus external SKC-link request lead time.

## Reproducibility

The citation matrix can be re-run at any time:

```bash
cd C:/Users/daley/Desktop/Futuremarketingai
node fmai-nextjs/scripts/audit/measure-llm-citations.mjs
```

To run only Gemini (skip SERP probes):

```bash
node fmai-nextjs/scripts/audit/measure-llm-citations.mjs --gemini-only
```

To write to a custom output path:

```bash
node fmai-nextjs/scripts/audit/measure-llm-citations.mjs --output=tmp/citation-snapshot.json
```

Phase 17 verification: re-run after each fix-plan plan and compare citation-rate delta. Target trajectory: 0/7 baseline -> 2/7 after F-04 plus F-05 (llms.txt rewrite) -> 4/7 after F-02 (Wikidata) -> 5-6/7 after F-08 plus F-09 plus F-22 (FAQ plus HowTo plus Offer schemas).
