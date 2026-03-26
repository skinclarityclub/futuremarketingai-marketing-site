# Phase 5: Content Hub - Research

**Researched:** 2026-03-18
**Domain:** MDX blog infrastructure in Next.js 16 App Router with ISR and structured data
**Confidence:** HIGH

## Summary

Phase 5 builds a file-based MDX blog within the existing Next.js 16 App Router project. The project already has a mature SEO infrastructure (JSON-LD components, metadata generation, sitemap, i18n routing) that the blog must integrate with. The core decision is between Velite (pre-1.0, v0.3.1) and @next/mdx (official, stable) for MDX processing. Given the project's constraints -- Velite is pre-1.0 with known Turbopack compatibility issues, while @next/mdx is the official Next.js solution with full RSC and Turbopack support -- the recommendation is to use @next/mdx with dynamic imports and exported metadata objects from each MDX file.

The blog needs: a listing page with category filtering, individual post pages with Article JSON-LD, author Person schema, ISR for cache freshness, and at least one seed article. The existing project patterns (JsonLd component, generatePageMetadata helper, sitemap.ts, next-intl routing) provide a solid foundation that the blog extends rather than replaces.

**Primary recommendation:** Use @next/mdx with dynamic imports, exported metadata per MDX file, and a filesystem-based content directory at `content/blog/`. Extend existing SEO components with ArticleJsonLd. Use `revalidate = 3600` for ISR.

<phase_requirements>

## Phase Requirements

| ID      | Description                                        | Research Support                                                                                        |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| BLOG-01 | Blog/content hub page structure with MDX support   | @next/mdx with content/blog/ directory, dynamic imports in [slug]/page.tsx                              |
| BLOG-02 | Blog listing page with category filtering          | Server component reads all MDX metadata, filters by category field, renders card grid                   |
| BLOG-03 | Individual blog post template with Article JSON-LD | New ArticleJsonLd component extending existing JsonLd pattern with schema-dts Article type              |
| BLOG-04 | Author attribution with Person schema              | Person schema embedded in Article JSON-LD author field, author data in seo-config.ts                    |
| BLOG-05 | ISR for blog pages                                 | `export const revalidate = 3600` on blog route segments, generateStaticParams for build-time generation |

</phase_requirements>

## Standard Stack

### Core

| Library        | Version | Purpose                       | Why Standard                                                    |
| -------------- | ------- | ----------------------------- | --------------------------------------------------------------- |
| @next/mdx      | latest  | MDX compilation and rendering | Official Next.js MDX solution, RSC-native, Turbopack compatible |
| @mdx-js/loader | latest  | Webpack/Turbopack MDX loader  | Required peer dependency for @next/mdx                          |
| @mdx-js/react  | latest  | MDX React runtime             | Required peer dependency for @next/mdx                          |
| @types/mdx     | latest  | TypeScript types for MDX      | Type safety for MDX imports                                     |

### Supporting

| Library                 | Version              | Purpose                        | When to Use                                                         |
| ----------------------- | -------------------- | ------------------------------ | ------------------------------------------------------------------- |
| @tailwindcss/typography | latest v4-compatible | Prose styling for blog content | All MDX rendered content -- provides `prose` classes for dark theme |
| remark-gfm              | latest               | GitHub Flavored Markdown       | Tables, strikethrough, task lists, autolinks in blog posts          |
| rehype-slug             | latest               | Add IDs to headings            | Anchor links for heading navigation                                 |
| rehype-pretty-code      | latest               | Syntax highlighting via Shiki  | Code blocks in technical blog posts                                 |
| gray-matter             | latest               | Frontmatter parsing            | Reading YAML frontmatter from MDX files for the listing page        |

### Alternatives Considered

| Instead of  | Could Use                                   | Tradeoff                                                                                                                                       |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| @next/mdx   | Velite (v0.3.1)                             | Velite provides a nicer DX with Zod schemas and a data layer, but is pre-1.0 with Turbopack issues. Fallback if @next/mdx proves insufficient. |
| @next/mdx   | next-mdx-remote                             | Designed for remote content sources, overkill for local filesystem MDX. Not well maintained.                                                   |
| @next/mdx   | Contentlayer                                | Abandoned/unmaintained, does not support Next.js 14+. Dead project.                                                                            |
| gray-matter | remark-frontmatter + remark-mdx-frontmatter | More complex setup for the same result. gray-matter is simpler for reading metadata in listing pages.                                          |

**Installation:**

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx @tailwindcss/typography remark-gfm rehype-slug rehype-pretty-code gray-matter
```

## Architecture Patterns

### Recommended Project Structure

```
fmai-nextjs/
├── content/
│   └── blog/
│       ├── ai-marketing-automation-guide.mdx    # Seed article
│       └── ...future posts
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       └── (blog)/
│   │           └── blog/
│   │               ├── page.tsx                  # Blog listing page
│   │               └── [slug]/
│   │                   └── page.tsx              # Individual post page
│   ├── components/
│   │   ├── blog/
│   │   │   ├── BlogPostCard.tsx                  # Card for listing page
│   │   │   ├── BlogContent.tsx                   # MDX wrapper with prose styling
│   │   │   └── CategoryFilter.tsx                # Client island for filtering
│   │   └── seo/
│   │       └── ArticleJsonLd.tsx                 # NEW: Article schema component
│   └── lib/
│       └── blog.ts                               # Blog utility functions (getAllPosts, getPostBySlug)
├── mdx-components.tsx                            # Global MDX component overrides
└── next.config.ts                                # Updated with @next/mdx
```

### Pattern 1: MDX with Exported Metadata

**What:** Each MDX file exports a metadata object alongside its content
**When to use:** For all blog posts -- provides type-safe metadata without separate frontmatter parsing
**Example:**

```typescript
// content/blog/ai-marketing-automation-guide.mdx
export const metadata = {
  title: 'The Complete Guide to AI Marketing Automation',
  description: 'How AI-powered marketing automation transforms B2B growth...',
  author: 'Daley Maat',
  publishedAt: '2026-03-18',
  updatedAt: '2026-03-18',
  category: 'ai-marketing',
  tags: ['AI', 'marketing automation', 'B2B'],
  locale: 'en',
}

# The Complete Guide to AI Marketing Automation

Content here...
```

```typescript
// src/app/[locale]/(blog)/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const { default: Post, metadata } = await import(`@/content/blog/${slug}.mdx`)

  return (
    <>
      <ArticleJsonLd
        title={metadata.title}
        description={metadata.description}
        author={metadata.author}
        datePublished={metadata.publishedAt}
        dateModified={metadata.updatedAt}
        locale={locale}
        slug={slug}
      />
      <article className="prose prose-invert max-w-none">
        <Post />
      </article>
    </>
  )
}

export function generateStaticParams() {
  // Return all known slugs for static generation
  return [{ slug: 'ai-marketing-automation-guide' }]
}

export const dynamicParams = false
export const revalidate = 3600
```

### Pattern 2: Blog Listing with Filesystem Scan

**What:** Server component reads all MDX files to build the listing page
**When to use:** For the /blog index page
**Example:**

```typescript
// src/lib/blog.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  author: string
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  locale: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export function getAllPosts(): BlogPostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
  return files
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const source = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      // Use gray-matter OR regex to extract the exported metadata
      // For exported metadata pattern, we parse the export const metadata = {...}
      const { data } = matter(source)
      return { slug, ...data } as BlogPostMeta
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
```

### Pattern 3: ISR with generateStaticParams

**What:** Pre-render all known blog posts at build time, revalidate periodically
**When to use:** All blog routes
**Example:**

```typescript
// Listing page
export const revalidate = 3600 // 1 hour

// Post page
export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}
export const dynamicParams = false // 404 for unknown slugs
export const revalidate = 3600
```

### Pattern 4: next.config.ts with @next/mdx + next-intl

**What:** Chain @next/mdx with existing next-intl plugin
**When to use:** Project configuration
**Example:**

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug'],
  },
})

export default withNextIntl(withMDX(nextConfig))
```

### Anti-Patterns to Avoid

- **Using next-mdx-remote for local files:** Adds unnecessary complexity. @next/mdx handles local files natively.
- **Client-side MDX rendering:** MDX should compile at build time via RSC. Never ship the MDX compiler to the client.
- **Storing blog metadata in a separate JSON file:** Co-locate metadata with the MDX file using exports or frontmatter.
- **Creating a CMS integration now:** Out of scope per REQUIREMENTS.md. File-based MDX is the content source.
- **Building per-locale MDX files initially:** Start with English-only content. i18n for blog content is a v2 concern (CONT-01 through CONT-04 are deferred).

## Don't Hand-Roll

| Problem                 | Don't Build                 | Use Instead                                   | Why                                                  |
| ----------------------- | --------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| Markdown rendering      | Custom parser               | @next/mdx                                     | Handles RSC, Turbopack, import resolution            |
| Prose styling           | Custom CSS for each element | @tailwindcss/typography `prose` classes       | 50+ element styles, dark mode, responsive            |
| Syntax highlighting     | Custom highlighter          | rehype-pretty-code (Shiki)                    | Language detection, theme support, line highlighting |
| Heading anchors         | Manual ID assignment        | rehype-slug                                   | Consistent slug generation, handles edge cases       |
| Article structured data | Raw JSON-LD strings         | ArticleJsonLd component with schema-dts types | Type safety, consistent with existing pattern        |
| Frontmatter parsing     | Regex extraction            | gray-matter                                   | YAML parsing edge cases, well-tested                 |
| Blog post routing       | Custom file resolution      | Next.js dynamic routes + generateStaticParams | ISR, static generation, 404 handling built-in        |

**Key insight:** The existing project already has all the SEO infrastructure (JsonLd, metadata helpers, sitemap). The blog phase is about extending these patterns, not building new infrastructure.

## Common Pitfalls

### Pitfall 1: @next/mdx Does Not Support Frontmatter Natively

**What goes wrong:** Developers add YAML frontmatter to MDX files and expect @next/mdx to parse it. It does not.
**Why it happens:** Frontmatter is a convention, not part of the MDX spec.
**How to avoid:** Use exported `metadata` objects in MDX files (Next.js convention) for the post page. For the listing page, use gray-matter to parse files or use a hybrid approach where metadata is both exported AND in frontmatter.
**Warning signs:** Build errors about unexpected YAML, undefined metadata imports.

### Pitfall 2: next.config.ts Plugin Chaining Order

**What goes wrong:** @next/mdx and next-intl plugins interfere with each other when chained incorrectly.
**Why it happens:** Both plugins wrap the config object. Order matters.
**How to avoid:** Apply next-intl as the outermost wrapper: `withNextIntl(withMDX(nextConfig))`. Test that both i18n routing and MDX rendering work after configuration.
**Warning signs:** MDX files not compiling, locale routing broken.

### Pitfall 3: Turbopack Compatibility with Remark/Rehype Plugins

**What goes wrong:** Plugins with function-based options fail with Turbopack (dev mode uses Turbopack by default in Next.js 16).
**Why it happens:** Turbopack cannot serialize JavaScript functions to Rust.
**How to avoid:** Use string-based plugin references in the MDX config. For plugins that need options, check if they work as `['plugin-name', { options }]` format.
**Warning signs:** Dev server errors mentioning serialization, plugins working in build but not dev.

### Pitfall 4: Prose Styling in Dark Theme

**What goes wrong:** Default @tailwindcss/typography prose classes use light theme colors, making text invisible on dark backgrounds.
**Why it happens:** Typography plugin defaults to light theme.
**How to avoid:** Use `prose-invert` class alongside `prose` for dark backgrounds. Customize prose colors to match the Living System theme (text-primary, text-secondary, accent-system).
**Warning signs:** White text on white background, wrong link colors.

### Pitfall 5: Missing mdx-components.tsx

**What goes wrong:** @next/mdx silently fails or throws cryptic errors without this file.
**Why it happens:** It is a required file convention in App Router.
**How to avoid:** Create `mdx-components.tsx` at the project root (same level as `src/`). Even if empty, it must exist and export `useMDXComponents`.
**Warning signs:** MDX not rendering, "module not found" errors.

### Pitfall 6: Blog Routes Not Covered by Locale Middleware

**What goes wrong:** Blog pages accessible without locale prefix, or locale middleware blocks blog routes.
**Why it happens:** New routes need to be within the `[locale]` segment.
**How to avoid:** Place blog routes under `src/app/[locale]/(blog)/blog/`. The existing middleware matcher already handles all non-API routes.
**Warning signs:** 404 on /en/blog, locale not available in blog pages.

### Pitfall 7: Sitemap Not Including Blog Posts

**What goes wrong:** Blog posts are not discoverable by search engines because the sitemap only lists static pages.
**Why it happens:** Current sitemap.ts has a hardcoded page list.
**How to avoid:** Extend sitemap.ts to dynamically read blog post slugs and add them with proper locale alternates.
**Warning signs:** Google Search Console showing blog posts not indexed.

## Code Examples

### ArticleJsonLd Component

```typescript
// Source: Extending existing JsonLd pattern with schema-dts Article type
// src/components/seo/ArticleJsonLd.tsx
import type { WithContext, Article } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'

interface ArticleJsonLdProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  slug: string
  locale: string
}

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  slug,
  locale,
}: ArticleJsonLdProps) {
  const data: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/${locale}/blog/${slug}`,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  return <JsonLd data={data} />
}
```

### mdx-components.tsx with Dark Theme Styling

```typescript
// mdx-components.tsx (project root)
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

export function useMDXComponents(): MDXComponents {
  return {
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    // Custom components can be added here for MDX use
    // e.g., <Callout>, <CodeBlock>, etc.
  }
}
```

### Tailwind v4 Typography Plugin Setup

```css
/* globals.css - add @plugin directive */
@import 'tailwindcss';
@plugin "@tailwindcss/typography";

@theme {
  /* existing theme tokens... */
}
```

### Extended Sitemap with Blog Posts

```typescript
// src/app/sitemap.ts (extended)
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { SITE_URL, PAGE_DATES } from '@/lib/seo-config'
import { getAllPosts } from '@/lib/blog'

// ... existing pages array ...

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = pages.map(({ path, changeFrequency, priority }) => {
    // ... existing logic ...
  })

  const blogPosts = getAllPosts()
  const blogEntries = blogPosts.map((post) => {
    const languages: Record<string, string> = {}
    for (const locale of routing.locales) {
      languages[locale] = `${SITE_URL}/${locale}/blog/${post.slug}`
    }
    return {
      url: `${SITE_URL}/en/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages },
    }
  })

  return [...staticEntries, ...blogEntries]
}
```

## State of the Art

| Old Approach       | Current Approach             | When Changed                  | Impact                                                |
| ------------------ | ---------------------------- | ----------------------------- | ----------------------------------------------------- |
| Contentlayer       | Velite / @next/mdx           | 2024 (Contentlayer abandoned) | Contentlayer is dead, do not use                      |
| next-mdx-remote    | @next/mdx dynamic imports    | 2024 (RSC maturity)           | next-mdx-remote unnecessary for local files           |
| tailwind.config.js | @plugin directive in CSS     | Tailwind v4 (2025)            | No JS config file needed                              |
| Webpack-only MDX   | Turbopack-compatible plugins | Next.js 15+                   | Use string-based plugin references                    |
| getStaticProps ISR | Route segment revalidate     | Next.js 13+ App Router        | `export const revalidate = N` replaces getStaticProps |

**Deprecated/outdated:**

- Contentlayer: Abandoned, does not support Next.js 14+
- next-mdx-remote: Poorly maintained, unnecessary for local MDX
- `getStaticPaths`/`getStaticProps`: Pages Router pattern, replaced by `generateStaticParams` + `revalidate`

## Open Questions

1. **Frontmatter vs Export Metadata**
   - What we know: @next/mdx supports exported metadata natively, but gray-matter can parse frontmatter for listing pages
   - What's unclear: Whether a hybrid approach (frontmatter for listing + export for type safety) is worth the complexity
   - Recommendation: Use frontmatter with gray-matter for listing page scanning, and dynamically import the MDX module for individual post pages. This is the most pragmatic approach since gray-matter can read frontmatter without compiling the MDX.

2. **Blog i18n Strategy**
   - What we know: Site has EN/NL/ES locales. Blog content is English-first. Full content i18n is v2.
   - What's unclear: Whether blog UI chrome (heading, filter labels) should be translated in v1
   - Recommendation: Translate blog UI chrome (listing page title, category labels, "Read more" etc.) via next-intl. Blog post content stays English-only.

3. **Category Taxonomy**
   - What we know: Need category filtering on listing page
   - What's unclear: What categories to use
   - Recommendation: Start with 3-4 categories aligned to services: `ai-marketing`, `automation`, `chatbots`, `voice-agents`. Add more as content grows.

## Sources

### Primary (HIGH confidence)

- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Official MDX setup, version 16.1.7, last updated 2026-03-16
- [Next.js ISR Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) - Official ISR documentation, version 16.1.7
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Structured data best practices
- Existing codebase: JsonLd, WebPageJsonLd, OrganizationJsonLd, ServiceJsonLd, sitemap.ts, metadata.ts patterns

### Secondary (MEDIUM confidence)

- [Velite npm](https://www.npmjs.com/package/velite) - Version 0.3.1, pre-1.0, Turbopack compatibility issues noted
- [Tailwind CSS v4 Typography](https://github.com/tailwindlabs/tailwindcss-typography) - @plugin directive for v4 compatibility
- [rehype-pretty-code](https://rehype-pretty.pages.dev/) - Shiki-based syntax highlighting

### Tertiary (LOW confidence)

- Community blog templates using Velite + Next.js 16 -- multiple exist but production stability unverified

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - @next/mdx is official, well-documented, version-matched to Next.js 16
- Architecture: HIGH - Extends existing proven patterns in the codebase
- Pitfalls: HIGH - Based on official docs caveats and known Turbopack constraints
- ISR: HIGH - Official Next.js documentation with explicit App Router examples
- Tailwind typography: MEDIUM - v4 @plugin directive is documented but specific dark theme customization needs testing

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (30 days -- stable domain, all core libs are mature)
