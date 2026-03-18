# Phase 2: Page Migration and Core SEO - Research

**Researched:** 2026-03-18
**Domain:** Next.js 16 Metadata API, JSON-LD structured data, sitemap/robots generation, next/image optimization, semantic HTML, page migration from Vite SPA
**Confidence:** HIGH

## Summary

Phase 2 migrates all 10 existing pages from the Vite SPA into the Next.js App Router, wiring each with per-page localized metadata (title, description, OG tags), JSON-LD structured data, semantic HTML, and proper hreflang/canonical URLs. It also creates the SEO infrastructure layer: a shared metadata generator, reusable JSON-LD components, XML sitemap with locale alternates, robots.txt with AI crawler policy, custom 404 page, and the migration of shared UI components (layout shell, nav, footer, cards, buttons) to semantic HTML in Server Components.

The migration scope is 10 pages totalling ~2,928 lines of React code, plus ~15 shared UI components (FloatingNav, Footer, GlassCard, CTAButton, ScrollReveal, ProductMedia, etc.). The existing Vite codebase already has `SEOHead` (react-helmet-async) and `StructuredData` components that provide reference implementations -- these will be replaced by Next.js native `generateMetadata` and inline `<script type="application/ld+json">` tags respectively. Key architectural constraint: pages MUST be Server Components; interactive parts (animations, Calendly triggers, nav hover states) are deferred to Phase 3 or isolated as "use client" islands.

**Primary recommendation:** Build the SEO infrastructure first (metadata generator, JSON-LD helpers, sitemap, robots, 404), then migrate shared UI components to semantic HTML, then migrate pages in two batches: homepage + 4 service pages, then 5 supporting pages. Use `schema-dts` for type-safe JSON-LD. All metadata must be localized through `getTranslations()` in `generateMetadata()`.

<phase_requirements>

## Phase Requirements

| ID        | Description                                                            | Research Support                                                                                                                                             |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SEO-02    | Per-page metadata (title, description, OG tags) localized for EN/NL/ES | Next.js `generateMetadata` with `getTranslations({locale, namespace})` -- pattern documented in Architecture Patterns                                        |
| SEO-04    | Hreflang tags and canonical URLs via metadata alternates               | `metadata.alternates.languages` object in `generateMetadata` return value -- pattern documented in Code Examples                                             |
| SEO-05    | XML sitemap with locale alternates for all pages                       | `app/sitemap.ts` with `MetadataRoute.Sitemap` type and `alternates.languages` per entry -- pattern documented in Code Examples                               |
| SEO-06    | robots.txt with AI crawler allow-policy                                | `app/robots.ts` with `MetadataRoute.Robots` type, separate rules for training vs retrieval bots -- pattern documented in Code Examples                       |
| SEO-07    | Semantic HTML structure across all pages                               | Replace `<div>` soup with `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`, proper h1-h6 hierarchy -- documented in Architecture Patterns |
| SEO-08    | All images use next/image with explicit dimensions                     | Replace `<img>` and `ProductMedia` with `next/image` using `width`/`height` or `fill` with sized parent -- documented in Don't Hand-Roll                     |
| SEO-10    | Custom 404 and error pages with proper HTTP status codes               | `app/[locale]/not-found.tsx` with `notFound()` from `next/navigation` -- pattern documented in Architecture Patterns                                         |
| SCHEMA-01 | Organization JSON-LD on all pages                                      | Shared `OrganizationJsonLd` component rendered in root layout -- pattern documented in Code Examples                                                         |
| SCHEMA-02 | WebSite JSON-LD on homepage with SearchAction                          | Homepage-specific `WebSiteJsonLd` with `potentialAction.SearchAction` -- documented in Code Examples                                                         |
| SCHEMA-03 | WebPage JSON-LD on all subpages                                        | Per-page `WebPageJsonLd` with `name`, `description`, `url`, `dateModified` -- documented in Code Examples                                                    |
| SCHEMA-04 | Service JSON-LD per service page                                       | `ServiceJsonLd` with `provider` (Organization), `serviceType`, `areaServed` -- documented in Code Examples                                                   |
| SCHEMA-05 | BreadcrumbList JSON-LD generated from route structure                  | `BreadcrumbJsonLd` utility that generates `itemListElement` from pathname segments -- documented in Code Examples                                            |
| SCHEMA-08 | dateModified in JSON-LD on all pages for content freshness             | All JSON-LD includes `dateModified` field with ISO 8601 date -- documented in Architecture Patterns                                                          |
| PAGE-01   | Homepage with service cards, orbit visual, gradient mesh               | Server-rendered homepage with static content; interactive visuals (orbit, mesh) deferred to Phase 3 as client islands                                        |
| PAGE-02   | Automations service page                                               | 454-line page migration with pain points, automations grid, process steps, pricing reference                                                                 |
| PAGE-03   | Chatbots service page with demo playground                             | Page content migrated; demo playground interactive features deferred to Phase 3                                                                              |
| PAGE-04   | Voice Agents service page                                              | 390-line page migration with service features and pricing reference                                                                                          |
| PAGE-05   | Marketing Machine service page                                         | 277-line page migration with feature showcase                                                                                                                |
| PAGE-06   | About page                                                             | 211-line page migration with company info and team section                                                                                                   |
| PAGE-07   | Pricing page with comparison tables                                    | 366-line page with tier comparison, FAQ section, pricing data from gateway-pricing lib                                                                       |
| PAGE-08   | How It Works page                                                      | 148-line page with step-by-step process                                                                                                                      |
| PAGE-09   | Contact page                                                           | 329-line page with contact form and CTA                                                                                                                      |
| PAGE-10   | Legal page                                                             | 249-line page with legal text                                                                                                                                |
| PAGE-11   | Content/copy rework for SEO on all pages                               | Translation keys updated with SEO-optimized copy in all 3 locales                                                                                            |

</phase_requirements>

## Standard Stack

### Core (Already installed from Phase 1)

| Library    | Version | Purpose                                                            | Why Standard                                                                         |
| ---------- | ------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Next.js    | 16.1.x  | Metadata API, sitemap.ts, robots.ts, not-found.tsx, next/image     | Built-in SEO primitives replace react-helmet-async + custom components               |
| next-intl  | 4.8.x   | `getTranslations()` in `generateMetadata()` for localized metadata | Server Component translation for metadata, breadcrumbs, structured data              |
| schema-dts | 1.1.x   | TypeScript types for JSON-LD (`WithContext<Organization>`, etc.)   | Type-safe structured data, zero runtime cost, already planned for install in Phase 1 |

### Supporting (New for Phase 2)

| Library      | Version  | Purpose      | When to Use                                                      |
| ------------ | -------- | ------------ | ---------------------------------------------------------------- |
| lucide-react | existing | Icon library | Carry over from Vite codebase, used in nav, service pages, cards |

### No New Dependencies

Phase 2 requires zero new npm packages. Everything builds on Phase 1's stack plus Next.js built-in APIs:

- `generateMetadata` replaces `react-helmet-async`
- `app/sitemap.ts` replaces nothing (SPA had no sitemap)
- `app/robots.ts` replaces nothing (SPA had no robots.txt)
- `next/image` replaces `<img>` and `ProductMedia` component
- `<script type="application/ld+json">` replaces `StructuredData` component (no Helmet needed)

## Architecture Patterns

### Project Structure (Phase 2 additions)

```
fmai-nextjs/src/
  app/
    [locale]/
      layout.tsx              # Updated: add Organization JSON-LD, semantic wrapper
      page.tsx                # Homepage with WebSite JSON-LD, service cards
      not-found.tsx           # Custom 404 page (localized)
      (services)/
        automations/page.tsx  # Service JSON-LD + page content
        chatbots/page.tsx     # Service JSON-LD + page content
        voice-agents/page.tsx # Service JSON-LD + page content
        marketing-machine/page.tsx # Service JSON-LD + page content
      (marketing)/
        about/page.tsx        # WebPage JSON-LD
        pricing/page.tsx      # WebPage JSON-LD + pricing data
        how-it-works/page.tsx # WebPage JSON-LD
        contact/page.tsx      # WebPage JSON-LD
      (legal)/
        legal/page.tsx        # WebPage JSON-LD
    sitemap.ts                # XML sitemap (outside [locale] segment)
    robots.ts                 # robots.txt (outside [locale] segment)
  components/
    layout/
      Header.tsx              # Server Component: semantic <header> + <nav>
      Footer.tsx              # Server Component: semantic <footer>
      PageShell.tsx           # Shared page wrapper with semantic <main>, <section>
    ui/
      GlassCard.tsx           # Migrated from common/GlassCard
      CTAButton.tsx           # Migrated from common/CTAButton
      ScrollRevealWrapper.tsx # "use client" island for scroll animations
    seo/
      JsonLd.tsx              # Generic JSON-LD renderer (sanitized)
      OrganizationJsonLd.tsx  # Organization schema component
      WebSiteJsonLd.tsx       # WebSite + SearchAction schema
      WebPageJsonLd.tsx       # WebPage schema with dateModified
      ServiceJsonLd.tsx       # Service schema for service pages
      BreadcrumbJsonLd.tsx    # BreadcrumbList from route segments
  lib/
    metadata.ts               # Shared metadata generator utility
    seo-config.ts             # Site URL, org name, social profiles, page dates
```

### Pattern 1: Shared Metadata Generator

**What:** A reusable function that generates consistent metadata with localized title, description, OG tags, hreflang alternates, and canonical URLs for every page.
**When to use:** Every `generateMetadata` export calls this function.
**Confidence:** HIGH (Next.js official Metadata API + next-intl docs)

```typescript
// lib/metadata.ts
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

const SITE_URL = 'https://futuremarketingai.com'
const SITE_NAME = 'Future Marketing AI'

interface PageMetadataOptions {
  locale: string
  namespace: string // Translation namespace for this page
  path: string // e.g., '/automations', '/'
  ogType?: 'website' | 'article'
}

export async function generatePageMetadata({
  locale,
  namespace,
  path,
  ogType = 'website',
}: PageMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })

  const canonicalPath = path === '/' ? '' : path
  const canonicalUrl = `${SITE_URL}/${locale}${canonicalPath}`

  // Build alternates for all locales
  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}${canonicalPath}`
  }
  languages['x-default'] = `${SITE_URL}/en${canonicalPath}`

  return {
    title: `${t('meta.title')} | ${SITE_NAME}`,
    description: t('meta.description'),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale === 'nl' ? 'nl_NL' : locale === 'es' ? 'es_ES' : 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}
```

### Pattern 2: JSON-LD Renderer (Sanitized)

**What:** A reusable component that renders JSON-LD as a `<script>` tag with XSS protection.
**When to use:** All structured data rendering.
**Confidence:** HIGH (Next.js official JSON-LD guide, verified March 2026)

```typescript
// components/seo/JsonLd.tsx
import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
  data: WithContext<T>;
}

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

### Pattern 3: Page with generateMetadata and JSON-LD

**What:** Standard pattern for every migrated page -- Server Component with metadata, JSON-LD, and semantic HTML.
**When to use:** All 10 pages follow this pattern.
**Confidence:** HIGH

```typescript
// app/[locale]/(services)/automations/page.tsx
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    namespace: 'automations',
    path: '/automations',
  });
}

export default async function AutomationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('automations');

  return (
    <main>
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Automation"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('meta.title'), path: '/automations' },
        ]}
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/automations"
        locale={locale}
      />

      {/* Semantic page content */}
      <section aria-labelledby="automations-hero">
        <h1 id="automations-hero">{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
      </section>

      {/* More sections... */}
    </main>
  );
}
```

### Pattern 4: Localized Sitemap with Alternates

**What:** sitemap.ts at app root generates all page URLs with locale alternate links.
**When to use:** Single sitemap.ts for the entire site (only ~30 URLs: 10 pages x 3 locales).
**Confidence:** HIGH (Next.js 16 official docs, verified March 2026)

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

const SITE_URL = 'https://futuremarketingai.com'
const locales = ['en', 'nl', 'es'] as const
const pages = [
  '/',
  '/automations',
  '/chatbots',
  '/voice-agents',
  '/marketing-machine',
  '/about',
  '/pricing',
  '/how-it-works',
  '/contact',
  '/legal',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    const path = page === '/' ? '' : page

    const languages: Record<string, string> = {}
    for (const locale of locales) {
      languages[locale] = `${SITE_URL}/${locale}${path}`
    }

    entries.push({
      url: `${SITE_URL}/en${path}`,
      lastModified: new Date(),
      changeFrequency: page === '/' ? 'weekly' : 'monthly',
      priority: page === '/' ? 1 : 0.8,
      alternates: { languages },
    })
  }

  return entries
}
```

### Pattern 5: robots.txt with AI Crawler Policy

**What:** robots.ts with separate rules for search engines, AI retrieval bots (allow), and AI training bots (block).
**When to use:** SEO-06 requirement.
**Confidence:** HIGH (Next.js robots.ts API + 2026 AI crawler best practices)

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // AI retrieval bots -- ALLOW (appear in AI search answers)
      {
        userAgent: ['ChatGPT-User', 'Claude-SearchBot', 'OAI-SearchBot', 'PerplexityBot'],
        allow: '/',
      },
      // AI training bots -- BLOCK (prevent content entering training data)
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'anthropic-ai'],
        disallow: '/',
      },
    ],
    sitemap: 'https://futuremarketingai.com/sitemap.xml',
  }
}
```

### Pattern 6: Custom 404 Page (Localized)

**What:** `not-found.tsx` inside `[locale]` segment returns localized 404 content with proper HTTP status.
**When to use:** SEO-10 requirement.
**Confidence:** HIGH (Next.js official docs)

```typescript
// app/[locale]/not-found.tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-bold text-accent-system">404</h1>
      <p className="text-xl text-text-secondary mt-4">{t('notFound.message')}</p>
      <Link href="/" className="mt-8 text-accent-system hover:underline">
        {t('notFound.backHome')}
      </Link>
    </main>
  );
}
```

**Important:** Next.js automatically returns a 404 HTTP status when `not-found.tsx` renders. The `notFound()` function from `next/navigation` triggers it from page components when needed (e.g., invalid locale).

### Pattern 7: Semantic HTML Structure

**What:** Every page follows a consistent semantic structure.
**When to use:** All migrated pages.

```html
<main>
  <!-- JSON-LD scripts (invisible, for crawlers) -->
  <script type="application/ld+json">
    ...
  </script>

  <!-- Hero section -->
  <section aria-labelledby="page-hero">
    <h1 id="page-hero">Page Title</h1>
    <p>Page subtitle / description</p>
  </section>

  <!-- Content sections with h2 subheadings -->
  <section aria-labelledby="section-name">
    <h2 id="section-name">Section Title</h2>
    <!-- Section content -->
  </section>

  <!-- More sections follow same pattern -->
</main>
```

Rules:

- One `<h1>` per page (in the hero section)
- `<h2>` for major sections, `<h3>` for subsections within
- `<nav>` for navigation (header, footer links)
- `<footer>` for page/site footer
- `<section>` with `aria-labelledby` for each major content block
- `<article>` for self-contained content (blog posts, card items if standalone)

### Anti-Patterns to Avoid

- **Putting JSON-LD in layout.tsx for page-specific schemas:** Layout JSON-LD (Organization) is fine. But Service, WebPage, and BreadcrumbList schemas belong in the page component because they are page-specific.
- **Using `dangerouslySetInnerHTML` without sanitization:** Always replace `<` with `\u003c` in JSON.stringify output to prevent XSS.
- **Hardcoding metadata in English:** Every `generateMetadata` must use `getTranslations({ locale })` to produce localized titles and descriptions.
- **Forgetting `generateStaticParams` on route groups:** Each page needs to export `generateStaticParams` returning all locales, or the parent layout handles it.
- **Making all pages dynamic with `force-dynamic`:** Pages with only translation-based content should be statically generated. Use `setRequestLocale(locale)` + `generateStaticParams` for SSG.
- **Duplicating metadata logic per page:** Use the shared `generatePageMetadata()` utility. Per-page `generateMetadata` should be a 5-line function.

## Don't Hand-Roll

| Problem            | Don't Build                                  | Use Instead                                                      | Why                                                                                 |
| ------------------ | -------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Per-page meta tags | Custom `<head>` manipulation or react-helmet | `generateMetadata` + `Metadata` type                             | Next.js merges metadata from layouts and pages automatically, handles deduplication |
| Sitemap generation | Custom XML builder or API route              | `app/sitemap.ts` with `MetadataRoute.Sitemap`                    | Cached by default, locale alternates built-in, auto-discovered by crawlers          |
| robots.txt         | Static file in public/                       | `app/robots.ts` with `MetadataRoute.Robots`                      | Programmatic, type-safe, can reference sitemap URL dynamically                      |
| JSON-LD rendering  | React Helmet `<script>` injection            | Inline `<script type="application/ld+json">` in Server Component | No client-side library needed, renders in SSR HTML, zero JS cost                    |
| Image optimization | `<img>` with manual srcset/sizes             | `next/image` with `width`/`height` or `fill`                     | Automatic WebP/AVIF, lazy loading, blur placeholder, CLS prevention                 |
| Hreflang tags      | Custom `<link rel="alternate">` in head      | `metadata.alternates.languages` in `generateMetadata`            | Next.js renders correct `<link>` tags automatically                                 |
| Canonical URLs     | Manual `<link rel="canonical">`              | `metadata.alternates.canonical`                                  | Consistent with alternates, no duplication risk                                     |

**Key insight:** Next.js 16's Metadata API replaces the entire `react-helmet-async` + `StructuredData` layer from the Vite codebase. The existing `SEOHead.tsx` and `StructuredData.tsx` components become unnecessary -- their logic maps directly to built-in Next.js primitives.

## Common Pitfalls

### Pitfall 1: Metadata streaming causes missing meta for social previews

**What goes wrong:** Next.js 16 streams metadata for dynamically rendered pages. Social media crawlers (Twitterbot, Slackbot) that expect `<meta>` tags in `<head>` may see incomplete metadata.
**Why it happens:** Streaming metadata is new in Next.js 16. It prioritizes UI speed over metadata completeness.
**How to avoid:** Use static generation (`generateStaticParams` + `setRequestLocale`) for all marketing pages. These pages have no dynamic data, so they should be SSG. SSG pages resolve metadata at build time, not via streaming.
**Warning signs:** Social media link previews showing site name instead of page-specific title/description.

### Pitfall 2: Sitemap placed inside [locale] segment

**What goes wrong:** If `sitemap.ts` is inside `app/[locale]/sitemap.ts`, it generates per-locale sitemaps at `/en/sitemap.xml`, `/nl/sitemap.xml` instead of a single `/sitemap.xml`.
**Why it happens:** Intuitive to put it near pages, but sitemaps should be at the domain root.
**How to avoid:** Place `sitemap.ts` directly in `app/` (outside `[locale]`). Generate all locale URLs in the single sitemap.
**Warning signs:** Google Search Console warning about missing sitemap. Crawlers not finding sitemap at expected URL.

### Pitfall 3: JSON-LD duplicated on client-side hydration

**What goes wrong:** If JSON-LD components are rendered in client components, React hydration may duplicate the `<script>` tags.
**Why it happens:** Server renders the script, then client re-renders it during hydration.
**How to avoid:** Keep all JSON-LD components as Server Components (no "use client"). They render static data and need no interactivity.
**Warning signs:** Rich Results Test showing duplicate schema entries. Console warnings about duplicate elements.

### Pitfall 4: Missing dateModified in JSON-LD

**What goes wrong:** SCHEMA-08 requires `dateModified` on all pages. If forgotten, structured data validation fails and content freshness signals are missing.
**Why it happens:** Easy to add the schema type but forget the date field.
**How to avoid:** Create a central `PAGE_DATES` config object in `lib/seo-config.ts` with last-modified dates for each page. All JSON-LD components read from this config. Update dates when page content changes.
**Warning signs:** Schema Markup Validator warnings about missing `dateModified`.

### Pitfall 5: Route groups breaking page URLs

**What goes wrong:** Route groups `(services)`, `(marketing)`, `(legal)` are for organization only and should NOT appear in URLs. But if incorrectly configured, pages may render at wrong paths.
**Why it happens:** Confusion between route groups (parenthesized, invisible in URL) and regular route segments.
**How to avoid:** Route group folders use parentheses: `(services)/automations/page.tsx` renders at `/en/automations`, not `/en/services/automations`. Test each page URL after setup.
**Warning signs:** 404 errors on expected URLs. Pages accessible at unexpected paths.

### Pitfall 6: Interactive components blocking Server Component pages

**What goes wrong:** Pages import components that use `useState`, `useEffect`, `framer-motion`, or other client-only APIs. This forces the page to become a client component or causes build errors.
**Why it happens:** Existing Vite components freely use React hooks and animation libraries.
**How to avoid:** During migration, strip interactive features from page content. Create static versions of components first. Add interactivity back in Phase 3 as "use client" islands. For Phase 2, pages should render all their text content statically.
**Warning signs:** Build errors about client-only hooks in Server Components. "use client" creeping onto page.tsx files.

### Pitfall 7: Forgetting `setRequestLocale` causes build failures

**What goes wrong:** Pages work in development but fail during `next build` with "Unable to find locale" errors.
**Why it happens:** Development uses dynamic rendering (reads locale from request). Static generation has no request context.
**How to avoid:** Every page.tsx must call `setRequestLocale(locale)` before any translation access. This is the same pitfall from Phase 1 research but applies to all 10 new pages.
**Warning signs:** `next build` failures. Pages rendering in wrong locale.

## Code Examples

### Organization JSON-LD (Global, in Layout)

```typescript
// components/seo/OrganizationJsonLd.tsx
import type { Organization, WithContext } from 'schema-dts';
import { JsonLd } from './JsonLd';

export function OrganizationJsonLd() {
  const data: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Future Marketing AI',
    url: 'https://futuremarketingai.com',
    logo: 'https://futuremarketingai.com/logo.png',
    description: 'AI-powered automation, chatbots, and voice agents for growth teams.',
    sameAs: [
      'https://www.linkedin.com/company/futuremarketingai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'info@futuremarketingai.com',
    },
  };

  return <JsonLd data={data} />;
}
```

### WebSite JSON-LD (Homepage Only)

```typescript
// components/seo/WebSiteJsonLd.tsx
import type { WebSite, WithContext } from 'schema-dts';
import { JsonLd } from './JsonLd';

const SITE_URL = 'https://futuremarketingai.com';

export function WebSiteJsonLd() {
  const data: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Future Marketing AI',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as any,
  };

  return <JsonLd data={data} />;
}
```

### Service JSON-LD (Service Pages)

```typescript
// components/seo/ServiceJsonLd.tsx
import type { Service, WithContext } from 'schema-dts';
import { JsonLd } from './JsonLd';
import { PAGE_DATES, SITE_URL } from '@/lib/seo-config';

interface ServiceJsonLdProps {
  name: string;
  description: string;
  serviceType: string;
  locale: string;
  path: string;
}

export function ServiceJsonLd({ name, description, serviceType, locale, path }: ServiceJsonLdProps) {
  const data: WithContext<Service> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: 'Future Marketing AI',
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'GeoShape',
      name: 'Worldwide',
    },
    url: `${SITE_URL}/${locale}${path}`,
    dateModified: PAGE_DATES[path] || new Date().toISOString(),
  };

  return <JsonLd data={data} />;
}
```

### BreadcrumbList JSON-LD

```typescript
// components/seo/BreadcrumbJsonLd.tsx
import type { BreadcrumbList, WithContext } from 'schema-dts';
import { JsonLd } from './JsonLd';
import { SITE_URL } from '@/lib/seo-config';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
  locale: string;
}

export function BreadcrumbJsonLd({ items, locale }: BreadcrumbJsonLdProps) {
  const data: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path === '/' ? '' : item.path}`,
    })),
  };

  return <JsonLd data={data} />;
}
```

### Per-page generateMetadata Usage

```typescript
// app/[locale]/(services)/automations/page.tsx (metadata section only)
import { generatePageMetadata } from '@/lib/metadata'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    locale,
    namespace: 'automations',
    path: '/automations',
  })
}
```

### next/image Migration Pattern

```typescript
// Before (Vite -- ProductMedia component):
<ProductMedia type="image" src="/images/automation-dashboard.png" alt="Dashboard" />

// After (Next.js -- next/image):
import Image from 'next/image';

<Image
  src="/images/automation-dashboard.png"
  alt="AI automation dashboard showing workflow builder"
  width={800}
  height={450}
  className="rounded-card"
  priority={false}  // true only for above-fold images
/>
```

For responsive images without known dimensions, use `fill`:

```typescript
<div className="relative aspect-video">
  <Image
    src="/images/hero-visual.png"
    alt="Future Marketing AI platform overview"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover rounded-card"
    priority  // above-fold hero image
  />
</div>
```

## State of the Art

| Old Approach (Vite SPA)                       | Current Approach (Next.js 16)                                    | Impact                                                     |
| --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| react-helmet-async `<Helmet>` for meta tags   | `generateMetadata` / `metadata` export                           | Zero client JS, automatic deduplication, streaming support |
| Custom `StructuredData` component with Helmet | Inline `<script type="application/ld+json">` in Server Component | No library needed, renders in SSR HTML                     |
| No sitemap (SPA invisible to crawlers)        | `app/sitemap.ts` with `MetadataRoute.Sitemap`                    | Auto-cached, locale alternates built-in                    |
| No robots.txt                                 | `app/robots.ts` with `MetadataRoute.Robots`                      | Type-safe, programmatic rules                              |
| `<img>` tags with no optimization             | `next/image` with automatic WebP/AVIF                            | Lazy loading, blur placeholder, CLS prevention             |
| No hreflang (SPA)                             | `metadata.alternates.languages`                                  | Automatic `<link>` tag generation per locale               |
| Client-side page rendering                    | Server-side rendering + static generation                        | Full indexability by search engines and AI crawlers        |

## Open Questions

1. **Image asset inventory**
   - What we know: Existing pages use `ProductMedia` for a few images (Automations, Voice Agents, Marketing Machine pages). The site is mostly text + icons + CSS visuals.
   - What is unclear: Exact list of image files that need migrating and their dimensions for next/image `width`/`height` props.
   - Recommendation: During implementation, audit `/public/images/` directory. For each image, record dimensions. If images are generated/placeholder, set standard dimensions (e.g., 800x450 for feature images).

2. **SEO copy rework scope (PAGE-11)**
   - What we know: Existing translation files contain copy. SEO-optimized copy means unique, descriptive meta titles/descriptions per page per locale.
   - What is unclear: Whether the existing copy in translation files is already SEO-quality or needs rewriting.
   - Recommendation: Focus meta.title and meta.description keys on SEO best practices (60 chars title, 155 chars description, include primary keyword). Leave body copy changes for content strategy review. Add `meta.title` and `meta.description` keys to each page namespace in all 3 locale files.

3. **Route group vs flat structure**
   - What we know: Phase 1 research proposed route groups `(services)`, `(marketing)`, `(legal)` for organization.
   - What is unclear: Whether these add value for only 10 pages, or if a flat structure under `[locale]` is simpler.
   - Recommendation: Use route groups. They allow shared layouts per group (e.g., service pages could share a layout with consistent CTA). No URL impact. Good for future scalability.

## Sources

### Primary (HIGH confidence)

- [Next.js 16 JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- Official `<script type="application/ld+json">` pattern with schema-dts typing
- [Next.js 16 Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- `generateMetadata`, static metadata, streaming metadata behavior
- [Next.js 16 generateMetadata Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- Full `Metadata` type including `alternates`
- [Next.js 16 sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) -- `MetadataRoute.Sitemap` with `alternates.languages` for hreflang
- [Next.js 16 robots.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) -- `MetadataRoute.Robots` with per-user-agent rules
- [Next.js 16 not-found.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/not-found) -- Custom 404 with automatic HTTP 404 status
- [Next.js 16 Image Component](https://nextjs.org/docs/app/api-reference/components/image) -- `width`/`height`, `fill`, `priority`, `sizes` props
- [next-intl Metadata & Route Handlers](https://next-intl.dev/docs/environments/actions-metadata-route-handlers) -- `getTranslations({locale})` in `generateMetadata`

### Secondary (MEDIUM confidence)

- [Anthropic Claude Bots robots.txt Strategy](https://almcorp.com/blog/anthropic-claude-bots-robots-txt-strategy/) -- ClaudeBot vs Claude-SearchBot distinction for allow/block
- [robots.txt Strategy 2026: Managing AI Crawlers](https://witscode.com/blogs/robots-txt-strategy-2026-managing-ai-crawlers/) -- Training vs retrieval bot separation best practice
- [Next.js 16 SEO Configuration Guide](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16) -- Practical metadata patterns
- [Next.js Canonical and Hreflang Guide](https://www.buildwithmatija.com/blog/nextjs-advanced-seo-multilingual-canonical-tags) -- Multilingual canonical/hreflang implementation

### Existing Codebase (HIGH confidence for migration reference)

- `src/components/seo/SEOHead.tsx` -- Existing meta tag patterns, SEO presets per page
- `src/components/seo/StructuredData.tsx` -- Existing JSON-LD patterns: Organization, WebSite, Service, FAQ, Breadcrumb
- `src/pages/*.tsx` -- 10 page files totalling 2,928 lines, all with react-helmet + structured data
- `src/components/common/` -- 30+ shared UI components to migrate: FloatingNav, Footer, GlassCard, CTAButton, etc.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- Phase 1 stack confirmed, no new dependencies, all APIs verified against Next.js 16.1.7 official docs
- Architecture: HIGH -- metadata generator, JSON-LD component, sitemap/robots patterns all from official Next.js documentation (March 2026)
- Pitfalls: HIGH -- streaming metadata, sitemap placement, JSON-LD hydration duplication all verified against official docs and community reports
- AI crawler policy: MEDIUM -- bot user-agent strings and blocking strategy sourced from multiple 2026 articles, but AI crawler landscape changes quarterly

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (30 days -- stable technologies, low churn risk except AI crawler user-agents)
