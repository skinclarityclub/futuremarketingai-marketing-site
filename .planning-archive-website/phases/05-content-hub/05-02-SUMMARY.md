---
phase: 05-content-hub
plan: 02
subsystem: content
tags: [mdx, blog, json-ld, article-schema, person-schema, isr, sitemap, prose]

requires:
  - phase: 05-content-hub
    provides: MDX blog infrastructure with @next/mdx pipeline and blog utilities
  - phase: 04-seo-differentiation-and-geo-llmeo
    provides: SEO metadata helpers and structured data patterns
provides:
  - Individual blog post page with Article + Person JSON-LD structured data
  - ISR-enabled blog post rendering (revalidate = 3600)
  - BlogContent prose wrapper with dark theme styling
  - Seed article proving full MDX-to-page pipeline
  - Sitemap integration with blog post URLs and locale alternates
affects: [content-hub, seo, sitemap, geo-llmeo]

tech-stack:
  added: []
  patterns:
    [
      Article JSON-LD with Person author schema,
      dynamic MDX import via @content alias,
      prose-invert dark theme typography,
    ]

key-files:
  created:
    - fmai-nextjs/src/components/seo/ArticleJsonLd.tsx
    - fmai-nextjs/src/components/blog/BlogContent.tsx
    - fmai-nextjs/src/app/[locale]/(blog)/blog/[slug]/page.tsx
  modified:
    - fmai-nextjs/content/blog/ai-marketing-automation-guide.mdx
    - fmai-nextjs/src/app/sitemap.ts
    - fmai-nextjs/tsconfig.json

key-decisions:
  - '@content tsconfig path alias for dynamic MDX imports from content directory'
  - 'Blog post page uses hardcoded English metadata (consistent with Phase 4 and 05-01 patterns)'
  - 'dynamicParams = false for strict 404 on unknown slugs'

patterns-established:
  - 'ArticleJsonLd component follows existing ServiceJsonLd pattern from seo-config'
  - 'Dynamic MDX import via @content/blog/${slug}.mdx for individual post rendering'
  - 'Prose-invert with custom color mapping for dark theme blog content'

requirements-completed: [BLOG-03, BLOG-04, BLOG-05]

duration: 4min
completed: 2026-03-18
---

# Phase 5 Plan 2: Blog Post Template and Seed Article Summary

**Individual blog post page with Article/Person JSON-LD, ISR revalidation, 980-word seed article, and sitemap integration**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-18T15:01:13Z
- **Completed:** 2026-03-18T15:05:27Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Blog post page renders MDX content with Article JSON-LD including Person author schema
- ISR configured at 3600s with strict 404 for unknown slugs (dynamicParams = false)
- Substantial 980-word seed article proving full end-to-end pipeline
- Sitemap extended with blog listing page and individual post URLs with locale alternates

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ArticleJsonLd component, BlogContent wrapper, and blog post page with ISR** - `35bcb39` (feat)
2. **Task 2: Write seed article content and extend sitemap with blog posts** - `3ceb78f` (feat)

## Files Created/Modified

- `fmai-nextjs/src/components/seo/ArticleJsonLd.tsx` - Article + Person JSON-LD structured data component
- `fmai-nextjs/src/components/blog/BlogContent.tsx` - Prose wrapper with dark theme color mapping
- `fmai-nextjs/src/app/[locale]/(blog)/blog/[slug]/page.tsx` - Blog post page with ISR, metadata, breadcrumbs
- `fmai-nextjs/content/blog/ai-marketing-automation-guide.mdx` - 980-word AI marketing automation guide
- `fmai-nextjs/src/app/sitemap.ts` - Extended with blog listing and post entries
- `fmai-nextjs/tsconfig.json` - Added @content path alias

## Decisions Made

- Added @content tsconfig path alias for clean dynamic MDX imports (avoids deep relative paths)
- Blog post page uses hardcoded English metadata (consistent with Phase 4 FAQ and 05-01 blog listing patterns)
- dynamicParams = false ensures strict 404 for unknown slugs (no fallback rendering)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full blog pipeline proven: MDX file -> server-rendered page -> Article JSON-LD -> sitemap entry
- Content authors can add new .mdx files to content/blog/ and they auto-appear in listing and sitemap
- Phase 5 (Content Hub) complete -- ready for Phase 6

---

_Phase: 05-content-hub_
_Completed: 2026-03-18_
