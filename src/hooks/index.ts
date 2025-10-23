// Export all custom hooks
export { useScrollToTop } from './useScrollToTop'
export { useShareCalculator } from './useShareCalculator'
export type { CalculatorParams } from './useShareCalculator'

export { useCalendlyBooking } from './useCalendlyBooking'
export type { CalendlyPrefillData } from './useCalendlyBooking' // Re-exported from react-calendly

export { useExitIntent } from './useExitIntent'
export {
  useScrollDepthTracking,
  useEngagementTimeTracking,
  usePageLoadTracking,
  usePageAnalytics,
  useViewTracking,
} from './useAnalytics'

// Mobile-First Responsive Design Hooks
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsMobileOrTablet,
  usePrefersReducedMotion,
  useIsTouchDevice,
  usePrefersDarkMode,
  useIsRetina,
  useIsPortrait,
  useIsLandscape,
} from './useMediaQuery'
export type { UseMediaQueryOptions } from './useMediaQuery'

// Conditional Loading Utilities for Heavy Components
export {
  useShouldLoadComponent,
  createConditionalComponent,
  useConditionalPreload,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  isMobileOrTabletDevice,
  runByDevice,
  createDeviceVariants,
} from './useConditionalLoad'
export type { DeviceType, ConditionalLoadOptions } from './useConditionalLoad'
export {
  useScrollBehavior,
  useScrollDirection, // Alias for backwards compatibility
  type ScrollDirection,
} from './useScrollDirection'
export {
  useMousePosition,
  useSmoothedMousePosition,
  type MousePosition,
  type UseMousePositionOptions,
} from './useMousePosition'
export {
  useScrollPosition,
  useScrollProgress,
  useScrollDelta,
  type ScrollPosition,
  type UseScrollPositionOptions,
} from './useScrollPosition'
export {
  useIntersectionObserver,
  useIntersectionObserverWithRef,
  type UseIntersectionObserverOptions,
} from './useIntersectionObserver'
export { useIdleDetection, useIdleTime, type UseIdleDetectionOptions } from './useIdleDetection'

export { usePersonalization } from './usePersonalization'
export { useModuleFollowUp } from './useModuleFollowUp'

export { useToast } from './useToast'
export type { Toast } from './useToast'

export { useDebounce } from './useDebounce'
export { useFocusManagement, useFocusTrap } from './useFocusManagement'
export { useAchievementTracking } from './useAchievementTracking'
export { useJourneyNudges } from './useJourneyNudges'

// Reduced Motion utilities
export { getReducedMotionConfig, getReducedMotionTransition } from './useReducedMotion'

// SEO utilities
export { useDemoSEO, usePageTitle } from './useDemoSEO'
export type { SEOData } from './useDemoSEO'
