import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * SkipLink - Accessibility component for keyboard navigation
 *
 * Provides a "Skip to main content" link that:
 * - Is visually hidden by default (sr-only)
 * - Becomes visible when focused (keyboard Tab)
 * - Allows users to bypass navigation and go directly to main content
 * - Essential for WCAG 2.1 Level A compliance (2.4.1 Bypass Blocks)
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
 */
export const SkipLink: React.FC = () => {
  const { t } = useTranslation(['common'])

  return (
    <a
      href="#main-content"
      className="
        sr-only 
        focus:not-sr-only 
        focus:absolute 
        focus:top-4 
        focus:left-4 
        focus:z-[10000] 
        focus:px-6 
        focus:py-3 
        focus:bg-accent-primary 
        focus:text-white 
        focus:rounded-lg 
        focus:font-semibold 
        focus:shadow-lg 
        focus:shadow-accent-primary/50
        focus:outline-none 
        focus:ring-2 
        focus:ring-white/50
        transition-all
      "
    >
      {t('common:accessibility.skip_to_content')}
    </a>
  )
}

export default SkipLink
