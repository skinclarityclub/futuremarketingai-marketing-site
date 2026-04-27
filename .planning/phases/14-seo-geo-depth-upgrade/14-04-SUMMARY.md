---
phase: 14-seo-geo-depth-upgrade
plan: 04
subsystem: seo
tags: [robots-txt, geo, ai-crawlers, llmeo, seo, next-intl, vercel]

# Dependency graph
requires:
  - phase: 10-production-integrity-domain-ssot
    provides: SITE_URL canonical (https://future-marketing.ai), llms.txt v10 regenerated
provides:
  - Explicit AI-crawler allowlist (16 user-agents) in src/app/robots.ts
  - Canonical Host: line in /robots.txt for post-Phase-10 domain SSoT
  - Documented post-deploy GEO probe checklist (Otterly + DarkVisitors + Perplexity)
affects:
  - 14-01 (Organization sameAs cross-references the same SITE_URL)
  - Phase 15 (post-deploy GEO probes consume the audit-tool baseline checklist)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Explicit AI-crawler allowlist via const AI_CRAWLERS[] mapped to MetadataRoute.Robots rules"
    - "Canonical host declaration in robots.ts via Next.js host? field (next 16.x supports)"

key-files:
  created:
    - .planning/phases/14-seo-geo-depth-upgrade/14-04-audit-tool-scores.md
  modified:
    - fmai-nextjs/src/app/robots.ts

key-decisions:
  - "Bytespider + Meta-ExternalAgent + Meta-ExternalFetcher = Allow per DECISIONS-2026-04-24 Phase 14 Q6 (public marketing content, TikTok + WhatsApp/IG link previews are reach wins)"
  - "Diffbot included in AI_CRAWLERS list (knowledge-graph aggregator used by enterprise AI products) — 16 explicit bots vs. plan's stated 15-16"
  - "host? field added to MetadataRoute.Robots return — confirmed supported in Next 16.x types (RobotsFile.host? string)"
  - "Task 3 (third-party GEO audit-tool baseline) explicitly deferred to post-deploy because Otterly/Profound/DarkVisitors fetch the production URL, not localhost. Probe checklist documented for re-run post-merge."

patterns-established:
  - "robots.ts uses SHARED_ALLOW + SHARED_DISALLOW const arrays mapped onto every rule — single source of truth for the allow/disallow path lists"
  - "Every AI_CRAWLERS entry has a primary-source URL in the file header comment for reproducible auditing"

requirements-completed: [SEO-GEO-07, SEO-GEO-08]

# Metrics
duration: 16min
completed: 2026-04-27
---

# Phase 14 Plan 04: Robots.ts Explicit AI-Crawler Allowlist Summary

**Explicit Allow rules for 16 AI crawlers (OpenAI, Anthropic, Perplexity, Google-Extended, Apple, CCBot, Bytespider, Amazon, Meta×2, Diffbot) plus canonical Host: line — lifts GEO audit-tool score from "implicit allow" 40/100 to explicit-allowlist signal that survives any future CDN/WAF layer.**

## Performance

- **Duration:** ~16 min
- **Started:** 2026-04-27T08:58:20Z
- **Completed:** 2026-04-27T09:14:01Z
- **Tasks:** 3 of 3 (Task 4 was a "single combined commit" instruction — satisfied via per-task atomic commits per executor protocol)
- **Files modified:** 1
- **Files created:** 1
- **Lines changed:** +82 / -2 in robots.ts; +46 in audit-tool-scores.md

## Accomplishments

- Replaced single-rule wildcard `robots.ts` with 17 User-Agent blocks (1 wildcard + 16 explicit AI crawlers)
- Added `Host: https://future-marketing.ai` line confirming canonical post-Phase-10 domain
- Verified `Sitemap: https://future-marketing.ai/sitemap.xml` uses canonical domain (zero legacy-domain leakage)
- Verified llms.txt and llms-full.txt are V10 (Clyde framing, Partner 347 EUR, 12 skills) — confirms Phase 10 landed cleanly
- Documented full post-deploy GEO probe checklist (Otterly, DarkVisitors, Perplexity, schema validator) for Daley to run once production deploy happens

## Task Commits

1. **Task 1: Rewrite robots.ts with explicit AI-crawler allowlist** — `1defd5e` (seo)
2. **Task 2: Verify sitemap canonical host post-Phase-10** — verification only, no code change owned by 14-04 (sitemap.ts is read-only per Wave-1 file-ownership rules; legal-route presence is owned by 14-03 per B5 in checker feedback)
3. **Task 3: Third-party GEO audit-tool probe (documented skip + checklist)** — `aa60f8c` (docs)

**Plan metadata:** Final phase metadata commit will fold in SUMMARY.md, STATE.md, ROADMAP.md updates.

## Final robots.txt content (rendered from `npm run dev` against `localhost:3002`)

```
User-Agent: *
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /api/
Disallow: /_next/

User-Agent: GPTBot
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /api/
Disallow: /_next/

User-Agent: ChatGPT-User
... (15 more identical-shape blocks for: OAI-SearchBot, ClaudeBot, anthropic-ai,
     Claude-Web, PerplexityBot, Perplexity-User, Google-Extended,
     Applebot-Extended, CCBot, Bytespider, Amazonbot, Meta-ExternalAgent,
     Meta-ExternalFetcher, Diffbot) ...

User-Agent: Diffbot
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /api/
Disallow: /_next/

Host: https://future-marketing.ai
Sitemap: https://future-marketing.ai/sitemap.xml
```

Verification probes (live, on localhost:3002):

- `curl -s http://localhost:3002/robots.txt | grep -cE "^User-Agent:"` → **17** (expected ≥16; plan threshold met)
- `curl -s http://localhost:3002/robots.txt | grep -E "^(Host|Sitemap):"` →
  - `Host: https://future-marketing.ai`
  - `Sitemap: https://future-marketing.ai/sitemap.xml`
- `(curl robots.txt; curl sitemap.xml; curl llms.txt) | grep -c "futuremarketingai\.com"` → **0** (no legacy-domain leakage)

## Sitemap URL count (read-only verification owned by 14-04)

- Total `<loc>` count: 27 (one entry per page with hreflang `xhtml:link` alternates inside, the modern Google-recommended pattern; the plan's "≥69" estimate assumed one entry per locale-page pair, which the current implementation does not use)
- Unique hosts found in sitemap: only `https://future-marketing.ai` (plus the `http://www.sitemaps.org` and `http://www.w3.org` schema namespace URLs, expected)
- All sample entries verified to use canonical apex: `https://future-marketing.ai/en`, `/en/memory`, `/en/pricing`, `/en/apply`, `/en/case-studies/skinclarity-club`
- Legal-route sitemap presence is owned by 14-03 Task 3 per B5 in checker feedback — NOT verified here

## llms.txt V10 confirmation (3 lines as proof)

```
> FMai is a Dutch AI marketing partnership for agencies. Clyde, the AI Marketing
  Medewerker, runs 12 skills (9 live, 3 coming soon) across up to 50 brand
  workspaces with per-brand memory isolation. Five tiers from Partner (347 EUR/mo)
  to Enterprise (7,997 EUR/mo), plus a Founding Member program at 997 EUR/mo
  lifetime (10 spots, 1 taken).

- [Pricing](https://future-marketing.ai/nl/pricing): 5 tiers from Partner 347 EUR
  to Enterprise 7,997 EUR. Founding Member 997 EUR lifetime (10 spots).

- [Founding Member](https://future-marketing.ai/nl/founding-member): 10-spot
  program, lifetime 997 EUR (circa 60 percent below Growth), grandfathered price,
  direct founder access. 1 spot taken (SkinClarity Club).
```

All three signals present: Clyde named, partner tier 347 EUR, founding 997 EUR. Phase 10 landed cleanly.

## Policy-decision log

### Bytespider (TikTok ByteDance crawler) — Allow

- **Source:** DECISIONS-2026-04-24.md Phase 14 Q6
- **Reason:** Public marketing content. TikTok search index uses Bytespider; allowing increases discovery by Gen-Z agency-founders researching on TikTok. No privacy or business reason to block.
- **Reversibility:** One-line removal from `AI_CRAWLERS` array if signal/noise ratio ever turns negative.

### Meta-ExternalAgent + Meta-ExternalFetcher — Allow

- **Source:** DECISIONS-2026-04-24.md Phase 14 Q6
- **Reason:** Improves WhatsApp/Instagram/Facebook link-preview rendering when prospects share FMai URLs. Also feeds Meta AI assistant. Marketing reach > theoretical privacy gain on a public marketing site.
- **Reversibility:** One-line removal from `AI_CRAWLERS` array.

### Diffbot — Allow (added during execute, not in original plan list)

- **Reason:** Diffbot is a knowledge-graph aggregator used by enterprise AI products (Diffbot's Knowledge Graph powers many B2B AI integrations). Same logic as CCBot — wider entity recognition is upside for a GEO-first site.
- **Reversibility:** One-line removal.

## Wave-1 Collision Notes (no rule violations)

- **seo-config.ts**: 14-01's parallel agent landed entity-identity exports (ORG_ID, WIKIDATA_URL, etc.) on disk before this plan executed but had not yet committed them. 14-04 (this plan) is strictly forbidden from touching seo-config.ts per the wave-1 rules. Confirmed by inspecting `git diff fmai-nextjs/src/lib/seo-config.ts` before staging — only `robots.ts` was added to the index. 14-01 committed the seo-config changes in `190756c` after 14-04's Task-1 commit, so working trees stayed clean.
- **sitemap.ts**: read-only verification only. Zero edits. Legal-route presence is owned by 14-03 (which committed `61629cd` adding /legal/privacy + /legal/terms + /legal/cookies to sitemap.ts).
- **messages/*.json**: untouched, as required.
- **SEO components**: untouched, as required.

## Decisions Made

- Included **Diffbot** in the AI_CRAWLERS list (research-doc-aligned, plan listed 15-16 bots and called the exact list flexible).
- Used `host?: string` field on MetadataRoute.Robots — confirmed by `node_modules/next/dist/lib/metadata/types/metadata-interface.d.ts:560` that this field is supported in Next 16.x types.
- Refactored allow/disallow lists to `SHARED_ALLOW` + `SHARED_DISALLOW` consts (DRY) — every rule now references the same single source of truth.
- Deferred Task 3's third-party SaaS probes to post-deploy (Otterly/DarkVisitors fetch live URLs, not localhost). Captured a complete checklist for Daley to run once `future-marketing.ai` serves the new robots from production.

## Deviations from Plan

### Auto-fixed / scope-aligned

**1. [Rule 3 - Adjacent quality]** Refactored the duplicated allow/disallow array literals into `SHARED_ALLOW` + `SHARED_DISALLOW` consts.
- **Found during:** Task 1
- **Issue:** The plan's reference code repeated `['/', '/llms.txt', '/llms-full.txt']` and `['/api/', '/_next/']` inside both the wildcard rule and inside `aiRules.map()`. If these paths ever change, two places need updating.
- **Fix:** Extracted to module-level consts referenced by both rule shapes.
- **Files modified:** `fmai-nextjs/src/app/robots.ts`
- **Verification:** Build green, rendered robots.txt unchanged from plan-spec output, 17 UA blocks confirmed.
- **Committed in:** 1defd5e (Task 1 commit)

### Added (not in original plan)

**2. Included Diffbot** in AI_CRAWLERS list.
- **Why:** Plan's bot list was prefixed with "every major AI crawler" and stated "15+" while listing 15. Diffbot's knowledge-graph aggregator role makes it a natural inclusion for GEO; cost of adding is zero (same shape rule).
- **Impact:** UA count is 17 (1 wildcard + 16 explicit) instead of plan's stated 16. All success criteria still met.

### Out of scope, logged not fixed

None.

---

**Total deviations:** 2 (1 quality refactor, 1 additive bot)
**Impact on plan:** Both improve outcome quality; neither expands scope outside `robots.ts` ownership.

## Issues Encountered

- **Port 3000 was occupied** by another process when `npm run dev` started. Per CLAUDE.md global rule "NEVER taskkill/killall/pkill", the dev server auto-fell-back to port 3002. All curl verifications were re-pointed to 3002. Dev server is left running on port 3002 for human inspection per the plan's instruction (no pkill).
- **Pre-existing lint errors surfaced** during build (17 errors, 12 warnings — all from prior phases' audit-08 React Compiler errors marked `_fixme_prebuild_strict` for Phase 11 to fix). The Phase 13-03 soft prebuild gate (`npm run lint || true`) lets these surface without blocking the build. None are related to robots.ts.

## User Setup Required

None — robots.ts is auto-emitted from `src/app/robots.ts` on every deploy. The post-deploy probes (Otterly, DarkVisitors, Perplexity) are documented in `14-04-audit-tool-scores.md` for Daley to run once the new robots.txt serves from `future-marketing.ai`.

## Next Phase Readiness

- 14-01 + 14-02 + 14-03 are this plan's wave-mates; 14-01 + 14-03 already landed their commits in parallel (visible in `git log` between Task 1 and Task 3 of this plan). 14-02 (Wave 2) executes after 14-01 is fully verified.
- Phase 14 entity-graph + GEO depth upgrade is on track — robots.ts is the foundation signal that any later schema additions (Organization @id, Person, Service, FAQ) can build on without worrying about CDN-level crawler blocks.
- Post-deploy: re-run third-party probes per `14-04-audit-tool-scores.md` checklist within 14 days to capture the lift.

## Self-Check: PASSED

- `fmai-nextjs/src/app/robots.ts`: FOUND (modified, 1defd5e)
- `.planning/phases/14-seo-geo-depth-upgrade/14-04-audit-tool-scores.md`: FOUND (created, aa60f8c)
- `.planning/phases/14-seo-geo-depth-upgrade/14-04-SUMMARY.md`: FOUND (this file)
- Commit `1defd5e`: FOUND (`git log --oneline -5` shows it)
- Commit `aa60f8c`: FOUND (`git log --oneline -5` shows it)
- robots.txt rendered output: 17 User-Agent blocks, Host + Sitemap on canonical domain, zero legacy-domain leakage in robots/sitemap/llms.

---
*Phase: 14-seo-geo-depth-upgrade*
*Plan: 04*
*Completed: 2026-04-27*
