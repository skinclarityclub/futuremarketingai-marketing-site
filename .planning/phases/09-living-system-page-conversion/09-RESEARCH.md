---
phase: 09
name: Living System Page Conversion
researched: 2026-03-13
domain: React/Tailwind design token migration — glassmorphism to Living System
confidence: HIGH
---

# Phase 9: Living System Page Conversion - Research

**Researched:** 2026-03-13
**Domain:** React/Tailwind CSS class migration, design token adoption, page-by-page refactor
**Confidence:** HIGH

## Summary

Phase 3 Wave 1 established the full Living System design token foundation (tailwind.config.js, CSS custom properties, 5 shared components). However, 126 files across the codebase still use the old indigo/violet/blue/purple glassmorphism classes. Phase 9 converts all public-facing pages to the new token system.

The work is primarily mechanical: swap old Tailwind utility classes and inline styles for new tokens, replace glassmorphism patterns (backdrop-blur + bg-white/N) with solid SystemPanel surfaces, and adopt CTAButton/SectionContainer in place of ad-hoc button/layout code. Every page follows the same structural pattern — SimpleHeader + page wrapper div + sections + (global Footer) — which makes conversion highly parallelisable.

The primary risk is regressions in Framer Motion usage (motion.div wrappers around converted elements must preserve animation props), brand text leakage ("Future AI" → "FMai"), and missing Calendly dark-theme params in any CTAs that are hand-rolled rather than using CTAButton.

**Primary recommendation:** Convert pages in priority order (Homepage components, then service trio, then supporting pages), replacing every old-color class with its Living System token equivalent and migrating card/button patterns to shared components.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design System (LOCKED — from Phase 3)**

- Living System palette: teal (#00D4AA) + amber (#F5A623) on deep dark (#0A0D14)
- Backgrounds: bg-deep (#0A0D14), bg-surface (#111520), bg-elevated (#1A1F2E)
- Text: text-primary (#E8ECF4), text-secondary (#9BA3B5), text-muted (#5A6378)
- Font stack: Inter (body), Space Grotesk (display), JetBrains Mono (data)
- Sharp corners (rounded-sm), not rounded-lg/xl
- System panels instead of glass cards
- Approved prototype: `prototype-2-living-system.html`

**Scope (LOCKED)**

- Homepage (Hero, Header, Footer, Features, Social Proof)
- Service pages (AutomationsPage, ChatbotsPage, VoiceAgentsPage)
- Supporting pages (About, Pricing, Contact, HowItWorks, Legal)
- Common components (FloatingNav, Button, CookieConsent, LoadingFallback, etc.)
- CSS utilities in src/index.css (remaining old rgba(79,70,229) references)

**Existing Living System Components (USE, don't recreate)**

- SystemPanel — primary container (replaces GlassCard)
- StatusIndicator — pulsing status dots
- MetricDisplay — large monospace numbers
- CTAButton — consistent CTA with Calendly modal
- SectionContainer — layout wrapper

**Brand (LOCKED)**

- "Future AI" → "FMai" rebrand where visible
- Calendly URLs use dark theme params: background_color=111520&text_color=e8ecf4&primary_color=00D4AA

### Claude's Discretion

- Order of page conversion (suggest: homepage first, then service pages, then supporting pages)
- How to handle complex components (AI assistant panel, calculator, etc.) — may need separate phase
- Whether to convert rarely-visited pages (careers, partners) or defer

### Deferred Ideas (OUT OF SCOPE)

- AI Assistant panel redesign (complex, many sub-components)
- Calculator feature redesign (self-contained feature)
- Dashboard/Explorer pages (behind auth, low priority)
- Command Center components (complex, internal tools)
  </user_constraints>

---

## Standard Stack

### Core (Already Installed)

| Library       | Version | Purpose                                                    | Status               |
| ------------- | ------- | ---------------------------------------------------------- | -------------------- |
| Tailwind CSS  | v3      | All utility classes — tokens already in tailwind.config.js | Active, tokens ready |
| Framer Motion | current | Page/section animations — preserve, update colors only     | Active               |
| React         | 18      | Component framework                                        | Active               |
| Lucide React  | current | Icon library — already in use throughout                   | Active               |

### Living System Shared Components (Already Exported from src/components/common/index.ts)

| Component          | Replaces                                                                        | Import                                                    |
| ------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `SystemPanel`      | All glassmorphism cards (`bg-white/5 backdrop-blur border-white/10 rounded-xl`) | `import { SystemPanel } from '../components/common'`      |
| `CTAButton`        | All hand-rolled `<button>` / `<a>` CTA elements                                 | `import { CTAButton } from '../components/common'`        |
| `SectionContainer` | Inline `max-w-NNN mx-auto px-6` section wrappers                                | `import { SectionContainer } from '../components/common'` |
| `StatusIndicator`  | Hand-rolled pulsing dots                                                        | `import { StatusIndicator } from '../components/common'`  |
| `MetricDisplay`    | Hand-rolled metric number blocks                                                | `import { MetricDisplay } from '../components/common'`    |

### No New Dependencies Needed

This phase is a pure refactor. All tools and components are already installed and exported.

---

## Architecture Patterns

### Recommended Conversion Order

```
Priority 1 — Homepage foundation (highest visibility)
  src/components/landing/SimpleHeader.tsx
  src/components/landing/Hero.tsx
  src/components/landing/Footer.tsx
  src/components/landing/SocialProof.tsx
  src/components/landing/FeaturesSection.tsx
  src/components/landing/FeatureShowcase.tsx

Priority 2 — Service pages (conversion pages, direct revenue)
  src/pages/AutomationsPage.tsx
  src/pages/ChatbotsPage.tsx
  src/pages/VoiceAgentsPage.tsx

Priority 3 — Supporting pages
  src/pages/AboutPage.tsx
  src/pages/PricingPage.tsx
  src/pages/ContactPage.tsx
  src/pages/HowItWorksPage.tsx
  src/pages/LegalPage.tsx

Priority 4 — Common components
  src/components/common/LoadingFallback.tsx
  src/components/common/FloatingNav.tsx
  src/components/common/CookieConsent.tsx (wraps react-cookie-consent)
  src/index.css (cta-pulse keyframe rgba references)
```

### Pattern 1: Page Wrapper Background

**Old glassmorphism pattern:**

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
```

**New Living System pattern:**

```tsx
<div className="min-h-screen bg-bg-deep">
```

### Pattern 2: Glass Card → SystemPanel

**Old glassmorphism card:**

```tsx
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">...content</div>
```

**New SystemPanel:**

```tsx
import { SystemPanel } from '../components/common'

;<SystemPanel className="p-8">...content</SystemPanel>
```

SystemPanel provides: `bg-bg-surface border border-border-primary rounded-sm transition-all duration-200`

For interactive panels, use `hoverAccent` prop:

```tsx
<SystemPanel hoverAccent className="p-6">
  ...
</SystemPanel>
```

### Pattern 3: CTA Buttons

**Old blue/purple gradient button:**

```tsx
<button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
  Get Started <ArrowRight />
</button>
```

**New CTAButton (handles Calendly internally):**

```tsx
import { CTAButton } from '../components/common'

;<CTAButton size="lg" calendly arrow>
  Get Started
</CTAButton>
```

For non-Calendly links:

```tsx
<CTAButton href="/contact" size="md" arrow>
  Contact Us
</CTAButton>
```

**IMPORTANT:** Remove local `const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)` state when switching to CTAButton — CTAButton manages its own modal state internally.

### Pattern 4: Badge/Pill Chips

**Old blue/purple badge:**

```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
  <Zap className="w-4 h-4 text-blue-400" />
  <span className="text-sm font-medium text-blue-100">Tag text</span>
</div>
```

**New Living System badge:**

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
  <Zap className="w-4 h-4 text-accent-system" />
  <span className="text-sm font-medium text-text-secondary">Tag text</span>
</div>
```

Note: `rounded-sm` (not rounded-full) — Living System uses sharp corners.

### Pattern 5: Section Headings with Gradient Text

**Old purple gradient heading:**

```tsx
<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
```

**New Living System flow gradient:**

```tsx
<h2 className="text-3xl font-display font-bold text-text-primary">
  <span className="bg-gradient-flow bg-clip-text text-transparent">Heading</span>
</h2>
```

`gradient-flow` is defined in tailwind.config.js: `linear-gradient(135deg, #00D4AA 0%, #F5A623 100%)`

### Pattern 6: Icon Colors

| Old                                | New                                                    |
| ---------------------------------- | ------------------------------------------------------ |
| `text-blue-400`                    | `text-accent-system` (teal, for system/feature icons)  |
| `text-purple-400`                  | `text-accent-human` (amber, for human/attention icons) |
| `text-cyan-400`                    | `text-accent-system`                                   |
| `text-red-400` (pain points)       | `text-error`                                           |
| `text-white`                       | `text-text-primary`                                    |
| `text-blue-100` / `text-slate-400` | `text-text-secondary`                                  |
| `text-blue-100/80`                 | `text-text-muted`                                      |

### Pattern 7: Header/Footer Conversion (SimpleHeader)

SimpleHeader currently uses:

- `bg-slate-950/90 backdrop-blur-2xl` → `bg-bg-surface/95 border-border-primary`
- `bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500` (brand text) → `text-accent-system`
- `bg-gradient-to-r from-blue-500 to-cyan-500` (CTA button) → `bg-accent-system text-bg-deep`
- `text-blue-400` (active links) → `text-accent-system`
- `bg-blue-500/10` (active state bg) → `bg-accent-system/10`
- `text-slate-400` (inactive links) → `text-text-secondary`
- `bg-slate-900/95 backdrop-blur-xl` (dropdowns) → `bg-bg-elevated border border-border-primary`

### Pattern 8: LoadingFallback Conversion

```tsx
// Old
<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
  <div className="border-4 border-blue-500/30 border-t-blue-500 rounded-full">

// New
<div className="fixed inset-0 flex items-center justify-center bg-bg-deep">
  <div className="border-4 border-accent-system/30 border-t-accent-system rounded-sm">
```

### Pattern 9: CSS Custom Property Update (src/index.css)

The `cta-pulse` keyframe uses `rgba(79, 70, 229, *)` (indigo). Update to teal:

```css
/* Old */
@keyframes cta-pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 0 rgba(79, 70, 229, 0),
      0 0 8px 0 rgba(79, 70, 229, 0);
  }
  50% {
    box-shadow:
      0 0 0 4px rgba(79, 70, 229, 0.15),
      0 0 16px 2px rgba(79, 70, 229, 0.25);
  }
}

/* New — matches accent-system #00D4AA */
@keyframes cta-pulse {
  0%,
  100% {
    box-shadow:
      0 0 0 0 rgba(0, 212, 170, 0),
      0 0 8px 0 rgba(0, 212, 170, 0);
  }
  50% {
    box-shadow:
      0 0 0 4px rgba(0, 212, 170, 0.15),
      0 0 16px 2px rgba(0, 212, 170, 0.25);
  }
}
```

### Pattern 10: Framer Motion Preservation Rule

When converting a `motion.div` that wraps glassmorphism content, **keep the motion wrapper, only change className**:

```tsx
// Correct — animation preserved, colors updated
<motion.div
  className="bg-bg-surface border border-border-primary rounded-sm p-6"  // updated
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: i * 0.1 }}
  viewport={{ once: true }}
>

// Do NOT replace motion.div with SystemPanel if the element has animation props
// SystemPanel supports forwardRef — but only use it when animations aren't needed
```

### Anti-Patterns to Avoid

- **Keeping `rounded-xl` / `rounded-2xl`:** Living System uses `rounded-sm` exclusively. Replace all rounded-lg/xl/2xl on panel/card elements.
- **Keeping `backdrop-blur` on panels:** SystemPanel uses solid `bg-bg-surface`, not blur. Remove backdrop-blur from converted cards.
- **New Calendly state management:** Never add `useState(isCalendlyOpen)` — CTAButton handles this internally.
- **Mixing old and new icons:** Keep all icons as Lucide React. No emojis as UI icons (ui-ux-pro-max SKILL.md rule).
- **Keeping `from-slate-950 via-blue-950 to-slate-900`:** All page wrappers get flat `bg-bg-deep` only.
- **Keeping `text-blue-100` for body copy:** Replace with `text-text-secondary` or `text-text-muted`.

---

## Don't Hand-Roll

| Problem              | Don't Build                                           | Use Instead          | Why                                                                                       |
| -------------------- | ----------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------- |
| CTA with Calendly    | `useState` + `CalendlyModal` manually                 | `CTAButton calendly` | CTAButton self-manages state; already handles URL, dark theme params, and modal lifecycle |
| Card/panel container | `bg-white/5 backdrop-blur border-white/10 rounded-xl` | `SystemPanel`        | Consistent token usage; forwardRef for Framer Motion composability                        |
| Section layout       | `max-w-6xl mx-auto px-6 py-16`                        | `SectionContainer`   | Consistent spacing across all sections                                                    |
| Status dot           | Custom pulsing circle                                 | `StatusIndicator`    | Handles `status-pulse` animation with reduced motion support                              |
| Metric numbers       | Large number + label divs                             | `MetricDisplay`      | JetBrains Mono, correct text hierarchy already applied                                    |

**Key insight:** The five shared components from Phase 3 were built specifically for this conversion. Using them consistently is the entire point of this phase.

---

## Common Pitfalls

### Pitfall 1: Breaking Framer Motion with SystemPanel

**What goes wrong:** Replacing `motion.div` with `SystemPanel` causes "Warning: Function components cannot be given refs" or breaks animation.
**Why it happens:** `motion.div` passes a ref internally. If the component isn't wrapped in `forwardRef`, the ref is lost.
**How to avoid:** SystemPanel uses `React.forwardRef` so it CAN receive motion refs. But only convert `motion.div` → `<SystemPanel as motion component>` if needed. Simpler: keep `motion.div` and just update its className, OR use `<SystemPanel ref={ref}>` with Framer's `motion(SystemPanel)` pattern if animations are needed on the panel itself.
**Warning signs:** TypeScript error about ref; animation stops working after conversion.

### Pitfall 2: Removing Calendly State but Forgetting CalendlyModal JSX

**What goes wrong:** Developer removes `useState(isCalendlyOpen)` but forgets to also remove the `<CalendlyModal>` JSX at the bottom of the component, leaving an orphaned import.
**Why it happens:** The old pattern always had `<CalendlyModal isOpen={isCalendlyOpen} onClose={...} />` as a sibling to the button. When switching to CTAButton, both the state AND the CalendlyModal instance must be removed from the parent.
**How to avoid:** Search for `<CalendlyModal` after converting each file and remove orphans.
**Warning signs:** TypeScript "isCalendlyOpen is declared but never used"; duplicate Calendly modals opening.

### Pitfall 3: Brand Text "Future AI" Not Updated in i18n Translations

**What goes wrong:** The component JSX is updated to "FMai" but hardcoded i18n translation strings still say "Future AI".
**Why it happens:** SimpleHeader uses `t('landing.header.brand.future')` + `t('landing.header.brand.marketing')` + `t('landing.header.brand.ai')`. The text is split across three translation keys.
**How to avoid:** After updating components, grep translation files for "Future AI" / "Future Marketing AI".
**Warning signs:** Header shows "FMai" in dev but translations fall back to old brand name in production locale.

### Pitfall 4: `rounded-xl` Persisting on Converted Panels

**What goes wrong:** Panels look slightly rounded (Living System uses sharp corners, `rounded-sm` = 0.25rem only).
**Why it happens:** `rounded-xl` is added directly to converted elements alongside SystemPanel className, overriding SystemPanel's `rounded-sm`.
**How to avoid:** When adding extra className to SystemPanel, do not include any `rounded-*` classes larger than `rounded-sm`.
**Warning signs:** Visual diff shows card corners still softly rounded.

### Pitfall 5: CookieConsent Library Inline Styles Override Tokens

**What goes wrong:** `react-cookie-consent` injects inline `style` attributes that can't be overridden by Tailwind classes.
**Why it happens:** The library uses inline styles by default. Tailwind classes don't override inline styles without `!important`.
**How to avoid:** CookieConsentBanner wraps the `react-cookie-consent` library. Use the library's `style` / `buttonStyle` / `declineButtonStyle` props (which accept style objects) to apply Living System color values directly: `background: '#111520'`, `color: '#E8ECF4'`, `borderColor: 'rgba(0,212,170,0.3)'`.
**Warning signs:** Cookie banner shows white/grey background despite Tailwind class changes.

### Pitfall 6: GlassCard Component Remains Exported (Confusion Risk)

**What goes wrong:** Developers continue using `GlassCard` after conversion, defeating the migration.
**Why it happens:** `GlassCard` is still exported from `src/components/common/index.ts`. During conversion, some files may remain on GlassCard.
**How to avoid:** Document which files have been migrated. GlassCard deprecation (marking it or removing it) should happen AFTER all conversions are confirmed complete — not mid-phase.
**Warning signs:** Grep for `GlassCard` usage in converted files.

---

## Code Examples

### Converting a Full Service Page Section (AutomationsPage pattern)

```tsx
// Source: codebase audit of AutomationsPage.tsx
// BEFORE (glassmorphism)
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
  <section className="relative pt-32 pb-16 px-6">
    <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
      <Zap className="w-4 h-4 text-blue-400" />
      <span className="text-sm font-medium text-blue-100">Delivered in 1-2 Weeks</span>
    </motion.div>
  </section>
  <div className="grid md:grid-cols-3 gap-6">
    <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
      <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
      <p className="text-blue-100/80">{point.description}</p>
    </motion.div>
  </div>
</div>

// AFTER (Living System)
<div className="min-h-screen bg-bg-deep">
  <section className="relative pt-32 pb-16 px-6">
    <motion.div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
      <Zap className="w-4 h-4 text-accent-system" />
      <span className="text-sm font-medium text-text-secondary">Delivered in 1-2 Weeks</span>
    </motion.div>
  </section>
  <div className="grid md:grid-cols-3 gap-6">
    <SystemPanel
      className="p-8"
      // wrap in motion if animation needed:
      // ref={ref} — SystemPanel supports forwardRef
    >
      <h3 className="text-lg font-semibold text-text-primary mb-2">{point.title}</h3>
      <p className="text-text-muted">{point.description}</p>
    </SystemPanel>
  </div>
</div>
```

### Converting CTAButton with Calendly (removing local state)

```tsx
// Source: AutomationsPage.tsx, ChatbotsPage.tsx, VoiceAgentsPage.tsx pattern
// BEFORE
const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)
// ...
<button
  onClick={() => setIsCalendlyOpen(true)}
  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
>
  Get a Free Automation Audit
  <ArrowRight className="w-5 h-5" />
</button>
<CalendlyModal
  isOpen={isCalendlyOpen}
  onClose={() => setIsCalendlyOpen(false)}
  url={CALENDLY_URL}
/>

// AFTER
import { CTAButton } from '../components/common'
// Remove useState, remove CalendlyModal JSX, remove useState import if unused
<CTAButton size="lg" calendly arrow>
  Get a Free Automation Audit
</CTAButton>
// CTAButton uses DEFAULT_CALENDLY_URL with dark theme params by default
// Or pass: <CTAButton size="lg" calendly calendlyUrl={CALENDLY_URL} arrow>
```

### SimpleHeader Brand + CTA Update

```tsx
// Source: src/components/landing/SimpleHeader.tsx
// BEFORE
<div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 rounded-2xl">
  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
    {t('landing.header.brand.marketing')}
  </span>
  <motion.a
    href="https://calendly.com/futureai/strategy-call"
    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl"
  >

// AFTER
<div className="bg-bg-surface/95 border border-border-primary shadow-glow-sm rounded-sm">
  <span className="text-accent-system">
    {t('landing.header.brand.marketing')}
  </span>
  <CTAButton size="sm" calendly>
    {t('landing.header.try_demo')}
  </CTAButton>
```

### Footer Token Update

```tsx
// src/components/landing/Footer.tsx
// BEFORE
<Sparkles className="w-5 h-5 text-blue-400 transition-transform group-hover:rotate-12" />
<p className="text-sm text-slate-400 max-w-xs">
<Link className="text-sm text-slate-400 hover:text-white transition-colors">

// AFTER
<Sparkles className="w-5 h-5 text-accent-system transition-transform group-hover:rotate-12" />
<p className="text-sm text-text-muted max-w-xs">
<Link className="text-sm text-text-muted hover:text-text-primary transition-colors">
```

---

## Complete Color Mapping Reference

| Old Class                                                              | New Class                                        | Notes                            |
| ---------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------- |
| `bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900`           | `bg-bg-deep`                                     | Page wrapper                     |
| `bg-white/5`                                                           | `bg-bg-surface`                                  | Panel background                 |
| `bg-white/10`                                                          | `bg-bg-elevated`                                 | Elevated/hover background        |
| `backdrop-blur-sm backdrop-blur-xl`                                    | (remove)                                         | No blur in Living System         |
| `border-white/10`                                                      | `border-border-primary`                          | Panel borders                    |
| `border-white/5`                                                       | `border-border-primary`                          | Subtle dividers                  |
| `rounded-xl` / `rounded-2xl` (on cards)                                | `rounded-sm`                                     | Sharp corners                    |
| `rounded-full` (on badges)                                             | `rounded-sm`                                     | Sharp corners                    |
| `text-white`                                                           | `text-text-primary`                              | Primary text                     |
| `text-slate-400` / `text-blue-100`                                     | `text-text-secondary`                            | Body text                        |
| `text-blue-100/80`                                                     | `text-text-muted`                                | Muted text                       |
| `text-blue-400` / `text-cyan-400`                                      | `text-accent-system`                             | System/feature accent            |
| `text-purple-400` / `text-violet-400`                                  | `text-accent-human`                              | Human/attention accent           |
| `bg-blue-500/10` / `bg-indigo-500/10`                                  | `bg-accent-system/10`                            | Tinted backgrounds               |
| `border-blue-500/20`                                                   | `border-accent-system/20`                        | Tinted borders                   |
| `bg-gradient-to-r from-blue-500 to-purple-600`                         | `bg-accent-system`                               | Primary CTA bg                   |
| `from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent` | `bg-gradient-flow bg-clip-text text-transparent` | Gradient text                    |
| `rgba(79, 70, 229, *)`                                                 | `rgba(0, 212, 170, *)`                           | CSS custom props (indigo → teal) |
| `shadow-blue-500/25`                                                   | `shadow-glow-sm`                                 | Glow shadows                     |

---

## File-Level Conversion Checklist

### Homepage Components

| File                                         | Key Old Patterns                                                                                                                       | Priority |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `src/components/landing/SimpleHeader.tsx`    | `bg-slate-950/90 backdrop-blur-2xl rounded-2xl`, `from-blue-400 via-cyan-400`, `from-blue-500 to-cyan-500` CTA, `text-slate-400` links | 1        |
| `src/components/landing/Hero.tsx`            | `from-indigo-*`, `bg-indigo-*`, gradient backgrounds, neural node colors                                                               | 1        |
| `src/components/landing/Footer.tsx`          | `text-blue-400` icon, `text-slate-400` links, `border-white/5`                                                                         | 1        |
| `src/components/landing/SocialProof.tsx`     | Old card patterns, old color refs                                                                                                      | 1        |
| `src/components/landing/FeaturesSection.tsx` | Old card + gradient patterns                                                                                                           | 1        |
| `src/components/landing/FeatureShowcase.tsx` | Old card + gradient patterns                                                                                                           | 1        |

### Service Pages

| File                            | Key Old Patterns                                                                                                                | Priority |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `src/pages/AutomationsPage.tsx` | `from-slate-950 via-blue-950`, `bg-white/5 backdrop-blur`, `from-blue-500 to-purple-606`, `text-blue-400`, local Calendly state | 2        |
| `src/pages/ChatbotsPage.tsx`    | Same patterns as Automations                                                                                                    | 2        |
| `src/pages/VoiceAgentsPage.tsx` | Same patterns as Automations                                                                                                    | 2        |

### Supporting Pages

| File                           | Key Old Patterns                                                                                            | Priority |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- | -------- |
| `src/pages/AboutPage.tsx`      | `bg-purple-500/10 border-purple-500/20`, `bg-white/5 backdrop-blur`, `text-blue-100`, page wrapper gradient | 3        |
| `src/pages/PricingPage.tsx`    | `bg-gradient-to-r from-blue-500/10 to-purple-500/10`, `bg-blue-500/10`, page wrapper gradient               | 3        |
| `src/pages/ContactPage.tsx`    | Various blue refs                                                                                           | 3        |
| `src/pages/HowItWorksPage.tsx` | Page wrapper gradient, card patterns                                                                        | 3        |
| `src/pages/LegalPage.tsx`      | Page wrapper, minimal color refs                                                                            | 3        |

### Common Components

| File                                        | Key Old Patterns                                                                   | Priority |
| ------------------------------------------- | ---------------------------------------------------------------------------------- | -------- |
| `src/components/common/LoadingFallback.tsx` | `from-gray-900 via-blue-900 to-purple-900`, `border-blue-500/30 border-t-blue-500` | 4        |
| `src/components/common/FloatingNav.tsx`     | Glassmorphism nav, old color refs                                                  | 4        |
| `src/components/common/CookieConsent.tsx`   | react-cookie-consent style props                                                   | 4        |
| `src/index.css`                             | `rgba(79, 70, 229, *)` in cta-pulse keyframe                                       | 4        |

---

## Open Questions

1. **SimplifiedHeroMobile.tsx and MobileEvolutionTimeline.tsx**
   - What we know: These mobile-specific components in `src/components/landing/` and `src/components/mobile/` likely contain old color patterns (they were not audited separately in CONTEXT.md)
   - What's unclear: Whether they are in-scope or implicitly included under "Homepage (Hero)"
   - Recommendation: Include in Homepage priority batch — they are part of the mobile landing experience and will be visible to mobile users

2. **SocialProof and FeaturesSection — referenced in LandingPage but not audited in depth**
   - What we know: Both are in `src/components/landing/` and use old patterns (confirmed by grep)
   - What's unclear: Exact component size and conversion complexity
   - Recommendation: Include in Priority 1 batch alongside Hero

3. **GlassCard deprecation timing**
   - What we know: GlassCard is still exported from index.ts and used in some components
   - What's unclear: Which non-scope files still import GlassCard
   - Recommendation: Do NOT remove GlassCard export in this phase — only stop using it in converted files. Mark for deprecation in a follow-up.

4. **LegalPage structure**
   - What we know: LegalPage.tsx is in scope but likely minimal (mostly text content with simple container)
   - What's unclear: Whether it uses its own wrapper div or imports a shared layout
   - Recommendation: Lowest priority within supporting pages — convert wrapper and any card elements, text is likely fine.

---

## Sources

### Primary (HIGH confidence)

- Direct codebase audit — `src/pages/*.tsx`, `src/components/landing/*.tsx`, `src/components/common/*.tsx` — all files read directly
- `tailwind.config.js` — verified all Living System token names and values
- `src/index.css` — verified CSS custom properties and cta-pulse keyframe rgba values
- `src/components/common/SystemPanel.tsx` — verified forwardRef support and base classes
- `src/components/common/CTAButton.tsx` — verified internal Calendly state management pattern
- `src/components/common/index.ts` — verified all 5 Living System components are exported
- `.planning/phases/09-living-system-page-conversion/09-CONTEXT.md` — phase scope and decisions

### Secondary (MEDIUM confidence)

- `prototype-2-living-system.html` — referenced in CONTEXT.md as approved visual target (not read but existence confirmed)
- `.planning/STATE.md` — confirmed Phase 3 Wave 1 complete, all components exported

### Tertiary (LOW confidence — not applicable)

- No external sources needed: this is a pure internal codebase refactor using already-defined tokens.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all dependencies already installed, no new packages needed
- Architecture: HIGH — tokens verified in tailwind.config.js, components verified in source
- Pitfalls: HIGH — identified from direct code reading (glassmorphism patterns, Calendly state, rounded-xl instances, react-cookie-consent inline styles)
- Color mapping: HIGH — all token names verified against tailwind.config.js

**Research date:** 2026-03-13
**Valid until:** Stable — tokens are locked decisions, no external library changes expected
