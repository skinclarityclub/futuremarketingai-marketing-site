# Roadmap: SEO/GEO Autoriteitsprogramma — Kennisbank + Multi-tenant Blog Factory Dogfood

## Overview

Het programma bouwt FutureMarketingAI van "verkoopt SEO/GEO maar is zelf onvindbaar" naar geciteerd-door-AI-engines + rankend op non-branded keywords. De reis: eerst de SKC-grade kennisbank-infra afmaken (fundament al grotendeels geshipt), dan handmatige flagship cornerstone-content op de doel-keywords (directe autoriteit, hoogste prioriteit), dan de cross-repo machine bedraden zodat het eigen Blog Factory-product de clusters automatisch produceert (dogfood). De publishing-laag client-aware maken is een harde prerequisite voor het multi-tenant dogfood, gevolgd door auto-publish-bedrading en de WF7-engine operationeel + pillar-gekoppeld maken. Het off-site autoriteit-playbook loopt parallel als doc.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Kennisbank-infrastructuur afronden** - MDX-fundament geshipt; resteert kennisbank-hub `/resources` + GEO/agency-taxonomie & glossary
- [ ] **Phase 2: Content-pillar spine** - FMai-pillars als `fma_content_pillars`-rijen, de gedeelde strategie-spine voor blog + social
- [ ] **Phase 3: Cornerstone-content (flagship)** - 4-6 handgeschreven SKC-grade pillar/cluster/comparison-pagina's op de non-branded keywords
- [ ] **Phase 4: Multi-tenant publishing-upgrade** - `fma-app` publiceren client-aware; cross-publishing dichtgetimmerd; FMai als client geregistreerd
- [ ] **Phase 5: FMai auto-publish bedrading** - client-gefilterde publish-script-fork + GitHub Actions workflow naar `fmai-nextjs`
- [ ] **Phase 6: Engine operationeel + pillar-gekoppeld** - WF7 OAuth-fix, per-client config-load, blog↔pillar via `pillar_id`, end-to-end dogfood bewezen
- [ ] **Phase 7: Off-site autoriteit-playbook** - distributie-doc (listings, reviews, gastblogs, LinkedIn, Wikidata QID, AI-citatie-tactiek)

## Phase Details

### Phase 1: Kennisbank-infrastructuur afronden
**Goal**: De SKC-grade MDX-kennisbank is volledig ontsloten: bezoekers en AI-crawlers vinden een hub die pillars → clusters → glossary structureert. Het frontmatter-schema, de MDX-componentmap en de rijke renderer zijn al geshipt (KB-01/02/03 op `feature/seo-geo-kennisbank`); dit sluit de resterende infra.
**Depends on**: Nothing (fundament KB-01/02/03 al geshipt)
**Requirements**: KB-01, KB-02, KB-03, KB-04, KB-05
**Success Criteria** (what must be TRUE):
  1. Een bezoeker op `/resources` ziet de kennisbank-hub die pillars, hun clusters en de glossary toont, werkend in NL/EN/ES
  2. De glossary-sectie definieert de GEO/agency-termen (GEO, AI Marketing Medewerker, citation monitoring, tier caps) en is per-term linkbaar
  3. Een MDX-artikel rendert TOC, key takeaways, FAQ en citations, en emit valide Article + FAQPage JSON-LD (Article via Rich Results Test, FAQPage via Schema Markup Validator; FAQ rich result is in 2026 gedeprecieerd)
  4. `npm run build` slaagt en de hub + nieuwe URLs staan met hreflang in `sitemap.xml`
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — GEO/agency glossary: data + component + DefinedTermSet JSON-LD + i18n (KB-05)
- [x] 01-02-PLAN.md — SKC-grade GEO pillar demo-artikel; verifieert rich renderer + Article/FAQPage JSON-LD (KB-01/02/03)
- [ ] 01-03-PLAN.md — /resources hub: pillars + clusters + glossary, sitemap-hreflang + breadcrumb (KB-04)

### Phase 2: Content-pillar spine
**Goal**: FutureMarketingAI's content-strategie bestaat één keer als bron-van-waarheid in `fma_content_pillars`, zodat zowel de cornerstone-blog als de social-pipeline straks uit dezelfde pillars genereren. Dit is de strategie-spine die het hele programma verbindt; vroeg gelegd zodat cornerstone-content er direct op kan mappen.
**Depends on**: Nothing (data-definitie in `fma-app` Supabase, parallel uitvoerbaar)
**Requirements**: PILR-01
**Success Criteria** (what must be TRUE):
  1. FMai's pillars (GEO, AI marketing automation voor bureaus, agency-ops/proof, product/Clyde) bestaan als `fma_content_pillars`-rijen onder FMai's `client_id`
  2. Elke pillar-rij heeft een ingevuld `prompt_context` (topics, funnel_stage, weight) dat later door WF7 geladen kan worden
  3. De pillar/cluster-map van de cornerstone-content (Phase 3) mapt 1-op-1 op deze pillar-rijen (geen wees-cluster zonder pillar)
**Plans**: TBD

### Phase 3: Cornerstone-content (flagship) — PRIORITEIT
**Goal**: 4-6 diepe, autoritatieve cornerstone-pagina's staan live op exact de non-branded doel-keywords uit de audit, NL authoritative, SKC-grade. Dit levert directe topical authority + AI-citatie-kandidaten zonder op de engine of publishing te wachten — de door de user gekozen prioriteit.
**Depends on**: Phase 1 (hub + renderer), Phase 2 (pillars om op te mappen)
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, CONT-08
**Success Criteria** (what must be TRUE):
  1. De GEO-pillargids en de "AI marketing automation voor bureaus"-pillargids staan live, elk 1500-3000 woorden met TOC/takeaways/FAQ/citations
  2. De vier clusters (GEO vs SEO, meten in AI Overviews, GEO-monitoring tools, Wat is een AI Marketing Medewerker) staan live en linken pillar↔cluster consistent
  3. De comparison money-page "Clyde vs Jasper vs ChatGPT vs Semrush" staat live met ComparisonTable en één `/apply`-CTA
  4. Elke cornerstone heeft precies één `/apply`-CTA, valide FAQPage-schema, en verschijnt in de `/resources`-hub onder de juiste pillar
  5. Mobiel getest per page (testing-playbook); JSON-LD valideert; Lighthouse/CWV niet geregresseerd
**Plans**: TBD

### Phase 4: Multi-tenant publishing-upgrade — PREREQUISITE
**Goal**: Publiceren in `fma-app` wordt client-aware zodat FMai als publicerende client erbij kan zónder SKC te breken. Dit dicht meteen de latente cross-publishing-bug. Harde prerequisite: FMai mag NIET als publicerende client live voordat de client-scoped filter bewezen is.
**Depends on**: Phase 2 (FMai client/pillar-context bestaat)
**Requirements**: PUB-01, PUB-02, PUB-03, PUB-04, PUB-05
**Success Criteria** (what must be TRUE):
  1. Per-client `target_site`-config bestaat als één bron van waarheid (`fma_blog_client_config` of keyed `content_config_store`), met FMai → `fmai-nextjs` repo/branch/`content/blog`
  2. `blog-publish.ts` resolvet config op `article.client_id` (geen globale `.single()`), en de SKC-cron is geretrofit met een `client_id`-filter
  3. FutureMarketingAI staat als `fma_clients`-rij met eigen brand-voice, `website_url` en `GITHUB_TOKEN_FMAI`
  4. BEWEZEN geen cross-publishing: twee test-rijen (SKC + FMai `client_id`) in `blog_articles` routeren elk naar de juiste repo, DB-output gecheckt, SKC's productie ongebroken
**Plans**: TBD

### Phase 5: FMai auto-publish bedrading
**Goal**: De bewezen SKC-publish-machine is gefork't en client-gefilterd zodat FMai's `blog_articles`-rijen automatisch als MDX in `fmai-nextjs/content/blog/` landen en live gaan via GitHub Actions. Dit maakt het pad dashboard → repo voor FMai compleet (één helft van de dogfood-loop).
**Depends on**: Phase 4 (client-scoped publish-filter), Phase 1 (fmai-frontmatter-schema)
**Requirements**: APUB-01, APUB-02
**Success Criteria** (what must be TRUE):
  1. De gefork'te `auto-publish-blogs.mjs` schrijft MDX naar `content/blog/` met correcte fmai-frontmatter-mapping en filtert op FMai's `client_id`
  2. De GitHub Actions workflow draait op cron, commit de MDX en triggert ISR-revalidate, met `SUPABASE_SERVICE_ROLE_KEY` als secret
  3. Een handmatig gemarkeerde FMai-`blog_articles`-rij verschijnt na een workflow-run als live artikel op `fmai-nextjs`, zonder SKC-rijen te raken
**Plans**: TBD

### Phase 6: Engine operationeel + pillar-gekoppeld
**Goal**: De WF7-engine is operationeel (OAuth-gat gefixt), laadt per-client config, koppelt blog aan de pillar-spine via `pillar_id`, en de volledige dogfood-loop is end-to-end bewezen: dashboard-generatie → `blog_articles` → auto-publish → live op `fmai-nextjs`. Dit maakt de "alles verbonden"-architectuur echt.
**Depends on**: Phase 5 (auto-publish live), Phase 2 (pillar-spine voor `pillar_id`)
**Requirements**: ENG-01, ENG-02, ENG-03, ENG-04
**Success Criteria** (what must be TRUE):
  1. WF7 is operationeel na OAuth-fix: een generate-request produceert een valide `blog_articles`-rij met juiste status + `client_id` (live n8n-run, DB-output gecheckt)
  2. WF7 laadt per request de per-client config (voice/audience/compliance) van de aanvragende client
  3. De generate-flow accepteert een optionele `pillar_id` en WF7 laadt de bijbehorende `fma_content_pillars.prompt_context`, zodat blog uit dezelfde strategie komt als social
  4. End-to-end dogfood bewezen: dashboard-generatie voor FMai → `blog_articles` → auto-publish → live artikel op `fmai-nextjs`, volledige keten en DB-output geverifieerd
**Plans**: TBD

### Phase 7: Off-site autoriteit-playbook
**Goal**: Een uitvoerbaar off-site autoriteit-playbook bestaat als doc — de grootste echte hefboom voor non-branded ranking + AI-citaties. Geen code; uitvoering is handmatig/maandenlang en bewust out of scope. Parallel uitvoerbaar vanaf elk moment.
**Depends on**: Nothing (parallel, doc-only)
**Requirements**: OFF-01
**Success Criteria** (what must be TRUE):
  1. Een doc in `docs/plans/` beschrijft concreet: directory/listicle-listings ("best GEO tools 2026"), reviews (G2/Capterra), gastblogs/podcasts, LinkedIn-cadans en klant-quotes
  2. Het playbook bevat de Wikidata QID-tactiek (placeholder staat al in `seo-config.ts`) en een AI-citatie-tactiek gekoppeld aan de cornerstone-vergelijkingen uit Phase 3
  3. Het playbook is direct uitvoerbaar als checklist/cadans zonder verdere research
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order. Phase 2 en Phase 7 zijn parallelliseerbaar (geen blokkerende deps); Phase 3 is de prioriteit zodra 1+2 staan. Phase 4 is harde prerequisite voor 5+6.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Kennisbank-infrastructuur afronden | 2/3 | In progress (KB-01/02/03 geshipt + end-to-end bewezen; KB-05 done) | - |
| 2. Content-pillar spine | 0/TBD | Not started | - |
| 3. Cornerstone-content (flagship) | 0/TBD | Not started | - |
| 4. Multi-tenant publishing-upgrade | 0/TBD | Not started | - |
| 5. FMai auto-publish bedrading | 0/TBD | Not started | - |
| 6. Engine operationeel + pillar-gekoppeld | 0/TBD | Not started | - |
| 7. Off-site autoriteit-playbook | 0/TBD | Not started | - |
