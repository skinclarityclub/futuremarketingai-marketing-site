# SEO/GEO Autoriteitsprogramma — Kennisbank + Multi-tenant Blog Factory Dogfood

## What This Is

Een content-autoriteit + integratie-programma voor de FutureMarketingAI marketing-site (`fmai-nextjs`). Het bouwt een SKC-grade kennisbank (pillar/cluster MDX-content) gericht op non-branded SEO + GEO-keywords, en bedraadt de bestaande multi-tenant Blog Factory (`fma-app` dashboard + `FMai` n8n-engine) zodat die de content voor FutureMarketingAI zélf genereert (dogfood). Voor Daley / FutureMarketingAI, om non-branded zoek- en AI-citatie-zichtbaarheid te verhogen.

## Core Value

FutureMarketingAI wordt geciteerd door AI-engines (ChatGPT, Perplexity, Google AI Overviews) en rankt op non-branded GEO/agency-keywords, door diepe, autoritatieve content die het eigen Blog Factory-product produceert. Als dit werkt is de "wij verkopen SEO/GEO maar zijn zelf onvindbaar"-paradox opgelost.

## Requirements

### Validated

<!-- Bestaand / al geshipt — bevestigd waardevol. -->

- ✓ SOTA technische SEO-laag (schema entity-graph, hreflang NL/EN/ES, `robots.ts` + `llms.txt` met 17 AI-crawlers, multi-locale sitemap) — bestaand
- ✓ SKC-grade MDX kennisbank-infrastructuur (rijk frontmatter-schema, 7 MDX-componenten, renderer-wiring, FAQ-schema, OG/heroImage) — Fase A-fundament, geshipt op `feature/seo-geo-kennisbank`, build groen
- ✓ Blog Factory datamodel is multi-tenant (`blog_articles.client_id` + `organization_id`, `fma_clients`-registry, per-client `fma_content_pillars`) — bestaand in `fma-app`
- ✓ Bewezen publish-pijplijn voor SKC (n8n → Supabase → GitHub Actions → MDX → Vercel) — bestaand, draait live voor `skinclarityclub.nl`

### Active

<!-- Huidige scope. Hypotheses tot geshipt + gevalideerd. -->

- [ ] Kennisbank-hub (`/resources`) + i18n-namespace die pillars → clusters → glossary ontsluit (Fase A-rest)
- [ ] 4-6 flagship cornerstone pillar/comparison-pagina's op exact de non-branded keywords, NL authoritative, SKC-grade (Fase B)
- [ ] FMai content-pillars gedefinieerd in `fma_content_pillars` als gedeelde strategie-spine (Fase B)
- [ ] Multi-tenant publishing-upgrade in `fma-app`: per-client `target_site`, client-scoped config-resolutie + publish-filter, SKC-cron retrofit, FMai als `fma_clients`-rij (Fase C, prerequisite)
- [ ] FMai auto-publish-bedrading: client-gefilterde fork van het SKC-script + GitHub Actions workflow (Fase D)
- [ ] WF7-engine operationeel (OAuth-fix), client-config laden, blog gekoppeld aan `fma_content_pillars` via `pillar_id` (Fase E)
- [ ] Off-site autoriteit-playbook als doc (Fase F)

### Out of Scope

<!-- Expliciete grenzen, met reden. -->

- Off-site autoriteit-uitvoering (echte backlink-outreach, PR, gastblogs) — we leveren alleen het playbook-doc; uitvoering is handmatig/doorlopend over maanden
- Vervangen van de technische SEO-laag — al SOTA, niet aanraken
- SKC's live pipeline wijzigen voorbij de minimale client-scoping retrofit die nodig is om cross-publishing te voorkomen
- Een compleet nieuwe WF7-engine bouwen — we maken de bestaande stub operationeel + pillar-aware, niet from scratch
- Engelse/Spaanse vertalingen van cornerstone-content — NL eerst; vertalen is een latere stap

## Context

**Aanleiding:** Een ChatGPT-audit gaf de site 5,5-6/10 op SEO/GEO. Na verificatie: het meetinstrument is onbetrouwbaar (ChatGPT ziet de schema/crawl-laag niet en onderschat die), maar de conclusie klopt — content-diepte (1 blogpost, 1 interne case study, 0 gidsen/vergelijkingen) en off-site autoriteit (nieuw domein, ~0 backlinks) zijn zwak. Dat is ~75% van non-branded ranking + AI-citaties en kost maandenlang publiceren, geen quick fix.

**Drie geverifieerde "ontworpen-maar-niet-bedraad" gaps in de Blog Factory:**
1. Publiceren is single-tenant (één globale `target_site`, `content_config_store` zonder client-scoping, SKC-cron filtert niet op `client_id`) → cross-publishing-risico. Prerequisite-fix voor FMai.
2. Generatie-engine WF7 (`34PqLtFS`) is een stub, geblokkeerd door een Google OAuth-gat.
3. Blog leest de gedeelde `fma_content_pillars`-strategie niet; alleen de social-pipeline doet dat. `pillar_page` in de blog is enkel een artikeltype, geen strategie-koppeling.

**Referentiemodel (niet wijzigen):** `skinclarityclub` heeft 9 SKC-grade MDX-artikelen, pillar/cluster, auto-published via dezelfde machine. Dit is het bewezen model dat we op FMai richten.

**Repos:** primair `fmai-nextjs` (deze repo). Cross-repo: `fma-app` (dashboard + Supabase, project `nurdldgqxseunotmygzn`) en `FMai` (self-hosted n8n op `n8n.future-marketing.ai`). Pricing/brand-SSoT en conventies per `CLAUDE.md`.

**Volledig goedgekeurd plan:** `C:\Users\daley\.claude\plans\ik-heb-chatgpt-net-floating-bear.md` (bron voor fasen, kritieke bestanden, verificatie).

## Constraints

- **Tech stack**: Next.js 16 + next-intl + Tailwind 4, MDX file-based content; `fma-app` Supabase (gedeeld project `nurdldgqxseunotmygzn`); `FMai` n8n self-hosted — keuzes liggen vast, niet herzien
- **Multi-tenant veiligheid**: FMai mag NIET als publicerende client live voordat de client-scoped publish-filter bestaat, anders lekt content tussen SKC en FMai
- **Copy**: NL authoritative, Engels in code, geen em-dashes in user-facing copy
- **Cross-repo**: wijzigingen in `fma-app`/`FMai` vereisen build/live-pipeline-validatie in die repos; n8n altijd live run + DB-output checken
- **Volgorde**: cornerstone-content eerst (levert autoriteit zonder op engine/publishing te wachten); publishing-prerequisite vóór auto-flow live gaat

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Cornerstone-content eerst (handmatig, SKC-grade) vóór auto-engine | Directe autoriteit + kwaliteitscontrole op juist de stukken die AI citeert; niet wachten op WF7/publishing | — Pending |
| SKC-grade artikelmodel (TOC/FAQ/citations/pillar-cluster) | Past bij een merk dat SEO/GEO verkoopt; sterkste E-E-A-T + citatie-signaal | ✓ Fase A geshipt |
| Bestaande Blog Factory dogfoodden i.p.v. nieuw bouwen | Machine bestaat + draait bewezen voor SKC; alleen op FMai richten | — Pending |
| Blog + social unificeren op `fma_content_pillars`-spine | Eén strategie → carousel en cornerstone over hetzelfde thema | — Pending |
| Multi-tenant publishing-upgrade als harde prerequisite | Voorkomt cross-publishing-bug + maakt N clients mogelijk | — Pending |

---
*Last updated: 2026-06-02 after initialization*
