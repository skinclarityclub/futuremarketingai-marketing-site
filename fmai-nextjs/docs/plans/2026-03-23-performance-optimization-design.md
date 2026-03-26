---
title: Performance Optimization Design
tags: #performance #optimization #audit
created: 2026-03-23
source: Claude Code audit — fmai-nextjs vs skinclarityclub comparison
---

# Performance Optimization Design — fmai-nextjs

## Context

The fmai-nextjs demo site loads slowly, with the 3D Spline robot stuttering on the homepage. A full audit compared the codebase against the fast [[skinclarityclub]] site and identified 12 optimization areas.

## Current State

- **Total JS chunks**: 6.8 MB (production build)
- **Spline runtime chunk**: 1.9 MB (includes Rapier physics engine)
- **Lucide icons chunk**: 620 KB (not tree-shaken)
- **Backdrop-blur instances**: 24+ (expensive GPU operations)
- **Client components**: 57 files with `'use client'`
- **Web Vitals tracking**: None
- **CSS containment**: None
- **Resource hints**: None (no preconnect, no prefetch)

## Audit Findings

### Critical

1. **4 broken imports** — `HeaderClient`, `FloatingLocaleSwitcher`, `VoiceDemoFAB`, `VoiceDemoSection` import from `'framer-motion'` but package.json has `'motion'`
2. **No `optimizePackageImports`** — lucide-react (620KB) and motion not tree-shaken
3. **No image optimization config** — missing AVIF/WebP formats, device sizes, cache TTL
4. **Spline loads without resource hints** — no preconnect to `prod.spline.design`

### High Impact

5. **24+ backdrop-blur instances** — Header and ChatWidget use `backdrop-blur-xl` on every page
6. **No CSS containment** — animated sections cause repaints across the full page
7. **GradientMesh** — 3 infinite blur(100px) blob animations run globally on every page
8. **No LazySection** — all homepage sections render immediately (stats, services, badges, trust, FAQ)

### Medium Impact

9. **Fonts missing `preload` and `adjustFontFallback`** — SKC uses both for faster font rendering
10. **No viewport/metadataBase export** — missing in root layout
11. **OrbitVisual** — 17+ simultaneous CSS animations without `will-change` or `contain`
12. **No Web Vitals monitoring** — no LCP/INP/CLS tracking

### Low Impact

13. **Unused MDX plugins** — `rehype-slug` and `remark-gfm` configured but not used
14. **Source maps in production** — `productionBrowserSourceMaps` not disabled

## Design

### 0. Fix broken motion imports

Change 4 files from `import { ... } from 'framer-motion'` to `import { ... } from 'motion/react'`.

**Files**: `HeaderClient.tsx`, `FloatingLocaleSwitcher.tsx`, `VoiceDemoFAB.tsx`, `VoiceDemoSection.tsx`

### 1. Next.js config optimization

Add to `next.config.ts`:

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [375, 640, 750, 828, 1024, 1280, 1536, 1920],
  minimumCacheTTL: 31536000,
},
compress: true,
productionBrowserSourceMaps: false,
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'motion',
    'react-markdown',
    'zustand',
  ],
},
webpack: (config) => {
  config.optimization = {
    ...config.optimization,
    moduleIds: 'deterministic',
  }
  return config
},
```

Remove unused `rehype-slug` and `remark-gfm` from MDX plugin arrays.

### 2. Font optimization

Add `preload: true` and `adjustFontFallback: true` to all 3 font declarations in `fonts.ts`.

### 3. Viewport and metadataBase export

Add `viewport` export and `metadataBase` to `[locale]/layout.tsx`:

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
```

### 4. Resource hints

Add preconnect and DNS prefetch to layout head:

```html
<link rel="preconnect" href="https://prod.spline.design" />
<link rel="dns-prefetch" href="https://prod.spline.design" />
<link rel="preconnect" href="https://unpkg.com" />
```

### 5. Spline loading optimization

- Add animated gradient-pulse skeleton placeholder (replaces empty spinner)
- Add `will-change: transform` on Spline container
- Add `contain: layout paint` on Spline wrapper
- Use `onLoad` callback to transition from skeleton to scene

### 6. GradientMesh GPU isolation

- Add `contain: layout style paint` to the fixed container
- Add `will-change: transform` to blob elements
- Respect `prefers-reduced-motion` (pause animations)

### 7. OrbitVisual viewport-aware animations

- Wrap in `useInView` — pause animations when off-screen
- Add `will-change: transform` on animated SVG elements
- Add `contain: layout paint` on SVG container

### 8. Backdrop-blur audit

- Downgrade Header `backdrop-blur-xl` to `backdrop-blur-md`
- Downgrade ChatWidget `backdrop-blur-xl` to `backdrop-blur-md`
- Keep `backdrop-blur-sm` instances (low cost)
- Ensure all blur containers have `will-change: backdrop-filter`

### 9. LazySection component

Create a lightweight `LazySection` component using `IntersectionObserver`:
- Renders children only when within 200px of viewport
- Shows a minimal height placeholder until triggered
- Wrap homepage below-fold sections: stats, services, badges, trust, FAQ

### 10. CSS containment on animated sections

Add to `globals.css`:

```css
.blob { contain: layout style paint; }
```

Add `contain: layout paint` inline or via utility class to:
- Hero section
- OrbitVisual SVG
- GradientMesh container
- Card hover effects

### 11. Cleanup unused MDX plugins

Remove `rehype-slug` and `remark-gfm` from the MDX remarkPlugins/rehypePlugins arrays (already empty, but clean up the imports if any).

### 12. Lightweight Web Vitals tracking

Create `src/lib/web-vitals.ts` — lightweight version inspired by SKC:
- Track LCP, INP, CLS, FCP
- Targets: LCP < 2.0s, INP < 200ms, CLS < 0.1
- Console logging in dev, sendBeacon in prod
- Integrate via a `WebVitalsReporter` client component in layout

## Expected Impact

| Metric | Before (estimated) | After (target) |
|--------|-------------------|----------------|
| Total JS (first load) | ~2.5 MB | ~1.5 MB |
| LCP | ~3-4s | < 2.0s |
| CLS | Unknown | < 0.1 |
| Spline perceived load | Blank → sudden appear | Skeleton → smooth transition |
| Scroll jank | Noticeable on card sections | Smooth 60fps |

## Out of Scope

- **next/image migration** — site is image-light (1 PNG, rest SVGs)
- **Client component refactoring** — 57 files, most need interactivity
- **Lighthouse CI setup** — nice-to-have, not direct perf impact
- **requestIdleCallback loader** — fmai has minimal third-party scripts
