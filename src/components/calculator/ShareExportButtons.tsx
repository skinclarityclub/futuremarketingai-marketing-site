import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button, Modal } from '../common'
import { useShareCalculator, type CalculatorParams } from '../../hooks'
import { exportCalculatorToPDF } from '../../utils/pdfExport'
import { trackCTAClick } from '../../utils/analytics'
import { useToastContext } from '../../contexts/ToastContext'
import { handleError } from '../../utils/errorHandling'
import type { ROIMetrics } from '../../utils/calculations'

export interface ShareExportButtonsProps {
  metrics: ROIMetrics
  inputs: CalculatorParams
  className?: string
}

/**
 * ShareExportButtons - Share and export calculator results
 *
 * Features:
 * - Copy shareable URL to clipboard
 * - Native share (mobile)
 * - Export to PDF
 * - Visual feedback
 */
export const ShareExportButtons: React.FC<ShareExportButtonsProps> = ({
  metrics,
  inputs,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])
  const { copyToClipboard, shareViaNavigator } = useShareCalculator()
  const { showError, showSuccess } = useToastContext()
  const [showCopied, setShowCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleCopyLink = async () => {
    trackCTAClick('Copy Calculator Link', 'Share')
    const success = await copyToClipboard(inputs)

    if (success) {
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 3000)
      showSuccess('Link gekopieerd naar klembord!', 3000)
    } else {
      showError('Kopiëren mislukt. Probeer het opnieuw.')
    }
  }

  const handleNativeShare = async () => {
    trackCTAClick('Native Share', 'Share')
    const success = await shareViaNavigator(inputs)

    if (!success) {
      // Fallback to copy if native share fails
      handleCopyLink()
    }
  }

  const handleExportPDF = async () => {
    trackCTAClick('Export PDF', 'Calculator')
    setIsExporting(true)

    try {
      await exportCalculatorToPDF(metrics, inputs, {
        includeCharts: true,
        includeTable: true,
        quality: 0.95,
      })
      showSuccess('PDF succesvol geëxporteerd!', 4000)
    } catch (error) {
      handleError(
        error,
        showError,
        { component: 'ShareExportButtons', action: 'exportPDF' },
        'PDF export mislukt. Probeer het opnieuw.'
      )
    } finally {
      setIsExporting(false)
    }
  }

  const handleOpenShareModal = () => {
    trackCTAClick('Open Share Modal', 'Share')
    setShowShareModal(true)
  }

  return (
    <>
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {/* Share Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={handleOpenShareModal}
          className="min-w-[150px]"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            {t('calculator:share.button_share')}
          </span>
        </Button>

        {/* Export PDF Button */}
        <Button
          variant="primary"
          size="md"
          onClick={handleExportPDF}
          disabled={isExporting}
          glow
          className="min-w-[150px]"
          data-export-pdf
        >
          <span className="flex items-center gap-2">
            {isExporting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('calculator:share.button_exporting')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t('calculator:share.button_export_pdf')}
              </>
            )}
          </span>
        </Button>

        {/* Copied Feedback */}
        <AnimatePresence>
          {showCopied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute mt-[-60px] px-4 py-2 rounded-lg bg-success/20 border border-success/40 text-success text-sm font-semibold shadow-glow-success"
            >
              {t('calculator:share.link_copied')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={t('calculator:share.modal.title')}
        size="md"
      >
        <div className="space-y-6">
          <p className="text-white text-lg">{t('calculator:share.modal.description')}</p>

          {/* Share Options */}
          <div className="space-y-4">
            {/* Copy Link */}
            <button
              onClick={() => {
                handleCopyLink()
                setTimeout(() => setShowShareModal(false), 1500)
              }}
              className="w-full p-6 rounded-xl bg-gradient-to-r from-accent-primary/20 to-accent-primary/10 border-2 border-accent-primary/30 hover:border-accent-primary/60 hover-lift transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-accent-primary/30 flex items-center justify-center group-hover:bg-accent-primary/50 transition-colors shadow-glow-primary">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">
                    {t('calculator:share.modal.copy_link_title')}
                  </div>
                  <div className="text-sm text-white/90">
                    {t('calculator:share.modal.copy_link_subtitle')}
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            {/* Native Share (if available) */}
            {typeof navigator.share === 'function' && (
              <button
                onClick={() => {
                  handleNativeShare()
                  setShowShareModal(false)
                }}
                className="w-full p-6 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/10 border-2 border-secondary/30 hover:border-secondary/60 hover-lift transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center group-hover:bg-secondary/50 transition-colors shadow-glow">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white text-lg">
                      {t('calculator:share.modal.share_directly_title')}
                    </div>
                    <div className="text-sm text-white/90">
                      {t('calculator:share.modal.share_directly_subtitle')}
                    </div>
                  </div>
                  <svg
                    className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            )}
          </div>

          {/* Current URL Preview */}
          <div
            className="mt-6 p-5 rounded-xl border-2 border-white/10"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div className="text-sm font-semibold text-white/80 mb-3">
              {t('calculator:share.modal.shareable_link_label')}
            </div>
            <div className="text-sm text-white font-mono break-all bg-black/30 p-3 rounded-lg border border-white/10">
              {typeof window !== 'undefined' && window.location.href}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <svg
              className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-blue-200">{t('calculator:share.modal.info_text')}</p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ShareExportButtons
