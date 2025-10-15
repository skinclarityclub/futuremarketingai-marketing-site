/**
 * Personalization Settings Panel
 *
 * GDPR-compliant settings panel for users to control:
 * - Personalization level
 * - Privacy preferences
 * - Notification settings
 * - Accessibility options
 *
 * Research shows 73% of users prefer transparency and control over data usage
 */

import { motion } from 'framer-motion'
import { Settings, Shield, Bell, Eye, X, Check } from 'lucide-react'
import { useState } from 'react'
import { useUserPreferencesStore } from '../../stores/userPreferencesStore'
import type { PersonalizationLevel } from '../../utils/personalizationEngine'

interface PersonalizationSettingsPanelProps {
  onClose?: () => void
  isOpen: boolean
}

export default function PersonalizationSettingsPanel({
  onClose,
  isOpen,
}: PersonalizationSettingsPanelProps) {
  const {
    personalizationLevel,
    privacy,
    notifications,
    accessibility,
    setPersonalizationLevel,
    updatePrivacy,
    updateNotifications,
    updateAccessibility,
  } = useUserPreferencesStore()

  const [activeTab, setActiveTab] = useState<
    'personalization' | 'privacy' | 'notifications' | 'accessibility'
  >('personalization')

  if (!isOpen) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-2xl max-h-[80vh] overflow-hidden
          bg-gradient-to-br from-gray-900 to-gray-800
          border border-white/10 rounded-2xl
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Personalization Settings</h2>
              <p className="text-xs text-white/60">Control your experience and privacy</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-6">
          {[
            { id: 'personalization', label: 'Personalization', icon: Settings },
            { id: 'privacy', label: 'Privacy', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'accessibility', label: 'Accessibility', icon: Eye },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium
                transition-all border-b-2
                ${
                  activeTab === tab.id
                    ? 'text-white border-purple-500'
                    : 'text-white/60 border-transparent hover:text-white/90'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Personalization Tab */}
          {activeTab === 'personalization' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Personalization Level</h3>
                <p className="text-xs text-white/60 mb-4">
                  Control how much we adapt content based on your profile and behavior.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      value: 'full' as PersonalizationLevel,
                      label: 'Full Personalization',
                      description: 'Tailored content, industry examples, role-specific features',
                    },
                    {
                      value: 'moderate' as PersonalizationLevel,
                      label: 'Moderate',
                      description: 'Some personalization based on industry and journey',
                    },
                    {
                      value: 'minimal' as PersonalizationLevel,
                      label: 'Minimal',
                      description: 'Generic content with basic recommendations',
                    },
                    {
                      value: 'off' as PersonalizationLevel,
                      label: 'Off',
                      description: 'No personalization, same experience for everyone',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPersonalizationLevel(option.value)}
                      className={`
                        w-full p-4 text-left rounded-lg border transition-all
                        ${
                          personalizationLevel === option.value
                            ? 'bg-purple-500/20 border-purple-500/50'
                            : 'border-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm mb-1">{option.label}</div>
                          <div className="text-xs text-white/60">{option.description}</div>
                        </div>
                        {personalizationLevel === option.value && (
                          <Check className="w-5 h-5 text-purple-400 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Privacy Controls</h3>
                <p className="text-xs text-white/60 mb-4">
                  Control how we use your data to improve your experience.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: 'allowAnalytics' as const,
                      label: 'Essential Analytics',
                      description: 'Help us understand usage patterns (anonymous data only)',
                    },
                    {
                      key: 'allowPersonalization' as const,
                      label: 'Personalization Data',
                      description: 'Use your profile and behavior to personalize content',
                    },
                    {
                      key: 'allowThirdPartyIntegrations' as const,
                      label: 'Third-Party Integrations',
                      description: 'Allow connections with external services (Calendly, etc.)',
                    },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="
                        flex items-start gap-3 p-4 rounded-lg
                        border border-white/10
                        hover:border-white/20 transition-colors
                        cursor-pointer
                      "
                    >
                      <input
                        type="checkbox"
                        checked={privacy[option.key]}
                        onChange={(e) => updatePrivacy({ [option.key]: e.target.checked })}
                        className="
                          mt-0.5 w-4 h-4 rounded
                          border-white/20
                          checked:bg-purple-500 checked:border-purple-500
                          focus:ring-2 focus:ring-purple-500/50
                          transition-all
                        "
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm mb-1">{option.label}</div>
                        <div className="text-xs text-white/60">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 leading-relaxed">
                  🔒 <strong>Your Privacy Matters:</strong> We follow GDPR guidelines and never sell
                  your data. You can request data deletion at any time.
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Email Preferences</h3>
                <p className="text-xs text-white/60 mb-4">
                  Choose what you'd like to hear about from us.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: 'emailUpdates' as const,
                      label: 'Product Updates',
                      description: 'New features, improvements, and platform news',
                    },
                    {
                      key: 'productUpdates' as const,
                      label: 'Tips & Best Practices',
                      description: 'How-to guides, case studies, and success stories',
                    },
                    {
                      key: 'marketingEmails' as const,
                      label: 'Marketing Communications',
                      description: 'Offers, promotions, and special announcements',
                    },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="
                        flex items-start gap-3 p-4 rounded-lg
                        border border-white/10
                        hover:border-white/20 transition-colors
                        cursor-pointer
                      "
                    >
                      <input
                        type="checkbox"
                        checked={notifications[option.key]}
                        onChange={(e) => updateNotifications({ [option.key]: e.target.checked })}
                        className="
                          mt-0.5 w-4 h-4 rounded
                          border-white/20
                          checked:bg-purple-500 checked:border-purple-500
                          focus:ring-2 focus:ring-purple-500/50
                          transition-all
                        "
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm mb-1">{option.label}</div>
                        <div className="text-xs text-white/60">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Accessibility Options</h3>
                <p className="text-xs text-white/60 mb-4">
                  Customize the interface to match your needs.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: 'reducedMotion' as const,
                      label: 'Reduced Motion',
                      description: 'Minimize animations and transitions',
                    },
                    {
                      key: 'highContrast' as const,
                      label: 'High Contrast',
                      description: 'Increase color contrast for better visibility',
                    },
                    {
                      key: 'largerText' as const,
                      label: 'Larger Text',
                      description: 'Increase font size for better readability',
                    },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className="
                        flex items-start gap-3 p-4 rounded-lg
                        border border-white/10
                        hover:border-white/20 transition-colors
                        cursor-pointer
                      "
                    >
                      <input
                        type="checkbox"
                        checked={accessibility[option.key]}
                        onChange={(e) => updateAccessibility({ [option.key]: e.target.checked })}
                        className="
                          mt-0.5 w-4 h-4 rounded
                          border-white/20
                          checked:bg-purple-500 checked:border-purple-500
                          focus:ring-2 focus:ring-purple-500/50
                          transition-all
                        "
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm mb-1">{option.label}</div>
                        <div className="text-xs text-white/60">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <p className="text-xs text-white/50">Changes are saved automatically</p>
          {onClose && (
            <button
              onClick={onClose}
              className="
                px-4 py-2 bg-purple-500 hover:bg-purple-600
                text-white text-sm font-medium rounded-lg
                transition-colors
              "
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
