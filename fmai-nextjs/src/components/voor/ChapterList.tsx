'use client'

export type Chapter = { id: string; title: string; startSec: number }

export const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`

export function ChapterList({ chapters, onSeek }: { chapters: Chapter[]; onSeek: (sec: number) => void }) {
  return (
    <nav aria-label="Hoofdstukken">
      <h2 className="mb-3 text-lg font-semibold">
        Hoofdstukken <small className="ml-2 text-sm font-normal text-text-secondary">klik om erheen te springen</small>
      </h2>
      <ol className="divide-y divide-white/5 rounded-xl border border-border-primary bg-bg-surface">
        {chapters.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => onSeek(c.startSec)}
              className="flex w-full items-baseline gap-4 px-4 py-3 text-left hover:bg-bg-elevated"
            >
              <span className="w-12 shrink-0 font-mono text-sm text-accent-system">{mmss(c.startSec)}</span>
              <span>{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
