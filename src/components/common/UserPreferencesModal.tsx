import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { Button } from './Button'
import { usePersonalizationStore } from '../../stores'
import type { UserProfile } from '../../stores/personalizationStore'
import { usePersonalization } from '../../hooks'
import { hotjarEvent, HotjarEvents } from '../../utils/hotjar'

/**
 * UserPreferencesModal - Edit user preferences
 *
 * Features:
 * - Company size (dropdown)
 * - Role (dropdown)
 * - Budget range (slider)
 * - Pain points (multi-select chips)
 * - Form validation
 * - Save/Cancel buttons
 * - Accessible design
 *
 * Usage:
 * ```tsx
 * <UserPreferencesModal isOpen={isOpen} onClose={handleClose} />
 * ```
 */

interface UserPreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['common'])
  const { userProfile } = usePersonalizationStore()
  const { updateProfile } = usePersonalization()

  // Load pain points from translations
  const PAIN_POINTS = useMemo(
    () => t('common:preferences.pain_points', { returnObjects: true }) as string[],
    [t]
  )

  // Local form state
  const [companySize, setCompanySize] = useState<UserProfile['companySize']>(
    userProfile.companySize
  )
  const [role, setRole] = useState<UserProfile['role']>(userProfile.role)
  const [budget, setBudget] = useState<UserProfile['budget']>(userProfile.budget)
  const [painPoints, setPainPoints] = useState<string[]>(userProfile.painPoints || [])
  const [showSuccess, setShowSuccess] = useState(false)

  // Sync with store when modal opens
  useEffect(() => {
    if (isOpen) {
      setCompanySize(userProfile.companySize)
      setRole(userProfile.role)
      setBudget(userProfile.budget)
      setPainPoints(userProfile.painPoints || [])
      setShowSuccess(false)
    }
  }, [isOpen, userProfile])

  const handlePainPointToggle = (point: string) => {
    if (painPoints.includes(point)) {
      setPainPoints(painPoints.filter((p) => p !== point))
    } else {
      setPainPoints([...painPoints, point])
    }
  }

  const handleSave = () => {
    // Use updateProfile with tracking
    updateProfile(
      {
        companySize,
        role,
        budget,
        painPoints,
      },
      'user-preferences-updated'
    )

    // Track to Hotjar
    hotjarEvent(HotjarEvents.UPDATE_USER_PREFERENCES)

    setShowSuccess(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  const handleCancel = () => {
    // Reset to current store values
    setCompanySize(userProfile.companySize)
    setRole(userProfile.role)
    setBudget(userProfile.budget)
    setPainPoints(userProfile.painPoints || [])
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('common:preferences.modal_title')}
      size="lg"
      showCloseButton
    >
      <div className="space-y-6">
        {/* Company Size */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            {t('common:preferences.company_size_label')}
          </label>
          <select
            value={companySize || ''}
            onChange={(e) => setCompanySize(e.target.value as UserProfile['companySize'])}
            className="w-full px-4 py-3 rounded-xl border border-white/10 text-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
          >
            <option value="">{t('common:preferences.select_size')}</option>
            <option value="small">Small (1-50 employees)</option>
            <option value="medium">Medium (50-200 employees)</option>
            <option value="large">Large (200-1000 employees)</option>
            <option value="enterprise">Enterprise (1000+ employees)</option>
          </select>
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            {t('common:preferences.role_label')}
          </label>
          <select
            value={role || ''}
            onChange={(e) => setRole(e.target.value as UserProfile['role'])}
            className="w-full px-4 py-3 rounded-xl border border-white/10 text-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
          >
            <option value="">{t('common:preferences.select_role')}</option>
            <option value="owner">Owner / CEO</option>
            <option value="cmo">CMO / Marketing Director</option>
            <option value="manager">Marketing Manager</option>
            <option value="specialist">Marketing Specialist</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            {t('common:preferences.budget_label')}
          </label>
          <select
            value={budget || ''}
            onChange={(e) => setBudget(e.target.value as UserProfile['budget'])}
            className="w-full px-4 py-3 rounded-xl border border-white/10 text-white focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
          >
            <option value="">{t('common:preferences.select_budget')}</option>
            <option value="low">€0 - €5,000</option>
            <option value="medium">€5,000 - €20,000</option>
            <option value="high">€20,000+</option>
          </select>
        </div>

        {/* Pain Points */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">
            {t('common:preferences.pain_points_label')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PAIN_POINTS.map((point) => {
              const isSelected = painPoints.includes(point)
              return (
                <motion.button
                  key={point}
                  onClick={() => handlePainPointToggle(point)}
                  className={`
                    px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                    ${
                      isSelected
                        ? 'bg-accent-primary/20 border-accent-primary text-white'
                        : 'border-white/10 text-white/70 hover:hover:border-white/20'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <svg
                        className="w-5 h-5 text-accent-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="flex-1 text-left">{point}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-accent-success/20 border border-accent-success/40 text-white flex items-center gap-3"
          >
            <svg className="w-6 h-6 text-accent-success" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">{t('common:preferences.success_message')}</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            className="flex-1"
            disabled={showSuccess}
          >
            {showSuccess
              ? t('common:preferences.saved_button')
              : t('common:preferences.save_button')}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCancel}
            className="flex-1"
            disabled={showSuccess}
          >
            {t('common:preferences.cancel_button')}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-white/60 text-center">{t('common:preferences.help_text')}</p>
      </div>
    </Modal>
  )
}

export default UserPreferencesModal
