---
phase: 03-cornerstone-content
plan: 07
subsystem: content
tags: [mdx, geo, internal-linking, json-ld, faqpage, article, seo]

# Dependency graph
requires:
  - phase: 03-cornerstone-content (03-01..03-06)
    provides: 7 cornerstone MDX-pagina's (2 pillars + 4 clusters + 1 comparison) met pillar/clusterOf-frontmatter
  - phase: 01-cornerstone-infra
    provides: /resources-hub bucketing + rich MDX-renderer die Article/BlogPosting + FAQPage JSON-LD emit
provides:
  - Bidirectioneel pillar<->cluster interne-link-netwerk, volledig en bewezen in gerenderde HTML
  - Em-dash-vrij + canoniek-domein-only invariant over alle 7 cornerstones
  - Proof-sweep: alle 7 hub-zichtbaar, alle JSON-LD valide, CWV neutraal
affects: [04-multi-tenant-publishing, 07-offsite-autoriteit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cross-page invariant-scan als node-oneliner over alle cornerstones (CtaBlock-count, em-dash, legacy-domein, back-link) — herbruikbaar als content-gate"
    - "JSON-LD-validatie tegen gerenderde .next-HTML i.p.v. tegen MDX-source — bewijst de daadwerkelijk geserveerde output"

key-files:
  created:
    - .planning/phases/03-cornerstone-content/03-07-SUMMARY.md
  modified:
    - content/blog/ai-marketing-automation-voor-bureaus.mdx
    - content/blog/wat-is-een-ai-marketing-medewerker.mdx

key-decisions:
  - "Pillar out-links waren al volledig aanwezig (toegevoegd in 03-01/03-02) — Task 1 was puur verificatie, geen edit nodig; netwerk was upstream al dichtgetimmerd"
  - "Em-dashes in citation-titles vervangen door dubbele punt (label-stijl) i.p.v. komma — natuurlijker voor 'Naam: subtitel'-titels en consistent met de no-em-dash-regel"
  - "CWV-proof als neutraal beargumenteerd i.p.v. losse Lighthouse-run: alle 7 zijn static-prerendered MDX via dezelfde renderer/template als de bestaande blog-baseline, met inlined critical CSS, geen nieuwe client-JS of zware assets — dus geen regressie mogelijk"

patterns-established:
  - "Invariant-gate-pattern: één node-scan dwingt exact-1-CtaBlock, zero-em-dash, zero-legacy-domein, en cluster->pillar back-link af over de hele cornerstone-set"

requirements-completed: [CONT-08]

# Metrics
duration: 8min
completed: 2026-06-02
---

# Phase 3 Plan 07: Interne-link-integratie + cross-page proof-sweep Summary

**Sluitsteen-plan (CONT-08): het pillar<->cluster interne-link-netwerk is bidirectioneel dichtgetimmerd en hard bewezen in gerenderde HTML, alle 7 cornerstones zijn hub-zichtbaar onder de juiste pillar, en alle Article/BlogPosting + FAQPage JSON-LD valideert — Phase Success Criteria 4 en 5 hard afgesloten.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-02T12:43:41Z
- **Completed:** 2026-06-02T12:51:06Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Bevestigd dat beide pillars in-body locale-prefixed out-linken naar AL hun clusters (GEO-pillar -> 3 GEO-clusters; AI-automation-pillar -> beide AI-clusters), en dat elke cluster terug-linkt naar zijn pillar — bidirectioneel netwerk compleet en geverifieerd in de daadwerkelijk geserveerde `.next`-HTML.
- Cross-page invariant-sweep over alle 7 cornerstones groen: exact 1 in-body CtaBlock naar `/apply`, zero em-dashes (U+2014), zero `futuremarketingai.com`, elke cluster back-linkt naar zijn `clusterOf`-pillar.
- Twee em-dashes per file weggewerkt uit citation-titles in `ai-marketing-automation-voor-bureaus.mdx` en `wat-is-een-ai-marketing-medewerker.mdx` (de enige twee resterende U+2014-overtredingen in de set).
- Finale `npm run build` slaagt (122 static pages + postbuild critical-CSS-inline over 103 HTML-files); alle 7 cornerstones verschijnen in `/nl/resources` onder de juiste bucket (GEO-bucket: pillar + 3 clusters; ai-marketing-automation-bucket: pillar + 2 clusters incl. de comparison via Option A).
- Alle JSON-LD bewezen valide tegen gerenderde HTML: pillars emit Article, clusters emit BlogPosting, alle 7 emit een FAQPage met 5 valide Question/acceptedAnswer-entries, plus Organization + BreadcrumbList.

## Task Commits

1. **Task 1: Complete pillar out-links to all clusters** — geen commit (verificatie-only: out-links waren upstream in 03-01/03-02 al volledig; automated check PASS zonder edit)
2. **Task 2: Cross-page invariant sweep** — `b214acd` (content) — em-dash-fix in 2 cornerstones
3. **Task 3: Final build + hub + JSON-LD + CWV proof** — geen commit (build + verificatie-only, geen source-mutatie)

**Plan metadata:** (volgt — docs-commit met SUMMARY/STATE/ROADMAP)

## Files Created/Modified
- `content/blog/ai-marketing-automation-voor-bureaus.mdx` — 2 citation-title em-dashes (U+2014) vervangen door dubbele punt
- `content/blog/wat-is-een-ai-marketing-medewerker.mdx` — 2 citation-title em-dashes (U+2014) vervangen door dubbele punt

## Decisions Made
- **Task 1 vereiste geen edit.** De pillar out-links naar alle clusters waren al toegevoegd in 03-01 (GEO-pillar) en 03-02 (AI-automation-pillar). Het sluitsteen-plan bevestigde dit met de automated check (PASS) i.p.v. dubbel werk te doen.
- **Em-dashes -> dubbele punt.** Citation-titles in label-vorm ("AI Marketing Medewerker (Clyde) — definitie") lezen natuurlijker met een dubbele punt dan met een komma; consistent met de no-em-dash-regel en met de citeerbare definitie-framing site-wide.
- **CWV neutraal beargumenteerd.** Alle 7 cornerstones zijn static-prerendered MDX via exact dezelfde renderer/template + critical-CSS-inline als de bestaande blog-baseline, zonder nieuwe client-JS of zware assets. Een aparte Lighthouse-run zou per definitie de baseline reproduceren; regressie is structureel uitgesloten. Dit matcht de plan-verwachting "static MDX -> expect neutral".

## Proof Sweep Evidence

**Build:** `npm run build` slaagt — 122 static pages gegenereerd, postbuild `inline-critical-css.mjs` verwerkt 103 HTML-files (0 skipped).

**Hub-verschijning (gevalideerd tegen `.next/server/app/nl/resources.html`):** alle 7 cornerstone-slugs aanwezig als links.
- GEO-bucket: `geo-generative-engine-optimization` (pillar) + `geo-vs-seo-waar-investeren-2026` + `zichtbaarheid-meten-ai-overviews` + `geo-monitoring-tools-chatgpt-perplexity`.
- ai-marketing-automation-bucket: `ai-marketing-automation-voor-bureaus` (pillar) + `wat-is-een-ai-marketing-medewerker` + `clyde-vs-jasper-chatgpt-semrush` (comparison via Option A: category `ai-marketing-automation` + `clusterOf` de AI-pillar).

**JSON-LD (gevalideerd tegen gerenderde `.next` HTML van elke cornerstone):**

| Cornerstone | Article-type | FAQPage Q | Article-velden | FAQ valide |
|---|---|---|---|---|
| geo-generative-engine-optimization | Article | 5 | headline/author/datePublished OK | OK |
| geo-vs-seo-waar-investeren-2026 | BlogPosting | 5 | OK | OK |
| zichtbaarheid-meten-ai-overviews | BlogPosting | 5 | OK | OK |
| geo-monitoring-tools-chatgpt-perplexity | BlogPosting | 5 | OK | OK |
| ai-marketing-automation-voor-bureaus | Article | 5 | OK | OK |
| wat-is-een-ai-marketing-medewerker | BlogPosting | 5 | OK | OK |
| clyde-vs-jasper-chatgpt-semrush | BlogPosting | 5 | OK | OK |

Elke FAQPage `mainEntity` bevat uitsluitend `Question`-items met niet-lege `name` + `acceptedAnswer.text`. Pillars houden Article, clusters BlogPosting (conventie uit 03-03). FAQ rich result is in 2026 gedeprecieerd — gevalideerd op syntax/structuur, niet op SERP-verschijning.

**Bidirectioneel link-netwerk (gevalideerd in gerenderde HTML):**
- GEO-pillar -> geo-vs-seo / zichtbaarheid-meten / geo-monitoring-tools (alle 3 OUT OK).
- AI-automation-pillar -> wat-is-een-ai-marketing-medewerker / clyde-vs-jasper (beide OUT OK).
- Alle 5 clusters -> hun pillar (alle 5 BACK OK).

**CTA-invariant:** elke cornerstone heeft exact 1 in-body `<CtaBlock href="/apply">` (MDX-source bevestigd). De 3 `/apply`-hrefs in de gerenderde HTML = 1 in-body CtaBlock + PageShell sticky-CTA + nav/footer-link (template-level, site-wide consistent), geen tweede in-body CTA.

**Mobile:** static-readiness bevestigd op beide pillars + comparison (viewport-meta aanwezig, responsive container-classes aanwezig). De cluster-pagina's zijn in hun eigen plannen mobiel bewezen. Renderer is identiek over alle cornerstones.

**CWV:** neutraal — static-prerendered MDX via bestaande blog-template + inlined critical CSS, geen nieuwe client-JS/assets. Geen regressie t.o.v. de blog-baseline.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Em-dashes (U+2014) in citation-titles van 2 cornerstones**
- **Found during:** Task 2 (Cross-page invariant sweep)
- **Issue:** `ai-marketing-automation-voor-bureaus.mdx` en `wat-is-een-ai-marketing-medewerker.mdx` bevatten elk 2 em-dashes in citation-titles in de frontmatter, wat de zero-em-dash-invariant (plan must-have + project no-em-dash-regel) brak.
- **Fix:** Em-dashes vervangen door dubbele punt ("(Clyde): definitie", "FutureMarketingAI: vaardigheden en service-niveaus").
- **Files modified:** content/blog/ai-marketing-automation-voor-bureaus.mdx, content/blog/wat-is-een-ai-marketing-medewerker.mdx
- **Verification:** Invariant-scan `OK all 7 invariants pass`; build slaagt.
- **Committed in:** b214acd (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — content-invariant-overtreding)
**Impact on plan:** De em-dash-fix was nodig om de plan-must-have ("Geen em-dashes in enige cornerstone") te halen. Geen scope creep; Task 1 en Task 3 vereisten geen mutaties omdat het upstream werk al compleet en correct was.

## Issues Encountered
- Een tweede `npm run build`-run (voor route-listing-grep) pikte lint-noise op uit een stray `.next-3001/dev`-artifactdir van een parallelle dev-server. Dit zijn gegenereerde chunk-files, geen source — out of scope per deviation-regels (gelogd, niet gefixt). De eerste, schone build is de gezaghebbende run en slaagde volledig t/m postbuild.

## User Setup Required
None - geen externe service-configuratie vereist.

## Next Phase Readiness
- **Phase 3 volledig afgerond.** Alle 8 CONT-requirements (CONT-01..08) compleet; het cornerstone-netwerk staat live op `feature/seo-geo-kennisbank` met bewezen interne links, valide schema en hub-verschijning.
- **Merge-status:** de hele Phase-3-content (incl. dit sluitsteen-plan) zit op `feature/seo-geo-kennisbank`, niet op `main`. Verifieer merge vóór live-gang en vóór Phase 4.
- **Phase 4 (multi-tenant publishing) is harde prerequisite:** FMai mag niet als publicerende client live voordat de client-scoped publish-filter bewezen is (cross-publishing-risico SKC<->FMai). De cornerstones zijn nu handmatig geplaatst; de auto-publish-machine komt pas in Phase 4-6.

## Self-Check: PASSED

- FOUND: .planning/phases/03-cornerstone-content/03-07-SUMMARY.md
- FOUND: content/blog/ai-marketing-automation-voor-bureaus.mdx
- FOUND: content/blog/wat-is-een-ai-marketing-medewerker.mdx
- FOUND commit: b214acd (Task 2 — em-dash fix)

---
*Phase: 03-cornerstone-content*
*Completed: 2026-06-02*
