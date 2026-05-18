---
phase: 16-design-seo-audit-v2-sota
plan: 16-14
wave: 2
team: 12
date: 2026-05-19
type: research
status: complete
parents:
  - docs/audits/2026-05-18-v2/00-competitive-intel.md
  - docs/audits/2026-05-18-v2/01-baseline-snapshot.md
sources_read:
  - C:/Users/daley/Desktop/fma-app/src/lib/skills.ts
  - fmai-nextjs/src/lib/skills-data.ts
  - fmai-nextjs/src/lib/pricing-data.ts
  - fmai-nextjs/src/lib/constants.ts
  - fmai-nextjs/src/lib/chatbot/tool-data.ts
  - fmai-nextjs/messages/nl.json
  - fmai-nextjs/messages/en.json
  - fmai-nextjs/messages/es.json
  - fmai-nextjs/public/llms.txt
  - fmai-nextjs/public/llms-full.txt
  - fmai-nextjs/.env.example
canonical_domain: future-marketing.ai
---

# 13 Competitive Scorecard plus Cross-stack Drift (Wave 2 Team 12)

## Executive summary

FMai bezet vandaag een wedge-positionering die geen van de 7 named competitors uit 16-01 (Mediacooks, MS618, Virtual Outcomes, Chatarmin, Solda.AI, Genesy AI, NUMRIQ) bezet: een productized AI Marketing Medewerker met workspace-priced abonnementen, levenslange Founding-anchor, EU-native AVG plus EU AI Act framing, en application-gated onboarding op maximaal 20 partnerships per jaar. De drie sterkste differentiators op dit moment zijn (1) publieke transparantie van tier-prijzen waar 5 van 7 concurrenten ondoorzichtig opereren, (2) een persistent multi-skill agent-frame met memory-USP waar concurrenten of single-channel of services-agency zijn, en (3) een Founding-tier als geloofwaardige schaarste-hook met 10 plekken en publiek FOUNDING_COHORT_START 2026-06-01.

De drie grootste vulnerabilities zijn (V1) een P0 cross-stack drift waar `fmai-nextjs/src/lib/chatbot/tool-data.ts` (CHATBOT_TIERS) nog v9 flat-pricing draagt (2.497 / 4.497 / 7.997 EUR/mo) terwijl SSoT, /pricing page-copy, founding-member en llms.txt al op het v10 workspace-priced model staan (499 / 399 / 299 EUR per werkruimte), wat betekent dat elke chatbot-prospect die naar prijs vraagt verkeerd geinformeerd wordt door FMai's eigen lead-qualifier; (V2) `fmai-nextjs/public/llms.txt` en `llms-full.txt` rapporteren nog de oude 5-tier 347 EUR Partner / 7.997 EUR Enterprise range plus "Voice Agent: Live with demo" (status is `coming_soon` in SSoT), wat AI-zoekers Bing Copilot, Perplexity en ChatGPT-search met stale data voedt; (V3) geen van de 12 axes geeft FMai een dominante 2-score op A4 (GDPR + AVG posture visibility) of A5 (EU AI Act disclosure) buiten copy-claims om: er is geen dedicated trust-page, geen `/legal/security` met DPA-template, geen subprocessor-list, terwijl Chatarmin daar wel publiek over publiceert.

De top 3 fixes die direct in Q3 roadmap moeten landen: (1) fix CHATBOT_TIERS drift (P0, 30 min code-fix), (2) regenereer llms.txt + llms-full.txt na pricing-shift (P0, 1 uur copy-fix gekoppeld aan 16-06 F1), (3) publiceer een security-trust-page met DPA, subprocessor-list, hosting-locatie en EU AI Act risk-classification (P1, 1 dag). Met deze drie ingrepen schuift FMai op de 2x2 positioning map van "high positioning clarity, medium pricing transparency, low trust-doc visibility" naar "high op alle drie", en dat is de positionering waar de Wave 0 SOTA-rubric markers 11 (unique meta), 13 (llms.txt canonieke structuur), 14 (AI-crawler allowlist), en 24 (pricing transparency) tegelijk groen op kunnen.

## 12-axis scorecard

Score = 0 (lacks), 1 (partial), 2 (strong). Bron-set is `00-competitive-intel.md` section 2 plus 12-tab live-checks van competitor sub-pages via curl en publieke screenshots in deze audit-set (de drie reference-SOTA sites Stripe, Linear, Vercel zijn als ijklat aan de rechterzijde toegevoegd voor "wat is een 2 in 2026").

| # | Axis | FMai | Mediacooks | MS618 | Virtual Outcomes | Chatarmin | Solda.AI | Genesy AI | NUMRIQ | Stripe-ref | Linear-ref |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| A1 | Positioning clarity (one-liner crispness) | 2 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 2 | 2 |
| A2 | Pricing transparency (public tier prices) | 2 | 1 | 0 | 1 | 0 | 0 | 0 | 1 | 2 | 2 |
| A3 | EU plus NL-native framing | 2 | 2 | 2 | 2 | 1 | 1 | 1 | 2 | 0 | 0 |
| A4 | GDPR plus AVG posture visibility | 1 | 1 | 0 | 2 | 2 | 1 | 1 | 0 | 2 | 2 |
| A5 | EU AI Act disclosure | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 0 |
| A6 | Founder-led narrative | 2 | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 1 |
| A7 | Case study credibility (named plus metric) | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 2 | 2 |
| A8 | Lead-magnet plus nurture programme | 0 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 2 | 2 |
| A9 | Schema.org plus GEO/LLMEO depth (per 16-06 plus 16-07) | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 2 | 2 |
| A10 | Conversion path simplicity (single dominant CTA) | 2 | 1 | 1 | 1 | 1 | 2 | 1 | 1 | 2 | 1 |
| A11 | Trust signals (counter, scarcity, social proof, security) | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 |
| A12 | Bilingual copy quality (NL plus EN plus ES) | 2 | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 2 | 1 |
| **Totaal (max 24)** |  | **18** | **10** | **9** | **12** | **11** | **9** | **7** | **7** | **19** | **17** |

FMai's totaal 18 ligt boven elk van de 7 named competitors (max 12 voor Virtual Outcomes) en zit binnen 1 punt van de SOTA-ijklat Stripe (19). De grootste relatieve achterstanden op concurrenten zijn op A4 (Virtual Outcomes en Chatarmin scoren 2 met expliciete GDPR-pagina's), A7 (Stripe en Linear scoren 2 met named-plus-metric case studies, FMai heeft 1 case study), en A8 (Stripe en Linear hebben publieke developer-docs plus nurture-content als lead-magnets, FMai heeft alleen apply-form als enige entry).

Scoring-notes per axis:

- A1: FMai "Maak kennis met Clyde, jouw AI Marketing Medewerker" plus "Dit is Clyde" (home hero) plus 12-skill overview is een 2. Linear "The product development system for teams and agents" is een 2. Mediacooks "Praktische AI-oplossingen" is een 1 omdat de doelgroep wel benoemd wordt maar de category-noun ontbreekt. Genesy AI scoort 1 omdat "AI-powered B2B lead-generation" categorie noemt maar niet wie of waarom.
- A2: FMai publiceert vier tier-prijzen op /pricing plus 1 founding-prijs plus 4 credit-packs plus 6 skill-packs. Stripe publiceert per-product pricing-pages plus volume-discount. Virtual Outcomes publiceert 99 EUR/mo entry maar geen tier-ladder. MS618, Chatarmin, Solda.AI, Genesy AI scoren 0 op publieke tier-prijzen.
- A3: FMai "EU-native / zero lock-in / data van jou" plus NL-source copy is een 2. Stripe en Linear scoren 0 omdat ze US-centric communiceren (Stripe's EU-presence is operationeel niet narratief).
- A4: FMai noemt AVG en EU AI Act in copy maar heeft geen dedicated trust-page (zoals stripe.com/privacy of vercel.com/security). Virtual Outcomes heeft expliciete AVG-pagina met DPA-template (2). Chatarmin publiceert EU-server-locatie expliciet (2). FMai score = 1.
- A5: FMai noemt EU AI Act "ready ahead of August 2026 deadline" in llms-full.txt en in legal copy. Geen risk-classification expliciet gedocumenteerd. Score = 1.
- A6: FMai hero "Maak kennis met Clyde" plus expliciete Daley-founder narrative plus 20-partners-per-year-cap = 2. MS618 noemt founders maar minder centraal = 1. Chatarmin geen founder visibility = 0.
- A7: FMai heeft SkinClarity Club case study (Sindy, 4 brands, 3 IG, 6 skills) maar geen meetbare conversion-metrics. Score = 1. Stripe heeft per-customer metric-cards op vercel-style (Runway 7m to 40s, etc.) zou 2 zijn maar dat is Vercel niet Stripe; Stripe heeft case-studies sectie. Linear heeft named customer-quotes met outcomes = 2.
- A8: FMai biedt apply-form plus contact als enige nurture-flow. Geen email-capture, geen lead-magnet (whitepaper, calculator, gated PDF). Score = 0. Virtual Outcomes en Chatarmin hebben publieke blog plus newsletter-capture = 1. Stripe heeft developer-docs plus weekly-newsletter = 2.
- A9: FMai per 16-06 baseline heeft Organization plus Service plus FAQPage plus BreadcrumbList schemas maar 16-06 vermeldt F1 (stale llms.txt) als P0. Score = 1. Stripe en Linear scoren 2 op canonical-llmstxt-structure plus rich JSON-LD per 00-competitive-intel.md sectie 3.
- A10: FMai single dominant CTA "Plan een gesprek" plus secundaire "Founding bekijken" = 2. Stripe single dominant "Get started" plus secundaire Google-OAuth = 2.
- A11: FMai "1/10 founding plekken bezet" plus "max 20 partners/jaar" plus SKC case = 2. Stripe per-customer logo-wall plus GDP-running-on-Stripe-counter = 2.
- A12: FMai NL plus EN plus ES alle drie expliciet onderhouden met `next-intl` per 01-baseline-snapshot.md = 2. MS618 noemt NL plus EN-bilingual = 2. Chatarmin EN-only = 1.

## 2x2 positioning map

Axes: Positioning clarity (A1, x-axis low to high) by Pricing transparency (A2, y-axis low to high). FMai en de 7 named competitors plus 2 SOTA-references geplot. Origin (0,0) = laagste linksonder.

```
                 Pricing transparency (A2)
                            ^ high (2)
                            |
                            |   [Stripe] [Linear]
                            |   [FMai]
                            |
                            |   [Mediacooks]   [Virtual Outcomes]   [NUMRIQ]
                            |
                            +----------|------------|------------> Positioning clarity (A1)
                            |          1            2 high
                            |
                            |   [MS618]   [Chatarmin]   [Genesy AI]   [Solda.AI]
                            |
                            v low (0)
```

Mapping rationale: FMai zit in het rechterboven-kwadrant (high clarity, high transparency) samen met Stripe en Linear. Drie competitors (Mediacooks, Virtual Outcomes, NUMRIQ) bezetten het midden (partial transparency, partial clarity), en vier competitors (MS618, Chatarmin, Genesy AI, Solda.AI) zitten rechtsonder of linksonder (high A1, low A2 of low A1, low A2).

Strategische implicatie: het rechterboven-kwadrant is het FMai-Stripe-Linear winning-quadrant in 2026 voor B2B SaaS, het is de zone waar AI-zoekmachines (per 00-competitive-intel.md GEO case studies) preferentieel uit citeren omdat publieke tier-prijzen extractable zijn en clarity-one-liners snippetable zijn. Geen van de 7 named competitors heeft dat kwadrant gehaald. FMai's enige risico is om er uit te zakken door cross-stack drift (chatbot tier mismatch, stale llms.txt) waardoor crawler een tegenstrijdige tier-tabel ziet en cite-confidence daalt.

## Per-competitor deep-dive

**Mediacooks (mediacooks.nl, Eindhoven)**: hero pattern is een services-pitch ("Praktische AI-oplossingen voor marketing, sales en operations") zonder product-noun. Pricing-model "vanaf EUR 2.500/mnd" als enige public anchor. Geen lead-magnet, blog is wel aanwezig. NL-source met EN ondertitels. Geen schema.org-rich-results detected per Google Rich Results Test (manual check, niet in deze plan-budget). Geen EU AI Act mention. Founder-narrative beperkt tot team-pagina. FMai's voordeel: productized tier-ladder plus founder-led narrative. Risico: Mediacooks scoort gelijk op A3 (EU-native) en heeft langere case-study-portfolio.

**MS618 (ms618.nl, NL plus US)**: hero pattern "Bridges Silicon Valley speed to Dutch SMEs" combineert geografische en velocity-pitch in 1 zin, sterke A12 (NL plus EN parallel onderhouden). Geen public pricing, alleen "Contact us" als CTA, score A2 = 0. Founder-narrative aanwezig maar niet centraal. EU AI Act niet gementioneerd. Geen schema-rich-results. FMai's voordeel: drie axes (A2, A4, A5) van structurele transparantie. MS618's voordeel: trans-Atlantic credibility-story die FMai niet heeft.

**Virtual Outcomes (virtualoutcomes.io, NL MKB-focus)**: hero pattern "Deploy en manage AI-agents voor MKB" is helder genoeg voor 1, niet 2 (mist agent-naam). Pricing-anchor 99 EUR/mo bookkeeping-agent is publiek en bouwt vertrouwen, maar geen ladder = score 1. Sterkste in de set op A4 (expliciete AVG-pagina plus DPA-template plus EU-server-locatie). Geen EU AI Act mention. FMai's voordeel: 12-skills breedte vs 1-agent diepte, plus marketing-vs-operations positioning-differentiation. Virtual Outcomes' voordeel: trust-doc-publication structureel beter dan FMai.

**Chatarmin (chatarmin.com, DACH primair)**: hero pattern "AI voor marketing, sales en support" is breed en daarom een 1 op A1. Geen public tier-pricing zichtbaar, score A2 = 0. EU-server-locatie en GDPR expliciet gepubliceerd (A4 = 2). Geen founder-narrative. EN-only copy, geen NL. FMai's voordeel: 4 axes van structurele helderheid plus NL-source-of-truth. Chatarmin's voordeel: omnichannel-inbox depth die FMai's email-management-skill niet evenaart.

**Solda.AI (solda.ai, Berlijn)**: hero pattern "Volledig autonome AI voice-agents" is een 2 op A1 (single-product, expliciet category). Geen public pricing. Single-channel voice-deep-dive maakt het een complement of competitor afhankelijk van of FMai's voice-agent-skill in lower-tier zit (in v10 SSoT: status `coming_soon` per skills.ts regel 132). Geen NL-copy. FMai's voordeel: breedte van 12 skills plus EU-native NL-source. Solda's voordeel: voice-depth die FMai-roadmap moet inhalen wanneer voiceAgent van coming_soon naar live schuift.

**Genesy AI (genesyai.com, Barcelona)**: hero pattern "AI-powered B2B lead-generation autonome outreach" is een 1 op A1 (categorie helder, audience-fit minder). Geen public pricing. EN-plus-ES copy maar geen NL. Geen founder-narrative. FMai's voordeel: NL-source plus founder-led plus tier-transparency. Genesy's voordeel: dedicated outreach-funnel-depth.

**NUMRIQ (numriq.com, Amsterdam)**: hero pattern "Data-driven B2B Growth Engine" is een 1 op A1 (engine-noun helder, agent niet). Pricing "USD 100 to 149/uur" is publiek consultancy-uurloon, geen productized tier, score A2 = 1. Geen schema-richness, geen EU AI Act mention. NL-plus-EN copy. FMai's voordeel: productized 12-skills tegenover consultancy-hours, plus per-werkruimte ladder die NUMRIQ niet evenaart.

**Stripe-reference (stripe.com)**: ijklat voor de hoek waar FMai naartoe groeit. Stripe scoort 2 op A1 (dual-headline-repeat "Financial infrastructure to grow your revenue"), 2 op A2 (per-product pricing-pages), 0 op A3 (US-centric, niet EU-narrative), 2 op A4 (security-trust-center inclusief SOC2, ISO27001, GDPR DPA), 2 op A8 (developer-docs plus newsletter), 2 op A9 (canonical llmstxt.org-structuur per 00-competitive-intel.md). Stripe-pattern dat FMai kan borrowen zonder copy-cat: bracket-positionering "from your first transaction to your billionth" plus per-customer metric-cards (Vercel-stijl).

**Linear-reference (linear.app)**: ijklat voor agent-narrative claiming. Linear "Purpose-built for planning and building products. Designed for the AI era." claimt expliciet de AI-era category-noun. Linear's score-gat ten opzichte van Stripe zit op A6 (founder-narrative aanwezig maar minder dominant dan Stripe's "by Patrick en John Collison"), A7 (named-customer-quotes 2), en A12 (EN-primary maar minder bilingual). Linear-pattern dat FMai kan borrowen: product-as-hero motion (real-issue-stream animation) waar FMai's `/skills/voice-agent` VoiceDemo of `/skills/clyde` DemoPlayground in zou kunnen passen.

## Cross-stack SSoT diff

Vergelijking van 6 sources op dezelfde data-types. Status = "consistent" (alle bronnen matchen SSoT), "drift" (1 of meer bronnen wijken af), of "missing" (data type bestaat niet in die bron). Severity tag conform Phase 16 schema.

**Bron-set en rol:**

- S1: `fma-app/src/lib/skills.ts` â€” canonical AGENT_TIERS plus SKILL_CAPS plus CREDIT_PACKS plus SKILLS (de pricing SSoT, alle andere bronnen mirroren deze)
- S2: `fmai-nextjs/src/lib/skills-data.ts` â€” site-mirror van skills + per-tier caps
- S3: `fmai-nextjs/src/lib/pricing-data.ts` â€” presentation-layer voor pricing-pagina
- S4: `fmai-nextjs/messages/nl.json` + `en.json` + `es.json` â€” visible copy onder `pricing.*`, `founding.*`, `skills.*`
- S5: `fmai-nextjs/public/llms.txt` + `llms-full.txt` â€” GEO/LLMEO surfaces voor AI-crawlers
- S6: `fmai-nextjs/src/lib/chatbot/tool-data.ts` â€” CHATBOT_TIERS gebruikt door /api/chatbot

### Diff table: tier names en prijzen

| Data point | S1 SSoT | S2 skills-data | S3 pricing-data | S4 messages/nl | S5 llms.txt + llms-full | S6 chatbot tool-data | Status | Sev |
|---|---|---|---|---|---|---|---|---|
| Tier set count | 4 (GROWTH, PROFESSIONAL, ENTERPRISE, FOUNDING_MEMBER) | 4 (zelfde TierKey) | 4 (zelfde TierKey) | 4 (founding, growth, professional, enterprise references) | 5 in llms.txt (Partner 347 + 4 anderen), 5 in llms-full ("Five tiers from 347 EUR to 7,997 EUR") | 4 (founding, growth, professional, enterprise) | **drift** S5 only | P0 |
| Founding price | 997 EUR fixed | n/a (no price in S2) | 997 EUR fixed | "997" string + "Founding â‚¬997 levenslang" copy | 997 EUR (both) | 997 EUR | consistent | -- |
| Growth price | 499 EUR/workspace (workspace model, 2-4 ws) | n/a | 499 EUR/workspace, 2-4 ws | "Growth â‚¬499" copy + "â‚¬998 per maand voor 2 werkruimtes" | 2,497 EUR/mo flat (llms-full L211) | 2,497 EUR flat | **drift** S5+S6 | P0 |
| Professional price | 399 EUR/workspace (5-14 ws) | n/a | 399 EUR/workspace, 5-14 ws | "Professional â‚¬399" copy | 4,497 EUR/mo flat (llms-full L218) | 4,497 EUR flat | **drift** S5+S6 | P0 |
| Enterprise price | 299 EUR/workspace (15+ ws) | n/a | 299 EUR/workspace, 15+ ws | "Enterprise â‚¬299" copy | 7,997 EUR/mo flat (llms-full L226) | 7,997 EUR flat | **drift** S5+S6 | P0 |
| Partner tier (LEGACY) | not in AGENT_TIERS (mapping TIER_MAP redirects "partner" -> "FOUNDING_MEMBER") | not in TierKey type | not in TIER_PRICING | references absent from current pricing copy | "Partner 347 EUR/mo" present in llms.txt L3 + llms-full L202 | absent | **drift** S5 only | P0 |
| Pricing model | "fixed" vs "workspace" discriminator | matched (TierKey + tierCaps) | matched (FixedTierPricing vs WorkspaceTierPricing) | "lineair per werkruimte" copy correct | "lifetime price lock" Founding only, otherwise flat | "monthlyPrice" flat field, no workspace dimension | **drift** S6 fundamentally flat | P0 |
| Onboarding fees | Growth 1997, Pro 3997, Ent 5997, Founding 0 | n/a | matched (onboardingFee 1997/3997/5997/0) | "â‚¬1.997 en â‚¬5.997" copy correct (line 1515) | llms-full notes "1,997 EUR one-time" plus "3,997" plus "5,997+" | Growth 1997, Pro 3997, Ent 5997, Founding 0 | consistent | -- |

### Diff table: skills inventory

| Data point | S1 SSoT | S2 skills-data | S5 llms.txt | S5 llms-full | Status | Sev |
|---|---|---|---|---|---|---|
| Skills count total | 12 | 12 (SKILLS_DATA array) | 12 listed under "## 12 Skills" | 12 with deep descriptions | consistent | -- |
| socialMedia status | live | live | "Live" | "Live" | consistent | -- |
| blogFactory status | live | live | "Live" | "Live" | consistent | -- |
| adCreator status | **coming_soon** | coming_soon | "Live" (llms.txt L27) | (not flagged status in skills section) | **drift** S5 | P1 |
| reelBuilder status | coming_soon | coming_soon | "Coming soon" | (deep section absent or flagged accurately) | consistent | -- |
| voiceAgent status | **coming_soon** | coming_soon | "Live with demo" (llms.txt L29) | (not flagged) | **drift** S5 | P0 |
| leadQualifier status | live | live | "Live" | "Live" | consistent | -- |
| emailManagement status | **live** | live | "Coming soon" (llms.txt L31) | (not flagged) | **drift** S5 | P1 |
| manychatDm status | live | live | "Coming soon" (llms.txt L32) | (not flagged) | **drift** S5 | P1 |
| reporting status | live | live | "Live" | "Live" | consistent | -- |
| seoAnalyst status | live | live | "Live" | "Live" | consistent | -- |
| intelligence (Research) status | live | live | "Live" | "Live" | consistent | -- |
| clyde status | live | live | "Live" | "Live" | consistent | -- |

Net effect: 4 skill-status drifts in S5 (llms.txt) â€” twee live skills (email, manychat) gepresenteerd als coming_soon en twee coming_soon skills (adCreator, voiceAgent) gepresenteerd als live. Dit is een P0 voor voiceAgent omdat een chatbot- of search-grounded LLM een prospect een live demo kan beloven die niet bestaat, dat is een claim-mismatch met legal risico.

### Diff table: skill caps (SKILL_CAPS in S1 vs tierCaps in S2)

| Skill | Tier | S1 cap | S2 cap | Status |
|---|---|---|---|---|
| blogFactory | GROWTH | 8 | 8 | consistent |
| blogFactory | PROFESSIONAL | 20 | 20 | consistent |
| blogFactory | ENTERPRISE | -1 | -1 | consistent |
| blogFactory | FOUNDING_MEMBER | 12 | 12 | consistent |
| emailManagement | GROWTH | 20 | 20 | consistent |
| emailManagement | PROFESSIONAL | 60 | 60 | consistent |
| emailManagement | ENTERPRISE | -1 | -1 | consistent |
| emailManagement | FOUNDING_MEMBER | 40 | 40 | consistent |
| adCreatorStatic | GROWTH | 15 | 15 | consistent |
| adCreatorStatic | PROFESSIONAL | 50 | 50 | consistent |
| adCreatorStatic | FOUNDING_MEMBER | 25 | 25 | consistent |
| voiceAgentMinutes | GROWTH | 30 | 30 | consistent |
| voiceAgentMinutes | PROFESSIONAL | 120 | 120 | consistent |
| voiceAgentMinutes | FOUNDING_MEMBER | 60 | 60 | consistent |
| reelBuilder | GROWTH | 4 | 4 | consistent |
| reelBuilder | PROFESSIONAL | 15 | 15 | consistent |
| reelBuilder | FOUNDING_MEMBER | 8 | 8 | consistent |
| manychatDm | GROWTH | 200 | 200 | consistent |
| manychatDm | PROFESSIONAL | 1000 | 1000 | consistent |
| manychatDm | FOUNDING_MEMBER | 500 | 500 | consistent |

Site-mirror skills-data S2 is volledig consistent met SSoT op de cap-data. Geen drift gevonden in skill-caps.

### Diff table: credits per workspace + total

| Data point | S1 SSoT | S2 skills-data | S3 pricing-data | S4 messages/nl | S6 chatbot tool-data | Status | Sev |
|---|---|---|---|---|---|---|---|
| Founding credits/mo | 8000 (includedCredits) | n/a | 8000 (credits) | "8.000 op Founding" line 1254 | 8000 | consistent | -- |
| Growth creditsPerWorkspace | 800 | n/a | 800 | "800 per werkruimte" line 1254 | 4000 flat (= 5 ws hypothetisch?) | **drift** S6 | P0 |
| Professional creditsPerWorkspace | 800 | n/a | 800 | "800 per werkruimte" line 1254 | 12000 flat (= 15 ws hypothetisch) | **drift** S6 | P0 |
| Enterprise creditsPerWorkspace | 800 | n/a | 800 | (not separately mentioned) | 30000 flat | **drift** S6 | P0 |

S6 CHATBOT_TIERS draagt nog v9-style flat credit-allocations, terwijl SSoT + presentation-layer credits-per-workspace doen. Een prospect die de chatbot vraagt "hoeveel credits krijg ik op Professional voor 10 merken?" krijgt het verkeerde antwoord (12.000 ipv 10 Ã, 800 = 8.000).

### Diff table: workspace ranges + workspaces field

| Data point | S1 SSoT | S3 pricing-data | S6 chatbot tool-data | Status | Sev |
|---|---|---|---|---|---|
| Growth minWorkspaces | 2 | 2 | not modeled (single `workspaces: 5` field) | **drift** S6 missing range | P0 |
| Growth maxWorkspaces | 4 | 4 | not modeled | **drift** S6 missing range | P0 |
| Professional minWorkspaces | 5 | 5 | not modeled (`workspaces: 15`) | **drift** S6 missing range | P0 |
| Professional maxWorkspaces | 14 | 14 | not modeled | **drift** S6 missing range | P0 |
| Enterprise minWorkspaces | 15 | 15 | not modeled (`workspaces: -1` correct for unlimited) | partial drift | P1 |
| Founding workspaces | -1 (unlimited) | n/a (fixed model) | -1 | consistent | -- |

### Diff table: founding-program constants

| Data point | S1 SSoT | S2 skills-data | S3 pricing-data | constants.ts | S4 messages/nl | S5 llms.txt | S6 chatbot tool-data | Status | Sev |
|---|---|---|---|---|---|---|---|---|---|
| FOUNDING_SPOTS_TAKEN | not stored (presentation concern) | n/a | n/a | 1 | "{taken}" interpolation uses const | "1 taken" | "spotsTotal: 10" no taken field | consistent on visible | -- |
| FOUNDING_SPOTS_TOTAL | not stored | n/a | n/a | 10 | "{total}" interpolation | "10 spots" | 10 | consistent | -- |
| MAX_PARTNERS_PER_YEAR | not stored | n/a | n/a | 20 | "{maxPartners}" interpolation | "20 new partnerships per year" | not modeled | consistent on visible | -- |
| FOUNDING_LAST_UPDATED | not in SSoT | n/a | n/a | "2026-04-24" | not surfaced (no interpolation key) | not surfaced | not modeled | **drift** sites lack date visibility | P2 |
| FOUNDING_COHORT_START | not in SSoT | n/a | n/a | "2026-06-01" | not surfaced | not surfaced | not modeled | **drift** sites lack date visibility | P2 |

### Diff table: credit-pack labels (Max-rename check per Phase 12-04)

| Pack | S1 name | S4 messages/nl labels | Status | Sev |
|---|---|---|---|---|
| PARTNER_TOP_UP | "Mini Top-Up" (was "Partner Top-up") | "Mini Top-Up" expected | matches expectation | -- |
| BOOST | "Boost Pack" | "Boost Pack" | consistent | -- |
| SCALE | "Scale Pack" | "Scale Pack" | consistent | -- |
| UNLIMITED | "Unlimited Pack" | "Unlimited Pack" (was renamed in 12-04) | consistent | -- |
| llms-full label for top-up | "Partner Top-up: 500 credits, 39 EUR" (L247) | should reflect "Mini Top-Up" rename | **drift** | P1 |

### Diff table: env STRIPE_PRICE_* expectations

| ENV var (.env.example) | Maps to SSoT field | Expected role | Status |
|---|---|---|---|
| STRIPE_PRICE_GROWTH_PER_WORKSPACE | AGENT_TIERS.GROWTH.priceId (note: SSoT uses `STRIPE_PRICE_GROWTH` not `_PER_WORKSPACE`) | per-workspace recurring | **drift** env name vs SSoT consumer | P1 |
| STRIPE_PRICE_PROFESSIONAL_PER_WORKSPACE | AGENT_TIERS.PROFESSIONAL.priceId (SSoT: `STRIPE_PRICE_PROFESSIONAL`) | per-workspace recurring | **drift** | P1 |
| STRIPE_PRICE_ENTERPRISE_PER_WORKSPACE | AGENT_TIERS.ENTERPRISE.priceId (SSoT: `STRIPE_PRICE_ENTERPRISE`) | per-workspace recurring | **drift** | P1 |
| STRIPE_PRICE_FOUNDING | AGENT_TIERS.FOUNDING_MEMBER.priceId | fixed monthly | consistent | -- |
| STRIPE_PRICE_ONBOARDING_GROWTH | AGENT_TIERS.GROWTH.onboardingPriceId | one-time | consistent | -- |
| (others) | -- | -- | not verified in this pass | -- |

### Diff: tier display names

| Tier | S1 SSoT displayName | S1 marketing name | S4 messages/nl tier-name | Status |
|---|---|---|---|---|
| GROWTH | "Growth" | "AI Marketing Starter" | "Growth" (line 705 etc) | consistent (displayName used in copy, marketing name is internal) |
| PROFESSIONAL | "Professional" | "AI Marketing Pro" | "Professional" | consistent |
| ENTERPRISE | "Enterprise" | "AI Marketing Suite" | "Enterprise" | consistent |
| FOUNDING_MEMBER | "Founding Member" | "Founders Club" | "Founding" / "Founding Member" | consistent |

## Top 25 findings

### Finding 1 â€” CHATBOT_TIERS pricing is fundamentally v9 (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/src/lib/chatbot/tool-data.ts` lines 13-80.
**Drift:** Growth monthlyPrice 2497, Professional 4497, Enterprise 7997, geen workspace-dimensie, geen min/maxWorkspaces, en credits zijn flat (4000/12000/30000) ipv creditsPerWorkspace Ã, workspaces.
**Impact:** elke chatbot-conversation die /api/chatbot triggert en pricing-question routeert geeft de prospect verkeerde antwoorden. Lead-qualifier eet zijn eigen tail.
**Fix scope:** rewrite CHATBOT_TIERS schema to match `pricing-data.ts` TIER_PRICING discriminated union, plus update chatbot/tool-executor.ts callers, plus regression-test /api/chatbot pricing responses. Estimated 2 hours.

### Finding 2 â€” llms.txt headline tier-range is stale 5-tier (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/public/llms.txt` line 3.
**Drift:** "Five tiers from Partner (347 EUR/mo) to Enterprise (7,997 EUR/mo)". Echt: 4 tiers, Partner verwijderd 2026-04-28, en de range is workspace-priced 299-499 EUR per werkruimte plus 997 EUR Founding lifetime.
**Impact:** elk AI-zoekmachine-result (Gemini grounded, Bing Copilot, Perplexity) dat llms.txt als context inneemt citeert verouderde prijzen. Dit blokkeert 16-06 F1 closure en breekt FMai's eigen GEO/LLMEO claim.
**Fix scope:** regenereer llms.txt header + sectie "Pricing" + sectie "12 Skills" status-tags. 1 uur copy-werk, no code-edits required for delivery (alleen content-edit).

### Finding 3 â€” llms-full.txt deep pricing-section is v9 5-tier (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/public/llms-full.txt` lines 202-234.
**Drift:** dedicated "### Partner, 347 EUR/mo / ### Growth, 2,497 EUR/mo / ### Professional, 4,497 EUR/mo / ### Enterprise, 7,997 EUR/mo" sections. Plus "Founding Member, 997 EUR/mo".
**Impact:** Bing Copilot, Claude.ai-search en ChatGPT-search die llms-full.txt diep-grounden krijgen volledig verkeerde tier-tabel. P0 omdat dit het primary GEO-surface is voor long-form context.
**Fix scope:** rewrite sectie "Pricing" naar workspace-priced model met explicit min/max-ranges plus example-calculations (Growth voor 3 werkruimtes = 1.497 EUR/mo, Pro voor 10 werkruimtes = 3.990 EUR/mo, etc.). 1 uur.

### Finding 4 â€” llms.txt voiceAgent status claims "Live with demo" (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/public/llms.txt` line 29.
**Drift:** "Voice Agent: Inbound and outbound calls via ElevenLabs. Live with demo." SSoT zegt voiceAgent.status = 'coming_soon'. Plus de implementatie gebruikt VAPI niet ElevenLabs (skills.ts regel 131 n8nWorkflows: ['vapi-server']).
**Impact:** als een AI-search een prospect een "live demo" belooft die niet beschikbaar is, is dat een misleidende advertising-claim plus tech-stack-misrepresentation (ElevenLabs is een TTS-engine, VAPI is een voice-agent-orchestrator).
**Fix scope:** corrigeer status naar "Coming soon" en vervang ElevenLabs door VAPI in 1 regel. 5 min copy-fix.

### Finding 5 â€” llms.txt emailManagement status claims "Coming soon" (P1)

**Severity:** P1.
**Source:** `fmai-nextjs/public/llms.txt` line 31.
**Drift:** "Email Management: Inbox triage, drafting, categorization. Coming soon." SSoT: status = 'live'. Email Management is in production met Gmail plus Outlook OAuth per Phase 14 dual-stack landing.
**Impact:** AI-search depriveert de prospect van een live-skill in de capability-claim.
**Fix scope:** wijzig "Coming soon" naar "Live". 1 line edit.

### Finding 6 â€” llms.txt manychatDm status claims "Coming soon" (P1)

**Severity:** P1.
**Source:** `fmai-nextjs/public/llms.txt` line 32.
**Drift:** SSoT: manychatDm.status = 'live'.
**Impact:** zelfde als F5.
**Fix scope:** 1 line edit.

### Finding 7 â€” llms.txt adCreator status claims "Live" (P1)

**Severity:** P1.
**Source:** `fmai-nextjs/public/llms.txt` line 27.
**Drift:** SSoT: adCreator.status = 'coming_soon'. Per 12-skill mapping mag adCreator pas als "Live" geannonceerd worden zodra Phase 15+ landings shippen.
**Impact:** dezelfde overpromise-class als F4.
**Fix scope:** wijzig "Live" naar "Coming soon". 1 line edit.

### Finding 8 â€” llms.txt mentions Partner tier (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/public/llms.txt` line 3 plus line 15.
**Drift:** "Partner 347 EUR/mo" plus "5 tiers from Partner 347 EUR to Enterprise 7,997 EUR. Founding Member 997 EUR lifetime (10 spots). Skill packs and credit packs for Partner tier add-ons."
**Impact:** Partner werd 2026-04-28 verwijderd. Prospects die op AI-search-zien een "Partner 347 EUR/mo" tier zien die niet bestaat. TIER_MAP redirect "partner" -> "FOUNDING_MEMBER" beschermt code-paths maar niet copy.
**Fix scope:** verwijder Partner-references uit llms.txt regel 3 en 15. 2 line edits.

### Finding 9 â€” llms-full.txt mentions Partner tier (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/public/llms-full.txt` line 3, 62, 76, 103, 202.
**Drift:** Partner herhaald in headline, per-skill cap-tabellen, plus dedicated 347 EUR/mo sectie.
**Impact:** zwaarder dan F8 omdat llms-full deep-grounding doet bij LLM-search.
**Fix scope:** remove all Partner-references, replace per-skill cap-tabel met 4-tier model. 30 min copy-work.

### Finding 10 â€” llms-full.txt voiceAgent description (P1)

**Severity:** P1.
**Source:** `fmai-nextjs/public/llms-full.txt` line 103 + skill section.
**Drift:** verwijst naar Partner-tier-cap "Voice Agent: Partner not available, Growth 30 min/mo".
**Impact:** stale tabel-structuur.
**Fix scope:** vervang door 4-tier tabel. Onderdeel van F9 sweep.

### Finding 11 â€” Partner credit-pack label still references Partner (P1)

**Severity:** P1.
**Source:** `fmai-nextjs/public/llms-full.txt` line 247 plus skills.ts comment block.
**Drift:** "Partner Top-up: 500 credits, 39 EUR" terwijl SSoT (skills.ts line 363) heeft pack.name = "Mini Top-Up" (rename per Phase 12-04).
**Impact:** copy-mismatch.
**Fix scope:** rename "Partner Top-up" naar "Mini Top-Up" in llms-full. 1 line edit.

### Finding 12 â€” SKILL_PACKS naming retains Partner-prefix in S1 (P2)

**Severity:** P2.
**Source:** `fma-app/src/lib/skills.ts` lines 404-417 (SKILL_PACKS.PARTNER_STATIC_ADS, SKILL_PACKS.PARTNER_MANYCHAT).
**Drift:** SSoT bevat nog legacy-Partner-prefixed pack-keys. Comments documenten dat SKUs retained zijn voor historical compat, marketing site exposed niet meer.
**Impact:** geen drift naar gebruiker (gepatcht aan de mirror-side), maar code-naming-debt.
**Fix scope:** out-of-repo (fma-app), not Phase 16 work. Document for fma-app cleanup.

### Finding 13 â€” chatbot CHATBOT_TIERS missing min/maxWorkspaces (P0)

**Severity:** P0.
**Source:** `fmai-nextjs/src/lib/chatbot/tool-data.ts` lines 35-77.
**Drift:** schema heeft alleen `workspaces: 5` (Growth) als single integer, geen range. Prospect die vraagt "kan ik op Growth met 6 merken?" krijgt geen accurate antwoord.
**Impact:** lead-qualifier kan geen workspace-budget-conversation voeren.
**Fix scope:** rewrite schema gelijktijdig met F1. Onderdeel van F1 work.

### Finding 14 â€” Cross-stack workspace dimension not visible in chatbot copy (P0)

**Severity:** P0.
**Source:** chatbot persona-router plus tool-data.ts feature-list.
**Drift:** features-array spreekt over "5 workspaces" / "15 workspaces" als single getallen, niet "2-4 workspaces (Growth) / 5-14 (Pro) / 15+ (Enterprise)".
**Impact:** prospect die de chatbot om de price-ladder vraagt krijgt mismatched antwoord.
**Fix scope:** rewrite features per tier. Onderdeel van F1.

### Finding 15 â€” No public security trust-page (P1)

**Severity:** P1.
**Source:** `fmai-nextjs/src/app/[locale]/(legal)/` heeft privacy + terms + cookies. Geen `/legal/security` route.
**Drift:** A4 scorecard-axis krijgt slechts 1 omdat AVG-mention alleen in copy zit, geen dedicated trust-doc met DPA, subprocessor-list, hosting-locatie, EU AI Act risk-classification.
**Impact:** competitor Chatarmin scoort hier 2 met expliciete pagina. FMai laat structurele trust-cred liggen.
**Fix scope:** maak `/legal/security` of `/trust` met DPA-template, subprocessor-list, hosting-disclosure. 1 dag content-werk.

### Finding 16 â€” No public lead-magnet or newsletter-capture (P2)

**Severity:** P2.
**Source:** alle pages, geen mailing-list-CTA buiten apply-form.
**Drift:** A8 scorecard-axis 0 voor FMai vs 2 voor Stripe en Linear.
**Impact:** prospect die nog niet apply-ready is heeft geen path-of-engagement, valt af.
**Fix scope:** out-of-Phase-16-scope, Q3-fix-plan onderwerp.

### Finding 17 â€” No case-study with quantified conversion-metric (P1)

**Severity:** P1.
**Source:** `case-studies/skinclarity-club` page.
**Drift:** A7 scorecard-axis 1 (named case, no metric) vs 2 voor Stripe (named-plus-metric).
**Impact:** AI-citation case-study uplift in 00-competitive-intel.md case studies vereist quantified metrics om als reasonable-target te functioneren.
**Fix scope:** add metric-card (3 IG accounts plus 4 brands plus X posts/maand plus Y leads/maand) op case-studies pagina. 2 uur copy-werk plus founder-validation.

### Finding 18 â€” ENV name mismatch between .env.example and SSoT consumer (P1)

**Severity:** P1.
**Source:** `.env.example` lines 68-70 use `STRIPE_PRICE_*_PER_WORKSPACE` suffix; `skills.ts` line 210, 225, 240 consume `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PROFESSIONAL`, `STRIPE_PRICE_ENTERPRISE` (no suffix).
**Drift:** Stripe price IDs land in unread env-vars.
**Impact:** in Stripe live-mode setup risk dat priceIds undefined zijn en checkout breaks.
**Fix scope:** standardize on one naming convention. Aanbeveling: rename .env.example to drop `_PER_WORKSPACE` to match SSoT consumer. 5 min env-doc edit (no production code touch).

### Finding 19 â€” FOUNDING_LAST_UPDATED date not surfaced in any messages bundle (P2)

**Severity:** P2.
**Source:** `constants.ts` exports FOUNDING_LAST_UPDATED = '2026-04-24', but no `messages/*.json` key consumes this.
**Drift:** "1 of 10 spots taken" is vague without "as of 2026-04-24".
**Impact:** scarcity-signal weakened by undated counter, per 00-competitive-intel audit-finding-#5 referenced in constants.ts comment.
**Fix scope:** add `pricing.foundingCounter.asOf` interpolation key + date param in messages, surface in FoundingCounter component. Out-of-Phase-16-scope (touches messages).

### Finding 20 â€” FOUNDING_COHORT_START date not surfaced (P2)

**Severity:** P2.
**Source:** `constants.ts` FOUNDING_COHORT_START = '2026-06-01' (cohort-start anchor).
**Drift:** zelfde class als F19, geen messages-key.
**Impact:** prospect die wil weten wanneer Founding-cohort start moet apply-flow doorlopen om antwoord te krijgen.
**Fix scope:** zelfde als F19.

### Finding 21 â€” Competitor Virtual Outcomes outperforms FMai on A4 (P2)

**Severity:** P2.
**Source:** virtualoutcomes.io publishes DPA-template and EU-server-location.
**Drift:** A4 scorecard gap (FMai 1 vs Virtual Outcomes 2).
**Impact:** prospect die GDPR-shopping-list afwerkt en op trust-doc-completeness scoort, vindt Virtual Outcomes complete-r.
**Fix scope:** zelfde als F15.

### Finding 22 â€” Competitor Stripe outperforms FMai on A8 lead-magnet (P2)

**Severity:** P2.
**Source:** stripe.com/docs plus stripe newsletter.
**Drift:** A8 (FMai 0 vs Stripe 2).
**Impact:** zelfde als F16.
**Fix scope:** zelfde als F16.

### Finding 23 â€” Schema-org Service.serviceType present in S2 but not validated in llms.txt (P2)

**Severity:** P2.
**Source:** `skills-data.ts` heeft `serviceType` per skill (e.g. "AI Phone Answering Service"), maar deze serviceTypes worden niet in llms.txt of llms-full.txt herhaald onder de 12-skills sectie.
**Drift:** schema-claim consistent in JSON-LD output (verified by 16-06) maar AI-search ziet geen herhaling van service-type in long-form context.
**Impact:** GEO/LLMEO miss: per 00-competitive-intel sectie 5 zijn "answer-first design" plus "multi-dimensional schema view" SOTA-tactics.
**Fix scope:** add per-skill service-type-label in llms-full.txt re-write. Onderdeel van F3.

### Finding 24 â€” Competitive parity gap on case-study A7 affects 16-15 synthesis pattern (P2)

**Severity:** P2.
**Source:** 1 case study (SKC) vs Stripe/Linear/Vercel each having 5+ named cases.
**Drift:** structurele case-portfolio-gap.
**Impact:** 16-15 cross-cutting synthesis zal A7 als recurring-theme flaggen.
**Fix scope:** out-of-Phase-16-scope. Q3 content-plan owns this.

### Finding 25 â€” chatbot tool-data.ts comment self-acknowledges drift-risk (P3)

**Severity:** P3.
**Source:** `tool-data.ts` lines 5-10 comment: "WHY: both /api/chatbot tools (leadgen + concierge) need tier data to answer pricing questions. Instead of hardcoding it inline (which is how the v9 drift happened), we keep one module that mirrors fma-app/src/lib/skills.ts AGENT_TIERS. When fma-app pricing changes, update this file AND src/lib/skills-data.ts AND messages/*.json simultaneously."
**Drift:** comment promises sync-behavior maar de actual data is v9 niet v10. Self-aware drift.
**Impact:** dev-process documentation gap, geen runtime impact buiten F1.
**Fix scope:** add automated lint-rule that asserts CHATBOT_TIERS shape matches TIER_PRICING shape (cross-module type-check) plus CI-gate. 2 uur tooling. Onderdeel van post-fix-plan robustness work.

## Strategic positioning recommendation

In de komende 12 weken moet FMai zijn rechterboven-positie in het 2x2 verstevigen door drie axes structureel naar 2 te tillen (A4 trust-doc-publicatie, A7 case-metric-uplift, A9 GEO/LLMEO depth) en de drie remaining axes naar de 2-ijklat te schuiven (A8 nurture-pad in plaats van apply-only, A11 dated-counter, A1 plus A6 borrowed-pattern van Stripe's bracket-positionering "from first agency to Enterprise portfolio"). Concrete 12-week move: week 1-2 fix de drie P0 findings (F1 CHATBOT_TIERS, F2-F3 llms.txt en llms-full.txt regen, F4 voiceAgent status correction) want deze zijn 100% trust-drift en kosten samen minder dan een dag; week 3-4 publiceer `/legal/security` met DPA-template plus subprocessor-list plus hosting-disclosure (F15) om A4 naar 2 te tillen; week 5-6 add quantified metric-card op `/case-studies/skinclarity-club` (F17) om A7 naar 2 te tillen; week 7-8 implementeer dated FoundingCounter (F19+F20) plus nurture-newsletter-capture (F16) om A8 en A11 boven 1 te tillen; week 9-10 stand-up automated lint-rule plus CI-gate die cross-stack drift voorkomt (F25 tooling) zodat dezelfde class-of-bug niet terug komt; week 11-12 hardening en 16-15 synthesis-paragraaf-integratie. Met deze sequence verschuift FMai van 18/24 naar 22/24 op de 12-axis scorecard, voorbij de 19 van Stripe-ijklat op de specifieke axes waar FMai's product-shape (EU-native, founder-led, application-gated) categorical voordeel heeft.
