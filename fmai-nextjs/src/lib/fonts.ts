import { DM_Sans, JetBrains_Mono } from 'next/font/google'

// Variable (no `weight`) with the opsz axis: static DM Sans pins optical size at 14, which set the
// homepage H1 11% wider than the approved design (measured 2026-11-02, port plan Task 1.1).
export const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  axes: ['opsz'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  // No preload — JetBrains Mono is only used for code/tabular text
  // (chatbot, ChatSimulation, code blocks). Above-the-fold hero is
  // pure DM Sans. Preloading mono cost 37 KB on the critical path
  // and competed with the hero preview WebP for mobile bandwidth.
  preload: false,
  adjustFontFallback: true,
})

// Space Grotesk removed in Phase 13-03. The --font-display token in
// globals.css now falls back to DM Sans directly. One fewer Google Fonts
// woof2 preload + handshake per HTML page across all 88 routes.
