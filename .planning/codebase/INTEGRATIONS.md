# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**AI / LLM:**

- Anthropic Claude - Chatbot engine for website demo personas
  - SDK: `ai` (Vercel AI SDK v6) + `@ai-sdk/anthropic` v3
  - Models: `claude-haiku-4-5-20251001` (used for both "haiku" and "sonnet" complexity tiers currently)
  - Auth: `ANTHROPIC_API_KEY` env var (required)
  - Implementation: `fmai-nextjs/src/lib/chatbot/engine.ts` - streaming responses via `streamText()`
  - API Route: `fmai-nextjs/src/app/api/chatbot/route.ts` (POST, Node.js runtime, 30s max duration)
  - Client hook: `fmai-nextjs/src/hooks/usePersonaChat.ts` via `@ai-sdk/react`
  - Features: multi-persona system, topic routing, complexity detection, tool calling, rate limiting, input sanitization

**Chatbot Persona System:**

- 7 personas with dedicated knowledge bases, tools, and prompt templates:
  - `flagship` - Main website concierge (`fmai-nextjs/src/lib/chatbot/personas/flagship.ts`)
  - `clyde` - Demo persona (`fmai-nextjs/src/lib/chatbot/personas/clyde.ts`)
  - `concierge` - Guided experience (`fmai-nextjs/src/lib/chatbot/personas/concierge.ts`)
  - `demo-guide` - Demo walkthrough (`fmai-nextjs/src/lib/chatbot/personas/demo-guide.ts`)
  - `ecommerce` - E-commerce demo (`fmai-nextjs/src/lib/chatbot/personas/ecommerce.ts`)
  - `leadgen` - Lead qualification (`fmai-nextjs/src/lib/chatbot/personas/leadgen.ts`)
  - `support` - Customer support demo (`fmai-nextjs/src/lib/chatbot/personas/support.ts`)
- Knowledge bases: `fmai-nextjs/src/lib/chatbot/knowledge/*.ts`
- Tool definitions: `fmai-nextjs/src/lib/chatbot/tools/*.ts`
- Context-aware tool filtering by page path (`fmai-nextjs/src/lib/chatbot/engine.ts` lines 22-35)
- Routing: `fmai-nextjs/src/lib/chatbot/persona-router.ts`, `fmai-nextjs/src/lib/chatbot/topic-router.ts`
- Security: `fmai-nextjs/src/lib/chatbot/security.ts` (input validation/sanitization)
- Rate limiting: `fmai-nextjs/src/lib/chatbot/rate-limiter.ts` (per-session, per-IP, per-persona)

**Voice AI (Legacy project only):**

- ElevenLabs - Voice synthesis/conversation
  - SDK: `@elevenlabs/react` v0.14.3
  - Hook: `fmai-nextjs/src/hooks/useElevenLabsCall.ts` (graceful degradation when unavailable)
  - Note: SDK dynamically imported, returns `isAvailable: false` when agent ID missing
- Vapi - Voice AI calls (legacy only)
  - SDK: `@vapi-ai/web` v2.5.2
  - Not present in Next.js project dependencies

**3D Graphics:**

- Spline - 3D scene rendering on hero section
  - SDK: `@splinetool/react-spline` v4.1.0 + `@splinetool/runtime` v1.12.70
  - Used in: `fmai-nextjs/src/components/hero/HeroSpline.tsx`, `fmai-nextjs/src/components/ui/splite.tsx`
  - CSP allows: `https://prod.spline.design` for connect-src and img-src

## Scheduling & Booking

**Calendly:**

- Purpose: Strategy call booking for lead conversion
- SDK: `react-calendly` v4.4.0
- Config: `fmai-nextjs/src/config/calendlyConfig.ts`
- Default URL: `https://calendly.com/futureai/strategy-call` (overridable via `NEXT_PUBLIC_CALENDLY_URL`)
- UTM tracking: source=website, medium=chatbot, campaign=demo-playground
- Loaded as client island: `fmai-nextjs/src/components/providers/ClientIslands.tsx` -> `CalendlyIsland`
- CSP allows: `https://calendly.com` (frame-src), `https://assets.calendly.com` (script, style, img, connect)

## Data Storage

**Databases:**

- None. No database connection in the website codebase.

**File Storage:**

- Local filesystem only. Blog content stored as MDX files in `fmai-nextjs/content/blog/`
- Blog system: `fmai-nextjs/src/lib/blog.ts` reads MDX files with `gray-matter` frontmatter parsing

**Caching:**

- In-memory rate limit maps (contact form: `fmai-nextjs/src/app/api/contact/route.ts`, chatbot: `fmai-nextjs/src/lib/chatbot/rate-limiter.ts`)
- No external cache service

**State Management:**

- Zustand with `persist` middleware (localStorage) for chatbot state
- Store: `fmai-nextjs/src/stores/chatbotStore.ts`
- Persists: persona selection, session ID, message counts, demo mode state

## Authentication & Identity

**Auth Provider:**

- None. This is a public marketing website with no user authentication.

## Analytics & Tracking

**Google Analytics (Legacy project):**

- SDK: `react-ga4` v2.1.0
- CSP allows: `https://www.googletagmanager.com`, `https://www.google-analytics.com`
- Not imported in Next.js project source code

**Google Tag Manager (Next.js):**

- Allowed in CSP headers but no GTM script tag found in source
- CSP allows: `https://www.googletagmanager.com` (script-src, img-src)

**Vercel Analytics:**

- CSP allows: `https://vitals.vercel-insights.com` (connect-src)
- No `@vercel/analytics` package installed

**Hotjar (Legacy only):**

- CSP allows in legacy `vercel.json`: `https://static.hotjar.com`, `https://script.hotjar.com`, `https://*.hotjar.com`
- Not in Next.js CSP

## Monitoring & Observability

**Error Tracking (Legacy only):**

- Sentry via `@sentry/react` v10.18.0
- CSP allows in legacy `vercel.json`: `https://*.sentry.io`, `https://browser.sentry-cdn.com`
- Not installed in Next.js project

**Logs:**

- `console.log` / `console.error` for server-side logging in API routes
- Contact form logs submissions to console (`fmai-nextjs/src/app/api/contact/route.ts` line 86)
- Chatbot engine logs persona and demo mode (`fmai-nextjs/src/lib/chatbot/engine.ts` line 99)

## CI/CD & Deployment

**Hosting:**

- Vercel - Both projects configured
- Next.js: `fmai-nextjs/vercel.json` (framework: nextjs)
- Legacy: root `vercel.json` (framework: vite, SPA rewrite rules)

**CI Pipeline:**

- No CI config files detected (no `.github/workflows/`, no `vercel.json` build hooks beyond standard)
- Husky + lint-staged pre-commit hooks (legacy project only)

## SEO & Structured Data

**Sitemap:**

- Next.js: `fmai-nextjs/src/app/sitemap.ts` - Dynamic sitemap with i18n alternates and blog posts
- Legacy: `vite-plugin-sitemap` in `vite.config.ts`

**Robots.txt:**

- `fmai-nextjs/src/app/robots.ts` - Allows `/`, `/llms.txt`, `/llms-full.txt`; disallows `/api/`, `/_next/`

**JSON-LD:**

- Organization schema: `fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx`
- SEO config: `fmai-nextjs/src/lib/seo-config.ts` (SITE_URL, ORG_EMAIL, LINKEDIN_URL, page dates)
- Typed with `schema-dts` dev dependency

**Open Graph:**

- OG image generation: `fmai-nextjs/src/lib/og-image.tsx`
- Metadata utilities: `fmai-nextjs/src/lib/metadata.ts`

## Environment Configuration

**Required env vars:**

- `ANTHROPIC_API_KEY` - Chatbot engine (server-side only)

**Optional env vars:**

- `NEXT_PUBLIC_CALENDLY_URL` - Calendly booking URL override
- `ANALYZE` - Enable Next.js bundle analyzer (`true` to activate)
- Multiple AI provider keys in `.env.example` (Perplexity, OpenAI, Google, Mistral, xAI, Groq, OpenRouter, Azure, Ollama, GitHub) - appear to be for Taskmaster/development tooling, not used in website code

**Secrets location:**

- `.env.local` files (both root and `fmai-nextjs/`)
- Gitignored (both `.gitignore` files exclude `.env*`)

## Contact Form

**Implementation:**

- API Route: `fmai-nextjs/src/app/api/contact/route.ts`
- Validation: Zod schema (name, email, company, message)
- Rate limiting: In-memory, 3 requests per minute per IP
- Email delivery: **Not implemented** (TODO comment: "Send email via Resend, SendGrid, etc.")
- Currently logs submissions to console only

## Webhooks & Callbacks

**Incoming:**

- None detected

**Outgoing:**

- None detected

## Related Projects (Not in this repo)

Referenced in CLAUDE.md and docs:

- `C:\Users\daley\Desktop\fma-app` - SaaS command center (Next.js dashboard)
- `C:\Users\daley\Desktop\FMai` - n8n content automation (WAT architecture)
- `C:\Users\daley\Desktop\skinclarityclub` - SKC member platform
- `C:\Users\daley\Desktop\skinclarity-shopify` - SKC Shopify webshop

---

_Integration audit: 2026-03-21_
