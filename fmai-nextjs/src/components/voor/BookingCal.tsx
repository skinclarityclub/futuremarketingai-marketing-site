'use client'

import { useEffect } from 'react'
import { getCalApi } from '@calcom/embed-react'
import { calConfig } from '@/config/calConfig'
import { CalInlineEmbed } from '@/components/interactive/CalInlineEmbed'

// Loaded with next/dynamic only after the click, so nothing of Cal (and no address) reaches Cal before it.
export default function BookingCal({
  firstName,
  email,
  onBooked,
}: {
  firstName: string
  email: string
  onBooked: (startIso: string) => void
}) {
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const cal = await getCalApi({
        namespace: calConfig.namespace,
        ...(calConfig.origin ? { embedJsUrl: `${calConfig.origin}/embed/embed.js` } : {}),
      })
      if (cancelled) return
      cal('on', {
        action: 'bookingSuccessfulV2',
        callback: (e: unknown) => {
          const data = (e as { detail?: { data?: { startTime?: unknown } } }).detail?.data
          if (typeof data?.startTime === 'string') onBooked(data.startTime)
        },
      })
    })()
    return () => {
      cancelled = true
    }
  }, [onBooked])

  return <CalInlineEmbed prefill={{ name: firstName, email }} />
}
