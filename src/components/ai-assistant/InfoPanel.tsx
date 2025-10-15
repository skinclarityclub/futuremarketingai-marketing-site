/**
 * Info Panel Component
 *
 * Inline sidebar that slides in within chat container
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Info, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { InlineWidget } from 'react-calendly'
import { useCalendlyBooking } from '../../hooks'
import { usePersonalizationStore } from '../../stores'
import type { NavigationActionData } from './NavigationAction'

interface InfoPanelProps {
  isOpen: boolean
  action: NavigationActionData | null
  onClose: () => void
  standalone?: boolean
}

const iconMap = {
  calculator: '🧮',
  explorer: '🧭',
  dashboard: '📊',
  sparkles: '✨',
  demo: '📅',
}

// All available modules for Platform Explorer
const ALL_MODULES = [
  {
    id: 'research-planning',
    name: 'Research & Planning',
    icon: '🧠',
    route: '/explorer#research-planning',
    description: 'AI-powered market research met Perplexity',
  },
  {
    id: 'manager-workflow',
    name: 'Manager Workflow',
    icon: '💼',
    route: '/explorer#manager-workflow',
    description: 'Centrale workflow coördinatie',
  },
  {
    id: 'content-pipeline',
    name: 'Content Pipeline',
    icon: '📝',
    route: '/explorer#content-pipeline',
    description: 'Snellere content productie',
  },
  {
    id: 'telegram-approval',
    name: 'Telegram Control',
    icon: '📱',
    route: '/explorer#telegram-approval',
    description: 'Mobiele goedkeuring on-the-go',
  },
  {
    id: 'publishing-layer',
    name: 'Publishing Layer',
    icon: '🚀',
    route: '/explorer#publishing-layer',
    description: 'Multi-channel distributie',
  },
  {
    id: 'analytics-monitoring',
    name: 'Analytics Lab',
    icon: '📊',
    route: '/explorer#analytics-monitoring',
    description: 'Real-time performance tracking',
  },
  {
    id: 'ad-builder',
    name: 'Ad Builder Studio',
    icon: '🎨',
    route: '/explorer#ad-builder',
    description: 'AI-gegenereerde advertenties',
  },
]

export default function InfoPanel({ isOpen, action, onClose, standalone }: InfoPanelProps) {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()
  const calendly = useCalendlyBooking()
  const { icpScore, selectedIndustry } = usePersonalizationStore()
  const isStandalone = standalone ?? false

  // Check if this is the Platform Explorer info panel
  const isExplorerOverview = action?.icon === 'explorer' || action?.icon === 'sparkles'

  // Check if this is a demo booking panel
  const isDemoBooking = action?.isDemoBooking === true

  const handleNavigate = (route?: string) => {
    const targetRoute = route || action?.route
    if (targetRoute) {
      navigate(targetRoute)
      onClose()
    }
  }

  if (!action) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300,
          }}
          className={`
            ${
              isStandalone
                ? 'fixed right-[656px] top-[10vh] w-[550px] h-[70vh] rounded-2xl shadow-2xl z-[45]'
                : 'h-full w-full'
            }
            bg-gradient-to-br from-blue-50 to-indigo-50 
            dark:from-gray-900 dark:to-blue-950/40
            ${isStandalone ? 'border-2' : 'border-r-2'} border-blue-200 dark:border-blue-900/50
            flex flex-col
            overflow-hidden
            backdrop-blur-xl
          `}
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between
              p-4 border-b border-gray-200 dark:border-gray-800
              shrink-0
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  w-12 h-12 rounded-xl
                  bg-gradient-to-br from-blue-500 to-indigo-600
                  flex items-center justify-center text-2xl
                "
              >
                {action.icon ? iconMap[action.icon] : '📍'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{action.label}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Demo Informatie</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="
                  p-2 rounded-lg
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-colors
                "
              aria-label={t('common:actions.close_panel')}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content - Optimized for no scrolling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* DEMO BOOKING SECTION */}
            {isDemoBooking ? (
              <div className="space-y-4">
                {/* Personalized Intro Message */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Calendar className="w-5 h-5" />
                    <h4 className="text-sm font-semibold">Boek je persoonlijke demo</h4>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-200 dark:border-purple-900/50">
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                      {icpScore && icpScore.overall >= 80
                        ? '⭐ Je profiel past perfect bij onze enterprise clients! Boek een uitgebreide strategische demo.'
                        : icpScore && icpScore.overall >= 60
                          ? '🎯 Geweldig dat je geïnteresseerd bent! Kies een tijdstip voor een platform demo.'
                          : '📊 Ontdek in 30 minuten hoe Future Marketing AI jouw workflow kan transformeren!'}
                    </p>

                    {selectedIndustry && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">
                        ✓ Demo specifiek voor {selectedIndustry.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* What you get - Compact */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-gray-900 dark:text-white">
                    Wat je krijgt in 30 minuten:
                  </h5>
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      { icon: '🎯', text: 'Platform tour toegespitst op jouw industry' },
                      { icon: '💬', text: 'Al je vragen beantwoord' },
                      { icon: '✅', text: 'Custom fit check voor jouw situatie' },
                      { icon: '💰', text: 'Potentiële ROI berekening' },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded-lg"
                        style={{ background: 'rgba(0, 0, 0, 0.2)' }}
                      >
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <p className="text-xs text-gray-700 dark:text-gray-300">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendly Widget - Full height */}
                <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                  <InlineWidget
                    url={calendly.calendlyUrl}
                    prefill={calendly.prefillData}
                    utm={calendly.utmParams}
                    styles={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Help Text - Compact */}
                {action.helpText && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Info className="w-4 h-4" />
                      <h4 className="text-xs font-semibold">
                        {isExplorerOverview ? 'Alle Modules' : 'Over deze module'}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                      {action.helpText}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* MODULE GRID: Show all modules if this is the Platform Explorer */}
            {isExplorerOverview ? (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                  Kies een module om te verkennen:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {ALL_MODULES.map((module) => (
                    <motion.button
                      key={module.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigate(module.route)}
                      className="
                          flex items-center gap-3
                          p-3 rounded-lg
                          bg-gradient-to-br from-blue-50 to-indigo-50
                          dark:from-blue-950/30 dark:to-indigo-950/30
                          border border-blue-200 dark:border-blue-900/50
                          hover:border-blue-400 dark:hover:border-blue-700
                          hover:shadow-md
                          transition-all duration-200
                          text-left
                        "
                    >
                      <div
                        className="
                          w-10 h-10 rounded-lg
                          bg-gradient-to-br from-blue-500 to-indigo-600
                          flex items-center justify-center text-xl
                          flex-shrink-0
                        "
                      >
                        {module.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-gray-900 dark:text-white">
                          {module.name}
                        </h5>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight">
                          {module.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* FEATURES LIST: Show features for specific modules */
              action.features &&
              action.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                    Wat je kunt doen:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {action.features.map((feature, index) => (
                      <div
                        key={index}
                        className="
                            flex items-start gap-2
                            p-2 rounded-lg
                            bg-blue-50 dark:bg-blue-950/30
                            border border-blue-100 dark:border-blue-900/50
                          "
                      >
                        <div
                          className="
                            w-5 h-5 rounded-full
                            bg-blue-500 flex items-center justify-center
                            flex-shrink-0
                          "
                        >
                          <span className="text-white text-[10px] font-bold">{index + 1}</span>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug pt-0.5">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {/* Compact Pro Tip */}
            <div
              className="
                p-3 rounded-lg
                bg-gradient-to-br from-amber-50 to-orange-50
                dark:from-amber-950/30 dark:to-orange-950/30
                border border-amber-200 dark:border-amber-900/50
              "
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
                  {isExplorerOverview
                    ? 'Klik op een module om de details en demo te bekijken!'
                    : 'Neem de tijd om te verkennen - chat staat altijd klaar voor vragen!'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer with CTA - Compact (only for non-explorer and non-demo views) */}
          {!isExplorerOverview && !isDemoBooking && (
            <div
              className="
                  p-4 border-t border-gray-200 dark:border-gray-800
                  bg-gray-50
                  shrink-0
                "
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigate()}
                className="
                    w-full flex items-center justify-center gap-2
                    px-4 py-3 rounded-xl
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    hover:from-blue-700 hover:to-indigo-700
                    text-white text-sm font-semibold
                    shadow-lg hover:shadow-xl
                    transition-all duration-200
                  "
              >
                <span>{action.ctaText || 'Ga naar module'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
