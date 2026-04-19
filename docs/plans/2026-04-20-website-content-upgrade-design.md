# FutureMarketingAI Website Content Upgrade — Design Document

> Status: **Approved by owner 2026-04-20**
> Scope: full content + positioning overhaul (Ring 1+2+3, alles in één iteratie)
> Authors: Claude (Opus) + Daley (owner review)
> Implementation plan: volgt via `writing-plans` skill na dit document

## Executive Summary

De FutureMarketingAI marketing website (`fmai-nextjs`, Next.js 16 + `next-intl` NL/EN/ES) is content-matig één generatie achter op het product. De huidige copy pitcht FMai als generieke 6/11-skills AI-agent platform, met zelf-tegensprekende skill-counts, onjuiste volume-claims (200+ integraties, 160+ content/mo, 99,9% SLA) en zonder vermelding van de echte differentiators (memory system, high-touch partnership, EU-native infra, live klantenbewijs).

Deze update voert een **volledige herpositionering** door naar een **high-touch AI partnership-model** (20-80 klanten/jaar cap), met Clyde als centraal productgezicht, 12 correcte vaardigheden, een herziene 5-tier pricing (Partner €347, Growth €2.497, Professional €4.497, Enterprise €7.997, Founding €997), een nieuwe `/memory` USP-page, echte SKC proof (via Sindy-testimonial), en application-gated CTAs in plaats van self-service signup. Visuele proof per skill via Playwright-screenshots met premium framing (frontend-design / ui-ux-pro-max skills).

Scope = Ring 1 (content-waarheid) + Ring 2 (USP-expliciteren) + Ring 3 (structuurhygiëne). Geen visuele redesign of component-rewrites — behoud van bestaande hero/cards/pricing layout, alleen content en structuur.

## 1. Scope & Aanpak

### In scope
- **Ring 1 — Content waarheid**: skill-count consistent (12), NVIDIA NemoClaw weg, 200+/160+/99.9% claims weg of onderbouwd, prijzen naar nieuwe tier-structuur, anonieme quotes vervangen door SKC-case met Sindy
- **Ring 2 — USP expliciteren**: nieuwe `/memory` page, 4 ontbrekende skill pages (Research, Blog Factory, SEO/GEO, Clyde), hybride ICP-sectie, high-touch signalen (counter, application-gate, 4-weken onboarding)
- **Ring 3 — Hygiëne**: hardcoded English → i18n, orphan translation namespaces schrappen, "Enterprise AI Backbone" button fix, legal 3-in-1 splitsing naar `/legal/privacy`, `/legal/terms`, `/legal/cookies`

### Out of scope
- Visuele redesign / nieuwe stylesheet
- Component rewrites (hero, cards, pricing layout blijven)
- Framework migratie
- Nieuwe blog posts (Blog Factory test = later project)
- Clyde mini-demo component (= Phase 6, apart project ná content live)

### Implementatievolgorde (6 phases)

| Phase | Scope | Blocking? |
|---|---|---|
| 1 | Foundation: Home + Memory + Pricing + Apply | Blocks all — core messaging |
| 2 | Case Study SKC (met Sindy-quote) | Unblocks proof-sections skill pages |
| 3 | 12 skill pages (8 herschrijven + 4 nieuw + 2 coming-soon) | Parallel na Phase 2 |
| 4 | About + Founding Member + How-it-works + Contact | Parallel met Phase 3 |
| 5 | Legal split + i18n hygiene + orphan namespace cleanup | Cleanup — laatst |
| 6 | Clyde mini-demo component (optional) | Separate project, post-content |

## 2. Informatie-architectuur

### Nieuwe sitemap

```
/                            — Home
/memory                      — NIEUW: Memory System USP page
/skills/                     — mega-menu only, geen index page
  /skills/social-media       — herschrijven
  /skills/blog-factory       — NIEUW
  /skills/ad-creator         — herschrijven (uitbreiden met video)
  /skills/reel-builder       — NIEUW (coming_soon label)
  /skills/voice-agent        — herschrijven
  /skills/lead-qualifier     — herschrijven (merge /skills/chatbot)
  /skills/email-management   — RENAME van /skills/email (scope fix)
  /skills/manychat           — NIEUW (coming_soon label)
  /skills/reporting          — herschrijven
  /skills/seo-geo            — NIEUW (met AI citation monitoring USP)
  /skills/research           — NIEUW
  /skills/clyde              — NIEUW (de orchestrator zelf)
/case-studies/
  /case-studies/skinclarity-club — NIEUW (vervangt anonieme quotes)
/how-it-works                — herschrijven (5 stappen ipv 4)
/pricing                     — volledig update (5-tier schema)
/founding-member             — update (10 plekken, counter sync)
/about                       — uitbreiden (ICP hybride, infra, capaciteit)
/apply                       — NIEUW (application form, vervangt checkout)
/contact                     — behoud (secundair bij /apply)
/legal/
  /legal/privacy             — SPLIT
  /legal/terms               — SPLIT
  /legal/cookies             — SPLIT
/blog                        — behoud, vul later via Blog Factory test
```

### 301 Redirects

```
/skills/content-creator   → /skills/social-media
/skills/chatbot           → /skills/lead-qualifier
/skills/email             → /skills/email-management
/legal                    → /legal/terms (met anchors naar andere)
```

### Header navigatie (i18n, niet hardcoded)

**Nav items**: Skills | Memory | Case Studies | Pricing | About + Login + **Apply**

**Skills mega-menu (3 × 4)**:

```
Create & Publish          Engage & Convert          Grow & Optimize
─────────────────         ─────────────────         ─────────────────
Social Media              Voice Agent               Reporting
Blog Factory              Lead Qualifier            SEO / GEO Analyst
Ad Creator                Email Management          Research
Reel Builder *            ManyChat DM *             Clyde AI Employee

                  * "coming soon" label
```

Featured banner in mega-menu: "Nieuw: Memory System → /memory"

### Footer kolommen

- **Platform**: Alle vaardigheden / Memory / How It Works
- **Bewijs**: Case Studies / Blog
- **Commercieel**: Pricing / Founding Member / Apply
- **Bedrijf**: About / Contact
- **Legal**: Privacy / Terms / Cookies (3 aparte links, 3 aparte pages)

### Orphan content cleanup

Schrappen uit `messages/{nl,en,es}.json`: namespaces `automations`, `chatbots` (≠ skills-chatbot), `voice-agents`, `marketing-machine` (~600 regels × 3 locales).

## 3. Messaging Raamwerk

### Positioneringszin (Clyde-first)

**"Clyde is de eerste AI Marketing Medewerker met lange-termijn geheugen per klant — hij runt jouw volledige content-operatie, zonder dat jij extra personeel aanneemt."**

### Tone of voice

- **Nederlands-native**: geen anglicisms (skills = OK als productterm, scalable → schaalbaar, leveragen → weg)
- **Concrete cijfers boven abstracties**: "3 accounts × 4 merken autonoom" ipv "onbeperkt schaalbaar"
- **Geen hype, geen emoji's**: past bij premium partnership positie
- **Eigenaar-stem waar authentiek**: "Ik werk met maximaal 20 bureaus per jaar"
- **Durft stelling nemen**: anti-ICP lijst, skill-exclusies expliciet, prijzen zichtbaar

### Top-4 USP prominence

1. **Memory System** — lange-termijn geheugen per klant, elke week beter
2. **AI partner, geen platform** — persoonlijk, 20-80 klanten/jaar max
3. **EU-native, zero lock-in** — self-hosted infra, data van jou, AVG + EU AI Act ready
4. **SkinClarity Club proof** — echte klant, Sindy als operator, meetbare output

Secundair (detailpages, niet hero): 8-agent OpenClaw team / self-evolving skills / AutoFix / revenue attribution.

### Hero copy (final)

```
Badge:     Jouw AI Marketing Medewerker met lange-termijn geheugen
           — 1 van 10 founding plekken bezet

H1:        Maak kennis met Clyde.
H1 accent: Jouw AI Marketing Medewerker.

Subtitle:  Clyde onthoudt elke klant, leert van elke campagne, en runt twaalf
           vaardigheden autonoom — social, blogs, voice, ads, SEO en analytics.
           Eén AI-medewerker voor jouw hele klantportfolio.

CTA-1:     Plan een gesprek          → /apply
CTA-2:     Ontmoet Clyde             → /skills/clyde
```

### Stats bar (4 tegels)

1. **3 accounts × 4 merken autonoom** (SKC proof, concreet)
2. **12 vaardigheden** (scope in één cijfer)
3. **Geheugen per klant** (moat)
4. **20 plekken/jaar** (schaarste)

### Key-phrase glossary

| Nooit | Altijd |
|---|---|
| "AI tool" / "platform" | "AI Marketing Medewerker" / "Clyde" |
| "features" | "vaardigheden" |
| "klanten" (bedoeld: bureau's eindklanten) | "merken" / "klantportfolio" |
| "unlimited" (zonder onderbouwing) | "zonder plafond voor zover infra reikt" |
| "Sign up" / "Try free" | "Plan een gesprek" / "Apply" |
| "gedreven door Clyde" | ✓ prima |

### Hybride ICP sectie (home + about)

```
Voor wie werkt dit?
───────────────────
• Bureaus met 5-30 FTE die 10-50 merken bedienen en willen schalen zonder extra personeel
• Marketing operators die data-driven werken en content als groeistrategie zien
• Founders die een partner zoeken, geen tool — bereid workflows te herijken, niet alleen uit te voeren
• NL/EU-first bureaus die waarde hechten aan dataresidentie en AVG/EU AI Act compliance

Waarschijnlijk niet de juiste match als:
────────────────────────────────────────
• Je minder dan €300K jaaromzet hebt (budget past niet, we willen je groei niet in de weg staan)
• Je puur branding/identity/creative doet (FMai levert performance content, geen design)
• Je op zoek bent naar "set-and-forget" (Clyde leert van jou — vereist 4 weken onboarding en blijvende input)
```

## 4. Pricing (definitief)

### Tier tabel

| Tier | Prijs/mo | Onboarding | Workspaces | Credits/mo | Skills | Voice | Video Ad | Reel | ManyChat | Support |
|---|---|---|---|---|---|---|---|---|---|---|
| **Partner** | **€347** | €497 | 1 | 1.000 | 8 incl + 2 add-on | ❌ | ❌ | ❌ | add-on €47 | email |
| **Growth** | **€2.497** | €1.997 | 5 | 4.000 | Alle 12 | 30 min | 4/mo | 4/mo | 200 DMs | email + app |
| **Professional** | **€4.497** | €3.997 | 15 | 12.000 | Alle 12 | 120 min | 20/mo | 15/mo | 1.000 DMs | Slack + monthly call |
| **Enterprise** | **€7.997** | €5.997 | Unlimited | 30.000 | Alle 12 + WL + API | Unlimited | Unlimited | Unlimited | Unlimited | Dedicated CSM + SLA |
| **Founding** | **€997** (10 plekken) | €0 | Unlimited | 8.000 | Alle 12 | 60 min | 8/mo | 8/mo | 500 DMs | Founder Slack |

**Workspace add-on**: €147/mo (was €97, blocks Growth-stretch).

### Credit packs

| Pack | Credits | Price |
|---|---|---|
| Partner Top-Up (NEW) | 500 | €39 |
| Boost | 2.000 | €149 |
| Scale | 5.000 | €297 |
| Unlimited | 15.000 | €697 |

### Skill-specifieke packs

| Pack | Waarde | Prijs |
|---|---|---|
| Partner Static Ads Pack | 5 static ads | €97 |
| Partner ManyChat Pack | 300 DMs/mo | €47 |
| Voice Minutes Pack | 100 min | €147 |
| Video Ads Pack | 10 video ads | €197 |
| Reels Pack | 10 reels | €197 |
| Blog Power Pack | 10 blog articles | €197 |

### Commitment terms

- **Partner**: maandelijks
- **Growth, Professional, Enterprise**: 12 maanden verplicht, 24 maanden optioneel voor 15% korting
- **Founding**: levenslange prijs voor de 10 plekken

## 5. Per-page Content Outlines

### `/` Home — sectievolgorde

1. Hero (H1 + badge + subtitle + 2 CTAs) — zie Messaging raamwerk
2. Trust-strip: "Gebouwd met en voor Nederlandse bureaus en merken"
3. Stats tegels (4 tegels — zie Messaging raamwerk)
4. Skills grid (3 × 4, link naar detailpages)
5. "Waarom bureaus Clyde inhuren" (4 cards): Memory / Partnership / EU-native infra / Scope
6. **Hybride ICP sectie** (Voor wie werkt / niet werkt)
7. Proof-teaser → `/case-studies/skinclarity-club`
8. FAQ (updated — skill-count 12, memory uitleg, partnership vs platform)
9. Final CTA: "Plan een gesprek"

### `/memory` (NIEUW)

1. Hero: "Clyde onthoudt alles — per klant, voor altijd"
2. Visueel 4-laags diagram (HOT / WARM / COLD / CONTEXT)
3. Per-client isolation uitleg (RLS + namespace per klant)
4. Decay + dream consolidation (nightly ritual)
5. Concreet voorbeeld: "Week 1 vs Week 12 met dezelfde klant"
6. Contrast met ChatGPT/Jasper (geen sessiegeheugen)
7. CTA → /apply

### `/pricing` (volledig herzien)

1. Hero: "Premium partnerships. 5 tiers. Transparant." + counter `1/10`
2. 5 tier-cards (Partner/Growth/Pro/Enterprise/Founding)
3. **Skills × tier matrix** (12 × 5, interactieve tooltips voor caps)
4. Credit packs sectie
5. Skill-specifieke packs sectie
6. FAQ updated — **"alle 11 skills"-claim weg**, vervangen door matrix-uitleg
7. "Waarom prijzen zichtbaar zijn" (mini-sectie tegen "contact us"-model)
8. CTA: application form

### `/how-it-works` (herzien, 5 stappen)

1. Apply + discovery call (30 min)
2. 4-week onboarding-partnership met Daley (intake brand voice, KPI's, vaardigheden)
3. Clyde configureren per klant (approval workflow, kanalen)
4. Productie start (elke output via jouw goedkeuring)
5. Continue verbetering + wekelijkse reports

### `/apply` (NIEUW)

- Hero: "Apply for a partnership call"
- Form: naam / bureau / rol / jaaromzet / aantal klanten / welk pakket / urgentste probleem
- "Wat gebeurt na aanmelden" — antwoord binnen 3 werkdagen
- Reassurance: niet-passende applicaties krijgen doorverwijzing naar DIY-alternatieven

### 12 skill pages — shared template

1. Hero: `Clyde [verb] Jouw [noun]` + claim met concreet cijfer
2. 4 features (correcte library-capabilities uit `src/lib/skills.ts`)
3. Hoe het werkt (3 stappen)
4. **Integratie met andere vaardigheden** (memory-connected: "Social Media deelt learnings met Ad Creator")
5. Use cases / voor welke bureaus
6. **Credit allocatie per tier** (concreet: Partner X incl / Growth Y incl / Pro Z incl)
7. **Visuele proof** (Laag 1: platform screenshot + Laag 2: output sample + Laag 3: interactieve demo waar relevant)
8. CTA

### `/case-studies/skinclarity-club` (NIEUW)

- Hero: SKC logo + samenvatting
- Setup (3 IG-accounts × 4 merken)
- Actieve vaardigheden (social, blog, SEO, reporting)
- Content-types & volumes
- Architectuur diagram
- Timeline (week 1 → nu)
- **Sindy testimonial** (Sindy is akkoord): *"Clyde beheert onze volledige social content-operatie over 3 Instagram-accounts en 4 merken. Wat eerst een hele middag per week kostte, draait nu autonoom in de achtergrond. Ik review, Clyde voert uit." — Sindy, founder SkinClarity Club*
- CTA

### `/about` (uitbreiden)

Behoud: timeline + mission.
Nieuw: **ICP hybride sectie** + "Onze infrastructuur" (self-hosted n8n / Supabase EU / Hetzner / EU-first / zero lock-in) + "Capaciteit & transparantie" (20 plekken/jaar uitleg) + founder bio Daley.

### `/founding-member` (update)

- 10 plekken pool @ €997 levenslang, geen split
- Counter sync met home `1/10`
- Skills naar 12 + tier caps matchen Pro-level
- Remove anonieme social proof, vervang door link naar SKC case

### `/contact` (minor)

Secondary CTA-endpoint, primaire flow is nu `/apply`. Contactform blijft, hello@futuremarketingai.com blijft.

### Legal split

`/legal/privacy` + `/legal/terms` + `/legal/cookies` — elk eigen page. Inhoud hergebruiken uit huidig `/legal`, updaten: skill-count 12, prijzen + tiers, new sub-processor list indien nodig.

## 6. Visuele Proof Strategy

### 3-lagige proof per skill page

**Laag 1 — Platform screenshot (elke skill)**
Screenshot van echte fma-app pagina voor die skill, met callouts. Bijv. `/skills/social-media` toont het content-engine scherm uit app. Linear/Notion style.

**Laag 2 — Concrete output voorbeeld (elke skill)**
Echte SKC-output sample. Bijv. `/skills/blog-factory` = snippet van echte blogpost + SEO meta. `/skills/social-media` = week-kalender van posts. `/skills/seo-geo` = ranking-tracker met echte keywords (naam SKC blurd waar nodig).

**Laag 3 — Interactieve demo (selectief)**
- **Voice Agent**: behoud bestaande `VoiceDemoSection` + `VoiceDemoFAB`
- **Lead Qualifier** (was chatbot): behoud `DemoPlayground`
- **Clyde**: nieuwe mini-demo (Phase 6, separate project)
- Andere skills: geen interactieve demo (Laag 1+2 volstaat)

### Screenshots workflow

**Claude maakt screenshots tijdens implementatie**:
- Playwright voor stable captures
- Frontend-design / ui-ux-pro-max skill voor premium framing (shadows, callouts, device mockups passend bij donker thema)
- Per skill page: 1-3 screenshots met annotations
- Opslag in `public/screenshots/skills/{skill-slug}/` met consistent naming

**Prerequisite**: fma-app pagina's moeten productie-stabiel zijn voor elke skill die screenshot vereist. Checklist in implementatieplan welke app-pages ready moeten zijn voor welke phase.

## 7. Content Workflow & Review

### Schrijf-workflow

1. **Claude schrijft NL-first concept** per page (native NL tone, glossary-consistent)
2. **Daley reviewt + polish** (owner-stem waar authentiek)
3. **EN/ES machine-vertaling + review pass** (Spaans extra scherp — oude ES-versie had auto-translate typos)
4. **i18n keys updaten** — hardcoded strings worden translation keys

### Review gates per page

Voor content goedgekeurd wordt:
- ✅ Alle claims verifieerbaar (geen "200+ integraties" zonder bewijs)
- ✅ Skill count = 12 consistent
- ✅ Prijzen = synchro met `src/lib/skills.ts`
- ✅ Geen anonieme testimonial quotes
- ✅ Counter `1/10` consistent op alle plekken
- ✅ "Apply for a call" CTAs (geen signup knoppen)
- ✅ Dutch-first, hardcoded English weg

## 8. Risk Register

| Risk | Impact | Mitigation |
|---|---|---|
| Screenshots vereisen platform-stabiliteit | Blocks Phase 3 | Checklist in implementatieplan; screenshot-ready app pages identificeren |
| Prijs-update vereist Stripe updates | Inconsistency tussen site en billing | Separate Stripe-spoor parallel; sync voor Pricing page live gaat |
| Sindy-akkoord voor testimonial | Blocks Phase 2 | ✅ Akkoord verkregen |
| i18n EN/ES vertaling workload | Grootste tijdvreter | Machine-translate + review, fase later in volgorde |
| Owner review-bandwidth | Bottleneck in schrijf-flow | Batch reviews per phase ipv per page |
| Clyde mini-demo scope-creep | Pulls focus van content | Expliciet Phase 6, separate project |
| Counter-inconsistentie `1/10` | Verwarring prospects | Enkele SSoT constant in code, import overal |

## 9. Decisions Log

| # | Beslissing | Keuze |
|---|---|---|
| Scope | Ring 1 / Ring 1+2 / Ring 1+2+3 | **Ring 1+2+3 (alles)** |
| Mega-menu | Huidige 2×4 vs nieuwe 3×4 categorieën | **3×4 (Create&Publish / Engage&Convert / Grow&Optimize)** |
| Blog behouden | Ja/nee in nav | **Ja, vul later via Blog Factory test** |
| Memory path | `/memory` / `/technology/memory` / `/platform/memory` | **/memory** |
| Hero framing | Hero-A vs Hero-B vs huidige | **Huidige ("Maak kennis met Clyde") + update badge/subtitle** |
| Clyde personificatie | Behouden / generieker | **Behouden — AaaS framing** |
| Stats tegel 1 | 21 carrousels vs volledig aangedreven | **"3 accounts × 4 merken autonoom"** (concreet, niet beperkend) |
| SKC in hero | Ja/nee | **Nee — naar case studies page + trust-strip** |
| Counter cijfer | 1/10 / 2/10 | **1/10 (eerlijk + sterker schaarste-signaal)** |
| DHS Leads vermelden | Ja/nee in badge | **Nee, nog niet publiek** |
| Founding split | Grandfather+new / single pool | **Single pool — 10 plekken @ €997 levenslang** |
| ICP framing | Alleen positief / alleen negatief / hybride | **Hybride** |
| SKC testimonial | Daley als "founder & first client" / Sindy als operator | **Sindy als operator, geen vermelding Daley co-eigenaar** |
| Proof per skill | Selectief / alle 12 | **Alle 12 (3-lagige strategie)** |
| Screenshots | Owner maakt / Claude maakt | **Claude maakt, premium framing via frontend-design/ui-ux-pro-max skill** |
| Clyde mini-demo | Nu / later | **Later (Phase 6, separate project)** |

### Pricing-specifiek

| # | Beslissing | Keuze |
|---|---|---|
| Growth prijs | €2.497 / €2.997 | **€2.497** |
| Enterprise prijs | €7.997 / €6.997 | **€7.997** |
| Partner prijs | €347 / €447 | **€347** |
| Static ads op Partner | metered / add-on / beide | **Beide — 3/mo incl + €97 pack** |
| ManyChat op Partner | included / add-on | **Add-on €47** |
| Founding nieuw prijs | €997 / €1.497 | **€997 (single pool)** |
| Commitment Pro+/Ent | 12 mnd / 24 mnd | **12 verplicht, 24 optioneel voor 15% korting** |

## 10. References

### Onderliggende research documenten (alle in `docs/plans/`)

- `2026-04-19-audit-website-inventory.md` — wat staat er nu op de site
- `audit-capabilities-inventory.md` — wat FMai echt kan
- `2026-04-19-audit-gap-analysis.md` — gap-analyse + prioriteitsmatrix
- `2026-04-19-pricing-solo-research.md` — ronde 1 pricing research (solo tier)
- `2026-04-20-pricing-value-analysis.md` — agency tier value-based analyse
- `2026-04-20-pricing-credit-economics.md` — credits vs skill-costs per tier
- `2026-04-20-pricing-skill-gating.md` — skill availability per tier
- `2026-04-20-pricing-final-proposal.md` — pricing synthese

### Source of truth

- `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` — SKILLS, AGENT_TIERS, CREDIT_PACKS, CREDIT_COSTS (authoritative)

### Target codebase

- `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs` (Next.js 16 + `next-intl`)
