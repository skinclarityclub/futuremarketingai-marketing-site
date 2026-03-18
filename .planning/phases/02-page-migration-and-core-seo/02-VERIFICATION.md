---
phase: 02-page-migration-and-core-seo
verified: 2026-03-18T12:00:00Z
status: gaps_found
score: 3/5 success criteria verified
gaps:
  - truth: 'XML sitemap is accessible with all pages and locale alternates; robots.txt includes AI crawler allow-policy'
    status: failed
    reason: 'sitemap.ts and robots.ts files do not exist anywhere in the codebase'
    artifacts:
      - path: 'fmai-nextjs/src/app/sitemap.ts'
        issue: 'File does not exist -- MISSING'
      - path: 'fmai-nextjs/src/app/robots.ts'
        issue: 'File does not exist -- MISSING'
    missing:
      - 'Create fmai-nextjs/src/app/sitemap.ts with 10 pages x 3 locales (30 entries)'
      - 'Create fmai-nextjs/src/app/robots.ts with AI crawler allow/disallow policy'
  - truth: 'Custom 404 page returns HTTP 404 status; all images use next/image with explicit dimensions; hreflang and canonical URLs are correct'
    status: failed
    reason: 'not-found.tsx and error.tsx files do not exist. x-default hreflang alternate missing from metadata generator.'
    artifacts:
      - path: 'fmai-nextjs/src/app/[locale]/not-found.tsx'
        issue: 'File does not exist -- MISSING (error translation keys exist in messages but component is absent)'
      - path: 'fmai-nextjs/src/app/[locale]/error.tsx'
        issue: 'File does not exist -- MISSING'
      - path: 'fmai-nextjs/src/lib/metadata.ts'
        issue: 'alternates.languages missing x-default entry pointing to /en/ path'
    missing:
      - 'Create fmai-nextjs/src/app/[locale]/not-found.tsx with localized 404 content'
      - 'Create fmai-nextjs/src/app/[locale]/error.tsx with reset button'
      - 'Add x-default to alternates.languages in generatePageMetadata'
---

# Phase 02: Page Migration and Core SEO Verification Report

**Phase Goal:** All 10 existing pages are server-rendered with per-page metadata, JSON-LD structured data, and semantic HTML -- every page is fully indexable by search engines and AI crawlers
**Verified:** 2026-03-18
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths (Success Criteria)

| #   | Truth                                                                                                                                                                                          | Status   | Evidence                                                                                                                                                                                                                                                  |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | All 10 pages render server-side with correct content in all 3 locales                                                                                                                          | VERIFIED | All 10 page files exist with generateStaticParams, setRequestLocale, getTranslations for all 3 locales. EN/NL/ES meta keys confirmed present in all translation files.                                                                                    |
| 2   | Every page has unique, localized meta title, description, and Open Graph tags                                                                                                                  | VERIFIED | All 10 pages export generateMetadata calling generatePageMetadata with unique namespace/path. metadata.ts produces title, description, OG tags, Twitter card. All 10 namespaces have meta.title and meta.description in EN/NL/ES.                         |
| 3   | JSON-LD structured data renders in page source: Organization on all pages, WebSite on homepage, Service on service pages, WebPage on subpages, BreadcrumbList from routes, dateModified on all | VERIFIED | OrganizationJsonLd in layout.tsx (all pages). WebSiteJsonLd on homepage only. ServiceJsonLd on 4 service pages with correct serviceType. WebPageJsonLd + BreadcrumbJsonLd on all 10 pages. All schemas use PAGE_DATES for dateModified.                   |
| 4   | XML sitemap accessible with all pages and locale alternates; robots.txt includes AI crawler allow-policy                                                                                       | FAILED   | sitemap.ts and robots.ts files DO NOT EXIST in the codebase.                                                                                                                                                                                              |
| 5   | Custom 404 page returns HTTP 404; images use next/image; hreflang and canonical URLs correct                                                                                                   | FAILED   | not-found.tsx and error.tsx DO NOT EXIST. x-default hreflang missing from alternates. Canonical and per-locale hreflang alternates work correctly otherwise. next/image not used on any page (no images on current pages, so SEO-08 is not yet testable). |

**Score:** 3/5 success criteria verified

### Required Artifacts

| Artifact                                                             | Expected                           | Status               | Details                                                                                            |
| -------------------------------------------------------------------- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `fmai-nextjs/src/lib/seo-config.ts`                                  | SEO constants, PAGE_DATES          | VERIFIED             | SITE_URL, SITE_NAME, ORG_EMAIL, LINKEDIN_URL, PAGE_DATES for all 12 paths                          |
| `fmai-nextjs/src/lib/metadata.ts`                                    | generatePageMetadata with hreflang | VERIFIED (minor gap) | Generates localized metadata, canonical, alternates, OG, Twitter. Missing x-default in alternates. |
| `fmai-nextjs/src/components/seo/JsonLd.tsx`                          | Generic JSON-LD renderer           | VERIFIED             | XSS-safe with replace, uses schema-dts types, Server Component                                     |
| `fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx`              | Organization schema                | VERIFIED             | Name, URL, email, sameAs. Rendered in layout.tsx.                                                  |
| `fmai-nextjs/src/components/seo/WebSiteJsonLd.tsx`                   | WebSite with SearchAction          | VERIFIED             | SearchAction with urlTemplate. Homepage-only usage confirmed.                                      |
| `fmai-nextjs/src/components/seo/WebPageJsonLd.tsx`                   | WebPage with dateModified          | VERIFIED             | Includes isPartOf, inLanguage, dateModified from PAGE_DATES                                        |
| `fmai-nextjs/src/components/seo/ServiceJsonLd.tsx`                   | Service with provider              | VERIFIED             | serviceType, provider Organization, areaServed, dateModified                                       |
| `fmai-nextjs/src/components/seo/BreadcrumbJsonLd.tsx`                | BreadcrumbList from route          | VERIFIED             | Items array with position, locale-aware URLs                                                       |
| `fmai-nextjs/src/app/sitemap.ts`                                     | XML sitemap                        | MISSING              | File does not exist                                                                                |
| `fmai-nextjs/src/app/robots.ts`                                      | robots.txt                         | MISSING              | File does not exist                                                                                |
| `fmai-nextjs/src/app/[locale]/not-found.tsx`                         | Custom 404 page                    | MISSING              | File does not exist (translations DO exist in messages)                                            |
| `fmai-nextjs/src/app/[locale]/error.tsx`                             | Error boundary                     | MISSING              | File does not exist                                                                                |
| `fmai-nextjs/src/components/layout/Header.tsx`                       | Semantic header with nav           | VERIFIED             | header > nav[aria-label="Main navigation"], locale-aware links                                     |
| `fmai-nextjs/src/components/layout/Footer.tsx`                       | Semantic footer                    | VERIFIED             | footer element, nav[aria-label] sections, copyright                                                |
| `fmai-nextjs/src/components/layout/PageShell.tsx`                    | Main wrapper                       | VERIFIED             | Renders semantic main element                                                                      |
| `fmai-nextjs/src/components/ui/GlassCard.tsx`                        | Glass card component               | VERIFIED             | Polymorphic, highlighted variant, Server Component                                                 |
| `fmai-nextjs/src/components/ui/CTAButton.tsx`                        | CTA button variants                | VERIFIED             | primary/secondary/ghost, Link/a/button rendering                                                   |
| `fmai-nextjs/src/components/ui/SectionHeading.tsx`                   | Section heading with id            | VERIFIED             | h2 with id for aria-labelledby                                                                     |
| `fmai-nextjs/src/app/[locale]/page.tsx`                              | Homepage                           | VERIFIED             | Hero, services grid, trust, CTA. WebSiteJsonLd + WebPageJsonLd + BreadcrumbJsonLd                  |
| `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx`       | Automations page                   | VERIFIED             | ServiceJsonLd "AI Marketing Automation", pain points, solutions, process                           |
| `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx`          | Chatbots page                      | VERIFIED             | ServiceJsonLd "AI Chatbot Solutions", use cases, demo placeholder (Phase 3), process               |
| `fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx`      | Voice Agents page                  | VERIFIED             | ServiceJsonLd "AI Voice Agent Solutions", use cases, partnership                                   |
| `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx` | Marketing Machine page             | VERIFIED             | ServiceJsonLd "AI Marketing Platform", features grid, how it works                                 |
| `fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx`            | About page                         | VERIFIED             | Mission, timeline, CTA. WebPageJsonLd + BreadcrumbJsonLd                                           |
| `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx`          | Pricing page                       | VERIFIED             | 3 tier cards (starter/growth/scale), features list, CTA                                            |
| `fmai-nextjs/src/app/[locale]/(marketing)/how-it-works/page.tsx`     | How It Works page                  | VERIFIED             | Ordered process steps with ol, loop indicator, CTA                                                 |
| `fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx`          | Contact page                       | VERIFIED             | Form with label/htmlFor, name/email/company/message fields, contact info                           |
| `fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx`                | Legal page                         | VERIFIED             | article wrapper, 4 legal sections, last updated                                                    |

### Key Link Verification

| From              | To                   | Via                  | Status | Details                                                         |
| ----------------- | -------------------- | -------------------- | ------ | --------------------------------------------------------------- |
| metadata.ts       | next-intl/server     | getTranslations      | WIRED  | Line 2: import, Line 21: getTranslations({ locale, namespace }) |
| JsonLd.tsx        | schema-dts           | Type imports         | WIRED  | Line 1: import type { Thing, WithContext } from 'schema-dts'    |
| ServiceJsonLd.tsx | seo-config.ts        | PAGE_DATES           | WIRED  | Line 3: import { SITE_URL, SITE_NAME, PAGE_DATES }              |
| Header.tsx        | @/i18n/navigation    | Link                 | WIRED  | Line 2: import { Link } from '@/i18n/navigation'                |
| layout.tsx        | Header.tsx           | Rendered in layout   | WIRED  | Line 8: import, Line 41: `<Header locale={locale} />`           |
| layout.tsx        | Footer.tsx           | Rendered in layout   | WIRED  | Line 9: import, Line 43: `<Footer locale={locale} />`           |
| layout.tsx        | OrganizationJsonLd   | Rendered in layout   | WIRED  | Line 7: import, Line 40: `<OrganizationJsonLd />`               |
| Homepage          | WebSiteJsonLd        | Homepage-only schema | WIRED  | Line 5: import, Line 55: `<WebSiteJsonLd />`                    |
| Automations       | generatePageMetadata | Metadata export      | WIRED  | Line 4: import, Line 23: called in generateMetadata             |
| Automations       | ServiceJsonLd        | Service schema       | WIRED  | Line 5: import, Lines 52-58: rendered with props                |
| Pricing           | generatePageMetadata | Metadata export      | WIRED  | Line 5: import, Line 23: called in generateMetadata             |
| About             | BreadcrumbJsonLd     | Breadcrumb schema    | WIRED  | Line 7: import, Lines 42-48: rendered with items                |

### Requirements Coverage

| Requirement | Source Plan  | Description                                   | Status      | Evidence                                                                                                                                       |
| ----------- | ------------ | --------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO-02      | 02-01        | Per-page metadata localized for EN/NL/ES      | SATISFIED   | generatePageMetadata on all 10 pages, meta.title/description in all 3 locales                                                                  |
| SEO-04      | 02-01        | Hreflang tags and canonical URLs              | PARTIAL     | Canonical and per-locale hreflang work. Missing x-default entry.                                                                               |
| SEO-05      | 02-01        | XML sitemap with locale alternates            | BLOCKED     | sitemap.ts does not exist                                                                                                                      |
| SEO-06      | 02-01        | robots.txt with AI crawler allow-policy       | BLOCKED     | robots.ts does not exist                                                                                                                       |
| SEO-07      | 02-02        | Semantic HTML structure                       | SATISFIED   | header, nav[aria-label], footer, main, section[aria-labelledby], h1/h2 hierarchy, article on legal, ol on how-it-works, form labels on contact |
| SEO-08      | 02-02        | All images use next/image                     | NEEDS HUMAN | No images currently used on pages. next/image imported nowhere in page files. Not testable until images are added.                             |
| SEO-10      | 02-01        | Custom 404 and error pages                    | BLOCKED     | not-found.tsx and error.tsx do not exist                                                                                                       |
| SCHEMA-01   | 02-01        | Organization JSON-LD on all pages             | SATISFIED   | OrganizationJsonLd rendered in layout.tsx                                                                                                      |
| SCHEMA-02   | 02-01, 02-03 | WebSite JSON-LD on homepage with SearchAction | SATISFIED   | WebSiteJsonLd with potentialAction.SearchAction on homepage                                                                                    |
| SCHEMA-03   | 02-04        | WebPage JSON-LD on all subpages               | SATISFIED   | WebPageJsonLd rendered on all 10 pages                                                                                                         |
| SCHEMA-04   | 02-01, 02-03 | Service JSON-LD per service page              | SATISFIED   | ServiceJsonLd on automations, chatbots, voice-agents, marketing-machine                                                                        |
| SCHEMA-05   | 02-01, 02-04 | BreadcrumbList JSON-LD from route structure   | SATISFIED   | BreadcrumbJsonLd on all 10 pages with correct hierarchy                                                                                        |
| SCHEMA-08   | 02-01        | dateModified in JSON-LD on all pages          | SATISFIED   | PAGE_DATES used in WebPageJsonLd and ServiceJsonLd                                                                                             |
| PAGE-01     | 02-03        | Homepage                                      | SATISFIED   | Full content: hero, service cards, trust, CTA                                                                                                  |
| PAGE-02     | 02-03        | Automations service page                      | SATISFIED   | Pain points, solutions grid, process steps                                                                                                     |
| PAGE-03     | 02-03        | Chatbots service page                         | SATISFIED   | Use cases, demo placeholder (Phase 3), process                                                                                                 |
| PAGE-04     | 02-03        | Voice Agents service page                     | SATISFIED   | Capabilities, partnership, CTA                                                                                                                 |
| PAGE-05     | 02-03        | Marketing Machine service page                | SATISFIED   | Features grid, how it works, CTA                                                                                                               |
| PAGE-06     | 02-04        | About page                                    | SATISFIED   | Mission, timeline, CTA                                                                                                                         |
| PAGE-07     | 02-04        | Pricing page                                  | SATISFIED   | 3 tier cards with pricing, features, CTA                                                                                                       |
| PAGE-08     | 02-04        | How It Works page                             | SATISFIED   | Ordered process steps, loop indicator                                                                                                          |
| PAGE-09     | 02-04        | Contact page                                  | SATISFIED   | Form with labels, contact info, direct contact                                                                                                 |
| PAGE-10     | 02-04        | Legal page                                    | SATISFIED   | Article wrapper, 4 legal sections                                                                                                              |
| PAGE-11     | 02-03, 02-04 | Content/copy rework for SEO                   | SATISFIED   | All 10 pages have SEO-optimized meta titles (<60 chars) and descriptions (~155 chars)                                                          |

### Anti-Patterns Found

| File              | Line    | Pattern                                                     | Severity | Impact                                      |
| ----------------- | ------- | ----------------------------------------------------------- | -------- | ------------------------------------------- |
| Header.tsx        | 6-12    | Nav labels hardcoded in English (not using getTranslations) | Warning  | Navigation not localized for NL/ES visitors |
| Footer.tsx        | 82      | "Contact" text hardcoded (not using translation key)        | Warning  | Single untranslated string in footer        |
| chatbots/page.tsx | 112-117 | Demo placeholder section                                    | Info     | Expected -- deferred to Phase 3 per plan    |

### Human Verification Required

### 1. Visual Layout Check

**Test:** Visit /en/, /nl/, /es/ and all 10 page routes in a browser
**Expected:** Pages render with correct styling, header/footer visible, content readable
**Why human:** Visual appearance cannot be verified programmatically

### 2. Pricing Tier Values

**Test:** Visit /en/pricing and check tier prices
**Expected:** Starter EUR 1,497, Growth EUR 2,497, Scale EUR 3,997 (per project memory)
**Why human:** Price values are in translation files, need visual confirmation they render correctly

### 3. Contact Form Accessibility

**Test:** Tab through contact form fields, check label association
**Expected:** Labels correctly associated with inputs via htmlFor/id, focus visible
**Why human:** Accessibility testing needs interactive verification

## Gaps Summary

Two success criteria are blocked by 4 missing files that were planned in Plan 02-01 Task 2 but never created:

1. **sitemap.ts and robots.ts** -- These are the XML sitemap and robots.txt generators. Without them, search engines cannot discover all pages or respect AI crawler policies. The error translations exist in message files, suggesting the executor started but did not complete Plan 02-01 Task 2.

2. **not-found.tsx and error.tsx** -- Custom error pages are missing. Without not-found.tsx, visitors to invalid URLs get the default Next.js 404 instead of a branded, localized page.

3. **x-default hreflang** -- Minor gap: the alternates.languages map does not include an `x-default` entry pointing to the English version, which is recommended for international SEO.

All three gaps share a root cause: Plan 02-01 Task 2 was not executed. The translation keys for error pages were added (they exist in en.json/nl.json/es.json under "errors") but the actual component files were never created.

---

_Verified: 2026-03-18_
_Verifier: Claude (gsd-verifier)_
