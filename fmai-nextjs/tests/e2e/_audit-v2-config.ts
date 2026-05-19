/**
 * Shared route + locale + viewport constants for Phase 16 audit-v2 capture suite.
 * Used by:
 *   audit-v2-screenshots.spec.ts (Chromium primary, 5 viewports)
 *   audit-v2-screenshots-webkit.spec.ts (WebKit, 2 viewports)
 *   audit-v2-screenshots-firefox.spec.ts (Firefox, 2 viewports)
 *   audit-v2-har-capture.spec.ts (HAR per route x locale at 1440x900)
 *   audit-v2-dom-snapshot.spec.ts (rendered HTML per route x locale at 1440x900)
 *   audit-v2-axe.spec.ts (axe-core per route x locale at 1440x900)
 *   audit-v2-lighthouse.spec.ts (top-10 routes against production URL)
 */
export const ROUTES = [
  '/',
  '/about',
  '/how-it-works',
  '/pricing',
  '/founding-member',
  '/contact',
  '/memory',
  '/apply',
  '/roadmap',
  '/assessment',
  '/assessment/result',
  '/case-studies/skinclarity-club',
  '/skills/clyde',
  '/skills/social-media',
  '/skills/blog-factory',
  '/skills/lead-qualifier',
  '/skills/email-management',
  '/skills/reporting',
  '/skills/manychat',
  '/skills/seo-geo',
  '/skills/research',
  '/skills/voice-agent',
  '/skills/ad-creator',
  '/skills/reel-builder',
  '/blog',
  '/legal',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/terms',
  '/newsletter/confirm',
  '/logo-lab',
] as const

export const LOCALES = ['nl', 'en', 'es'] as const

export type Viewport = { name: string; width: number; height: number }

export const VIEWPORTS_FULL: Viewport[] = [
  { name: 'mobile-s', width: 360, height: 800 },
  { name: 'mobile-l', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'desktop-w', width: 1920, height: 1080 },
]

export const VIEWPORTS_CROSS: Viewport[] = [
  { name: 'mobile-l', width: 414, height: 896 },
  { name: 'desktop', width: 1440, height: 900 },
]

export const VIEWPORT_AUDIT: Viewport = { name: 'desktop', width: 1440, height: 900 }

export const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000'

export const PRODUCTION_URL = 'https://future-marketing.ai'

export const LIGHTHOUSE_ROUTES = [
  '/',
  '/about',
  '/pricing',
  '/founding-member',
  '/apply',
  '/contact',
  '/memory',
  '/skills/clyde',
  '/skills/social-media',
  '/case-studies/skinclarity-club',
] as const

export function safeRouteKey(route: string): string {
  return route.replace(/\//g, '_') || 'home'
}

export function localizedUrl(base: string, locale: string, route: string): string {
  return `${base}/${locale}${route === '/' ? '' : route}`
}
