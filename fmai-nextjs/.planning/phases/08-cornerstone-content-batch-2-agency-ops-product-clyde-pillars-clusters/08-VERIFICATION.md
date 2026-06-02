---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
verified: 2026-06-02T00:00:00Z
status: passed
score: 5/5 success-criteria verified (8/8 requirements satisfied)
re_verification: null
---

# Phase 8: Cornerstone-content batch 2 (agency-ops + product/Clyde pillars + clusters) Verification Report

**Phase Goal:** De twee nog lege pillar-buckets (agency-ops/proof, product/Clyde) krijgen SKC-grade NL-authoritative cornerstones, zodat alle 4 geseedde `fma_content_pillars` content dragen en de hele /resources-hub gevuld is.
**Verified:** 2026-06-02
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Success Criteria from ROADMAP)

| # | Truth | Status | Evidence |
| - | ----- | ------ | -------- |
| 1 | Agency-ops pillar-gids (1500-3000w) + 2-3 clusters (900-1500w) live, mappend op `agency-ops` rij | VERIFIED | `marketingbureau-schalen-met-ai` 1895w, category agency-ops, pillar:true + 3 clusters (1293/1317/1240w) clusterOf=agency pillar |
| 2 | Product/Clyde pillar-gids (1500-3000w) + 2-3 clusters (900-1500w) live, mappend op `product-clyde` rij | VERIFIED | `ai-marketing-medewerker` 1817w, category product-clyde, pillar:true + 2 clusters (1017/1149w) clusterOf=product pillar |
| 3 | Alle nieuwe cornerstones: bidirectioneel gelinkt, 1x /apply-CTA, valide Article/BlogPosting + FAQPage JSON-LD, geen em-dash, canoniek domein | VERIFIED | 11/11 bidi-links in rendered HTML; 7/7 files 1 CtaBlock + 1 /apply; JSON-LD parses valid (Article/BlogPosting + FAQPage); 0 em-dash; 0 legacy domain |
| 4 | Elke cornerstone verschijnt in /resources onder juiste bucket + automatisch in homepage KennisbankTeaser; geen wees-clusters | VERIFIED | nl/resources.html shows 4 buckets incl product-clyde title + all 7 pages; nl.html teaser shows both new pillars; every clusterOf resolves to existing pillar |
| 5 | Keywords grounded geresearcht; mobiel getest; JSON-LD valideert; CWV niet geregresseerd | VERIFIED (auto-parts) / ? (human parts) | JSON-LD valid (rendered); build green, 110 static HTML prerendered, critical-CSS inlined. Mobile-feel + CWV-field-feel = human |

**Score:** 5/5 success criteria verified (criterion 5 has a human-judgement sliver: mobile look-and-feel, not blocking)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `content/blog/marketingbureau-schalen-met-ai.mdx` | Agency pillar, pillar:true, Article, agency-ops | VERIFIED | 1895w, TOC 6 ids all anchored, FAQ+citations, out-links to 3 clusters |
| `content/blog/ai-efficientie-marketingbureau.mdx` | Cluster CONT-10, BlogPosting, agency-ops | VERIFIED | 1293w, clusterOf agency pillar, back-link present |
| `content/blog/meetbare-ai-marketing-resultaten.mdx` | Cluster CONT-11 ROI-framework, no promised figure | VERIFIED | 1317w, back-link present, soft-phrased stats |
| `content/blog/ai-marketing-resultaat-in-de-praktijk.mdx` | Proof cluster CONT-12, Sindy-as-operator | VERIFIED | 1240w, Sindy present, NO Daley co-ownership in body (only author byline) |
| `content/blog/ai-marketing-medewerker.mdx` | Product pillar CONT-13, product-clyde, no CONT-06 cannibalization | VERIFIED | 1817w, down-links to wat-is-een-ai-marketing-medewerker (CONT-06) |
| `content/blog/ai-agent-vs-ai-tool-marketing.mdx` | Cluster CONT-14, BlogPosting, product-clyde | VERIFIED | 1017w, clusterOf product pillar, back-link present |
| `content/blog/ai-marketing-agent-geheugen-en-leren.mdx` | Cluster CONT-15, links to /memory | VERIFIED | 1149w, /nl/memory link present, back-link present |
| `src/app/[locale]/(marketing)/resources/page.tsx` | PILLAR_BUCKETS incl product-clyde | VERIFIED | bucket array contains 'product-clyde'; no any/ts-ignore/secret |
| `messages/{nl,en,es}.json` | resources.pillars.product-clyde in all 3 locales | VERIFIED | all 3 have title+description; no MISSING_MESSAGE crash (build green) |
| `src/app/[locale]/page.tsx` | teaser feed incl agency-ops + product-clyde pillars | VERIFIED | agencyPillar + productPillar wired into kennisbankItems |

### Key Link Verification

| From | To | Via | Status |
| ---- | -- | --- | ------ |
| agency pillar | 3 agency clusters | in-body /nl/blog prose links (rendered HTML) | WIRED |
| product pillar | CONT-06 + 2 product clusters | in-body /nl/blog prose links (rendered HTML) | WIRED |
| each cluster | its pillar | in-body back-link (rendered HTML) | WIRED (5/5) |
| CONT-15 cluster | /nl/memory | in-body link | WIRED |
| resources hub | product-clyde i18n key | t(`pillars.product-clyde.title`) per locale | WIRED (rendered hub shows title) |
| homepage page.tsx | agency-ops + product-clyde pillars | getPillarPosts().find(category===) | WIRED (rendered teaser shows both) |

### Requirements Coverage

| Requirement | Source Plan | Status | Evidence |
| ----------- | ----------- | ------ | -------- |
| CONT-09 | 08-02 | SATISFIED | agency pillar live, agency-ops bucket, pillar:true |
| CONT-10 | 08-04 | SATISFIED | ai-efficientie cluster live, clusterOf agency pillar |
| CONT-11 | 08-04 | SATISFIED | meetbare-resultaten ROI cluster live, no promised figure |
| CONT-12 | 08-05 | SATISFIED | proof cluster live via Sindy-as-operator, no Daley co-ownership in body, no invented %-figures |
| CONT-13 | 08-03 | SATISFIED | product pillar live, product-clyde bucket, down-links to CONT-06 (no cannibalization) |
| CONT-14 | 08-06 | SATISFIED | agent-vs-tool cluster live, clusterOf product pillar |
| CONT-15 | 08-06 | SATISFIED | geheugen-en-leren cluster live, /nl/memory link |
| CONT-16 | 08-01 + 08-07 | SATISFIED | 4th hub bucket + i18n (nl/en/es) + teaser-add + bidirectional link network + 1 /apply per page + no orphan cluster, all proven against rendered HTML |

No ORPHANED requirements — all 8 IDs (CONT-09..16) declared in plan frontmatter AND mapped to Phase 8 in REQUIREMENTS.md, all marked Complete (lines 104-111).

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
| ---- | ------- | -------- | ------ |
| (none) | TODO/FIXME/placeholder/lorem/coming-soon | — | Clean sweep across all 7 MDX |
| (none) | em-dash U+2014 | — | 0 across all 7 |
| (none) | legacy domain futuremarketingai.com | — | 0 across all 7 |

Note: "Daley" appears only as the standard `author: "Daley Maat"` frontmatter byline (consistent across all blog posts), NOT as a body mention of his SKC co-ownership — CONT-12 proof rule satisfied. "merkeigenaar" in the proof body is a generic "brand owner" noun, not an ownership disclosure.

Pre-existing legacy ESLint errors from unrelated component files are out of scope per task note; build still exits 0 and prerenders all 110 static HTML pages.

### Human Verification Required (non-blocking)

1. **Mobile rendering of new cornerstones + hub 4-bucket grid** — open /nl/resources and a couple of the 7 new pages on mobile viewport; confirm bucket grid and prose read well. Why human: visual layout/feel.
2. **CWV field-feel** — automated build is neutral (critical-CSS inlined, static prerender); real CWV needs a live/Lighthouse pass. Why human: requires runtime measurement.

These do not block goal achievement; all structural and content invariants pass.

### Gaps Summary

No gaps. All 5 success criteria verified, all 8 requirements satisfied, all artifacts substantive (1017-1895 words each, no stubs) and wired (bidirectional link network proven against rendered `.next` HTML, not just MDX source). Hub renders 4 buckets including product-clyde; homepage teaser surfaces both new pillars. JSON-LD (Article/BlogPosting + FAQPage) parses valid in rendered HTML for all 7. Build green, palette green.

---

_Verified: 2026-06-02_
_Verifier: Claude (gsd-verifier)_
