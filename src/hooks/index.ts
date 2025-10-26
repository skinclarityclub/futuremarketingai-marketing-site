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
export {
  useMousePosition,
  useSmoothedMousePosition,
  type MousePosition,
  type UseMousePositionOptions,
} from './useMousePosition'
export {
  useScrollPosition,
  useScrollProgress,
  useScrollDirection,
  type ScrollPosition,
  type UseScrollPositionOptions,
} from './useScrollPosition'
export {
  useIntersectionObserver,
  useIntersectionObserverWithRef,
  type UseIntersectionObserverOptions,
} from './useIntersectionObserver'
export { useIdleDetection, useIdleTime, type UseIdleDetectionOptions } from './useIdleDetection'
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersReducedMotion,
  useIsTouchDevice,
} from './useMediaQuery'

export { usePersonalization } from './usePersonalization'
export { useModuleFollowUp } from './useModuleFollowUp'
export { useDemoRedirect } from './useDemoRedirect'

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
