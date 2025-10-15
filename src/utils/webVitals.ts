/**
 * Web Vitals Monitoring
 *
 * Tracks Core Web Vitals and reports them to analytics
 *
 * Metrics tracked:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */

import { trackGA4Event } from './ga4'
import { hotjarEvent, HotjarEvents } from './hotjar'
import { handleSilentError } from './errorHandling'

interface WebVitalMetric {
  name: string
  value: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

/**
 * Report Web Vital metric to analytics
 */
function reportWebVital(metric: WebVitalMetric) {
  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    })
  }

  // Track in Google Analytics
  trackGA4Event('web_vitals', {
    metric_name: metric.name,
    metric_value: Math.round(metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
    metric_delta: Math.round(metric.delta),
    navigation_type: metric.navigationType,
  })

  // Track poor ratings in Hotjar
  if (metric.rating === 'poor') {
    hotjarEvent(HotjarEvents.PERFORMANCE_ISSUE)
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once in your app entry point
 */
export async function initWebVitals() {
  try {
    // Dynamically import web-vitals to avoid bundling if not used
    const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')

    // Track Core Web Vitals (onINP replaced onFID in web-vitals v3)
    onCLS(reportWebVital as any)
    onINP(reportWebVital as any)
    onLCP(reportWebVital as any)
    onFCP(reportWebVital as any)
    onTTFB(reportWebVital as any)

    console.log('[Web Vitals] Monitoring initialized')
  } catch (error) {
    handleSilentError(error, { utility: 'webVitals', action: 'init' })
  }
}

/**
 * Get performance metrics summary
 * Useful for debugging and development
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0]
  const paint = performance.getEntriesByType('paint')

  return {
    // Navigation timing
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    ttfb: navigation?.responseStart - navigation?.requestStart,
    download: navigation?.responseEnd - navigation?.responseStart,
    domInteractive: navigation?.domInteractive,
    domComplete: navigation?.domComplete,
    loadComplete: navigation?.loadEventEnd,

    // Paint timing
    fcp: paint.find((p) => p.name === 'first-contentful-paint')?.startTime,

    // Resource counts
    resources: performance.getEntriesByType('resource').length,

    // Memory (if available)
    memory: (performance as any).memory
      ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        }
      : null,
  }
}

/**
 * Log performance metrics to console
 * Useful for debugging
 */
export function logPerformanceMetrics() {
  const metrics = getPerformanceMetrics()

  if (!metrics) {
    console.warn('[Performance] Metrics not available')
    return
  }

  console.group('⚡ Performance Metrics')
  console.log('DNS Lookup:', `${metrics.dns?.toFixed(2)}ms`)
  console.log('TCP Connection:', `${metrics.tcp?.toFixed(2)}ms`)
  console.log('TTFB:', `${metrics.ttfb?.toFixed(2)}ms`)
  console.log('Download:', `${metrics.download?.toFixed(2)}ms`)
  console.log('DOM Interactive:', `${metrics.domInteractive?.toFixed(2)}ms`)
  console.log('DOM Complete:', `${metrics.domComplete?.toFixed(2)}ms`)
  console.log('Load Complete:', `${metrics.loadComplete?.toFixed(2)}ms`)
  console.log('FCP:', `${metrics.fcp?.toFixed(2)}ms`)
  console.log('Resources Loaded:', metrics.resources)

  if (metrics.memory) {
    console.log('Memory Usage:', `${(metrics.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`)
  }

  console.groupEnd()
}
