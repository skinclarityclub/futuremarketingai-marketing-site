# Stack Research: Next.js Migration for SEO/GEO/LLMEO

**Domain:** B2B demo/showcase website migration (Vite SPA to Next.js SSR/SSG)
**Researched:** 2026-03-18
**Confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology   | Version | Purpose                                 | Why Recommended                                                                                                                                                                                                                                                          |
| ------------ | ------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Next.js      | 16.1.x  | Full-stack React framework with SSR/SSG | Current stable (16.1.7 as of March 2026). Turbopack stable by default for dev and build. React 19.2 with View Transitions, React Compiler support. Proxy (renamed from middleware) runs on Node.js. Built-in Metadata API eliminates need for third-party SEO libraries. |
| React        | 19.2    | UI library                              | Ships with Next.js 16. Includes View Transitions for page animations (replaces some Framer Motion needs), useEffectEvent, Activity component. React Compiler stable (auto-memoization).                                                                                  |
| TypeScript   | 5.7+    | Type safety                             | Minimum 5.1 required by Next.js 16. Use latest 5.x for best inference. Pair with `next typegen` for auto-generated route types.                                                                                                                                          |
| Tailwind CSS | 4.x     | Utility-first CSS                       | CSS-first configuration (no more tailwind.config.js). Rust-powered Oxide engine: 5x faster full builds, 100x faster incremental. Uses `@import 'tailwindcss'` and `@theme` directive. Automatic content detection (no glob config).                                      |

**Confidence:** HIGH -- verified via Next.js 16 upgrade guide (nextjs.org/docs/app/guides/upgrading/version-16), Tailwind CSS v4 docs

### i18n

| Technology | Version | Purpose              | Why Recommended                                                                                                                                                                                                                                                                                                         |
| ---------- | ------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| next-intl  | 4.8.x   | Internationalization | The standard for Next.js App Router i18n. Native Server Component support via `getTranslations()`. ~2KB bundle. Locale-prefixed URL routing built-in (`/en/`, `/nl/`, `/es/`). Replaces i18next + react-i18next + i18next-browser-languagedetector (3 packages with 1). next-i18next is NOT compatible with App Router. |

**Confidence:** HIGH -- next-intl is the clear winner for App Router projects per multiple sources and npm trends

**Migration note:** The existing site uses i18next with JSON translation files. next-intl uses the same ICU MessageFormat and can consume the same JSON structure. Translation files migrate with minimal reformatting. The `useTranslation()` hook becomes `useTranslations()` (nearly identical API).

### AI/Chatbot

| Technology        | Version | Purpose                         | Why Recommended                                                                                                                                                       |
| ----------------- | ------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ai (AI SDK)       | 6.x     | Chatbot streaming, tool calling | Already in use (v6.0.116+). Provides `streamText`, `useChat`, tool execution. Works with Next.js Route Handlers for streaming. Provider-agnostic (Anthropic, OpenAI). |
| @ai-sdk/anthropic | 3.x     | Anthropic provider              | Already in use. Claude integration for chatbot backend.                                                                                                               |
| @ai-sdk/react     | 3.x     | React hooks for AI              | Already in use. `useChat` hook for streaming UI.                                                                                                                      |

**Confidence:** HIGH -- already proven in existing codebase, AI SDK 6 is current

### Animation

| Technology | Version | Purpose                              | Why Recommended                                                                                                                                                                                                                                                                |
| ---------- | ------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| motion     | 12.36.x | Page transitions, micro-interactions | Renamed from framer-motion. Import from `motion/react` instead of `framer-motion`. Same API. All motion components require `'use client'` directive in Next.js App Router (client-only). Create wrapper components in `components/motion/` for clean Server Component interop. |

**Confidence:** HIGH -- verified on npm (12.36.0, published days ago), motion.dev upgrade guide

**Migration pattern:** Create thin client wrappers:

```typescript
// components/motion/MotionDiv.tsx
'use client'
export { motion } from 'motion/react'
```

Server Components import these wrappers. Animation logic stays in Client Components.

### State Management

| Technology | Version | Purpose                                | Why Recommended                                                                                                                                                                                                                           |
| ---------- | ------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zustand    | 5.0.x   | Client-side state (chatbot, demo mode) | Already in use (v5.0.8). Lightweight, no boilerplate. Works exclusively in Client Components (`'use client'`). Stores go in `lib/stores/` outside app directory. No server-side state -- Zustand is for interactive client features only. |

**Confidence:** HIGH -- Zustand 5.0.12 is current, well-documented App Router patterns

### SEO/Structured Data

| Technology           | Version  | Purpose                              | Why Recommended                                                                                                                                                                         |
| -------------------- | -------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js Metadata API | built-in | Meta tags, Open Graph, Twitter cards | Built into Next.js 16. Export `metadata` or `generateMetadata()` from any page/layout. No third-party library needed. Replaces react-helmet-async entirely.                             |
| schema-dts           | 1.1.x    | TypeScript types for JSON-LD         | Google-maintained. 100K+ weekly npm downloads. Type-safe Schema.org structured data. Zero runtime cost (types only). Use with `WithContext<Organization>`, `WithContext<Article>`, etc. |
| Next.js sitemap.xml  | built-in | Sitemap generation                   | Built-in `app/sitemap.ts` convention. Export default function returning URL array. For this site's scale (~20 pages + blog), built-in is sufficient. No need for next-sitemap.          |
| Next.js robots.txt   | built-in | Crawler directives                   | Built-in `app/robots.ts` convention.                                                                                                                                                    |

**Confidence:** HIGH -- Next.js Metadata API is the documented standard, schema-dts verified on npm/GitHub

### Content/Blog

| Technology | Version | Purpose                      | Why Recommended                                                                                                                                                                                                                     |
| ---------- | ------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Velite     | 0.2.x   | MDX content processing       | Actively maintained (Contentlayer is abandoned since Stackbit acquisition by Netlify). Zod-based schema validation. Generates TypeScript types from frontmatter. Copies static assets to public/. Works with Next.js 16 App Router. |
| MDX        | 3.x     | Rich content with components | Allows JSX in markdown -- embed interactive demos, charts, CTAs in blog posts. Next.js has built-in MDX support via `@next/mdx`.                                                                                                    |
| remark-gfm | 4.x     | GitHub Flavored Markdown     | Already in use. Tables, task lists, strikethrough in blog content.                                                                                                                                                                  |

**Confidence:** MEDIUM -- Velite is the best current option but version is pre-1.0. If blog is deferred, revisit content tooling later.

### Monitoring/Analytics

| Technology             | Version | Purpose                     | Why Recommended                                                                                                                                                                                      |
| ---------------------- | ------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @sentry/nextjs         | 10.x    | Error tracking, performance | Already in use (@sentry/react). Switch to @sentry/nextjs for App Router auto-instrumentation, Server Component error capture, Route Handler monitoring. Sentry 10.43.0 confirmed Next.js 16 support. |
| @vercel/analytics      | latest  | Web analytics               | Free tier on Vercel. Core Web Vitals tracking built-in. No config needed on Vercel deployment.                                                                                                       |
| @vercel/speed-insights | latest  | Performance monitoring      | Real-user Core Web Vitals data. Critical for tracking LCP, FID, CLS targets.                                                                                                                         |

**Confidence:** HIGH for Sentry (verified docs), MEDIUM for Vercel analytics (standard Vercel stack)

### GEO/LLMEO Optimization

| Technology       | Version | Purpose                        | Why Recommended                                                                                                                                                                                                                           |
| ---------------- | ------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSON-LD (manual) | n/a     | Structured data for AI engines | Render `<script type="application/ld+json">` in Server Components. FAQ schema delivers 28% citation lift in AI search. Organization, Service, Article, FAQPage, HowTo, BreadcrumbList schemas. Use schema-dts for type safety.            |
| llms.txt         | n/a     | AI crawler content map         | Plain-text Markdown file at site root. Low adoption (951 domains as of mid-2025) but zero cost to implement and forward-looking. Google's John Mueller says AI crawlers don't check it yet -- but it costs nothing and may gain traction. |

**Confidence:** HIGH for JSON-LD (proven impact), LOW for llms.txt (speculative but free)

**GEO content strategy (not a library, but critical):**

- Direct answers in first 40-60 words of each page
- Statistics/facts every 150-200 words
- Cite authoritative sources throughout content
- Consistent brand entity across site, LinkedIn, Google Business Profile
- FAQ sections on every service page (FAQPage schema)

### Development Tools

| Tool                    | Purpose           | Notes                                                                                                                              |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Turbopack               | Dev/build bundler | Default in Next.js 16. No flag needed. Enable `experimental.turbopackFileSystemCacheForDev` for faster restarts.                   |
| ESLint 9+ (flat config) | Linting           | Next.js 16 removes `next lint`. Use ESLint CLI directly with `@next/eslint-plugin-next`. Flat config format.                       |
| Prettier                | Code formatting   | Keep existing config.                                                                                                              |
| Playwright              | E2E testing       | Already in use. Works with Next.js dev server.                                                                                     |
| Vitest                  | Unit testing      | Already in use. Compatible with Next.js via @vitejs/plugin-react.                                                                  |
| Husky + lint-staged     | Git hooks         | Already in use. Keep existing setup.                                                                                               |
| React Compiler          | Auto-memoization  | Enable with `reactCompiler: true` in next.config.ts. Install `babel-plugin-react-compiler`. Eliminates manual useMemo/useCallback. |

**Confidence:** HIGH -- verified in Next.js 16 docs

## What NOT to Use

| Avoid                            | Why                                                                                | Use Instead                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| next-seo                         | Redundant with Next.js Metadata API. Mixing them causes conflicts.                 | Built-in `metadata` / `generateMetadata()` exports             |
| react-helmet-async               | Client-side head management. Unnecessary with SSR metadata.                        | Built-in Metadata API                                          |
| next-i18next                     | NOT compatible with App Router. Tied to Pages Router.                              | next-intl                                                      |
| i18next + react-i18next          | 3 packages for what next-intl does in 1. No native Server Component support.       | next-intl                                                      |
| i18next-browser-languagedetector | Client-side locale detection. next-intl handles this via proxy/headers.            | next-intl locale detection                                     |
| react-router-dom                 | Not needed. Next.js has file-based routing.                                        | Next.js App Router                                             |
| framer-motion (package)          | Renamed to `motion`. Old package still works but new projects should use new name. | `motion` package, import from `motion/react`                   |
| Contentlayer                     | Abandoned/unmaintained since Stackbit acquisition.                                 | Velite                                                         |
| next-sitemap                     | Overkill for ~20 pages + blog. Built-in sitemap.ts handles this.                   | Next.js built-in sitemap convention                            |
| vite-plugin-sitemap              | Vite-specific. Not applicable to Next.js.                                          | Next.js built-in sitemap                                       |
| react-ga4                        | Direct GA integration. Vercel Analytics provides better DX on Vercel.              | @vercel/analytics + Google Analytics via next/script if needed |
| @sentry/react                    | Generic React SDK. Missing Next.js-specific instrumentation.                       | @sentry/nextjs                                                 |
| Webpack                          | Turbopack is default in Next.js 16. Webpack is opt-in fallback only.               | Turbopack (default)                                            |
| tailwind.config.js               | Tailwind CSS 4 uses CSS-first config. JS config is legacy (compat layer exists).   | `@theme` directive in CSS                                      |

## Libraries to Keep As-Is

These carry over from the existing Vite project without changes:

| Library              | Version | Notes                                            |
| -------------------- | ------- | ------------------------------------------------ |
| zod                  | 4.x     | Schema validation. Used by AI SDK and Velite.    |
| lucide-react         | 0.545+  | Icon library. Framework-agnostic.                |
| tailwind-merge       | 3.x     | Class merging utility. Works with Tailwind 4.    |
| react-calendly       | 4.x     | Calendly modal integration. Client Component.    |
| react-cookie-consent | 9.x     | GDPR cookie banner. Client Component.            |
| react-markdown       | 10.x    | Markdown rendering in chatbot. Client Component. |
| recharts             | 3.x     | Charts in demo/playground. Client Component.     |
| @headlessui/react    | 2.x     | Accessible UI primitives. Client Component.      |

## Libraries to Drop

| Library                                       | Why                                                                                                         |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| @react-three/fiber, @react-three/drei, three  | Heavy 3D dependencies. Evaluate if 3D visuals are used. If only for one animation, replace with CSS/motion. |
| @splinetool/react-spline, @splinetool/runtime | Spline 3D tool. Same evaluation as Three.js -- heavy for a marketing site.                                  |
| gsap                                          | Redundant with motion (Framer Motion). Consolidate to one animation library.                                |
| html2canvas, jspdf                            | PDF generation. Likely chatbot feature -- keep only if actively used.                                       |
| d3, @types/d3                                 | Heavy charting library. Recharts already covers charts. Keep only if D3-specific visuals exist.             |
| react-icons                                   | Redundant with lucide-react. Pick one icon library.                                                         |
| react-use                                     | Utility hooks collection. Replace with direct implementations or React 19 built-ins.                        |
| react-is                                      | React internal utility. Likely unused directly.                                                             |
| @vapi-ai/web                                  | Vapi voice agent. Already migrated to ElevenLabs per git history.                                           |

## Version Compatibility Matrix

| Package             | Compatible With            | Notes                                                                                    |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------- |
| next@16.1.x         | react@19.2, react-dom@19.2 | Must upgrade together. React 18 not supported.                                           |
| next@16.1.x         | Node.js 20.9+              | Node 18 dropped. Use Node 22 LTS for best performance.                                   |
| next-intl@4.8.x     | next@16.x                  | Confirmed compatible. `use cache` has known limitations (getTranslations reads headers). |
| motion@12.36.x      | react@19.2                 | Fully compatible. Import from `motion/react`.                                            |
| zustand@5.0.x       | react@19.2                 | Compatible. Client Components only.                                                      |
| ai@6.0.x            | next@16.x                  | Compatible. Route Handlers for streaming.                                                |
| @sentry/nextjs@10.x | next@16.x                  | Confirmed support. Use withSentryConfig in next.config.ts.                               |
| tailwindcss@4.x     | next@16.x                  | Use @tailwindcss/postcss plugin.                                                         |
| schema-dts@1.1.x    | typescript@5.x             | Types-only package. No runtime dependency.                                               |
| velite@0.2.x        | next@16.x                  | Build-time content processing. Framework-independent.                                    |

## Installation

```bash
# Core framework
npm install next@latest react@latest react-dom@latest

# i18n
npm install next-intl

# AI/Chatbot (carry over)
npm install ai @ai-sdk/anthropic @ai-sdk/react

# Animation
npm install motion

# State management (carry over)
npm install zustand

# Structured data types
npm install --save-dev schema-dts

# Content/Blog
npm install velite remark-gfm

# Monitoring
npm install @sentry/nextjs @vercel/analytics @vercel/speed-insights

# UI libraries (carry over)
npm install lucide-react tailwind-merge react-calendly react-cookie-consent
npm install react-markdown recharts @headlessui/react zod

# Styling
npm install --save-dev tailwindcss @tailwindcss/postcss postcss

# Dev tools
npm install --save-dev typescript @types/react @types/react-dom
npm install --save-dev eslint @next/eslint-plugin-next
npm install --save-dev babel-plugin-react-compiler
npm install --save-dev prettier husky lint-staged
npm install --save-dev playwright @playwright/test vitest
```

## Tailwind CSS 4 Configuration

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --color-background: #050814;
  --color-surface: #0a0e27;
  --color-primary: #00d4ff;
  --color-secondary: #a855f7;
  --color-success: #00ff88;
  --font-sans: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Next.js 16 Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Add external image domains as needed
    ],
  },
}

export default withNextIntl(nextConfig)
```

## Sources

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- HIGH confidence, official docs (version 16.1.7, updated 2026-03-16)
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16) -- HIGH confidence, official announcement
- [Next.js 16.1 Blog Post](https://nextjs.org/blog/next-16-1) -- HIGH confidence, official
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) -- HIGH confidence, official docs
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- HIGH confidence, official docs
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- HIGH confidence, official
- [Tailwind CSS Next.js Install Guide](https://tailwindcss.com/docs/guides/nextjs) -- HIGH confidence, official
- [next-intl App Router Docs](https://next-intl.dev/docs/getting-started/app-router) -- HIGH confidence, official library docs
- [next-intl GitHub Releases](https://github.com/amannn/next-intl/releases) -- HIGH confidence, v4.8.3 confirmed
- [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) -- HIGH confidence, official
- [AI SDK Docs](https://ai-sdk.dev/docs/introduction) -- HIGH confidence, official
- [AI SDK 6 Announcement](https://vercel.com/blog/ai-sdk-6) -- HIGH confidence, official
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/) -- HIGH confidence, official
- [schema-dts GitHub](https://github.com/google/schema-dts) -- HIGH confidence, Google-maintained
- [Velite Introduction](https://velite.js.org/guide/introduction) -- MEDIUM confidence, active but pre-1.0
- [Zustand npm](https://www.npmjs.com/package/zustand) -- HIGH confidence, v5.0.12 confirmed
- [GEO Schema Markup Impact](https://relixir.ai/blog/schema-markup-boost-geo-performance-2025-data) -- MEDIUM confidence, single study
- [LLMEO Strategies 2026](https://searchengineland.com/llm-optimization-tracking-visibility-ai-discovery-463860) -- MEDIUM confidence, industry analysis
- [llms.txt Proposal](https://searchengineland.com/llms-txt-proposed-standard-453676) -- LOW confidence, speculative standard

---

_Stack research for: FMai Website Next.js Migration (SEO/GEO/LLMEO)_
_Researched: 2026-03-18_
