'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const BookingCal = dynamic(() => import('./BookingCal'), { ssr: false })

const TZ = 'Europe/Amsterdam'

export function bookingSentence(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('nl-NL', { timeZone: TZ, ...o }).format(d)
  const day = `${f({ weekday: 'long' })} ${f({ day: 'numeric', month: 'long' })}`
  return `Je gesprek staat op ${day} om ${f({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}.`
}

const buttonCls = 'rounded-lg bg-accent-human px-6 py-3 text-center font-semibold text-bg-deep'

/** The button next to the video (desktop) / under it (phone), the second route, and the fixed phone bar. */
export function BookingPanel({ agencyName, onOpen }: { agencyName: string; onOpen: () => void }) {
  const block = useRef<HTMLButtonElement>(null)
  const [out, setOut] = useState(false) // button scrolled out of view

  useEffect(() => {
    const el = block.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setOut(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <aside className="flex flex-col gap-3 rounded-xl border border-border-primary bg-bg-surface p-5">
        <div className="flex items-center gap-3">
          {/* shortcut: placeholder asset until plan A2 delivers the real video (ruling R2), replace at Task 11 step 1 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/voor/daley-still.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <div>
            <strong className="block">Daley van Diest</strong>
            <small className="text-text-secondary">Oprichter van FutureMarketingAI</small>
          </div>
        </div>
        <h2 className="text-lg font-semibold">Benieuwd hoe dit voor {agencyName} werkt?</h2>
        <button ref={block} type="button" onClick={onOpen} className={buttonCls}>
          Plan een gesprek <span aria-hidden="true">→</span>
        </button>
        <p className="text-sm text-text-secondary">
          Je kiest zelf een tijd in mijn agenda. Je naam en e-mail staan al ingevuld.
        </p>
        <p className="border-t border-white/10 pt-3 text-sm text-text-secondary">
          <b className="text-text-primary">Eerst een vraag?</b> Antwoord gewoon op mijn mail.
        </p>
      </aside>
      {out && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-bg-deep/95 p-3 lg:hidden">
          <button type="button" onClick={onOpen} className={`${buttonCls} w-full`}>
            Plan een gesprek
          </button>
        </div>
      )}
    </>
  )
}

/** Empty until the click: the Cal embed mounts only when `open` is true. */
export function BookingSlot({
  firstName,
  email,
  bookingStart,
  open,
  slotRef,
}: {
  firstName: string
  email: string
  bookingStart: string | null
  open: boolean
  slotRef: React.RefObject<HTMLDivElement | null>
}) {
  const [booked, setBooked] = useState<string | null>(bookingStart)
  const sentence = booked ? bookingSentence(booked) : null
  return (
    <div ref={slotRef} aria-live="polite">
      {sentence && <p className="mb-4 rounded-xl border border-border-accent bg-bg-surface p-4 font-medium">{sentence}</p>}
      {open && <BookingCal firstName={firstName} email={email} onBooked={setBooked} />}
    </div>
  )
}
