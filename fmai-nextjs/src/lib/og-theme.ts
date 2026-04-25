/**
 * og-theme.ts
 *
 * WHY: OG images render through Satori (next/og), which only supports a subset
 * of CSS — no Tailwind classes, no CSS variables. Mirror the live design tokens
 * from src/app/globals.css @theme block here so they stay aligned with the rest
 * of the site palette without drifting.
 *
 * Used by src/app/api/og/route.tsx for per-locale dynamic OG cards.
 * Static og-image.png remains the default; this route is opt-in via metadata
 * config in a follow-up.
 */

export const OG_THEME = {
  bgDeep: '#0a0d14',
  accentSystem: '#00d4aa',
  accentHuman: '#f5a623',
  textPrimary: '#e8ecf4',
  textSecondary: '#9ba3b5',
} as const

export const OG_TAGLINES = {
  nl: 'Jouw AI Marketing Medewerker. Voor Nederlandse bureaus.',
  en: 'Your AI Marketing Employee. For agencies.',
  es: 'Tu Empleado AI de Marketing. Para agencias.',
} as const

export type OgLocale = keyof typeof OG_TAGLINES
