import { DM_Sans, JetBrains_Mono } from 'next/font/google'

export const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

// Space Grotesk removed in Phase 13-03. The --font-display token in
// globals.css now falls back to DM Sans directly. One fewer Google Fonts
// woof2 preload + handshake per HTML page across all 88 routes.
