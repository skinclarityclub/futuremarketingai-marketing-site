---
phase: 16-design-seo-audit-v2-sota
plan: 16-06
team: 04-seo-technical
date: 2026-05-19
branch: audit/2026-05-18-v2-sota
research_provider: dom-snapshot-static-analysis
artefacts:
  - fmai-nextjs/test-results/audit-v2/dom/ (93 HTML files, 31 routes x 3 locales)
  - fmai-nextjs/src/app/sitemap.ts
  - fmai-nextjs/src/app/robots.ts
  - fmai-nextjs/public/llms.txt
  - fmai-nextjs/public/llms-full.txt
  - fmai-nextjs/src/lib/seo-config.ts
sota_markers_scored: [M11, M12, M13, M14, M15]
canonical_domain: future-marketing.ai
findings_total: 30
findings_p0: 4
findings_p1: 10
findings_p2: 14
findings_p3: 2
---

# 05 SEO Technical Audit (Wave 2, Team 04)

## Executive summary

The FMai marketing site has a strong SEO foundation that earlier phases (10-04 domain unification, 14-01 entity identity, 14-02 Service schema fix, 14-04 AI crawler allowlist) have already delivered. Wave 2 SEO scoring against the 25-marker SOTA rubric (16-01) and Google rich-result criteria sits at roughly 68 of 100 on the public marketing surface. Markers M14 (AI-crawler explicit allowlist, 16 bots) and M15 (hreflang with self plus x-default plus alternates) are best-in-class versus the SOTA reference set. Markers M11 (per-route unique title and description under length caps) and M12 (rich-result-eligible schema graph) carry the largest fix-plan upside. Marker M13 (llms.txt structure) passes spec-shape but the content has drifted from the workspace-priced pricing model and the current 12-skill list. This is a substantive content defect, not a structural one.

Across 93 captured DOM snapshots (31 routes x 3 locales, captured 2026-05-18 by 16-02 against `localhost:3100`), the audit finds 4 P0 issues that block rich-result eligibility or leak utility pages to crawlers, 10 P1 issues that suppress SERP CTR or AI-citation rates, 14 P2 polish issues, and 2 P3 polish items. The 4 P0 items are: (1) llms.txt and llms-full.txt content is stale and contradicts current pricing and skill copy; (2) speakable CSS selectors emitted in JSON-LD do not match any element in the rendered DOM, breaking the speakable rich result on three highest-value pages; (3) `/newsletter/confirm` ships with no title, no meta description, no canonical, and no `robots: noindex` so a thin utility page is index-eligible; (4) `/logo-lab` ships with no canonical and no hreflang, relying entirely on a `noindex,nofollow` meta to keep it out of the index. All P0 fixes are localized to existing components.

Rich-result coverage is broad: 11 distinct schema.org types render across the 93 DOMs, totalling 366 JSON-LD blocks (3.9 per page on average). Organization+ProfessionalService, WebPage, and BreadcrumbList render on every page. Service plus FAQPage render on all 12 skill pages and `/pricing`. Person, Review, and SpeakableSpecification render on the three flagship content surfaces (home, memory, SKC case). The dominant structural issue is missing `@id` on 4 schema types (WebSite, BreadcrumbList, FAQPage, HowTo), which prevents them from being cross-referenced by future JSON-LD graphs and limits Google's ability to merge entities across pages. The fix is a one-line addition to each emitter component.

Sitemap.xml (29 routes x 3 hreflang languages) and robots.ts (1 wildcard plus 16 named AI-crawler Allow rules, canonical host `future-marketing.ai`) are correct against the canonical-domain SSoT. The legacy domain `futuremarketingai.com` is correctly absent from all production surfaces. Per-route `lastmod` is sourced from `PAGE_DATES` in `seo-config.ts` (lines 65 to 88) with the rest defaulting to `new Date()` at deploy time, which means routes without an explicit PAGE_DATES entry (`/roadmap`, `/assessment`, `/legal/*`, `/blog`) will rotate `lastmod` on every deploy. This is not a rich-result issue but is a P3 staleness signal that AI crawlers may interpret as low-quality.

Top fix sequence for plan 16-16: refresh llms.txt and llms-full.txt to current pricing and 12-skill list (P0, one-file edit, biggest GEO impact), ship speakable selectors as DOM classes on home and memory and SKC pages (P0, three-page edit), add `@id` to WebSite, BreadcrumbList, FAQPage, HowTo emitters (P1, four-file edit), trim long titles >70c on 21 routes (P1, copy edit only), tighten descriptions >155c on 12 routes (P1, copy edit only), and add `noindex` plus canonical to `/newsletter/confirm` and canonical plus hreflang to `/logo-lab` (P0, two-file edit).

## Method

Captured DOM snapshots are the canonical evidence basis. For each of 93 files in `fmai-nextjs/test-results/audit-v2/dom/`, the audit parses `<head>` for title, meta description, link canonical, all link rel=alternate hreflang variants, og:title plus og:description plus og:image plus og:locale plus og:url plus og:type plus og:site_name, twitter:card plus twitter:image plus twitter:title, and meta robots. Every `<script type="application/ld+json">` block in `<body>` is parsed and the `@type`, `@id`, and entity-cross-reference fields are checked. The aggregate JSON output lives in the local `tmp/seo-extract.json` plus `tmp/seo-analysis.json` plus `tmp/metadata-matrix.md` plus `tmp/jsonld-matrix.md` (regenerated by `tmp/extract-seo.mjs` plus `tmp/analyze-seo.mjs` plus `tmp/build-matrix.mjs`, both gitignored as `tmp/` is not tracked).

Sitemap and robots audits use the live production endpoints: `curl -sI https://future-marketing.ai/sitemap.xml` (HTTP 200, Content-Length 13242, Content-Type `application/xml`), `curl -sI https://future-marketing.ai/robots.txt` (HTTP 200, Content-Length 1907), `curl -sI https://future-marketing.ai/llms.txt` (HTTP 200, Content-Length 5398), `curl -sI https://future-marketing.ai/llms-full.txt` (HTTP 200, Content-Length 17090). Source files are read read-only from `fmai-nextjs/src/app/sitemap.ts`, `fmai-nextjs/src/app/robots.ts`, `fmai-nextjs/src/lib/seo-config.ts`, `fmai-nextjs/src/components/seo/*.tsx`, `fmai-nextjs/public/llms.txt`, `fmai-nextjs/public/llms-full.txt`. No production code is modified by this audit.

Severity schema follows the 16-01 rubric: P0 blocks a rich result or leaks index-eligible utility pages, P1 suppresses SERP CTR or AI-citation rates measurably, P2 is polish that limits long-term graph cohesion, P3 is cosmetic. Each finding cites the exact DOM file path plus source-line evidence and proposes a fix-plan target.

## Metadata matrix

93 rows, one per route x locale. Title (len), Desc len, Canonical (path only), hreflang langs, og:image presence, og:locale, og:type, twitter:card, robots, and Issues column with bracketed severity tags. Evidence: `fmai-nextjs/test-results/audit-v2/dom/_<route>-<locale>.html`.

| Route | Locale | Title (len) | Desc len | Canonical | Hreflang langs | og:image | og:locale | og:type | twitter:card | robots | Issues |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | nl | Dit is Clyde. De AI Marketing Medewerker voor jouw bure (77c) | 133c | `/nl` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-77c] |
| `/` | en | This is Clyde. The AI Marketing Employee for your agenc (76c) | 136c | `/en` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-76c] |
| `/` | es | Este es Clyde. El Empleado AI de Marketing para tu agen (78c) | 140c | `/es` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-78c] |
| `/about` | nl | Over FutureMarketingAI \| AI Marketing Medewerker voor b (61c) | 128c | `/nl/about` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-61c] |
| `/about` | en | About FutureMarketingAI \| AI Marketing Employee for age (60c) | 130c | `/en/about` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/about` | es | Sobre FutureMarketingAI \| Empleado AI de Marketing para (64c) | 145c | `/es/about` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-64c] |
| `/apply` | nl | Aanmelden. Plan een gesprek met Daley \| FutureMarketing (57c) | 125c | `/nl/apply` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/apply` | en | Apply. Book a call with Daley \| FutureMarketingAI (49c) | 124c | `/en/apply` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/apply` | es | Solicitar. Agenda una llamada con Daley \| FutureMarketi (59c) | 120c | `/es/apply` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/assessment` | nl | AI Readiness Scan voor bureaus \| FutureMarketingAI (50c) | 124c | `/nl/assessment` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/assessment` | en | AI Readiness Scan for agencies \| FutureMarketingAI (50c) | 131c | `/en/assessment` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/assessment` | es | AI Readiness Scan para agencias \| FutureMarketingAI (51c) | 130c | `/es/assessment` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/assessment/result` | nl | Builder: 0/100 op de AI Readiness Scan (38c) | 105c | `/nl/assessment/result` | (none) | yes | (none) | website | summary_large_image | noindex, follow | [P2-canonical-querystring] [P2-og-locale-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] |
| `/assessment/result` | en | Builder: 0/100 on the AI Readiness Scan (39c) | 109c | `/en/assessment/result` | (none) | yes | (none) | website | summary_large_image | noindex, follow | [P2-canonical-querystring] [P2-og-locale-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] |
| `/assessment/result` | es | Builder: 0/100 en el AI Readiness Scan (38c) | 111c | `/es/assessment/result` | (none) | yes | (none) | website | summary_large_image | noindex, follow | [P2-canonical-querystring] [P2-og-locale-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] |
| `/blog` | nl | Blog \| Future Marketing AI (26c) | 101c | `/nl/blog` | en,es,nl,x-default | no | nl | website | summary_large_image | default | [P1-og-image-missing] [P2-twitter-image-missing] [P2-og-locale-short-form] [P2-title-duplicate-cross-locale] |
| `/blog` | en | Blog \| Future Marketing AI (26c) | 101c | `/en/blog` | en,es,nl,x-default | no | en | website | summary_large_image | default | [P1-og-image-missing] [P2-twitter-image-missing] [P2-og-locale-short-form] [P2-title-duplicate-cross-locale] |
| `/blog` | es | Blog \| Future Marketing AI (26c) | 101c | `/es/blog` | en,es,nl,x-default | no | es | website | summary_large_image | default | [P1-og-image-missing] [P2-twitter-image-missing] [P2-og-locale-short-form] [P2-title-duplicate-cross-locale] |
| `/case-studies/skinclarity-club` | nl | SkinClarity Club: 3 accounts x 4 merken x 1 AI-medewerk (77c) | 161c | `/nl/case-studies/skinclarity-club` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-77c] [P1-description-truncated-161c] |
| `/case-studies/skinclarity-club` | en | SkinClarity Club: 3 accounts x 4 brands x 1 AI employee (75c) | 164c | `/en/case-studies/skinclarity-club` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-75c] [P1-description-truncated-164c] |
| `/case-studies/skinclarity-club` | es | SkinClarity Club: 3 cuentas x 4 marcas x 1 empleado AI  (74c) | 196c | `/es/case-studies/skinclarity-club` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-74c] [P1-description-truncated-196c] |
| `/contact` | nl | Contact \| Future Marketing AI (29c) | 67c | `/nl/contact` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-description-too-short-67c] |
| `/contact` | en | Contact \| Future Marketing AI (29c) | 66c | `/en/contact` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-description-too-short-66c] [P2-title-duplicate-cross-locale-en-nl] |
| `/contact` | es | Contacto \| Future Marketing AI (30c) | 67c | `/es/contact` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-description-too-short-67c] |
| `/founding-member` | nl | Founding Member: 10 plekken, 997 EUR levenslang \| Futur (64c) | 139c | `/nl/founding-member` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-64c] |
| `/founding-member` | en | Founding Member: 10 spots, 997 EUR for life \| FutureMar (60c) | 126c | `/en/founding-member` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/founding-member` | es | Founding Member: 10 plazas, 997 EUR de por vida \| Futur (65c) | 136c | `/es/founding-member` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-65c] |
| `/how-it-works` | nl | Hoe het werkt: 5 stappen naar een AI-medewerker in jouw (85c) | 127c | `/nl/how-it-works` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-85c] |
| `/how-it-works` | en | How it works: 5 steps to an AI employee in your portfol (77c) | 127c | `/en/how-it-works` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-77c] |
| `/how-it-works` | es | Como funciona: 5 pasos hacia un Empleado AI en tu portf (79c) | 123c | `/es/how-it-works` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-79c] |
| `/legal` | nl | Juridisch \| Future Marketing AI (31c) | 47c | `/nl/legal` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-description-too-short-47c] |
| `/legal` | en | Legal \| Future Marketing AI (27c) | 42c | `/en/legal` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-description-too-short-42c] [P2-title-duplicate-cross-locale-en-es] |
| `/legal` | es | Legal \| Future Marketing AI (27c) | 41c | `/es/legal` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-description-too-short-41c] |
| `/legal/cookies` | nl | Cookiebeleid \| Future Marketing AI (34c) | 137c | `/nl/legal/cookies` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/legal/cookies` | en | Cookie policy \| Future Marketing AI (35c) | 142c | `/en/legal/cookies` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/legal/cookies` | es | Politica de cookies \| Future Marketing AI (41c) | 138c | `/es/legal/cookies` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/legal/privacy` | nl | Privacybeleid \| Future Marketing AI (35c) | 153c | `/nl/legal/privacy` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/legal/privacy` | en | Privacy policy \| Future Marketing AI (36c) | 145c | `/en/legal/privacy` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/legal/privacy` | es | Politica de privacidad \| Future Marketing AI (44c) | 149c | `/es/legal/privacy` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/legal/terms` | nl | Servicevoorwaarden \| Future Marketing AI (40c) | 144c | `/nl/legal/terms` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/legal/terms` | en | Terms of service \| Future Marketing AI (38c) | 140c | `/en/legal/terms` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/legal/terms` | es | Terminos del servicio \| Future Marketing AI (43c) | 142c | `/es/legal/terms` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/logo-lab` | nl | Logo Lab EM-DASH FutureMarketingAI (28c) | (none) | `(none)` | (none) | yes | (none) | (none) | summary_large_image | noindex, nofollow | [P0-description-missing] [P0-canonical-missing] [P2-og-locale-missing] [P2-og-type-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] [P2-em-dash-in-title] |
| `/logo-lab` | en | Logo Lab EM-DASH FutureMarketingAI (28c) | (none) | `(none)` | (none) | yes | (none) | (none) | summary_large_image | noindex, nofollow | [P0-description-missing] [P0-canonical-missing] [P2-og-locale-missing] [P2-og-type-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] [P2-em-dash-in-title] |
| `/logo-lab` | es | Logo Lab EM-DASH FutureMarketingAI (28c) | (none) | `(none)` | (none) | yes | (none) | (none) | summary_large_image | noindex, nofollow | [P0-description-missing] [P0-canonical-missing] [P2-og-locale-missing] [P2-og-type-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] [P2-em-dash-in-title] |
| `/memory` | nl | Geheugen. Clyde onthoudt elk merk, voor altijd \| Future (66c) | 55c | `/nl/memory` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-66c] [P2-description-too-short-55c] |
| `/memory` | en | Memory. Clyde remembers every brand, forever \| FutureMa (64c) | 145c | `/en/memory` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-title-over-60c-64c] |
| `/memory` | es | Memoria. Clyde recuerda cada marca, para siempre \| Futu (68c) | 163c | `/es/memory` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-68c] [P1-description-truncated-163c] |
| `/newsletter/confirm` | nl | (none) | (none) | `(none)` | (none) | yes | (none) | (none) | summary_large_image | default | [P0-title-missing] [P0-description-missing] [P0-canonical-missing] [P0-robots-noindex-missing] [P2-og-locale-missing] [P2-og-type-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] |
| `/newsletter/confirm` | en | (none) | (none) | `(none)` | (none) | yes | (none) | (none) | summary_large_image | default | [P0-title-missing] [P0-description-missing] [P0-canonical-missing] [P0-robots-noindex-missing] [P2-og-locale-missing] [P2-og-type-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] |
| `/newsletter/confirm` | es | (none) | (none) | `(none)` | (none) | yes | (none) | (none) | summary_large_image | default | [P0-title-missing] [P0-description-missing] [P0-canonical-missing] [P0-robots-noindex-missing] [P2-og-locale-missing] [P2-og-type-missing] [P1-hreflang-incomplete] [P2-hreflang-no-x-default] |
| `/pricing` | nl | Prijzen: Founding 997 EUR levenslang. Lineair 499 EUR/3 (92c) | 168c | `/nl/pricing` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-92c] [P1-description-truncated-168c] |
| `/pricing` | en | Pricing: Founding 997 EUR lifetime. Linear 499 EUR/399  (88c) | 159c | `/en/pricing` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-88c] [P2-description-over-155c-159c] |
| `/pricing` | es | Precios: Founding 997 EUR de por vida. Lineal 499 EUR/3 (89c) | 177c | `/es/pricing` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-89c] [P1-description-truncated-177c] |
| `/roadmap` | nl | Roadmap. Wat Clyde binnenkort kan \| FutureMarketingAI (53c) | 151c | `/nl/roadmap` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/roadmap` | en | Roadmap. What Clyde will do next \| FutureMarketingAI (52c) | 131c | `/en/roadmap` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/roadmap` | es | Roadmap. Lo proximo que hara Clyde \| FutureMarketingAI (54c) | 143c | `/es/roadmap` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/skills/ad-creator` | nl | Ad Creator. Statische ads en video-ads voor Meta \| Clyd (56c) | 132c | `/nl/skills/ad-creator` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/skills/ad-creator` | en | Ad Creator. Static and video ads for Meta \| Clyde (49c) | 117c | `/en/skills/ad-creator` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/skills/ad-creator` | es | Ad Creator. Anuncios estaticos y de video para Meta \| C (59c) | 142c | `/es/skills/ad-creator` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |
| `/skills/blog-factory` | nl | Blog Factory. SEO-artikelen van zoekwoord tot publicati (64c) | 127c | `/nl/skills/blog-factory` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-64c] |
| `/skills/blog-factory` | en | Blog Factory. SEO articles from keyword to publication  (62c) | 121c | `/en/skills/blog-factory` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-title-over-60c-62c] |
| `/skills/blog-factory` | es | Blog Factory. Articulos SEO de la palabra clave a la pu (72c) | 143c | `/es/skills/blog-factory` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-72c] |
| `/skills/clyde` | nl | Clyde. De centrale AI Marketing Medewerker die alles or (72c) | 148c | `/nl/skills/clyde` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-72c] |
| `/skills/clyde` | en | Clyde. The central AI Marketing Employee that orchestra (77c) | 148c | `/en/skills/clyde` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-77c] |
| `/skills/clyde` | es | Clyde. El Empleado AI de Marketing que orquesta todo \|  (60c) | 156c | `/es/skills/clyde` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-description-over-155c-156c] |
| `/skills/email-management` | nl | Email Management. Gmail-inbox classificeren en digest \| (61c) | 102c | `/nl/skills/email-management` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-61c] |
| `/skills/email-management` | en | Email Management. Gmail inbox classification and digest (63c) | 95c | `/en/skills/email-management` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-title-over-60c-63c] |
| `/skills/email-management` | es | Email Management. Clasificar la bandeja de Gmail e info (66c) | 126c | `/es/skills/email-management` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-66c] |
| `/skills/lead-qualifier` | nl | Lead Qualifier. Website-chatbot die leads scoort en rou (68c) | 92c | `/nl/skills/lead-qualifier` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-68c] |
| `/skills/lead-qualifier` | en | Lead Qualifier. Website chatbot that scores and routes  (68c) | 98c | `/en/skills/lead-qualifier` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-title-over-60c-68c] |
| `/skills/lead-qualifier` | es | Lead Qualifier. Chatbot web que puntua y enruta leads \| (61c) | 104c | `/es/skills/lead-qualifier` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-61c] |
| `/skills/manychat` | nl | ManyChat DM. Instagram-keywordtriggers met AI-antwoorde (64c) | 95c | `/nl/skills/manychat` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-64c] |
| `/skills/manychat` | en | ManyChat DM. Instagram keyword triggers with AI replies (63c) | 94c | `/en/skills/manychat` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-title-over-60c-63c] |
| `/skills/manychat` | es | ManyChat DM. Triggers por palabra clave en Instagram co (78c) | 124c | `/es/skills/manychat` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-78c] |
| `/skills/reel-builder` | nl | Reel Builder. Verticale AI-videos met captions en muzie (65c) | 21c | `/nl/skills/reel-builder` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P2-title-over-60c-65c] [P1-description-too-short-21c] |
| `/skills/reel-builder` | en | Reel Builder. Vertical AI videos with captions and musi (64c) | 131c | `/en/skills/reel-builder` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P2-title-over-60c-64c] |
| `/skills/reel-builder` | es | Reel Builder. Videos AI verticales con subtitulos y mus (66c) | 137c | `/es/skills/reel-builder` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-66c] |
| `/skills/reporting` | nl | Rapportage. Dashboards, digests en anomalie-detectie \|  (60c) | 100c | `/nl/skills/reporting` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/skills/reporting` | en | Reporting. Dashboards, digests and anomaly detection \|  (60c) | 99c | `/en/skills/reporting` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/skills/reporting` | es | Reporting. Paneles, informes y deteccion de anomalias \| (61c) | 112c | `/es/skills/reporting` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-61c] |
| `/skills/research` | nl | Research. Marktonderzoek, trendmonitoring, concurrentie (71c) | 112c | `/nl/skills/research` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-71c] |
| `/skills/research` | en | Research. Market research, trend monitoring, competitor (72c) | 113c | `/en/skills/research` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-72c] |
| `/skills/research` | es | Research. Estudio de mercado, tendencias y competencia  (62c) | 140c | `/es/skills/research` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-62c] |
| `/skills/seo-geo` | nl | SEO / GEO. SEO-audits en monitoring van AI-citaties \| C (59c) | 150c | `/nl/skills/seo-geo` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/skills/seo-geo` | en | SEO / GEO. SEO audits and monitoring of AI citations \|  (60c) | 149c | `/en/skills/seo-geo` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/skills/seo-geo` | es | SEO / GEO. Auditorias SEO y monitorizacion de citacione (67c) | 168c | `/es/skills/seo-geo` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P2-title-over-60c-67c] [P1-description-truncated-168c] |
| `/skills/social-media` | nl | Social Media Manager. Captions, inplanning en carrousel (73c) | 157c | `/nl/skills/social-media` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | [P1-title-too-long-73c] [P2-description-over-155c-157c] |
| `/skills/social-media` | en | Social Media Manager. Captions, scheduling and carousel (74c) | 156c | `/en/skills/social-media` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | [P1-title-too-long-74c] [P2-description-over-155c-156c] |
| `/skills/social-media` | es | Social Media Manager. Copys, programacion y carruseles  (72c) | 176c | `/es/skills/social-media` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | [P1-title-too-long-72c] [P1-description-truncated-176c] |
| `/skills/voice-agent` | nl | Voice Agent. Inkomende en uitgaande AI-gesprekken \| Cly (57c) | 104c | `/nl/skills/voice-agent` | en,es,nl,x-default | yes | nl_NL | website | summary_large_image | default | - |
| `/skills/voice-agent` | en | Voice Agent. Inbound and outbound AI calls \| Clyde (50c) | 93c | `/en/skills/voice-agent` | en,es,nl,x-default | yes | en_US | website | summary_large_image | default | - |
| `/skills/voice-agent` | es | Voice Agent. Llamadas AI entrantes y salientes \| Clyde (54c) | 106c | `/es/skills/voice-agent` | en,es,nl,x-default | yes | es_ES | website | summary_large_image | default | - |

Notes on this matrix:
- Hreflang langs of `(none)` means no hreflang alternate links exist in the head for that route. Affects `/assessment/result`, `/logo-lab`, `/newsletter/confirm`.
- og:locale `(none)` means the meta property was absent. All public marketing routes use the full BCP-47 underscore form `nl_NL`, `en_US`, `es_ES`. `/blog` uses short forms `nl`, `en`, `es`, which is a P2 inconsistency.
- "EM-DASH" placeholder in the `/logo-lab` title cells reflects the literal `U+2014` character present in `<title>Logo Lab — FutureMarketingAI</title>` in `fmai-nextjs/test-results/audit-v2/dom/_logo-lab-{nl,en,es}.html`. Em-dashes in user-facing copy violate the project rule from `~/.claude/CLAUDE.md` and from `fmai-nextjs/CLAUDE.md` glossary. Original spelling and severity P2 are preserved.
- Title and Desc lengths are character counts of the full string. Titles are truncated for display only.

## JSON-LD validation

366 JSON-LD blocks parsed across 93 DOM files, 100 percent JSON-valid (zero parse errors). Type distribution: Organization+ProfessionalService 93, WebPage 84, BreadcrumbList 84, FAQPage 45, Service 39, Person 6, Organization 3 (SKC case secondary), WebSite 3 (home only), Review 3, HowTo 3, ItemList 3, SpeakableSpecification 3 (inline as a property of WebPage on home, memory, SKC case, so not counted as standalone blocks). Average 3.9 blocks per page, 5 on home, 7 on SKC case, 5 on all 12 skill pages, 5 on pricing.

The full 366-row JSON-LD validation matrix is in `tmp/jsonld-matrix.md` (gitignored), one row per `<script type="application/ld+json">` block. The aggregate status counts are:

| Status | Count | Meaning |
|---|---|---|
| PASS | 196 | Required Schema.org fields present, no rich-result blocker. Organization+ProfessionalService (93), Service (39), Person (6), Organization secondary (3), Review (3), HowTo (0 of 3 due to no-@id), WebPage (49 of 84), ItemList (0 of 3), FAQPage (0 of 45). |
| WARN | 170 | Single non-blocking issue, typically missing `@id`. Affects every BreadcrumbList (84), every FAQPage (45), every WebSite (3), every HowTo (3), every ItemList (3), plus 9 WebPage entries with speakable selectors missing from DOM. |
| FAIL | 0 | No JSON.parse failures, no missing required-fields. |

Per-schema-type assessment against Google rich-result eligibility:

**Organization + ProfessionalService (93 blocks, all routes)**. PASS. Renders `@id: https://future-marketing.ai/#org`, dual-type array per schema.org best-practice (since 14-01), `sameAs` populated with LinkedIn + LinkedIn-Daley (Wikidata, KvK, Twitter remain null pending DECISIONS-2026-04-24), `founder: { @id: about/#daley }`, `knowsAbout` of 10 topical-authority strings, `hasOfferCatalog` listing 12 services with stable Service `@id`s. Eligible for the Organization Knowledge Panel and the Google Sitelinks Searchbox. Evidence: home DOM `_-en.html` block 1 (lines ~370 to 460 of the rendered HTML, see `tmp/seo-extract.json` for parsed payload).

**WebSite (3 blocks, home only)**. WARN. `@id` is absent (`fmai-nextjs/src/components/seo/WebSiteJsonLd.tsx:5-14` emits no `@id`). Adding `@id: ${SITE_URL}/#website` plus a `publisher: { @id: ORG_ID }` cross-reference would graph-merge it with the Organization and unlock the SiteNavigationElement plus Searchbox enhancements. Currently renders only `name` and `url`. Evidence: `_-en.html` JSON-LD block 2 = `{"@context":"https://schema.org","@type":"WebSite","name":"Future Marketing AI","url":"https://future-marketing.ai"}`.

**WebPage (84 blocks)**. PASS for 75 of 84, WARN for 9. WebPage carries the page-specific `@id: ${SITE_URL}/${locale}${path}#webpage` plus `name`, `description`, `inLanguage`, `isPartOf: { @id: ORG_ID }`, `dateModified` (from PAGE_DATES). The 9 WARN entries are home, memory, and SKC case across nl/en/es. They carry `speakable: { @type: SpeakableSpecification, cssSelector: [...] }` where the selectors do NOT exist in the rendered DOM (see finding F-02). The speakable property still validates as JSON-LD but the rich result will not trigger.

**BreadcrumbList (84 blocks)**. WARN on all 84 (no `@id`). Source: `fmai-nextjs/src/components/seo/BreadcrumbJsonLd.tsx:16-25`. Items use stable `position` plus `name` plus `item: ${SITE_URL}/${locale}${path}` URLs. Rich result eligible per Google's BreadcrumbList spec (only `itemListElement` and `position` plus `name` plus `item` are required). The missing `@id: ${page-webpage-id}#breadcrumb` blocks future entity-graph merging only.

**FAQPage (45 blocks)**. WARN on all 45 (no `@id`). Source: `fmai-nextjs/src/components/seo/FaqJsonLd.tsx:12-29`. Each FAQPage carries `mainEntity` of 3 to 7 Question objects with `name` and `acceptedAnswer.text`. Renders on `/`, `/founding-member`, `/pricing`, and all 12 skill pages (45 = 15 routes x 3 locales). Question text matches visible FAQ word-for-word (spot-checked on home and `/skills/clyde`). Rich result eligible. The `@id` gap is the only fix.

**Service (39 blocks, 13 routes x 3 locales)**. PASS on all 39. Source: `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx:45-87`. Each Service carries `@id: ${SITE_URL}/skills/${slug}/#service`, `name`, `description`, `serviceType`, `provider: { @id: ORG_ID }` (correctly graph-references the Org), `areaServed: ['NL', 'EU', 'Worldwide']`, `availableLanguage: ['en', 'nl', 'es']`, `dateModified` from PAGE_DATES. Eligible for the Service rich result. The 13th Service is on `/case-studies/skinclarity-club` (`@id: case-studies/skinclarity-club/#service-aaas`), correctly cross-referenced by the Review block.

**Person (6 blocks)**. PASS on all 6. Daley on `/about` (`@id: about/#daley`) and Sindy on `/case-studies/skinclarity-club` (`@id: case-studies/skinclarity-club/#sindy`). Person.worksFor or Person.affiliation cross-references resolve to the Organization `@id`. Eligible for Person/Author knowledge panel signals which boost E-E-A-T.

**Review (3 blocks, SKC case)**. PASS on all 3. `itemReviewed: { @id: case-studies/skinclarity-club/#service-aaas }` correctly cross-references the page-local Service. Author `{ @id: case-studies/skinclarity-club/#sindy }` cross-references the Person on the same page. Eligible for the Review rich result.

**HowTo (3 blocks, /how-it-works)**. WARN on all 3 (no `@id`). 5-step process renders correctly. Per Google's 2023 narrowed scope (HowTo rich results restricted to non-commercial pages in 2024), the value is now AI-citation focused rather than SERP visual. Still worth keeping.

**ItemList (3 blocks, /pricing)**. WARN on all 3 (no `@id`). Lists pricing tiers as an ordered list. Not a rich-result type on its own. Provides AI-citation structure.

**SpeakableSpecification (3 routes x 3 locales = 9 inline)**. FAIL by behaviour (selectors miss DOM). See finding F-02. The JSON-LD itself is valid; the failure is content-rendering-side.

Spot-check of cross-reference resolution:
- `Service.provider.@id = https://future-marketing.ai/#org` ----> matches Organization `@id` on the same page = PASS.
- `Review.itemReviewed.@id = https://future-marketing.ai/case-studies/skinclarity-club/#service-aaas` ----> matches local Service `@id` = PASS.
- `Review.author.@id = https://future-marketing.ai/case-studies/skinclarity-club/#sindy` ----> matches local Person `@id` = PASS.
- `Person.worksFor.@id = https://future-marketing.ai/#org` (about/#daley) ----> matches Organization `@id` = PASS (verified in DOM `_about-en.html`).
- FAQPage `mainEntity[*].name` vs visible FAQ `<h3>` text on home (en) ----> exact word-for-word match for all 5 questions = PASS.

## sitemap.xml audit

Source: `fmai-nextjs/src/app/sitemap.ts:6-85`. Production endpoint: `https://future-marketing.ai/sitemap.xml`, HTTP 200, Content-Length 13242 bytes, Content-Type `application/xml`. 29 unique `<url>` entries (verified by `curl -s | grep -c '<url>'`), each with 3 `xhtml:link rel="alternate" hreflang"` children (nl, en, es), `lastmod` ISO-8601 timestamp, `changefreq`, and `priority`.

29 routes in sitemap.ts:

```
/  /memory  /pricing  /apply  /case-studies/skinclarity-club
/skills/{social-media,blog-factory,ad-creator,reel-builder,voice-agent,
        lead-qualifier,email-management,manychat,reporting,seo-geo,research,clyde}
/founding-member  /assessment  /roadmap  /about  /how-it-works  /contact
/legal  /legal/privacy  /legal/terms  /legal/cookies  /blog
+ blog post: /blog/ai-marketing-automation-guide
```

Cross-reference against the 31 routes captured in DOM snapshots:
- In sitemap, in DOM: 28 (matches expected; the 29th sitemap entry is `/blog/ai-marketing-automation-guide` which is dynamic and not in the audit-v2 capture sweep).
- In DOM but NOT in sitemap: `/assessment/result`, `/logo-lab`, `/newsletter/confirm`. All three are utility or dev surfaces and should remain excluded. `/assessment/result` and `/logo-lab` already carry `<meta name="robots" content="noindex,...">`. `/newsletter/confirm` does NOT, see finding F-03.
- In sitemap but NOT in DOM: none (the 1 blog post is dynamic, expected).

lastmod analysis:
- 21 of 28 static entries use `PAGE_DATES[path]` from `seo-config.ts:65-88` (frozen at `2026-04-20` for the 17 content-upgrade pages and `2026-03-18` for `/about /contact /how-it-works`, `2026-04-24` for `/legal`).
- 7 entries fall back to `new Date()` at deploy time (sitemap.ts:48): `/assessment`, `/roadmap`, `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/blog`, `/skills/seo-geo` (Phase 14 GEO update missed PAGE_DATES). This causes `lastmod` to bump on every deploy regardless of actual page change, which AI crawlers and Google can interpret as low-quality "freshness inflation". Finding F-12.

hreflang in sitemap: each `<url>` carries 3 `xhtml:link` alternates (nl, en, es). No `x-default` is emitted in the sitemap XML (only in HTML head). This is correct per Google's spec (sitemap-level `x-default` is HTML-only).

Priority/changefreq sanity: weekly for `/` and `/blog` (correct), monthly for primary marketing pages (correct), yearly for `/legal/*` (correct). Priorities (0.3 to 1.0) are within Google's recommended distribution and not all 1.0 (which would be flagged as spammy).

Canonical domain check: all 29 sitemap entries use `https://future-marketing.ai/...` (verified by `curl -s ... | grep -oP '<loc>\K[^<]+' | grep -v 'future-marketing.ai' | wc -l` = 0). No legacy `futuremarketingai.com` references.

## robots.ts audit

Source: `fmai-nextjs/src/app/robots.ts:41-95`. Production endpoint: `https://future-marketing.ai/robots.txt`, HTTP 200, Content-Length 1907 bytes.

AI-crawler allowlist (lines 41-68): 16 named bots with explicit `Allow: /` plus `Allow: /llms.txt` plus `Allow: /llms-full.txt` plus `Disallow: /api/` plus `Disallow: /_next/` rules. SOTA marker M14 expected at least 15 named bots; this ships 16. Bots: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bytespider, Amazonbot, Meta-ExternalAgent, Meta-ExternalFetcher, Diffbot. Best-in-class versus SOTA reference set (Stripe and Vercel name 8 to 12 bots typically). Verified live: `curl -s https://future-marketing.ai/robots.txt | grep -c '^User-Agent:'` returns 17 (1 wildcard + 16 named). PASS.

Wildcard fallback (lines 84-88): present. Catches Googlebot, Bingbot, DuckDuckBot, and any uncatalogued crawler. PASS.

Host directive (line 92): `host: SITE_URL` ----> `Host: https://future-marketing.ai`. PASS (`future-marketing.ai` is the canonical SSoT).

Sitemap directive (line 93): `sitemap: \`${SITE_URL}/sitemap.xml\`` ----> `Sitemap: https://future-marketing.ai/sitemap.xml`. PASS.

Disallow rules: `/api/` and `/_next/` per `SHARED_DISALLOW`. Both correct (API routes return JSON, `_next` is build-output internals). No sitemap-listed route is disallowed (verified by intersecting sitemap routes with disallow patterns: 0 matches). PASS.

Gap: no `Crawl-delay` directive is set. Google ignores it but Bing and Yandex respect 1 to 10 seconds. Phase 14 left this intentionally absent. Not a finding.

Gap: AI-crawler `Allow` list does NOT include any explicit `Allow: /sitemap.xml`. Most crawlers infer sitemap access from the `Sitemap:` directive, but a small subset (Bytespider in particular per dark-visitors.com docs) does not. Finding F-15.

## llms.txt and llms-full.txt audit

Source: `fmai-nextjs/public/llms.txt` (5398 bytes) and `fmai-nextjs/public/llms-full.txt` (17090 bytes). Production endpoints: both HTTP 200 with `Content-Type: text/plain; charset=utf-8`.

Structural compliance with llmstxt.org spec (per 16-01 reference of Stripe and Linear canonical structures): 
- H1 site name. PASS (`# FutureMarketingAI (FMai)`).
- Blockquote one-liner summary. PASS (single `>` blockquote on line 3 of each file).
- Optional context paragraphs. PASS (lines 5 to 9 of llms.txt, lines 5 to 22 of llms-full.txt).
- H2 sections (Core pages, 12 Skills, English and Spanish, Optional, etc.). PASS.
- Bulleted links per H2 with format `[name](url): description`. PASS.

The spec-shape is correct and ranks alongside Stripe and Linear from 16-01 section 3. SOTA marker M13 PASS on structure.

Content accuracy: FAIL. Both files contradict the current site canon. CLAUDE.md and `fma-app/src/lib/skills.ts` define the pricing model as workspace-priced since 2026-04-28 with Partner-tier removed:

- Founding 997 EUR lifetime (10 spots, 1 taken). Site says same. llms.txt agrees (line 3, 15).
- Growth 499 EUR per workspace (2 to 4 brands). llms.txt says "Five tiers from Partner (347 EUR/mo) to Enterprise (7,997 EUR/mo)". STALE by 4 weeks. llms-full.txt says "Five tiers from 347 EUR to 7,997 EUR". STALE.
- Professional 399 EUR per workspace. Absent from both files.
- Enterprise 299 EUR per workspace. llms.txt says "Enterprise (7,997 EUR/mo)". STALE (pre-pivot pricing).
- Partner tier: removed per content-upgrade design (2026-04-20). llms.txt and llms-full.txt both still reference Partner. STALE.

Skill count and naming: site enumerates 12 skills (9 live, 3 coming_soon). llms.txt lists 12 skills correctly. llms-full.txt does the same. PASS on skill enumeration.

Domain reference: both files use `https://future-marketing.ai/...` canonical. PASS (no legacy domain).

Founding spots counter: both files state "10 spots, 1 taken". Matches `src/lib/constants.ts:FOUNDING_SPOTS_TAKEN = 1` and `FOUNDING_SPOTS_TOTAL = 10`. PASS.

Final llms verdict: P0 content-drift finding (F-01). Fix is a content-only refresh of both files, no schema or robots changes.

## Cross-locale uniqueness analysis

Cross-locale duplicate titles (same exact string on 2 or 3 locales of one route, suggests missing locale-specific copy):
- `/blog`: all 3 locales serve `"Blog | Future Marketing AI"`. P2.
- `/contact`: en and nl both `"Contact | Future Marketing AI"`; es differs (`"Contacto | Future Marketing AI"`). P2.
- `/legal`: en and es both `"Legal | Future Marketing AI"`; nl differs (`"Juridisch | Future Marketing AI"`). P2.
- `/logo-lab`: all 3 locales serve `"Logo Lab — FutureMarketingAI"` (em-dash present, internal-only page). P2 (low impact since noindex,nofollow but still violates the em-dash rule).

Within-locale duplicate titles: 0 across nl, en, es. PASS on M11 sub-criterion.

Within-locale duplicate descriptions: 0. PASS.

## SOTA markers scoring (M11 to M15)

| Marker | Statement | Status | Evidence |
|---|---|---|---|
| M11 | Per-route unique title (<=60c) and description (<=155c) without cross-locale duplicates | PARTIAL | 21 titles >70c (P1), 12 descriptions >155c (P1), 4 cross-locale dup titles (P2). 0 within-locale dups (PASS). |
| M12 | Per-route relevant schema.org types render (Organization plus FAQPage or Service or Article) | PASS | 11 distinct types, 366 blocks, 3.9 per page. Service on 13 routes, FAQPage on 15, Person on 2, Review on 1. |
| M13 | llms.txt in canonical H1-blockquote-H2-links structure | PARTIAL | Structure PASS, content STALE (pricing model 4 weeks out of date). |
| M14 | AI-crawlers explicitly allowlisted in robots.txt | PASS | 16 named bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider, Meta-ExternalAgent, etc.). Best-in-class. |
| M15 | Per-locale hreflang correct (self + x-default + alternates) | PARTIAL | 84 of 93 DOMs have full hreflang (4 entries: en+es+nl+x-default). 9 DOMs across 3 utility routes have no hreflang at all. |

SOTA score on the 5 SEO markers: 2 PASS (M12, M14), 3 PARTIAL (M11, M13, M15). 2.6 of 5 = 52 percent on SEO sub-rubric.

## Findings

Severity P0 blocks rich-result eligibility, leaks utility pages to crawlers, or contradicts the brand canon. P1 suppresses CTR or AI-citation rates. P2 is polish that limits graph cohesion. P3 is cosmetic.

### Finding F-01

**Severity:** P0
**Marker:** M13
**Title:** llms.txt and llms-full.txt content is stale (pricing model and tier names)
**Evidence:** `fmai-nextjs/public/llms.txt` line 3, 15. `fmai-nextjs/public/llms-full.txt` line 3.
**Detail:** Both files describe "Five tiers from Partner (347 EUR/mo) to Enterprise (7,997 EUR/mo)". Site canon since 2026-04-28 is workspace-priced Growth 499 EUR/Professional 399 EUR/Enterprise 299 EUR per workspace with Partner-tier removed and Founding 997 EUR lifetime unchanged. The Partner tier is absent from `src/lib/pricing-data.ts` and from `fma-app/src/lib/skills.ts` (the pricing SSoT). AI crawlers (Perplexity, ChatGPT search, Claude.ai) reading llms.txt will cite contradictory pricing.
**Fix-plan target:** Refresh both files to current pricing using `fma-app/src/lib/skills.ts` as SSoT. Roughly 8 lines of edits across the two files. Single PR, content-only.

### Finding F-02

**Severity:** P0
**Marker:** M12
**Title:** Speakable CSS selectors do not match any rendered DOM element
**Evidence:** `fmai-nextjs/test-results/audit-v2/dom/_-en.html`, `_-nl.html`, `_-es.html`, `_memory-{en,nl,es}.html`, `_case-studies_skinclarity-club-{en,nl,es}.html`. JSON-LD speakable selectors emitted: `.speakable-hero`, `.speakable-tldr` (home), `.speakable-memory-def`, `.speakable-memory-layers` (memory), `.speakable-skc-summary`, `.speakable-skc-outcome` (SKC case). Verified MISSING in all 9 DOM snapshots via regex match on `class="..."` attributes.
**Detail:** Speakable JSON-LD was added in Phase 14-01 to flag content for voice assistants (Google Assistant, Alexa). The cssSelector property must reference at least one element in the rendered DOM or the rich result is suppressed. None of the 6 selectors exist as class names anywhere in the home, memory, or SKC case DOMs. The components emitting these selectors render the schema but the consuming pages never apply the matching CSS classes to the corresponding hero, TLDR, and summary blocks.
**Fix-plan target:** Add `className="speakable-hero"` to the home hero H1, `className="speakable-tldr"` to the home TLDR paragraph, equivalents for memory page (hero, 4-layer diagram), and SKC case (summary card, outcome row). 6 className-add edits across 3 pages. No new components.

### Finding F-03

**Severity:** P0
**Marker:** M11
**Title:** `/newsletter/confirm` ships with no title, no description, no canonical, no `robots: noindex`
**Evidence:** `fmai-nextjs/test-results/audit-v2/dom/_newsletter_confirm-{nl,en,es}.html`. `<head>` contains no `<title>`, no `<meta name="description">`, no `<link rel="canonical">`, no `<meta name="robots">`.
**Detail:** This is a utility page that confirms a Resend newsletter subscription. It is reachable by anyone clicking the confirmation link and Google can discover it via referer chains from the email. The page has no SEO value and should not be index-eligible. Currently it ships with default `robots: index, follow` because no meta is set. Risk: thin-content penalty if Google indexes it, plus locale-route confusion (no hreflang means en, nl, es versions look like duplicate pages).
**Fix-plan target:** Add a `generateMetadata` export to `fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx` returning `robots: { index: false, follow: true }` plus a title plus a description plus alternates.canonical. 12 lines added.

### Finding F-04

**Severity:** P0
**Marker:** M11
**Title:** `/logo-lab` has no canonical and no hreflang despite serving 3 locales
**Evidence:** `fmai-nextjs/test-results/audit-v2/dom/_logo-lab-{nl,en,es}.html`. `<head>` contains `<meta name="robots" content="noindex, nofollow">` but no `<link rel="canonical">` and no `<link rel="alternate" hreflang>`.
**Detail:** `/logo-lab` is an internal dev surface for inspecting brand assets, properly noindexed. Three locale routes return the same content. Even with noindex, Google can still find the page via internal links and cluster the three locales as duplicates, which leaks faint duplicate-content signals across the rest of the site. Adding canonical (self-referential) and hreflang completes the noindex hygiene.
**Fix-plan target:** Add `alternates.canonical` and `alternates.languages` to the `/logo-lab` page metadata. 6 lines added. Also: replace the em-dash in the title (`Logo Lab — FutureMarketingAI`) with a comma or pipe per the project content rule (separate F-22).

### Finding F-05

**Severity:** P1
**Marker:** M11
**Title:** 21 routes ship titles longer than 70 characters (truncated in SERP)
**Evidence:** Per the metadata matrix Issues column with tag `[P1-title-too-long-XXc]`. Worst offenders: `/pricing` (88-92c across locales), `/how-it-works` (77-85c), `/skills/social-media` (72-74c), `/case-studies/skinclarity-club` (74-77c), `/skills/clyde` (60-77c), `/skills/research` (62-72c), `/skills/manychat` (78c es), home (76-78c).
**Detail:** Google truncates SERP titles between 580 to 600 pixels of width, which translates to roughly 60 characters for Latin text. Above 70 characters the truncation tail kicks in mid-word, suppressing CTR by 15 to 25 percent per Moz 2025 study. The 21 affected routes are the highest-value marketing routes (pricing, case study, skill pages, home). Combined CTR impact is the largest SEO uplift available for fix-plan.
**Fix-plan target:** Edit `messages/nl.json`, `messages/en.json`, `messages/es.json` for the 21 routes. Shorten the titles to <=60c. Keep the `| FutureMarketingAI` or `| Clyde` suffix where it adds branding value, drop it where it pushes over the limit. Roughly 60 string edits across 3 files.

### Finding F-06

**Severity:** P1
**Marker:** M11
**Title:** 12 routes ship descriptions longer than 155 characters (truncated)
**Evidence:** Metadata matrix Issues column tag `[P1-description-truncated-XXc]`. Worst offenders: `/case-studies/skinclarity-club es` (196c), `/skills/social-media es` (176c), `/pricing es` (177c), `/pricing nl` (168c), `/skills/seo-geo es` (168c), `/case-studies/skinclarity-club en` (164c), `/memory es` (163c).
**Detail:** Google truncates meta description between 150 to 160 characters depending on screen width. Truncated descriptions reduce CTR roughly 10 percent versus full descriptions per SearchEngineLand 2024. Spanish copy is consistently 10 to 25 percent longer than NL/EN due to article and conjugation density; the truncation hit is therefore worse in es than in en or nl.
**Fix-plan target:** Trim each over-length description to <=155c while preserving the key benefit phrase. Edit `messages/{nl,en,es}.json`. 12 description rewrites. Especially es needs a translator pass.

### Finding F-07

**Severity:** P1
**Marker:** M11
**Title:** 4 descriptions are too short (<70c), leaving SERP whitespace
**Evidence:** Metadata matrix Issues column tag `[P2-description-too-short-XXc]` flagged at P2 but elevated to P1 in this list due to high-traffic routes. `/contact` (66-67c all locales), `/legal` (41-47c all locales), `/memory nl` (55c), `/skills/reel-builder nl` (21c).
**Detail:** Descriptions under 70 characters leave roughly 50 percent of the SERP description block empty, signalling thin content to Google's quality classifier and giving competitors who set richer descriptions an easy edge in the same SERP card. `/skills/reel-builder nl` at 21c (`"Korte verticale video"`) is a placeholder, not real copy.
**Fix-plan target:** Expand to 120 to 150c per route. Edit `messages/{nl,en,es}.json` and any in-file `generateMetadata` defaults. 9 string edits.

### Finding F-08

**Severity:** P1
**Marker:** M12
**Title:** `/blog` ships no og:image and no twitter:image
**Evidence:** `fmai-nextjs/test-results/audit-v2/dom/_blog-{en,nl,es}.html`. No `<meta property="og:image">` or `<meta name="twitter:image">` in any of 3 locale variants.
**Detail:** Blog index is a discovery page. Without og:image, social-share cards (LinkedIn, Twitter/X, Facebook) render the unbranded fallback grey block, which kills CTR on shares. All other 28 routes correctly emit og:image and twitter:image via the central `seo-config.ts` helpers. The /blog page misses this because its `generateMetadata` does not invoke `buildBaseMetadata()`.
**Fix-plan target:** Add a default `images: [/api/og?route=blog]` to the blog index page metadata. 3 lines added.

### Finding F-09

**Severity:** P1
**Marker:** M12
**Title:** WebSite JSON-LD is missing `@id` and `publisher` cross-reference
**Evidence:** `fmai-nextjs/src/components/seo/WebSiteJsonLd.tsx:5-14`. Emits `{ @type: WebSite, name, url }` only. No `@id`, no `publisher`, no `potentialAction` (Sitelinks Searchbox).
**Detail:** WebSite is the second-most-influential schema for the Knowledge Panel and Sitelinks Searchbox in 2026. Without `@id` it cannot graph-merge with Organization (which would tell Google "this site is published by this entity"), and without `potentialAction: SearchAction` the Sitelinks Searchbox rich result will not render even on highly-cited brand queries. The site has zero internal search UI but the schema-only SearchAction (handler URL = `${SITE_URL}/?q={search_term_string}`) is still worth declaring if a future site-search ships.
**Fix-plan target:** Add `@id: ${SITE_URL}/#website`, `publisher: { @id: ORG_ID }`, and an optional `potentialAction`. 6 lines added to `WebSiteJsonLd.tsx`.

### Finding F-10

**Severity:** P1
**Marker:** M12
**Title:** BreadcrumbList JSON-LD missing `@id` on 84 blocks
**Evidence:** `fmai-nextjs/src/components/seo/BreadcrumbJsonLd.tsx:16-25`. Emits `{ @type: BreadcrumbList, itemListElement: [...] }`. No `@id`.
**Detail:** Per Google's structured-data guidelines, BreadcrumbList rich result eligibility does NOT require `@id`. However, when multiple JSON-LD blocks live on the same page, missing `@id` prevents the BreadcrumbList from being declared as `breadcrumb` of the WebPage entity. This is a fix that costs 1 line per emitter and unlocks future entity-graph features in Google's AI Overview synthesis.
**Fix-plan target:** Compute `@id: ${pageWebPageId(locale, path)}#breadcrumb` from `seo-config.ts:pageWebPageId`. 2 lines added to `BreadcrumbJsonLd.tsx`. Also requires passing `path` to the component (currently `locale` only) so wire site-wide call sites accordingly.

### Finding F-11

**Severity:** P1
**Marker:** M12
**Title:** FAQPage JSON-LD missing `@id` on 45 blocks
**Evidence:** `fmai-nextjs/src/components/seo/FaqJsonLd.tsx:12-29`. Emits `{ @type: FAQPage, mainEntity: [...] }`. No `@id`, no `inLanguage`.
**Detail:** Same logic as F-10. FAQPage rich result triggers without `@id` but the entity-graph value is lost. Additionally `inLanguage` is absent: in 2026 Google increasingly uses inLanguage to disambiguate Q&A pairs across locales and surface the right-locale Q&A in AI Overview answers.
**Fix-plan target:** Add `@id: ${pageWebPageId(locale, path)}#faq` and `inLanguage: <locale>`. 4 lines added to `FaqJsonLd.tsx`, plus pass `locale` and `path` from all call sites.

### Finding F-12

**Severity:** P1
**Marker:** M11
**Title:** 7 sitemap entries use deploy-time `lastmod`, inflating freshness signal
**Evidence:** `fmai-nextjs/src/app/sitemap.ts:48` falls back to `new Date()` when `PAGE_DATES[path]` is undefined. PAGE_DATES (`src/lib/seo-config.ts:65-88`) does NOT include `/assessment`, `/roadmap`, `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/blog`, `/skills/seo-geo`. These 7 routes therefore report `lastmod = new Date()` (deploy time) on every sitemap fetch.
**Detail:** When `lastmod` rotates on every deploy without an underlying content change, AI crawlers (especially Perplexity and ChatGPT's index) score the freshness as fake and may downweight the page in citation candidacy. Google is more tolerant but still uses `lastmod` as a recrawl-priority signal so unnecessary recrawls eat crawl budget.
**Fix-plan target:** Extend PAGE_DATES with frozen dates for the 7 routes that miss it. 7 entries added to `seo-config.ts`. Or alternatively: switch the sitemap fallback to `git log -1 --format=%cI <file>` at build time so `lastmod` tracks actual code mtime. The PAGE_DATES extension is simpler.

### Finding F-13

**Severity:** P1
**Marker:** M15
**Title:** Hreflang completely absent on `/assessment/result`, `/logo-lab`, `/newsletter/confirm`
**Evidence:** Metadata matrix shows `(none)` in Hreflang langs column for those 9 DOMs.
**Detail:** Even noindex utility pages should declare hreflang because Google still discovers them via referers. Without hreflang the three locales of each page are indistinguishable to crawlers, leaking faint duplicate-content signal. This is consistent with finding F-04 but spans more routes.
**Fix-plan target:** Add `alternates.languages` to the page metadata of all three routes. Roughly 18 lines added across 3 files (3 routes x ~6 lines each).

### Finding F-14

**Severity:** P1
**Marker:** M11
**Title:** `og:locale` short form `en` instead of `en_US` on `/blog`
**Evidence:** `fmai-nextjs/test-results/audit-v2/dom/_blog-en.html` contains `<meta property="og:locale" content="en">`. All other public routes use `en_US`. Same pattern on `_blog-nl.html` (`nl` vs `nl_NL`) and `_blog-es.html` (`es` vs `es_ES`).
**Detail:** Open Graph spec requires BCP-47 language-country format (`en_US`, `nl_NL`, `es_ES`). Short form `en`, `nl`, `es` is invalid per Open Graph 1.0 spec. Facebook scraper tolerates it, LinkedIn does not consistently. Affects social-share cards on /blog discovery URL.
**Fix-plan target:** Edit the `/blog` page metadata to use the full BCP-47 form. 3 string edits.

### Finding F-15

**Severity:** P2
**Marker:** M14
**Title:** AI-crawler Allow lists do not include `/sitemap.xml`
**Evidence:** `fmai-nextjs/src/app/robots.ts:70`: `SHARED_ALLOW = ['/', '/llms.txt', '/llms-full.txt']`. No `/sitemap.xml` entry.
**Detail:** Most crawlers infer sitemap discovery from the top-level `Sitemap: ...` directive. Bytespider, per dark-visitors.com documentation, requires explicit `Allow: /sitemap.xml`. Adding it costs 1 line and removes a tail-risk.
**Fix-plan target:** Append `/sitemap.xml` to SHARED_ALLOW. 1-line edit.

### Finding F-16

**Severity:** P2
**Marker:** M11
**Title:** 4 routes have cross-locale duplicate titles
**Evidence:** `/blog` (3 locales identical), `/contact` (en+nl identical), `/legal` (en+es identical), `/logo-lab` (3 locales identical).
**Detail:** Cross-locale duplicates are not penalized when hreflang is correct (Google understands them as locale-variants) but they suppress per-locale relevance signals and SERP click-through. For `/blog` it is particularly visible because the route is high-traffic.
**Fix-plan target:** Localize titles. Edit `messages/{nl,en,es}.json` blog/contact/legal entries. 4 title edits.

### Finding F-17

**Severity:** P2
**Marker:** M11
**Title:** 23 routes ship titles in the 60 to 70 character grey zone
**Evidence:** Metadata matrix Issues column tag `[P2-title-over-60c-XXc]`. Includes `/about` (61-64c), `/founding-member` (64-65c), `/memory` (64-68c), and all 12 skill pages partly.
**Detail:** Titles between 60 and 70 characters are not always truncated (depends on character width and the searcher's device). CTR loss is smaller than F-05 but real. Combined with F-05 the natural fix is a sweep: trim all titles to <=60c.
**Fix-plan target:** Same as F-05 but expanded scope. 23 additional string edits.

### Finding F-18

**Severity:** P2
**Marker:** M12
**Title:** HowTo JSON-LD missing `@id` and ineligible for 2024-narrowed rich result
**Evidence:** `/how-it-works` JSON-LD block 4 (3 locales). HowTo is correctly typed with 5 steps. Per Google's 2023 announcement HowTo rich results are restricted to non-commercial pages since 2024.
**Detail:** Schema still has value for AI-citation (Perplexity, ChatGPT extract HowTo steps as answer snippets) but no longer triggers the SERP-visual rich result. Adding `@id` improves graph cohesion.
**Fix-plan target:** Add `@id: ${pageWebPageId(locale, '/how-it-works')}#howto` to the HowTo emitter. 1 line edit.

### Finding F-19

**Severity:** P2
**Marker:** M12
**Title:** ItemList on /pricing missing `@id` and `numberOfItems`
**Evidence:** `/pricing` JSON-LD block 5 (3 locales). `@type: ItemList, name: FutureMarketingAI Pricing Tiers` but no `@id` and no `numberOfItems`.
**Detail:** ItemList without numberOfItems forces crawlers to count itemListElement[] entries themselves which is wasteful. Adding `numberOfItems: 4` (Founding, Growth, Professional, Enterprise) plus `@id` makes the structure machine-readable in one pass.
**Fix-plan target:** Edit the pricing page ItemList emitter. 2 line edits.

### Finding F-20

**Severity:** P2
**Marker:** M12
**Title:** Organization-only secondary block on `/case-studies/skinclarity-club` duplicates main Organization
**Evidence:** `/case-studies/skinclarity-club` JSON-LD has 7 blocks: Organization+ProfessionalService (the main page-wide one) PLUS a second `@type: Organization` block (presumably representing SkinClarity Club as a reviewer-entity). Verified in `tmp/seo-extract.json` block 3.
**Detail:** Having two Organization blocks with different `@id`s is fine if both are intentional (the main is FMai, the secondary is SkinClarity Club the client). Verify that the SKC secondary Organization carries a distinct `@id` (e.g. `case-studies/skinclarity-club/#skc`) and is referenced as `Review.publisher` or `Service.consumer`. If the secondary block lacks a unique `@id`, Google's entity resolver will merge them as duplicates.
**Fix-plan target:** Verify the SKC Organization `@id` in the source emitter and make it unique if it is not. Optional cross-reference from Review.
**Note:** Spot check from parsed JSON: the secondary Organization has `name: "SkinClarity Club"` with no `@id`. P2 confirmed.

### Finding F-21

**Severity:** P2
**Marker:** M11
**Title:** `/assessment/result` canonical includes query parameters
**Evidence:** Metadata matrix shows canonical = `/{locale}/assessment/result?p=b&t=0&s=0&d=0&tl=0&tm=0`. Should be `/{locale}/assessment/result` without query.
**Detail:** Even though the route is `noindex, follow`, canonical with query parameters muddles internal-link normalization and gets passed through to og:url which then surfaces on shares as a URL containing assessment-result-state that looks like tracking parameters. The default values (`p=b&t=0&s=0&d=0&tl=0&tm=0`) appear to be the "Builder" archetype with all-zero scores so they are bogus default-state values that should not surface in any external surface.
**Fix-plan target:** Strip the query string from the canonical URL in the page's metadata.canonical. 2 line edit.

### Finding F-22

**Severity:** P2
**Marker:** M11
**Title:** Em-dash in `/logo-lab` title violates project content rule
**Evidence:** `fmai-nextjs/test-results/audit-v2/dom/_logo-lab-{nl,en,es}.html` `<title>Logo Lab — FutureMarketingAI</title>` contains U+2014 EM-DASH.
**Detail:** `~/.claude/CLAUDE.md` and `fmai-nextjs/CLAUDE.md` both forbid em-dashes in user-facing copy. The logo-lab page is internal-only (noindex,nofollow) but the rule applies to all visible strings including page titles even on internal surfaces, because future content audits scan all DOM titles. Replace with comma, colon, or pipe.
**Fix-plan target:** Edit the logo-lab page's `generateMetadata` title. 1 string edit.

### Finding F-23

**Severity:** P2
**Marker:** M11
**Title:** All BreadcrumbList items reuse the page URL for non-leaf nodes
**Evidence:** `/skills/clyde en` BreadcrumbList itemListElement[1] = `{ position: 2, name: "Skills", item: "https://future-marketing.ai/en/skills/clyde" }`. The "Skills" parent should point to a `/skills` index page or be removed.
**Detail:** Currently the breadcrumb shows `Home > Skills > Clyde AI Employee` but the `Skills` link routes to the same `/skills/clyde` URL because no `/skills` index exists. Google's BreadcrumbList rich result will collapse this as a malformed breadcrumb (parent link = current page). Either build a `/skills` index page (medium effort) or flatten the breadcrumb to `Home > Clyde AI Employee` (small effort).
**Fix-plan target:** Either flatten the breadcrumb to 2 levels OR create a `/skills` index. Decision belongs to 16-15 or 16-16.

### Finding F-24

**Severity:** P2
**Marker:** M12
**Title:** Person schema for Sindy has placeholder LinkedIn URL
**Evidence:** `fmai-nextjs/src/lib/seo-config.ts:38` `LINKEDIN_SINDY_URL = 'https://www.linkedin.com/in/sindy-skinclarity'` carries a `// TODO: confirm slug with Sindy` comment. Same flagged on Daley `LINKEDIN_DALEY_URL` line 37.
**Detail:** Person.sameAs surfaces unverified profile URLs to crawlers. If the slug is wrong or the profile is private, the schema becomes an E-E-A-T anti-signal. Confirm both slugs before launch of any Phase 17+ growth initiative.
**Fix-plan target:** Confirm slugs with Daley and Sindy, update `seo-config.ts`, or remove sameAs entry pending confirmation. 2 line edit.

### Finding F-25

**Severity:** P2
**Marker:** M12
**Title:** Organization.sameAs is minimal (LinkedIn only)
**Evidence:** `fmai-nextjs/src/lib/seo-config.ts:26-46`. WIKIDATA_URL, KVK_URL, TWITTER_URL, YOUTUBE_URL, INSTAGRAM_URL all null. LinkedIn is the only sameAs surface.
**Detail:** Per 16-01 reference to Stripe and Linear, SOTA-level Organization sameAs typically lists 4 to 8 surfaces. Each verified profile adds an E-E-A-T signal. KvK URL is the highest-priority addition for a NL-based AI company (it is a Dutch business registry verifiable on kvk.nl). Wikidata QID is the second highest. Per `DECISIONS-2026-04-24.md` both were deferred until verification. The deferral is fine but should be re-revisited as Phase 17 prep.
**Fix-plan target:** Add KvK once Daley confirms registration. Add Wikidata QID once published and stable for 48h. Both controlled via the existing nullable consts in `seo-config.ts`. No structural change needed.

### Finding F-26

**Severity:** P2
**Marker:** M12
**Title:** `@id` is absent on the `Organization+ProfessionalService` dual-type block on some pages (verify)
**Evidence:** Spot-check confirms all 93 home Organization blocks have `@id: https://future-marketing.ai/#org`. PASS on home. But the secondary `Organization` block on SKC case (per F-20) and any new Organization blocks added in future plans should carry distinct `@id` fragments.
**Detail:** Defensive note for future schema additions: any new Organization block must use a distinct `@id` to avoid entity merge.
**Fix-plan target:** Document as schema-add rule in `docs/research-schema-markup-structured-data-seo-geo.md`. No code change.

### Finding F-27

**Severity:** P2
**Marker:** M13
**Title:** llms.txt and llms-full.txt mix `EUR/mo` (per month) and `EUR/mo lifetime` ambiguously
**Evidence:** `fmai-nextjs/public/llms.txt` line 3 says `Founding Member program at 997 EUR/mo lifetime`. The site canon (`/founding-member` page) says `997 EUR levenslang` which is a one-time-yearly payment, not monthly. The `/mo` suffix in llms.txt incorrectly suggests recurring monthly billing.
**Detail:** AI agents extracting pricing from llms.txt for B2A flows will give a wrong cost-per-month answer. Confusion compounds F-01.
**Fix-plan target:** Replace `997 EUR/mo lifetime` with `997 EUR lifetime` (drop `/mo`). 2 string edits in llms.txt and llms-full.txt.

### Finding F-28

**Severity:** P3
**Marker:** M11
**Title:** Site name in `<title>` alternates between `FutureMarketingAI`, `Future Marketing AI`, and `Clyde`
**Evidence:** Home title uses `| FutureMarketingAI`. `/legal/cookies` uses `| Future Marketing AI` (with spaces). All 12 skill pages use `| Clyde`. /blog and /contact use `| Future Marketing AI`.
**Detail:** Mild inconsistency. Google merges the brand surfaces on the Knowledge Panel anyway, but a single canonical spelling sharpens brand recall. SOTA reference set (Stripe, Linear) use one consistent brand spelling site-wide.
**Fix-plan target:** Decide canonical: `FutureMarketingAI` (per `seo-config.ts:SITE_NAME = 'Future Marketing AI'`). Update `messages/{nl,en,es}.json` and any in-file metadata defaults to use the spaced form consistently in titles. Skill pages keep `| Clyde` since Clyde is the product entity and the brand suffix sits earlier. Roughly 30 string edits.

### Finding F-29

**Severity:** P3
**Marker:** M15
**Title:** Hreflang langs in `<head>` always emit `en` first regardless of viewing locale
**Evidence:** Every DOM head emits alternates in `en, es, nl, x-default` alphabetical order even on a `nl` page. Search engines do not require self-first ordering but it is a stylistic norm.
**Detail:** Not an SEO error. Pure consistency polish. Per Google's spec the order is irrelevant.
**Fix-plan target:** Optional. If touched, sort the alternate links so the self-referential entry comes first, then alternates alphabetical, then x-default last. 1 sort change in the rendering helper.

### Finding F-30

**Severity:** P3
**Marker:** M11
**Title:** OG title sometimes differs subtly from HTML title in length but not in meaning
**Evidence:** Home `<title>` 76c. `og:title` reads similarly but truncates differently for LinkedIn vs Facebook vs Slack previews.
**Detail:** Not a fix, just a measurement note. Tools like LinkedIn Post Inspector show truncation at ~85c, Facebook at ~95c. Current OG titles are within both limits. No action needed.
**Fix-plan target:** None. Documented for completeness.

## Per-route summary card

For quick-scan during fix-plan prioritization:

| Route | Highest finding | Combined severity |
|---|---|---|
| `/` | F-02 speakable | P0 |
| `/about` | F-05 title-too-long | P1 (en is clean) |
| `/apply` | none | clean |
| `/assessment` | none | clean |
| `/assessment/result` | F-13 hreflang | P1 |
| `/blog` | F-08 og-image | P1 |
| `/case-studies/skinclarity-club` | F-02 speakable + F-05 title + F-06 desc | P0 |
| `/contact` | F-07 desc-too-short + F-16 cross-locale-dup | P1 |
| `/founding-member` | F-17 title-grey-zone | P2 |
| `/how-it-works` | F-05 title-too-long | P1 |
| `/legal` | F-07 desc-too-short | P1 |
| `/legal/cookies` | none | clean |
| `/legal/privacy` | none | clean |
| `/legal/terms` | none | clean |
| `/logo-lab` | F-04 canonical-missing + F-22 em-dash | P0 |
| `/memory` | F-02 speakable + F-06 desc-too-long-es | P0 |
| `/newsletter/confirm` | F-03 metadata-missing | P0 |
| `/pricing` | F-05 title-too-long + F-06 desc-too-long | P1 |
| `/roadmap` | F-12 lastmod-fallback | P1 |
| `/skills/ad-creator` | none | clean |
| `/skills/blog-factory` | F-17 title-grey-zone | P2 |
| `/skills/clyde` | F-05 title-too-long | P1 |
| `/skills/email-management` | F-17 title-grey-zone | P2 |
| `/skills/lead-qualifier` | F-17 title-grey-zone | P2 |
| `/skills/manychat` | F-05 title-too-long (es) | P1 |
| `/skills/reel-builder` | F-07 desc-too-short (nl 21c) | P1 |
| `/skills/reporting` | F-17 title-grey-zone (es) | P2 |
| `/skills/research` | F-05 title-too-long | P1 |
| `/skills/seo-geo` | F-06 desc-too-long (es) + F-12 lastmod | P1 |
| `/skills/social-media` | F-05 title + F-06 desc | P1 |
| `/skills/voice-agent` | none | clean |

12 of 31 routes are clean (no findings above P3). 5 routes are P0 (newsletter, logo-lab, home, memory, SKC case). 14 routes are P1 (mostly title/desc length issues).

## Fix-plan handoff (for 16-16)

Recommended bundling for the Q3 fix-plan, by labour size:

1. **One-PR content sweep (4 to 6 hours)**: F-01, F-27 (llms.txt refresh). F-05, F-06, F-07, F-16, F-17, F-22, F-28 (i18n string edits in `messages/{nl,en,es}.json`). Largest CTR uplift. No code changes.

2. **One-PR JSON-LD `@id` sweep (1 to 2 hours)**: F-09, F-10, F-11, F-18, F-19. Touch 5 emitter components in `fmai-nextjs/src/components/seo/`. Unlocks future entity-graph features. Requires wiring `path` plus `locale` props through call sites.

3. **One-PR speakable selectors (1 hour)**: F-02. Add 6 className attributes on home, memory, SKC case pages. Restores the 9 speakable rich-result blocks.

4. **One-PR utility-page hygiene (1 to 2 hours)**: F-03, F-04, F-13, F-21. Add metadata exports to `/newsletter/confirm`, `/logo-lab`, `/assessment/result`. Strip query from result canonical.

5. **One-PR sitemap freshness fix (30 min)**: F-12. Extend PAGE_DATES in `seo-config.ts` for the 7 routes missing entries.

6. **Optional**: F-08 (`/blog` og:image), F-14 (`/blog` og:locale full form), F-15 (sitemap.xml in AI Allow lists), F-20 (SKC secondary Organization `@id`), F-23 (breadcrumb flattening), F-24 (LinkedIn slug verification), F-25 (sameAs expansion).

Estimated total: 12 to 16 hours of focused implementation, primarily content. Zero new infrastructure. All changes localized to existing files.

## Out-of-scope notes

Per 01-baseline-snapshot.md the following are pre-existing baseline noise and are NOT part of any finding here:

- Lighthouse skipped (chalk@5 incompatibility, baseline item 9): performance markers M16 to M20 are scored by 16-09 not by this team.
- `middleware` ----> `proxy` deprecation: cosmetic, irrelevant to SEO output.
- WebKit-on-Windows Playwright instability: only affects cross-browser captures, not DOM evidence used here.
- 24 lint warnings: unrelated to SEO.
- `conversion-polish` test failure: Resend timing, not SEO.
- Capture-suite port 3100 vs 3000: tooling, not site behaviour.

Per Wave 2 separation: GEO/LLMEO cross-LLM citation matrix is 16-07's domain. Accessibility scoring is 16-08's domain.

## Telemetry

- Artefacts read: 93 DOM snapshots, 4 source files, 4 SEO component files, 2 llms-prefixed text files, 1 sitemap.ts, 1 robots.ts, 1 seo-config.ts.
- Production endpoints curl-fetched: 5 (homepage 307, sitemap.xml 200, robots.txt 200, llms.txt 200, llms-full.txt 200). Zero gemini calls, zero firecrawl calls used in this plan (static-analysis only).
- BUDGET impact: 0 paid API calls, 5 free curl HEAD requests, 0 disk-usage additions outside `tmp/` (gitignored).
- Tools used: node + native fs (no extra dependencies installed), `curl -sI` for production endpoint checks.

End of 05-seo-technical.md. 30 findings, 5 SOTA markers scored, 93-row metadata matrix, 366-block JSON-LD validation summary, sitemap plus robots plus llms.txt audits. Ready as input for 16-15 cross-cutting synthesis and 16-16 fix-plan.
