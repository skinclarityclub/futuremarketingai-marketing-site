# Phase 1: Foundation and Infrastructure - Research

**Researched:** 2026-03-18
**Domain:** Next.js 16 App Router scaffold, i18n routing (next-intl), Tailwind CSS 4 design system, Zustand hydration, server/client boundary patterns
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundation that every subsequent phase builds on: a Next.js 16 App Router project with locale-prefixed routing via next-intl, Tailwind CSS 4 with the Living System design tokens, next/font for zero-CLS typography, and hydration-safe Zustand stores. This phase creates a NEW repository -- the existing Vite codebase at `C:\Users\daley\Desktop\Futuremarketingai` serves as reference only.

The three critical deliverables are: (1) locale-routed pages that SSR correctly in EN/NL/ES, (2) a Tailwind v4 configuration with all Living System tokens producing identical visuals to the Vite site, and (3) a documented server/client boundary pattern with a working example preventing the "use client" overuse anti-pattern. Getting any of these wrong means rework on everything built afterward.

**Primary recommendation:** Scaffold with `create-next-app@latest`, configure next-intl routing with `proxy.ts` (renamed from `middleware.ts` in Next.js 16), migrate all 23 translation namespace files into per-locale merged JSON, set up Tailwind v4 with `@theme` directive for design tokens, and establish the server page shell + client island pattern before writing any component code.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                               | Research Support                                                                                                                                                                |
| ------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO-01 | All pages server-rendered via Next.js App Router (SSR/SSG)                | Next.js 16 scaffold with App Router, `[locale]` dynamic segment, `generateStaticParams` for static generation. Patterns documented in Architecture Patterns section.            |
| SEO-03 | Locale-prefixed URL routing (/en/, /nl/, /es/) with next-intl             | next-intl 4.8 with `defineRouting`, `proxy.ts` for locale detection/redirect, `[locale]` segment. Full setup documented in Architecture Patterns.                               |
| SEO-09 | Typography via next/font (DM Sans, JetBrains Mono) with zero layout shift | `next/font/google` with CSS variables, integrated with Tailwind v4 `@theme` via `--font-sans` and `--font-mono`. Documented in Code Examples.                                   |
| INT-06 | Zustand stores migrated with hydration-safe patterns                      | `skipHydration: true` + `onRehydrateStorage` callback pattern for 3 persist stores. Documented in Architecture Patterns and Common Pitfalls.                                    |
| INT-07 | i18next to next-intl translation migration (EN/NL/ES, all namespaces)     | 23 namespace files per locale merged into single `messages/{locale}.json`. Migration script approach documented. API change: `useTranslation('ns')` to `useTranslations('ns')`. |

</phase_requirements>

## Standard Stack

### Core

| Library      | Version | Purpose                                  | Why Standard                                                                                                                                                      |
| ------------ | ------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js      | 16.1.x  | Full-stack React framework with SSR/SSG  | Current stable. Turbopack default. React 19.2. Built-in Metadata API, sitemap, robots.txt.                                                                        |
| React        | 19.2    | UI library                               | Ships with Next.js 16. React Compiler stable.                                                                                                                     |
| TypeScript   | 5.7+    | Type safety                              | Minimum 5.1 required by Next.js 16. Use `next typegen` for auto-generated route types.                                                                            |
| next-intl    | 4.8.x   | i18n with locale-prefixed routing        | Purpose-built for App Router. Server Component support via `getTranslations()`. ~2KB bundle. Replaces i18next + react-i18next + i18next-browser-languagedetector. |
| Tailwind CSS | 4.x     | Utility-first CSS with design tokens     | CSS-first config via `@theme` directive. Rust-powered Oxide engine. Automatic content detection.                                                                  |
| Zustand      | 5.0.x   | Client-side state (chatbot, preferences) | Already in use (v5.0.8+). Lightweight. Client Components only.                                                                                                    |

### Supporting

| Library              | Version | Purpose                        | When to Use                                                                                   |
| -------------------- | ------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| @tailwindcss/postcss | 4.x     | PostCSS plugin for Tailwind v4 | Required for Next.js integration with Tailwind v4                                             |
| postcss              | latest  | CSS processing                 | Required by Tailwind v4                                                                       |
| schema-dts           | 1.1.x   | TypeScript types for JSON-LD   | Type-safe structured data. Zero runtime cost. Used starting Phase 2 but installed in Phase 1. |
| tailwind-merge       | 3.x     | Class merging utility          | Carry over from existing project. Works with Tailwind 4.                                      |

### Dev Tools

| Tool                        | Version  | Purpose                                                                                    |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| ESLint 9+ (flat config)     | latest   | Linting. Next.js 16 removes `next lint` -- use ESLint CLI with `@next/eslint-plugin-next`. |
| Prettier                    | existing | Code formatting. Keep existing config.                                                     |
| babel-plugin-react-compiler | latest   | Enable React Compiler via `reactCompiler: true` in next.config.ts.                         |

**Installation (Phase 1 only):**

```bash
# Scaffold
npx create-next-app@latest fmai-nextjs --typescript --tailwind --eslint --app --src-dir

# i18n
npm install next-intl

# State management (carry over)
npm install zustand

# Styling (if not included by create-next-app)
npm install --save-dev tailwindcss @tailwindcss/postcss postcss

# Utility
npm install tailwind-merge

# Dev tools
npm install --save-dev @next/eslint-plugin-next babel-plugin-react-compiler
npm install --save-dev schema-dts
```

## Architecture Patterns

### Project Structure (Phase 1 scope)

```
fmai-nextjs/
  app/
    [locale]/                    # i18n dynamic segment (en|nl|es)
      layout.tsx                 # Root layout: fonts, providers, locale setup
      page.tsx                   # Homepage placeholder (Server Component)
      (marketing)/               # Route group stub for marketing pages
      (services)/                # Route group stub for service pages
      (legal)/                   # Route group stub for legal pages
    api/                         # Route Handlers (Phase 3)
  components/
    providers/
      StoreProvider.tsx          # Zustand hydration-safe wrapper
      Providers.tsx              # Combined provider tree
    examples/
      ServerClientExample.tsx    # Documented boundary pattern example
  i18n/
    routing.ts                   # next-intl routing config
    request.ts                   # next-intl request config
    navigation.ts                # Locale-aware Link, redirect, useRouter
  lib/
    metadata.ts                  # Shared metadata generator utility
  stores/
    chatbotStore.ts              # Migrated with skipHydration
    userPreferencesStore.ts      # Migrated with skipHydration
    personalizationStore.ts      # Migrated with skipHydration
  messages/
    en.json                      # Merged from 23 namespace files
    nl.json                      # Merged from 23 namespace files
    es.json                      # Merged from 23 namespace files
  proxy.ts                       # next-intl locale middleware (renamed from middleware.ts in Next.js 16)
  next.config.ts                 # Next.js config with next-intl plugin
  postcss.config.mjs             # PostCSS with @tailwindcss/postcss
  app/globals.css                # Tailwind v4 @import + @theme tokens
```

### Pattern 1: Next.js 16 proxy.ts (formerly middleware.ts)

**What:** Next.js 16 renamed `middleware.ts` to `proxy.ts`. The next-intl middleware runs as the proxy, handling locale detection, redirects, and URL rewriting.
**Confidence:** HIGH (verified via next-intl official docs, March 2026)

```typescript
// proxy.ts (at project root)
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
```

### Pattern 2: next-intl Routing Configuration

**What:** Central routing config defines supported locales and default. Used by proxy.ts and navigation helpers.
**Confidence:** HIGH (next-intl official docs)

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nl', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always', // /en/pricing, /nl/pricing, /es/pricing
})
```

```typescript
// i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

```typescript
// i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

### Pattern 3: Root Layout with Providers

**What:** Server Component layout loads translations, sets up fonts, wraps children with NextIntlClientProvider and StoreProvider.
**Confidence:** HIGH (next-intl docs + Zustand patterns)

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { dmSans, jetbrainsMono } from '@/lib/fonts';
import { StoreProvider } from '@/components/providers/StoreProvider';
import '@/app/globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-deep text-text-primary font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            {children}
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Pattern 4: Server Page Shell with Client Island

**What:** Every page.tsx is a Server Component. Interactive parts are separate "use client" files.
**Confidence:** HIGH (official Next.js architecture)

```typescript
// app/[locale]/page.tsx (Server Component -- NO "use client")
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hero');

  return (
    <main>
      {/* Server-rendered SEO content */}
      <h1>{t('headline')}</h1>
      <p>{t('subheadline')}</p>
      {/* Client island imported here in later phases */}
    </main>
  );
}
```

### Pattern 5: Zustand Store with Hydration-Safe Persist

**What:** All 3 persist stores use `skipHydration: true` and rehydrate in a client-side `useEffect` to prevent server/client mismatches.
**Confidence:** HIGH (verified Zustand 5 + Next.js pattern)

```typescript
// stores/chatbotStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatbotState {
  isOpen: boolean
  sessionId: string
  // ... other fields
  open: () => void
  close: () => void
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      isOpen: false,
      sessionId: '',
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: 'chatbot-store',
      skipHydration: true, // CRITICAL: prevent server/client mismatch
    }
  )
)
```

```typescript
// components/providers/StoreProvider.tsx
'use client';

import { useEffect } from 'react';
import { useChatbotStore } from '@/stores/chatbotStore';
import { useUserPreferencesStore } from '@/stores/userPreferencesStore';
import { usePersonalizationStore } from '@/stores/personalizationStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate all persist stores AFTER initial hydration
    useChatbotStore.persist.rehydrate();
    useUserPreferencesStore.persist.rehydrate();
    usePersonalizationStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
```

### Anti-Patterns to Avoid

- **"use client" on page.tsx or layout.tsx:** Defeats SSR entirely. Pages MUST be Server Components. Extract interactive parts to separate files.
- **Importing server-only code in client components:** Use `server-only` package to mark server modules. API keys and chatbot engine stay server-side.
- **Zustand store access in Server Components:** Stores are client-only singletons. Server Components fetch data and pass via props.
- **Using `middleware.ts`:** Next.js 16 renamed this to `proxy.ts`. The old name may not work.
- **Keeping i18next alongside next-intl:** Pick one. i18next does not work with Server Components.

## Don't Hand-Roll

| Problem                          | Don't Build                                                 | Use Instead                                     | Why                                                                                                                      |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Locale detection and routing     | Custom middleware with locale parsing                       | next-intl `createMiddleware` + `defineRouting`  | Handles Accept-Language negotiation, cookie persistence, URL rewriting, redirect loops                                   |
| Translation loading              | Custom JSON loader with namespace merging at runtime        | next-intl `getMessages()` / `getTranslations()` | Server-side message loading is zero client JS. Namespace filtering built-in.                                             |
| Font loading with CLS prevention | `@import url()` in CSS or manual preload links              | `next/font/google` with CSS variables           | Automatic subsetting, self-hosting, `font-display: swap`, zero layout shift                                              |
| CSS design token system          | Custom CSS variables file with manual utility classes       | Tailwind v4 `@theme` directive                  | `@theme` auto-generates utility classes (e.g., `--color-accent-system` creates `bg-accent-system`, `text-accent-system`) |
| Locale-aware navigation          | Custom Link component wrapping next/link with locale prefix | next-intl `createNavigation`                    | Handles locale prefix, active locale detection, type-safe pathnames                                                      |

## Common Pitfalls

### Pitfall 1: proxy.ts vs middleware.ts confusion

**What goes wrong:** Developer creates `middleware.ts` (the pre-Next.js 16 name). Next.js 16 ignores it or throws errors.
**Why it happens:** Most tutorials and examples online still reference `middleware.ts`. The rename to `proxy.ts` happened with Next.js 16.
**How to avoid:** Use `proxy.ts` at the project root. If using create-next-app, it may scaffold `middleware.ts` -- rename it immediately.
**Warning signs:** Locale detection not working. Requests hitting pages without locale prefix. No redirects happening.

### Pitfall 2: Zustand persist causing hydration errors

**What goes wrong:** Three stores (chatbotStore, userPreferencesStore, personalizationStore) use `persist` with localStorage. Server renders default state, client rehydrates with stored state -- mismatch crashes React.
**Why it happens:** localStorage does not exist on the server. Persist middleware tries to rehydrate immediately.
**How to avoid:** Set `skipHydration: true` in persist config. Call `persist.rehydrate()` inside `useEffect` in StoreProvider. This delays rehydration until after initial hydration completes.
**Warning signs:** "Text content does not match server-rendered HTML" errors. Store values flashing from default to stored state on page load.

### Pitfall 3: Translation file merge loses keys

**What goes wrong:** Merging 23 namespace files per locale into a single JSON loses nested keys, creates collisions, or breaks `t('namespace.key')` calls.
**Why it happens:** Namespace files may have overlapping top-level keys. Some files use flat keys, others use nested objects.
**How to avoid:** Use namespace names as top-level keys in the merged file. `common.json` becomes `{ "common": { ...contents } }`. Write a migration script that validates no key collisions and produces a diff report. Test all 3 locales.
**Warning signs:** Missing translation warnings in console. Blank text in rendered pages. Keys showing as raw strings.

### Pitfall 4: Tailwind v4 token mapping breaks visuals

**What goes wrong:** Living System design tokens (custom colors, fonts, shadows, gradients) do not render correctly after converting from `tailwind.config.js` to `@theme` directive.
**Why it happens:** Tailwind v4 has different naming conventions for CSS variables. Custom utilities like `bg-gradient-system` need manual conversion. `darkMode: 'class'` config changes.
**How to avoid:** Map tokens methodically: (1) colors first, (2) fonts, (3) shadows/glows, (4) animations. Render a reference component from the Vite site side-by-side with the Next.js version. If regressions are too many, use `@config "./tailwind.config.js"` as temporary bridge.
**Warning signs:** Colors appearing wrong. Custom shadow utilities not found. Gradient classes not applying.

### Pitfall 5: setRequestLocale() forgotten in pages

**What goes wrong:** Pages that don't call `setRequestLocale(locale)` before using translations will fail during static generation (`next build`).
**Why it happens:** next-intl needs the locale set explicitly for static rendering. Dynamic rendering reads it from headers, but static generation has no request context.
**How to avoid:** Add `setRequestLocale(locale)` as the first line in every `page.tsx` and `layout.tsx` that uses translations. Add `generateStaticParams` returning all locales.
**Warning signs:** Build errors mentioning "Unable to find `locale`". Pages working in dev but failing in production build.

## Code Examples

### next/font Setup with Tailwind v4

```typescript
// lib/fonts.ts
import { DM_Sans, JetBrains_Mono } from 'next/font/google'

export const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})
```

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  /* Typography -- references next/font CSS variables */
  --font-sans: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Space Grotesk', var(--font-dm-sans), sans-serif;
  --font-mono: var(--font-jetbrains-mono), Consolas, Monaco, monospace;

  /* Living System Colors */
  --color-bg-deep: #0a0d14;
  --color-bg-surface: #111520;
  --color-bg-elevated: #1a1f2e;

  --color-accent-system: #00d4aa;
  --color-accent-human: #f5a623;

  --color-status-active: #22c55e;
  --color-success: #22c55e;
  --color-warning: #f5a623;
  --color-error: #ef4444;
  --color-info: #00d4aa;

  --color-text-primary: #e8ecf4;
  --color-text-secondary: #9ba3b5;
  --color-text-muted: #5a6378;

  --color-border-primary: rgba(255, 255, 255, 0.06);
  --color-border-accent: rgba(0, 212, 170, 0.3);
  --color-divider: rgba(255, 255, 255, 0.04);

  /* Border Radius */
  --radius-card: 20px;
  --radius-btn: 14px;

  /* Shadows / Glows */
  --shadow-glow-sm: 0 0 10px rgba(0, 212, 170, 0.2);
  --shadow-glow: 0 0 20px rgba(0, 212, 170, 0.3);
  --shadow-glow-lg: 0 0 40px rgba(0, 212, 170, 0.4);
  --shadow-glow-amber: 0 0 20px rgba(245, 166, 35, 0.3);
  --shadow-glow-active: 0 0 20px rgba(34, 197, 94, 0.3);
  --shadow-inner-glow: inset 0 0 20px rgba(0, 212, 170, 0.15);
}

/* Custom animations -- Tailwind v4 @theme handles keyframes differently */
@keyframes glow-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@utility animate-glow-pulse {
  animation: glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@utility animate-float {
  animation: float 6s ease-in-out infinite;
}
```

### next.config.ts

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

### postcss.config.mjs

```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Translation Migration Script Approach

The existing site has 23 namespace files per locale:

```
public/locales/en/common.json      -> messages/en.json { "common": { ...contents } }
public/locales/en/hero.json         -> messages/en.json { "hero": { ...contents } }
public/locales/en/pricing.json      -> messages/en.json { "pricing": { ...contents } }
... (23 files per locale x 3 locales = 69 files -> 3 merged files)
```

The merged file structure preserves namespace access:

```json
{
  "common": { "cta": { "bookCall": "Book a Strategy Call" } },
  "hero": { "headline": "Your AI Marketing Team" },
  "pricing": { "title": "Pricing", "tiers": { ... } },
  "navigation": { "home": "Home", "about": "About" }
}
```

In components, `useTranslations('pricing')` accesses the `pricing` namespace -- same pattern as the existing `useTranslation('pricing')` from i18next. The API difference is minimal:

| i18next (current)                                | next-intl (target)                                   |
| ------------------------------------------------ | ---------------------------------------------------- |
| `import { useTranslation } from 'react-i18next'` | `import { useTranslations } from 'next-intl'`        |
| `const { t } = useTranslation('pricing')`        | `const t = useTranslations('pricing')`               |
| `t('title')`                                     | `t('title')` -- identical                            |
| Server: not available                            | Server: `const t = await getTranslations('pricing')` |

Total translation lines across EN locale: ~3,772 lines across 23 files. This is a mechanical merge, not a rewrite.

## State of the Art

| Old Approach                        | Current Approach                       | When Changed              | Impact                                                                |
| ----------------------------------- | -------------------------------------- | ------------------------- | --------------------------------------------------------------------- |
| middleware.ts                       | proxy.ts                               | Next.js 16 (2026)         | File must be renamed. Old name may not work.                          |
| tailwind.config.js                  | @theme in CSS                          | Tailwind CSS 4 (Jan 2025) | No more JS config. CSS-first. @config bridge available for migration. |
| i18next + react-i18next             | next-intl                              | App Router era (2024+)    | i18next has no Server Component support. next-intl is purpose-built.  |
| framer-motion package               | motion package                         | motion v11+ (2024)        | Import from `motion/react`. Old package still works but deprecated.   |
| Zustand persist auto-rehydrate      | skipHydration: true + manual rehydrate | SSR era                   | Required for any SSR framework. Was a non-issue in SPAs.              |
| @tailwind base/components/utilities | @import 'tailwindcss'                  | Tailwind v4               | Single import replaces three directives.                              |

## Open Questions

1. **Space Grotesk font**
   - What we know: tailwind.config.js lists `Space Grotesk` as a display font family alongside DM Sans
   - What is unclear: Whether Space Grotesk is actually used in any component, or was just defined as available
   - Recommendation: Grep the Vite codebase for `font-display` class usage. If used, add it to `next/font` setup. If not, omit.

2. **Custom Tailwind animations in v4**
   - What we know: The existing config defines 7 custom keyframe animations (glow-pulse, float, slide-up, slide-down, fade-in, status-pulse, data-flow)
   - What is unclear: Whether Tailwind v4 `@theme` handles keyframes + animation shorthand identically to v3, or if `@utility` directive is needed
   - Recommendation: Test each animation during token migration. Use `@utility` directive for custom animation utilities if `@theme` does not auto-generate them.

3. **Translation key compatibility edge cases**
   - What we know: next-intl supports nested JSON and ICU MessageFormat, same as i18next
   - What is unclear: Whether any existing translations use i18next-specific interpolation syntax (e.g., `{{count}}` vs `{count}`) or pluralization patterns that differ
   - Recommendation: Run a regex scan across all 69 translation files for i18next-specific syntax (`{{`, `$t(`, `context:`) and convert any found. next-intl uses `{count}` (single braces) for interpolation.

## Sources

### Primary (HIGH confidence)

- [next-intl App Router with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) -- routing.ts, proxy.ts, request.ts, layout setup
- [next-intl proxy/middleware docs](https://next-intl.dev/docs/routing/middleware) -- proxy.ts rename confirmed for Next.js 16
- [next-intl routing setup](https://next-intl.dev/docs/routing/setup) -- defineRouting, createNavigation
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- framework changes, proxy.ts rename
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- @theme directive, CSS-first config
- [Tailwind CSS Next.js Install Guide](https://tailwindcss.com/docs/guides/nextjs) -- postcss.config.mjs, @tailwindcss/postcss
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) -- next/font/google with CSS variables
- Existing codebase analysis: 23 namespace files x 3 locales, 3 Zustand persist stores, tailwind.config.js with full Living System tokens, i18n/config.ts with i18next setup

### Secondary (MEDIUM confidence)

- [next-intl vs next-i18next comparison 2026](https://intlpull.com/blog/next-intl-complete-guide-2026) -- migration patterns
- [Tailwind CSS v4 migration best practices](https://www.digitalapplied.com/blog/tailwind-css-v4-2026-migration-best-practices) -- @config bridge approach
- [Next.js 16 Google Fonts setup](https://www.buildwithmatija.com/blog/nextjs-16-google-fonts-inter-exo-2) -- font variable pattern

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all versions verified against official docs/npm (Next.js 16.1, next-intl 4.8, Tailwind CSS 4, Zustand 5.0)
- Architecture: HIGH -- server-first with client islands is the official Next.js pattern; proxy.ts rename verified
- Pitfalls: HIGH -- sourced from official docs (next-intl, Next.js 16) and codebase analysis (3 persist stores, 23 namespace files, specific tailwind.config.js tokens)

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (30 days -- stable technologies, low churn risk)
