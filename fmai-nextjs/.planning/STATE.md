---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-06-02T16:22:55.373Z"
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 18
  completed_plans: 18
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-02)

**Core value:** FutureMarketingAI wordt geciteerd door AI-engines en rankt op non-branded GEO/agency-keywords, via diepe content die het eigen Blog Factory-product produceert.
**Current focus:** Phase 8 (Cornerstone-content batch 2) VOLTOOID — beide pillars (agency-ops CONT-09, product/Clyde CONT-13) + 5 clusters live op feature/seo-geo-kennisbank, bidirectioneel netwerk dichtgetimmerd via sluitsteen 08-07. Volgende: merge feature/seo-geo-kennisbank → main + eventueel batch 3 (deferred).

## Current Position

Phase: 8 (Cornerstone-content batch 2) — COMPLETE (7/7 plans)
Plan: 08-07 (CONT-16 sluitsteen) voltooid — laatste plan van Phase 8. Alle 7 batch-2 cornerstones live met bidirectioneel pillar↔cluster netwerk; Phase 8 closed.
Status (08-07 sluitsteen): Verificatie-only keystone (mirror van 03-07). Beide pillars OUT-linken al hun clusters en elke cluster BACK-linkt zijn pillar — bewezen tegen gerenderde .next/server/app/nl/blog/<slug>.html (niet alleen MDX-source). Cross-page proof-sweep over alle 7: exact 1 <CtaBlock> + 1 /apply per file, 0 U+2014 em-dash, canoniek future-marketing.ai, geen wees-cluster (elke clusterOf resolved naar bestaande pillar:true slug in hub-bucket category). npm run build exit 0, 129 static pages (122+7), geen MISSING_MESSAGE; check:palette PASS. Hub /nl/resources rendert alle 7 onder juiste bucket (agency-ops: pillar+3 clusters; product-clyde: pillar+2 clusters+CONT-06 down-link); homepage /nl rendert beide nieuwe pillars in KennisbankTeaser; Article(pillar)/BlogPosting(cluster)+FAQPage JSON-LD bevestigd in gerenderde HTML voor alle 7. CWV structureel-neutraal beargumenteerd (static MDX, identieke renderer, geen nieuwe client-JS). Geen MDX-edits nodig (out-/back-links al upstream geschreven). Geen per-task code-commits (verificatie-only). CONT-09..16 afgevinkt; REQUIREMENTS-traceability-tabel gesynct. Pre-existing ESLint-errors (ts-ignore, React-19 effect-rules in unrelated files) out-of-scope: build compileert + prerendert 129/129.
Status: 08-06 twee product/Clyde clusters onder pillar ai-marketing-medewerker (CONT-13). CONT-14 `content/blog/ai-agent-vs-ai-tool-marketing.mdx` (1017w, 5 <h2 id>, defensible-claims ComparisonTable highlightColumn={1} op medewerker-kolom, dated caption juni 2026) trekt agent-vs-tool grens op 4 eigenschappen (autonomie+geheugen+leren+beslissingen). CONT-15 `content/blog/ai-marketing-agent-geheugen-en-leren.mdx` (1149w, 5 <h2 id>, 1 Callout) legt geheugen+leren per merk uit als Clyde USP, deeplinkt naar /nl/memory. Beide BlogPosting, category product-clyde, clusterOf ai-marketing-medewerker, ≥5 FAQs, exact 1 /apply CtaBlock, geen em-dash, AI-tool alleen contrastief, bidirectioneel verbonden met pillar + sibling. Build PASS (129 static pages, +2 t.o.v. 08-05's 127). BlogPosting + FAQPage JSON-LD bevestigd in gerenderde .next-HTML voor beide. check:palette PASS. Commits c5f4b77 (CONT-14) + 69009e1 (CONT-15); Task 3 verificatie-only. Eén auto-fix (Rule 1): ComparisonTable kolom/highlight-mapping gecorrigeerd vóór commit. CONT-14 + CONT-15 afgevinkt.
Status (08-05): 08-05 agency-proof case-cluster `content/blog/ai-marketing-resultaat-in-de-praktijk.mdx` (category agency-ops, clusterOf marketingbureau-schalen-met-ai, schemaType BlogPosting, 1240w, 5 <h2 id>); Sindy-as-operator narratief als werkend voorbeeld; KWALITATIEF-only: 0 percentage-figuren in body, founding-counter (1/10) als enige harde feit, industrie-benchmarks alleen in citations + zacht geciteerd; geen Daley SKC-mede-eigendom (regex-audit op MDX+gerenderde HTML clean). 1 in-body CtaBlock -> /apply; back-link naar pillar + forward-link CONT-11 + /nl/pricing deeplink. BlogPosting + FAQPage JSON-LD bevestigd in gerenderde .next-HTML. Build PASS (127 static pages, +4 t.o.v. 08-02's 123), check:palette PASS. Commit 71cc0a1 (Tasks 1+2 als één file-write); Task 3 verificatie-only. CONT-12 afgevinkt.
Last activity: 2026-06-02 — Plan 08-06 voltooid (CONT-14 ai-agent-vs-ai-tool-marketing 1017w + CONT-15 ai-marketing-agent-geheugen-en-leren 1149w, beide BlogPosting+FAQPage JSON-LD valide in .next-HTML, product-clyde clusters onder pillar ai-marketing-medewerker, commits c5f4b77 + 69009e1). Build 129 static pages, palette PASS.
Plan 08-03 voltooid (parallel wave-2): product/Clyde pillargids `content/blog/ai-marketing-medewerker.mdx` (CONT-13, pillar:true, category product-clyde, schemaType Article, 1817w, 6 <h2 id>). Definieert de AI Marketing Medewerker als PRODUCTCATEGORIE (autonomie + langetermijngeheugen + vaardigheden), Clyde = FMai-implementatie. Anti-cannibalisatie vs CONT-06: distinct H1 + answer-first + down-link naar /nl/blog/wat-is-een-ai-marketing-medewerker; forward-links CONT-14/15 + /nl/memory; 1 in-body CtaBlock -> /apply; geen em-dashes; AI-tool alleen contrastief. Build PASS (127 static pages), Article + FAQPage JSON-LD valide in .next-HTML, alle 6 TOC-anchors resolven, pillar verschijnt in product-clyde hub-bucket op /resources (geen MISSING_MESSAGE), check:palette PASS. Commit 6adce32 (Tasks 1+2 één file-write); Task 3 verificatie-only. CONT-13 afgevinkt.

Progress: Phase 8 [███████] COMPLETE (7/7 plans) — alle 4 hub-buckets gevuld, bidirectioneel netwerk dichtgetimmerd

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
| Phase 08 P02 | 7 | 3 tasks | 1 files |
| Phase 08 P01 | 12 | 3 tasks | 5 files |
| Phase 08 P05 | 5 | 3 tasks | 1 files |
| Phase 08 P04 | 8 | 3 tasks | 2 files |
| Phase 08 P03 | 9 | 3 tasks | 1 files |
| Phase 08 P06 | 14 | 3 tasks | 2 files |
| Phase 08 P07 | 7 | 3 tasks | 0 files |

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
- [Phase 08-02]: Agency-ops pillargids (CONT-09) gemodelleerd op de ai-marketing-automation pillar shape; AI-first operating-model framing i.p.v. tool-lijst; marktstats zacht-geciteerd als context, nooit als FMai/SKC eigen resultaat; SKC via Sindy als operator; werkruimte-geprijsd + /nl/pricing deeplink i.p.v. hardcoded tarieven
- [Phase 08]: [08-01]: product-clyde als 4e top-level hub-bucket (Open Q1 Option B locked), niet gevouwen in ai-marketing-automation
- [Phase 08]: [08-01]: teaser-feed blijft expliciete per-pillar .find()-calls (hardcoded-add, Open Q2 locked); && guard + .filter(Boolean) laat cards self-omitten tot MDX bestaat
- [Phase 08]: [08-01]: i18n-key product-clyde in alle 3 locales tegelijk (next-intl strict throwt MISSING_MESSAGE per locale)
- [Phase 08-05]: Case-cluster CONT-12 kwalitatief-only: 0 percentage-figuren in body, founding-counter (1/10) als enige harde feit, industrie-benchmarks alleen in citations + zacht geciteerd; Sindy-as-operator, geen Daley-eigendom
- [Phase 08-04]: CONT-10 winnende invalshoek = selectie+integratieframework (3-assen volume/oordeel/meetbaarheid), geen tool-lijst, AVG als ontwerpkeuze
- [Phase 08-04]: CONT-11 leert een 6-indicator ROI-framework + nulmeting/before-after en belooft geen cijfer; marktcijfers expliciet als marktcontext, nooit als belofte/FMai-resultaat
- [Phase 08-03]: Product/Clyde pillar (CONT-13) framet de AI Marketing Medewerker als PRODUCTCATEGORIE via 3 eigenschappen (autonomie, langetermijngeheugen, vaardigheden), laat de kale definitie bij CONT-06 en linkt DOWN — anti-cannibalisatie per 08-RESEARCH Pitfall 4
- [Phase 08-03]: Clyde expliciet als IMPLEMENTATIE van de categorie gepositioneerd (categorie != merk) via Callout: de categorie definieren, niet bezitten; claim het ontbreken van een vaste NL-definitie als de GEO/SEO-winst
- [Phase 08-06]: CONT-14 ComparisonTable: 2 waardekolommen + impliciete row.label-kolom, highlightColumn={1} op de medewerker-kolom (component rendert label als 1e cel, columns mappen op values)
- [Phase 08-06]: Beide product/Clyde clusters: AI-tool alleen contrastief; CONT-15 verankert geheugen+leren per merk als Clyde USP met /nl/memory deeplink i.p.v. het meerlaagse model te dupliceren
- [Phase 08-07]: Keystone (CONT-16) was verificatie-only: out-/back-links al volledig upstream geschreven (08-02/03 + 08-04/05/06), geen MDX-edits — identiek aan 03-07. Bidirectionaliteit bewezen tegen gerenderde .next-HTML, niet alleen MDX-source. CWV structureel-neutraal beargumenteerd.

### Roadmap Evolution

- Phase 8 added (2026-06-02): Cornerstone-content batch 2 (agency-ops + product/Clyde pillars + clusters) — vult de 2 lege hub-buckets. Batch 3 (12 skills-artikelen + thematische stukken man-vs-machine/toekomst-AI) genoteerd als deferred vervolgfase.
- Post-Phase-3 (2026-06-02): KennisbankTeaser homepage-blok + header-nav "Kennisbank" + footer-link naar /resources geshipt (commit a8f6c0f op feature/seo-geo-kennisbank) — surfacet de cornerstones, was eerder wees-hub.

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
Stopped at: Completed 08-07-PLAN.md (CONT-16 sluitsteen) — laatste plan van Phase 8, Phase 8 COMPLETE (7/7). Verificatie-only keystone (mirror van 03-07): beide pillars (marketingbureau-schalen-met-ai, ai-marketing-medewerker) OUT-linken al hun clusters en elke cluster BACK-linkt zijn pillar — bewezen tegen gerenderde .next/server/app/nl/blog/<slug>.html, niet alleen MDX. Cross-page sweep over alle 7 nieuwe cornerstones: exact 1 CtaBlock + 1 /apply per file, 0 U+2014 em-dash, canoniek future-marketing.ai, geen wees-cluster. npm run build exit 0 (129 static pages = 122+7, geen MISSING_MESSAGE); check:palette PASS. Hub /nl/resources rendert alle 7 onder juiste bucket (agency-ops: pillar+3 clusters; product-clyde: pillar+2 clusters+CONT-06 down-link); homepage /nl rendert beide nieuwe pillars in KennisbankTeaser; Article/BlogPosting+FAQPage JSON-LD bevestigd in gerenderde HTML voor alle 7. Geen MDX-edits (out-/back-links al upstream geschreven), dus geen per-task code-commits (verificatie-only). CONT-09..16 afgevinkt + REQUIREMENTS-traceability-tabel gesynct. Pre-existing ESLint-errors (ts-ignore/React-19 effect-rules, unrelated files) out-of-scope. MERGE-STATUS: hele Phase 8 zit op feature/seo-geo-kennisbank, niet main — verifieer merge vóór live. Volgende: merge naar main + eventueel batch 3 (deferred: 12 skills-artikelen + thematische stukken).

--- VORIGE SESSIE ---
Stopped at (08-06): Completed 08-06-PLAN.md (CONT-14/15 product/Clyde clusters). Geschreven: `content/blog/ai-agent-vs-ai-tool-marketing.mdx` (CONT-14, 1017w, 5 <h2 id>, defensible-claims ComparisonTable tool-vs-medewerker met highlightColumn={1} + dated caption juni 2026, agent-vs-tool grens op 4 eigenschappen) + `content/blog/ai-marketing-agent-geheugen-en-leren.mdx` (CONT-15, 1149w, 5 <h2 id>, 1 Callout, geheugen+leren per merk = Clyde USP, /nl/memory deeplink). Beide: category product-clyde, clusterOf ai-marketing-medewerker, schemaType BlogPosting, ≥5 FAQs, exact 1 /apply CtaBlock, geen em-dash, AI-tool alleen contrastief, bidirectioneel verbonden met pillar (08-03 forward-linkt al, deze clusters back-linken nu) + sibling. Build PASS (129 static pages, +2 t.o.v. 08-05's 127). BlogPosting + FAQPage JSON-LD bevestigd in gerenderde .next-HTML voor beide. check:palette PASS. Auto-fix (Rule 1): ComparisonTable kolom/highlight-mapping gecorrigeerd vóór commit (component rendert row.label als 1e cel, columns mappen op values). Commits c5f4b77 (CONT-14) + 69009e1 (CONT-15); Task 3 verificatie-only. CONT-14 + CONT-15 afgevinkt. MERGE-STATUS: Phase 8 zit op feature/seo-geo-kennisbank, niet main. Volgende: sluitsteen 08-07 (CONT-16) — verifieert beide clusters in product-clyde bucket op /resources + bidirectionele back-links.
Resume file: None
