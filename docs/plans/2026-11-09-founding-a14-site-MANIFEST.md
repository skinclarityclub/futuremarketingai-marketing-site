# Founding A1.4 op de site: canoniek feitenblok en classificatiemanifest

Spoor `founding-site`, nacht van 9 november 2026. Bron: fma-app `docs/plans/2026-11-09-founding-a14-credits-PLAN.md` §1, §2, §3, §8 en §11.
Basis: `origin/main` e3ef66b7, branch `feature/founding-a14-site`.

## 1. Canoniek feitenblok

Elk oppervlak put hieruit. Getallen staan in `src/lib/pricing-data.ts` en `src/lib/constants.ts`; copy die een getal noemt, krijgt het als parameter waar de component dat toelaat.

| Feit | NL | EN | ES |
|---|---|---|---|
| Prijs | €1.297 per maand excl. btw, 5 klantmerken inbegrepen | €1,297 per month excl. VAT, 5 client brands included | €1.297 al mes sin IVA, 5 marcas cliente incluidas |
| Extra merk | +€199 per klantmerk per maand, tot 15 | +€199 per client brand per month, up to 15 | +€199 por marca cliente al mes, hasta 15 |
| Credits | 1.500 credits per klantmerk per maand, in één pot voor je bureau | 1,500 credits per client brand per month, in one pool for your agency | 1.500 créditos por marca cliente al mes, en una bolsa para tu agencia |
| Voorbeeldmaand per merk | ~20 unieke stukken (12 posts, 4 carrousels, 4 shorts uit eigen beeldmateriaal), ~40 plaatsingen op Instagram, Facebook, LinkedIn, TikTok en YouTube Shorts; X en Threads waar ze bij het merk passen; plus een blog, een onderzoeksmemo, een SEO/GEO-check, een maandrapport en Clyde | ~20 unique pieces (12 posts, 4 carousels, 4 shorts from your own footage), ~40 placements on Instagram, Facebook, LinkedIn, TikTok and YouTube Shorts; X and Threads where they fit the brand; plus a blog, a research memo, an SEO/GEO check, a monthly report and Clyde | ~20 piezas únicas (12 posts, 4 carruseles, 4 shorts con tu propio material), ~40 publicaciones en Instagram, Facebook, LinkedIn, TikTok y YouTube Shorts; X y Threads donde encajen con la marca; más un blog, un memo de investigación, un chequeo SEO/GEO, un informe mensual y Clyde |
| Nakijken | Je bureau keurt zelf goed en houdt het klantcontact. Begeleiding kan op aanvraag | Your agency approves the work itself and keeps the client contact. Guidance is available on request | Tu agencia aprueba el trabajo y mantiene el contacto con el cliente. El acompañamiento está disponible bajo petición |
| Onboarding | €0 | €0 | €0 |
| Prijsbescherming | Prijs 12 betaalde maanden vast, maandelijks opzegbaar | Price fixed for 12 paid months, cancel monthly | Precio fijo durante 12 meses pagados, cancelación mensual |
| Bijkopen | 500 credits €40, 2.000 €160, 5.000 €400 | 500 credits €40, 2,000 €160, 5,000 €400 | 500 créditos €40, 2.000 €160, 5.000 €400 |
| Niet inbegrepen | AI-video, voice-over, advertenties | AI video, voice-over, ads | vídeo con IA, locución, anuncios |
| Cohort | 3 plekken in het eerste cohort; teller telt alleen getekende plekken (nu 0 van 3) | 3 spots in the first cohort; the counter counts signed spots only (now 0 of 3) | 3 plazas en el primer grupo; el contador solo cuenta plazas firmadas (ahora 0 de 3) |
| Daarna | Reguliere pakketten volgen na het Founding-cohort | Regular plans follow after the Founding cohort | Los planes regulares llegan después del grupo Founding |

Prijzen bij gangbare aantallen: 5 merken €1.297, 6 €1.496, 10 €2.292, 15 €3.287.
Tariefkaart V2 (plan §2), voor zover de site hem noemt: statische post 20, carrousel 30, short 60, platformvariant 2, nieuw beeld 10, blog 20, onderzoeksmemo 50, SEO/GEO-check 200, maandrapport 100, Clyde-beurt 1/6/17 (Haiku/Sonnet/Opus). Tarieven gaan in de 12 vaste maanden alleen omlaag. Inbegrepen credits vervallen aan het eind van de maand; bijgekochte blijven 12 maanden geldig.

**Nooit op de site:** halve prijs in de eerste maand; €997 als aanbod voor nieuwe bureaus; Growth, Professional of Enterprise als koopbaar pakket; "onbeperkt", "levenslang", "zolang je klant blijft", "ilimitado", "de por vida" voor het nieuwe aanbod; AI-video als belofte; een checkout of betaalknop; iets wat de afspraak van bestaande founding partners wijzigt.

## 2. Classificatiemanifest

Gemeten op `origin/main` e3ef66b7 met het patroon uit de handover. Het brede patroon geeft ±1.400 treffers; het grootste deel is andere context (`marca` in ES = merk, `credits` als eenheid, `onboarding` als proces, `workspace` als product-term, SVG-paden). Classificatie per bestand of namespace, verkoopregels individueel.

Legenda: **V** = huidige verkoop (aanpassen), **L** = legacy (laten, eigen label), **H** = historisch bewijs (laten), **A** = andere context (laten).

### Data en componenten

| Bestand | Klasse | Actie |
|---|---|---|
| `src/lib/pricing-data.ts` | V | Founding naar 1.297 / 5 / +199 / max 15 / 1.500 per merk; Growth/Professional/Enterprise en het workspace-model eruit; bijkooppakketten erbij |
| `src/lib/constants.ts` | V | `FOUNDING_SPOTS_TOTAL` 10 → 3; `FOUNDING_SPOTS_TAKEN = 0` |
| `src/app/[locale]/(marketing)/pricing/page.tsx` | V | Latere-tarieventabel, tier-matrix en "later"-kolom eruit; voorbeeldmaand erin; één regel D2 |
| `src/components/pricing/WorkspaceSlider.tsx` | V | Alleen Founding, 1–15 merken, geen latere tier |
| `src/components/pricing/SkillsTierMatrix.tsx` | V | Niet meer gebruikt → verwijderen |
| `src/components/founding/FoundingCounter.tsx` | V | "0 van 3 plekken bezet" |
| `src/components/seo/PricingJsonLd.tsx` | V | Eén offer: Founding €1.297 |
| `src/components/seo/OrganizationJsonLd.tsx` | V/A | Alleen prijsclaims aanpassen |
| `src/components/home/PricingTeaser.tsx` + `src/app/[locale]/page.tsx` r.486-515 | V | EN/ES-home: alleen Founding |
| `src/components/home/start/StartPrijsVragenSecties.tsx` | V | NL-home: latere-tarieventabel eruit |
| `src/components/skills/SkillPageTemplate.tsx` + `src/lib/skills-data.ts` | V | Caps per tier (Growth/Pro/Ent/Founding) eruit; capaciteit loopt via credits |
| `src/lib/apply/*`, `src/components/apply/*`, `src/app/api/apply/route.ts` | V/A | Tier-opties in het formulier naar Founding + "weet ik nog niet"; enum in de API blijft (oude aanvragen moeten blijven valideren) |
| `src/lib/chatbot/**` (tool-data, knowledge, tools, personas, prompt-builder, fit, skill-i18n) | V | Kennisbank en tools naar het canonieke blok |
| `src/components/chatbot/widget-copy.ts`, `demo/scenarios.ts` | V/A | Suggesties over Growth eruit |
| `src/lib/email/apply-templates.ts`, `assessment-templates.ts` | V | Prijsclaims naar canon |
| `src/components/motion/CountUp.tsx` r.54 | A | Commentaar met "€997" als voorbeeld; laten |
| `src/components/home/week/WeekSection.tsx` | A | SVG-pad bevat "1.297"; laten |
| `src/app/robots.ts` | A | "enterprise AI products"; laten |
| `src/components/home/*.css` | A | CSS-waarden; laten |
| `public/llms.txt`, `public/llms-full.txt` | V | Prijsparagrafen naar canon; tiers eruit |

### Messages (`messages/{nl,en,es}.json`)

| Namespace | Klasse | Actie |
|---|---|---|
| `pricing.*` | V | Herschreven naar canon |
| `home.prijs`, `home.vragen`, `home.start`, `home.afsluiting`, `home.waarom` (NL-home) | V | Prijs, plekken, tabel |
| `home.hero`, `home.cta`, `home.faq`, `home.pricingTeaser`, `home.comparison`, `home.icp`, `home.processTimeline`, `home.services` (EN/ES-home) | V | Prijs, plekken, tiers |
| `about.*` | V/H | CTA, capaciteit en tijdlijn; mijlpaal "Founding-cohort opengesteld" blijft als historisch feit, zonder 997 |
| `alternatives.*` | V/A | Clyde-prijsregels naar canon; concurrenten (Aidelly "onbeperkt") laten |
| `how-it-works.*`, `contact.*`, `assessment.*`, `apply.*`, `client_portal.*`, `skills-template.*`, `founding.counter` | V | Prijs, plekken, tier-opties |
| `skills-ad-manager.faq`, `skills-email-management.faq` | V | Caps per tier eruit; advertenties niet in Founding |
| `legal.sections.terms` | V | Abonnementsvoorwaarden naar Founding A1.4, met de zin dat bestaande overeenkomsten hun voorwaarden houden |
| `glossary.tier-caps`, `glossary.werkruimte` | V | Tier-caps en werkruimteprijs naar canon |
| `memory.*`, `trust.*` | A | "als founding partner bewaart Clyde het geheugen zolang je abonnement loopt": retentie, geen prijs; laten |
| `skills-*` (overige), `chatbots.*`, `booking.*`, `resources.*`, `leadMagnet.*`, `case_studies.*` | A | `credits`, `onboarding`, `marca` als gewone woorden; per treffer gecontroleerd met het smalle patroon |

Smal verkooppatroon voor de eindcontrole: `997|8\.000|8,000|1\.997|3\.997|5\.997|€ ?499|€ ?399|€ ?299|levenslang|lifetime|de por vida|zolang je klant|for as long as you remain|mientras sigas|Growth|Professional|Enterprise|tien founding|ten founding|diez plazas`.
