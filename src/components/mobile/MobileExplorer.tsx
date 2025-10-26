/**
 * MobileExplorer - Mobile-optimized Explorer page
 *
 * ✅ DESKTOP-FIRST COMPLIANT
 * - NEW mobile component, desktop Explorer unchanged
 * - Conditional rendering in Explorer page based on isMobile
 *
 * ✅ CONTENT PARITY COMPLIANT
 * - Uses EXACT same translation keys (explorer:features.*)
 * - Same feature data, mobile-optimized layout
 *
 * Mobile Optimizations:
 * - Vertical card layout (not grid)
 * - Static screenshots for visualizations
 * - "View Desktop Demo" CTA per feature
 * - Touch-friendly interactions
 * - Simplified animations
 * - Progressive disclosure pattern
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Brain,
  Crown,
  Palette,
  Send,
  BarChart3,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Monitor,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../common/Button'

interface Feature {
  id: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  title: string
  subtitle: string
  description: string
  roiMetric: string
  roiLabel: string
  painPoint: string
  capabilities: string[]
}

interface MobileExplorerProps {
  className?: string
}

// Feature icons mapped to IDs
const FEATURE_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'research-planning': { icon: Brain, color: 'from-blue-500 to-cyan-500' },
  'manager-workflow': { icon: Crown, color: 'from-purple-500 to-pink-500' },
  'content-pipeline': { icon: Palette, color: 'from-pink-500 to-rose-500' },
  'publishing-layer': { icon: Send, color: 'from-green-500 to-emerald-500' },
  'analytics-monitoring': { icon: BarChart3, color: 'from-cyan-500 to-blue-500' },
  'ad-builder': { icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
}

export function MobileExplorer({ className = '' }: MobileExplorerProps) {
  const { t } = useTranslation(['explorer', 'common'])
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  // Load features from translations (EXACT same keys as desktop)
  const features: Feature[] = [
    'research-planning',
    'manager-workflow',
    'content-pipeline',
    'publishing-layer',
    'analytics-monitoring',
    'ad-builder',
  ].map((id) => ({
    id,
    icon: FEATURE_ICONS[id].icon,
    color: FEATURE_ICONS[id].color,
    title: t(`explorer:features.${id.replace(/-/g, '_')}.title`),
    subtitle: t(`explorer:features.${id.replace(/-/g, '_')}.subtitle`),
    description: t(`explorer:features.${id.replace(/-/g, '_')}.description`),
    roiMetric: t(`explorer:features.${id.replace(/-/g, '_')}.roi_metric`),
    roiLabel: t(`explorer:features.${id.replace(/-/g, '_')}.roi_label`),
    painPoint: t(`explorer:features.${id.replace(/-/g, '_')}.pain_point`),
    capabilities: t(`explorer:features.${id.replace(/-/g, '_')}.modal.capabilities`, {
      returnObjects: true,
    }) as string[],
  }))

  const handleViewDesktop = (featureId: string) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_desktop_demo_click', {
        event_category: 'engagement',
        event_label: `mobile_explorer_${featureId}`,
        value: 1,
      })
    }

    // Open desktop version with specific feature hash
    const desktopUrl = `/explorer?desktop=true#${featureId}`
    window.open(desktopUrl, '_blank')
  }

  const toggleExpand = (featureId: string) => {
    setExpandedFeature(expandedFeature === featureId ? null : featureId)

    // Track expand analytics
    if (typeof window !== 'undefined' && window.gtag && expandedFeature !== featureId) {
      window.gtag('event', 'feature_expand', {
        event_category: 'engagement',
        event_label: `mobile_explorer_${featureId}`,
        value: 1,
      })
    }
  }

  return (
    <section
      className={`relative min-h-screen flex flex-col px-6 py-12 pb-32 ${className}`}
      aria-label="AI Features Explorer"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary -z-10" />

      {/* Header */}
      <div className="mb-8">
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-3 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('explorer:title', 'Explore AI Modules')}
        </motion.h1>
        <motion.p
          className="text-base text-text-secondary leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('explorer:subtitle', 'Interactive demonstrations of our autonomous AI marketing system')}
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="flex flex-col gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isExpanded = expandedFeature === feature.id

          return (
            <motion.div
              key={feature.id}
              className="relative overflow-hidden bg-bg-card border border-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5`}
                aria-hidden="true"
              />

              {/* Header - Always visible */}
              <button
                onClick={() => toggleExpand(feature.id)}
                className="relative w-full p-6 text-left touch-manipulation"
                aria-expanded={isExpanded}
                aria-controls={`feature-${feature.id}-content`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">{feature.title}</h3>
                    <p className="text-sm text-text-secondary line-clamp-2">{feature.subtitle}</p>

                    {/* ROI Metric Badge */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-success/10 border border-accent-success/30">
                      <TrendingUp className="w-4 h-4 text-accent-success" aria-hidden="true" />
                      <span className="text-sm font-semibold text-accent-success">{feature.roiMetric}</span>
                      <span className="text-xs text-text-muted">{feature.roiLabel}</span>
                    </div>
                  </div>

                  {/* Expand/Collapse Icon */}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0 mt-1" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0 mt-1" aria-hidden="true" />
                  )}
                </div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`feature-${feature.id}-content`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden border-t border-white/10"
                  >
                    <div className="p-6 pt-4 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>

                      {/* Pain Point */}
                      <div className="p-4 rounded-lg bg-accent-warning/5 border border-accent-warning/20">
                        <p className="text-sm text-accent-warning font-medium mb-1">
                          {t('common:labels.pain_point', 'Pain Point')}
                        </p>
                        <p className="text-sm text-text-secondary">{feature.painPoint}</p>
                      </div>

                      {/* Capabilities */}
                      <div>
                        <p className="text-sm font-semibold text-text-primary mb-2">
                          {t('common:labels.key_capabilities', 'Key Capabilities')}
                        </p>
                        <ul className="space-y-2">
                          {feature.capabilities.slice(0, 4).map((capability, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                              <CheckCircle2
                                className="w-4 h-4 text-accent-success flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span>{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Desktop Demo Badge */}
                      <div className="pt-2 pb-1">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-400/30">
                          <Monitor className="w-4 h-4 text-blue-400" aria-hidden="true" />
                          <p className="text-xs text-blue-300">
                            {t(
                              'common:mobile.desktop_only',
                              'Full interactive demo available on desktop'
                            )}
                          </p>
                        </div>
                      </div>

                      {/* View Desktop Demo CTA */}
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleViewDesktop(feature.id)}
                        className="w-full h-12 min-h-touch border-accent-primary text-accent-primary hover:bg-accent-primary/10 touch-manipulation"
                        ariaLabel={`View ${feature.title} interactive demo on desktop`}
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        <span>{t('common:actions.view_interactive', 'View Interactive Demo')}</span>
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom CTA - Book Demo */}
      <motion.div
        className="mt-8 p-6 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-white mb-2 text-center">
          {t('explorer:cta.title', 'Ready to see it in action?')}
        </h3>
        <p className="text-sm text-blue-100 mb-4 text-center">
          {t('explorer:cta.subtitle', 'Book a personalized demo to see how AI can transform your marketing')}
        </p>
        <Button
          variant="cta"
          size="lg"
          onClick={() => {
            // Navigate to booking
            window.location.href = '/#book-demo'
          }}
          className="w-full h-14 font-bold touch-manipulation"
          glow
          ariaLabel="Book a personalized demo"
        >
          <span>{t('common:cta.book_demo', 'Book Demo')}</span>
        </Button>
      </motion.div>
    </section>
  )
}

MobileExplorer.displayName = 'MobileExplorer'

