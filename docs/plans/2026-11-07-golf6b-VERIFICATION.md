# Golf 6b (/trust en /alternatives): VERIFICATION

Branch `feature/golf6b-bewijs` in `C:/tmp/fmai-golf6`, port-commit `cc3af93e` op `a70878da` (de live-sectie van 6a), op origin/main `0a69898a` (#98). Niets gepusht; wacht op Daleys ja op de diff.
Plan: `docs/plans/2026-11-06-golf6-bewijs-plan.md`, Fase 3. Daley koos op 2026-11-07 "Zo porten" en de regel voor de rolverdeling op /trust.

## Eerste actie: de verwerkersovereenkomst naast de rolverdeling

| Vraag | Uitkomst |
|---|---|
| Waar staat hij | `docs/legal/verwerkersovereenkomst-dpa.md` (laatste wijziging `cf2edd13`, #66). Kopie in `C:/Users/daley/Desktop/FMai/docs/legal/` met dezelfde partijen. In de vault staat geen VWO, alleen de privacyverklaring. |
| Wat hij zegt | Artikel 1: het marketingbureau is **Verwerkingsverantwoordelijke** ("Opdrachtgever"), Future Marketing AI B.V. (i.o.) is **Verwerker**. Annex A noemt Vercel, Supabase, Hetzner, Upstash, Anthropic, OpenAI en de rest als sub-verwerkers van FMai. Het is nog een concept: "Open punten (intern, verwijderen vóór verzending)", partijen niet ingevuld. |
| Het prototype | "Je klant is eigenaar, jouw bureau de verwerker, FutureMarketingAI de subverwerker". Dat is **niet** wat de VWO zegt. |
| Gevolg (Daleys regel van 11-07) | De keten blijft (je klant, jouw bureau, FutureMarketingAI), zonder AVG-rolnamen: de klant geeft het bureau zijn merk, klanten en content, het bureau werkt ermee in een eigen werkruimte per klant, FMai levert Clyde met de aanbieders uit artikel 5. "Subverwerkers" blijft in de meta en in de vraag "Welke subverwerkers gebruikt Clyde?": dat zijn de sub-verwerkers van FMai uit Annex A, precies zoals de VWO ze noemt. |

## Bronnen: één Codex-run op de PR-dag

`codex --search exec -s read-only --skip-git-repo-check` op 2026-11-07, 47 claims (A1-J3), 287k tokens. Prompt en antwoord: `R/g6/bronnen6b/{prompt.txt,answer.md}`. Alleen eigen pagina's van de aanbieders.

| Wat | Was (prototype of live) | Nu, met bron |
|---|---|---|
| Lindy, prijs | $49,99 per actieve gebruiker | **$29,99** per actieve gebruiker (Team, 3.000 credits); lindy.ai/pricing |
| Lindy, klant keurt goed / geheugen / publiceert | niet gevonden / plaatshouder / plaatshouder | goedkeuringslink voor social / per werkruimte en per gebruiker, per klant niet gevonden / LinkedIn en X; lindy.ai/hire/social-media-manager, lindy.ai |
| Lindy, "acties wachten op goedkeuring" | wachten | **kunnen** wachten (C6) |
| Sintra | "Eén kennisbank", werkruimte niet gevonden, data niet gevonden | Brain AI per werkruimte, tot 5 profielen; publiceert naar vijf netwerken; VS of EU volgens hun DPA |
| GoSocio | geheugen plaatshouder | merkdocumenten, geheugen per klant niet gevonden; rest bevestigd |
| Aidelly | 3 plaatshouders, data niet gevonden | link zonder account; merkprofiel dat leert; elf netwerken; **VS, geen EU-optie** |
| StoryChief, prijs | €79 per werkruimte | **€49** (Starter, jaarbetaling); bureaus €79 per werkruimte |
| StoryChief | 3 plaatshouders | merkcontext per klantwerkruimte; CMS en tien netwerken; **EU (Ierland, België)** |
| Planable | geheugen niet gevonden, data plaatshouder | merkcontext per werkruimte (4.000 tekens); negen platforms; hostingaanbieders in de VS. Klantakkoord blijft "vanaf Pro" (extern samenwerken begint op Pro) |
| ChatGPT Business | prijs zonder periode, data plaatshouder | $20 bij jaarbetaling ($25 per maand); dataresidentie wordt gefaseerd uitgerold |
| aicollegas.nl | €4.500 partnership; home: €1.495 scan, €99 Hub, "2 tot 4 weken" | partnership bevestigd; AI Impact Sessie €1.495 en "binnen 4-12 weken live" op /wat-we-doen/ai-agents; data in de EU (algemene voorwaarden). **/transparant niet leesbaar, €99 Hub en "2 tot 4 weken" niet gevonden: eruit** |
| Anthropic (/trust) | gelezen 25 oktober | bevestigd: geen training, 30 dagen / tot 2 jaar, Anthropic Ireland met SCC's |
| OpenAI (/trust) | "op basis van SCC's" | DPA zegt **SCC's of een adequaatheidsbesluit**; zo staat het er nu. Let op: Annex A van de VWO zegt "SCC (geen DPF)" |

Elke cel en kaart heeft nu een bron op de pagina zelf: per tool de gebruikte URL's onder de kaart, de DPA's van Anthropic en OpenAI in de bronregel op /trust.

**Home (`home.waarom`)**: dezelfde bedragen ($20 en $33, €1.495), "gecontroleerd op 7 november 2026", de €99 Hub en "2 tot 4 weken" weg, en de links naar de pagina's die gelezen zijn (help-FAQ van ChatGPT Business, /wat-we-doen/ai-agents).

## Task 4: de port

| Stap | Uitkomst |
|---|---|
| Met de hand | Zoals 6a: `TrustSections.tsx` en `AlternativesSections.tsx`, de markup en klassen van het prototype, `t()` per tekstnode. `proof.css` bestond al; één regel erbij (`overflow-wrap:anywhere` op de bronregel van de toolkaarten, voor de lange help-URL's op 390). |
| Engels | Zelf geschreven, dezelfde sleutels, datumvorm "7 November 2026" zoals 6a. `es.json` spiegelt `en.json` (check:copy). |
| Beeld | `public/proof/akkoord-luwte.webp` (q85, 86 KB) uit `R/real/akkoord.jpg`. Het bijschrift staat letterlijk in het scherm. |
| JSON-LD | Geen nieuw type. `dateModified` 2026-11-07 op beide WebPages via de lastmod in `seo-config.ts`. Breadcrumb-naam uit `common.breadcrumbs`. |
| /en-links | `#regie` en `#waarom` bestaan alleen op de NL-home: op /en `#people` en `#comparison-table`. Het kennisbankartikel opent de NL-versie, met "(in Dutch)". |
| Weg | Geen component: alle oude imports (SectionShell, GlassCard, EyebrowLabel, CTAButton) hebben nog andere afnemers. |
| check:copy | Eén gerichte uitzondering: de bron-URL `sintra.ai/ai-employees/social-media-manager` (hun pad, niet onze woorden over Clyde). |

## Task 5: de poorten

Gemeten op 2026-11-07 op `cc3af93e`, `next start` op poort 3071; baseline `0a69898a` in worktree `C:/tmp/fmai-g6b-base` op poort 3072. Geen `.env.local` in beide worktrees.

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript, ESLint | `npx tsc --noEmit`, `npx eslint` op de nieuwe en gewijzigde bestanden | rc 0 |
| Zes checks | `check:copy`, `check:i18n-orphans`, `check:sitemap-lastmod`, `check:indexability`, `check:llms`, `check:palette` | alle zes rc 0 |
| Build | `npx next build` | rc 0, beide routes statisch voor nl en en |
| curl | `/nl` en `/en` van trust en alternatives | 4x 200, nieuwe title en H1. In de zichtbare tekst 0 treffers op de oude EU-claim, "5 tot 20 mensen", "Vier alternatieven", "jouw subverwerker", "$49", "€99" (los), "transparant", "Artikel 50", "AI Collega" en em-dashes. Mistral alleen in de zin "op aanvraag". |
| Titles en metas | apply-script | title 47/46 en 50/49 tekens, meta 146/144 en 130/136 |
| Tekstpariteit | elk tekstblok van het prototype op de NL-pagina | trust 88/94, alternatives 148/166; alle 24 afwijkingen zijn de bewuste hierboven (keten, datums, Codex-feiten, bronregels) |
| Overflow, axe | `m-g6.mjs g6/port6b --base http://localhost:3071`, 1440/1280/1024/390 plus reduce, en een /en-kopie op 1280 en 390 | **0 PROBLEEM**, axe 0, js 0, tabellen scrollen in hun kader |
| e2e | `navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`, chromium, `--reporter=list` | baseline 15 failed / 114 passed / 1 skipped; branch 16 / 113 / 1. Het verschil is `nl-content-smoke › legal-privacy`: "Unable to capture screenshot" onder belasting (de /en-meting liep tegelijk). Los `--repeat-each=3`: 3/3 groen op branch en baseline. De andere 15 zijn dezelfde tests. |

## Wat open blijft

- Annex A van de VWO zegt bij OpenAI "SCC (geen DPF)"; de DPA van OpenAI zegt "SCC's of een adequaatheidsbesluit". Het interne document is niet aangepast.
- Het delen van data op het OpenAI-account is nog steeds niet gecontroleerd (zie 6a).
- De 15 rode e2e-tests van de baseline staan los van golf 6.
- Lastmod staat op 2026-11-07. Merget 6b op een latere dag, dan gaat hij mee naar de mergedag.
