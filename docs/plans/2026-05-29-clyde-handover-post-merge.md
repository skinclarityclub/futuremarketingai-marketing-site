# Clyde — Handover (post-merge, start hier voor de volgende sessie)

> Status 2026-05-29: de hele Clyde SOTA-audit + vervolg staat **gemerged op `main`** (PR #12, merge-commit `a5fb5c0`). Geen open branch nodig. Deze sessie kan vanaf een schone `main` verder met polish/features op Clyde.
>
> Dit is de schone "start hier". Historie/details staan in `2026-05-29-clyde-next-session-handover.md` (session-2/3 log) en `2026-05-29-clyde-sota-audit-findings.md` (volledig bevindingenrapport).

## 0. TL;DR — wat is Clyde nu

Clyde = de floating AI-chat op élke pagina (de "Open chat met Clyde"-FAB → lazy-loaded chatpaneel). Praat NL/EN/ES (volgt de site-locale). Tool-calls renderen kaarten in een sidebar (skills, pricing, ROI, case study, booking). Er is ook een **guided demo** (knop in de welkomststaat) met 2 agency-scenario's, en een **embedded** variant op `/skills/lead-qualifier`.

De audit-klacht "de sidebar klopt niet" is volledig opgelost: cards + sidebar-chrome zijn nu locale-aware (nl/en/es), off-context SkinClarity-tools (skincare/support/Marketing-Machine) zijn weg, en de cookie-banner blokkeert de FAB niet meer op desktop.

## 1. Setup (eerst doen)

```powershell
cd C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs
# ANTHROPIC_API_KEY zit ALLEEN in Vercel production. Project is gelinkt (futuremarketingai).
vercel env pull .env.local --environment=production --scope daleys-projects-5f2c57e7
# Port 3000 = fma-app. Draai Clyde op 3100:
npx next dev -p 3100
```

- `.env.local` is de production-pull (bevat de key + VERCEL-vars, harmless voor dev). Origineel dev-`.env.local` staat in `.env.local.audit-bak`.
- **Rate limits** (Upstash, gedeeld met productie): IP `unknown` 10/min, global 100/uur. Wees economisch met live berichten; draai Playwright met `--workers=1`.
- **De-facto integratietest = `npm run build`** (NIET `npm run lint`: dat lint ook de `.next-3001` dev-output en is daardoor nooit schoon). `npx tsc --noEmit` is clean op één pre-existing fout: `audit-v2-lighthouse.spec.ts:90` (Playwright API-drift, niet chatbot).

## 2. Architectuur (kaart)

**Render-flow:** `FloatingChatTrigger` toont de `ClydePresence`-FAB (`button[aria-label^="Open chat"]`) → klik lazy-load't `ChatWidgetIsland` → `ChatWidget` → `ChatHeader` + `ChatMessages` + `SidePanel` + `ChatInput`. Paneel = `[data-chatwidget-panel]`. Desktop: `SidePanel` INLINE links in het paneel. Mobile: portal naar `document.body` als overlay. `ChatWidgetIsland` zet per-pagina welcome + suggested prompts (deze zijn NL-tone op alle locales, by design).

**Engine:** `src/lib/chatbot/engine.ts` (`handleChatRequest`). Vereist `process.env.ANTHROPIC_API_KEY`. `@ai-sdk/anthropic` + `streamText`, `stopWhen: stepCountIs(3)` (demo: 2 + `toolChoice:'required'`). Locale komt uit `context.language` (gezet door `usePersonaChat` via `useLocale()`) → `normalizeChatbotLocale`.

**Tools (locale-aware factory):** `buildFlagshipTools(locale)` in `tools/flagship-tools.ts` componeert concierge + leadgen + statics (ecommerce/support). Reële agency-tools: `get_skills`, `get_case_study`, `qualify_lead`, `get_pricing_info`, `get_roi_estimate`, `book_call`, `navigate_to_page`.
- **GOTCHA:** `createPersonaTools()` (`tool-executor.ts`) negeert de `persona.tools{}`-whitelist in `clyde.ts` volledig en geeft hard `buildFlagshipTools(locale)` terug. Tool-wijzigingen voor de live chat dus via `flagship-tools.ts` of de engine-filter, NIET via `clyde.ts`.
- **Off-context strip (engine):** ecommerce + support tools (`search_products`, `create_ticket`, `check_status`, `escalate_to_human`, `build_routine`, etc.) worden in BEIDE modi (normaal + demo) gestript. Ze bestaan nog in de toolset maar zijn nooit bereikbaar in de live chat. De Marketing-Machine-tools (`explain_module`, `get_roi_info`) zijn volledig verwijderd.

**Cards:** `src/components/chatbot/tool-results/` — `ServiceCard` (skills + pricing, met coming-soon-badge), `LeadScoreCard` (ROI + qualify), `CaseStudyCard`, `BookingCard`, `ProductCard`/`KBArticleCard`/`TicketCard` (e-commerce/support — nu onbereikbaar). Mapping in `tool-results/index.tsx` (`TOOL_CARD_MAP`, `SIDE_PANEL_TOOLS`, `shouldUseSidePanel`).

**i18n-lagen (3):**
1. **Card-DATA** locale-gekeyd in de tools: pricing = `tool-data.ts` (`getChatbotTiers(locale)`), skills = `skill-i18n.ts` (`getChatbotSkills(locale)`, en/es overlay, NL uit `skills-data.ts`), case study = `concierge-tools.ts` (`CASE_STUDY_SKC[locale]`), qualify/ROI = `leadgen-tools.ts`.
2. **Card-CHROME + getalformaat** = `tool-results/cardI18n.ts` (`useCardCopy()`): headers, CTA's, badge-labels ("Binnenkort/Coming soon/Próximamente"), geld/payback-format.
3. **Widget-CHROME** = `useChatChrome.ts` (`useChatChrome()`): sidebar panel-titels, follow-up chips (die ook als bericht verstuurd worden!), "Bekijk details"/"Vraag verder"/kopieer/bewerk/regen + aria, "Nu online", loading/error-card, input-hint.

**Demo:** `components/chatbot/demo/` — `DemoOrchestrator` (gescript), `scenarios.ts` (`getDemoScenarios(locale)`, 2 agency-scenario's: "De nieuwe klant" 6 stappen, "Portfolio opschalen" 4 stappen), `DemoScenarioCard`/`DemoCheckpoint`/`DemoCompletionCard`/`DemoProgress`. Entry: de "rondleiding"-knop in `ChatMessages` welkomststaat. Demo bereikbaar vanuit de hoofd-FAB op élke pagina + embedded op `/skills/lead-qualifier` (`DemoPlayground`, 4 tabs).

**Persona + KB:** `personas/clyde.ts` (STATIC_PREFIX: NL-respect, em-dash-verbod, no-relist, CHIPS-format; `maxTokens: 700`, `defaultModel: 'haiku'`, complexe queries → `claude-sonnet-4-6` via `complexity-detector.ts`). KB = `knowledge/flagship-kb.ts` = concierge + ecommerce (agency-onboarding, géén skincare meer) + leadgen + support (pricing/ROI/founding). Marketing-Machine KB (`demo-guide-kb.ts`) is verwijderd. Em-dashes worden nog hard-gestript in de render-laag (`normalizeDashes` in `ChatMessages.tsx`).

## 3. Wat is af (deze audit, niet opnieuw doen)

Alles live op `main`. Zie `2026-05-29-clyde-sota-audit-findings.md` §1/§1b/§1c voor detail.
- **Sidebar + cards locale-aware** (nl/en/es): skills (incl. coming-soon-badge), pricing, case study, qualify/ROI, plus alle widget-chrome via `useChatChrome`. Live geverifieerd: /en "Our skills" + chips 3/3, /es idem.
- **Off-context weg:** skincare/support tools gestript in beide modi; Marketing Machine volledig verwijderd (tools + KB). Guided demo herschreven naar NL/agency met alleen echte tools.
- **Cookie-banner-FAB:** FAB lift `lg:bottom-44` + `z-[10000]` zodat een first-time bezoeker Clyde kan openen (desktop/tablet/mobile geverifieerd).
- **Em-dashes:** harde render-strip.
- **Tests:** `clyde-audit.spec.ts` (regressie + live), `guided-demo.spec.ts` (/nl, 17), `cookie-fab.spec.ts` (3 viewports), `clyde-capture.spec.ts` (capture-harness), `demo-full-flow.spec.ts` (live, gated). Chromium groen, firefox 20/20, webkit groen-op-retry.

## 4. Open / volgende ideeën (gerangschikt, geen blockers)

1. **Live cross-dim capture-sweep firefox/webkit** (nu structureel cross-browser + chromium live gedekt). Gebruik de capture-harness, rate-limit-economisch.
2. **Welcome/suggested-prompts/nudges localisatie:** `ChatWidgetIsland.tsx` `WELCOME_MESSAGES` + `SUGGESTED_PROMPTS` + `PROACTIVE_*` zijn NL-tone op álle locales (by design "Clyde = NL-collega"). Als en/es bezoekers een Engelse/Spaanse begroeting moeten krijgen → localiseren (next-intl messages of locale-maps zoals `useChatChrome`).
3. **complexity-detector kostenmonitoring:** complexe queries gaan nu echt naar `claude-sonnet-4-6` (duurder/trager). Monitor of dat de juiste trade-off blijft.
4. **auto-greet in Playwright:** vuurde niet betrouwbaar in tests (eerste bubble was de user-vraag). Verifieer in echte browser; mogelijk effect-dep-instabiliteit (`setMessages`-identiteit) in `ChatWidget`.
5. **Nieuwe features** (vrije ruimte): bv. meer guided-demo-scenario's, rijkere cards, conversational memory-hints, betere fit-assessment.

## 5. Gotchas / red flags

- `createPersonaTools` negeert `persona.tools{}` (zie §2). Tools wijzigen via `flagship-tools.ts`/engine.
- Follow-up chips (`useChatChrome.followups`) worden als bericht verstuurd → moeten in de bezoekerstaal staan, anders flipt Clyde van taal.
- Tests draaien op **/nl** (clyde-audit, guided-demo) en leunen op exacte NL-aria's: `"Sluit chat"`, `"Opnieuw genereren"`, SidePanel `"Close details panel"`. Houd die NL-waarden in `useChatChrome` byte-identiek bij wijzigingen.
- Demo-mode gebruikt `toolChoice:'required'` → het model MOET een tool kiezen; alleen echte agency-tools zijn beschikbaar (rest gestript).
- Pre-existing (niet aanraken tenzij gericht): React-Compiler lint-errors in `ChatWidget` (`hasGreeted` immutability) + `ChatInput` (setState-in-effect). Bevestigd op HEAD, breken de build niet.
- **Pricing SSoT** blijft `fma-app/src/lib/skills.ts`; site-mirror `skills-data.ts` + `tool-data.ts`. Bij prijswijziging: eerst fma-app, dan site.

## 6. Testen

```powershell
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"   # ANDERS draait tegen :3000 = fma-app!
$env:RUN_CLYDE_LIVE = "1"
# Regressie (chrome + live), met retry voor de bekende flaky T9 (haiku tool-keuze):
npx playwright test tests/e2e/clyde-audit.spec.ts tests/e2e/chatbot.spec.ts tests/e2e/guided-demo.spec.ts tests/e2e/cookie-fab.spec.ts --project=chromium --workers=1 --retries=1

# Capture-harness (screenshots + tekst-dumps), env-gedreven:
$env:CLYDE_LOCALE = "nl"      # of en / es
$env:CLYDE_VP = "1440x900"    # of 768x1024 / 390x844
$env:CLYDE_ONLY = "T1-skills,T2-pricing,T3-roi,T4-case,T5-booking,T6-fit"
$env:CLYDE_DIR = ".audit-screens/run1"
npx playwright test tests/e2e/clyde-capture.spec.ts --project=chromium --workers=1
```

Snelle locale-check zonder browser (directe API tegen de dev-server):
```powershell
$body = @{ personaId='clyde'; sessionId='check'; message='What skills do you offer?'; context=@{ language='en' } } | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3100/api/chatbot' -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing | Select-Object -ExpandProperty Content
```

## 7. Pointers

- Bevindingenrapport (volledig): `docs/plans/2026-05-29-clyde-sota-audit-findings.md`
- Session-2/3 log: `docs/plans/2026-05-29-clyde-next-session-handover.md`
- Memory: `project_clyde_sota_audit.md` (project-memory) — bevat de volledige commit-lijst + RESTEERT
- Capture-bewijs: `fmai-nextjs/.audit-screens/`
- Merge: PR #12 → `main` commit `a5fb5c0`. Branch `feature/clyde-sota-audit` niet verwijderd.
