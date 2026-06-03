---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 06
subsystem: kennisbank/content
tags: [content, product-clyde, clusters, blog, geo, json-ld]
requires:
  - "08-03 (CONT-13 product/Clyde pillar ai-marketing-medewerker)"
provides:
  - "CONT-14: content/blog/ai-agent-vs-ai-tool-marketing.mdx (agent-vs-tool cluster)"
  - "CONT-15: content/blog/ai-marketing-agent-geheugen-en-leren.mdx (memory+learning cluster)"
affects:
  - "/resources product-clyde hub-bucket (cluster-diepte onder de pillar; bevestigd in 08-07)"
tech-stack:
  added: []
  patterns:
    - "Cluster-MDX gemodelleerd op wat-is-een-ai-marketing-medewerker.mdx: block-YAML frontmatter, expliciete <h2 id> = tableOfContents.id, renderer emit TOC/takeaways/FAQ/citations"
    - "ComparisonTable defensible-claims: columns = waardekolommen (label is impliciete 1e kolom), highlightColumn indexeert in values (1 = medewerker-kolom), 'Deels' voor onzekere cellen, dated caption"
key-files:
  created:
    - "content/blog/ai-agent-vs-ai-tool-marketing.mdx"
    - "content/blog/ai-marketing-agent-geheugen-en-leren.mdx"
  modified: []
decisions:
  - "CONT-14 ComparisonTable: 2 waardekolommen + impliciete label-kolom; highlightColumn={1} op de medewerker-kolom (component rendert row.label als eerste cel, columns mappen op values)"
  - "Beide clusters: AI-tool alleen contrastief gebruikt (wat een agent NIET is), conform glossary"
  - "CONT-15 verankert Clyde's USP = geheugen + leren per merk; in-body deeplink naar /nl/memory (meerlaags geheugenmodel) i.p.v. het model dupliceren"
metrics:
  duration: ~14 min
  completed: 2026-06-02
  tasks: 3
  files: 2
---

# Phase 8 Plan 06: Product/Clyde clusters (agent-vs-tool + geheugen/leren) Summary

Twee verse SKC-grade NL product/Clyde clusters onder de pillar `ai-marketing-medewerker` (CONT-13): CONT-14 trekt de agent-vs-tool grens op vier eigenschappen (autonomie + geheugen + leren + beslissingen) met een defensible-claims ComparisonTable; CONT-15 legt geheugen + leren per merk uit als Clyde's USP en linkt naar `/nl/memory`. Beide BlogPosting, 1017w + 1149w, bidirectioneel verbonden met pillar + sibling, elk precies één /apply-CTA.

## What Was Built

- **CONT-14 `content/blog/ai-agent-vs-ai-tool-marketing.mdx`** (1017w): vijf `<h2 id>`-secties (`de-grens`, `vergelijking`, `praktische-scenarios`, `wanneer-een-tool-volstaat`, `wanneer-een-agent-nodig-is`). Tool = vooraf-geprogrammeerde losse taak; agent = autonomie + langetermijngeheugen + leren + beslissingen. Defensible-claims `ComparisonTable` (tool vs medewerker, 'Deels' voor onzekere cellen, highlightColumn op de medewerker-kolom, dated caption "juni 2026"). NL marketing-scenario's (social posts, rapportage, lead-kwalificatie). Back-link pillar + sibling. 5 FAQs, 4 citations.
- **CONT-15 `content/blog/ai-marketing-agent-geheugen-en-leren.mdx`** (1149w): vijf `<h2 id>`-secties (`waarom-geheugen-telt`, `hoe-een-agent-onthoudt`, `hoe-een-agent-leert`, `per-merk-personalisatie`, `clyde-in-de-praktijk`). Per-merk gescheiden langetermijngeheugen + leren -> per-merk-personalisatie + optimalisatie over de tijd = USP. In-body `/nl/memory` link, back-link pillar + sibling, 1 Callout, 5 FAQs, 4 citations.

## Verification

- `npm run build`: PASS, "Compiled successfully", 129 static pages (+2 t.o.v. 08-05's 127). Beide URLs in static-output: `/nl/blog/ai-agent-vs-ai-tool-marketing` + `/nl/blog/ai-marketing-agent-geheugen-en-leren`.
- JSON-LD bevestigd in gerenderde `.next`-HTML voor beide: **BlogPosting: true, FAQPage: true**.
- Rendered-HTML checks beide: pillar back-link (`/nl/blog/ai-marketing-medewerker`) true, sibling-link true, `/nl/memory` true, TOC/takeaways/FAQ/citations-markers true.
- CONT-14 ComparisonTable rendert (`<table` true) met dated caption "juni 2026".
- Beide: clusterOf `ai-marketing-medewerker`, category `product-clyde`, schemaType BlogPosting, ≥5 FAQs, geen em-dash, exact 1 CtaBlock + exact 1 `href="/apply"`, alle TOC-anchors resolven, 900-1500w. (geautomatiseerde gray-matter check: OK 1017 / OK 1149.)
- `npm run check:palette`: PASS (no stale palette hex).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ComparisonTable kolom/highlight-mapping gecorrigeerd**
- **Found during:** Task 1
- **Issue:** Eerste draft gaf `columns` een expliciete "Eigenschap"-header en zette de label-string in `values`, met `highlightColumn={2}`. De `ComparisonTable`-component rendert echter `row.label` als impliciete eerste cel en mapt `columns` direct op `row.values`; de extra header + label-in-values zou de tabel scheef trekken en de highlight op de verkeerde kolom zetten.
- **Fix:** `columns` teruggebracht naar de twee waardekolommen ("Losse AI-tool", "AI Marketing Medewerker"), label-string uit `values` verwijderd, `highlightColumn={1}` (medewerker-kolom).
- **Files modified:** content/blog/ai-agent-vs-ai-tool-marketing.mdx
- **Commit:** c5f4b77 (gecorrigeerd vóór commit)

Task 3 was verificatie-only (geen nieuwe artifacts); de twee MDX-bestanden waren al gecommit in Task 1 + 2.

### Out-of-scope (niet aangeraakt)

- `npm run build` toont veel pre-existing ESLint-errors/warnings (`@ts-ignore`, setState-in-effect, refs-during-render) in ongerelateerde bestanden. Build compileert + prerendert toch (129/129). Buiten scope van dit plan, niet gefixt.

## Commits

- c5f4b77: content(blog): CONT-14 ai-agent-vs-ai-tool-marketing cluster
- 69009e1: content(blog): CONT-15 ai-marketing-agent-geheugen-en-leren cluster

## Notes for Future Work

- 08-07 (CONT-16 sluitsteen) verifieert dat beide clusters onder de product-clyde bucket op `/resources` verschijnen en dat de pillar->cluster back-links bidirectioneel dichtgetimmerd zijn. De pillar (`ai-marketing-medewerker.mdx`, 08-03) forward-linkt al naar beide clusters; deze clusters back-linken nu naar de pillar -> netwerk gesloten.
- MERGE-STATUS: Phase 8 zit op `feature/seo-geo-kennisbank`, niet main.

## Self-Check: PASSED

- FOUND: content/blog/ai-agent-vs-ai-tool-marketing.mdx
- FOUND: content/blog/ai-marketing-agent-geheugen-en-leren.mdx
- FOUND commit: c5f4b77
- FOUND commit: 69009e1
