# Clyde — Handover voor volgende sessie ("we gaan door met Clyde")

> Status na 2026-05-29: SOTA-audit uitgevoerd, criticals + i18n + overige fixes gedaan, bewezen (22/22 regressie groen), gecommit. **PR #12** open op `main`. Deze sessie kan direct verder met polish/features op Clyde.

> **Sessie 3 update (2026-05-29 vervolg):** §4.1+4.2 (i18n/data + coming-soon badge), §4.5 (demo cleanup) en §4.4 (live sweep) opgepakt + bewezen. 3 extra commits op de branch (`048b32b` WS1, `dc40736` WS3, `1d693c2` WS2), nog NIET gepusht. Kort:
> - **WS1**: nieuw `src/lib/chatbot/skill-i18n.ts` → `get_skills` nl/en/es; coming-soon-badge rendert in `ServiceCard`; ROI-labels via `cardI18n`. Live geverifieerd 3 locales.
> - **WS3**: guided demo (bereikbaar vanuit hoofd-FAB op élke pagina) herschreven NL/agency — skincare+support scenario's weg, 2 agency-scenario's met alleen echte tools; demo-chrome locale-aware; off-context tools in BEIDE modi gestript; Marketing Machine volledig weg (tools `explain_module`/`get_roi_info` + KB `DEMO_GUIDE_TOPICS` + 6-skill ecommerce-topic; `demo-guide-tools.ts`/`demo-guide-kb.ts` verwijderd). `guided-demo.spec.ts` herschreven naar /nl (17/17 groen).
> - **WS2**: live sweep nl/en/es (desktop+mobile, chromium) → badge ✓, data ✓; **bevinding+fix**: chat-CHROME hardcoded NL op en/es (sidebar-titel "Onze vaardigheden" boven Engelse kaart; chips NL én als bericht verstuurd). Nieuw centraal `useChatChrome()` (nl/en/es) — sidebar-titels, chips, knop-/aria-labels, "Nu online", loading/error, input-hint. Live bewezen /en "Our skills" + chips 3/3, /es "Nuestras habilidades" + chips 3/3.
>
> - **Cookie-banner-FAB UX (GEFIXT, `aa84b3f`)**: bevestigd dat de banner (z-9999, ~154px) de FAB-klik op desktop onderschepte; `ClydePresence` lift naar `lg:bottom-44` + `z-[10000]`. Regressie `tests/e2e/cookie-fab.spec.ts` (3 viewports). Eerste-keer-bezoekers kunnen Clyde nu openen.
>
> **GEPUSHT** naar PR #12 (5 commits). build groen, tsc clean (m.u.v. pre-existing lighthouse-spec). **Open nu:** em-dashes in model-output; firefox/webkit live sweep (chromium gedaan); PR #12 mergen.

## 0. TL;DR

- Branch `feature/clyde-sota-audit`, **PR #12**: https://github.com/skinclarityclub/futuremarketingai-marketing-site/pull/12 (nog niet gemerged).
- Bevindingenrapport: `docs/plans/2026-05-29-clyde-sota-audit-findings.md` (sectie 1b = wat al gefixt is).
- De user-klacht "sidebar klopt niet" is opgelost: Engelse cards op /nl + off-context tools (nep tickets / skincare) zijn weg; cards zijn nu locale-aware (nl/en/es).
- Live chatbot werkt lokaal op `:3100` met de production Anthropic-key.

## 1. Setup (eerst doen)

```powershell
cd C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs
# ANTHROPIC_API_KEY zit ALLEEN in Vercel production. Project is al gelinkt (futuremarketingai).
vercel env pull .env.local --environment=production --scope daleys-projects-5f2c57e7
# Port 3000 = fma-app. Draai Clyde op 3100:
npx next dev -p 3100
```

- Origineel dev-`.env.local` staat in `.env.local.audit-bak` (de huidige `.env.local` is de production-pull: bevat de key + wat VERCEL-operationele vars; harmless voor dev).
- **Rate limits** (Upstash, gedeeld met productie): IP `unknown` 10/min, global 100/uur. Wees economisch met live berichten; draai Playwright met `--workers=1`.

## 2. Architectuur (kaart)

**Flow:** `FloatingChatTrigger` rendert de `ClydePresence`-FAB (`button[aria-label^="Open chat"]`) → klik lazy-load `ChatWidgetIsland` → `ChatWidget` → `ChatMessages` + `SidePanel` + `ChatInput`. Panel = `[data-chatwidget-panel]`. Desktop: `SidePanel` is INLINE binnen het panel (links). Mobile: portal naar `document.body` als overlay.

**Engine:** `src/lib/chatbot/engine.ts` (`handleChatRequest`). Vereist `process.env.ANTHROPIC_API_KEY`. `@ai-sdk/anthropic` + `streamText`, `stopWhen: stepCountIs(3)`. Locale komt uit `context.language` (gezet door `usePersonaChat` via `useLocale()`).

**Tools (locale-aware factory):** `buildFlagshipTools(locale)` in `tools/flagship-tools.ts` componeert `buildConciergeTools(locale)` + `buildLeadgenTools(locale)` + statics (ecommerce/support/demo-guide).
- **GOTCHA:** `createPersonaTools()` (`tool-executor.ts`) negeert de `persona.tools{}`-whitelist in `clyde.ts` volledig en geeft `buildFlagshipTools(locale)` terug. Tool-wijzigingen voor de live chat dus via `flagship-tools.ts` of de engine, NIET via `clyde.ts`.
- De engine strip't off-context tools (search_products, create_ticket, explain_module, get_roi_info, etc.) in NORMALE modus; de guided demo behoudt ze.

**Cards:** `src/components/chatbot/tool-results/` — `ServiceCard` (skills + pricing), `LeadScoreCard` (ROI + qualify), `CaseStudyCard`, `BookingCard`, `ProductCard`/`KBArticleCard`/`TicketCard` (e-commerce/support, alleen in demo). `cardI18n.ts` = chrome-labels (nl/en/es) + locale geld/payback-format. Mapping in `tool-results/index.tsx` (`TOOL_CARD_MAP`, `TOOL_PANEL_TITLES`, `TOOL_FOLLOWUPS`, `SIDE_PANEL_TOOLS`).

**Card-DATA bronnen:** pricing = `tool-data.ts` (`getChatbotTiers(locale)`), case study = `concierge-tools.ts` (`CASE_STUDY_SKC[locale]`), qualify/ROI = `leadgen-tools.ts`, skills = `skills-data.ts` (nog NL).

**Persona:** `src/lib/chatbot/personas/clyde.ts` — STATIC_PREFIX (NL-respect, em-dash-verbod, no-relist), `maxTokens: 700`, `defaultModel: 'haiku'`, complexity → `claude-sonnet-4-6` (`complexity-detector.ts`).

**Cookie-banner blocker:** `CookieConsentBanner` (`z-[9999]`, `fixed bottom-0`) overlapt de FAB (`z-40`, `lg:bottom-24`) op desktop. Tests pre-seeden `localStorage.cookieConsent` zodat de banner niet rendert. **Echte UX-bug: een first-time bezoeker moet de cookie-banner eerst wegklikken voordat de FAB klikbaar is. Overweeg de FAB hoger te liften of de banner-z te verlagen.**

## 3. Wat af is (deze audit)

Zie PR #12 + rapport §1 en §1b. Kort: BUG-1 (sidebar-titel), copy-CHIPS, off-context tools weg, qualify-titel, persona-hardening, maxTokens, locale-threading + nl/en/es card-data (pricing/case/qualify), card chrome i18n, ROI-format/maand/em-dash, accent-human token, ProgressiveCTA NL+/apply, loading/error NL, echte Sonnet-escalatie. Regressie: `tests/e2e/clyde-audit.spec.ts`.

## 4. Open / volgende stappen (gerangschikt)

1. **en/es DATA-completeness:** `get_skills` skill-beschrijvingen zijn NL op en/es (`skills-data.ts`). Maak locale-aware of accepteer. Idem een paar ROI metric-labels in `LeadScoreCard` (autoMetrics-tak) staan nog hardcoded NL.
2. **Live/coming-soon badge** op de skills-card: `get_skills` retourneert nu `status` per service, maar `ServiceCard` `normalizedServices` rendert het niet. Voeg een "Binnenkort"-badge toe (`t.comingSoon` bestaat al in `cardI18n`).
3. **auto-greet vuurt niet** in Playwright-runs (eerste bubble is altijd de user-vraag). Verifieer in een echte browser; mogelijk reset de 400ms-timer door instabiele effect-deps (`setMessages`-identiteit) in `ChatWidget`.
4. **Live cross-dimensie sweep:** en/es + tablet (768) / mobile (390x844) + firefox/webkit. Gebruik de capture-harness (zie §5). Rate-limit-economisch.
5. **Guided demo cleanup:** demo-mode behoudt nog de Engelse "Marketing Machine" (`explain_module`) + skincare-scenario's. Als de demo (lead-qualifier `DemoPlayground`) gebruikt wordt, heeft die eigen NL/agency-cleanup nodig.
6. **em-dashes** in model-output: prompt-regel dempt, geen harde garantie. Overweeg normalisatie in `MarkdownContent` als het een harde eis is.
7. **Restjes:** `TicketCard` token (`accent-secondary` nog niet gefixt; removed-tool card), Calendly-restant in dode `demo-guide-tools` `book_demo`, twee concurrerende 'pricing' KB-topics (concierge-kb + support-kb).

## 5. Testen

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"
$env:RUN_CLYDE_LIVE = "1"
# Regressie (chrome + live):
npx playwright test tests/e2e/clyde-audit.spec.ts tests/e2e/chatbot.spec.ts --project=chromium --workers=1

# Capture-harness (screenshots + tekst-dumps) — env-gedreven:
$env:CLYDE_LOCALE = "nl"      # of en / es
$env:CLYDE_VP = "1440x900"    # of 768x1024 / 390x844
$env:CLYDE_ONLY = "T1-skills,T2-pricing,T3-roi,T4-case,T5-booking,T6-fit"  # subset, leeg = alles
$env:CLYDE_DIR = ".audit-screens/run1"
npx playwright test tests/e2e/clyde-capture.spec.ts --project=chromium --workers=1
# Lees daarna de .json (panelText + sidebarTitle) en .png dumps in $env:CLYDE_DIR.
```

Snelle locale-check zonder browser (directe API):
```powershell
$body = @{ personaId='clyde'; sessionId='check'; message='Wat kost het voor 4 merken?'; context=@{ language='nl' } } | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3100/api/chatbot' -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing | Select-Object -ExpandProperty Content
```

tsc: `npx tsc --noEmit` (negeer de pre-existing `audit-v2-lighthouse.spec.ts:90` error, niet chatbot-gerelateerd).

## 6. Pointers

- Rapport: `docs/plans/2026-05-29-clyde-sota-audit-findings.md`
- Oorspronkelijk audit-plan: `docs/plans/2026-05-29-clyde-sota-audit-handover.md`
- Memory: `project_clyde_sota_audit.md` (in de project-memory)
- Capture-bewijs: `fmai-nextjs/.audit-screens/`
