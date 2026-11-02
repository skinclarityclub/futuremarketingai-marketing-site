'use client'

import { useLayoutEffect } from 'react'
import { ACT, LOOP, SPAN, T, TH, heroOffsets, heroPose, heroScale } from './heroFrame'

/**
 * The 15 s loop of hero 3 (#hero), ported from the approved prototype (design/ronde1b/home-4.html, the hero script).
 * Hero3Section renders the markup on the server; this island only drives it: five beats (the week is ready, three
 * clients approve on their phone, the weekly report arrives in WhatsApp), a slow camera and pointer parallax.
 *
 * Site differences from the prototype:
 * - `is-paused` goes on the section, not on body (besluit 4), and `?p=` is gone (besluit 5);
 * - the scale reads the viewport height below the header, not innerHeight (besluit 2);
 * - the orbs are looked up inside the hero only;
 * - it runs in a layout effect, so after a client navigation the first frame is set before paint (besluit 3; on a
 *   full load FIRST_FRAME_SCRIPT already did that), and every listener, timer and the frame loop go on unmount.
 */

const expo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))

export function HeroLoop({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
  useLayoutEffect(() => {
    const hero = document.getElementById('hero')
    const scene = hero?.querySelector<HTMLElement>('#scene')
    const stage = hero?.querySelector<HTMLElement>('#stage')
    const pause = hero?.querySelector<HTMLButtonElement>('#pause')
    if (!hero || !scene || !stage || !pause) {
      console.error('HeroLoop: markup of #hero is incomplete; the hero stays static')
      return
    }
    const orbs = Array.from(hero.querySelectorAll<HTMLElement>('.orb'))
    const layers = Array.from(scene.querySelectorAll<HTMLElement>('.ly[data-z]'))
    const Z = layers.map((l) => Number(l.getAttribute('data-z')))
    const phones = Array.from(scene.querySelectorAll<HTMLElement>('.fan .phone'))
    const kcs = Array.from(scene.querySelectorAll<HTMLElement>('.kc'))
    const rings = Array.from(scene.querySelectorAll<HTMLElement>('.h3ring'))
    const tx = Array.from(scene.querySelectorAll<HTMLElement>('.status .txt > span'))
    const vid = scene.querySelector('video')
    const bar = scene.querySelector<HTMLElement>('.ttp')
    const vph = vid?.closest<HTMLElement>('.phone') ?? null

    // stage height and the hero's top follow the viewport only: measured on resize, never inside the frame loop
    let stageH = 0
    let viewH = 0
    const measure = () => {
      stageH = stage.clientHeight
      viewH = window.innerHeight - (hero.getBoundingClientRect().top + window.scrollY)
    }
    measure()

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    let paused = false
    let last = performance.now()
    let t = 0
    let lastB = -1
    let visible = true
    let raf = 0
    let rt: ReturnType<typeof setTimeout> | undefined
    let tm: ReturnType<typeof setTimeout>[] = []
    const cam = { z: 0, x: 0, y: 0 }
    if (still) hero.setAttribute('data-still', '')
    if (vid) vid.muted = true // React sets muted as a property; autoplay policies need it before play()

    const later = (fn: () => void, ms: number, now: boolean) => {
      if (now || !ms) fn()
      else tm.push(setTimeout(fn, ms))
    }
    // the reel only plays while Luwte is the client in focus, so the queue behind it holds still
    const playing = () =>
      !!vid && !still && !paused && visible && !document.hidden && (!vph || vph.getAttribute('data-d') === '0')
    const syncVid = () => {
      if (!vid) return
      if (playing()) vid.play().catch(() => {}) // a refused play() (power saving) leaves the poster: nothing to do
      else vid.pause()
    }

    const apply = (b: number, now: boolean) => {
      tm.forEach(clearTimeout)
      tm = []
      const f = b < 1 ? 1 : Math.min(b, 3)
      hero.setAttribute('data-b', String(b))
      hero.setAttribute('data-a', ACT[b])
      // a cycling queue: the client in focus stands in front, the ones that are done go to the back of the row
      phones.forEach((p, i) => {
        p.setAttribute('data-d', String((((i - (f - 1)) % 3) + 3) % 3))
        p.classList.toggle('ok', b >= Number(p.getAttribute('data-at')))
      })
      syncVid()
      // the status text and the calendar card follow the tap on the phone, not the phone's move to the front:
      // the phone arrives (.75 s), tap and press peak (1.2 s), Goedgekeurd (1.3 s), Clyde says it (1.55 s), the
      // calendar follows (1.8 s)
      const tap = b >= 1 && b <= 3
      later(() => tx.forEach((s, i) => s.classList.toggle('on', i === b)), tap ? 1550 : 0, now)
      later(
        () => {
          kcs.forEach((k) => k.classList.toggle('ok', b >= Number(k.getAttribute('data-at'))))
          rings.forEach((g) => g.classList.toggle('on', Number(g.getAttribute('data-r')) === b))
        },
        tap ? 1800 : 0,
        now,
      )
    }

    const frame = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!paused) t += dt
      const w = window.innerWidth
      const mob = w <= 860
      const intro = still ? 1 : expo(Math.min(1, t / 1.7))
      let p: number
      if (still) p = 1
      else {
        const ph = (Math.max(0, t - 0.4) % LOOP) / LOOP
        p = ph < SPAN ? ph / SPAN : ph < 0.93 ? 1 : 0
      }
      const b = p < TH[0] ? 0 : p < TH[1] ? 1 : p < TH[2] ? 2 : p < TH[3] ? 3 : 4
      if (b !== lastB) {
        const prev = lastB
        lastB = b
        apply(b, still)
        if (!still && b === 0 && prev === 4) {
          hero.setAttribute('data-r', '1')
          clearTimeout(rt)
          rt = setTimeout(() => hero.removeAttribute('data-r'), 2400)
        }
      }
      const ka = paused ? 0 : 1 - Math.exp(-dt * 3)
      const ma = paused ? 0 : 1 - Math.exp(-dt * 4.5)
      mx += (tmx - mx) * ma
      my += (tmy - my) * ma
      const g = T[b]
      const f = still ? 1 : ka
      const c = mob ? 0.4 : 1
      cam.z += (g.z - cam.z) * f
      cam.x += (g.x * c - cam.x) * f
      cam.y += (g.y * c - cam.y) * f
      const r = heroPose(w, viewH, stageH, t, intro, cam, mx, my, still, Z, heroScale, heroOffsets)
      scene.style.transform = r.scene
      for (let i = 0; i < layers.length; i++) layers[i].style.transform = r.layers[i]
      orbs.forEach((o) => {
        const d = Number(o.getAttribute('data-d'))
        o.style.transform = 'translate(' + mx * d * 2 + 'px,' + my * d + 'px)'
      })
      if (!still && !paused && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      syncVid()
      if (!raf && !still && !paused) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    // the reel's own progress line, as on TikTok
    const onTime = () => {
      if (vid && bar && vid.duration) bar.style.setProperty('--v', String(vid.currentTime / vid.duration))
    }
    if (vid) vid.addEventListener('timeupdate', onTime)
    if (still && bar) bar.style.setProperty('--v', '.3')
    const onPointer = (e: PointerEvent) => {
      tmx = e.clientX / window.innerWidth - 0.5
      tmy = e.clientY / window.innerHeight - 0.5
    }
    // pause = the current beat settles and the scene stands still: no frame loop, no pending timers, no camera drift
    // (WCAG 2.2.2)
    const onPause = () => {
      paused = !paused
      hero.classList.toggle('is-paused', paused)
      pause.setAttribute('aria-label', paused ? playLabel : pauseLabel)
      if (paused) {
        cancelAnimationFrame(raf)
        raf = 0
        apply(lastB, true)
      }
      wake()
    }
    // no work while off-screen or in a background tab
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting
      if (visible) wake()
      else syncVid()
    })
    const onVisibility = () => {
      if (document.hidden) syncVid()
      else wake()
    }
    const onResize = () => {
      measure()
      if (still || paused) frame(performance.now())
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    pause.addEventListener('click', onPause)
    io.observe(hero)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    frame(performance.now())
    syncVid()
    hero.setAttribute('data-ready', '') // the loop is driving the scene (tests wait for this, as for the week)

    return () => {
      hero.removeAttribute('data-ready')
      cancelAnimationFrame(raf)
      tm.forEach(clearTimeout)
      clearTimeout(rt)
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      pause.removeEventListener('click', onPause)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      if (vid) {
        vid.removeEventListener('timeupdate', onTime)
        vid.pause()
      }
    }
  }, [pauseLabel, playLabel])
  return null
}
