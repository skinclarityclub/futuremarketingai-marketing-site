---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 01
subsystem: kennisbank-hub-teaser-wiring
tags: [resources-hub, homepage-teaser, i18n, next-intl, wiring]
requires:
  - "/resources hub (KB-04) with PILLAR_BUCKETS + graceful empty-state"
  - "KennisbankTeaser homepage block (commit a8f6c0f)"
  - "getPillarPosts / getClusterPosts in src/lib/blog.ts"
provides:
  - "Fourth hub bucket 'product-clyde' on /resources, rendered in nl/en/es without MISSING_MESSAGE"
  - "resources.pillars.product-clyde {title,description} i18n key in all 3 locales"
  - "Homepage teaser feed wired to agency-ops + product/Clyde pillars (auto-surface once MDX lands)"
affects:
  - "All Phase-8 pillar/cluster authoring plans (Wave 1/2) — now pure authoring, infra ready"
tech-stack:
  added: []
  patterns:
    - "Hardcoded bucket-id array drives a generic map() loop; new ids need only the matching i18n key"
    - "Teaser cards use && guard + .filter(Boolean) so they self-omit until their MDX resolves"
key-files:
  created: []
  modified:
    - "src/app/[locale]/(marketing)/resources/page.tsx"
    - "src/app/[locale]/page.tsx"
    - "messages/nl.json"
    - "messages/en.json"
    - "messages/es.json"
decisions:
  - "Open Q1 = Option B (locked): product-clyde is a fourth top-level hub bucket, not folded into ai-marketing-automation"
  - "Open Q2 = hardcoded-add (locked): teaser feed stays explicit per-pillar .find() calls (5 curated cards) rather than a generic loop, preserving editorial ordering"
  - "i18n key added in ALL 3 locales simultaneously — next-intl strict mode throws MISSING_MESSAGE per-locale, so a single-locale add would crash en/es renders"
metrics:
  duration: "~12 min"
  completed: "2026-06-02"
  tasks: 3
  files: 5
---

# Phase 8 Plan 01: Hub + Teaser Wiring Summary

Wired the /resources hub and homepage Kennisbank teaser so every Phase-8 cornerstone auto-surfaces the moment its MDX exists: added a fourth `product-clyde` hub bucket (with i18n in nl/en/es) and connected the homepage teaser feed to the agency-ops + product/Clyde pillars.

## What was built

- **Task 1** — Extended `PILLAR_BUCKETS` on `resources/page.tsx` from 3 to 4 ids (`geo`, `ai-marketing-automation`, `agency-ops`, `product-clyde`). The page's generic bucket-mapping loop and graceful empty-state already handle any id, so no further page change was needed. Added the matching `resources.pillars.product-clyde` `{title, description}` sibling key to `nl.json` (NL source), `en.json`, and `es.json` — required in all three because next-intl strict mode throws `MISSING_MESSAGE` per locale. Glossary-conform copy ("AI Marketing Medewerker" / "Clyde" / "merken"), no em-dash.
- **Task 2** — Added `agencyPillar` + `productPillar` lookups (`pillars.find(p => p.category === 'agency-ops' | 'product-clyde')`) to the homepage teaser block and pushed both into `kennisbankItems` as `kind: 'pillar'`. Order: geo, ai-automation, agency-ops, product/Clyde + existing comparison card (5 cards; `md:grid-cols-3` wraps 3+2 cleanly). The `&&` guard plus `.filter(Boolean)` mean each card self-omits until its MDX exists. No `any`, no `@ts-ignore`. `KennisbankTeaser.tsx` untouched (generic, self-hides when empty).
- **Task 3** — Build + palette proof. No source edits.

## Verification

- `npm run build` exits 0, **zero MISSING_MESSAGE**, all **123/123 static pages** generated (123 incl. the new product-clyde bucket route across locales; was 122 pre-edit).
- `npm run check:palette` — PASS (no stale palette hex).
- Task 1 automated check: product-clyde key present + non-em-dash in nl/en/es, bucket id present in page.tsx — OK.
- Task 2 automated check: both `category === 'agency-ops'` and `category === 'product-clyde'` wired, no `@ts-ignore` — OK.
- No `any` / `@ts-ignore` / `NEXT_PUBLIC` secret introduced in the edited tsx.

**Note on build lint output:** the build prints ~1400 pre-existing ESLint errors (legacy `@ts-ignore`, setState-in-effect, ref-access-during-render) in unrelated files. These are out of scope (SCOPE BOUNDARY — not caused by this plan's changes), do not block compilation, and the build still exits 0 with all static pages generated. None are in the files this plan touched.

## Deviations from Plan

None — plan executed exactly as written. The only environmental note: the `gsd-tools.cjs` init path in the prompt resolved one level up at the repo root (`../.claude/get-shit-done/bin/`), not in `fmai-nextjs/.claude/`; used the root path.

## Downstream confirmation

A subsequent parallel commit (`6503be9` content(blog): agency-ops pillar marketingbureau-schalen-met-ai, CONT-09) landed the agency-ops pillar MDX on top of this wiring, confirming the infra surfaces new cornerstones automatically as designed.

## Commits

- `9cff6a5` feat(08-01): add product-clyde hub bucket + i18n in nl/en/es
- `598c09a` feat(08-01): wire agency-ops + product/Clyde pillars into homepage teaser

## Self-Check: PASSED

All 5 modified files exist on disk; both commits (`9cff6a5`, `598c09a`) present in git history.
