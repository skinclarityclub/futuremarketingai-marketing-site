# Phase 11: Living System Full Rebuild - Research

**Researched:** 2026-03-13
**Domain:** Structural UI rebuild -- layout, animations, typography, card patterns
**Confidence:** HIGH

## Summary

Phase 11 is a structural rebuild of the entire site to match the approved prototype (`prototype-2-living-system.html`). This is NOT a color swap (that was Phase 9). This phase changes layouts (centered hero to left-aligned + orbit visual), backgrounds (4 heavy Framer Motion layers to 3 CSS blob animations), card patterns (icon-grid to numbered 2x2 with gradient-border hover), button styling (flat teal to warm amber gradient), navigation (system panel to backdrop-blur with gradient underline), typography (Inter body to DM Sans body), and animation approach (heavy Framer Motion to lightweight CSS keyframes).

The codebase currently has all the right tokens (teal/amber palette, design system colors in tailwind.config.js) but the wrong structure -- components still use centered layouts, 4-column grids, glassmorphism background layers, and flat teal CTAButtons. The prototype shows a fundamentally different aesthetic: left-aligned hero with orbit decoration, gradient mesh blobs as background, 2x2 numbered service cards with `::before` gradient border hover, warm amber gradient buttons, and DM Sans typography.

**Primary recommendation:** Break this into 6-7 sequential plans: (1) Foundation -- typography + global CSS animations + background component, (2) Navigation rebuild, (3) Homepage hero + service cards, (4) Service pages structural rebuild, (5) Supporting pages structural rebuild, (6) MarketingMachinePage i18n + rebuild, (7) Mobile hero + Footer cleanup.

<phase_requirements>

## Phase Requirements

| ID                        | Description                                                                                                                                                                              | Research Support                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| REQ-LIVING-SYSTEM-REBUILD | Complete structural rebuild of every page to match prototype-2-living-system.html. Preserve all content/routes/i18n/functionality; change only visual structure, layout, and animations. | All sections below provide implementation patterns extracted from the prototype. |

</phase_requirements>

## Standard Stack

### Core (already installed)

| Library       | Version | Purpose    | Status                                    |
| ------------- | ------- | ---------- | ----------------------------------------- |
| React         | 18.3+   | Framework  | Existing                                  |
| Tailwind CSS  | 3.4+    | Styling    | Existing -- config needs updates          |
| Framer Motion | 11.0+   | Animations | Existing -- usage will be REDUCED         |
| React Router  | 6.22+   | Routing    | Unchanged                                 |
| react-i18next | -       | i18n       | Existing -- MarketingMachinePage needs it |
| Lucide React  | -       | Icons      | Existing                                  |

### New Dependencies

| Library                | Purpose   | Why                                                          |
| ---------------------- | --------- | ------------------------------------------------------------ |
| DM Sans (Google Fonts) | Body font | Prototype uses DM Sans as primary body font instead of Inter |

**No new npm packages required.** DM Sans is a Google Font loaded via `<link>` in `index.html`.

### Font Changes Required

- **Add:** DM Sans (weights 300, 400, 500, 600, 700) to Google Fonts link in `index.html`
- **Update:** `tailwind.config.js` -- `fontFamily.sans` from `Inter` to `DM Sans`
- **Update:** `index.css` -- CSS variable `--font-sans` from `Inter` to `DM Sans`
- **Keep:** Space Grotesk (display/headings), JetBrains Mono (data/monospace)
- **Keep:** Inter available as fallback (don't remove from Google Fonts link)

## Architecture Patterns

### Pattern 1: Gradient Mesh Background (replaces 4 Framer Motion layers)

**Current:** Hero.tsx has NeuralNetwork, HolographicGrid, FloatingParticles, GradientOrbs -- all using Framer Motion with 50+ animated elements.

**Target:** 3 CSS-only blobs with `filter: blur(100px)` and CSS keyframe animations.

```css
/* From prototype-2-living-system.html */
.gradient-mesh {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  will-change: transform;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: var(--accent-warm); /* #F5A623 */
  top: -10%;
  right: -5%;
  animation: blobFloat1 25s ease-in-out infinite;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: var(--accent-cool); /* #0ABAB5 */
  bottom: -15%;
  left: -10%;
  animation: blobFloat2 30s ease-in-out infinite;
}

.blob-3 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-cool));
  top: 40%;
  left: 50%;
  animation: blobFloat3 22s ease-in-out infinite;
}
```

**Implementation:** Create a `<GradientMesh />` component (pure CSS, no Framer Motion) that lives in `src/components/common/`. Use `position: fixed` so it covers all pages. Render it once in `AppLayout` or `App.tsx` rather than per-page.

**Key decision:** The prototype uses `position: fixed` for the gradient mesh -- this means it's a global background, not per-section. This is simpler than the current per-section approach.

### Pattern 2: Hero Layout -- Left-Aligned + Orbit Visual

**Current:** Centered layout with badge, headline, description, CTA all centered. 4 background layers.

**Target:** Left-aligned content (max-width 720px) with orbit visual positioned absolute on the right side.

```
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 140px 48px 80px;  /* Left-aligned, not centered */
}

.hero-visual {
    position: absolute;
    right: 8%;
    top: 50%;
    transform: translateY(-50%);
    width: 340px; height: 340px;
}
```

**Orbit visual structure:**

- 3 concentric orbit rings (`border: 1px solid rgba(255,255,255,0.04)`, `animation: spin 40s/30s/20s`)
- Each ring has a colored dot (warm, cool, white)
- Center shows "FM" text with gradient

**Mobile (<=1024px):** Orbit visual hidden via `display: none`. Hero centers content.

### Pattern 3: Service Cards -- Numbered 2x2 Grid with Gradient Border Hover

**Current:** 4-column icon cards with `MotionLink`, Lucide icons, `bg-bg-surface` background.

**Target:** 2x2 grid, numbered (01-04), `::before` pseudo-element gradient border on hover, arrow circles.

```css
.service-card {
  position: relative;
  padding: 44px 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.5s ease;
}

/* CRITICAL: Gradient border hover effect using mask */
.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, transparent, transparent);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  transition: background 0.5s ease;
}

.service-card:hover::before {
  background: linear-gradient(135deg, var(--accent-warm), var(--accent-cool));
}

.service-card:hover {
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

**Implementation in Tailwind:** The `::before` mask trick cannot be done purely with Tailwind utilities. Options:

1. Add a CSS utility class (`.card-gradient-border`) in `index.css` -- **RECOMMENDED**
2. Use inline styles on the pseudo-element -- not possible in React without a wrapper
3. Use a child div that simulates the border -- less clean

**Arrow circle pattern:**

```html
<div class="service-arrow">
  <!-- 40x40, rounded-full, border -->
  <svg><!-- diagonal arrow --></svg>
</div>
<!-- On hover: bg-accent-warm, border-accent-warm, svg color changes to dark -->
```

### Pattern 4: Button Design -- Warm Gradient CTA

**Current CTAButton:** Flat teal (`bg-accent-system`), sharp corners (`rounded-sm`).

**Target:** Warm amber gradient, rounded-14px, dark text.

```css
.btn-warm {
  padding: 16px 36px;
  background: linear-gradient(135deg, var(--accent-warm), #e8941a);
  color: #0c0c14;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
}

.btn-warm:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(245, 166, 35, 0.3);
}
```

**Secondary button (glass):**

```css
.btn-glass {
  padding: 16px 36px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
}
```

**Impact:** CTAButton component needs significant rework:

- Primary variant: `bg-accent-system` -> `bg-gradient-to-br from-accent-human to-[#E8941A]`
- Border radius: `rounded-sm` -> `rounded-[14px]`
- Text color: needs to be dark (`text-bg-deep`) on primary
- Hover: add translateY(-2px) + amber glow shadow
- Secondary variant: glass effect with backdrop-blur

### Pattern 5: Navigation -- Backdrop-Blur with Gradient Underline

**Current:** `bg-bg-surface/95`, no backdrop-blur, `rounded-sm` container, Sparkles icon logo.

**Target:** `rgba(12,12,20,0.5)` + `backdrop-filter: blur(24px)`, full-width (not floating container), gradient underline on link hover, FMai text logo with gradient "ai" suffix.

```css
nav {
  position: fixed;
  padding: 20px 48px;
  background: rgba(12, 12, 20, 0.5);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border);
}

.nav-center a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-warm), var(--accent-cool));
  transition: width 0.3s ease;
}

.nav-center a:hover::after {
  width: 100%;
}
```

**Logo change:** Replace Sparkles icon + "Future{brandMiddle}AI" with text-only "FM" + gradient "ai".

**Nav CTA button:** Uses warm gradient (`.nav-btn`) not flat teal.

### Pattern 6: CSS Animations (replace Framer Motion where appropriate)

**Prototype animations (CSS-only):**

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Blob floating already defined above */
```

**Strategy:** Keep Framer Motion for:

- Scroll-triggered animations (`whileInView`) -- these need intersection observer
- AnimatePresence (enter/exit transitions for dropdowns, modals)
- Complex orchestrated sequences

**Replace with CSS for:**

- Simple fade-in on page load (hero elements)
- Floating/pulsing animations (particles, decorative elements)
- Blob background animations
- Orbit ring spinning

### Anti-Patterns to Avoid

- **DO NOT modify mobile components for desktop layout changes.** Desktop-first architecture means mobile components (SimplifiedHeroMobile, MobileDemoHome) are separate files.
- **DO NOT break existing i18n.** Hero, header, and most pages use translation keys. Keep all `t()` calls working.
- **DO NOT remove Framer Motion entirely.** It's still needed for scroll animations, AnimatePresence, and page transitions.
- **DO NOT change route paths.** All existing routes must continue to work.
- **DO NOT change component file locations.** Keep files where they are, rebuild internals.

## Don't Hand-Roll

| Problem               | Don't Build                 | Use Instead                     | Why                                                          |
| --------------------- | --------------------------- | ------------------------------- | ------------------------------------------------------------ |
| Gradient border hover | Custom JS border animation  | CSS `::before` + mask technique | Pure CSS, GPU-accelerated, no JS                             |
| Floating background   | Framer Motion per-particle  | CSS keyframe animations         | 50+ Framer Motion elements -> 3 CSS blobs = massive perf win |
| Scroll animations     | Custom IntersectionObserver | Framer Motion `whileInView`     | Already have Framer Motion, `whileInView` is clean           |
| Orbit spinning        | Framer Motion rotate        | CSS `animation: spin`           | Simpler, no JS, infinite spin                                |
| Font loading          | @font-face declarations     | Google Fonts CDN link           | Already using Google Fonts for Inter/Space Grotesk           |

## Common Pitfalls

### Pitfall 1: Breaking the Gradient Border Mask on Safari

**What goes wrong:** The `mask-composite: exclude` property has different syntax across browsers.
**Why it happens:** Safari uses `-webkit-mask-composite: xor` while standards use `mask-composite: exclude`.
**How to avoid:** Always include both prefixed and unprefixed versions:

```css
-webkit-mask:
  linear-gradient(#fff 0 0) content-box,
  linear-gradient(#fff 0 0);
-webkit-mask-composite: xor;
mask-composite: exclude;
```

**Warning signs:** Gradient border visible as filled rectangle instead of just border on Safari.

### Pitfall 2: Fixed Background Mesh Breaking Scroll on iOS

**What goes wrong:** `position: fixed` elements with large blur filters can cause scroll jank on iOS Safari.
**Why it happens:** iOS Safari hardware-accelerates fixed elements poorly with heavy filter operations.
**How to avoid:** Add `will-change: transform` and keep blur to 100px (not higher). Consider `transform: translateZ(0)` as GPU hint.
**Warning signs:** Scroll performance degradation on iPhone/iPad.

### Pitfall 3: CTAButton Changes Breaking Existing Pages

**What goes wrong:** Changing CTAButton globally breaks every page that uses it.
**Why it happens:** CTAButton is used in 15+ locations across all pages. Changing rounded-sm to rounded-[14px] and colors globally affects everything at once.
**How to avoid:** Update CTAButton component first (Plan 1 or 2), then all pages naturally inherit the new style. Test each page after the change.

### Pitfall 4: DM Sans Font Flash (FOUT)

**What goes wrong:** Users see Inter briefly before DM Sans loads.
**Why it happens:** Adding a new font to Google Fonts link increases payload.
**How to avoid:** Add `display=swap` (already in the Google Fonts URL). Preconnect already configured. DM Sans is ~45KB for 5 weights -- acceptable.

### Pitfall 5: Removing Background Components Breaks Hero Layout

**What goes wrong:** Removing NeuralNetwork/HolographicGrid/FloatingParticles/GradientOrbs components causes Hero layout to collapse or lose visual interest.
**Why it happens:** These components provide the visual backdrop. Removing without replacing leaves a flat dark page.
**How to avoid:** Add the GradientMesh component BEFORE removing old background layers. Test visual appearance at each step.

### Pitfall 6: MarketingMachinePage i18n Scope Creep

**What goes wrong:** Adding i18n to MarketingMachinePage touches 50+ strings, each needing EN/NL/ES translations.
**Why it happens:** The page has pricing tiers, feature lists, CTAs, headings all hardcoded in English.
**How to avoid:** Create translation keys in a dedicated `marketing-machine` namespace or under `common`. Focus on user-visible strings only. NL/ES translations can use English as placeholder initially.

### Pitfall 7: Prototype Border-Radius Mismatch with Tailwind Config

**What goes wrong:** Prototype uses `border-radius: 20px` for cards and `14px` for buttons, but Tailwind config has `rounded-sm: 0.25rem`.
**Why it happens:** Phase 3/9 established sharp corners (rounded-sm = 4px). Prototype uses much rounder values.
**How to avoid:** Add custom Tailwind values: `rounded-card: 20px`, `rounded-btn: 14px`. Or use arbitrary values: `rounded-[20px]`, `rounded-[14px]`.

## Code Examples

### GradientMesh Component (React)

```tsx
// New component: src/components/common/GradientMesh.tsx
export const GradientMesh: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="blob blob-warm" />
    <div className="blob blob-cool" />
    <div className="blob blob-mixed" />
  </div>
)
```

With CSS in index.css:

```css
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.12;
  will-change: transform;
}
.blob-warm {
  width: 600px;
  height: 600px;
  background: #f5a623;
  top: -10%;
  right: -5%;
  animation: blobFloat1 25s ease-in-out infinite;
}
.blob-cool {
  width: 500px;
  height: 500px;
  background: #0abab5;
  bottom: -15%;
  left: -10%;
  animation: blobFloat2 30s ease-in-out infinite;
}
.blob-mixed {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f5a623, #0abab5);
  top: 40%;
  left: 50%;
  animation: blobFloat3 22s ease-in-out infinite;
}
```

### Orbit Visual Component

```tsx
// New component: src/components/common/OrbitVisual.tsx
export const OrbitVisual: React.FC = () => (
  <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] hidden lg:block">
    {[
      { inset: '0', duration: '40s', color: '#F5A623', shadow: 'rgba(245,166,35,0.4)' },
      {
        inset: '40px',
        duration: '30s',
        color: '#0ABAB5',
        shadow: 'rgba(10,186,181,0.4)',
        reverse: true,
      },
      { inset: '80px', duration: '20s', color: '#F0EDE8', shadow: 'rgba(240,237,232,0.3)' },
    ].map((ring, i) => (
      <div
        key={i}
        className="absolute border border-white/[0.04] rounded-full"
        style={{
          inset: ring.inset,
          animation: `spin ${ring.duration} linear infinite${ring.reverse ? ' reverse' : ''}`,
        }}
      >
        <div
          className="absolute w-2 h-2 rounded-full -top-1 left-1/2"
          style={{
            background: ring.color,
            boxShadow: `0 0 16px ${ring.shadow}`,
          }}
        />
      </div>
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-[28px] tracking-tight bg-gradient-flow bg-clip-text text-transparent">
      FM
    </div>
  </div>
)
```

### Card Gradient Border Utility (CSS)

```css
/* Add to index.css @layer utilities */
.card-gradient-border {
  position: relative;
  overflow: hidden;
}
.card-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, transparent, transparent);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  transition: background 0.5s ease;
  pointer-events: none;
}
.card-gradient-border:hover::before {
  background: linear-gradient(135deg, #f5a623, #0abab5);
}
```

### Updated CTAButton Variants

```tsx
// Updated variant classes for CTAButton
const variantClasses = {
  primary:
    'bg-gradient-to-br from-accent-human to-[#E8941A] text-bg-deep font-semibold hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,166,35,0.3)]',
  secondary:
    'bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] text-text-primary hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5',
}

// Updated border radius
// rounded-sm -> rounded-[14px]
```

## State of the Art

| Old Approach (Current)                   | New Approach (Prototype)                | Impact                                                  |
| ---------------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| Inter body font                          | DM Sans body font                       | Softer, more modern feel                                |
| Centered hero layout                     | Left-aligned hero + orbit visual        | More editorial, less "SaaS template"                    |
| 4 Framer Motion bg layers (50+ elements) | 3 CSS blob animations                   | Massive performance improvement                         |
| 4-column icon service cards              | 2x2 numbered cards with gradient border | More spacious, premium feel                             |
| Flat teal CTA buttons                    | Warm amber gradient buttons             | Warmer, more inviting CTA                               |
| Sharp corners (rounded-sm = 4px)         | Rounded cards (20px) + buttons (14px)   | Softer aesthetic                                        |
| System panel surface bg                  | Subtle transparent bg (rgba 0.02)       | Lighter, less "dashboard"                               |
| bg-bg-deep (#0A0D14)                     | --bg: #0C0C14                           | Slightly different dark -- KEEP #0A0D14 for consistency |

**Note on background color:** The prototype uses `#0C0C14` as `--bg` while the current site uses `#0A0D14` as `bg-deep`. These are nearly identical. Recommendation: keep `#0A0D14` to avoid a full token change for 2 hex digits of difference.

**Note on accent colors:** The prototype uses `--accent-cool: #0ABAB5` while the current site uses `accent-system: #00D4AA`. These are close but NOT identical. Recommendation: keep `#00D4AA` -- it's the established brand color from Phase 3. The prototype was an exploration; the token system is the source of truth.

## Detailed Audit: What Changes Per File

### Homepage

| File                       | Current State                                             | Changes Needed                                                                          |
| -------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Hero.tsx`                 | Centered layout, 4 bg layers, 4-col cards, flat teal CTAs | Left-align hero, orbit visual, 2x2 numbered cards, warm gradient CTAs, remove bg layers |
| `LandingPage.tsx`          | Minimal wrapper                                           | Add GradientMesh if not global                                                          |
| `SimplifiedHeroMobile.tsx` | Grid bg, particles, centered                              | Rebuild with blob bg, simplified orbit or remove, warm CTAs                             |

### Navigation

| File               | Current State                                                | Changes Needed                                                                         |
| ------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `SimpleHeader.tsx` | Floating container, rounded-sm, Sparkles icon, flat teal CTA | Full-width blur nav, gradient underline hovers, FM+gradient-ai logo, warm gradient CTA |

### Footer

| File         | Current State                     | Changes Needed                                                                                                                                                                                                    |
| ------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Footer.tsx` | 12 hardcoded slate/indigo classes | Replace text-slate-300 -> text-text-secondary, border-slate-600 -> border-border-primary, hover:text-indigo-400 -> hover:text-accent-system, text-slate-500 -> text-text-muted, text-slate-600 -> text-text-muted |

### Shared Components

| File               | Current State         | Changes Needed                                         |
| ------------------ | --------------------- | ------------------------------------------------------ |
| `CTAButton.tsx`    | Flat teal, rounded-sm | Warm gradient primary, glass secondary, rounded-[14px] |
| `GradientMesh.tsx` | Does not exist        | CREATE -- global gradient mesh background              |
| `OrbitVisual.tsx`  | Does not exist        | CREATE -- hero orbit decoration                        |

### Service Pages

| File                       | Current State                          | Changes Needed                                                           |
| -------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `AutomationsPage.tsx`      | Living System tokens, flat layout      | Add gradient mesh, card-gradient-border, warm CTAs, rounded-[20px] cards |
| `ChatbotsPage.tsx`         | Living System tokens, flat layout      | Same as Automations                                                      |
| `VoiceAgentsPage.tsx`      | Living System tokens, flat layout      | Same as Automations                                                      |
| `MarketingMachinePage.tsx` | Living System tokens, ALL HARDCODED EN | Add i18n support + structural rebuild                                    |

### Supporting Pages

| File                 | Current State        | Changes Needed               |
| -------------------- | -------------------- | ---------------------------- |
| `AboutPage.tsx`      | Living System tokens | Card redesign, warm CTAs     |
| `PricingPage.tsx`    | Living System tokens | Card redesign, warm CTAs     |
| `HowItWorksPage.tsx` | Living System tokens | Card redesign, warm CTAs     |
| `ContactPage.tsx`    | Living System tokens | Card redesign, warm CTAs     |
| `LegalPage.tsx`      | Living System tokens | Minimal -- mainly typography |

## Tailwind Config Changes Needed

```js
// tailwind.config.js additions
borderRadius: {
  // Existing...
  'card': '20px',    // Prototype card radius
  'btn': '14px',     // Prototype button radius
  'nav-btn': '12px', // Nav button radius
},
fontFamily: {
  sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  display: ['Space Grotesk', 'DM Sans', 'sans-serif'],
  mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
},
```

## Open Questions

1. **Should GradientMesh be global (App.tsx) or per-page?**
   - What we know: Prototype uses `position: fixed` (global). Current bg layers are per-section in Hero.tsx.
   - Recommendation: Global in App.tsx -- simpler, consistent across all pages, matches prototype intent.

2. **How far to deviate from rounded-sm convention?**
   - What we know: Phase 3/9 established sharp corners. Prototype uses 20px cards, 14px buttons.
   - Recommendation: Update to match prototype. The prototype IS the approved design. Add `rounded-card` and `rounded-btn` tokens.

3. **Should orbit visual be on homepage only or reusable?**
   - What we know: Prototype only shows it on hero section.
   - Recommendation: Homepage only. Other pages get the gradient mesh background but no orbit.

4. **MarketingMachinePage i18n -- which namespace?**
   - What we know: Other pages use `common` namespace. MarketingMachinePage has ~50 hardcoded strings.
   - Recommendation: Create `marketing-machine` i18n namespace to avoid bloating `common.json`. Or add under `common.marketing_machine.*`.

## Sources

### Primary (HIGH confidence)

- `prototype-2-living-system.html` (root of repo) -- complete CSS extracted, all patterns documented above
- `tailwind.config.js` -- current token configuration verified
- `src/index.css` -- current CSS custom properties and utilities verified
- `src/components/landing/Hero.tsx` -- current hero implementation analyzed
- `src/components/landing/SimpleHeader.tsx` -- current nav implementation analyzed
- `src/components/common/Footer.tsx` -- hardcoded slate/indigo classes confirmed (12 instances)
- `src/components/common/CTAButton.tsx` -- current variant system analyzed
- `src/pages/MarketingMachinePage.tsx` -- zero i18n usage confirmed (no `useTranslation` import)
- `index.html` -- current Google Fonts link (Inter + JetBrains Mono + Space Grotesk)

### Secondary (MEDIUM confidence)

- CSS `mask-composite` browser support -- well-documented pattern, Safari prefix required

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- no new dependencies, only font addition and config changes
- Architecture: HIGH -- prototype is fully specified HTML/CSS, patterns extracted directly
- Pitfalls: HIGH -- based on direct code analysis of current vs target state
- i18n scope: MEDIUM -- MarketingMachinePage string count is estimated (~50 strings)

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- prototype is locked, codebase is known)
