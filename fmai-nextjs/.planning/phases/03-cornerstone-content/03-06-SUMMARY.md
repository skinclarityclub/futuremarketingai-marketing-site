---
phase: 03-cornerstone-content
plan: 06
subsystem: content
tags: [mdx, blog, comparison, money-page, json-ld, clyde, jasper, chatgpt, semrush]

# Dependency graph
requires:
  - phase: 01-kennisbank-infrastructuur
    provides: SKC-grade MDX template (frontmatter schema, BlogPostMeta, block-YAML, explicit <h2 id>, Article + FAQPage JSON-LD emission, /resources hub bucket logic)
  - phase: 03-cornerstone-content
    plan: 02
    provides: live ai-marketing-automation pillar (slug ai-marketing-automation-voor-bureaus) as the clusterOf anchor for hub-visibility
provides:
  - "NL comparison money-page 'Clyde vs Jasper vs ChatGPT vs Semrush' (slug clyde-vs-jasper-chatgpt-semrush), 1259 body-words, cluster of the ai-marketing-automation pillar"
  - "ComparisonTable highlightColumn={0} on Clyde with dated, grounded caption + category-level defensible rows"
  - "Hub-visible cluster under the ai-marketing-automation bucket (Option A hub-fix, Success Criterion 4)"
  - "Article (BlogPosting) + FAQPage JSON-LD verified in rendered HTML"
affects: [03-07, cornerstone-content, comparison-money-page, resources-hub]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Comparison money-page placed under a pillar bucket via clusterOf (Option A) instead of category 'comparisons' (no hub bucket) so the page is hub-visible"
    - "Competitor rows phrased at category level with string nuance ('Deels') where a boolean would be a false claim against grounded facts (Jasper has memory + GEO)"

key-files:
  created:
    - content/blog/clyde-vs-jasper-chatgpt-semrush.mdx
  modified: []

key-decisions:
  - "Hub-fix Option A locked: category ai-marketing-automation + clusterOf ai-marketing-automation-voor-bureaus. category 'comparisons' deliberately avoided (it has no /resources bucket and would render the money-page invisible)"
  - "Competitor matrix built from live juni-2026 grounding (Gemini grounded search, 44 sources). Jasper DOES have Company Memory/Brand Voice + GEO Diagnostic, so the Clyde differentiator is framed as work-model (meewerkende medewerker vs tool je bedient), NOT as feature accusations"
  - "Uncertain competitor cells use a string ('Deels') rather than a false boolean (research Pitfall 5): 'Werkt per merk' is Deels for Jasper/ChatGPT, 'GEO/SEO-tracking' is Deels for Jasper"
  - "Clyde pricing referenced conceptually (werkruimte-geprijsd, Founding-tarief + per-werkruimte) with deeplink-able language, no hardcoded tarieven, conform pricing-data.ts SSoT"
  - "Em-dashes removed from citation titles (colon substitution) per the no-em-dash user rule; the Task-1 verifier only checks the body, so frontmatter was hand-checked separately"

patterns-established:
  - "Comparison page is a cluster (pillar:false / unset) of the CONT-05 pillar; relatedSlugs forward-link the pillar + the Clyde-cluster, both of which are now live so the links resolve"

requirements-completed: [CONT-07]

# Metrics
duration: 9min
completed: 2026-06-02
---

# Phase 3 Plan 06: Clyde vs Jasper vs ChatGPT vs Semrush comparison money-page Summary

**Conversie-gerichte NL comparison money-page die Clyde als categorie (meewerkende AI Marketing Medewerker) onderscheidt van Jasper (content-platform), ChatGPT (algemene assistent) en Semrush (SEO-suite), met een Clyde-gehighlighte ComparisonTable, gegronde claims uit live juni-2026 research, één /apply CTA en geverifieerde Article + FAQPage JSON-LD, hub-zichtbaar onder de ai-marketing-automation pillar.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-06-02T12:27:09Z
- **Completed:** 2026-06-02T12:36:14Z
- **Tasks:** 3
- **Files modified:** 1 (created)

## Accomplishments
- Grounded competitor-positionering via live web-research (Gemini grounded, 44 bronnen, juni 2026): Jasper = marketing content-platform met Company Memory + GEO Diagnostic; ChatGPT = algemene assistent met team-memory maar zonder ingebouwde GEO/SEO-tracking; Semrush = SEO/visibility-suite met AI-citation-tracking. Defensieve, categorie-niveau claims i.p.v. interne feature-asserties
- Verse NL money-page (1259 body-woorden) met antwoord-eerst opener, 4 vergelijkingssecties + tabel-sectie + keuzehulp; 6 `<h2 id>`-secties resolven 1-op-1 naar de tableOfContents
- Eén `<ComparisonTable>` met `highlightColumn={0}` (Clyde), gedateerde caption ("publieke productinformatie, juni 2026"), 8 categorie-rijen; onzekere competitor-cellen als string "Deels" i.p.v. false boolean
- Hub-fix Option A: `category: ai-marketing-automation` + `clusterOf: ai-marketing-automation-voor-bureaus` → de bucket-logica van /resources plaatst de pagina als cluster onder de ai-marketing-automation pillar (geverifieerd via de exacte page.tsx-logica)
- Eén `/apply` CtaBlock; in-body locale-prefixed links naar de pillar en de Clyde-cluster (beide live → links resolven); 5 gegronde citations; geen em-dash
- Build slaagt, pagina statisch gegenereerd voor `nl` (122/122), runtime-HTML bevat BlogPosting + BreadcrumbList + FAQPage JSON-LD; tabel zit in `overflow-x-auto` (mobiel-scrollbaar)

## Task Commits

Each task was committed atomically:

1. **Task 1: Re-ground competitor claims + frontmatter** - `7db3c0e` (content)
2. **Task 2: Body + ComparisonTable (Clyde highlighted) + CTA** - `7db3c0e` (content — same artifact commit; splitting a brand-new file's frontmatter from its body would leave a non-buildable intermediate)
3. **Task 3: Build + hub-visibility + mobile + JSON-LD proof** - verification-only, no new source files (proof captured against the Task 1/2 commit)

**Plan metadata:** final docs commit — see git log.

## Files Created/Modified
- `content/blog/clyde-vs-jasper-chatgpt-semrush.mdx` - NL comparison money-page: frontmatter (cluster of CONT-05 pillar, 5 takeaways, 6 TOC, 5 FAQs, 5 grounded citations) + 1259-woord body, één ComparisonTable highlightColumn={0}, één /apply CtaBlock

## Decisions Made
- Hub-fix Option A: category ai-marketing-automation + clusterOf CONT-05 pillar (NIET category comparisons, dat heeft geen hub-bucket → onzichtbaar)
- Differentiator op werkmodel (meewerkende medewerker vs tool je bedient), niet op losse features, omdat live research bevestigt dat Jasper ook merkgeheugen + GEO heeft
- Onzekere competitor-cellen als string "Deels" i.p.v. false boolean (Pitfall 5)
- Clyde-prijs conceptueel benoemd (werkruimte-geprijsd, Founding + per-werkruimte), geen hardcoded tarieven (pricing-data.ts SSoT)
- Em-dashes uit citation-titels verwijderd (colon-substitutie) per no-em-dash regel

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Em-dashes in citation titles**
- **Found during:** Task 1 verification (em-dash check)
- **Issue:** De Task-1 verifier checkt alleen `d.content` (body), maar de 5 citation-titels in de frontmatter bevatten em-dashes (U+2012), wat de no-em-dash user-rule schendt voor user-facing copy (citation-titels renderen op de pagina)
- **Fix:** Em-dashes vervangen door dubbele punt in alle 5 citation-titels; volledige-bestand em-dash scan toegevoegd ter bevestiging
- **Files modified:** content/blog/clyde-vs-jasper-chatgpt-semrush.mdx
- **Commit:** `7db3c0e`

**2. [Rule 2 - Missing critical content] Body te kort voor de woorden-bar**
- **Found during:** Task 2 verification (word count 853 < 1000)
- **Issue:** De ComparisonTable-JSX telt niet mee in de tag-gestripte word count, waardoor de eerste versie onder de 1000-woord drempel bleef
- **Fix:** 4 vergelijkingssecties + keuzehulp uitgebreid met substantieve, gegronde prose (naar 1259 woorden) zonder de tabel te bloaten of claims te verzwakken
- **Files modified:** content/blog/clyde-vs-jasper-chatgpt-semrush.mdx
- **Commit:** `7db3c0e`

## Issues Encountered
- Build-output toont ~1300 pre-existing ESLint errors + ~17380 warnings (React Compiler setState-in-effect, @ts-ignore, refs-during-render) in ongerelateerde bestanden. Out-of-scope per de scope-boundary regel: niet veroorzaakt door deze MDX-content. `✓ Compiled successfully in 6.7s` + `✓ Generating static pages (122/122)` + de gegenereerde route bevestigen dat de build slaagt. Niet aangeraakt.

## User Setup Required

None - no external service configuration required. Externe rich-results validatie (Rich Results Test) vereist de live URL; lokaal is BlogPosting + FAQPage JSON-LD al runtime-geverifieerd in de gerenderde HTML.

## Next Phase Readiness
- CONT-07 done: de comparison money-page is live, hub-zichtbaar onder de ai-marketing-automation pillar, met Clyde-gehighlighte tabel + één /apply CTA
- 03-07 (back-link/verification pass) kan deze slug nu opnemen in de pillar back-links; de forward-links vanuit deze pagina naar pillar + Clyde-cluster resolven al
- Phase Success Criteria 3 (comparison met highlight + één CTA) en 4 (hub-zichtbaar onder pillar) zijn structureel gegarandeerd

## Self-Check: PASSED

- FOUND: content/blog/clyde-vs-jasper-chatgpt-semrush.mdx
- FOUND: .planning/phases/03-cornerstone-content/03-06-SUMMARY.md
- FOUND commit: 7db3c0e (Clyde comparison money-page)
- VERIFIED: hub bucket logic places the page as cluster under ai-marketing-automation
- VERIFIED: BlogPosting + FAQPage JSON-LD in rendered HTML

---
*Phase: 03-cornerstone-content*
*Completed: 2026-06-02*
