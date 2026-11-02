'use client'

import { useEffect } from 'react'

/**
 * Scroll scrub for "Een week met Clyde" (#een-week-met-clyde), ported from the approved prototype
 * (design/ronde1b/home-4.html, the week script). The markup is server-rendered by WeekSection; this island
 * only drives it: the 3D world turns with the scroll, one station per day, the rail and the thread follow.
 *
 * Site differences from the prototype:
 * - flat mode (phone or reduced motion) is a media query, not an `html.flat` class, so nothing touches <html>;
 * - the sticky stage sits under the fixed header, so progress counts from the stage's computed `top`;
 * - every listener, the observer and the frame loop are removed on unmount (client navigation);
 * - `data-ready` on the section lifts the pre-hydration rule that hides the stacked stations (week.css).
 */

const FLAT_QUERY = '(max-width: 860px), (prefers-reduced-motion: reduce)'
const N = 7
const DEPTH = 1000

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

interface Station {
  el: HTMLElement
  ag: HTMLElement | null
  cl: HTMLElement | null
}

export function WeekScrub({ labels }: { labels: string[] }) {
  useEffect(() => {
    const sec = document.getElementById('een-week-met-clyde')
    const scene = sec?.querySelector<HTMLElement>('#wscene')
    const world = sec?.querySelector<HTMLElement>('#world')
    const rail = sec?.querySelector<HTMLElement>('#rail')
    const stage = sec?.querySelector<HTMLElement>('.wk-stage')
    const thread = sec?.querySelector<HTMLElement>('#thread')
    const tstate = sec?.querySelector<HTMLElement>('#tstate')
    if (!sec || !scene || !world || !rail || !stage || !thread || !tstate) {
      console.error('WeekScrub: markup of #een-week-met-clyde is incomplete; the week stays static')
      return
    }
    const sts: Station[] = Array.from(sec.querySelectorAll<HTMLElement>('.st')).map((el) => ({
      el,
      ag: el.querySelector<HTMLElement>('.ag'),
      cl: el.querySelector<HTMLElement>('.cl'),
    }))
    const lis = Array.from(rail.querySelectorAll<HTMLLIElement>('li'))
    const descs = Array.from(sec.querySelectorAll<HTMLElement>('#desc p'))
    if (sts.length !== N || lis.length !== N || labels.length !== N) {
      console.error(`WeekScrub: expected ${N} stations, rail items and labels`, sts.length, lis.length, labels.length)
      return
    }

    const mq = window.matchMedia(FLAT_QUERY)
    const isFlat = () => mq.matches
    let ps = 0
    let last = performance.now()
    let raf = 0
    let cur = -1
    let wasFlat: boolean | null = null
    let inView = true
    let flatI = 0
    let disposed = false

    // The stage sticks at its computed `top` (4rem under the fixed header) and stays stuck for
    // section height minus stage height.
    const header = () => parseFloat(getComputedStyle(stage).top) || 0
    const span = () => Math.max(1, sec.offsetHeight - stage.offsetHeight)
    const target = () => clamp((header() - sec.getBoundingClientRect().top) / span(), 0, 1)

    function mark(i: number) {
      if (i === cur) return
      cur = i
      lis.forEach((l, k) => {
        const on = k === i
        const b = l.querySelector('button')
        l.classList.toggle('on', on)
        if (on) b?.setAttribute('aria-current', 'step')
        else b?.removeAttribute('aria-current')
      })
      descs.forEach((p, k) => p.classList.toggle('on', k === i))
      tstate!.textContent = labels[i]
      thread!.style.transform = `translateY(${rail!.offsetTop + lis[i].offsetTop + lis[i].offsetHeight / 2 - 16}px)`
      sts.forEach((s, k) => s.el.classList.toggle('on', k === i))
    }

    function fit() {
      const w = scene!.clientWidth
      const h = scene!.clientHeight
      if (isFlat()) {
        const sc = Math.min(1, (w - 8) / 430)
        world!.style.setProperty('--sc', sc.toFixed(3))
        scene!.style.height = `${Math.ceil(world!.offsetHeight * sc + 28)}px`
      } else {
        const sc = Math.min(1.3, w / 1000, h / 700)
        world!.style.setProperty('--sc', sc.toFixed(3))
        scene!.style.height = ''
      }
    }

    function clearInline() {
      sts.forEach((s) => [s.ag, s.cl, s.el].forEach((e) => e?.removeAttribute('style')))
      // Day 5's approve state is scroll-driven in 3D; flat mode starts from the markup's state after a resize too.
      sts.forEach((s) => s.el.classList.remove('ok', 'tapgo'))
      world!.style.removeProperty('transform')
    }

    function render() {
      const f = isFlat()
      if (f !== wasFlat) {
        wasFlat = f
        clearInline()
        cur = -1
        fit()
      }
      if (f) {
        mark(flatI)
        rail!.style.setProperty('--p', ((cur + 1) / N).toFixed(3))
        return
      }
      const l0 = ps * N
      world!.style.transform = `scale(var(--sc)) rotateX(${(5 - 3 * ps).toFixed(2)}deg) rotateY(${(-12 + 18 * ps).toFixed(2)}deg)`
      rail!.style.setProperty('--p', ps.toFixed(4))
      mark(clamp(Math.floor(l0), 0, N - 1))
      sts.forEach((s, k) => {
        const L = l0 - k
        const e = 0.5 - L
        const ae = Math.abs(e)
        const z = -(e < 0 ? -1 : 1) * Math.pow(ae, 1.8) * DEPTH
        const o = e >= 0 ? smooth(0.8, 0.3, e) : 1 - smooth(-0.05, -0.4, e)
        const u = clamp((L + 0.45) / 0.9, 0, 1)
        s.el.style.transform = `translate3d(0,0,${z.toFixed(1)}px)`
        s.el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
        s.el.style.setProperty('--u', u.toFixed(3))
        if (s.ag) {
          s.ag.style.opacity = o.toFixed(3)
          s.ag.style.transform = `translate3d(${(e * 40).toFixed(1)}px,0,-60px)`
        }
        if (s.cl) {
          const co = o * smooth(0.3, 0.8, u)
          const pk = k === 4 ? 1.12 : 1
          s.cl.style.opacity = co.toFixed(3)
          s.cl.style.transform = `translate3d(${(-e * 80).toFixed(1)}px,${(e * 24).toFixed(1)}px,110px) scale(${pk})`
        }
        if (k === 4) {
          s.el.classList.toggle('ok', L > 0.5)
          if (L > 0.4 && L < 0.7) s.el.classList.add('tapgo')
          else if (L < 0.3) s.el.classList.remove('tapgo')
        }
      })
    }

    function loop(now: number) {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = target()
      ps += (t - ps) * (1 - Math.exp(-dt * 7))
      if (Math.abs(t - ps) < 0.0003) ps = t
      render()
      if (inView && ps !== t) raf = requestAnimationFrame(loop)
    }
    function wake() {
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    const onScroll = () => {
      if (!isFlat()) wake()
    }
    const onResize = () => {
      fit()
      if (isFlat()) render()
      else wake()
    }
    const onModeChange = () => {
      // Flat mode does not track the scroll; jump to it so a rotation to 3D does not ease in from a stale position.
      ps = target()
      render()
      fit()
      wake()
    }
    const clicks = lis.map((l) => {
      const b = l.querySelector('button')
      const onClick = () => {
        const i = Number(l.dataset.i)
        if (isFlat()) {
          flatI = i
          render()
          fit()
          return
        }
        const top = sec.getBoundingClientRect().top + window.scrollY - header()
        window.scrollTo({ top: top + (span() * (i + 0.5)) / N, behavior: 'smooth' })
      }
      b?.addEventListener('click', onClick)
      return () => b?.removeEventListener('click', onClick)
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    mq.addEventListener('change', onModeChange)
    const io = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting
      if (inView) wake()
    })
    io.observe(sec)
    // Flat mode sizes the scene from the world's height, and next/image loads the screenshots lazily, after fit()
    // ran on the tap: refit whenever the world's height changes (fit only sets the scene height, so no loop).
    const ro = new ResizeObserver(() => {
      if (isFlat()) fit()
    })
    ro.observe(world)
    document.fonts?.ready.then(() => {
      if (disposed || cur < 0) return
      const c = cur
      cur = -1
      mark(c)
    })

    ps = target()
    fit()
    render()
    wake()
    sec.dataset.ready = ''

    return () => {
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      mq.removeEventListener('change', onModeChange)
      io.disconnect()
      ro.disconnect()
      clicks.forEach((off) => off())
      delete sec.dataset.ready
    }
  }, [labels])

  return null
}
