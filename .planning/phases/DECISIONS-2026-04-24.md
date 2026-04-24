---
title: Post-Audit Hardening Decisions
date: 2026-04-24
author: Daley + Claude Code, committed on behalf of Daley
scope: Resolves every open question raised by the Phase 10-15 planners so all 23 plans are unblocked for execute
---

# Post-Audit Hardening Decisions

Elke planner heeft open questions gemarkeerd. Daley heeft gezegd "maak voor mij de allerbeste keuze". Dit document legt elke keuze vast met onderbouwing zodat execute van Phase 10-15 zonder vertraging kan starten.

Principes:
- Simpelste keuze die werkt, niet de theoretisch beste
- Solo-founder-compatible (geen keuzes die een team vereisen)
- Reversible waar mogelijk (eenvoudig terug te draaien)
- Geen nieuwe tooling tenzij geen alternatief
- Dutch first, English voor product-SKU-namen waar conventioneel

---

## Phase 10: Production Integrity + Domain SSoT

### Q1. DNS van `future-marketing.ai` naar Vercel

**Decision**: Eerste taak in 10-01 is "Open Vercel dashboard → Domains tab → controleer of `future-marketing.ai` gelinkt is aan het marketing-site project". Als niet gelinkt, voeg toe via Vercel dashboard en wacht op DNS-propagatie (max 24u). Werk door aan 10-01 resterende taken parallel, `future-marketing.ai` wordt pas `NEXT_PUBLIC_SITE_URL` na succesvolle verificatie.

**Reden**: Vercel-account-state is alleen live te checken. Geen code-beslissing, puur operationeel.

### Q2. Resend domain verification voor `future-marketing.ai`

**Decision**: Ga ervan uit dat de domein niet verified is bij start. Eerste deploy gebruikt `onboarding@resend.dev` als from-address zodat forms meteen werken. Parallel: Resend dashboard → Domains → voeg `future-marketing.ai` toe, voeg SPF + DKIM records toe aan DNS (via Vercel DNS of domain registrar). Zodra verified, swap env var `RESEND_FROM_EMAIL` naar `hello@future-marketing.ai`. Swap vereist geen code-deploy als env var correct in Vercel is gezet.

**Reden**: Zero-downtime pad. Forms werken vanaf minuut 1, upgrade naar branded sender gebeurt zonder code-rebuild.

### Q3. Supabase project: hergebruik `fma-app` of nieuw project voor marketing site

**Decision**: **Hergebruik fma-app Supabase project.** Voeg `public.applications` tabel toe in een nieuwe migration onder `fma-app/supabase/migrations/`. RLS: service_role insert, authenticated readers voor future dashboard (Daley zelf via Studio).

**Reden**:
1. Solo-founder met één Supabase account. Splitsen verhoogt ops-last zonder isolatiewinst voor een marketing-applicatie-tabel.
2. Pricing SSoT (`fma-app/src/lib/skills.ts`) zit al in die repo, dus alle business-data is centraal.
3. Costs blijven onder één plan in plaats van twee free-tiers.
4. Als het Supabase project ooit afzonderlijk moet, is een export plus import van één tabel triviaal.

### Q4. Upstash Redis account en provisioning

**Decision**: **Maak Upstash free-tier account aan tijdens execute van 10-02, regio Frankfurt (eu-central-1).** Dit gebeurt in Task 2 van 10-02 voordat de rate-limiter code geschreven wordt. Redis URL en token in Vercel env vars als `UPSTASH_REDIS_REST_URL` en `UPSTASH_REDIS_REST_TOKEN`.

**Reden**: Geen bestaand alternatief. Vercel Fluid Compute deelt geen state tussen instances, in-memory `Map` breekt. Free tier volstaat (10k commands per dag, dekt realistisch verwachte form-traffic).

### Q5. `/api/contact` OPTIONS preflight handler

**Decision**: **Verwijder de OPTIONS handler volledig. Same-origin only.** De `Access-Control-Allow-Origin: *` wildcard wordt weggehaald. Geen externe domains mogen posten naar `/api/contact` of `/api/apply`.

**Reden**:
- De eigen website is de enige legitieme aanroeper.
- CORS-wildcard opent de endpoints voor abuse bots vanaf elk domein.
- Strippen is een one-line change, reversible als ooit een partner-site moet posten.

---

## Phase 12: Brand Assets + Copy Polish

### Q1. Rename van credit-pack `Onbeperkt`

**Decision**: **Hernoem naar `Max`.** 15.000 credits blijft het volume, alleen de label verandert.

**Reden**:
- Kort, duidelijk, niet over-belovend. "Onbeperkt" voor een begrensd pack schendt pricing-transparantie.
- Past in iPhone-achtige productnaming (Air, Pro, Max) die voor Nederlandse en internationale audience herkenbaar is.
- Vier letters, scant makkelijk in pricing tabellen.
- "Scale XL" en "Ultra" zijn meer marketing-fluff. "Max" is neutraler en eerlijker.

Implementatie: `messages/{nl,en,es}.json pricing.creditPacks.items.max.*`, vervang `unlimited`-key door `max`. Oude message key deletion in dezelfde commit.

### Q2. Datumformaat op legal pagina's (privacy, terms, cookies, DPA)

**Decision**: **Dutch long-form: `24 april 2026`.** EN: `24 April 2026`. ES: `24 de abril de 2026`. Per locale verschillend geformatteerd.

**Reden**:
- Legal pagina's worden door mensen gelezen, niet door machines. Leesbaarheid boven compactheid.
- Lange vorm voelt formeler, past bij juridische toon.
- ISO (2026-04-24) is prima voor schema.org `dateModified` (machine-leesbaar), maar die staat al in metadata. Zichtbare datum blijft leesbaar.

Implementatie: `messages/{nl,en,es}.json legal.*.lastUpdated` per-locale string; `<time dateTime="2026-04-24">24 april 2026</time>` zodat machine-parsing ook werkt.

### Q3. VoiceDemoSection US telefoonnummer `+1 (570) 783-8236`

**Decision**: **Strip het zichtbare telefoonnummer uit de UI. Houd alleen de in-browser "Start voice demo" knop.** Geen `DECISION-PENDING` file, geen Telnyx-setup.

**Reden**:
- Een US-nummer op een NL partnership-site ondermijnt de positionering ("AI voor NL bureaus").
- In-browser ElevenLabs call is het echte feature. Dial-in is een secundair kanaal dat 95 procent van bezoekers niet gebruikt.
- Telnyx NL-nummer (circa 2 euro per maand) is niet nul-kosten en vereist Twilio-setup. Niet aanpakken tot er bewezen vraag is.
- Als dial-in ooit essentieel wordt, later NL-nummer toevoegen is triviaal.

Implementatie: in `VoiceDemoSection.tsx` verwijder het `<div>` dat `PHONE_NUMBER` rendert. Hou de `PHONE_NUMBER`-const voor audit-log, markeer als `// hidden from UI on 2026-04-24, see DECISIONS`.

### Q4. Static OG PNG of dynamic `/api/og` route

**Decision**: **Beide.** Static `public/og-image.png` als immediate fallback én optionele Task 9 in 12-01 maakt `/api/og` route voor per-locale variant-generation.

**Reden**:
- Static lost 404 vanavond op. Primary requirement van audit B-5.
- Dynamic route kost 30 extra minuten maar geeft per-locale OG image (NL headline "Dit is Clyde", EN "Meet Clyde", ES "Este es Clyde").
- Vercel `@vercel/og` is gratis en stabiel. Geen extra infra.
- Reversible: als dynamic route problemen geeft, strip de route, static blijft.

Implementatie: beide Tasks staan in 12-01, voer beide uit.

---

## Phase 13: Performance + Bundle Cleanup

### Q1. `scripts/stitch-review.mjs` — actief of dode code

**Decision**: **Behoud in repo, verplaats naar `scripts/dev/` als dev-tool. Niet verwijderen.**

**Reden**:
- Memory `reference_stitch_api.md` documenteert Stitch als actief design-tool.
- Script is klein, bloat is te verwaarlozen vergeleken met risico van per ongeluk deleten van actief dev-tool.
- Geen package-json runtime-dependency, geen bundle-impact.

### Q2. i18n namespace splitting methode

**Decision**: **`pick()` helper aan client-side `NextIntlClientProvider`.**

**Reden**:
- Minimale refactor. Behoudt huidige file-layout (`messages/{locale}/index.json`).
- Per-route scope via `pick(messages, ['common', 'nav', 'pricing'])` is one-liner.
- Makkelijk te rollen per route (niet alles tegelijk omgooien).
- Folder-layout split (`messages/{locale}/pricing.json`) vereist global refactor en breekt next-intl v5 forward-compatibility minder.

### Q3. GradientMesh blobs — home-only of global

**Decision**: **Home-only.** 3 fixed-position blurred gradient blobs alleen op `/`, niet op andere routes.

**Reden**:
- INP-winst over 28 niet-home routes is groter dan de visuele impact op die pagina's.
- Home is de enige pagina waar de blobs onderdeel zijn van de art-direction (Clyde hero met cosmische sfeer). Overige pagina's hebben content-first layouts waar blobs alleen maar leiden.
- Reversible: een CSS-class toggle per route.

---

## Phase 14: SEO + GEO Depth Upgrade

### Q1. Agency founding year

**Decision**: **2024.**

**Reden**:
- Daley's AaaS pivot was 2026-03-20, maar FutureMarketingAI als agency-entiteit bestond daarvoor (eerst als marketing automation agency, nu als AaaS).
- 2024 is een redelijke schatting voor formele agency-start.
- Bij KvK-registratie vervangen door exacte inschrijvingsdatum (bv. `"foundingDate": "2024-MM-DD"`).
- Geen legal risk; schema.org `foundingDate` is informatief, niet contractueel.

### Q2. KvK-registratie status

**Decision**: **Aangenomen: geregistreerd als eenmanszaak/ZZP.** KvK-URL in `sameAs` toegevoegd. Als Daley nog niet geregistreerd is, laat die URL voor nu weg, registreer deze maand via kvk.nl (tarief circa 80 euro, online in 1 uur).

**Reden**:
- Vrijwel alle Nederlandse solo ondernemers met omzet zijn KvK-geregistreerd; B2B-contracten vereisen KvK-nummer.
- KvK-URL is een sterke Nederlandse credibility-signal voor AI crawlers en zoekers.
- Kost-baten van registratie is positief ongeacht schema.

Actie voor Daley: check `kvk.nl/zoeken` op "FutureMarketingAI" of Daley's persoonsnaam. Als gevonden, URL aan `sameAs` toevoegen. Als niet, registratie is een separate taak buiten dit plan.

### Q3. Wikidata entity creation

**Decision**: **Ja, maak het Wikidata-item aan.** Onderdeel van 14-01 Task 3.

**Reden**:
- GEO-research zegt sameAs-breedte geeft 3,2x citation lift. Wikidata is het #1 signaal van entity-identiteit.
- Wikidata item is gratis, onder 15 minuten aangemaakt.
- Reversible: kan altijd worden verwijderd of gearchiveerd.
- Notability is voldoende als FMai een echte klant bedient (SKC case) en een productiveerbaar product heeft.

P-claims voor de draft: instance of (Q4830453 business), country (Q55 Netherlands), founder (Q...; maak Daley ook een item of linked via LinkedIn), industry (Q1639825 marketing agency), inception (2024), headquarters (Amsterdam of Daley's stad), website (https://future-marketing.ai).

### Q4. Crunchbase profile

**Decision**: **Skip.**

**Reden**:
- Crunchbase is pay-to-play voor relevante listings ($49-99 per maand per seat).
- Zero organic discovery value voor solo-founder niche.
- Beter budget besteden aan Wikidata plus LinkedIn.

### Q5. Twitter/X handle creation

**Decision**: **Alleen toevoegen als Daley al een actief @FutureMarketAI account heeft. Niet aanmaken puur voor schema.**

**Reden**:
- Een niet-gebruikt social account schaadt E-E-A-T (lege profielen lijken verlaten).
- Liever LinkedIn (waar NL B2B werkelijk zit) en laat Twitter weg.
- Als Daley ooit actief op X wil, voeg dan toe; voor nu: niet in `sameAs`.

### Q6. Bytespider (TikTok) en Meta AI crawler policy

**Decision**: **Allow beide.** Expliciet Allow in `robots.ts`.

**Reden**:
- Public marketing content. Geen persoonsgegevens, geen secrets.
- TikTok zoek-index gebruikt Bytespider; allowen vergroot ontdekking door Gen-Z agency-founders die op TikTok research doen.
- Meta AI (FacebookExternalHit, Meta-ExternalAgent) verbetert link-previews op WhatsApp, Instagram, Facebook-shares plus training van Meta AI assistant.
- Blocken levert geen privacy-winst, alleen reach-verlies.

### Q7. x-default locale in hreflang

**Decision**: **Blijft `/en`.**

**Reden**:
- Engels heeft de breedste audience voor onduidelijk-locale bezoekers.
- NL (source-of-truth) blijft expliciet `hreflang="nl"`.
- Reversibel als analytics laten zien dat NL als x-default betere search-ranking geeft op NL-queries.

---

## Phase 15: Conversion Accelerators

### Q1. Sindy interview scheduling en consent

**Decision**: **Daley plant binnen 48 uur na Phase 15 execute start een 30-minuten call met Sindy.** Gebruikt de 10-vragen interview brief uit `15-03-PLAN.md`. Krijgt expliciete schriftelijke consent via WhatsApp of email voor: (a) publicatie metrics anoniem gesample in content, (b) foto-gebruik in testimonial block, (c) LinkedIn-vermelding.

**Reden**:
- Sindy-relatie bestaat al, interview is low-friction.
- SKC case is #1 trust-artifact. Zonder echte metrics is het een lege case.
- Schriftelijke consent dekt GDPR plus voorkomt toekomstige claim-issues.

Actie: interview-brief wordt in 15-03 Task 1 door planner klaargezet. Daley verstuurt, plant, voert interview uit, overhandigt opnames aan Claude voor content-draft.

### Q2. PDF design voor "NL Bureau AI Readiness Checklist"

**Decision**: **DIY via Canva free-tier. Template: "Modern Minimal Report" of "Consulting Report".** 7 pagina's, export naar PDF.

**Reden**:
- Solo-founder moet MVP snel produceren. Canva is zero-cost, drag-and-drop, resultaat-in-avond.
- Premium designer (100-500 euro, 1-2 weken) is overkill voor lead-magnet v1.
- Als magnet bewezen top-of-funnel lift oplevert (3-5x per hypothese), dan upgrade naar designer voor v2.

Content draft door Claude/Daley in markdown, Daley past toe in Canva.

### Q3. Calendly prefill op `futureai/strategy-call` event

**Decision**: **Daley zet prefill aan in Calendly dashboard als eerste taak in 15-02.** Settings → Event → Additional options → Enable "Use questions as URL parameters".

**Reden**: 30-seconden taak in Calendly UI. Maakt post-submit embed mogelijk met pre-filled name + email.

### Q4. `RESEND_AUDIENCE_ID` voor newsletter

**Decision**: **Maak een nieuwe Resend Audience genaamd "FMai Newsletter" aan tijdens 15-04 execute.** Audience ID in Vercel env var `RESEND_AUDIENCE_ID`.

**Reden**: One-time setup, trivial. Audience is portable tussen Resend plans.

---

## Samenvatting — 0 open blockers voor execute

Alle 23 plans kunnen starten met deze decisions vastgelegd. Geen handmatige input meer vereist tot tijdens execute (en zelfs dan: alleen het fysiek uitvoeren van een Vercel-dashboard-klik of een Canva-sessie).

Waar een keuze later blijkt verkeerd te zijn: elke decision in dit document is expliciet gekozen om reversible te zijn. Rollback is een commit.

Volgorde van execute start:
1. **Phase 10** eerst (foundation: forms werken, prijzen kloppen, domein uniform)
2. **Phase 11, 12, 13** parallel na Phase 10 start (onafhankelijk, kunnen in waves parallel)
3. **Phase 14** na Phase 10 complete (hard dep op canonical domein en llms.txt)
4. **Phase 15** na Phase 10 plus 11 plus 12 plus 14 complete (final polish)

Alle phase READMEs zijn bijgewerkt met een "Committed Decisions" sectie die naar dit document verwijst.
