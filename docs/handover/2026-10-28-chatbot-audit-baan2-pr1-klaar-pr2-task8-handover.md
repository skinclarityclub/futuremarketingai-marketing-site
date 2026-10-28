# Handover: Clyde-widget future-marketing.ai, baan 2: PR 1 klaar, PR 2 tot en met Task 8 (2026-10-28)

**Commits:** PR 1 `chore/chatwidget-opschonen` op `cdb76de`. PR 2 `feat/chatwidget-kaarten-inline` op `e39407e` (Task 7 `e6f7636`, Task 8 `e39407e`), daarboven deze handover. Alles lokaal, niets gepusht.
**Branch:** `feat/chatwidget-kaarten-inline` in worktree `C:/tmp/fmai-chatwidget-audit`, gestapeld op `chore/chatwidget-opschonen`, base origin/main `8c42a42`
**Scope:** PR 1 (Tasks 1-6) is gebouwd, gereviewd en klaar voor push. PR 2: Task 7 is gereviewd en schoon. Task 8 is gebouwd, maar de taakreview loopt nog niet.

## START PROMPT (volgende sessie)

```
Baan 2 van de chatbot-UX-audit: de Clyde-widget op future-marketing.ai. Dit is een vervolg.
Je werkt in worktree C:/tmp/fmai-chatwidget-audit op branch feat/chatwidget-kaarten-inline: PR 2, gestapeld op PR 1 (chore/chatwidget-opschonen, cdb76de). Niets is gepusht.

Lees eerst volledig:
- deze handover;
- uit C:/Users/daley/.claude/projects/C--Users-daley-Desktop-fma-app/memory: MEMORY.md en, uit clyde-chat-en-website-chatbots-ux-2026-10-28.md, alleen het kopje "Baan 2";
- de SDD-ledger C:/tmp/fmai-chatwidget-audit/.superpowers/sdd/2026-10-28-chatwidget-opschonen-PLAN/progress.md. Hervat daaruit, niet uit je geheugen.
Uit het plan docs/plans/2026-10-28-chatwidget-opschonen-PLAN.md lees je alleen Task 8-10 en het PR 2-slot (grep -n plus sed -n).

Eerste actie: stel Daley één vraag met AskUserQuestion: "PR 1 is klaar (gate groen, Opus-review van de hele branch plus herkeuring schoon). Mag ik chore/chatwidget-opschonen pushen en de PR openen met titel 'fix(chatbot): Clyde widget says it is AI, honest limit, errors at the question'?"
- Bij ja: push en open de PR. Mergen vraag je apart, want een merge is een deploy van de live site.
- Bij nee of geen antwoord: ga gewoon verder met PR 2, lokaal.

Daarna:
1. Start de dev server op :3123 in-session, als background task:
   cd C:/tmp/fmai-chatwidget-audit/fmai-nextjs && pwsh -NoProfile -File C:/Users/daley/.claude/scripts/no-ctrlc.ps1 npx next dev --port 3123 >> C:/tmp/fmai-chatwidget-audit/.superpowers/sdd/2026-10-28-chatwidget-opschonen-PLAN/dev-3123.log 2>&1
   Detach hem niet: de reaper doodt een losgekoppelde next dev.
2. Roep superpowers:subagent-driven-development aan (Daley koos Subagent-driven) en hervat volgens references/resuming.md. De volgende stap is de TAAKREVIEW van Task 8: BASE e6f7636, HEAD e39407e. Maak het review-package vanuit de worktree-cwd. Geef de reviewer zorg 1 uit de ledger mee als risico om te checken, zonder oordeel: elke kaart staat BINNEN de assistant-tekstballon, terwijl board 2 hem op volle breedte toont.
3. Daarna Task 9 (geheugenchip, sheet, 30 dagen TTL), dan Task 10 (gate en visueel bewijs tegen boards 2-4, met een kopie van shots.mjs op :3124), dan de Opus-review van de hele PR 2. Push alleen op Daleys ja.

Harde regels:
- Nul betaalde chatcalls. Draai NOOIT de specs chatbot, clyde-audit, clyde-capture, clyde-memory, demo-full-flow, guided-demo of memory-v2-recall. Elke nieuwe browserspec mockt /api/chatbot met page.route en checkt calls().
- Push, PR en merge alleen op Daleys ja.
- Nooit taskkill, pkill of TaskStop op iets wat je niet zelf startte.
- Geen em-dashes in copy. Spaans zegt "IA". D3 is "48 uur" overal.
- Geen EU- of trust-claims die niet kloppen (zie fmai-trust-en-eu-claims).
- Raak baan 1 (fma-app) en baan 3 (SKC) niet aan.
- research-notes.md en de hele map 80-Archief/fma-app-audits/2026-10-28-clyde-chat-opschonen zijn read-only.
- Bewerk in memory alleen het kopje Baan 2.
- Draai geen dream: die herschrijft de hele fma-app-memory.
```

---

## Wat is er gedaan

**PR 1 (Tasks 1-6)**
- Gebouwd, per taak gereviewd, daarna één Opus-review van de hele branch:
  - "With fixes": 0 Critical, 2 Important. Het eerste Important was gemeten: de focus sprong naar de launcher bij een paginawissel. Het tweede: op telefoons was de achtergrond niet `inert`.
  - Eén fixgolf (F1-F12, `0ffa643..6b7c750`), daarna de herkeuring: "Clean".
- De afwijkingen van de taaktekst staan in het plan (`cdb76de`, blok "Deviations during execution").
- Gate op `6b7c750`, gedraaid door de fix-agent:
  - tsc 0, de build 0;
  - palette, copy en i18n-orphans 0;
  - 47 gemockte specs groen;
  - eslint geeft geen nieuwe errors. De base faalt al met 14 errors in andere bestanden (ruling R9).

**PR 2**
- **Task 7 (`e6f7636`):** het zijpaneel is weg en elk resultaat staat in het gesprek. `qualify_lead` rendert niets meer in elke toestand, dus de "55 HOT LEAD SCORE" verdwijnt. De review keurde goed, met alleen Minors.
- **Task 8 (`e39407e`):**
  - compacte kaarten en `data-tool-card` als vaste selector (R23);
  - D3: de 48-uurstrings;
  - 55 specs groen, waarvan 18 nieuw en 17 rood vóór de wijziging.
  - **De taakreview is nog niet gedaan.**

**Overig**
- De memory onder "Baan 2" is bijgewerkt met besluiten, valkuilen en stand.

## Huidige staat

| Component | Status | Werkt |
|---|---|---|
| PR 1 `chore/chatwidget-opschonen` @ `cdb76de` | klaar, wacht op Daleys ja voor de push | ja (gate + review schoon) |
| Task 7, zijpaneel weg | klaar, review schoon | ja |
| Task 8, compacte kaarten + 48 uur | gebouwd, NIET gereviewd | specs groen; zorg: kaart genest in de ballon |
| Task 9, geheugenchip + TTL | niet begonnen (brief staat klaar: `task-9-brief.md`) | n.v.t. |
| Task 10, gate + visueel bewijs PR 2 | niet begonnen | n.v.t. |
| `memory-persistence-browser.spec.ts` | kan rood zijn tot Task 9 (ruling R6) | waarschijnlijk niet |
| Dev server :3123 | gestopt bij het sluiten van deze sessie | herstarten (START PROMPT stap 1) |

## NEXT, in volgorde

1. Vraag Daley om ja voor de push van PR 1 en het openen van de PR.
2. Herstart de dev server op :3123.
3. Doe de taakreview van Task 8 (BASE `e6f7636`, HEAD `e39407e`). De fix-loop volgt alleen bij Critical of Important.
4. Task 9, dan Task 10.
5. De Opus-review van de hele PR 2 en één fixgolf. Daarna de lijst "Rulings I made" aan Daley, en een ja vragen voor de push van `feat/chatwidget-kaarten-inline`.
6. Afronding:
   - na de laatste schone review de SDD-werkmap verwijderen;
   - de dev server stoppen;
   - de memory bijwerken, alleen onder "Baan 2".

## Bekende gaps / limitaties

- **Task 8, zorg 1:** in de screenshot `.superpowers/sdd/.../task-8-case.png` staat de kaart binnen de assistant-tekstballon; board 2 toont hem op volle breedte. Dit is waarschijnlijk een Important voor de review.
- **Task 8, zorg 2:** in `ServiceCard.tsx` staat een verouderde `eslint-disable`. Dat geeft één extra warning, geen error.
- **Task 8, zorg 3:** BookingCard linkt naar de locale-route `/apply` via `Link`, niet naar de absolute `url` van de tool. Het label `reason` wordt niet getoond.
- **Geparkeerd uit PR 1:**
  - Achter de telefoonmodal blijven de skip-link en `FloatingLocaleSwitcher` bereikbaar; ze vallen buiten header, `#main` en footer.
  - Op desktop doet Escape niets na een klik op niet-focusbare tekst.
  - "Dit gesprek zit vol." staat twee keer in beeld.
- **Bestond al, valt buiten deze klus (melden aan Daley):** de chatlog stopt met auto-scrollen als antwoorden binnenkomen tijdens een smooth scroll. Het zit in de handleScroll van `ChatMessages.tsx`, met een drempel van 80px.
- **Betaalde specs:** guided-demo, demo-full-flow, clyde-audit en clyde-capture zijn alleen statisch aangepast en met tsc bewezen. Ze zijn nooit gedraaid.
- **Dream niet gedraaid:** de vlag `.dream-needed` staat sinds 15:03Z, gezet door een andere sessie. Deze baan mag alleen het kopje Baan 2 bewerken. Laat dream over aan een sessie die dat wel mag.
- **Stap 4b van session-wrap:** geen aparte `gsd-verifier`. Elke claim hierboven heeft een reviewer-verdict in de ledger, en niets staat live.

## Key files changed

- **Workspace:** `.superpowers/sdd/2026-10-28-chatwidget-opschonen-PLAN/`:
  - `progress.md` (ledger, rulings R1-R23, geparkeerde minors);
  - `task-N-brief.md` en `task-N-report.md`;
  - `pr1-final-findings.md`;
  - `boards/board-1..6.png`, de spec in beeld.
- **PR 1:**
  - `src/lib/chatbot/{message-limit,chat-error}.ts`;
  - in `src/components/chatbot/`: `widget-copy.ts`, `useChatChrome.ts`, `ChatWidget.tsx`, `ChatMessages.tsx`, `ChatInput.tsx`, `ChatHeader.tsx`, `FloatingChatTrigger.tsx`, `ClydePresence.tsx`;
  - `src/stores/chatbotStore.ts` (persist v1 plus migrate);
  - `usePersonaChat.ts`.
- **PR 2:**
  - `tool-results/index.tsx` (`HIDDEN_TOOLS`, `data-tool-card`), de kaartcomponenten en `cardI18n.ts`;
  - `src/lib/chatbot/knowledge/concierge-kb.ts` (48 uur);
  - `SidePanel.tsx` is verwijderd.
- **Tests:**
  - `tests/e2e/helpers/{chatbot-mock,chatbot-fixtures}.ts`;
  - `chatwidget-mocked.spec.ts`, `chat-logic.spec.ts`, `widget-copy.spec.ts`.
