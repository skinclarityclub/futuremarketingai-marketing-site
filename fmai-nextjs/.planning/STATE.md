---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-06-02T12:17:20.643Z"
progress:
  total_phases: 3
  completed_phases: 2
  total_plans: 11
  completed_plans: 5
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-02)

**Core value:** FutureMarketingAI wordt geciteerd door AI-engines en rankt op non-branded GEO/agency-keywords, via diepe content die het eigen Blog Factory-product produceert.
**Current focus:** Phase 3 (cornerstone content) in uitvoering. Plan 03-02 voltooid (AI marketing automation pillar). Resterend in Phase 3: 03-01, 03-03 t/m 03-07.

## Current Position

Phase: 3 of 7 (Cornerstone-content) — IN PROGRESS
Plan: 03-02 voltooid (1 van 7 plannen in deze fase). Let op: 03-01 nog niet uitgevoerd; plannen worden niet strikt op volgorde gedraaid.
Status: NL pillar "AI marketing automation voor bureaus" live op feature/seo-geo-kennisbank, pillar:true onder ai-marketing-automation hub, Article + FAQPage JSON-LD geverifieerd. CONT-05 done.
Last activity: 2026-06-02 — Plan 03-02 voltooid (content/blog/ai-marketing-automation-voor-bureaus.mdx, 1893 woorden, verse NL-pillar op exact keyword; build PASS, statisch gegenereerd voor nl, JSON-LD valide, één /apply CTA)

Progress: [████░░░░░░] 42%

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
| Phase 03 P02 | 7 | 3 tasks | 1 files |

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
- [Phase 03-02]: Verse NL-pillar op exact keyword i.p.v. oud EN ai-marketing-automation-guide.mdx hergebruiken — voorkomt duplicate-intent (03-RESEARCH Pitfall 3)
- [Phase 03-02]: Pricing in pillars conceptueel benoemen (werkruimte-geprijsd) met deeplink naar /nl/pricing i.p.v. tarieven hardcoden (pricing-data.ts SSoT)
- [Phase 03-02]: Forbidden glossary-term 'AI-tool' alleen contrastief gebruiken (wat Clyde NIET is), conform de glossary-definitie zelf — niet als productlabel

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
Stopped at: Completed 03-02-PLAN.md (AI marketing automation pillar). content/blog/ai-marketing-automation-voor-bureaus.mdx — verse NL-pillar, 1893 woorden, pillar:true category ai-marketing-automation, Article + FAQPage JSON-LD geverifieerd, één /apply CTA. Commits 7cbdf73 + 83cac68 op feature/seo-geo-kennisbank. CONT-05 done. Resterend in Phase 3: 03-01, 03-03 t/m 03-07. De pillar-slug ankert al de CONT-06 Clyde-cluster + CONT-07 comparison via in-body links.
Resume file: None
