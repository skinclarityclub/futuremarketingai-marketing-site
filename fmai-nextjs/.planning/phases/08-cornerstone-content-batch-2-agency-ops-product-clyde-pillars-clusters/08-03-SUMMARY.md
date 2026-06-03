---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 03
subsystem: content
tags: [mdx, seo, geo, cornerstone, pillar, product-clyde, clyde, json-ld]

# Dependency graph
requires:
  - phase: 08-01
    provides: "product-clyde als 4e PILLAR_BUCKETS hub-bucket + i18n (nl/en/es) + homepage productPillar teaser-slot"
  - phase: 03 (CONT-06)
    provides: "wat-is-een-ai-marketing-medewerker cluster + glossary ai-marketing-medewerker definitie (cannibalisation-anchor)"
provides:
  - "Product/Clyde pillargids content/blog/ai-marketing-medewerker.mdx (CONT-13), pillar:true, category product-clyde, schemaType Article, 1817w"
  - "Categorie-definitie van de AI Marketing Medewerker (autonomie + langetermijngeheugen + vaardigheden), Clyde = FMai-implementatie"
  - "Down-link naar CONT-06 + forward-links naar CONT-14/15 (back-links wired in 08-07)"
  - "Vulling van de tot nu toe lege product-clyde hub-bucket op /resources"
affects: [08-04 (CONT-14 ai-agent-vs-ai-tool cluster), 08-06 (CONT-15 geheugen-cluster), 08-07 (CONT-16 sluitsteen back-links)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pillar-boven-cluster taxonomie: CONT-13 staat één niveau hoger dan CONT-06 en linkt DOWN i.p.v. de definitie te herhalen (anti-cannibalisatie)"
    - "Categorie-framing i.p.v. begripsuitleg: pillar definieert de PRODUCTCATEGORIE (3 eigenschappen), cluster CONT-06 levert de kale definitie"

key-files:
  created:
    - content/blog/ai-marketing-medewerker.mdx
  modified: []

key-decisions:
  - "Categorie-framing gekozen: pillar definieert de AI Marketing Medewerker als productcategorie via 3 eigenschappen (autonomie, langetermijngeheugen, vaardigheden), niet als begripsuitleg — dat houdt CONT-06 (de kale definitie) intact en voorkomt duplicate-intent"
  - "Clyde expliciet als IMPLEMENTATIE van de categorie gepositioneerd (categorie != merk), via een Callout — eerlijke positionering: de categorie definieren, niet bezitten"
  - "Slug ai-marketing-medewerker (head-keyword) gereserveerd voor de pillar; de bestaande CONT-06 houdt zijn eigen slug wat-is-een-ai-marketing-medewerker — geen file-collision, geen redirect nodig"
  - "category exact 'product-clyde' (de 4e bucket uit 08-01, Open Q1 Option B) i.p.v. ai-marketing-automation — pillar verschijnt in eigen hub-bucket"

patterns-established:
  - "Pillar-anti-cannibalisatie: distinct H1 + answer-first eerste zin + DOWN-link naar de smalle cluster, breedte over autonomie/geheugen/vaardigheden i.p.v. de definitie te herhalen"

requirements-completed: [CONT-13]

# Metrics
duration: 9min
completed: 2026-06-02
---

# Phase 8 Plan 03: Product/Clyde pillargids (CONT-13) Summary

**Verse NL product-pillar `ai-marketing-medewerker.mdx` (1817w, Article) die de AI Marketing Medewerker als productcategorie definieert (autonomie + langetermijngeheugen + vaardigheden) met Clyde als FMai-implementatie, zonder de CONT-06 definitie-cluster te kannibaliseren.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-06-02T15:48:41Z
- **Completed:** 2026-06-02T15:57:17Z
- **Tasks:** 3
- **Files modified:** 1 (created)

## Accomplishments
- Product/Clyde pillargids geschreven, 1817 woorden, 6 `<h2 id>`-secties die exact matchen aan de tableOfContents (de-categorie, autonomie, geheugen-en-leren, vaardigheden, clyde-als-implementatie, hoe-verhoudt-tot-tools).
- Categorie-definitie: 3 definierende eigenschappen (autonomie proactief vs reactief, langetermijngeheugen per merk, vaardigheden onder één regie); Clyde als concrete implementatie, regie blijft bij het bureau, werkruimte-geprijsd met /nl/pricing deeplink.
- Anti-cannibalisatie tegen CONT-06: andere H1 ("AI Marketing Medewerker: de productcategorie en Clyde"), andere answer-first eerste zin (productcategorie-hoek), één niveau hoger, in-body down-link naar /nl/blog/wat-is-een-ai-marketing-medewerker voor de kerndefinitie.
- Forward-links naar CONT-14 (ai-agent-vs-ai-tool-marketing) en CONT-15 (ai-marketing-agent-geheugen-en-leren) + /nl/memory; precies één in-body CtaBlock -> /apply.
- Build PASS (Compiled successfully, 127/127 static pages); article statisch gegenereerd voor nl; Article + FAQPage (5 Q&A) JSON-LD valide in gerenderde .next-HTML; alle 6 TOC-anchors resolven in HTML; pillar verschijnt in de product-clyde hub-bucket op /nl/resources (geen MISSING_MESSAGE). check:palette PASS.

## Task Commits

1. **Task 1 + 2: Frontmatter + 1500-3000w body (één file-write)** - `6adce32` (content)
   - Task 1 (block-YAML frontmatter, pillar:true, category product-clyde, Article, distinct title, 5 takeaways, 6 TOC, 5 FAQs, 4 citations) en Task 2 (1817w body, alle anchors, 1 CtaBlock, 1 /apply, down/forward-links) zaten in dezelfde file en zijn als één atomic commit vastgelegd — consistent met hoe 08-02 zijn pillar committe.
3. **Task 3: Build + hub-visibility + JSON-LD proof** - verificatie-only (geen source-mutatie, geen commit)

**Plan metadata:** (deze SUMMARY + STATE/ROADMAP/REQUIREMENTS) in de afsluitende docs-commit.

## Files Created/Modified
- `content/blog/ai-marketing-medewerker.mdx` - Product/Clyde pillargids (CONT-13): pillar:true, category product-clyde, schemaType Article, 1817w, 6 secties, 5 FAQs, 4 citations.

## Decisions Made
- **Categorie-framing i.p.v. begripsuitleg:** de pillar definieert de PRODUCTCATEGORIE via 3 eigenschappen (autonomie, langetermijngeheugen, vaardigheden) en laat de kale "wat is het"-definitie bij CONT-06. Dat is de gekozen anti-cannibalisatie-strategie uit 08-RESEARCH Pitfall 4.
- **Clyde = implementatie, niet de categorie:** expliciet gemaakt via Callout. Houdt de positionering eerlijk (de categorie definieren, niet bezitten) en geeft ruimte aan de claim dat er nog geen vaste NL-definitie van een autonome AI-marketingmedewerker los van een tool bestaat — dat gat is de SEO/GEO-winst.
- **Slug-scheiding:** head-keyword-slug `ai-marketing-medewerker` voor de pillar, CONT-06 houdt `wat-is-een-ai-marketing-medewerker`. Geen file-collision, geen redirect.
- **'AI-tool' alleen contrastief** (wat Clyde NIET is), conform glossary — zelfde lijn als 03-02/03-05/08-02.

## Deviations from Plan

None - plan executed exactly as written. Tasks 1+2 produceren samen één bestand en zijn in één commit vastgelegd (dezelfde aanpak als plan 08-02), wat geen scope-afwijking is.

## Issues Encountered
- De build-stap genereerde de verwachte grote ESLint-output (`@ts-ignore`, React-compiler effect-warnings) die de grep-filter aanvankelijk opving; dit zijn repo-brede pre-existing waarschuwingen, geen build-breakers en out-of-scope voor deze content-taak. `npm run build` exit 0 met "Compiled successfully" + 127/127 static pages bevestigt de daadwerkelijke build slaagde.
- De 3 `/nl/apply`-hrefs in de gerenderde article-HTML = 1 body-CtaBlock + 2 globale header/footer-nav-links; de single-CTA-eis geldt op source-niveau (exact 1 `<CtaBlock>`, geverifieerd in Task 2). Identiek patroon als de sibling 08-02 pillar.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Product-clyde hub-bucket is nu gevuld; de 2 eerder lege buckets (agency-ops via 08-02, product-clyde via dit plan) tonen beide hun pillar.
- Forward-links naar CONT-14 (08-04) en CONT-15 (08-06) staan klaar; back-links worden in sluitsteen 08-07 (CONT-16) bidirectioneel gemaakt.
- MERGE-STATUS: alles op branch `feature/seo-geo-kennisbank`, niet main. Parallelle wave-executors committen ook op deze branch (CONT-11/12 zichtbaar in log naast deze commit).

## Self-Check: PASSED
- FOUND: content/blog/ai-marketing-medewerker.mdx
- FOUND: commit 6adce32

---
*Phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters*
*Completed: 2026-06-02*
