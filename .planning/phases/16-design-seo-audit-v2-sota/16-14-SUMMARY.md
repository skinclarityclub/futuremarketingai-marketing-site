---
phase: 16-design-seo-audit-v2-sota
plan: 16-14
wave: 2
team: 12
date: 2026-05-19
type: research
status: complete
commit: 95f9183
duration_minutes: ~30
tags: [audit, competitive, cross-stack, ssot, drift, geo, llmeo, pricing]
tech_stack:
  added: []
  patterns: [12-axis scorecard, 2x2 positioning map, cross-stack diff table]
key_files:
  created:
    - docs/audits/2026-05-18-v2/13-competitive-cross-stack.md
  modified: []
artifacts:
  - path: docs/audits/2026-05-18-v2/13-competitive-cross-stack.md
    provides: Competitor scorecard + 2x2 positioning + cross-stack SSoT diff + 25 findings + strategic recommendation
    word_count: 5949
    findings_count: 25
requirements:
  - AUDIT-V2-SOTA
---

# Phase 16 Plan 16-14: Wave 2 Team 12 Competitive Cross-stack Drift Summary

One-liner: 12-axis scorecard plus 2x2 positioning map plus 6-source cross-stack SSoT diff voor FMai vs 7 named competitors, surfacing 25 ranked findings waarvan 8 P0 (alle cross-stack drift in CHATBOT_TIERS plus llms.txt plus llms-full.txt) en een 12-week strategic move-plan op het Stripe-Linear winning-quadrant.

## What landed

Eén nieuw audit-document, één atomic commit. Geen code-, config-, of messages-edits. Geen STATE.md of BUDGET.log mutaties.

**Output document:** `docs/audits/2026-05-18-v2/13-competitive-cross-stack.md` (5.949 woorden, 7.4x boven de 800-word threshold uit het plan).

**Required sections (all present):**

1. Executive summary met top-3 differentiators en top-3 vulnerabilities.
2. 12-axis scorecard met FMai + 7 named competitors + 2 SOTA-references (Stripe, Linear) op axes A1-A12. FMai-totaal 18/24, Stripe 19/24, beste competitor Virtual Outcomes 12/24.
3. 2x2 positioning map (ASCII grid) met FMai + 7 competitors + 2 references geplot op Positioning clarity × Pricing transparency.
4. Per-competitor deep-dive (paragraaf per competitor) voor 7 named plus 2 reference.
5. Cross-stack SSoT diff met 7 diff-tabellen over 6 bronnen: SSoT (`fma-app/src/lib/skills.ts`), site-mirror (`skills-data.ts`), presentation (`pricing-data.ts`), copy (`messages/*.json`), GEO surfaces (`llms.txt` + `llms-full.txt`), chatbot (`tool-data.ts`).
6. Top 25 findings met severity (8 P0, 8 P1, 8 P2, 1 P3) en remediation-scope per finding.
7. Strategic positioning recommendation: 12-week move-plan om FMai van 18/24 naar 22/24 te tillen.

## Headline findings

**P0 cross-stack drifts (8 findings):**

1. **F1** CHATBOT_TIERS in `fmai-nextjs/src/lib/chatbot/tool-data.ts` is fundamenteel v9 (flat 2.497 / 4.497 / 7.997 EUR/mo + flat credits + geen workspace dimensie). SSoT staat al sinds 2026-04-28 op workspace-priced. Elke chatbot-prospect die naar prijs vraagt krijgt verkeerde antwoord.
2. **F2** `llms.txt` header zegt "Five tiers from Partner (347 EUR/mo) to Enterprise (7,997 EUR/mo)". Echt: 4 tiers, workspace-priced.
3. **F3** `llms-full.txt` lines 202-234 hebben dedicated 5-tier secties met Partner 347 + Growth 2.497 + Pro 4.497 + Ent 7.997 + Founding 997.
4. **F4** `llms.txt` claimt "Voice Agent: Live with demo" terwijl SSoT zegt `status: 'coming_soon'` en de impl gebruikt VAPI niet ElevenLabs.
5. **F8** `llms.txt` mentions Partner tier (verwijderd 2026-04-28).
6. **F9** `llms-full.txt` mentions Partner tier (5x op verschillende plekken).
7. **F13** CHATBOT_TIERS missing min/maxWorkspaces fields.
8. **F14** Chatbot copy spreekt over "5 workspaces" / "15 workspaces" als enkele getallen ipv ranges.

**P1 findings (8):** skill-status drifts in llms.txt voor adCreator/emailManagement/manychatDm, partner-pack rename gap, missing `/legal/security` trust-page, missing case-study metrics, env name mismatch (`STRIPE_PRICE_*_PER_WORKSPACE` vs `STRIPE_PRICE_*`), missing FOUNDING dates surfacing, missing newsletter capture.

**P2/P3 findings (9):** SKILL_PACKS naming debt in SSoT (fma-app repo), competitor parity gaps op A4/A7/A8, schema serviceType not in llms.txt, self-aware drift-risk comment in tool-data.ts.

## Key insights for downstream waves

For **16-15 synthesis**:
- Cross-stack drift is een recurring P0-pattern: 16-06 al F1 (stale llms.txt), nu 16-14 expandeert dat naar 5 P0 findings over chatbot + llms.txt + llms-full.txt + 4 skill status mismatches. Synthesis-paragraaf moet dit als "trust-coherence drift class" markeren.
- A4 (GDPR/AVG visibility) en A7 (case-study metric depth) zijn structurele competitor parity gaps die ook in 16-12 (CRO) en 16-13 (Security) zullen surfacen. Cross-cutting theme voor roadmap.

For **16-16 fix-plan**:
- Drie P0 fixes komen samen onder 1 werkdag (F1 2h + F2-F3 1h + F4 5min + F8-F9 30min). Hoogste ROI quick-wins van phase 16.
- 12-week move-plan in document sectie "Strategic positioning recommendation" is direct copyable als basis voor Q3-roadmap-PRD.

## Cross-stack diff summary

| Bron | Tier set | Pricing model | Voice Agent status | Partner tier present |
|---|---|---|---|---|
| `fma-app/src/lib/skills.ts` (SSoT) | 4 | mixed fixed+workspace | coming_soon | no (mapping only) |
| `fmai-nextjs/src/lib/skills-data.ts` | 4 | n/a (no prices) | coming_soon | no |
| `fmai-nextjs/src/lib/pricing-data.ts` | 4 | matched | n/a | no |
| `fmai-nextjs/messages/nl.json` | 4 | matched in copy | (no global flag) | no |
| `fmai-nextjs/public/llms.txt` | **5** | wrong | **"Live with demo"** | **yes (347 EUR)** |
| `fmai-nextjs/public/llms-full.txt` | **5** | wrong (flat) | **flagged Live** | **yes (3+ occurrences)** |
| `fmai-nextjs/src/lib/chatbot/tool-data.ts` | 4 | **flat (v9)** | n/a | no |

Drift concentratie: 5 van 7 P0 findings zitten in `public/llms.txt` + `public/llms-full.txt`. Eén P0 in `chatbot/tool-data.ts`. SSoT, site-mirror, presentation-layer en messages zijn onderling consistent.

## Verification

```
TASK1 (scorecard + 2x2 map + per-competitor deep-dive): PASS
TASK2 (SSoT diff + recommendation + >=25 findings): PASS
FINDINGS: 25
WORDS: 5949
NO EM-DASH OK
```

## Deviations from Plan

None. Plan executed exactly as written, with two minor scope-discipline choices:

1. **No optional firecrawl scrapes used.** Plan allowed up to 3 additional competitor sub-page scrapes. The 16-01 doc already provided enough scoring evidence for 7 competitors plus 3 SOTA references, so I skipped optional research to stay inside the 35-minute budget and to avoid touching BUDGET.log (explicitly forbidden by execution constraints).
2. **STATE.md and BUDGET.log not modified.** The original plan file frontmatter listed STATE.md and BUDGET.log under `files_modified`, but execution constraints explicitly forbid modifying them ("DO NOT MODIFY .planning/phases/16-design-seo-audit-v2-sota/STATE.md or BUDGET.log"). I followed the explicit execution constraints. Wave 3 metadata batch (similar to 2A/2B/2C from prior commits) will handle STATE.md mutation as a single batch.

## Files touched

| Action | Path | Reason |
|---|---|---|
| Created | `docs/audits/2026-05-18-v2/13-competitive-cross-stack.md` | Plan deliverable |
| Created | `.planning/phases/16-design-seo-audit-v2-sota/16-14-SUMMARY.md` | This summary |
| Read only | `C:/Users/daley/Desktop/fma-app/src/lib/skills.ts` | SSoT verification |
| Read only | `fmai-nextjs/src/lib/skills-data.ts` | Mirror diff |
| Read only | `fmai-nextjs/src/lib/pricing-data.ts` | Presentation diff |
| Read only | `fmai-nextjs/src/lib/constants.ts` | Founding constants diff |
| Read only | `fmai-nextjs/src/lib/chatbot/tool-data.ts` | Chatbot tier diff |
| Read only | `fmai-nextjs/messages/{nl,en,es}.json` | Copy diff |
| Read only | `fmai-nextjs/public/llms.txt` | GEO surface diff |
| Read only | `fmai-nextjs/public/llms-full.txt` | GEO surface diff |
| Read only | `fmai-nextjs/.env.example` | Stripe price ID expectations |

Zero edits to anything under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*`. Zero edits to `C:/Users/daley/Desktop/fma-app/`. Zero edits to STATE.md or BUDGET.log per execution constraints.

## Commit

```
95f9183 docs(audit): 16-14 Wave 2 competitive cross-stack drift audit
```

Single atomic commit. Conventional format. No `--no-verify`. Hooks ran successfully (LF/CRLF warning only, expected on Windows).

## Self-Check: PASSED

- `docs/audits/2026-05-18-v2/13-competitive-cross-stack.md` exists: FOUND
- Commit `95f9183` exists: FOUND in `git log`
- Word count 5949 >= 800 threshold: PASSED
- 25 findings >= 25 threshold: PASSED
- Required sections (scorecard, 2x2 map, deep-dive, SSoT diff, recommendation): all present
- No em-dashes: confirmed via PowerShell `[char]0x2014` scan
- No production code touched: confirmed via `git status --short`
- Branch correct: `audit/2026-05-18-v2-sota`
