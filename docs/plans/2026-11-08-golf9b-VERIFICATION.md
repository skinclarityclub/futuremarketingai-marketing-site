# Golf 9b: verificatie (2026-11-08)

Branch `feature/golf9b-skills` in `C:/tmp/fmai-golf6`, vanaf `docs/golf9a-live` (`e9aaa12a`, op origin/main `2b511e89`). Code: `24918a83` (port), `10550607`, `94b6630a`, `a7065966`, `18e1278f`, `ed896b9b` (Daleys wensen), `2311d62c` (sweep-spec), `df18e3aa` (meta), `3e046751` (hero-content). Plus de docs-commits van 9a-live en Task 7.

## Akkoord vooraf

- **Daley**, AskUserQuestion op 2026-11-08: het prototype van social-media en blog-factory (`R/golf9-social-media.tpl.html`, `R/golf9-blog-factory.tpl.html`), port zoals gepland (vault `Agency/Rapporten/2026-11-08 Golf 9b prototype`).
- **Daley**, nacht van 2026-11-08 (~05:10-05:25 lokaal), letterlijk:
  - "Ik ga slapen werk autonoom door tot alles klaar en perfect us je hebt ook toestemming om te merge doe wat nodig is en dat het klaar is als ik wakker wordt. We moeten trouwens ook de content in de hero upgrade naar de nieuwe demo templates"
  - "Zet vlag aan en 9c moet ook alles moet af zijn echt alles mbt de website"
  - "op mobile in de hamburger menu is de cta knop niet meteen in beeld ... los het op beste manier op maak zelf alle keuzes alles sota"
  - "op mobile in de hero de pauze knop voor de animatie linksonder bijvoorbeeld. Dan kan het geheel meer omhoog en dan zie je ook meer van de animatie in beeld"

## Wat er gebouwd is

- Port en de eerste wensen: zie de handovers `2026-11-08-website-golf9b-port-handover.md` en `-verify-handover.md` (desktop-checkout).
- `18e1278f` menu: Inloggen en de knop staan vast onderaan het menupaneel, de links scrollen erboven.
- `ed896b9b` hero op de telefoon: pauzeknop linksonder in de scène, de copy 48 px omhoog.
- `df18e3aa`: NL-meta van email-management 157 naar 154 tekens.
- `3e046751` hero-content:
  - De zeven postbeelden in `public/home/hero3` en `public/home/werk` zijn byte-gelijk aan fma-app origin/master `public/demo/brands/<merk>/posts/<slug>.webp` (md5 per bestand vergeleken, zelfde afmetingen). De merktekens waren al gelijk.
  - `h3-kal.jpg` toonde de Luwte-reel drie keer op wo 11 (dezelfde post op Instagram, TikTok en Facebook; de kalender toont geen platform). Nieuwe opname van de demo: weekweergave 9-15 nov, compact, 1767 px breed, met Dagspa Luwte TikTok en Facebook uitgefilterd. Alleen GET, daarna signOut (`R/g9/9b-tools/sessie-11-08/kal/cap2.mjs`). Uitgesneden op de oude geometrie: do en vr vallen pixel-exact op het oude beeld (gemiddelde afwijking 5,4 op 255 bij offset 0, minimaal tegen offsets van 1 en 2 px), dus ringen 1 en 3 blijven kloppen. Ring 2 en de amber overlay dekken nu één kaart; de twee extra overlays en hun zes sleutels zijn weg. De sceneDescription noemt wat de kalender toont.

## Poorten

### Build 4 (tree van `df18e3aa`), gemeten in de vorige sessie

| Poort | Commando | Uitkomst |
|---|---|---|
| Build | `npx next build` | rc 0 |
| TypeScript, ESLint | `npx tsc --noEmit`, `npx eslint` op de gewijzigde bestanden | rc 0, 0 errors |
| e2e chromium | deelselectie, 2 workers (`R/g9/9b-tools/sessie-11-08/e2e-desk.log`) | 113 passed, 12 failed, 1 skipped. 11 staan op de baseline van main (tabel onder). De 12e, `chatwidget-mocked:48` (focusring), is de bekende belastingsfout uit 9a: zie build 5 |
| mobile-menu-cta (nieuw) | 375x667 en 390x664, chromium en mobile-chrome | rood op build 3 (knop op 727 px), groen op build 4: 4 passed |

### Mobiele e2e op build 4, deze sessie

`PLAYWRIGHT_BASE_URL=http://localhost:3119 npx playwright test --project=mobile-chrome --workers=1 --reporter=line` (twee workers crashten eerder op 0xC0000142). Log `R/g9/9b-tools/sessie-11-08/e2e-mobile-build4.log`.

- **366 passed, 24 failed, 15 skipped, 54 did not run** (31,8 min). Alle 459 tests uit `--list` kregen een voortgangsregel; de 54 zijn de seriële lighthouse-groep na de eerste fout (`audit-v2-lighthouse:92`, ook rood op main).
- Groen: `mobile-sweep` (elke sitemappagina op een telefoon, mislukte loads per URL), `mobile-menu-cta`, `home-hero3` (ook de pauzeknop op 390x844), `home-week-mobile`.
- **23 van de 24 rode tests staan ook rood op main** (chromium-baseline hieronder; main heeft geen mobiele projecten, die kwamen in `94b6630a`).
- **De 24e, `chatbot.spec.ts:132`** (chat blijft staan bij navigeren), klikte de eerste `a[href*="/pricing"]`: de desktop-navlink, die op een telefoon in het dichte menu zit. Spec-drift, geen telefoonbug. Fix `be12aefd`: de zichtbare link (op een telefoon die in de footer).
- De handover noemde `nl-content-smoke` apply als nieuw rood. Hij staat op de baseline van main (`g9b-e2e-base-failing.txt` en `base2`): de test verwacht nog "Plan een gesprek", dat sinds golf 10 "Vraag een gesprek aan" heet. Zelfde voor home: de test verwacht nog "langetermijngeheugen". De baseline-tool dedupliceert op `bestand:regel`, dus home en apply staan daar als één regel.

### Baseline: rood op main (`2b511e89`), chromium, volledige run

Uit `R/g9/9b-tools/g9b-e2e-base-failing.txt` (31 regels; base2 is een herhaling met 6, allemaal in deze lijst):

| Spec | Tests rood op main |
|---|---|
| accessibility | :22 heading structure |
| apply-wizard | :232 honeypot, :247 invalid URL params (lokaal zonder sleutels) |
| audit-v2-lighthouse | :92 lh mobile nl/ |
| chatbot | :59, :68, :77, :88 (de oude zwevende knop) |
| clyde-audit | :79 panel opens (geen API-sleutel) |
| conversion-polish | :4, :13, :20, :29, :245, :256, :263 |
| fase0-visual-validation | :22 skill-clyde-faq |
| guided-demo | :78, :215 |
| homepage | :16, :45 (de key-metrics-sectie is weg; de vorige handover verwachtte groen), :51, :120 |
| i18n | :17 /en, :29 /es |
| navigation | :17 homepage |
| nl-content-smoke | :67 home en apply (verouderde verwachte zinnen) |
| performance | :35 broken requests op home |
| reveal | :30, :49 |
| skill-template-smoke | :6 clyde (clyde is sinds golf 6 een bewijspagina) |

### Build 5 (tree van `be12aefd`: `3e046751` plus de spec-fix)

| Poort | Commando | Uitkomst |
|---|---|---|
| Build | `npx next build`, `next start -p 3119` via `detach.ps1` | rc 0; curl 200 op 8 routes; ring 2 hoogte 16.15%, 1 amber overlay |
| e2e chromium, gericht | 10 specs (home-hero3, mobile-menu-cta, chatwidget-mocked, chatbot, navigation, nl-content-smoke, skill-template-smoke, sitewide-visual-audit, home-week-mobile, widget-copy), 1 worker (`sessie-11-08/e2e-b5-chromium.log`) | **195 passed, 8 failed, 1 skipped. Alle 8 staan op de baseline van main**: chatbot :59 :68 :77 :88, navigation :17, nl-content-smoke home en apply, skill-template-smoke clyde. `chatwidget-mocked:48` (focusring) is groen met 1 worker, dus de 12e uit build 4 was belasting |
| e2e mobile-chrome, gericht | home-hero3, mobile-menu-cta, home-week-mobile, mobile-sweep, chatbot, 1 worker (`sessie-11-08/e2e-b5-mobile.log`) | **21 passed, 2 failed** (5,0 min). Groen: mobile-sweep, mobile-menu-cta, home-hero3, home-week-mobile en `chatbot:132` (de fix uit `be12aefd`). Rood: `chatbot` :59 en :77, de oude zwevende knop, allebei op de baseline van main |
| Pariteit | `g9b-parity.mjs` | OK. social nl title 47 / meta 149, en 47/141; blog nl 56/134, en 54/130 |
| Woorden | `words9b` (`sessie-11-08/words9b-build5.log`) | 41 treffers, social-media en blog-factory schoon. De rest staat buiten 9b: TikTok in de kanaallijst van de home (bewust), Reel Builder en Voice Agent met "binnenkort", de roadmap in de ad-manager-FAQ, "Vaardigheid 04" en Gemini in `llms-full.txt`. Die gaan in 9c mee |
| m-g6 | `R/tools/m-g6.mjs`, social-media en blog-factory, 4 breedtes, ook met reduced motion (`R/g9/p9b-final`, `p9b-final-reduce`) | 0 problemen |
| Home | eigen `sessie-11-08/home-check.mjs` (m-g6 meet alleen `.g6`): nl 1440/1280/1024/390/375, en 1280/390 (`R/g9/p9b-final-home`) | nl schoon op alle 5 breedtes: geen overflow, geen kapotte beelden na scroll, axe 0, js 0, taallink zichtbaar, pauzeknop op 390 bij x 16 y 784 (44x44). /en: color-contrast op "ChatGPT, Claude, Buffer" (10 px, 3.78:1) en scrollable-region-focusable op de `overflow-x-auto`-tabel. **Precies dezelfde drie meldingen op prod** (`sessie-11-08/axe-en.mjs` tegen https://future-marketing.ai), dus niet uit 9b. Mee in 9c |

## Gezien, niet in 9b

- /en-home: contrast van de toolnamen onder de vergelijkingstabel en de scrollbare tabel zonder focus (staan op prod).
- `nl-content-smoke` verwacht op home en apply nog zinnen van voor golf 10.
- `chatbot.spec.ts` :59 tot :88 testen de oude zwevende knop.

## Akkoord op de diff

Daley gaf vooraf toestemming voor push, PR en squash-merge (zie boven). Diffpagina `A/alle-paginas/golf9b-diff/index.html`, vault-note `Agency/Rapporten/2026-11-08 Golf 9b diff`.
