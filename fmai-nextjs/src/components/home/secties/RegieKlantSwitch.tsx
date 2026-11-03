'use client'

import { useLayoutEffect } from 'react'

/**
 * Cause and effect of Regie and Klant (#regie, #klant), ported from the approved prototype
 * (design/ronde1b/home-4.html, the sx script). RegieKlantSections renders the markup on the server; this island only
 * flips a STATE, not a scroll tween: `data-on` turns on when the middle plane's centre passes 55% of the viewport, after
 * a short press (220 ms), and scrolling back turns it off. Without view timelines or with reduced motion nothing runs and
 * the server markup's rest state stays (Regie: the row with Pauzeer; Klant: white-label on).
 *
 * Site differences from the prototype: a layout effect, so after a client navigation the first state is set before
 * paint, and every listener, the frame and the press timers go on unmount.
 */

const PRESS_MS = 220
const SWITCH_AT = 0.55

export function RegieKlantSwitch() {
  useLayoutEffect(() => {
    if (!CSS.supports('animation-timeline: view()') || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const secs = ['regie', 'klant'].map((id) => document.getElementById(id))
    const mids = secs.map((s) => s?.querySelector<HTMLElement>('[data-layer="mid"]') ?? null)
    if (secs.some((s) => !s) || mids.some((m) => !m)) {
      console.error('RegieKlantSwitch: markup of #regie or #klant is incomplete; the sections keep their rest state')
      return
    }
    const sections = secs as HTMLElement[]
    const past = (i: number) => {
      const m = (mids[i] as HTMLElement).getBoundingClientRect()
      return m.top + m.height / 2 < innerHeight * SWITCH_AT
    }
    const timers = new Map<HTMLElement, number>()
    let raf = 0

    const tick = () => {
      raf = 0
      sections.forEach((s, i) => {
        if (timers.has(s)) return
        const on = past(i)
        if (on === s.hasAttribute('data-on')) return
        if (!on) {
          s.removeAttribute('data-on')
          return
        }
        s.classList.add('sx-press')
        timers.set(
          s,
          window.setTimeout(() => {
            timers.delete(s)
            s.classList.remove('sx-press')
            s.setAttribute('data-on', '')
            req()
          }, PRESS_MS),
        )
      })
    }
    const req = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // first frame without a press: a page that opens mid-way shows the right state at once
    sections.forEach((s, i) => s.toggleAttribute('data-on', past(i)))
    addEventListener('scroll', req, { passive: true })
    addEventListener('resize', req)
    return () => {
      removeEventListener('scroll', req)
      removeEventListener('resize', req)
      cancelAnimationFrame(raf)
      timers.forEach((id) => clearTimeout(id))
      sections.forEach((s) => s.classList.remove('sx-press'))
    }
  }, [])

  return null
}
