'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * True while a `[data-fab-quiet]` section (hero 3 and the week on /nl) lies in the bottom quarter of the viewport,
 * where the fixed Clyde button and BackToTop sit. There the Clyde button shrinks to its round mark and BackToTop hides,
 * so neither covers the scenes (K1 B, website-port PR 3, Daley 2026-11-03).
 *
 * `null` until the observer has measured this pathname (SSR, first paint, right after a client navigation). The
 * Clyde button then omits `data-quiet` and globals.css shows the quiet shape on any page with such a section, so the
 * button does not render as a pill and shrink a moment later. Keyed by pathname, so a stale answer from the previous
 * page never shows on the next one.
 */
export function useFabQuiet(): boolean | null {
  const pathname = usePathname()
  const [state, setState] = useState<{ path: string; quiet: boolean }>({ path: '', quiet: false })

  useEffect(() => {
    const els = document.querySelectorAll('[data-fab-quiet]')
    if (els.length === 0) return
    const inBand = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target)
          else inBand.delete(e.target)
        }
        setState({ path: pathname, quiet: inBand.size > 0 })
      },
      { rootMargin: '-75% 0px 0px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      // forget this page's answer, so coming back to it starts unmeasured (CSS) instead of a stale pill or mark
      setState({ path: '', quiet: false })
    }
  }, [pathname])

  return state.path === pathname ? state.quiet : null
}
