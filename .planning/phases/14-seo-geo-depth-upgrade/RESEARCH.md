---
phase: 14-seo-geo-depth-upgrade
title: Research — SEO + GEO Depth Upgrade
created: 2026-04-24
---

# Research Questions + Sources

This file captures the research inputs for Phase 14. Before starting 14-01, answer every open question below. Sources must be cited inline in the PLANs.

---

## 1. Wikidata entity creation for a small business in 2026

### Key question

Does FutureMarketingAI clear Wikidata notability? If yes, what is the minimum viable entry?

### Notability rules (2026)

Wikidata policy: https://www.wikidata.org/wiki/Wikidata:Notability

An entity is notable if ANY of these are true:

1. It contains at least one valid sitelink (Wikipedia, Wikivoyage, etc.)
2. It refers to an instance of a clearly identifiable conceptual or material entity. The entity must be notable in the sense that it can be described using serious and publicly available references.
3. It fulfils a structural need — e.g., it is needed to make statements about items meeting the criteria above.

For a small business (bureau-sized agency in NL):

- Rule 2 is our path. "Publicly available references" means any verifiable URL (LinkedIn page, CoC/KvK registration, website). The test is weaker than Wikipedia's — Wikidata accepts businesses with a LinkedIn + website.
- **Risk**: items without sitelinks + without strong references can be merged or deleted by volunteer reviewers. Mitigation: include 3+ references at creation (website, LinkedIn, KvK).

### Minimum viable item draft

Item label: `FutureMarketingAI`
Description (en): `Dutch AI marketing automation agency and platform building Clyde, an AI Marketing Employee for marketing agencies`
Description (nl): `Nederlands AI-marketing-automatiseringsbureau en platform dat Clyde bouwt, een AI Marketing Medewerker voor marketingbureaus`

Statements (P-claims) to add:

| Property | Claim | Reference |
|---|---|---|
| P31 (instance of) | Q4830453 (business) OR Q786820 (company) | website |
| P17 (country) | Q55 (Netherlands) | KvK registration (pending) |
| P571 (inception) | 2024 or 2025 (verify with Daley; code says 2025, memory says 2026 for product) | website about page |
| P112 (founder) | Daley [new Person item needed] | about page |
| P452 (industry) | Q11030 (marketing) + Q11660 (AI) | website |
| P856 (official website) | https://future-marketing.ai | n/a (self-ref) |
| P2002 (Twitter username) | FutureMarketAI | Twitter profile |
| P4264 (LinkedIn company ID) | `futuremarketingai` | LinkedIn URL |
| P1278 (Legal Entity Identifier) | LEI from KvK (if registered) | KvK |

### Action for 14-01

1. Confirm with Daley: agency founded 2024 or 2025? Product (Clyde) launched 2026? Update foundingDate in OrganizationJsonLd to the verified agency year.
2. Create Wikidata item at https://www.wikidata.org/wiki/Special:NewItem — after login.
3. Record the assigned QID (format `Q12345678`) in `src/lib/seo-config.ts` as `WIKIDATA_ID = 'Q12345678'` and export `WIKIDATA_URL = \`https://www.wikidata.org/wiki/${WIKIDATA_ID}\``.
4. Add the URL to Organization `sameAs`.
5. Create a Person item for Daley in parallel (same process, P31 = Q5 "human", P106 "occupation" = entrepreneur/founder, P108 "employer" = the new FMai QID, P69 or P512 if applicable).

### Sources

- https://www.wikidata.org/wiki/Wikidata:Notability
- https://www.wikidata.org/wiki/Help:Items
- https://www.wikidata.org/wiki/Help:Statements
- https://www.wikidata.org/wiki/Wikidata:Main_Page
- Property helper: https://www.wikidata.org/wiki/Special:Search?search=business&go=Go&ns120=1 (for finding property IDs)

---

## 2. schema-dts typings for Speakable (pending schema.org class)

### Question

`SpeakableSpecification` is listed as pending in schema.org (https://schema.org/SpeakableSpecification) meaning it may not have a clean TypeScript definition in `schema-dts`.

### Verification

Check the installed version:

```bash
cd fmai-nextjs && cat node_modules/schema-dts/package.json | grep version
```

Current `schema-dts` version (per package.json in repo): needs grep. The `schema-dts` package auto-generates types from schema.org releases, so any class ("pending" or otherwise) that exists in the JSON-LD graph has a type — it just might be shallowly typed.

### Fallback

If TypeScript complains, use the `@ts-expect-error` with a named reason OR cast to a compatible shape:

```typescript
import type { WithContext, WebPage } from 'schema-dts'

interface WebPageWithSpeakable extends WithContext<WebPage> {
  speakable?: {
    '@type': 'SpeakableSpecification'
    cssSelector?: string[]
    xpath?: string[]
  }
}
```

Note: per CLAUDE.md global rules, `@ts-ignore` is forbidden. `@ts-expect-error` with reason is acceptable.

### Sources

- https://schema.org/SpeakableSpecification
- https://developers.google.com/search/docs/appearance/structured-data/speakable
- schema-dts repo: https://github.com/google/schema-dts

---

## 3. Google 2026 schema-content-match policy strictness

### Question

How strictly does Google enforce the "schema must match primary content" rule? Is OrganizationJsonLd listing services that are no longer sold (stale hasOfferCatalog) a manual-action risk?

### Findings from research doc sec 1

Per `docs/research-schema-markup-structured-data-seo-geo.md` section 1:

> "Schema must match the primary content purpose of the page — supplementary schema padding is dead"
> "Editorial Review schema now triggers manual action risk"

And from audit sec 4.3:

> "Google flags schema-vs-content mismatches as spam per research doc sec 2"

### Verdict

- Listing a Service that is not on the site = HIGH risk (content-parity violation)
- Fix: hasOfferCatalog must list the 12 current skills (or the 5 tiers as Offers) — not the v9 "AI Chatbots / Marketing Machine" bundles.
- Safest pattern: list the 5 tiers as Offers with `itemOffered: { @type: Service, name: <tier-name>, description: <tier-scope> }`, OR list the 12 skills as Services. Pick ONE pattern.

### Decision for 14-01

Use the **12 skills as Services** pattern. Reason: each skill also gets its own ServiceJsonLd on its page (14-02). The Organization catalog references them by `@id` for graph coherence. Tiers are commercial bundles, services are ontological.

### Sources

- https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies

---

## 4. /vs/ comparison pages design pattern

### Question

Should Phase 14 ship skeleton /vs/ pages or is it pure future work?

### Decision

**Defer to a separate phase.** Rationale:

- Audit 05 (GEO) lists 7 /vs/ pages as P0-P3 work.
- Each page is 8 hours of research + build.
- Phase 14 is capped at 10 hours total for depth-upgrade mechanics.
- Shipping empty skeletons hurts GEO score (thin content = negative signal).

Reference this decision in the future phase (Phase 16 or 17).

---

## 5. AI-crawler 2026 list (for 14-04 robots.ts)

### Authoritative list

| Bot | User-Agent | Purpose | Policy recommendation | Source |
|---|---|---|---|---|
| GPTBot | `GPTBot` | OpenAI training | Allow | https://platform.openai.com/docs/gptbot |
| ChatGPT-User | `ChatGPT-User` | Real-time ChatGPT browse | Allow | https://platform.openai.com/docs/plugins/introduction |
| OAI-SearchBot | `OAI-SearchBot` | ChatGPT Search results | Allow | https://platform.openai.com/docs/bots |
| ClaudeBot | `ClaudeBot` | Anthropic training | Allow | https://support.anthropic.com/en/articles/8896518 |
| anthropic-ai | `anthropic-ai` | Anthropic legacy UA | Allow | https://support.anthropic.com |
| Claude-Web | `Claude-Web` | Claude web browse | Allow | https://support.anthropic.com |
| PerplexityBot | `PerplexityBot` | Perplexity indexing | Allow | https://docs.perplexity.ai/guides/bots |
| Perplexity-User | `Perplexity-User` | Perplexity real-time browse | Allow | https://docs.perplexity.ai/guides/bots |
| Google-Extended | `Google-Extended` | Gemini training + AI Overviews | Allow | https://blog.google/technology/ai/an-update-on-web-publisher-controls/ |
| Applebot-Extended | `Applebot-Extended` | Apple Intelligence training | Allow | https://support.apple.com/en-us/HT204683 |
| CCBot | `CCBot` | Common Crawl (powers GPT + Claude training data) | Allow | https://commoncrawl.org/ccbot |
| Bytespider | `Bytespider` | ByteDance / Doubao | Policy decision below | https://bytedance.com/en/ |
| Amazonbot | `Amazonbot` | Alexa / Rufus | Allow | https://developer.amazon.com/amazonbot |
| Meta-ExternalAgent | `Meta-ExternalAgent` | Meta AI training (new 2024) | Policy decision below | https://developers.facebook.com/docs/sharing/webmasters/crawler |
| Meta-ExternalFetcher | `Meta-ExternalFetcher` | Meta AI real-time | Policy decision | https://developers.facebook.com/docs/sharing/webmasters/crawler |
| Diffbot | `Diffbot` | Knowledge Graph scraping | Allow | https://www.diffbot.com/support/crawler |

### Policy decisions for FMai (confirm in 14-04)

- **Bytespider**: Allow. Reason: TikTok/Doubao answer engines are a small but growing share of SEA + EU traffic. Allowing = zero cost, zero risk.
- **Meta-ExternalAgent + Meta-ExternalFetcher**: Allow. Reason: Meta's AI is increasingly injected into WhatsApp + Instagram. B2B content in WhatsApp Business is realistic.

Default policy across the board: **Allow everything that might cite us.** GEO is the strategy, not copyright defense.

### Sources

- https://platform.openai.com/docs/bots
- https://docs.perplexity.ai/guides/bots
- https://blog.google/technology/ai/an-update-on-web-publisher-controls/
- https://support.anthropic.com/en/articles/8896518
- https://commoncrawl.org/ccbot
- https://developers.facebook.com/docs/sharing/webmasters/crawler
- https://darkvisitors.com/agents — community catalog of AI crawlers

---

## 6. @id stable URI pattern for cross-schema linking

### Pattern (per research schema doc sec 1 Tier 1)

Each schema entity gets a stable `@id` with a fragment identifier:

| Entity | `@id` pattern | Example |
|---|---|---|
| Organization | `${SITE_URL}/#org` | `https://future-marketing.ai/#org` |
| WebSite | `${SITE_URL}/#website` | `https://future-marketing.ai/#website` |
| Person (founder Daley) | `${SITE_URL}/about/#daley` | `https://future-marketing.ai/about/#daley` |
| Person (operator Sindy) | `${SITE_URL}/case-studies/skinclarity-club/#sindy` | `https://future-marketing.ai/case-studies/skinclarity-club/#sindy` |
| WebPage per page | `${SITE_URL}/${locale}${path}#webpage` | `https://future-marketing.ai/nl/memory#webpage` |
| BreadcrumbList per page | `${SITE_URL}/${locale}${path}#breadcrumb` | `https://future-marketing.ai/nl/memory#breadcrumb` |
| Service per skill | `${SITE_URL}/skills/${slug}/#service` | `https://future-marketing.ai/skills/social-media/#service` |

### Cross-reference rules

- Organization.founder → Person(Daley) via `@id` (not inline)
- Article.author → Person(Daley) via `@id`
- Article.publisher → Organization via `@id`
- WebPage.isPartOf → WebSite via `@id`
- WebPage.breadcrumb → BreadcrumbList via `@id`
- Service.provider → Organization via `@id`
- Offer.seller → Organization via `@id`

### Implementation constant

Add to `src/lib/seo-config.ts`:

```typescript
export const ORG_ID = `${SITE_URL}/#org`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const DALEY_PERSON_ID = `${SITE_URL}/about/#daley`
export const SINDY_PERSON_ID = `${SITE_URL}/case-studies/skinclarity-club/#sindy`
export const pageWebPageId = (locale: string, path: string) =>
  `${SITE_URL}/${locale}${path === '/' ? '' : path}#webpage`
export const skillServiceId = (slug: string) => `${SITE_URL}/skills/${slug}/#service`
```

### Sources

- https://schema.org/docs/datamodel.html (@id / @type semantics)
- Yoast @graph explanation: https://developer.yoast.com/customization/yoast-seo/schema-graph-piece-conditional-display/
- Research doc: `docs/research-schema-markup-structured-data-seo-geo.md` sec 1 Tier 1

---

## 7. FAQ schema per skill page — how many, what phrasing

### Findings

From audit 05 GEO sec "Top 15 GEO Fixes #4":

> "Add FAQ blocks (6 Qs each) + FaqJsonLd to all 12 skill pages + /memory + /about"
> "+25.45% citation correlation"

From research doc sec 3.1:

> Q&A format +25.45% — structure content as question-answer pairs.

### Best practice (2026)

1. **3-6 Qs per page**. Fewer = weak signal; more = diluted + risks being flagged as FAQ padding (Google March 2026 rule: schema must match primary content).
2. **Question phrasing**: lowercase conversational form. LLMs index natural-language questions better than formal ones.
   - Good: "Werkt Clyde ook voor Engelstalige merken?"
   - Weak: "Multilingual Support"
3. **Answer length**: 40-80 words. Self-contained. No "See X for more" pointers.
4. **First-person avoid**: "does Clyde" / "werkt Clyde" — third-person makes answers reusable across query contexts.
5. **Include 1 pricing Q per skill**: "Is [skill] beschikbaar op tier X?" maps directly to Perplexity / ChatGPT buying queries.

### Per-skill FAQ template (choose 4-5 per page)

| Q pattern | Example (social-media) |
|---|---|
| "What does [skill] do?" | "Wat doet de Social Media Manager vaardigheid?" |
| "Which integrations does [skill] support?" | "Welke platforms ondersteunt Social Media Manager? (Instagram, LinkedIn, TikTok, Meta Business)" |
| "How long does setup take?" | "Hoelang duurt de onboarding van Social Media Manager?" |
| "Is [skill] included in my tier?" | "Zit Social Media Manager bij Partner of pas vanaf Growth?" |
| "Does [skill] work for non-Dutch brands?" | "Werkt Social Media Manager ook voor Engelstalige merken?" |
| "What's the monthly cap?" | "Hoeveel posts kan Social Media Manager per maand maken per tier?" |
| "Can I see examples?" | "Kan ik voorbeelden zien van echt werk van deze vaardigheid?" |
| "How does this differ from [competitor]?" | "Hoe verschilt dit van Buffer of Later?" |

Pick 5 per skill. Variate the competitor Q per skill (Blog Factory vs Jasper, Voice Agent vs Vapi, etc.).

### i18n keys pattern

```
messages/nl.json:
skills-social-media.faq.title: "Veelgestelde vragen"
skills-social-media.faq.items.q1.question: "..."
skills-social-media.faq.items.q1.answer: "..."
... q5
```

Total keys added: 12 skills × 5 Qs × (question + answer) × 3 locales = 360 translation keys.

### Sources

- audit 05 sec "FAQ Coverage" + sec "Top 15 GEO Fixes #4"
- research doc sec 3.1 (Semrush study Jan 2026)
- https://developers.google.com/search/docs/appearance/structured-data/faqpage

---

## 8. Meta description trimming guidance

### Google truncation rules (2026)

- Desktop SERP: shows ~155-160 characters before ellipsis. Mobile: ~120.
- Truncation point varies by font metrics (not raw character count) — safe target is **≤ 155 chars** Dutch (diacritics don't cost extra pixels in modern sans-serifs).
- No pure character count limit from Google's docs: https://developers.google.com/search/docs/appearance/snippet — but the recommended sweet spot is 150-160.

### Current offenders (per audit 04 sec "Description length health")

| Page | Key | Current | Target |
|---|---|---|---|
| Home | `home.meta.description` | 228 | ≤155 |
| Pricing | `pricing.meta.description` | 172 | ≤155 |
| Apply | `apply.meta.description` | 200 | ≤155 |
| Founding-member | `founding-member.meta.description` | 205 | ≤155 |
| How-it-works | `how-it-works.meta.description` | 180 | ≤155 |

Trim all 3 locales (NL, EN, ES) together. Keep keyword density + CTA cue in the first 100 chars.

### Template (copy pattern)

`{First sentence with primary keyword + Clyde, ≤90 chars}. {Second sentence with differentiator or scarcity, ≤60 chars}.`

Example (home, NL):

- Before (228): "Clyde is de AI Marketing Medewerker van jouw bureau. Hij schrijft content, belt leads en onthoudt elk merk voor altijd. Gebouwd door FutureMarketingAI. Max 20 bureaus per jaar."
- After (152): "Clyde is de AI Marketing Medewerker voor marketingbureaus. Schrijft content, belt leads, onthoudt elk merk. Max 20 partners per jaar."

### Sources

- https://developers.google.com/search/docs/appearance/snippet
- Moz SERP snippet study: https://moz.com/learn/seo/meta-description

---

## 9. Rich Results + Schema validator URLs (for `<verify>`)

Use in every plan's `<verify>` block:

- Google Rich Results test: https://search.google.com/test/rich-results
- Schema.org validator: https://validator.schema.org/
- Linkedin Post Inspector (OG tags): https://www.linkedin.com/post-inspector/
- Twitter Card validator (deprecated but still functional via meta preview tools): https://cards-dev.twitter.com/validator OR https://opengraph.dev
- Facebook Sharing debugger: https://developers.facebook.com/tools/debug/

### Automation option (post-phase)

Add a CI step: `npm run test:schema` that Playwright-fetches every route, extracts `<script type="application/ld+json">` blocks, and posts to https://validator.schema.org/ via its API (or uses the `structured-data-testing-tool` npm package).

Defer to Phase 16+ (CI hardening phase).

---

## 10. Perplexity probe (for post-deploy verification)

### Probe prompts (run via MCP perplexity_search)

1. "Wat is Clyde van FutureMarketingAI"
2. "What is an AI Marketing Medewerker"
3. "Who is Daley Maat founder FutureMarketingAI"
4. "FutureMarketingAI pricing tiers"
5. "SkinClarity Club AI content automation case study"

### Expected outcomes (post-phase)

- At least 1 of 5 prompts returns a `citations[]` array containing `future-marketing.ai`
- The Organization entity is correctly resolved (name + founder + description)
- No citation of v9 pricing (€1.497 Starter) — indicates llms.txt regeneration from Phase 10 landed

### Baseline (capture before phase start)

Run the same 5 prompts before starting 14-01 and log results in a new file `.planning/phases/14-seo-geo-depth-upgrade/BASELINE-perplexity-probe-2026-04-24.md`. Re-run 14 days after phase deploy. Compare citation frequency.

### Sources

- https://docs.perplexity.ai/api-reference/chat-completions
- audit 05 sec "If I could only fix 3 things this week"

---

## Open questions for Daley (answer before 14-01 starts)

1. **Agency founding year**: code says `foundingDate: '2025'`, memory says "agency 2024, product 2026". Which one is truthful? [Needed for Organization schema + Wikidata P571]
2. **KvK registration**: is FMai registered at the Dutch KvK yet? If yes, the KvK profile URL goes in `sameAs`. If no, skip and revisit post-registration.
3. **Twitter/X handle**: is `@FutureMarketAI` claimed? If no, claim it before 14-01 (free) so we can add to `sameAs`.
4. **Crunchbase profile**: create one? It takes 30 min, free, and gives us another high-authority `sameAs` entry.
5. **YouTube channel**: exists? If yes, URL. If no, skip.
6. **Wikidata**: OK to create the FMai + Daley items under Daley's personal Wikidata account? Or create new shared agency account?
7. **Bytespider + Meta bots**: allow (recommended) or disallow? Defaults to Allow per section 5 above unless objection.
8. **x-default locale**: stays `/en` (current) or switches to `/nl` (authoritative content language)? Defaults to `/en` — audit flagged it but didn't force a change.

Default decisions (if Daley doesn't override within 24h):
- foundingDate = `2024-01-01` (agency start)
- KvK: skip until registered
- Twitter: claim `@FutureMarketAI`, add
- Crunchbase: create + add
- YouTube: skip
- Wikidata: personal account
- Bytespider + Meta: allow
- x-default: stays `/en`
