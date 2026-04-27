# Roadmap: FMai AaaS Pivot

## Overview

Transform FutureMarketingAI from a generic AI automation agency into an Agent as a Service (AaaS) platform for marketing agencies. This is a brownfield rebrand across three production codebases (website, dashboard, n8n) -- 60-70% of the product already exists. The roadmap delivers a launchable AaaS product with founding member revenue by executing parallel work streams: website rebrand and GTM outreach start immediately, compliance runs independently, while dashboard and n8n follow a dependency chain.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

**Parallel Execution:**

- **Wave A (immediate):** Phase 1, Phase 4, Phase 5 -- no dependencies, run simultaneously
- **Wave B (after Phase 1):** Phase 2 -- needs website positioning settled
- **Wave C (after Phase 2):** Phase 3 -- needs dashboard data model

- [x] **Phase 1: Website Rebrand** - All website copy, pages, and SEO reframed for agency AaaS positioning
- [ ] **Phase 2: Dashboard Reframe** - Dashboard UI relabeled and agency data model with billing implemented
- [ ] **Phase 3: n8n Multi-Tenant** - Existing workflows parameterized for per-client isolation and metering
- [x] **Phase 4: Compliance** - AI-disclosure, legal documents, and privacy policies for EU AI Act readiness
- [ ] **Phase 5: Go-to-Market** - Founding member outreach, demo assets, and first 3-5 signed agencies
- [ ] **Phase 6: Vite Feature Parity** - Port all interactive demos, missing UI sections, and enhanced language switcher from Vite to Next.js
- [ ] **Phase 7: Website Copy Overhaul** - Introduce Clyde as named AI marketing employee with task-result storytelling across all pages
- [x] **Phase 8: Clyde Chatbot Personality** - Unified Clyde persona replacing 6 personas, context-aware welcome messages, all 17 tools on every page (completed 2026-03-21)
- [ ] **Phase 9: Codebase Cleanup** - Delete Vite legacy, fix persona crash, add contact form email + analytics

---

### Post-Audit Hardening (2026-04-24)

Added after the 8-agent full-site audit. Remediates findings from `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md`. Six phases, ~66 hours total, solo-executable.

- [x] **Phase 10: Production Integrity + Domain SSoT** - Wire /api/apply + /api/contact to Resend + Supabase, sync chatbot tools + llms.txt to v10 pricing, migrate domain to `future-marketing.ai`, clear CVEs + deprecation warnings (completed 2026-04-25)
- [x] **Phase 11: EAA Accessibility Compliance** - Skip-link, keyboard-operable mega-menu, WCAG AA contrast, per-field form errors, complete reduced-motion coverage — legal risk per EAA 2025-06-28 (completed 2026-04-25)
- [x] **Phase 12: Brand Assets + Copy Polish** - og-image, complete palette migration, localize 16 hardcoded EN labels in skills-data.ts, fix 11 IK/WIJ slips + 8 klanten→merken + Onbeperkt rename, drop orphan chatbots namespace (completed 2026-04-25)
- [x] **Phase 13: Performance + Bundle Cleanup** - Lazy-mount ClientIslands on interaction, gate Spline prefetch to home, per-segment i18n, font trim, dead code purge — target 70 KB gz off non-home initial bundle (completed 2026-04-26)
- [x] **Phase 14: SEO + GEO Depth Upgrade** - Organization sameAs expansion + Wikidata + Person schema for Daley + Sindy, wire ServiceJsonLd on 12 skill pages, FaqJsonLd on founding, Speakable, meta trims, AI-crawler allowlist — lift GEO 42 → 70+ (completed 2026-04-27)
- [ ] **Phase 15: Conversion Accelerators** - Post-submit Calendly embed, demote home secondary CTA + sticky mobile CTA, SKC case-study metric rewrite (Sindy interview), lead magnet programme (NL Bureau AI Readiness PDF), pricing FAQ promotion

## Phase Details

### Phase 1: Website Rebrand

**Goal**: Agency owners visiting the website immediately understand FMai offers an AI Marketing Employee for their agency, can explore skills, see pricing, and sign up as founding members
**Depends on**: Nothing (first phase, Wave A)
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-04, WEB-05, WEB-06, WEB-07, WEB-08, WEB-09, WEB-10, WEB-11, WEB-12, WEB-13, WEB-14, WEB-15
**Success Criteria** (what must be TRUE):

1. Homepage hero communicates "AI Marketing Employee for agencies" and all body copy targets agency owners, not generic businesses (EN/NL/ES)
2. Navigation shows Skills dropdown with 6 skill pages (/skills/content-creator, /skills/voice-agent, etc.) replacing old service pages
3. Pricing page displays 4 agent tiers with skill add-ons and a founding member CTA links to dedicated landing page with 10-spot scarcity
4. All supporting pages (About, How-it-works, FAQ) reflect AaaS positioning with agency-relevant trust badges, stats, and social proof
5. SEO metadata (titles, descriptions, JSON-LD, sitemap) targets "AI marketing employee agencies" keywords in all 3 languages
   **Plans**: 5 plans

Plans:

- [x] 01-01-PLAN.md — Core copy rebrand: all 3 locale files + SEO config (Wave 1)
- [x] 01-02-PLAN.md — Navigation restructure + skill routes + redirects + sitemap (Wave 1)
- [x] 01-03-PLAN.md — Pricing page redesign + homepage updates + chatbot personas (Wave 2)
- [x] 01-04-PLAN.md — Gap closure: missing locale namespaces for skill/founding-member pages + how-it-works fix (Wave 3)
- [x] 01-05-PLAN.md — Gap closure: chatbot persona engines rewritten for agency use cases (Wave 3)

### Phase 2: Dashboard Reframe

**Goal**: Agency owners can log into the dashboard, see their AI Employee status, create client workspaces, activate skills per client, and manage their subscription
**Depends on**: Phase 1 (positioning language settled)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08
**Success Criteria** (what must be TRUE):

1. Sidebar and overview use "AI Employee" language (Agent Activity, Tasks, Skills) and old route URLs redirect to new ones
2. Agency data model exists in Supabase (fma_agencies table, agency-to-clients hierarchy) with RLS policies
3. Agency owner can create client workspaces and toggle skills on/off per workspace from the dashboard
4. Stripe billing is connected: agency subscribes to a base agent tier and can add/remove skill add-ons that update their invoice
5. New agency owner completes onboarding wizard (signup, first client creation, first skill activation) in a guided flow
   **Plans**: 4 plans

Plans:

- [ ] 02-01-PLAN.md — Agency data model migration + skills config + sidebar relabel + route redirects (Wave 1)
- [ ] 02-02-PLAN.md — Stripe billing integration: tier config, checkout, webhook, billing page (Wave 2)
- [ ] 02-03-PLAN.md — Dashboard overview + client workspace management + skill toggles (Wave 2)
- [ ] 02-04-PLAN.md — Agency onboarding wizard + visual verification checkpoint (Wave 3)

### Phase 3: n8n Multi-Tenant

**Goal**: Existing n8n workflows run isolated per client with correct brand context, and usage is metered and reported back to the dashboard
**Depends on**: Phase 2 (agency data model and client workspaces must exist)
**Requirements**: N8N-01, N8N-02, N8N-03, N8N-04, N8N-05, N8N-06, N8N-07, N8N-08
**Success Criteria** (what must be TRUE):

1. Init Config workflow loads per-client brand voice, social accounts, and API keys from Supabase agency data model
2. R&P Pipeline and Posting Pipeline execute per-client with isolated content schedules and social accounts (no cross-client data leakage)
3. New client setup workflow auto-configures all active skill workflows when an agency creates a new client workspace
4. Usage metrics (execution counts, content items, voice minutes) are logged to Supabase per client and visible in dashboard
5. Analytics collectors (Daily Intel, Weekly Performance) run per-client and error notifications route to the correct agency owner
   **Plans**: TBD

**Plans**: 3 plans

Plans:

- [ ] 03-01-PLAN.md — Usage metrics table + Content Posting Pipeline parameterization (Wave 1)
- [ ] 03-02-PLAN.md — Analytics workflows multi-client + error notification routing (Wave 1)
- [ ] 03-03-PLAN.md — Usage Metering + Agency Client Setup workflows + verification (Wave 2)

### Phase 4: Compliance

**Goal**: FMai meets EU AI Act transparency obligations and has legal documents ready for agency client contracts
**Depends on**: Nothing (independent, Wave A)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06
**Success Criteria** (what must be TRUE):

1. Website chatbot widget displays "Ik ben een AI-assistent" disclosure and voice agent greeting identifies itself as AI
2. DPA (Verwerkersovereenkomst) template is drafted and ready to send to agency clients
3. DPIA document exists covering AI agent data processing risks and mitigations
4. Terms of service and privacy policy are updated with AaaS-specific clauses, liability limits, and agent data processing descriptions
   **Plans**: 2 plans

Plans:

- [x] 04-01-PLAN.md — AI disclosure in chatbot widget + voice agent documentation (Wave 1)
- [x] 04-02-PLAN.md — DPA, DPIA legal documents + legal page ToS/privacy expansion (Wave 1)

### Phase 5: Go-to-Market

**Goal**: First 3-5 founding member agencies are signed at EUR 997/mo with 6-month commitments
**Depends on**: Nothing (starts immediately, Wave A -- pre-selling while building)
**Requirements**: GTM-01, GTM-02, GTM-03, GTM-04, GTM-05
**Success Criteria** (what must be TRUE):

1. LinkedIn profile communicates "AI Marketing Employee for agencies" positioning with AaaS-focused headline and banner
2. Demo video (under 5 min) shows agent skills in action and is published/shareable
3. 50 target agencies (30 NL, 20 UK) are identified and documented matching ICP criteria
4. Outreach sequence is executing (LinkedIn engagement, DMs, calls) with tracking
5. 3-5 agencies have signed founding member agreements (EUR 997/mo, 6-month commitment)
   **Plans**: 3 plans

Plans:

- [x] 05-01-PLAN.md — LinkedIn profile assets + demo video script + content calendar (Wave 1)
- [x] 05-02-PLAN.md — ICP checklist + target tracking CSV + outreach templates + founding member agreement (Wave 1)
- [ ] 05-03-PLAN.md — Demo call script + launch checklist + GTM execution kickoff (Wave 2)

### Phase 6: Vite Feature Parity

**Goal**: All 4 service pages (chatbots, voice agents, marketing machine, automations) have full interactive demo and UI section parity with the original Vite website, and the language switcher is enhanced with flags and analytics
**Depends on**: Phase 1 (website rebrand must be complete)
**Requirements**: WEB-01, WEB-03
**Success Criteria** (what must be TRUE):

1. Language switcher shows flag emojis, full language names, animated checkmark, and fires gtag analytics event
2. Chatbots page has 4-persona DemoPlayground, MultiPlatformShowcase, ProgressiveCTA, pricing tiers, and trust metrics
3. Voice agents page has interactive VoiceDemoSection with phone mockup, VoiceDemoFAB, pricing tiers, trust metrics, and enhanced partnership card
4. Marketing machine page has VisionTimeline, FeatureShowcase with visual hierarchy, SocialProof, ProductMedia, and pricing tiers
5. Automations page has icon-enhanced automation grid, trust metrics, ProductMedia, and pricing tiers
   **Plans**: 4 plans

Plans:

- [ ] 06-01-PLAN.md — Language switcher enhancement + shared reusable components (TrustMetrics, PricingTiers, SocialProof, ProductMedia) (Wave 1)
- [ ] 06-02-PLAN.md — Chatbots page: DemoPlayground 4th persona + MultiPlatformShowcase + ProgressiveCTA + pricing/trust (Wave 2)
- [ ] 06-03-PLAN.md — Voice agents page: VoiceDemoSection + VoiceDemoFAB + useElevenLabsCall + pricing/trust (Wave 2)
- [ ] 06-04-PLAN.md — Marketing machine + automations pages: VisionTimeline + FeatureShowcase + pricing/trust/icons (Wave 2)

### Phase 7: Website Copy Overhaul - AI Employee Messaging and Skill Page Storytelling

**Goal**: All website copy (homepage + 8 skill pages) introduces Clyde as a named AI marketing employee with task-result storytelling, premium authority tone, and native-quality EN/NL/ES copy
**Depends on**: Phase 6 (Vite feature parity must be complete)
**Requirements**: WEB-01
**Success Criteria** (what must be TRUE):

1. All 8 skill pages use translation keys for every visible string (no hardcoded English)
2. Homepage hero introduces Clyde by name with wow-first messaging hierarchy
3. Every skill page has a task-demo section showing an example command to Clyde and his response
4. Header navigation descriptions reference Clyde's capabilities
5. Dutch and Spanish copy are native-quality rewrites (not translations) with "Clyde" consistent across all languages
   **Plans**: 4 plans

Plans:

- [x] 07-01-PLAN.md — Translation architecture fix: convert chatbot/email to t() keys + extract hardcoded props from 4 other pages (Wave 1)
- [ ] 07-02-PLAN.md — Homepage + header English copy rewrite with Clyde messaging (Wave 2)
- [ ] 07-03-PLAN.md — All 8 skill pages English copy rewrite + task-demo sections (Wave 2)
- [ ] 07-04-PLAN.md — Native Dutch and Spanish rewrites of all Clyde messaging (Wave 3)

### Phase 8: Clyde Chatbot Personality - Unified Persona and Context-Aware Messaging

**Goal:** The floating chatbot widget becomes Clyde — one unified persona replacing 6 separate personas, with context-aware welcome messages, confident expert tone, and all 17 tools available on every page
**Depends on:** Phase 7 (Clyde messaging must be in place)
**Requirements**: WEB-01

**Success Criteria** (what must be TRUE):

1. All 6 persona files (flagship, concierge, demo-guide, ecommerce, leadgen, support) are replaced by a single unified Clyde persona
2. Chat header shows "Clyde" with subtitle "AI Marketing Employee" (EU AI Act disclosure)
3. Welcome message adapts per page context (12 different pages mapped)
4. Suggested prompts adapt per page context
5. Clyde has access to all 17 tools on every page and selects the right one based on context
6. Clyde's tone is confident expert + ultra-concise (max 2 sentences + tool output)
7. Default persona in chatbot store is 'clyde' instead of 'concierge'

**Plans:** 2/2 plans complete

Plans:

- [x] 08-01-PLAN.md — Unified Clyde persona + persona index rewrite + store default + prompt-builder context (Wave 1)
- [x] 08-02-PLAN.md — ChatWidgetIsland context-aware messages/prompts + ChatHeader Clyde branding + engine tool-filtering removal (Wave 2)

### Phase 9: Codebase Cleanup — Dead Code, Persona Fix, Contact Form, Analytics

**Goal:** Remove all legacy Vite code, orphaned files, and dead persona files. Fix DemoPlayground persona crash. Add working contact form email delivery and website analytics. Clean foundation for further development.
**Depends on:** Phase 8 (Clyde persona must be in place)
**Requirements**: WEB-01

**Success Criteria** (what must be TRUE):

1. Root src/, dist/, old config files, old package.json, 211 orphan markdown files, and 55 screenshot PNGs are deleted from the repo
2. Only fmai-nextjs/ project remains as active code (no dual-project confusion)
3. DemoPlayground either uses registered persona IDs or falls back gracefully (no crash on unknown persona)
4. 6 orphaned persona files (concierge.ts, flagship.ts, demo-guide.ts, ecommerce.ts, leadgen.ts, support.ts) are deleted
5. Contact form sends actual email via Resend/SendGrid when submitted (not just console.log)
6. Website analytics (Google Analytics or Plausible) is integrated and tracking page views
7. Old (services) pages either redirect to corresponding (skills) pages or are deleted
8. Header nav SKILL_CATEGORIES use translation keys (not hardcoded English)

**Plans:** 3 plans

Plans:

- [ ] 09-01-PLAN.md — Delete old Vite project (src/, dist/, configs, scripts, orphaned MDs, PNGs) (Wave 1)
- [ ] 09-02-PLAN.md — Fix DemoPlayground persona crash + delete orphaned personas + handle (services) pages (Wave 1)
- [ ] 09-03-PLAN.md — Contact form email (Resend) + Google Analytics 4 + header nav i18n (Wave 2)

---

### Phase 10: Production Integrity + Domain SSoT

**Goal**: Every public or LLM-facing surface states correct product data, every form delivers to a real mailbox plus DB row, domain `future-marketing.ai` is canonical across code and schemas, deprecation warnings and high-severity CVEs are cleared.
**Depends on**: Nothing (foundational, Wave A of audit-remediation arc)
**Requirements**: AUDIT-BLOCKER-P0-INTEGRITY
**Success Criteria** (what must be TRUE):

1. `/api/apply` and `/api/contact` deliver to Daley via Resend plus insert a row in Supabase `applications` table, with per-IP rate limit on Upstash Redis (Vercel Fluid Compute compatible), confirmation email back to applicant
2. Chatbot tools (`leadgen-tools.ts`, `concierge-tools.ts`, `concierge-kb.ts`, `support-kb.ts`) quote v10 pricing (Partner €347 / Growth €2.497 / Professional €4.497 / Enterprise €7.997 / Founding €997), include Partner tier, reference 12 skills (9 live + 3 coming_soon), import tier data from `src/lib/skills-data.ts` as single source
4. `public/llms.txt` and `public/llms-full.txt` follow llmstxt.org spec and describe only the current product (Clyde, 12 skills, 5 tiers, founding program, SKC case, memory USP, `future-marketing.ai` domain). No references to v9 bundles (chatbots, automations, voice-agents, marketing-machine)
5. Every domain reference uses `future-marketing.ai` (seo-config, OrganizationJsonLd, sitemap, hreflang, llms.txt, CLAUDE.md); Vercel 301 redirect live from `futuremarketingai.com` to `future-marketing.ai`
6. `src/middleware.ts` renamed to `src/proxy.ts` per Next.js 16 convention; `/api/vitals` returns 200 (or `@vercel/speed-insights` replaces the beacon); `npm audit --production` reports zero high-severity CVEs; single canonical user-facing email `hello@future-marketing.ai`

**Plans**: 4 plans

Plans:

- [ ] 10-01-PLAN.md — Domain SSoT migration + email unification + Vercel 301 + CLAUDE.md updates (Wave 1)
- [ ] 10-02-PLAN.md — Forms wiring: Resend + Supabase + Upstash rate-limit for /api/apply + /api/contact (Wave 2, depends on 10-01)
- [ ] 10-03-PLAN.md — Chatbot v10 sync + llms.txt regeneration + contact-email unification (Wave 2, depends on 10-01)
- [x] 10-04-PLAN.md — Next.js hygiene: proxy.ts rename + Vercel Speed Insights + 7 CVEs closed + tighter CSP (Wave 1, independent)

---

### Phase 11: EAA Accessibility Compliance

**Goal**: All five critical-path WCAG 2.2 AA violations from the UX audit are resolved, reducing European Accessibility Act (EAA, in force per 2025-06-28) legal exposure on the marketing site.
**Depends on**: Nothing (independent, Wave A of audit-remediation arc)
**Requirements**: AUDIT-BLOCKER-P0-A11Y
**Success Criteria** (what must be TRUE):

1. Skip-to-content link is first focusable element on every page, jumping to `<main id="main">` (WCAG 2.4.1)
2. Header Skills mega-menu opens on keyboard `Enter`/`Space`, exposes `aria-expanded`, supports ArrowUp/ArrowDown/Home/End/Escape navigation, and returns focus to the trigger on close (WCAG 2.1.1, 4.1.2); Resources/alt dropdowns follow same pattern
3. `--color-text-muted` is `#8C98AD` (≥4.5:1 on `#0a0d14`); no design token below WCAG AA normal text ratio remains in `globals.css` (WCAG 1.4.3)
4. ApplicationForm renders per-field error elements with `id` wired to `aria-describedby`, `aria-invalid` on failed inputs, `autoComplete` tokens on name/email/organization/organization-title/tel, and `inputMode="email"` on email fields (WCAG 3.3.1, 3.3.3, 4.1.2); ContactForm parity maintained
5. All 17 keyframes in `globals.css` respect `prefers-reduced-motion: reduce` (not just blob animations); global `*:focus-visible` ring renders 2px cyan outline; `html { scroll-padding-top: 5rem; }` respects sticky header on anchor jumps; BookingModal returns focus to trigger on close (WCAG 2.3.3, 2.4.7)

**Plans**: 3 plans

Plans:

- [ ] 11-01-PLAN.md — Skip-link + keyboard mega-menu + focus-visible + scroll-padding + BookingModal focus-return (Wave 1)
- [x] 11-02-PLAN.md — Contrast token upgrade + reduced-motion complete coverage (Wave 1, independent)
- [ ] 11-03-PLAN.md — ApplicationForm per-field error recovery + autoComplete tokens + inputMode + ContactForm i18n strings (Wave 2, after contrast is locked)

---

### Phase 12: Brand Assets + Copy Polish

**Goal**: One palette, one copy voice, one canonical set of assets across all three locales; all tier-matrix labels render in the visitor's language; legacy orphan namespace and stale color tokens are gone.
**Depends on**: Nothing (independent, Wave B — runs alongside Phases 10/11)
**Requirements**: AUDIT-BLOCKER-P0-BRAND
**Success Criteria** (what must be TRUE):

1. `public/og-image.png` (1200×630) exists, logo asset referenced by `OrganizationJsonLd.logo` exists and returns 200, dynamic `@vercel/og` fallback route generates per-locale variants
2. `src/lib/skills-data.ts` contains no hardcoded English user-facing labels; all `'unlimited'`, `'/mo'`, `'add-on €97'`, `'niet beschikbaar'`, `'Coming soon'` render via i18n keys in `messages/nl.json`, `en.json`, `es.json`; zero em-dashes in any user-facing string
3. Palette migration complete: no `#050814`, `#00D4FF`, or `#A855F7` refs remain in `.tsx` or `.css` outside of legacy archive; all colors resolve via CSS custom properties; `fmai-nextjs/CLAUDE.md` Theme section matches actual palette (`#0a0d14` / `#00d4aa`)
4. Hardcoded English strings in `HeaderClient.tsx`, `pricing/page.tsx`, `error.tsx`, `SkillsTierMatrix.tsx`, `ChatWidget.tsx`, apply-success screen are routed through i18n; NL/ES visitors never see English UI strings
5. Copy glossary enforced: no `klanten` remains on conversion pages (all replaced by `merken`), credit-pack `Onbeperkt` is renamed (`Scale` or `Max`), `Boek een strategiegesprek` normalized to `Plan een gesprek`, 11 IK/WIJ slips on about/contact/founding-member resolved per style guide; orphan `chatbots.*` namespace (nl.json:140-334) removed; `MAX_PARTNERS_PER_YEAR` interpolated via `constants.ts` in 8 message keys instead of hardcoded; legal pages show current `lastUpdated` date

**Plans**: 4 plans

Plans:

- [ ] 12-01-PLAN.md — Brand assets (og-image + logo + dynamic OG route) + palette migration + CLAUDE.md theme alignment (Wave 1)
- [ ] 12-02-PLAN.md — skills-data.ts i18n refactor + label localization + em-dash removal (Wave 1, independent)
- [ ] 12-03-PLAN.md — Hardcoded EN strings batch: HeaderClient, pricing, error, SkillsTierMatrix, ChatWidget, apply-success (Wave 1, independent)
- [ ] 12-04-PLAN.md — Copy glossary cleanup + Onbeperkt rename + IK/WIJ slips + orphan namespace + MAX_PARTNERS_PER_YEAR interpolation + legal dates (Wave 2, depends on 12-03)

---

### Phase 13: Performance + Bundle Cleanup

**Goal**: Shed roughly 70 KB gzipped from initial bundle on non-home routes, eliminate cross-page waste from eagerly mounted client islands, kill dead code, and restore a clean repo root.
**Depends on**: Nothing (independent, can run in parallel with earlier waves)
**Requirements**: AUDIT-P1-PERF
**Success Criteria** (what must be TRUE):

1. `ClientIslands` no longer eagerly mounts the full ChatWidget, CalendlyModal, or BookingModal on every route; a lightweight FloatingChatTrigger (circa 2 KB) replaces them and dynamically imports the full bundles on first interaction
2. Spline `scene.splinecode` (1.3 MB) and associated `preconnect` hints are emitted only from the homepage, not from the shared `[locale]/layout.tsx`
3. `next-intl` message delivery is split per segment: `NextIntlClientProvider` receives only the namespaces used in the current route; home no longer ships every namespace on pricing, skills, legal, etc.
4. Font loading is trimmed to at most two families; `HeaderClient` global `document.click` listener is gated by open-state; CookieConsentBanner lazy-imports and skips its bundle when consent is already granted
5. Dead code removed: `OrbitVisual.tsx`, `hero-robot.png` + `.webp`, 20-plus debug PNGs at repo root, 4 root-level verify scripts, empty nested `fmai-nextjs/fmai-nextjs/components/`, `@google/stitch-sdk` dep if confirmed unused; `npm run build` chunk report shows measurable before/after reduction; 21 outdated non-breaking deps bumped

**Plans**: 3 plans

Plans:

- [ ] 13-01-PLAN.md — ClientIslands lazy-on-interaction + Spline prefetch home-only + CookieConsent lazy + HeaderClient click listener gate + gradient-blob decision (Wave 1)
- [ ] 13-02-PLAN.md — Per-segment i18n namespace splitting (Wave 1, independent, largest technical change)
- [ ] 13-03-PLAN.md — Dead code purge + font trim + dep bumps + RSC demotions + repo-root cleanup (Wave 2, low-risk cleanup)

---

### Phase 14: SEO + GEO Depth Upgrade

**Goal**: Lift GEO (LLM citation) score from 42 to 70-plus, complete schema.org coverage so every entity on the site is structurally machine-readable, and give Daley a Person schema anchor for E-E-A-T signal.
**Depends on**: Phase 10 (domain and llms.txt must already be on canonical domain before expanding schema that references them)
**Requirements**: AUDIT-P1-SEO-GEO
**Success Criteria** (what must be TRUE):

1. `OrganizationJsonLd.sameAs` contains at minimum LinkedIn company, Wikidata entity, Twitter/X handle, Crunchbase (if active), KvK registration URL (if registered), YouTube channel (if active); `@id` stable URI established
2. `PersonJsonLd` component exists and renders on `/about` for Daley (name, jobTitle, worksFor, sameAs, description, image); separate PersonJsonLd renders for Sindy on `/case-studies/skc` as operator of that case
3. `ServiceJsonLd` is wired into all 12 skill pages via `SkillPageTemplate`; each skill page also renders a `FaqJsonLd` with 3-5 questions; `FaqJsonLd` also added to `/founding-member` which already has visible FAQ content; `Speakable` schema marks key paragraphs on home hero, `/memory`, and SKC case study
4. Meta descriptions for home, pricing, apply, founding-member, how-it-works trimmed to ≤160 characters across all three locales; legal pages (privacy/terms/cookies) use the shared metadata helper and receive OG, Twitter, hreflang
5. `src/app/robots.ts` emits explicit Allow rules for GPTBot, ChatGPT-User, OAI-SearchBot, Google-Extended, Applebot-Extended, ClaudeBot, anthropic-ai, PerplexityBot, CCBot; `OrganizationJsonLd.hasOfferCatalog` no longer lists v9 products (AI Chatbots, Marketing Machine) and instead reflects v10 skills catalog

**Plans**: 4 plans

Plans:

- [ ] 14-01-PLAN.md — Organization sameAs expansion + Wikidata entity creation + Person schema (Daley + Sindy) + hasOfferCatalog v10 refresh (Wave 1, depends on Phase 10)
- [ ] 14-02-PLAN.md — ServiceJsonLd wiring on 12 skill pages + FaqJsonLd on founding + 12 skill-page FAQ schemas + Speakable on home/memory/case (Wave 2, depends on 14-01)
- [ ] 14-03-PLAN.md — Meta description trims + legal pages via shared metadata helper + ArticleJsonLd completion (Wave 1, independent after Phase 10)
- [ ] 14-04-PLAN.md — AI-crawler allowlist in robots.ts + sitemap canonical verification (Wave 1, independent after Phase 10)

---

### Phase 15: Conversion Accelerators

**Goal**: Convert more of the existing traffic by eliminating passive funnel hand-offs, making the SKC case study credible with real numbers, and opening a second conversion path for visitors who are not yet ready to apply.
**Depends on**: Phase 10 (forms must be wired for Calendly-post-submit to make sense), Phase 11 (form a11y must be solid), Phase 12 (brand assets ready), Phase 14 (schema helpers ready)
**Requirements**: AUDIT-P1-CONVERSION
**Success Criteria** (what must be TRUE):

1. ApplicationForm success state replaces the "we respond within 3 days" text with an inline Calendly embed prefilled with the applicant's name and email; ContactForm gets an optional secondary Calendly CTA; fallback text-link if embed fails to load
2. Home hero secondary CTA (`Leer Clyde kennen`) is demoted to a subtle text-link beneath the primary `Plan een gesprek` button; `StickyMobileCTA` component appears after 50 percent scroll on home, memory, pricing, case-studies/skc, and all 12 skill pages, dismissible, a11y-compliant
3. `messages/*.json case_studies.skc.*` content contains concrete outcome metrics from a real Sindy interview (time saved per week, post-volume delta, engagement delta, pipeline delta, direct quote); testimonial block displays Sindy's name, role, photo, LinkedIn link; no reference to Daley's SKC co-ownership
4. `/api/newsletter` route exists and adds opt-ins to a Resend audience with double-opt-in; `LeadMagnetCTA` component is live on home, blog sidebar, pricing sidebar, founding-member; a gated "NL Bureau AI Readiness Checklist" PDF is delivered by email after confirmation; Dutch-first content
5. Pricing-page FAQ is promoted to appear directly after tier cards (before credit/skill packs); founding counter includes date-stamp (`per 2026-04-24`) and cohort start date; `FaqJsonLd` added (may overlap with Phase 14)

**Plans**: 5 plans

Plans:

- [ ] 15-01-PLAN.md — Hero CTA demote + StickyMobileCTA component + rollout on 15 pages (Wave 1, low dependency)
- [ ] 15-02-PLAN.md — Post-submit Calendly embed on ApplicationForm + ContactForm + prefill params + fallback (Wave 2, depends on Phase 10)
- [ ] 15-03-PLAN.md — SKC interview brief + content rewrite + testimonial block + Sindy PersonJsonLd (Wave 2, depends on Phase 14 and Sindy interview completion)
- [x] 15-04-PLAN.md — Lead magnet: PDF content + /api/newsletter + LeadMagnetCTA + Resend audience (Wave 3, depends on Phase 10 Resend setup) (completed 2026-04-25)
- [ ] 15-05-PLAN.md — Pricing FAQ promotion + founding counter credibility + FaqJsonLd (Wave 3, low-risk polish)

## Progress

**Execution Order:**
Phases execute in parallel waves:

- Wave A: Phase 1 + Phase 4 + Phase 5 (simultaneous)
- Wave B: Phase 2 (after Phase 1 positioning settled)
- Wave C: Phase 3 (after Phase 2 data model complete)

| Phase                | Plans Complete | Status      | Completed  |
| -------------------- | -------------- | ----------- | ---------- |
| 1. Website Rebrand   | 5/5            | Complete    | 2026-03-20 |
| 2. Dashboard Reframe | 3/4            | In Progress |            |
| 3. n8n Multi-Tenant  | 0/3            | Not started | -          |
| 4. Compliance        | 2/2            | Complete    | 2026-03-20 |
| 5. Go-to-Market      | 2/3            | In progress | -          |
| 6. Vite Feature Par. | 3/4            | In Progress |            |
| 7. Copy Overhaul     | 3/4            | In Progress |            |
| 8. Clyde Chatbot     | 2/2            | Complete    | 2026-03-21 |
| 9. Codebase Cleanup  | 0/3            | Not started | -          |
| 10. Production Integrity | 4/4 | Complete    | 2026-04-25 |
| 11. EAA A11y Compliance  | 3/3 | Complete    | 2026-04-25 |
| 12. Brand + Copy Polish  | 4/4 | Complete    | 2026-04-25 |
| 13. Performance + Bundle | 3/3 | Complete    | 2026-04-26 |
| 14. SEO + GEO Depth      | 4/4 | Complete   | 2026-04-27 |
| 15. Conversion Accel.    | 0/5        | Not started | -          |

---

### Post-Audit Hardening wave ordering

- **Wave D1 (immediate, parallel)**: Phase 10 (integrity) + Phase 11 (a11y) + Phase 12 (brand) + Phase 13 (performance) — zero interdependency
- **Wave D2 (after Phase 10)**: Phase 14 (SEO/GEO depth, needs canonical domain + fresh llms.txt)
- **Wave D3 (after Phases 10 + 11 + 12 + 14)**: Phase 15 (conversion — needs wired forms, solid a11y, finished brand, and schema helpers)

Audit source: `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md`
