import { lazy, ComponentType } from 'react'
import { useIsMobile, useIsTablet, useIsDesktop, useIsMobileOrTablet } from './useMediaQuery'

/**
 * Conditional Loading Utilities
 *
 * These utilities help conditionally load heavy components based on device type,
 * preventing unnecessary bundle loading on mobile devices.
 */

/**
 * Device type for conditional rendering
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'mobileOrTablet' | 'all'

/**
 * Options for conditional component loading
 */
export interface ConditionalLoadOptions {
  /**
   * Device types where this component should load
   * @default 'all'
   */
  loadOn?: DeviceType | DeviceType[]
  /**
   * Fallback component to show when not loading the heavy component
   */
  fallback?: ComponentType<any>
  /**
   * Whether to preload the component on hover (desktop only)
   * @default false
   */
  preloadOnHover?: boolean
}

/**
 * Hook to determine if a heavy component should be loaded based on device
 *
 * @param loadOn - Device type(s) to load on
 * @returns Whether the component should load
 *
 * @example
 * const shouldLoad = useShouldLoadComponent('desktop')
 * if (shouldLoad) {
 *   return <HeavyComponent />
 * }
 * return <LightweightFallback />
 */
export const useShouldLoadComponent = (loadOn: DeviceType | DeviceType[] = 'all'): boolean => {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  const isMobileOrTablet = useIsMobileOrTablet()

  // Convert to array for easier checking
  const loadOnArray = Array.isArray(loadOn) ? loadOn : [loadOn]

  // Load on all devices
  if (loadOnArray.includes('all')) {
    return true
  }

  // Check specific device types
  if (loadOnArray.includes('mobile') && isMobile) {
    return true
  }
  if (loadOnArray.includes('tablet') && isTablet) {
    return true
  }
  if (loadOnArray.includes('desktop') && isDesktop) {
    return true
  }
  if (loadOnArray.includes('mobileOrTablet') && isMobileOrTablet) {
    return true
  }

  return false
}

/**
 * Creates a conditionally loaded lazy component
 *
 * The component will only load on specified devices. On other devices,
 * it will render the fallback component (or null).
 *
 * @param importFn - Dynamic import function
 * @param options - Loading options
 * @returns Lazy component that loads conditionally
 *
 * @example
 * // Only load on desktop
 * const Heavy3DVisualization = createConditionalComponent(
 *   () => import('./Heavy3DVisualization'),
 *   { loadOn: 'desktop', fallback: StaticImage }
 * )
 *
 * @example
 * // Load on desktop and tablet, but not mobile
 * const InteractiveChart = createConditionalComponent(
 *   () => import('./InteractiveChart'),
 *   { loadOn: ['desktop', 'tablet'], fallback: StaticChart }
 * )
 */
export const createConditionalComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: ConditionalLoadOptions = {}
): ComponentType<any> => {
  const { loadOn = 'all', fallback: Fallback } = options

  // Create the lazy component
  const LazyComponent = lazy(importFn)

  // Return a wrapper component that conditionally loads
  return (props: any) => {
    const shouldLoad = useShouldLoadComponent(loadOn)

    if (!shouldLoad) {
      return Fallback ? <Fallback {...props} /> : null
    }

    return <LazyComponent {...props} />
  }
}

/**
 * Hook for conditional preloading
 * Returns a preload function that can be called on hover/interaction
 *
 * @param importFn - Dynamic import function
 * @param loadOn - Device types to preload on
 * @returns Preload function
 *
 * @example
 * const preload = useConditionalPreload(
 *   () => import('./HeavyComponent'),
 *   'desktop'
 * )
 *
 * <button onMouseEnter={preload}>View Details</button>
 */
export const useConditionalPreload = (
  importFn: () => Promise<any>,
  loadOn: DeviceType | DeviceType[] = 'all'
): (() => void) => {
  const shouldLoad = useShouldLoadComponent(loadOn)

  return () => {
    if (shouldLoad) {
      // Trigger the import to start preloading
      importFn().catch((err) => {
        console.warn('Preload failed:', err)
      })
    }
  }
}

/**
 * Utility to check if we're on a mobile device (for use outside React components)
 *
 * @returns Whether the current device is mobile
 *
 * @example
 * if (isMobileDevice()) {
 *   // Use lightweight implementation
 * } else {
 *   // Use feature-rich implementation
 * }
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(max-width: 639px)').matches
}

/**
 * Utility to check if we're on a tablet device (for use outside React components)
 */
export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(min-width: 640px) and (max-width: 1023px)').matches
}

/**
 * Utility to check if we're on a desktop device (for use outside React components)
 */
export const isDesktopDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(min-width: 1024px)').matches
}

/**
 * Utility to check if we're on mobile or tablet (for use outside React components)
 */
export const isMobileOrTabletDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(max-width: 1023px)').matches
}

/**
 * Higher-order function to conditionally execute code based on device
 *
 * @param desktopFn - Function to execute on desktop
 * @param mobileFn - Function to execute on mobile (optional)
 * @returns Result of the appropriate function
 *
 * @example
 * const config = runByDevice(
 *   () => ({ quality: 'high', effects: true }),
 *   () => ({ quality: 'low', effects: false })
 * )
 */
export const runByDevice = <T, U = T>(desktopFn: () => T, mobileFn?: () => U): T | U => {
  if (isMobileOrTabletDevice() && mobileFn) {
    return mobileFn()
  }
  return desktopFn()
}

/**
 * Creates a device-specific lazy loader with automatic code splitting
 *
 * @example
 * const { MobileComponent, DesktopComponent } = createDeviceVariants({
 *   mobile: () => import('./MobileVersion'),
 *   desktop: () => import('./DesktopVersion')
 * })
 */
export const createDeviceVariants = <
  M extends ComponentType<any>,
  D extends ComponentType<any>,
>(config: {
  mobile: () => Promise<{ default: M }>
  desktop: () => Promise<{ default: D }>
  tablet?: () => Promise<{ default: ComponentType<any> }>
}): {
  Component: ComponentType<any>
  preloadMobile: () => void
  preloadDesktop: () => void
} => {
  const MobileComponent = lazy(config.mobile)
  const DesktopComponent = lazy(config.desktop)
  const TabletComponent = config.tablet ? lazy(config.tablet) : null

  const Component = (props: any) => {
    const isMobile = useIsMobile()
    const isTablet = useIsTablet()

    if (isMobile) {
      return <MobileComponent {...props} />
    }

    if (isTablet && TabletComponent) {
      return <TabletComponent {...props} />
    }

    return <DesktopComponent {...props} />
  }

  return {
    Component,
    preloadMobile: () => {
      config.mobile().catch(console.warn)
    },
    preloadDesktop: () => {
      config.desktop().catch(console.warn)
    },
  }
}

export default {
  useShouldLoadComponent,
  createConditionalComponent,
  useConditionalPreload,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  isMobileOrTabletDevice,
  runByDevice,
  createDeviceVariants,
}
