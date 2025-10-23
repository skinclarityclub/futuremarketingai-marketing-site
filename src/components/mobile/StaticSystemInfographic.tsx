/**
 * StaticSystemInfographic Component
 *
 * Lightweight static infographic for mobile devices
 * Replaces the heavy 3D SystemDiagram with an optimized image
 *
 * Features:
 * - Optimized WebP image (<100KB)
 * - Responsive sizing
 * - Optional "View Interactive" CTA
 * - Loading placeholder
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

interface StaticSystemInfographicProps {
  /** Show "View on Desktop" button */
  showDesktopCTA?: boolean
  /** Custom image source (defaults to system-diagram-static.webp) */
  imageSrc?: string
  /** Alt text for image */
  alt?: string
  /** Analytics callback when desktop CTA is clicked */
  onDesktopCTAClick?: () => void
  /** Use placeholder when image fails to load */
  usePlaceholder?: boolean
}

export const StaticSystemInfographic: React.FC<StaticSystemInfographicProps> = ({
  showDesktopCTA = true,
  imageSrc = '/assets/system-diagram-static.webp',
  alt = 'FutureMarketingAI System Architecture',
  onDesktopCTAClick,
}) => {
  const { t } = useTranslation(['common'])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleDesktopClick = () => {
    // Fire analytics event
    if (onDesktopCTAClick) {
      onDesktopCTAClick()
    }

    // Track with gtag
    if (window.gtag) {
      window.gtag('event', 'view_desktop_visualization', {
        event_category: 'mobile_optimization',
        event_label: 'System Diagram',
      })
    }

    // Copy current URL to clipboard for easy desktop access
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          alert(t('common:url_copied', 'URL copied! Open on desktop for interactive experience.'))
        })
        .catch(() => {
          // Fallback: just show the message
          alert(
            t(
              'common:view_desktop_hint',
              'Open this page on a desktop computer for the full interactive 3D experience.'
            )
          )
        })
    } else {
      alert(
        t(
          'common:view_desktop_hint',
          'Open this page on a desktop computer for the full interactive 3D experience.'
        )
      )
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Image Container */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900/50 border border-white/10">
        {/* Loading Placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {imageError && (
          <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
            <Monitor className="h-16 w-16 text-slate-600 mb-4" />
            <p className="text-slate-400 mb-2">
              {t('common:visualization_unavailable', 'Visualization unavailable')}
            </p>
            <p className="text-sm text-slate-500">
              {t('common:view_desktop_hint', 'View on desktop for interactive experience')}
            </p>
          </div>
        )}

        {/* Static Image */}
        <motion.img
          src={imageSrc}
          alt={alt}
          className={`w-full h-auto transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true)
            setImageLoaded(true)
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: imageLoaded ? 1 : 0,
            scale: imageLoaded ? 1 : 0.95,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Badge Overlay */}
        {imageLoaded && !imageError && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-xs font-medium text-slate-300">
              {t('common:static_view', 'Static View')}
            </span>
          </div>
        )}
      </div>

      {/* Desktop CTA */}
      {showDesktopCTA && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={handleDesktopClick}
            className="w-full max-w-sm mx-auto h-14 border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 touch-manipulation"
          >
            <Monitor className="mr-2 h-5 w-5" aria-hidden="true" />
            {t('common:view_interactive', 'View Interactive on Desktop')}
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <p className="mt-3 text-sm text-slate-400">
            {t(
              'common:interactive_hint',
              'Experience the full 3D interactive visualization on a larger screen'
            )}
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default StaticSystemInfographic
