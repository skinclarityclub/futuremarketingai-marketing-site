/**
 * DesktopOnlyNoticeModal - Modal version of DesktopOnlyNotice
 * 
 * Shows as an overlay modal when user tries to access demo on mobile
 * Used with useDemoRedirect hook for instant feedback
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, Mail, Calendar, X } from 'lucide-react'
import { Button } from '../common/Button'
import { useState, useEffect } from 'react'

interface DesktopOnlyNoticeModalProps {
  /** Page name for analytics */
  pageName?: string
  /** Callback when modal closes */
  onClose: () => void
  /** Show the modal */
  isOpen?: boolean
}

export function DesktopOnlyNoticeModal({
  pageName = 'demo',
  onClose,
  isOpen = true,
}: DesktopOnlyNoticeModalProps) {
  const { t } = useTranslation(['common'])
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleEmailLink = async () => {
    if (!email || !email.includes('@')) {
      alert(t('common:validation.invalid_email', 'Please enter a valid email address'))
      return
    }

    setIsSubmitting(true)

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_desktop_link', {
        event_category: 'mobile_redirect',
        event_label: `${pageName}_email_link`,
        value: 1,
      })
    }

    // Simulate email send (replace with actual API call later)
    setTimeout(() => {
      setEmailSent(true)
      setIsSubmitting(false)
    }, 1000)
  }

  const handleBookCall = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'book_call_from_mobile', {
        event_category: 'mobile_redirect',
        event_label: `${pageName}_book_call`,
        value: 1,
      })
    }

    // Close modal and navigate to booking
    onClose()
    setTimeout(() => {
      window.location.href = '/#book-demo'
    }, 300)
  }

  const handleOpenDesktop = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'open_desktop_demo', {
        event_category: 'mobile_redirect',
        event_label: `${pageName}_open_desktop`,
        value: 1,
      })
    }

    // Open in new tab with desktop flag
    const routes: Record<string, string> = {
      explorer: '/explorer',
      calculator: '/calculator',
      dashboard: '/dashboard',
      demo: '/demo',
    }
    const desktopUrl = `${routes[pageName] || '/demo'}?desktop=true`
    window.open(desktopUrl, '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="relative w-full max-w-sm pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Content */}
              <div className="relative bg-slate-900/98 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors touch-manipulation z-10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t('common:actions.close')}
                >
                  <X className="w-5 h-5 text-slate-300" />
                </button>

                {/* Content wrapper with proper padding */}
                <div className="px-6 pt-8 pb-6">
                  {/* Icon */}
                  <motion.div
                    className="flex justify-center mb-5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                      <Monitor className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    className="text-xl font-bold text-white text-center mb-3 leading-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    {t('common:mobile.desktop_required.title', 'Desktop Ervaring Aanbevolen')}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    className="text-sm text-slate-300 text-center mb-6 leading-relaxed max-w-[280px] mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {t(
                      'common:mobile.desktop_required.description',
                      'Onze interactieve demo biedt de beste ervaring op desktop met 3D visualisaties en real-time data.'
                    )}
                  </motion.p>

                  {/* Options */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    {/* Option 1: Open in Desktop */}
                    <Button
                      variant="cta"
                      size="lg"
                      onClick={handleOpenDesktop}
                      className="w-full min-h-[48px] text-sm font-semibold touch-manipulation bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg shadow-blue-500/30 flex items-center justify-center"
                      glow
                    >
                      <Monitor className="mr-2.5 h-4 w-4 flex-shrink-0" />
                      <span>{t('common:mobile.desktop_required.cta_primary', 'Open in Nieuw Tabblad')}</span>
                    </Button>

                    {/* Option 2: Email Link */}
                    {!emailSent ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('common:mobile.desktop_required.email_placeholder', 'jouw@email.nl')}
                          className="flex-1 min-w-0 px-4 py-3 min-h-[48px] rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          disabled={isSubmitting}
                          aria-label={t('common:mobile.desktop_required.email_label', 'Email adres')}
                        />
                        <Button
                          variant="outline"
                          size="md"
                          onClick={handleEmailLink}
                          disabled={isSubmitting}
                          className="min-h-[48px] min-w-[48px] flex-shrink-0 p-0 touch-manipulation border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-blue-500/30 flex items-center justify-center"
                          aria-label={t('common:mobile.desktop_required.send_email', 'Verstuur email')}
                        >
                          <Mail className="h-5 w-5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="px-4 py-3 min-h-[48px] rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm text-center font-medium flex items-center justify-center">
                        ✓ {t('common:mobile.desktop_required.email_sent', 'Link verzonden!')}
                      </div>
                    )}

                    {/* Option 3: Book Call */}
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleBookCall}
                      className="w-full min-h-[48px] border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50 touch-manipulation text-sm font-medium flex items-center justify-center"
                    >
                      <Calendar className="mr-2.5 h-4 w-4 flex-shrink-0" />
                      <span>{t('common:mobile.desktop_required.cta_secondary', 'Boek Demo')}</span>
                    </Button>
                  </motion.div>

                  {/* Trust indicator */}
                  <motion.div
                    className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" aria-hidden="true" />
                    <span>{t('common:trust.no_signup_required', '✨ Geen registratie vereist')}</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

DesktopOnlyNoticeModal.displayName = 'DesktopOnlyNoticeModal'

