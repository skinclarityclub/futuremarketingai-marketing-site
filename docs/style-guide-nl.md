# NL Stijlgids — FutureMarketingAI

**Status**: authoritative voor alle NL user-facing copy in `fmai-nextjs/messages/nl.json`.
**Laatst bijgewerkt**: 2026-04-21

Deze gids legt vast hoe wij Nederlandse copy schrijven voor de FMai marketing-site. NL is de bron-taal. EN en ES zijn vertalingen.

## 1. Stem — IK vs WIJ

FMai is op dit moment één mens (Daley) + één AI Marketing Medewerker (Clyde) + een technische stack. Dat is de waarheid; we gebruiken die waarheid als differentiator, niet als zwakte.

### Regels per context

| Context | Voice | Toelichting |
|---|---|---|
| `about.*`, `founding-member.*`, `contact.*` | **Ik** (Daley) | Bureaus investeren in een persoonlijk partnership. "Ik ben Daley, ik bouw dit, dit is mijn verhaal." |
| `home.*`, `how-it-works.*`, `pricing.*`, `skills-*` hero + features | **Wij** | "Wij" = Daley + Clyde + de stack. Eerlijk want Clyde ís een medewerker. |
| Case studies (`case_studies.*`) | **Wij** voor uitvoerend werk, **ik** voor strategie/beslissingen | Precisie bouwt geloofwaardigheid. |
| CTA's, apply-flow, booking | **Wij / Plan een gesprek** | Partnership-toon. |
| Legal namespace | Neutraal + **u** (zie §4) | Juridische standaard. |

### Niet doen

- **Niet** "ons team van experts", "onze specialisten", "jarenlange teamervaring" — dat is onwaar, er is geen team.
- **Niet** stilzwijgend wisselen binnen één sectie of één zin ("Wij leveren, ik stuur aan" mag wél als het expliciet is).
- **Niet** "wij hebben" waar Clyde het feitelijk doet. Liever: "Clyde levert X, ik stuur de strategie aan."

### Eerlijke framing (voorbeeld)

> "FutureMarketingAI is één mens en één AI Marketing Medewerker. Ik (Daley) bouw de partnership met jou, Clyde doet het uitvoerende werk. Samen leveren we het werk van een content-team van 5."

Deze zin hoort op `about` of `how-it-works`. Daarmee is "wij" elders onderbouwd.

## 2. Aanspreekvorm — je/jouw

**Default**: "je" / "jouw" / "jij". Professioneel maar toegankelijk. Target is Nederlandse/EU bureau-eigenaren.

**Uitzondering**: `legal.*` (privacy, terms, cookies, disclaimer) = "u" / "uw" (juridische standaard).

**Nooit**:
- "Jullie" tenzij expliciet groep aanspreken
- "Uw" buiten legal
- "Alsjeblieft" (directe vertaling van "please") — gebruik imperatief

## 3. Glossary — verplichte woordkeuzes

### Altijd gebruiken

| Woord | Waarom |
|---|---|
| **Clyde** | Productnaam. Eigennaam, altijd hoofdletter. |
| **AI Marketing Medewerker** | Claude-positionering. Niet "AI-medewerker" los, niet "AI Employee". |
| **vaardigheden** | Niet "skills" in user-facing copy. Keys in JSON mogen wel `skills-*` heten. |
| **merken / klantportfolio** | Voor de *eindklanten van bureaus*. Niet "klanten" in die context. |
| **merkstem** | Niet "brand voice". |
| **huisstijl** | Niet "brand styling". |
| **merkrichtlijnen** | Niet "brand guidelines". |
| **werkruimte(s)** | Niet "workspace(s)". |
| **aanmelding** | Voor apply-flow. "Applicatie" = software/toepassing in NL. |
| **beoordelen / controleren** | Niet "review(en)" in lopende tekst. |
| **inplannen** | Niet "schedulen". |
| **bewerken** | Niet "editen". |
| **koppelen** | Niet "connecten". |
| **synchroniseren** | Niet "syncen". |
| **beheren** | Niet "managen" waar het niet hoort. |
| **prestaties / prestatiemeting** | Niet "performance" als bijvoeglijk naamwoord. |
| **zoekwoord-onderzoek** | Niet "keyword research". |
| **positie volgen / rangorde** | Niet "rank tracking". |
| **anomalie-detectie** | Niet "anomaly detection". |
| **gewone taal** | Niet "natural language" in klantfacing copy. |
| **bruikbare / toepasbare inzichten** | Niet "actionable insights". |
| **Onbeperkt (fair use)** | Niet "Unlimited" alleen. Onderbouwing verplicht. |
| **Plan een gesprek** | CTA-standaard. Niet "Sign up", "Try free", "Get started". |
| **/mnd** | Niet "/mo" in prijzen. |
| **"klanten"** mag wél | als het verwijst naar FMai's eigen klanten (= de bureaus). Niet als het verwijst naar de eindklanten van die bureaus. |

### Eigennamen blijven Engels (product naming)

`Voice Agent`, `Blog Factory`, `Lead Qualifier`, `Ad Creator`, `Reel Builder`, `Social Media`, `Email Management`, `Reporting`, `Research`, `SEO/GEO`, `Clyde`, `ManyChat`. Deze staan als productnaam, categorie-aanduiding errom-heen is wél NL ("de Voice Agent-vaardigheid").

### Geaccepteerde leenwoorden (geen vertaalplicht)

`onboarding`, `dashboard`, `workflow` (in dev-context), `API`, `CRM`, `KPI`, `SEO`, `GEO`, `AVG`, `AI`. Nooit versieren als "onboardingsjourney".

## 4. Interpunctie en typografie

### Em-dashes: verboden

Geen `—` in NL copy. Oorzaak: voelt Engels/Amerikaans. Vervang door:
- **Dubbele punt** `:` als tweede deel het eerste uitlegt
- **Punt** `.` als twee zelfstandige zinnen
- **Komma** `,` binnen één zin
- **Puntkomma** `;` voor twee samenhangende zelfstandige zinnen

### Spatie-komma-spatie-bug: verboden

Patroon ` , ` (letterlijk spatie-komma-spatie) is restant van em-dash-removal. Leest als UI-bug. Altijd vervangen door één van de bovenstaande.

### Hoofdletters in titels: sentence case

**Correct (NL)**: "Wat Clyde doet voor jouw bureau"
**Fout (Title Case, Engels-stijl)**: "Wat Clyde Doet voor Jouw Bureau"

Alleen hoofdletter op:
- Eerste woord van de titel
- Eigennamen (Clyde, SkinClarity Club, Blog Factory, etc.)
- Acroniemen (AI, SEO, GEO, AVG, CRM)

### Trema's en cedilles: verplicht

Correcte vormen met diakritiek:

| Fout | Goed |
|---|---|
| creert | creëert |
| coordineren | coördineren |
| beeindiging | beëindiging |
| beeindigen | beëindigen |
| categorieen | categorieën |
| essentiele | essentiële |
| anomalieen | anomalieën |
| authoriteit | autoriteit |
| groeistrategieen | groeistrategieën |
| themas | thema's |
| videos | video's |
| personas | persona's |
| ipv | in plaats van |

### Apostrofs voor meervoud op -a/-o/-u

`foto's`, `video's`, `baby's`, `menu's`, `thema's`. Niet `foto`s` of `foto"s`.

## 5. Zinsbouw — tegen Dunglish

### Korte, Nederlandse zinnen

Engelse copy is vaak lang met losse fragmenten ("The tool that grows with you.  Built for agencies."). NL werkt beter in volzinnen.

**Niet**: "A/B varianten direct publiceerbaar."
**Wel**: "Publiceer A/B-varianten direct."

### Imperatief > passief

Bij CTA's en feature-bodies: actieve imperatief in NL werkt sterker dan Engels-style passief.

**Niet**: "Content wordt gepubliceerd na jouw goedkeuring."
**Wel**: "Geef goedkeuring, dan publiceert Clyde."

### Vermijd lange samenstellingen zonder streepje

**Niet**: "social media operatie", "performance content strategie"
**Wel**: "social-media-operatie", "prestatie-content-strategie"

Of beter: herformuleren met werkwoord/voorzetsel.

## 6. Numeriek en valuta

- Valuta: `€499` (geen spatie tussen € en bedrag, NL-conventie)
- Maand-abonnement: `/mnd`
- Jaar-abonnement: `/jr`
- Komma als decimaalscheider: `€1.997,50` (niet `$1,997.50`)
- Punt als duizend-scheider: `€1.997`
- Percentages: `20%` (geen spatie)

## 7. Checklist voor elke nieuwe/gewijzigde string

1. Heeft de zin een letterlijke Engelse constructie (word-for-word translation)?
2. Staat er een Engels woord waar NL-equivalent bestaat per glossary §3?
3. Title Case in headings? → sentence case maken
4. `—` of ` , ` aanwezig? → fixen
5. Diakritieken correct? (coördineren, beëindigen, creëert)
6. Je/jouw consistent (behalve legal)?
7. IK/WIJ correct voor context (§1)?
8. Klopt valuta-notatie? (€, /mnd, komma-decimaal)
9. "klanten" gebruikt? → gaat het over FMai's eigen klanten (= bureaus, OK) of over eindklanten-van-bureaus (→ "merken")?
10. Leest de zin hardop als gesproken NL of als vertaling?

## 8. Uitzonderingen

Skills-pagina's gebruiken soms Engelse productnamen binnen NL-copy — dat is correct. Bijv. "Blog Factory levert 3.000 woorden." Hier is `Blog Factory` productnaam, de rest is NL.

Technische developer-blurbs (schema.org, robots.txt, dev tools) mogen Engels blijven — niet user-facing.
