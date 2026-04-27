/**
 * Centralized list of next-intl message namespaces shipped to the client.
 *
 * The full message tree is loaded server-side in src/i18n/request.ts and stays
 * accessible via getTranslations() in server components. NextIntlClientProvider
 * only needs the subset of namespaces that actually power client components
 * (those marked `'use client'` and calling useTranslations()).
 *
 * Audit source: .planning/phases/13-performance-bundle-cleanup/i18n-client-usage.md
 *
 * Adding a namespace here is a payload regression — confirm a real client
 * component consumes it before extending this list. Server-only namespaces
 * (home, pricing, about, etc.) MUST NOT be added here.
 */
export const GLOBAL_CLIENT_NAMESPACES = [
  // Layout chrome on every page
  'common', // CookieConsentBanner
  'nav', // HeaderClient mega-menu top nav
  'header', // HeaderClient mega-menu skill labels
  // Lazy client islands rendered in root layout via ClientIslands
  'chat', // ChatWidget (chat.widget subkey)
  'booking', // BookingModal
  'calendly', // CalendlyModal
  // App-router client pages
  'errors', // app/[locale]/error.tsx + not-found.tsx
  'newsletter', // app/[locale]/newsletter/confirm/page.tsx (Phase 15-04)
  // ApplicationForm — cheap to ship globally rather than scope per-route
  'apply',
  // Phase 15 conversion-accelerator client islands
  'stickyCta', // StickyMobileCTA (mobile-only, all 15 routes via PageShell)
  'leadMagnet', // LeadMagnetCTA (home + pricing + founding-member + blog)
] as const

export type GlobalClientNamespace = (typeof GLOBAL_CLIENT_NAMESPACES)[number]
