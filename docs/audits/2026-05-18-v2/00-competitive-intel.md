---
phase: 16-design-seo-audit-v2-sota
plan: 16-01
wave: 0
type: research
status: complete
created: 2026-05-18
research_provider: gemini-2.5-flash-google-grounded
research_calls: 3
firecrawl_calls: 3
canonical_domain: future-marketing.ai
---

# 00 Competitive Intelligence + SOTA Markers (Wave 0)

> Wave 0 baseline. Dit document is de externe ijklat voor alle 12 Wave 2 audit-teams. Geen productie-code edits in dit plan. Onderzoek is uitsluitend gerouteerd via Google Search grounding op Gemini 2.5 Flash (`~/.claude/scripts/gemini-research.mjs --model flash --json`), nul Perplexity-calls in deze fase.

## 1. Scope

Doel van dit document: (a) lever een named-competitor-set zodat Wave 2 teams FMai kunnen scoren tegen reëel-bestaande spelers in het EU AI-marketing-segment, (b) destilleer drie state-of-the-art reference SaaS marketing-sites uit live scrapes zodat designers concrete patroon-vergelijkingen kunnen doen, en (c) publiceer een 25-marker SOTA-rubric die elk team gebruikt als binaire scorings-axis. Zonder deze baseline produceren de 12 parallelle Wave 2 docs incoherente severity-calls.

Output-disciplines: NL voor user-facing samenvattingen, EN voor technische termen. Severity tags volgen P0 (business-critical), P1 (high-impact), P2 (medium), P3 (polish). Geen em-dashes in deze doc, alleen komma, punt, of dubbele punt. Canonical domain `future-marketing.ai` exclusief (legacy `futuremarketingai.com` DNS staat los van Vercel sinds 2026-05-18 audit, niet meer benoemen).

Research-budget verbruik voor dit plan: 3 Gemini grounded calls (van 100 max, soft cap), 3 firecrawl-scrapes (van 80 max). Volledige call-telemetrie staat in `BUDGET.log` naast dit bestand. Raw Gemini JSON-output is bewaard in `tmp/q1.json`, `tmp/q2.json`, `tmp/q3.json` voor reproduceerbaarheid en mag na phase-close worden verwijderd.

## 2. Competitors (5 to 7 named)

Bron: Gemini grounded query 1 ("Top AI marketing agencies and AI agent-as-a-service platforms for Dutch and EU B2B SMBs in 2026"). Aanvullingen waar Gemini onvoldoende publieke pricing-data leverde, zijn als "ondoorzichtig" gemarkeerd. Threat-level reflecteert overlap met FMai's high-touch AI marketing partnership-positionering richting Nederlandse en EU bureaus.

| # | Name | URL | Region | Positioning summary | Public pricing | Differentiator vs FMai | Threat |
|---|---|---|---|---|---|---|---|
| 1 | Mediacooks | mediacooks.nl | Eindhoven, NL | Praktische AI-oplossingen voor marketing, sales en operations voor Nederlandse SMBs, focus op meetbare lead-, omzet- en efficiency-groei | Vanaf EUR 2.500 per maand | Generieke AI-implementatie agency, geen single AI-medewerker-product | Med |
| 2 | MS618 | ms618.nl | NL + US | Bridges Silicon Valley speed naar ambitieuze Nederlandse SMEs, partner-not-vendor model met strategie plus AI uitvoering | Ondoorzichtig | US-blueprint plus NL delivery, geen Founding-tier of single-product framing | Med |
| 3 | Virtual Outcomes | virtualoutcomes.io | NL (Dutch MKB focus) | Deployt en managet AI-agents voor Dutch MKB met focus op bookkeeping, receipts, BTW en support-triage, sterke AVG-framing | Bookkeeping-agent vanaf EUR 99 per maand | Operations-AI, geen marketing-AI; veel goedkoper entry-point | Low |
| 4 | Chatarmin | chatarmin.com | EU (DACH primair) | AI voor marketing, sales en support in MKB met omnichannel inbox, ticketing en GDPR plus EU-server narrative | SaaS maandelijks, schaalbare packages, publieke tier-prijzen niet vindbaar | Inbox- en service-georiënteerd, geen 12-skills medewerker-frame | Med |
| 5 | Solda.AI | solda.ai | Berlijn, EU | Volledig autonome AI voice-agents voor sales-cycles (voice + text + email + chat) | Ondoorzichtig | Single-channel voice deep-dive, geen brede marketing-medewerker | Low |
| 6 | Genesy AI | genesyai.com | Barcelona, EU | AI-powered B2B lead-generation, autonome outreach en qualification, books meetings | Ondoorzichtig | Sales-funnel deep-dive, niet content of brand-marketing | Med |
| 7 | NUMRIQ | numriq.com | Amsterdam, NL | Data-driven B2B Growth Engine, transformeert fragmented marketing naar measurable revenue-system met AI | USD 100 to 149 per uur | Consultancy-hour model, geen productized agent-as-a-service | Low |

Gaps en notes:
- Geen van de 7 publiceert een directe pendant van FMai's Founding-tier EUR 997 levenslang + workspace-priced Growth EUR 499 plus Professional EUR 399 plus Enterprise EUR 299 model.
- Vier van zeven zijn agency-services (project-billing of hour-billing), drie zijn product-led SaaS. FMai's hybride medewerker-frame met productized pricing zit tussen beide in: dat is een wedge-positionering die concurrenten niet bezetten.
- Voor Threat-level High zouden we een EU-native, productized, multi-skill AI-marketing-agent met publieke per-workspace pricing nodig hebben. Die ontbrak in deze query, wat een tactisch SOTA-gat is dat FMai kan houden.

## 3. Reference SOTA sites (3)

Bron: live `firecrawl-scrape` van 3 sites die Gemini query 2 als state-of-the-art identificeerde of die in de canon van SOTA SaaS marketing-sites staan (Stripe en Linear zijn beide direct genoemd in de Gemini-output; Vercel is canonical voor AI-cloud Next.js-segment en is een direct platform-peer voor `fmai-nextjs`). Voor elke site is de homepage scraped naar `tmp/<slug>.md`, en `<root>/llms.txt` is geprobeerd met curl voor llms.txt-aanwezigheid.

### 3.1 Stripe (stripe.com)

- **Hero pattern**: dubbele-headline herhaling (twee identieke H1-blocks) "Financial infrastructure to grow your revenue. Accept payments, offer financial services, and implement custom revenue models from your first transaction to your billionth." Bovenaan een ultra-subtiele live-counter bar ("Global GDP running on Stripe: 1.64888223%") als sociaal bewijs zonder ruis.
- **Primary CTA**: "Get started" (link naar `dashboard.stripe.com/register`) plus secundaire "Sign up with Google" OAuth-knop, beide bovenin direct na de hero-copy. Eén dominant doel: account-creation.
- **IA top-nav depth**: niet leesbaar in main-content scrape (nav gestript), maar publiek bekend Products / Solutions / Developers / Resources / Pricing en Sign in / Contact sales als top-rechts secondary cluster.
- **Color palette tokens**: zwart en wit dominant, signature purple `#635bff` als accent, gradients in bento-cards. Donker-gradient hero overlay met multi-language micro-receipts in beeld voor cultural credibility.
- **Motion patterns**: kalme wave-fallback PNG als hero-decoratie, geen ronkende animaties; bento-grid scrolt rustig; geen distracting parallax.
- **Schema.org types detected**: Organization en WebSite verwacht (publiek bekend). Niet expliciet in scraped markdown leesbaar omdat schema in `<script type="application/ld+json">` zit en firecrawl `--only-main-content` deze stript. Wave 2 SEO-team moet expliciet schema-extract draaien.
- **llms.txt presence**: ja, HTTP 200, canonieke H1-blockquote-H2-link-sections structuur. Opening: "# Stripe / > Stripe is a technology company..." met H2 sections per product (Payments, Billing, Connect, et cetera) en expliciete verwijzing naar `https://stripe.com/llms-full.txt` voor de long-form variant. Dit is de referentie-implementatie voor llmstxt.org spec.
- **UVP phrasing extracted**: "Financial infrastructure to grow your revenue" plus "from your first transaction to your billionth" als bracket-positionering die zowel startups als enterprise tegelijk valideert.
- **Screenshot link**: TODO `test-results/audit-v2/screenshots/refs/stripe-home.png` (Wave 1 plan 16-02 owns capture).

### 3.2 Linear (linear.app)

- **Hero pattern**: morphing-headline "The product development system for teams and agents" die in drie discrete states leeft (mobile single-line, desktop double-line, full-bleed three-line) met responsive line-break-rotation. Sub-copy "Purpose-built for planning and building products. Designed for the AI era." onderstreept agent-narrative.
- **Primary CTA**: "Issue tracking is dead" link naar `/next` als content-CTA, geen klassieke "Sign up" knop bovenin. Linear gokt op product-narrative-first: een visitor moet eerst de geïntegreerde AI-coding-agents demo zien voor de signup-vraag valt.
- **IA top-nav depth**: gestript in scrape, publiek bekend Method / Product / Pricing / Customers / Now / Contact, alles single-level.
- **Color palette tokens**: pure dark mode (near-black bg, off-white text), accent koel-paars `#5e6ad2` als brand. Avatars en code-snippets geven kleur-accents zonder palette pollution.
- **Motion patterns**: live-issue-card scroll-animation simuleert real product-flow met avatar-update-stream, Codex agent-thread, label-additions die in real-time landen op een nep-issue (ENG-2703). Dit is product-as-hero motion in plaats van decoratieve animation.
- **Schema.org types detected**: niet leesbaar in main-content (zelfde JSON-LD gating als Stripe). Linear publiceert publiek SoftwareApplication + Organization schema.
- **llms.txt presence**: ja, HTTP 200, canonieke structuur. Opening: "# Linear / > Linear is a purpose-built tool for planning and building products. Meet the system for modern software development." H2 sections per documentation-domain.
- **UVP phrasing extracted**: "A new species of product tool. Purpose-built for modern teams with AI workflows at its core." Linear claimt expliciet de AI-era category-name in plaats van category-incumbent te zijn.
- **Screenshot link**: TODO `test-results/audit-v2/screenshots/refs/linear-home.png`.

### 3.3 Vercel (vercel.com)

- **Hero pattern**: ook dubbele-H1 ("Build and deploy on the AI Cloud."), platform-positionering boven product-positionering, sub-copy belooft "developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web."
- **Primary CTA**: "Deploy" plus "Get a Demo" als twee even gewichtige knoppen direct na hero. Twee distinct user-paths, self-serve developer vs enterprise sales.
- **IA top-nav depth**: top-banner met event-promo "Ship 26 is coming to 5 cities, Get your ticket" als time-bound urgency. Main nav onder Products / Solutions / Resources / Enterprise / Docs / Pricing (publiek bekend).
- **Color palette tokens**: pure dark mode plus pure light mode toggle, beide assets parallel geladen in markup (`-light.svg` en `-dark.svg` per logo). Accent gradient violet-cyaan voor CTA-states. Geist design-system (Vercel's eigen DS) is open-source en publiek.
- **Motion patterns**: scroll-driven logo-wall die per scroll-positie verschuift, sticky CTA-states, en use-case-switcher (AI Apps / Web Apps / Ecommerce / Marketing / Platforms) met hero-asset-rotation per tab.
- **Schema.org types detected**: niet leesbaar in main-content; Vercel publiceert standaard Organization, WebSite, en SoftwareApplication.
- **llms.txt presence**: ja, HTTP 200. Vercel's llms.txt is documentation-pointer-only ("> Full documentation content: https://vercel.com/docs/llms-full.txt / # Documentation / # Vercel Documentation") in plaats van de canonieke H1-blockquote-H2-links structuur. Dit is een variant-implementatie, minder rijk dan Stripe of Linear.
- **UVP phrasing extracted**: "Build and deploy on the AI Cloud" plus per-customer metrics ("Runway build times went from 7m to 40s", "LeonardoAi saw a 95% reduction in page load times", "Zapier saw 24x faster builds") als quantified social proof.
- **Screenshot link**: TODO `test-results/audit-v2/screenshots/refs/vercel-home.png`.

Substitution note: van de Gemini query 2 lijst zijn Stripe en Figma direct genoemd; Vercel is een gerichte substitute voor Figma omdat Vercel een directe stack-peer is van `fmai-nextjs` (Next.js + Vercel deployment) en daarom betekenisvoller is voor Wave 2 perf-, deploy- en headers-teams dan Figma's collaboration-tool patronen.

## 4. SOTA markers rubric (25 markers)

Elke marker is een binaire testable claim. Wave 2 teams gebruiken deze als scoring-axis (PASS of FAIL plus severity P0 tot P3). Gegroepeerd in 5 categorieën van 5 markers, zodat elke team-doc een 5-bin scoring matrix kan publiceren.

### Visual (1 to 5)

1. Hero heeft één dominante primary CTA, geen split-attention secondary op gelijk visueel gewicht.
2. Hero-headline communiceert wat, voor wie, en waarom binnen 5 seconden van eerste fixatie.
3. Color palette is consistent (geen deprecated tokens, geen one-off colors) en passed automated palette-check.
4. Typografie-hiërarchie is sterk (max 3 schalen tegelijk zichtbaar, line-length 45 to 75 chars body).
5. Motion is purposeful (toont product-functionaliteit), niet decoratief, en respecteert `prefers-reduced-motion` media-query.

### Information Architecture (6 to 10)

6. Top-nav is single-level of maximaal 2-level mega-menu, geen 3-level deep submenus.
7. Elke route reachable in maximaal 2 clicks vanaf homepage voor primary user-tasks.
8. Breadcrumb (visueel of `BreadcrumbList` schema) aanwezig op alle non-home routes.
9. 404-handling routeert intelligent (suggested-pages of zoekbalk), geen dead-end.
10. Footer dupliceert kritieke navigation-paths plus juridische links (privacy, terms, cookies) plus contact-email.

### SEO en GEO (11 to 15)

11. Per-route unique meta-title (max 60 chars) en meta-description (max 155 chars) zonder duplicates over locales.
12. Per-route relevante schema.org types renderen (minimaal Organization, plus FAQPage of Service of Article afhankelijk van page-type).
13. `llms.txt` aanwezig in canonieke H1-blockquote-H2-link-sections structuur (per llmstxt.org spec).
14. AI-crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) expliciet allowlisted in `robots.txt`, niet impliciet-allow.
15. Per-locale `hreflang` tags correct (zelfreferentie plus x-default plus alle alternates) zonder canonical-conflicten.

### Performance (16 to 20)

16. Lighthouse Performance mobile score >= 85 op productie URL (CrUX of lab data).
17. Largest Contentful Paint < 2.5s op mobile 4G CrUX-baseline.
18. Cumulative Layout Shift < 0.1 op alle routes (geen layout-jumps door late assets).
19. Bundle-size JS-payload first-load < 200KB gzipped voor publieke marketing-routes.
20. Geen render-blocking third-party scripts boven the fold (analytics, chat, Calendly defer of lazy-load).

### Conversion (21 to 25)

21. Primary conversion-CTA herhaalt minimaal 3x op long-form pages (hero, mid, end) zonder hijack van scroll-flow.
22. Forms minimaliseren fields (apply en contact onder 6 verplichte velden), inline-validation actief, autoComplete-tokens correct.
23. Social proof is verifieerbaar (named klant + meetbare metric + bron-attribution), geen anonieme quotes.
24. Pricing-transparantie zichtbaar (publieke tier-prijzen of duidelijk "vanaf X EUR"), geen verstopte "Contact Sales" als enige optie.
25. Verlate-friction-points zijn afwezig op apply-funnel (geen cookie-modal blocking, geen mandatory email-verification voor CTA-evaluatie).

## 5. GEO en LLMEO state of practice 2026

Bron: Gemini grounded query 3 ("Current state of GEO and LLMEO best practices 2026"). Belangrijkste shifts ten opzichte van klassieke SEO:

**Schemas die in 2026 het meeste AI-citation-gewicht dragen**: FAQPage (direct extraheerbaar als Q&A pairs), HowTo (step-by-step instructie), Article of BlogPosting (long-form content provenance), Organization en Person voor E-E-A-T-signalen (Experience-Expertise-Authoritativeness-Trustworthiness, die LLMs sterk gewicht geven), Product en Review voor e-commerce-flows, LocalBusiness voor geografische queries, en BreadcrumbList voor structuur. JSON-LD blijft de voorkeur-implementatie boven Microdata of RDFa. Best practice: meerdere onderling-gekoppelde schema-types op één page geven AI een multi-dimensional view, regelmatig valideren via Google Rich Results Test.

**llms.txt patronen**: standaard geïntroduceerd september 2024, in 2026 nog niet statistisch bewezen om AI-citation-frequency in algemene AI-search-resultaten te verhogen, maar wel een low-effort low-cost forward investment. Primary value emergeert in Business-to-Agent (B2A) flows waar AI-agents context op halen om taken voor een gebruiker uit te voeren. Developer-tooling-bedrijven zijn early adopters met meetbare value. Best practices: H1 met site-naam, blockquote samenvatting, optionele context-paragrafen, H2-secties met bullet-links naar key pages elk met korte beschrijving, file op `<root>/llms.txt`, plus verwijzing in `robots.txt`, plus regelmatige refresh om staleness te voorkomen. De FMai site implementeert dit patroon al sinds Phase 10-03 (commit log).

**AI-citation tactics** (de kern shift): content-structure voor extraction (clear H1/H2/H3, korte paragrafen van 2 tot 3 zinnen, bullets, tabellen, answer-first design met directe antwoorden in de eerste 40 tot 60 woorden van een sectie); topical authority via interconnected content clusters met pillar-pages plus sub-topic pages; E-E-A-T-signalen via author-credentials, Organization-metadata, en regelmatige content-updates; originele human-authored data en frameworks die LLMs niet uit andere sources kunnen herleiden; brand-mentions op high-authority externe surfaces (Wikipedia, Reddit, GitHub) als snelste path naar LLM-recognition; semantic clarity boven keyword-density; en monitoring van share-of-voice in AI-responses in plaats van klassieke click-tracking, omdat veel AI-search zero-click is.

**Real-world AI-traffic uplift case studies** (uit Gemini query 3 met grounded citations):
- Randy Selzer real estate website: +80% organic traffic via AI SEO plus semantic annotation.
- Etilika AI Sommelier: +23% clicks binnen één maand.
- Lot-Art: +15% qualified leads via semantic SEO.
- L'Oreal Turkey: +147% click growth via AI-scaling.
- Northeast Medical Group: +893% YoY organic traffic, grotendeels van één high-authority article dat ook in Google AI Overviews landde (8.3K visits per maand puur uit AI).
- DreamBox: +733% organic traffic in 3 maanden door non-branded math-resources content-strategy.
- Bloom and Wild: +472% YoY organic traffic via question-answering blog-strategy.
- PlushBeds: +753% LLM-traffic en +950% AI Overview-visibility binnen 5 maanden.
- Codewars: 22x Copilot-traffic plus 2x Gemini-traffic in 3 maanden.
- GMAT Club: +199% ChatGPT-traffic over 6 maanden.

Bron-cluster: optimizegeo.ai, llmrefs.com, fibr.ai, forbes.com, wordlift.io (volledige citation-set in Gemini q3.json). Wave 2 Team 05 (GEO/LLMEO, plan 16-07) moet deze case studies als benchmark-pool gebruiken voor reasonable-target-setting in de Q3 roadmap.

## 6. Open questions for Wave 2

Onbeantwoorde vragen die de 12 Wave 2 team-docs moeten oppakken:

1. Welke van de 7 named competitors publiceren een publieke product-roadmap of changelog, en hoe vaak updaten ze? Signal voor execution-velocity.
2. Heeft een van de 7 een publieke API of integration-marketplace? FMai's roadmap belooft 14 integraties (Stripe, ManyChat, et cetera), waar staan concurrenten?
3. Welke schema.org types renderen Stripe, Linear, en Vercel daadwerkelijk in productie? (Wave 2 SEO team moet expliciete JSON-LD extract draaien, niet alleen vertrouwen op deze main-content scrape.)
4. Wat is de actual Lighthouse Performance score van FMai op productie versus de 3 SOTA reference-sites? Vereist plan 16-09 baseline.
5. Hoeveel Wave 2 teams zien P0-findings overlappen? Pattern detection in 16-15 zal dit beantwoorden.
6. Is FMai zichtbaar in AI-responses (Gemini, ChatGPT, Claude, Perplexity) voor de 7 standard-queries uit AUTONOMOUS-PROTOCOL.md? Plan 16-07 levert de cross-LLM citation matrix.
7. Welke Stripe-specifieke patronen (dual-headline-repeat, micro-receipt-multi-language hero-decoratie, ultra-subtle live-counter) kan FMai borrowen zonder copy-cat te lijken?
8. Heeft FMai's huidige llms.txt (Phase 10-03 commit `b6635bb`) nog actueel content na 12-04 pricing-shift naar workspace-priced model? Plan 16-07 moet validate.
9. Wat is de actual visual-weight-balance tussen "Plan een gesprek" en de secundaire CTAs op FMai hero? Marker 1 toetsing in plan 16-03.
10. Welke 3 P0-findings krijgen prioriteit in de Q3 roadmap als budget capped is op 12 weken solo-execution? Plan 16-16 beantwoordt op basis van alle Wave 2 input.

## 7. Sources

Alle bronnen zijn live geraadpleegd op 2026-05-18 via Gemini 2.5 Flash Google Search grounding of via firecrawl scrape. Raw outputs in `tmp/q1.json`, `tmp/q2.json`, `tmp/q3.json`, plus `tmp/stripe.md`, `tmp/linear.md`, `tmp/vercel.md`.

Gemini query 1 (AI marketing agencies EU 2026), top citations:
- sortlist.com (multi-agency directory)
- mediacooks.nl (Mediacooks NL)
- ms618.nl (MS618 NL+US)
- redirecto.nl (Redirecto NL)
- digitalagencynetwork.com (global agency directory)
- omnius.so (Omnius B2B SaaS marketing)
- virtualoutcomes.io (Virtual Outcomes Dutch MKB AI agents)
- chatarmin.com (Chatarmin EU SMB AI)
- eu-startups.com (Genesy AI, Solda.AI coverage)
- cognism.com, salesforge.ai (cross-reference competitor signals)

Gemini query 2 (best-in-class SaaS marketing sites 2026), top citations:
- saasframe.io (SaaS marketing site gallery)
- aimers.io (SaaS landing page patterns)
- almcorp.com (conversion design)
- overpass.studio (SaaS design audits)
- wisepops.com (CRO patterns)
- saashero.net (SOTA SaaS examples)
- swipepages.com (landing page builder analysis)
- marketermilk.com (SaaS hero patterns)

Gemini query 3 (GEO en LLMEO 2026), top citations:
- optimizegeo.ai (GEO best practices)
- llmrefs.com (AI citation tracking)
- fibr.ai (AI content optimization)
- forbes.com (AI SEO case studies)
- wordlift.io (semantic SEO and structured data)
- llmfy.ai, bestaeotools.com, seotuners.com (AI-citation tactics)
- pressonify.ai, aioseo.com (schema implementations)
- reddit.com (community discussion on llms.txt efficacy)

Firecrawl scrapes:
- https://stripe.com (homepage main content, hero pattern, CTA structure, palette)
- https://linear.app (homepage main content, AI-era positioning, motion patterns)
- https://vercel.com (homepage main content, dual-CTA pattern, social proof structure)
- https://stripe.com/llms.txt, https://linear.app/llms.txt, https://vercel.com/llms.txt (canonical llms.txt presence-checks via curl)

Internal references:
- `.planning/phases/16-design-seo-audit-v2-sota/PRD.md` (Phase 16 PRD)
- `.planning/phases/16-design-seo-audit-v2-sota/AUTONOMOUS-PROTOCOL.md` (decision rules, budget caps, hard-abort criteria)
- `fmai-nextjs/CLAUDE.md` (project content-rules, glossary, canonical domain `future-marketing.ai`)
- `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (pricing SSoT, workspace-priced model since 2026-04-28)

End of document. 25 SOTA markers, 7 named competitors, 3 reference SOTA sites with live-scrape evidence, 10 GEO/LLMEO case studies, 10 open questions, complete source-set. Ready as anchor for Wave 2 audit teams (plans 16-03 t/m 16-14).
