# Phase 12: Design Polish & Media - Research

**Researched:** 2026-03-13
**Domain:** Interactive 3D visuals, product media, micro-interactions, typography polish
**Confidence:** HIGH

## Summary

Phase 12 elevates the FMai website from "well-structured Living System" to "premium agency" level through four workstreams: (1) replacing the current CSS/SVG OrbitVisual hero with an interactive Spline 3D scene, (2) adding real product media (screenshots, demo videos) to service pages, (3) implementing scroll-triggered reveal animations and card hover micro-interactions across all pages, and (4) fine-tuning typography spacing and rhythm.

The project already has a strong animation infrastructure: Framer Motion `whileInView` is used across 28+ files, `useMotionSafe`/`useReducedMotion` hooks exist for accessibility, CSS keyframe animations handle orbit/blob/fadeIn patterns, and the `card-gradient-border` hover pattern is established. The main work is layering premium polish on top of this foundation.

**Primary recommendation:** Use `@splinetool/react-spline` for the hero 3D visual (lazy-loaded behind the existing OrbitVisual as fallback), Framer Motion `whileInView` for scroll reveals (already the project standard), and a lightweight custom `useTilt` hook for card parallax hover. Keep video self-hosted as MP4 with poster frames.

## Standard Stack

### Core (New Dependencies)

| Library                    | Version | Purpose                    | Why Standard                                                                                  |
| -------------------------- | ------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| `@splinetool/react-spline` | ^4.1.0  | Interactive 3D hero visual | Production-proven (used by Vercel), React component with lazy-load support, cursor-responsive |

### Already Installed (Use These)

| Library              | Version  | Purpose                                   | Status                    |
| -------------------- | -------- | ----------------------------------------- | ------------------------- |
| `framer-motion`      | ^11.0.0  | Scroll animations, whileInView, useInView | Already used in 28+ files |
| `lucide-react`       | ^0.545.0 | Icons for UI elements                     | Already project standard  |
| `three`              | 0.168.0  | 3D runtime (Spline dependency)            | Already installed         |
| `@react-three/fiber` | 8.17.10  | React Three.js bridge                     | Already installed         |

### Not Needed

| Library                       | Reason                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `@rive-app/react-canvas`      | Requires building .riv files in Rive editor -- overhead not justified when Spline handles hero and Framer Motion handles micro-interactions |
| `react-tilt` / `vanilla-tilt` | Simple custom hook is lighter than a dependency for card tilt                                                                               |
| `gsap`                        | Already installed but not needed -- Framer Motion covers all scroll/reveal needs                                                            |
| `lottie-react`                | No Lottie animations planned                                                                                                                |

### Alternatives Considered

| Instead of          | Could Use                      | Tradeoff                                                             |
| ------------------- | ------------------------------ | -------------------------------------------------------------------- |
| Spline 3D hero      | Enhanced OrbitVisual (CSS/SVG) | Lower wow-factor but zero load penalty -- keep as fallback           |
| Spline 3D hero      | Rive animation                 | Smaller files (30-80KB vs 200-500KB) but requires Rive editor skills |
| Self-hosted MP4     | YouTube/Vimeo embed            | Self-hosted gives full control over styling, no third-party branding |
| Custom useTilt hook | vanilla-tilt library           | Custom hook is ~20 lines, avoids dependency for one effect           |

### Installation

```bash
npm install @splinetool/react-spline @splinetool/runtime
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── OrbitVisual.tsx       # Keep as Spline fallback
│   │   ├── SplineHero.tsx        # NEW: Lazy-loaded Spline 3D wrapper
│   │   ├── ScrollReveal.tsx      # NEW: Reusable scroll-triggered reveal wrapper
│   │   └── ProductMedia.tsx      # NEW: Video/screenshot component with poster
│   ├── landing/
│   │   └── Hero.tsx              # Updated: conditionally render SplineHero or OrbitVisual
│   └── ...
├── hooks/
│   ├── useReducedMotion.ts       # Existing: useMotionSafe, getReducedMotionConfig
│   └── useTilt.ts                # NEW: Mouse-tracking card tilt hook
└── index.css                     # Existing: add new micro-interaction keyframes
```

### Pattern 1: Lazy-Loaded Spline with CSS Fallback

**What:** Load the Spline 3D scene with React.lazy, show OrbitVisual while loading
**When to use:** Hero section -- the most critical visual
**Example:**

```typescript
// SplineHero.tsx
import React, { lazy, Suspense } from 'react'
import { OrbitVisual } from './OrbitVisual'

const Spline = lazy(() => import('@splinetool/react-spline'))

export const SplineHero: React.FC<{ sceneUrl: string }> = ({ sceneUrl }) => (
  <Suspense fallback={<OrbitVisual />}>
    <Spline
      scene={sceneUrl}
      style={{ width: '100%', height: '100%' }}
    />
  </Suspense>
)
```

### Pattern 2: Reusable ScrollReveal Wrapper

**What:** Framer Motion whileInView wrapper with consistent reveal animation
**When to use:** Every section that needs scroll-triggered entrance
**Example:**

```typescript
// ScrollReveal.tsx
import { motion } from 'framer-motion'
import { useMotionSafe } from '../../hooks/useReducedMotion'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children, delay = 0, direction = 'up', className
}) => {
  const initial = {
    opacity: 0,
    ...(direction === 'up' && { y: 30 }),
    ...(direction === 'left' && { x: -30 }),
    ...(direction === 'right' && { x: 30 }),
  }
  const animate = { opacity: 1, y: 0, x: 0 }

  const props = useMotionSafe({
    initial,
    whileInView: animate,
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  })

  return <motion.div {...props} className={className}>{children}</motion.div>
}
```

### Pattern 3: Card Tilt Hook (Mouse-Tracking Parallax)

**What:** Custom hook that tracks mouse position over a card and returns transform values
**When to use:** Service cards, pricing cards -- any card needing premium hover feel
**Example:**

```typescript
// useTilt.ts
import { useRef, useCallback, useState } from 'react'

export function useTilt(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.15s ease-out',
  })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setStyle({
        transform: `perspective(800px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`,
        transition: 'transform 0.15s ease-out',
      })
    },
    [maxTilt]
  )

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.4s ease-out',
    })
  }, [])

  return { ref, style, handleMouseMove, handleMouseLeave }
}
```

### Pattern 4: Self-Hosted Video with Poster Frame

**What:** HTML5 video with poster image, lazy-loaded, respects reduced motion
**When to use:** Service pages for product demos
**Example:**

```typescript
// ProductMedia.tsx
import React from 'react'
import { useReducedMotion } from 'framer-motion'

interface ProductMediaProps {
  videoSrc: string
  posterSrc: string
  alt: string
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  videoSrc, posterSrc, alt
}) => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <img src={posterSrc} alt={alt} className="rounded-card w-full" loading="lazy" />
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster={posterSrc}
      className="rounded-card w-full"
      preload="none"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  )
}
```

### Anti-Patterns to Avoid

- **Animating layout properties on scroll:** Never animate `width`, `height`, `top`, `left` on scroll -- use `transform` and `opacity` only (GPU-composited)
- **Scroll jank from too many whileInView observers:** Batch elements into section-level ScrollReveal wrappers with staggered children, not individual observers per element
- **Spline as LCP element:** Never make Spline the LCP -- the text heading must be LCP. Spline loads after initial paint via lazy()
- **Eager-loading video:** Always use `preload="none"` on service page videos. Hero stays image/3D, not video
- **Card tilt on mobile:** Disable useTilt on touch devices -- no mouse tracking available, causes jank with touch events

## Don't Hand-Roll

| Problem                     | Don't Build                      | Use Instead                                                      | Why                                                                       |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 3D hero visual              | WebGL shader from scratch        | Spline editor + @splinetool/react-spline                         | Spline provides visual editor, export, mouse interactivity out of the box |
| Scroll-triggered visibility | Custom IntersectionObserver      | Framer Motion `whileInView`                                      | Already used in 28 files, handles threshold, once, reduced-motion         |
| Reduced motion support      | Custom matchMedia listener       | `useReducedMotion` from framer-motion + existing `useMotionSafe` | Already built and used project-wide                                       |
| Video player                | Custom controls                  | HTML5 `<video>` with autoPlay muted loop                         | Native browser controls sufficient for ambient demo videos                |
| Letter-spacing responsive   | Manual media queries per heading | Tailwind `tracking-*` utilities + `@screen` variants             | Consistent with project's Tailwind-first approach                         |

## Common Pitfalls

### Pitfall 1: Spline Destroys LCP Score

**What goes wrong:** Spline scene becomes the LCP element, pushing LCP from ~1s to 5s+
**Why it happens:** Spline runtime is ~200KB+ and the 3D scene file can be 200-500KB
**How to avoid:** (1) Hero heading text must render immediately as the LCP element. (2) Spline loads via React.lazy with OrbitVisual as Suspense fallback. (3) Set `fetchpriority="high"` on no elements related to Spline.
**Warning signs:** Lighthouse LCP > 2.5s, "Avoid lazy-loading LCP image" audit

### Pitfall 2: Scroll Animation Overload

**What goes wrong:** Every element animates individually, creating a "popcorn" effect that feels cheap
**Why it happens:** Wrapping every `<p>`, `<h2>`, `<img>` in its own motion.div
**How to avoid:** Animate at the section/card level. Use stagger for groups of cards (0.1s delay between siblings), not individual text elements. Maximum 3-4 animated elements visible at once.
**Warning signs:** More than 8 active IntersectionObservers in viewport simultaneously

### Pitfall 3: Card Tilt on Touch Devices

**What goes wrong:** Tilt effect fires on touchmove, causing janky scrolling
**Why it happens:** Mouse events fire differently on touch -- `mousemove` on first touch, then nothing
**How to avoid:** Check `@media (hover: hover) and (pointer: fine)` or use the existing `useIsMobile` hook to skip tilt
**Warning signs:** Cards "stick" tilted on mobile after tap

### Pitfall 4: Video Autoplay Blocked

**What goes wrong:** Demo videos show poster frame but never play
**Why it happens:** Browsers block autoplay unless video is muted AND has no audio track
**How to avoid:** Always use `muted` + `playsInline` attributes. Encode videos without audio track for smallest file size.
**Warning signs:** Console warnings about autoplay policy

### Pitfall 5: Spline Scene Not Mouse-Responsive

**What goes wrong:** 3D scene renders but doesn't respond to cursor
**Why it happens:** The scene in Spline editor doesn't have mouse events configured
**How to avoid:** In Spline editor, add "Mouse Hover" and "Mouse Position" events to objects before exporting
**Warning signs:** Static 3D render with no interactivity

### Pitfall 6: Typography Changes Break Layout

**What goes wrong:** Adjusting letter-spacing or font-size causes text overflow, button wrapping, or card height inconsistencies
**Why it happens:** Typography is deeply coupled to layout -- small changes cascade
**How to avoid:** Make typography changes in isolation, test every page at 1280px and 1440px before and after
**Warning signs:** Cards in grids have uneven heights, headings wrap unexpectedly

## Code Examples

### Existing Pattern: whileInView (Already Used Project-Wide)

```typescript
// Source: src/pages/AutomationsPage.tsx (representative pattern)
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.5, delay: 0.1 }}
>
```

### Existing Pattern: CSS fadeInUp (Used in Heroes)

```css
/* Source: src/index.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Existing Pattern: card-gradient-border (Hover State)

```css
/* Source: src/index.css */
.card-gradient-border::before {
  /* ... mask-based gradient border ... */
  transition: background 0.5s ease;
}
.card-gradient-border:hover::before {
  background: linear-gradient(135deg, #f5a623, #0abab5);
}
```

### Existing Pattern: Reduced Motion Respect

```css
/* Source: src/index.css */
@media (prefers-reduced-motion: reduce) {
  .blob,
  [data-orbit] * {
    animation: none !important;
  }
}
```

### New: Button Hover Micro-Animation (Icon Shift)

```typescript
// Enhance existing CTAButton with icon micro-animation
<motion.span
  className="inline-flex items-center gap-2"
  whileHover={{ x: 4 }}
  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
>
  {children}
  <ArrowRight className="w-4 h-4" />
</motion.span>
```

## State of the Art

| Old Approach               | Current Approach               | When Changed | Impact                                            |
| -------------------------- | ------------------------------ | ------------ | ------------------------------------------------- |
| Lottie for hero animations | Spline/Rive for interactive 3D | 2024-2025    | Mouse-responsive, state-driven vs static playback |
| AOS.js / ScrollMagic       | Framer Motion whileInView      | 2023+        | Native React integration, no extra dependencies   |
| jQuery parallax plugins    | CSS perspective + transform    | 2022+        | GPU-composited, no JS library needed              |
| Video embeds (YouTube)     | Self-hosted MP4 with poster    | 2024+        | No third-party branding, full styling control     |

**Current project state:**

- OrbitVisual (pure CSS/SVG) is already premium -- 5 rings, 7 dots, arc trails, 12 particles, breathing core
- whileInView already used in 28 files -- scroll animations exist, need standardization
- card-gradient-border exists -- hover effects present, need depth (tilt/parallax)
- No video/screenshot media exists yet on any page

## Technical Constraints (Project-Specific)

1. **Desktop-first:** All new interactions are desktop-primary. Mobile gets simplified versions or disabled (per CLAUDE.md architecture rules)
2. **Living System design tokens:** All new elements must use `--color-accent-system` (#00D4AA/teal), `--color-accent-human` (#F5A623/amber), `--color-bg-deep`, etc.
3. **Font stack:** DM Sans (body), Space Grotesk (display), JetBrains Mono (mono) -- no new fonts
4. **Performance budget:** Hero LCP < 2.5s with Spline loading. Total JS bundle increase from Spline runtime: ~200KB (acceptable for lazy chunk)
5. **Existing patterns:** `useMotionSafe` hook must wrap all new Framer Motion animations. `@media (prefers-reduced-motion: reduce)` must cover CSS animations
6. **Mobile approach:** Spline hidden below `lg` breakpoint (same as OrbitVisual). Video shows poster frame only on mobile. Card tilt disabled on touch devices.

## Media Asset Requirements

These assets must be created/captured before implementation:

| Asset                            | Source                               | Format         | Approximate Size |
| -------------------------------- | ------------------------------------ | -------------- | ---------------- |
| Spline hero scene                | Build in spline.design editor        | .splinecode    | 200-500KB        |
| Product screenshot: Dashboard    | Capture from app.future-marketing.ai | WebP, 1200x800 | 50-100KB         |
| Product screenshot: Chatbot      | Capture from live chatbot widget     | WebP, 800x600  | 40-80KB          |
| Product screenshot: n8n workflow | Capture from FMai n8n instance       | WebP, 1200x800 | 50-100KB         |
| Demo video: Marketing Machine    | Screen record 30-60s workflow        | MP4, 1080p     | 2-5MB            |
| Demo video: poster frames        | Extract from video first frames      | WebP, 1200x800 | 30-60KB          |

**Note:** Asset creation is external to code implementation. Plans should separate "create assets" tasks from "implement components" tasks.

## Open Questions

1. **Spline scene design**
   - What we know: Spline supports cursor-responsive 3D, used by Vercel, can be exported as .splinecode
   - What's unclear: Who designs the Spline scene? Does the user have Spline editor experience? What objects should be in the scene (abstract AI visual, orbit-like, product mockup)?
   - Recommendation: Start with a simple abstract scene (floating geometric shapes in teal/amber) that can be iterated. The OrbitVisual stays as permanent fallback.

2. **Product media availability**
   - What we know: FMai app exists at app.future-marketing.ai, n8n workflows exist
   - What's unclear: Are these products ready for screenshot capture? Are they visually polished enough?
   - Recommendation: Use placeholder screenshots initially (styled mockup frames), swap in real captures when available. Code should not block on media.

3. **Scope of scroll reveals**
   - What we know: 28 files already use whileInView. Some pages (service pages) were rebuilt in Phase 11 with CSS fadeIn heroes.
   - What's unclear: Should scroll reveals replace existing CSS fadeIn patterns or layer on top?
   - Recommendation: Keep CSS fadeIn for hero sections (faster, no JS). Add Framer Motion whileInView ScrollReveal wrapper for below-fold sections that don't have it yet.

## Sources

### Primary (HIGH confidence)

- Project codebase: `src/index.css`, `src/components/common/OrbitVisual.tsx`, `src/hooks/useReducedMotion.ts` -- existing animation infrastructure
- Project `package.json` -- confirmed existing dependencies (framer-motion, three, @react-three/fiber)
- `.planning/phases/12-design-polish-media/RESEARCH-NOTES.md` -- pre-gathered research from Phase 11

### Secondary (MEDIUM confidence)

- [@splinetool/react-spline on npm](https://www.npmjs.com/package/@splinetool/react-spline) -- v4.1.0, React component for Spline scenes
- [@rive-app/react-canvas on npm](https://www.npmjs.com/package/@rive-app/react-canvas) -- v4.27.0, evaluated but not recommended
- [Framer Motion scroll animations docs](https://motion.dev/docs/react-scroll-animations) -- whileInView, useInView patterns
- [Spline performance optimization](https://docs.spline.design/f6351697797e4e41bbf57d62ab905a06) -- lazy loading, render-on-demand
- [Spline lazy-loading case study (DEV.to)](https://dev.to/tolumen/optimizing-web-performance-how-lazy-loading-spline-assets-took-our-build-from-30-to-90-in-4ne2) -- LCP improved from 5.7s to 0.6s with lazy loading

### Tertiary (LOW confidence)

- Card tilt patterns from various blog posts -- implementation details verified against CSS spec but specific library recommendations unverified

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- based on existing project dependencies and npm package verification
- Architecture: HIGH -- patterns derived from existing project codebase (28 files with whileInView, established OrbitVisual, useMotionSafe hook)
- Pitfalls: HIGH -- Spline LCP issue verified with multiple sources, card tilt mobile issue is well-documented CSS behavior
- Media strategy: MEDIUM -- asset requirements are clear but availability depends on external factors

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable domain -- Spline and Framer Motion have infrequent breaking changes)
