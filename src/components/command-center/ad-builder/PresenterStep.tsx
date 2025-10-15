/**
 * Presenter Step - Virtual presenter integration (Nano Banana style)
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaUser as User,
  FaMicrophone as Mic,
  FaPlay as Play,
  FaPause as Pause,
  FaCheckCircle as CheckCircle2,
  FaInfoCircle as Info,
  FaArrowsAlt as Move,
} from 'react-icons/fa'
import { virtualPresenters, voiceOptions } from './mockData'
import type { VirtualPresenter, VoiceOption } from './types'

interface PresenterStepProps {
  selectedPresenter: VirtualPresenter | null
  selectedVoice: VoiceOption | null
  script: string
  presenterPosition: { x: number; y: number }
  onPresenterSelect: (presenter: VirtualPresenter) => void
  onVoiceSelect: (voice: VoiceOption) => void
  onScriptChange: (script: string) => void
  onPositionChange: (position: { x: number; y: number }) => void
}

export const PresenterStep: React.FC<PresenterStepProps> = ({
  selectedPresenter,
  selectedVoice,
  script,
  onPresenterSelect,
  onVoiceSelect,
  onScriptChange,
  onPositionChange,
}) => {
  const { t } = useTranslation(['adbuilder'])
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const MAX_SCRIPT_LENGTH = 500
  const scriptLength = script.length
  const estimatedDuration = Math.ceil((scriptLength / 150) * 60) // ~150 words per minute

  const handlePlayVoice = () => {
    setIsPlayingVoice(true)
    // Simulate audio playback
    setTimeout(() => setIsPlayingVoice(false), 3000)
  }

  const getPositionStyle = (position: 'bottom-left' | 'bottom-right' | 'bottom-center') => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          {t('adbuilder:presenter.header.title')}
        </h2>
        <p className="text-white/60 text-lg">{t('adbuilder:presenter.header.subtitle')}</p>
        {selectedPresenter && selectedVoice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20 border border-accent-primary"
          >
            <CheckCircle2 className="w-5 h-5 text-accent-primary" />
            <span className="text-accent-primary font-semibold">
              {t('adbuilder:presenter.header.selected', {
                presenter: selectedPresenter.name,
                voice: selectedVoice.name,
              })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Main Layout - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Configuration */}
        <div className="space-y-6">
          {/* Presenter Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-accent-primary" />
              <h3 className="text-xl font-semibold text-white">
                {t('adbuilder:presenter.sections.select_presenter')}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {virtualPresenters.map((presenter) => {
                const isSelected = selectedPresenter?.id === presenter.id

                return (
                  <motion.button
                    key={presenter.id}
                    onClick={() => onPresenterSelect(presenter)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative p-3 rounded-xl border-2 transition-all
                      ${
                        isSelected
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-white/10 hover:border-accent-primary/50'
                      }
                    `}
                  >
                    {/* Avatar */}
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-gray-700 to-gray-900">
                      <img
                        src={presenter.avatar}
                        alt={presenter.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name & Style */}
                    <p className="text-white font-semibold text-sm mb-1">{presenter.name}</p>
                    <p className="text-white/60 text-xs">{presenter.style}</p>

                    {/* Selected Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Voice Selection */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-accent-primary" />
              <h3 className="text-xl font-semibold text-white">
                {t('adbuilder:presenter.sections.choose_voice')}
              </h3>
            </div>

            <div className="space-y-3">
              {voiceOptions.map((voice) => {
                const isSelected = selectedVoice?.id === voice.id

                return (
                  <motion.button
                    key={voice.id}
                    onClick={() => onVoiceSelect(voice)}
                    whileHover={{ scale: 1.02 }}
                    className={`
                      w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between
                      ${
                        isSelected
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-white/10 hover:border-accent-primary/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`
                        p-2 rounded-lg
                        ${isSelected ? 'bg-accent-primary/20' : ''}
                      `}
                      >
                        <Mic
                          className={`w-5 h-5 ${isSelected ? 'text-accent-primary' : 'text-white/60'}`}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-semibold">{voice.name}</p>
                        <p className="text-white/60 text-sm">
                          {voice.language} • {voice.accent}
                        </p>
                      </div>
                    </div>

                    {/* Play Button */}
                    {isSelected && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayVoice()
                        }}
                        className="p-2 rounded-lg bg-accent-primary hover:bg-accent-secondary transition-colors"
                      >
                        {isPlayingVoice ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </button>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Script Editor */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                {t('adbuilder:presenter.sections.write_script')}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    scriptLength > MAX_SCRIPT_LENGTH ? 'text-red-400' : 'text-white/60'
                  }`}
                >
                  {scriptLength}/{MAX_SCRIPT_LENGTH}
                </span>
                <span className="text-sm text-white/40">•</span>
                <span className="text-sm text-white/60">
                  {t('adbuilder:presenter.script.estimated_duration', {
                    seconds: estimatedDuration,
                  })}
                </span>
              </div>
            </div>

            <textarea
              value={script}
              onChange={(e) => onScriptChange(e.target.value)}
              placeholder={t('adbuilder:presenter.script.placeholder')}
              maxLength={MAX_SCRIPT_LENGTH}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-white/40 focus:border-accent-primary focus:outline-none transition-colors resize-none"
            />

            {/* Tips */}
            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
              <Info className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/80">
                <span className="font-semibold text-white">
                  {t('adbuilder:presenter.script.tip_prefix')}
                </span>{' '}
                {t('adbuilder:presenter.script.tip_text')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              {t('adbuilder:presenter.sections.preview')}
            </h3>

            {/* Video Preview Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10">
              <div className="aspect-video relative">
                {/* Background (simulated video) */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />

                {/* Sample Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-6xl">🎬</div>
                    <p className="text-white/60 text-lg">
                      {t('adbuilder:presenter.preview_frame.content_placeholder')}
                    </p>
                  </div>
                </div>

                {/* Presenter Position Indicators */}
                <div className="absolute inset-0 pointer-events-none">
                  {['bottom-left', 'bottom-right', 'bottom-center'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onPositionChange({ x: 0, y: 0 })}
                      className={`
                        absolute w-3 h-3 rounded-full border-2 border-accent-primary/50
                        hover:bg-accent-primary/50 transition-colors cursor-pointer pointer-events-auto
                        ${getPositionStyle(pos as any)}
                      `}
                    />
                  ))}
                </div>

                {/* Virtual Presenter Overlay */}
                <AnimatePresence>
                  {selectedPresenter && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      drag
                      dragMomentum={false}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={() => setIsDragging(false)}
                      className={`
                        absolute bottom-4 right-4 w-32 h-32 cursor-move
                        ${isDragging ? 'z-50' : 'z-10'}
                      `}
                    >
                      <div className="relative w-full h-full">
                        {/* Presenter Avatar */}
                        <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-accent-primary/50 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900">
                          <img
                            src={selectedPresenter.avatar}
                            alt={selectedPresenter.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Drag Indicator */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          <Move className="w-3 h-3 inline mr-1" />
                          {t('adbuilder:presenter.preview_frame.drag_indicator')}
                        </div>

                        {/* Speaking Indicator */}
                        {isPlayingVoice && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center shadow-lg"
                          >
                            <Mic className="w-4 h-4 text-white animate-pulse" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Preview Controls */}
              <div
                className="p-4 backdrop-blur-sm border-t border-white/10"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">
                    {selectedPresenter ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t('adbuilder:presenter.preview_frame.position_label', {
                            presenter: `<span class="text-accent-primary font-semibold">${selectedPresenter.name}</span>`,
                          }),
                        }}
                      />
                    ) : (
                      t('adbuilder:presenter.preview_frame.no_presenter')
                    )}
                  </div>

                  {selectedPresenter && (
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Move className="w-3 h-3" />
                      <span>{t('adbuilder:presenter.preview_frame.drag_indicator')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Position Presets */}
          {selectedPresenter && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h4 className="text-sm font-semibold text-white/80 mb-3">
                {t('adbuilder:presenter.positions.title')}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('adbuilder:presenter.positions.bottom_left'), icon: '↙️' },
                  { label: t('adbuilder:presenter.positions.bottom_center'), icon: '⬇️' },
                  { label: t('adbuilder:presenter.positions.bottom_right'), icon: '↘️' },
                ].map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => onPositionChange({ x: index * 50, y: 0 })}
                    className="p-3 rounded-lg border border-white/10 hover:border-accent-primary/50 hover:transition-all text-center"
                  >
                    <div className="text-2xl mb-1">{preset.icon}</div>
                    <div className="text-xs text-white/60">{preset.label}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
