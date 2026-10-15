'use client'

import { useEffect, useState } from 'react'
import { choose, isOn, onChange, replay, supported } from '@/lib/voor-tracking'

const NO_SUPPORT = 'Meten per persoon kan in deze browser niet.'
const FAILED = 'Dat lukte niet, probeer het zo nog eens.'

export function ConsentLine({ slug, v }: { slug: string; v: string }) {
  const [ok, setOk] = useState(true) // optimistic for SSR; corrected on mount
  const [on, setOn] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // Browser-only capability (Web Locks, storage): unknown during SSR, so it is read after mount.
    const can = supported()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(can)
    if (!can) return
    const sync = () => setOn(isOn(slug))
    sync()
    const wasOn = isOn(slug)
    // A replayed "on" the server refused is rolled back inside replay: say so, like a refused click.
    replay(slug, v)
      .then((res) => {
        if (res === 'failed' && wasOn && !isOn(slug)) setMsg(FAILED)
      })
      .catch(() => undefined)
    return onChange(slug, sync)
  }, [slug, v])

  async function toggle() {
    setMsg(null)
    setBusy(true)
    try {
      const res = await choose(slug, v, !on)
      if (res === 'unsupported') setMsg(NO_SUPPORT)
      else if (res === 'failed' && !on) setMsg(FAILED)
    } catch {
      setMsg(FAILED) // locks.request can reject; the switch must never stay busy
    } finally {
      setBusy(false)
      setOn(isOn(slug))
    }
  }

  return (
    <section aria-labelledby="voor-consent" className="rounded-xl border border-border-primary bg-bg-surface p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby="voor-consent"
          disabled={!ok || busy}
          onClick={toggle}
          className={`relative mt-1 h-7 w-12 shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            on ? 'border-accent-system bg-accent-system/30' : 'border-white/20 bg-bg-elevated'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-text-primary transition-all ${on ? 'left-6' : 'left-0.5'}`}
          />
        </button>
        <div>
          <p id="voor-consent" className="font-medium text-text-primary">
            Mag ik zien welke stukken je bekeek? Dan bereid ik ons gesprek daarop voor. Je kunt de video ook gewoon zo kijken.
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Zonder dit zie ik alleen of deze pagina geopend is en of je een gesprek plant. Liever niet? Antwoord NEE op mijn
            mail, dan wis ik deze pagina en wat ze bijhield, en mail ik je niet meer.{' '}
            {/* Full navigation on purpose: /voor has its own root layout, the legal page another. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/nl/legal/privacy#voor" className="text-accent-system underline underline-offset-2">
              Privacyverklaring
            </a>
          </p>
          {!ok && <p className="mt-2 text-sm text-warning">{NO_SUPPORT}</p>}
          {msg && (
            <p role="status" className="mt-2 text-sm text-warning">
              {msg}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
