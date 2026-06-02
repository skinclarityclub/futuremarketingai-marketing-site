# Requirements: SEO/GEO Autoriteitsprogramma

**Defined:** 2026-06-02
**Core Value:** FutureMarketingAI wordt geciteerd door AI-engines en rankt op non-branded GEO/agency-keywords, via diepe content die het eigen Blog Factory-product produceert.

## v1 Requirements

### Kennisbank-infrastructuur (KB)

- [x] **KB-01**: SKC-grade frontmatter-schema (heroImage/readTime/keyTakeaways/faqs/citations/tableOfContents/pillar/clusterOf/relatedSlugs/schemaType) in `src/lib/blog.ts` — *geshipt*
- [x] **KB-02**: MDX-componentmap (Callout, ComparisonTable, KeyTakeaways, TableOfContents, CtaBlock, Citations, BlogFaq) beschikbaar in elke MDX-body — *geshipt*
- [x] **KB-03**: Blog-renderer rendert TOC/takeaways/FAQ/citations, emit FaqJsonLd, hero in OG, BlogPosting/Article schemaType — *geshipt*
- [x] **KB-04**: Kennisbank-hub route (`/resources`) ontsluit pillars → clusters → glossary, i18n NL/EN/ES — *geshipt (01-03): hub-page + PillarHubCard (graceful empty state), WebPage/DefinedTermSet/Breadcrumb JSON-LD, sitemap-hreflang nl/en/es*
- [x] **KB-05**: GEO/agency-taxonomie + glossary-sectie (GEO, AI Marketing Medewerker, citation monitoring, tier caps) — *data + component + DefinedTermSet JSON-LD + NL/EN/ES i18n geshipt (01-01); rendert op /resources via Plan 03*

### Cornerstone-content (CONT)

- [x] **CONT-01**: GEO pillar-gids ("wat is GEO / generative engine optimization") gepubliceerd, SKC-grade, NL authoritative
- [x] **CONT-02**: "GEO vs SEO: waar investeren in 2026" cluster gepubliceerd
- [x] **CONT-03**: "Hoe meet je zichtbaarheid in AI Overviews" cluster gepubliceerd
- [x] **CONT-04**: "GEO monitoring tools voor ChatGPT en Perplexity" cluster gepubliceerd
- [x] **CONT-05**: "AI marketing automation voor bureaus" pillar-gids gepubliceerd
- [x] **CONT-06**: "Wat is een AI Marketing Medewerker (Clyde)" cluster gepubliceerd
- [x] **CONT-07**: Comparison money-page "Clyde vs Jasper vs ChatGPT vs Semrush" gepubliceerd
- [x] **CONT-08**: Interne links pillar↔cluster consistent + elke cornerstone heeft één /apply-CTA

### Cornerstone-content batch 2 (CONT-09..CONT-16, Phase 8)

- [x] **CONT-09**: Agency-ops pillargids "marketingbureau schalen met AI" (operating-model framing) gepubliceerd, SKC-grade, NL authoritative — *slug `marketingbureau-schalen-met-ai`, category agency-ops, pillar*
- [x] **CONT-10**: Cluster "AI efficiëntie marketingbureau" (welk werk AI overneemt, human-in-the-loop, AVG) gepubliceerd — *clusterOf marketingbureau-schalen-met-ai*
- [x] **CONT-11**: Cluster "meetbare AI marketing resultaten" (ROI-meet-framework, geen beloofd cijfer) gepubliceerd — *clusterOf marketingbureau-schalen-met-ai*
- [x] **CONT-12**: Cluster "AI marketing resultaat in de praktijk" (proof/case via Sindy als operator, geen verzonnen cijfers, geen Daley-mede-eigendom) gepubliceerd — *clusterOf marketingbureau-schalen-met-ai*
- [x] **CONT-13**: Product/Clyde pillargids "AI Marketing Medewerker" (productcategorie: autonomie + geheugen + vaardigheden, Clyde als implementatie) gepubliceerd, kannibaliseert CONT-06 niet — *slug `ai-marketing-medewerker`, category product-clyde, pillar*
- [x] **CONT-14**: Cluster "AI agent vs AI tool marketing" (categorie-distinctie, werkmodel niet features) gepubliceerd — *clusterOf ai-marketing-medewerker*
- [x] **CONT-15**: Cluster "AI marketing agent geheugen en leren" (per-merk geheugen + leren, link naar /memory) gepubliceerd — *clusterOf ai-marketing-medewerker*
- [x] **CONT-16**: Hub + homepage-teaser wiring (4e bucket product-clyde + i18n nl/en/es; teaser-add van beide pillars) + bidirectioneel pillar↔cluster link-netwerk + één /apply-CTA per page + geen wees-cluster

### Content-pillar spine (PILR)

- [x] **PILR-01**: FMai content-pillars gedefinieerd in `fma_content_pillars` (GEO, AI marketing automation voor bureaus, agency-ops/proof, product/Clyde) als gedeelde strategie-spine

### Multi-tenant publishing (PUB)

- [ ] **PUB-01**: Per-client `target_site`-config (via `fma_blog_client_config` of keyed `content_config_store`) — één bron van waarheid
- [ ] **PUB-02**: Client-scoped config-resolutie in `blog-publish.ts` (resolve op `article.client_id`, niet globale `.single()`)
- [ ] **PUB-03**: Client-scoped publish-filter; SKC-cron geretrofit met `client_id`-filter zodat clients elkaars rijen niet pakken
- [ ] **PUB-04**: FutureMarketingAI geregistreerd als `fma_clients`-rij + config (`target_site` → `fmai-nextjs` repo/branch/`content/blog`, eigen GitHub-token)
- [ ] **PUB-05**: Bewezen geen cross-publishing: SKC + FMai test-rijen routeren elk naar de juiste repo

### Auto-publish bedrading (APUB)

- [ ] **APUB-01**: Client-gefilterde fork van `auto-publish-blogs.mjs` schrijft MDX naar `content/blog/` met fmai-frontmatter-mapping
- [ ] **APUB-02**: GitHub Actions workflow (cron + commit + ISR-revalidate), `SUPABASE_SERVICE_ROLE_KEY` als secret

### Engine (ENG)

- [ ] **ENG-01**: WF7 Google OAuth-gat gefixt; engine operationeel (produceert valide `blog_articles`-rij met juiste status + `client_id`)
- [ ] **ENG-02**: WF7 laadt per-client config (voice/audience/compliance) per request
- [ ] **ENG-03**: Blog gekoppeld aan `fma_content_pillars` via optionele `pillar_id` in de generate-flow + WF7 laadt pillar-`prompt_context`
- [ ] **ENG-04**: End-to-end dogfood-run bewezen: dashboard-generatie → `blog_articles` → auto-publish → live op `fmai-nextjs`, DB-output gecheckt

### Off-site autoriteit (OFF)

- [ ] **OFF-01**: Off-site autoriteit-playbook-doc opgeleverd (directory/listicle-listings, reviews, gastblogs/podcasts, LinkedIn-cadans, Wikidata QID, AI-citatie-tactiek)

## v2 Requirements

### Internationalisatie content (I18N)

- **I18N-01**: EN/ES vertalingen van cornerstone-content (NL eerst; vertalen later)

### Schaal & meting (SCALE)

- **SCALE-01**: GEO-citatie-monitoring dashboard / herhaalmeting na 4-8 weken om citatie-groei te kwantificeren
- **SCALE-02**: Derde client toevoegen aan de multi-tenant Blog Factory (bewijs van N-client schaalbaarheid)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Off-site autoriteit-uitvoering (echte outreach/PR) | Playbook-doc only; uitvoering is handmatig + maandenlang |
| Vervangen technische SEO-laag | Al SOTA — niet aanraken |
| SKC live-pipeline wijzigen voorbij client-scoping retrofit | Risico op breken van werkende productie |
| WF7-engine from scratch herbouwen | Bestaande stub operationeel maken + pillar-aware volstaat |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| KB-01 | Phase 1 | Complete (geshipt + end-to-end bewezen via 01-02 pillar-artikel) |
| KB-02 | Phase 1 | Complete (geshipt + end-to-end bewezen via 01-02 pillar-artikel) |
| KB-03 | Phase 1 | Complete (geshipt + end-to-end bewezen via 01-02 pillar-artikel) |
| KB-04 | Phase 1 | Complete (01-03) |
| KB-05 | Phase 1 | Complete (01-01) |
| PILR-01 | Phase 2 | Complete |
| CONT-01 | Phase 3 | Complete |
| CONT-02 | Phase 3 | Done |
| CONT-03 | Phase 3 | Done |
| CONT-04 | Phase 3 | Complete |
| CONT-05 | Phase 3 | Complete |
| CONT-06 | Phase 3 | Complete |
| CONT-07 | Phase 3 | Complete |
| CONT-08 | Phase 3 | Complete |
| CONT-09 | Phase 8 | Planned |
| CONT-10 | Phase 8 | Planned |
| CONT-11 | Phase 8 | Planned |
| CONT-12 | Phase 8 | Planned |
| CONT-13 | Phase 8 | Planned |
| CONT-14 | Phase 8 | Complete |
| CONT-15 | Phase 8 | Complete |
| CONT-16 | Phase 8 | Planned |
| PUB-01 | Phase 4 | Pending |
| PUB-02 | Phase 4 | Pending |
| PUB-03 | Phase 4 | Pending |
| PUB-04 | Phase 4 | Pending |
| PUB-05 | Phase 4 | Pending |
| APUB-01 | Phase 5 | Pending |
| APUB-02 | Phase 5 | Pending |
| ENG-01 | Phase 6 | Pending |
| ENG-02 | Phase 6 | Pending |
| ENG-03 | Phase 6 | Pending |
| ENG-04 | Phase 6 | Pending |
| OFF-01 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 33 totaal (3 al geshipt: KB-01/02/03; +8 CONT-09..16 toegevoegd voor Phase 8 op 2026-06-02)
- Mapped to phases: 33/33 ✓ (geen wezen, geen duplicaten)
- Unmapped: 0

---
*Requirements defined: 2026-06-02*
*Last updated: 2026-06-02 after roadmap creation*
