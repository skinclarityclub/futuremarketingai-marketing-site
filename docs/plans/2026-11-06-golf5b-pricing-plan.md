# Golf 5b /pricing: plan (2026-11-06)

Daley 2026-11-06: golf 10 live (#93), "Ga door" = golf 5b. Eerst dit plan, dan copy, de PR pas na zijn ja op de diff.
Branch `feature/golf5b-pricing` in `C:/tmp/fmai-golf10`, vanaf origin/main `53f422a7` (na #94). Niets pushen vóór zijn ja.

> **Besluiten Daley 2026-11-06 (~02:50 lokaal, AskUserQuestion):** (1) aanpak **A**: herschrijven binnen de bestaande
> componenten, geen nieuw prototype; (2) herijkingstermijn **elk halfjaar**, zo op /pricing; (3) de hotfix
> "vijftien -> tien klantmerken" op de home is los gemerged als **#94** (`53f422a78`).

Bronnen: `design/port/PLAN-port-golf5.md:18` (5b = /pricing rewrite + /founding-member 301 naar `/pricing#founding`),
`design/siteplan/10-siteplan.md` r193, r614-632, r1223; `alle-paginas/rapport-alle-paginas.html.txt` r567, r1102-1104, r1158, r1173, r1217-1273;
`design/ronde1b/golf5-ONTWERP.md` (toon en rekensom van home `#prijs`, live sinds golf 5); `KEUZES-2026-11-03.md` keuze 5 en 6.

## Al gedaan, valt uit 5b

- SSR "€ 0 /mo": de server-HTML van /nl/pricing toont echte bedragen (gemeten in de build van 2026-11-06).
- "launch", "CSM" en "SLA" staan niet meer in `pricing` of `founding-member` (golf 0).
- Hotfix #94 (`53f422a78`, live): de home `#prijs`-titel, de sub en FAQ n8 zeiden "vijftien klantmerken", terwijl het lijstje "10" zei.

## Nieuwe opbouw /pricing (NL leidend, EN dezelfde opbouw)

| # | Sectie | Inhoud | Bron |
|---|---|---|---|
| 1 | Hero | H1 "Wat kost Clyde?", lead met "per maand" en Founding als het aanbod van nu, plus een zichtbare datum | siteplan r193, r620; audit r1273 |
| 2 | `#founding` | Het aanbod: €997 per maand, 10 klantmerken, €299 per extra, €0 onboarding, tarief vast; teller van de 10 plekken; voordelen en "waarom 10 plekken" uit /founding-member | siteplan r620; home `#prijs` |
| 3 | Wat erin zit | In de taal van de home: Voor jou, stopmoment, portaal op naam van je bureau, weekrapport, WhatsApp-lijn. Voice Agent en Reel Builder "binnenkort" | siteplan r621-622, r927 |
| 4 | Rekenvoorbeeld | Prijs per klantmerk bij 5, 10 en 15 klantmerken; de bestaande schuif blijft als hulpmiddel | siteplan r622 |
| 5 | Latere tarieven en caps | Een echte `<table>`: Growth, Professional, Enterprise ("actief zodra de tien plekken bezet zijn"), caps per vaardigheid | siteplan r623; home `#prijs` tabelkop |
| 6 | Credits | Wat een credit is, in gewone taal; de credit packs als bijzaak | siteplan r623 |
| 7 | Vragen | Werkruimte, credit, opzeggen, proefperiode, tien plekken vol, "Wat kost een AI-agent voor een marketingbureau?" (link /alternatives), plus Founding-vragen q1-q4 van /founding-member (q2 gecorrigeerd) | siteplan r623-626; audit r1158 |
| 8 | Afsluiting | "Vraag een gesprek aan" naar /apply; links naar /alternatives, /trust, /how-it-works | siteplan r632; advies 9a |

Weg: "Premium partnerships", "swing-months", "Pro" naast "Professional", de em-dash in `pricing.tiers.subtitle`, en "10 per jaar" (keuze 5).

## Techniek

- 301 `/:locale/founding-member` naar `/:locale/pricing#founding` in `next.config.ts` (`permanent: true`). Testen of Next de `#` in `destination` laat staan. De route `founding-member/page.tsx` gaat weg, net als de entry in de sitemap (`sitemap.ts:26`) en die in `breadcrumb-config.ts:33`.
- Links naar /founding-member omzetten naar `/pricing#founding`: `HeaderClient.tsx:114,117`, `Footer.tsx:148`, `ServicesBento.tsx:150`, `TierBentoCard.tsx:235`, `seo-config.ts:101`, `concierge-tools.ts:79,160`, `public/llms.txt:19`.
- `PricingJsonLd.tsx` herschrijven. Eruit: "unlimited workspaces", "All 12 skills", "white-label and API access" en "monthly strategy call". Daarnaast: tekst per locale, geen em-dashes, `pricePerWorkspace` met unitText "per workspace per month", seller `@id` = ORG_ID, en de offers onder SoftwareApplication `#clyde`.
- `lastmod` van /pricing in `seo-config.ts` bijwerken.
- Hergebruik: `WorkspaceSlider`, `FoundingCounter` en `pricing-data.ts` blijven de bron. Het getal 10 inbegrepen komt in `pricing-data.ts`, zodat de copy niet meer los een getal draagt.

## Keuze voor Daley: hoe ziet het eruit

- **A (advies): herschrijven binnen de bestaande componenten.** Nieuwe copy, volgorde en tabellen. Typografie en kleuren volgen de home-secties van golf 5 (`start.css`-tokens), maar zonder nieuw prototype. Dit kan vóór de campagne van 9 november live.
- **B: via de ontwerppijplijn van golf 5.** Een prototype in `ronde1b`, een presentatie, dan `port_section.py`. Visueel één geheel met de home, maar twee tot drie keer het werk, en het haalt 9 november waarschijnlijk niet.

## Open vragen

1. Herijkingstermijn (open vraag 2 van golf 5): de site zegt nu op vijf plekken "elk halfjaar" en `pricing-data.ts` zegt "every 6 months". Voorstel: halfjaar bevestigen en zo op /pricing zetten.
2. A of B (zie hierboven).
3. Founding-retentie (keuze 3a, lane B #1938 live): FAQ q7 belooft nu "de bewaartermijn van het lagere tier". Ik neem de tekst over van wat #1938 live zette, en toets die tegen fma-app origin/master.

## Regels

Copy schrijf ik zelf. Geen em-dashes, nooit "AI Collega" los, titles ≤58 (audit r1173), metas ≤155. Prijzen uit `pricing-data.ts` en op de dag van de push opnieuw tegen de live site. Elke productclaim toetsen tegen fma-app origin/master. Geen DataForSEO-calls.

## Voor de bouwer (opvolger)

- Huidige copy van `pricing` en `founding-member` staat in `messages/{nl,en,es}.json`. Claims om tegen fma-app origin/master te toetsen voor ze meegaan: Professional "maandelijkse strategiecall" (de audit haalt hem uit de JSON-LD), Founding "Maandelijkse Founder-calls", "Voorrang in de ontwikkel-queue", "Vroege toegang", FAQ q5 "4 weken partnership-setup", q8 "export binnen 30 dagen".
- Tests die /founding-member noemen: `tests/e2e/{conversion-polish,fase0-visual-validation,navigation,nl-content-smoke,sitewide-visual-audit}.spec.ts` en `_audit-v2-config.ts`.
- `QuickApplyTeaser` (alleen op /founding-member) en `MAX_PARTNERS_PER_YEAR` in `pricing.cta.description`: bij weghalen van de route meenemen of verwijderen; "10 per jaar" moet weg (keuze 5).
- Worktree heeft een ECHTE `node_modules` (robocopy), dus `next build` werkt; een junction breekt Turbopack.

## Bewijs voor de diff

`tsc`, `lint` (geen nieuwe errors), `build`, `check:copy|llms|indexability|sitemap-lastmod|i18n-orphans`; `next start`: /nl/pricing en /en/pricing 200, `<title>`, H1, meta, Offer-JSON-LD valide, `/nl/founding-member` 301 naar `/nl/pricing#founding`, geen link meer naar /founding-member in de HTML; 390 en 1280 px zonder overflow. Daarna een diffpagina, een vault-note en Daleys ja.
