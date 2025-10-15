import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

/**
 * Footer - Privacy-compliant footer with policy links and data controls
 *
 * GDPR/CCPA Requirements:
 * - Privacy policy link (Article 13 GDPR)
 * - Cookie policy link (ePrivacy Directive)
 * - Terms of service link
 * - User data deletion control (Article 17 GDPR - Right to Erasure)
 *
 * @returns Footer component
 */
export function Footer() {
  const { t } = useTranslation('common')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  /**
   * Handle "Delete My Data" - GDPR Article 17 (Right to Erasure)
   */
  const handleDeleteData = () => {
    setIsDeleting(true)

    try {
      // Clear all localStorage (consent, preferences, etc.)
      localStorage.clear()

      // GA4 opt-out
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        })
      }

      // Hotjar opt-out
      if (window.hj) {
        window.hj('optOut')
      }

      // Clear all cookies (except essential)
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
      })

      // Show success message
      setTimeout(() => {
        setIsDeleting(false)
        setShowDeleteConfirm(false)
        alert(t('footer.data_deleted_success'))
        // Reload page to reset state
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Failed to delete data:', error)
      setIsDeleting(false)
      alert(t('footer.data_deleted_error'))
    }
  }

  return (
    <footer className="relative z-10 py-8 px-6 border-t border-white/10 backdrop-blur-xl bg-black/20">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Privacy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-slate-300">
            <a
              href="https://futuremarketingai.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors underline"
            >
              {t('footer.privacy_policy')}
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://futuremarketingai.com/cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors underline"
            >
              {t('footer.cookie_policy')}
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://futuremarketingai.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors underline"
            >
              {t('footer.terms')}
            </a>
          </div>

          {/* Data Privacy Controls */}
          <div className="flex items-center gap-4">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-red-500/50 rounded-lg transition-all hover:bg-red-500/10"
                aria-label={t('footer.delete_my_data')}
              >
                🗑️ {t('footer.delete_my_data')}
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <span className="text-sm text-slate-300">{t('footer.delete_confirm')}</span>
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                  className="px-3 py-1 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded transition-colors"
                >
                  {isDeleting ? t('common:loading.default') : t('common:actions.confirm')}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  {t('common:actions.cancel')}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} FutureMarketingAI. {t('footer.all_rights_reserved')}
          </p>
          <p className="mt-2">{t('footer.demo_notice')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
