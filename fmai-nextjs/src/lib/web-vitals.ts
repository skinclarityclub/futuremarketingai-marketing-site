import type { Metric } from 'web-vitals'

const TARGETS = {
  LCP: 2000,
  INP: 200,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 800,
} as const

type VitalName = keyof typeof TARGETS

function ratingFor(name: VitalName, value: number): 'good' | 'needs-improvement' | 'poor' {
  const target = TARGETS[name]
  if (!target) return 'good'
  if (value <= target) return 'good'
  if (value <= target * 1.5) return 'needs-improvement'
  return 'poor'
}

function reportMetric(metric: Metric) {
  const rating = ratingFor(metric.name as VitalName, metric.value)

  if (process.env.NODE_ENV === 'development') {
    const color =
      rating === 'good' ? '\x1b[32m' : rating === 'needs-improvement' ? '\x1b[33m' : '\x1b[31m'
    console.log(
      `${color}[Web Vital]\x1b[0m ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`
    )
    return
  }

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const body = JSON.stringify({
      name: metric.name,
      value: Math.round(metric.value * 100) / 100,
      rating,
      id: metric.id,
      navigationType: metric.navigationType,
    })
    navigator.sendBeacon('/api/vitals', new Blob([body], { type: 'application/json' }))
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  import('web-vitals').then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
    onLCP(reportMetric)
    onINP(reportMetric)
    onCLS(reportMetric)
    onFCP(reportMetric)
    onTTFB(reportMetric)
  })
}
