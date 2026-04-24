---
phase: 14-seo-geo-depth-upgrade
title: SEO + GEO Depth Upgrade
status: planned
created: 2026-04-24
owner: Daley
depends_on:
  - 10-production-integrity-domain-ssot
related_audits:
  - docs/audits/2026-04-24-full-audit/04-seo-technical.md
  - docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md
  - docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md (theme T-7, P1 items 1, 8, 11, 12)
related_research:
  - docs/research/2026-03-28-geo-llmeo-ai-citation-research.md
  - docs/research-schema-markup-structured-data-seo-geo.md
waves:
  - wave: 1
    plans: [14-01, 14-03, 14-04]
    note: 14-01 depends on Phase 10 domain SSoT. 14-03 and 14-04 independent of each other but also require Phase 10 for canonical URLs.
  - wave: 2
    plans: [14-02]
    note: 14-02 depends on 14-01 Organization @id + Person schema patterns
estimated_effort: 10 hours total (4 + 4 + 1 + 1)
---

# Phase 14 — SEO + GEO Depth Upgrade

## One-liner

Lift GEO maturity from 42/100 to 70+ and unlock SERP rich-result coverage by completing the entity graph (Organization sameAs, Person schema for Daley + Sindy), wiring up dead schema components (Service on 12 skill pages), extending FAQ + Speakable coverage, trimming meta descriptions to SERP limits, and declaring an explicit AI-crawler allowlist in robots.ts.

## Objective

After Phase 14:

1. LLMs (ChatGPT, Claude, Perplexity, Google AI Overviews, Bing Copilot) can correctly cite FutureMarketingAI:
   - Entity resolution via Wikidata + full sameAs graph
   - Founder-operator attribution via Person(Daley) with worksFor → Organization
   - Case study operator attribution via Person(Sindy) on SKC page
   - Canonical service catalog via 12 wired ServiceJsonLd emitters
2. SERP rich results are enabled at maximum safe coverage:
   - FAQ rich results on founding-member + 12 skill pages
   - Service rich result on 12 skill pages
   - Article rich result on blog posts (image, publisher.logo, mainEntityOfPage complete)
3. Meta-description truncation in Google SERPs is eliminated (home 228 -> 160, pricing 172 -> 160, apply 200 -> 160, founding 205 -> 160, how-it-works 180 -> 160)
4. AI-crawler allowlist explicitly declared for GPTBot, ChatGPT-User, OAI-SearchBot, Google-Extended, Applebot-Extended, ClaudeBot, anthropic-ai, PerplexityBot, Perplexity-User, CCBot (+ policy decision on Bytespider, Amazonbot)
5. Legal pages (privacy, terms, cookies) are routed through the shared generatePageMetadata helper so they emit OG/Twitter/hreflang
6. llms.txt regeneration (handled in Phase 10) is verified present and indexed post-migration

Success measures:

- GEO score (per audit 05 methodology): 42 -> 70+
- Rich Results test passes for: Organization, Person, Service (12), FAQ (13), Article (updated), BreadcrumbList, HowTo, WebPage, WebSite
- Perplexity probe (test query "wat is Clyde van FutureMarketingAI") returns FMai domain in citations within 14 days post-deploy
- All meta descriptions ≤160 chars in all 3 locales (NL, EN, ES)
- Schema.org validator passes every emitted JSON-LD block with zero warnings

## Hard dependency on Phase 10

Phase 10 (production-integrity-domain-ssot) MUST land first. Reason:

- Every schema block emits URLs built from `SITE_URL` in `src/lib/seo-config.ts`. Phase 10 decides whether production is `futuremarketingai.com` (current code) or `future-marketing.ai` (current docs). Phase 14 adds more schemas on top of that foundation — running 14 before 10 means re-generating every `@id`, every Wikidata `sameAs` URL, every sitemap entry, and every canonical. Wasted work + risk of Knowledge Graph pollution.
- llms.txt + llms-full.txt are regenerated in Phase 10 (content correctness). Phase 14 only verifies they are reachable and indexed after the domain migration.

If Phase 10 is not yet merged when Phase 14 begins: STOP, complete Phase 10 first. Do not start 14-01 without SITE_URL being stable.

## Scope in / scope out

In scope (Phase 14):

- Organization `sameAs` expansion (Wikidata entity creation, Crunchbase profile, Twitter handle, LinkedIn company + personal, KvK if applicable, YouTube if exists)
- Organization `@id` fragment identifier + `hasOfferCatalog` v10 rewrite
- Organization `knowsAbout` expansion (4 topics -> 10 topics per research sec 2)
- Organization `foundingDate` correction (2025 -> confirmed year per research)
- New `PersonJsonLd` component + emission on `/about`, `/case-studies/skinclarity-club`, blog posts, and as `founder` on Organization
- New `PersonJsonLd` entry for Sindy on `/case-studies/skinclarity-club` (as operator)
- ServiceJsonLd wiring in `SkillPageTemplate.tsx` + per-skill props (name, description, serviceType, offers)
- FaqJsonLd on `/founding-member` (extract existing visible FAQ -> schema)
- FaqJsonLd on all 12 skill pages (3-5 Qs each, content + schema)
- Speakable schema added to home hero, `/memory` key paragraphs, SKC case highlight
- `ArticleJsonLd` completion (image, publisher.logo, mainEntityOfPage, dateModified normalization, author @id reference)
- Meta description trims (home, pricing, apply, founding-member, how-it-works) across NL + EN + ES
- Legal pages (privacy, terms, cookies) routed through `generatePageMetadata`
- Robots.ts explicit AI-crawler rules + sitemap pointer verification post-Phase-10
- `BreadcrumbList` depth spot-check (home has only 1 item — verify or raise)

Out of scope (deferred to Phase 15+ per MASTER-ACTION-PLAN):

- Full SKC case study content rewrite with concrete metrics (Phase 15 interview + copy)
- `/vs/` comparison pages (P2 — separate phase)
- Original research report ("State of AI Marketing NL 2026")
- Glossary / DefinedTerm page
- `/skills` hub index page with ItemList of 12 skills
- `@graph` consolidation refactor (P2 — single-JSON-LD-per-page rewrite)
- RSS / Atom feed
- New blog posts for topical authority

Already completed in Phase 10:

- SITE_URL production domain SSoT decision
- llms.txt + llms-full.txt regeneration for v10 pricing + Clyde framing
- `public/og-image.png` creation (was missing — every OG/Twitter card was broken)
- seo-config.ts ENTITY_DESCRIPTION update

## Plan index

| Plan | Wave | Scope | Effort | Depends on |
|---|---|---|---|---|
| [14-01-PLAN.md](./14-01-PLAN.md) | 1 | Organization sameAs expansion + Wikidata entity + PersonJsonLd (Daley + Sindy) + hasOfferCatalog v10 + knowsAbout expansion | 4h | Phase 10 |
| [14-02-PLAN.md](./14-02-PLAN.md) | 2 | ServiceJsonLd wiring (12 skill pages) + FaqJsonLd on founding-member + 12 skill-page FAQ schemas + Speakable on home/memory/SKC | 4h | 14-01 (Organization @id stable + Person @id stable) |
| [14-03-PLAN.md](./14-03-PLAN.md) | 1 | Meta description trims (5 pages × 3 locales) + legal page metadata via shared helper + ArticleJsonLd completion | 1h | Phase 10 (messages files in sync) |
| [14-04-PLAN.md](./14-04-PLAN.md) | 1 | Robots.ts explicit AI-crawler allowlist + sitemap canonical verification + host line | 1h | Phase 10 (SITE_URL stable) |

Wave-1 plans (14-01, 14-03, 14-04) can execute in parallel after Phase 10 merges.
Wave-2 (14-02) executes after 14-01 to reuse the stable Organization + Person `@id` references.

## Deliverables

- `src/lib/seo-config.ts` — add `ORG_ID`, `WIKIDATA_URL`, `DALEY_PERSON_ID`, `SINDY_PERSON_ID`, `TWITTER_URL`, `CRUNCHBASE_URL`, `KVK_URL`, `YOUTUBE_URL` constants (env vars where dynamic)
- `src/components/seo/PersonJsonLd.tsx` — new component
- `src/components/seo/OrganizationJsonLd.tsx` — rewritten (sameAs, @id, hasOfferCatalog v10, knowsAbout, foundingDate)
- `src/components/seo/ServiceJsonLd.tsx` — unchanged but now actually imported
- `src/components/seo/ArticleJsonLd.tsx` — add image + publisher.logo + mainEntityOfPage + @id
- `src/components/seo/WebPageJsonLd.tsx` — extend interface for optional `speakable: { cssSelector: string[] }`
- `src/components/skills/SkillPageTemplate.tsx` — add `<ServiceJsonLd>` + `<FaqJsonLd>` props wired via `faqKeys: string[]`
- `src/app/[locale]/(marketing)/founding-member/page.tsx` — add `<FaqJsonLd>`
- `src/app/[locale]/(marketing)/about/page.tsx` — emit `<PersonJsonLd>` for Daley
- `src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx` — emit `<PersonJsonLd>` for Sindy
- `src/app/[locale]/(legal)/legal/privacy/page.tsx` + terms + cookies — switch to `generatePageMetadata`
- `messages/nl.json` + `en.json` + `es.json` — meta description trims (5 pages) + 12 × FAQ blocks (6 Qs per skill × 3 locales = 216 Q/A strings)
- `src/app/robots.ts` — explicit AI-crawler `Allow` rules
- `src/app/sitemap.ts` — add legal subpaths + raise /contact priority
- Obsidian vault entry (via `obsidian-capture` skill): `Agency/Website/seo-geo/2026-04-24-phase-14-schema-depth-decisions.md` — log decisions for Wikidata QID, foundingDate, x-default policy, Bytespider policy

## Verification gates

Every plan ends with a `<verify>` block running at least:

1. `npm run build` — Next.js build passes
2. Google Rich Results test URL (manual, documented): https://search.google.com/test/rich-results?url=https://future-marketing.ai/ — expect Organization, WebSite, WebPage, BreadcrumbList detected; 12 skill pages detect Service + FAQ
3. Schema.org validator URL (manual): https://validator.schema.org/ — paste rendered HTML, expect zero errors
4. Grep verification: `grep -r "@type.*Service" src/components/seo/ScriptTags` equivalent — confirm ServiceJsonLd instances render 12 times across skill pages (via Playwright or build-output scan)
5. Perplexity probe (smoke test, documented): run `mcp__perplexity__perplexity_search "What is Clyde from FutureMarketingAI"` — expect FMai domain in citations within 14 days. Initial run serves as baseline.

## Related Obsidian notes

Capture after phase completion (via `obsidian-capture`):

- Architecture decision: Wikidata QID + sameAs pattern chosen
- Architecture decision: Person `@id` URL pattern (e.g., `https://future-marketing.ai/about/#daley`)
- Architecture decision: robots.ts explicit-allow policy vs wildcard for GEO
- Cross-project pattern: the Service+FAQ-on-skill-page pattern is reusable for SKC member platform + fma-app SaaS docs

## Citations (primary sources)

- Google 2026-03 core update schema impact: https://www.digitalapplied.com/blog/schema-markup-after-march-2026-structured-data-strategies
- Schema.org Organization: https://schema.org/Organization
- Schema.org Person: https://schema.org/Person
- Schema.org Service: https://schema.org/Service
- Schema.org Speakable: https://schema.org/SpeakableSpecification
- Wikidata notability: https://www.wikidata.org/wiki/Wikidata:Notability
- Google search-engines robots.txt: https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
- OpenAI GPTBot: https://platform.openai.com/docs/gptbot
- Anthropic ClaudeBot: https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web
- Perplexity PerplexityBot: https://docs.perplexity.ai/guides/bots
- Google-Extended: https://blog.google/technology/ai/an-update-on-web-publisher-controls/
- Rich Results test: https://search.google.com/test/rich-results
- Schema.org validator: https://validator.schema.org/


---

## Committed Decisions (2026-04-24)

Alle open questions voor deze phase zijn vastgelegd in `.planning/phases/DECISIONS-2026-04-24.md`.

Execute agents: lees dat document vóór elke `plan-XX` die een decision-gate heeft. De decisions zijn bindend voor deze wave, reversible via commit als later blijkt dat een keuze herziening vereist.
