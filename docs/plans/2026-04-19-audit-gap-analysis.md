# Website Gap Analysis — 2026-04-19

> Vergelijkt `2026-04-19-audit-website-inventory.md` (wat de site nu claimt) met
> `audit-capabilities-inventory.md` (wat FMai echt kan). Levert prioriteitsmatrix voor content update.

## TL;DR

De website pitcht FMai als een **generieke 6/11-skills AI-agent voor bureaus**, met Clyde als "persistente medewerker" en wat soft proxies voor leren. De echte capabilities tonen een **veel specifieker, verder doorontwikkeld B2B2B platform** met duidelijke technische moats die nergens worden genoemd: memory system, local-first AI routing, self-hosted n8n, 8-agent OpenClaw team, self-evolving skills, live multi-client pipeline met 5-dimensionale kwaliteitsscoring. Daarnaast zijn er 3 **zelf-tegensprekende** plekken op de site (6 vs 11 skills, "NVIDIA NemoClaw", prijs-mismatch met AaaS strategy) die hoe dan ook gefixt moeten worden.

**Conclusie**: dit is niet "kleine copy update" — het positionering-raamwerk van de site is één generatie achter op het product. Aanbeveling: **volledige herschrijving van home + how-it-works + skills pages + pricing**, met behoud van structuur en assets waar mogelijk.

---

## A. Ernstige contradicties op site zelf (hoe dan ook fixen)

| # | Probleem | Bewijs | Impact |
|---|---|---|---|
| A1 | **Skill-count inconsistentie (6 vs 11)** | Home/nav/how-it-works/legal noemen **6 skills**; pricing + founding-member claimen **"alle 11 skills"** en lijsten Blog Factory / Reel Builder / ManyChat DM / Analytics-separate die **géén dedicated page** hebben. | Hoog — ondermijnt geloofwaardigheid direct bij vergelijking |
| A2 | **"Powered by NVIDIA NemoClaw"** | Staat op pricing top-badge. Bestaat niet als product (waarschijnlijk bedoeld: NVIDIA NeMo). Geen verwijzing elders. | Hoog — prospects zullen dit googelen |
| A3 | **Pricing mismatch met AaaS strategy** | Site: Growth €1.497 / Pro €2.997 / Ent €4.997 + Founding €997. AaaS strategy memo (2026-03-24): Social Media Engine **€997** / Ecommerce Growth **€1.497** / Full Agency Suite **€1.997** + Founding **€697**. Geen vertical packs op site. | **Kritiek** — user-bevestiging nodig welke actueel is |
| A4 | **Legal zegt 6 skills, pricing zegt 11** | Terms definieert "Agent as a Service (AaaS) platform" met **6 skills** uitgeschreven. Pricing FAQ noemt 11. | Juridisch risico — Terms zijn bindend |
| A5 | **Partial-listings verschillen per page** | Founding-member noemt "social media, blog factory, ManyChat DM, voice agent, e-mailbeheer, ad monitoring en meer" — ≠ pricing FAQ lijst van 11. | Medium |
| A6 | **Hardcoded English in NL/ES locales** | Header nav ("Skills/Pricing/About/How It Works"), primary CTA "Meet Clyde", alle skill pages secondary CTA `"Book a Strategy Call"` (literal), `VisionTimeline` copy, blog "No posts found". | Medium — breekt locale belofte |
| A7 | **Orphan translation namespaces** | `automations`, `chatbots` (≠skills-chatbot), `voice-agents`, `marketing-machine` bestaan in JSON zonder pages (~600 regels dood). | Laag — niet zichtbaar, wel hygiene |
| A8 | **Mislabeled home CTA** | "Enterprise AI Backbone" button gebruikt `trust.trialTitle` sleutel → verkeerde label. | Laag |
| A9 | **Privacy/Voorwaarden/Cookies linken naar zelfde `/legal`** | In footer zijn het 3 aparte links naar dezelfde page. | Laag — verwarrend |

---

## B. Verzwegen USPs (echte moats die volledig ontbreken op site)

Dit zijn de differentiators uit de capabilities inventory die **NUL vermeldingen** hebben op de website. Op prioriteit:

### B1. Memory System (grootste gemiste USP — user heeft dit zelf genoemd)

- Wat er nu staat: "Leert continu", "Clyde bestudeert merkstem per klant"
- Wat er is: **4-laags architectuur (HOT/WARM/COLD/CONTEXT)**, pgvector semantic search, decay formule `importance × e^(-0.16 × ageDays)`, nightly dream consolidation (4-fase ritueel), per-client namespace isolation (RLS), 2-hop graphify protocol over 4930-node knowledge graph, 17th Clyde tool `updateClientKnowledge` die direct naar pipeline schrijft.
- Framing voor bureaus: "**Clyde vergeet niets over je klanten — en verleert automatisch wat niet meer klopt**"
- Waar plaatsen: eigen skill page `/skills/memory-system` + Home trust-card vervangen + how-it-works stap 4 "Continue Verbetering" uitbreiden + FAQ.

### B2. Local-First AI Routing (zero inference cost moat)

- Wat er nu staat: niets
- Wat er is: RTX 5070 Ti laptop serveert alle 8 OpenClaw agents via Tailscale mesh (~30ms), zero token cost, Ollama qwen3:14b primary, automatische fallback keten (Gemini 3 Flash → 2.0 Flash → 2.5 Flash → Claude Haiku 4.5). Paperclip draait 110 wakes/dag voor **EUR 7/mo**.
- Framing: "**Unit economics die schalen — wij betalen niet per token voor onze kernagents, dus jij ook niet**" + "infrastructure moat"
- Waar plaatsen: About timeline uitbreiden + Pricing page "Why our margins allow founding price" + eventueel een `/how-it-works` 5e step "De kostenstructuur die we doorgeven".

### B3. 8-Agent OpenClaw Team (veel concreter dan "Clyde")

- Wat er nu staat: "Eén Clyde beheert 10-50 klanten" (abstract)
- Wat er is: 8 gespecialiseerde agents met heartbeats (Clyde CEO 30m, Content Engine 1h, Ops Monitor 15m, SKC Clyde 2h, Product Scout 2h, Revenue Ops 2h, Ad Manager 1h, SEO Analyst 4h). Paperclip orchestratie voor company-level routines (11 crons). Event-driven via pgmq + pg_cron.
- Framing: "**Niet één chatbot — een volledig AI-team dat 's nachts doorwerkt aan jouw accounts**"
- Waar plaatsen: Ofwel nieuwe pagina `/skills/ai-team` OF iedere skill page koppelen aan de onderliggende agent + about/how-it-works "ontmoet het team" sectie.

### B4. Self-Hosted n8n (open-source, geen lock-in)

- Wat er nu staat: **zero mentions van n8n / self-hosted / open-source** (alleen home badge "Geen Lock-in Contracten" zonder uitleg)
- Wat er is: Self-hosted n8n op Hetzner (€24/mo CPX42), 3 containers (main + 2 workers), shared Supabase project, klant kan theoretisch export krijgen.
- Framing: "**Open, geen lock-in** — je data blijft exporteerbaar, je workflows in open formaat (n8n JSON)"
- Waar plaatsen: About values + eventueel nieuwe pagina `/open` + Pricing FAQ "wat als ik wil opzeggen".

### B5. Self-Evolving Skills (OpenSpace — echt uniek)

- Wat er nu staat: niets
- Wat er is: **37 skills** over 8 directories. 3 evolution modes: **FIX** (auto-repair fallback >40%), **DERIVED** (specialized variants als effective <55%), **CAPTURED** (pattern extraction uit successes). Framing "niet alleen leren — het systeem bouwt zichzelf uit."
- Waar plaatsen: Home trust-card vervangen + nieuwe pagina `/open-space` OF geïntegreerd in memory-system page.

### B6. AutoFix Agent Team (self-healing infrastructuur)

- Wat er nu staat: niets
- Wat er is: VPS agents detecteren code issues → Supabase queue → router → fixer → GitHub PRs met fingerprint dedup. Auto-merge `autofix:low-risk` na CI pass. Live, E2E getest met PR #5. Security-hardened (35+ blocked patterns).
- Framing: "**Ons platform repareert zichzelf** — bugs worden gedetecteerd en opgelost voordat jij het merkt"
- Waar plaatsen: Home trust-card "99,9% Uptime" vervangen/uitbreiden OF About values.

### B7. Client Intelligence Learning Loop (moat #2 in wiki)

- Wat er nu staat: soft proxy in home trust ("prestatiegeschiedenis van elke klant")
- Wat er is (design ready, implementatie Phase 16): 5 tables (`fma_vault_insights`, `fma_content_feedback`, `fma_learning_briefs`, `fma_client_signals`, `fma_client_health`), 3 n8n workflows (weekly Monday, monthly 1st, per-conversation), significance scoring met 5-factor formule (≥70 threshold), temporele insight lifecycle (episodic → durable → superseded).
- Framing: "**Elke content cycle maakt de volgende beter** — 18 maanden data per klant bouwt een voorsprong op die concurrenten niet inlopen"
- Waar plaatsen: Extend `/skills/content-creator` "Continu Leren" sectie + About timeline "compounding advantage".

### B8. Revenue Loop + Attribution Sidecar

- Wat er nu staat: Reporting skill vermeldt "multi-touch attributie" zonder concrete implementatie
- Wat er is: Revenue spike trigger (1.5× 7-day avg), attribution sidecar respecterend READ-ONLY n8n contract, weekly automated Dutch-narrative PDF client reports (`@react-pdf/renderer` dark theme), `fma_human_minutes_lookup` — **human-minutes-saved per agent activity**.
- Framing: "**Jij ziet ROI per skill per klant per week** — geautomatiseerde Nederlandstalige rapporten tonen hoeveel uur Clyde heeft vervangen"
- Waar plaatsen: Versterk `/skills/reporting` met ROI / human-minutes / PDF preview mockup.

### B9. Multi-Channel Clyde met Unified Memory

- Wat er nu staat: niets (chatbots orphan namespace noemt wel SKC over WhatsApp)
- Wat er is: Dashboard panel + Telegram (`@FutureMarketingAI_Clyde_Bot`, multi-tenant deeplink), email via n8n, Slack/WhatsApp/Discord OpenClaw bridges. **Cross-channel context** via gedeelde Supabase tables.
- Framing: "**Spreek Clyde via Telegram onderweg, laat je klant via chatbot op hun website — zelfde brein, gedeeld geheugen**"
- Waar plaatsen: About/How-it-works "waar werkt Clyde" sectie OF eigen detail op `/skills/chatbot`.

### B10. Dutch-Native + GDPR/EU AI Act (al deels aanwezig — versterken)

- Wat er nu staat: "AVG-First AI", "EU AI Act Ready", "Nederlandstalige Support" — correct maar oppervlakkig
- Wat er is: Lead Qualifier **cookie-less** (GDPR-compliant), **EU AI Act Article 50 disclosure** in chatbot, system prompts forceren Nederlands, Sindy brand voice als template.
- Versterking: specifiek noemen "cookie-less Lead Qualifier", "Article 50 AI-disclosure", "Dutch-first system prompts" — maakt compliance-framing concreet.

---

## C. Onjuiste / out-of-date claims (zonder bewijs of verkeerd)

| # | Claim | Werkelijkheid | Aanbevolen actie |
|---|---|---|---|
| C1 | "200+ Integraties" | Capabilities inventory toont ~30 expliciete integraties (AI providers, media gen, publishing, data sources). 200+ is fantasie. | **Weghalen** of vervangen door specifieke categorieën ("LinkedIn/IG/FB/TikTok/X/YouTube + Meta Ads + Shopify + GA + Google Search Console + ManyChat"). |
| C2 | "160+ Contentstukken/Maand" | SKC doet 21/week × 4 = 84/mo; FMai zelf 28/run. 160 is mogelijk voor heel klantenbestand, maar er zijn nog geen betalende klanten buiten SKC. | Vervangen met échte pilot-cijfer: "21 carrousels/week volledig autonoom voor onze eerste klant" — is véél sterker als proof point. |
| C3 | "99,9% Uptime SLA" | Geen SLA-contract met monitoring/compensatie infrastructuur zichtbaar in docs. | Ofwel echte uptime verklaren met bewijs (status.future-marketing.ai?) of vervangen door "Hetzner enterprise infra met automatic backups". |
| C4 | "<2min Gemiddelde Responstijd" | Onduidelijk waar dit op slaat. Voice agent: <1s. Lead qualifier: <2s. | Specifieker maken: "Voice agent antwoordt in <1s, chatbot in <2s". |
| C5 | "6 Gespecialiseerde Skills" op home stats | Maar site heeft 8 skill pages (chatbot + email extra) en pricing claimt 11. | Alignen na skill-count beslissing (zie D). |
| C6 | "Een menselijke marketeer schrijft 2 blogposts per dag. Clyde schrijft er 20." | Blog Factory heeft bekende kwaliteitsissues (articles te kort 2100 vs 5000-10000 benchmark, AI fabricated citations). | Getal dropt naar realistisch niveau OF claim herformuleren: "20 posts-in-draft per dag, 20 goedgekeurd per week". |
| C7 | "Blog Factory" als skill in pricing FAQ | Is LIVE maar kwaliteitsissues → *partial*. | Houden maar transparant over "beta". |
| C8 | "Reel Builder" en "ManyChat DM" als aparte skills | Reel Builder ≈ Ad Builder (video flow). ManyChat is integratie, geen skill. | Schrappen uit pricing FAQ OF rechtvaardigen. |
| C9 | "Lead Qualifier" skill page features | Design complete (phases 133-143) maar **niet gebouwd** per capabilities inventory. | Markeren als "beta / wachtlijst" of dempen tot eerste deployment. |
| C10 | Anonieme social-proof quotes (Amsterdam e-commerce bureau, Rotterdam digitaal marketingbureau) | Geen aanwijzing dat deze echt bestaan. Enige echte klant = SkinClarity Club (in orphan namespace!). | **SkinClarity Club prominente case** — met permissie van jou als owner van beide — ipv fake quotes. |
| C11 | "De eerste AI Marketing Medewerker voor bureaus bouwen" (About) | Contrast: GoHighLevel (82.7M bootstrapped) en Vendasta (100M+ ARR) staan al in het B2B2B model. | Herformuleer: "eerste **NL/EU-native** AI Marketing Employee voor bureaus" — kleiner claim, harder te weerleggen. |
| C12 | "2-3 jaar concurrentievoordeel" voor early adopters | Speculatief. | Vervangen door concrete compounding: "18 maanden data per klant = niet-inhaalbare voorsprong". |

---

## D. Prijsstrategie — kritieke keuze

De site en de strategie-memory tonen **twee totaal verschillende pricing modellen**:

### Optie D1 — Huidige site (credit-based + 11 skills)
```
Growth      €1.497/mo · 5 werkruimtes · 3.000 credits · €1.500 onboarding
Professional €2.997/mo · 15 werkruimtes · 8.000 credits · €3.000 onboarding
Enterprise  €4.997/mo · unlimited · 20.000 credits · €5.000 onboarding
Founding    €997/mo levenslang · 10.000 credits · unlimited · €0 onboarding (10 plekken)
Credit packs: Boost 2k/€149, Scale 5k/€297, Unlimited 15k/€697
```

### Optie D2 — AaaS memory (vertical packs, flat)
```
Social Media Engine  €997/mo · 3 werkruimtes
Ecommerce Growth     €1.497/mo · 5 werkruimtes
Full Agency Suite    €1.997/mo · 10 werkruimtes
Founding Member      €697/mo · 5 werkruimtes (max 5 agencies, 12-mo lock)
Add-ons: Blog Factory €247 · Voice €347 · Ad Builder €347 · Extra workspace €97
```

Dit is een **fundamentele strategie-vraag** die niet in scope van deze audit valt, maar **moet beantwoord worden voor we de pricing page updaten**. Aanbevelingen:
- D2 (flat, vertical-based) matcht beter met "B2B2B geen usage-complexity friction" thesis uit aaas-strategy.md
- D1 heeft hogere ARPU maar ook hogere friction en onduidelijkheid over credits
- Legal terms moeten mee

---

## E. Structuurhygiëne

1. **i18n naar 100%** — alle hardcoded English naar translations (header nav, mega-menu, "Book a Strategy Call" CTAs, blog strings, VisionTimeline). Na copy rewrite toch doen.
2. **Orphan namespaces opschonen** — `automations`, `chatbots` (orphan), `voice-agents`, `marketing-machine` schrappen uit JSON (~600 regels × 3 locales = ~1.800 regels dead code).
3. **Route group consolidatie** — overwegen `(skills)` route group op te heffen (1 child = 1 level overhead) of juist uit te breiden met sub-group per categorie (Create & Publish / Engage & Convert).
4. **Blog hollow** — 1 post = "blog bestaat maar leeg". Kies: wegen genoeg voor launch blog (dan plannen), of blog-index uitschakelen tot er 5+ posts zijn.
5. **Legal consolideren** — 3 footer links naar 1 page is verwarrend. Ofwel splitsen in 3 pages (`/privacy`, `/terms`, `/cookies`), ofwel één link met anchor-navigatie.

---

## F. Nieuwe pages die overwogen moeten worden

| Page | Doel | Content |
|---|---|---|
| `/skills/memory-system` | Lead USP expliciet maken | 4-layer uitleg, dream consolidation, decay, per-client isolation, visuals |
| `/skills/ai-team` (of `/agents`) | Concrete maken wie Clyde's crew is | 8 agents met heartbeats + rol |
| `/case-studies/skinclarity-club` | Echte proof point ipv anonieme quotes | 3 IG accounts, 21 carrousels/week, CTR, SKC metrics |
| `/open` of `/technology` | Open-source / self-hosted framing | n8n self-hosted, Supabase EU, local-first AI, no lock-in |
| `/changelog` of `/roadmap` | Build-in-public, snelheid van ontwikkeling | Laatste wins (Paperclip, AutoFix, Multi-client, etc.) |
| `/status` | Uptime-claim onderbouwen | Monitoring link — alleen als daadwerkelijk monitoring bestaat |

---

## G. Prioriteitsmatrix

| Prioriteit | Werk | Reden | Pages aangeraakt |
|---|---|---|---|
| **P0 — blocker** | Pricing keuze D1 vs D2 maken | Niets anders afmaken zonder dit | - |
| **P0** | Skill-count beslissing (6 of 8 of 11) | Elke pagina leunt hierop | home, how-it-works, skills/*, pricing, founding-member, legal |
| **P0** | "NVIDIA NemoClaw" weghalen | Onjuist en gelijk identificeerbaar | pricing |
| **P1 — hoog** | Memory System skill page + home hero herframen | Grootste gemiste USP | home, how-it-works, nieuwe `/skills/memory-system` |
| **P1** | SkinClarity Club case study | Echte proof vervangt anonieme quotes | content-creator, social-media, chatbot (orphan → real), nieuwe `/case-studies/skc` |
| **P1** | Claims C1-C4 verwijderen/corrigeren (200+, 160+, 99.9%, <2min) | Verifieerbaar onjuist | home stats, trust badges |
| **P1** | AaaS pivot op about/how-it-works doorvoeren | Positionering | about, how-it-works |
| **P2 — medium** | AI-team page of team-sectie | Concreter dan "Clyde" abstract | nieuwe `/skills/ai-team` OF skills index |
| **P2** | Local-First AI + self-hosted n8n messaging | Moat expliciet maken | about, pricing, nieuwe `/open` of uitbreiding van about |
| **P2** | Hardcoded English naar i18n | Kwaliteit | header, CTAs, VisionTimeline |
| **P2** | Orphan namespaces schrappen | Hygiene | messages/nl.json, en.json, es.json |
| **P3 — laag** | Blog/changelog/status pages | Build-in-public | nieuwe pages |
| **P3** | Legal 3-in-1 → splitsen of anchors | UX | legal |
| **P3** | Mislabel "Enterprise AI Backbone" button fix | Bug | home |

---

## Vraag aan owner (beslissingen nodig voordat we concreet worden)

1. **Pricing**: D1 (site huidig, credits) of D2 (AaaS vertical packs)? Of hybride?
2. **Skill-count**: hoeveel skills op de site? 6 (home/nav consistent) / 8 (alle detailpages) / 11 (inclusief Blog Factory, Reel Builder, ManyChat DM, Analytics-separate)? Als 11, dan 3 pages bijmaken.
3. **Memory System positionering**: eigen `/skills/memory-system` page **OR** horizontale USP die in elke skill page terugkomt **OR** beide?
4. **SkinClarity Club case**: ben je OK om SKC als genoemde first-client te tonen (jij bent eigenaar van beide — strategische trade-off: verhoogt proof, maakt afhankelijkheid tussen brands zichtbaar)?
5. **Scope van eerste iteratie**: alleen P0+P1 (core content fix + memory USP + SKC case), of P0-P2 inclusief nieuwe pages en i18n hygiene?
6. **Open/technical framing ja/nee**: noemen we "self-hosted n8n / open-source / local-first AI" expliciet, of blijft dat achter de "enterprise infra" badge? Trade-off: open-source-framing trekt technischere bureaus aan, maar kan minder technische prospects afschrikken.
