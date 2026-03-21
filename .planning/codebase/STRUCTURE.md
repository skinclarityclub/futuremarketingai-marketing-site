# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```
Futuremarketingai/                    # Monorepo root
├── fmai-nextjs/                      # PRIMARY: Next.js 16 marketing website
│   ├── content/                      # MDX blog content
│   │   └── blog/                     # Blog posts (MDX files)
│   ├── messages/                     # i18n translation files
│   │   ├── en.json                   # English (~1858 lines)
│   │   ├── nl.json                   # Dutch
│   │   └── es.json                   # Spanish
│   ├── public/                       # Static assets
│   │   ├── fonts/                    # Self-hosted fonts
│   │   ├── llms.txt                  # LLM discoverability
│   │   └── llms-full.txt             # LLM full context
│   ├── scripts/                      # Build/utility scripts
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── api/                  # API routes (no locale prefix)
│   │   │   │   ├── chatbot/route.ts  # AI chatbot endpoint
│   │   │   │   └── contact/route.ts  # Contact form endpoint
│   │   │   ├── layout.tsx            # Root layout (passthrough)
│   │   │   ├── globals.css           # Global styles + Tailwind
│   │   │   └── [locale]/             # Locale-prefixed routes
│   │   │       ├── layout.tsx        # Locale layout (providers, header, footer)
│   │   │       ├── page.tsx          # Homepage
│   │   │       ├── (marketing)/      # Marketing pages group
│   │   │       │   ├── about/
│   │   │       │   ├── contact/
│   │   │       │   ├── founding-member/
│   │   │       │   ├── how-it-works/
│   │   │       │   └── pricing/
│   │   │       ├── (services)/       # Service pages group (redirected to skills)
│   │   │       │   ├── automations/
│   │   │       │   ├── chatbots/
│   │   │       │   ├── marketing-machine/
│   │   │       │   └── voice-agents/
│   │   │       ├── (skills)/         # Skill pages group (primary service pages)
│   │   │       │   └── skills/
│   │   │       │       ├── ad-creator/
│   │   │       │       ├── chatbot/
│   │   │       │       ├── content-creator/
│   │   │       │       ├── email/
│   │   │       │       ├── lead-qualifier/
│   │   │       │       ├── reporting/
│   │   │       │       ├── social-media/
│   │   │       │       └── voice-agent/
│   │   │       ├── (blog)/           # Blog pages group
│   │   │       │   └── blog/
│   │   │       │       ├── page.tsx   # Blog listing
│   │   │       │       └── [slug]/    # Blog post detail
│   │   │       └── (legal)/          # Legal pages group
│   │   │           └── legal/
│   │   ├── components/               # React components by domain
│   │   │   ├── blog/                 # Blog UI (BlogContent, BlogPostCard, CategoryFilter)
│   │   │   ├── chatbot/             # Chatbot widget + demo system
│   │   │   │   ├── demo/            # Demo orchestration (scenarios, checkpoints)
│   │   │   │   └── tool-results/    # Tool result renderers
│   │   │   ├── common/              # Shared components (PricingTiers, SocialProof, TrustMetrics, ProductMedia, FloatingLocaleSwitcher)
│   │   │   ├── contact/             # Contact form
│   │   │   ├── hero/                # Hero sections (GradientMesh, HeroSpline, OrbitVisual)
│   │   │   ├── interactive/         # Interactive elements (Calendly, CookieConsent)
│   │   │   ├── layout/              # Layout components (Header, Footer, PageShell)
│   │   │   ├── marketing-machine/   # Marketing machine components (FeatureShowcase, VisionTimeline)
│   │   │   ├── motion/              # Animation wrappers (ScrollReveal, MotionDiv, AnimatePresenceWrapper)
│   │   │   ├── providers/           # Provider wrappers (Providers, ClientIslands, StoreProvider)
│   │   │   ├── seo/                 # JSON-LD structured data components (9 types)
│   │   │   ├── ui/                  # Design system primitives (CTAButton, GlassCard, SectionHeading, card, splite, spotlight)
│   │   │   └── voice/               # Voice agent demo (PhoneMockup, WaveformVisualizer, VoiceDemoSection)
│   │   ├── config/                  # App configuration
│   │   │   └── calendlyConfig.ts    # Calendly integration config
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── usePersonaChat.ts    # AI chat interaction hook
│   │   │   ├── useCalendlyBooking.ts
│   │   │   ├── useElevenLabsCall.ts # Voice demo hook
│   │   │   └── useReducedMotion.ts  # Accessibility motion preference
│   │   ├── i18n/                    # Internationalization config
│   │   │   ├── routing.ts           # Locale routing (en, nl, es)
│   │   │   ├── request.ts           # Server-side message loading
│   │   │   └── navigation.ts        # Locale-aware Link, useRouter, etc.
│   │   ├── lib/                     # Core business logic
│   │   │   ├── chatbot/             # Chatbot engine
│   │   │   │   ├── engine.ts        # Main request handler
│   │   │   │   ├── persona-router.ts
│   │   │   │   ├── topic-router.ts
│   │   │   │   ├── prompt-builder.ts
│   │   │   │   ├── complexity-detector.ts
│   │   │   │   ├── rate-limiter.ts
│   │   │   │   ├── security.ts
│   │   │   │   ├── tool-executor.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── personas/        # 7 persona definitions
│   │   │   │   ├── knowledge/       # 6 knowledge bases
│   │   │   │   └── tools/           # 6 tool sets
│   │   │   ├── blog.ts              # Blog post loading (MDX + gray-matter)
│   │   │   ├── fonts.ts             # Google Fonts config (DM Sans, JetBrains Mono, Space Grotesk)
│   │   │   ├── metadata.ts          # Page metadata generator
│   │   │   ├── og-image.tsx         # OpenGraph image generator
│   │   │   ├── seo-config.ts        # SEO constants (site URL, name, dates)
│   │   │   └── utils.ts             # Utility functions (cn)
│   │   └── stores/                  # Zustand state stores
│   │       └── chatbotStore.ts      # Chatbot state (persisted)
│   ├── tests/                       # Playwright E2E tests
│   ├── middleware.ts                 # next-intl locale middleware
│   ├── next.config.ts               # Next.js config (i18n, MDX, security headers, redirects)
│   ├── mdx-components.tsx           # MDX component overrides
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── vercel.json                  # Vercel deployment config
│   └── package.json
├── src/                              # LEGACY: Vite/React SPA
│   ├── components/                   # Large component tree
│   │   ├── chatbot/                  # Chatbot (similar to Next.js version)
│   │   ├── command-center/           # Dashboard demo (not migrated)
│   │   ├── calculator/               # ROI calculator (not migrated)
│   │   ├── mobile/                   # Mobile-specific components
│   │   ├── landing/                  # Landing page sections
│   │   ├── voice/                    # Voice agent demo
│   │   └── ...                       # Many more domain directories
│   ├── contexts/                     # React Context providers
│   ├── data/                         # Mock data
│   ├── hooks/                        # Custom hooks (28+ hooks)
│   ├── i18n/                         # i18next config
│   ├── lib/                          # Chatbot engine (mirrors Next.js)
│   ├── pages/                        # Page components (29 pages)
│   ├── services/                     # Service layer
│   ├── stores/                       # Zustand stores
│   └── stories/                      # Storybook stories
├── api/                              # Vercel serverless functions (legacy)
├── tests/                            # Playwright E2E tests (legacy)
├── .planning/                        # GSD planning documents
├── docs/                             # Project documentation
├── index.html                        # Vite SPA entry point
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind config (legacy)
├── tsconfig.json                     # TypeScript config (legacy)
├── package.json                      # Legacy project dependencies
└── CLAUDE.md                         # AI assistant instructions
```

## Directory Purposes

**`fmai-nextjs/src/app/[locale]/`:**

- Purpose: All user-facing pages, organized by route groups
- Contains: `page.tsx` files (Server Components), each with `generateStaticParams()` and `generateMetadata()`
- Key files: `layout.tsx` (locale layout with all providers), `page.tsx` (homepage)

**`fmai-nextjs/src/app/[locale]/(skills)/skills/`:**

- Purpose: Primary service/skill pages — the main product showcase
- Contains: 8 skill pages (ad-creator, chatbot, content-creator, email, lead-qualifier, reporting, social-media, voice-agent)
- Key files: Each `page.tsx` follows the same pattern: metadata, JSON-LD, PageShell, sections with ScrollReveal

**`fmai-nextjs/src/app/[locale]/(services)/`:**

- Purpose: Legacy service URLs that redirect to skills pages
- Contains: 4 redirect targets (automations, chatbots, marketing-machine, voice-agents)
- Key files: Redirects configured in `fmai-nextjs/next.config.ts`

**`fmai-nextjs/src/components/chatbot/`:**

- Purpose: Full chatbot widget system with demo mode
- Contains: Widget UI, demo orchestration, tool result renderers
- Key files: `ChatWidget.tsx` (main), `ChatWidgetIsland.tsx` (lazy loader), `demo/DemoOrchestrator.tsx`, `demo/scenarios.ts`

**`fmai-nextjs/src/lib/chatbot/`:**

- Purpose: Server-side chatbot engine — the most complex subsystem
- Contains: Engine, persona routing, topic routing, prompt building, complexity detection, rate limiting, security, tools
- Key files: `engine.ts` (orchestrates entire flow), `types.ts` (shared interfaces)

**`fmai-nextjs/messages/`:**

- Purpose: Translation files for all UI text
- Contains: 3 JSON files (~1858 lines each) with nested namespace structure
- Key files: `en.json` (source of truth), `nl.json`, `es.json`

## Key File Locations

**Entry Points:**

- `fmai-nextjs/src/app/layout.tsx`: Root layout (passthrough)
- `fmai-nextjs/src/app/[locale]/layout.tsx`: Locale layout (main app shell)
- `fmai-nextjs/middleware.ts`: Locale detection middleware
- `fmai-nextjs/next.config.ts`: Next.js configuration (security headers, redirects, plugins)

**Configuration:**

- `fmai-nextjs/package.json`: Dependencies and scripts
- `fmai-nextjs/tsconfig.json`: TypeScript config (uses `@/` path alias)
- `fmai-nextjs/vercel.json`: Vercel deployment config
- `fmai-nextjs/src/lib/seo-config.ts`: SEO constants (URLs, entity info, page dates)
- `fmai-nextjs/src/config/calendlyConfig.ts`: Calendly booking config
- `fmai-nextjs/src/i18n/routing.ts`: Locale configuration (en, nl, es)

**Core Logic:**

- `fmai-nextjs/src/lib/chatbot/engine.ts`: Chatbot request handling and AI orchestration
- `fmai-nextjs/src/lib/chatbot/persona-router.ts`: Persona selection logic
- `fmai-nextjs/src/lib/chatbot/topic-router.ts`: Knowledge base topic matching
- `fmai-nextjs/src/lib/metadata.ts`: Page metadata generation
- `fmai-nextjs/src/lib/blog.ts`: Blog post loading from MDX
- `fmai-nextjs/src/stores/chatbotStore.ts`: Chatbot state management

**Testing:**

- `fmai-nextjs/tests/`: Playwright E2E tests
- `fmai-nextjs/playwright.config.ts`: Playwright configuration

## Naming Conventions

**Files:**

- Components: PascalCase with `.tsx` extension — `ChatWidget.tsx`, `GlassCard.tsx`, `ScrollReveal.tsx`
- Utilities/lib: camelCase with `.ts` extension — `metadata.ts`, `seo-config.ts`, `utils.ts`
- Chatbot modules: kebab-case with `.ts` — `persona-router.ts`, `topic-router.ts`, `complexity-detector.ts`
- Knowledge/tools: kebab-case with persona suffix — `flagship-kb.ts`, `concierge-tools.ts`
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)

**Directories:**

- Component directories: kebab-case domain names — `chatbot/`, `marketing-machine/`, `voice/`
- Route groups: parenthesized — `(marketing)/`, `(services)/`, `(skills)/`, `(blog)/`, `(legal)/`
- Route segments: kebab-case — `how-it-works/`, `founding-member/`, `ad-creator/`

**Exports:**

- Components: Named exports (not default) — `export function Header()`, `export function GlassCard()`
- Pages: Default exports — `export default async function HomePage()`
- Hooks: Named exports with `use` prefix — `export function usePersonaChat()`

## Where to Add New Code

**New Marketing Page:**

- Create directory: `fmai-nextjs/src/app/[locale]/(marketing)/your-page/`
- Add file: `page.tsx` with `generateStaticParams()`, `generateMetadata()`, and `PageShell` wrapper
- Add translations: Add namespace to `fmai-nextjs/messages/en.json`, `nl.json`, `es.json`
- Add SEO: Include relevant JSON-LD components, use `generatePageMetadata()`
- Add page date: Update `PAGE_DATES` in `fmai-nextjs/src/lib/seo-config.ts`

**New Skill Page:**

- Create directory: `fmai-nextjs/src/app/[locale]/(skills)/skills/your-skill/`
- Follow pattern of existing skill pages (e.g., `content-creator/page.tsx`)
- Add translations under `skills-your-skill` namespace

**New UI Component:**

- Place in: `fmai-nextjs/src/components/ui/` for design system primitives
- Place in: `fmai-nextjs/src/components/common/` for shared business components
- Place in: `fmai-nextjs/src/components/{domain}/` for domain-specific components

**New Custom Hook:**

- Place in: `fmai-nextjs/src/hooks/`
- Name: `use{Feature}.ts`

**New API Route:**

- Place in: `fmai-nextjs/src/app/api/{endpoint}/route.ts`
- Use Zod for input validation
- Add rate limiting if public-facing

**New Chatbot Persona:**

- Add persona config: `fmai-nextjs/src/lib/chatbot/personas/{name}.ts`
- Add knowledge base: `fmai-nextjs/src/lib/chatbot/knowledge/{name}-kb.ts`
- Add tools: `fmai-nextjs/src/lib/chatbot/tools/{name}-tools.ts`
- Register in: `fmai-nextjs/src/lib/chatbot/personas/index.ts`

**New Blog Post:**

- Add MDX file: `fmai-nextjs/content/blog/{slug}.mdx` with gray-matter frontmatter

**New Motion/Animation Wrapper:**

- Place in: `fmai-nextjs/src/components/motion/`

**New SEO Component:**

- Place in: `fmai-nextjs/src/components/seo/`
- Follow `JsonLd.tsx` base pattern

## Special Directories

**`fmai-nextjs/.next/`:**

- Purpose: Next.js build output
- Generated: Yes
- Committed: No (gitignored)

**`src/` (root):**

- Purpose: Legacy Vite/React SPA — contains features not yet migrated to Next.js
- Generated: No
- Committed: Yes
- Note: Do NOT modify for new features. All new work goes in `fmai-nextjs/`

**`.planning/`:**

- Purpose: GSD planning documents, phase plans, codebase analysis
- Generated: By Claude agents
- Committed: Yes

**`fmai-nextjs/content/`:**

- Purpose: MDX content files (blog posts)
- Generated: No (manually authored)
- Committed: Yes

**`fmai-nextjs/messages/`:**

- Purpose: i18n translation JSON files
- Generated: No (manually maintained)
- Committed: Yes
- Note: `en.json` is source of truth; `nl.json` and `es.json` must stay in sync

**Root `.md` files (100+ files):**

- Purpose: Legacy audit/task/planning documents from earlier development phases
- Generated: By previous AI assistants
- Committed: Yes, but effectively dead documentation — do not reference for current architecture

---

_Structure analysis: 2026-03-21_
