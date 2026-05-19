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

function devLogMetric(metric: Metric) {
  const rating = ratingFor(metric.name as VitalName, metric.value)
  const color =
    rating === 'good' ? '\x1b[32m' : rating === 'needs-improvement' ? '\x1b[33m' : '\x1b[31m'
  console.log(
    `${color}[Web Vital]\x1b[0m ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`
  )
}

/**
 * Beacon a metric envelope to /api/vitals (Phase 17-D D3). Uses
 * navigator.sendBeacon when available so the request survives page
 * unload without delaying navigation; falls back to fetch with
 * keepalive for browsers that lack Beacon support.
 *
 * We do NOT replace @vercel/speed-insights with this — SpeedInsights
 * still emits to Vercel's collector via /va.vercel-scripts.com. The
 * internal endpoint is parallel storage for the future custom-pipeline
 * usage documented in src/app/api/vitals/route.ts.
 */
function beaconMetric(metric: Metric) {
  const envelope = {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: ratingFor(metric.name as VitalName, metric.value),
    route: window.location.pathname,
    viewport: { width: window.innerWidth, height: window.innerHeight },
  }
  const body = JSON.stringify(envelope)
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/vitals', blob)
      return
    }
  } catch {
    // sendBeacon can throw on quota-exceeded; fall through to fetch.
  }
  void fetch('/api/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Metric pushes are fire-and-forget. A dropped one is not worth
    // surfacing to the user.
  })
}

export function initWebVitals() {
  if (typeof window === 'undefined') return

  const isDev = process.env.NODE_ENV === 'development'

  import('web-vitals').then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
    const handle = (metric: Metric) => {
      if (isDev) devLogMetric(metric)
      // Production beacon to /api/vitals runs in dev too so the route is
      // exercised locally during development. Cheap (a single beacon per
      // vital per page load) and lets us debug the receiver path.
      beaconMetric(metric)
    }
    onLCP(handle)
    onINP(handle)
    onCLS(handle)
    onFCP(handle)
    onTTFB(handle)
  })
}
