# Clyde Memory Panel v2 — Handover (start hier in de nieuwe sessie)

> Status 2026-05-30: design + implementatieplan **af en gecommit**, code-implementatie **nog niet begonnen**. Twee branches in beeld (zie hieronder). Vorige handover: `2026-05-29-clyde-handover-pr13.md` (PR #13 inmiddels gemerged op main).

## 0. TL;DR — waar staan we

Deze sessie zijn er twee dingen gebeurd, op twee gestackte branches:

1. **`fix/clyde-nav-ux`** (commit `13918ab`) — KLAAR, build groen, volledig live geverifieerd, **nog niet gepusht/PR'd**. Chatbot navigatie-UX:
   - Nieuwe `ApplyCtaButton` (on-brand amber, donkere tekst, sluit de chat) vervangt de off-brand teal->amber gradient in 8 CTA's (BookingCard, CaseStudyCard, LeadScoreCard x2, ServiceCard x2, ProgressiveCTA x2).
   - `ChatWidgetIsland`: chat + side-panel sluiten bij **elke** route-change; kwam je uit een open chat, dan volgt ~6s later 1x een per-pagina proactieve nudge (ook na een gesprek; max 1x/pagina).
   - `NavigationButton`: bugfix — gebruikt nu de locale-bewuste next-intl router (de `navigate_to_page`-knop ging naar een locale-loze URL en gaf "Missing <html>/<body>" runtime error op localePrefix:always).

2. **`feature/clyde-memory-v2`** (gestackt op nav-ux) — bevat alleen docs:
   - `f28e215` design: `docs/plans/2026-05-30-clyde-memory-panel-v2-design.md` (approved)
   - `b2bd943` plan: `docs/plans/2026-05-30-clyde-memory-panel-v2.md` (8 TDD-taken)
   - **Geen implementatie-code. T1-T8 staan allemaal open.**

```
feature/clyde-memory-v2   b2bd943 plan, f28e215 design     ← HEAD, hier hervatten
  └─ fix/clyde-nav-ux     13918ab nav-ux (klaar om te PR'en)
       └─ main            4b19ce2 (PR #13 gemerged)
```

## 1. Resume (eerst doen)

```powershell
cd C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs
git checkout feature/clyde-memory-v2
git log --oneline -4        # verwacht b2bd943, f28e215, 13918ab, 4b19ce2
# Dev-server: npx next dev -p 3100  (ANTHROPIC_API_KEY zit in .env.local). NOOIT killen.
```

Lees dan het plan en voer het uit via de **executing-plans** skill, batch van 3 taken, beginnend bij T1:
`docs/plans/2026-05-30-clyde-memory-panel-v2.md`

Elke taak is TDD: failing test -> minimale code -> test groen -> `npm run build` (via Bash, niet cmd.exe) -> commit.

## 2. Wat v2 bouwt (uit het plan, 8 taken)

1. **T1** `src/lib/chatbot/memory-persistence.ts` (+ unit) — consent-gated localStorage (`clyde:memory`, versioned, try/catch). `serialize/parse/load/save/clear/hasMemoryConsent`.
2. **T2** `ChatWidgetIsland` — hydrate profiel op mount, persist bij wijziging.
3. **T3** `ChatWidget.tsx:116-124` — `handleNewChat` haalt `resetMemory()` weg (nieuwe chat behoudt geheugen).
4. **T4** `prompt-builder.ts` `buildMemoryContextLine` + injecteren in `buildSystemMessages`; client stuurt `memoryProfile` mee in `context` (+ unit).
5. **T5** `welcome-back.ts` (nl/en/es) + in `ChatWidgetIsland` als `welcomeMessage` (+ unit).
6. **T6** `ChatHeader.tsx` memory-badge (Brain + count) -> `openSidePanel`; aria in `useChatChrome`.
7. **T7** `MemoryCard.tsx` transparantie-regel + "Wis geheugen" knop (`resetMemory` + `clearMemory` + `closeSidePanel`).
8. **T8** `tests/e2e/memory-v2-recall.spec.ts` gated live (seed localStorage -> welkom-terug + recall). Daarna finale verificatie (tsc, build, no-API specs, agent-browser walkthrough nl+en).

## 3. Vastgelegde beslissingen (niet heroverwegen)

- **Volledige v2**: persistentie + system-prompt-injectie + gepersonaliseerde welkom-terug + dedicated memory-badge.
- **Consent**: persisteer zodra `cookieConsent` bestaat (functional staat altijd aan); zichtbare "Wis geheugen" + 1 transparantie-regel; private mode / geen consent -> geen persistentie (valt terug op v1 binnen-sessie).
- **Terugkeer-recall**: profiel meesturen in `/api/chatbot` `context` -> engine injecteert in system-prompt (nodig want nieuwe sessie heeft geen historie).
- **Welkom-terug**: gepersonaliseerd, client-side, geen API.
- **"Nieuwe chat"**: wist gesprek, **behoudt** geheugen; alleen "Wis geheugen" wist het profiel + localStorage.

## 4. Sleutel-codelocaties (deze sessie geverifieerd)

- v1 memory: `src/lib/chatbot/memory.ts` (`MemoryProfile`, `mergeMemory`, `MEMORY_FIELD_ORDER`).
- store: `src/stores/chatbotStore.ts` — `memoryProfile`, `setMemoryProfile`, `resetMemory` (regel 181), `partialize` (regel 186: sessionId/personaId/messageCounts, **geen** memoryProfile).
- accumulatie: `src/components/chatbot/ChatMessages.tsx` (`accumulatedMemory` effect ~349-375; `lastSidePanelTool` ~317 — memory wijkt voor conversie-cards, behouden).
- `MemoryCard`: `src/components/chatbot/tool-results/MemoryCard.tsx` (leest store; `FIELD_LABELS` + `EMPTY_HINT` nl/en/es).
- `ChatWidgetIsland`: `src/components/chatbot/ChatWidgetIsland.tsx` (welcome-derivatie; heeft nu route-change-close + post-nav nudge uit nav-ux; `useRef` al geimporteerd).
- `handleNewChat`: `src/components/chatbot/ChatWidget.tsx:116-124` (resetMemory op regel 121; client useChat `sendMessage` ~regel 49 — transport/`body`/`context` config daar opzoeken voor T4).
- engine: `src/lib/chatbot/engine.ts:50` leest `context` uit body; `:118` `buildSystemMessages(persona, topicResult, context)`.
- prompt: `src/lib/chatbot/prompt-builder.ts` (`buildSystemMessages` — T4 injectiepunt; voeg `memoryProfile?` toe aan het context-type).
- chrome i18n: `src/components/chatbot/useChatChrome.ts` (`LABELS` nl/en/es, `PANEL_TITLES`).
- `ChatHeader`: `src/components/chatbot/ChatHeader.tsx` (T6 badge naast new-chat/minimize/close).

## 5. Setup / test / gotchas

- **Tests**: `$env:PLAYWRIGHT_BASE_URL="http://localhost:3100"` (anders draait Playwright tegen :3000 = fma-app, en spawnt het een eigen server). No-API/unit specs importeren modules direct (zoals `tests/e2e/memory-merge.spec.ts`).
- **Integratietest** = `npm run build` via de **Bash-tool** (exit 0; via cmd.exe faalt `prebuild: npm run lint || true`).
- `npx tsc --noEmit` is schoon op 1 pre-existing fout: `tests/e2e/audit-v2-lighthouse.spec.ts:90` (Playwright API-drift, niet chatbot).
- **Rate limits** (Upstash, gedeeld met productie): IP `unknown` 10/min, global 100/uur. Live tests economisch + `--workers=1`.
- **Aria's**: `regenerate`/`close` zijn gelokaliseerd; **FAB ("Open chat met Clyde")**, **"Stop generatie"**, **"Verstuur bericht"** zijn hardcoded NL (cross-locale selectors).
- **SidePanel** rendert mobile-portal (in `document.body`) + desktop-inline (in `[data-chatwidget-panel]`) -> een ongescopete `getByText` matcht 2x; scope op `[data-chatwidget-panel]`.
- **Geen em-dashes** in user-facing copy. **Dev-server 3100 nooit killen.**
- `tests/e2e/pr13-verify.spec.ts` is untracked (verificatie van PR #13, al gemerged) — niet onderdeel van v2, kan blijven of weg.

## 6. Open workflow-beslissing

`fix/clyde-nav-ux` is af maar niet gepusht/PR'd. Twee opties voor de nieuwe sessie:
- **A**: nav-ux eerst pushen + PR + mergen op main, dan `feature/clyde-memory-v2` rebasen op de bijgewerkte main (schone, losse PR's). Aanbevolen als je nav-ux los wilt shippen.
- **B**: gestackt laten en v2 erbovenop bouwen; uiteindelijk twee gestackte PR's (v2 bevat nav-ux tot die merget).

Beide prima; A is netter qua losse review.

## 7. Pointers

- v2 design: `docs/plans/2026-05-30-clyde-memory-panel-v2-design.md`
- v2 plan (8 TDD-taken): `docs/plans/2026-05-30-clyde-memory-panel-v2.md`
- v1 memory design/plan: `docs/plans/2026-05-29-clyde-memory-panel-design.md` + `2026-05-29-clyde-memory-panel.md`
- Vorige handover (PR #13, gemerged): `docs/plans/2026-05-29-clyde-handover-pr13.md`
- Verificatie-screenshots deze sessie: `.audit-screens/pr13-verify/` (untracked) — o.a. `ab-{en,es,nl}-memory.png`, `cta-new-booking.png`, `nav-seo-ok.png`, `nav-nudge.png`.
