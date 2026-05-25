import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { EyebrowLabel } from './EyebrowLabel'

interface SectionShellProps {
  eyebrow?: ReactNode
  heading?: ReactNode
  intro?: ReactNode
  children?: ReactNode
  id?: string
  ariaLabelledBy?: string
  /** Outer <section> classes. */
  className?: string
  /** Inner constraint container classes (default max-w-7xl mx-auto). */
  containerClassName?: string
  /** Header (eyebrow + heading + intro) classes. */
  headerClassName?: string
  /** Heading element tag. */
  headingAs?: 'h1' | 'h2' | 'h3'
  /** Heading classes. */
  headingClassName?: string
  /** Intro paragraph classes. */
  introClassName?: string
  /** Align section header content. */
  align?: 'left' | 'center'
}

/**
 * SectionShell — standardized section frame with eyebrow + heading + intro slots.
 * Site-wide primitive (Fase 0). Use for every major content section to keep
 * cadence consistent: eyebrow anchors the topic, heading carries the message,
 * intro fills the body, children render the actual content.
 */
export function SectionShell({
  eyebrow,
  heading,
  intro,
  children,
  id,
  ariaLabelledBy,
  className,
  containerClassName,
  headerClassName,
  headingAs: HeadingTag = 'h2',
  headingClassName,
  introClassName,
  align = 'center',
}: SectionShellProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  const headingId = id ? `${id}-heading` : undefined

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy ?? headingId}
      className={twMerge('py-16 px-6 lg:px-12', className)}
    >
      <div className={twMerge('max-w-7xl mx-auto', containerClassName)}>
        {(eyebrow || heading || intro) && (
          <div
            className={twMerge(
              'mb-12 max-w-3xl space-y-4',
              alignment,
              headerClassName
            )}
          >
            {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
            {heading && (
              <HeadingTag
                id={headingId}
                className={twMerge(
                  'font-display font-bold text-text-primary text-3xl md:text-4xl lg:text-5xl leading-tight',
                  headingClassName
                )}
              >
                {heading}
              </HeadingTag>
            )}
            {intro && (
              <p
                className={twMerge(
                  'text-text-secondary text-lg leading-relaxed',
                  introClassName
                )}
              >
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
