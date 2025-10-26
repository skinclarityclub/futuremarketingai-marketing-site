/**
 * Navigation Action Component
 *
 * Compact card that either:
 * - Opens info panel with details (when features exist)
 * - Navigates directly (when features array is empty)
 *
 * Best Practices:
 * - Accessible keyboard navigation
 * - Clear visual feedback
 * - Semantic HTML
 * - Type-safe props
 */

import { motion } from 'framer-motion'
import { ArrowRight, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface NavigationActionData {
  label: string
  route: string
  icon?: 'calculator' | 'explorer' | 'dashboard' | 'sparkles' | 'demo'
  helpText?: string
  features?: string[]
  ctaText?: string
  isDemoBooking?: boolean // Special flag for Calendly widget
}

interface NavigationActionProps {
  action: NavigationActionData
  onOpenInfo: () => void
}

const iconMap = {
  calculator: '🧮',
  explorer: '🧭',
  dashboard: '📊',
  sparkles: '✨',
  demo: '📅',
}

export default function NavigationAction({ action, onOpenInfo }: NavigationActionProps) {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()

  // Determine if this should be direct navigation (no info panel)
  // Demo booking always opens info panel
  const isDirectNavigation =
    !action.isDemoBooking && (!action.features || action.features.length === 0)

  const handleClick = () => {
    if (isDirectNavigation) {
      // Direct navigation - no info panel
      navigate(action.route)
    } else {
      // Open info panel
      onOpenInfo()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-3"
      role="region"
      aria-label={t('common:accessibility.navigation_suggestion')}
    >
      <div
        className="
        flex items-center gap-3
        p-4 rounded-xl
        bg-gradient-to-br from-blue-50 to-indigo-50
        from-blue-950/30 to-indigo-950/30
        border border-blue-900/50
        hover:shadow-md
        transition-all duration-200
      "
      >
        {/* Icon */}
        <div
          className="
            flex-shrink-0 w-12 h-12 rounded-xl
            bg-gradient-to-br from-blue-500 to-indigo-600
            flex items-center justify-center text-2xl
          "
          aria-hidden="true"
        >
          {action.icon ? iconMap[action.icon] : '📍'}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-100 mb-0.5">
            {action.label}
          </h4>
          <p className="text-xs text-gray-400">
            {action.isDemoBooking
              ? 'Klik om je demo in te plannen'
              : isDirectNavigation
                ? 'Klik om direct naar deze module te gaan'
                : 'Klik voor meer informatie en navigatie'}
          </p>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          type="button"
          className="
            flex-shrink-0 p-3 rounded-lg
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:from-blue-700 hover:to-indigo-700
            text-white
            shadow-md hover:shadow-lg
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-500/50
          "
          aria-label={
            isDirectNavigation ? `Ga naar ${action.label}` : `Open informatie over ${action.label}`
          }
        >
          {isDirectNavigation ? (
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Info className="w-5 h-5" aria-hidden="true" />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
