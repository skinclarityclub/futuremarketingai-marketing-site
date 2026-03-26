# Performance Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce fmai-nextjs JS bundle by ~30-40%, achieve LCP < 2.0s, eliminate scroll jank, and improve Spline 3D loading experience.

**Architecture:** Config-first quick wins (Next.js, fonts, metadata), then GPU/rendering optimizations (containment, blur audit, viewport-aware animations), then new components (LazySection, Web Vitals). No breaking changes.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Motion 12, Spline runtime

**Design doc:** `docs/plans/2026-03-23-performance-optimization-design.md`

---

## Wave 1: Config & Import Fixes (parallel — no dependencies)

These 4 tasks touch completely independent files and can be executed simultaneously.

---

### Task 1: Fix broken motion imports

**Files:**
- Modify: `src/components/layout/HeaderClient.tsx:5`
- Modify: `src/components/common/FloatingLocaleSwitcher.tsx:7`
- Modify: `src/components/voice/VoiceDemoFAB.tsx:4`
- Modify: `src/components/voice/VoiceDemoSection.tsx:4`

**Step 1: Fix HeaderClient import**

In `src/components/layout/HeaderClient.tsx` line 5, change:
```typescript
import { motion, AnimatePresence } from 'framer-motion'
```
to:
```typescript
import { motion, AnimatePresence } from 'motion/react'
```

**Step 2: Fix FloatingLocaleSwitcher import**

In `src/components/common/FloatingLocaleSwitcher.tsx` line 7, change:
```typescript
import { motion, AnimatePresence } from 'framer-motion'
```
to:
```typescript
import { motion, AnimatePresence } from 'motion/react'
```

**Step 3: Fix VoiceDemoFAB import**

In `src/components/voice/VoiceDemoFAB.tsx` line 4, change:
```typescript
import { motion, AnimatePresence } from 'framer-motion'
```
to:
```typescript
import { motion, AnimatePresence } from 'motion/react'
```

**Step 4: Fix VoiceDemoSection import**

In `src/components/voice/VoiceDemoSection.tsx` line 4, change:
```typescript
import { motion } from 'framer-motion'
```
to:
```typescript
import { motion } from 'motion/react'
```

**Step 5: Verify dev server still works**

Run: `cd fmai-nextjs && npx next build 2>&1 | head -30`
Expected: No import errors for framer-motion.

**Step 6: Commit**

```bash
git add src/components/layout/HeaderClient.tsx src/components/common/FloatingLocaleSwitcher.tsx src/components/voice/VoiceDemoFAB.tsx src/components/voice/VoiceDemoSection.tsx
git commit -m "fix: migrate 4 broken framer-motion imports to motion/react"
```

---

### Task 2: Next.js config optimization

**Files:**
- Modify: `next.config.ts:74-121`

**Step 1: Add performance settings to nextConfig**

In `next.config.ts`, replace the `nextConfig` object (lines 74-112) with:

```typescript
const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [],
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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:locale/chatbots',
        destination: '/:locale/skills/chatbot',
        permanent: true,
      },
      {
        source: '/:locale/automations',
        destination: '/:locale/skills/ad-creator',
        permanent: true,
      },
      {
        source: '/:locale/voice-agents',
        destination: '/:locale/skills/voice-agent',
        permanent: true,
      },
      {
        source: '/:locale/marketing-machine',
        destination: '/:locale/skills/content-creator',
        permanent: true,
      },
    ]
  },
}
```

**Step 2: Clean up MDX config**

The MDX `remarkPlugins` and `rehypePlugins` arrays on lines 116-117 are already empty. No change needed. If `rehype-slug` or `remark-gfm` are imported anywhere in the config, remove those imports.

**Step 3: Verify build succeeds**

Run: `cd fmai-nextjs && npx next build 2>&1 | tail -20`
Expected: Build succeeds. Check that lucide-react chunk is significantly smaller.

**Step 4: Commit**

```bash
git add next.config.ts
git commit -m "perf: optimize Next.js config — image formats, package imports, compression, deterministic moduleIds"
```

---

### Task 3: Font optimization

**Files:**
- Modify: `src/lib/fonts.ts`

**Step 1: Add preload and adjustFontFallback**

Replace the entire `src/lib/fonts.ts`:

```typescript
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

export const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})
```

**Step 2: Verify build**

Run: `cd fmai-nextjs && npx next build 2>&1 | tail -10`
Expected: Build succeeds without font errors.

**Step 3: Commit**

```bash
git add src/lib/fonts.ts
git commit -m "perf: add font preload and adjustFontFallback to all 3 fonts"
```

---

### Task 4: Viewport, metadataBase, and resource hints

**Files:**
- Modify: `src/app/[locale]/layout.tsx:1-59`

**Step 1: Add viewport and metadataBase exports**

At the top of `src/app/[locale]/layout.tsx`, after the existing imports, add:

```typescript
import type { Viewport } from 'next'
```

Then before the `generateStaticParams` function, add:

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata = {
  metadataBase: new URL('https://futuremarketingai.com'),
}
```

**Step 2: Add resource hints in the `<head>`**

Inside the `<html>` tag, before `<body>`, add a `<head>` section:

```tsx
<html
  lang={locale}
  className={`${dmSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
>
  <head>
    <link rel="preconnect" href="https://prod.spline.design" />
    <link rel="dns-prefetch" href="https://prod.spline.design" />
    <link rel="preconnect" href="https://unpkg.com" />
  </head>
  <body className="bg-bg-deep text-text-primary font-sans antialiased">
```

**Step 3: Verify build**

Run: `cd fmai-nextjs && npx next build 2>&1 | tail -10`
Expected: Build succeeds. No metadataBase warnings.

**Step 4: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "perf: add viewport export, metadataBase, and preconnect resource hints"
```

---

## Wave 2: GPU & Rendering Optimizations (parallel — independent files)

These 4 tasks touch independent files and can be executed simultaneously. Depends on Wave 1 being complete.

---

### Task 5: Spline loading skeleton + GPU hints

**Files:**
- Modify: `src/components/ui/splite.tsx`
- Modify: `src/components/hero/HeroSpline.tsx:19-35`

**Step 1: Upgrade SplineScene with skeleton and GPU hints**

Replace the entire `src/components/ui/splite.tsx`:

```typescript
'use client'

import { Suspense, lazy, useState, useCallback } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

function SplineSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Animated gradient pulse placeholder */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(0,212,170,0.3) 0%, rgba(245,166,35,0.1) 50%, transparent 70%)',
            animation: 'glow-pulse 2s ease-in-out infinite',
          }}
        />
        <div className="absolute inset-8 rounded-full border border-accent-system/20 animate-spin" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => setLoaded(true), [])

  return (
    <div
      className={className}
      style={{
        contain: 'layout paint',
        willChange: 'transform',
      }}
    >
      <Suspense fallback={<SplineSkeleton />}>
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease-out' }}>
          <Spline scene={scene} className="w-full h-full" onLoad={onLoad} />
        </div>
        {!loaded && <SplineSkeleton />}
      </Suspense>
    </div>
  )
}
```

**Step 2: Add containment to HeroSpline wrapper**

In `src/components/hero/HeroSpline.tsx`, on the desktop Spline wrapper div (line 20-29), add `contain: 'layout paint'` to the style:

Add to the existing style object on line 22:
```typescript
style={{
  contain: 'layout paint',
  maskImage: ...existing...,
```

**Step 3: Verify the hero loads on dev server**

Open `http://localhost:3001` and confirm: gradient pulse skeleton appears first, then Spline scene fades in.

**Step 4: Commit**

```bash
git add src/components/ui/splite.tsx src/components/hero/HeroSpline.tsx
git commit -m "perf: add Spline loading skeleton, GPU hints, and CSS containment"
```

---

### Task 6: GradientMesh GPU isolation

**Files:**
- Modify: `src/components/hero/GradientMesh.tsx`
- Modify: `src/app/globals.css:275-305`

**Step 1: Update GradientMesh component**

Replace `src/components/hero/GradientMesh.tsx`:

```typescript
/**
 * GradientMesh — Global animated gradient mesh background.
 * Uses 3 CSS-only blobs with blur(100px) and CSS keyframe animations.
 * Position: fixed covers all pages.
 * GPU-isolated with CSS containment + will-change.
 * Respects prefers-reduced-motion.
 */
export function GradientMesh() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ contain: 'layout style paint' }}
    >
      <div className="blob blob-warm" />
      <div className="blob blob-cool" />
      <div className="blob blob-mixed" />
    </div>
  )
}
```

**Step 2: Add reduced-motion support in globals.css**

After the `.blob-mixed` rule (around line 305), add:

```css
@media (prefers-reduced-motion: reduce) {
  .blob-warm,
  .blob-cool,
  .blob-mixed {
    animation: none;
  }
}
```

**Step 3: Add containment to .blob class**

In `globals.css`, update the `.blob` class (line 275) to add `contain`:

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  will-change: transform;
  contain: layout style paint;
}
```

**Step 4: Commit**

```bash
git add src/components/hero/GradientMesh.tsx src/app/globals.css
git commit -m "perf: GPU-isolate GradientMesh with CSS containment and reduced-motion support"
```

---

### Task 7: OrbitVisual viewport-aware animations

**Files:**
- Modify: `src/components/hero/OrbitVisual.tsx`

**Step 1: Add useInView to pause animations off-screen**

At the top of `src/components/hero/OrbitVisual.tsx`, add imports:

```typescript
import { useRef } from 'react'
import { useInView } from 'motion/react'
```

**Step 2: Wrap the SVG in a viewport-aware container**

Inside the component function, add:

```typescript
const ref = useRef<HTMLDivElement>(null)
const isInView = useInView(ref, { margin: '100px' })
```

Wrap the returned JSX in:

```tsx
<div
  ref={ref}
  className="hidden lg:block ..."  // keep existing classes
  aria-hidden="true"
  style={{
    contain: 'layout paint',
    willChange: isInView ? 'transform' : 'auto',
  }}
>
  <svg
    ...existing props...
    style={{ animationPlayState: isInView ? 'running' : 'paused' }}
  >
```

**Step 3: Add animation-play-state inheritance to animated children**

All animated elements inside the SVG (circles, paths with `animation:` style) should inherit play state. Add this CSS rule to globals.css after the orbit keyframes:

```css
[style*="animation-play-state: paused"] * {
  animation-play-state: paused !important;
}
```

**Step 4: Verify OrbitVisual pauses when scrolled away**

Open dev server, scroll down past the hero, open DevTools Performance panel — confirm no animation frames from OrbitVisual when off-screen.

**Step 5: Commit**

```bash
git add src/components/hero/OrbitVisual.tsx src/app/globals.css
git commit -m "perf: make OrbitVisual viewport-aware — pause 17+ animations when off-screen"
```

---

### Task 8: Backdrop-blur audit

**Files:**
- Modify: `src/components/layout/HeaderClient.tsx:148,196,322`
- Modify: `src/components/chatbot/ChatWidget.tsx:128`

**Step 1: Downgrade Header backdrop-blur-xl to backdrop-blur-md**

In `src/components/layout/HeaderClient.tsx`:

Line 148: Change `backdrop-blur-xl` to `backdrop-blur-md`
Line 196: Change `backdrop-blur-xl` to `backdrop-blur-md`
Line 322: Change `backdrop-blur-xl` to `backdrop-blur-md`

**Step 2: Downgrade ChatWidget backdrop-blur-xl to backdrop-blur-md**

In `src/components/chatbot/ChatWidget.tsx` line 128: Change `backdrop-blur-xl` to `backdrop-blur-md`

**Step 3: Verify visual appearance**

Open dev server and check:
- Header still has a frosted glass effect (just slightly less blur)
- ChatWidget still looks polished
- The visual difference should be subtle

**Step 4: Commit**

```bash
git add src/components/layout/HeaderClient.tsx src/components/chatbot/ChatWidget.tsx
git commit -m "perf: downgrade backdrop-blur-xl to backdrop-blur-md on Header and ChatWidget"
```

---

## Wave 3: New Components (sequential — LazySection depends on being tested before homepage integration)

---

### Task 9: Create LazySection component

**Files:**
- Create: `src/components/motion/LazySection.tsx`

**Step 1: Create the component**

Create `src/components/motion/LazySection.tsx`:

```typescript
'use client'

import { useRef, useState, useEffect, type ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  /** Minimum height placeholder before content loads */
  minHeight?: string
  /** IntersectionObserver rootMargin — how early to trigger */
  rootMargin?: string
  className?: string
}

/**
 * LazySection — Defers rendering of children until the section
 * is within `rootMargin` of the viewport. Shows a min-height
 * placeholder until triggered. Once triggered, stays rendered.
 */
export function LazySection({
  children,
  minHeight = '200px',
  rootMargin = '200px',
  className,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  return (
    <div ref={ref} className={className} style={{ minHeight: isVisible ? undefined : minHeight }}>
      {isVisible ? children : null}
    </div>
  )
}
```

**Step 2: Commit the component**

```bash
git add src/components/motion/LazySection.tsx
git commit -m "feat: add LazySection component for viewport-deferred rendering"
```

---

### Task 10: Integrate LazySection into homepage

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Import LazySection**

Add to the imports at the top of `src/app/[locale]/page.tsx`:

```typescript
import { LazySection } from '@/components/motion/LazySection'
```

**Step 2: Wrap below-fold sections**

Wrap each section below the hero with `<LazySection>`:

1. **Stats section** (line ~144): Wrap the `<section aria-label="Key metrics">` with:
```tsx
<LazySection minHeight="150px">
  <section aria-label="Key metrics" ...>
    ...existing content...
  </section>
</LazySection>
```

2. **Services section** (line ~165): Wrap the `<ScrollReveal>` + `<section id="services">` with:
```tsx
<LazySection minHeight="400px">
  <ScrollReveal>
    <section id="services" ...>
      ...existing content...
    </section>
  </ScrollReveal>
</LazySection>
```

3. **Badges section** (line ~239): Wrap with:
```tsx
<LazySection minHeight="200px">
  <section aria-labelledby="badges" ...>
    ...existing content...
  </section>
</LazySection>
```

4. **Trust section** (line ~272): Wrap with:
```tsx
<LazySection minHeight="300px">
  <section aria-labelledby="trust" ...>
    ...existing content...
  </section>
</LazySection>
```

5. **FAQ section** (line ~309): Wrap with:
```tsx
<LazySection minHeight="400px">
  <section aria-labelledby="faq" ...>
    ...existing content...
  </section>
</LazySection>
```

6. **Final CTA section** (line ~332): Wrap with:
```tsx
<LazySection minHeight="200px">
  <section aria-labelledby="cta" ...>
    ...existing content...
  </section>
</LazySection>
```

**Step 3: Verify on dev server**

Open `http://localhost:3001` and:
- Hero section loads immediately
- Scroll down — sections appear as you approach them
- No layout shift (min-heights prevent CLS)
- Smooth scroll experience

**Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "perf: wrap 6 below-fold homepage sections in LazySection for deferred rendering"
```

---

## Wave 4: Monitoring & Cleanup (parallel)

---

### Task 11: Lightweight Web Vitals tracking

**Files:**
- Create: `src/lib/web-vitals.ts`
- Create: `src/components/analytics/WebVitalsReporter.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Create web-vitals utility**

Create `src/lib/web-vitals.ts`:

```typescript
import type { Metric } from 'web-vitals'

const TARGETS = {
  LCP: 2000,
  INP: 200,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 800,
}

type VitalName = keyof typeof TARGETS

function ratingFor(name: VitalName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const target = TARGETS[name]
  if (!target) return 'good'
  if (value <= target) return 'good'
  if (value <= target * 1.5) return 'needs-improvement'
  return 'poor'
}

function reportMetric(metric: Metric) {
  const rating = ratingFor(metric.name as VitalName, metric.value)

  if (process.env.NODE_ENV === 'development') {
    const color = rating === 'good' ? '\x1b[32m' : rating === 'needs-improvement' ? '\x1b[33m' : '\x1b[31m'
    console.log(
      `${color}[Web Vital]\x1b[0m ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`
    )
    return
  }

  // Production: send via beacon (non-blocking)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const body = JSON.stringify({
      name: metric.name,
      value: Math.round(metric.value * 100) / 100,
      rating,
      id: metric.id,
      navigationType: metric.navigationType,
    })
    navigator.sendBeacon('/api/vitals', new Blob([body], { type: 'application/json' }))
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  import('web-vitals').then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
    onLCP(reportMetric)
    onINP(reportMetric)
    onCLS(reportMetric)
    onFCP(reportMetric)
    onTTFB(reportMetric)
  })
}
```

**Step 2: Install web-vitals package**

Run: `cd fmai-nextjs && npm install web-vitals`

**Step 3: Create WebVitalsReporter component**

Create `src/components/analytics/WebVitalsReporter.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { initWebVitals } from '@/lib/web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    initWebVitals()
  }, [])

  return null
}
```

**Step 4: Add to layout**

In `src/app/[locale]/layout.tsx`, add import:

```typescript
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter'
```

Add `<WebVitalsReporter />` inside the `<Providers>` block, after `<ClientIslands />`:

```tsx
<ClientIslands />
<WebVitalsReporter />
```

**Step 5: Verify in dev console**

Open `http://localhost:3001`, open browser DevTools Console. After page load you should see colored logs like:
```
[Web Vital] LCP: 1234ms (good)
[Web Vital] FCP: 456ms (good)
[Web Vital] CLS: 0.02 (good)
```

**Step 6: Commit**

```bash
git add src/lib/web-vitals.ts src/components/analytics/WebVitalsReporter.tsx src/app/[locale]/layout.tsx package.json package-lock.json
git commit -m "feat: add lightweight Web Vitals tracking with dev console + prod sendBeacon"
```

---

### Task 12: Final production build verification

**Files:** None (verification only)

**Step 1: Run production build**

Run: `cd fmai-nextjs && npx next build 2>&1`

Check output for:
- No build errors
- Page sizes in the build summary
- Compare JS chunk sizes to pre-optimization baseline (6.8 MB total)

**Step 2: Check bundle size improvement**

Run: `du -sh fmai-nextjs/.next/static/chunks/`
Expected: Significantly less than the pre-optimization 6.8 MB.

**Step 3: Run the production server and spot-check**

Run: `cd fmai-nextjs && npx next start -p 3002`

Open `http://localhost:3002` and verify:
- Homepage loads fast
- Spline skeleton appears, then robot fades in
- Scroll is smooth — no jank on service cards
- Header still has frosted glass effect
- Web Vitals appear in console
- Below-fold sections lazy-load as you scroll

**Step 4: Commit all remaining changes (if any)**

```bash
git add -A
git commit -m "perf: complete performance optimization — verified production build"
```

---

## Execution Summary

| Wave | Tasks | Parallelizable | Dependencies |
|------|-------|----------------|--------------|
| 1 | Tasks 1-4 | Yes (all 4 parallel) | None |
| 2 | Tasks 5-8 | Yes (all 4 parallel) | Wave 1 complete |
| 3 | Tasks 9-10 | Sequential (9 then 10) | Wave 1 complete |
| 4 | Tasks 11-12 | Sequential (11 then 12) | All waves complete |

**Total tasks:** 12
**Parallel waves:** 4 (with internal parallelism in waves 1 and 2)
**Estimated commits:** 12
