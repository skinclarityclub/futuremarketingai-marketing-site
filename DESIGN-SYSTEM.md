# FutureMarketingAI Design System

Complete design system documentation for the FutureMarketingAI demo showcase.

---

## 🎨 Color Palette

### Background Colors

```css
bg-dark       #050814    /* Main dark background */
bg-surface    #0A0E27    /* Surface/container background */
bg-card       #0F1629    /* Card backgrounds */
bg-hover      #1A1F3A    /* Hover states */
```

**Usage:**

```tsx
<div className="bg-dark">Main background</div>
<div className="bg-surface">Container</div>
<div className="bg-card">Card content</div>
```

### Accent Colors

```css
accent-primary      #00D4FF    /* Cyan - Primary brand color */
accent-secondary    #A855F7    /* Purple - Secondary accent */
accent-tertiary     #FF6B9D    /* Pink - Tertiary accent */
```

**Usage:**

```tsx
<button className="bg-accent-primary">Primary CTA</button>
<div className="border-accent-secondary">Highlighted card</div>
```

### Status Colors

```css
success    #00FF88    /* Success states, positive actions */
warning    #FFA500    /* Warnings, caution */
error      #FF4757    /* Errors, destructive actions */
info       #00D4FF    /* Info messages (same as primary) */
```

**Usage:**

```tsx
<div className="text-success">✓ Success message</div>
<div className="bg-error text-white">Error alert</div>
```

### Text Colors

```css
text-primary      #FFFFFF    /* Primary text, headings */
text-secondary    #94A3B8    /* Secondary text, descriptions */
text-tertiary     #64748B    /* Tertiary text, captions */
text-muted        #475569    /* Muted text, disabled states */
```

**Usage:**

```tsx
<h1 className="text-primary">Heading</h1>
<p className="text-secondary">Description text</p>
<span className="text-muted">Caption</span>
```

---

## ✍️ Typography

### Font Families

**Sans (Body Text):**

```css
font-sans:
  Inter,
  Satoshi,
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
```

**Display (Headlines):**

```css
font-display: Satoshi, Inter, sans-serif;
```

**Mono (Code/Metrics):**

```css
font-mono:
  JetBrains Mono,
  Consolas,
  Monaco,
  monospace;
```

**Usage:**

```tsx
<h1 className="font-display">Display Heading</h1>
<p className="font-sans">Body text</p>
<code className="font-mono">Code snippet</code>
```

### Font Sizes

| Class                   | Size          | Line Height | Use Case             |
| ----------------------- | ------------- | ----------- | -------------------- |
| `text-xs`               | 0.75rem       | 1rem        | Captions, labels     |
| `text-sm`               | 0.875rem      | 1.25rem     | Small body text      |
| `text-base`             | 1rem          | 1.5rem      | Body text            |
| `text-lg`               | 1.125rem      | 1.75rem     | Large body           |
| `text-xl`               | 1.25rem       | 1.75rem     | Subheadings          |
| `text-2xl`              | 1.5rem        | 2rem        | H3                   |
| `text-3xl`              | 1.875rem      | 2.25rem     | H2                   |
| `text-4xl`              | 2.25rem       | 2.5rem      | H1                   |
| `text-5xl`              | 3rem          | 1           | Large headings       |
| `text-6xl`              | 3.75rem       | 1           | Hero headings        |
| `text-7xl` - `text-9xl` | 4.5rem - 8rem | 1           | Extra large displays |

### Font Weights

```tsx
<span className="font-thin">100</span>
<span className="font-light">300</span>
<span className="font-normal">400</span>
<span className="font-medium">500</span>
<span className="font-semibold">600</span>
<span className="font-bold">700</span>
<span className="font-black">900</span>
```

---

## ✨ Effects & Utilities

### Glassmorphism

```tsx
/* Standard glass card */
<div className="glass-card p-6 rounded-xl">
  Glassmorphic content
</div>

/* Strong glass effect */
<div className="glass-card-strong p-6 rounded-xl">
  More opaque glass
</div>

/* Subtle glass effect */
<div className="glass-card-subtle p-6 rounded-xl">
  Subtle transparency
</div>
```

**CSS Implementation:**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Glow Effects

```tsx
/* Standard cyan glow */
<div className="glow p-6 rounded-xl">Glowing element</div>

/* Glow on hover */
<button className="glow-hover px-6 py-3">Hover me</button>

/* Purple glow */
<div className="glow-purple p-6">Purple glow</div>

/* Green glow */
<div className="glow-green p-6">Success glow</div>
```

**Tailwind Shadows:**

```tsx
<div className="shadow-glow-sm">Small glow</div>
<div className="shadow-glow">Medium glow</div>
<div className="shadow-glow-lg">Large glow</div>
```

### Gradient Text

```tsx
/* Primary gradient (cyan to purple) */
<h1 className="gradient-text text-6xl font-bold">
  Gradient Heading
</h1>

/* Secondary gradient (purple to pink) */
<h2 className="gradient-text-secondary text-4xl">
  Secondary Gradient
</h2>

/* Success gradient (green to cyan) */
<span className="gradient-text-success font-semibold">
  Success Text
</span>
```

### Background Gradients

```tsx
/* Pre-defined gradients */
<div className="bg-gradient-primary p-6">Primary gradient</div>
<div className="bg-gradient-secondary p-6">Secondary gradient</div>
<div className="bg-gradient-success p-6">Success gradient</div>

/* Tailwind gradient utilities */
<div className="bg-gradient-to-r from-accent-primary to-accent-secondary">
  Custom gradient
</div>
```

### Border Radius

```tsx
<div className="rounded-sm">0.25rem</div>
<div className="rounded">0.5rem (default)</div>
<div className="rounded-md">0.75rem</div>
<div className="rounded-lg">1rem</div>
<div className="rounded-xl">1.5rem</div>
<div className="rounded-2xl">2rem</div>
<div className="rounded-3xl">3rem</div>
<div className="rounded-full">9999px (circle)</div>
```

---

## 🎭 Animations

### Glow Pulse

```tsx
<div className="animate-glow-pulse">Pulsing glow effect</div>
```

### Float

```tsx
<div className="animate-float">Floating animation</div>
```

### Slide Animations

```tsx
<div className="animate-slide-up">Slide up on appear</div>
<div className="animate-slide-down">Slide down on appear</div>
```

### Fade In

```tsx
<div className="animate-fade-in">Fade in effect</div>
```

### Custom Animation: Fade In Up

```tsx
<div className="fade-in-up">Fades in while sliding up</div>
```

### Hover Effects

```tsx
/* Lift on hover */
<div className="hover-lift">Lifts up with glow on hover</div>
```

---

## 🧩 Common Patterns

### Hero Section

```tsx
<section className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark flex items-center justify-center">
  <div className="text-center space-y-8 p-8">
    <h1 className="text-6xl font-bold gradient-text">Your Hero Title</h1>
    <p className="text-xl text-secondary max-w-2xl">Your subtitle text</p>
  </div>
</section>
```

### Glassmorphic Card

```tsx
<div className="glass-card p-6 rounded-2xl hover-lift">
  <div className="text-4xl font-bold text-success font-mono">312h</div>
  <div className="text-sm text-secondary mt-2">Time Saved</div>
</div>
```

### CTA Button

```tsx
<button className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105">
  Call to Action →
</button>
```

### Feature Card

```tsx
<div className="glass-card-strong p-8 rounded-2xl border-gradient hover-lift">
  <div className="w-12 h-12 bg-accent-primary rounded-lg flex items-center justify-center mb-4 shadow-glow">
    {/* Icon */}
  </div>
  <h3 className="text-2xl font-semibold mb-2">Feature Title</h3>
  <p className="text-secondary">Feature description goes here</p>
</div>
```

---

## 📐 Spacing System

Use Tailwind's spacing scale with our CSS variables:

```css
--spacing-xs: 0.25rem /* 4px */ --spacing-sm: 0.5rem /* 8px */ --spacing-md: 1rem /* 16px */
  --spacing-lg: 1.5rem /* 24px */ --spacing-xl: 2rem /* 32px */;
```

**Usage:**

```tsx
<div className="p-4">Padding 1rem</div>
<div className="m-8">Margin 2rem</div>
<div className="space-y-6">Vertical spacing 1.5rem</div>
```

---

## 🎯 Best Practices

### ✅ DO

- Use semantic color names (`bg-surface`, not `bg-gray-900`)
- Combine utilities for complex effects
- Use `glass-card` for transparent containers
- Apply glow effects to CTAs and important elements
- Use gradient text for headings
- Maintain consistent spacing

### ❌ DON'T

- Don't use arbitrary hex colors in className
- Don't override design system colors
- Don't mix different glow colors on the same element
- Don't use too many animations on one page
- Don't forget hover states on interactive elements

---

## 🔗 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Satoshi Font](https://www.fontshare.com/fonts/satoshi)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

---

**Last Updated:** September 30, 2025  
**Version:** 1.0
