# Clyde — Handover (PR #13 open, start hier voor de volgende sessie)

> Status 2026-05-29 (sessie 4): alle werk staat op branch **`feature/clyde-i18n-greet-observability`**, **15 commits** boven `main`, en is geopend als **PR #13** (NIET gemerged).
>
> PR: https://github.com/skinclarityclub/futuremarketingai-marketing-site/pull/13
>
> Eerste keuze volgende sessie: **PR #13 reviewen/mergen**, of doorbouwen op de branch (Memory Panel v2). Voorganger-handover: `2026-05-29-clyde-handover-post-merge.md`.

## 0. TL;DR — wat is deze sessie gebeurd

Vier werkstromen uit "pak alles op", plus één nieuwe feature, allemaal op één branch in PR #13:

1. **en/es localisatie** van Clyde's welcome, suggested prompts en proactive nudges (`ChatWidgetIsland`). /en en /es krijgen nu begroeting + prompts + nudges in hun eigen taal. NL byte-identiek gehouden (e2e draait op /nl). ES gebruikt "AI" niet "IA"; CTA's matchen `useChatChrome`. Vastgelegd met een no-API render-test.
2. **Model-routing observability**: `explainComplexity()` geeft `{level, trigger, matched}`; de engine logt per request één `[clyde-model]` JSON-regel (model, escalated, trigger, matched, msgLen, depth, locale, demo). **Geen berichttekst gelogd** (privacy). Grep Vercel-logs op `[clyde-model]` om het sonnet-aandeel te meten.
3. **Auto-greet StrictMode fix**: `hasGreeted.current = true` flipt nu ín de 400ms-timer i.p.v. ervoor, zodat React StrictMode's dev mount→cleanup→remount (of dep-churn) de greet herplant i.p.v. dropt. Dit was de root cause van "eerste bubble = de user-vraag".
4. **Cross-browser sweep**: firefox + webkit live capture (4 core scenario's elk: skills/roi/case/booking), sidebar + titels + chips correct, visueel bevestigd. Bewijs in `.audit-screens/xbrowser-firefox|webkit/` (untracked).
5. **Clyde Live Memory Panel (v1, binnen-sessie)** — de grote nieuwe feature. Zie §2.

Hiermee zijn de open punten 1-4 uit de post-merge-handover grotendeels afgehandeld (localisatie ✓, complexity-monitoring ✓ via logging, auto-greet ✓, cross-browser deels ✓).

## 1. Setup (eerst doen)

```powershell
cd C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs
# ANTHROPIC_API_KEY zit al in .env.local (production-pull). Vercel CLI is NIET geinstalleerd.
# Dev-server draaide deze sessie al op poort 3100 (PID niet killen). Anders:
npx next dev -p 3100
```

- **Rate limits** (Upstash, gedeeld met productie): IP `unknown` 10/min, global 100/uur. Live tests economisch + `--workers=1`.
- **De-facto integratietest = `npm run build`** (NIET `npm run lint`: lint de stale `.next-3001` dev-output, ~1296 false errors). `npx tsc --noEmit` is clean op één pre-existing fout: `audit-v2-lighthouse.spec.ts:90` (Playwright API-drift, niet chatbot).
- **Let op**: `prebuild: "npm run lint || true"` is niet cross-shell — `|| true` faalt op Windows cmd.exe (de review zag daardoor build exit 1). Vanuit de Bash-tool/bash werkt `npm run build` wél (exit 0, 3× bevestigd deze sessie). Optionele opschoning: `prebuild: "next lint || exit 0"`.

## 2. Clyde Live Memory Panel — architectuur (voor doorbouwen)

Doel: de "één brein, gedeeld geheugen"-USP tastbaar maken. Terwijl een bureau-prospect chat, vangt Clyde feiten in een zichtbaar, accumulerend "Wat Clyde over je onthoudt"-paneel in de sidebar en verwijst er later naar. **v1 = binnen-sessie, geen persistentie.**

**Data-flow (capture → accumulate → display → recall):**
- **Capture**: tool `remember_context` in `src/lib/chatbot/tools/flagship-tools.ts` (6 optionele velden: agencyName, niche, brandCount, teamSize, painPoint, goal; `execute` echo't input). Geregistreerd in `buildFlagshipTools`. **Gestript in demo-mode** (engine.ts `DEMO_STRIP` set, naast `navigate_to_page`) zodat `toolChoice:'required'` geen gescripte stap kaapt. Staat NIET in de off-context strip (werkt dus in normale chat).
- **Accumulate**: pure `mergeMemory(prev, next)` + `MemoryProfile` type in `src/lib/chatbot/memory.ts` (last-write-wins, negeert undefined/null/blank, immutable). In `ChatMessages.tsx` leidt een `useMemo` het volledige profiel af uit álle `remember_context`-resultaten in `messages`; een **ref-guarded** effect (`lastAppliedMemory`) pusht alleen naar de store bij echte content-wijziging (geen churn per streaming-token).
- **Store**: `chatbotStore.memoryProfile` + `setMemoryProfile`/`resetMemory`. **Bewust NIET in `partialize`** → in-memory, reset bij reload. `handleNewChat` roept `resetMemory()`.
- **Display**: `src/components/chatbot/tool-results/MemoryCard.tsx` leest `memoryProfile` uit de store (niet de per-call data) en rendert het geaccumuleerde profiel met nl/en/es veld-labels + lege-staat-hint. Gemapt op `remember_context` in `TOOL_CARD_MAP` + `SIDE_PANEL_TOOLS` (index.tsx). Paneel-titel in `useChatChrome` (nl "Wat Clyde onthoudt" / en "What Clyde remembers" / es "Lo que Clyde recuerda").
- **Recall**: feiten staan in de gesprekshistorie → model haalt ze terug. Persona-nudge in `clyde.ts` (TOOL ROUTING-regel) zegt: capture concrete bureau-feiten en verwijs terug.
- **KRITIEKE review-fix**: in `lastSidePanelTool` (ChatMessages) krijgt een conversie-card (pricing/qualify/case/booking) **voorrang** boven de memory-card als beide in één beurt vuren — memory neemt het paneel alleen als enige side-panel tool. Anders zou capture de sidebar + conversie-chips stelen op precies de high-intent beurten.

Design + plan: `docs/plans/2026-05-29-clyde-memory-panel-design.md` (status: implemented) en `2026-05-29-clyde-memory-panel.md` (8 TDD-taken).

## 3. Wat is af (deze sessie, niet opnieuw doen)

Alles in PR #13. Commit-range `main..HEAD` (15):
- `3cb107f` auto-greet StrictMode fix · `484a75b` model-routing log · `9fb077b` en/es localisatie · `a6fba54` i18n-render test
- `939b0bd` design · `b2d1563` plan · `7c15207`..`199f462` memory-feature T1-T7 · `e87217a` design-status · `7abc58e` review-fixes

Gates: tsc schoon, `npm run build` exit 0, no-API e2e (i18n-render 3 + memory-merge 4) groen, gated live e2e (capture+recall) groen, firefox+webkit sweep schoon, 2 onafhankelijke review-workflows verdict *ship*.

## 4. Open / volgende ideeën (geen blockers)

1. **Eén handmatige check** (de enige open checkbox in PR #13): in een browser Clyde openen op `/en` + `/es` → gelokaliseerde begroeting bevestigen; een bureau beschrijven → memory-paneel zien vullen + Clyde zien terugverwijzen. (De live-test dekt capture+recall, niet de visuele paneel-render.)
2. **Memory Panel v2** (uit design-doc "out of scope"): cross-sessie persistentie (localStorage + consent-regel + wis-knop), system-prompt-injectie van het profiel voor proactieve recall, een dedicated persistent memory-badge/toggle i.p.v. last-tool-wins sidebar, aparte extractie-pass voor deterministische capture.
3. **Volledige cross-locale sweep** (en/es × firefox/webkit) als je meer capture-bewijs wil; deze sessie was nl-core.
4. **Welcome/nudges**: nu gelocaliseerd. Overige NL-tone strings (FAB aria-label "Open chat met Clyde", ClydePresence whisper) bewust NL gelaten — e2e leunt erop. Niet wijzigen zonder de selectors mee te updaten.
5. **Maintenance**: `/dream` staat geflagd (MEMORY.md te lang ~68 regels, 28 dagen geen dream). Los van Clyde-werk.

## 5. Gotchas / red flags (carry-forward)

- `createPersonaTools` negeert `persona.tools{}` (clyde.ts) en geeft hard `buildFlagshipTools(locale)` → tool-wijzigingen via `flagship-tools.ts` of de engine-filter, NIET via clyde.ts.
- `remember_context` is een SIDE_PANEL-tool maar wijkt voor conversie-cards in `lastSidePanelTool` (zie §2). Houd die voorrang intact bij wijzigingen.
- Tests draaien op **/nl** en leunen op exacte NL-aria's (`Sluit chat`, `Opnieuw genereren`, SidePanel `Close details panel`) en panel-titels. Byte-identiek houden.
- Em-dashes verboden in user-facing copy (NL feedback-regel). Render-laag stript ze nog hard (`normalizeDashes` in ChatMessages).
- Pricing SSoT blijft `fma-app/src/lib/skills.ts`; site-mirror `skills-data.ts` + `tool-data.ts`.
- Dev-server 3100 niet killen (global rule: nooit taskkill). `.env.local` = production-pull met de key.

## 6. Testen

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"   # ANDERS draait tegen :3000 = fma-app!

# No-API (snel, geen rate-limit): localisatie-render + mergeMemory-unit
npx playwright test tests/e2e/clyde-i18n-render.spec.ts tests/e2e/memory-merge.spec.ts --project=chromium --workers=1

# Gated live (2 API-calls): memory capture + recall
$env:RUN_CLYDE_LIVE = "1"
npx playwright test tests/e2e/clyde-memory.spec.ts --project=chromium --workers=1 --retries=1

# Cross-browser capture-sweep (live, economisch)
$env:CLYDE_LOCALE="nl"; $env:CLYDE_VP="1440x900"; $env:CLYDE_ONLY="T1-skills,T3-roi,T4-case,T5-booking"
$env:CLYDE_DIR=".audit-screens/xbrowser-firefox"
npx playwright test tests/e2e/clyde-capture.spec.ts --project=firefox --workers=1
```

Regressie (chrome + live), met retry voor de bekende flaky haiku tool-keuze:
```powershell
npx playwright test tests/e2e/clyde-audit.spec.ts tests/e2e/chatbot.spec.ts tests/e2e/guided-demo.spec.ts tests/e2e/cookie-fab.spec.ts --project=chromium --workers=1 --retries=1
```

## 7. Pointers

- PR: https://github.com/skinclarityclub/futuremarketingai-marketing-site/pull/13
- Memory design: `docs/plans/2026-05-29-clyde-memory-panel-design.md` (implemented)
- Memory plan (8 TDD-taken): `docs/plans/2026-05-29-clyde-memory-panel.md`
- Voorganger-handover: `docs/plans/2026-05-29-clyde-handover-post-merge.md`
- Bevindingenrapport audit: `docs/plans/2026-05-29-clyde-sota-audit-findings.md`
- Nieuwe files deze sessie: `src/lib/chatbot/memory.ts`, `src/components/chatbot/tool-results/MemoryCard.tsx`, `tests/e2e/{clyde-i18n-render,memory-merge,clyde-memory}.spec.ts`
