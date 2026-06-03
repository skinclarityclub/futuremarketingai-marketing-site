---
phase: 03-cornerstone-content
plan: 03
subsystem: blog-content
tags: [mdx, blog, cluster, geo, ai-overviews, seo, json-ld]
requires:
  - "GEO pillar geo-generative-engine-optimization.mdx (CONT-01, 03-01) as cluster parent"
  - "Shipped blog renderer + BlogPostMeta schema + MDX componentmap (Phase 1)"
provides:
  - "CONT-02 cluster: GEO vs SEO waar investeren 2026 (geo-vs-seo-waar-investeren-2026.mdx)"
  - "CONT-03 cluster: zichtbaarheid meten in AI Overviews (zichtbaarheid-meten-ai-overviews.mdx)"
  - "Two more clusterOf=geo posts surfacing under the GEO hub bucket (verified 03-07)"
affects:
  - "/nl/resources GEO bucket (gains 2 clusters)"
  - "GEO pillar forward-links now resolve to 2 of its 3 clusters"
tech-stack:
  added: []
  patterns:
    - "Cluster MDX mirrors the GEO-pillar shape verbatim (block-YAML object-arrays, explicit <h2 id>)"
    - "In-body cross-links are raw locale-prefixed /nl/blog/<slug> prose links (next-intl does not auto-prefix raw MDX <a>)"
key-files:
  created:
    - "content/blog/geo-vs-seo-waar-investeren-2026.mdx"
    - "content/blog/zichtbaarheid-meten-ai-overviews.mdx"
  modified: []
decisions:
  - "Both clusters use schemaType BlogPosting (not Article) per the cluster convention; pillars keep Article"
  - "CONT-03 grounded its initial draft 4 words short of the 900 floor after tag-stripping; added a context paragraph to the non-determinisme section rather than padding, keeping it substantive at 974w"
metrics:
  duration_min: 12
  tasks: 3
  files: 2
  completed: "2026-06-02"
---

# Phase 03 Plan 03: GEO clusters (vs SEO + AI Overviews meten) Summary

Twee NL GEO-clusters geschreven die onder de GEO-pillar hangen: "GEO vs SEO: waar investeren in 2026" (CONT-02, 1039w) en "Hoe meet je zichtbaarheid in AI Overviews" (CONT-03, 974w), beide `clusterOf: geo-generative-engine-optimization`, gegrond in 03-RESEARCH section 1 en 2, met geverifieerde BlogPosting + FAQPage JSON-LD en precies een /apply CtaBlock per stuk.

## What Was Built

- **CONT-02 cluster** (`content/blog/geo-vs-seo-waar-investeren-2026.mdx`, 1039 woorden): vijf `<h2 id>`-secties die het kernverschil (rankings/clicks vs citations/mentions), de gedragsverschuiving (zero-click, AIO CTR-daling, Gartner-volume-daling), de metriek-verschuiving en het budget-antwoord (en-en, niet of-of) uitwerken. In-body links naar de GEO-pillar en de AI Overviews meet-cluster. 4 takeaways, 5 FAQs, 5 gegronde citations.
- **CONT-03 cluster** (`content/blog/zichtbaarheid-meten-ai-overviews.mdx`, 974 woorden): vijf secties over merkvermeldingen vs websitecitaties, de vier kernmetrieken (citatiegraad, AI share of voice, AI-impressies, AI-verwezen verkeer via GA4-referrerfiltering), per-engine aanpak (AIO triangulatie / ChatGPT merkvermeldingen / Perplexity rijkst), en non-determinisme (prompts 5-10x draaien). In-body links naar de GEO-pillar en de GEO-monitoring-tools cluster. 4 takeaways, 5 FAQs, 5 gegronde citations.
- **Proof:** `npm run build` exit 0, `✓ Compiled successfully` + `✓ Generating static pages (122/122)`. Beide pagina's statisch gegenereerd als `.next/server/app/nl/blog/<slug>.html`. JSON-LD in output-HTML: BlogPosting + FAQPage + BreadcrumbList per pagina. Pillar back-link aanwezig in beide. Bron-MDX bevat exact 1 `<CtaBlock>` per file.

## Task Commits

| Task | Name | Commit |
|------|------|--------|
| 1 | CONT-02 GEO vs SEO cluster | `3714f71` |
| 2 | CONT-03 AI Overviews meet-cluster | `dcf273d` |
| 3 | Build + JSON-LD proof (both) | verification-only, no new source files |

## Verification

- Per-task gray-matter gate PASS voor beide: `clusterOf` = GEO pillar, `category` = geo, >= 900 woorden (1039 / 974), exact 1 CtaBlock, in-body pillar-link aanwezig, geen em-dash, alle TOC-ids resolven naar een `<h2 id>` in de body.
- CONT-03 verifieert daarnaast de tools-cluster forward-link (`/nl/blog/geo-monitoring-tools-chatgpt-perplexity`).
- Build: exit 0, 122/122 static pages, beide nieuwe slugs als HTML op disk.
- Rendered HTML: Article (BlogPosting) + FAQPage JSON-LD geemit, pillar back-link aanwezig.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Verification floor] CONT-03 4 woorden onder de 900-woord-grens**
- **Found during:** Task 2
- **Issue:** De automated verify strip-t HTML-tags (Callout/CtaBlock-inhoud telt niet mee), waardoor de eerste draft op 896 woorden uitkwam, net onder de 900-floor.
- **Fix:** Een contextparagraaf toegevoegd aan de "non-determinisme"-sectie over het in context plaatsen van meetresultaten (citatiegraad over een prompt-set, patronen vs uitschieters). Substantief, niet padding. Eindstand 974 woorden.
- **Files modified:** content/blog/zichtbaarheid-meten-ai-overviews.mdx
- **Commit:** `dcf273d` (geen aparte fix-commit; opgelost vóór de Task 2-commit)

### Out-of-scope (logged, not fixed)

- De build-output toont ~1300 pre-existing ESLint errors + ~17k warnings (React Compiler setState-in-effect, `@ts-ignore`, refs-during-render) in ongerelateerde bronbestanden. Identiek aan de baseline gedocumenteerd in 03-02-SUMMARY. Niet veroorzaakt door deze MDX-content; `✓ Compiled successfully` + `✓ Generating static pages (122/122)` bevestigen dat de build slaagt en beide pagina's genereren. Niet aangeraakt (scope-boundary).

## Notes for Downstream

- Externe rich-results validatie (Rich Results Test / Schema Markup Validator) vereist een live URL; lokaal is de JSON-LD parse-valide bevonden (BlogPosting + FAQPage met 5 vragen elk).
- De GEO-pillar (03-01) linkt al forward naar deze twee clusters; back-links staan in deze clusters. De derde GEO-cluster (`geo-monitoring-tools-chatgpt-perplexity`, CONT-04, plan 03-04) wordt parallel geschreven; CONT-03's forward-link daarheen resolveert zodra die shipt. Hub-verschijning onder de GEO-bucket wordt centraal geverifieerd in 03-07.
- Mobile: beide pagina's gebruiken exact dezelfde renderer-keten (BlogContent / TableOfContents / KeyTakeaways / BlogFaq / Citations) die in 03-01 en 03-02 al mobile-proof is bevonden; geen nieuwe client-interactiviteit of zware assets toegevoegd, dus CWV-neutraal.

## Self-Check: PASSED

- content/blog/geo-vs-seo-waar-investeren-2026.mdx — FOUND
- content/blog/zichtbaarheid-meten-ai-overviews.mdx — FOUND
- .planning/phases/03-cornerstone-content/03-03-SUMMARY.md — FOUND
- commit 3714f71 — FOUND
- commit dcf273d — FOUND
