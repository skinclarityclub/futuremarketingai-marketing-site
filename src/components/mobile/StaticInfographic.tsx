/**
 * StaticInfographic - Mobile-optimized static visualization replacement
 *
 * Desktop-first compliant: This is a NEW mobile-only component.
 * Replaces heavy 3D/interactive visualizations with lightweight static infographics.
 *
 * Requirements:
 * - Optimized static image (WebP/SVG, <100KB)
 * - "View Interactive" button linking to desktop
 * - Clear, accessible alternative
 * - Analytics tracking
 */

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, ExternalLink } from 'lucide-react'

interface StaticInfographicProps {
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
  onViewInteractive?: () => void
}

/**
 * Static infographic component for mobile
 * Replaces complex 3D/interactive visualizations
 */
export function StaticInfographic({
  title,
  description,
  imageSrc = '/images/system-diagram-static.svg',
  imageAlt = 'System Architecture Diagram',
  className = '',
  onViewInteractive,
}: StaticInfographicProps) {
  const { t } = useTranslation()

  const handleViewInteractive = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_interactive_click', {
        event_category: 'engagement',
        event_label: 'mobile_view_desktop_version',
        value: 1,
      })
    }

    if (onViewInteractive) {
      onViewInteractive()
    } else {
      // Default: Open in new tab with desktop viewport hint
      const url = new URL(window.location.href)
      url.searchParams.set('desktop', 'true')
      window.open(url.toString(), '_blank')
    }
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Title & Description */}
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>}
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
      )}

      {/* Static Image */}
      <div className="relative rounded-xl overflow-hidden bg-bg-card border border-white/10 mb-4">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto"
          loading="lazy"
          width="800"
          height="600"
        />

        {/* Desktop Badge Overlay */}
        <div className="absolute top-3 right-3 bg-bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10 flex items-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-accent-primary" />
          <span className="text-xs text-text-secondary">
            {t('mobile.viz.desktopOnly', 'Desktop only')}
          </span>
        </div>
      </div>

      {/* View Interactive Button */}
      <motion.button
        onClick={handleViewInteractive}
        className="
          w-full h-12 min-h-touch
          bg-bg-card border border-accent-primary/50
          hover:bg-accent-primary/10 hover:border-accent-primary
          active:scale-[0.98]
          text-accent-primary font-medium rounded-lg
          flex items-center justify-center gap-2
          transition-all duration-200
          touch-manipulation
        "
        whileTap={{ scale: 0.98 }}
        aria-label={t('mobile.viz.viewInteractive', 'View Interactive Version')}
        type="button"
      >
        <Monitor className="w-4 h-4" />
        <span>{t('mobile.viz.viewInteractive', 'View Interactive Version')}</span>
        <ExternalLink className="w-4 h-4" />
      </motion.button>

      {/* Helper Text */}
      <p className="mt-3 text-xs text-text-muted text-center">
        {t('mobile.viz.hint', 'Full interactive experience available on desktop browsers')}
      </p>
    </div>
  )
}

StaticInfographic.displayName = 'StaticInfographic'
