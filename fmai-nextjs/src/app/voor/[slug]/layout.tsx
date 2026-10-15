import type { ReactNode } from 'react'
import type { Viewport } from 'next'
import { dmSans, jetbrainsMono } from '@/lib/fonts'
import '@/app/globals.css'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export const metadata = { metadataBase: new URL('https://future-marketing.ai') }

// Own document, outside [locale]: no menu, chat, cookie banner or analytics.
export default function VoorLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-deep text-text-primary font-sans antialiased">{children}</body>
    </html>
  )
}
