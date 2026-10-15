import { expect, test, type APIRequestContext, type BrowserContext, type Page, type Route } from '@playwright/test'
import { randomInt } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'

// Proof of /voor/<slug> in a real Chrome against the stub of the app (tests/e2e-voor/stubs/video-pages-app.mjs).
// The stub never orders events: these tests prove what the BROWSER sends and when it starts measuring.

const STUB = 'http://localhost:3999'
const FIXTURES = path.join(__dirname, '..', 'fixtures', 'voor-hls')
const CHARS = 'abcdefghijklmnopqrstuvwxyz23456789'
const newSlug = () => 'studio-lumen-' + Array.from({ length: 12 }, () => CHARS[randomInt(CHARS.length)]).join('')

type Rec = { t: number; path: 'view' | 'event' | 'dropoff'; slug: string | null; body: { record?: { method?: string } } | null }
type Ev = { kind: string; seq: number; visitor: string; from?: number; to?: number }

async function stubLog(request: APIRequestContext, slug: string): Promise<Rec[]> {
  const all = (await (await request.get(`${STUB}/__log`)).json()) as Rec[]
  return all.filter((r) => r.slug === slug)
}
const stubEvents = async (request: APIRequestContext, slug: string) =>
  (await stubLog(request, slug)).filter((r) => r.path === 'event').map((r) => r.body as unknown as Ev)
const tags = (evs: Ev[]) => evs.map((e) => `${e.kind}:${e.seq}`)

// Browser-side view of the requests to /api/voor/event, in the order the page sent them.
function watchEvents(target: Page | BrowserContext) {
  const sent: Ev[] = []
  target.on('request', (r) => {
    if (r.method() === 'POST' && r.url().endsWith('/api/voor/event')) sent.push(JSON.parse(r.postData() ?? '{}'))
  })
  return sent
}

// Holds one kind of event request until release(): 'continue' passes it to the stub, 'abort' drops it, a number answers it.
function hold(target: Page | BrowserContext, kind: string, seq?: number) {
  let open!: (how: 'continue' | 'abort' | number) => void
  const gate = new Promise<'continue' | 'abort' | number>((r) => (open = r))
  let seenOnce!: () => void
  const seen = new Promise<void>((r) => (seenOnce = r))
  void target.route('**/api/voor/event', async (route: Route) => {
    const b = JSON.parse(route.request().postData() ?? '{}')
    if (b.kind !== kind || (seq !== undefined && b.seq !== seq)) return route.fallback()
    seenOnce()
    const how = await gate
    try {
      if (how === 'continue') await route.continue()
      else if (how === 'abort') await route.abort()
      else await route.fulfill({ status: how, body: '' })
    } catch {
      // page already gone
    }
  })
  return { seen, release: open }
}

// Answers every request of one kind with a status; the rest goes to the stub.
const failKind = (target: Page | BrowserContext, kind: string, status: number) =>
  target.route('**/api/voor/event', (route) => {
    const b = JSON.parse(route.request().postData() ?? '{}')
    return b.kind === kind ? route.fulfill({ status, body: '' }) : route.fallback()
  })

// Cal.com is never reached for real, but its requests stay observable.
const CAL = /^https?:\/\/([^/]*\.)?cal\.com\//
function calRequests(page: Page) {
  const urls: string[] = []
  void page.route(CAL, (r) => r.abort())
  page.on('request', (r) => {
    if (CAL.test(r.url())) urls.push(r.url())
  })
  return urls
}

// The player gets its source through the same code as production; only the network answer is ours.
function serveVideo(target: Page | BrowserContext) {
  const hits: { url: string; headers: Record<string, string> }[] = []
  void target.route('https://voor-video.invalid/**', (route) => {
    const req = route.request()
    hits.push({ url: req.url(), headers: req.headers() })
    const name = path.basename(new URL(req.url()).pathname)
    const file = name === 'playlist.m3u8' ? 'index.m3u8' : name
    let body: Buffer
    try {
      body = readFileSync(path.join(FIXTURES, file))
    } catch {
      return route.fulfill({ status: 404, body: '' })
    }
    return route.fulfill({
      status: 200,
      headers: {
        'access-control-allow-origin': '*',
        'content-type': file.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t',
      },
      body,
    })
  })
  return hits
}

async function open(page: Page, slug: string) {
  await page.goto(`/voor/${slug}`)
  // The switch is enabled before React hydrates; clicking then does nothing, so wait for the handlers.
  await page.waitForFunction(() => {
    const el = document.querySelector('[role=switch]')
    return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps$'))
    // Interval polling: the default (requestAnimationFrame) never fires in a tab behind another one.
  }, null, { polling: 100 })
  await page.waitForTimeout(300) // mount effects (supported(), replay) have run
}

const sw = (page: Page) => page.getByRole('switch')
const cta = (page: Page) => page.getByRole('button', { name: /Plan een gesprek/ })
const stored = (page: Page, slug: string, name: 'keuze' | 'bevestigd' | 'pos') =>
  page.evaluate((k) => {
    const raw = localStorage.getItem(k)
    try {
      return raw === null ? null : JSON.parse(raw)
    } catch {
      return raw
    }
  }, `voor:${slug}:${name}`)

const time = (page: Page) => page.evaluate(() => document.querySelector('video')!.currentTime)
const pause = (page: Page) => page.evaluate(() => document.querySelector('video')!.pause())

async function startVideo(page: Page) {
  await page.bringToFront() // a tab behind another one does not play
  await page.getByRole('button', { name: /Bekijk de video voor/ }).click()
  await expect.poll(() => time(page), { timeout: 20_000 }).toBeGreaterThan(0.3)
}

/** Plays on until the video reaches `t` (checked every frame), then pauses. */
async function playUntil(page: Page, t: number) {
  await page.evaluate(() => document.querySelector('video')!.play())
  await page.waitForFunction((t) => document.querySelector('video')!.currentTime >= t, t, { polling: 'raf' })
  await pause(page)
}

/** Plays for `sec` of video time from where it stands, then pauses. */
async function playFor(page: Page, sec: number) {
  const from = await time(page)
  await page.evaluate(() => document.querySelector('video')!.play())
  await expect.poll(() => time(page), { timeout: 20_000 }).toBeGreaterThanOrEqual(from + sec)
  await pause(page)
}

const toggleOn = async (page: Page) => {
  await expect(sw(page)).toHaveAttribute('aria-checked', 'false')
  await sw(page).click()
  await expect(sw(page)).toHaveAttribute('aria-checked', 'true')
}
const toggleOff = async (page: Page) => {
  await expect(sw(page)).toHaveAttribute('aria-checked', 'true')
  await sw(page).click()
  await expect(sw(page)).toHaveAttribute('aria-checked', 'false')
}
/** Switch on and the server's 204 stored as `bevestigd`. */
async function consentConfirmed(page: Page, slug: string) {
  await toggleOn(page)
  await expect.poll(() => stored(page, slug, 'bevestigd')).toMatchObject({ on: true })
}

/** Lets a held answer through, waits until the page has received it and until its handler (under the lock) has run. */
async function answerLate(page: Page, slug: string, seq: number, release: () => void) {
  const answered = page.waitForResponse(
    (r) => r.url().endsWith('/api/voor/event') && r.request().postDataJSON()?.kind === 'consent' && r.request().postDataJSON()?.seq === seq,
  )
  release()
  await answered
  await page.evaluate((s) => navigator.locks.request(`voor:${s}`, () => undefined), slug)
}

const watches = (evs: Ev[]) => evs.filter((e) => e.kind === 'watch')

async function twoTabs(context: BrowserContext, slug: string) {
  const pages = [await context.newPage(), await context.newPage()]
  for (const p of pages) {
    serveVideo(p)
    calRequests(p)
  }
  await open(pages[0], slug)
  await open(pages[1], slug)
  return pages
}

test.describe('voor', () => {
  test.beforeEach(async ({ page }) => {
    calRequests(page)
    serveVideo(page)
  })

  test('eerste scherm op de telefoon', async ({ page }) => {
    const slug = newSlug()
    const tracked: string[] = []
    page.on('request', (r) => {
      if (/googletagmanager\.com|google-analytics\.com/.test(r.url())) tracked.push(r.url())
    })
    await page.setViewportSize({ width: 390, height: 844 })
    await open(page, slug)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Eva')
    const inFirstScreen = async (loc: ReturnType<Page['locator']>) => {
      await expect(loc).toBeVisible()
      const box = (await loc.boundingBox())!
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.y + box.height).toBeLessThanOrEqual(844)
    }
    await inFirstScreen(page.locator('video'))
    await inFirstScreen(cta(page))
    await page.waitForTimeout(1500)
    await expect(page.locator('[role=dialog]')).toHaveCount(0)
    await expect(page.getByText(/cookie/i)).toHaveCount(0)
    expect(tracked).toEqual([])
  })

  test('headers', async ({ request }) => {
    const res = await request.get(`/voor/${newSlug()}`, { maxRedirects: 0 })
    expect(res.status()).toBe(200)
    expect(res.headers()['cache-control']).toContain('no-store')
    expect(res.headers()['x-robots-tag']).toContain('noindex')
    expect(res.headers()['referrer-policy']).toBe('no-referrer')
  })

  test('één view per bezoek', async ({ page, request }) => {
    const slug = newSlug()
    await open(page, slug)
    await page.waitForTimeout(1500)
    const views = (await stubLog(request, slug)).filter((r) => r.path === 'view')
    expect(views).toHaveLength(1)
    expect(views[0].body!.record!.method).toBe('GET')
  })

  test('echte methode', async ({ request }) => {
    const slug = newSlug()
    const url = `/voor/${slug}`
    const views = async () => (await stubLog(request, slug)).filter((r) => r.path === 'view')
    await request.head(url)
    await expect.poll(async () => (await views()).length).toBe(1)
    expect((await views())[0].body!.record!.method).toBe('HEAD')
    await request.get(url, { headers: { 'x-voor-method': 'HEAD' } })
    await expect.poll(async () => (await views()).length).toBe(2)
    expect((await views())[1].body!.record!.method).toBe('GET')
  })

  test('video speelt via HLS zonder referer', async ({ page }) => {
    const hits = serveVideo(page)
    await open(page, newSlug())
    await startVideo(page)
    await expect.poll(() => time(page)).toBeGreaterThan(1)
    expect(hits.some((h) => h.url.endsWith('.m3u8'))).toBe(true)
    expect(hits.some((h) => h.url.endsWith('.m2ts'))).toBe(true)
    expect(hits.filter((h) => h.headers['referer'])).toEqual([])
  })

  test('niets per persoon zonder ja', async ({ page }) => {
    const slug = newSlug()
    const order: string[] = []
    const label = (r: { postData(): string | null }) => {
      const b = JSON.parse(r.postData() ?? '{}')
      return `${b.kind}:${b.seq}`
    }
    page.on('request', (r) => {
      if (r.url().endsWith('/api/voor/event')) order.push(`req:${label(r)}`)
    })
    page.on('response', (r) => {
      if (r.url().endsWith('/api/voor/event')) order.push(`res:${label(r.request())}:${r.status()}`)
    })
    await open(page, slug)
    await startVideo(page)
    await page.waitForTimeout(3000)
    await pause(page)
    expect(order).toEqual([])

    await toggleOn(page)
    await expect.poll(() => stored(page, slug, 'bevestigd')).toMatchObject({ on: true, seq: 1 })
    await playFor(page, 1)
    await expect.poll(() => order.filter((o) => o.startsWith('req:watch')).length).toBe(1)
    expect(order.filter((o) => o.startsWith('req:consent'))).toEqual(['req:consent:1'])
    expect(order.indexOf('req:consent:1')).toBeLessThan(order.indexOf('res:consent:1:204'))
    expect(order.indexOf('res:consent:1:204')).toBeLessThan(order.indexOf('req:watch:1'))
  })

  for (const status of [503, 409]) {
    test(`consent die faalt (${status})`, async ({ page, request }) => {
      const slug = newSlug()
      const sent = watchEvents(page)
      await failKind(page, 'consent', status)
      await open(page, slug)
      await startVideo(page)
      await sw(page).click()
      await expect.poll(() => stored(page, slug, 'keuze')).toMatchObject({ on: false, seq: 2 })
      await expect(sw(page)).toHaveAttribute('aria-checked', 'false')
      await expect.poll(async () => tags(await stubEvents(request, slug))).toEqual(['consent_withdrawn:2'])
      await playFor(page, 1)
      await page.waitForTimeout(500)
      expect(watches(sent)).toEqual([])
    })
  }

  test('vertraagde consent na uitzetten', async ({ page, request }) => {
    const slug = newSlug()
    const sent = watchEvents(page)
    const held = hold(page, 'consent', 1)
    await open(page, slug)
    await startVideo(page)
    await pause(page)
    await sw(page).click()
    await held.seen
    await toggleOff(page)
    await expect.poll(() => stored(page, slug, 'keuze')).toMatchObject({ on: false, seq: 2 })
    await expect.poll(() => stored(page, slug, 'bevestigd')).toMatchObject({ on: false, seq: 2 })
    const before = await stored(page, slug, 'bevestigd')
    await answerLate(page, slug, 1, () => held.release('continue'))
    await expect.poll(async () => tags(await stubEvents(request, slug)).sort()).toEqual(['consent:1', 'consent_withdrawn:2'])
    expect(await stored(page, slug, 'bevestigd')).toEqual(before)
    expect(await stored(page, slug, 'keuze')).toMatchObject({ on: false, seq: 2 })
    await expect(sw(page)).toHaveAttribute('aria-checked', 'false')
    await playFor(page, 1)
    await page.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
  })

  test('vertraagde consent over een herlading', async ({ page, request }) => {
    const slug = newSlug()
    const held = hold(page, 'consent', 1)
    await failKind(page, 'consent_withdrawn', 503) // registered after the hold, so it is asked first
    await open(page, slug)
    await sw(page).click()
    await held.seen
    await toggleOff(page)
    await expect.poll(() => stored(page, slug, 'keuze')).toMatchObject({ on: false, seq: 2 })
    const keuze = await stored(page, slug, 'keuze')
    expect(await stored(page, slug, 'bevestigd')).toBeNull()
    held.release('abort')
    await page.unrouteAll({ behavior: 'ignoreErrors' })
    serveVideo(page)
    calRequests(page)
    const sent = watchEvents(page)
    await open(page, slug)
    await expect.poll(() => tags(sent)).toEqual(['consent_withdrawn:2'])
    await expect.poll(async () => tags(await stubEvents(request, slug))).toEqual(['consent_withdrawn:2'])
    await expect.poll(() => stored(page, slug, 'bevestigd')).toEqual(keuze)
    await startVideo(page)
    await playFor(page, 1)
    await page.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
  })

  test('intrekking die faalt', async ({ page, request }) => {
    const slug = newSlug()
    const sent = watchEvents(page)
    await open(page, slug)
    await startVideo(page)
    await pause(page)
    await consentConfirmed(page, slug)
    await failKind(page, 'consent_withdrawn', 503)
    await toggleOff(page)
    await expect.poll(() => stored(page, slug, 'keuze')).toMatchObject({ on: false, seq: 2 })
    expect(await stored(page, slug, 'bevestigd')).toMatchObject({ on: true, seq: 1 })
    await playFor(page, 1)
    await page.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
    const keuze = await stored(page, slug, 'keuze')

    await page.unrouteAll({ behavior: 'ignoreErrors' })
    serveVideo(page)
    calRequests(page)
    sent.length = 0
    await open(page, slug)
    await expect.poll(() => tags(sent)).toEqual(['consent_withdrawn:2'])
    await expect.poll(async () => tags(await stubEvents(request, slug)).filter((t) => t.startsWith('consent_withdrawn'))).toEqual(['consent_withdrawn:2'])
    await expect.poll(() => stored(page, slug, 'bevestigd')).toEqual(keuze)
  })

  test('twee tabs met een lopende consent', async ({ context }) => {
    const slug = newSlug()
    const sent = watchEvents(context)
    const held = hold(context, 'consent', 1)
    const [one, two] = await twoTabs(context, slug)
    await sw(one).click()
    await held.seen
    await expect(sw(two)).toHaveAttribute('aria-checked', 'true')
    expect(await stored(two, slug, 'bevestigd')).toBeNull() // not measuring yet
    await sw(two).click() // seq 2
    await expect(sw(one)).toHaveAttribute('aria-checked', 'false')
    await expect.poll(() => stored(two, slug, 'bevestigd')).toMatchObject({ on: false, seq: 2 })
    const before = await stored(two, slug, 'bevestigd')
    await answerLate(one, slug, 1, () => held.release('continue'))
    expect(await stored(one, slug, 'bevestigd')).toEqual(before)
    for (const p of [one, two]) {
      await startVideo(p)
      await playFor(p, 1)
    }
    await one.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
  })

  test('intrekken in een andere tab', async ({ context }) => {
    const slug = newSlug()
    const sent = watchEvents(context)
    const [one, two] = await twoTabs(context, slug)
    await startVideo(one)
    await pause(one)
    await consentConfirmed(one, slug)
    await expect(sw(two)).toHaveAttribute('aria-checked', 'true')
    await sw(two).click()
    await expect(sw(one)).toHaveAttribute('aria-checked', 'false')
    await playFor(one, 1)
    await one.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
  })

  test('twee tabs tegelijk', async ({ context, request }) => {
    const slug = newSlug()
    const sent = watchEvents(context)
    const [one, two] = await twoTabs(context, slug)
    // One evaluate per tab, same tick: a locator click would let the first tab's storage event flip the other switch first.
    await Promise.all([one, two].map((p) => p.evaluate(() => (document.querySelector('[role=switch]') as HTMLElement).click())))
    await expect.poll(async () => (await stubEvents(request, slug)).filter((e) => e.kind === 'consent').length).toBe(2)
    await one.waitForTimeout(500) // poll stops at the first match: a third consent must not follow
    const consents = (await stubEvents(request, slug)).filter((e) => e.kind === 'consent')
    expect(consents.map((e) => e.seq).sort()).toEqual([1, 2])
    expect(new Set(consents.map((e) => e.visitor)).size).toBe(1)

    await expect(sw(one)).toHaveAttribute('aria-checked', 'true')
    await sw(one).click()
    await expect.poll(async () => (await stubEvents(request, slug)).filter((e) => e.kind === 'consent_withdrawn').length).toBe(1)
    await one.waitForTimeout(500)
    const out = (await stubEvents(request, slug)).filter((e) => e.kind === 'consent_withdrawn')
    expect(out[0].seq).toBe(3)
    expect(out[0].visitor).toBe(consents[0].visitor)
    for (const p of [one, two]) {
      await startVideo(p)
      await playFor(p, 1)
    }
    await one.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
  })

  test('uitzetten zonder opslagruimte', async ({ page, request }) => {
    const slug = newSlug()
    await page.clock.install()
    const sent = watchEvents(page)
    await open(page, slug)
    await startVideo(page)
    await pause(page)
    await consentConfirmed(page, slug)
    await failKind(page, 'consent_withdrawn', 503)
    await page.evaluate(() => {
      const real = Storage.prototype.setItem
      Storage.prototype.setItem = function (this: Storage, ...a: [string, string]) {
        if (this === localStorage) throw new DOMException('full', 'QuotaExceededError')
        return real.apply(this, a)
      }
    })
    await toggleOff(page)
    await playFor(page, 1)
    await page.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
    expect(await stored(page, slug, 'keuze')).toBeNull()
    expect(await stored(page, slug, 'bevestigd')).toBeNull()
    const outs = () => sent.filter((e) => e.kind === 'consent_withdrawn' && e.seq === 2).length
    await expect.poll(outs).toBe(1)
    await page.clock.fastForward(15_000)
    await expect.poll(outs).toBe(2)
    await page.unroute('**/api/voor/event')
    await page.clock.fastForward(15_000)
    await expect.poll(async () => tags(await stubEvents(request, slug)).filter((t) => t === 'consent_withdrawn:2')).toHaveLength(1)
  })

  test('volle opslag, korte keuze past wel', async ({ page, request }) => {
    const slug = newSlug()
    const sent = watchEvents(page)
    await open(page, slug)
    await startVideo(page)
    await pause(page)
    await consentConfirmed(page, slug)
    await playFor(page, 1) // writes `pos`
    await expect.poll(() => stored(page, slug, 'pos')).not.toBeNull()
    const A = (await stored(page, slug, 'keuze')).visitor
    expect(await stored(page, slug, 'bevestigd')).toMatchObject({ visitor: A, on: true, seq: 1 })
    await failKind(page, 'consent_withdrawn', 503)
    await page.evaluate(() => {
      const real = Storage.prototype.setItem
      let n = 0
      Storage.prototype.setItem = function (this: Storage, ...a: [string, string]) {
        if (this === localStorage && n++ === 0) throw new DOMException('full', 'QuotaExceededError')
        return real.apply(this, a)
      }
    })
    await toggleOff(page)
    await expect.poll(() => stored(page, slug, 'keuze')).toEqual({ visitor: A, on: false, seq: 2 })
    expect(await stored(page, slug, 'pos')).toBeNull()
    expect(await stored(page, slug, 'bevestigd')).toBeNull()

    await page.unrouteAll({ behavior: 'ignoreErrors' })
    serveVideo(page)
    calRequests(page)
    sent.length = 0
    await open(page, slug)
    await expect.poll(() => sent.map((e) => `${e.kind}:${e.visitor}:${e.seq}`)).toEqual([`consent_withdrawn:${A}:2`])
    await expect.poll(() => stored(page, slug, 'bevestigd')).toEqual({ visitor: A, on: false, seq: 2 })
    await toggleOn(page)
    await expect
      .poll(async () => (await stubEvents(request, slug)).filter((e) => e.kind === 'consent').map((e) => `${e.visitor}:${e.seq}`))
      .toEqual([`${A}:1`, `${A}:3`])
  })

  test('kijksegment over een keuzewissel', async ({ page, request }) => {
    const slug = newSlug()
    await page.clock.install() // real time keeps flowing; the page's timers are the clock's, so nothing runs ahead
    const sent = watchEvents(page)
    const held = hold(page, 'consent', 3) // the answer to seq 3 is held, so click and confirmation are far apart
    await open(page, slug)
    await startVideo(page)
    await pause(page)
    await consentConfirmed(page, slug) // seq 1
    await page.evaluate(() => {
      const v = document.querySelector('video')!
      v.currentTime = 0
      void v.play()
    })
    await page.waitForFunction(() => document.querySelector('video')!.currentTime >= 3, null, { polling: 'raf' })
    await toggleOff(page) // seq 2
    await sw(page).click() // seq 3, held
    await held.seen
    const tClick = await time(page)
    await page.waitForTimeout(1000)
    held.release('continue')
    // The video time in the very frame in which `bevestigd` turns seq 3: the segment may not start before it.
    const tConfirm = (await (
      await page.waitForFunction(
        (k) => {
          try {
            const c = JSON.parse(localStorage.getItem(k) ?? 'null')
            return c?.seq === 3 && c.on === true ? document.querySelector('video')!.currentTime : false
          } catch {
            return false
          }
        },
        `voor:${slug}:bevestigd`,
        { polling: 'raf' },
      )
    ).jsonValue()) as number
    expect(tConfirm).toBeGreaterThan(tClick + 0.5)
    await playUntil(page, 8)
    await expect.poll(() => watches(sent).filter((e) => e.seq === 3).length).toBe(1)
    await page.waitForTimeout(500)
    expect(watches(sent).filter((e) => e.seq === 3)).toHaveLength(1)
    expect(watches(sent).filter((e) => e.seq === 1)).toEqual([])
    const w = watches(await stubEvents(request, slug)).filter((e) => e.seq === 3)
    expect(w).toHaveLength(1)
    expect(w[0].from!).toBeGreaterThanOrEqual(tConfirm - 0.1)
    expect(Math.abs(w[0].to! - 8)).toBeLessThan(0.5)
  })

  test('late fout op een oude consent', async ({ context, request }) => {
    const slug = newSlug()
    const held = hold(context, 'consent', 1)
    const [one, two] = await twoTabs(context, slug)
    await sw(one).click()
    await held.seen
    await expect(sw(two)).toHaveAttribute('aria-checked', 'true')
    await toggleOff(two) // seq 2
    await toggleOn(two) // seq 3
    await expect.poll(() => stored(two, slug, 'bevestigd')).toMatchObject({ on: true, seq: 3 })
    const before = await stored(two, slug, 'bevestigd')
    await answerLate(one, slug, 1, () => held.release(503))
    expect(await stored(one, slug, 'keuze')).toMatchObject({ on: true, seq: 3 })
    expect(await stored(one, slug, 'bevestigd')).toEqual(before)
    const kinds = tags(await stubEvents(request, slug))
    expect(kinds).not.toContain('consent_withdrawn:4')
    expect(kinds.filter((k) => k.startsWith('consent_withdrawn'))).toEqual(['consent_withdrawn:2'])
  })

  test('oude bevestiging telt niet', async ({ page }) => {
    const slug = newSlug()
    const A = '11111111-1111-4111-8111-111111111111'
    const B = '22222222-2222-4222-8222-222222222222'
    await page.addInitScript(
      ({ slug, A, B }) => {
        if (localStorage.getItem(`voor:${slug}:keuze`)) return
        localStorage.setItem(`voor:${slug}:keuze`, JSON.stringify({ visitor: A, on: true, seq: 1 }))
        localStorage.setItem(`voor:${slug}:bevestigd`, JSON.stringify({ visitor: B, on: true, seq: 1 }))
      },
      { slug, A, B },
    )
    const sent = watchEvents(page)
    const held = hold(page, 'consent', 1)
    await open(page, slug)
    await held.seen
    expect(sent.filter((e) => e.kind === 'consent').map((e) => `${e.visitor}:${e.seq}`)).toEqual([`${A}:1`])
    await startVideo(page)
    await playFor(page, 1)
    await page.waitForTimeout(500)
    expect(watches(sent)).toEqual([])
    held.release('abort')
  })

  test('geen Web Locks', async ({ page }) => {
    const slug = newSlug()
    await page.addInitScript(() => Object.defineProperty(navigator, 'locks', { value: undefined }))
    const sent = watchEvents(page)
    await open(page, slug)
    await expect(sw(page)).toBeDisabled()
    await expect(page.getByText('Meten per persoon kan in deze browser niet.')).toBeVisible()
    await startVideo(page)
    await playFor(page, 1)
    await cta(page).first().click()
    await page.waitForTimeout(500)
    expect(sent).toEqual([])
  })

  test('OG-beeld', async ({ request }) => {
    const ok = await request.get(`/api/og/voor/${newSlug()}`)
    expect(ok.status()).toBe(200)
    expect(ok.headers()['content-type']).toContain('image/png')
    expect(ok.headers()['cache-control']).toContain('private')
    expect(ok.headers()['cache-control']).toContain('no-store')
    const missing = await request.get('/api/og/voor/ander-bureau-abcdefghijkm')
    expect(missing.status()).toBe(404)
    expect(missing.headers()['cache-control']).toContain('private')
    expect(missing.headers()['cache-control']).toContain('no-store')
  })

  test('Cal pas na de klik', async ({ page }) => {
    const slug = newSlug()
    const cal = calRequests(page)
    await open(page, slug)
    await startVideo(page)
    await pause(page)
    await page.waitForTimeout(1000)
    expect(cal).toEqual([]) // without consent
    await consentConfirmed(page, slug)
    await page.waitForTimeout(1000)
    expect(cal).toEqual([]) // with consent
    await cta(page).first().click()
    await expect.poll(() => cal.length).toBeGreaterThan(0)
  })

  test('afhaak zonder referer', async ({ page }) => {
    const slug = newSlug()
    const seen: Promise<{ headers: Record<string, string>; body: string | null }>[] = []
    page.on('request', (r) => {
      if (r.url().endsWith('/api/voor/afhaak')) seen.push(r.allHeaders().then((headers) => ({ headers, body: r.postData() })))
    })
    await open(page, slug)
    await startVideo(page)
    await playFor(page, 1.5)
    await page.goto('about:blank') // fires pagehide
    await expect.poll(() => seen.length).toBe(1)
    await page.waitForTimeout(500)
    expect(seen).toHaveLength(1)
    const { headers, body } = await seen[0]
    // Playwright sometimes lists a bare `referer: ""` for a request that carries none; only a value would leak.
    expect(headers['referer'] ?? '').toBe('')
    expect(Object.keys(JSON.parse(body ?? '{}')).sort()).toEqual(['maxSec', 'v'])
  })

  test('onbekende slug', async ({ page, request }) => {
    const unknown = await page.goto('/voor/ander-bureau-abcdefghijkm')
    expect(unknown!.status()).toBe(404)
    await expect(page.getByText('Deze pagina bestaat niet (meer).')).toBeVisible()

    const short = `studio-lumen-${CHARS.slice(0, 5)}`
    const res = await request.get(`/voor/${short}`)
    expect(res.status()).toBe(404)
    expect(await stubLog(request, short)).toEqual([])
  })

  test('andere paden ongemoeid', async ({ page, request }) => {
    // Baseline measured on the unchanged code (prod, branch base 687d5cb): /voorwaarden 308 -> /nl/voorwaarden, /en 200.
    const res = await request.get('/voorwaarden', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(new URL(res.headers()['location'], 'http://localhost:3998').pathname).toBe('/nl/voorwaarden')
    expect((await page.goto('/en'))!.status()).toBe(200)
  })

  test('privacyverklaring heeft het voor-anker', async ({ page }) => {
    await page.goto('/nl/legal/privacy')
    await expect(page.locator('#privacy-voor')).toBeVisible()
  })
})
