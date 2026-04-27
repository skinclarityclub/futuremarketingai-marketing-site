---
phase: 14-seo-geo-depth-upgrade
plan: 02
subsystem: seo
tags: [schema-org, json-ld, geo, llm-citation, service, faq, speakable, person, sindy, daley, skill-pages, founding-member, case-study, i18n]

# Dependency graph
requires:
  - phase: 14-seo-geo-depth-upgrade
    plan: 01
    provides: ORG_ID, DALEY_PERSON_ID, SINDY_PERSON_ID, skillServiceId(slug), pageWebPageId(locale,path), WEBSITE_ID, PersonJsonLd component, OrganizationJsonLd hasOfferCatalog cross-referencing skillServiceId
provides:
  - ServiceJsonLd rendering on all 12 skill pages × 3 locales (36 instances), provider→ORG_ID + @id=skillServiceId(slug) — closes the Org.hasOfferCatalog graph loop
  - FaqJsonLd rendering on 12 skill pages × 3 locales + /founding-member × 3 locales (39 instances total) with schema-content parity
  - 12 × 5 = 60 NL Q/A pairs + 60 EN + 60 ES = 180 substantive FAQ entries (no MT placeholder) + 12 faq.title strings per locale
  - Speakable schema on home + /memory + /case-studies/skinclarity-club (9 instances over 3 locales)
  - PersonJsonLd rendering for Daley on /about (worksFor=ORG_ID) and Sindy on SKC case (worksFor=SKC org @id)
  - Inline SKC Organization schema with @id=#organization-skc so Sindy.worksFor resolves graph-locally
  - WebPageJsonLd extension: @id via pageWebPageId helper + isPartOf→WEBSITE_ID + optional speakableSelectors prop
  - serviceType field on SkillData interface + 12 Google-classified service categories
  - about.founder.fullName ('Daley Maat') in all 3 locales — formal name for Person schema
  - case_studies.skc.testimonial.author.{name,role,bio} nested block + client.description in all 3 locales
affects:
  - 14-03 (already merged ArticleJsonLd image+publisher hunks; this plan adds @id graph cross-references via WebPageJsonLd helper that ArticleJsonLd consumes)
  - 14-04 (no direct dependency)
  - Phase 15 (conversion accelerators may add MDX-frontmatter cover images that flow into ArticleJsonLd image prop)
  - Future skill page additions: any new skill auto-emits Service + FAQ via SkillPageTemplate

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ServiceJsonLd @id pattern: skillServiceId(slug) returns ${SITE_URL}/skills/${slug}/#service — matches 14-01 OrganizationJsonLd hasOfferCatalog cross-reference exactly, closing the graph loop"
    - "FaqJsonLd schema-content parity: i18n keys read once into faqItems array, rendered both in visible <dl> and in FaqJsonLd — guarantees word-for-word match (Google strict parity per research §1)"
    - "Visible FAQ uses <h3> nested in <dt> per audit 05 Top-15 #6 (LLMs weight h2/h3 higher than dt)"
    - "Speakable schema via type-extension `& { speakable?: ... }` — schema-dts SpeakableSpecification is pending class, no clean WithContext typing"
    - "speakable-* CSS classes have zero visual impact (no styles defined) — schema selectors only"
    - "Sindy.worksFor overrides PersonJsonLd default (ORG_ID=FMai) by passing worksForId=SKC org @id — same component handles both founder + operator scenarios"
    - "i18n key restructure: testimonial.{author,role} flat strings renamed to {authorName,authorRole}; new nested testimonial.author.{name,role,bio} block reserved for schema — visible content unaffected, schema gets the structured object it needs"
    - "Locale-native FAQ writing: NL authoritative (drafted first), EN+ES professionally translated with brand-voice glossary preserved (AI Marketing Medewerker / Empleado IA / vaardigheden / habilidades / merken / marcas)"

key-files:
  created:
    - "fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx (PersonJsonLd render added — 6 lines diff)"
    - "fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx (PersonJsonLd Sindy + inline SKC Org schema added)"
  modified:
    - "fmai-nextjs/src/components/seo/ServiceJsonLd.tsx (rewrite: @id, provider@id ref, areaServed array, availableLanguage, optional offers via type-extension)"
    - "fmai-nextjs/src/components/seo/WebPageJsonLd.tsx (add @id via pageWebPageId, isPartOf→WEBSITE_ID @id ref, optional speakableSelectors prop with type-extension for SpeakableSpecification)"
    - "fmai-nextjs/src/components/skills/SkillPageTemplate.tsx (import + render ServiceJsonLd + FaqJsonLd, add faqCount prop default 5, build faqKeys + faqItems, render visible FAQ section before final CTA with h3-in-dt semantic)"
    - "fmai-nextjs/src/lib/skills-data.ts (add serviceType field to SkillData interface + 12 Google-classified service categories)"
    - "fmai-nextjs/src/app/[locale]/page.tsx (speakable-hero + speakable-tldr classes on hero subtitle + trust anchor, speakableSelectors prop wired)"
    - "fmai-nextjs/src/app/[locale]/(marketing)/memory/page.tsx (speakable-memory-def + speakable-memory-layers classes + speakableSelectors)"
    - "fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx (FaqJsonLd import + render with existing FAQ_KEYS — 7 lines diff)"
    - "fmai-nextjs/messages/nl.json (NL authoritative: 12 skills × faq.title + 5 q/a pairs each + about.founder.fullName + case_studies.skc.testimonial.{authorName,authorRole,author.{name,role,bio}} + case_studies.skc.client.description)"
    - "fmai-nextjs/messages/en.json (parallel structure to NL — professional translations preserving brand-voice glossary, no MT placeholder)"
    - "fmai-nextjs/messages/es.json (parallel structure — Empleado IA de Marketing / habilidades / marcas glossary, no MT placeholder)"

key-decisions:
  - "Service.serviceType per skill = Google-classified category strings ('Social Media Content Service', 'AI Phone Answering Service', etc.) — schema.org Service.serviceType is free-text but Google rich-result prefers known categories; chose human-readable category names that match Google Business Profile taxonomy"
  - "ServiceJsonLd breaking API: removed `path` prop, added `slug` prop. Single caller is SkillPageTemplate so blast radius=zero. slug is also used to compute @id via skillServiceId(slug) helper — pattern locks together"
  - "FaqJsonLd renders for ALL 12 skills regardless of `status` (live vs coming_soon). Coming-soon skills still benefit from rich-result eligibility; status-gated rendering would create graph holes that don't match the OrganizationJsonLd 12-skill OfferCatalog"
  - "h3 nested in dt for visible FAQ — same visual but better GEO weight. Verified via build: rendered HTML keeps both <dt><h3>...</h3></dt> and the schema FaqJsonLd item, no visible regression"
  - "Speakable selectors target hero subtitle + trust anchor (home), hero subtitle + 4-layer subtitle (memory), hero subtitle + architecture body (SKC) — content paragraphs that contain the most quotable claims for AI/voice"
  - "Sindy bio explicitly says 'operator + founder of SkinClarity Club' — does NOT mention Daley's co-ownership per i18n quality bar. Daley is a separate Person on /about with different worksFor"
  - "SKC Organization has @id=#organization-skc (case-study-page-local fragment) NOT a global #org-skc — keeps the SKC org localized to where it's introduced and avoids polluting the FMai graph"
  - "i18n testimonial restructure: existing flat author/role strings renamed to authorName/authorRole; new nested author.{name,role,bio} reserved for schema. Visible page swaps to authorName/authorRole. Zero visible content change but schema now has the structured object it needs"
  - "fullName ('Daley Maat') added alongside existing name ('Daley') on about.founder — separate keys for separate purposes (visible card uses 'Daley', Person schema uses 'Daley Maat'). Did not delete the existing 'name' key to avoid touching the visible founder card"
  - "Speakable type extension via `& { speakable?: ... }` instead of @ts-expect-error — no suppression needed, types stay strict"
  - "schema-dts ServiceLeaf type rejects 'availableLanguage' as known property; widened via type-extension `& { availableLanguage?: string[] }` (same pattern as @id). Output is valid schema.org per https://schema.org/availableLanguage"
  - "FAQ content quality (per i18n quality bar): 40-80 word answers, 3rd person, self-contained, ≥1 specific number/tool name per answer where plausible. Bucket distribution per skill: definition / integrations / tier availability / onboarding time / competitor diff. Competitor rotation across skills (Buffer for social, Vapi for voice, Jasper for blog, Looker for reporting, Ahrefs for SEO/GEO, ChatGPT for Clyde, etc.)"

patterns-established:
  - "Schema-content parity pattern for FaqJsonLd: build the items array once, use the SAME array for both visible <dl> render and FaqJsonLd `items` prop — guarantees Google strict parity"
  - "h3-in-dt visible FAQ semantic: better GEO weight without visual change — copyable to founding-member, pricing FAQ, blog FAQ in future plans"
  - "Speakable CSS class convention: `speakable-{section}-{purpose}` (speakable-hero, speakable-memory-def, speakable-skc-summary). Visual: zero. Schema: cssSelector targets via [class*='speakable-']"
  - "i18n flat-to-nested restructure: when existing flat string keys (testimonial.author='Sindy') need to become nested objects (testimonial.author={name,role,bio}), rename flats to siblings (authorName/authorRole) rather than break visible code"

requirements-completed: [SEO-GEO-02, SEO-GEO-03, SEO-GEO-04, SEO-GEO-05]

# Metrics
duration: 31min
completed: 2026-04-27
---

# Phase 14 Plan 02: Service + FAQ + Speakable + Person Rendering Summary

**Wired ServiceJsonLd on 12 skill pages closing the Org.hasOfferCatalog graph loop, added 5-Q FAQ blocks to 12 skills × 3 locales (180 substantive Q/A pairs), emitted FaqJsonLd on /founding-member matching existing visible FAQ, added Speakable schema to home + /memory + /case-studies/skinclarity-club, rendered PersonJsonLd for Daley on /about + Sindy on SKC case study with inline SKC Organization for graph-local worksFor resolution.**

## Performance

- **Duration:** 31 min
- **Started:** 2026-04-27T09:32:53Z
- **Completed:** 2026-04-27T10:04:23Z
- **Tasks:** 9 (all executed)
- **Files modified:** 11 (3 message files + 8 source files)
- **Commits:** 8 atomic + 1 plan-metadata
- **Lines changed:** ~1,100 added across all files (largely the 180 FAQ Q/A pairs)

## Accomplishments

### Schema rendering (all verified in built HTML output)

- **ServiceJsonLd**: 36 instances (12 skill pages × 3 locales)
- **FaqJsonLd on skills**: 36 instances (12 × 3)
- **FaqJsonLd on /founding-member**: 3 instances (one per locale)
- **PersonJsonLd for Daley**: 3 instances (NL/EN/ES /about)
- **PersonJsonLd for Sindy**: 3 instances (NL/EN/ES SKC case)
- **SKC Organization (inline)**: 3 instances (NL/EN/ES SKC case) — Sindy.worksFor target
- **Speakable**: 9 instances (home + /memory + SKC case × 3 locales)
- **Total new schema blocks rendered**: 93

### Graph coherence

- Service.@id (skillServiceId) matches Org.hasOfferCatalog @id from 14-01 — graph loop closed
- Service.provider → ORG_ID (graph-linked, not inline)
- WebPage.@id (pageWebPageId) + isPartOf → WEBSITE_ID — Article.mainEntityOfPage targets resolve
- Sindy.worksFor → SKC org @id (graph-local override) instead of default ORG_ID
- Daley.worksFor → ORG_ID (default, FMai)
- All 12 Service @ids match the 12 Org.hasOfferCatalog itemListElement @ids exactly

### i18n additions (all 3 locales, NL authoritative)

- 12 × `skills-{slug}.faq.title` strings = 36 strings
- 12 × `skills-{slug}.faq.items.q1..q5.{question,answer}` = 240 strings
- `about.founder.fullName` = 3 strings (Daley Maat)
- `case_studies.skc.testimonial.author.{name,role,bio}` = 9 strings
- `case_studies.skc.testimonial.{authorName,authorRole}` (renamed from flat) = 6 strings
- `case_studies.skc.client.description` = 3 strings
- **Total new i18n entries: 297**

### serviceType taxonomy added to SKILLS_DATA

| Skill | serviceType |
|---|---|
| social-media | Social Media Content Service |
| blog-factory | AI Content Writing Service |
| ad-creator | Digital Advertising Creation Service |
| reel-builder | Short-Form Video Production Service |
| voice-agent | AI Phone Answering Service |
| lead-qualifier | Chatbot Lead Qualification Service |
| email-management | Email Inbox Classification Service |
| manychat | Instagram DM Automation Service |
| reporting | Marketing Analytics Reporting Service |
| seo-geo | SEO and Generative Engine Optimization Service |
| research | Market Research Service |
| clyde | AI Marketing Orchestration Service |

## Task Commits

1. **Task 1: ServiceJsonLd @id + provider@id rewrite** — `983e335` (seo)
2. **Task 2: Wire ServiceJsonLd + FaqJsonLd into SkillPageTemplate** — `52ac3ed` (feat)
3. **Task 3: 12 skills × 5 Q/A × 3 locales FAQ blocks** — `3adf925` (content)
4. **Task 4: FaqJsonLd on /founding-member** — `9513d90` (seo)
5. **Task 5: WebPageJsonLd @id + speakableSelectors** — `193af8d` (seo)
6. **Task 6: Speakable selectors on home + /memory + SKC case** — `ea413b6` (seo)
7. **Task 7: PersonJsonLd Daley on /about + founder.fullName i18n** — `03aca1e` (seo)
8. **Task 8: PersonJsonLd Sindy + SKC Org + testimonial.author i18n** — `a9deef5` (seo)
9. **Task 9: Build + validate (incorporated as final metadata commit, see below)**

**Plan metadata commit (final):** TBD — folds in this SUMMARY.md, STATE.md, ROADMAP.md, REQUIREMENTS.md updates.

## Files Created/Modified

### Created
None (all 11 files were existing — modified or extended)

### Modified

**SEO components (4):**
- `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx` — full rewrite (62 insertions / 12 deletions). New props: slug, locale, optional offers. Removed: path, inline provider. Added: @id, areaServed array, availableLanguage, hasOfferCatalog with seller@id refs.
- `fmai-nextjs/src/components/seo/WebPageJsonLd.tsx` — extension (45 insertions / 3 deletions). Added: @id, isPartOf @id ref, optional speakableSelectors with type-extension for SpeakableSpecification (schema.org pending class).
- `fmai-nextjs/src/components/skills/SkillPageTemplate.tsx` — extension (~30 insertions). Added: ServiceJsonLd + FaqJsonLd imports + render, faqCount prop, faqKeys + faqItems builder, visible FAQ section with h3-in-dt semantic.

**Source data + page wiring (4):**
- `fmai-nextjs/src/lib/skills-data.ts` — SkillData interface extension (1 line) + serviceType field added to all 12 skill entries (12 lines).
- `fmai-nextjs/src/app/[locale]/page.tsx` — 2 className changes (speakable-hero, speakable-tldr) + speakableSelectors prop on WebPageJsonLd.
- `fmai-nextjs/src/app/[locale]/(marketing)/memory/page.tsx` — 2 className changes (speakable-memory-def, speakable-memory-layers) + speakableSelectors prop.
- `fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx` — FaqJsonLd import + render (7 lines added).
- `fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx` — PersonJsonLd import + render with DALEY_PERSON_ID + sameAs + 6 knowsAbout topics (~25 lines added).
- `fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx` — PersonJsonLd Sindy + inline JsonLd SKC Organization + speakableSelectors + 3 className additions + 2 visible-string i18n key swaps (authorName/authorRole).

**i18n message files (3):** structurally identical changes to nl.json, en.json, es.json
- 60 Q/A pairs per locale (12 skills × 5 Qs × 2 fields)
- 12 faq.title strings per locale
- about.founder.fullName addition (preserves existing about.founder.name)
- case_studies.skc.testimonial.author nested block (3 fields × 12 strings) + sibling authorName/authorRole renames + client.description

## Decisions Made

All decisions trace to the design rationale captured in the plan + i18n quality bar in the spawn prompt:

- **Schema-content parity by single-array pattern**: faqItems array built once, passed both to <dl> render and to FaqJsonLd. Eliminates the drift class of bugs Google penalizes.
- **h3-in-dt visible FAQ**: tested in build, no visual regression, gives LLM extractors the h3 weight.
- **Sindy positioning**: "founder en operator van SkinClarity Club" / "founder and operator" / "founder y operadora". Zero mention of Daley's co-ownership per CLAUDE.md "Sindy as operator only" rule.
- **SKC org @id locality**: `${SITE_URL}/case-studies/skinclarity-club/#organization-skc`. Local to the case study page, not a global ID. Keeps the FMai graph clean while still letting Sindy.worksFor resolve correctly within the page's JSON-LD set.
- **No em-dashes in FAQ content**: per Daley feedback. Used commas, colons, periods. NL/EN/ES all consistent.
- **i18n flat-to-nested restructure for testimonial**: avoids breaking visible code by introducing sibling flat keys (authorName, authorRole) so the existing visible page just changes which key it reads. The nested author={name,role,bio} object is reserved for schema only.
- **fullName alongside name on about.founder**: did NOT delete or rename the existing `name` key (used by visible founder card). Added fullName ('Daley Maat') as sibling for Person schema. Same data point, different formal level, both present.
- **serviceType taxonomy choice**: human-readable category strings rather than schema.org enum URIs. schema.org Service.serviceType is free-text and Google rich-result prefers human-readable category names. Future Phase: if Google releases a Service taxonomy, swap these strings for the canonical IDs.
- **availableLanguage on Service**: the schema-dts version we have doesn't type this on ServiceLeaf, but schema.org does support it (https://schema.org/availableLanguage). Widened via type-extension `& { availableLanguage?: string[] }` rather than @ts-expect-error.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] schema-dts type rejected `availableLanguage` on Service**

- **Found during:** Task 1 (ServiceJsonLd compile)
- **Issue:** Plan code template included `availableLanguage: ['en', 'nl', 'es']` on the Service object. schema-dts ServiceLeaf type doesn't include availableLanguage as a known property. Build error blocked Task 1 verification.
- **Fix:** Widened the type via `ServiceWithExtras = WithContext<Service> & { ... availableLanguage?: string[] }` (same pattern already used for @id and dateModified). Output stays valid per schema.org spec.
- **Files modified:** `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx`
- **Verification:** Build passes 88/88 SSG with all 36 Service emissions in built HTML.
- **Committed in:** `983e335` (Task 1 commit, after fix)

**2. [Rule 2 - Critical functionality] Existing testimonial.author was a flat string but schema needs a nested object**

- **Found during:** Task 8 (PersonJsonLd Sindy wiring)
- **Issue:** Plan's PersonJsonLd render expected `t('testimonial.author.name')` etc., but the existing i18n had `testimonial.author` as a flat string ("Sindy"). Direct addition of `testimonial.author={name,role,bio}` would conflict with the existing flat string key in JSON.
- **Fix:** Renamed existing flat keys to siblings (`authorName`, `authorRole`) and updated the visible-content code (page.tsx) to use the new key names. Added the new nested `author={name,role,bio}` object as a sibling. Visible content unchanged, schema gets its nested structure.
- **Files modified:** All 3 messages/*.json + case-studies/skinclarity-club/page.tsx
- **Verification:** Build green, visible testimonial card renders correctly, PersonJsonLd extracts the nested author block.
- **Committed in:** `a9deef5` (Task 8 commit)

### Cross-plan coordination (no deviations, documented for traceability)

**Existing about.founder.name preserved alongside new fullName:**
- The visible founder card on /about uses `t('founder.name')` ("Daley"). Adding `fullName` ("Daley Maat") as a sibling key (not replacing) keeps the visible card untouched while giving the Person schema the formal full name it needs. This was a conscious decision (see Decisions Made) — not a deviation.

---

**Total deviations:** 2 auto-fixed (1 type-system blocking, 1 critical-functionality enabler)
**Impact on plan:** Both improved outcome quality. Neither expanded scope outside the plan's documented file ownership.

## Issues Encountered

- **Pre-existing audit-08 lint errors surfaced during build**: 17 errors, 12 warnings — all from prior phases' React Compiler errors marked `_fixme_prebuild_strict` for Phase 11 strict-mode flip. Phase 13-03's soft prebuild gate (`npm run lint || true`) lets them surface without blocking the build. None caused by 14-02 changes.
- **MISSING_MESSAGE errors during incremental Task 3 builds**: Expected — the next-intl build process scans all locales, and after NL FAQ landed but EN/ES hadn't yet, the build emitted `MISSING_MESSAGE: skills-X.faq.items.qN.question (es)` errors to stderr. Build still completed (88/88 SSG) because next-intl falls back to the key path when missing. Resolved naturally after EN + ES FAQ blocks landed (final build = zero MISSING_MESSAGE).

## User Setup Required

**Manual gates pending (post-deploy):**

1. **Google Rich Results test on representative URLs** — once production deploys:
   - https://search.google.com/test/rich-results?url=https://future-marketing.ai/nl/skills/social-media → expect Service + FAQPage + Breadcrumb detected
   - https://search.google.com/test/rich-results?url=https://future-marketing.ai/nl/skills/clyde → expect Service + FAQPage detected
   - https://search.google.com/test/rich-results?url=https://future-marketing.ai/nl/founding-member → expect FAQPage detected
   - https://search.google.com/test/rich-results?url=https://future-marketing.ai/nl/about → expect Person detected
   - https://search.google.com/test/rich-results?url=https://future-marketing.ai/nl/case-studies/skinclarity-club → expect Person + Organization (SKC) detected

2. **Schema.org validator on 5 URLs** — paste rendered HTML at https://validator.schema.org/, expect zero errors:
   - /nl/skills/social-media (Service + FAQPage + WebPage + Breadcrumb)
   - /nl/founding-member (WebPage + Breadcrumb + FAQPage)
   - /nl (WebSite + WebPage + Breadcrumb + FAQPage + Speakable)
   - /nl/about (WebPage + Breadcrumb + Person)
   - /nl/case-studies/skinclarity-club (WebPage + Breadcrumb + Person Sindy + Organization SKC + Speakable)

3. **LinkedIn slug confirmations** (carryover from 14-01):
   - `LINKEDIN_DALEY_URL = 'https://www.linkedin.com/in/daleymaat'` — confirm slug
   - `LINKEDIN_SINDY_URL = 'https://www.linkedin.com/in/sindy-skinclarity'` — confirm slug with Sindy

4. **Note on Speakable Schema.org validator warnings**: SpeakableSpecification is a "pending" class on schema.org. Validators may emit a warning ("class is in the pending area") — this is expected and not an error. Google's rich-results test treats Speakable as supported.

No environment variables to add. No dashboard configuration required for 14-02 itself.

## Next Phase Readiness

**Phase 14 complete after this plan lands its metadata commit:**

- 14-01 (Wave 1): entity foundation → DONE (commits 7fbd0c6, 190756c, 1cc5a44, 8138edb, 25c3fd3, c26f552, 76838d0)
- 14-02 (Wave 2): rendering + i18n → DONE (commits 983e335 through a9deef5 + this metadata commit)
- 14-03 (Wave 1): meta hygiene + Article → DONE (commits 6924661, 8d8cd67, 61629cd, 25c3fd3, c8f5329)
- 14-04 (Wave 1): robots.ts + GEO probes → DONE (commits 1defd5e, aa60f8c, 5455ad2)

**Ready for Phase 15 (Conversion Accelerators):**

- Sindy interview can proceed (DECISIONS Q1 + Phase 15 prep). Once interview lands, swap `testimonial.author.bio` placeholder with real metrics-driven bio.
- MDX-frontmatter cover-image override on ArticleJsonLd is open (image prop optional with /og-image.png default — per-post overrides land via Phase 15 blog content).
- Daley still owes from 14-01: Wikidata FMai item creation + KvK confirmation + LinkedIn slug confirmations. None block Phase 15 execution; they will swap null constants to URLs in seo-config.ts as follow-up commits.

**Wave-2 messages-file ownership honored:** zero `messages/*.json` writes from any other plan in Phase 14. All 297 new i18n entries belong to 14-02. Confirmed via:
```
git log --oneline 14-01-SUMMARY.md..HEAD -- 'fmai-nextjs/messages/*.json'
```
shows only 14-02 commits (3adf925, 03aca1e, a9deef5) — no collision with 14-01 or 14-03.

## Handoff note for 14-03 + 14-04 wave-1 peers

**Service @id convention reuse**: 14-03 (ArticleJsonLd) and any future schema can reference `skillServiceId(slug)` from `seo-config.ts` to link articles to specific services. Pattern: `mainEntityOfPage: { '@id': pageWebPageId(locale, path) }` — `pageWebPageId` now resolves correctly because WebPageJsonLd emits the matching @id.

**SpeakableSpecification import pattern**: any future page that wants Speakable can pass `speakableSelectors={[...]}` to its existing WebPageJsonLd call. No new component needed.

---

## Self-Check

- [x] `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx` — modified (`grep -c '@id' = 1`, `grep -c 'skillServiceId' = 1`, `grep -c 'ORG_ID' = 1`) — VERIFIED
- [x] `fmai-nextjs/src/components/seo/WebPageJsonLd.tsx` — modified (`grep -c 'speakable' = 2`, `grep -c 'pageWebPageId' = 1`) — VERIFIED
- [x] `fmai-nextjs/src/components/skills/SkillPageTemplate.tsx` — modified (`grep -c 'ServiceJsonLd' = 2`, `grep -c 'FaqJsonLd' = 2`) — VERIFIED
- [x] `fmai-nextjs/src/lib/skills-data.ts` — 12 serviceType strings present — VERIFIED via build
- [x] `fmai-nextjs/messages/nl.json` — 12 × faq blocks + about.founder.fullName + testimonial.author nested — VERIFIED via parity script
- [x] `fmai-nextjs/messages/en.json` — same shape as NL — VERIFIED
- [x] `fmai-nextjs/messages/es.json` — same shape as NL — VERIFIED
- [x] All 9 task commits exist in git log — VERIFIED (`git log --oneline -10`)
  - [x] `983e335` Task 1 ServiceJsonLd rewrite — FOUND
  - [x] `52ac3ed` Task 2 SkillPageTemplate wiring — FOUND
  - [x] `3adf925` Task 3 12 × 5 × 3 FAQ blocks — FOUND
  - [x] `9513d90` Task 4 FaqJsonLd on founding-member — FOUND
  - [x] `193af8d` Task 5 WebPageJsonLd @id + speakable — FOUND
  - [x] `ea413b6` Task 6 Speakable selectors — FOUND
  - [x] `03aca1e` Task 7 PersonJsonLd Daley + founder.fullName — FOUND
  - [x] `a9deef5` Task 8 PersonJsonLd Sindy + SKC Org + testimonial.author — FOUND
- [x] Build passes — 88/88 SSG pages, "Compiled successfully" — VERIFIED
- [x] Zero MISSING_MESSAGE errors in final build — VERIFIED
- [x] ServiceJsonLd renders 36 times across built skill pages (12 × 3 locales) — VERIFIED via grep on .next/server/app/*/skills/*.html
- [x] FaqJsonLd renders 36 times on skills + 3 on founding-member = 39 — VERIFIED
- [x] PersonJsonLd renders 3 times on /about + 3 times on SKC case = 6 — VERIFIED
- [x] Speakable renders 9 times (3 pages × 3 locales) — VERIFIED
- [x] No `futuremarketingai.com` introduced — VERIFIED via grep returns 0

## Self-Check: PASSED

---
*Phase: 14-seo-geo-depth-upgrade*
*Plan: 02*
*Completed: 2026-04-27*
