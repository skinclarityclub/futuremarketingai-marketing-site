'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

const WEEKS = ['1', '2', '3', '4'] as const

interface ProcessTimelineProps {
  eyebrow: string
  title: string
  subtitle: string
  weeks: Record<'1' | '2' | '3' | '4', { label: string; heading: string; body: string }>
}

export function ProcessTimeline({ eyebrow, title, subtitle, weeks }: ProcessTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // W5.4 — GSAP pin-stack scrub on desktop only. Mobile + reduced-motion get
  // the static 4-step grid. Dynamic-imports gsap so the bundle never lands
  // on reduced-motion users or in SSR.
  useEffect(() => {
    if (reduced || !sectionRef.current || !pinRef.current) return
    if (typeof window === 'undefined' || window.innerWidth < 1024) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        // Pin the timeline visualisation for ~300vh of scroll.
        ScrollTrigger.create({
          trigger: pinRef.current,
          start: 'top top+=80',
          end: '+=300%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
        })

        // Per-week reveal as the user scrolls through the pinned window.
        const weekEls = pinRef.current!.querySelectorAll<HTMLLIElement>('[data-week]')
        weekEls.forEach((el, i) => {
          gsap.fromTo(
            el,
            { opacity: 0.2, y: 24 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: pinRef.current,
                start: `top top+=${80 - (i + 0.5) * 50}`,
                end: `+=${75}%`,
                scrub: 1,
              },
            }
          )
        })
      }, sectionRef)

      cleanup = () => ctx.revert()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      aria-labelledby="process-timeline"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 lg:mb-16 max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-3">
            {eyebrow}
          </p>
          <h2
            id="process-timeline"
            className="font-display text-3xl md:text-4xl font-bold text-text-primary"
          >
            {title}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-text-secondary">
            {subtitle}
          </p>
        </div>

        <div ref={pinRef} className="relative">
          {/* Horizontal connector — desktop only */}
          <span
            aria-hidden
            className="hidden lg:block absolute top-[14px] left-[8px] right-[8px] h-px bg-gradient-to-r from-accent-system/60 via-accent-system/30 to-transparent"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5 relative">
            {WEEKS.map((week, i) => (
              <li
                key={week}
                data-week={week}
                className="relative flex lg:flex-col gap-4 lg:gap-0"
              >
                {/* Vertical connector — mobile only */}
                {i < WEEKS.length - 1 && (
                  <span
                    aria-hidden
                    className="lg:hidden absolute left-[7px] top-7 bottom-[-1.5rem] w-px bg-accent-system/30"
                  />
                )}

                {/* Node + index — desktop sits on horizontal line */}
                <div className="flex lg:items-center gap-3 lg:mb-5 shrink-0">
                  <span
                    aria-hidden
                    className="relative grid place-items-center w-4 h-4 lg:w-7 lg:h-7 rounded-full bg-bg-deep border border-accent-system"
                  >
                    <span className="block w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent-system" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-system lg:flex-1">
                    {weeks[week].label}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-lg lg:text-xl font-bold text-text-primary mb-2">
                    {weeks[week].heading}
                  </h3>
                  <p className="text-sm lg:text-base text-text-secondary leading-relaxed max-w-md">
                    {weeks[week].body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
