/**
 * AI Ad Builder Studio - Main Wizard Container
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaUpload,
  FaMagic,
  FaVideo,
  FaUser,
  FaRocket,
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaSpinner,
} from 'react-icons/fa'
import { UploadStep, EnhancementStep, TemplateSelectionStep, PresenterStep, FinalizeStep } from './'
import type { ImageFile, VideoTemplate, VirtualPresenter, VoiceOption, ExportFormat } from './types'
import { sampleImages, videoTemplates, virtualPresenters, voiceOptions } from './mockData'

export const AIAdBuilderStudio: React.FC = () => {
  const { t } = useTranslation(['adbuilder'])

  const WIZARD_STEPS = [
    {
      id: 1,
      title: t('adbuilder:wizard.steps.upload.title'),
      icon: FaUpload,
      description: t('adbuilder:wizard.steps.upload.description'),
    },
    {
      id: 2,
      title: t('adbuilder:wizard.steps.enhance.title'),
      icon: FaMagic,
      description: t('adbuilder:wizard.steps.enhance.description'),
    },
    {
      id: 3,
      title: t('adbuilder:wizard.steps.template.title'),
      icon: FaVideo,
      description: t('adbuilder:wizard.steps.template.description'),
    },
    {
      id: 4,
      title: t('adbuilder:wizard.steps.presenter.title'),
      icon: FaUser,
      description: t('adbuilder:wizard.steps.presenter.description'),
    },
    {
      id: 5,
      title: t('adbuilder:wizard.steps.finalize.title'),
      icon: FaRocket,
      description: t('adbuilder:wizard.steps.finalize.description'),
    },
  ]

  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Upload
  const [uploadedImage, setUploadedImage] = useState<ImageFile | null>(null)

  // Step 2: Enhancements (processed image)
  const [, setEnhancedImage] = useState<ImageFile | null>(null)

  // Step 3: Template
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null)

  // Step 4: Presenter
  const [selectedPresenter, setSelectedPresenter] = useState<VirtualPresenter | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null)
  const [presenterScript, setPresenterScript] = useState('')
  const [presenterPosition, setPresenterPosition] = useState({ x: 0, y: 0 })

  // Step 5: Export (result tracking)
  const [, setExportedFormat] = useState<ExportFormat | null>(null)

  // Guided Demo State
  const [isRunningDemo, setIsRunningDemo] = useState(false)

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return uploadedImage !== null
      case 2:
        return true // Can skip enhancements
      case 3:
        return selectedTemplate !== null
      case 4:
        return selectedPresenter !== null && selectedVoice !== null && presenterScript.length > 0
      case 5:
        return false // Final step
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(1)
    setUploadedImage(null)
    setEnhancedImage(null)
    setSelectedTemplate(null)
    setSelectedPresenter(null)
    setSelectedVoice(null)
    setPresenterScript('')
    setPresenterPosition({ x: 0, y: 0 })
    setExportedFormat(null)
  }

  const handleExport = (format: ExportFormat) => {
    setExportedFormat(format)
  }

  // Guided Demo - Automatically walks through the entire flow
  const runGuidedDemo = async () => {
    setIsRunningDemo(true)

    // Reset everything first
    handleRestart()
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Step 1: Select a sample image (convert SampleImage to ImageFile)
    const sampleImageFile: ImageFile = {
      ...sampleImages[0],
      type: 'image/jpeg',
      size: 120000,
      dimensions: { width: 800, height: 600 },
    }
    setUploadedImage(sampleImageFile)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Move to Step 2
    setCurrentStep(2)
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Move to Step 3
    setCurrentStep(3)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Step 3: Select a template
    setSelectedTemplate(videoTemplates[0])
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Move to Step 4
    setCurrentStep(4)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Step 4: Select presenter, voice, and add script
    setSelectedPresenter(virtualPresenters[0])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSelectedVoice(voiceOptions[0])
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setPresenterScript(
      'Transform your marketing with AI-powered video ads. Create professional content in minutes, not hours. Join thousands of brands already using Future Marketing AI!'
    )
    setPresenterPosition({ x: 10, y: 80 }) // Bottom left
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Move to Step 5
    setCurrentStep(5)
    setIsRunningDemo(false)
  }

  return (
    <div className="min-h-screen">
      {/* Demo Mode Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
          <span className="text-2xl">🎬</span>
          <span className="text-white/80 font-medium">
            Demo Mode - Showcasing AI Ad Creation Flow
          </span>
        </div>
      </motion.div>

      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold gradient-text mb-3"
        >
          AI Ad Builder Studio
        </motion.h1>
        <p className="text-white/70 text-lg mb-6">
          Create professional video ads from a single photo using AI
        </p>

        {/* Try Sample Ad Button - Only show at Step 1 with no image */}
        {currentStep === 1 && !uploadedImage && !isRunningDemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <button
              onClick={runGuidedDemo}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-accent-primary/50 transition-all hover:scale-105"
            >
              <FaPlay className="w-5 h-5" />
              <span>{t('adbuilder:wizard.demo.button')}</span>
              <FaMagic className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Running Demo Indicator */}
        {isRunningDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-accent-primary/20 border border-accent-primary/50 rounded-full">
              <FaSpinner className="w-5 h-5 animate-spin text-accent-primary" />
              <span className="text-white font-medium">{t('adbuilder:wizard.demo.running')}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const isAccessible = currentStep >= step.id

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <button
                  onClick={() => isAccessible && setCurrentStep(step.id)}
                  disabled={!isAccessible}
                  className={`
                    relative flex flex-col items-center gap-2 transition-all
                    ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                  `}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted
                        ? 'rgb(0, 255, 136)'
                        : isActive
                          ? 'rgb(0, 255, 136)'
                          : 'rgba(255, 255, 255, 0.1)',
                    }}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center border-2
                      ${isActive ? 'border-accent-primary shadow-lg shadow-accent-primary/50' : 'border-white/20'}
                    `}
                  >
                    <Icon
                      className={`w-7 h-7 ${isActive || isCompleted ? 'text-white' : 'text-white/60'}`}
                    />
                  </motion.div>

                  <div className="text-center">
                    <p
                      className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-white/60'}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-white/40">{step.description}</p>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeStep"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-primary"
                    />
                  )}
                </button>

                {/* Connector Line */}
                {index < WIZARD_STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 relative">
                    <motion.div
                      initial={false}
                      animate={{
                        width: isCompleted ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-accent-primary"
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          {currentStep === 1 && (
            <UploadStep onFileSelect={setUploadedImage} previewImage={uploadedImage} />
          )}

          {currentStep === 2 && uploadedImage && (
            <EnhancementStep originalImage={uploadedImage} onProcessComplete={setEnhancedImage} />
          )}

          {currentStep === 3 && (
            <TemplateSelectionStep
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
          )}

          {currentStep === 4 && (
            <PresenterStep
              selectedPresenter={selectedPresenter}
              selectedVoice={selectedVoice}
              script={presenterScript}
              presenterPosition={presenterPosition}
              onPresenterSelect={setSelectedPresenter}
              onVoiceSelect={setSelectedVoice}
              onScriptChange={setPresenterScript}
              onPositionChange={setPresenterPosition}
            />
          )}

          {currentStep === 5 && (
            <FinalizeStep
              uploadedImage={uploadedImage}
              selectedTemplate={selectedTemplate}
              selectedPresenter={selectedPresenter}
              script={presenterScript}
              onExport={handleExport}
              onRestart={handleRestart}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-2xl mx-auto"
        >
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed text-white/40'
                  : 'hover:bg-white/10 text-white'
              }
            `}
          >
            <FaArrowLeft className="w-4 h-4" />
            {t('adbuilder:wizard.navigation.previous')}
          </button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Step {currentStep} of {WIZARD_STEPS.length}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceedToNextStep()}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${
                !canProceedToNextStep()
                  ? 'opacity-50 cursor-not-allowed text-white/40'
                  : 'bg-gradient-to-r from-accent-primary to-accent-secondary hover:shadow-lg hover:shadow-accent-primary/30 text-white'
              }
            `}
          >
            {t('adbuilder:wizard.navigation.next')}
            <FaArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
