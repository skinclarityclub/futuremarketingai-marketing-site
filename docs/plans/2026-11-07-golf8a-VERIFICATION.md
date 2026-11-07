# Golf 8a: verificatie (2026-11-07, deel 1 en 2)

Branch `feature/golf8a-client-portal` in `C:/tmp/fmai-golf6`, vanaf `docs/golf8-plan` (origin/main `d542c173` plus de plancommits). Port: `4fc8ff23` (29 bestanden), plus de Engelse taalfix `e177f4a5` uit deel 2. Niets gepusht.

## Akkoord

- **Daley**, één AskUserQuestion op 2026-11-07: zo porten in twee PR's (8a pagina's, 8b header en footer), alle adviezen, vier portaalschermen echt (Luwte, alleen-kijken-sessie), nieuwsbrief in 8b standaard uit. Vastgelegd in `R/golf8-ONTWERP.md` ("Keuzes van Daley") en de vault-note `Agency/Rapporten/2026-11-07 Golf 8 prototype.md`.
- Gevolg van de echte schermen: drie echt (kalender, onderbalk op de telefoon, aanvraagformulier), Vraag Clyde blijft nagebouwd. Prototype opnieuw gemeten: `g8/r4` 0 PROBLEEM.

## Poorten, gemeten in deze sessie

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op de geraakte code- en testbestanden | rc 0 |
| Zes checks | `check:palette`, `copy`, `i18n-orphans`, `sitemap-lastmod`, `indexability`, `llms` | alle zes OK (44 namespaces in 3 talen, 33 sitemappaden met lastmod, 37 pagina's met robotsbeleid) |
| Build | `npx next build` | rc 0; `/[locale]/client-portal` en `/[locale]/skills/clyde` SSG voor nl en en |
| Titles en metas | lengte uit de JSON bij het schrijven (assert in `g8a_apply.py`) | nl CP 55/150, CL 48/146; en CP 57/140, CL 53/154; es CP 45/147, CL 45/153 |
| Regels in de diff | grep op de toegevoegde regels | 0 em-dash; 0x "AI Collega", DataForSEO, "jouw domein", Reel Builder |

## Deel 2, gemeten op de port (Task 6)

`npx next start -p 3048` via `detach.ps1`, zonder `.env.local`; bewijs: poort 3048 luistert en de log meldt "Ready". Eerst gemeten op `4fc8ff23`, daarna op `e177f4a5` (zie de taalfix hieronder).

| Poort | Commando | Uitkomst |
|---|---|---|
| curl | `/nl` en `/en` van client-portal, skills/clyde, home, pricing en trust | 10x 200 met de nieuwe title en H1 op beide nieuwe pagina's; home, pricing en trust ongewijzigd in title en H1 |
| Stopmomentzin | gerenderde HTML | nl: home (`regie.lines.n2`), pricing en trust tonen "Met het stopmoment aan pauzeer je een post na je akkoord nog tot vier uur voor hij live gaat."; en: pricing en trust tonen "With the stop moment on, ...". De home-sectie `regie` bestaat alleen in het Nederlands, dus de homezin verandert alleen in nl (de handover zei "drie talen"; voor pricing en trust klopt dat) |
| Tekstpariteit | `.g6` innerText van `R/golf8-client-portal.html` en `R/golf8-clyde.html` tegen `/nl/...`, regel voor regel (plaatshouders eruit, details open) | client-portal 104 = 104, 0 VERSCHIL. clyde 106 = 106, 1 VERSCHIL: de kruimel "Vaardigheden" waar het prototype "Wat Clyde maakt" toont; bewust, dat label hoort bij de header en dus bij 8b |
| Structured data | JSON-LD uit de HTML, nl en en | client-portal: Organization, WebPage (speakable, url = canonical), BreadcrumbList Home > Je klant kijkt mee, FAQPage 4 vragen. clyde: idem plus Service, BreadcrumbList Home > Vaardigheden > Werken met Clyde, FAQPage 5 vragen. Canonical per taal, hreflang nl, en, x-default. Meta nl 150/146, en 145/154 |
| Sitemap | `/sitemap.xml` | 81 URL's; `/nl` en `/en` van client-portal en skills/clyde met lastmod 2026-11-07 |
| Regels in de gerenderde tekst | `.g6` innerText plus title en meta, nl en en, beide pagina's | 0 treffers op em-dash, "AI Collega", DataForSEO, "jouw domein", Reel Builder, Voice Agent, "weekrapport pas", orchestrator, percentages, klantnamen, aanvragen via WhatsApp |
| m-g6, NL | `m-g6-webp.mjs` (huidige `m-g6.mjs` plus `Accept: image/webp` op `/_next/image` en `LOC`), 1440/1280/1024/390 | 0 PROBLEEM; schermen `ronde1b/g8/port8a` |
| m-g6, reduce | idem, `--reduce` | 0 PROBLEEM (`g8/port8a-reduce`) |
| m-g6, EN | `/en` op 1280 en 390 | 0 PROBLEEM (`g8/port8a-en`), gemeten op `e177f4a5` |
| Beelden | breedte per `img` in `.g6` op 4 breedtes | alle echte schermen op ware grootte (kalender 953, aanvraag 673, telefoon 282, Clyde-schermen 400 tot 1056); op 390 scrollen de brede schermen in hun eigen vak (`.g6-scroll`), geen paginascroll |
| Zelf bekeken | volledige schermen 1280 en 390, nl, beide pagina's | zelfde beeld als prototype r4: geen uitgerekte kaart, geen vastgeplakt blok, tabellen op 390 als kaart per rij. De gele balk op de echte kalender loopt rechts het beeld uit; dat zit in de opname (snede op 953 px), net als in het goedgekeurde prototype |
| e2e, 136 tests | `navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`, chromium, list, `PLAYWRIGHT_BASE_URL=http://localhost:3048` | 14 failed / 121 passed / 1 skipped. De nieuwe tests (content-smoke `client-portal`, navigation `/en/client-portal`) groen; `skill-clyde` is nu groen (in 7b nog rood) |
| e2e baseline | dezelfde 14 met `--grep` tegen prod (= origin/main `d542c173`) | 14 failed op prod: conversion-polish P1-A (3), P1-B NL, P1-G (3); navigation homepage, header, scroll; content-smoke home, apply, skill-voice, skill-lead. Geen regressie |

Na e2e: `test-results/.last-run.json` teruggezet, `git status` schoon.

## Taalfix na het lezen van de Engelse pagina's (`e177f4a5`)

De Engelse tekst zei acht keer "your client looks along", een letterlijke vertaling van "meekijken" die geen Engelse lezer gebruikt. De rest van de Engelse site zegt al "follow along" (how-it-works, memory, alternatives). Nu "follows along" op negen plekken: de kruimel, zes `client_portal`-teksten, de portaallink onderaan `/skills/clyde` en `llms-full.txt`. Opnieuw gedraaid op die tree: `npx next build` rc 0 (beide routes SSG), de zes `check:*` OK, curl 4x 200 met 0x "look along", pariteit ongewijzigd, m-g6 EN 0 PROBLEEM. tsc en eslint niet opnieuw: alleen JSON en tekst gewijzigd.

## Buiten 8a gezien, niet gefixt

- **App, voor Daley**: het Clyde-paneel van de klant stelt "Verplaats een bericht naar een andere dag" voor (`clyde.ts:1369`, `welcome-messages.ts:96`), terwijl de Clyde van de klant alleen leest. En een kijker ziet "Start review (2)" en "2 wachten op jou" op `/client/content`.
- **Service-schema**: `ServiceJsonLd` krijgt `name` uit `skills-data.ts` ("Clyde, AI-collega"), ook op `/en`. Dat geldt voor elke vaardigheidspagina en stond er al.

## Nog open

- Diffpagina `A/alle-paginas/golf8a-diff/index.html` en de vault-note, dan Daleys ja.
- Na zijn ja: push, PR, merge, `PAGE_DATES` op de mergedag als die na 2026-11-07 ligt, preview en prod met `vercel curl`, PSI 3x, live-sectie hier.
