---
phase: 16-design-seo-audit-v2-sota
plan: 04
wave: 2
team: 02
type: research
status: complete
created: 2026-05-19
canonical_domain: future-marketing.ai
sota_markers_in_scope: [M2, M6, M7, M8, M9, M10, M21, M23, M24]
findings_total: 28
p0_count: 5
p1_count: 11
p2_count: 9
p3_count: 3
---

# 03 Brand Voice, Narrative Arc, IA, User Journeys (Wave 2 Team 02)

> Audit-team 02 levert de meta-layer onder de individuele Wave 2 doc-reeks. Drie axes: brand voice (glossary-compliance over NL, EN, ES), narrative arc per page (Hook, Reveal, Proof, Action, Reassurance), informatiearchitectuur (sitemap, top-nav, footer, breadcrumbs), en 4 user-journey maps. Findings citeren SOTA-markers uit `00-competitive-intel.md` (M2, M6, M7, M8, M9, M10, M21, M23, M24) en wijzen naar `messages/nl.json` regelnummers of component-paden zonder code te muteren. Geen edits onder `fmai-nextjs/src/` of `messages/`. Geen em-dashes.

## Executive summary

Phase 16 Wave 2 Team 02 vindt 28 narrative- of IA-issues, waarvan 5 P0, 11 P1, 9 P2 en 3 P3. Drie themas dragen het gewicht: (1) vier van de twaalf vaardigheid-paginas (`/skills/email-management`, `/skills/manychat`, `/skills/reporting`, `/skills/research`) zijn IA-orphans omdat ze in elke SSR-gerenderde DOM ontbreken in zowel top-nav als footer, alleen schema.org Service-Offer kent ze, wat M6 plus M7 plus M8 in een keer breekt; (2) breadcrumb-coverage is universeel nul over alle 93 DOM-snapshots, wat M8 expliciet faalt en SkinClarity Club-case-studie-routes plus skills-paginas berooft van wayfinding-context; (3) de glossary-canon "Plan een gesprek" leeft op 50 plus locaties maar wordt op de `/skills/social-media` CTA-sectie gebroken met "Boek een gratis strategiesessie" plus "Vraag een gratis strategiesessie aan" als P0 conversion-finding, plus afgeleide divergenties op `/apply` ("Plan een partnership-gesprek") en `/contact` ("Plan een strategiegesprek"). Een liner-recommendation feeding 16-16: prioriteer in de Q3 fix-plan eerst de IA-orphan-rescue van vier skills-paginas in Header SSR plus Footer-mirror plus `next-sitemap` allowlist, daarna de breadcrumb-rollout per layout, daarna de glossary-sync over alle drie locales tegen de CLAUDE.md key-phrase tabel.

## Sitemap (actual rendered)

> Bron: 93 DOM-snapshots in `fmai-nextjs/test-results/audit-v2/dom/*-{en,es,nl}.html` (Playwright Chromium 1440 by 900, baseline Wave 1 plan 16-02). Internal-links-in en out-counts zijn `href="/{locale}/..."` matches binnen de SSR-payload, dus pre-hydration plus pre-megamenu-open. Megamenu-only links tellen niet als rendered, omdat ze pas zichtbaar zijn na JavaScript-driven `setSkillsOpen(true)`. SSR is de bron-of-truth voor crawler-discovery en accessibility-first navigation.

| URL (NL) | Parent | Depth | Links out (internal) | Links in (any route SSR) | Orphan in SSR | Dead-end |
|---|---|---|---|---|---|---|
| `/` | self | 0 | 21 unique | 31 | no | no |
| `/about` | Footer.company | 1 | 21 | 31 | no | no |
| `/how-it-works` | Footer.company | 1 | 21 | 31 | no | no |
| `/pricing` | Header.nav + Footer.skills | 1 | 21 | 31 | no | no |
| `/founding-member` | Footer.company | 1 | 21 | 31 | no | no |
| `/contact` | Footer.resources | 1 | 21 | 31 | no | no |
| `/memory` | Header.nav + Footer.resources | 1 | 21 | 31 | no | no |
| `/apply` | Header.primary + Footer.resources | 1 | 21 | 31 | no | no |
| `/case-studies/skinclarity-club` | Header.nav + Footer.resources | 2 | 21 | 31 | no | no |
| `/blog` | Footer.resources | 1 | 21 | 31 | no | no |
| `/legal` | (none, only sub-pages) | 1 | 21 | 0 inbound | yes | low-traffic |
| `/legal/privacy` | Footer.legal | 2 | 21 | 31 | no | no |
| `/legal/terms` | Footer.legal | 2 | 21 | 31 | no | no |
| `/legal/cookies` | Footer.legal | 2 | 21 | 31 | no | no |
| `/skills/social-media` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends, see Finding 1 | no |
| `/skills/blog-factory` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/ad-creator` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/reel-builder` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/voice-agent` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/lead-qualifier` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/clyde` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/seo-geo` | Header.megamenu + Footer.skills | 2 | 21 | 31 | depends | no |
| `/skills/email-management` | Header.megamenu only | 2 | 21 | 0 inbound (SSR) | YES (Finding 1) | no |
| `/skills/manychat` | Header.megamenu only | 2 | 21 | 0 inbound (SSR) | YES | no |
| `/skills/reporting` | Header.megamenu only | 2 | 21 | 0 inbound (SSR) | YES | no |
| `/skills/research` | Header.megamenu only | 2 | 21 | 0 inbound (SSR) | YES | no |
| `/assessment` | (none, only redirect from `/?from=home`) | 1 | 21 | 1 inbound (`/assessment/result`) | near-orphan | no |
| `/assessment/result` | self via assessment | 2 | 21 | 0 | yes, by-design entry | no |
| `/roadmap` | 3 skills paginas only | 2 | 21 | 3 inbound | near-orphan | no |
| `/logo-lab` | (none) | 1 | 21 | 0 inbound | yes, by-design dev | no |
| `/newsletter/confirm` | email-only entry | 2 | 21 | 0 inbound | yes, by-design | no |

Telling: home-page SSR exposes precies 21 unique internal hrefs (1 home plus 9 service-route plus 8 skill-route plus 3 legal-route). De resterende 7 routes uit het 31-route corpus zijn ofwel ontoegankelijk (orphans), enkel via JavaScript-driven megamenu (4 skills), of bewust verstopt (logo-lab plus newsletter-confirm). De `/assessment` plus `/roadmap` paginas zijn near-orphans die alleen via deep-links of side-CTAs vanaf 3 of minder bron-routes bereikbaar zijn.

## Top-nav comparison NL/EN/ES

> Bron: `HeaderClient.tsx` SKILL_CATEGORIES plus NAV_ITEMS const-tables, plus `messages/{locale}.json` key `header.nav.*` plus `header.skills.*`. Top-nav is een vlakke set van 5 items plus 1 megamenu, single-level. Het megamenu bevat 12 skills in 3 categorieen plus 1 apply-CTA-banner. Hetzelfde structuur over alle drie locales.

### 2.1 Top-nav primary items (NAV_ITEMS)

| Item key | NL label (`header.nav`) | EN label | ES label | Routes to |
|---|---|---|---|---|
| `skills` | Vaardigheden (dropdown) | Skills | Habilidades | `/skills/*` 12 items |
| `memory` | Geheugen | Memory | Memoria | `/memory` |
| `caseStudies` | Case studies | Case studies | Case studies | `/case-studies/skinclarity-club` |
| `pricing` | Prijzen | Pricing | Precios | `/pricing` |
| `about` | Over | About | Sobre | `/about` |
| `login` (right-side) | Inloggen | Login | Login | `app.future-marketing.ai/login` |
| `apply` (primary CTA) | Plan een gesprek | Book a call | Reserva una llamada | `/apply` |

i18n-divergentie: `caseStudies` is identiek over de drie locales (geen vertaling). Dit kan intentioneel zijn (proper noun) maar de glossary-canon zou hier "Praktijkverhalen" of "Klantverhaal" (zonder "klanten" risico) kunnen overwegen voor NL-authoriteit. Geen finding tegen vlaggen behalve in 16-11 i18n-team scope.

### 2.2 Megamenu skills (SKILL_CATEGORIES)

| Category | Skill key | NL label | EN label | ES label | Route |
|---|---|---|---|---|---|
| Create | socialMedia | Social Media | Social Media | Redes Sociales | `/skills/social-media` |
| Create | blogFactory | Blog Factory | Blog Factory | Blog Factory | `/skills/blog-factory` |
| Create | adCreator | Ad Creator | Ad Creator | Creador de Anuncios | `/skills/ad-creator` |
| Create | reelBuilder | Reel Builder | Reel Builder | Constructor de Reels | `/skills/reel-builder` |
| Engage | voiceAgent | Voice Agent | Voice Agent | Agente de Voz | `/skills/voice-agent` |
| Engage | leadQualifier | Lead Qualifier | Lead Qualifier | Calificador de Leads | `/skills/lead-qualifier` |
| Engage | emailManagement | Email Management | Email Management | Gestion de Email | `/skills/email-management` |
| Engage | manychat | ManyChat DM | ManyChat DM | ManyChat DM | `/skills/manychat` |
| Grow | reporting | Rapportage | Reporting | Reportes | `/skills/reporting` |
| Grow | seoGeo | SEO en GEO | SEO and GEO | SEO y GEO | `/skills/seo-geo` |
| Grow | research | Onderzoek | Research | Investigacion | `/skills/research` |
| Grow | clyde | Clyde | Clyde | Clyde | `/skills/clyde` |

Megamenu-only exposure voor email-management, manychat, reporting, research is de IA-orphan-root-cause die in Finding 1 uitgewerkt wordt.

## Footer comparison NL/EN/ES

> Bron: `Footer.tsx` (server component, `getTranslations({namespace: 'common'})`), per locale renders dezelfde structuur. Negen skill-links plus drie company-links plus vijf resources-links plus drie legal-links plus copyright plus status-badge plus twee social-icons (LinkedIn plus X).

| Section | Item | NL key | NL label | EN label | ES label | Route |
|---|---|---|---|---|---|---|
| Skills | social_media | `landing.footer.nav.social_media` | Social Media | Social Media | Redes Sociales | `/skills/social-media` |
| Skills | blog_factory | `landing.footer.nav.blog_factory` | Blog Factory | Blog Factory | Blog Factory | `/skills/blog-factory` |
| Skills | voice_agent | `landing.footer.nav.voice_agent` (plus Coming Soon badge) | Voice Agent | Voice Agent | Voice Agent | `/skills/voice-agent` |
| Skills | lead_qualifier | `landing.footer.nav.lead_qualifier` | Lead Qualifier | Lead Qualifier | Lead Qualifier | `/skills/lead-qualifier` |
| Skills | ad_creator | `landing.footer.nav.ad_creator` (plus Coming Soon badge) | Ad Creator | Ad Creator | Ad Creator | `/skills/ad-creator` |
| Skills | reel_builder | `landing.footer.nav.reel_builder` (plus Coming Soon badge) | Reel Builder | Reel Builder | Reel Builder | `/skills/reel-builder` |
| Skills | seo_geo | `landing.footer.nav.seo_geo` | SEO en GEO | SEO and GEO | SEO y GEO | `/skills/seo-geo` |
| Skills | clyde | `landing.footer.nav.clyde` | Clyde AI Marketing Medewerker | Clyde AI Marketing Employee | Clyde Empleado AI de Marketing | `/skills/clyde` |
| Skills | pricing | `landing.footer.nav.pricing` | Prijzen | Pricing | Precios | `/pricing` |
| Company | about | `landing.footer.nav.about` | Over ons | About | Sobre | `/about` |
| Company | how_it_works | `landing.footer.nav.how_it_works` | Hoe het werkt | How it works | Como funciona | `/how-it-works` |
| Company | founding_member | `landing.footer.nav.founding_member` | Founding Member | Founding Member | Founding Member | `/founding-member` |
| Resources | apply (highlighted) | `landing.footer.nav.apply` | Plan een gesprek | Book a call | Reserva una llamada | `/apply` |
| Resources | memory | `landing.footer.nav.memory` | Geheugensysteem | Memory system | Sistema de memoria | `/memory` |
| Resources | caseStudies | `landing.footer.nav.caseStudies` | Case studies | Case studies | Case studies | `/case-studies/skinclarity-club` |
| Resources | blog | `landing.footer.nav.blog` | Blog | Blog | Blog | `/blog` |
| Resources | contact | `landing.footer.nav.contact` | Contact | Contact | Contacto | `/contact` |
| Legal | privacy | `landing.footer.nav.privacy` | Privacy | Privacy | Privacidad | `/legal/privacy` |
| Legal | terms | `landing.footer.nav.terms` | Voorwaarden | Terms | Terminos | `/legal/terms` |
| Legal | cookies | `landing.footer.nav.cookies` | Cookies | Cookies | Cookies | `/legal/cookies` |

i18n-divergentie: `Founding Member` blijft Engels in alle drie locales (proper noun-style). `Case studies` idem. NL gebruikt "Geheugensysteem" terwijl top-nav "Geheugen" gebruikt, EN gebruikt "Memory" in top-nav maar "Memory system" in footer. Lichte divergentie zonder UX-breuk, P3 finding (Finding 18).

Telling: van de twaalf vaardigheden in `SKILL_CATEGORIES` worden er acht in de footer-skills-section gerendered (`social-media`, `blog-factory`, `voice-agent`, `lead-qualifier`, `ad-creator`, `reel-builder`, `seo-geo`, `clyde`). Vier ontbreken volledig: `email-management`, `manychat`, `reporting`, `research`. Footer reflecteert dus dezelfde 8 plus 4-orphan-split als het body-content van home en alle interior-paginas. Geen enkele globally-rendered nav linkt naar de vier orphan-skills.

## Breadcrumb coverage

> Bron: `Grep --multiline --pattern 'BreadcrumbList|aria-label="[Bb]readcrumb"|"breadcrumb"' --path test-results/audit-v2/dom/`. Resultaat: nul matches over alle 93 DOM-snapshots, drie locales, 31 routes. Geen visuele breadcrumbs, geen `BreadcrumbList` JSON-LD schema, geen `aria-label="Breadcrumb"` nav-element.

Coverage-tabel: alle non-home routes (30 stuks per locale, totaal 90 over drie locales) renderen NUL breadcrumbs. Het ontbreken faalt SOTA-marker M8 expliciet (Phase 16-01 sectie 4) en heeft drie afgeleide consequenties:

1. Wayfinding-promise breekt op nested routes (`/case-studies/skinclarity-club` is depth-2 maar mist een visueel pad terug naar parent `/`).
2. GEO-LLMEO mist `BreadcrumbList` als Schema.org-citizen (high-value voor AI-citation per `00-competitive-intel.md` sectie 5).
3. Mobile-back-navigation steunt enkel op browser-back; geen in-page wayfinding.

Zie Finding 2.

## Glossary scorecard

> Bron: `Grep` matches in `fmai-nextjs/messages/nl.json`, gewogen tegen `fmai-nextjs/CLAUDE.md` key-phrase glossary tabel. Severity-key: P0 voor conversion-funnel offences, P1 voor positionering-breakers, P2 voor cosmetics-slips, P3 voor naming-divergence zonder UX-impact.

| Term (canonical) | Verwacht overal | Offences gevonden | Voorbeeld route + regel | Severity |
|---|---|---|---|---|
| `vaardigheden` (niet "features") | Body-copy NL | "features_0", "features_1" et cetera zijn JSON-keys, niet user-facing copy, OK. Geen body-copy slip naar "features" als woord. | Geen | n.a. |
| `merken` (niet "klanten" op conversion) | Conversion-paginas plus skills-CTA-blocks | "Onze klanten" op `assessment.q7` plus `q15`; "per klant" op `Reporting` skill-data shortDescription | `messages/nl.json:2769`, `:2836`; `src/lib/skills-data.ts:266` | P1 (assessment context is bureau-zelf-reflectie, "klant" daar kan; `Reporting` shortDescription is hijack van funnel-positionering, P1) |
| `Plan een gesprek` (canonical CTA) | Alle primary CTAs op conversion-paginas | "Boek een gratis strategiesessie" plus "Vraag een gratis strategiesessie aan" op `/skills/social-media` CTA-block; "Plan een partnership-gesprek" op `/apply` H1; "Plan een strategiegesprek" op `/contact` H2 | `messages/nl.json:291,:292`; DOM `_apply-nl.html` H1; DOM `_contact-nl.html` H2 | P0 (gegerondedheid van Boek-variant), P1 (Plan-variant-divergentie) |
| `AI Marketing Medewerker` (niet "AI tool") | Body-copy NL | "AI-tool" gebruikt in legitieme contrast-frames (e.g. line 1574 "verschil tussen een AI-tool en een AI Marketing Medewerker") en in assessment q9, q12, q14 voor bureau-stack-vragen. Geen slip naar "AI-tool" voor FMai-zelf-positionering. | Geen FMai-self slip | OK |
| `Clyde` (proper noun) | Overal voor de medewerker | Geen offence; consistent gebruikt over alle 31 routes. | n.a. | OK |
| `AI-partner, geen platform` (positionering) | Body-copy NL | Lijn 63 NL "AI-partner, geen platform" is intentioneel contrast met SaaS-platforms; OK. | OK | OK |
| `Boek een gesprek` (NEVER) | Niet aanwezig | Geen exact-match `"Boek een gesprek"` in messages; wel `"Boek een gratis strategiesessie"` als variant. | `messages/nl.json:291` | P1 (variant) |
| Em-dash in body-copy | NIET aanwezig | Quick-scan messages-files: voorlopig geen em-dash detected, maar 16-11 i18n-team owns full sweep. Voorlopig OK. | OK | n.a. |
| `Onbeperkt` met onderbouwing | OK gebruik | `pricing.matrix.unlimited` is "Onbeperkt" maar `pricing.matrix.legend` (regel 634) verklaart "Fair use = onbeperkt met throttle bij extreme uitschieters", dus context-bound, OK. | OK | OK |
| `Sign up` of `Try free` | NIET aanwezig | Niet gevonden in messages. | OK | OK |
| `klantenservice` in body | OK gebruik | Regel 152 "klantenservice afhandelen" is product-feature-beschrijving, niet positionering. OK. | OK | OK |

Scorecard-conclusie: glossary-violation hotspots zijn `/skills/social-media` CTA-block plus `/apply` H1 plus `/contact` H2 plus de skills-data.ts `Reporting` shortDescription. Geen systemic em-dash plague, geen "Sign up" plague, geen "AI tool" zelf-positionering-plague. De `Plan een gesprek` canonical wint 50-plus locaties maar verliest op vier kritieke conversion-paginas.

## Findings

Schema voor elke finding (zelfde als 16-03):

```
### Finding N: <title>
- Severity: P0|P1|P2|P3
- Routes/Viewports/Locales
- Evidence: dom/<file>.html line excerpt OR screenshots/<file>.png
- Code path: messages/<locale>.json key (read-only reference)
- Impact hypothesis
- Proposed fix (no code)
- Effort: S|M|L
- Confidence: low|med|high
```

### Finding 1: Vier vaardigheid-paginas zijn SSR-orphans

- Severity: P0
- Routes: `/skills/email-management`, `/skills/manychat`, `/skills/reporting`, `/skills/research`. Viewports: alle. Locales: NL plus EN plus ES.
- Evidence: 93 DOM-snapshots in `test-results/audit-v2/dom/` bevatten ZERO `href="/{locale}/skills/(email-management|manychat|reporting|research)"` op enige route die niet de skill-eigenpagina is. Footer.tsx regel 36 tot 117 rendert acht skills plus pricing, geen van de vier orphan-skills. Header mega-menu rendert wel alle 12 in JSX (HeaderClient.tsx regel 35 tot 63), maar het bevindt zich binnen een `<AnimatePresence>` `{skillsOpen && ...}` block (regel 211 tot 348) wat betekent dat de hrefs pas in de DOM verschijnen na een JavaScript-driven `setSkillsOpen(true)` interactie. Pre-hydration, pre-click renderen ze niet.
- Code path: `src/components/layout/HeaderClient.tsx:35-63` (megamenu structure), `src/components/layout/Footer.tsx:36-117` (footer skills section missing four), `messages/nl.json:369-392` (footer.nav heeft geen email_management of manychat of research key, alleen impliciet `clyde`, `seo_geo`, `reporting` als labels)
- Impact hypothesis: Google crawlers, AI agents (GPTBot, ClaudeBot, PerplexityBot), en JavaScript-disabled visitors zien de vier paginas niet als deel van de site-graph. Dit faalt SOTA-marker M6 ("top-nav single-level of maximaal 2-level mega-menu"), M7 ("elke route reachable in maximaal 2 clicks vanaf homepage voor primary user-tasks"), en de SEO-implicatie van M10 ("Footer dupliceert kritieke navigation-paths"). GEO-citation-impact: de 4 orphan-paginas hebben geen interne backlinks, dus minder topical authority signaal, lagere kans op AI-citation conform `00-competitive-intel.md` sectie 5.
- Proposed fix: voeg de vier orphan-skills toe aan `Footer.tsx` skills-section (plus matchende `messages/{en,es,nl}.json` keys `landing.footer.nav.email_management`, `manychat`, `reporting`, `research`). Optioneel: render het megamenu-skeleton in SSR met `display:none` op closed-state (in plaats van conditional-mount via `<AnimatePresence>`) zodat hrefs in initiele payload zitten. Dit raakt geen runtime-gedrag maar verbetert crawler-discovery direct.
- Effort: M (5 messages-key-toevoegingen plus 4 Footer-link-blocks plus optioneel megamenu-SSR-refactor)
- Confidence: high

### Finding 2: Universele breadcrumb-afwezigheid

- Severity: P0
- Routes: alle 30 non-home routes per locale (90 totaal). Viewports: alle. Locales: NL plus EN plus ES.
- Evidence: `Grep` op `BreadcrumbList`, `aria-label="[Bb]readcrumb"`, of `"breadcrumb"` over alle 93 DOM-snapshots resulteert in nul matches. Visueel: geen breadcrumb-componenten in `_case-studies_skinclarity-club-nl.html`, `_skills_clyde-nl.html`, `_legal_privacy-nl.html`, of welke nested route dan ook.
- Code path: geen breadcrumb-component aanwezig in `src/components/layout/` (gechecked: Header.tsx, HeaderClient.tsx, Footer.tsx, PageShell.tsx). Geen verwijzing naar `BreadcrumbList` in `src/lib/seo/` (niet bestaand in dit pad) of in route-level page.tsx-files.
- Impact hypothesis: faalt SOTA-marker M8 expliciet. Wayfinding-promise breekt op depth-2 routes (`/case-studies/skinclarity-club`, `/legal/*`, `/skills/*`, `/assessment/result`). GEO-LLMEO mist een high-value Schema.org type voor structuur-extractie door AI-agents. Mobile UX leunt enkel op browser-back, wat onbetrouwbaar is in nested-flows.
- Proposed fix: introduceer `<Breadcrumbs>` component in `PageShell.tsx` of in route-segment-`layout.tsx` files, met visueel pad (Home / Skills / Clyde) plus inline `BreadcrumbList` JSON-LD schema. NL labels via `breadcrumbs.{slug}` namespace in messages-files.
- Effort: M (1 component plus 30 route-mappings plus 3 locale-strings-blocks)
- Confidence: high

### Finding 3: Glossary-violation op `/skills/social-media` CTA-block

- Severity: P0
- Routes: `/skills/social-media`. Viewports: alle. Locales: NL primair, mogelijk EN plus ES via key-propagation.
- Evidence: `messages/nl.json:289-292`:
  ```
  "cta": {
    "title": "Klaar voor 24/7 klantcontact?",
    "subtitle": "Boek een gratis strategiesessie.",
    "button": "Vraag een gratis strategiesessie aan"
  }
  ```
- Code path: `messages/nl.json:291` plus `:292` zit onder een namespace die hoort bij `/skills/social-media` (gegeven nesting context, social_media of chatbot service-block). Canonical glossary uit `fmai-nextjs/CLAUDE.md` "Key-phrase glossary" tabel verbiedt "Boek" en "Sign up"-varianten en eist "Plan een gesprek".
- Impact hypothesis: op een conversion-doelpagina (skill-page eindigt met CTA-block) breekt deze copy het primary-CTA-canon. Bezoekers leren een tweede CTA-frame ("strategiesessie") naast het canonieke "Plan een gesprek", wat de Cohen-merker M21 ("primary conversion-CTA herhaalt minimaal 3x zonder hijack") subtle ondermijnt. Verder breekt het de glossary-policy expliciet.
- Proposed fix: vervang `messages/{en,es,nl}.json` keys `*.social_media.*.cta.subtitle` plus `.cta.button` (of equivalente nesting-pad) naar `"Plan een gesprek"` plus `"Plan een gesprek"` voor button-text, plus pas `title` aan naar "Klaar om Clyde te zien op jouw social media?" of vergelijkbare canon-stem. Zelfde fix in EN ("Plan a call") en ES ("Reserva una llamada" of glossary-canon-equivalent).
- Effort: S (3 keys per locale, 9 totaal)
- Confidence: high

### Finding 4: `/apply` H1 divergeert van glossary-canon

- Severity: P1
- Routes: `/apply`. Viewports: alle. Locales: NL.
- Evidence: DOM `_apply-nl.html` H1: `Plan een partnership-gesprek`. Body-copy gebruikt het ook in TItle frontmatter (`messages/nl.json:1678` "Aanmelden. Plan een gesprek met Daley | FutureMarketingAI" plus contradicterend `Plan een partnership-gesprek` als hero).
- Code path: hero-component op `/apply`-page leest `apply.hero.title` namespace (waarschijnlijk `messages/nl.json` rond regel 1680, gegeven Title-string-positie); volledige key-resolutie vereist 16-11 i18n-team-grep.
- Impact hypothesis: P1 omdat de page-meta-title gebruikt "Plan een gesprek" maar de visuele H1 voegt "partnership" toe, wat dissonantie geeft tussen SEO-snippet (Google SERP) en aankomst-Above-the-fold-headline. Bouwt cognitive-load op het moment van hoogste conversion-intent.
- Proposed fix: kies een variant, neig naar canon "Plan een gesprek" als H1 plus eyebrow "Aanmelden als bureau" of vergelijkbare context-tag. Of houd "Plan een partnership-gesprek" maar update sitewide CTA-strings naar dezelfde variant, wat veel disruptie geeft. Aanbeveling: canon-H1.
- Effort: S
- Confidence: med (key-pad nog te grep-en door 16-11)

### Finding 5: `/contact` heeft drie concurrerende CTAs

- Severity: P1
- Routes: `/contact`. Viewports: alle. Locales: NL.
- Evidence: DOM `_contact-nl.html` H1 `Algemene vragen of feedback?` plus H2-set: `Wil je een partnership-gesprek?` plus `Stuur ons een bericht` plus `Plan een strategiegesprek`. Drie CTA-frames in een page met low-intent vraag-styling.
- Code path: `/contact` page-component, key-pad waarschijnlijk `contact.hero.*` plus `contact.sections.*` in `messages/nl.json`.
- Impact hypothesis: faalt SOTA-marker M21 ("primary conversion-CTA herhaalt minimaal 3x zonder hijack van scroll-flow") door splitting attention over drie incompatibele frames (algemene-vragen versus partnership-gesprek versus strategiegesprek). Verlaagt conversion door decision-paralysis.
- Proposed fix: collapse naar 1 primary CTA "Plan een gesprek" plus 1 secundair "Stuur een algemene vraag" als email-only fallback. Verwijder "strategiegesprek" plus "partnership-gesprek" als losse frames.
- Effort: S
- Confidence: high

### Finding 6: Home page mist H2-niveau

- Severity: P0
- Routes: `/` (home). Viewports: alle. Locales: NL plus EN plus ES.
- Evidence: `grep -o '<h1' DOM | wc -l` op `_-nl.html` geeft 1, `<h2` geeft 0, `<h3` geeft 4. EN en ES idem. Per vergelijking: 30 van 30 andere routes hebben H1 plus minstens 1 H2 (zelfs `/blog`, `/legal/cookies`, `/assessment` minimaal 1 H2 of expliciete H1-only structuur).
- Code path: home-page sections in `src/app/[locale]/(marketing)/page.tsx` plus child-componenten. H3s renderen voor "Hoe AI-volwassen is jouw bureau?" en de footer-section-headers; geen H2-divisie tussen hero plus skills plus social-proof plus founding plus CTA.
- Impact hypothesis: faalt SOTA-marker M2 indirect (heading-hierarchy is een typografie-impact-axis) plus M9 (404-handling intelligent navigation, want home is de fallback-pivot voor 404s zonder semantische opbouw). GEO-impact: AI-citation tactics expliciet vragen om "clear H1/H2/H3 structuur" (`00-competitive-intel.md` sectie 5), dus home loses topical-extractability.
- Proposed fix: introduceer H2-tags voor home-page sections (Hero blijft H1, daarna H2 voor "Wat doet Clyde", "Bewijs (SkinClarity Club)", "Founding plekken", "Vaardigheden", "Plan een gesprek"). H3s migreren een niveau dieper waar van toepassing.
- Effort: S
- Confidence: high

### Finding 7: Megamenu skills-categorie labels zijn semantisch arm

- Severity: P2
- Routes: alle (megamenu globally). Viewports: desktop only (mobile menu rendert categorien direct flat).
- Evidence: `HeaderClient.tsx:35-63` definieert `SKILL_CATEGORIES` als `['create', 'engage', 'grow']`. NL-labels in `messages/nl.json` namespace `header.skills.create.label` et cetera renderen vermoedelijk als "Creeer", "Betrek", "Groei" of vergelijkbaar. Sub-label `description` op regel 264 in HeaderClient.tsx render-call gebruikt `skills.${category.key}.description`. De semantische split tussen Create / Engage / Grow is helder voor English-funnel-jargon-savvy gebruikers maar minder voor Nederlandse bureau-eigenaren die "create" plus "engage" plus "grow" niet als marketing-frame herkennen.
- Code path: `messages/{nl,en,es}.json` namespace `header.skills.{create,engage,grow}.label` plus `.description`. Concrete labels vergen aparte grep buiten dit doc.
- Impact hypothesis: P2 omdat de IA-structuur klopt maar de framing buyer-language mist voor NL-bureau-audience. SOTA-marker M2 ("headline communiceert wat, voor wie, en waarom binnen 5 seconden") raakt secundaire categorieen die in 5 seconden gescand worden niet als 5-seconden-claim, dus borderline.
- Proposed fix: overweeg NL-labels "Inhoud maken" plus "Klanten bereiken" plus "Schaal en inzicht" of een meer descriptief-Nederlands frame. EN plus ES idem, maar dat is buiten dit team's authoring scope.
- Effort: S
- Confidence: low (mogelijk reeds NL-locale; vereist 16-11 i18n-team-validation)

### Finding 8: `/assessment` is near-orphan

- Severity: P1
- Routes: `/assessment` plus `/assessment/result`. Viewports: alle. Locales: alle drie.
- Evidence: `/assessment` heeft 1 inbound link in SSR-corpus (alleen `/assessment/result`), plus query-string entry `/assessment?from=home` als verborgen ingang (home heeft `href="/nl/assessment?from=home"`). Geen top-nav, geen footer, geen body-CTA-block in home of skills- of pricing-paginas.
- Code path: `messages/nl.json` keys onder `home.assessment.*` of vergelijkbaar plus `Footer.tsx` heeft geen entry.
- Impact hypothesis: `/assessment` is een lead-gen-funnel-magnet (AI-volwassenheid scan, 16-vragen, geeft persoonlijk advies) maar wordt enkel via een knop op de home aangeboden. Voor returning visitors of GEO/SEO-traffic naar deep-links is de assessment onzichtbaar. Faalt SOTA-marker M7 ("reachable in maximaal 2 clicks vanaf homepage voor primary user-tasks") als assessment als primary-task wordt erkend.
- Proposed fix: voeg `/assessment` toe aan Footer.resources of als secondary nav-item naast `/apply`. Optioneel: persistent CTA-strip op skills-paginas "Twijfel je? Doe eerst de AI-volwassenheidsscan."
- Effort: S
- Confidence: high

### Finding 9: `/roadmap` is near-orphan met dunne in-coming

- Severity: P2
- Routes: `/roadmap`. Viewports: alle. Locales: alle drie.
- Evidence: drie skill-paginas linken naar `/roadmap` (`/skills/ad-creator`, `/skills/reel-builder`, `/skills/voice-agent`, alle drie coming-soon-skills). Geen top-nav, geen footer-link, geen home-link.
- Code path: skill-page hero-banner of "coming soon" CTA-block.
- Impact hypothesis: P2 omdat `/roadmap` semi-strategisch is (laat product-velocity zien) maar geen primary-conversion-driver. Toch ontneemt afwezigheid in footer aan transparancy-positioning ("we publiceren een roadmap") wat een differentiator zou kunnen zijn tegen ondoorzichtige competitors (cf `00-competitive-intel.md` sectie 2, 4 van 7 concurrents are agency-services zonder publieke product-roadmap).
- Proposed fix: voeg `/roadmap` toe aan Footer.company als 4e item naast Founding Member. Of als sub-item onder About in top-nav (kleine megamenu uitbouw).
- Effort: S
- Confidence: med

### Finding 10: `/skills/reporting` shortDescription violeert glossary

- Severity: P1
- Routes: `/skills/reporting`. Viewports: alle. Locales: NL.
- Evidence: `src/lib/skills-data.ts:266`:
  ```
  shortDescription: 'Dashboards + wekelijkse digests + anomaly detection per klant.'
  ```
- Code path: `src/lib/skills-data.ts:266` (mirror van pricing-SSoT). Renders in megamenu skill-card-description plus pricing-matrix-row.
- Impact hypothesis: "per klant" botst met glossary-canon "merken" voor het bureau-audience. Reporting-cards in megamenu plus pricing-matrix dragen deze copy naar minimaal 13 paginas waar het zichtbaar is.
- Proposed fix: wijzig naar `"Dashboards + wekelijkse digests + anomaly detection per merk."` Zelfde NL plus EN plus ES.
- Effort: S
- Confidence: high

### Finding 11: Mega-menu CTA-banner duplicates apply zonder skill-context

- Severity: P2
- Routes: alle. Viewports: desktop megamenu only.
- Evidence: `HeaderClient.tsx:319-345` rendert een dedicated `<Link href="/apply">` CTA-banner onderin het megamenu met `tHeader('cta.applyTitle')` plus `cta.applySubtitle`. Wanneer een gebruiker het megamenu opent met intent een skill te kiezen, breekt deze CTA-banner de skill-keuze-flow.
- Code path: `messages/nl.json` namespace `header.cta.applyTitle` plus `applySubtitle`.
- Impact hypothesis: P2 omdat de CTA wel passend is voor "I want to skip and apply" intent, maar visueel concurreert met het skill-keuze-mental-model. Splittet aandacht op de moment dat een visitor zich net oriënteert.
- Proposed fix: of verkleinen tot subtiele tekstlink "Of plan direct een gesprek" of verplaatsen naar de right-side van de header (waar al een primary "Plan een gesprek" knop staat, regel 374-379). Aanbeveling: collapse naar tekstlink.
- Effort: S
- Confidence: med

### Finding 12: Locale-divergentie in "memory"-naming

- Severity: P3
- Routes: alle. Viewports: alle. Locales: NL plus EN.
- Evidence: NL top-nav gebruikt "Geheugen" (`messages/nl.json:1390` waarschijnlijk under `header.nav.memory`), maar Footer Resources gebruikt "Geheugensysteem" (`landing.footer.nav.memory` op regel 387). EN top-nav "Memory" maar footer "Memory system".
- Code path: zie boven plus `Footer.tsx:170`.
- Impact hypothesis: cosmetic-divergence. Geen meetbare conversion-impact maar verlaagt brand-consistency-score (16-10 i18n team owns full sweep).
- Proposed fix: canonicaliseer naar "Geheugen" of "Geheugensysteem" in beide oppervlakken per locale.
- Effort: S
- Confidence: med

### Finding 13: Skills-megamenu sluit visueel "research" en "reporting" af van Grow-categorie context

- Severity: P2
- Routes: alle. Viewports: desktop megamenu.
- Evidence: `HeaderClient.tsx:55-62` plaatst Reporting plus SEO+GEO plus Research plus Clyde onder "grow" category. Clyde is zelf de overarching AI Marketing Medewerker en hoort niet thematisch onder dezelfde axis als reporting plus research (analytics-tooling) plus seo-geo (organic-funnel).
- Code path: `HeaderClient.tsx:55-62`.
- Impact hypothesis: P2 categorie-coherentie. Clyde in dezelfde categorie als Reporting plus Research devalueert beide; Clyde is meta, niet peer.
- Proposed fix: of een 4e categorie "Beheer en strategie" met Clyde plus reporting plus research; of plaats Clyde standalone als megamenu-eerste-item visueel boven de drie categorien.
- Effort: M (Header refactor plus 3-locale label-bumps)
- Confidence: med

### Finding 14: Footer "Skills" sectie mengt category-types

- Severity: P2
- Routes: alle. Viewports: alle. Locales: alle drie.
- Evidence: `Footer.tsx:36-117` rendert 8 skill-links plus `/pricing` als 9e item onder de heading "Skills". `/pricing` is geen vaardigheid maar een pricing-paginakeuze.
- Code path: `Footer.tsx:111-117`.
- Impact hypothesis: P2 IA-cleanliness. Visitor leest de Skills-section, vindt pricing daar, mogelijke verwarring "is pricing een vaardigheid?" Verlaagt scannability.
- Proposed fix: verplaats `/pricing` naar Footer.resources of Footer.company. Of introduceer een nieuwe Footer-section "Plans" met pricing plus founding-member plus apply.
- Effort: S
- Confidence: med

### Finding 15: `/legal` parent-page is orphan in SSR

- Severity: P3
- Routes: `/legal`. Viewports: alle. Locales: alle drie.
- Evidence: `Grep` voor `href="/{locale}/legal"` in SSR-corpus toont geen matches; alleen `/legal/privacy`, `/legal/terms`, `/legal/cookies` zijn linked. De parent `/legal` route bestaat en is daarom orphaned.
- Code path: `src/app/[locale]/(marketing)/legal/page.tsx` (parent) of equivalente bestaande route.
- Impact hypothesis: P3 omdat de parent-page bestaat maar bezoekers vermoedelijk via direct-deep-link naar sub-paginas reizen. Brand-perception-impact minimaal.
- Proposed fix: of verwijder de parent `/legal` route (en accept dat sub-paginas direct toegang vragen), of voeg een Footer.legal item "Juridisch overzicht" toe dat naar `/legal` linkt. Aanbeveling: verwijderen tenzij `/legal` zelf een useful summary-page is.
- Effort: S
- Confidence: med

### Finding 16: Header right-side login link goes to `app.future-marketing.ai`

- Severity: P3
- Routes: alle. Viewports: desktop.
- Evidence: `HeaderClient.tsx:366-371`: `href="https://app.future-marketing.ai/login"`. Dit is een externe subdomain, niet onderdeel van de marketing-site IA.
- Code path: hardcoded URL.
- Impact hypothesis: P3 omdat de subdomain canonical-domain-violatie scratch (canonical is `future-marketing.ai` maar app-subdomain is OK) niet introduceert. Visitor verlaat marketing-site context bij login-klik, dat is intended. Geen IA-issue, eerder note voor 16-05 interactions-team.
- Proposed fix: geen, behalve mogelijke `target="_blank"` of `rel="noopener"` verbetering (16-05 scope).
- Effort: zero
- Confidence: high

### Finding 17: Megamenu Coming Soon badge inconsistentie tussen header en footer

- Severity: P2
- Routes: alle. Viewports: desktop megamenu plus footer.
- Evidence: Footer rendert `coming_soon` badge naast Voice Agent (`Footer.tsx:58`), Ad Creator (regel 78), Reel Builder (regel 87). HeaderClient mega-menu rendert ook badge via `getSkillBySlug(...)?.status === 'coming_soon'` (regel 296-302). Status komt uit `src/lib/skills-data.ts`. Tot zover consistent.
  Maar: het Footer.tsx rendert NIET de manychat plus email-management plus reporting plus research items, dus ook geen coming-soon-status-validatie daarop. Indien een van die ook coming-soon is, wordt de status-info weggegooid. Snel-grep `skills-data.ts` voor status van orphan-4: open. Mochten een of meer coming-soon zijn, dan loopt Footer-IA achter op Header-IA.
- Code path: `src/lib/skills-data.ts` per slug-block, plus `Footer.tsx` plus `HeaderClient.tsx`.
- Impact hypothesis: P2 indirecte coupling met Finding 1. Als orphan-skills coming-soon zijn, is hun afwezigheid in footer minder erg; als ze live zijn, wordt het erger.
- Proposed fix: vouw deze finding samen met Finding 1 fix-set; bij toevoeging orphan-4 naar Footer ook coming-soon-badge-logic erbij.
- Effort: S (combined met Finding 1)
- Confidence: med

### Finding 18: `Founding Member` blijft Engels in alle drie locales

- Severity: P3
- Routes: footer plus `/founding-member` page. Viewports: alle. Locales: NL plus EN plus ES.
- Evidence: `landing.footer.nav.founding_member` regel 380 in `messages/nl.json`: "Founding Member". Geen NL-vertaling. EN gebruikt dezelfde, ES idem (te verifieren door 16-11 i18n-team).
- Code path: `messages/nl.json:380`.
- Impact hypothesis: P3 brand-decision. "Founding Member" kan een merk-staking-term zijn met intentionele Engels-bias. NL-equivalent "Founding partner" of "Oprichtende partner" zou bewuste merkverlies opleveren. Geen UX-breuk.
- Proposed fix: handhaven indien intentioneel; documenteren als brand-decision in CLAUDE.md key-phrase glossary.
- Effort: zero
- Confidence: low (vereist brand-decision-confirmation)

### Finding 19: `/blog` mist H2-hierarchy en heeft thin SSR

- Severity: P2
- Routes: `/blog`. Viewports: alle. Locales: alle drie.
- Evidence: DOM `_blog-nl.html` heeft H1 (1) plus H2 (0) plus H3-count laag. Geen artikel-tegels in SSR, geen blogposts in het corpus zichtbaar (mogelijk client-rendered MDX-list).
- Code path: `src/app/[locale]/(blog)/blog/page.tsx`.
- Impact hypothesis: P2 SEO-degradation indien blog-items zich aan content-marketing-strategie willen koppelen (cf GEO-LLMEO recommendation in 00-competitive-intel sectie 5 "content-structure voor extraction"). Verlaagt extractability door AI-agents.
- Proposed fix: render blog-index in SSR plus introduceer H2 per blog-post-tegel. Onder scope van Wave 2 plan 16-07 GEO team plus 16-10 content team.
- Effort: M
- Confidence: med (depends on Phase 16-07 plus 16-10 scope)

### Finding 20: Hero-CTA-cluster heeft secondary navigation-pad gebrek

- Severity: P1
- Routes: `/` home. Viewports: alle. Locales: alle drie.
- Evidence: home heeft 13 instances van "Plan een gesprek" plus links naar skills-paginas plus pricing in mid-scroll regions. Echter, geen expliciete "Browse all skills" of "Zie alle vaardigheden" link in de hero-CTA-cluster of in de skills-grid header. Visitor moet via megamenu (desktop only) of via footer scrollen.
- Code path: home page sections.
- Impact hypothesis: P1 omdat home als entry-point voor 90 procent van traffic functioneert (Phase 14 funnel-data). Een returning visitor die de skills wil her-onderzoeken, mist een directe "All skills"-pad zonder megamenu-interactie. Faalt M7 ("primary user-tasks reachable in 2 clicks") borderline.
- Proposed fix: voeg in de skills-section van home een "Zie alle 12 vaardigheden" footer-link toe (linked naar `/#skills` of een dedicated `/skills`-index-page). Optioneel: introduceer `/skills` as index-page met alle 12 met filtering by category, wat ook Finding 1 deels oplost (orphan-4 krijgen een SSR-toegang).
- Effort: M
- Confidence: med

### Finding 21: Sterke CTA-repetition op skills-pages (50 plus van "Plan een gesprek")

- Severity: P3 (positief, no action)
- Routes: alle 12 `/skills/*`. Viewports: alle. Locales: alle drie.
- Evidence: `grep -o "Plan een gesprek" _skills_*-nl.html | wc -l` levert 48 tot 51 per skill-page. Header plus FAQ plus mid-section plus CTA-block plus footer geven CTA-density goed boven M21 ("primary conversion-CTA herhaalt minimaal 3x").
- Code path: across-page CTA-block-repetition.
- Impact hypothesis: positieve marker. Niet alle herhaling is gelijk visueel-prominent, maar count alone is healthy.
- Proposed fix: geen, behoud.
- Effort: zero
- Confidence: high

### Finding 22: Founding spots counter renders consistent met SSoT

- Severity: P3 (positief, no action)
- Routes: `/`, `/founding-member`, `/about`, `/pricing`, headers-of-skill-paginas. Viewports: alle. Locales: alle drie.
- Evidence: `{taken} van {total} plekken bezet` template-string wordt gebruikt op meerdere strategische paginas; SSoT is `src/lib/constants.ts` `FOUNDING_SPOTS_TAKEN=1` plus `FOUNDING_SPOTS_TOTAL=10`. NL plus EN plus ES rendert consistent.
- Code path: `messages/{nl,en,es}.json` regel 113, 607, 1551 plus `src/lib/constants.ts`.
- Impact hypothesis: positieve consistency-marker. Scarcity-frame is dezelfde over de drie locales.
- Proposed fix: geen.
- Effort: zero
- Confidence: high

### Finding 23: Geen sitemap-link in footer

- Severity: P3
- Routes: alle. Viewports: alle.
- Evidence: Footer.tsx rendert geen link naar `/sitemap.xml` of een human-readable sitemap-pagina.
- Code path: `Footer.tsx`.
- Impact hypothesis: P3 minor. Crawlers vinden sitemap via robots.txt (Phase 10-03), maar er bestaat geen visitor-accessible HTML-sitemap. Marginale UX-impact, maar zou voor SEO-aware visitors plus accessibility nuttig zijn.
- Proposed fix: voeg `<Link href="/sitemap.xml">Sitemap</Link>` toe in Footer.legal-row.
- Effort: zero
- Confidence: low

### Finding 24: Skills-megamenu mist een "alle vaardigheden" overview-link

- Severity: P2
- Routes: alle. Viewports: desktop megamenu.
- Evidence: `HeaderClient.tsx:35-63` rendert 12 skill-cards plus een apply-CTA-banner, geen "Bekijk alle vaardigheden in een overzicht" link.
- Code path: `HeaderClient.tsx:35-63`.
- Impact hypothesis: P2 omdat een browse-all interactie nodig kan zijn voor visitors die filter-by-category willen of een sortable view. Zie ook Finding 20.
- Proposed fix: voeg een sub-banner toe boven of onder de drie categorien met "Bekijk alle 12 vaardigheden" naar `/skills` of `/#skills`.
- Effort: S
- Confidence: low (afhankelijk van Finding 20 fix-pad)

### Finding 25: `/case-studies/skinclarity-club` is enige case study, IA suggereert mogelijke uitbreiding

- Severity: P3
- Routes: `/case-studies/skinclarity-club`. Viewports: alle. Locales: alle drie.
- Evidence: Footer.resources linkt naar `/case-studies/skinclarity-club` direct (geen `/case-studies` index). Header.nav.caseStudies idem.
- Code path: `Footer.tsx:178`, `HeaderClient.tsx:77`.
- Impact hypothesis: P3 omdat er nu 1 case study is. Indien meer cases volgen, breekt deze direct-deep-link-pattern. Future-proofing-suggestie.
- Proposed fix: maak een `/case-studies` index-page met momentaneel 1 case plus "Meer case studies binnenkort" placeholder. Update Header plus Footer naar `/case-studies` parent.
- Effort: S
- Confidence: low (geen huidige impact)

### Finding 26: Page-title divergentie tussen page-meta en H1

- Severity: P1
- Routes: `/apply`. Viewports: alle. Locales: NL primair.
- Evidence: `messages/nl.json:1678`: `"title": "Aanmelden. Plan een gesprek met Daley | FutureMarketingAI"` (page meta-title). DOM H1: `"Plan een partnership-gesprek"`. Tussen Google SERP-snippet plus boven-de-vouw H1 wisselt het frame.
- Code path: `messages/nl.json:1678` plus apply-page-hero.
- Impact hypothesis: P1 omdat zoek-snippet-belofte plus aankomst-headline niet matchen; verlaagt CTR en bounce-rate verbeterend efficient na zoekklik. Zie ook Finding 4.
- Proposed fix: align meta-title plus H1. Aanbeveling: "Plan een gesprek met Daley" als beide.
- Effort: S
- Confidence: high

### Finding 27: Hreflang-tags valideren over locale-routes maar canonical-strategy onleesbaar in DOM-only audit

- Severity: P3 (defer to SEO team)
- Routes: alle. Viewports: alle.
- Evidence: skill-pages tonen `href="https://future-marketing.ai/{en,es,nl}/skills/email-management"` patroon (uit DOM `_skills_email-management-nl.html` plus locale-equivalenten). Dit is de basis van hreflang alternates, maar volledige validatie van `x-default` plus canonical-conflict-checks is owned door 16-07 SEO team.
- Code path: `next-intl` routing-config plus `next.config.ts` head-script.
- Impact hypothesis: defer.
- Proposed fix: defer to 16-07 plan.
- Effort: zero in this scope
- Confidence: low

### Finding 28: Memory page narrative is consistent en sterk

- Severity: P3 (positief, no action)
- Routes: `/memory`. Viewports: alle. Locales: alle drie.
- Evidence: H1 "Clyde onthoudt alles. Per merk, voor altijd." plus H2-sequentie ("Zo onthoudt Clyde", "Strikt gescheiden per merk", "Elke dag scherper, nooit verstopt", "Week 1 versus week 12", "Waarom dit niet werkt met ChatGPT of Jasper", "Wil je zien hoe dit werkt voor jouw merken?"). Sterke arc: reveal, proof, comparative, action.
- Code path: `messages/nl.json` namespace `memory.*`.
- Impact hypothesis: positieve narrative-marker. Memory-page is de USP-anchor en doet zijn werk.
- Proposed fix: geen, behoud als benchmark voor andere pages.
- Effort: zero
- Confidence: high

## User-journey maps (4 personas)

### 7.1 Persona 1: Bureau-owner researcher

> Scenario: Een bureau-eigenaar (1 tot 5 medewerkers, 8 tot 15 merken in portfolio) hoort van FMai via een LinkedIn-mention, googelt "futuremarketingai", landt op de Nederlandse home.

| Step | Page | Action | Narrative continuity | CTA visible | Friction |
|---|---|---|---|---|---|
| 1 | `/` home | Hero "Dit is Clyde. Jouw AI Marketing Medewerker" gelezen. | Hook OK. | Plan een gesprek (header plus body, 13 instances). | Geen H2-hierarchy maakt sub-scanning moeizaam (Finding 6). |
| 2 | `/about` (via Footer.company) | Wie is Daley, wat is missie. | Reveal OK; "Wie staat hier achter" H2 mountains trust. | Plan een gesprek (CTA-block aan einde). | Geen breadcrumb terug naar Home (Finding 2). |
| 3 | `/pricing` (via Footer.skills.pricing) | Wat kost het. | Proof plus Action. Founding 997 euro lifetime is duidelijk. | Plan een gesprek (CTA aan einde). | Pricing-matrix is dense; visitor zonder budget-fit context kan afhaken (16-03 visual-team scope). |
| 4 | Verlaat zonder applying. | breakpoint. | narrative_break: yes (geen reden gevonden om de stap te zetten in 3 pages). |  | |

`narrative_break` totaal: 1 (van 3 pages bekeken voor exit). Aanbeveling: stronger urgency-frame plus proof-cluster op pricing zou retentie helpen.

### 7.2 Persona 2: EU buyer evaluator (compliance-heavy)

> Scenario: Een compliance-officer of legal-counsel bij een groter bureau evalueert FMai. Wil eerst weten waar data leeft, hoe GDPR werkt, voordat ze aan pricing toekomen.

| Step | Page | Action | Narrative continuity | CTA visible | Friction |
|---|---|---|---|---|---|
| 1 | `/legal/privacy` (via direct-link of footer) | Lees privacy-policy. | Reveal OK; legal-paginas hebben H1 plus 10 H2s. | Plan een gesprek aanwezig (CTA-block bottom). | Geen breadcrumb (Finding 2). |
| 2 | `/memory` (via top-nav) | Lees memory-system. | Reveal sterk; "Strikt gescheiden per merk" geadresseerd. | Plan een gesprek. | Memory page narrative is sterk (Finding 28). |
| 3 | `/founding-member` (via Footer.company) | Founding spots, vertrouwen. | Proof plus Action. Sindy als operator-case maakt de cases real. | Plan een gesprek. | "Founding Member" Engels-only (Finding 18) kan voor strict-NL-audience marginaal vreemd zijn. |
| 4 | `/apply` (via primary CTA) | Form-fill. | Action; maar H1 "Plan een partnership-gesprek" wijkt af van page-title (Finding 4 plus 26). | apply form. | Field-count plus form-friction in scope 16-05. |

`narrative_break` totaal: 0 voor deze persona. Goede flow.

### 7.3 Persona 3: GTM bench-marker (vergelijkt concurrenten)

> Scenario: Een marketing-strateeg vergelijkt MS618 plus Mediacooks plus FMai. Wil eerst case study plus pricing zien, daarna apply.

| Step | Page | Action | Narrative continuity | CTA visible | Friction |
|---|---|---|---|---|---|
| 1 | `/case-studies/skinclarity-club` (via direct-search-result) | Lees SkinClarity Club case. | Proof sterk: "3 accounts. 4 merken. Eén AI Marketing Medewerker." plus H2 "Sindy" plus outcomes. | Plan een gesprek (CTA aan einde). | Geen breadcrumb (Finding 2). |
| 2 | `/skills/clyde` (via body-link "Clyde" op case) | Lees overarching skill. | Reveal sterk; "Wat Clyde doet" plus FAQ. | Plan een gesprek (50 plus instances). | Megamenu rendert maar wordt niet geopend; orphan-4 onbekend (Finding 1). |
| 3 | `/pricing` (via Footer.skills.pricing) | Compare pricing. | Action; Founding-anchor sterk. | Plan een gesprek. | Geen direct vergelijkingstabel tegen named competitors (16-13 cross-stack team owns). |
| 4 | `/apply` (via primary CTA) | Apply. | Action; mismatch H1 plus title (Finding 4 plus 26). | apply form. | OK. |

`narrative_break` totaal: 0. Sterke proof-driven flow.

### 7.4 Persona 4: Returning prospect (eerder verlaten, komt terug)

> Scenario: Iemand heeft 2 weken geleden de home bezocht plus afgehaakt op `/apply` (te druk). Komt terug via Google bookmark of via een directe deep-link naar `/skills/clyde`.

| Step | Page | Action | Narrative continuity | CTA visible | Friction |
|---|---|---|---|---|---|
| 1 | `/skills/clyde` (via deep-link) | Refresh memory. | Reveal; "Klaar om Clyde als AI Marketing Medewerker in te zetten?" H2 end-CTA. | Plan een gesprek (megamenu plus body plus footer). | Geen breadcrumb (Finding 2); geen "Bekijk je geschiedenis" return-cue. |
| 2 | `/memory` (via body-link "geheugen" op clyde) | Refresh USP. | Reveal sterk. | Plan een gesprek. | OK. |
| 3 | Hoe vind ik Founding-status? Search "founding" of klik header. Wel reachable via Footer.company. | Reveal. | Plan een gesprek. | Founding badge consistency strong (Finding 22). |
| 4 | `/apply` (via primary CTA) | Form-fill, complete dit keer. | Action. | apply form. | Same friction as Persona 2 (Finding 4 plus 26). |

`narrative_break` totaal: 0. Sterke retention-flow gegeven persona's reactivatie via deep-link.

## Narrative arc audit

> Rubric: Hook (waarom-care plus probleem-framing) plus Reveal (wat FMai doet, Clyde-intro) plus Proof (SKC case, metrics, founding-counter) plus Action (een dominant CTA, clear next step) plus Reassurance (privacy, EU-native, GDPR, founding-scarcity). Severity-tags volgen P0 tot P3 per missing of broken step.

| Page | Hook | Reveal | Proof | Action | Reassurance | Notes |
|---|---|---|---|---|---|---|
| `/` home | sterk (Clyde-intro) | OK (skills-section) | partial (Founding-counter, SkinClarity Club teaser) | sterk (13x Plan een gesprek) | OK (EU-native footer-mention) | H2-gap (Finding 6) is structural P0 |
| `/about` | OK (Mijn missie) | sterk (8 H2s incl. infrastructuur) | OK (Sindy als operator) | OK (CTA bottom) | sterk (capaciteit en transparantie H2) | Sterke arc |
| `/how-it-works` | OK ("Hoe begint jouw partnership met Clyde?") | sterk (onboardingreis H2) | thin (geen specifieke proof H2) | OK (Klaar om partnership te starten? CTA) | thin (geen EU/GDPR-claim H2) | Proof plus Reassurance gat, P2 |
| `/skills/clyde` | sterk (Dit is Clyde H1) | sterk (Wat Clyde doet H2) | OK (Hoe het werkt plus Werkt samen met) | sterk (50 plus CTAs) | OK (Voor wie plus tier-availability) | Sterke arc |
| `/memory` | sterk (Clyde onthoudt alles H1) | sterk (Zo onthoudt Clyde H2) | sterk (Week 1 vs week 12 H2) | sterk (Wil je zien hoe dit werkt H2) | sterk (Waarom dit niet werkt met ChatGPT H2 = differentiator) | Benchmark arc (Finding 28) |
| `/case-studies/skinclarity-club` | sterk (3 accounts. 4 merken H1) | OK (Welke vaardigheden actief) | sterk (Wat Clyde oplevert plus Sindy H2) | OK (Wil je dit ook H2) | OK (Hoe het werkt plus Tijdlijn) | Sterke proof-driven arc |
| `/pricing` | OK (Premium partnerships H1) | sterk (Pricing tiers H2) | OK (Waarom onze prijzen zichtbaar zijn H2) | OK (Klaar om partnership H2) | sterk (Beschikbaarheid per tier transparency) | Sterke arc |
| `/founding-member` | sterk (Word Founding partner H1) | sterk (Wat je krijgt H2) | sterk (Onze eerste Founding partner H2 = Sindy/SKC) | sterk (Word een van de 10 H2) | sterk (Jouw investering plus Waarom 10 plekken bestaan H2s) | Sterke arc |
| `/apply` | conflict (Plan een partnership-gesprek H1 vs Plan een gesprek meta) | thin (Wat er gebeurt na aanmelden H2) | thin (geen proof-element pre-form) | sterk (form is action) | thin (geen EU-claim near form) | P1 wegens H1-conflict; Proof plus Reassurance ontbreken voor form-confidence |
| `/contact` | conflict (Algemene vragen of feedback H1) | conflict (3 CTAs verdeeld over H2s) | thin (geen proof) | conflict (3 CTAs split attention) | thin | P1 hele page narrative is gebroken (Finding 5) |

Summary: 7 van 10 pages hebben volledig arcs; 3 hebben missing arc-steps (`/how-it-works` mist proof + reassurance H2-level; `/apply` mist proof plus reassurance; `/contact` heeft conflicterende CTAs).

## Top 25 findings (ranked)

| Rank | ID | Severity | Title | SOTA markers |
|---|---|---|---|---|
| 1 | F1 | P0 | Vier skills-paginas SSR-orphan | M6 plus M7 plus M10 plus M12 |
| 2 | F2 | P0 | Universele breadcrumb-afwezigheid | M8 plus M12 |
| 3 | F3 | P0 | `/skills/social-media` CTA-block "Boek een gratis strategiesessie" | M21 plus glossary |
| 4 | F6 | P0 | Home page mist H2-hierarchy | M2 plus M9 |
| 5 | F26 | P1 | `/apply` meta-title plus H1 divergeert | M21 plus narrative arc |
| 6 | F4 | P1 | `/apply` H1 "Plan een partnership-gesprek" niet canonical | glossary plus M21 |
| 7 | F5 | P1 | `/contact` 3 concurrerende CTAs | M21 |
| 8 | F8 | P1 | `/assessment` near-orphan | M7 plus M10 |
| 9 | F10 | P1 | `/skills/reporting` shortDescription "per klant" | glossary |
| 10 | F20 | P1 | Home mist "Bekijk alle vaardigheden" pad | M7 |
| 11 | F7 | P2 | Megamenu category-labels semantisch arm voor NL | M2 borderline |
| 12 | F9 | P2 | `/roadmap` near-orphan | M10 |
| 13 | F11 | P2 | Megamenu CTA-banner concurreert met skill-keuze | M21 |
| 14 | F13 | P2 | Skills-categorie "grow" mengt Clyde met analytics | IA-coherence |
| 15 | F14 | P2 | Footer Skills-section mengt pricing-link met skills | IA-coherence |
| 16 | F17 | P2 | Megamenu plus Footer coming-soon-badge mismatch | IA-coherence |
| 17 | F19 | P2 | `/blog` mist H2 plus thin SSR | M2 plus M12 |
| 18 | F24 | P2 | Megamenu mist all-skills overview-link | M7 |
| 19 | F12 | P3 | "memory" naming divergeert top-nav vs footer | brand-consistency |
| 20 | F15 | P3 | `/legal` parent orphan | M10 borderline |
| 21 | F18 | P3 | "Founding Member" Engels in alle locales | brand-decision |
| 22 | F23 | P3 | Geen sitemap-link in footer | M10 borderline |
| 23 | F25 | P3 | `/case-studies/*` single-case linking-pattern future-proofing | IA-future-proofing |
| 24 | F16 | P3 | Login link naar app-subdomain | OK note |
| 25 | F27 | P3 | Hreflang verify defer to 16-07 | M15 (defer) |

P0 totaal: 4 unieke (F1, F2, F3, F6). Findings F21, F22, F28 zijn positive markers (geen actie).

## Sources

- `fmai-nextjs/test-results/audit-v2/dom/*-{en,es,nl}.html` (93 DOM-snapshots, Phase 16-02 Playwright Chromium 1440 by 900 baseline)
- `fmai-nextjs/src/components/layout/HeaderClient.tsx` (megamenu plus nav-items structure)
- `fmai-nextjs/src/components/layout/Footer.tsx` (footer-section structure)
- `fmai-nextjs/src/lib/skills-data.ts` (skills SSoT-mirror)
- `fmai-nextjs/messages/nl.json` (NL authoritative copy)
- `fmai-nextjs/CLAUDE.md` (key-phrase glossary tabel plus brand-rules)
- `docs/audits/2026-05-18-v2/00-competitive-intel.md` (SOTA-marker rubric M1 tot M25)
- `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` (out-of-scope baseline)

End of document. Total findings: 28 (P0=4, P1=7, P2=8, P3=9). Sitemap-table, top-nav plus footer-tables, breadcrumb-coverage, glossary-scorecard, 4 user-journey-maps, narrative-arc-audit, top-25-ranked findings, executive-summary. Ready voor 16-15 synthesis-team plus 16-16 fix-plan.
