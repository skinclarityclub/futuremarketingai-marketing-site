# Touch Target & Spacing Standards

## Overview

Dit document definieert de touch target en spacing standards voor Future Marketing AI, gebaseerd op:
- **Apple Human Interface Guidelines (HIG)**
- **WCAG 2.1 Level AAA (Success Criterion 2.5.5)**
- **Material Design Guidelines**

## Touch Target Sizes

### Minimum Sizes

| Standard | Minimum Size | Use Case |
|----------|-------------|----------|
| **iOS (Apple HIG)** | 44×44px | iOS apps minimum |
| **WCAG AAA** | 48×48px | **Recommended default** |
| **Comfortable** | 56×56px | Primary CTAs |
| **Extra Large** | 64×64px | Hero sections |

### CSS Classes

```css
.tap-target-sm  /* 44×44px - iOS minimum */
.tap-target     /* 48×48px - WCAG AAA (default) */
.tap-target-md  /* 48×48px - alias for tap-target */
.tap-target-lg  /* 56×56px - comfortable */
.tap-target-xl  /* 64×64px - extra large */
```

### Usage Examples

```tsx
// Button with WCAG AAA touch target
<button className="tap-target px-6 py-3">
  Click Me
</button>

// Icon button (ensure icon + padding meets minimum)
<button className="tap-target p-3">
  <Icon className="w-6 h-6" />
</button>

// Large CTA button
<button className="tap-target-lg px-8 py-4">
  Get Started
</button>
```

## Spacing Standards

### Minimum Spacing Between Interactive Elements

- **Minimum:** 8px between touch targets
- **Recommended:** 12px for better usability
- **Comfortable:** 16px for primary actions

### CSS Classes

```css
.touch-spacing-sm  /* 4px margin */
.touch-spacing     /* 8px margin (default) */
.touch-spacing-md  /* 8px margin (alias) */
.touch-spacing-lg  /* 12px margin */
```

### Usage Examples

```tsx
// Button group with proper spacing
<div className="flex gap-3">
  <button className="tap-target">Cancel</button>
  <button className="tap-target">Save</button>
</div>

// Vertical stack with spacing
<div className="flex flex-col space-y-3">
  <button className="tap-target">Option 1</button>
  <button className="tap-target">Option 2</button>
  <button className="tap-target">Option 3</button>
</div>
```

## Component Guidelines

### Buttons

**✅ DO:**
```tsx
// Proper touch target and padding
<button className="min-w-[48px] min-h-[48px] px-6 py-3 rounded-lg">
  Submit
</button>

// Icon button with adequate size
<button className="w-12 h-12 flex items-center justify-center rounded-lg">
  <Settings className="w-6 h-6" />
</button>
```

**❌ DON'T:**
```tsx
// Too small for touch
<button className="px-2 py-1 text-xs">
  Tiny Button
</button>

// Icon without padding
<button className="p-0">
  <Icon className="w-4 h-4" />
</button>
```

### Links

**✅ DO:**
```tsx
// Inline link with adequate line height
<a href="/page" className="inline-block min-h-[44px] py-2">
  Read More
</a>

// Link as button
<a href="/action" className="tap-target px-6 py-3 rounded-lg">
  Take Action
</a>
```

**❌ DON'T:**
```tsx
// Text link without sufficient height
<a href="/page" className="text-sm">
  Tiny link
</a>
```

### Form Controls

**✅ DO:**
```tsx
// Input with proper height
<input
  type="text"
  className="w-full min-h-[48px] px-4 rounded-lg"
/>

// Checkbox with touch-friendly label
<label className="flex items-center min-h-[48px] cursor-pointer">
  <input type="checkbox" className="w-6 h-6 mr-3" />
  <span>I agree to terms</span>
</label>

// Radio button group with spacing
<div className="space-y-3">
  <label className="flex items-center min-h-[48px]">
    <input type="radio" name="option" className="w-6 h-6 mr-3" />
    <span>Option 1</span>
  </label>
  <label className="flex items-center min-h-[48px]">
    <input type="radio" name="option" className="w-6 h-6 mr-3" />
    <span>Option 2</span>
  </label>
</div>
```

### Navigation

**✅ DO:**
```tsx
// Mobile navigation with proper touch targets
<nav className="flex flex-col space-y-2">
  <a href="/home" className="tap-target px-4 py-3 rounded-lg">
    Home
  </a>
  <a href="/about" className="tap-target px-4 py-3 rounded-lg">
    About
  </a>
  <a href="/contact" className="tap-target px-4 py-3 rounded-lg">
    Contact
  </a>
</nav>

// Tab navigation
<div className="flex gap-2 border-b border-border-primary">
  <button className="tap-target px-6 py-3 border-b-2 border-accent-primary">
    Tab 1
  </button>
  <button className="tap-target px-6 py-3">
    Tab 2
  </button>
  <button className="tap-target px-6 py-3">
    Tab 3
  </button>
</div>
```

## Safe Area Insets (Notched Devices)

Voor iPhone X en nieuwer met notches:

```css
.safe-area-inset-top     /* padding-top: env(safe-area-inset-top) */
.safe-area-inset-bottom  /* padding-bottom: env(safe-area-inset-bottom) */
.safe-area-inset-left    /* padding-left: env(safe-area-inset-left) */
.safe-area-inset-right   /* padding-right: env(safe-area-inset-right) */
.safe-area-inset         /* All sides */
```

### Usage

```tsx
// Fixed header respecting safe area
<header className="fixed top-0 w-full safe-area-inset-top">
  <nav>...</nav>
</header>

// Fixed bottom navigation
<nav className="fixed bottom-0 w-full safe-area-inset-bottom">
  <div>...</div>
</nav>
```

## Accessibility Features

### Focus Visible

```css
.focus-ring /* Adds visible focus ring for keyboard navigation */
```

```tsx
<button className="tap-target focus-ring">
  Keyboard Accessible
</button>
```

### Touch Feedback

```css
.touch-active    /* Removes tap highlight, prevents text selection */
.no-select       /* Prevents text selection */
.touch-feedback  /* Adds press effect on active state */
```

```tsx
<button className="tap-target touch-active touch-feedback">
  With Touch Feedback
</button>
```

### Expand Touch Area

Voor kleine visuele elementen die een grotere touch area nodig hebben:

```tsx
<button className="relative-tap expand-tap-target p-2">
  <Icon className="w-4 h-4" />
</button>
```

Dit voegt een onzichtbare touch area van minimaal 48×48px toe.

## Testing & Validation

### Automated Testing

```tsx
import { TouchTargetDebug } from '@/components/mobile/TouchTargetDebug';

// Add to your App component (development only)
function App() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && <TouchTargetDebug />}
      <YourApp />
    </>
  );
}
```

### Manual Testing

1. **Chrome DevTools:**
   - Open DevTools → More Tools → Sensors
   - Set "Touch" to enable touch emulation
   - Inspect element dimensions

2. **Real Device Testing:**
   - Test on actual iOS and Android devices
   - Validate with finger taps (not stylus)
   - Check in both portrait and landscape

3. **Accessibility Audit:**
   - Run Lighthouse audit
   - Use Axe DevTools
   - Test with keyboard navigation

### Programmatic Validation

```tsx
import {
  auditPageTouchTargets,
  logAuditReport,
  validateTouchTarget,
} from '@/utils/touchTargetAudit';

// Audit all interactive elements
const results = auditPageTouchTargets('wcag');
logAuditReport(results, 'wcag');

// Validate specific dimensions
const { valid, message } = validateTouchTarget(42, 42, 'wcag');
if (!valid) {
  console.error(message);
}
```

## Responsive Considerations

### Mobile-First Approach

```tsx
// Start with comfortable touch targets on mobile
<button className="
  tap-target-lg px-6 py-4
  tablet:tap-target-md tablet:px-5 tablet:py-3
  desktop:px-4 desktop:py-2
">
  Responsive Button
</button>
```

### Touch vs. Mouse

```tsx
// Detect touch device and adjust
<button className="
  tap-target
  mobile-tap-large
  hover:scale-105
  touch-device-no-hover
">
  Adaptive Button
</button>
```

## Common Patterns

### Action Bar (Mobile Bottom)

```tsx
<div className="
  fixed bottom-0 left-0 right-0
  safe-area-inset-bottom
  bg-bg-surface border-t border-border-primary
  p-4
">
  <div className="flex gap-3 max-w-md mx-auto">
    <button className="flex-1 tap-target-lg">
      Cancel
    </button>
    <button className="flex-1 tap-target-lg bg-accent-primary">
      Confirm
    </button>
  </div>
</div>
```

### Floating Action Button (FAB)

```tsx
<button className="
  fixed bottom-6 right-6
  safe-area-inset-bottom safe-area-inset-right
  w-14 h-14 tap-target-lg
  rounded-full
  bg-accent-primary
  shadow-xl
  flex items-center justify-center
">
  <Plus className="w-6 h-6" />
</button>
```

### Card with Interactive Elements

```tsx
<div className="p-4 rounded-lg bg-bg-card">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-text-secondary mb-4">Card content...</p>
  
  <div className="flex gap-3 mt-4">
    <button className="tap-target flex-1">
      Cancel
    </button>
    <button className="tap-target flex-1 bg-accent-primary">
      Save
    </button>
  </div>
</div>
```

## Quick Reference

### Minimum Touch Target Checklist

- [ ] All buttons ≥ 48×48px
- [ ] All links ≥ 44×44px (inline) or 48×48px (buttons)
- [ ] Icon buttons with adequate padding (48×48px total)
- [ ] Form controls ≥ 48px height
- [ ] Checkboxes/radios with touch-friendly labels
- [ ] Navigation items ≥ 48px height
- [ ] Spacing ≥ 8px between interactive elements
- [ ] Safe area insets for notched devices
- [ ] Focus visible for keyboard navigation
- [ ] Touch feedback for active states

### Testing Checklist

- [ ] Run touch target audit in development
- [ ] Test on real iOS device (iPhone)
- [ ] Test on real Android device
- [ ] Test in portrait and landscape
- [ ] Validate with Lighthouse (Target Size)
- [ ] Test keyboard navigation
- [ ] Check with screen reader
- [ ] Verify in high contrast mode
- [ ] Test with reduced motion enabled

## Resources

- [Apple HIG - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [WCAG 2.1 - Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [MDN - Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

