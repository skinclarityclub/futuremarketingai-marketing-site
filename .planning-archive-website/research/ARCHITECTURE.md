# Architecture Patterns

**Domain:** Vite/React SPA to Next.js App Router migration
**Researched:** 2026-03-18

## Recommended Architecture

The Next.js App Router project follows a **server-first, client-islands** architecture. Every component defaults to a React Server Component (RSC) unless it explicitly needs browser APIs, state, or event handlers. The existing ~50+ Vite/React components are all inherently client components (they use hooks, Framer Motion, Zustand, i18next). The migration strategy is to **wrap existing components in server-rendered page shells** that handle data fetching, metadata, and SEO, then hydrate interactive islands on the client.

```
app/
  [locale]/                    # i18n dynamic segment (en|nl|es)
    layout.tsx                 # Root layout: fonts, providers, metadata
    page.tsx                   # Homepage (Server Component shell)
    (marketing)/               # Route group for marketing pages
      about/page.tsx
      pricing/page.tsx
      how-it-works/page.tsx
      contact/page.tsx
      features/page.tsx
    (services)/                # Route group for service pages
      automations/page.tsx
      chatbots/page.tsx
      voice-agents/page.tsx
      marketing-machine/page.tsx
    (legal)/                   # Route group for legal pages
      privacy/page.tsx
      cookies/page.tsx
      terms/page.tsx
      gdpr/page.tsx
    blog/                      # Blog hub
      page.tsx                 # Blog index
      [slug]/page.tsx          # Individual posts (SSG)
    demo/page.tsx              # Demo showcase
    calculator/page.tsx
  api/
    chatbot/route.ts           # Chat streaming endpoint (Route Handler)
messages/                      # next-intl translation files
  en.json                      # Merged from 23 namespace files
  nl.json
  es.json
components/                    # Migrated components
  ui/                          # Pure UI primitives (Button, Card, Modal)
  chatbot/                     # Chatbot client island
  landing/                     # Landing page sections
  services/                    # Service page sections
  calculator/                  # ROI calculator
  seo/                         # StructuredData, FAQSection
  animations/                  # Framer Motion wrappers
lib/
  chatbot/                     # Chatbot engine, tools, personas (server-side)
stores/                        # Zustand stores (client-only)
hooks/                         # Custom hooks (client-only)
```

### Component Boundaries

| Component                                    | Responsibility                                               | Communicates With                            | Server/Client                 |
| -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------- | ----------------------------- |
| Root Layout (`app/[locale]/layout.tsx`)      | HTML shell, fonts, global providers, locale setup            | next-intl provider, metadata API             | **Server**                    |
| Page Shells (`app/[locale]/**/page.tsx`)     | SEO metadata, structured data, static content, data fetching | Client islands via props/children            | **Server**                    |
| Navigation (`components/landing/Header.tsx`) | Site navigation, language switcher, mobile menu              | next-intl Link, locale context               | **Client** (interactive)      |
| Footer (`components/landing/Footer.tsx`)     | Site links, legal links                                      | next-intl translations                       | **Server** (no interactivity) |
| Service Page Sections                        | Content blocks with animations, CTAs                         | Framer Motion, translations                  | **Client** (animations)       |
| ChatWidget                                   | Floating chatbot button + panel + side panel                 | Zustand store, AI SDK useChat, Route Handler | **Client**                    |
| Chatbot Engine (`lib/chatbot/engine.ts`)     | AI streaming, persona routing, tool execution                | Anthropic API via AI SDK streamText          | **Server** (Route Handler)    |
| Calculator Wizard                            | Multi-step ROI calculator with charts                        | Zustand-like local state, D3/charts          | **Client**                    |
| Demo Orchestrator                            | Guided demo with state machine                               | Zustand chatbot store, demo scenarios        | **Client**                    |
| SEO Infrastructure                           | JSON-LD, Open Graph, meta tags                               | Next.js Metadata API (replaces react-helmet) | **Server**                    |
| Cookie Consent                               | GDPR consent banner                                          | localStorage, analytics init                 | **Client**                    |
| ScrollReveal / Animations                    | Intersection-based reveal animations                         | Framer Motion, IntersectionObserver          | **Client**                    |

### Data Flow

```
Request Flow (SSR/SSG):
  Browser → Next.js Server → Middleware (locale detection/redirect)
    → [locale]/layout.tsx (load translations via next-intl)
      → page.tsx (Server Component: generate metadata, fetch static data)
        → Client Islands (hydrate with props from server)
          → Zustand stores (client-only state: chatbot, demo)

Chatbot Streaming Flow:
  ChatWidget (client) → useChat hook → POST /api/chatbot
    → Route Handler → engine.ts → streamText (Anthropic)
      → SSE stream back to client → real-time message rendering

i18n Flow:
  Middleware detects locale from URL prefix (/en/, /nl/, /es/)
    → Sets locale in request → next-intl loads messages for locale
      → Server Components: useTranslations() renders translated text
      → Client Components: useTranslations() via NextIntlClientProvider

Navigation Flow:
  next-intl Link component → preserves locale prefix in all routes
    → Middleware ensures locale is always present in URL
```

## Patterns to Follow

### Pattern 1: Server Page Shell with Client Islands

**What:** Every page.tsx is a Server Component that renders static content and SEO metadata, then delegates interactive sections to "use client" components.
**When:** Every page in the application.
**Why:** Maximizes SSR content for SEO while preserving interactivity.
**Confidence:** HIGH (official Next.js architecture pattern)

```typescript
// app/[locale]/pricing/page.tsx (Server Component)
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { PricingContent } from '@/components/services/PricingContent';
import { generatePageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return generatePageMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    locale,
    path: '/pricing',
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Server-rendered SEO content (plain HTML, no JS)
  return (
    <main>
      <h1>{/* server-rendered headline */}</h1>
      {/* Client island for interactive pricing cards */}
      <PricingContent />
    </main>
  );
}
```

### Pattern 2: Framer Motion Animation Wrappers

**What:** Create thin "use client" wrapper components that provide Framer Motion animation without forcing entire parent trees to be client components.
**When:** Any component needing entrance animations, scroll-triggered reveals, or layout animations.
**Confidence:** HIGH (documented pattern, motion/react package designed for this)

```typescript
// components/animations/MotionDiv.tsx
'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

export function MotionDiv(props: HTMLMotionProps<'div'>) {
  return <motion.div {...props} />;
}

// components/animations/ScrollReveal.tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function ScrollReveal({ children, ...props }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 3: next-intl for App Router i18n

**What:** Use next-intl instead of i18next for the Next.js project. Existing i18next JSON translations get merged into per-locale message files.
**When:** All translated content across the application.
**Why:** next-intl is purpose-built for App Router with native RSC support, ~2KB bundle, middleware-based routing. The existing i18next setup (browser language detector, HTTP backend) is SPA-oriented and incompatible with RSC.
**Confidence:** HIGH (ecosystem consensus, 1.8M weekly npm downloads)

```typescript
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nl', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always', // /en/pricing, /nl/pricing, /es/pricing
})

// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] }
```

**Translation migration:** The 23 existing namespace files per locale (common.json, pricing.json, chatbots.json, etc.) get merged into a single flat-nested structure per locale. A one-time script using lodash `set()` converts `namespace:key` patterns to nested objects. This is a mechanical transformation.

### Pattern 4: Zustand Stores as Client-Only Providers

**What:** Zustand stores remain client-only. Wrap them in a provider component that lives inside the root layout's client boundary.
**When:** chatbotStore (UI state, session, demo mode), userPreferencesStore (theme, a11y).
**Confidence:** HIGH (official Zustand + Next.js pattern)

```typescript
// components/providers/StoreProvider.tsx
'use client';

import { useEffect } from 'react';
import { useChatbotStore } from '@/stores/chatbotStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Hydration-safe: stores initialize on client only
  const hydrated = useChatbotStore((s) => s._hasHydrated);

  return <>{children}</>;
}

// app/[locale]/layout.tsx (Server Component)
import { StoreProvider } from '@/components/providers/StoreProvider';
import { NextIntlClientProvider } from 'next-intl';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            {children}
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Pattern 5: Chatbot Route Handler (Replaces Vercel Edge Function)

**What:** The existing `api/chatbot.ts` Vercel edge function maps directly to a Next.js Route Handler at `app/api/chatbot/route.ts`. The chatbot engine (`lib/chatbot/engine.ts`) is server-only code that stays entirely on the server.
**When:** Chatbot streaming requests.
**Confidence:** HIGH (AI SDK + Next.js Route Handlers are the documented pattern)

```typescript
// app/api/chatbot/route.ts
import { handleChatRequest } from '@/lib/chatbot/engine'

export const runtime = 'edge' // Keep edge runtime for streaming performance

export async function POST(request: Request): Promise<Response> {
  return handleChatRequest(request)
}
```

The chatbot engine.ts is already framework-agnostic (it takes a Request and returns a Response). This is a near zero-change migration.

### Pattern 6: Metadata API Replaces react-helmet-async

**What:** Next.js has a built-in Metadata API that replaces the need for react-helmet-async. Each page exports a `generateMetadata` function or a `metadata` object.
**When:** Every page for SEO meta tags, Open Graph, JSON-LD.
**Confidence:** HIGH (official Next.js feature)

```typescript
// lib/metadata.ts — Shared metadata generator
import type { Metadata } from 'next'

const BASE_URL = 'https://futuremarketingai.com'

interface PageMeta {
  title: string
  description: string
  locale: string
  path: string
  ogImage?: string
}

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  ogImage,
}: PageMeta): Metadata {
  const url = `${BASE_URL}/${locale}${path}`
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        nl: `${BASE_URL}/nl${path}`,
        es: `${BASE_URL}/es${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'FutureMarketingAI',
      locale,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Marking Entire Pages as "use client"

**What:** Slapping "use client" on page.tsx files to quickly make migrated components work.
**Why bad:** Defeats the entire purpose of the migration. Pages become client-rendered SPAs again with zero SEO benefit. The metadata API won't work. No server-side rendering.
**Instead:** Keep page.tsx as Server Components. Extract interactive parts into separate "use client" component files. Pass server-fetched data as props.

### Anti-Pattern 2: Importing Server-Only Code in Client Components

**What:** Importing chatbot engine, database utilities, or API keys in "use client" components.
**Why bad:** Server secrets leak to the client bundle. Build errors or runtime failures.
**Instead:** Use the `server-only` package to mark server modules. Keep data fetching in Server Components or Route Handlers. Pass results to client components via props.

### Anti-Pattern 3: Zustand Store in Server Components

**What:** Attempting to read Zustand state in Server Components.
**Why bad:** Server Components are stateless and shared across users. A Zustand store on the server would create a global singleton shared between all requests.
**Instead:** Zustand stores are strictly client-side. If server-rendered content needs data, fetch it in the Server Component and pass it down.

### Anti-Pattern 4: Translating in Client Components Without Provider

**What:** Using useTranslations() in client components without ensuring NextIntlClientProvider wraps them.
**Why bad:** Runtime errors, missing translations, hydration mismatches.
**Instead:** NextIntlClientProvider in root layout passes messages to all client components. For performance, pass only needed namespaces using the `messages` prop filtered to relevant keys.

### Anti-Pattern 5: One Giant "messages" Bundle

**What:** Loading all 23 namespaces worth of translations on every page.
**Why bad:** Bloated client-side JavaScript for pages that only need 2-3 namespaces.
**Instead:** Load all messages server-side (free, zero client JS). For client components, consider splitting messages by page if bundle size becomes an issue. next-intl server components add zero bytes to client bundle.

## Server vs Client Component Decision Matrix

| Component Category                                         | Server or Client | Reason                                                       |
| ---------------------------------------------------------- | ---------------- | ------------------------------------------------------------ |
| Page shells (page.tsx)                                     | **Server**       | SEO metadata, static content, zero JS                        |
| Root/nested layouts                                        | **Server**       | Fonts, providers, HTML structure                             |
| Static content sections (About text, service descriptions) | **Server**       | Pure content, no interactivity                               |
| Footer                                                     | **Server**       | Links only, no state                                         |
| Navigation/Header                                          | **Client**       | Mobile menu toggle, scroll state, language switcher dropdown |
| Framer Motion animations                                   | **Client**       | Requires DOM, useRef, event handlers                         |
| Chatbot widget + panel                                     | **Client**       | Real-time streaming, Zustand state, user input               |
| Calculator wizard                                          | **Client**       | Multi-step form, D3 charts, complex state                    |
| Demo orchestrator                                          | **Client**       | State machine, chatbot integration                           |
| Cookie consent                                             | **Client**       | localStorage, conditional rendering                          |
| Calendly modal                                             | **Client**       | Third-party embed, click handlers                            |
| ScrollReveal wrappers                                      | **Client**       | IntersectionObserver, animation                              |
| StructuredData (JSON-LD)                                   | **Server**       | Static script tag, no interactivity                          |
| Image components                                           | **Server**       | next/image handles optimization server-side                  |
| Breadcrumbs                                                | **Server**       | Static navigation, no interactivity                          |

## Suggested Build Order (Dependencies)

The migration has clear dependency chains. Components must be built in this order:

```
Phase 1: Foundation (no dependencies)
  ├── Next.js project scaffold + Tailwind CSS 4 config
  ├── next-intl routing + middleware setup
  ├── Translation file migration (23 namespaces → merged JSON)
  ├── Root layout with providers (NextIntlClientProvider, StoreProvider)
  └── Metadata utility (generatePageMetadata)

Phase 2: Core UI Migration (depends on Phase 1)
  ├── Shared UI components (Button, Card, Modal, GlassCard)
  ├── Animation wrappers (MotionDiv, ScrollReveal)
  ├── Navigation (Header + Footer)
  └── Landing page (homepage)

Phase 3: Marketing Pages (depends on Phase 2)
  ├── About, Features, HowItWorks, Contact, Pricing
  ├── Service pages (Automations, Chatbots, VoiceAgents, MarketingMachine)
  ├── Legal pages (Privacy, Cookies, Terms, GDPR)
  └── SEO: JSON-LD structured data per page

Phase 4: Interactive Features (depends on Phase 2)
  ├── Chatbot Route Handler migration (api/chatbot → app/api/chatbot/route.ts)
  ├── Chatbot engine (lib/chatbot/* — near-zero changes needed)
  ├── ChatWidget + SidePanel client island
  ├── Demo orchestrator + playground
  └── Calculator wizard

Phase 5: Content & SEO (depends on Phases 3-4)
  ├── Blog structure (file-based, [slug] pages)
  ├── Sitemap generation (next-sitemap or built-in)
  ├── robots.txt
  ├── Open Graph images
  └── Core Web Vitals optimization

Phase 6: Polish & Cutover (depends on Phase 5)
  ├── Analytics migration (GA4, Hotjar)
  ├── Cookie consent integration
  ├── Cross-browser testing
  ├── Performance benchmarking
  └── Domain switch
```

**Dependency rationale:**

- Phase 1 is foundational — everything depends on i18n routing and layout working.
- Phase 2 extracts shared components used by all pages.
- Phase 3 and 4 can partially overlap — marketing pages are independent of chatbot. But both need Phase 2 components.
- Phase 5 requires pages to exist before optimizing their SEO.
- Phase 6 is integration testing and cutover.

## Key Migration Decisions

### i18next to next-intl Translation Migration

The existing codebase has 23 namespace files per locale loaded via HTTP backend. In Next.js with next-intl:

1. **Merge namespaces** into a single `messages/{locale}.json` with top-level keys matching old namespace names
2. **Translation keys stay the same** — `t('pricing.title')` works identically in next-intl with nested messages
3. **One-time script** converts the existing flat namespace structure
4. **No translation rewriting** — only the loading mechanism changes

### react-helmet-async to Metadata API

The existing `SEOHelmet` and `StructuredData` components use react-helmet-async. In Next.js:

1. **Delete SEOHelmet** — replaced by `generateMetadata` exports on each page
2. **StructuredData** can remain as a component but render a `<script>` tag directly (no Helmet needed in Server Components)
3. **Per-page metadata** is more granular and SEO-effective than the current global approach

### React Router to File-System Routing

The existing App.tsx has ~25 Route definitions. In Next.js:

1. Each route becomes a `page.tsx` file in the corresponding directory
2. Route groups `(marketing)`, `(services)`, `(legal)` organize without affecting URL structure
3. Lazy loading is automatic (Next.js code-splits per page by default)
4. No more manual `Suspense` boundaries for route-level code splitting

## Scalability Considerations

| Concern                | Current (Vite SPA)                | After Migration (Next.js)                        |
| ---------------------- | --------------------------------- | ------------------------------------------------ |
| SEO indexing           | Zero — empty shell for crawlers   | Full SSR/SSG, metadata, structured data          |
| First Contentful Paint | Slow — entire JS bundle must load | Fast — server-rendered HTML arrives immediately  |
| Chatbot streaming      | Works (Edge Function)             | Works identically (Route Handler, same engine)   |
| Adding new pages       | Manual route in App.tsx           | Create folder + page.tsx (automatic)             |
| Adding new language    | Add locale JSON files             | Add locale to routing config + add messages file |
| Blog content           | N/A                               | File-based MDX or future CMS integration         |

## Sources

- [Next.js official Vite migration guide](https://nextjs.org/docs/app/guides/migrating/from-vite) — HIGH confidence
- [Next.js Server and Client Components docs](https://nextjs.org/docs/app/getting-started/server-and-client-components) — HIGH confidence
- [next-intl App Router getting started](https://next-intl.dev/docs/getting-started/app-router) — HIGH confidence
- [next-intl locale-based routing setup](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing) — HIGH confidence
- [AI SDK Next.js App Router getting started](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) — HIGH confidence
- [Next.js Architecture Patterns 2026](https://www.yogijs.tech/blog/nextjs-project-architecture-app-router) — MEDIUM confidence (community source)
- [Framer Motion with Next.js Server Components](https://www.hemantasundaray.com/blog/use-framer-motion-with-nextjs-server-components) — MEDIUM confidence
- [Zustand with Next.js App Router](https://medium.com/@mak-dev/zustand-with-next-js-14-server-components-da9c191b73df) — MEDIUM confidence
- [next-intl vs next-i18next comparison 2026](https://intlpull.com/blog/next-intl-complete-guide-2026) — MEDIUM confidence
