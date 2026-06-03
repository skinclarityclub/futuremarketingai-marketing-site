---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 04
subsystem: content
tags: [mdx, blog, agency-ops, geo, seo, json-ld, next-intl]

# Dependency graph
requires:
  - phase: 08-02
    provides: "agency-ops pillargids content/blog/marketingbureau-schalen-met-ai.mdx (de pillar waar deze 2 clusters onder hangen + naar forward-linkt)"
  - phase: 03
    provides: "bewezen blog-renderer + cluster MDX-template (wat-is-een-ai-marketing-medewerker.mdx) + per-page proof-gates"
provides:
  - "CONT-10: agency-ops efficiency cluster (welk werk AI overneemt, selectie+integratieframework, AVG-note)"
  - "CONT-11: agency-ops ROI-meet-framework cluster (6 indicatoren, before-after, leert framework promises geen cijfer)"
  - "Bidirectionele in-body links: beide clusters <-> agency-ops pillar + onderling sibling-link"
affects: [08-05, 08-07, batch-3-skills-artikelen]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cluster-paar onderling sibling-gelinkt (CONT-10 <-> CONT-11) bovenop de verplichte pillar-back-link"
    - "ROI-cluster leert een framework en belooft expliciet GEEN cijfer (sterke GEO-play, citeerbare neutrale how-to-measure gids)"

key-files:
  created:
    - content/blog/ai-efficientie-marketingbureau.mdx
    - content/blog/meetbare-ai-marketing-resultaten.mdx
  modified: []

key-decisions:
  - "CONT-10 winnende invalshoek = selectie- + integratieframework (volume/oordeel/meetbaarheid 3-assen), geen tool-lijst, met AVG als ontwerpkeuze i.p.v. sluitstuk"
  - "CONT-11 leert een 6-indicator ROI-framework (incrementele omzet, CLV, CAC, ROAS, conversie-lift, bespaarde tijd) + nulmeting/before-after, en belooft bewust geen percentage; marktcijfers expliciet als marktcontext gekaderd, nooit als belofte of FMai/SKC-resultaat"
  - "Beide clusters gemodelleerd op de Phase-3 cluster-template (BlogPosting, expliciete <h2 id>, block-YAML frontmatter, 1 CtaBlock -> /apply)"

patterns-established:
  - "Sibling-cross-link tussen 2 clusters onder dezelfde pillar (naast de verplichte pillar-back-link), verifieerbaar in gerenderde HTML"

requirements-completed: [CONT-10, CONT-11]

# Metrics
duration: 8min
completed: 2026-06-02
---

# Phase 8 Plan 04: Agency-ops efficiency + ROI-framework clusters Summary

**Twee verse NL agency-ops clusters (CONT-10 AI-efficiëntie selectie/integratieframework + CONT-11 ROI-meet-framework) live onder de pillar marketingbureau-schalen-met-ai, bidirectioneel gelinkt, met valide BlogPosting + FAQPage JSON-LD.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-02T15:48:36Z
- **Completed:** 2026-06-02T15:56:47Z
- **Tasks:** 3 (2 authoring + 1 build/proof)
- **Files modified:** 2 created

## Accomplishments

- CONT-10 `ai-efficientie-marketingbureau.mdx` (1293w): welk werk AI als eerste overneemt (content/rapportage/lead-kwalificatie/data-analyse), een selectie- + integratieframework op 3 assen (volume/oordeel/meetbaarheid) i.p.v. een tool-lijst, human-in-the-loop, en een AVG-sectie die naleving als ontwerpkeuze positioneert.
- CONT-11 `meetbare-ai-marketing-resultaten.mdx` (1317w): een praktisch NL ROI-meet-framework met 6 indicatoren (incrementele omzet, CLV, CAC, ROAS, conversie-lift, bespaarde tijd), nulmeting + before-after-methode, een valkuilen-sectie (toeschrijving + vanity metrics). Leert het framework, belooft geen cijfer.
- Beide: precies één `<CtaBlock href="/apply">`, in-body back-link naar de agency-ops pillar + onderlinge sibling-link, TOC-ids resolven, geen em-dash, glossary-termen gerespecteerd, marktstats zacht-geciteerd als marktcontext (nooit als FMai/SKC eigen resultaat).
- Build PASS: 127 static pages (was 123 na 08-02; +2 nieuwe artikelen + locale-routing), beide nl-URLs gegenereerd. BlogPosting + FAQPage JSON-LD valide in gerenderde `.next`-HTML; beide verschijnen onder de agency-ops bucket in `/nl/resources`.

## Task Commits

1. **Task 1: Author CONT-10 ai-efficientie-marketingbureau.mdx** - `bb95bae` (content)
2. **Task 2: Author CONT-11 meetbare-ai-marketing-resultaten.mdx** - `4f5f4a4` (content)
3. **Task 3: Build + JSON-LD proof** - verification-only, geen source-mutatie, geen aparte commit

## Files Created/Modified

- `content/blog/ai-efficientie-marketingbureau.mdx` - CONT-10 agency-ops efficiency cluster (BlogPosting, clusterOf marketingbureau-schalen-met-ai)
- `content/blog/meetbare-ai-marketing-resultaten.mdx` - CONT-11 agency-ops ROI-meet-framework cluster (BlogPosting, clusterOf marketingbureau-schalen-met-ai)

## Decisions Made

- CONT-10's winnende invalshoek werd een selectie- + integratieframework (3-assen: volume, oordeel, meetbaarheid) i.p.v. een tool-lijst, conform 08-RESEARCH (de void in AI-engine-antwoorden = een concreet NL framework, niet weer een "beste AI-tools"-lijst). AVG behandeld als ontwerpkeuze (dataminimalisatie, doelbinding, menselijke verantwoordelijkheid) in plaats van een losse compliance-noot.
- CONT-11 leert een 6-indicator ROI-framework en belooft bewust geen percentage (08-RESEARCH Pitfall 3 + must_have): marktcijfers expliciet gekaderd als marktcontext ("in de markt wordt gerapporteerd"), met een Callout-warning die juist waarschuwt tegen het overnemen van marktcijfers als belofte. Sterkste GEO-play: een neutrale, citeerbare how-to-measure gids.
- Sibling-cross-link tussen de twee clusters toegevoegd bovenop de verplichte pillar-back-link, zodat het cluster-netwerk onder de agency-ops pillar dicht is.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Eén tussentijdse HTML-leescheck faalde transient met ENOENT op exact dezelfde paden die een call eerder wel resolveerden (CWD/loop-resolutie in de Bash-tool tussen calls); opnieuw gedraaid met de bevestigde absolute pad-basis en alle checks slaagden. Geen content- of build-probleem.
- De `/nl/apply`-telling in gerenderde HTML is 5 (header/footer site-wide nav + de CtaBlock-knop), niet 1. De one-CTA-regel is bewezen op MDX-source-niveau (exact 1 `<CtaBlock>` en exact 1 `href="/apply"` in de body) zoals de plan-verify voorschrijft; de extra hits zijn de globale layout-links.

## Verification Evidence

- `npm run build` compileerde succesvol, 127/127 static pages gegenereerd; `.next/server/app/nl/blog/{ai-efficientie-marketingbureau,meetbare-ai-marketing-resultaten}.html` bestaan.
- Per-file frontmatter+content gate (gray-matter): clusterOf=marketingbureau-schalen-met-ai, category=agency-ops, schemaType=BlogPosting, faqs>=5, geen em-dash (U+2014), CtaBlock=1, /apply-href=1, alle tableOfContents-ids resolven naar een `<h2 id>`, pillar-back-link present, woordtellingen 1293w / 1317w (binnen 900-1500).
- Gerenderde HTML: BlogPosting + FAQPage JSON-LD = true voor beide; pillar-back-link + sibling-link present; CTA-label "Plan een gesprek" present; beide in `/nl/resources` onder agency-ops bucket.
- CWV/mobile beargumenteerd-neutraal: static-prerendered MDX via identieke bewezen blog-renderer/template als de 8 Phase-3 cornerstones + 08-02 pillar, geen nieuwe client-JS/assets.

## Next Phase Readiness

- Agency-ops pillar heeft nu 2 van zijn geplande clusters (CONT-10/11). 08-05 levert CONT-12 (proof/case-cluster) als 3e agency-ops cluster; daarna product/Clyde pillar+clusters; sluitsteen 08-07 (CONT-16 wiring-helft).
- MERGE-STATUS: Phase 8 zit op `feature/seo-geo-kennisbank`, niet main. Verifieer merge-status vóór phase-afronding.

## Self-Check: PASSED

- FOUND: content/blog/ai-efficientie-marketingbureau.mdx
- FOUND: content/blog/meetbare-ai-marketing-resultaten.mdx
- FOUND: .planning/phases/08-.../08-04-SUMMARY.md
- FOUND commit: bb95bae (CONT-10)
- FOUND commit: 4f5f4a4 (CONT-11)

---
*Phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters*
*Completed: 2026-06-02*
