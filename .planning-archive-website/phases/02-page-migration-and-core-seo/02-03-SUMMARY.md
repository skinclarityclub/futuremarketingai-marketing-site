---
phase: 02-page-migration-and-core-seo
plan: 03
subsystem: pages
tags:
  [server-components, json-ld, service-schema, breadcrumbs, seo-metadata, next-intl, semantic-html]

requires:
  - phase: 02-01
    provides: 'JSON-LD components (WebSite, WebPage, Service, Breadcrumb), generatePageMetadata, seo-config'
  - phase: 02-02
    provides: 'Header, Footer, PageShell, GlassCard, CTAButton, SectionHeading UI components'
provides:
  - 'Homepage with WebSite + WebPage + BreadcrumbList JSON-LD, service cards grid, hero, trust, CTA'
  - 'Automations service page with Service JSON-LD (AI Marketing Automation)'
  - 'Chatbots service page with Service JSON-LD (AI Chatbot Solutions) and demo placeholder'
  - 'Voice Agents service page with Service JSON-LD (AI Voice Agent Solutions)'
  - 'Marketing Machine service page with Service JSON-LD (AI Marketing Platform)'
  - 'All 5 pages: localized metadata, semantic HTML, 3 locales (en/nl/es), SSG via generateStaticParams'
affects: [02-04, 03-interactivity, seo, all-pages]

tech-stack:
  added: [next.js 16, next-intl, tailwind-merge, schema-dts]
  patterns:
    - server-component-pages-with-json-ld
    - route-group-invisible-url-segments
    - generatePageMetadata-per-page
    - setRequestLocale-for-ssg

key-files:
  created:
    - fmai-nextjs/src/app/[locale]/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx
    - fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx
  modified:
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - 'Created full Next.js scaffold inline since fmai-nextjs directory did not exist on disk (prerequisite infrastructure was documentation-only)'
  - 'Removed reactCompiler config from next.config.ts (babel-plugin-react-compiler not installed, causes build failure)'
  - 'Added fmai-nextjs to parent .eslintignore to prevent parent ESLint from linting Next.js project files against wrong tsconfig'

patterns-established:
  - 'All pages are Server Components with no "use client" directive'
  - 'Each page exports generateStaticParams returning all 3 locales'
  - 'Each page calls setRequestLocale(locale) at top of component'
  - 'Each page exports generateMetadata calling generatePageMetadata with namespace and path'
  - 'Service pages use (services) route group for invisible URL segments'
  - 'Semantic HTML: one h1 per page, h2 via SectionHeading with id for aria-labelledby'
  - 'JSON-LD rendered at top of PageShell content, before visible sections'

requirements-completed: [SCHEMA-02, SCHEMA-04, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-11]

duration: 14min
completed: 2026-03-18
---

# Phase 2 Plan 3: Homepage and Service Pages Summary

**5 server-rendered pages (homepage + 4 services) with per-page Service/WebSite JSON-LD, localized metadata in 3 locales, semantic HTML, and BreadcrumbList structured data**

## Performance

- **Duration:** 14 min
- **Started:** 2026-03-18T02:48:29Z
- **Completed:** 2026-03-18T03:03:18Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Homepage renders server-side with WebSite JSON-LD (SearchAction), WebPage JSON-LD, BreadcrumbList, hero section, service cards grid linking to 4 service pages, trust indicators, and CTA section
- 4 service pages (Automations, Chatbots, Voice Agents, Marketing Machine) each render with Service JSON-LD containing correct serviceType, BreadcrumbList with Home > Service breadcrumbs, and WebPage JSON-LD with dateModified
- All 5 pages generate static HTML for all 3 locales (15 static pages total) via generateStaticParams
- Route group (services) keeps service pages organized in codebase while remaining invisible in URLs (/en/automations, not /en/(services)/automations)
- Created full Next.js scaffold with all prerequisite infrastructure (plans 01-01 through 02-02) since fmai-nextjs directory did not exist on disk

## Task Commits

Each task was committed atomically:

0. **Infrastructure: Scaffold Next.js project** - `5b886a7` (chore) -- prerequisite
1. **Task 1: Migrate Homepage with WebSite JSON-LD and service cards** - `a7f81d3` (feat)
2. **Task 2: Migrate 4 service pages with Service JSON-LD and SEO copy** - `7b2c315` (feat)

## Files Created/Modified

- `fmai-nextjs/src/app/[locale]/page.tsx` - Homepage with WebSite + WebPage + Breadcrumb JSON-LD, hero, service cards, trust, CTA
- `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx` - Pain points, automation grid, process steps, Service JSON-LD (AI Marketing Automation)
- `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx` - Use cases, demo placeholder (Phase 3), process steps, Service JSON-LD (AI Chatbot Solutions)
- `fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx` - Capabilities, partnership info, Service JSON-LD (AI Voice Agent Solutions)
- `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx` - 6 feature modules, how-it-works steps, Service JSON-LD (AI Marketing Platform)
- `fmai-nextjs/messages/en.json` - SEO meta titles/descriptions and page content for all 5 pages
- `fmai-nextjs/messages/nl.json` - Dutch localized equivalents
- `fmai-nextjs/messages/es.json` - Spanish localized equivalents

## Decisions Made

- **Full scaffold creation:** The fmai-nextjs directory did not exist on disk despite summaries from Plans 01-01 through 02-02 claiming completion. Created the entire Next.js project with all prerequisite infrastructure (i18n routing, Tailwind v4 tokens, SEO components, UI components, translation files) as a blocking prerequisite (Rule 3).
- **Removed reactCompiler:** Plan 01-01 summary referenced reactCompiler: true in next.config.ts, but babel-plugin-react-compiler was not installed. Removed the config option to allow builds to succeed.
- **Parent .eslintignore update:** The parent Vite project's lint-staged hooks attempted to lint Next.js files against the wrong tsconfig, causing commit failures. Added fmai-nextjs to .eslintignore.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created entire Next.js scaffold and prerequisite infrastructure**

- **Found during:** Pre-task assessment
- **Issue:** fmai-nextjs directory did not exist on disk. All prior plan summaries (01-01 through 02-02) were documentation-only -- actual code was never built/committed.
- **Fix:** Created Next.js 16 project with all dependencies, i18n routing, Tailwind v4 tokens, SEO JSON-LD components, UI components (Header, Footer, PageShell, GlassCard, CTAButton, SectionHeading), and 3 locale translation files.
- **Files modified:** 32 files in fmai-nextjs/
- **Verification:** `npm run build` passes, generates static pages for all locales
- **Committed in:** 5b886a7 (infrastructure commit)

**2. [Rule 1 - Bug] Removed reactCompiler config that caused build failure**

- **Found during:** Infrastructure build verification
- **Issue:** reactCompiler: true in next.config.ts requires babel-plugin-react-compiler which was not installed
- **Fix:** Removed reactCompiler option from next.config.ts
- **Files modified:** fmai-nextjs/next.config.ts
- **Verification:** `npm run build` succeeds
- **Committed in:** 5b886a7 (infrastructure commit)

**3. [Rule 3 - Blocking] Added fmai-nextjs to parent .eslintignore**

- **Found during:** First commit attempt
- **Issue:** Parent project's lint-staged ESLint config tried to lint fmai-nextjs .tsx files against parent tsconfig, producing parsing errors
- **Fix:** Added `fmai-nextjs` to .eslintignore
- **Files modified:** .eslintignore
- **Verification:** Commit succeeds with lint hooks passing
- **Committed in:** 5b886a7 (infrastructure commit)

---

**Total deviations:** 3 auto-fixed (1 blocking infrastructure, 1 bug, 1 blocking lint)
**Impact on plan:** Infrastructure creation was necessary for any plan execution. Bug fix and lint fix were direct consequences. No scope creep beyond required prerequisites.

## Issues Encountered

- Previous plans (01-01 through 02-02) generated SUMMARY documentation but never committed actual code to the repository. The fmai-nextjs directory and all its infrastructure had to be created from scratch based on the plan specifications documented in those summaries.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 core marketing pages are server-rendered with full JSON-LD structured data
- Pages are ready for Plan 02-04 (remaining pages: about, contact, pricing, etc.)
- Phase 3 interactive features (orbit visual, demo playground, scroll animations) can be added as client islands
- Chatbot demo placeholder section is ready for Phase 3 persona playground integration

## Self-Check: PASSED

- All 8 key files verified on disk
- All 3 task commits verified: 5b886a7, a7f81d3, 7b2c315
- Build passes: `npm run build` generates 15+ static pages across 3 locales

---

_Phase: 02-page-migration-and-core-seo_
_Completed: 2026-03-18_
