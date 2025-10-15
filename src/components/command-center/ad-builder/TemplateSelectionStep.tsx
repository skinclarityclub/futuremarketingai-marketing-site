/**
 * Template Selection Step - Choose video template for ad
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaPlay as Play,
  FaClock as Clock,
  FaCheckCircle as CheckCircle2,
  FaFilter as Filter,
  FaInstagram as Instagram,
  FaFacebook as Facebook,
  FaTiktok as TikTok,
  FaYoutube as Youtube,
} from 'react-icons/fa'
import { videoTemplates } from './mockData'
import type { VideoTemplate } from './types'

interface TemplateSelectionStepProps {
  selectedTemplate: VideoTemplate | null
  onTemplateSelect: (template: VideoTemplate) => void
}

export const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  selectedTemplate,
  onTemplateSelect,
}) => {
  const { t } = useTranslation(['adbuilder'])
  const [styleFilter, setStyleFilter] = useState<string>('all')
  const [useCaseFilter, setUseCaseFilter] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState<VideoTemplate | null>(null)

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return videoTemplates.filter((template) => {
      const matchesStyle = styleFilter === 'all' || template.style === styleFilter
      const matchesUseCase = useCaseFilter === 'all' || template.useCase === useCaseFilter
      return matchesStyle && matchesUseCase
    })
  }, [styleFilter, useCaseFilter])

  // Available filter options with translations
  const styles = useMemo(
    () => [
      { value: 'all', label: t('adbuilder:template.styles.all') },
      { value: 'dynamic', label: t('adbuilder:template.styles.dynamic') },
      { value: 'minimal', label: t('adbuilder:template.styles.minimal') },
      { value: 'elegant', label: t('adbuilder:template.styles.elegant') },
      { value: 'bold', label: t('adbuilder:template.styles.bold') },
      { value: 'playful', label: t('adbuilder:template.styles.playful') },
    ],
    [t]
  )

  const useCases = useMemo(
    () => [
      { value: 'all', label: t('adbuilder:template.usecases.all') },
      { value: 'product', label: t('adbuilder:template.usecases.product') },
      { value: 'announcement', label: t('adbuilder:template.usecases.announcement') },
      { value: 'testimonial', label: t('adbuilder:template.usecases.testimonial') },
      { value: 'tutorial', label: t('adbuilder:template.usecases.tutorial') },
    ],
    [t]
  )

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return Instagram
      case 'facebook':
        return Facebook
      case 'tiktok':
        return TikTok
      case 'youtube':
        return Youtube
      default:
        return Instagram
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'from-purple-500 to-pink-500'
      case 'facebook':
        return 'from-blue-600 to-blue-400'
      case 'tiktok':
        return 'from-black to-red-500'
      case 'youtube':
        return 'from-red-600 to-red-400'
      default:
        return 'from-gray-500 to-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          {t('adbuilder:template.header.title')}
        </h2>
        <p className="text-white/60 text-lg">{t('adbuilder:template.header.subtitle')}</p>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 border border-accent-primary"
          >
            <CheckCircle2 className="w-5 h-5 text-accent-primary" />
            <span className="text-accent-primary font-semibold">
              {t('adbuilder:template.header.selected', { name: selectedTemplate.name })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center gap-2 text-white/60">
          <Filter className="w-5 h-5" />
          <span className="font-semibold">{t('adbuilder:template.filters.label')}</span>
        </div>

        {/* Style Filter */}
        <div className="flex-1">
          <label className="block text-sm text-white/60 mb-2">
            {t('adbuilder:template.filters.style_label')}
          </label>
          <select
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-white/20 text-white focus:border-accent-primary focus:outline-none transition-colors"
          >
            {styles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        {/* Use Case Filter */}
        <div className="flex-1">
          <label className="block text-sm text-white/60 mb-2">
            {t('adbuilder:template.filters.usecase_label')}
          </label>
          <select
            value={useCaseFilter}
            onChange={(e) => setUseCaseFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-white/20 text-white focus:border-accent-primary focus:outline-none transition-colors"
          >
            {useCases.map((useCase) => (
              <option key={useCase.value} value={useCase.value}>
                {useCase.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
          <span className="text-accent-primary font-semibold">
            {t('adbuilder:template.filters.results', { count: filteredTemplates.length })}
          </span>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${styleFilter}-${useCaseFilter}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTemplates.map((template, index) => {
            const isSelected = selectedTemplate?.id === template.id

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <button
                  onClick={() => onTemplateSelect(template)}
                  onMouseEnter={() => setPreviewTemplate(template)}
                  onMouseLeave={() => setPreviewTemplate(null)}
                  className={`
                    w-full relative rounded-2xl overflow-hidden border-2 transition-all duration-300
                    ${
                      isSelected
                        ? 'border-accent-primary shadow-xl shadow-accent-primary/20'
                        : 'border-white/10 hover:border-accent-primary/50 hover:shadow-lg'
                    }
                  `}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="w-16 h-16 rounded-full bg-accent-primary/90 flex items-center justify-center"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </motion.div>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div
                    className="p-4 backdrop-blur-sm"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{template.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Clock className="w-4 h-4" />
                          <span>{template.duration}s</span>
                          <span className="w-1 h-1 rounded-full bg-white/40" />
                          <span>{template.aspectRatio}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 rounded-md bg-accent-primary/20 border border-accent-primary/30 text-accent-primary text-xs font-semibold">
                        {template.style}
                      </span>
                      <span className="px-2 py-1 rounded-md border border-white/20 text-white/80 text-xs font-semibold">
                        {template.useCase}
                      </span>
                    </div>

                    {/* Platform Icons */}
                    <div className="flex items-center gap-2">
                      {template.platforms.map((platform) => {
                        const Icon = getPlatformIcon(platform)
                        const colorClass = getPlatformColor(platform)

                        return (
                          <div
                            key={platform}
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-white/60 text-lg">{t('adbuilder:template.no_results')}</p>
        </motion.div>
      )}

      {/* Preview Info */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="p-4 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={previewTemplate.thumbnail}
                    alt={previewTemplate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{previewTemplate.name}</h4>
                  <p className="text-white/60 text-sm">
                    {t('adbuilder:template.preview.perfect_for', {
                      useCase: previewTemplate.useCase,
                      style: previewTemplate.style,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
