# Golf 10 kennisbank: plan (2026-11-06)

Daley gaf 2026-11-05 ~17:10Z ja op "start golf 10": eerst een plan, dan schrijven, de site-PR pas na zijn ja op de diff.
Branch `feature/golf10-kennisbank` in `C:/tmp/fmai-golf10`, vanaf origin/main `d29b63f2`. Niets pushen voor zijn ja.

Bronnen (as of 2026-11, DataForSEO Labs/Ads + live SERP, audit-map `80-Archief/fma-app-audits/2026-11-02-website-audit/design/siteplan/`):
`10-siteplan.md:1187` en r942-955; `alle-paginas/rapport-alle-paginas.html.txt` (kaarten); `alle-paginas/review/kaart-voorstellen.json`;
Daleys keuzes 11-05 ("alles volgens advies": 2a slug, K1 naar golf 10, 2027-versie direct live).

## Scope: siteplan tegen audit

De audit is nieuwer dan het siteplan en Daley koos hem. Waar ze botsen, wint de audit.

| Onderdeel | Bron | In deze PR | Reden |
|---|---|---|---|
| K1 nieuw: `/nl/kennisbank/contentkalender-maken-meerdere-klanten` + gratis template + H2 "Inhaakkalender 2027" | rapport r14, r328 | ja | keuze 2a; 2027 staat bij Drijfveermedia (#5) en Frankwatching (#7) al live op "inhaakkalender" |
| K4 `ai-agent-vs-ai-tool-marketing`: retitel "Wat is een AI-agent?", definitie 40-60 woorden onder de H1, vergelijkingstabel, PAA-H2's, alinea agentic AI | rapport r335, siteplan P2-4 | ja | 1.200/mo, 5 van 9 plekken klein |
| K3 `ai-marketing-automation-voor-bureaus`: retitel + tooltabel per taak met prijs en bron | rapport r355 | ja | drukste pijler; SERP beloont tabellen |
| `zichtbaarheid-meten-ai-overviews`: retitel + definitie + H2 "Hoe kom je in AI Overviews?" | rapport r365 | ja | "ai overview" 1.300 |
| Hub `/kennisbank`: title, H1, meta + twee ingangen (GEO, AI-marketing voor bureaus) | rapport r518, r260 | ja | H1 op GEO concurreert met de GEO-pijler (WF2 nl-01) |
| GEO-pijler: één H2 met "GEO en SEO" + link naar /skills/seo-geo | rapport r527, siteplan [05] §6 | ja | positie 92 bij PERFECT dekking: links zijn het knelpunt, niet de tekst |
| `geo-vs-seo-waar-investeren-2026`: twee PAA-vragen als H2 | rapport r532 | ja | staan in drie GEO-SERP's tegelijk |
| Contextlinks: elk NL-artikel linkt in het eerste derde naar precies één geldpagina | siteplan r945, [05] §6 regel 1 | ja | 5 van de 13 artikelen linken nu naar geen enkele geldpagina |
| Woordenlijst: Werkruimte, Klantportaal, Merkgeheugen erbij | siteplan r952, [05] P2-1 | ja (XS) | "AI-collega" NIET als term (B3, `10-siteplan.md:1335`) |
| EN-hub: alleen EN-artikelen | beslissing 15c | controleren | toont nu al alleen het ene EN-artikel; dan geen wijziging |
| AVG-artikel | siteplan golf 10 | **nee** | audit: "SECTIE op /trust", golf 6 (1 van 3 lenzen, WF2 nl-61) |
| K2 listicle planningtools | rapport r383 | **nee** | P2, pas na K1; koperlens faalt (WF2 nl-29, koper-fit 2) |
| Geldpagina's die terug linken (regels 2 en 3) | [05] §6 | **nee** | die pagina's worden herschreven in golf 6-9 |
| Uitlegvideo bij het AIO-artikel | kaart AIO | **nee** | eigen lane via sota-video |

## K1: wat het is en wat niet

WF2 zette "contentkalender template" op NIET (nl-31, koper-fit 1): wie een template zoekt, is meestal een MKB'er of student.
K1 is dus **bereik en linkanker, geen leadpagina**. De bureauhoek zit in title en H1, het template is voor iedereen bruikbaar.

- Title "Contentkalender maken voor meerdere klanten + template" (54), H1 "Contentkalender maken voor meerdere klanten", meta uit de kaart (150).
- Template: `public/downloads/contentkalender-template-2027.xlsx`, **zonder e-mailpoort** (een poort kost de linkwaarde).
  Tabbladen: Overzicht (alle klanten per week), één tab per klant (merkstem, kanaal, onderwerp, status
  concept / bij klant / goedgekeurd / gepland), Inhaakdagen 2027 (per maand).
- De inhaakdagen 2027 staan ook als HTML-tabel op de pagina zelf; dat is wat rankt.
- Datums: feestdagen en vaste regels berekend (Pasen 28-03-2027, Koningsdag di 27-04, Moederdag 9-05, Vaderdag 20-06,
  Prinsjesdag 21-09, Black Friday 26-11); maanafhankelijke en aangekondigde datums alleen met bron-URL.
- Productclaims (getoetst op fma-app origin/master `0caa1fff2`): één kalender met de content van alle klanten en een
  filter per klant (`content-engine/calendar/page.tsx:20-36`); de klant keurt goed of af in zijn portaal, afhankelijk van
  zijn rol (`client/calendar/page.tsx:19-22`). NIET claimen: dat het product een inhaakkalender maakt (de app kent alleen
  nationale feestdagen via Calendarific).

## Code

- `seoTitle` (optioneel) in de frontmatter, in `src/lib/blog.ts` en `generateMetadata`: title en H1 kunnen dan verschillen,
  zoals de kaarten vragen. H1 en JSON-LD-headline blijven `title`.
- Hub: retitel via `messages/nl.json` (`resources.*`); twee ingangen als links in de header.
- Woordenlijst: `src/lib/glossary.ts` + `glossary.*` in de messages.
- `public/llms.txt`: K1 erbij.
- Hero K1 via `scripts/generate-hero-images.mjs` (1 gpt-image-1-call, enkele centen).

## Regels

Copy schrijf ik zelf. Geen em-dashes, nooit "AI Collega" los, titles ≤60, metas ≤155. Externe cijfers met bron-URL en datum.
DataForSEO on_page verboden; er is geen nieuwe DFS-call nodig.

## Bewijs voor de diff

`npx tsc --noEmit`, `npm run lint`, `npm run build`, `check:copy`, `check:llms`, `check:indexability`, `check:sitemap-lastmod`,
`check:i18n-orphans`; `next start` lokaal, curl op alle gewijzigde URL's (200, `<title>`, H1, meta, JSON-LD, K1 in sitemap);
1280 en 390 px zonder overflow. Daarna een diffpagina in de auditmap + vault-note, en pas op Daleys ja: push en PR.
