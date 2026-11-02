/**
 * Frame math of hero 3, ported from the approved prototype (design/ronde1b/home-4.html, the hero script). Shared by
 * HeroLoop (every frame) and FIRST_FRAME_SCRIPT, the inline script right after the section that places the scene
 * before hydration (PLAN-port PR 3, besluit 3), so the first paint is the loop at t = 0 and not the raw scene.
 *
 * heroScale, heroPose and paintFirstFrame reach the browser twice: bundled for HeroLoop, and as source text inside
 * FIRST_FRAME_SCRIPT (Function.prototype.toString). So they stay self-contained: everything they use comes in as an
 * argument, because a minified outer name would not resolve inside the inline script.
 */

/** Camera target per beat: 0 the week is ready, 1 Meerkade, 2 Luwte, 3 Krijt & Staal, 4 the weekly report. */
export const T = [
  { z: 0, x: 0, y: 0 },
  { z: 0.03, x: 0, y: -22 },
  { z: 0.03, x: 0, y: -22 },
  { z: 0.03, x: 0, y: -22 },
  { z: 0.01, x: 14, y: -8 },
] as const
/** The layer that lights up per beat (data-a). */
export const ACT = ['back', 'front', 'front', 'front', 'mid'] as const
/** Beat thresholds on the loop progress. */
export const TH = [0.11, 0.35, 0.59, 0.83] as const
/** Loop length in seconds, and the part of it that runs the beats (the rest holds the report, then resets). */
export const LOOP = 15
export const SPAN = 0.82

type Scale = (w: number, h: number, stageH: number) => number

/**
 * Scene scale. Phones and tablets fit the stage under the copy (phone composition 660 tall, the full one 960), desktop
 * fits the right half. `h` is the viewport height below the site header: the prototype has no header, so its
 * innerHeight is the site's innerHeight minus the hero's top (besluit 2).
 */
export function heroScale(w: number, h: number, stageH: number): number {
  if (w <= 860) {
    return w < 600
      ? Math.min(0.62, (w - 8) / 600, (stageH - 16) / 660)
      : Math.min(0.95, (w - 32) / 840, (stageH - 16) / 960)
  }
  return Math.min(1.2, (h - 96) / 970, (w * 0.5 - 24) / 760)
}

/** Layer offsets at intro weight k (1.1 at t = 0, 0.1 once the intro has settled). */
export function heroOffsets(k: number): number[][] {
  return [
    [0, -70 * k],
    [0, 40 * k],
    [60 * k, 120 * k],
    [-40 * k, 150 * k],
  ]
}

/** Transforms of the scene and its layers for one frame. */
export function heroPose(
  w: number,
  h: number,
  stageH: number,
  t: number,
  intro: number,
  cam: { z: number; x: number; y: number },
  mx: number,
  my: number,
  still: boolean,
  Z: number[],
  scale: Scale,
  offsets: (k: number) => number[][],
): { scene: string; layers: string[] } {
  const mob = w <= 860
  const m = mob ? 0 : 1
  const drift = still ? 0 : 1
  const k = 1 - intro + 0.1
  const sc = scale(w, h, stageH)
  let ry = -12 + 1.5 * drift * Math.sin(t * 0.33) + mx * 5 * m + (1 - intro) * -14
  let rx = 5 + 1 * drift * Math.sin(t * 0.27 + 1) - my * 3 * m + (1 - intro) * 6
  if (mob) {
    ry = -4 + 0.8 * drift * Math.sin(t * 0.33)
    rx = 3
  }
  const scene =
    'translate3d(' + cam.x * sc + 'px,' + cam.y * sc + 'px,0) scale(' + sc * (1 + cam.z) + ') rotateX(' + rx +
    'deg) rotateY(' + ry + 'deg)'
  const O = offsets(k)
  const layers: string[] = []
  for (let i = 0; i < Z.length; i++) {
    const o = O[i] || [0, 0]
    const z = Z[i] * (1 + 0.9 * k)
    layers.push('translate3d(' + (o[0] + mx * Z[i] * 0.05 * m) + 'px,' + (o[1] + my * Z[i] * 0.04 * m) + 'px,' + z + 'px)')
  }
  return { scene: scene, layers: layers }
}

/**
 * The loop's first frame: t = 0, no pointer, camera at rest. With reduced motion the loop shows its end state (beat 4,
 * still), so the camera stands on beat 4's target at once; the beat classes themselves follow on hydration.
 */
export function paintFirstFrame(
  pose: typeof heroPose,
  scale: Scale,
  offsets: (k: number) => number[][],
  end: { z: number; x: number; y: number },
): void {
  const hero = document.getElementById('hero')
  const scene = document.getElementById('scene')
  const stage = document.getElementById('stage')
  if (!hero || !scene || !stage) return
  const els = scene.querySelectorAll<HTMLElement>('.ly[data-z]')
  const Z: number[] = []
  for (let i = 0; i < els.length; i++) Z.push(Number(els[i].getAttribute('data-z')))
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const w = window.innerWidth
  const f = w <= 860 ? 0.4 : 1
  const cam = still ? { z: end.z, x: end.x * f, y: end.y * f } : { z: 0, x: 0, y: 0 }
  const h = window.innerHeight - (hero.getBoundingClientRect().top + window.scrollY)
  const r = pose(w, h, stage.clientHeight, 0, still ? 1 : 0, cam, 0, 0, still, Z, scale, offsets)
  scene.style.transform = r.scene
  for (let i = 0; i < els.length; i++) els[i].style.transform = r.layers[i]
  if (still) hero.setAttribute('data-still', '')
}

export const FIRST_FRAME_SCRIPT =
  '(' + paintFirstFrame.toString() + ')(' + heroPose.toString() + ',' + heroScale.toString() + ',' +
  heroOffsets.toString() + ',' + JSON.stringify(T[4]) + ')'
