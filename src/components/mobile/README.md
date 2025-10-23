# Mobile Components Directory Structure

## Overview

The `/components/mobile` directory contains all mobile-optimized, responsive components built following Apple HIG and WCAG guidelines.

## Directory Structure

```
src/components/mobile/
├── index.ts                           # Central exports
├── layouts/                           # Layout components
│   ├── index.ts                      # Layout exports
│   ├── types.ts                      # TypeScript definitions
│   ├── utils.ts                      # Utility functions
│   ├── Container.tsx                 # Responsive container
│   ├── Grid.tsx                      # CSS Grid layout
│   ├── Flex.tsx                      # Flexbox layout
│   ├── Stack.tsx                     # Vertical/horizontal stack
│   ├── ResponsiveLayout.tsx          # High-level templates
│   ├── MobileCard.tsx                # Touch-friendly cards
│   ├── TouchableArea.tsx             # Touch target wrapper
│   └── EXAMPLES.md                   # Usage examples
├── TouchTargetDebug.tsx              # Debug overlay (dev only)
├── TOUCH_TARGET_STANDARDS.md         # Touch target documentation
└── README.md                         # This file

Supporting Files:
├── src/styles/
│   ├── touch-targets.css             # Touch target utilities
│   ├── mobile-design-system.md       # Design system docs
│   └── DARK_MODE_IMPLEMENTATION.md   # Dark mode docs
└── src/utils/
    └── touchTargetAudit.ts           # Touch target audit tools
```

## Component Categories

### 1. Layout Components (`/layouts`)

**Purpose:** Provide responsive, mobile-first layout primitives

**Components:**
- `Container` - Responsive wrapper met max-width
- `Grid` - CSS Grid met responsive columns
- `Flex` - Flexbox met responsive alignment
- `Stack` - Vertical/horizontal spacing
- `ResponsiveLayout` - High-level templates
- `MobileCard` - Touch-friendly card wrapper
- `TouchableArea` - Gegarandeerde touch targets

**Usage:**
```tsx
import { Container, Grid, MobileCard } from '@/components/mobile';
```

### 2. Development Tools

**Purpose:** Debugging en validation tijdens development

**Components:**
- `TouchTargetDebug` - Visual touch target overlay
- Audit utilities in `src/utils/touchTargetAudit.ts`

**Usage:**
```tsx
import { TouchTargetDebug } from '@/components/mobile';

// In App.tsx (development only)
{process.env.NODE_ENV === 'development' && <TouchTargetDebug />}
```

## Naming Conventions

### Component Files
- **PascalCase** voor component namen: `MobileCard.tsx`
- **Descriptive names** die functie duidelijk maken
- **Mobile prefix** voor mobile-specific variants

### Utility Files
- **camelCase** voor utility functions: `touchTargetAudit.ts`
- **Descriptive names** die gebruik duidelijk maken

### Documentation Files
- **UPPER_SNAKE_CASE** voor belangrijke docs: `TOUCH_TARGET_STANDARDS.md`
- **lowercase** voor algemene docs: `mobile-design-system.md`
- **EXAMPLES.md** voor usage voorbeelden

## Import Patterns

### From Mobile Components
```tsx
// Layout components
import {
  Container,
  Grid,
  Flex,
  Stack,
  ResponsiveLayout,
  MobileCard,
  TouchableArea
} from '@/components/mobile/layouts';

// Or via main export
import { Container, Grid } from '@/components/mobile';

// Debug tools
import { TouchTargetDebug } from '@/components/mobile';
```

### From Common Components
```tsx
// Use existing common components
import { Button } from '@/components/common';

// Combine with mobile layouts
<Container>
  <Button className="tap-target">Click Me</Button>
</Container>
```

## Adding New Mobile Components

### 1. Create Component File

```tsx
// src/components/mobile/NewComponent.tsx
import React from 'react';
import { cn } from '@/components/mobile/layouts/utils';

interface NewComponentProps {
  children: React.ReactNode;
  className?: string;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('min-h-touch tap-target', className)}>
      {children}
    </div>
  );
};

NewComponent.displayName = 'NewComponent';
```

### 2. Add to Exports

```tsx
// src/components/mobile/index.ts
export * from './layouts';
export { default as TouchTargetDebug } from './TouchTargetDebug';
export { NewComponent } from './NewComponent'; // Add this
```

### 3. Document Usage

Add examples to relevant documentation:
- Component-specific docs in component file
- Usage patterns in `EXAMPLES.md`
- Standards in relevant `.md` files

### 4. Add Tests (Future)

```tsx
// src/components/mobile/__tests__/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from '../NewComponent';

describe('NewComponent', () => {
  it('renders children', () => {
    render(<NewComponent>Test</NewComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  
  it('meets touch target size', () => {
    const { container } = render(<NewComponent>Test</NewComponent>);
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveStyle({ minHeight: '48px' });
  });
});
```

## Best Practices

### 1. Always Use Mobile-First Approach

```tsx
// ✅ Good: Start with mobile
<Container className="px-4 tablet:px-6 desktop:px-8">

// ❌ Bad: Desktop-first
<Container className="desktop:px-8 tablet:px-6 px-4">
```

### 2. Ensure Touch Target Compliance

```tsx
// ✅ Good: Minimum 48×48px
<button className="tap-target px-6 py-3">

// ❌ Bad: Too small
<button className="px-2 py-1">
```

### 3. Use Semantic Components

```tsx
// ✅ Good: Semantic layouts
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
  <MobileCard>Content</MobileCard>
</Grid>

// ❌ Bad: Manual div soup
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div className="p-4 rounded-lg">Content</div>
</div>
```

### 4. Document Complex Components

```tsx
/**
 * ComplexMobileComponent
 * 
 * @description Detailed description of what it does
 * @param {Props} props - Component props
 * @example
 * <ComplexMobileComponent variant="primary">
 *   Content
 * </ComplexMobileComponent>
 */
export const ComplexMobileComponent = ({ ... }) => { ... }
```

## Integration with Existing Components

### Common Components

Bestaande components in `/components/common` blijven bestaan. Mobile components zijn een **aanvulling**, geen vervanging.

**When to use mobile components:**
- Voor nieuwe, mobile-first features
- Voor layout structuur
- Voor touch target guarantees

**When to use common components:**
- Voor bestaande, werkende components
- Voor domain-specific components (Button, Modal, etc.)
- Voor components die al mobile-friendly zijn

### Migration Strategy

Geen directe migratie nodig. Nieuwe features gebruiken mobile components, bestaande features blijven ongewijzigd tenzij er mobile issues zijn.

```tsx
// Geleidelijke adoptie
// Old: Pure Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

// New: Mobile components
<Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
```

## Future Expansion

### Planned Components

1. **Forms** (`/mobile/forms`)
   - MobileInput
   - MobileTextarea
   - MobileSelect
   - MobileCheckbox
   - MobileRadio

2. **Navigation** (`/mobile/navigation`)
   - MobileNav
   - MobileMenu
   - MobileTabs
   - BottomNavigation

3. **Feedback** (`/mobile/feedback`)
   - MobileToast
   - MobileModal
   - MobileDrawer
   - MobileAlert

4. **Data Display** (`/mobile/data`)
   - MobileTable
   - MobileList
   - MobileTimeline
   - MobileStats

## Maintenance

### Regular Tasks

1. **Weekly:**
   - Check for new mobile patterns
   - Update examples
   - Review touch target compliance

2. **Monthly:**
   - Audit mobile components
   - Update documentation
   - Review device compatibility

3. **Per Release:**
   - Run full mobile test suite
   - Update CHANGELOG
   - Review and update standards

### Standards Review

Periodically review:
- Apple HIG updates
- WCAG guideline changes
- Material Design updates
- Browser/device compatibility

## Resources

### Internal
- [Mobile Design System](../../styles/mobile-design-system.md)
- [Touch Target Standards](./TOUCH_TARGET_STANDARDS.md)
- [Dark Mode Implementation](../../styles/DARK_MODE_IMPLEMENTATION.md)
- [Layout Examples](./layouts/EXAMPLES.md)

### External
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [MDN Mobile Web](https://developer.mozilla.org/en-US/docs/Web/Guide/Mobile)

## Support

Voor vragen of problemen met mobile components:
1. Check de relevante documentation
2. Review EXAMPLES.md
3. Check TouchTargetDebug output
4. Review component source code

## Changelog

### 2025-10-23 - Initial Release
- ✅ Layout components system
- ✅ Touch target standards
- ✅ Debug tools
- ✅ Comprehensive documentation
- ✅ TypeScript type definitions
- ✅ WCAG 2.1 AA compliance

