---
plan: 14-01
created: 2026-04-27
purpose: Track Wikidata item creation status (Task 1 — external/async).
---

# 14-01 Notes — Wikidata QID Tracking

## Status — 2026-04-27

**FMai Wikidata item:** DEFERRED — pending Daley account login + manual creation via https://www.wikidata.org/wiki/Special:NewItem

**Daley Person item:** DEFERRED — optional per plan, may ship in Phase 14.5 if FMai item survives 48h speedy-delete patrol.

## Why deferred

Task 1 requires authenticated Wikidata UI work that the executor agent cannot perform. Per the plan's task-ordering note, code tasks 2-5 ship with `WIKIDATA_URL = null` and the schema graph remains valid via the `buildSameAs()` null-filter (LinkedIn renders today, Wikidata adds when QID lands).

## Daley action items

1. Log in: https://www.wikidata.org/wiki/Special:UserLogin
2. Create FMai item per Task 1 spec in 14-01-PLAN.md:
   - Label (en): `FutureMarketingAI`
   - Description (en): `Dutch AI marketing automation agency and platform building Clyde, an AI Marketing Employee for marketing agencies`
   - Description (nl): `Nederlands AI-marketing-automatiseringsbureau en platform dat Clyde bouwt, een AI Marketing Medewerker voor marketingbureaus`
   - Statements: P31→Q4830453, P17→Q55, P571→2024, P452→Q11030+Q11660, P856→https://future-marketing.ai, P4264→futuremarketingai
   - Skip P2002 (Twitter) per DECISIONS Q5
   - Add at least 2 references (website + LinkedIn URLs) to deter speedy-delete
3. Record QID below.
4. After 48h survival check, swap `WIKIDATA_URL` in `fmai-nextjs/src/lib/seo-config.ts` from `null` to `https://www.wikidata.org/wiki/{QID}`.

## QIDs

- **FMai QID:** TODO — `Q________` (status: not yet created)
- **Daley QID:** skipped (deferred to Phase 14.5; reverse-link via P112 added then if/when notable)

## Speedy-delete contingency

- T+0h: item created with 2+ refs.
- T+48h: visit https://www.wikidata.org/wiki/{QID}, check for `{{Proposed deletion}}` / `{{AfD}}` / 404.
  - **Healthy → swap `WIKIDATA_URL` constant.** Commit follow-up: `seo(schema): land Wikidata QID in seo-config now that 48h survival confirmed`.
  - **Flagged/404 → leave `WIKIDATA_URL = null`.** `buildSameAs()` filter handles gracefully — schema simply omits Wikidata. Document rationale here.

Cite: 14-01-PLAN.md `<contingency>` block, RESEARCH.md sec 1.
