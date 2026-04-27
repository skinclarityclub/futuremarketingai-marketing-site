---
plan: 14-04
phase: 14-seo-geo-depth-upgrade
captured: 2026-04-27
status: skipped (deferred to post-deploy)
---

# 14-04 — GEO audit-tool baseline scores

This document captures (or formally defers) third-party GEO audit-tool scores so we can compare pre- vs post-deploy after the explicit AI-crawler allowlist lands in production.

## Status: SKIPPED at execute time — re-run post-deploy

The plan flagged Task 3 as optional ("skip if no API keys or budget"). The execute environment is autonomous, the changes are local-only until merged to `main` and deployed via Vercel, and most third-party GEO audit tools require:

1. A live, publicly reachable URL on the canonical domain
2. A SaaS-account login (Otterly Lite is $29/mo, Profound is enterprise contract)
3. An interactive dashboard to capture before/after deltas

Running the probes against `localhost:3002` is meaningless — the tools fetch the production URL and parse the actual HTTP response served from Vercel.

The right time to capture baseline + delta is **immediately after the next production deploy**, comparing the response from the explicit-allowlist `robots.txt` against the previous `User-agent: *`-only version (still cached on third-party scanners until they re-poll).

## What WAS verified locally

Even without third-party tools, every assertion the plan listed was checked against `npm run dev` output:

- `curl http://localhost:3002/robots.txt | grep -cE "^User-Agent:"` → **17** (1 wildcard + 16 explicit AI crawlers, exceeds plan's ≥16 expectation)
- `curl http://localhost:3002/robots.txt | grep -E "^(Host|Sitemap):"` → both lines present, both use canonical `https://future-marketing.ai`
- `curl http://localhost:3002/sitemap.xml | grep -oE "https?://[a-z.-]+" | sort -u` → only `https://future-marketing.ai` (plus the schema namespace URLs, expected). Zero legacy-domain leakage.
- `curl http://localhost:3002/llms.txt | grep -E "Clyde|347"` → 6 matches confirming v10 content (Clyde framing, Partner 347 EUR tier).

## Probes to run post-deploy (checklist for Daley)

Run these once `future-marketing.ai` is serving the new `robots.txt` from production:

- [ ] **Otterly.AI** — https://otterly.ai/ — drop the domain, capture the GEO score and the recommendation list. Save screenshot to `.planning/phases/14-seo-geo-depth-upgrade/screenshots/otterly-post-1404.png`. Compare against Otterly's pre-deploy snapshot (if any).
- [ ] **DarkVisitors** — https://darkvisitors.com/ — paste the live `robots.txt`. Expect every entry in `AI_CRAWLERS` to be detected with status "Allowed". Capture coverage report.
- [ ] **Schema markup validator** — https://validator.schema.org/ — paste any rendered page HTML to confirm Organization + WebSite + WebPage schema still validates (no regression from the robots changes; this is a sanity check that 14-01's parallel work landed cleanly).
- [ ] **Perplexity probe** — `mcp__perplexity__perplexity_search "wat is Clyde van FutureMarketingAI"` — re-run the 14-01 Task 8 baseline. Expect "no change" since content didn't change, only crawler signals. A real lift (FMai domain in citations) typically takes 7-14 days for the search index to re-crawl.

## Notes for next run

- The plan called the Otterly+Profound baseline a "compare against post-deploy" exercise, which inherently is a two-shot probe. Capturing baseline AFTER the change ships is fine — the comparison happens on the second probe (T+14 days), not within this plan.
- DarkVisitors confirmation is the single most useful free probe and should land within 5 minutes of the production deploy completing.
- All entries in `AI_CRAWLERS` map to a primary-source URL in the `robots.ts` header comment, so any future auditor can independently verify the agent strings.
