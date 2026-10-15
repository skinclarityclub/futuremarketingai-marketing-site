'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { trackCta } from '@/lib/voor-tracking'
import { voorVideo } from '@/config/voorVideo'
import { BookingPanel, BookingSlot } from './BookingPanel'
import { ChapterList, type Chapter } from './ChapterList'
import { ConsentLine } from './ConsentLine'
import { VoorPlayer, type VoorPlayerHandle } from './VoorPlayer'

type Props = {
  slug: string
  firstName: string
  agencyName: string
  email: string
  bookingStart: string | null
  chapters: Chapter[]
  endCardSec: number
}

// Phone order: video, button (first screen), consent, chapters, founding, Cal slot (footer is in the page).
export function VoorExperience({ slug, firstName, agencyName, email, bookingStart, chapters, endCardSec }: Props) {
  const v = voorVideo.version
  const player = useRef<VoorPlayerHandle>(null)
  const slot = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const onCta = useCallback(() => {
    trackCta(slug, v)
    setOpen(true)
  }, [slug, v])

  useEffect(() => {
    if (open) slot.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [open])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <VoorPlayer
        slug={slug}
        v={v}
        src={voorVideo.hlsUrl}
        poster="/voor/outreach-poster.jpg"
        still="/voor/daley-still.png"
        agencyName={agencyName}
        chapters={chapters}
        endCardSec={endCardSec}
        onCta={onCta}
        handle={player}
      />
      <BookingPanel agencyName={agencyName} onOpen={onCta} />

      <div className="lg:col-span-2">
        <ConsentLine slug={slug} v={v} />
      </div>
      <div className="lg:col-span-2">
        <ChapterList chapters={chapters} onSeek={(s) => player.current?.seek(s)} />
      </div>
      <div className="rounded-xl border border-border-accent bg-bg-surface p-5 lg:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-system">Founding partners</span>
        <p className="mt-2">
          Ik zoek maximaal 10 bureaus met dezelfde AI-first visie. Wat dat inhoudt, bespreken we in het gesprek.
        </p>
      </div>
      <div className="lg:col-span-2">
        <BookingSlot firstName={firstName} email={email} bookingStart={bookingStart} open={open} slotRef={slot} />
      </div>
    </div>
  )
}
