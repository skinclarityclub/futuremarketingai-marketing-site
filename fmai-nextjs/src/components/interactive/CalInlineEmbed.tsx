'use client'

import { useEffect } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { calConfig } from '@/config/calConfig'

interface CalInlineEmbedProps {
  /** Prefill the booking form (flows to Cal.com via the `config` prop). */
  prefill?: { name?: string; email?: string }
  /** CSS height of the embed container. Accepts px number or any CSS string. */
  height?: number | string
  /** Minimum height so the calendar never collapses in flex/grid parents. */
  minHeight?: number | string
  /** Fires once after the embed UI is configured -- analytics hook. */
  onReady?: () => void
}

const toCss = (v: number | string) => (typeof v === 'number' ? `${v}px` : v)

/**
 * CalInlineEmbed -- the single Cal.com inline-embed surface for the whole site.
 *
 * Replaces the previous react-calendly InlineWidget. Theming (dark + brand
 * accent) is applied once via getCalApi('ui', ...). The booking link, namespace
 * and brand color come from calConfig so there is one source of truth.
 *
 * No API key or OAuth is needed -- the Cal.com booking page is public.
 */
export function CalInlineEmbed({
  prefill,
  height = 650,
  minHeight = 650,
  onReady,
}: CalInlineEmbedProps) {
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const cal = await getCalApi({
        namespace: calConfig.namespace,
        ...(calConfig.origin ? { embedJsUrl: `${calConfig.origin}/embed/embed.js` } : {}),
      })
      if (cancelled) return
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': calConfig.brandColor },
          dark: { 'cal-brand': calConfig.brandColor },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
      onReady?.()
    })()
    return () => {
      cancelled = true
    }
  }, [onReady])

  return (
    <Cal
      namespace={calConfig.namespace}
      calLink={calConfig.calLink}
      {...(calConfig.origin ? { calOrigin: calConfig.origin } : {})}
      style={{
        width: '100%',
        height: toCss(height),
        minHeight: toCss(minHeight),
        overflow: 'auto',
      }}
      config={{
        layout: 'month_view',
        theme: 'dark',
        ...(prefill?.name ? { name: prefill.name } : {}),
        ...(prefill?.email ? { email: prefill.email } : {}),
      }}
    />
  )
}

export default CalInlineEmbed
