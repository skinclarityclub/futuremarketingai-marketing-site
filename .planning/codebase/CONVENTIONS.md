# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**

- Components: PascalCase with `.tsx` extension (e.g., `ChatWidget.tsx`, `GlassCard.tsx`, `ScrollReveal.tsx`)
- Library modules: kebab-case with `.ts` extension (e.g., `complexity-detector.ts`, `persona-router.ts`, `seo-config.ts`)
- Hooks: camelCase with `use` prefix (e.g., `usePersonaChat.ts`, `useReducedMotion.ts`, `useCalendlyBooking.ts`)
- Stores: camelCase with `Store` suffix (e.g., `chatbotStore.ts`)
- Test files: kebab-case with `.spec.ts` suffix in `tests/e2e/` (e.g., `homepage.spec.ts`, `navigation.spec.ts`)
- Translation files: locale code `.json` (e.g., `en.json`, `nl.json`, `es.json`)

**Functions:**

- Use camelCase for all functions: `handleSend`, `validateInput`, `generatePageMetadata`
- React components use PascalCase: `ChatWidget`, `GlassCard`, `PageShell`
- Event handlers use `handle` prefix: `handleSubmit`, `handleSend`, `handlePromptSelect`
- Builder/factory functions describe what they produce: `buildSystemMessages`, `createPersonaTools`

**Variables:**

- Use camelCase for variables and constants within functions: `messageCount`, `demoScenario`
- Use UPPER_SNAKE_CASE for module-level constants: `RATE_LIMIT_MAX`, `DEMO_MESSAGE_LIMIT`, `AI_RESPONSE_TIMEOUT`
- Use descriptive boolean names: `isOpen`, `isMinimized`, `hasUnread`, `isAtLimit`

**Types:**

- Use PascalCase for interfaces and types: `ChatRequest`, `PersonaConfig`, `TopicDefinition`
- Interfaces use descriptive noun names: `ChatbotState`, `SecurityValidation`, `RateLimitResult`
- Props interfaces use `ComponentNameProps` pattern: `ChatWidgetProps`, `CTAButtonProps`, `SectionHeadingProps`
- Union types for finite states: `type FormStatus = 'idle' | 'submitting' | 'success' | 'error'`
- Exported type aliases for domain concepts: `type ComplexityLevel = 'haiku' | 'sonnet'`

## Code Style

**Formatting:**

- No dedicated formatter (no Prettier config detected). ESLint handles basic formatting.
- Single quotes for string literals in TypeScript
- No semicolons at end of statements (observed in most files)
- 2-space indentation
- Trailing commas in multi-line structures

**Linting:**

- ESLint 9 with flat config at `fmai-nextjs/eslint.config.mjs`
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Strict TypeScript enabled in `fmai-nextjs/tsconfig.json` (`"strict": true`)
- Occasional `// eslint-disable-next-line @typescript-eslint/no-explicit-any` for AI SDK tool types in `fmai-nextjs/src/lib/chatbot/engine.ts`

## Import Organization

**Order:**

1. External packages (React, Next.js, third-party): `import { useEffect } from 'react'`, `import type { Metadata } from 'next'`
2. Internal path-aliased imports: `import { useChatbotStore } from '@/stores/chatbotStore'`
3. Relative imports for sibling/child components: `import { FloatingButton } from './FloatingButton'`

**Path Aliases:**

- `@/*` maps to `./src/*` (primary alias for all source code)
- `@content/*` maps to `./content/*` (MDX blog content)
- Use `@/` for all cross-directory imports. Use `./` only for same-directory or child imports.

**Type Imports:**

- Use `import type { ... }` for type-only imports: `import type { ReactNode } from 'react'`
- Inline type imports in mixed imports: `import { type Page } from '@playwright/test'` (seen in test files)

## Component Patterns

**Server vs Client Components:**

- Pages (`page.tsx`) are async Server Components by default
- Client components explicitly marked with `'use client'` directive at file top
- Heavy client-side features use the "Client Islands" pattern: dynamically imported with `ssr: false` via `fmai-nextjs/src/components/providers/ClientIslands.tsx`
- Server-to-client bridge pattern: Server Component wraps Client Component (e.g., `Header.tsx` server component renders `HeaderClient.tsx` client component)

**Component Declaration:**

- Use named `function` declarations (not arrow functions) for components:
  ```typescript
  export function GlassCard({ children, className }: GlassCardProps) {
    // ...
  }
  ```
- Always export components as named exports (no default exports), except for `ScrollReveal` which has both
- Props destructured in function signature

**Component Composition:**

- Pages wrap content in `<PageShell>` for consistent layout
- Sections use semantic HTML: `<section>` with `aria-labelledby` attributes
- Reusable UI primitives in `fmai-nextjs/src/components/ui/`: `GlassCard`, `CTAButton`, `SectionHeading`
- Animation wrapper: `<ScrollReveal>` from `fmai-nextjs/src/components/motion/ScrollReveal.tsx`
- SEO components injected per-page: `<WebPageJsonLd>`, `<BreadcrumbJsonLd>`

**Page Component Pattern:**
Every page follows this structure:

```typescript
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'pageName', path: '/page-path' })
}

export default async function PageName({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'pageName' })

  return (
    <PageShell>
      <WebPageJsonLd ... />
      <BreadcrumbJsonLd ... />
      {/* Page sections */}
    </PageShell>
  )
}
```

## State Management

**Zustand Store Pattern:**

- Single store at `fmai-nextjs/src/stores/chatbotStore.ts`
- Uses `create<StateType>()(persist(...))` pattern with typed state interface
- State and actions co-located in one interface (`ChatbotState`)
- `persist` middleware with `partialize` to only persist selected fields
- `skipHydration: true` for SSR safety
- JSDoc comments on each state field

**Client State:**

- Form state managed with `useState` locally in components (e.g., `ContactForm.tsx`)
- Chat state via `useChat` from `@ai-sdk/react` in `fmai-nextjs/src/hooks/usePersonaChat.ts`
- Memoize expensive objects with `useMemo` (e.g., `DefaultChatTransport` instance)

## Error Handling

**API Routes:**

- Use Zod schemas for request validation: `contactSchema.safeParse(body)` in `fmai-nextjs/src/app/api/contact/route.ts`
- Return structured error responses with appropriate HTTP status codes:
  - `400` for invalid JSON
  - `422` for validation failures with field-level errors
  - `429` for rate limiting
- Wrap JSON parsing in try/catch with explicit error responses

**Client-Side:**

- `onError` callback in hooks for logging: `console.error(\`[chat-${personaId}] error:\`, error)`
- Form components track error state: `type FormStatus = 'idle' | 'submitting' | 'success' | 'error'`
- Guard clauses with early returns: `if (isAtLimit) return`

**Security:**

- Input validation via `fmai-nextjs/src/lib/chatbot/security.ts` with PII pattern detection
- Output sanitization: API key and internal email redaction in `sanitizeOutput()`
- In-memory rate limiting per IP in API routes
- CSP headers configured in `fmai-nextjs/next.config.ts`

## Internationalization

**Pattern:**

- `next-intl` with locale prefix `'always'` (all routes prefixed: `/en/`, `/nl/`, `/es/`)
- Routing config at `fmai-nextjs/src/i18n/routing.ts`
- Translation messages in `fmai-nextjs/messages/{locale}.json`
- Server-side: `getTranslations({ locale, namespace })` for page content
- Client-side: `NextIntlClientProvider` wraps app in locale layout
- All pages call `setRequestLocale(locale)` for static generation support
- Every page exports `generateStaticParams()` returning all locales

## Logging

**Framework:** `console` (no structured logging library)

**Patterns:**

- API routes log submissions: `console.log('[Contact Form Submission]', { ... })`
- Hooks log errors: `console.error(\`[chat-${personaId}] error:\`, error)`
- Use bracketed prefixes for log context: `[Contact Form Submission]`, `[chat-flagship]`

## Comments

**When to Comment:**

- JSDoc on exported utility functions and hooks describing purpose
- Block comments (`/** ... */`) on component files explaining architectural decisions (e.g., `ClientIslands.tsx`)
- Inline comments for non-obvious logic or TODO items
- Section comments in page components: `{/* Hero Section */}`, `{/* Timeline Section */}`

**JSDoc:**

- Used on library functions and providers, not on every component
- Focus on "why" rather than "what": explains architectural rationale

## CSS and Styling

**Approach:**

- Tailwind CSS v4 with `@theme` directive for design tokens in `fmai-nextjs/src/app/globals.css`
- `tailwind-merge` via `cn()` utility at `fmai-nextjs/src/lib/utils.ts` and direct `twMerge()` calls
- CSS custom properties for design tokens: `--color-bg-deep`, `--radius-card`, `--shadow-glow-sm`
- Semantic color names: `bg-deep`, `bg-surface`, `accent-system`, `accent-human`, `text-primary`, `text-secondary`
- Component variants defined as lookup objects:
  ```typescript
  const variantStyles = {
    primary: '...',
    secondary: '...',
    ghost: '...',
  }
  ```

**Motion/Animation:**

- Framer Motion via `motion/react` package (not `framer-motion` directly)
- Always check `useReducedMotion()` and provide static fallback
- `ScrollReveal` component wraps animated sections

## Module Design

**Exports:**

- Named exports for all components and functions (no default exports on components)
- Barrel files (`index.ts`) used selectively: `fmai-nextjs/src/lib/chatbot/index.ts`, `fmai-nextjs/src/lib/chatbot/personas/index.ts`
- Side-effect imports for persona registration: `import './personas'` in engine

**Barrel Files:**

- Used sparingly. Most imports go directly to the file.
- `fmai-nextjs/src/lib/chatbot/personas/index.ts` re-exports and triggers side-effect registration
- `fmai-nextjs/src/components/chatbot/tool-results/index.tsx` serves as barrel for tool result cards

---

_Convention analysis: 2026-03-21_
