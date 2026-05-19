import type { ReactNode } from 'react'

interface LabelProps {
  /** id of the associated input/select/textarea. */
  htmlFor: string
  children: ReactNode
  /**
   * Marks the field as required. Renders a visible `*` in the error
   * colour and instructs callers to mirror with `aria-required` on the
   * input. Defaults to false (optional field).
   */
  required?: boolean
  /**
   * When true, suffixes "(optional)" in muted style. Use on
   * intentionally-optional fields where extra clarity helps conversion.
   */
  showOptional?: boolean
  /** Optional className override. */
  className?: string
  /** Optional i18n string for the "(optional)" suffix. Required when showOptional=true. */
  optionalLabel?: string
}

/**
 * Label — form field label with WCAG 3.3.2 required-marker support.
 *
 * Pattern: `<Label htmlFor="email" required>{t('emailLabel')}</Label>`
 * pairs with `<input id="email" aria-required="true" />` on the input.
 * The visible asterisk is decorative (aria-hidden); screen readers get
 * the requirement signal via the input's aria-required attribute.
 *
 * Why this lives in a component instead of inlined per form:
 *  - guarantees the same red `*` colour and spacing across forms
 *  - makes `grep -rn "aria-required" Label.tsx` a meaningful audit signal
 *  - one place to swap rendering if WCAG guidance shifts (e.g. text
 *    "(required)" instead of asterisk)
 */
export function Label({
  htmlFor,
  children,
  required = false,
  showOptional = false,
  className,
  optionalLabel,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={
        className ?? 'block text-sm font-medium text-text-secondary mb-1'
      }
      // Markup parity hint: the matching <input id={htmlFor} aria-required={required}>
      // is the screen-reader signal. The visible asterisk below is decorative.
      data-aria-required={required ? 'true' : 'false'}
    >
      {children}
      {required && (
        <>
          {' '}
          <span aria-hidden="true" className="text-[#FF4D4D]">
            *
          </span>
        </>
      )}
      {showOptional && optionalLabel && (
        <>
          {' '}
          <span className="text-text-muted text-xs">{optionalLabel}</span>
        </>
      )}
    </label>
  )
}
