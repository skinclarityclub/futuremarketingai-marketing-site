// Browser-side consent + tracking for /voor/<slug>. Client only: never import video-pages-app (server-only).
// The server orders events on `seq`; this module hands out `seq` under ONE browser-wide Web Lock and
// only measures once the server answered 204 to the WHOLE choice. Without Web Locks or storage: no events (fail closed).

export type Choice = { visitor: string; on: boolean; seq: number }
export type Segment = { from: number; to: number; seq: number }
export type ChooseResult = 'ok' | 'unsupported' | 'failed' | 'superseded'

const keyChoice = (slug: string) => `voor:${slug}:keuze`
const keyConfirmed = (slug: string) => `voor:${slug}:bevestigd`
const keyPos = (slug: string) => `voor:${slug}:pos`
const RETRY_MS = 15_000

// --- storage (every access in try/catch) -------------------------------------------------------

function readChoice(key: string): Choice | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const c = JSON.parse(raw) as Partial<Choice>
    if (typeof c.visitor === 'string' && typeof c.on === 'boolean' && Number.isSafeInteger(c.seq) && (c.seq as number) >= 1) {
      return { visitor: c.visitor, on: c.on, seq: c.seq as number }
    }
  } catch {
    // unreadable counts as absent
  }
  return null
}

function writeItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // nothing to do
  }
}

const same = (a: Choice | null, b: Choice | null) =>
  !!a && !!b && a.visitor === b.visitor && a.on === b.on && a.seq === b.seq

// --- fail closed -------------------------------------------------------------------------------

/**
 * Web Locks (secure context) and a readable localStorage. Never probes by writing: a full storage must still
 * reach `step()`, where a failed withdrawal write is recovered (B-36/B-45); only a failed "on" write stops there.
 */
export function supported(): boolean {
  try {
    if (typeof navigator === 'undefined' || !navigator.locks) return false
    localStorage.getItem('voor:probe')
    return true
  } catch {
    return false
  }
}

function locked<T>(slug: string, fn: () => T): Promise<T> {
  return navigator.locks.request(`voor:${slug}`, () => fn()) as Promise<T>
}

// --- tab memory for a withdrawal that could not be stored (B-36 / B-45) ------------------------

let held: { slug: string; v: string; choice: Choice } | null = null
let retryTimer: ReturnType<typeof setInterval> | null = null
let onHide: (() => void) | null = null

// One place that forgets the held withdrawal, so the timer and the pagehide listener never outlive it.
function dropHeld(): void {
  held = null
  if (retryTimer) clearInterval(retryTimer)
  retryTimer = null
  if (onHide) window.removeEventListener('pagehide', onHide)
  onHide = null
}

function heldFor(slug: string): Choice | null {
  return held && held.slug === slug ? held.choice : null
}

// The choice as the tab sees it: storage first, else the withdrawal this tab holds in memory.
function current(slug: string): Choice | null {
  return readChoice(keyChoice(slug)) ?? heldFor(slug)
}

// --- change notification (own writes + the storage event of other tabs) ------------------------

const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((cb) => cb())
}

/** Fires on every change of the choice or its confirmation, in this tab and in other tabs. */
export function onChange(slug: string, cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === keyChoice(slug) || e.key === keyConfirmed(slug)) cb()
  }
  window.addEventListener('storage', onStorage)
  listeners.add(cb)
  return () => {
    window.removeEventListener('storage', onStorage)
    listeners.delete(cb)
  }
}

// --- reading state -----------------------------------------------------------------------------

/** The switch position: a stored (or tab-held) "on", before or after confirmation. */
export function isOn(slug: string): boolean {
  return !heldFor(slug) && readChoice(keyChoice(slug))?.on === true
}

/** Non-null only when the server confirmed exactly the current "on" choice (all three fields equal). */
export function measuring(slug: string): { visitor: string; seq: number } | null {
  if (heldFor(slug) || !supported()) return null
  const k = readChoice(keyChoice(slug))
  if (!k || !k.on || !same(k, readChoice(keyConfirmed(slug)))) return null
  return { visitor: k.visitor, seq: k.seq }
}

export function readPos(slug: string): number | null {
  if (!isOn(slug)) return null
  try {
    const n = Number(localStorage.getItem(keyPos(slug)))
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

// --- network -----------------------------------------------------------------------------------

type Sent = { slug: string; v: string; choice: Choice }

async function post(body: Record<string, unknown>, keepalive = false): Promise<number> {
  try {
    const res = await fetch('/api/voor/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    })
    return res.status
  } catch {
    return 0
  }
}

function choiceBody({ slug, v, choice }: Sent): Record<string, unknown> {
  return {
    kind: choice.on ? 'consent' : 'consent_withdrawn',
    slug,
    v,
    visitor: choice.visitor,
    seq: choice.seq,
    ...(choice.on ? { textVersion: 'v1' } : {}),
  }
}

// --- choose ------------------------------------------------------------------------------------

// Runs INSIDE the lock the caller already holds. Reads, takes seq + 1, writes the choice FIRST; null = nothing to send.
function step(slug: string, v: string, on: boolean): Choice | null {
  const stored = readChoice(keyChoice(slug))
  const mem = heldFor(slug)
  if (!on && !stored && !mem) return null // never opted in: nothing to withdraw
  const visitor = stored?.visitor ?? mem?.visitor ?? crypto.randomUUID()
  const seq = Math.max(stored?.seq ?? 0, mem?.seq ?? 0) + 1
  const next: Choice = { visitor, on, seq }
  if (writeItem(keyChoice(slug), JSON.stringify(next))) {
    // A withdrawal held for ANOTHER visitor (a tab created one meanwhile) is still owed to the server.
    if (held?.slug === slug && held.choice.visitor === next.visitor) dropHeld()
    if (!on) removeItem(keyPos(slug))
    emit()
    return next
  }
  if (on) return null // no stored choice = no order = no per-person measuring: no POST
  // B-36: a failed withdrawal write. Hold "off" in memory (measuring stops now), free space, retry once (B-45).
  held = { slug, v, choice: next }
  removeItem(keyPos(slug))
  removeItem(keyConfirmed(slug))
  if (writeItem(keyChoice(slug), JSON.stringify(next))) {
    dropHeld()
  } else {
    removeItem(keyChoice(slug)) // even the short choice does not fit: send the withdrawal anyway, retry from memory
  }
  emit()
  return next
}

// Answer handling happens under the lock again (B-46) and acts only if the choice is still exactly the one sent.
async function drive(sent: Sent): Promise<ChooseResult> {
  const { slug, v, choice } = sent
  const isHeld = same(heldFor(slug), choice)
  const status = await post(choiceBody(sent), isHeld) // a held withdrawal may be the last thing this page sends
  const { result, rollback } = await locked(slug, (): { result: ChooseResult; rollback: Choice | null } => {
    // A held withdrawal is owed to the server even if a later choice (another visitor) now sits in storage.
    if (same(heldFor(slug), choice)) {
      if (status === 204) {
        dropHeld() // nothing stored to confirm; writing now could hit the full storage again
        emit()
        return { result: 'ok', rollback: null }
      }
      scheduleWithdrawRetry()
      return { result: 'failed', rollback: null }
    }
    if (!same(current(slug), choice)) return { result: 'superseded', rollback: null } // a later choice sends itself
    // Already confirmed (another tab, or a replay racing its own answer): a failed repeat must not undo it.
    if (status !== 204 && same(readChoice(keyConfirmed(slug)), choice)) return { result: 'ok', rollback: null }
    if (status === 204) {
      if (writeItem(keyConfirmed(slug), JSON.stringify(choice))) {
        emit()
        return { result: 'ok', rollback: null }
      }
      if (!choice.on) return { result: 'ok', rollback: null }
      // "on" that cannot be confirmed in storage must not measure: withdraw inside this lock (a nested request waits forever)
      return { result: 'failed', rollback: step(slug, v, false) }
    }
    // 503 or a network error can follow a successful RPC, so a failed "on" is withdrawn with a higher seq (B-20).
    if (choice.on) return { result: 'failed', rollback: step(slug, v, false) }
    // Withdrawal unconfirmed: `bevestigd` stays behind and measuring is already off.
    return { result: 'failed', rollback: null }
  })
  if (rollback) void drive({ slug, v, choice: rollback })
  return result
}

// Only for a withdrawal that is held in memory only: every 15 s while the page is open, and on pagehide.
function scheduleWithdrawRetry(): void {
  if (retryTimer) return
  const attempt = async (keepalive: boolean) => {
    const h = held
    if (!h) return dropHeld()
    const status = await post(choiceBody({ slug: h.slug, v: h.v, choice: h.choice }), keepalive)
    if (status === 204 && held === h) {
      dropHeld()
      emit()
    }
  }
  retryTimer = setInterval(() => void attempt(false), RETRY_MS)
  onHide = () => void attempt(true)
  window.addEventListener('pagehide', onHide)
}

export async function choose(slug: string, v: string, on: boolean): Promise<ChooseResult> {
  if (!supported()) return 'unsupported'
  const choice = await locked(slug, () => step(slug, v, on))
  if (!choice) return on ? 'unsupported' : 'ok'
  return drive({ slug, v, choice })
}

/** On every page load: a stored choice the server never confirmed goes out again with the same seq (B-19). */
export async function replay(slug: string, v: string): Promise<ChooseResult> {
  if (!supported()) return 'unsupported'
  const choice = await locked(slug, () => {
    const k = readChoice(keyChoice(slug))
    return k && !same(k, readChoice(keyConfirmed(slug))) ? k : null
  })
  return choice ? drive({ slug, v, choice }) : 'ok'
}

// --- events that need a confirmed "yes" --------------------------------------------------------

/** Sent only when `measuring` is non-null right now and the segment belongs to that very generation (B-38, B-44). */
export function trackWatch(slug: string, v: string, segment: Segment, opts: { keepalive?: boolean } = {}): void {
  const m = measuring(slug)
  if (!m || m.seq !== segment.seq) return
  const from = Math.max(0, Math.round(segment.from * 10) / 10)
  const to = Math.min(3600, Math.round(segment.to * 10) / 10)
  if (!(to > from) || to - from > 600) return
  writeItem(keyPos(slug), String(to))
  void post({ kind: 'watch', slug, v, visitor: m.visitor, seq: m.seq, from, to }, opts.keepalive)
}

export function trackCta(slug: string, v: string): void {
  const m = measuring(slug)
  if (!m) return
  void post({ kind: 'cta_click', slug, v, visitor: m.visitor, seq: m.seq }, true)
}

// --- drop-off: anonymous, once per visit, no slug and no id -------------------------------------

let dropoffSent = false

export function sendDropoff(v: string, maxSec: number): void {
  if (dropoffSent) return
  dropoffSent = true
  try {
    void fetch('/api/voor/afhaak', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ v, maxSec: Math.min(3600, Math.max(0, Math.round(maxSec))) }),
      keepalive: true,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    }).catch(() => undefined)
  } catch {
    // a beacon has nothing to recover
  }
}
