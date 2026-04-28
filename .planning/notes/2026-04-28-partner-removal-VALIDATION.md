---
change: partner-tier removal + founding-prominence rework
validated: 2026-04-28
validator: opus + playwright chromium
base_url: http://localhost:3060
status: gaps_found
score: 94/96 assertions passed
total_assertions: 96
duration_seconds: 12
---

## Executive summary

The Partner-tier removal + Founding-prominence rework (commits ab58816, 048acfb, ee3391e on the marketing site) shipped almost cleanly. 94 of 96 browser assertions across NL/EN/ES pass on `next start` against a fresh production build. The tier surfaces (cards, matrix, skill-page comparisons), apply form, JSON-LD, and chatbot KB references are all clean of Partner artefacts and reorder Founding to the top. Two i18n strings were missed during the locale rewrite: the EN and ES `pricing.hero.title` + `pricing.hero.description` still read "Premium partnerships. 5 tiers. Transparent." / "5 tiers para cualquier tamaño de portfolio". NL was rewritten correctly to "Premium partnerships. Founding €997 levenslang." Three additional skill-FAQ answers per non-NL locale also reference "all 5 tiers" / "los 5 tiers" — those did not appear in the cross-cutting copy assertions because the assertions only sampled `/`, `/pricing`, `/founding-member`, `/apply`, but they share the same root cause and are flagged below.

## Per-group results

| Group | Description | Pass / Total |
|---|---|---|
| Bootstrap | Server reachable + locale content loads | 1 / 1 |
| G1 | /pricing tier-card surface (4 cards, Founding-first, badge, locked-note, no Partner, no €347) | 33 / 33 |
| G2 | /pricing Skills × Tier matrix (4 cols, ordering, no add-on) | 9 / 9 |
| G3 | Skill-page tier-comparison tables (voice-agent / ad-creator / blog-factory) | 9 / 9 |
| G4 | /apply tier select (5 options, founding first, no partner, locale hint) | 12 / 12 |
| G5 | Chatbot KB live answer (optional) | 1 / 1 (skipped) |
| G6 | /pricing JSON-LD ItemList (4 entries, Founders Club first, no €347) | 9 / 9 |
| G7 | Cross-cutting copy: NO €347, NO "5 tiers" on /, /pricing, /founding-member, /apply | **22 / 24** |
| G8 | Build hygiene: no console/page errors mentioning Partner refs | 1 / 1 |
| **Total** | | **94 / 96** |

## Failures

### F1 — `/en/pricing` hero contains "5 tiers"

- **Expected**: zero occurrence of "5 tiers" / "five tiers" / "cinco tiers" / "5 niveaus" on `/en/pricing` main copy + meta.
- **Actual**: `Premium partnerships. 5 tiers. Transparent.` + `All prices are visible. 5 tiers for every portfolio size: from solo operator to enterprise. ...`
- **Source**: `fmai-nextjs/messages/en.json:540-541`
  - `pricing.hero.title`: still "Premium partnerships. 5 tiers. Transparent." (NL was rewritten to "Premium partnerships. Founding €997 levenslang." but EN was not)
  - `pricing.hero.description`: still "All prices are visible. 5 tiers for every portfolio size..."
- **Screenshot**: `fmai-nextjs/test-results/partner-removal-validation/en/G7_cross-cutting_copy/NO__5_tiers___five_tiers___cinco_tiers___5_niveaus__on__pricing.png`
- **Suspected cause**: Commit 048acfb's NL-source hero rewrite did not propagate to EN. The locale-rewrite scope in the commit message lists `pricing.title` rewritten to "Premium partnerships. Founding €997 lifetime." across NL/EN/ES, but the actual key in the JSON tree is `pricing.hero.title` (`hero` namespace, not top-level), and EN/ES were left on the old copy. NL got both the hero key AND a separate top-level `pricing.title` key updated; EN/ES only got the latter.

### F2 — `/es/pricing` hero contains "5 tiers"

- **Expected**: zero occurrence on `/es/pricing`.
- **Actual**: `Todos los precios visibles. 5 tiers para cualquier tamaño de portfolio: desde operador solo hasta enterprise. ...`
- **Source**: `fmai-nextjs/messages/es.json:540-541`
  - `pricing.hero.title`: "Premium partnerships. 5 tiers. Transparente." (untranslated/unchanged)
  - `pricing.hero.description`: untouched, still says "5 tiers"
- **Screenshot**: `fmai-nextjs/test-results/partner-removal-validation/es/G7_cross-cutting_copy/NO__5_tiers___five_tiers___cinco_tiers___5_niveaus__on__pricing.png`
- **Suspected cause**: same as F1 — EN/ES rewrite of `pricing.hero.*` was missed in commit 048acfb.

### Adjacent gap (not in assertion set) — skill FAQ answers

`grep "5 tiers" messages/{en,es}.json` reveals three additional un-assertion'd offenders per non-NL locale (not failing the validation, but worth fixing in the same commit):

- `messages/en.json:1158` (skills.lead-qualifier FAQ): "Included on all 5 tiers, with fair-use on conversation volume. ..."
- `messages/en.json:1459` (skills.reporting FAQ): "Included on all 5 tiers, with fair-use on generated reports. ..."
- `messages/en.json:2050` (skills.research FAQ): "Included on all 5 tiers with fair-use on number of queries. ..."
- `messages/es.json:1158` / `:1459` / `:2050`: equivalent ES strings ("Incluido en los 5 tiers ...").

NL counterparts of these answers are clean (no equivalent occurrences found via `grep "5 tiers\|vijf tiers\|5 niveaus" nl.json`). Recommend `s/all 5 tiers/all 4 tiers/` and `s/los 5 tiers/los 4 tiers/` in the same fix.

## Recommendation

**fix-then-ship.**

Both failures are content-only i18n strings — no logic change. They live in two JSON keys per locale (the hero pair) plus three FAQ strings per non-NL locale. A single follow-up commit can resolve all six occurrences across EN+ES without touching code. Suggested fix:

```
content(pricing): align EN+ES hero with NL Founding-first rewrite

- en/es: pricing.hero.title -> "Premium partnerships. Founding €997 lifetime / de por vida."
- en/es: pricing.hero.description -> drop "5 tiers" phrasing, mirror NL's "Founding €997 lifetime for the first 10 agencies. Then Growth, Professional, Enterprise."
- en/es: 3 skill-FAQ answers s/5 tiers/4 tiers/ in lead-qualifier, reporting, research namespaces.
```

Everything else — tier-card surface, matrix, skill-page comparisons, apply form, JSON-LD, KB diff, build hygiene — is correct across all three locales. Once the six EN/ES strings are fixed and re-validated, ship.

## Artifacts

- Validation script: `fmai-nextjs/scripts/validate/partner-removal-playwright.mjs`
- Machine report: `fmai-nextjs/test-results/partner-removal-validation/report.json`
- Failure screenshots: `fmai-nextjs/test-results/partner-removal-validation/{en,es}/G7_cross-cutting_copy/`
- Console error log: `fmai-nextjs/test-results/partner-removal-validation/console-errors.json` (empty — zero Partner-related errors)
