/**
 * Enhancement Step - AI-powered image enhancements with before/after comparison
 */

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaMagic as Wand2,
  FaExpand as Maximize,
  FaPalette as Palette,
  FaCrop as Crop,
  FaCheckCircle as CheckCircle,
  FaSpinner as Loader2,
  FaInfoCircle as Info,
  FaArrowsAltH as MoveHorizontal,
} from 'react-icons/fa'
import type { ImageFile } from './types'

interface Enhancement {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  applied: boolean
  processing: boolean
  processingTime: number
}

interface EnhancementStepProps {
  originalImage: ImageFile
  onProcessComplete: (enhancedImage: ImageFile) => void
}

export const EnhancementStep: React.FC<EnhancementStepProps> = ({
  originalImage,
  onProcessComplete,
}) => {
  const { t } = useTranslation(['adbuilder'])

  const enhancementDefinitions = useMemo(
    () => [
      {
        id: 'bg-remove',
        name: t('adbuilder:enhance.enhancements.bg_remove.name'),
        description: t('adbuilder:enhance.enhancements.bg_remove.description'),
        icon: Wand2,
        applied: false,
        processing: false,
        processingTime: 3000,
      },
      {
        id: 'upscale',
        name: t('adbuilder:enhance.enhancements.upscale.name'),
        description: t('adbuilder:enhance.enhancements.upscale.description'),
        icon: Maximize,
        applied: false,
        processing: false,
        processingTime: 4000,
      },
      {
        id: 'color-correct',
        name: t('adbuilder:enhance.enhancements.color_correct.name'),
        description: t('adbuilder:enhance.enhancements.color_correct.description'),
        icon: Palette,
        applied: false,
        processing: false,
        processingTime: 2500,
      },
      {
        id: 'smart-crop',
        name: t('adbuilder:enhance.enhancements.smart_crop.name'),
        description: t('adbuilder:enhance.enhancements.smart_crop.description'),
        icon: Crop,
        applied: false,
        processing: false,
        processingTime: 2000,
      },
    ],
    [t]
  )

  const [enhancements, setEnhancements] = useState<Enhancement[]>(enhancementDefinitions)

  const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleEnhancementToggle = (id: string) => {
    const enhancement = enhancements.find((e) => e.id === id)
    if (!enhancement || enhancement.processing) {
      return
    }

    if (enhancement.applied) {
      // Remove enhancement
      setEnhancements((prev) => prev.map((e) => (e.id === id ? { ...e, applied: false } : e)))
    } else {
      // Apply enhancement with simulated processing
      setEnhancements((prev) => prev.map((e) => (e.id === id ? { ...e, processing: true } : e)))
      setSelectedEnhancement(id)
      setProgress(0)

      // Simulate processing with progress
      const processingTime = enhancement.processingTime
      const interval = 50 // Update every 50ms
      const steps = processingTime / interval
      let currentStep = 0

      const progressInterval = setInterval(() => {
        currentStep++
        setProgress((currentStep / steps) * 100)

        if (currentStep >= steps) {
          clearInterval(progressInterval)
          setEnhancements((prev) =>
            prev.map((e) => (e.id === id ? { ...e, processing: false, applied: true } : e))
          )
          setSelectedEnhancement(null)
          setProgress(0)
          setShowComparison(true)
        }
      }, interval)
    }
  }

  // Auto-complete after all selected enhancements are applied
  useEffect(() => {
    const appliedEnhancements = enhancements.filter((e) => e.applied)
    if (appliedEnhancements.length > 0) {
      // Simulate enhanced image (in real app, this would be processed image)
      onProcessComplete(originalImage)
    }
  }, [enhancements, originalImage, onProcessComplete])

  const appliedCount = enhancements.filter((e) => e.applied).length
  const isProcessing = enhancements.some((e) => e.processing)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          {t('adbuilder:enhance.header.title')}
        </h2>
        <p className="text-white/60 text-lg">{t('adbuilder:enhance.header.subtitle')}</p>
        {appliedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 border border-accent-primary"
          >
            <CheckCircle className="w-5 h-5 text-accent-primary" />
            <span className="text-accent-primary font-semibold">
              {t('adbuilder:enhance.header.enhancements_applied', { count: appliedCount })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Image Preview with Before/After Comparison */}
      <div className="relative rounded-2xl border border-white/10 overflow-hidden">
        <div className="aspect-video relative bg-gradient-to-br from-gray-900 to-gray-800">
          {/* Original Image */}
          <img
            src={originalImage.url}
            alt={t('common:images.original')}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              clipPath: showComparison ? `inset(0 ${100 - sliderPosition}% 0 0)` : 'none',
            }}
          />

          {/* "Enhanced" Image (simulated with CSS filters) */}
          {showComparison && (
            <img
              src={originalImage.url}
              alt={t('common:images.enhanced')}
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                filter: `
                  brightness(${enhancements.find((e) => e.id === 'color-correct')?.applied ? 1.1 : 1})
                  contrast(${enhancements.find((e) => e.id === 'color-correct')?.applied ? 1.15 : 1})
                  saturate(${enhancements.find((e) => e.id === 'color-correct')?.applied ? 1.2 : 1})
                `,
              }}
            />
          )}

          {/* Comparison Slider */}
          {showComparison && (
            <div
              className="absolute inset-0 cursor-ew-resize"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percentage = (x / rect.width) * 100
                setSliderPosition(Math.max(0, Math.min(100, percentage)))
              }}
            >
              {/* Slider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Slider Handle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <MoveHorizontal className="w-6 h-6 text-gray-900" />
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm font-semibold">
                {t('adbuilder:enhance.comparison.before')}
              </div>
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm font-semibold">
                {t('adbuilder:enhance.comparison.after')}
              </div>
            </div>
          )}

          {/* Processing Overlay */}
          <AnimatePresence>
            {isProcessing && selectedEnhancement && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center space-y-4">
                  <Loader2 className="w-16 h-16 text-accent-primary mx-auto animate-spin" />
                  <div className="space-y-2">
                    <p className="text-white text-xl font-semibold">
                      {t('adbuilder:enhance.processing.title')}
                    </p>
                    <p className="text-white/60">
                      {enhancements.find((e) => e.id === selectedEnhancement)?.name}
                    </p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-64 h-2 rounded-full overflow-hidden mx-auto">
                    <motion.div
                      className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-white/40 text-sm">{Math.round(progress)}%</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhancement Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enhancements.map((enhancement, index) => {
          const Icon = enhancement.icon
          const isActive = enhancement.applied
          const isCurrentlyProcessing = enhancement.processing

          return (
            <motion.button
              key={enhancement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleEnhancementToggle(enhancement.id)}
              disabled={isCurrentlyProcessing || isProcessing}
              className={`
                group relative p-6 rounded-xl border-2 transition-all duration-300
                ${
                  isActive
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-white/10 hover:border-accent-primary/50 hover:'
                }
                ${isCurrentlyProcessing || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                  p-3 rounded-lg transition-colors
                  ${isActive ? 'bg-accent-primary/20 text-accent-primary' : 'text-white/60 group-hover:bg-accent-primary/20 group-hover:text-accent-primary'}
                `}
                >
                  {isCurrentlyProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isActive ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">{enhancement.name}</h3>
                  <p className="text-sm text-white/60">{enhancement.description}</p>
                </div>

                {/* Info Icon */}
                <div className="relative group/tooltip">
                  <Info className="w-5 h-5 text-white/40 hover:text-white/60 transition-colors" />
                  <div className="absolute right-0 top-8 w-64 p-3 rounded-lg bg-black/90 backdrop-blur-sm text-white text-sm opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                    {t('adbuilder:enhance.processing.time_tooltip', {
                      seconds: enhancement.processingTime / 1000,
                    })}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {isActive && !isCurrentlyProcessing && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 px-3 py-1 rounded-full bg-success/20 border border-success text-success text-xs font-semibold"
                >
                  {t('adbuilder:enhance.status.applied')}
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20"
      >
        <Info className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-white/80">
          <span className="font-semibold text-white">{t('adbuilder:enhance.tip.prefix')}</span>{' '}
          {t('adbuilder:enhance.tip.text')}
        </div>
      </motion.div>
    </div>
  )
}
