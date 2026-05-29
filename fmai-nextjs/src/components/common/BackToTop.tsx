'use client'

import { useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

/**
 * BackToTop -- floating scroll-to-top control, stacked above the Clyde FAB in
 * the bottom-right corner.
 *
 * Why this shape:
 * - The teal ring is a live reading-progress indicator (`pathLength` bound to
 *   the page's scrollYProgress). It gives the button a second, real purpose
 *   beyond "go up" and ties it to the page's rhythm -- a back-to-top that does
 *   nothing until clicked is dead weight; this one earns its presence while you
 *   scroll. (Emil: every animation needs a purpose.)
 * - Appears only after the hero is scrolled past (~60% of a viewport), fading +
 *   lifting in, and exits the same way for spatial consistency.
 * - Positions LIFT in lockstep with ClydePresence while the consent banner is
 *   up, so the FAB stack moves as one piece instead of colliding with the
 *   banner. The `*_BOTTOM` offsets below are derived from ClydePresence's bottom
 *   offsets -- keep them in sync if Clyde's resting/lifted positions change.
 * - Honours prefers-reduced-motion: the global <MotionConfig reducedMotion>
 *   strips entrance/hover transforms, and the smooth scroll falls back to an
 *   instant jump here.
 */

// Mirror of ClydePresence's bottom offsets, raised by the Clyde pill height
// (~42px) plus a ~20px gap so this rests cleanly ABOVE Clyde in both states.
// Clyde rests at  bottom-6 / lg:bottom-8   -> we rest at  bottom-24.
// Clyde lifts to   bottom-80 / lg:bottom-44 -> we lift to  bottom-96 / lg:bottom-60.
const REST_BOTTOM = 'bottom-24'
const LIFTED_BOTTOM = 'bottom-96 lg:bottom-60'

export function BackToTop() {
  const t = useTranslations('a11y')
  const prefersReducedMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()

  const [visible, setVisible] = useState(false)
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false)

  // Reveal once the hero is scrolled past (~60% of a viewport). setState bails
  // out when the boolean is unchanged, so this stays a cheap per-frame compare.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.6 : 600
    setVisible(latest > threshold)
  })

  // Restore visibility on mount when the browser reopens at a scrolled position
  // (no 'change' event fires for the restored offset).
  useEffect(() => {
    setVisible(scrollY.get() > window.innerHeight * 0.6)
  }, [scrollY])

  // Track the consent banner so the FAB stack lifts together. Same-tab consent
  // writes don't fire a `storage` event, so we poll -- mirrors ClydePresence.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const check = () => {
      try {
        setCookieBannerVisible(window.localStorage.getItem('cookieConsent') === null)
      } catch {
        setCookieBannerVisible(true)
      }
    }
    check()
    window.addEventListener('storage', check)
    const interval = window.setInterval(check, 1500)
    return () => {
      window.removeEventListener('storage', check)
      window.clearInterval(interval)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const bottomClass = cookieBannerVisible ? LIFTED_BOTTOM : REST_BOTTOM
  const zClass = cookieBannerVisible ? 'z-[10000]' : 'z-40'

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label={t('backToTop')}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`group fixed right-6 ${bottomClass} ${zClass} grid h-12 w-12 place-items-center rounded-full bg-bg-elevated/95 text-text-primary backdrop-blur-md outline-none shadow-[0_0_20px_rgba(0,212,170,0.25)] transition-[bottom,box-shadow] duration-300 hover:shadow-[0_0_30px_rgba(0,212,170,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-system`}
        >
          {/* Reading-progress ring: faint track + teal progress drawn clockwise
              from 12 o'clock (the -rotate-90 moves the path start to the top). */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="22" className="stroke-white/10" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              className="stroke-accent-system"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp
            className="relative h-5 w-5 text-text-secondary transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:text-accent-system"
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
