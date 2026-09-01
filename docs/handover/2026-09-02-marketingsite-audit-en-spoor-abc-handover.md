# Handover: marketingsite-audit + spoor A/B/C (2026-09-02)

## START PROMPT (volgende sessie)

```
Lees eerst VOLLEDIG, in deze volgorde:
  1. Futuremarketingai/docs/handover/2026-09-02-marketingsite-audit-en-spoor-abc-handover.md
  2. ~/.claude/projects/C--Users-daley-Desktop-fma-app/memory/MEMORY.md
  3. de topic-memory fmai-website-volledige-audit-2026-09-01.md
  4. de zeven deelrapporten in Futuremarketingai/docs/audits/2026-09-01-*.md

Werkbomen:
  site    C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs   branch main   HEAD 1ba0798
  product C:\Users\daley\Desktop\fma-app-wt-demo                 branch master HEAD 61c0580eb
  (de HOOFDMAP c:\Users\daley\Desktop\fma-app staat ~380 commits achter op origin/master
   en zit op fix/before-after-photo-plate — NIET daarin werken.)

Eerste concrete actie: bepaal met Daley of de KvK-inschrijving eruit is. Zo niet, dan is
dat de enige taak die vandaag telt — €85,15, twintig minuten, 1-3 weken doorlooptijd, en
hij blokkeert Google Bedrijfsprofiel, Meta Business Verification en elke externe
vermelding. Alle site-verbeteringen hierna leveren niets op zolang er niemand komt kijken.

Pas als de KvK loopt: pak de GTM op (docs/gtm/, 80 taken, 0 afgevinkt, prospectlijst
bevat alleen "Fictional example"-rijen).

Harde constraints:
  - GEEN /api/demo/reset draaien zonder te weten wat de gedeployde build bevat; die route
    draait de seed van PRODUCTIE, niet van je werkboom. Lokaal itereren via npx tsx.
  - De demo-org (00000000-0000-4000-8000-000000000000) is de screenshot-bron. Niet wissen.
  - fma_clients.active_skills is een AUTORISATIE-input, geen instelling. Wijzigen = rechten
    wijzigen. SKC staat sinds 2026-09-01 correct op tien id's.
  - Elke claim op de site moet gemeten zijn. De audit vond vijftien valse claims; drie
    daarvan staan nog open (zie Bekende gaps).
```

---

**Commits:** site `1ba0798` · product `61c0580eb`
**Branch:** beide op hun hoofdbranch, alles gemerged
**Scope:** volledige audit van future-marketing.ai (copy, design, SEO, GEO, zoekvraag, extern signaal, product-vs-site), gevolgd door drie sporen uitvoering — lekkage stoppen, systeem tonen, demo-omgeving repareren.

---

## Wat is er gedaan

**Zeven parallelle deelaudits**, rapporten in `docs/audits/2026-09-01-*.md`, plus 94 screenshots in `docs/audits/screens-2026-09-01/` en `app-screens-2026-09-01/`.

**Elf PR's gemerged over twee repo's.**

Site (`Futuremarketingai/fmai-nextjs`):
- #39 lekkage gestopt — afbeeldingsredirect, hreflang-header, twee 404-links, meta-description, cookiebanner, `check:llms`
- #40 `/how-it-works` met drie productschermen + in de hoofdnavigatie
- #41 strategielaag op de homepage + missietekst herschreven
- #42 productschermen op de skills-pagina's
- #43 systeemplaat + kanalenstrip
- #44 echte merktekens (monochroom, via simple-icons)
- #45 LinkedIn-glyph geconsolideerd in `BrandMark`

Product (`fma-app`):
- #631 chipslek (elke tenant zag SKC-klantnamen) + lege demo-kalender + lege goedkeuringen
- #633 seed brak af op een permissiefout en liet de org halverwege leeg
- #634 `fma_content_pillars` miste `account_key` + lege goedkeuringskaarten
- #636 zeven SEO-tabellen geseed, zodat elk veld op het SEO/GEO-scherm een waarde heeft

**Eén productiedata-wijziging:** `fma_clients.active_skills` voor SkinClarity van vier naar tien id's. Oude waarde voor rollback: `["reporting","socialMedia","clyde","manychatDm"]`.

---

## Huidige staat

| Component | Status | Werkt |
|---|---|---|
| Site technisch (sitemap, canonical, hreflang, schema, SSR) | gezond, live geverifieerd | ja |
| `og:image` per artikel | gerepareerd, geeft 200 | ja |
| Productschermen op de site | 5 pagina's, 4 beelden | ja |
| Systeemplaat + kanalenstrip | live | ja |
| Demo-organisatie | volledig geseed | ja |
| SEO/GEO-scherm in de demo | alle velden gevuld | ja |
| Sindy's klantportaal | tien vaardigheden actief | ja |
| GTM-uitvoering | **0 van 80 taken** | nee |
| KvK-inschrijving | **ontbreekt** | nee |
| Inbound leads | **nul, ooit** | nee |
| Stripe-billing | code compleet, nooit aangezet | n.v.t. |

---

## NEXT — volgorde

1. **KvK-inschrijving.** €85,15, twintig minuten werk, 1-3 weken doorlooptijd. Blokkeert Google Bedrijfsprofiel, Meta Business Verification en elke zakelijke verificatie. Enige taak met wachttijd, dus als eerste de deur uit.
2. **GTM uitvoeren.** `docs/gtm/` bevat de LinkedIn-profielcopy, contentkalender en vijf-touch outreach-sequentie — geschreven in maart, nooit gebruikt. Vervang `target-agencies.csv` (drie fictieve rijen) door echte Nederlandse bureaus. Dit is het enige kanaal dat binnen weken een klant kan opleveren.
3. **De twee dode kennisbank-artikelen herrichten.** Ze mikken op "AI Marketing Medewerker" (0-10 zoekopdrachten/mnd). Richt ze op categorieën met bewezen volume.
4. **DPIA uitbreiden** van 6 naar 10 skill-categorieën, of vaststellen dat 6 klopt.
5. **Meet GSC opnieuw begin oktober.** De SEO-PR's #32-#38 zijn pas eind augustus gemerged; deze sessie voegde er zeven bij. Voor "gaat het beter?" is dat nu nog te vroeg.

---

## Bekende gaps / limitaties

**Bewust niet opgelost:**
- **DPIA dekt 6 skill-categorieën terwijl er 10 draaien** (`llms-full.txt` ~regel 328). Niet met een getal "gerepareerd" — dat is een AVG-vraag, geen tekstfout.
- **`foundingDate` staat op 2024-01-01** in het Organization-schema; hero zegt "sinds 2025", domein geregistreerd 2025-07-03. Welk jaar klopt is een bedrijfsfeit.
- **Restclaim op de homepage:** "Channels (IG, LinkedIn) plus CTA-mapping geactiveerd" — er is geen LinkedIn-client. Hoort in een copy-ronde.
- **`skills-seo-geo` toonde eerst geen beeld** omdat het scherm leeg was; opgelost aan de bron (#636) in plaats van door het beeld te laten vallen.

**Positioneringswijziging die Daley moet blijven dragen:** `about.mission.text` zei "Clyde neemt de uitvoering, jij doet strategie". Dat sprak het product tegen (28 strategiesessies, 1.558 agenda-rijen, 104 zelfherwegende pijlers) en vanaf #41 ook de homepage. Herschreven naar "Clyde draagt het werk van strategiesessie tot posts, jij houdt de regie". Terugdraaien is één sleutel in `messages/{nl,en,es}.json`, maar dan moet de homepage-sectie mee terug.

**Navigatie-omkering:** `/how-it-works` stond sinds 2026-06-03 bewust alleen in de footer (IA teruggebracht naar vijf items). Nu terug in de hoofdnavigatie, want de pagina toont sindsdien productschermen. Beide overwegingen staan naast elkaar in `HeaderClient.tsx`.

**Drie correcties op eigen bevindingen tijdens de sessie:** de AI-Scan werkte wél (het defect was de cookiebanner erbovenop); de betaalstraat is gebouwd maar nooit aangezet ("geen betaalstraat" was verkeerd); LinkedIn is niet uit simple-icons verwijderd op hun verzoek maar op basis van hun gepubliceerde voorwaarden.

**Meetvalkuil:** `fma_gsc_metrics.top_queries`/`top_pages` bevatten een 7-daags rollend venster op één datumrij. Optellen over maanden telt dubbel — gebruik ze als rangorde, niet als totaal.

**Nog niet gedaan:** het onboardingscherm toont Nederlandse UI met Engelse copy ("Workspace is ready" naast "Stap 1 van 11"). Zichtbaar in de screenshot op `/how-it-works`. Daley wilde eerst het geheel zien.

---

## Key files changed

**Site:**
- `src/components/marketing/AppScreenshot.tsx`, `BrandMark.tsx`, `PlatformStrip.tsx` (nieuw)
- `src/components/how-it-works/SystemFlow.tsx` (nieuw)
- `src/components/skills/SkillPageTemplate.tsx` — `SKILL_SCREENSHOTS` op slug
- `src/components/layout/HeaderClient.tsx` — how-it-works terug in de nav
- `src/components/interactive/CookieConsentBanner.tsx` — reserveert eigen hoogte
- `src/components/founding/FoundingCounter.tsx` + `src/lib/constants.ts` — verlopen cohortdatum verbergt zichzelf
- `src/i18n/routing.ts` — `alternateLinks: false`
- `scripts/check-llms-consistency.mjs` (nieuw) + `npm run check:llms`
- `public/kennisbank/` (was `public/blog/`), `public/screenshots/*.webp`
- `next.config` redirect `/blog/:slug*` raakt de afbeeldingen niet meer

**Product:**
- `src/lib/demo/seed.ts` — voorwaartse content, goedkeuringen met beschrijving, zeven SEO-tabellen, permissiefout niet-fataal, `account_key` op pillars
- `src/components/calendar/calendar-config.ts` — `ACCOUNT_CONFIG` is stijl-opzoeking, geen startinhoud
