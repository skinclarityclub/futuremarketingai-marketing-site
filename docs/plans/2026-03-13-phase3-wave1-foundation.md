# Phase 3 Wave 1: Foundation (Design System + Critical Fixes)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the indigo/violet/pink glassmorphism design system with the "Living System" teal/amber palette, create shared components, and fix all critical UX issues identified in the audit.

**Architecture:** Update design tokens (Tailwind config + CSS variables) first, then build new shared components that use those tokens, then fix critical bugs. Every component uses the new design language: system panels instead of glass cards, sharp corners, monospace data, status indicators.

**Tech Stack:** React 18 + TypeScript + Tailwind CSS 3.4 + Framer Motion 11 + Lucide React icons

---

## Task 1: Update Tailwind Config — New Color Palette

**Files:**

- Modify: `tailwind.config.js`

**Step 1: Replace color tokens**

Replace the entire `colors` block in `tailwind.config.js` with:

```javascript
colors: {
  // Background Colors — "Living System" palette
  'bg-deep': '#0A0D14',
  'bg-surface': '#111520',
  'bg-elevated': '#1A1F2E',

  // Accent Colors — Two-accent system (machine + human)
  'accent-system': '#00D4AA',  // Teal-green: "system running"
  'accent-human': '#F5A623',   // Amber: "human attention needed"

  // Status Colors
  'status-active': '#22C55E',  // Green: live/operational
  'success': '#22C55E',
  'warning': '#F5A623',
  'error': '#EF4444',
  'info': '#00D4AA',

  // Text Colors (WCAG AA — 4.5:1 minimum on #0A0D14)
  'text-primary': '#E8ECF4',
  'text-secondary': '#9BA3B5',
  'text-muted': '#5A6378',

  // Border & Divider
  'border-primary': 'rgba(255, 255, 255, 0.06)',
  'border-accent': 'rgba(0, 212, 170, 0.3)',
  'divider': 'rgba(255, 255, 255, 0.04)',
},
```

**Step 2: Replace font families**

Replace the `fontFamily` block with:

```javascript
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: ['Space Grotesk', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
},
```

**Step 3: Replace box shadows (glow effects)**

Replace the `boxShadow` block with:

```javascript
boxShadow: {
  'glow-sm': '0 0 10px rgba(0, 212, 170, 0.2)',
  'glow': '0 0 20px rgba(0, 212, 170, 0.3)',
  'glow-lg': '0 0 40px rgba(0, 212, 170, 0.4)',
  'glow-amber': '0 0 20px rgba(245, 166, 35, 0.3)',
  'glow-active': '0 0 20px rgba(34, 197, 94, 0.3)',
  'inner-glow': 'inset 0 0 20px rgba(0, 212, 170, 0.15)',
},
```

**Step 4: Replace gradient backgrounds**

Replace the `backgroundImage` block with:

```javascript
backgroundImage: {
  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  'gradient-system': 'linear-gradient(135deg, #00D4AA 0%, #00A88A 100%)',
  'gradient-human': 'linear-gradient(135deg, #F5A623 0%, #D4891A 100%)',
  'gradient-flow': 'linear-gradient(135deg, #00D4AA 0%, #F5A623 100%)',
},
```

**Step 5: Add new animations**

Add these to the existing `animation` and `keyframes` blocks:

```javascript
animation: {
  'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'float': 'float 6s ease-in-out infinite',
  'slide-up': 'slide-up 0.5s ease-out',
  'slide-down': 'slide-down 0.5s ease-out',
  'fade-in': 'fade-in 0.3s ease-in',
  'status-pulse': 'status-pulse 3s ease-in-out infinite',
  'data-flow': 'data-flow 2s linear infinite',
},
keyframes: {
  // ... keep existing keyframes ...
  'status-pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.4' },
  },
  'data-flow': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
},
```

**Step 6: Run dev server to verify no build errors**

Run: `npm run dev`
Expected: Vite compiles successfully (pages will look broken — that's expected, colors changed)

**Step 7: Commit**

```bash
git add tailwind.config.js
git commit -m "refactor: replace indigo/violet/pink palette with Living System teal/amber design tokens"
```

---

## Task 2: Update CSS Custom Properties

**Files:**

- Modify: `src/index.css`

**Step 1: Replace CSS variables in `:root` block (lines 90-116)**

Replace the `:root` CSS variables block with:

```css
:root {
  /* Colors — Living System */
  --color-bg-deep: #0a0d14;
  --color-bg-surface: #111520;
  --color-bg-elevated: #1a1f2e;
  --color-accent-system: #00d4aa;
  --color-accent-human: #f5a623;
  --color-status-active: #22c55e;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Space Grotesk', 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius — sharper for Living System */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

**Step 2: Update body background color**

Change `background-color: var(--color-bg-dark)` to `background-color: var(--color-bg-deep)`.

**Step 3: Update glow utilities (lines 234-250)**

Replace glow effects to use teal:

```css
.glow {
  box-shadow: 0 0 20px rgba(0, 212, 170, 0.3);
}

.glow-hover:hover {
  box-shadow: 0 0 30px rgba(0, 212, 170, 0.5);
  transition: box-shadow 0.3s ease;
}

.glow-amber {
  box-shadow: 0 0 20px rgba(245, 166, 35, 0.3);
}

.glow-green {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}
```

**Step 4: Update gradient text utilities (lines 252-272)**

```css
.gradient-text {
  background: linear-gradient(135deg, #00d4aa 0%, #00a88a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-secondary {
  background: linear-gradient(135deg, #f5a623 0%, #d4891a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-flow {
  background: linear-gradient(135deg, #00d4aa 0%, #f5a623 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Step 5: Update border gradient (lines 274-282)**

```css
.border-gradient {
  border: 2px solid transparent;
  background-image:
    linear-gradient(var(--color-bg-surface), var(--color-bg-surface)),
    linear-gradient(135deg, #00d4aa, #f5a623);
  background-origin: border-box;
  background-clip: padding-box, border-box;
}
```

**Step 6: Update animated gradient (lines 284-301)**

```css
.animated-gradient {
  background: linear-gradient(-45deg, #0a0d14, #111520, #1a1f2e, #111520);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

**Step 7: Update hover-lift glow color (line 329)**

Change `rgba(0, 212, 255, 0.3)` to `rgba(0, 212, 170, 0.2)`.

**Step 8: Update custom scrollbar gradient (lines 360-367)**

```css
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00d4aa 0%, #f5a623 100%);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00e5c4 0%, #ffb833 100%);
}
```

And Firefox scrollbar (line 372):

```css
scrollbar-color: #00d4aa rgba(255, 255, 255, 0.05);
```

**Step 9: Add scan-line overlay utility**

Add at the end of the `@layer utilities` block:

```css
/* Scan-line overlay for system panels */
.scan-lines {
  position: relative;
}
.scan-lines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 212, 170, 0.02) 2px,
    rgba(0, 212, 170, 0.02) 4px
  );
  pointer-events: none;
  border-radius: inherit;
}

/* Noise texture overlay */
.noise-texture {
  position: relative;
}
.noise-texture::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  pointer-events: none;
  border-radius: inherit;
}
```

**Step 10: Verify build**

Run: `npm run dev`
Expected: Compiles successfully

**Step 11: Commit**

```bash
git add src/index.css
git commit -m "refactor: update CSS custom properties to Living System palette with scan-line and noise utilities"
```

---

## Task 3: Add Space Grotesk Font

**Files:**

- Modify: `index.html`

**Step 1: Add Space Grotesk to Google Fonts link**

Find the existing Google Fonts `<link>` in `index.html`. Add Space Grotesk to it. If no Google Fonts link exists, add this to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Step 2: Remove Satoshi font references**

Search for any Satoshi font imports or `@font-face` declarations and remove them.

**Step 3: Verify fonts load**

Run: `npm run dev`
Open browser DevTools → Network tab → filter "fonts" → verify Space Grotesk loads

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Space Grotesk font, remove Satoshi"
```

---

## Task 4: Create SystemPanel Component

**Files:**

- Create: `src/components/common/SystemPanel.tsx`
- Modify: `src/components/common/index.ts`

**Step 1: Create SystemPanel component**

```typescript
import React from 'react'

interface SystemPanelProps {
  children: React.ReactNode
  className?: string
  /** Optional scan-line overlay effect */
  scanLines?: boolean
  /** Show left accent border on hover */
  hoverAccent?: boolean
  /** Make panel interactive (clickable) */
  onClick?: () => void
  id?: string
}

/**
 * SystemPanel — Primary container component for the Living System design.
 * Replaces GlassCard with solid bg-surface + thin border aesthetic.
 */
export const SystemPanel = React.forwardRef<HTMLDivElement, SystemPanelProps>(
  ({ children, className = '', scanLines = false, hoverAccent = false, onClick, id }, ref) => {
    const baseClasses = [
      'bg-bg-surface border border-border-primary rounded-sm',
      'transition-all duration-200',
      scanLines ? 'scan-lines' : '',
      hoverAccent ? 'hover:border-l-2 hover:border-l-accent-system hover:bg-bg-elevated' : '',
      onClick ? 'cursor-pointer' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        id={id}
        className={baseClasses}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onClick()
                }
              }
            : undefined
        }
      >
        {children}
      </div>
    )
  }
)

SystemPanel.displayName = 'SystemPanel'
export default SystemPanel
```

**Step 2: Export from index.ts**

Add to `src/components/common/index.ts`:

```typescript
export { SystemPanel } from './SystemPanel'
```

**Step 3: Verify component imports correctly**

Run: `npm run dev`
Expected: No import errors

**Step 4: Commit**

```bash
git add src/components/common/SystemPanel.tsx src/components/common/index.ts
git commit -m "feat: add SystemPanel component — Living System primary container"
```

---

## Task 5: Create StatusIndicator Component

**Files:**

- Create: `src/components/common/StatusIndicator.tsx`
- Modify: `src/components/common/index.ts`

**Step 1: Create StatusIndicator component**

```typescript
import React from 'react'

type StatusVariant = 'active' | 'attention' | 'inactive' | 'system'

interface StatusIndicatorProps {
  /** Status type controls color */
  variant?: StatusVariant
  /** Optional label text (rendered in monospace) */
  label?: string
  /** Animate with pulse effect */
  pulse?: boolean
  /** Size: sm = 6px, md = 8px, lg = 10px */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantColors: Record<StatusVariant, string> = {
  active: 'bg-status-active',
  attention: 'bg-accent-human',
  inactive: 'bg-text-muted',
  system: 'bg-accent-system',
}

const sizeClasses: Record<string, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}

/**
 * StatusIndicator — Small colored dot with optional pulse and label.
 * Used throughout the Living System design for operational status.
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  variant = 'active',
  label,
  pulse = true,
  size = 'md',
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex">
        <span
          className={`${sizeClasses[size]} rounded-full ${variantColors[variant]} ${
            pulse ? 'animate-status-pulse' : ''
          }`}
        />
      </span>
      {label && (
        <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
          {label}
        </span>
      )}
    </span>
  )
}

export default StatusIndicator
```

**Step 2: Export from index.ts**

Add to `src/components/common/index.ts`:

```typescript
export { StatusIndicator } from './StatusIndicator'
```

**Step 3: Commit**

```bash
git add src/components/common/StatusIndicator.tsx src/components/common/index.ts
git commit -m "feat: add StatusIndicator component — pulsing status dots with monospace labels"
```

---

## Task 6: Create MetricDisplay Component

**Files:**

- Create: `src/components/common/MetricDisplay.tsx`
- Modify: `src/components/common/index.ts`

**Step 1: Create MetricDisplay component**

```typescript
import React from 'react'

interface MetricDisplayProps {
  /** The number/value to display (large, monospace) */
  value: string
  /** Small label below the value */
  label: string
  /** Color accent for the value */
  accent?: 'system' | 'human' | 'active'
  /** Optional prefix (e.g., "<" or "+") */
  prefix?: string
  /** Optional suffix (e.g., "%" or "hrs") */
  suffix?: string
  className?: string
}

const accentColors: Record<string, string> = {
  system: 'text-accent-system',
  human: 'text-accent-human',
  active: 'text-status-active',
}

/**
 * MetricDisplay — Large monospace number with small label.
 * Used for hero metrics, dashboard stats, and data displays.
 */
export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  value,
  label,
  accent = 'system',
  prefix = '',
  suffix = '',
  className = '',
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className={`font-mono text-3xl md:text-4xl font-bold ${accentColors[accent]}`}>
        {prefix}
        {value}
        {suffix}
      </div>
      <div className="font-mono text-xs uppercase tracking-wider text-text-muted mt-2">
        {label}
      </div>
    </div>
  )
}

export default MetricDisplay
```

**Step 2: Export from index.ts**

Add to `src/components/common/index.ts`:

```typescript
export { MetricDisplay } from './MetricDisplay'
```

**Step 3: Commit**

```bash
git add src/components/common/MetricDisplay.tsx src/components/common/index.ts
git commit -m "feat: add MetricDisplay component — large monospace numbers with labels"
```

---

## Task 7: Create CTAButton Component

**Files:**

- Create: `src/components/common/CTAButton.tsx`
- Modify: `src/components/common/index.ts`

**Step 1: Create CTAButton component**

```typescript
import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { CalendlyModal } from './CalendlyModal'

interface CTAButtonProps {
  children: React.ReactNode
  /** Primary: filled teal. Secondary: bordered, transparent */
  variant?: 'primary' | 'secondary'
  /** sm: nav-sized. md: section CTA. lg: hero CTA */
  size?: 'sm' | 'md' | 'lg'
  /** Show arrow icon */
  arrow?: boolean
  /** Open Calendly modal instead of navigating */
  calendly?: boolean
  /** URL for Calendly modal */
  calendlyUrl?: string
  /** href for regular links */
  href?: string
  /** onClick handler */
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

const CALENDLY_COLORS = 'background_color=111520&text_color=e8ecf4&primary_color=00D4AA'
const DEFAULT_CALENDLY_URL = `https://calendly.com/futureai/strategy-call?${CALENDLY_COLORS}`

/**
 * CTAButton — Consistent CTA across all pages.
 * Primary: filled accent-system (teal), sharp corners.
 * Secondary: transparent + border, fills on hover.
 * Can open Calendly modal directly.
 */
export const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  arrow = false,
  calendly = false,
  calendlyUrl,
  href,
  onClick,
  className = '',
  ariaLabel,
}) => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

  const variantClasses = {
    primary:
      'bg-accent-system text-bg-deep font-semibold hover:bg-accent-system/90 active:bg-accent-system/80',
    secondary:
      'bg-transparent border border-border-primary text-text-primary hover:bg-bg-elevated active:bg-bg-elevated/80',
  }

  const sizeClasses = {
    sm: 'min-h-[36px] px-4 py-2 text-sm',
    md: 'min-h-[44px] px-6 py-3 text-base',
    lg: 'min-h-[56px] px-8 py-4 text-lg',
  }

  const baseClasses = [
    'inline-flex items-center justify-center gap-2',
    'rounded-sm transition-all duration-200',
    'no-select touch-active',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ')

  const handleClick = () => {
    if (calendly) {
      setIsCalendlyOpen(true)
    } else if (onClick) {
      onClick()
    }
  }

  const content = (
    <>
      {children}
      {arrow && <ArrowRight className="w-4 h-4" />}
    </>
  )

  // If it's a regular link (not calendly, not onClick)
  if (href && !calendly) {
    return (
      <a href={href} className={baseClasses} aria-label={ariaLabel}>
        {content}
      </a>
    )
  }

  return (
    <>
      <button
        type="button"
        className={baseClasses}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        {content}
      </button>
      {calendly && (
        <CalendlyModal
          isOpen={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
          url={calendlyUrl || DEFAULT_CALENDLY_URL}
        />
      )}
    </>
  )
}

export default CTAButton
```

**Step 2: Export from index.ts**

Add to `src/components/common/index.ts`:

```typescript
export { CTAButton } from './CTAButton'
```

**Step 3: Commit**

```bash
git add src/components/common/CTAButton.tsx src/components/common/index.ts
git commit -m "feat: add CTAButton component — consistent CTA with Calendly modal integration"
```

---

## Task 8: Create SectionContainer Component

**Files:**

- Create: `src/components/common/SectionContainer.tsx`
- Modify: `src/components/common/index.ts`

**Step 1: Create SectionContainer component**

```typescript
import React from 'react'

interface SectionContainerProps {
  children: React.ReactNode
  /** Section ID for anchor links */
  id?: string
  /** Max width: 'md' (768px), 'lg' (1024px), 'xl' (1280px), '2xl' (1400px) */
  maxWidth?: 'md' | 'lg' | 'xl' | '2xl'
  /** Vertical padding size */
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

const maxWidthClasses = {
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
}

const paddingClasses = {
  sm: 'py-12 px-6',
  md: 'py-16 px-6',
  lg: 'py-24 px-6',
}

/**
 * SectionContainer — Consistent section wrapper for all page sections.
 * Centers content, applies consistent padding and max-width.
 */
export const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  id,
  maxWidth = 'xl',
  padding = 'md',
  className = '',
}) => {
  return (
    <section id={id} className={`${paddingClasses[padding]} ${className}`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>{children}</div>
    </section>
  )
}

export default SectionContainer
```

**Step 2: Export from index.ts**

Add to `src/components/common/index.ts`:

```typescript
export { SectionContainer } from './SectionContainer'
```

**Step 3: Commit**

```bash
git add src/components/common/SectionContainer.tsx src/components/common/index.ts
git commit -m "feat: add SectionContainer component — consistent section layout wrapper"
```

---

## Task 9: Fix VoiceAgents Page — Missing Secondary CTA + Trust Metrics

**Files:**

- Modify: `src/pages/VoiceAgentsPage.tsx`

**Step 1: Add secondary CTA to hero section**

In `VoiceAgentsPage.tsx`, find the hero CTA `<motion.div>` (around line 149). Replace the single CTA with two:

```tsx
<motion.div className="flex flex-col sm:flex-row gap-4 justify-center" {...fadeInUp}>
  <a
    href="https://calendly.com/futureai/strategy-call"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
  >
    Book a Demo Call
    <ArrowRight className="w-5 h-5" />
  </a>
  <a
    href="#use-cases"
    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
  >
    See Use Cases
  </a>
</motion.div>
```

**Step 2: Add id="use-cases" to the use cases section**

Find `{/* Use Cases */}` section (line 163). Add `id="use-cases"` to the `<section>` tag:

```tsx
<section id="use-cases" className="py-16 px-6">
```

**Step 3: Add trust metrics row before FAQ section**

Add this section before the `{/* FAQ */}` section:

```tsx
{
  /* Trust Metrics */
}
;<section className="py-12 px-6">
  <div className="max-w-4xl mx-auto">
    <motion.div className="grid grid-cols-3 gap-8 text-center" {...fadeInUp}>
      <div>
        <div className="text-3xl font-bold text-white mb-1">24/7</div>
        <div className="text-sm text-blue-100/60">Always Available</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">500+</div>
        <div className="text-sm text-blue-100/60">Calls Per Day</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-white mb-1">98%</div>
        <div className="text-sm text-blue-100/60">Accuracy Rate</div>
      </div>
    </motion.div>
  </div>
</section>
```

**Step 4: Verify page renders correctly**

Run: `npm run dev`
Navigate to `/voice-agents`
Expected: Two CTAs in hero, trust metrics row visible above FAQ

**Step 5: Commit**

```bash
git add src/pages/VoiceAgentsPage.tsx
git commit -m "fix: add missing secondary CTA and trust metrics to VoiceAgents page"
```

---

## Task 10: Fix Framer Motion Accessibility — prefers-reduced-motion

**Files:**

- Create: `src/hooks/useReducedMotion.ts`
- Modify: `src/hooks/index.ts` (if barrel export exists)

**Step 1: Create useReducedMotion hook**

```typescript
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'

/**
 * Returns animation props that respect prefers-reduced-motion.
 * When reduced motion is preferred, animations are disabled.
 *
 * Usage:
 *   const fadeInUp = useMotionSafe({
 *     initial: { opacity: 0, y: 30 },
 *     whileInView: { opacity: 1, y: 0 },
 *     transition: { duration: 0.5 },
 *   })
 *   <motion.div {...fadeInUp}>
 */
export function useMotionSafe(animationProps: Record<string, unknown>) {
  const shouldReduceMotion = useFramerReducedMotion()

  if (shouldReduceMotion) {
    return {}
  }

  return animationProps
}
```

**Step 2: Export from hooks barrel**

Check if `src/hooks/index.ts` exists. If it does, add:

```typescript
export { useMotionSafe } from './useReducedMotion'
```

**Step 3: Commit**

```bash
git add src/hooks/useReducedMotion.ts src/hooks/index.ts
git commit -m "feat: add useMotionSafe hook — respects prefers-reduced-motion for Framer Motion"
```

---

## Task 11: Fix Mobile Menu Focus Trap

**Files:**

- Modify: `src/components/landing/SimpleHeader.tsx`

**Step 1: Add focus trap to mobile menu**

In `SimpleHeader.tsx`, find the mobile menu open state handler. Add a `useEffect` that traps focus within the mobile menu when open:

After the existing state declarations, add:

```typescript
// Focus trap for mobile menu (WCAG requirement)
useEffect(() => {
  if (!isMobileMenuOpen) return

  const menuEl = document.getElementById('mobile-menu')
  if (!menuEl) return

  const focusableEls = menuEl.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  const firstEl = focusableEls[0]
  const lastEl = focusableEls[focusableEls.length - 1]

  const trapFocus = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault()
        lastEl?.focus()
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault()
        firstEl?.focus()
      }
    }
  }

  document.addEventListener('keydown', trapFocus)
  firstEl?.focus()

  return () => document.removeEventListener('keydown', trapFocus)
}, [isMobileMenuOpen])
```

**Step 2: Add id="mobile-menu" to mobile menu container**

Find the mobile menu `<div>` or `<motion.div>` that contains the mobile nav links. Add `id="mobile-menu"` to it.

**Step 3: Verify focus trapping works**

Run: `npm run dev`
Open mobile viewport (375px). Open hamburger menu. Press Tab — focus should cycle within menu. Press Escape — menu closes.

**Step 4: Commit**

```bash
git add src/components/landing/SimpleHeader.tsx
git commit -m "fix: add focus trap to mobile menu for WCAG keyboard navigation"
```

---

## Task 12: Standardize CTA Destinations — Calendly Modal (Not New Tab)

**Files:**

- Modify: `src/pages/VoiceAgentsPage.tsx`
- Modify: `src/pages/AutomationsPage.tsx`
- Modify: `src/pages/ChatbotsPage.tsx`

**Step 1: Fix VoiceAgentsPage — all Calendly links**

Replace every `<a href="https://calendly.com/futureai/strategy-call" target="_blank" ...>` with a button that opens CalendlyModal.

At the top of the component, add state:

```typescript
const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
```

Import CalendlyModal and useState:

```typescript
import React, { useState } from 'react'
import { CalendlyModal } from '../components/common/CalendlyModal'
```

Replace each Calendly `<a>` tag with:

```tsx
<button
  onClick={() => setIsCalendlyOpen(true)}
  className="..." // keep same classes
>
  Book a Demo Call
  <ArrowRight className="w-5 h-5" />
</button>
```

Add the modal before the closing `</>`:

```tsx
<CalendlyModal
  isOpen={isCalendlyOpen}
  onClose={() => setIsCalendlyOpen(false)}
  url="https://calendly.com/futureai/strategy-call?background_color=111520&text_color=e8ecf4&primary_color=00D4AA"
/>
```

**Step 2: Repeat for AutomationsPage.tsx**

Same pattern — add state, import CalendlyModal, replace `<a>` tags.

**Step 3: Repeat for ChatbotsPage.tsx**

Same pattern.

**Step 4: Verify all CTAs open as modal**

Run: `npm run dev`
Visit `/automations`, `/chatbots`, `/voice-agents`
Click every CTA → should open Calendly modal, NOT new tab

**Step 5: Commit**

```bash
git add src/pages/VoiceAgentsPage.tsx src/pages/AutomationsPage.tsx src/pages/ChatbotsPage.tsx
git commit -m "fix: all Calendly CTAs now open as modal with dark theme, not new tab"
```

---

## Task 13: Fix Footer Emoji — Replace with Lucide Icon

**Files:**

- Modify: `src/components/common/Footer.tsx`

**Step 1: Replace emoji with Lucide icon**

Find the `🗑️` emoji (line 108). Replace it with a Lucide `Trash2` icon.

Add import at top:

```typescript
import { Trash2 } from 'lucide-react'
```

Replace `🗑️ {t('footer.delete_my_data')}` with:

```tsx
;<Trash2 className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
{
  t('footer.delete_my_data')
}
```

**Step 2: Commit**

```bash
git add src/components/common/Footer.tsx
git commit -m "fix: replace emoji icon with Lucide Trash2 in footer"
```

---

## Task 14: Fix Calendly Dark Theme Colors

**Files:**

- Modify: `src/components/common/CalendlyModal.tsx`

**Step 1: Update default Calendly URL**

In `CalendlyModal.tsx`, find the `DEFAULT_CALENDLY_URL` constant (line 13). Update to include dark theme params:

```typescript
const DEFAULT_CALENDLY_URL =
  'https://calendly.com/futureai/strategy-call?background_color=111520&text_color=e8ecf4&primary_color=00D4AA'
```

**Step 2: Update the loading spinner color**

Find `border-accent-primary/30 border-t-accent-primary` (line 241). These will still work since we renamed `accent-primary` to `accent-system` in Tailwind. But let's update to the new token:

Replace `border-accent-primary/30 border-t-accent-primary` with `border-accent-system/30 border-t-accent-system`.

**Step 3: Update the error fallback button color**

Find `bg-blue-600 text-white rounded-lg hover:bg-blue-700` (lines 183, 267). Replace with:

```
bg-accent-system text-bg-deep rounded-sm hover:bg-accent-system/90
```

**Step 4: Commit**

```bash
git add src/components/common/CalendlyModal.tsx
git commit -m "fix: update CalendlyModal with dark theme colors and Living System tokens"
```

---

## Task 15: Verify Everything — Full Build Check

**Files:** None (verification only)

**Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No type errors (or only pre-existing ones)

**Step 2: Run linter**

Run: `npm run lint`
Expected: No new lint errors from our changes

**Step 3: Run dev server and visually check**

Run: `npm run dev`
Check:

- Homepage loads (colors will be different but page renders)
- `/automations` — CTA opens Calendly modal
- `/chatbots` — CTA opens Calendly modal
- `/voice-agents` — 2 CTAs, trust metrics row, CTA opens modal
- Mobile view (375px) — hamburger menu focus trap works

**Step 4: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 5: Final commit (if any straggler fixes needed)**

```bash
git add -A
git commit -m "chore: Wave 1 foundation complete — design tokens, shared components, critical fixes"
```

---

## Summary

| Task | What                                                    | Type              |
| ---- | ------------------------------------------------------- | ----------------- |
| 1    | Tailwind config — new colors, fonts, shadows, gradients | Design tokens     |
| 2    | CSS custom properties — match new palette               | Design tokens     |
| 3    | Add Space Grotesk font                                  | Typography        |
| 4    | SystemPanel component                                   | New component     |
| 5    | StatusIndicator component                               | New component     |
| 6    | MetricDisplay component                                 | New component     |
| 7    | CTAButton component (with Calendly modal)               | New component     |
| 8    | SectionContainer component                              | New component     |
| 9    | VoiceAgents — secondary CTA + trust metrics             | Bug fix           |
| 10   | useMotionSafe hook (prefers-reduced-motion)             | Accessibility fix |
| 11   | Mobile menu focus trap                                  | Accessibility fix |
| 12   | All Calendly CTAs → modal (not new tab)                 | UX fix            |
| 13   | Footer emoji → Lucide icon                              | UI fix            |
| 14   | CalendlyModal dark theme colors                         | UX fix            |
| 15   | Full build verification                                 | QA                |
