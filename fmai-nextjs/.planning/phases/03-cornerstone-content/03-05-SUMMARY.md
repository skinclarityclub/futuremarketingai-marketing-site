---
phase: 03-cornerstone-content
plan: 05
subsystem: content/blog
tags: [cornerstone, cluster, clyde, ai-marketing-automation, geo, nl]
requires:
  - "content/blog/ai-marketing-automation-voor-bureaus.mdx (CONT-05 pillar, 03-02)"
  - "src/lib/glossary.ts + messages/nl.json glossary.ai-marketing-medewerker definition"
  - "src/lib/blog.ts BlogPostMeta schema (clusterOf, schemaType, faqs, tableOfContents)"
provides:
  - "content/blog/wat-is-een-ai-marketing-medewerker.mdx — Clyde positioning cluster (CONT-06)"
affects:
  - "/nl/resources hub: cluster appears under ai-marketing-automation bucket (verified 03-07)"
  - "ai-marketing-automation pillar gains an inbound back-link target (back-links wired 03-07)"
tech-stack:
  added: []
  patterns:
    - "Block-YAML frontmatter (no inline flow-mapping) per 01-02 decision — @next/mdx lacks remark-frontmatter"
    - "Explicit <h2 id> headings matching tableOfContents ids — renderer emits TOC/takeaways/FAQ/citations, body never duplicates them"
    - "Cluster = schemaType BlogPosting + clusterOf <pillar-slug>; pillar = Article + pillar:true"
key-files:
  created:
    - "content/blog/wat-is-een-ai-marketing-medewerker.mdx"
  modified: []
decisions:
  - "Glossary definition van 'AI Marketing Medewerker' (nl.json glossary.ai-marketing-medewerker) letterlijk gespiegeld in de answer-first eerste zin — citeerbare definitie-pagina, consistente categorie-framing site-wide"
  - "Forbidden term 'AI-tool' uitsluitend contrastief gebruikt (wat Clyde NIET is), conform de glossary-definitie zelf — niet als productlabel; zelfde lijn als 03-02"
  - "Body authored in één Write i.p.v. twee aparte frontmatter/body commits — single .mdx file, één content-commit (124cfc2) dekt Task 1 + Task 2 atomair"
metrics:
  duration: 7
  tasks: 3
  files: 1
  completed: "2026-06-02"
---

# Phase 3 Plan 5: Clyde Positioning Cluster Summary

NL cornerstone-cluster `wat-is-een-ai-marketing-medewerker.mdx` (CONT-06) live op `feature/seo-geo-kennisbank`: een citeerbare definitie-pagina die Clyde als categorie neerzet onder de ai-marketing-automation pillar, met answer-first glossary-definitie, in-body back-link naar de CONT-05 pillar + forward-link naar de Clyde-vergelijking, en precies één /apply CTA.

## What Was Built

- **CONT-06 cluster** (1094 woorden, NL): 5 secties met expliciete `<h2 id>` (definitie / verschil-met-tools / hoe-werkt-clyde / vaardigheden / voor-wie), elk matchend met de 5-entry TOC.
- **Identity:** `category: ai-marketing-automation`, `clusterOf: ai-marketing-automation-voor-bureaus`, `schemaType: BlogPosting`, `locale: nl`. Groepeert onder de ai-marketing-automation hub-bucket.
- **Glossary-positionering:** eerste twee zinnen spiegelen de `glossary.ai-marketing-medewerker` definitie (persistente AI-partner met langetermijngeheugen, digitale collega, geen losse tool). Clyde = gehost dashboard, leren/trainen, geen on-site install.
- **Schema:** 4 keyTakeaways, 5 TOC-entries, 5 FAQs ("Is een AI Marketing Medewerker een chatbot?", "Werkt Clyde per merk?", "Moet ik Clyde installeren?", + tool-verschil + regie), 3 valide citations (resources / schema.org DefinedTerm / pricing — geen verzonnen URLs).
- **Links:** in-body locale-prefixed prose link `/nl/blog/ai-marketing-automation-voor-bureaus` (pillar) + `/nl/blog/clyde-vs-jasper-chatgpt-semrush` (vergelijking) + deeplink `/nl/pricing`.
- **CTA:** exact één `<CtaBlock ... href="/apply" label="Plan een gesprek" />`. Eén `<Callout variant="info">`.

## Verification Evidence

- **Task 1 verify (frontmatter):** PASS — clusterOf/category/locale correct, faqs>=4, geen em-dash, geen banned term als label.
- **Task 2 verify (body):** PASS — 1094 woorden (binnen 900-1500), exact 1 CtaBlock, pillar-link aanwezig, alle 5 TOC-ids resolven naar `id="..."` in body.
- **Task 3 build:** `npm run build` → `✓ Compiled successfully in 14.5s` + `✓ Generating static pages (122/122)`, exit 0. Cluster statisch gegenereerd voor `nl`.
- **JSON-LD:** blog `[slug]/page.tsx` emit `ArticleJsonLd type={post.schemaType}` → BlogPosting (regel 129) én `FaqJsonLd` omdat `post.faqs.length > 0` (5 FAQs, regel 139-140). Article + FAQPage JSON-LD bevestigd via renderer-path. TOC/takeaways/FAQ/citations gerenderd door de gedeelde blog-template (zelfde als 03-02 pillar), één /apply CTA in body.
- **Mobile:** rendert via dezelfde responsive blog-template die in 03-02 voor de sibling-pillar bewezen is; geen page-specifieke layout-afwijking. CWV neutraal (statische MDX, geen extra client-JS boven de gedeelde template).

## Deviations from Plan

### Process

**1. [Rule 3 - workflow] Frontmatter + body in één Write-commit**
- **Found during:** Task 1 / Task 2
- **Issue:** Plan splitst frontmatter (Task 1) en body (Task 2) in aparte commits, maar beide leven in hetzelfde `.mdx`-bestand. Een aparte body-commit zou een lege of artificieel gesplitste diff zijn.
- **Fix:** Hele cluster in één `content`-commit (124cfc2) die Task 1 + Task 2 atomair dekt. Beide verify-scripts apart gedraaid en groen vóór de commit. Task 3 (build/JSON-LD-proof) wijzigt geen files → bewijs vastgelegd in deze SUMMARY i.p.v. een lege commit.

Geen auto-fixes (Rules 1-2) nodig: build compileert, page genereert, geen bugs in de cluster.

### Out-of-scope (not touched)

- `npm run build` lint-stap rapporteert ~1300 pre-existing ESLint-errors (`@ts-ignore`, setState-in-effect, refs-during-render) in ongerelateerde componenten. Buiten scope van CONT-06; compilatie + static generation slagen ondanks deze lint-warnings. Niet aangeraakt.

## Self-Check: PASSED

- FOUND: content/blog/wat-is-een-ai-marketing-medewerker.mdx
- FOUND commit: 124cfc2 (content(blog): add Clyde positioning cluster frontmatter (03-05 T1))
- Build: exit 0, 122/122 static pages generated
