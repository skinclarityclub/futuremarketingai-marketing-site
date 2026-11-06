# Golf 6a (/how-it-works en /memory): VERIFICATION

Branch `feature/golf6-bewijs` in `C:/tmp/fmai-golf6`, port-commit `b8a73a67` op het plan `b630bcb0`, op origin/main `bf5bdb8b` (#97). Niets gepusht.
Plan: `docs/plans/2026-11-06-golf6-bewijs-plan.md`, Fase 2, Task 4-5. Daley koos op 2026-11-07 "Zo porten".

## Task 4: de port

| Stap | Uitkomst |
|---|---|
| 1. Converter of met de hand | **Met de hand.** `port_section.py` zoekt home-secties op `id`, een sprite en vijf `<style>`-blokken, en heeft per golf een eigen sleutelfunctie. Golf 6 heeft `<main class="g6">`, secties zonder id, geen sprite en één los CSS-bestand: dat zijn meer dan ~50 regels converter. De JSX volgt het prototype element voor element, met `t()` per tekstnode. |
| CSS | `src/components/proof/proof.css` = `golf6.css` letterlijk, met de next/font-variabelen in plaats van 'DM Sans' en 'JetBrains Mono', zonder de prototype-regel `.g6-ph`, plus de UA-reset tegen Tailwind preflight (dezelfde als de home-golven 3-5) en twee regels voor de site-component Breadcrumbs. |
| 2. Engels | Zelf geschreven, met dezelfde sleutels. CTA "Request a call", zoals de rest van /en. De zin over bewaren is de bestaande EN-zin van keuze 3a (`en.json`, privacy-FAQ). |
| 3. HowTo-JSON-LD | Type blijft HowTo. De stappen zijn de vier zichtbare weken: naam `Week n: titel`, tekst `Jij levert: … Clyde doet: … Klaar: …`, zonder de `<b>`. Gemeten in de HTML van `/nl/how-it-works`. |
| 4. Bron ChatGPT-projecten | Opnieuw opgehaald op 2026-11-07 met één `codex --search exec`-run (help.openai.com/en/articles/10169521-projects-in-chatgpt). Zin A ("ChatGPT onthoudt wat je in een project zet, ook als je dat project met je team deelt") is **waar**: delen kan op alle abonnementen en zet project-only memory aan. Zin B ("De planning ... staan in andere tools") is **deels waar**: OpenAI noemt planning als gebruik, maar een contentagenda, een klantakkoord of publiceren documenteert OpenAI niet. Zin B is daarom aangepast, en "gecontroleerd op" staat op 7 november 2026. |

**Weg, met 0 andere afnemers** (`grep -rln` over src, tests, e2e en scripts): `SystemFlow`, `ImprovementLoopCycle`, `LayerCube`, `MemoryComparison`, `MemoryLayersDiagram` (die laatste was al dood en las `memory.layers`), en `public/screenshots/{onboarding-11-stappen,goedkeuringen,doelen}.webp`.

**Afwijkingen van het plan:**
- **es.json is wél gewijzigd.** `check:copy` eist sleutelpariteit voor nl, en en es. Zonder es.json faalt hij: 297 treffers, waarvan de eerste die ik las allemaal "messages/es.json mist how-it-works.…" of "memory.…" waren. Op de basis `bf5bdb8b` is hij schoon. `es` is sinds 2026-10-02 geen route meer (next.config stuurt /es naar /en), dus es.json spiegelt nu en voor deze twee namespaces. Golf 5b deed hetzelfde voor `pricing`.
- **Links naar ankers die alleen op de NL-home staan.** Op /en gaan `#klant` en `#waarom` naar `#people` en `#comparison-table`, de secties van de EN-home met hetzelfde onderwerp. Het kennisbankartikel bestaat alleen in het Nederlands. Op /en opent de link de NL-versie, en de linktekst zegt "(in Dutch)".
- **De e2e-specs draaien op `next start`** van een productiebuild, niet op `next dev`. Dat geldt voor de baseline en de branch op dezelfde manier.

## Task 5: de poorten

Gemeten op 2026-11-07 op commit `b8a73a67`. De runtime-checks draaiden tegen `next start` van een build in `.next-6a` (`NEXT_DIST_DIR`) op poort 3068, de baseline tegen een build van `bf5bdb8b` in worktree `C:/tmp/fmai-g6-base` op poort 3067. Geen `.env.local` in beide worktrees, dus geen schrijfactie naar de gedeelde prod-DB mogelijk.

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op de nieuwe en gewijzigde bestanden | rc 0 |
| Copy | `npm run check:copy` | rc 0, "schoon" (zonder es.json-spiegel: 297 treffers) |
| i18n | `check:i18n-orphans` | rc 0, 43 namespaces |
| Sitemap | `check:sitemap-lastmod` | rc 0. Lastmod van `/how-it-works` en `/memory` staat op 2026-11-07 |
| Indexability, llms, palette | `check:indexability`, `check:llms`, `check:palette` | alle drie rc 0 |
| Build | `npx next build` (ook met `NEXT_DIST_DIR=.next-6a`) | rc 0. Beide routes zijn statisch gebouwd voor nl en en |
| curl | `/nl` en `/en` van `how-it-works` en `memory` | 4x 200. Nieuwe title en H1. In de zichtbare tekst 0 treffers op "5 stappen", "Stap 1 van 11", "partnership", "vergeet alles" en "Skin" (hoofdletter), en 0 em-dashes. Kanttekening: "partnership" staat nog in de RSC-payload van de globaal meegestuurde `apply`-namespace. Die hoort bij /apply en is niet zichtbaar op deze pagina's. |
| Tekstpariteit | `g6-parity.mjs` (scratchpad): elk tekstblok van het prototype tegen de geporte NL-pagina | how-it-works 81/81 en memory 77/77. 0 ontbrekend en 0 extra. De twee bewuste wijzigingen uit stap 4 zijn als verwachte vervanging getoetst en geraakt. |
| Overflow, axe, beelden | `node tools/m-g6.mjs g6/port6a-final --base http://localhost:3068`, op 1440, 1280, 1024 en 390, plus 390 met reduce | **0 PROBLEEM.** axe 0, js 0, kapot 0, uit-box 0, amber buiten de knop 0, knop 50px. `overflow -10` is de scrollbalk van de site-CSS in headless Chrome. |
| /en | eigen check (scrollWidth, buiten beeld, axe, js) op 1280 en 390 | 0 PROBLEEM |
| Visueel | prototype r5 naast de port, op 1280 en 390 (`g6/port6a/cmp/`) | Op 1280 gelijk. Erbij komen de site-header, de vaste taal- en Clyde-knop en de footer. Op 390 wikkelt de tekst iets eerder, door dezelfde 10px scrollbalk; op een telefoon is dat een overlay. |
| e2e | `navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`, chromium, 130 tests | baseline `bf5bdb8b`: 17 failed, 112 passed, 1 skipped. Branch: 17 failed, 112 passed, 1 skipped. **Nieuw groen:** nl-content-smoke how-it-works en memory. **Nieuw rood in de volle run:** conversion-polish P1-E (de voortgangsbalk op /assessment) en P1-C (/newsletter/confirm). Allebei geïsoleerd 3 van 3 groen op branch én baseline (`--repeat-each=3`): flaky onder belasting, en ze raken pagina's die deze diff niet aanraakt. De overige 15 rode zijn gelijk aan de baseline. |

## Wat open blijft

- Task 6: diffpagina `A/alle-paginas/golf6a-diff/index.html`, vault-note, Daleys ja. Daarna push, PR, merge en PSI 3x mobiel en desktop met een `?cb=` per run.
- De 15 rode e2e-tests van de baseline staan los van golf 6 (o.a. /assessment-ankers, de privacy-assessmentsectie, de NL-smoke van home, apply en drie skills). Hier niet gerepareerd.
- Lastmod staat op 2026-11-07. Merget 6a later, dan zet je hem in dezelfde PR op de mergedag.
- Fase 3 (PR 6b, /trust en /alternatives): bronnen opnieuw ophalen op de dag van die PR. Daarnaast de tekst van Daleys verwerkersovereenkomst naast de rolverdeling leggen (zijn keuze van 2026-11-07).
