---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 05
subsystem: kennisbank / blog-content
tags: [agency-ops, cornerstone, cluster, proof-case, SkinClarity-Club, CONT-12]
requires:
  - "08-02 agency-ops pillar (marketingbureau-schalen-met-ai.mdx)"
  - "08-01 wiring (agency-ops hub-bucket + teaser feed)"
provides:
  - "Agency-proof / case cluster (Sindy-as-operator), clusterOf marketingbureau-schalen-met-ai"
affects:
  - "/resources agency-ops hub-bucket (cluster surfaces under pillar)"
  - "homepage Kennisbank-teaser (auto-surfaces once MDX exists)"
tech-stack:
  added: []
  patterns:
    - "Block-YAML frontmatter object-arrays (@next/mdx, no remark-frontmatter)"
    - "Explicit <h2 id> headings matching tableOfContents ids (no rehype-slug)"
    - "schemaType BlogPosting for clusters, Article for pillars (JSON-LD convention)"
    - "Sindy-as-operator proof narrative; qualitative-only, no fabricated metrics"
key-files:
  created:
    - "content/blog/ai-marketing-resultaat-in-de-praktijk.mdx"
  modified: []
decisions:
  - "Tasks 1+2 committed as one file-write (frontmatter+body inseparable in a single MDX), same pattern as 08-02"
  - "Zero percentage figures in body; founding-counter (1/10) is the only hard proof fact; industry benchmarks live only in citations + softly phrased as market context"
  - "CONT-11 (meetbare-ai-marketing-resultaten) link is a forward-link that resolves once 08-04 ships (parallel wave-2 plan); same forward-link convention as Phase 3/08-02"
metrics:
  duration: 5
  completed: "2026-06-02"
  tasks: 3
  files: 1
---

# Phase 8 Plan 05: AI marketing resultaat in de praktijk (agency-proof case cluster) Summary

Citeerbare agency-ops proof-cluster `content/blog/ai-marketing-resultaat-in-de-praktijk.mdx` (CONT-12), BlogPosting, 1240w, die de SkinClarity Club-case via Sindy als operator vertelt als werkend voorbeeld, kwalitatief en zonder verzonnen resultaatcijfers, bidirectioneel gelinkt aan de agency-ops pillar.

## What Was Built

- **Frontmatter (Task 1):** title "AI marketing resultaat in de praktijk: een werkend voorbeeld", `category: agency-ops`, `clusterOf: marketingbureau-schalen-met-ai`, `schemaType: BlogPosting`, locale nl, author "Daley Maat" (byline), readTime 8. 4 kwalitatieve keyTakeaways, 5-item TOC (ids matchend aan body), 5 FAQs, 5 citations (3 industrie-benchmarks als marktcontext + FMai pricing/kennisbank). Geen verzonnen getallen in enig veld.
- **Body (Task 2):** 1240 woorden, 5 question-based `<h2 id>` secties (de-context, de-toepassing, wat-het-oplevert, meet-het-zelf, voor-jouw-merk), answer-first/BLUF per sectie. Sindy (founder SkinClarity Club) als operator die de AI Marketing Medewerker aanstuurt. Een `<Callout>` (regie-bij-mens), exact één `<CtaBlock href="/apply" />`. In-body back-link naar pillar `/nl/blog/marketingbureau-schalen-met-ai`, forward-link naar CONT-11 `/nl/blog/meetbare-ai-marketing-resultaten`, `/nl/pricing` deeplink.
- **Verificatie (Task 3):** `npm run build` compiled successfully, 127 static pages (was 123 in 08-02, +4 voor het nieuwe artikel over nl/en/es + cluster-route). nl-HTML gegenereerd. BlogPosting + FAQPage JSON-LD bevestigd in gerenderde `.next`-HTML. check:palette PASS.

## Proof-Rule Audit (08-RESEARCH Pitfall 3, Open Q5 locked)

- **Sindy-as-operator only:** confirmed present in body + FAQs; framed als operator/founder van SkinClarity Club.
- **Geen Daley SKC-mede-eigendom:** regex-audit op frontmatter+body+gerenderde HTML = geen match (eigenaar/mede-eigen/co-own/bezit).
- **Geen verzonnen resultaatcijfers:** 0 percentage-figuren in de body. De founding-counter (1 van 10 founding-plekken bezet) is het enige harde feit, expliciet als "vroeg, echt voorbeeld" geframed.
- **Industrie-benchmarks:** uitsluitend in citations + in-body zacht geciteerd ("in de markt wordt gerapporteerd...", attributed), nooit als FMai/SKC eigen gemeten uitkomst.

## AI-Citeerbare Recipe Compliance

E-E-A-T (author attribution, first-hand framing) - BLUF/answer-first per sectie - question-based H2s - self-contained paragraphs - BlogPosting + FAQPage structured data - neutrale informationele toon - cited sources. Glossary gerespecteerd ("AI Marketing Medewerker"/"Clyde", "vaardigheden", "merken"). Geen em-dashes.

## Deviations from Plan

None - plan executed exactly as written. Tasks 1+2 committed together as a single file-write (one MDX file; frontmatter and body are inseparable), consistent with the 08-02 precedent.

## Commits

- `71cc0a1`: content(blog): add agency-proof case cluster (CONT-12, Sindy-as-operator) — Tasks 1+2
- Task 3 was verification-only (build + JSON-LD + proof audit), no source mutation.

## Self-Check: PASSED

- FOUND: content/blog/ai-marketing-resultaat-in-de-praktijk.mdx
- FOUND: commit 71cc0a1
- FOUND: .next/server/app/nl/blog/ai-marketing-resultaat-in-de-praktijk.html (build artifact)
