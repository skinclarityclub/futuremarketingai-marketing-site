# Golf 6, de bewijspagina's: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** /how-it-works, /memory, /trust en /alternatives (NL en EN) herschrijven naar het siteplan en de huisstijl van de nieuwe homepage: eerst een prototype dat Daley goedkeurt, daarna de port in twee PR's.

**Architecture:** Het prototype volgt golf 3-5. Per pagina komt er een `golf6-<pagina>.tpl.html` in `R`, met `shared.css` en één gedeelde `golf6.css` (één sjabloon voor alle bewijspagina's, [02] §5). `build10.py` bouwt daaruit `golf6-<pagina>.html` en toetst de copyregels. `tools/m-g6.mjs` meet overflow en botsingen. De port schrijft per pagina een component met de prototype-CSS, gescoped op de pagina-root, plus de berichten in `nl.json` en `en.json`. `page.tsx` houdt PageShell, Breadcrumbs en de JSON-LD.

**Tech Stack:** Next.js 16, next-intl 4.8, Tailwind 4 (alleen de site-shell), Python 3 (build), Playwright (meten).

**Spec:**
- `A/10-siteplan.md` r596-613 (/how-it-works) en r660-722 (/trust, /memory, /alternatives).
- `A/02-paginas-verdieping-en-bewijs.md` r72-214 en r445-458 (het sjabloon).
- `A/presentatie-siteplan.src.html` r1284 en verder ("Adviezen die gelden"). Waar die van het plan afwijkt, telt de presentatie.
- `A/alle-paginas/rapport-alle-paginas.html` (kaarten /trust, /memory, /alternatives en /how-it-works).

Daarbij: `A` = `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-11-02-website-audit/design/siteplan`, `R` = `.../design/ronde1b`, `P` = `.../design/port`.

## Daleys keuzes (2026-11-06, AskUserQuestion)

| Vraag | Antwoord |
|---|---|
| Aanpak | **B**: eerst een prototype, dan porten, zoals de home-golven 3-5 |
| /trust | Meenemen in golf 6. De geparkeerde punten van golf 2 (datum, portret, TikTok) raken /trust niet |
| Beslissing 23 | Het advies van 3 november: een rij "zelf doen met ChatGPT en een planningstool", plus Aidelly, StoryChief en Planable, elk met bron en datum. Lindy, Sintra, GoSocio en aicollegas.nl blijven |
| PR's | Twee: **6a** = /how-it-works en /memory, **6b** = /trust en /alternatives |

## Afhankelijkheden, getoetst op origin/main `bf5bdb8b` (2026-11-06)

- **De datazin** staat letterlijk gelijk op de home (`nl.json:842`, `:1105`) en op /trust (`:2156`): "Database, servers en wachtrijen staan in de EU. Het taalmodel draait bij Anthropic en OpenAI in de VS." Golf 6 gebruikt die zin en hangt dus niet aan golf 2.
  - Andere vormen staan nog in de tabelcel `:296`, de chips, `skills-email-management` en `llms-full.txt`. Die horen bij golf 2 en golf 9.
  - Op /alternatives (`clyde.body`) staat "Data, servers en database staan in de EU". Dat is de oude claim, en golf 6b vervangt hem door de datazin.
- **ZDR en Mistral** op /trust zijn al zoals Daley koos (keuze 3 eigen variant, keuze 4A). Die blijven.
- **De vier weken**: de home (`home.start`) zegt vier weken met 2, 2 en 4 uur, daarna 2 uur per week, en kickoff in week 4. /how-it-works zegt "Vanaf week 4", maar heeft nog "5 stappen", "Stap 1 van 11" en weken die elkaar overlappen.
- **Geheugen bewaren** (keuze 3a, #1938 LIVE 2026-11-05): Founding bewaart het geheugen en de gesprekken zolang het abonnement loopt (`nl.json:1740`). /memory mag dat zeggen, in precies die vorm.
- **Opzeggen** (keuze 10b, LIVE via P0): "Na opzegging sturen we je binnen 30 dagen een export van je gegevens; daarna verwijderen we je werkruimtes."
- **Isolatie per teamlid**: het lek voor beperkte teamleden is deels dicht, en de stand na 15 oktober is ONBEKEND. Dus geen claim per teamlid, ook niet als vraag "wie ziet wat".

## Global Constraints

- Geen em-dashes in copy. "AI-collega" alleen als omschrijving naast Clyde, nooit "AI Collega" los en nooit als kop of zoekterm (B3).
- Titles <=58 tekens inclusief " | FutureMarketingAI" als de site dat suffix plakt. Meta's <=155.
- Geen Artikel 50 AI Act en geen "voldoet aan" op /trust.
- Mistral alleen als "op aanvraag" op /trust.
- Geen volumecijfers als kop, geen verzonnen resultaten of tijdwinst, geen gesimuleerde chats.
- Elke tekst rond een echt scherm komt letterlijk uit dat scherm. Onder elk demoscherm staat `Voorbeeldbureau en voorbeeldmerken uit de demo-omgeving van de app.`
- Prijzen van derden alleen met bron en datum. Alle bronnen voor 6b opnieuw ophalen op de dag van die PR, via `codex --search exec`. Geen Perplexity, geen Gemini, geen DataForSEO.
- Eén amber knop per pagina ("Vraag een gesprek aan", naar /apply). Eyebrows en chips in teal of neutraal.
- `foundingDate`, het portret en de TikTok-hero niet aanraken.
- Geen nieuw JSON-LD-type. Alleen tekst in de bestaande HowTo, plus `dateModified` op de WebPage van /alternatives. Geen route-wijziging, dus geen Codex-gate.
- Builds met `npx next build`, servers alleen via `~/.claude/scripts/detach.ps1`, geen taskkill, geen test die tegen prod naar /api/apply post.
- Niets pushen, mergen of PR's sluiten zonder Daleys ja op de concrete diff.

## Review Focus

1. **390 px met lange Nederlandse woorden** ("verwerkersovereenkomst", "standaardcontractbepalingen"): geen horizontale scroll. De tabel op /alternatives scrolt binnen zijn eigen kader, de pagina niet. m-g6 meet `scrollWidth <= innerWidth` op alle vier de pagina's.
2. **Tabel op 390 px**: de kolom van Clyde blijft zonder te scrollen zichtbaar (les uit golf 4: Clyde als tweede kolom). m-g6 toetst dat de Clyde-kop binnen de viewport valt.
3. **Toetsenbord en screenreader**: elke vraag is een `<details>` met een `<summary>`, of een `<h3>` met een antwoord, en de tabel heeft `<caption>` en `<th scope>`. m-g6 draait axe met 0 violations als poort.
4. **Reduced motion**: geen beweging behalve de hover op de pijl. De meting draait ook met `reducedMotion: 'reduce'`.
5. **/en**: elke sleutel uit `nl.json` heeft een Engelse waarde. `check:copy` en `check:i18n-orphans` blijven groen en er komt geen NL_ONLY-uitzondering bij.

---

## Fase 1: prototype (in R, geen repo-code)

### Task 1: ONTWERP en copy

**Files:**
- Create: `R/golf6-ONTWERP.md`

- [ ] **Stap 1:** Per pagina vastleggen: doelvraag, title (<=58), meta (<=155), H1, de twee zinnen eronder, de secties in volgorde met hun copy (NL), de vragen met antwoorden, de links in de inhoud en de bron van elk feit (`nl.json:<regel>` op `bf5bdb8b`, een screentekst of een bron-URL met datum). De copy schrijf ik zelf.
- [ ] **Stap 2:** Een lijst "Weg" per pagina (de sleutels en componenten die verdwijnen) en "Open vragen voor Daley", gebundeld.

### Task 2: prototype bouwen en meten

**Files:**
- Create: `R/golf6.css` (één sjabloon, root-klasse `.g6`, alle regels gescoped op `.g6`)
- Create: `R/golf6-how-it-works.tpl.html`, `R/golf6-memory.tpl.html`, `R/golf6-trust.tpl.html`, `R/golf6-alternatives.tpl.html`
- Create: `R/build10.py`, die `R/golf6-<pagina>.html` en `R/golf6-index.html` (de vier naast elkaar) bouwt
- Create: `R/tools/m-g6.mjs`
- Beelden: `R/cap-r4/clyde-geheugen.png` (/memory), `R/real/akkoord.jpg` (/trust en /how-it-works), `R/real/agenda.jpg` (/how-it-works)

- [ ] **Stap 1:** `build10.py` faalt (assert) bij een em-dash, bij "AI Collega" los, bij "Artikel 50", bij "Mistral" buiten /trust, bij een title boven 58 of een meta boven 155 (title en meta staan als `<title>` en `<meta name="description">` in elke tpl), bij een `#` of `!important` buiten `.g6`, en bij een demoscherm zonder de demoregel.
- [ ] **Stap 2:** Draai `python build10.py`. Verwacht: vier HTML-bestanden, en de asserts printen `OK golf6 4 pagina's`.
- [ ] **Stap 3:** `node tools/m-g6.mjs g6/r1` meet elke pagina op 1440x900, 1280x720, 1024x768 en 390x844, plus 390 met reduce. Gemeten wordt: pagina-overflow, tekst buiten zijn box, overlap tussen blokken, kapotte beelden en axe-violations. Verwacht: `0 PROBLEEM`. De screenshots staan in `g6/r1/`.
- [ ] **Stap 4:** Kijk zelf naar elke screenshot op 1280 en 390. Pas aan tot het klopt, en meet opnieuw.

### Task 3: presentatie voor Daley en zijn oordeel

**Files:**
- Create: `P/presentatie-golf6.html`, met per pagina voor en na (de live pagina naast het prototype, 1280 en 390), de keuzes en de open vragen
- Vault: `Agency/Rapporten/2026-11-06 Golf 6 prototype.md`

- [ ] **Stap 1:** Live-shots van de vier pagina's op prod (alleen lezen, 1280 en 390).
- [ ] **Stap 2:** Bouw de presentatie en meet hem met `tools/m-pres.mjs`. Verwacht: 0 PROBLEEM.
- [ ] **Stap 3:** Schrijf de vault-note met de link en de bron-HTML, en vraag Daley in één AskUserQuestion om zijn oordeel. Fase 2 begint pas na zijn ja op het prototype.

## Fase 2: port, PR 6a (/how-it-works en /memory)

Worktree `C:/tmp/fmai-golf6`, branch `feature/golf6-bewijs`, gemaakt vanaf origin/main `bf5bdb8b`, `npm ci` is klaar.

### Task 4: port /how-it-works en /memory

**Files:**
- Create: `fmai-nextjs/src/components/proof/proof.css`: `golf6.css` verbatim, gescoped op `.g6`, plus een UA-reset tegen Tailwind preflight (les uit golf 2-5)
- Create: `fmai-nextjs/src/components/how-it-works/HowItWorksSections.tsx`, `fmai-nextjs/src/components/memory/MemorySections.tsx` (server components, `getTranslations`)
- Modify: `fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx`, `.../memory/page.tsx`
- Modify: `fmai-nextjs/messages/nl.json`, `en.json` (namespaces `how-it-works` en `memory` vervangen; `es.json` niet)
- Modify: `fmai-nextjs/src/lib/seo-config.ts` (lastmod van `/how-it-works` en `/memory` naar de PR-dag)
- Delete, als `grep -rn` buiten die pagina 0 treffers geeft: `SystemFlow`, `ImprovementLoopCycle`, `LayerCube`, `MemoryComparison`, plus hun tests
- Beelden: `fmai-nextjs/public/proof/` (WebP, q85, breedtes zoals in het prototype)

- [ ] **Stap 1:** Probeer eerst `R/tools/port/port_section.py` met een config `golf6-hiw` (kind `secties`, page `golf6-how-it-works.html`, ns `how-it-works`). Vraagt dat meer dan ~50 regels wijziging in de converter, dan port je met de hand: de JSX volgt het prototype, met `t()` per tekstnode. Leg de keuze vast in VERIFICATION.
- [ ] **Stap 2:** Schrijf het Engels zelf, met dezelfde sleutels.
- [ ] **Stap 3:** De HowTo-JSON-LD houdt zijn type, maar krijgt de vier weken als stappen, gelijk aan de zichtbare tekst.
- [ ] **Stap 4:** Haal op de dag van 6a de bron voor "Het verschil met ChatGPT-projecten" (/memory) opnieuw op, in één `codex --search exec`-run (help.openai.com, projects-in-chatgpt). Klopt de zin niet meer, dan pas je hem aan of gaat hij eruit; de datum komt in "gecontroleerd op".

### Task 5: poorten 6a

- [ ] `npx tsc --noEmit`, `npx eslint`, `npm run check:copy`, `check:i18n-orphans`, `check:sitemap-lastmod`, `check:indexability`, `check:llms`, `check:palette`: allemaal exit 0.
- [ ] `npx next build` exit 0. Daarna `next start` via detach.ps1 op een vrije poort.
- [ ] curl op `/nl/how-it-works`, `/en/how-it-works`, `/nl/memory` en `/en/memory`: 200, de nieuwe title en H1, 0 treffers op de oude strings ("5 stappen", "Stap 1 van 11", "partnership", "Skin", "vergeet alles").
- [ ] Een tekstpariteitscheck: elke zichtbare tekst van het prototype staat op de geporte pagina (NL). Een visuele vergelijking op 390 en 1280 met `tools/m-compare.py`.
- [ ] 390 en 1280 zonder overflow. De e2e-specs die deze pagina's raken (`navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`) draaien op chromium, `next dev`. Ze moeten minstens zo groen zijn als dezelfde run op origin/main (eerst de baseline).
- [ ] `docs/plans/2026-11-0x-golf6-VERIFICATION.md` met de uitkomsten.

### Task 6: diffpagina 6a en Daleys ja

- [ ] `A/alle-paginas/golf6a-diff/index.html`: voor en na, 390 en 1280, gebouwd zoals bij golf 5b en 5c. Gemeten met m-pres: 0 PROBLEEM.
- [ ] Vault-note `Agency/Rapporten/2026-11-0x Golf 6a diff`, en dan de vraag om zijn ja.
- [ ] Pas na zijn ja: push, PR, merge. Daarna PSI 3x op mobiel en desktop, met een `?cb=` per run.

## Fase 3: port, PR 6b (/trust en /alternatives)

Een nieuwe branch vanaf origin/main ná de merge van 6a. Dezelfde taken 4-6, met deze verschillen:

- **Bronnen opnieuw ophalen op de dag van de PR**, in één `codex --search exec`-run met een expliciete lijst: Lindy, Sintra, GoSocio, aicollegas.nl (/wat-we-doen/ai-partnership en /transparant), Aidelly, StoryChief, Planable, ChatGPT Business en ChatGPT-projecten. Per tool vraag je de prijs, de prijseenheid, of er een werkruimte of portal per klant is, waar de data staat, en de URL. Een feit zonder bron gaat eruit. De datum komt in "gecontroleerd op", in de meta en in `dateModified`.
- De bedragen in home-sectie 7 (`home.waarom.table`, gecontroleerd op 4 november) moeten gelijk zijn aan /alternatives. Wijkt een bron af, dan gaan ze in dezelfde PR mee.
- `trust`: geen sleutel over isolatie per teamlid. De keten bureau, FMai en aanbieders volgt artikel 5 van de privacyverklaring, en de verwerkersovereenkomst blijft "op aanvraag".
- curl op `/nl/trust`, `/en/trust`, `/nl/alternatives` en `/en/alternatives`.
- De diffpagina komt in `A/alle-paginas/golf6b-diff/index.html`.

## Wat dit plan niet doet

- Geen FAQPage-markup, geen nieuwe schema-typen, geen nieuwe routes of slugs.
- Geen AVG-artikel. De vragen uit dat artikel worden H2's en vragen op /trust (alle-pagina's-audit, WF2 nl-62).
- Geen datazin-pariteit buiten deze vier pagina's (tabelcel, chips, email-management, llms-full): golf 2 en golf 9.
- Geen nieuwe captures uit de demo, tenzij een bestaande capture iets toont wat niet meer klopt. Dan alleen view-only, en zonder een slot te verbranden.
- Geen wijziging aan `es.json`.
