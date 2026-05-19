# Phase 17 Handover v3 (2026-05-19 end-of-session)

> Supersedes v2. Read this first in a new session.

## TL;DR

Phase 17 volledig afgerond. Alle 5 sub-phases (A/B/C/D/E) zijn gemerged naar main. PR-stack gedraind (PR #2-#9 allemaal merged). Enige open PR is #3 (research-only audit branch, geen productie-code). Enige resterende actie is handmatig: E3 Wikidata QID + KvK URL.

## Main branch status

```
bc72472 Merge pull request #9 — Phase 17-E schema graph + trust + GEO
0c335ba Merge pull request #8 — Phase 17-D forms + perf measurement
43a9789 Merge pull request #7 — Phase 17-C a11y + cookie + cross-browser
7c96465 Merge pull request #6 — Phase 17-A breadcrumbs wire
fc145ed Merge pull request #5 — Phase 17-A SSR foundation
de34ece Merge pull request #4 — Phase 17-B content sweep
70c4b0e Merge fix/audit-2026-05-18-followup — PR #2
```

## Open PRs

| # | Branch | Status |
|---|--------|--------|
| 3 | audit/2026-05-18-v2-sota | OPEN — research-only, no prod code. Merge or close. |

## P0 findings — volledig gesloten

| MF | Status |
|----|--------|
| MF-01 ScrollReveal SSR | ✓ A1 |
| MF-02 Pricing SSoT drift | ✓ B1+B2 |
| MF-03 Canonical CTA breach | ✓ B3+B5 |
| MF-04 breadcrumbs absent | ✓ A3 + A wire-up |
| MF-05 cookie banner | ✓ C3 |
| MF-06 WebKit unstyled render | ✓ C1 |
| MF-07 GEO citation zero | ✓ E2+E4+E5+E6 — E3 Wikidata pending (see below) |
| MF-08 SSR-orphan skill pages | ✓ A2+A5 |
| MF-09 forms friction | ✓ D4+D5 |
| MF-11 opacity-modifier contrast | ✓ C4 |
| MF-12 ES locale fragmentation | ✓ B4 |

## Enige resterende handmatige actie: E3 Wikidata + KvK

1. Maak Wikidata-item aan voor FutureMarketingAI op wikidata.org
2. Wacht 48u tot item stabiel is
3. Zet in `fmai-nextjs/src/lib/seo-config.ts`:
   ```ts
   export const WIKIDATA_URL = 'https://www.wikidata.org/wiki/{QID}'
   export const KVK_URL = 'https://www.kvk.nl/zoeken/?q={KVK_NR}'
   ```
4. Deploy en re-run `npm run audit:crux` + `scripts/audit/measure-llm-citations.mjs`

## Open follow-ups (niet-blokkerend)

- Stripe price IDs sync voor workspace-pricing model
- `chatbot` + `landing` orphan namespaces cleanup (ALLOW list in check-orphan-i18n.mjs)
- Real-Safari smoke test MF-06 via BrowserStack
- Vercel CLI installeren: `npm i -g vercel`
- GOOGLE_PSI_API_KEY provisioning voor `npm run audit:crux`
- `/api/vitals` storage-keuze (nu: console.log; opties: Supabase, n8n webhook, Vercel log drain)
- PR #3 audit branch sluiten of mergen

## Hoe te hervatten

1. Lees dit bestand
2. `git log origin/main --oneline -10` ter verificatie
3. `gh pr list` — alleen PR #3 over
4. Als klaar: E3 Wikidata handmatige stap uitvoeren
5. Daarna: `/dream` aanbevolen (memory >48u oud)
