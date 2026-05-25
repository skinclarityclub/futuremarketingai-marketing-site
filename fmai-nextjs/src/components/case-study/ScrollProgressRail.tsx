'use client'

import { useEffect, useState } from 'react'

interface RailChapter {
  id: string
  label: string
  /** Visible chapter number prefix (e.g. "01"). */
  index: string
}

interface ScrollProgressRailProps {
  title: string
  chapters: readonly RailChapter[]
}

/**
 * Desktop-only sticky chapter rail for the case-study narrative.
 *
 * Tracks the most-visible ChapterSection via IntersectionObserver and computes
 * an overall progress percentage based on the active chapter's index, then
 * animates a vertical progress-line accordingly. Hidden below `lg` — mobile
 * relies on the in-flow chapter badges rendered by ChapterSection itself.
 */
export function ScrollProgressRail({ title, chapters }: ScrollProgressRailProps) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '')

  useEffect(() => {
    if (chapters.length === 0) return
    const elements = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [chapters])

  if (chapters.length === 0) return null

  const activeIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeId)
  )
  const progress = ((activeIndex + 1) / chapters.length) * 100

  return (
    <nav
      aria-label={title}
      className="hidden lg:block sticky top-32 self-start w-52 shrink-0"
    >
      <p className="font-mono uppercase tracking-[0.22em] text-[10px] text-text-muted mb-4">
        {title}
      </p>
      <div className="relative pl-5">
        <div className="absolute left-0 top-1 bottom-1 w-px bg-border-primary" aria-hidden />
        <div
          className="absolute left-0 top-1 w-px bg-accent-system transition-[height] duration-500 ease-out"
          style={{ height: `calc(${progress}% - 0.25rem)` }}
          aria-hidden
        />
        <ul className="space-y-4">
          {chapters.map(({ id, label, index }) => {
            const isActive = activeId === id
            return (
              <li key={id} className="relative">
                <span
                  aria-hidden
                  className={
                    'absolute -left-[1.45rem] top-[0.45rem] block h-1.5 w-1.5 rounded-full transition-colors ' +
                    (isActive
                      ? 'bg-accent-system shadow-[0_0_0_4px_rgba(0,212,170,0.12)]'
                      : 'bg-text-muted/40')
                  }
                />
                <a
                  href={`#${id}`}
                  className={
                    'flex items-baseline gap-2 text-sm transition-colors ' +
                    (isActive
                      ? 'text-accent-system'
                      : 'text-text-muted hover:text-text-secondary')
                  }
                >
                  <span className="font-mono text-[10px] tracking-[0.22em]">{index}</span>
                  <span className={isActive ? 'font-medium' : ''}>{label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
