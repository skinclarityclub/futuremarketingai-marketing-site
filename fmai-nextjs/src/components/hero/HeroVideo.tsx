'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

interface HeroVideoProps {
  /** Omit for a locale without its own render: the poster then shows as a static image. */
  src?: string
  poster: string
  label: string
  pauseLabel: string
  playLabel: string
}

// Edges fade into the page background so the 16:9 frame has no visible rectangle.
const EDGE_FADE =
  'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'

export function HeroVideo({ src, poster, label, pauseLabel, playLabel }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  // A rejected play() (autoplay policy) leaves the poster, which is the loop's first frame.
  const play = () => ref.current?.play().catch(() => {})

  // Started from JS instead of the autoPlay attribute: phones and reduced-motion
  // users never download the loop (preload="none") and keep the poster.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (src && desktop && !reduced) ref.current?.play().catch(() => {})
  }, [src])

  const style = { maskImage: EDGE_FADE, maskComposite: 'intersect', WebkitMaskImage: EDGE_FADE, WebkitMaskComposite: 'source-in' }

  if (!src) {
    // The poster is only Clyde's logo, so without the animation it is decorative.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" width={1600} height={900} className="w-full h-auto" style={style} />
  }

  return (
    <div className="relative">
      <video
        ref={ref}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        width={1600}
        height={900}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="w-full h-auto"
        style={style}
      />
      {/* WCAG 2.2.2: a looping animation next to text needs a way to stop it. */}
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : play())}
        aria-label={playing ? pauseLabel : playLabel}
        className="hidden lg:flex absolute bottom-4 right-6 h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-bg-deep/70 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
    </div>
  )
}
