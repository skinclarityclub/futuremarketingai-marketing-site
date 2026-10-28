# Handover: Clyde-widget future-marketing.ai, baan 2, plan klaar (2026-10-28)

**Commits:** `c407bf7`, lokaal in de worktree en niet gepusht
**Branch:** `chore/chatwidget-opschonen` in `C:/tmp/fmai-chatwidget-audit`, op basis van origin/main `8c42a42` (repo `skinclarityclub/futuremarketingai-marketing-site`)
**Scope:** SOTA-onderzoek, screenshots, een presentatie met 6 voorstellen (Daley heeft ze goedgekeurd) en het implementatieplan voor de Clyde-widget op de site.

## START PROMPT (volgende sessie)

```
Baan 2 van de chatbot-UX-audit: de Clyde-widget op future-marketing.ai. Dit is een vervolg.
Je werkt in worktree C:/tmp/fmai-chatwidget-audit, branch chore/chatwidget-opschonen, HEAD c407bf7 (lokaal, niet gepusht).

Lees eerst volledig:
- deze handover;
- uit C:/Users/daley/.claude/projects/C--Users-daley-Desktop-fma-app/memory: MEMORY.md en, uit clyde-chat-en-website-chatbots-ux-2026-10-28.md, alleen het kopje "Baan 2";
- het plan docs/plans/2026-10-28-chatwidget-opschonen-PLAN.md in de worktree.
De spec staat in C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-10-28-clyde-chat-opschonen/:
- index-fmai.html;
- sota-fmai.md. Lees die alleen per sectie, met grep -n plus sed -n.

Eerste actie: vraag Daley, en bouw niets voor hij antwoordt:
(1) Klopt het plan?
(2) Welke uitvoering: Native (advies) of Subagent-driven? Native betekent: ik voer elke taak zelf uit, in een sessie met /model sonnet, en per PR kijkt aan het eind één verse Opus-reviewer de hele branch na.
(3) De open besluiten D1-D3 uit het plan:
    D1: geheugen over bezoeken heen. Mag het blijven zoals het nu is, met een vervaltermijn van 30 dagen?
    D2: de limiet blijft 15.
    D3: "Reactie binnen 24u" tegenover "binnen 48 uur". Welke klopt?
(4) Mogen de ontbrekende mobiele screenshots opnieuw gedraaid worden?

Daarna, met zijn ja: de setup uit Global Constraints (eerst schijfruimte op C: checken, dan npm ci in fmai-nextjs van de worktree). Daarna Task 1 van PR 1.

Harde regels:
- Nul betaalde chatcalls. Draai NOOIT de specs chatbot, clyde-audit, clyde-capture, clyde-memory, demo-full-flow, guided-demo of memory-v2-recall. Elke nieuwe browserspec mockt /api/chatbot met page.route.
- Push, PR en merge alleen op Daleys ja. Een merge op main is een deploy van de live site.
- Nooit taskkill.
- Geen em-dashes in copy.
- Geen EU- of trust-claims die niet kloppen (zie fmai-trust-en-eu-claims).
- Raak baan 1 (fma-app) en baan 3 (SKC) niet aan.
- research-notes.md is read-only.
- Bewerk in memory alleen het kopje Baan 2.
```

---

## Wat is er gedaan

**Documenten in de auditmap** `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-10-28-clyde-chat-opschonen/`:
- **`sota-fmai.md`** bevat:
  - het SOTA-onderzoek, met as-of-markers;
  - AI Act art. 50(1), gelezen in de Commissie-richtsnoeren C(2026) 5054 zelf;
  - een tabel die elke tool aan een patroon koppelt;
  - de punten die nog open of omstreden zijn.
- **`index-fmai.html`** bevat 6 voorstellen, elk met een boardmockup en een live screenshot. De visuele check was schoon: geen errors, geen kapotte afbeeldingen en geen overflow, ook niet op 390.

**Screenshots en scripts:**
- `img/fmai/` heeft alle desktopshots. Van mobiel zijn er alleen 01-04.
- `werk/fmai/` bevat:
  - `shots.mjs`: page.route-mock van de UI-message-stream, nul API-calls;
  - `make-boards.mjs`;
  - `build-presentatie-fmai.mjs`;
  - `presentatie-shot.mjs`.

**Daleys besluit:** "Ik volg jouw voorkeur, maak het zo sota mogelijk dus doe maar". Alle 6 voorstellen gaan door en het zijpaneel verdwijnt.

**Plan `c407bf7`:**
- 2 gestapelde PRs met 10 taken.
- PR 1 (wet en bugs), Task 1-6:
  - AI-label en een disclosure onder de invoer;
  - foutmelding bij de vraag, waarbij 429 en 500 apart worden behandeld;
  - een eerlijke limiet per gesprek, met waarschuwing en een link naar /apply;
  - één proactief systeem.
- PR 2, Task 7-10:
  - zijpaneel weg, resultaten als compacte kaarten in het gesprek;
  - de lead score niet meer tonen aan de bezoeker;
  - geheugen als chip met een sheet in de kolom, plus een vervaltermijn van 30 dagen.
- Nieuwe tests:
  - `chat-logic.spec.ts` en `widget-copy.spec.ts` zijn pure logica;
  - `chatwidget-mocked.spec.ts` is een browserspec met mocks;
  - de bestaande memory-specs worden uitgebreid.

**Memory:** het kopje Baan 2 in `clyde-chat-en-website-chatbots-ux-2026-10-28.md` is bijgewerkt.

---

## Huidige staat

| Component | Status | Werkt |
|---|---|---|
| SOTA-onderzoek `sota-fmai.md` | klaar | ja |
| Presentatie `index-fmai.html` | klaar, goedgekeurd | ja |
| Screenshots desktop | klaar | ja |
| Screenshots mobiel | partial: 01-04 wel, de rest ontbreekt (run gestopt op RAM) | nee |
| Plan | klaar, wacht op Daleys review en zijn keuze voor de uitvoering | n.v.t. |
| Code | nog niets gewijzigd | n.v.t. |

---

## NEXT, in volgorde

1. **Daley:**
   - plan reviewen;
   - Native of Subagent-driven kiezen;
   - D1-D3 beantwoorden;
   - ja of nee op de mobiele shots. Bij ja: `node shots.mjs https://future-marketing.ai mobile-` vanuit `werk/fmai`. Het laadt de live site maar mockt de chat-API.
2. **Setup van de worktree:**
   - check de schijfruimte op C:, die stond op 10-28 op 98%;
   - draai `npm ci` in `fmai-nextjs/`;
   - draai zo nodig `npx playwright install chromium`.
3. **PR 1:**
   - Task 1-6, elk met een TDD-cyclus;
   - daarna de volledige gate (Task 6);
   - visuele proef tegen de boards;
   - pushen en de PR openen pas op Daleys ja.
4. **PR 2:** Task 7-10, gestapeld op PR 1, met dezelfde gate en dezelfde regel voor pushen.
5. **Na de merges:** worktree `C:/tmp/fmai-chatwidget-audit` opruimen.

---

## Bekende gaps en limitaties

**Plan:**
- De regelnummers kloppen voor `8c42a42`. Controleer ze opnieuw voor je bewerkt.
- Deze aannames in het plan zijn niet in de code geverifieerd:
  - de exacte aria-label van de minimaliseerknop. Task 3 test dat daarom met een ruime selector.
  - of `page.clock` zijn stand houdt over `page.reload()` heen (Task 5).
  - hoe het effect `accumulatedMemory` in `ChatMessages.tsx` het profiel na "Wis alles" opnieuw vult. Task 9 heeft daar een test voor.
- **Valkuil (Review Focus 1):** `messageCounts` weghalen uit `partialize` is niet genoeg. Een oude opgeslagen telling wordt dan nog steeds ingelezen bij hydratie. Het plan bumpt daarom de persist-`version` en voegt een `migrate` toe.

**Open punten:**
- D3: de copy zegt op de ene plek 24u en op de andere 48 uur, en die tegenspraak blijft live tot Daley kiest.
- Een Codex-gate is niet nodig: dit is UI-werk, zonder auth, betalingen of schema.

**Overgeslagen tijdens de wrap:**
- Dream: de vorige run was op 2026-10-27 om 17:35, korter dan 24 uur geleden. De vlag `.dream-needed` blijft staan voor de volgende wrap, omdat baan 1 en 3 tegelijk in dezelfde memory-map schrijven.
- Graphify in fma-app is stale, maar niet door deze sessie. Ik heb hem niet bijgewerkt.

**Overig:**
- Stap 4b viel weg: deze sessie noemt geen code af.
- De vault-api was bereikbaar en Obsidian was dicht.

---

## Key files changed

**Worktree:**
- `C:/tmp/fmai-chatwidget-audit/docs/plans/2026-10-28-chatwidget-opschonen-PLAN.md` (nieuw, `c407bf7`)

**Auditmap** `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-10-28-clyde-chat-opschonen/`, met `sota-fmai.md`, `index-fmai.html`, `img/fmai/` en `werk/fmai/`. Die map is geen git-repo.

**Memory:** `clyde-chat-en-website-chatbots-ux-2026-10-28.md`, kopje Baan 2.
