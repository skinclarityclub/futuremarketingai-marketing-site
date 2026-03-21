# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**

- TypeScript 5.x - All application code in both Next.js and legacy Vite projects

**Secondary:**

- MDX - Blog content (`fmai-nextjs/content/blog/`)
- CSS (Tailwind v4) - Styling via `@import 'tailwindcss'` directive (`fmai-nextjs/src/app/globals.css`)

## Runtime

**Environment:**

- Node.js (no `.nvmrc` present - version not pinned)

**Package Manager:**

- npm
- Lockfile: `fmai-nextjs/package-lock.json` present

## Projects (Multi-Repo)

This repository contains two projects:

**PRIMARY: Next.js Website (`fmai-nextjs/`)**

- Active development, deployed to production
- Package manifest: `fmai-nextjs/package.json`
- Config: `fmai-nextjs/next.config.ts`, `fmai-nextjs/tsconfig.json`

**LEGACY: Vite/React SPA (root `/`)**

- Being migrated to Next.js, not actively deployed
- Package manifest: `package.json` (root)
- Config: `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`

## Frameworks

**Core (Next.js project):**

- Next.js 16.1.7 - App Router with `[locale]` dynamic segments
- React 19.2.3 - Latest React with Server Components
- Tailwind CSS 4.x - CSS-first config via `@theme` block in `globals.css`
- Motion (Framer Motion) 12.38.0 - `motion` package (v12 rebrand)
- next-intl 4.8.3 - i18n with locale routing (en, nl, es)

**Core (Legacy Vite project):**

- React 18.3.1 - Client-side SPA
- Vite 6.0+ - Build tool with custom plugins
- Tailwind CSS 3.4.17 - Config-file based
- Framer Motion 11.0+ - Animations
- React Router 7.9.3 - Client-side routing
- i18next / react-i18next - Client-side i18n

**Testing:**

- Playwright 1.58.2 - E2E tests (both projects)
- Vitest 3.2.4 - Unit tests (legacy project only)
- Testing Library (React 16.3, jest-dom 6.9) - Component tests (legacy only)
- Storybook 9.1.10 - Component dev (legacy only)

**Build/Dev:**

- ESLint 9 + eslint-config-next - Linting (Next.js)
- ESLint 8 + TypeScript plugin - Linting (legacy)
- Prettier 3.2.5 - Formatting (legacy only)
- Husky 9.1.7 + lint-staged - Pre-commit hooks (legacy only)
- `@next/bundle-analyzer` - Bundle analysis (Next.js)
- rollup-plugin-visualizer - Bundle analysis (legacy)

## Key Dependencies

**Critical (Next.js):**

- `ai` 6.0.116 + `@ai-sdk/anthropic` 3.0.58 + `@ai-sdk/react` 3.0.118 - Vercel AI SDK for chatbot streaming
- `next-intl` 4.8.3 - Internationalization with locale-prefixed routing
- `zustand` 5.0.12 - Client-side state management (chatbot store with `persist` middleware)
- `zod` 4.3.6 - Schema validation (contact form API route)

**UI/UX (Next.js):**

- `lucide-react` 0.577.0 - Icon library
- `react-calendly` 4.4.0 - Calendly booking embeds
- `react-cookie-consent` 10.0.1 - GDPR cookie banner
- `react-markdown` 10.1.0 + `remark-gfm` 4.0.1 - Markdown rendering in chatbot
- `@splinetool/react-spline` 4.1.0 + `@splinetool/runtime` 1.12.70 - 3D scenes on hero
- `tailwind-merge` 3.5.0 - Conditional class merging
- `@mdx-js/loader` + `@next/mdx` - MDX blog content pipeline
- `gray-matter` 4.0.3 - MDX frontmatter parsing
- `rehype-slug` 6.0.0 - Auto-generate heading IDs
- `schema-dts` 1.1.5 (dev) - Typed JSON-LD structured data

**Additional (Legacy only, not in Next.js):**

- `@sentry/react` 10.18.0 - Error tracking
- `react-ga4` 2.1.0 - Google Analytics
- `@vapi-ai/web` 2.5.2 - Voice AI calls
- `@elevenlabs/react` 0.14.3 - ElevenLabs voice synthesis
- `three` 0.168.0 + `@react-three/fiber` + `@react-three/drei` - 3D WebGL
- `gsap` 3.13.0 - Advanced animations
- `d3` 7.9.0 + `recharts` 3.2.1 - Data visualization
- `jspdf` 3.0.3 + `html2canvas` 1.4.1 - PDF generation
- `@headlessui/react` 2.2.9 - Accessible UI primitives

## Configuration

**TypeScript (Next.js):**

- Target: ES2017, strict mode enabled
- Path aliases: `@/*` -> `./src/*`, `@content/*` -> `./content/*`
- Config: `fmai-nextjs/tsconfig.json`

**Tailwind CSS (Next.js - v4):**

- CSS-first configuration via `@theme` block in `fmai-nextjs/src/app/globals.css`
- PostCSS: `fmai-nextjs/postcss.config.mjs` with `@tailwindcss/postcss`
- Plugin: `@tailwindcss/typography` (loaded via `@plugin` directive)
- Custom design tokens defined in CSS custom properties (colors, fonts, radii, shadows, animations)

**Next.js Config (`fmai-nextjs/next.config.ts`):**

- Plugins chained: `withBundleAnalyzer` -> `withNextIntl` -> `withMDX`
- MDX page extensions enabled: `['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']`
- Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- Redirects from legacy routes (`/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine`) to new `/skills/*` paths
- No remote image patterns configured

**Environment:**

- `.env.local` files present in both root and `fmai-nextjs/`
- `.env.example` (root) lists API keys for Anthropic, Perplexity, OpenAI, Google, Mistral, xAI, Groq, OpenRouter, Azure, Ollama, GitHub
- `NEXT_PUBLIC_CALENDLY_URL` - Calendly booking URL
- `ANTHROPIC_API_KEY` - Required for chatbot engine
- `ANALYZE` - Enables bundle analyzer

**Fonts (Next.js - via `next/font/google`):**

- DM Sans (400-700) - Primary sans-serif (`--font-dm-sans`)
- JetBrains Mono - Monospace (`--font-jetbrains-mono`)
- Space Grotesk (400-700) - Display headings (`--font-space-grotesk`)
- Configured in `fmai-nextjs/src/lib/fonts.ts`

## Platform Requirements

**Development:**

- Node.js (modern LTS)
- npm
- `ANTHROPIC_API_KEY` required for chatbot functionality

**Production:**

- Vercel (Next.js project): `fmai-nextjs/vercel.json` with `framework: "nextjs"`
- Vercel (Legacy project): root `vercel.json` with `framework: "vite"`, SPA rewrites
- Domain: `futuremarketingai.com`

**Scripts (Next.js):**

```bash
npm run dev                # Next.js dev server
npm run build              # Production build
npm run lint               # ESLint
npm run test:e2e           # Playwright E2E tests
npm run test:e2e:ui        # Playwright UI mode
```

**Scripts (Legacy):**

```bash
npm run dev                # Vite dev server (port 5173)
npm run build              # TypeScript check + Vite build
npm run test               # Vitest unit tests
npm run test:coverage      # Vitest coverage (v8 provider)
npm run storybook          # Storybook dev (port 6006)
npm run lint               # ESLint (max 700 warnings)
npm run format             # Prettier
npm run analyze            # Bundle visualizer
```

---

_Stack analysis: 2026-03-21_
