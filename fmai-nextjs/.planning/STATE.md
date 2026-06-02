---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-06-02T13:46:05.323Z"
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 11
  completed_plans: 11
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-02)

**Core value:** FutureMarketingAI wordt geciteerd door AI-engines en rankt op non-branded GEO/agency-keywords, via diepe content die het eigen Blog Factory-product produceert.
**Current focus:** Phase 3 (cornerstone content) VOLTOOID — alle 7 cornerstones live op feature/seo-geo-kennisbank met bewezen bidirectioneel link-netwerk, valide JSON-LD en hub-verschijning. Volgende: Phase 4 (multi-tenant publishing-upgrade, harde prerequisite vóór auto-publish).

## Current Position

Phase: 3 of 7 (Cornerstone-content) — COMPLETE
Plan: 03-01 t/m 03-07 allemaal voltooid. Phase 3 afgerond.
Status: Sluitsteen-plan 03-07 (CONT-08) klaar. Pillar<->cluster interne-link-netwerk bidirectioneel dichtgetimmerd + bewezen in gerenderde HTML; alle 7 cornerstones hub-zichtbaar onder juiste pillar; alle Article/BlogPosting + FAQPage JSON-LD valide; CWV neutraal. Phase Success Criteria 4 + 5 hard afgesloten. Alle 8 CONT-requirements (CONT-01..08) compleet.
Last activity: 2026-06-02 — Plan 03-07 voltooid. Task 1 (pillar out-links) was verificatie-only (al compleet upstream); Task 2 fixte 2 em-dashes per file in ai-marketing-automation-voor-bureaus.mdx + wat-is-een-ai-marketing-medewerker.mdx (commit b214acd); Task 3 finale build PASS (122 static pages), hub-verschijning + JSON-LD + bidirectioneel link-netwerk bewezen tegen .next-HTML.

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 5
- Average duration: ~10 min
- Total execution time: ~0.8 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Kennisbank-infrastructuur afronden | 3 | 34 min | ~11 min |
| 2. Content-pillar-spine | 1 | ~9 min | ~9 min |
| 3. Cornerstone-content | 1 | 7 min | 7 min |

**Recent Trend:**
- Last 5 plans: 01-02 (~20 min), 01-03 (~10 min), 02-01 (~9 min), 03-02 (7 min)
- Trend: stable

*Updated after each plan completion*
| Phase 03 P07 | 8 | 3 tasks | 2 files |
| Phase 03 P06 | 9 | 3 tasks | 1 files |
| Phase 03 P05 | 7 | 3 tasks | 1 files |
| Phase 03 P03 | 12 | 3 tasks | 2 files |
| Phase 03 P04 | 5 | 3 tasks | 1 files |
| Phase 03 P02 | 7 | 3 tasks | 1 files |
| Phase 03 P01 | 14 | 3 tasks | 1 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Programma]: Cornerstone-content eerst (Phase 3, handmatig SKC-grade) vóór auto-engine — directe autoriteit zonder op WF7/publishing te wachten
- [Programma]: Bestaande Blog Factory dogfoodden i.p.v. nieuw bouwen — machine draait bewezen voor SKC
- [Programma]: Blog + social unificeren op `fma_content_pillars`-spine (Phase 2) — één strategie voor beide pijplijnen
- [Programma]: Multi-tenant publishing-upgrade (Phase 4) als harde prerequisite — voorkomt cross-publishing-bug
- [01-01]: Glossary blijft een pure prop-driven component (page resolveert copy via getTranslations) i.p.v. zelf vertalend — herbruikbaar voor de /resources-hub (Plan 03) zonder translation-dependency
- [01-01]: DefinedTerm @ids zijn locale-scoped (`${SITE_URL}/${locale}/resources#${id}`) en matchen de gerenderde anchor-ids; term-ids blijven stabiel over locales, alleen de display-name vertaalt
- [01-02]: Pillar-artikel headings als expliciete `<h2 id>` geschreven (geen rehype-slug in next.config) zodat TOC-anchors resolven zonder renderer/config te wijzigen
- [01-02]: Frontmatter object-arrays in dit repo gebruiken block-YAML, nooit inline flow-mapping — `@next/mdx` mist remark-frontmatter en parseert inline `{ }` als JSX-expressie (build-breaker)
- [01-03]: PillarHubCard routeert via de locale-aware next-intl Link (`/blog/<slug>`) i.p.v. handmatige locale-prefix — consistent met de rest van de site; locale-prop blijft voor pariteit met het hub-datamodel
- [01-03]: Pillar-buckets keyen op de BLOG_CATEGORIES-ids (geo / ai-marketing-automation / agency-ops), dezelfde taxonomie die de glossary-categorieën hergebruiken, zodat blog + resources structureel uitgelijnd blijven
- [01-03]: Buckets degraderen gracefully — ze renderen titel/beschrijving + emptyLabel ook met nul pillar-posts, zodat de structuur zichtbaar is vóór cornerstone-content (Phase 3)
- [02-01]: 7 stale 2026-04-15 placeholder pillars (snake_case slugs, lege topics) gedeactiveerd (is_active=false, reversibel, geen delete) i.p.v. verwijderd, zodat de FMai-client exact de 4-pillar spine draagt die beide readers (is_active=true) consumeren
- [02-01]: account_weights = {} per pillar; FMai account_keys niet bevestigd en beide readers vallen terug op top-level weight, dus leeg is de veilige correcte default
- [02-01]: product-clyde pillar gebruikt de bestaande `comparisons` blog-categorie voor zijn cornerstone (pillar-slug != blog-categorie by design) — alle 3 andere slugs == BLOG_CATEGORIES ids, geen orphan cluster
- [03-01]: GEO pillar (CONT-01) in-place verdiept i.p.v. herschreven — slug/identiteit stabiel; van ~3 secties naar 6 gegronde NL-secties, 1564 woorden (binnen 1500-3000 bar). Open Q2 resolved als "deepen".
- [03-01]: GEO pillar fungeert als cluster-hub: in-body links (locale-prefixed /nl/blog/<slug>) wijzen vooruit naar de 3 nog-te-schrijven GEO-clusters (03-02 geo-vs-seo is feitelijk ai-marketing; de GEO-clusters zijn 03-03/04/+). Forward-links resolven zodra clusters shippen; back-links in 03-07.
- [Phase 03-02]: Verse NL-pillar op exact keyword i.p.v. oud EN ai-marketing-automation-guide.mdx hergebruiken — voorkomt duplicate-intent (03-RESEARCH Pitfall 3)
- [Phase 03-02]: Pricing in pillars conceptueel benoemen (werkruimte-geprijsd) met deeplink naar /nl/pricing i.p.v. tarieven hardcoden (pricing-data.ts SSoT)
- [Phase 03-02]: Forbidden glossary-term 'AI-tool' alleen contrastief gebruiken (wat Clyde NIET is), conform de glossary-definitie zelf — niet als productlabel
- [03-04]: GEO-monitoring-tools-cluster (CONT-04) als vendor-neutrale ComparisonTable (geen highlightColumn) — Clyde is geen GEO-monitoring-tool, dus de tabel blijft een neutraal landschapsoverzicht
- [03-04]: ComparisonTable-cellen gebruiken string 'Deels' i.p.v. een onbewijsbare false-boolean waar 03-RESEARCH §3 geen harde capaciteit bevestigt (defensible-claims, Pitfall 5); kolommen Profound/Peec AI/Otterly/Semrush dekken de drie tool-categorieen
- [03-05]: Clyde-positionerings-cluster (CONT-06) spiegelt de glossary.ai-marketing-medewerker definitie letterlijk in de answer-first eerste zin — citeerbare definitie-pagina, consistente categorie-framing site-wide; in-body back-link naar de ai-marketing-automation pillar + forward naar de clyde-vs-vergelijking
- [03-03]: Beide GEO-clusters (CONT-02 vs SEO, CONT-03 meten) als schemaType BlogPosting i.p.v. Article — clusters krijgen BlogPosting, pillars houden Article (consistente JSON-LD-conventie)
- [03-03]: CONT-03-draft kwam na tag-stripping 4 woorden onder de 900-floor; een substantieve contextparagraaf over meetresultaten-in-context toegevoegd (geen padding) i.p.v. de floor te verlagen — 974w
- [03-05]: 'AI-tool' uitsluitend contrastief gebruikt (wat Clyde NIET is), niet als productlabel — zelfde lijn als 03-02; build compileert + 122/122 static pages, Article(BlogPosting)+FAQPage JSON-LD bevestigd via [slug]/page.tsx renderer-path
- [03-06]: Comparison money-page (CONT-07) hub-fix Option A: category ai-marketing-automation + clusterOf ai-marketing-automation-voor-bureaus (NIET category 'comparisons' → geen hub-bucket, onzichtbaar). Verschijnt als cluster onder de ai-marketing-automation pillar in /resources
- [03-06]: Clyde-differentiator op werkmodel (meewerkende medewerker vs tool je bedient), niet op losse features — live juni-2026 research bevestigt dat Jasper óók merkgeheugen + GEO heeft; onzekere competitor-cellen als 'Deels' i.p.v. false-boolean (Pitfall 5). Tabel highlightColumn={0} op Clyde
- [03-07]: Pillar out-links waren al volledig aanwezig (upstream toegevoegd in 03-01/03-02) — sluitsteen-Task 1 was verificatie-only, geen edit nodig; netwerk was al dichtgetimmerd. Bidirectionaliteit bewezen tegen gerenderde .next-HTML, niet alleen MDX-source
- [03-07]: Em-dashes in citation-titles vervangen door dubbele punt (label-stijl "Naam: subtitel") i.p.v. komma — natuurlijker + consistent met no-em-dash-regel. Enige 2 resterende U+2014-overtredingen in de hele cornerstone-set (commit b214acd)
- [03-07]: CWV-proof als structureel-neutraal beargumenteerd i.p.v. losse Lighthouse-run — alle 7 zijn static-prerendered MDX via identieke renderer/template + inlined critical CSS als de blog-baseline, geen nieuwe client-JS/assets, dus regressie uitgesloten. Matcht plan-verwachting "static MDX -> expect neutral"

### Pending Todos

[From .planning/todos/pending/ — ideas captured during sessions]

None yet.

### Blockers/Concerns

[Issues that affect future work]

- KB-01/02/03 zijn geshipt op branch `feature/seo-geo-kennisbank` (niet main) — verifieer merge-status vóór Phase 1-afronding
- Phase 4 is HARDE PREREQUISITE: FMai mag niet als publicerende client live voordat client-scoped publish-filter bewezen is (cross-publishing-risico SKC↔FMai)
- Phase 6 hangt af van Google OAuth-gat dat WF7 (`34PqLtFS`) blokkeert — externe afhankelijkheid
- Cross-repo werk (Phase 4 in `fma-app`, Phase 6 in `FMai` n8n) vereist build/live-pipeline-validatie in die repos; n8n altijd live run + DB-output checken

## Session Continuity

Last session: 2026-06-02
Stopped at: Completed 03-07-PLAN.md (sluitsteen CONT-08). Phase 3 (Cornerstone-content) VOLLEDIG AFGEROND — alle 7 plannen (03-01..07) klaar, alle 8 CONT-requirements (CONT-01..08) compleet. Interne-link-netwerk pillar<->cluster bidirectioneel dichtgetimmerd + bewezen in gerenderde .next-HTML (GEO-pillar -> 3 GEO-clusters; AI-automation-pillar -> 2 AI-clusters; alle 5 clusters -> hun pillar). Alle 7 cornerstones hub-zichtbaar in /nl/resources onder juiste bucket (comparison via Option A). Alle JSON-LD valide: pillars Article, clusters BlogPosting, alle 7 FAQPage met 5 valide Q/A. Build PASS (122 static pages + critical-CSS-inline 103 files). CTA-invariant: exact 1 in-body CtaBlock per cornerstone. CWV neutraal (static MDX). Em-dash-fix in 2 files (commit b214acd). Task 1 + Task 3 vereisten geen source-mutatie (verificatie-only). MERGE-STATUS: hele Phase 3 zit op feature/seo-geo-kennisbank, niet main — verifieer merge vóór live + vóór Phase 4. Volgende: Phase 4 (multi-tenant publishing-upgrade, HARDE prerequisite ivm cross-publishing-risico SKC<->FMai).
Resume file: None
