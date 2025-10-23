# Conditional Loading Utilities - Usage Guide

Comprehensive guide for using conditional loading utilities to optimize mobile performance by loading heavy components only when appropriate.

## Overview

The conditional loading system provides:
- **Device-based component loading** - Load different components for mobile/tablet/desktop
- **Lazy loading optimization** - Split bundles and load only what's needed
- **Performance optimization** - Prevent heavy 3D/interactive components from loading on mobile
- **Automatic code splitting** - Reduce initial bundle size

## Quick Start

### 1. Load Component Only on Desktop

```tsx
import { createConditionalComponent } from '@/hooks'

// Only load heavy 3D visualization on desktop
const Heavy3DVisualization = createConditionalComponent(
  () => import('./Heavy3DVisualization'),
  {
    loadOn: 'desktop',
    fallback: StaticImage, // Show on mobile instead
  }
)

function Dashboard() {
  return (
    <div>
      <Heavy3DVisualization data={data} />
      {/* Mobile users see StaticImage, desktop users get the heavy component */}
    </div>
  )
}
```

### 2. Different Components for Mobile vs Desktop

```tsx
import { createDeviceVariants } from '@/hooks'

const { Component: Hero } = createDeviceVariants({
  mobile: () => import('./HeroMobile'),
  desktop: () => import('./HeroDesktop'),
})

function App() {
  return <Hero />
  {/* Automatically shows correct variant based on device */}
}
```

### 3. Conditional Rendering Hook

```tsx
import { useShouldLoadComponent } from '@/hooks'

function FeatureSection() {
  const shouldLoadInteractive = useShouldLoadComponent('desktop')

  return (
    <div>
      {shouldLoadInteractive ? (
        <InteractiveChart data={data} />
      ) : (
        <StaticChart data={data} />
      )}
    </div>
  )
}
```

## API Reference

### `createConditionalComponent`

Creates a lazy-loaded component that only loads on specified devices.

```tsx
const Component = createConditionalComponent(
  importFn: () => Promise<{ default: ComponentType }>,
  options?: {
    loadOn?: 'mobile' | 'tablet' | 'desktop' | 'all' | Array<...>
    fallback?: ComponentType
    preloadOnHover?: boolean
  }
)
```

**Parameters:**
- `importFn` - Dynamic import function (e.g., `() => import('./Component')`)
- `options.loadOn` - Device(s) to load on. Default: `'all'`
- `options.fallback` - Component to show on other devices. Default: `null`
- `options.preloadOnHover` - Preload on hover (desktop only). Default: `false`

**Examples:**

```tsx
// Desktop only
const HeavyComponent = createConditionalComponent(
  () => import('./HeavyComponent'),
  { loadOn: 'desktop' }
)

// Desktop + Tablet, with fallback
const InteractiveChart = createConditionalComponent(
  () => import('./InteractiveChart'),
  {
    loadOn: ['desktop', 'tablet'],
    fallback: StaticChart,
  }
)
```

### `createDeviceVariants`

Creates device-specific component variants with automatic code splitting.

```tsx
const { Component, preloadMobile, preloadDesktop } = createDeviceVariants({
  mobile: () => import('./ComponentMobile'),
  desktop: () => import('./ComponentDesktop'),
  tablet?: () => import('./ComponentTablet'), // Optional
})
```

**Returns:**
- `Component` - Smart component that renders correct variant
- `preloadMobile()` - Function to preload mobile variant
- `preloadDesktop()` - Function to preload desktop variant

**Example:**

```tsx
const { Component: Navigation, preloadDesktop } = createDeviceVariants({
  mobile: () => import('./MobileBottomNav'),
  desktop: () => import('./DesktopTopNav'),
})

function App() {
  const isMobile = useIsMobile()

  return (
    <>
      <Navigation />
      {/* Preload desktop nav on mobile when user might switch */}
      {isMobile && (
        <button onMouseEnter={preloadDesktop}>
          View Desktop Version
        </button>
      )}
    </>
  )
}
```

### `useShouldLoadComponent`

Hook to determine if a component should load based on device.

```tsx
const shouldLoad = useShouldLoadComponent(
  loadOn: 'mobile' | 'tablet' | 'desktop' | 'all' | Array<...>
): boolean
```

**Example:**

```tsx
function VisualizationSection() {
  const shouldLoad3D = useShouldLoadComponent('desktop')
  const shouldLoadInteractive = useShouldLoadComponent(['desktop', 'tablet'])

  return (
    <div>
      {shouldLoad3D && <ThreeDVisualization />}
      {shouldLoadInteractive && <InteractiveControls />}
      <StaticContent />
    </div>
  )
}
```

### `useConditionalPreload`

Hook for conditional preloading on hover/interaction.

```tsx
const preload = useConditionalPreload(
  importFn: () => Promise<any>,
  loadOn: DeviceType = 'all'
): () => void
```

**Example:**

```tsx
function DashboardCard() {
  const preload = useConditionalPreload(
    () => import('./DetailedView'),
    'desktop'
  )

  return (
    <div
      onMouseEnter={preload} // Preload on hover (desktop only)
      onClick={() => navigate('/details')}
    >
      <h3>View Details</h3>
    </div>
  )
}
```

### Device Detection Utilities

Non-React utilities for use outside components.

```tsx
import {
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  isMobileOrTabletDevice,
} from '@/hooks'

// In utility functions, configs, etc.
const config = {
  quality: isMobileDevice() ? 'low' : 'high',
  effects: isDesktopDevice(),
}
```

### `runByDevice`

Execute different functions based on device.

```tsx
import { runByDevice } from '@/hooks'

const settings = runByDevice(
  () => ({ quality: 'high', particles: 1000 }), // Desktop
  () => ({ quality: 'low', particles: 100 })    // Mobile
)
```

## Common Patterns

### Pattern 1: Heavy 3D Visualizations

```tsx
// Only load THREE.js and 3D components on desktop
const CoreSphere3D = createConditionalComponent(
  () => import('./CoreSphere3D'),
  {
    loadOn: 'desktop',
    fallback: CoreSphereStatic, // 2D image on mobile
  }
)

function Hero() {
  return (
    <div className="hero">
      <CoreSphere3D />
    </div>
  )
}
```

### Pattern 2: Interactive Charts

```tsx
// Load Chart.js only on desktop/tablet
const InteractiveChart = createConditionalComponent(
  () => import('./ChartComponent'),
  {
    loadOn: ['desktop', 'tablet'],
    fallback: ({ data }) => (
      <img
        src={`/api/chart-image?data=${JSON.stringify(data)}`}
        alt="Chart"
      />
    ),
  }
)
```

### Pattern 3: Progressive Enhancement

```tsx
function FeatureSection() {
  const shouldLoadVideo = useShouldLoadComponent(['desktop', 'tablet'])

  return (
    <div>
      {shouldLoadVideo ? (
        <video src="/feature.mp4" autoPlay loop />
      ) : (
        <img src="/feature-poster.jpg" alt="Feature" />
      )}
      <FeatureDescription />
    </div>
  )
}
```

### Pattern 4: Lazy Load with Suspense

```tsx
import { Suspense } from 'react'

const HeavyComponent = createConditionalComponent(
  () => import('./HeavyComponent'),
  { loadOn: 'desktop' }
)

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Pattern 5: Conditional Feature Loading

```tsx
function Dashboard() {
  const shouldLoadAdvanced = useShouldLoadComponent('desktop')

  return (
    <div>
      <BasicDashboard />
      {shouldLoadAdvanced && (
        <Suspense fallback={<div>Loading advanced features...</div>}>
          <AdvancedAnalytics />
          <RealTimeUpdates />
          <InteractiveFilters />
        </Suspense>
      )}
    </div>
  )
}
```

## Performance Best Practices

### 1. Bundle Size Optimization

```tsx
// ✅ DO: Split heavy dependencies by device
const DesktopVisualization = createConditionalComponent(
  () => import('./DesktopVisualization'), // Includes THREE.js, D3, etc.
  { loadOn: 'desktop' }
)

// ❌ DON'T: Load everything for everyone
import { HeavyVisualization } from './HeavyVisualization' // Loads on mobile too!
```

### 2. Preloading Strategy

```tsx
// ✅ DO: Preload on interaction hints
function Navigation() {
  const preloadDashboard = useConditionalPreload(
    () => import('./Dashboard'),
    'desktop'
  )

  return (
    <nav>
      <Link to="/dashboard" onMouseEnter={preloadDashboard}>
        Dashboard
      </Link>
    </nav>
  )
}
```

### 3. Fallback Components

```tsx
// ✅ DO: Provide meaningful fallbacks
const InteractiveMap = createConditionalComponent(
  () => import('./InteractiveMap'),
  {
    loadOn: 'desktop',
    fallback: ({ locations }) => (
      <div>
        <StaticMapImage locations={locations} />
        <LocationList locations={locations} />
      </div>
    ),
  }
)

// ❌ DON'T: Leave mobile users with nothing
const InteractiveMap = createConditionalComponent(
  () => import('./InteractiveMap'),
  { loadOn: 'desktop' } // null on mobile!
)
```

### 4. Testing

```tsx
// Test both device variants
describe('Hero Component', () => {
  it('should load 3D on desktop', () => {
    mockDesktopDevice()
    render(<Hero />)
    expect(screen.getByTestId('3d-visualization')).toBeInTheDocument()
  })

  it('should load static image on mobile', () => {
    mockMobileDevice()
    render(<Hero />)
    expect(screen.getByAltText('Hero image')).toBeInTheDocument()
    expect(screen.queryByTestId('3d-visualization')).not.toBeInTheDocument()
  })
})
```

## Debugging

### Check What's Loading

```tsx
function DebugLoadInfo() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()

  if (process.env.NODE_ENV === 'development') {
    console.log('Device:', { isMobile, isTablet, isDesktop })
  }

  return null
}
```

### Bundle Analysis

```bash
# Analyze bundle sizes
npm run build -- --analyze

# Check what's in mobile vs desktop bundles
```

## Migration Guide

### From Old Code

```tsx
// BEFORE: Loading everything
import { Heavy3D } from './Heavy3D'

function Hero() {
  return <Heavy3D />
}

// AFTER: Conditional loading
const Heavy3D = createConditionalComponent(
  () => import('./Heavy3D'),
  { loadOn: 'desktop', fallback: Static3D }
)

function Hero() {
  return <Heavy3D />
}
```

### From Manual Device Detection

```tsx
// BEFORE: Manual detection
function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  return isMobile ? <MobileHero /> : <DesktopHero />
}

// AFTER: Use createDeviceVariants
const { Component: Hero } = createDeviceVariants({
  mobile: () => import('./MobileHero'),
  desktop: () => import('./DesktopHero'),
})
```

## TypeScript Support

Full TypeScript support with type inference:

```tsx
import type { DeviceType, ConditionalLoadOptions } from '@/hooks'

// Type-safe device configuration
const loadOn: DeviceType[] = ['desktop', 'tablet']

// Inferred prop types
const MyComponent = createConditionalComponent(
  () => import('./MyComponent'), // Props are inferred!
  { loadOn }
)

// Full type safety
<MyComponent prop1="value" prop2={123} /> // ✅ Type-checked
```

## Summary

✅ **Use conditional loading for:**
- Heavy 3D visualizations (THREE.js, R3F)
- Interactive charts and graphs
- Video players and animations
- Large libraries (D3, Leaflet, etc.)
- Desktop-specific features

❌ **Don't use for:**
- Small components (<10KB)
- Critical above-the-fold content
- Simple UI elements

**Result:** Faster mobile load times, better Core Web Vitals, happier users! 🚀

