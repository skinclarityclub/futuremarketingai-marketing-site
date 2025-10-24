# Touch Target and Spacing Standards

**Created:** October 24, 2025  
**Status:** Subtask 1.3 Complete  
**Compliance:** Apple HIG + WCAG 2.1 AAA

---

## 🎯 Touch Target Requirements

### Standards Met

✅ **Apple Human Interface Guidelines (HIG)**

- Minimum touch target: 44×44 points (44px)
- Implemented as: `touch-sm` utility (44px)

✅ **WCAG 2.1 Level AAA (2.5.5)**

- Recommended touch target: 48×48 pixels
- Implemented as: `touch-md` utility (48px) - **DEFAULT**
- Implemented as: `min-w-touch`, `min-h-touch` (48px)

✅ **Enhanced Comfort Levels**

- Extra comfortable: `touch-lg` (56px)
- Maximum comfortable: `touch-xl` (64px)

---

## 📏 Spacing Standards

All spacing uses **relative units (rem)** via Tailwind CSS for fluid, responsive design.

### Spacing Scale

| Token | rem     | Pixels (16px base) | Use Case            |
| ----- | ------- | ------------------ | ------------------- |
| 3     | 0.75rem | 12px               | Tight spacing       |
| 4     | 1rem    | 16px               | Default spacing     |
| 6     | 1.5rem  | 24px               | Comfortable spacing |
| 8     | 2rem    | 32px               | Generous spacing    |

### Gap Utilities (Mobile Components)

| Prop | Class | Value   | Pixels |
| ---- | ----- | ------- | ------ |
| sm   | gap-3 | 0.75rem | 12px   |
| md   | gap-4 | 1rem    | 16px   |
| lg   | gap-6 | 1.5rem  | 24px   |
| xl   | gap-8 | 2rem    | 32px   |

---

## ✅ Implementation Verification

### Mobile Components Audit

All mobile components built with correct standards:

#### MobileCard

- ✅ `min-h-touch` (48px) when `interactive={true}`
- ✅ Padding uses rem units (p-4, p-6, p-8)
- ✅ Tap feedback on interaction
- ✅ Keyboard accessible (Enter/Space)
- ✅ ARIA roles (role="button")

#### MobileContainer

- ✅ Padding uses rem units (px-4 to px-8, py-3 to py-6)
- ✅ Safe area insets for notched devices
- ✅ Fluid responsive design

#### MobileGrid

- ✅ Gap uses rem units (gap-3 to gap-8)
- ✅ Fluid column layouts
- ✅ Touch-friendly spacing

#### MobileStack

- ✅ Gap uses rem units (gap-3 to gap-8)
- ✅ Flexible direction control
- ✅ Touch-friendly spacing

---

## 🧪 Testing Procedures

### Manual Testing Checklist

- [ ] Open DevTools (F12)
- [ ] Enable Device Toolbar (Ctrl+Shift+M)
- [ ] Select device (iPhone 14 Pro recommended)
- [ ] Test all interactive elements:
  - [ ] Buttons are ≥ 48×48px
  - [ ] Cards are ≥ 48×48px when interactive
  - [ ] Navigation items are ≥ 48×48px
  - [ ] Spacing is consistent
  - [ ] No overlapping tap targets

### Automated Verification

```typescript
// Example: Verify touch target size
const element = document.querySelector('.interactive-element')
const rect = element.getBoundingClientRect()

console.assert(rect.width >= 48 && rect.height >= 48, 'Touch target too small!')
```

### Chrome DevTools Inspection

1. Right-click interactive element
2. Inspect
3. Check Computed tab:
   - min-width: 48px ✅
   - min-height: 48px ✅

---

## 📋 Component Usage Guidelines

### ✅ Correct Usage

```tsx
// Mobile components automatically enforce standards
import { MobileCard } from '@/components/mobile/layouts'

;<MobileCard interactive onClick={handleClick}>
  <h3>Feature Title</h3>
  <p>Description</p>
</MobileCard>
// Result: Automatically has min-h-touch (48px)
```

### Manual Touch Targets (When Needed)

```tsx
// For custom mobile components
<button className="min-w-touch min-h-touch px-4 py-3">
  Custom Button
</button>

// Or using spacing utilities
<div className="w-touch-md h-touch-md">
  Icon Button
</div>
```

### ❌ Wrong Usage

```tsx
// ❌ Don't use mobile utilities in desktop components
// src/components/common/Button.tsx
<button className="min-w-touch">  // NO! Desktop component!
  Desktop Button
</button>

// ❌ Don't use fixed pixel values
<button style={{ width: '40px', height: '40px' }}>  // Too small!
  Icon
</button>
```

---

## 🎨 Safe Area Insets

For devices with notches (iPhone X+, etc.):

```css
/* Automatically applied in MobileContainer */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

---

## ♿ Accessibility Features

All mobile components include:

✅ **Keyboard Navigation**

- Tab navigation support
- Enter/Space key activation
- Focus indicators (outline rings)

✅ **Screen Reader Support**

- Proper ARIA roles
- ARIA labels where needed
- Semantic HTML elements

✅ **Focus Management**

- Visible focus rings (2px accent-primary)
- High contrast mode support
- Reduced motion support

---

## 📊 Compliance Matrix

| Standard       | Requirement    | Our Implementation       | Status |
| -------------- | -------------- | ------------------------ | ------ |
| Apple HIG      | 44×44 points   | 44px (touch-sm)          | ✅     |
| WCAG AAA 2.5.5 | 48×48 pixels   | 48px (touch-md, default) | ✅     |
| WCAG AA 2.5.5  | 44×44 pixels   | 48px (exceeds)           | ✅     |
| Spacing        | Relative units | rem via Tailwind         | ✅     |
| Safe Areas     | Notch support  | env(safe-area-inset-\*)  | ✅     |
| Keyboard       | Full support   | tabIndex, Enter/Space    | ✅     |
| Screen Reader  | ARIA support   | Proper roles/labels      | ✅     |
| Focus          | Visible rings  | 2px accent-primary       | ✅     |

---

## 🚨 Desktop-First Compliance

**CRITICAL:** These standards apply to mobile components ONLY!

### ✅ Correct Approach

```tsx
// Conditional rendering with mobile components
{
  isMobile ? (
    <MobileCard interactive>Mobile Version</MobileCard>
  ) : (
    <DesktopCard>Desktop Version</DesktopCard>
  )
}
```

### ❌ Wrong Approach

```tsx
// ❌ Don't modify desktop components
// src/components/common/Card.tsx
<div className="min-h-touch">
  {' '}
  // NO! Breaks desktop!
  {content}
</div>
```

---

## 📚 References

- [Apple HIG - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)
- [WCAG 2.1 - Target Size (AAA)](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Material Design - Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)
- [iOS Safe Area](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/#safe-area)

---

## ✅ Subtask 1.3 Checklist

- [x] Touch target utilities implemented (touch-sm, touch-md, touch-lg, touch-xl)
- [x] Minimum dimensions implemented (min-w-touch, min-h-touch)
- [x] All spacing uses relative units (rem)
- [x] Mobile components enforce 48px minimum
- [x] Safe area insets for notched devices
- [x] Keyboard navigation support
- [x] Screen reader support (ARIA)
- [x] Focus indicators implemented
- [x] Documentation complete
- [x] Testing procedures defined
- [x] Compliance matrix verified

**Status:** ✅ Complete - All standards met and enforced

---

**Next Steps:**

- Subtask 1.4: Dark Mode (already implemented in 1.1)
- Continue building mobile components using these standards
- Always use conditional rendering for mobile variants
