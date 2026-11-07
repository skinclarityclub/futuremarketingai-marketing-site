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

Diffpagina `A/alle-paginas/golf8b-diff/index.html` (A = `.../design/siteplan`), vault-note `Agency/Rapporten/2026-11-07 Golf 8b diff`. Daley, één AskUserQuestion op 2026-11-07 ~23:45 lokaal, met de vijf punten erin (balk vanaf 1280, Engelse week naar how-it-works, kruimel in de JSON-LD, twee tests, Clyde als knop): **"Ja, push en merge"**.

## Gezien, niet in 8b

- `/skills` heet nog "Vaardigheden: 12 vaardigheden van Clyde" (title en H1) terwijl menu en kruimel "Wat Clyde maakt" zeggen: golf 9 (de hub).
- De vaste knop onderaan op de telefoon ("Vraag een gesprek aan · 30 min met Daley") breekt op 390 over twee regels; pagina-element, niet de header.
- `PAGE_DATES` en de sitemap niet bijgewerkt: alleen de navigatie verandert, niet de hoofdinhoud van een pagina.

## Live

| Stap | Bewijs | Uitkomst |
|---|---|---|
| PR | `gh pr create`, #104 | Vercel-preview `dpl_9dmoUZW3QseBCScRopPnS1YM3LVA` Ready, checks groen |
| Preview | `MSYS_NO_PATHCONV=1 vercel curl <pad> --deployment https://futuremarketingai-1a05e6ihu-future-marketing-ai.vercel.app` | `/nl`, `/en`, `/nl/skills/social-media`: `clyde-menu` in de HTML, nieuwe tagline, "Wat Clyde maakt"/"What Clyde makes", geen "Doe de AI-Scan" of "Clyde Orchestrator" |
| Merge | `gh pr merge 104 --squash` | squash `1b02db38`, 2026-11-07 16:59:46Z (23:59 lokaal) |
| Prod-deploy | `vercel inspect future-marketing.ai` | `dpl_2MmxFzUgy6o6BMh8SCpMscs9HcPg`, production, Ready (aangemaakt 3 s na de merge) |
| curl prod | `words.py` op tien pagina's | 10x 200, header en footer 0 treffers op de verboden woorden; `/nl` heeft `id="clyde-menu"`, de nieuwe tagline en het vinkje zonder `checked` |
| Kruimel prod | `crumbs.py`, 12 vaardigheden in nl en en | 24x 200, 0 afwijkingen tussen zichtbare kruimel en BreadcrumbList |
| Sitemap prod | `/sitemap.xml` | 81 URL's, ongewijzigd |
| PSI `/nl/client-portal` | `m-psi.mjs <url> 3`, 6 verschillende `fetchTime`'s | mobiel 100, 95, 100 (LCP 1,1 / 2,1 / 1,1 s, de H1); desktop 3x 100 (LCP 0,3 tot 0,4 s). JSON `ronde1b/g8/psi8b/nl_client-portal/` |
| PSI `/nl`, ronde 1 | idem, direct na de deploy | mobiel 91, 99, 92 (LCP = FCP 2,3 / 1,4 / 2,2 s, `p.def`); desktop 90, 100, 99. In run 0 (mobiel en desktop) wachtte de pagina op drie CSS-bestanden van de verse deploy (167 tot 545 ms per stuk, koude edge); mobiel 2 had snelle CSS en toch FCP 2,2 s (spreiding van de gesimuleerde meting). JSON `ronde1b/g8/psi8b/nl/` |
| PSI `/nl`, ronde 2 | `m-psi.mjs "https://future-marketing.ai/nl?r=2" 3`, ~20 min na de deploy | mobiel 98, 100, 100 (LCP 1,4 s); desktop 96, 99, 95 (TBT 30 tot 170 ms). JSON `ronde1b/g8/psi8b/nl-r2/` |

Geen nulmeting van `/nl` van vóór 8b in deze sessie (de eerdere PSI-mappen g6 tot g8a meten andere pagina's), dus de desktop-TBT op de home (30 tot 230 ms over zes runs) is niet tegen een oude waarde te leggen. 8b haalt code weg uit de header (megamenu, prijsmenu, twaalf iconen), geen nieuwe scripts.

## Nog open

- Golf 9 (plan): Strategie en Binnenkort in de footer en op de hub, de rest van "orchestrator" (home-FAQ q4, integraties, assessment q9, about infra), en de hub `/skills` die nog "Vaardigheden" heet.
- Deze live-sectie staat op branch `docs/golf8b-live` (vanaf `1b02db38`, niet gepusht) en gaat mee met de volgende website-PR.
