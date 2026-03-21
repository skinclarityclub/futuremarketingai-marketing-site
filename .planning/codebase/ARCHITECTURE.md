# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Multi-project monorepo with a Next.js App Router marketing site (PRIMARY) and a legacy Vite/React SPA (LEGACY, not actively developed)

**Key Characteristics:**

- Next.js 16 App Router with `next-intl` locale-based routing (`[locale]` dynamic segment)
- Server Components by default; client components explicitly marked with `'use client'`
- "Client Islands" pattern for heavy third-party bundles (chatbot, Calendly) loaded via `next/dynamic` with `ssr: false`
- AI-powered chatbot system with multi-persona architecture, powered by Anthropic Claude via Vercel AI SDK
- Full i18n across 3 locales (en, nl, es) using `next-intl` with JSON message files
- Comprehensive SEO with JSON-LD structured data components and metadata generation

## Layers

**Routing & Pages Layer:**

- Purpose: URL structure, locale routing, page rendering
- Location: `fmai-nextjs/src/app/`
- Contains: Next.js App Router pages grouped by route groups: `(marketing)`, `(services)`, `(skills)`, `(blog)`, `(legal)`
- Depends on: Components, i18n, lib/metadata
- Used by: End users via browser

**i18n Layer:**

- Purpose: Internationalization routing, message loading, locale-aware navigation
- Location: `fmai-nextjs/src/i18n/` (config), `fmai-nextjs/messages/` (translation JSON files)
- Contains: `routing.ts` (locale config), `request.ts` (message loader), `navigation.ts` (locale-aware Link/router)
- Depends on: `next-intl` library
- Used by: All pages, layout, components

**Layout Layer:**

- Purpose: Shared page structure (header, footer, providers, global UI)
- Location: `fmai-nextjs/src/components/layout/`
- Contains: `Header.tsx` (server) + `HeaderClient.tsx` (client), `Footer.tsx`, `PageShell.tsx`
- Depends on: i18n, providers, common components
- Used by: `fmai-nextjs/src/app/[locale]/layout.tsx`

**Component Layer:**

- Purpose: Reusable UI components organized by domain
- Location: `fmai-nextjs/src/components/`
- Contains: Domain-specific subdirectories (chatbot, voice, marketing-machine, blog, contact, hero, interactive, seo, motion, ui, common, providers)
- Depends on: lib/utils, hooks, stores, i18n
- Used by: Pages

**UI Primitives:**

- Purpose: Low-level reusable design system components
- Location: `fmai-nextjs/src/components/ui/`
- Contains: `CTAButton.tsx`, `GlassCard.tsx`, `SectionHeading.tsx`, `card.tsx`, `splite.tsx`, `spotlight.tsx`, `QuickAnswerBlock.tsx`
- Depends on: `tailwind-merge` via `cn()` utility
- Used by: All page and domain components

**Motion Layer:**

- Purpose: Animation wrappers for scroll reveal and motion effects
- Location: `fmai-nextjs/src/components/motion/`
- Contains: `ScrollReveal.tsx`, `MotionDiv.tsx`, `AnimatePresenceWrapper.tsx`
- Depends on: `motion` (Framer Motion successor)
- Used by: Pages and components for entrance animations

**SEO Layer:**

- Purpose: Structured data (JSON-LD) and metadata generation
- Location: `fmai-nextjs/src/components/seo/` (JSON-LD components), `fmai-nextjs/src/lib/metadata.ts`, `fmai-nextjs/src/lib/seo-config.ts`
- Contains: `OrganizationJsonLd.tsx`, `WebSiteJsonLd.tsx`, `WebPageJsonLd.tsx`, `BreadcrumbJsonLd.tsx`, `FaqJsonLd.tsx`, `ServiceJsonLd.tsx`, `PricingJsonLd.tsx`, `HowToJsonLd.tsx`, `ArticleJsonLd.tsx`, `JsonLd.tsx` (base)
- Depends on: i18n for locale-aware URLs
- Used by: Pages for SEO metadata

**Chatbot Engine Layer:**

- Purpose: Multi-persona AI chatbot with knowledge bases, tool use, and demo modes
- Location: `fmai-nextjs/src/lib/chatbot/`
- Contains: `engine.ts` (main handler), `persona-router.ts`, `topic-router.ts`, `prompt-builder.ts`, `complexity-detector.ts`, `rate-limiter.ts`, `security.ts`, `tool-executor.ts`, `types.ts`
- Depends on: `ai` (Vercel AI SDK), `@ai-sdk/anthropic`
- Used by: `fmai-nextjs/src/app/api/chatbot/route.ts`

**Chatbot Personas:**

- Purpose: Define distinct chatbot personalities with knowledge and tools
- Location: `fmai-nextjs/src/lib/chatbot/personas/` (persona configs), `fmai-nextjs/src/lib/chatbot/knowledge/` (knowledge bases), `fmai-nextjs/src/lib/chatbot/tools/` (tool definitions)
- Contains: 7 personas: `clyde.ts`, `concierge.ts`, `demo-guide.ts`, `ecommerce.ts`, `flagship.ts`, `leadgen.ts`, `support.ts` — each with matching `-kb.ts` and `-tools.ts` files
- Depends on: chatbot engine types
- Used by: Chatbot engine via persona router

**Chatbot UI Layer:**

- Purpose: Chat widget UI with demo playground, persona selector, side panels
- Location: `fmai-nextjs/src/components/chatbot/`
- Contains: `ChatWidget.tsx`, `ChatWidgetIsland.tsx`, `ChatMessages.tsx`, `ChatInput.tsx`, `ChatHeader.tsx`, `FloatingButton.tsx`, `PersonaSelector.tsx`, `DemoPlayground.tsx`, `MultiPlatformShowcase.tsx`, `SidePanel.tsx`, `ProgressiveCTA.tsx`, `SuggestedPrompts.tsx`, `NavigationButton.tsx`, `DemoContextCard.tsx`
- Depends on: stores/chatbotStore, hooks/usePersonaChat, AI SDK React hooks
- Used by: ClientIslands (lazy-loaded in layout)

**State Management Layer:**

- Purpose: Client-side state for chatbot interactions
- Location: `fmai-nextjs/src/stores/chatbotStore.ts`
- Contains: Zustand store with persistence for persona selection, chat open/minimize state, demo mode orchestration, session management
- Depends on: `zustand` with `persist` middleware
- Used by: Chatbot components

**Hooks Layer:**

- Purpose: Custom React hooks for shared logic
- Location: `fmai-nextjs/src/hooks/`
- Contains: `usePersonaChat.ts` (AI chat hook), `useCalendlyBooking.ts`, `useElevenLabsCall.ts` (voice demo), `useReducedMotion.ts` (accessibility)
- Depends on: stores, AI SDK, external services
- Used by: Components

**API Layer:**

- Purpose: Server-side API endpoints
- Location: `fmai-nextjs/src/app/api/`
- Contains: `chatbot/route.ts` (AI chat streaming), `contact/route.ts` (form submission with rate limiting and Zod validation)
- Depends on: lib/chatbot, zod
- Used by: Client components via fetch

## Data Flow

**Page Rendering (SSR):**

1. Request hits Next.js middleware (`middleware.ts`) which detects/sets locale via `next-intl`
2. App Router resolves `[locale]` segment, loads locale layout (`src/app/[locale]/layout.tsx`)
3. Layout fetches messages via `getMessages()`, wraps children in `NextIntlClientProvider` + `Providers`
4. Page component (Server Component) calls `setRequestLocale()` and `getTranslations()` for server-rendered content
5. Client Islands (`ChatWidgetIsland`, `CalendlyIsland`) load lazily on client side

**Chatbot Conversation:**

1. User types message in `ChatWidget` (client component)
2. `usePersonaChat` hook sends POST to `/api/chatbot` with persona ID, messages, session context
3. API route delegates to `handleChatRequest()` in `engine.ts`
4. Engine: validates input (security) -> checks rate limits -> routes to persona -> detects complexity (haiku vs sonnet model) -> routes to relevant knowledge topics -> builds system prompt -> streams response via Vercel AI SDK
5. Response streams back to client, rendered in `ChatMessages`

**Contact Form:**

1. User submits form in `ContactForm.tsx`
2. POST to `/api/contact` with name, email, company, message
3. Server validates with Zod schema, checks IP-based rate limit (3/min)
4. Currently logs submission (TODO: email service integration)

**State Management:**

- Zustand store (`chatbotStore.ts`) with `persist` middleware for chatbot state (persists to localStorage)
- No global app state beyond chatbot — pages are server-rendered with translations

## Key Abstractions

**PageShell:**

- Purpose: Consistent page wrapper with main content area and padding
- Examples: `fmai-nextjs/src/components/layout/PageShell.tsx`
- Pattern: Wraps all page content with `<main className="min-h-screen pt-16">`

**generatePageMetadata:**

- Purpose: Standardized metadata generation for all pages with locale support
- Examples: `fmai-nextjs/src/lib/metadata.ts`
- Pattern: Takes namespace + locale, fetches translations for meta.title/description, generates canonical URLs, alternates, Open Graph

**PersonaConfig:**

- Purpose: Defines a chatbot persona's behavior, knowledge, tools, and model preferences
- Examples: `fmai-nextjs/src/lib/chatbot/personas/flagship.ts`, `concierge.ts`, etc.
- Pattern: Each persona has a config file, a knowledge base file (`-kb.ts`), and a tools file (`-tools.ts`)

**Client Islands:**

- Purpose: Defer heavy client-side components out of the initial page bundle
- Examples: `fmai-nextjs/src/components/providers/ClientIslands.tsx`
- Pattern: `next/dynamic` with `ssr: false` in a `'use client'` wrapper component

**ScrollReveal:**

- Purpose: Consistent scroll-triggered entrance animation
- Examples: `fmai-nextjs/src/components/motion/ScrollReveal.tsx`
- Pattern: Wraps sections with Framer Motion viewport-triggered fade-in

**JSON-LD Components:**

- Purpose: Type-safe structured data output for SEO
- Examples: `fmai-nextjs/src/components/seo/WebPageJsonLd.tsx`, `FaqJsonLd.tsx`
- Pattern: Server components that render `<script type="application/ld+json">` tags

## Entry Points

**Next.js Application:**

- Location: `fmai-nextjs/src/app/layout.tsx` (root), `fmai-nextjs/src/app/[locale]/layout.tsx` (locale)
- Triggers: HTTP requests via Vercel/Next.js server
- Responsibilities: Root layout passes through to locale layout, which sets up HTML, providers, header/footer, client islands

**API - Chatbot:**

- Location: `fmai-nextjs/src/app/api/chatbot/route.ts`
- Triggers: POST requests from chat widget
- Responsibilities: Delegates to chatbot engine, returns streaming AI response

**API - Contact:**

- Location: `fmai-nextjs/src/app/api/contact/route.ts`
- Triggers: POST requests from contact form
- Responsibilities: Validates, rate-limits, logs contact form submissions

**i18n Middleware:**

- Location: `fmai-nextjs/middleware.ts`
- Triggers: All non-API/non-static requests
- Responsibilities: Locale detection, redirect to locale-prefixed paths

**Legacy Vite SPA:**

- Location: `index.html` (root), `src/` (source)
- Triggers: Direct browser load (separate deployment or local dev)
- Responsibilities: Original demo website — still present but not the active deployment target

## Error Handling

**Strategy:** Layered validation with Zod + in-memory rate limiting

**Patterns:**

- API routes use Zod schemas for input validation (`contactSchema` in `fmai-nextjs/src/app/api/contact/route.ts`)
- Chatbot engine has dedicated `security.ts` for input validation and `rate-limiter.ts` for session/global/IP rate limits
- Chatbot uses complexity detection to route simple queries to cheaper models (haiku) and complex ones to sonnet
- Next.js `notFound()` for invalid locales in layout
- Rate limiting: in-memory Map with periodic cleanup (contact: 3/min per IP)

## Cross-Cutting Concerns

**Logging:** `console.log` for contact form submissions; no structured logging framework
**Validation:** Zod for API input validation; `security.ts` module for chatbot input sanitization
**Authentication:** None — public marketing website with no user accounts
**SEO:** Comprehensive JSON-LD structured data via dedicated components; `generatePageMetadata` for meta tags; `llms.txt` and `llms-full.txt` in public directory for LLM discoverability
**Security:** Content-Security-Policy, HSTS, and other security headers configured in `fmai-nextjs/next.config.ts`; rate limiting on API endpoints

## Legacy Vite Project

**Status:** Present in repo root `src/` directory. Not the active deployment target.

**Key differences from Next.js project:**

- React 18 SPA with React Router, Vite build tooling
- Client-side i18n via `react-i18next` + `i18next` (vs server-side `next-intl`)
- Much larger component surface: command-center demo, calculator, visualizations, 3D (Three.js), GSAP animations
- Separate pages architecture: `src/pages/` with components like `Dashboard.tsx`, `Explorer.tsx`, `Calculator.tsx`
- Contains features not yet migrated: command-center demo, calculator, ad builder
- Uses `react-helmet-async` for meta tags (vs Next.js built-in metadata)
- Has Storybook, Vitest unit tests, Playwright E2E

**Shared patterns between projects:**

- Both use Zustand for state management
- Both have chatbot systems with similar persona architecture (`src/lib/chatbot/` mirrors `fmai-nextjs/src/lib/chatbot/`)
- Both use Vercel AI SDK + Anthropic for chatbot
- Both deploy to Vercel

---

_Architecture analysis: 2026-03-21_
