---
phase: 05-content-hub
plan: 01
subsystem: content
tags: [mdx, blog, gray-matter, tailwind-typography, next-mdx]

requires:
  - phase: 01-foundation
    provides: Next.js scaffold with next-intl routing
  - phase: 04-seo-differentiation-and-geo-llmeo
    provides: SEO metadata helpers and structured data patterns
provides:
  - MDX blog infrastructure with @next/mdx pipeline
  - Blog listing page at /[locale]/blog with category filtering
  - Blog utility functions (getAllPosts, getPostSlugs, BlogPostMeta)
  - Seed MDX article with frontmatter metadata
affects: [05-content-hub, sitemap, seo]

tech-stack:
  added: [@next/mdx, @mdx-js/loader, @mdx-js/react, @tailwindcss/typography, gray-matter, remark-gfm, rehype-slug]
  patterns: [MDX frontmatter with gray-matter, client island CategoryFilter with URL search params, server-rendered blog listing]

key-files:
  created:
    - fmai-nextjs/mdx-components.tsx
    - fmai-nextjs/content/blog/ai-marketing-automation-guide.mdx
    - fmai-nextjs/src/lib/blog.ts
    - fmai-nextjs/src/components/blog/BlogPostCard.tsx
    - fmai-nextjs/src/components/blog/CategoryFilter.tsx
    - fmai-nextjs/src/app/[locale]/(blog)/blog/page.tsx
  modified:
    - fmai-nextjs/next.config.ts
    - fmai-nextjs/src/app/globals.css
    - fmai-nextjs/package.json

key-decisions:
  - "MDX plugin chain: withNextIntl(withMDX(config)) -- next-intl outermost"
  - "Empty remark/rehype plugin arrays for Turbopack compatibility"
  - "Blog page uses hardcoded English metadata (matches Phase 4 FAQ pattern)"
  - "CategoryFilter uses URL search params for server-compatible filtering"

patterns-established:
  - "MDX frontmatter scanned by gray-matter for listing page metadata"
  - "Blog route group: (blog)/blog/ under [locale]"
  - "Category filtering via URL searchParams (server-compatible)"

requirements-completed: [BLOG-01, BLOG-02]

duration: 5min
completed: 2026-03-18
---

# Phase 5 Plan 1: Blog Infrastructure Summary

**MDX blog pipeline with @next/mdx, gray-matter metadata scanning, listing page with category filter client island**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-18T14:52:27Z
- **Completed:** 2026-03-18T14:57:26Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- MDX build pipeline configured with @next/mdx chained into next-intl
- Blog listing page at /[locale]/blog renders server-side with seed article
- Category filter works via URL search params for SSR-compatible filtering
- Typography plugin loaded for prose styling in future article pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Install MDX dependencies and configure build pipeline** - `f35011b` (feat)
2. **Task 2: Create blog utilities, listing page, and category filter** - `5e17e73` (feat)

## Files Created/Modified

- `fmai-nextjs/next.config.ts` - Added @next/mdx plugin chain with pageExtensions
- `fmai-nextjs/mdx-components.tsx` - Required MDX component overrides for App Router
- `fmai-nextjs/src/app/globals.css` - Added @tailwindcss/typography plugin
- `fmai-nextjs/content/blog/ai-marketing-automation-guide.mdx` - Seed article with frontmatter
- `fmai-nextjs/src/lib/blog.ts` - getAllPosts, getPostSlugs, BLOG_CATEGORIES, BlogPostMeta
- `fmai-nextjs/src/components/blog/BlogPostCard.tsx` - Server component post card
- `fmai-nextjs/src/components/blog/CategoryFilter.tsx` - Client island for category filtering
- `fmai-nextjs/src/app/[locale]/(blog)/blog/page.tsx` - Blog listing server component with ISR

## Decisions Made

- MDX plugin chain order: withNextIntl wraps withMDX wraps nextConfig (next-intl must be outermost)
- Empty remark/rehype plugin arrays initially for Turbopack compatibility
- Blog page uses hardcoded English metadata (consistent with Phase 4 FAQ pattern)
- CategoryFilter uses URL search params for server-compatible filtering (no client state)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Blog infrastructure operational, ready for Plan 02 (individual post pages, full articles)
- MDX compilation verified, content directory pattern established
- Category filter extensible for new categories

## Self-Check: PASSED

- All 8 created/modified files verified on disk
- Commit f35011b found (Task 1)
- Commit 5e17e73 found (Task 2)

---

_Phase: 05-content-hub_
_Completed: 2026-03-18_
