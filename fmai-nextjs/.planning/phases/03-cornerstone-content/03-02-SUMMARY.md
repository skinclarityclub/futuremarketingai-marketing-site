---
phase: 03-cornerstone-content
plan: 02
subsystem: content
tags: [mdx, blog, pillar, seo, geo, json-ld, ai-marketing-automation, clyde]

# Dependency graph
requires:
  - phase: 01-kennisbank-infrastructuur
    provides: SKC-grade MDX pillar template (frontmatter schema, BlogPostMeta, block-YAML convention, explicit <h2 id> headings, Article + FAQPage JSON-LD emission)
  - phase: 02-content-pillar-spine
    provides: ai-marketing-automation pillar bucket id in BLOG_CATEGORIES + fma_content_pillars spine
provides:
  - "NL pillar 'AI marketing automation voor bureaus' (slug ai-marketing-automation-voor-bureaus), 1893 words, pillar:true, category ai-marketing-automation"
  - "Stable cluster-anchor slug for CONT-06 (Clyde-cluster) and CONT-07 (comparison money-page)"
  - "Article + FAQPage JSON-LD verified in static HTML output"
affects: [03-04, 03-05, 03-07, cornerstone-content, clyde-cluster, comparison-money-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vers schrijven op het exacte target-keyword i.p.v. het oude EN ai-marketing-automation-guide.mdx hergebruiken (vermijdt duplicate-intent, 03-RESEARCH Pitfall 3)"
    - "Forbidden glossary term 'AI-tool' alleen contrastief gebruikt (definieert wat Clyde NIET is), nooit als productlabel"

key-files:
  created:
    - content/blog/ai-marketing-automation-voor-bureaus.mdx
  modified: []

key-decisions:
  - "Oud ai-marketing-automation-guide.mdx (EN, category ai-marketing, geen pillar) ongemoeid gelaten; verse NL-pillar op het exacte keyword voorkomt duplicate-intent"
  - "Frontmatter mirrort de GEO-pillar shape verbatim (block-YAML object-arrays) zodat renderer TOC/takeaways/FAQ/citations + Article/FAQPage JSON-LD emit zonder config-drift"
  - "Pricing alleen conceptueel benoemd (werkruimte-geprijsd, herijkt elk halfjaar) met deeplink naar /nl/pricing i.p.v. tarieven hardcoden, conform pricing-data.ts SSoT-regel"
  - "'AI-tool' in body/FAQ is contrastief, niet labelend — consistent met de glossary-definitie zelf ('Geen losse tool, maar een meewerkende medewerker')"

patterns-established:
  - "Pillar cross-linkt in-body met locale-prefixed raw paths (/nl/blog/<slug>) naar zijn nog-te-schrijven cluster + comparison, zodat de clusterstructuur al verankerd is voordat die posts bestaan"

requirements-completed: [CONT-05]

# Metrics
duration: 7min
completed: 2026-06-02
---

# Phase 3 Plan 02: AI marketing automation pillar Summary

**Verse 1893-woord NL pillar-gids 'AI marketing automation voor bureaus' op het non-branded keyword, pillar:true onder de ai-marketing-automation hub, met geverifieerde Article + FAQPage JSON-LD en één /apply CTA.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-02T12:08:19Z
- **Completed:** 2026-06-02T12:15:44Z
- **Tasks:** 3
- **Files modified:** 1 (created)

## Accomplishments
- Verse NL pillar-gids op het exacte target-keyword "AI marketing automation voor bureaus" (CONT-05), 1893 woorden, on-brand positionering
- Volledige frontmatter (pillar:true, category ai-marketing-automation, locale nl, 5 takeaways, 6 TOC-entries, 5 FAQs, 3 valide citations) mirrort de GEO-pillar shape
- Zes `<h2 id>`-secties resolveren 1-op-1 naar de tableOfContents ids; antwoord-eerst openers (GEO-tactiek)
- In-body locale-prefixed cross-links verankeren de CONT-06 Clyde-cluster en de CONT-07 comparison-slug
- Build passeert; pagina statisch gegenereerd voor `nl`; Article + FAQPage JSON-LD (5 vragen) geverifieerd in de output-HTML; CTA routeert naar /nl/apply

## Task Commits

Each task was committed atomically:

1. **Task 1: Author frontmatter for the AI-automation pillar** - `7cbdf73` (content)
2. **Task 2: Write the 1500-3000 word body** - `83cac68` (content)
3. **Task 3: Build + JSON-LD + mobile proof** - verification-only, no new source files (proof captured against Task 2 commit)

**Plan metadata:** (final docs commit — see git log)

## Files Created/Modified
- `content/blog/ai-marketing-automation-voor-bureaus.mdx` - Verse NL pillar-gids, frontmatter + 1893-woord body, één /apply CtaBlock, één Callout

## Decisions Made
- Oud `ai-marketing-automation-guide.mdx` ongemoeid gelaten; vers schrijven op het exacte keyword voorkomt duplicate-intent (03-RESEARCH Pitfall 3)
- Frontmatter mirrort de GEO-pillar verbatim (block-YAML) zodat de renderer TOC/takeaways/FAQ/citations + JSON-LD emit zonder config-drift
- Pricing conceptueel benoemd (werkruimte-geprijsd) met deeplink naar /nl/pricing, geen hardcoded tarieven (pricing-data.ts SSoT)
- "AI-tool" alleen contrastief gebruikt (wat Clyde NIET is), conform de glossary-definitie zelf

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Build-output toont 1300 pre-existing ESLint errors + 17379 warnings (React Compiler setState-in-effect, @ts-ignore, etc.) in ongerelateerde bestanden. Out-of-scope per de scope-boundary regel: niet veroorzaakt door deze MDX-content, en `✓ Compiled successfully` + `✓ Generating static pages (117/117)` bevestigen dat de build slaagt en de nieuwe pagina genereert. Niet aangeraakt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- De ai-marketing-automation pillar-slug staat stabiel en is in-body al gelinkt; CONT-06 (`wat-is-een-ai-marketing-medewerker`) en CONT-07 (`clyde-vs-jasper-chatgpt-semrush`) kunnen `clusterOf: ai-marketing-automation-voor-bureaus` zetten zonder de pillar te wijzigen
- 03-07 verifieert dat pillar:true + category ai-marketing-automation in de hub-bucket verschijnt; structureel is dat nu gegarandeerd
- Externe rich-results validatie (Rich Results Test / Schema Markup Validator) vereist een live URL; lokaal is de JSON-LD al parse-valide bevonden (Article + FAQPage met 5 vragen)

## Self-Check: PASSED

- FOUND: content/blog/ai-marketing-automation-voor-bureaus.mdx
- FOUND: .planning/phases/03-cornerstone-content/03-02-SUMMARY.md
- FOUND commit: 7cbdf73 (Task 1 frontmatter)
- FOUND commit: 83cac68 (Task 2 body)

---
*Phase: 03-cornerstone-content*
*Completed: 2026-06-02*
