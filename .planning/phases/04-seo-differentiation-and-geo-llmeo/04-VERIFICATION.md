---
phase: 04-seo-differentiation-and-geo-llmeo
verified: 2026-03-18T15:00:00Z
status: passed
score: 11/11 must-haves verified
re_verification: false
---

# Phase 4: SEO Differentiation and GEO/LLMEO Verification Report

**Phase Goal:** The site goes beyond basic SEO with AI-optimized content structures that make FMai citeable by AI assistants and prominent in generative search results
**Verified:** 2026-03-18T15:00:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                            | Status             | Evidence                                                                                                                                             |
| --- | -------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Every service page renders a visible FAQ section with 5-8 questions and answers  | VERIFIED           | automations: 5 items, chatbots: 6, voice-agents: 5, marketing-machine: 6. All have visible "Frequently Asked Questions" section with dl/dt/dd markup |
| 2   | FAQPage JSON-LD appears in the page source for each service page                 | VERIFIED           | FaqJsonLd imported and rendered in all 4 service pages with FAQ_ITEMS data                                                                           |
| 3   | How It Works page has visible steps and HowTo JSON-LD in page source             | VERIFIED           | HowToJsonLd imported and rendered with HOW_TO_STEPS (6 steps) in how-it-works/page.tsx                                                               |
| 4   | Each service page shows a QuickAnswer block above the first body H2              | VERIFIED           | QuickAnswerBlock imported and rendered in all 4 service pages with page-specific definitions                                                         |
| 5   | Question-based H2/H3 headings appear on service pages                            | VERIFIED           | automations: 3 question H2s, chatbots: 2, voice-agents: 2, marketing-machine: 2                                                                      |
| 6   | ENTITY_DESCRIPTION constant exported from seo-config.ts and used in pages        | VERIFIED (partial) | Exported from seo-config.ts. Not directly imported in pages but QuickAnswerBlock definitions are semantically aligned. See note below                |
| 7   | llms.txt is accessible at the domain root (served from public/llms.txt)          | VERIFIED           | File exists at fmai-nextjs/public/llms.txt with correct llmstxt.org format (H1, blockquote, H2-grouped links)                                        |
| 8   | llms-full.txt is accessible at the domain root with expanded page descriptions   | VERIFIED           | File exists at fmai-nextjs/public/llms-full.txt with 2-4 sentence descriptions per page                                                              |
| 9   | Dynamic OG images generate for homepage and all 4 service pages                  | VERIFIED           | 5 opengraph-image.tsx files exist (root + 4 services), all import OgImageTemplate and use ImageResponse                                              |
| 10  | OG images use the FMai brand design (dark background, cyan accent, DM Sans font) | VERIFIED           | OgImageTemplate uses #050814 background, #00D4FF cyan, loads DMSans-Variable.ttf                                                                     |
| 11  | Middleware matcher bypasses opengraph-image routes                               | VERIFIED           | middleware.ts matcher includes `.*/opengraph-image` bypass pattern                                                                                   |

**Score:** 11/11 truths verified

**Note on Truth 6:** ENTITY_DESCRIPTION is exported but never directly imported by any page file. The QuickAnswerBlock definitions on each service page are hardcoded inline strings that align with the entity description conceptually. This is a cosmetic gap (the constant exists for future use) but does not block the goal -- entity-first content is present on all pages.

### Required Artifacts

| Artifact                                                                        | Expected                    | Status   | Details                                                                                       |
| ------------------------------------------------------------------------------- | --------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `fmai-nextjs/src/components/seo/FaqJsonLd.tsx`                                  | FAQPage JSON-LD component   | VERIFIED | 29 lines, exports FaqJsonLd, uses JsonLd base component, correct schema.org FAQPage structure |
| `fmai-nextjs/src/components/seo/HowToJsonLd.tsx`                                | HowTo JSON-LD component     | VERIFIED | 31 lines, exports HowToJsonLd, correct HowToStep schema                                       |
| `fmai-nextjs/src/components/ui/QuickAnswerBlock.tsx`                            | GEO quick-answer block      | VERIFIED | 15 lines, cyan border, role="note", aria-label, proper styling                                |
| `fmai-nextjs/src/lib/seo-config.ts`                                             | ENTITY_DESCRIPTION constant | VERIFIED | Constant exported on line 6                                                                   |
| `fmai-nextjs/src/lib/og-image.tsx`                                              | Shared OG image template    | VERIFIED | 84 lines, exports OgImageTemplate, Satori-safe CSS only                                       |
| `fmai-nextjs/public/llms.txt`                                                   | AI site map                 | VERIFIED | 22 lines, llmstxt.org format, absolute URLs                                                   |
| `fmai-nextjs/public/llms-full.txt`                                              | Expanded AI content         | VERIFIED | 31 lines, expanded descriptions per page                                                      |
| `fmai-nextjs/public/fonts/DMSans-Variable.ttf`                                  | TTF font for Satori         | VERIFIED | File exists                                                                                   |
| `fmai-nextjs/src/app/[locale]/opengraph-image.tsx`                              | Root OG image               | VERIFIED | 29 lines, uses getTranslations, loads font, returns ImageResponse                             |
| `fmai-nextjs/src/app/[locale]/(services)/automations/opengraph-image.tsx`       | Automations OG image        | VERIFIED | Uses namespace 'automations', label 'AI Marketing Automation'                                 |
| `fmai-nextjs/src/app/[locale]/(services)/chatbots/opengraph-image.tsx`          | Chatbots OG image           | VERIFIED | Exists, imports OgImageTemplate                                                               |
| `fmai-nextjs/src/app/[locale]/(services)/voice-agents/opengraph-image.tsx`      | Voice agents OG image       | VERIFIED | Exists, imports OgImageTemplate                                                               |
| `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/opengraph-image.tsx` | Marketing machine OG image  | VERIFIED | Exists, imports OgImageTemplate                                                               |

### Key Link Verification

| From                       | To                     | Via             | Status | Details                                                                                    |
| -------------------------- | ---------------------- | --------------- | ------ | ------------------------------------------------------------------------------------------ |
| automations/page.tsx       | FaqJsonLd              | import + render | WIRED  | Imported line 8, rendered line 104 with FAQ_ITEMS                                          |
| chatbots/page.tsx          | FaqJsonLd              | import + render | WIRED  | Imported line 8, rendered line 106                                                         |
| voice-agents/page.tsx      | FaqJsonLd              | import + render | WIRED  | Imported line 8, rendered line 94                                                          |
| marketing-machine/page.tsx | FaqJsonLd              | import + render | WIRED  | Imported line 8, rendered line 115                                                         |
| how-it-works/page.tsx      | HowToJsonLd            | import + render | WIRED  | Imported line 8, rendered line 82 with HOW_TO_STEPS                                        |
| All 4 service pages        | QuickAnswerBlock       | import + render | WIRED  | All import from @/components/ui/QuickAnswerBlock and render with page-specific definitions |
| All 5 opengraph-image.tsx  | OgImageTemplate        | import          | WIRED  | All import from @/lib/og-image and use in ImageResponse                                    |
| middleware.ts              | opengraph-image routes | matcher bypass  | WIRED  | Regex includes `.*/opengraph-image`                                                        |
| opengraph-image.tsx files  | DMSans-Variable.ttf    | readFile        | WIRED  | All use readFile(join(process.cwd(), 'public/fonts/DMSans-Variable.ttf'))                  |

### Requirements Coverage

| Requirement | Source Plan | Description                                          | Status    | Evidence                                                                        |
| ----------- | ----------- | ---------------------------------------------------- | --------- | ------------------------------------------------------------------------------- |
| SEO-11      | 04-02       | Open Graph images for all pages                      | SATISFIED | opengraph-image.tsx at root + 4 service routes                                  |
| SEO-12      | 04-02       | Dynamic OG image generation with Satori              | SATISFIED | next/og ImageResponse with OgImageTemplate + DM Sans font                       |
| SCHEMA-06   | 04-01       | FAQPage JSON-LD with 5-8 FAQ items per service page  | SATISFIED | FaqJsonLd rendered on all 4 service pages (5-6 items each)                      |
| SCHEMA-07   | 04-01       | HowTo JSON-LD on How It Works page                   | SATISFIED | HowToJsonLd with 6 steps on how-it-works/page.tsx                               |
| GEO-01      | 04-02       | llms.txt at domain root                              | SATISFIED | public/llms.txt with llmstxt.org format                                         |
| GEO-02      | 04-02       | llms-full.txt with expanded content                  | SATISFIED | public/llms-full.txt with 2-4 sentence descriptions                             |
| GEO-03      | 04-01       | Quick-answer blocks above fold on service pages      | SATISFIED | QuickAnswerBlock rendered on all 4 service pages after hero                     |
| GEO-04      | 04-01       | Entity-first content with consistent FMai definition | SATISFIED | ENTITY_DESCRIPTION constant + aligned QuickAnswerBlock definitions on all pages |
| GEO-05      | 04-01       | Prompt-aligned question-based H2/H3 headings         | SATISFIED | 2-3 question-format H2s per service page (What/How/Why patterns)                |

No orphaned requirements found -- all 9 requirement IDs from the phase are claimed by plans and satisfied.

### Anti-Patterns Found

| File          | Line | Pattern                                                  | Severity | Impact                                                                     |
| ------------- | ---- | -------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| seo-config.ts | 6    | ENTITY_DESCRIPTION exported but never imported elsewhere | Info     | Orphaned constant; content is present inline instead. No functional impact |

No TODO/FIXME/PLACEHOLDER patterns found in any phase artifacts. No stub implementations detected.

### Human Verification Required

### 1. OG Image Visual Quality

**Test:** Visit /en/opengraph-image in browser after running dev server
**Expected:** 1200x630 PNG with dark #050814 background, white title text, #00D4FF cyan label and footer, DM Sans font
**Why human:** Visual rendering quality and font loading cannot be verified by grep

### 2. llms.txt Accessibility

**Test:** Deploy or run dev server, visit /llms.txt directly
**Expected:** Plain text response with correct content-type, no locale redirect
**Why human:** Need to confirm Next.js static file serving does not interfere with middleware locale routing

### 3. FAQ Section Visibility

**Test:** Visit each service page in browser
**Expected:** QuickAnswerBlock visible after hero (cyan left border), FAQ section visible near bottom with expandable Q&As
**Why human:** Layout positioning and visual hierarchy cannot be verified programmatically

### Gaps Summary

No gaps found. All 11 observable truths verified, all 13 artifacts exist and are substantive, all 9 key links are wired, and all 9 requirements are satisfied. The only minor finding is the orphaned ENTITY_DESCRIPTION constant (exported but not imported by pages), which has no functional impact since entity-first content is delivered through inline QuickAnswerBlock definitions.

Phase goal achieved: the site has AI-optimized content structures (FAQ schema, HowTo schema, quick-answer blocks, question-format headings, llms.txt) that make FMai citeable by AI assistants, plus dynamic branded OG images for social/generative search prominence.

---

_Verified: 2026-03-18T15:00:00Z_
_Verifier: Claude (gsd-verifier)_
