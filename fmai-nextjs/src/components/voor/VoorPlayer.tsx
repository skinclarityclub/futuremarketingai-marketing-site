'use client'

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import type Hls from 'hls.js'
import { isOn, measuring, onChange, readPos, sendDropoff, trackWatch } from '@/lib/voor-tracking'
import { mmss } from './ChapterList'

export type VoorPlayerHandle = { seek: (sec: number) => void }

type Props = {
  slug: string
  v: string
  src: string
  poster: string
  still: string
  agencyName: string
  endCardSec: number
  onCta: () => void
  handle: Ref<VoorPlayerHandle>
}

const FLUSH_MS = 15_000

export function VoorPlayer({ slug, v, src, poster, still, agencyName, endCardSec, onCta, handle }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const hls = useRef<Hls | null>(null)
  const started = useRef(false)
  const [live, setLive] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const [resume, setResume] = useState<number | null>(null)
  const [broken, setBroken] = useState(false)
  const gone = useRef(false)

  // Segment bound to the seq of the moment it STARTED (B-44); trackWatch re-checks it when sending.
  const seg = useRef<{ from: number; seq: number } | null>(null)
  const last = useRef(0) // last stable position, so a seek closes the segment where it was
  const playing = useRef(false)
  const maxSec = useRef(0)

  const open = useCallback(
    (at: number) => {
      const m = measuring(slug)
      seg.current = m ? { from: at, seq: m.seq } : null // no confirmed yes: no segment
    },
    [slug],
  )

  const close = useCallback(
    (to: number, reopen: boolean, keepalive = false) => {
      const s = seg.current
      seg.current = null
      if (s) trackWatch(slug, v, { from: s.from, to, seq: s.seq }, { keepalive })
      if (reopen && playing.current) open(to)
    },
    [slug, v, open],
  )

  const start = useCallback(async (at?: number) => {
    const el = video.current
    if (!el) return
    if (!started.current) {
      started.current = true
      setLive(true)
      if (el.canPlayType('application/vnd.apple.mpegurl')) {
        el.src = src
      } else {
        const { default: HlsLib } = await import('hls.js')
        if (gone.current) return // unmounted while the chunk loaded: never create an instance nobody destroys
        if (HlsLib.isSupported()) {
          const h = new HlsLib({ enableWorker: false, startPosition: at ?? -1 })
          hls.current = h
          h.on(HlsLib.Events.ERROR, (_e, data) => {
            if (!data.fatal) return
            h.destroy()
            if (hls.current === h) hls.current = null
            started.current = false
            setLive(false)
            setBroken(true)
          })
          h.loadSource(src)
          h.attachMedia(el)
        } else {
          el.src = src
        }
      }
    }
    if (at !== undefined) el.currentTime = at
    void el.play().catch(() => undefined)
  }, [src])

  useImperativeHandle(handle, () => ({ seek: (sec) => void start(sec) }), [start])

  useEffect(() => {
    setResume(readPos(slug))
    // A change of choice ends the running segment; a new confirmed yes opens one at the current position.
    const off = onChange(slug, () => {
      const el = video.current
      if (el) close(el.currentTime, true)
      if (!isOn(slug)) setResume(null)
    })
    const timer = setInterval(() => {
      const el = video.current
      if (el && playing.current) close(el.currentTime, true)
    }, FLUSH_MS)
    const hide = () => {
      const el = video.current
      if (el) close(el.currentTime, false, true)
      sendDropoff(v, maxSec.current)
    }
    window.addEventListener('pagehide', hide)
    return () => {
      off()
      clearInterval(timer)
      window.removeEventListener('pagehide', hide)
    }
  }, [slug, v, close])

  useEffect(() => {
    gone.current = false
    return () => {
      gone.current = true
      hls.current?.destroy()
      hls.current = null
    }
  }, [])

  const onTime = () => {
    const el = video.current
    if (!el) return
    if (!el.seeking) last.current = el.currentTime
    maxSec.current = Math.max(maxSec.current, el.currentTime)
    setAtEnd(el.currentTime >= endCardSec)
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border-primary bg-black">
      <video
        ref={video}
        className="h-full w-full"
        poster={poster}
        controls={live}
        playsInline
        preload="none"
        onPlay={() => {
          playing.current = true
          open(video.current?.currentTime ?? 0)
        }}
        onPause={() => {
          playing.current = false
          close(video.current?.currentTime ?? 0, false)
        }}
        onEnded={() => {
          playing.current = false
          close(video.current?.currentTime ?? 0, false)
        }}
        onSeeking={() => close(last.current, false)}
        onSeeked={() => {
          const el = video.current
          if (el && playing.current) open(el.currentTime)
        }}
        onTimeUpdate={onTime}
      >
        {/* shortcut: placeholder asset until plan A2 delivers the real video (ruling R2), replace at Task 11 step 1 */}
        <track kind="subtitles" srcLang="nl" label="Nederlands" src="/voor/outreach.nl.vtt" default />
      </video>

      {!live && (
        <div className="absolute inset-0 flex flex-col">
          <button
            type="button"
            onClick={() => void start()}
            aria-label={`Bekijk de video voor ${agencyName}`}
            className="group relative flex-1 text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={still} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <span className="absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-bg-deep/30 to-transparent" />
            <span className="absolute bottom-4 left-4 right-4">
              <span className="block text-xl font-semibold sm:text-2xl">Voor {agencyName}</span>
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-accent-human px-4 py-2 text-sm font-semibold text-bg-deep">
              Bekijk de video
            </span>
          </button>
          {resume !== null && resume > 5 && (
            <button
              type="button"
              onClick={() => void start(resume)}
              className="absolute left-4 top-4 rounded-full border border-white/30 bg-bg-deep/80 px-4 py-2 text-sm"
            >
              Verder kijken vanaf {mmss(resume)}
            </button>
          )}
        </div>
      )}

      {broken && !live && (
        <p role="alert" className="absolute inset-x-4 top-4 rounded-lg bg-bg-deep/90 p-3 text-sm text-warning">
          De video kon niet worden geladen. Probeer het zo nog eens.
        </p>
      )}

      {atEnd && (
        <button
          type="button"
          onClick={onCta}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded-lg bg-accent-human px-6 py-3 font-semibold text-bg-deep shadow-lg"
        >
          Plan een gesprek
        </button>
      )}
    </div>
  )
}
