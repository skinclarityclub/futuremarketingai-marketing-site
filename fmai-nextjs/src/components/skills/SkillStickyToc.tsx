'use client'

import { useEffect, useState } from 'react'

interface TocSection {
  id: string
  label: string
}

interface SkillStickyTocProps {
  title: string
  sections: readonly TocSection[]
}

/**
 * Desktop-only sticky table-of-contents rail for skill detail pages.
 * Tracks the most-visible section via IntersectionObserver and highlights it.
 * Hidden under `lg` breakpoint (mobile gets the natural document flow).
 */
export function SkillStickyToc({ title, sections }: SkillStickyTocProps) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '')

  useEffect(() => {
    if (sections.length === 0) return
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible (highest intersectionRatio) intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  if (sections.length === 0) return null

  return (
    <nav
      aria-label={title}
      className="hidden lg:block sticky top-32 self-start w-44 shrink-0"
    >
      <p className="font-mono uppercase tracking-[0.18em] text-[10px] text-text-muted mb-3">
        {title}
      </p>
      <ul className="space-y-2 border-l border-border-primary pl-3">
        {sections.map(({ id, label }) => {
          const isActive = active === id
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={
                  'block text-sm transition-colors ' +
                  (isActive
                    ? 'text-accent-system font-medium'
                    : 'text-text-muted hover:text-text-secondary')
                }
              >
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
