# Mobile Layout Components - Usage Guide

**Created:** October 24, 2025  
**Status:** Subtask 1.2 Complete  
**Location:** `src/components/mobile/layouts/`

---

## 🎯 Desktop-First Architecture

**CRITICAL:** These are mobile-ONLY components!

- ✅ Use ONLY in mobile-specific code paths
- ✅ Require conditional rendering with `useMediaQuery`
- ❌ NEVER use in desktop components
- ❌ NEVER replace existing desktop layouts

---

## 📦 Available Components

### 1. MobileContainer

Responsive container with fluid padding and max-width constraints.

```tsx
import { MobileContainer } from '@/components/mobile/layouts'

;<MobileContainer
  padding="md" // 'none' | 'sm' | 'md' | 'lg'
  maxWidth="full" // 'sm' | 'md' | 'lg' | 'full'
>
  {children}
</MobileContainer>
```

**Features:**

- Fluid padding using rem units
- Safe area insets for notched devices
- Responsive max-width constraints

### 2. MobileGrid

CSS Grid layout with responsive columns and touch-friendly gaps.

```tsx
import { MobileGrid } from '@/components/mobile/layouts'

;<MobileGrid
  columns={2} // 1 | 2 | 3 | 'auto-fit' | 'auto-fill'
  gap="md" // 'sm' | 'md' | 'lg' | 'xl'
  minItemWidth="10rem" // For auto-fit/auto-fill
>
  {children}
</MobileGrid>
```

**Features:**

- Fluid columns with CSS Grid
- Auto-fit/auto-fill for dynamic layouts
- Touch-friendly gaps (rem units)

### 3. MobileStack

Flexbox stack for vertical/horizontal layouts.

```tsx
import { MobileStack } from '@/components/mobile/layouts'

;<MobileStack
  direction="vertical" // 'vertical' | 'horizontal'
  gap="md" // 'sm' | 'md' | 'lg' | 'xl'
  align="stretch" // 'start' | 'center' | 'end' | 'stretch'
  justify="start" // 'start' | 'center' | 'end' | 'between' | 'around'
>
  {children}
</MobileStack>
```

**Features:**

- Flexible direction control
- Touch-friendly spacing
- Full alignment/justification options

### 4. MobileCard

Touch-friendly card with tap feedback and accessibility.

```tsx
import { MobileCard } from '@/components/mobile/layouts'

;<MobileCard
  padding="md" // 'sm' | 'md' | 'lg'
  interactive={true} // Makes it tappable
  onClick={handleTap}
>
  {children}
</MobileCard>
```

**Features:**

- Minimum touch target height (48px)
- Tap feedback animation
- Keyboard accessible
- Proper ARIA roles

---

## 💡 Complete Examples

### Example 1: Mobile Feature List

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileContainer, MobileStack, MobileCard } from '@/components/mobile/layouts'

function FeatureList() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Desktop uses different component
  if (!isMobile) return <DesktopFeatureGrid />

  // Mobile-specific layout
  return (
    <MobileContainer padding="md">
      <MobileStack gap="lg">
        <MobileCard interactive onClick={() => navigate('/feature-1')}>
          <h3 className="text-xl font-semibold">Feature 1</h3>
          <p className="text-text-secondary">Description...</p>
        </MobileCard>

        <MobileCard interactive onClick={() => navigate('/feature-2')}>
          <h3 className="text-xl font-semibold">Feature 2</h3>
          <p className="text-text-secondary">Description...</p>
        </MobileCard>
      </MobileStack>
    </MobileContainer>
  )
}
```

### Example 2: Mobile Product Grid

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileContainer, MobileGrid, MobileCard } from '@/components/mobile/layouts'

function ProductGrid({ products }) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!isMobile) return <DesktopProductGrid products={products} />

  return (
    <MobileContainer padding="md">
      <MobileGrid columns={2} gap="md">
        {products.map((product) => (
          <MobileCard key={product.id} padding="sm">
            <img src={product.image} alt={product.name} className="w-full rounded" />
            <h4 className="mt-2 font-medium">{product.name}</h4>
            <p className="text-sm text-text-muted">${product.price}</p>
          </MobileCard>
        ))}
      </MobileGrid>
    </MobileContainer>
  )
}
```

### Example 3: Mobile Dashboard

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { MobileContainer, MobileStack, MobileGrid, MobileCard } from '@/components/mobile/layouts'

function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!isMobile) return <DesktopDashboard />

  return (
    <MobileContainer padding="lg">
      <MobileStack gap="xl">
        {/* Stats Grid */}
        <MobileGrid columns={2} gap="md">
          <MobileCard padding="md">
            <h3 className="text-2xl font-bold">1.2K</h3>
            <p className="text-sm text-text-muted">Users</p>
          </MobileCard>

          <MobileCard padding="md">
            <h3 className="text-2xl font-bold">$45K</h3>
            <p className="text-sm text-text-muted">Revenue</p>
          </MobileCard>
        </MobileGrid>

        {/* Recent Activity */}
        <MobileStack gap="md">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <MobileCard padding="md">
            <p>Activity 1...</p>
          </MobileCard>
          <MobileCard padding="md">
            <p>Activity 2...</p>
          </MobileCard>
        </MobileStack>
      </MobileStack>
    </MobileContainer>
  )
}
```

---

## ⚠️ Critical Rules

### ✅ DO:

```tsx
// ✅ CORRECT - Conditional rendering
{
  isMobile ? (
    <MobileContainer>
      <MobileStack>{/* mobile layout */}</MobileStack>
    </MobileContainer>
  ) : (
    <DesktopLayout>{/* desktop layout */}</DesktopLayout>
  )
}
```

### ❌ DON'T:

```tsx
// ❌ WRONG - Using in desktop code
// src/components/common/Header.tsx
import { MobileCard } from '@/components/mobile/layouts' // NO!

function Header() {
  return <MobileCard>Header</MobileCard> // Breaks desktop!
}
```

---

## 🧪 Testing

### Visual Testing

1. Open DevTools (F12)
2. Enable Device Toolbar (Ctrl+Shift+M)
3. Select iPhone 14 Pro or similar
4. Test components:
   - Verify touch targets ≥ 48px
   - Check spacing is consistent
   - Test tap feedback on interactive cards
   - Verify keyboard navigation

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react'
import { MobileCard } from '@/components/mobile/layouts'

test('MobileCard has minimum touch height when interactive', () => {
  render(<MobileCard interactive>Test</MobileCard>)
  const card = screen.getByText('Test').parentElement

  const styles = window.getComputedStyle(card!)
  const minHeight = styles.minHeight

  expect(minHeight).toBe('48px') // min-h-touch
})
```

---

## 📏 Design Specifications

### Spacing Scale (rem units)

| Token | Value   | Pixels (16px base) |
| ----- | ------- | ------------------ |
| sm    | 0.75rem | 12px               |
| md    | 1rem    | 16px               |
| lg    | 1.5rem  | 24px               |
| xl    | 2rem    | 32px               |

### Touch Targets

| Size     | Value | Use Case           |
| -------- | ----- | ------------------ |
| touch-sm | 44px  | iOS minimum        |
| touch-md | 48px  | WCAG AAA (default) |
| touch-lg | 56px  | Extra comfortable  |
| touch-xl | 64px  | Maximum            |

---

## ✅ Checklist for Subtask 1.2

- [x] Created MobileContainer component
- [x] Created MobileGrid component (CSS Grid)
- [x] Created MobileStack component (Flexbox)
- [x] Created MobileCard component (touch-friendly)
- [x] All components use relative units (rem)
- [x] Touch targets meet WCAG AAA (48px)
- [x] Proper TypeScript types
- [x] Accessibility features (keyboard, ARIA)
- [x] Comprehensive documentation
- [x] Usage examples (3 complete examples)

**Status:** ✅ Complete - Ready for subtask 1.3

---

**Next Steps:**

- Subtask 1.3: Enforce Touch Target and Spacing Standards
- Continue creating mobile components using these layouts
- Remember: Desktop first, mobile second!
