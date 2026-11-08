# Golf 9c: verificatie (2026-11-08)

Branch `feature/golf9c-skills` in `C:/tmp/fmai-g9b-base`, na de 9b-merge gerebased op origin/main `b58a243d` (#106). Code: `77781252` (de port van reporting en seo-geo plus de open site-punten, eerder `e52e57b2`), `80c804f0` (de vergelijkingstabel op /en), `3395241e` (buildfix), `f9db9f56` (copy), `70154482` (layout en a11y), `de2d7145` (lastmod), plus de spec-commit en de docs-commits.

## Akkoord vooraf

- **Daley**, AskUserQuestion op 2026-11-08: port de vier vaardigheidspagina's zoals gepland; 9c (reporting en seo-geo) pas nadat REPORT_CLYDE_TEXT aan staat.
- **Daley**, nacht van 2026-11-08 (~05:10-05:25 lokaal): "Zet vlag aan en 9c moet ook alles moet af zijn echt alles mbt de website", plus de toestemming om te mergen ("je hebt ook toestemming om te merge doe wat nodig is"). REPORT_CLYDE_TEXT staat sinds die nacht aan op fma-app prod (redeploy `fma-bfp3a3q8t`).

## Wat er gebouwd is

- **Reporting en seo-geo** zijn bewijspagina's uit de prototypes `R/golf9-reporting.tpl.html` en `R/golf9-seo-geo.tpl.html`, met echte demoschermen van Dagspa Luwte (7 webp's in `public/proof/`). De screenshot-tak van `SkillPageTemplate` had geen slug meer en is weg, met zijn twee beelden.
- **Claims getoetst tegen fma-app origin/master `83147d844`**:
  - "Elke vrijdag een rapport": `seo-report-weekly-enqueue` draait `0 13 * * 5`.
  - De AI-meting gebruikt ChatGPT, Perplexity en Google AI Overviews: `src/lib/geo/providers`.
  - SEO-rapporten gaan via WhatsApp naar de klant: `src/lib/seo/report-delivery.ts`.
  - De knoppen Uitvoeren en Annuleren op WhatsApp bestaan: `whatsapp-api.test.ts:191`.
- **De rest van de site** (uit `77781252`):
  - geen WhatsApp-goedkeurzinnen meer;
  - geen "picks the right skill";
  - Gemini niet meer als meetbron, en geen "jouw domein" in de chat-tekst;
  - geen productroadmap in de ad-manager-FAQ;
  - geen "Vaardigheid 0N" in de eyebrows;
  - titles en metas onder 58/155.
- **Deze sessie erbij**:
  - `80c804f0`: op /en halen de toolnamen onder de vergelijkingstabel weer contrast (`text-text-muted`, 11 px), en de scrollbare tabel krijgt focus (`tabIndex`, `role="region"`, gelabeld door de kop).
  - `3395241e`: de 9c-commit bouwde niet. Een apostrof in "agency's" sloot de string in `skill-i18n.ts:167` af.
  - `f9db9f56`: "Maandagochtend, als jij het hebt nagekeken, staat het weekrapport als PDF in de WhatsApp van de klant", plus twee WhatsApp-berichten met "Nova Digital heeft het eerst nagekeken". Dat is de verboden claim "de klant ziet het weekrapport pas na jouw akkoord" (golf 8- en 9-plan, niet letterlijk bewezen). De woordcheck zocht alleen op "weekrapport pas" en miste hem. Verder is ManyChat DM als vaardigheid uit een kennisbankartikel (sinds 9a valt die onder Lead Qualifier), en is de em-dash uit de aria-label van de Clyde-knop.
  - `70154482`: H1's met een lang samengesteld woord passen op 390 px: artikel en legal krijgen text-3xl onder sm, en alle H1's hier en de bewijspagina-H1 krijgen `hyphens:auto` en `overflow-wrap:break-word`. De typpuntjes in de geheugendemo zijn `aria-hidden`.
  - `de2d7145`: /apply, /contact en /skills/clyde krijgen de mergedag als lastmod.
  - Specs: `chatbot` :59-:88 volgen de huidige knop. De opener verdwijnt zolang het paneel open is, de sluitknop zit in de header, Escape sluit pas als de focus in het paneel staat, en aria-modal geldt alleen onder lg. `nl-content-smoke` gebruikt de zinnen van na golf 10 en 9c, plus seo-geo. `skill-template-smoke` houdt alleen de drie sjabloonpagina's over. `mobile-sweep` meet overflow tegen `clientWidth` en negeert WebKits afgebroken RSC-prefetches.

## Poorten

Build 4 (tree van `de2d7145`), `next start -p 3119` via `detach.ps1`.

| Poort | Commando | Uitkomst |
|---|---|---|
| Build | `npx next build` | build 1 rc 1 (de apostrof), build 2-4 rc 0 |
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op de 20 gewijzigde ts/tsx-bestanden | 0 fouten uit deze branch. `MemoryLiveComparison.tsx:70` (setState in een effect) staat ook op main; 9c raakt alleen regel 335 |
| Zes checks | `npm run check:{palette,copy,i18n-orphans,sitemap-lastmod,indexability,llms}` | alle zes OK |
| Pariteit | `g9b-parity.mjs http://localhost:3119 R reporting seo-geo` | OK: reporting nl 53/142, en 50/143; seo-geo nl 57/154, en 58/154 |
| Eigen meting (m-g6) | `PAGES=reporting=skills/reporting,seo-geo=skills/seo-geo node tools/m-g6.mjs ... --base http://localhost:3119`, ook `--reduce` (`R/g9/p9c-b4`, `p9c-b4-reduce`) | 0 PROBLEEM op 1440, 1280, 1024 en 390. Build 3 had 1: de reporting-H1 liep 9 px uit zijn vak op 390 ("marketingrapportage") |
| Overflow op 390 | `g9/9c-tools/overflow-probe.mjs` | scrollWidth 390 op `/nl/kennisbank/ai-marketing-medewerker` (was 395), `/nl/legal/terms`, `/nl/skills/reporting` |
| axe /en | `g9/9c-tools/axe-en2.mjs` (scrolt tot het einde en wacht 1,2 s) | 0 op 1280 en 390. Prod nu: 3 bekende plus `aria-prohibited-attr` |
| Woorden, hele site | `python -I g9/9c-tools/words9c.py http://localhost:3119` (73 sitemappagina's nl en en, plus llms) | 31 treffers, allemaal bekeken en bewust gelaten: de subverwerkerslijst in legal en privacy (DataForSEO, ManyChat, Gemini moeten daar juridisch kloppen), en algemene GEO-uitleg in vier kennisbankartikelen (Gemini als AI-engine, "jouw domein" als begrip, DataForSEO als bron van een eigen telling). Geen title of meta boven de grens. llms.txt en llms-full.txt schoon. REVIEW: TikTok alleen in de kanaallijst en als "doet Clyde niet" bij ads; Voice Agent en Reel Builder alleen als binnenkort |
| e2e chromium, gericht | home-hero3, mobile-menu-cta, chatwidget-mocked, chatbot, navigation, nl-content-smoke, skill-template-smoke, sitewide-visual-audit, home-week-mobile, widget-copy, accessibility; 1 worker (`R/g9/9c-tools/e2e-9c-chromium.log`) | 210 groen, 3 rood, 1 overgeslagen. `accessibility:22` en `navigation:17` staan op de baseline van main (`g9b-e2e-base-failing.txt`). `nl-content-smoke` apply was mijn eigen nieuwe verwachting: "Vertel ons" staat niet in de server-HTML. Vervangen door "Daley kijkt zelf naar elke aanvraag", daarna nl-content-smoke plus skill-template-smoke 24/24. Van de baseline nu groen: chatbot :59 :68 :77 :88, nl-content-smoke home en apply, skill-template-smoke |
| e2e mobile-chrome, gericht | home-hero3, mobile-menu-cta, home-week-mobile, mobile-sweep, chatbot; 1 worker (`R/g9/9c-tools/e2e-9c-mobile.log`) | 23/23 groen, ook chatbot :59 en :77 (op 9b nog rood) en de sweep over elke sitemappagina met de nieuwe `clientWidth`-meting |
| mobile-safari | kan lokaal niet (CSP plus WebKit) | na de merge tegen prod, zie de live-sectie |

## Gezien, niet in 9c

- App-kant, niet op de site op te lossen:
  - de blogochtendreview in de demo labelt artikelen als "Instagram";
  - een SERP-slug in de demo eindigt op "-2".
- De subverwerkerslijst noemt nog ManyChat en Gemini. Of die nog verwerken, is een juridische vraag voor Daley, geen copy.
