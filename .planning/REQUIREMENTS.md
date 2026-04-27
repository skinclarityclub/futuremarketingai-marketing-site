# Requirements: FMai AaaS Pivot

**Defined:** 2026-03-20
**Core Value:** Marketing agencies can scale without hiring by deploying an AI Marketing Employee with pluggable skills

## v1 Requirements

Requirements for AaaS launch. Each maps to roadmap phases.

### Website Rebrand

- [x] **WEB-01**: All homepage copy targets "marketing agencies" instead of "businesses" (EN/NL/ES)
- [x] **WEB-02**: Hero section communicates "AI Marketing Employee for agencies" value prop
- [x] **WEB-03**: Service pages restructured as skill pages (/skills/content-creator, /skills/voice-agent, /skills/lead-qualifier, /skills/social-media, /skills/ad-creator, /skills/reporting)
- [x] **WEB-04**: Pricing page shows Agent tiers (Founding Member EUR 997, Starter EUR 1,497, Growth EUR 1,997, Agency EUR 3,497) with skill add-ons
- [x] **WEB-05**: Founding member landing page with 10-spot scarcity, benefits, and signup CTA
- [x] **WEB-06**: Trust badges updated ("GDPR-First", "Powered by Enterprise AI", "Dutch Support")
- [x] **WEB-07**: Stats section updated with agency-relevant metrics
- [x] **WEB-08**: Testimonials/social proof rewritten for agency audience
- [x] **WEB-09**: FAQ rewritten for agency buyer questions
- [x] **WEB-10**: SEO metadata updated (titles, descriptions, JSON-LD) for "AI marketing employee agencies"
- [x] **WEB-11**: Navigation restructured (Services dropdown -> Skills dropdown)
- [x] **WEB-12**: Footer links and descriptions updated for AaaS positioning
- [x] **WEB-13**: About page rewritten with AaaS mission and agency focus
- [x] **WEB-14**: How-it-works page reframed as agent onboarding journey
- [x] **WEB-15**: Chatbot demo personas updated for agency use cases

### Dashboard Reframe

- [x] **DASH-01**: Sidebar labels reframed (Pipeline → Agent Activity, Campaigns → Tasks, etc.)
- [x] **DASH-02**: Dashboard overview shows "AI Employee" status and daily activity summary
- [x] **DASH-03**: Agency data model implemented (fma_agencies table, agency → clients hierarchy)
- [x] **DASH-04**: Client workspace management page (agency creates/manages client workspaces)
- [x] **DASH-05**: Skill activation toggles per client workspace (enable/disable content, voice, ads, etc.)
- [x] **DASH-06**: Stripe billing integration (base agent subscription + skill add-on products)
- [ ] **DASH-07**: Agency onboarding wizard (signup → first client → first skill activation)
- [x] **DASH-08**: Route redirects for renamed pages (old routes → new routes)

### n8n Multi-Tenant

- [x] **N8N-01**: Init Config parameterized for agency client context (brand voice, accounts, API keys per client)
- [x] **N8N-02**: R&P Pipeline runs per-client with isolated data (content_schedule per client)
- [x] **N8N-03**: Posting Pipeline parameterized for per-client social accounts
- [x] **N8N-04**: Agency client setup workflow (new client → auto-configure all active skill workflows)
- [x] **N8N-05**: Usage metering per client (execution count, content items, voice minutes logged to Supabase)
- [ ] **N8N-06**: Daily Analytics Collector activated and parameterized per client
- [ ] **N8N-07**: Weekly Performance Intelligence activated with per-client reporting
- [ ] **N8N-08**: Error handling sends per-client notifications (Telegram/Slack to agency owner)

### Compliance

- [x] **COMP-01**: AI-disclosure text implemented in chatbot widget ("Ik ben een AI-assistent")
- [x] **COMP-02**: AI-disclosure in voice agent (Vapi greeting identifies as AI)
- [x] **COMP-03**: Verwerkersovereenkomst (DPA) template drafted
- [x] **COMP-04**: DPIA document created for AI agent data processing
- [x] **COMP-05**: Terms of service updated with AaaS-specific clauses and liability limits
- [x] **COMP-06**: Privacy policy updated for agent data processing

### Go-to-Market

- [x] **GTM-01**: LinkedIn profile optimized for "AI Marketing Employee for agencies" positioning
- [x] **GTM-02**: Demo video created (under 5 min, showing agent skills in action)
- [ ] **GTM-03**: 50 target agencies identified (30 NL, 20 UK) matching ICP
- [ ] **GTM-04**: Founding member outreach sequence (LinkedIn engagement → DM → call → close)
- [ ] **GTM-05**: 3-5 founding members signed (EUR 997/mo, 6-month commitment)

### Post-Audit Hardening (2026-04-24)

Requirements added from the 2026-04-24 full-site audit. Decomposed parent IDs map to roadmap phases 10-15.

#### AUDIT-P1-SEO-GEO (Phase 14) — SEO + GEO Depth Upgrade

Parent acceptance: GEO score lifts from 42/100 to 70+, all rich-result-eligible JSON-LD entities pass Google Rich Results test, meta descriptions fit SERP, AI-crawler allowlist explicit.

Sub-IDs (canonical decomposition for plan traceability):

- [ ] **SEO-GEO-01**: Organization JSON-LD has stable `@id`, `sameAs` includes LinkedIn (always) + Wikidata (when QID survives 48h check) with null-filter for the rest, 12-skill `hasOfferCatalog`, 10-topic `knowsAbout`, correct `foundingDate`, `founder` as `@id` reference. Crunchbase intentionally absent per DECISIONS-2026-04-24.md Q4 (Phase 14-01)
- [ ] **SEO-GEO-02**: PersonJsonLd component exists and renders for Daley on `/about` and Sindy on `/case-studies/skinclarity-club` across NL/EN/ES, with `worksFor`/`@id` cross-references (Phase 14-01 + 14-02)
- [ ] **SEO-GEO-03**: ServiceJsonLd renders on all 12 `/skills/*` pages with `@id`, `provider` referencing Organization `@id`, and `serviceType` (Phase 14-02)
- [ ] **SEO-GEO-04**: FaqJsonLd renders on `/founding-member` + 12 skill pages with visible-FAQ word-for-word parity, NL authoritative + EN/ES translated (Phase 14-02)
- [ ] **SEO-GEO-05**: Speakable schema marks citation-target paragraphs on `/`, `/memory`, and `/case-studies/skinclarity-club` (Phase 14-02)
- [ ] **SEO-GEO-06**: ArticleJsonLd emits `image` (ImageObject + dimensions), `publisher.logo` (ImageObject + dimensions), `mainEntityOfPage`, and stable `@id` — all 4 Article rich-result requirements satisfied (Phase 14-03)
- [ ] **SEO-GEO-07**: `robots.ts` declares explicit `Allow` rules for ≥15 AI crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bytespider, Amazonbot, Meta-ExternalAgent, Meta-ExternalFetcher) plus wildcard fallback (Phase 14-04)
- [ ] **SEO-GEO-08**: `sitemap.xml` and `robots.txt` `Host` line use the Phase-10 canonical domain (`future-marketing.ai`); `llms.txt` reflects v10 Clyde + 12-skill + 5-tier content (Phase 14-04)
- [ ] **SEO-META-01**: All 5 audited meta descriptions (home, pricing, apply, founding-member, how-it-works) ≤155 chars across NL/EN/ES with primary keyword in first 100 chars — eliminates SERP truncation (Phase 14-03)
- [ ] **SEO-META-02**: Legal pages (privacy, terms, cookies) route through `generatePageMetadata` so they emit OG image + Twitter card + hreflang alternates and appear in `sitemap.xml` (Phase 14-03)

## v2 Requirements

Deferred to after founding member validation.

### Advanced Skills

- **SKILL-01**: Ad Creator skill with Meta Ads direct publishing per client
- **SKILL-02**: Blog Writer skill with per-client WordPress/Webflow integration
- **SKILL-03**: SEO Optimizer skill with keyword tracking per client

### Platform Features

- **PLAT-01**: Self-serve agency signup (currently invite-only)
- **PLAT-02**: White-label dashboard for agencies to show clients
- **PLAT-03**: Skill marketplace with third-party skill templates
- **PLAT-04**: Advanced usage-based billing (per voice minute, per content item)

### Market Expansion

- **MARK-01**: Spain market launch with localized pricing
- **MARK-02**: Healthcare/dental vertical-specific compliance and templates
- **MARK-03**: E-commerce vertical-specific Shopify integrations

## Out of Scope

| Feature                             | Reason                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| Building on OpenClaw/NemoClaw       | Enterprise readiness 1.2/5, alpha stage, Big Tech bans — use as narrative only |
| Mobile app                          | Web dashboard sufficient for B2B agency owners                                 |
| Real-time multi-agent orchestration | n8n scheduled workflows are production-proven and sufficient                   |
| Custom LLM fine-tuning per client   | Prompt engineering + brand docs sufficient for v1                              |
| LATAM market                        | Currency instability, pricing mismatch — defer to Year 2                       |
| Open API for integrations           | Not needed until 50+ clients                                                   |
| Rebuilding dashboard from scratch   | 93 API routes exist; reframe labels and add agency layer                       |
| Rebuilding n8n workflows            | 115 workflows exist; parameterize for multi-tenant                             |

## Traceability

| Requirement | Phase                      | Status   |
| ----------- | -------------------------- | -------- |
| WEB-01      | Phase 1: Website Rebrand   | Done     |
| WEB-02      | Phase 1: Website Rebrand   | Done     |
| WEB-03      | Phase 1: Website Rebrand   | Done     |
| WEB-04      | Phase 1: Website Rebrand   | Pending  |
| WEB-05      | Phase 1: Website Rebrand   | Complete |
| WEB-06      | Phase 1: Website Rebrand   | Done     |
| WEB-07      | Phase 1: Website Rebrand   | Done     |
| WEB-08      | Phase 1: Website Rebrand   | Done     |
| WEB-09      | Phase 1: Website Rebrand   | Done     |
| WEB-10      | Phase 1: Website Rebrand   | Done     |
| WEB-11      | Phase 1: Website Rebrand   | Done     |
| WEB-12      | Phase 1: Website Rebrand   | Done     |
| WEB-13      | Phase 1: Website Rebrand   | Done     |
| WEB-14      | Phase 1: Website Rebrand   | Done     |
| WEB-15      | Phase 1: Website Rebrand   | Complete |
| DASH-01     | Phase 2: Dashboard Reframe | Complete |
| DASH-02     | Phase 2: Dashboard Reframe | Complete |
| DASH-03     | Phase 2: Dashboard Reframe | Complete |
| DASH-04     | Phase 2: Dashboard Reframe | Complete |
| DASH-05     | Phase 2: Dashboard Reframe | Complete |
| DASH-06     | Phase 2: Dashboard Reframe | Complete |
| DASH-07     | Phase 2: Dashboard Reframe | Pending  |
| DASH-08     | Phase 2: Dashboard Reframe | Complete |
| N8N-01      | Phase 3: n8n Multi-Tenant  | Complete |
| N8N-02      | Phase 3: n8n Multi-Tenant  | Complete |
| N8N-03      | Phase 3: n8n Multi-Tenant  | Complete |
| N8N-04      | Phase 3: n8n Multi-Tenant  | Complete |
| N8N-05      | Phase 3: n8n Multi-Tenant  | Complete |
| N8N-06      | Phase 3: n8n Multi-Tenant  | Pending  |
| N8N-07      | Phase 3: n8n Multi-Tenant  | Pending  |
| N8N-08      | Phase 3: n8n Multi-Tenant  | Pending  |
| COMP-01     | Phase 4: Compliance        | Pending  |
| COMP-02     | Phase 4: Compliance        | Pending  |
| COMP-03     | Phase 4: Compliance        | Complete |
| COMP-04     | Phase 4: Compliance        | Complete |
| COMP-05     | Phase 4: Compliance        | Complete |
| COMP-06     | Phase 4: Compliance        | Complete |
| GTM-01      | Phase 5: Go-to-Market      | Complete |
| GTM-02      | Phase 5: Go-to-Market      | Complete |
| GTM-03      | Phase 5: Go-to-Market      | Pending  |
| GTM-04      | Phase 5: Go-to-Market      | Pending  |
| GTM-05      | Phase 5: Go-to-Market      | Pending  |
| SEO-GEO-01  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-02  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-03  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-04  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-05  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-06  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-07  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-GEO-08  | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-META-01 | Phase 14: SEO + GEO Depth  | Pending  |
| SEO-META-02 | Phase 14: SEO + GEO Depth  | Pending  |

**Coverage:**

- v1 requirements: 42 total
- Post-audit P1 requirements: 10 (parent: AUDIT-P1-SEO-GEO)
- Mapped to phases: 52
- Unmapped: 0

---

_Requirements defined: 2026-03-20_
_Last updated: 2026-04-27 — Phase 14 sub-IDs added per AUDIT-P1-SEO-GEO decomposition_
