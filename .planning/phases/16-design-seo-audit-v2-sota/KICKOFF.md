# KICKOFF — Phase 16 Autonomous Run

> Eén pagina. Lees, doe drie commando's, walk away.

## Pre-flight (eenmalig, ~2 min)

Verifieer dat de omgeving klaar is. Stop bij elke FAIL:

```powershell
# Werkdirectory
cd C:\Users\daley\Desktop\Futuremarketingai

# 1. Repo state — geen uncommitted production code changes
git status --short
# OK: alleen .planning/phases/16-... files en eventueel test-results/ + docs/

# 2. Branch context — je staat op fix/audit-2026-05-18-followup (Phase 16 vertakt hieruit)
git rev-parse --abbrev-ref HEAD
# Expected: fix/audit-2026-05-18-followup

# 3. Productie bereikbaar
curl -sI https://future-marketing.ai | Select-String "HTTP"
# Expected: HTTP/2 200 of HTTP/1.1 200

# 4. Gemini key (Google grounded research is de sole research-provider in deze phase)
node -e "console.log('Gemini:', !!process.env.GEMINI_API_KEY)"
# Expected: true (kijk anders in ~/.claude/.env)

# 4b. Gemini-research script bestaat en werkt
node "$env:USERPROFILE\.claude\scripts\gemini-research.mjs" "test query" --json | Select-String "answer" | Select-Object -First 1
# Expected: een regel met "answer". Foutmelding = key/script issue, fix vóór run

# 5. Playwright browsers
cd fmai-nextjs
npx playwright --version
# Indien errors over missing browsers: npx playwright install chromium webkit firefox

# 6. Lokale dev kan starten (test, dan kill)
npm run dev
# Wacht tot "Local: http://localhost:3000" verschijnt, dan Ctrl+C. Executor start hem opnieuw.

cd ..
```

## Run (autonomous, ~5-6 uur wall-clock)

### Stap 1 — Genereer 16 plan-files (~2-3 min)

```
/gsd:plan-phase 16 --prd .planning/phases/16-design-seo-audit-v2-sota/PRD.md --skip-research
```

De `gsd-planner` agent leest de PRD en genereert 16 plan-XX-PLAN.md files met:
- Per plan: YAML frontmatter (wave, depends_on, files_modified, autonomous: true, must_haves)
- `<tasks>` blocks per plan met exacte commands
- `gsd-plan-checker` valideert tegen success criteria 1-10

**Verifieer na afloop**:
```powershell
ls .planning/phases/16-design-seo-audit-v2-sota/16-*-PLAN.md
# Expected: 16 files (16-01 t/m 16-16)
```

Indien <16 files: `/gsd:plan-phase 16 --prd .planning/phases/16-design-seo-audit-v2-sota/PRD.md --skip-research --gaps` om gaps te closen.

### Stap 2 — Autonome uitvoering (~5-6 uur)

```
/gsd:execute-phase 16
```

De `gsd-executor` agent leest STATE.md, runt waves in volgorde:
- **Wave 1 solo**: 16-01 (~30 min) → 16-02 (~60 min)
- **Wave 2 parallel** (12 teams, 4 concurrent budget): 16-03 t/m 16-14 (~90-120 min wall-clock)
- **Wave 3 solo**: 16-15 (~45 min)
- **Wave 4 solo**: 16-16 (~60-90 min)

Per plan: atomic commit, STATE.md update, BUDGET.log append. Bij failure: skip + continue per AUTONOMOUS-PROTOCOL.md Rule 1.

**Tijdens execution kan je**:
- `/gsd:progress` voor live status
- `git log audit/2026-05-18-v2-sota --oneline` voor commit-progress
- `Get-Content .planning/phases/16-design-seo-audit-v2-sota/STATE.md` voor wave-status
- `Get-Content .planning/phases/16-design-seo-audit-v2-sota/BUDGET.log -Tail 20` voor API/disk budget

### Stap 3 — Verificatie (~5 min)

```
/gsd:verify-work 16
```

Of handmatig de PowerShell suite uit `AUTONOMOUS-PROTOCOL.md` § "Verification automation".

Expected output: alle 19 checks `OK`, geen `FAIL`.

## Wat te doen bij abort

Bij hard-abort (zie AUTONOMOUS-PROTOCOL.md § Hard abort) schrijft de executor `ABORT-{timestamp}.md`. Lees dat doc voor recovery-instructies. Meest waarschijnlijk:

| Abort reason | Recovery |
|---|---|
| Production code touched | `git checkout main -- fmai-nextjs/src/ fmai-nextjs/messages/` + restart |
| Disk full | Clean `test-results/audit-v2/screenshots/` (jpegs ipv pngs in restart) |
| Dev-server crash-loop | Check `.env.local`, mogelijk env-var ontbreekt sinds last main merge |
| Productie >24u down | Wacht / fix DNS, run niet zonder productie URL |
| Branch create fail | `git status` + manual cleanup, dan re-run |

Resume na fix: `/gsd:execute-phase 16` — leest STATE.md, herstart vanaf laatst geslaagde plan.

## Post-phase

Na success: open `docs/audits/2026-05-18-v2/00-executive-summary.md` in editor. Lees, beslis op Phase 17 scope (uitvoering van fix-plan). Daarna:

```
/gsd:add-phase "Design + SEO/GEO fixes round 2 - executes fix-plan from Phase 16"
/gsd:plan-phase 17 --prd docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md
/gsd:execute-phase 17
```

## Niet-doen tijdens autonomous run

- **Niet `Ctrl+C`** in een ander terminal venster — kan dev-server killen die phase 16 gebruikt
- **Niet `git checkout main`** — verbreekt branch-context van executor
- **Niet `taskkill node`** — globaal verboden (`fmai-nextjs/CLAUDE.md` regel: NEVER taskkill)
- **Niet `npm install`** in een andere terminal — package-lock corruption risk

## Tijd-window aanbeveling

Plan deze run tijdens een blok waar je 6+ uur niet aan het project hoeft te zijn. Tijdens nachten of weekend optimaal. De Playwright multi-engine runs zijn CPU-zwaar — sluit andere zware processen.

## Cost expectation

- **Gemini 2.5 Flash met Google grounding**: €0 (gratis tier 250 RPD dekt geschatte 100 calls). Bij overschrijding RPD: wait-and-retry of switch naar `--model pro` (betaald, separate quota).
- Firecrawl: bestaand abonnement, geen extra kosten
- Vercel Speed Insights / PageSpeed Insights API: gratis
- **Soft cap: €5 EUR** (gedefinieerd in budget). Spend > €5 duidt op verkeerd model (pro ipv flash) of misconfiguratie — executor pauzeert.
