import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GlassCard, Button } from '../common'

interface CampaignFormData {
  name: string
  contentTarget: number
  duration: number
  objective: string
  platforms: string[]
  targetAudience: string
  aiOptimization: boolean
}

export const CampaignLauncher: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common'])
  const [campaignForm, setCampaignForm] = useState<CampaignFormData>({
    name: '',
    contentTarget: 50,
    duration: 30,
    objective: 'awareness',
    platforms: [],
    targetAudience: 'all',
    aiOptimization: true,
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleFormChange = (field: string, value: any) => {
    setCampaignForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const togglePlatform = (platform: string) => {
    setCampaignForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const handleLaunchCampaign = () => {
    const errors: Record<string, string> = {}

    if (!campaignForm.name.trim()) {
      errors.name = t('dashboard:campaign_launcher.errors.name_required')
    }
    if (campaignForm.platforms.length === 0) {
      errors.platforms = t('dashboard:campaign_launcher.errors.platforms_required')
    }
    if (campaignForm.contentTarget < 5) {
      errors.contentTarget = t('dashboard:campaign_launcher.errors.content_min')
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setCampaignForm({
        name: '',
        contentTarget: 50,
        duration: 30,
        objective: 'awareness',
        platforms: [],
        targetAudience: 'all',
        aiOptimization: true,
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        {t('dashboard:campaign_launcher.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-6">
            {t('dashboard:campaign_launcher.configuration.heading')}
          </h3>

          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                {t('dashboard:campaign_launcher.configuration.name_required')}
              </label>
              <input
                type="text"
                value={campaignForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder={t('dashboard:campaign_launcher.configuration.name_label')}
                className={`w-full px-4 py-3 border ${
                  formErrors.name ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-primary transition-colors`}
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            {/* Content Target Slider */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                {t('dashboard:campaign_launcher.configuration.content_target_label', {
                  count: campaignForm.contentTarget,
                })}
              </label>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={campaignForm.contentTarget}
                onChange={(e) => handleFormChange('contentTarget', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              />
              {formErrors.contentTarget && (
                <p className="text-red-500 text-sm mt-1">{formErrors.contentTarget}</p>
              )}
            </div>

            {/* Duration Slider */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                {t('dashboard:campaign_launcher.configuration.duration_label', {
                  days: campaignForm.duration,
                })}
              </label>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={campaignForm.duration}
                onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>

            {/* Objective Dropdown */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                {t('dashboard:campaign_launcher.configuration.objective_label')}
              </label>
              <select
                value={campaignForm.objective}
                onChange={(e) => handleFormChange('objective', e.target.value)}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <option value="awareness">Brand Awareness</option>
                <option value="traffic">Website Traffic</option>
                <option value="leads">Lead Generation</option>
                <option value="sales">Sales Conversion</option>
                <option value="engagement">Engagement</option>
              </select>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-white/90 mb-3 font-medium">
                {t('dashboard:campaign_launcher.configuration.platforms_label')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Google Ads', 'TikTok'].map(
                  (platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        campaignForm.platforms.includes(platform)
                          ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                          : 'border-white/10 text-white/80 hover:border-accent-primary/30'
                      }`}
                      style={
                        !campaignForm.platforms.includes(platform)
                          ? { background: 'rgba(0, 0, 0, 0.3)' }
                          : undefined
                      }
                    >
                      {platform}
                    </button>
                  )
                )}
              </div>
              {formErrors.platforms && (
                <p className="text-red-500 text-sm mt-2">{formErrors.platforms}</p>
              )}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                {t('dashboard:campaign_launcher.configuration.target_audience_label')}
              </label>
              <select
                value={campaignForm.targetAudience}
                onChange={(e) => handleFormChange('targetAudience', e.target.value)}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <option value="all">{t('dashboard:campaign_launcher.audiences.all')}</option>
                <option value="18-24">Age 18-24</option>
                <option value="25-34">Age 25-34</option>
                <option value="35-44">Age 35-44</option>
                <option value="45+">Age 45+</option>
              </select>
            </div>

            {/* AI Optimization Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="aiOptimization"
                checked={campaignForm.aiOptimization}
                onChange={(e) => handleFormChange('aiOptimization', e.target.checked)}
                className="w-5 h-5 accent-accent-primary"
              />
              <label htmlFor="aiOptimization" className="text-white/90 cursor-pointer">
                Enable AI Optimization (Recommended)
              </label>
            </div>

            {/* Launch Button */}
            <Button
              variant="primary"
              size="lg"
              glow
              className="w-full"
              onClick={handleLaunchCampaign}
            >
              {t('dashboard:campaign_launcher.configuration.launch_button')}
            </Button>
          </div>
        </GlassCard>

        {/* Preview Section */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-6">
            {t('dashboard:campaign_launcher.preview.heading')}
          </h3>

          <div className="space-y-4">
            <div className="glass-card p-4 rounded-lg">
              <p className="text-white/80 text-sm mb-1">
                {t('dashboard:campaign_launcher.preview.name_label')}
              </p>
              <p className="text-text-primary font-semibold">
                {campaignForm.name || t('dashboard:campaign_launcher.preview.untitled')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-lg">
                <p className="text-white/80 text-sm mb-1">
                  {t('dashboard:campaign_launcher.preview.content_target_label')}
                </p>
                <p className="text-text-primary font-bold text-xl gradient-text">
                  {campaignForm.contentTarget} {t('dashboard:campaign_launcher.preview.pieces')}
                </p>
              </div>

              <div className="glass-card p-4 rounded-lg">
                <p className="text-white/80 text-sm mb-1">
                  {t('dashboard:campaign_launcher.preview.duration_label')}
                </p>
                <p className="text-text-primary font-bold text-xl gradient-text-success">
                  {campaignForm.duration} {t('dashboard:campaign_launcher.preview.days')}
                </p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <p className="text-white/80 text-sm mb-1">
                {t('dashboard:campaign_launcher.preview.objective_label')}
              </p>
              <p className="text-text-primary font-semibold capitalize">
                {campaignForm.objective.replace('-', ' ')}
              </p>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <p className="text-white/80 text-sm mb-2">
                {t('dashboard:campaign_launcher.preview.platforms_label')}
              </p>
              <div className="flex flex-wrap gap-2">
                {campaignForm.platforms.length > 0 ? (
                  campaignForm.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-sm font-medium"
                    >
                      {platform}
                    </span>
                  ))
                ) : (
                  <span className="text-white/70 text-sm">
                    {t('dashboard:campaign_launcher.preview.no_platforms')}
                  </span>
                )}
              </div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <p className="text-white/80 text-sm mb-1">
                {t('dashboard:campaign_launcher.preview.audience_label')}
              </p>
              <p className="text-text-primary font-semibold capitalize">
                {campaignForm.targetAudience === 'all'
                  ? t('dashboard:campaign_launcher.audiences.all')
                  : t('dashboard:campaign_launcher.audiences.age_range', {
                      range: campaignForm.targetAudience,
                    })}
              </p>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <p className="text-white/80 text-sm mb-1">
                {t('dashboard:campaign_launcher.preview.ai_optimization')}
              </p>
              <p
                className={`font-semibold ${campaignForm.aiOptimization ? 'text-success' : 'text-white/70'}`}
              >
                {campaignForm.aiOptimization
                  ? t('dashboard:campaign_launcher.preview.enabled')
                  : t('dashboard:campaign_launcher.preview.disabled')}
              </p>
            </div>

            {/* Estimated Results */}
            <div className="glass-card-strong p-6 rounded-lg mt-6">
              <h4 className="text-text-primary font-semibold mb-4">
                {t('dashboard:campaign_launcher.results.heading')}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">
                    {t('dashboard:campaign_launcher.results.estimated_reach')}
                  </span>
                  <span className="text-text-primary font-bold">
                    {Math.round(campaignForm.contentTarget * 2500).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">
                    {t('dashboard:campaign_launcher.results.team_hours_saved')}
                  </span>
                  <span className="text-success font-bold">
                    {Math.round(
                      campaignForm.contentTarget * 2.5 * (campaignForm.aiOptimization ? 1.5 : 1)
                    )}{' '}
                    {t('dashboard:campaign_launcher.results.hours_unit')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">
                    {t('dashboard:campaign_launcher.results.engagement')}
                  </span>
                  <span className="text-text-primary font-bold">
                    {Math.round(campaignForm.contentTarget * 125)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="glass-card-strong p-12 rounded-2xl text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="text-8xl mb-6"
              >
                🚀
              </motion.div>
              <h3 className="text-3xl font-bold gradient-text mb-4">
                {t('dashboard:campaign_launcher.success.title')}
              </h3>
              <p className="text-white/90 mb-6">
                {t('dashboard:campaign_launcher.success.message')}
              </p>
              <div className="flex items-center justify-center gap-2 text-success">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">{t('dashboard:overview.health.operational')}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CampaignLauncher
