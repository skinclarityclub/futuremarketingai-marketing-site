import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

interface ChapterSectionProps {
  /** Chapter index for the side-rail and on-page badge (e.g. "01"). */
  index: string
  /** Total chapters, displayed alongside the index (e.g. "05"). */
  total: string
  /** Anchor + id used by ScrollProgressRail for IntersectionObserver tracking. */
  id: string
  eyebrow?: ReactNode
  title?: ReactNode
  intro?: ReactNode
  children?: ReactNode
  className?: string
  /** Toggle a soft elevated background to separate adjacent chapters. */
  bgVariant?: 'default' | 'surface'
  /** Optional reading-rail label (mirrors the rail copy on small screens). */
  railLabel?: ReactNode
}

/**
 * ChapterSection — case-study narrative container.
 *
 * Each chapter renders a sticky chapter-number badge that anchors the reader
 * inside the journey while scrolling. Designed to pair with ScrollProgressRail
 * (desktop) and operates as a normal `<section>` on mobile. Server component
 * to keep the bundle minimal; reveal motion happens inside children.
 */
export function ChapterSection({
  index,
  total,
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  bgVariant = 'default',
  railLabel,
}: ChapterSectionProps) {
  const bg = bgVariant === 'surface' ? 'bg-bg-surface/30' : ''

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={twMerge('relative py-20 px-6 lg:px-12 scroll-mt-32', bg, className)}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent-system bg-accent-system/10 border border-accent-system/30 rounded-full px-3 py-1"
            >
              {index} / {total}
            </span>
            {railLabel && (
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-text-muted lg:hidden">
                {railLabel}
              </span>
            )}
          </div>
          {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
          {title && (
            <h2
              id={`${id}-heading`}
              className="font-display font-bold text-text-primary text-3xl md:text-4xl lg:text-5xl leading-tight"
            >
              {title}
            </h2>
          )}
          {intro && (
            <p className="text-text-secondary text-lg leading-relaxed max-w-3xl">
              {intro}
            </p>
          )}
        </div>
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  )
}
