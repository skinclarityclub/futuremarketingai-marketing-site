# Phase 13 Research: Performance + Bundle Cleanup

Created: 2026-04-24
Audit-driven. See `01-performance.md` and `08-technical-quality.md`.

## R-1 | Next.js 16 + next-intl 4.8 dynamic namespace splitting

### Finding

next-intl officially supports three patterns for per-route message scoping. The canonical 2026 pattern for App Router is:

1. **Server component side**: `getTranslations(namespace)` in `page.tsx` / `layout.tsx`. Already used in this codebase. No change needed.
2. **Client component side**: `<NextIntlClientProvider messages={pick(messages, ['common', 'nav'])}>` in a layout. The `pick` helper from `lodash` or a hand-rolled utility scopes the tree passed to the client.
3. **Per-segment split**: multi-file messages where each file is a namespace (`messages/nl/common.json`, `messages/nl/home.json`, ...). `getRequestConfig` reads only the files needed for the current segment.

### Official next-intl reference

next-intl docs (v4.x): "By default, all messages of the user's locale are loaded. If your app has many messages, you can reduce the bundle size by loading only the messages that are actually used on the current page."

Pattern from next-intl docs, section "Usage with App Router / Rendering messages":

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? 'nl'
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

With namespace pick at the client boundary:

```tsx
// layout.tsx
import { pick } from 'lodash'

const messages = await getMessages()
<NextIntlClientProvider messages={pick(messages, ['common', 'nav'])}>
```

### Our implementation path

Two-level approach for Phase 13:

- **Level 1 (non-breaking, reversible)**: in root `[locale]/layout.tsx` client provider, pass only `pick(messages, ['common', 'nav', 'cookie_consent'])`. Server components keep using `getTranslations()` unchanged; any page that renders a client component consuming extra namespaces adds a scoped `NextIntlClientProvider` wrapper.

- **Level 2 (optional, structural)**: per-segment layout providers. Example: `[locale]/(skills)/layout.tsx` wraps its subtree with `<NextIntlClientProvider messages={pick(messages, ['skills-common', 'skills-*'])}>`. Only if Level 1 leaves too many namespaces on shared pages.

Level 1 is chosen for `13-02-PLAN.md`. Level 2 noted as optional follow-up.

### Caveat: `NextIntlClientProvider` swap mid-tree

next-intl docs confirm that a nested `<NextIntlClientProvider>` **overrides** messages in its subtree. This is safe. But client-component useTranslations calls outside the nested provider only see the outer provider's slice.

### Citation

- next-intl v4 docs: https://next-intl.dev/docs/usage/messages (section "Scoping")
- GitHub example: `amannn/next-intl` repo, `examples/example-app-router`, file `src/app/[locale]/layout.tsx`

---

## R-2 | `next/dynamic` vs `React.lazy` for interaction-gated components

### Finding

Both `next/dynamic(() => import(...), { ssr: false })` and `React.lazy()` produce a separate chunk. Differences that matter for Phase 13:

| Dimension | `next/dynamic` | `React.lazy` |
|---|---|---|
| SSR opt-out | Yes (`ssr: false`). RSC-compatible wrapper. | No native SSR opt-out in RSC. Must be wrapped in `'use client'` + `<Suspense>`. |
| Loading fallback | Inline `loading` option. | Requires Suspense wrapper. |
| Turbopack chunk-split | First-class. | Supported but less battle-tested with App Router. |
| Preload API | Not exposed. | `.preload()` method. |
| Error boundary | Must wrap externally. | Must wrap externally. |

**Choice for Phase 13**: `next/dynamic` with `ssr: false` and `loading: () => null`. Matches existing `ClientIslands` pattern and is officially recommended by the Next.js 16 docs for client-only heavy components.

### Interaction-gated pattern

```tsx
'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ChatWidget = dynamic(() => import('./ChatWidget').then(m => m.ChatWidget), {
  ssr: false,
  loading: () => null,
})

export function FloatingChatTrigger() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open chat">Chat</button>
      {open && <ChatWidget onClose={() => setOpen(false)} />}
    </>
  )
}
```

The `ChatWidget` chunk is only fetched and evaluated when `open` flips true. Prior to click, only the button ships (about 2 KB).

### Citations

- Next.js 16 docs, "Lazy Loading" section: https://nextjs.org/docs/app/guides/lazy-loading
- React docs, "lazy": https://react.dev/reference/react/lazy

---

## R-3 | Measuring bundle savings with `@next/bundle-analyzer` in Next.js 16 + Turbopack

### Finding

`@next/bundle-analyzer` is installed (`package.json:46`) and wired in `next.config.ts:8`. However: Next.js 16 with Turbopack does **not** emit the webpack treemap that bundle-analyzer produces. The plugin silently no-ops unless the build is run in webpack mode.

### Workarounds

1. **One-off analysis**: run the build with Turbopack disabled to get a complete treemap:
   ```bash
   NEXT_TURBOPACK=0 ANALYZE=true npm run build
   # opens .next/analyze/client.html + nodejs.html + edge.html
   ```
2. **Turbopack-native size inspection**: Turbopack emits `.next/build-manifest.json`, `.next/app-build-manifest.json`, and chunk files in `.next/static/chunks/`. For each chunk, `gzip -c chunk.js | wc -c` gives gzipped size. Scripted:
   ```bash
   for f in .next/static/chunks/*.js; do
     raw=$(stat --printf="%s" "$f" 2>/dev/null || stat -f%z "$f")
     gz=$(gzip -c "$f" | wc -c)
     echo "$(basename $f) raw=$raw gz=$gz"
   done | sort -k2 -t= -n
   ```
3. **HTML size**: `ls -la .next/server/app/**/*.html | sort -k5 -n` shows prerendered HTML payload sizes, which include the inlined RSC payload + message tree.

### Before/after comparison protocol for Phase 13

Each plan's `<verify>` block runs:

```bash
rm -rf .next
npm run build
# Capture:
du -sb .next/static/chunks/*.js | sort -rn | head -20 > chunks-$(date +%s).txt
wc -c .next/server/app/en/*.html .next/server/app/en/pricing.html .next/server/app/en/skills/voice-agent.html
```

The delta is recorded in `13-VERIFICATION.md`.

### Citations

- Next.js docs, bundle-analyzer README: https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer
- Known issue tracked in vercel/next.js #65632 (Turbopack + analyzer compatibility)

---

## R-4 | AI SDK v5 to v6 migration notes

### Finding

Current versions in `package.json`:
- `@ai-sdk/anthropic` 3.0.58 (latest 3.0.71)
- `@ai-sdk/react` 3.0.118 (latest 3.0.170)
- `ai` 6.0.116 (latest 6.0.168)

Phase 13 only bumps within **major 6.x** patches. AI SDK v5 was superseded by v6 earlier in 2025. Current codebase is already on v6.

### v6.0.116 to v6.0.168 patch diff

AI SDK v6 patches are additive: new provider adapters, extended tool-call types, streaming-protocol polish. No breaking changes between `6.0.116` and `6.0.168` per the changelog (https://github.com/vercel/ai/releases).

### Risk areas

- `usePersonaChat` hook uses `useChat` from `@ai-sdk/react`. Verify the hook signature `(options: UseChatOptions) => UseChatReturn` unchanged across the 52-patch span. Changelog: no breaking changes in `useChat` return shape since 3.0.118.
- Tool-result rendering: `ChatMessages.tsx` destructures `part.toolName` and `part.toolInvocation`. Verify these remain. No breaking changes in this area.

### Recommendation

Bump `@ai-sdk/anthropic`, `@ai-sdk/react`, `ai` to latest 6.x + latest 3.0.x. Run `npm run build` + smoke test `/api/chatbot` streaming. If issues surface, pin to current versions plus one.

**Conservative floor**:
- `@ai-sdk/anthropic` to `^3.0.71`
- `@ai-sdk/react` to `^3.0.170`
- `ai` to `^6.0.168`

### Citations

- AI SDK release notes: https://github.com/vercel/ai/releases
- AI SDK v6 migration guide: https://sdk.vercel.ai/docs/troubleshooting/migration-guides

---

## R-5 | Zustand v5 `persist` rehydration deferral

### Finding

Zustand v5 `persist` middleware defaults to **eager rehydration on store creation** when `skipHydration: false` (the default). The codebase sets `skipHydration: true` (see `chatbotStore.ts`) and triggers rehydrate manually via `StoreProvider`:

```ts
// StoreProvider.tsx (current)
useEffect(() => {
  useChatbotStore.persist.rehydrate()
}, [])
```

This runs on every visitor, whether or not they open the chat.

### Defer strategies

1. **Lazy on first access**: remove the eager `rehydrate()` call. Zustand's `skipHydration` semantics mean the store returns its `initial` state until the first read that triggers the `onRehydrateStorage` callback chain. In practice, for Zustand v5, explicit rehydrate is still the cleanest trigger.

   **Better pattern**: trigger `rehydrate()` from inside `FloatingChatTrigger` on first click, not from a provider that runs on every page.

2. **Subscribe to first selector**: wrap first subscribe via `useChatbotStore.subscribe` with a one-shot listener that calls `rehydrate()`. More complex, not worth the ceremony.

3. **Session storage instead of local storage**: `createJSONStorage(() => sessionStorage)`. Persisted state resets per tab. Fine for UI flags like `calendlyOpen`; wrong for long-lived history.

**Choice for Phase 13**: strategy 1. Remove eager rehydrate from `StoreProvider` entirely; let `FloatingChatTrigger` call `rehydrate()` on first click after it decides to lazy-import the widget.

### Citations

- Zustand docs, persist middleware: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md
- `skipHydration` option: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#skiphydration

---

## R-6 | Reducing Framer Motion bundle weight

### Finding

`motion` (formerly `framer-motion`) v12 is already tree-shaken via `optimizePackageImports: ['motion']` in `next.config.ts`. Remaining bundle cost comes from the core animation engine and AnimatePresence.

### Lazy-motion feature

`motion/react` exports a `LazyMotion` component plus domain-specific feature bundles: `domAnimation` (small, ~15 KB), `domMax` (full, ~35 KB). Importing `domAnimation` under `LazyMotion` replaces the default `motion` component import with a lighter subset.

Example:

```tsx
import { LazyMotion, domAnimation, m } from 'motion/react'
<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

Savings: 10-20 KB gzipped on pages that animate but do not use gestures/layout.

### Phase 13 stance

Out of scope for Phase 13. The bundle split from ClientIslands + i18n + dead-code is bigger. LazyMotion refactor touches ~25 files for ~15 KB gz; ROI is low.

Noted as follow-up for a future performance sprint. Documented in `13-VERIFICATION.md` under "Deferred optimizations".

### Citation

- Motion docs, Reduce bundle size: https://motion.dev/docs/react-reduce-bundle-size
- `LazyMotion` API: https://motion.dev/docs/react-lazy-motion

---

## R-7 | Tailwind 4 critical CSS in App Router

### Finding

Tailwind 4 with `@tailwindcss/postcss` already produces a single compiled stylesheet. Next.js 16 App Router inlines critical CSS into the HTML head for prerendered pages automatically. No additional extraction step needed.

Current build emits:
- `747ec66f84e14d2a.css` = 9 KB (per-route, Tailwind critical slice)
- `748681575dab7415.css` = 99 KB (main Tailwind utility + `globals.css` rules)

### Optimization room

- **Reduce `globals.css` custom keyframes**: 18 `@keyframes` defined. If we downgrade the blob animations (Phase 13 decides: home only, or static) some keyframes can be removed.
- **Remove unused utility variants**: Tailwind 4 automatically purges, so there is no `content` array to fix. Confirmed.

### Phase 13 action

- `13-01-PLAN.md` removes or reduces the three `blobFloat*` keyframe chains when the gradient mesh is restricted to `/`.
- No other Tailwind-specific changes.

### Citation

- Tailwind 4 docs, Using with Next.js: https://tailwindcss.com/docs/guides/nextjs
- Next.js 16 docs, CSS Modules and Global Styles: https://nextjs.org/docs/app/getting-started/css

---

## Summary: decisions into plans

| Research | Decision | Applied in |
|---|---|---|
| R-1 | Level 1 `pick()` at root client provider; Level 2 (per-segment) noted as optional | `13-02-PLAN.md` |
| R-2 | `next/dynamic` with `ssr:false` + `loading: () => null`, gated on `useState` open flag | `13-01-PLAN.md` |
| R-3 | Capture before/after chunk sizes with `du -sb` script + `NEXT_TURBOPACK=0 ANALYZE=true` treemap one-off | all three `<verify>` blocks |
| R-4 | Bump AI SDK within 6.x to latest patch, no major bumps | `13-03-PLAN.md` |
| R-5 | Remove eager Zustand rehydrate from StoreProvider; rehydrate inside FloatingChatTrigger on first click | `13-01-PLAN.md` |
| R-6 | LazyMotion out of scope; deferred | noted in README |
| R-7 | No extra Tailwind optimization; just prune unused keyframes if blobs scope-down | `13-01-PLAN.md` |
