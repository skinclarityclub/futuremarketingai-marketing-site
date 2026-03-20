---
phase: 01-website-rebrand
verified: 2026-03-20T19:15:00Z
status: human_needed
score: 15/15 requirements verified
re_verification: true
  previous_status: gaps_found
  previous_score: 9/15
  gaps_closed:
    - "skills-* locale namespaces (6 skill pages) added to EN/NL/ES with full key parity (29 keys each)"
    - "founding-member locale namespace added to EN/NL/ES with full key parity (39 keys)"
    - "how-it-works STEP_KEYS updated from 6 old steps to ['choose','activate','connect','working']"
    - "Chatbot persona configs rewritten: ecommerce.ts=Onboarding Assistant, leadgen.ts=Content Creator, support.ts=ROI Calculator"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Visit http://localhost:3000/en — verify hero, stats, badges, FAQ, trust sections all read correctly for agency owners"
    expected: "Hero: 'AI Marketing Employee for Agencies', stats show agency metrics (clients/content/hours/languages), badges show GDPR-First/Enterprise AI/Dutch Support, FAQ answers agency questions"
    why_human: "Visual rendering and copy quality cannot be fully verified programmatically"
  - test: "Switch locale to /nl and /es — verify all body copy is properly translated (not English placeholders)"
    expected: "Dutch uses 'AI Marketing Medewerker voor bureaus', Spanish uses 'Empleado de Marketing IA para agencias' throughout"
    why_human: "Translation quality and completeness requires visual inspection"
  - test: "Visit http://localhost:3000/en/pricing — verify 4 tiers render with correct prices and founding member badge"
    expected: "4 tiers visible: Founding Member (EUR 997, '10 Spots Only' badge), Starter (EUR 1,497), Growth (EUR 1,997), Agency (EUR 3,497); skill add-ons section below"
    why_human: "Visual layout and price rendering requires human confirmation"
  - test: "Visit http://localhost:3000/en/skills/content-creator and all other 5 skill pages"
    expected: "Each page renders hero badge, title, description, features list, how-it-works steps, use cases section, and CTA — not blank"
    why_human: "Content quality and layout fidelity of the skill pages need human review now that translations are populated"
  - test: "Visit http://localhost:3000/en/founding-member"
    expected: "Hero with '10 Spots Only' badge, benefits grid (6 items), pricing card (EUR 997, locked), FAQ (5 items), CTA button"
    why_human: "Page structure and persuasiveness need human review now that translations are populated"
---

# Phase 1: Website Rebrand Verification Report

**Phase Goal:** Agency owners visiting the website immediately understand FMai offers an AI Marketing Employee for their agency, can explore skills, see pricing, and sign up as founding members
**Verified:** 2026-03-20T19:15:00Z
**Status:** human_needed (all automated checks passed — 4 gaps closed)
**Re-verification:** Yes — after gap closure plans 01-04 and 01-05

## Re-verification Summary

| Gap (Previous)                                           | Status | Evidence                                                                                                                                                                              |
| -------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7 missing locale namespaces (6 skills + founding-member) | CLOSED | All 7 namespaces present in EN/NL/ES; 29 leaf keys per skill, 39 for founding-member; full key parity verified (commit 6b1ef85, 3eac90b)                                              |
| how-it-works STEP_KEYS mismatch                          | CLOSED | `STEP_KEYS = ['choose','activate','connect','working']` confirmed; locale keys match; HowToJsonLd updated (commit 6b1ef85)                                                            |
| Chatbot personas: wrong system prompts                   | CLOSED | ecommerce.ts = 'Onboarding Assistant', leadgen.ts = 'Content Creator', support.ts = 'ROI Calculator'; no skincare/SaaS/support references in these 3 files (commits 4120424, 5e32d54) |
| WEB-03, WEB-05, WEB-14, WEB-15 blocked                   | CLOSED | All 4 requirements marked Done/Complete in REQUIREMENTS.md                                                                                                                            |

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                            | Status   | Evidence                                                                                                                                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Homepage hero communicates "AI Marketing Employee for agencies" in EN/NL/ES                      | VERIFIED | en.json hero.badge = "AI Marketing Employee for Agencies"; 23 occurrences in EN, 21 in NL, 19 in ES                                                                                                                                                           |
| 2   | Trust badges show GDPR-First, Powered by Enterprise AI, Dutch Support                            | VERIFIED | en.json badges.gdpr/enterprise/dutch confirmed; BADGE_KEYS in page.tsx updated                                                                                                                                                                                |
| 3   | Stats section uses agency-relevant metrics                                                       | VERIFIED | en.json stats: clients/content/hours/languages replacing old automation metrics                                                                                                                                                                               |
| 4   | FAQ rewritten for agency buyer questions                                                         | VERIFIED | home.faq.items rewritten with agency questions (what is AI Marketing Employee, how does it learn clients, etc.)                                                                                                                                               |
| 5   | SEO metadata targets "AI marketing employee agencies" keywords                                   | VERIFIED | All meta.title values include "AI Marketing Employee for Agencies", ENTITY_DESCRIPTION updated, OrganizationJsonLd wired                                                                                                                                      |
| 6   | About page presents AaaS mission and agency focus                                                | VERIFIED | about namespace has agency-focused mission, AaaS timeline, "AI Employee Era" content                                                                                                                                                                          |
| 7   | Navigation shows Skills dropdown with 6 skill links                                              | VERIFIED | HeaderClient.tsx has SKILL_ITEMS array with 6 /skills/\* hrefs; old Services dropdown replaced                                                                                                                                                                |
| 8   | Footer links point to skill pages and use AaaS language                                          | VERIFIED | Footer.tsx links to /skills/content-creator through /skills/reporting; founding-member link added; tagline is AaaS-focused                                                                                                                                    |
| 9   | 301 redirects from old service URLs to new skill URLs                                            | VERIFIED | next.config.ts has 4 permanent redirects: /chatbots→/skills/lead-qualifier, /automations→/skills/content-creator, /voice-agents→/skills/voice-agent, /marketing-machine→/skills/content-creator                                                               |
| 10  | Sitemap includes all 6 skill pages and founding-member page                                      | VERIFIED | sitemap.ts has all 6 /skills/\* entries and /founding-member entry                                                                                                                                                                                            |
| 11  | Pricing page displays 4 agent tiers with founding member badge and links to founding-member page | VERIFIED | pricing/page.tsx TIER_KEYS=['founding','starter','growth','agency'], founding tier has ctaHref='/founding-member', badge renders "10 Spots Only" from locale                                                                                                  |
| 12  | Skill pages at /en/skills/\* render with actual content                                          | VERIFIED | All 6 skill namespaces present in EN/NL/ES; 29 leaf keys each; FEATURE_KEYS, STEP_KEYS, USE_CASE_KEYS all match locale structure                                                                                                                              |
| 13  | Founding member page at /en/founding-member renders with scarcity content                        | VERIFIED | founding-member namespace present in EN/NL/ES; 39 leaf keys; hero.badge='10 Spots Only', pricing.price='997', 6 benefits, 5 FAQs                                                                                                                              |
| 14  | How-it-works page presents agent onboarding journey (choose/activate/connect/working)            | VERIFIED | STEP_KEYS = ['choose','activate','connect','working'] in page.tsx; locale keys match exactly; HowToJsonLd updated to 4-step description                                                                                                                       |
| 15  | Chatbot demo personas demonstrate agency use cases                                               | VERIFIED | ecommerce.ts name='Onboarding Assistant' (agency brand ingestion system prompt); leadgen.ts name='Content Creator' (content generation prompt); support.ts name='ROI Calculator' (cost comparison prompt); all wired via personas/index.ts → chatbot/index.ts |

**Score:** 15/15 truths verified

---

### Required Artifacts

| Artifact                                                         | Expected                                             | Status   | Details                                                                                                                         |
| ---------------------------------------------------------------- | ---------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `fmai-nextjs/messages/en.json`                                   | All EN copy rewritten; 7 new namespaces added        | VERIFIED | 23 occurrences of "AI Marketing Employee"; all 7 namespaces present with correct sub-keys                                       |
| `fmai-nextjs/messages/nl.json`                                   | 7 new namespaces in Dutch                            | VERIFIED | All 7 namespaces present; exact key parity with EN (29/39 leaf keys each); NL founding-member hero.badge = "Slechts 10 Plekken" |
| `fmai-nextjs/messages/es.json`                                   | 7 new namespaces in Spanish                          | VERIFIED | All 7 namespaces present; exact key parity with EN; ES founding-member hero.badge = "Solo 10 Plazas"                            |
| `fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx` | STEP_KEYS matching locale keys                       | VERIFIED | `STEP_KEYS = ['choose', 'activate', 'connect', 'working']`; locale has matching keys                                            |
| `fmai-nextjs/src/lib/chatbot/personas/ecommerce.ts`              | Onboarding Assistant persona                         | VERIFIED | name='Onboarding Assistant'; agency-focused system prompt; no skincare references                                               |
| `fmai-nextjs/src/lib/chatbot/personas/leadgen.ts`                | Content Creator persona                              | VERIFIED | name='Content Creator'; content generation system prompt; trilingual starters reference agency scenarios                        |
| `fmai-nextjs/src/lib/chatbot/personas/support.ts`                | ROI Calculator persona                               | VERIFIED | name='ROI Calculator'; agency cost comparison system prompt; trilingual starters reference ROI/agency scenarios                 |
| `fmai-nextjs/src/lib/seo-config.ts`                              | Updated ENTITY_DESCRIPTION for AaaS                  | VERIFIED | ENTITY_DESCRIPTION describes "AI Marketing Employee for marketing agencies" with skills list                                    |
| `fmai-nextjs/src/components/layout/HeaderClient.tsx`             | Skills dropdown replacing Services                   | VERIFIED | SKILL_ITEMS array with 6 /skills/\* hrefs; rendered in mobile and desktop dropdowns                                             |
| `fmai-nextjs/src/components/layout/Footer.tsx`                   | Updated footer with skill links                      | VERIFIED | /skills/\* links and founding-member link present; tagline is AaaS-focused                                                      |
| `fmai-nextjs/next.config.ts`                                     | 301 redirects from old service URLs                  | VERIFIED | 4 permanent redirects in redirects() function                                                                                   |
| `fmai-nextjs/src/app/sitemap.ts`                                 | Updated sitemap with skill and founding-member pages | VERIFIED | All 6 skill pages + founding-member in pages array                                                                              |
| `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx`      | Redesigned pricing page with 4 tiers + add-ons       | VERIFIED | TIER_KEYS=['founding','starter','growth','agency']; founding-member CTA link; skill add-ons section present                     |
| `fmai-nextjs/src/app/[locale]/page.tsx`                          | Updated homepage with skill cards                    | VERIFIED | SKILL_CARDS array with 6 /skills/\* hrefs; STAT_KEYS and BADGE_KEYS updated                                                     |

---

### Key Link Verification

| From                                     | To                  | Via                                                | Status | Details                                                                                               |
| ---------------------------------------- | ------------------- | -------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| `src/app/[locale]/page.tsx`              | `messages/en.json`  | getTranslations namespace 'home'                   | WIRED  | `const t = await getTranslations({ locale, namespace: 'home' })`                                      |
| `src/lib/seo-config.ts`                  | OrganizationJsonLd  | ENTITY_DESCRIPTION                                 | WIRED  | OrganizationJsonLd.tsx imports ENTITY_DESCRIPTION; used in layout.tsx                                 |
| `src/components/layout/HeaderClient.tsx` | `/skills/*`         | SKILL_ITEMS href values                            | WIRED  | All 6 SKILL_ITEMS have /skills/{slug} hrefs                                                           |
| `next.config.ts`                         | `/skills/*`         | redirects() destination                            | WIRED  | 4 redirects with destination containing /skills/                                                      |
| `src/app/sitemap.ts`                     | all page routes     | pages array                                        | WIRED  | skills/content-creator and 5 others + founding-member in array                                        |
| `pricing/page.tsx`                       | `messages/en.json`  | getTranslations namespace 'pricing'                | WIRED  | `getTranslations({ locale, namespace: 'pricing' })`                                                   |
| `pricing/page.tsx`                       | `/founding-member`  | CTA button href                                    | WIRED  | `<CTAButton href="/founding-member">`                                                                 |
| `skills/content-creator/page.tsx`        | `messages/en.json`  | getTranslations namespace 'skills-content-creator' | WIRED  | Namespace present in EN/NL/ES; 29 leaf keys; all FEATURE_KEYS/STEP_KEYS/USE_CASE_KEYS covered         |
| `founding-member/page.tsx`               | `messages/en.json`  | getTranslations namespace 'founding-member'        | WIRED  | Namespace present in EN/NL/ES; 39 leaf keys; BENEFIT_KEYS and FAQ_KEYS all covered                    |
| `how-it-works/page.tsx`                  | `messages/en.json`  | STEP_KEYS process.steps.\*                         | WIRED  | STEP_KEYS = ['choose','activate','connect','working'] matches locale keys exactly                     |
| `personas/ecommerce.ts`                  | `persona-router.ts` | registerPersona()                                  | WIRED  | ecommerce.ts calls registerPersona(ecommercePersona); loaded via personas/index.ts side-effect import |
| `personas/leadgen.ts`                    | `persona-router.ts` | registerPersona()                                  | WIRED  | leadgen.ts calls registerPersona(leadgenPersona); loaded via personas/index.ts                        |
| `personas/support.ts`                    | `persona-router.ts` | registerPersona()                                  | WIRED  | support.ts calls registerPersona(supportPersona); loaded via personas/index.ts                        |

---

### Requirements Coverage

| Requirement | Source Plan | Description                                                           | Status    | Evidence                                                                                                                        |
| ----------- | ----------- | --------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| WEB-01      | 01-01       | All homepage copy targets "marketing agencies" not "businesses"       | SATISFIED | Zero occurrences of "for businesses" in user-facing copy; 29+ agency references in en.json                                      |
| WEB-02      | 01-01       | Hero communicates "AI Marketing Employee for agencies"                | SATISFIED | hero.badge = "AI Marketing Employee for Agencies" in all 3 locales                                                              |
| WEB-03      | 01-02       | Service pages restructured as skill pages (/skills/\*)                | SATISFIED | All 6 skill namespaces present in EN/NL/ES; route files exist; pages render with actual content                                 |
| WEB-04      | 01-03       | Pricing page shows 4 agent tiers with skill add-ons                   | SATISFIED | 4-tier pricing page implemented with skill add-ons section                                                                      |
| WEB-05      | 01-03       | Founding member landing page with 10-spot scarcity and CTA            | SATISFIED | founding-member namespace present; hero.badge='10 Spots Only', 6 benefits, 5 FAQs, pricing.price='997'                          |
| WEB-06      | 01-01       | Trust badges updated (GDPR-First, Enterprise AI, Dutch Support)       | SATISFIED | badges.gdpr/enterprise/dutch in all 3 locales; BADGE_KEYS updated in page.tsx                                                   |
| WEB-07      | 01-01       | Stats section updated with agency-relevant metrics                    | SATISFIED | stats use clients/content/hours/languages; old automation metrics removed                                                       |
| WEB-08      | 01-01       | Testimonials/social proof rewritten for agency audience               | SATISFIED | trust section rewritten as agency value props                                                                                   |
| WEB-09      | 01-01       | FAQ rewritten for agency buyer questions                              | SATISFIED | home.faq.items covers AI Marketing Employee definition, brand learning, GDPR, pricing, agency-specific questions                |
| WEB-10      | 01-01       | SEO metadata updated for "AI marketing employee agencies" keywords    | SATISFIED | All meta.title values include "AI Marketing Employee for Agencies"; ENTITY_DESCRIPTION updated; OrganizationJsonLd wired        |
| WEB-11      | 01-02       | Navigation restructured (Skills dropdown replacing Services dropdown) | SATISFIED | HeaderClient.tsx SKILL_ITEMS with 6 items; "Skills" label in NAV_ITEMS                                                          |
| WEB-12      | 01-02       | Footer links and descriptions updated for AaaS positioning            | SATISFIED | Footer has /skills/\* links, founding-member link, AaaS tagline from locale                                                     |
| WEB-13      | 01-01       | About page rewritten with AaaS mission and agency focus               | SATISFIED | about namespace has agency-focused mission, AaaS timeline, "AI Employee Era" content                                            |
| WEB-14      | 01-04       | How-it-works page reframed as agent onboarding journey                | SATISFIED | STEP_KEYS = ['choose','activate','connect','working']; locale keys match; HowToJsonLd updated                                   |
| WEB-15      | 01-05       | Chatbot demo personas updated for agency use cases                    | SATISFIED | ecommerce.ts=Onboarding Assistant, leadgen.ts=Content Creator, support.ts=ROI Calculator; no old persona names in these 3 files |

**ORPHANED requirements:** None — all 15 WEB-\* requirements claimed across plans 01-01 through 01-05.

---

### Anti-Patterns Found

| File                                       | Line | Pattern                                                                                                 | Severity | Impact                                                                                                                                                                                       |
| ------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/chatbot/tools/ecommerce-tools.ts` | 3    | Import `PRODUCT_CATALOG` from `ecommerce-kb` — export does not exist (only `ECOMMERCE_TOPICS` exported) | Warning  | Pre-existing build error; deferred explicitly to `deferred-items.md`; does not affect persona system prompts or WEB-15; chatbot API route build fails but demo personas are loaded correctly |

---

### Human Verification Required

### 1. Homepage Copy Quality Across All Locales

**Test:** Start dev server (`cd fmai-nextjs && npm run dev`). Visit http://localhost:3000/en, http://localhost:3000/nl, http://localhost:3000/es
**Expected:** Hero says "AI Marketing Employee" in all 3 languages; all body copy targets agency owners; no generic business language visible
**Why human:** Translation quality and completeness of the Dutch and Spanish copy requires native or near-native reader verification

### 2. Pricing Page Visual Layout

**Test:** Visit http://localhost:3000/en/pricing
**Expected:** 4 tier cards visible (Founding Member highlighted with "10 Spots Only" badge and accent border, Starter, Growth, Agency); prices EUR 997/1,497/1,997/3,497; skill add-ons section below the tiers; Founding Member CTA links to /founding-member
**Why human:** Visual layout correctness (card highlighting, responsive grid) requires browser rendering

### 3. Skill Pages Content Quality

**Test:** Visit http://localhost:3000/en/skills/content-creator and all other 5 skill pages
**Expected:** Each page renders hero badge, title, description, features list (4 items), how-it-works steps (3 steps), use cases section (2 cases), and CTA — no blank sections
**Why human:** Content quality, agency relevance, and layout fidelity need human review

### 4. Founding Member Page

**Test:** Visit http://localhost:3000/en/founding-member
**Expected:** Hero with "10 Spots Only" badge, benefits grid (6 items), pricing card (EUR 997, "Price locked for life"), FAQ (5 items), CTA "Apply Now" button
**Why human:** Page structure and persuasiveness need human review

### 5. Chatbot Demo Persona Conversations

**Test:** Use the chatbot demo on the Chatbots page. Select each of the 3 tabs (Client Onboarding, Content Creation, ROI Calculator) and send a starter prompt
**Expected:** Client Onboarding responds as an agency onboarding guide (brand setup, client workspace); Content Creator responds with content samples for the given brief; ROI Calculator asks for agency data and presents cost comparison
**Why human:** Chatbot API has a pre-existing build error (PRODUCT_CATALOG import in ecommerce-tools.ts) — live demo may not function until that is resolved; response quality requires human judgment

---

## Deferred Items

One pre-existing build error was explicitly deferred and is outside Phase 1 scope:

**`fmai-nextjs/src/lib/chatbot/tools/ecommerce-tools.ts`** — imports `PRODUCT_CATALOG` from `ecommerce-kb` which exports `ECOMMERCE_TOPICS`. This causes a module resolution build error in the chatbot API route. Documented in `deferred-items.md`. Does not affect persona system prompts, names, or starters (WEB-15 scope). Must be resolved before the chatbot demo is fully functional in production.

---

_Verified: 2026-03-20T19:15:00Z_
_Re-verification after gap closure plans 01-04 and 01-05_
_Verifier: Claude (gsd-verifier)_
