# Mobile Layout System Examples

## Installation & Usage

```tsx
import {
  Container,
  Grid,
  Flex,
  Stack,
  ResponsiveLayout,
  MobileCard,
  TouchableArea
} from '@/components/mobile/layouts';
```

## Core Components

### Container

Responsive container met max-width constraints en optionele centering.

```tsx
// Basic usage
<Container>
  <h1>Content</h1>
</Container>

// With custom max width
<Container maxWidth="tablet">
  <p>Smaller container</p>
</Container>

// With responsive spacing
<Container px={{ mobile: 4, tablet: 8, desktop: 12 }}>
  <p>Custom padding</p>
</Container>

// Full width on mobile only
<Container fullWidthMobile={true}>
  <p>Full width on mobile, contained on larger screens</p>
</Container>
```

### Grid

CSS Grid layout met responsive columns en rows.

```tsx
// Responsive grid (1 column mobile, 2 tablet, 3 desktop)
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Auto-fit grid (automatically fits columns)
<Grid autoFit={{ mobile: '280px', desktop: '320px' }} gap={6}>
  <MobileCard>Card 1</MobileCard>
  <MobileCard>Card 2</MobileCard>
  <MobileCard>Card 3</MobileCard>
</Grid>

// Custom rows and columns
<Grid
  columns={{ mobile: 2, desktop: 4 }}
  rows={{ mobile: 3, desktop: 2 }}
  gap={4}
>
  {items.map(item => <div key={item.id}>{item.content}</div>)}
</Grid>
```

### Flex

Flexbox layout met responsive direction en alignment.

```tsx
// Horizontal flex (responsive direction)
<Flex
  direction={{ mobile: 'column', tablet: 'row' }}
  justify="between"
  align="center"
  gap={4}
>
  <div>Left</div>
  <div>Right</div>
</Flex>

// Vertical stack with wrap
<Flex direction="column" wrap={true} gap={2}>
  <button>Action 1</button>
  <button>Action 2</button>
  <button>Action 3</button>
</Flex>

// Centered content
<Flex justify="center" align="center" className="min-h-screen">
  <div>Centered content</div>
</Flex>
```

### Stack

Vertical of horizontal stack met consistent spacing.

```tsx
// Vertical stack (default)
<Stack spacing={4}>
  <h2>Title</h2>
  <p>Content</p>
  <button>Action</button>
</Stack>

// Horizontal stack
<Stack direction="horizontal" spacing={2}>
  <button>Cancel</button>
  <button>Save</button>
</Stack>

// Stack with dividers
<Stack
  spacing={4}
  divider={<div className="bg-border-primary" />}
>
  <div>Section 1</div>
  <div>Section 2</div>
  <div>Section 3</div>
</Stack>

// Responsive stack direction
<Stack
  direction={{ mobile: 'vertical', tablet: 'horizontal' }}
  spacing={{ mobile: 4, tablet: 6 }}
>
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>
```

## Layout Templates

### ResponsiveLayout

High-level layout component voor common patterns.

```tsx
// Single column layout
<ResponsiveLayout variant="single">
  <h1>Page Title</h1>
  <p>Content...</p>
</ResponsiveLayout>

// Sidebar layout (stacked on mobile, side-by-side on desktop)
<ResponsiveLayout
  variant="sidebar"
  sidebar={<aside>Sidebar content</aside>}
  sidebarPosition="left"
>
  <main>Main content</main>
</ResponsiveLayout>

// Split layout (50/50)
<ResponsiveLayout variant="split">
  <div>Left half</div>
  <div>Right half</div>
</ResponsiveLayout>

// Cards grid
<ResponsiveLayout
  variant="cards"
  cardColumns={{ mobile: 1, tablet: 2, desktop: 3 }}
>
  {products.map(product => (
    <MobileCard key={product.id}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </MobileCard>
  ))}
</ResponsiveLayout>
```

## Interactive Components

### MobileCard

Responsive card met touch-friendly sizing.

```tsx
// Basic card
<MobileCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</MobileCard>

// Elevated card with hover effect
<MobileCard variant="elevated" hoverable>
  <h3>Hover me</h3>
</MobileCard>

// Interactive/clickable card
<MobileCard
  interactive
  onClick={() => console.log('Clicked!')}
>
  <h3>Click me</h3>
</MobileCard>

// Outlined card
<MobileCard variant="outlined" p={6}>
  <h3>Custom padding</h3>
</MobileCard>
```

### TouchableArea

Garandeert minimum touch target size (48x48px).

```tsx
// Icon button with touch area
<TouchableArea
  size="md"
  onClick={() => handleClick()}
  aria-label="Close"
>
  <X className="w-6 h-6" />
</TouchableArea>

// Large touch target
<TouchableArea size="lg" onClick={handleShare}>
  <Share2 className="w-8 h-8" />
</TouchableArea>

// Disabled state
<TouchableArea disabled onClick={handleAction}>
  <Settings className="w-6 h-6" />
</TouchableArea>

// No press effect
<TouchableArea pressEffect={false}>
  <Info className="w-6 h-6" />
</TouchableArea>
```

## Real-World Examples

### Product Card Grid

```tsx
<Container>
  <h1 className="text-3xl font-bold mb-6">Products</h1>
  
  <Grid
    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
    gap={{ mobile: 4, desktop: 6 }}
  >
    {products.map(product => (
      <MobileCard
        key={product.id}
        hoverable
        interactive
        onClick={() => viewProduct(product.id)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold mb-2">
          {product.name}
        </h3>
        <p className="text-text-secondary mb-4">
          {product.description}
        </p>
        <Flex justify="between" align="center">
          <span className="text-xl font-bold">
            €{product.price}
          </span>
          <TouchableArea
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </TouchableArea>
        </Flex>
      </MobileCard>
    ))}
  </Grid>
</Container>
```

### Mobile Navigation

```tsx
<Container fullWidthMobile>
  <Flex
    direction={{ mobile: 'column', tablet: 'row' }}
    justify="between"
    align="center"
    py={4}
  >
    <div className="mb-4 tablet:mb-0">
      <Logo />
    </div>
    
    <Stack
      direction={{ mobile: 'vertical', tablet: 'horizontal' }}
      spacing={{ mobile: 2, tablet: 4 }}
      className="w-full tablet:w-auto"
    >
      <TouchableArea onClick={() => navigate('/home')}>
        <Home className="w-5 h-5 mr-2" />
        Home
      </TouchableArea>
      <TouchableArea onClick={() => navigate('/products')}>
        <Package className="w-5 h-5 mr-2" />
        Products
      </TouchableArea>
      <TouchableArea onClick={() => navigate('/contact')}>
        <Mail className="w-5 h-5 mr-2" />
        Contact
      </TouchableArea>
    </Stack>
  </Flex>
</Container>
```

### Dashboard Layout

```tsx
<ResponsiveLayout
  variant="sidebar"
  sidebar={
    <Stack spacing={2}>
      <TouchableArea className="w-full justify-start">
        <LayoutDashboard className="w-5 h-5 mr-3" />
        Dashboard
      </TouchableArea>
      <TouchableArea className="w-full justify-start">
        <Users className="w-5 h-5 mr-3" />
        Users
      </TouchableArea>
      <TouchableArea className="w-full justify-start">
        <Settings className="w-5 h-5 mr-3" />
        Settings
      </TouchableArea>
    </Stack>
  }
  sidebarPosition="left"
>
  <Stack spacing={6}>
    <h1 className="text-3xl font-bold">Dashboard</h1>
    
    <Grid
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      gap={4}
    >
      <MobileCard>
        <Stack spacing={2}>
          <span className="text-text-secondary text-sm">Revenue</span>
          <span className="text-2xl font-bold">€12,345</span>
          <span className="text-success text-sm">+12.5%</span>
        </Stack>
      </MobileCard>
      <MobileCard>
        <Stack spacing={2}>
          <span className="text-text-secondary text-sm">Users</span>
          <span className="text-2xl font-bold">1,234</span>
          <span className="text-success text-sm">+8.2%</span>
        </Stack>
      </MobileCard>
      <MobileCard>
        <Stack spacing={2}>
          <span className="text-text-secondary text-sm">Orders</span>
          <span className="text-2xl font-bold">567</span>
          <span className="text-error text-sm">-3.1%</span>
        </Stack>
      </MobileCard>
      <MobileCard>
        <Stack spacing={2}>
          <span className="text-text-secondary text-sm">Conversion</span>
          <span className="text-2xl font-bold">3.2%</span>
          <span className="text-success text-sm">+0.5%</span>
        </Stack>
      </MobileCard>
    </Grid>
  </Stack>
</ResponsiveLayout>
```

### Form Layout

```tsx
<Container maxWidth="tablet">
  <MobileCard p={{ mobile: 6, tablet: 8 }}>
    <Stack spacing={6}>
      <h2 className="text-2xl font-bold">Contact Form</h2>
      
      <Stack spacing={4}>
        <div>
          <label className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full min-h-touch p-3 rounded-lg bg-bg-surface"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full min-h-touch p-3 rounded-lg bg-bg-surface"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            rows={4}
            className="w-full p-3 rounded-lg bg-bg-surface resize-none"
          />
        </div>
      </Stack>
      
      <Flex
        direction={{ mobile: 'column', tablet: 'row' }}
        justify="end"
        gap={3}
      >
        <TouchableArea
          size="lg"
          className="tablet:w-auto w-full"
        >
          Cancel
        </TouchableArea>
        <TouchableArea
          size="lg"
          className="bg-accent-primary tablet:w-auto w-full"
        >
          Send Message
        </TouchableArea>
      </Flex>
    </Stack>
  </MobileCard>
</Container>
```

## Best Practices

### 1. Always Think Mobile-First

```tsx
// ✅ Good: Start with mobile, enhance for larger screens
<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>

// ❌ Bad: Desktop-first approach
<Grid columns={{ desktop: 3, tablet: 2, mobile: 1 }}>
```

### 2. Use Relative Units

```tsx
// ✅ Good: Tailwind spacing utilities (rem-based)
<Container p={4} gap={6}>

// ❌ Bad: Fixed pixel values
<Container style={{ padding: '16px', gap: '24px' }}>
```

### 3. Ensure Touch Targets

```tsx
// ✅ Good: Minimum 48x48px touch area
<TouchableArea size="md" onClick={handleClick}>
  <Icon />
</TouchableArea>

// ❌ Bad: Too small for touch
<button className="p-1 w-6 h-6">
  <Icon />
</button>
```

### 4. Responsive Spacing

```tsx
// ✅ Good: Different spacing per breakpoint
<Stack spacing={{ mobile: 4, tablet: 6, desktop: 8 }}>

// ❌ Bad: Fixed spacing for all screens
<Stack spacing={4}>
```

### 5. Test on Real Devices

- Always test on actual phones and tablets
- Use browser dev tools for initial testing
- Validate touch interactions manually
- Check in both portrait and landscape

## Performance Tips

1. **Avoid unnecessary re-renders**: Use `React.memo()` for card components
2. **Virtualize long lists**: Use `react-window` for 100+ items
3. **Lazy load images**: Add `loading="lazy"` to images
4. **Minimize layout shifts**: Reserve space for content
5. **Use CSS containment**: Add `contain: layout` for isolated components

