---
phase: 03-cornerstone-content
verified: 2026-06-02T00:00:00Z
status: passed
score: 5/5 success criteria verified (automated) — 1 deferred external validation
human_approval: "2026-06-02 — user approved phase complete; external JSON-LD validator + fresh Lighthouse run accepted as post-deploy follow-up (require live URL on feature/seo-geo-kennisbank)."
re_verification:
  previous_status: null
  previous_score: null
human_verification:
  - test: "Externe rich-results validatie van de geemitteerde JSON-LD"
    expected: "Google Rich Results Test (Article, op de 2 pillars) en Schema Markup Validator (FAQPage, op alle 7) tonen geen errors. FAQ rich result is deprecated 2026 — valideer syntax, niet appearance."
    why_human: "Rich Results Test / Schema Markup Validator vereisen een live (gedeployde) URL of paste van het blok in een externe tool; kan niet lokaal worden afgedwongen. JSON-LD is wel runtime-aanwezig en parse-valide in de gegenereerde HTML."
  - test: "Verse Lighthouse/CWV-run op een live cornerstone vs blog-baseline"
    expected: "LCP/CLS/INP niet geregresseerd t.o.v. bestaande blog-posts."
    why_human: "CWV is in dit fase beargumenteerd-neutraal (static-prerendered MDX via identieke renderer + inline critical CSS, geen nieuwe client-JS of zware assets), niet via een aparte Lighthouse-run gemeten. Een live meting bevestigt de aanname."
---

# Phase 03: Cornerstone Content Verification Report

**Phase Goal:** 4-6 diepe, autoritatieve cornerstone-pagina's staan live op exact de non-branded doel-keywords, NL authoritative, SKC-grade — directe topical authority + AI-citatie-kandidaten.
**Verified:** 2026-06-02
**Status:** human_needed (alle automatiseerbare checks PASS; alleen externe schema-validatie + live CWV deferred)
**Re-verification:** No — initial verification
**Branch:** feature/seo-geo-kennisbank (expected, not a gap)

## Goal Achievement

### Observable Truths (Success Criteria)

| # | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | GEO-pillargids EN "AI marketing automation voor bureaus"-pillargids live, elk 1500-3000w met TOC/takeaways/FAQ/citations | ✓ VERIFIED | `geo-generative-engine-optimization.mdx`: pillar=true, 1609w, TOC=6, FAQ=5, takeaways=5, citations=5. `ai-marketing-automation-voor-bureaus.mdx`: pillar=true, 1916w, TOC=6, FAQ=5, takeaways=5, citations=3. Beide cat matcht bucket. Beide prerendered. |
| 2 | Vier clusters live, pillar<->cluster consistent gelinkt | ✓ VERIFIED | 4 clusters (geo-vs-seo, zichtbaarheid-meten, geo-monitoring-tools, wat-is-een-ai-marketing-medewerker) live + clusterOf correct. In-body cross-links bidirectioneel geverifieerd (pillar->cluster én cluster->pillar+sibling voor beide clusters). |
| 3 | Comparison money-page "Clyde vs Jasper vs ChatGPT vs Semrush" live met ComparisonTable + één /apply-CTA | ✓ VERIFIED | `clyde-vs-jasper-chatgpt-semrush.mdx`: 1 `<ComparisonTable>` columns `["Clyde","Jasper","ChatGPT","Semrush"]` highlightColumn=0; CtaBlock=1, /apply-href=1. Prerendered. |
| 4 | Elke cornerstone: precies één /apply-CTA, valide FAQPage-schema, verschijnt in /resources-hub onder juiste pillar | ✓ VERIFIED | Alle 7: CtaBlock=1 én /apply-href=1. [slug]/page.tsx emit FaqJsonLd wanneer faqs>0 (alle 7 hebben 5 FAQ). /nl/resources.html bevat links naar alle 7, gebucket via getPillarPosts(category) + getClusterPosts(clusterOf). |
| 5 | Mobiel getest per page; JSON-LD valideert; Lighthouse/CWV niet geregresseerd | ? HUMAN | Mobile getest op GEO-pillar (Playwright screenshot 03-01) + ComparisonTable mobile-scroll bevestigd; renderer identiek over alle 7. JSON-LD runtime-aanwezig + parse-valide (Article+FAQPage geconfirmd in gegenereerde HTML). Externe Rich Results-validatie + verse Lighthouse-run deferred (vereisen live URL). |

**Score:** 4/5 truths volledig automated-VERIFIED; truth 5 deels geverifieerd (JSON-LD aanwezig, mobile geproofd), externe validatie deferred → human_needed.

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `content/blog/geo-generative-engine-optimization.mdx` | GEO pillar, pillar:true, cat geo | ✓ VERIFIED | 1609w, Article, 6 TOC anchors alle resolved, 5 FAQ/citations, 1 CTA, geen em-dash |
| `content/blog/ai-marketing-automation-voor-bureaus.mdx` | Bureau pillar, pillar:true | ✓ VERIFIED | 1916w, Article, 6 TOC resolved, 5 FAQ, 3 citations, 1 CTA |
| `content/blog/geo-vs-seo-waar-investeren-2026.mdx` | GEO cluster | ✓ VERIFIED | clusterOf=geo-pillar, 1072w, 5 FAQ/citations, 1 CTA |
| `content/blog/zichtbaarheid-meten-ai-overviews.mdx` | GEO cluster (meten) | ✓ VERIFIED | clusterOf=geo-pillar, 1005w, 5 FAQ/citations, 1 CTA |
| `content/blog/geo-monitoring-tools-chatgpt-perplexity.mdx` | GEO cluster (tools) | ✓ VERIFIED | clusterOf=geo-pillar, 978w, ComparisonTable=1, 5 FAQ, 1 CTA |
| `content/blog/wat-is-een-ai-marketing-medewerker.mdx` | Bureau cluster | ✓ VERIFIED | clusterOf=bureau-pillar, 1111w, 5 FAQ, 1 CTA |
| `content/blog/clyde-vs-jasper-chatgpt-semrush.mdx` | Comparison money-page | ✓ VERIFIED | clusterOf=bureau-pillar, 1292w, ComparisonTable 4-col, 1 CTA |
| `src/app/[locale]/(marketing)/resources/page.tsx` | Hub met pillar-buckets | ✓ VERIFIED | getPillarPosts(cat) + getClusterPosts(clusterOf); 3 buckets; alle 7 in gerenderde HTML |
| `src/app/[locale]/(blog)/blog/[slug]/page.tsx` | JSON-LD rendering | ✓ VERIFIED | ArticleJsonLd type pillar?Article:BlogPosting; FaqJsonLd bij faqs>0; TOC/Takeaways/FAQ/Citations uit frontmatter |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| 4 cornerstones | /resources hub bucket | `clusterOf` + `category` velden | ✓ WIRED | getClusterPosts filtert clusterOf===pillarSlug; alle 4 clusters wijzen naar juiste pillar; categories matchen bucket-ids geo/ai-marketing-automation |
| 2 pillars | /resources hub bucket | `pillar:true` + `category` | ✓ WIRED | getPillarPosts filtert pillar===true; categories matchen PILLAR_BUCKETS |
| GEO pillar | 3 GEO clusters | in-body `/nl/blog/<slug>` links | ✓ WIRED | pillar linkt alle 3; clusters linken terug naar pillar + sibling |
| Bureau pillar | 2 bureau clusters | in-body `/nl/blog/<slug>` links | ✓ WIRED | pillar linkt beide; clusters linken terug naar pillar + sibling |
| [slug] page | FAQPage JSON-LD | FaqJsonLd component | ✓ WIRED | Geconfirmd in gegenereerde HTML: GEO-pillar bevat 1 Article + 1 FAQPage blok |
| [slug] page | Article/BlogPosting JSON-LD | ArticleJsonLd, type uit schemaType/pillar | ✓ WIRED | pillars→Article, clusters→BlogPosting (schemaType frontmatter consistent) |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| CONT-01 | 03-01 | GEO pillar-gids | ✓ SATISFIED | geo-generative-engine-optimization.mdx, pillar, 1609w, prerendered |
| CONT-02 | 03-03 | GEO vs SEO cluster | ✓ SATISFIED | geo-vs-seo-waar-investeren-2026.mdx, clusterOf=geo-pillar, prerendered |
| CONT-03 | 03-03 | Zichtbaarheid meten in AI Overviews | ✓ SATISFIED | zichtbaarheid-meten-ai-overviews.mdx, clusterOf=geo-pillar, prerendered |
| CONT-04 | 03-04 | GEO monitoring tools | ✓ SATISFIED | geo-monitoring-tools-chatgpt-perplexity.mdx, clusterOf=geo-pillar, ComparisonTable, prerendered |
| CONT-05 | 03-02 | AI marketing automation voor bureaus pillar | ✓ SATISFIED | ai-marketing-automation-voor-bureaus.mdx, pillar, 1916w, prerendered |
| CONT-06 | 03-05 | Wat is een AI Marketing Medewerker (Clyde) | ✓ SATISFIED | wat-is-een-ai-marketing-medewerker.mdx, clusterOf=bureau-pillar, prerendered |
| CONT-07 | 03-06 | Comparison money-page | ✓ SATISFIED | clyde-vs-jasper-chatgpt-semrush.mdx, ComparisonTable 4-col, 1 CTA, prerendered |
| CONT-08 | 03-07 | Interne links pillar<->cluster + één /apply-CTA per cornerstone | ✓ SATISFIED | Bidirectionele in-body links + clusterOf-wiring geverifieerd; alle 7 hebben CtaBlock=1 én /apply-href=1 |

**Orphaned requirements:** Geen. Alle 8 CONT-IDs in REQUIREMENTS.md (Phase 3) zijn geclaimd door een plan en geverifieerd.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| (geen) | — | TODO/FIXME/PLACEHOLDER/lorem/coming-soon scan over alle 7 MDX | — | Geen matches; geen em-dashes (U+2014) in body of frontmatter |

### Human Verification Required

1. **Externe rich-results validatie** — Paste de geemitteerde Article-blokken (2 pillars) in Google Rich Results Test en de FAQPage-blokken (alle 7) in Schema Markup Validator. Verwacht: geen syntax-errors. FAQ rich result is deprecated 2026, dus valideer syntax niet appearance. JSON-LD is lokaal al runtime-aanwezig en parse-valide.
2. **Verse Lighthouse/CWV-run** — Meet LCP/CLS/INP op een live cornerstone vs de bestaande blog-baseline. CWV is nu beargumenteerd-neutraal (static MDX, identieke renderer, inline critical CSS, geen nieuwe client-JS) maar niet apart gemeten.

### Gaps Summary

Geen blocking gaps. Alle 5 success criteria en alle 8 requirement-IDs zijn tegen de werkelijke codebase geverifieerd, niet alleen tegen SUMMARY-claims:

- 7 cornerstone MDX-bestanden bestaan, hebben substantiele content (978-1916 woorden), correcte pillar/clusterOf/category-velden, exact één CtaBlock→/apply elk, geen placeholders, geen em-dashes.
- Beide pillars halen de 1500-3000w bar (1609w / 1916w). Clusters/comparison hebben geen voorgeschreven woord-floor in de criteria.
- pillar<->cluster linking is zowel via frontmatter (clusterOf → hub-bucket) als in-body cross-links bidirectioneel correct.
- /resources hub-logica (getPillarPosts by category + getClusterPosts by clusterOf) bucket alle 7 onder de juiste pillar; geconfirmd in gegenereerde /nl/resources.html.
- [slug]-renderer emit Article (pillars) / BlogPosting (clusters) + FAQPage; geconfirmd in gegenereerde HTML (GEO-pillar: 1 Article + 1 FAQPage).
- `npm run build` slaagt; alle 7 routes + /nl/resources staan in prerender-manifest als static.

Status is **human_needed** uitsluitend omdat externe schema-validatie en een verse live CWV-meting een gedeployde URL vereisen en niet lokaal kunnen worden afgedwongen. Dit zijn bevestigings-stappen, geen ontbrekende implementatie.

---

_Verified: 2026-06-02_
_Verifier: Claude (gsd-verifier)_
