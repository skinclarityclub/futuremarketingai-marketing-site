# Golf 8b: verificatie (2026-11-07)

Branch `feature/golf8b-nav` in `C:/tmp/fmai-golf6`, vanaf `docs/golf8a-live` (origin/main `4581dbcb` plus de live-sectie van 8a `ed0ebce5`). Port `6bee3f49` (11 bestanden). Niets gepusht.

## Akkoord vooraf

- **Daley**, AskUserQuestion op 2026-11-07: het nav-prototype (r4) en alle adviezen voor 8b, waaronder het nieuwsbriefvinkje standaard uit en een footer zonder Research, ManyChat, Voice Agent en Reel Builder tot golf 9 (plan "Daleys keuzes", `R/golf8-ONTWERP.md` secties Header en Footer).

## Wat er gebouwd is

- `HeaderClient.tsx`: één menu "Clyde" (zes items met een regel, SSR in de HTML), Werkwijze, Cases, Prijzen, Kennisbank, Over ons; rechts Inloggen en de enige amber knop. Weg: de AI-scan-knop, het Founding-item met het prijs-uitklapmenu, het megamenu met de groepen, Voice Agent, Reel Builder en "orchestrator". De desktopbalk vanaf `xl` (1280); daaronder het telefoonmenu in dezelfde volgorde. "Een week met Clyde" gaat in nl naar `/#een-week-met-clyde`, in andere talen naar `/how-it-works#hiw-daarna` (de home heeft de week alleen in nl).
- `Footer.tsx`: zes kolommen (Clyde, Wat Clyde maakt, Cases, Bedrijf, Leren, Juridisch) met alleen bestaande pagina's, de nieuwe tagline, "FutureMarketingAI" aaneen, LinkedIn als tekstlink. `CookieReopenButton` in de kolom Juridisch.
- `FooterNewsletter.tsx`: `useState(false)` voor het vinkje; zichtbaar label, knop "Aanmelden".
- Berichten nl, en, es (`g8b_apply.py` in `R/g8/port8b/`, met een assert op de verboden woorden): `nav.assessment`, `header.skills`, `megaMenu`, `priceMenu` en `cta` weg; `header.nav` en `header.clydeMenu` nieuw; `common.landing.footer` opnieuw opgebouwd; `common.breadcrumbs.skills_index` "Wat Clyde maakt", "What Clyde makes", "Lo que Clyde crea".
- `SkillPageTemplate.tsx`: het middelste item van de BreadcrumbList gebruikt `skills_index` in plaats van het harde "Skills".
- Tests: `navigation.spec` opent op een telefoon eerst het menu (`clickHeaderLink`); `conversion-polish` P2-B scopet de tekstcontroles tot `#main`, omdat het verborgen Clyde-menu ook "Strategie" zegt.

## Poorten, gemeten in deze sessie

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op `src/components/layout/`, `SkillPageTemplate.tsx`, beide specs | rc 0 |
| Zes checks | `check:palette`, `copy`, `i18n-orphans`, `sitemap-lastmod`, `indexability`, `llms` | alle zes OK (44 namespaces in 3 talen, 33 sitemappaden, 37 pagina's met robotsbeleid) |
| Build | `npx next build` | rc 0 (vier keer, na elke fix) |
| Regels in de diff | grep op de toegevoegde regels | 0 em-dash; 1 treffer "Voice Agent" en "Reel Builder" in een codecommentaar dat uitlegt waarom ze ontbreken |

`npx next start -p 3048` via `detach.ps1`, zonder `.env.local`; bewijs: de log meldt "Ready", curl geeft 200.

| Poort | Commando | Uitkomst |
|---|---|---|
| curl | /nl, /nl/skills, /nl/pricing, /nl/client-portal, /nl/legal/privacy, /nl/about, /nl/memory, /en, /en/skills, /en/how-it-works | 10x 200, titles ongewijzigd. /es stuurt door naar /en (`routing.ts` kent alleen en en nl) |
| Woorden in header en footer | gerenderde HTML van die tien pagina's | 0 treffers: em-dash, "AI Collega", DataForSEO, "jouw domein", Reel Builder, Voice Agent, orchestr/orkestr, ManyChat, Research, Founding, AI-Scan in de header, Geheugensysteem, "Tien vaardigheden", "Future Marketing AI", `/#skills` |
| Links tegen prototype | `golf8-nav.tpl.html` tegen `links.json` van /nl | footer 30 = 30 (tekst en href); header gelijk op de zes menu-items en vijf links. Verschil: "Clyde" is een knop met `aria-expanded` in plaats van een link naar /skills/clyde (disclosure-patroon), en het telefoonmenu staat pas in de DOM als het open is |
| Kruimel en JSON-LD | `crumbs.py`, 12 vaardigheden in nl en en | 24x 200; zichtbaar en BreadcrumbList allebei "Wat Clyde maakt" of "What Clyde makes". Het derde item verschilt al langer (JSON-LD de productnaam, zichtbaar de korte naam) |
| Eigen meting | `R/tools/m-nav.mjs`: 5 pagina's op 1440/1280/1024/390, menu dicht en open | 0 PROBLEEM in 20 metingen (`R/g8/port8b/nav`). Balk 64 px, knop 42 px op één regel, alle items op één rij, footer op 1 rij vanaf 1280. Open desktop: paneel 6/6 in beeld, hover opent, muis weg sluit, ArrowDown focust het eerste item, Escape sluit en geeft focus terug. Open telefoon: 13 links binnen beeld, laatste bereikbaar, Escape sluit. axe 0 dicht en open, js 0 |
| Eigen meting, EN en reduce | /en en /en/skills op 1280 en 390; /nl met `--reduce` | 0 PROBLEEM (`nav-en`, `nav-rm`) |
| e2e telefoon | `navigation.spec`, Pixel 7 (tijdelijke config, niet gecommit) | 35/35 groen |
| e2e desktop | `navigation.spec` | 34/35; rood alleen "should load homepage successfully" (ook rood op prod: H1 op /en nog verborgen bij de test) |
| e2e, 136 tests | navigation, nl-content-smoke, sitewide-visual-audit, conversion-polish, chromium | 12 failed / 123 passed / 1 skipped |
| e2e baseline | dezelfde 12 plus "via header", "scroll" en P2-B met `-g` tegen prod (`4581dbcb`) | 14 failed op prod: de 12 plus "via header" en "scroll", die op de branch groen zijn; P2-B groen op prod. Geen regressie |

Fixes onderweg, elk opnieuw gebouwd en gemeten: (1) op 390 duwde de amber knop de menuknop uit beeld, omdat `inline-flex` in de gedeelde klasse `hidden` versloeg; (2) `min-[1101px]:grid-cols-6` verloor van `md:grid-cols-3`, dus de footer stond op 1440 in twee rijen; nu `xl:grid-cols-6` en `m-nav` keurt meer dan één rij vanaf 1280 af; (3) P2-B werd rood door de tweede "Strategie"-treffer.

Na e2e: de tijdelijke Playwright-config verwijderd, `git status` schoon op de commits na.

## Akkoord op de diff

Diffpagina `A/alle-paginas/golf8b-diff/index.html` (A = `.../design/siteplan`), vault-note `Agency/Rapporten/2026-11-07 Golf 8b diff`. Wacht op Daleys ja.

## Gezien, niet in 8b

- `/skills` heet nog "Vaardigheden: 12 vaardigheden van Clyde" (title en H1) terwijl menu en kruimel "Wat Clyde maakt" zeggen: golf 9 (de hub).
- De vaste knop onderaan op de telefoon ("Vraag een gesprek aan · 30 min met Daley") breekt op 390 over twee regels; pagina-element, niet de header.
- `PAGE_DATES` en de sitemap niet bijgewerkt: alleen de navigatie verandert, niet de hoofdinhoud van een pagina.
