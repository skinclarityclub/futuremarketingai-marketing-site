/**
 * DesktopOnlyNotice - Temporary mobile redirect for demo pages
 *
 * Shows a friendly message that the demo is desktop-only
 * with options to:
 * 1. Email themselves the link
 * 2. Book a call instead
 * 3. Continue to simplified mobile view (optional)
 */

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, Mail, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '../common/Button'
import { useState } from 'react'

interface DesktopOnlyNoticeProps {
  /** Page name for analytics */
  pageName?: string
  /** Show simplified mobile option */
  showMobileOption?: boolean
  /** Callback when user chooses mobile view */
  onContinueMobile?: () => void
  /** Custom className */
  className?: string
}

export function DesktopOnlyNotice({
  pageName = 'demo',
  showMobileOption = false,
  onContinueMobile,
  className = '',
}: DesktopOnlyNoticeProps) {
  const { t } = useTranslation(['common'])
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    // Navigate to booking
    window.location.href = '/#book-demo'
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
    const desktopUrl = `${window.location.pathname}?desktop=true${window.location.hash}`
    window.open(desktopUrl, '_blank')
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary ${className}`}
    >
      <motion.div
        className="max-w-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <Monitor className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl font-bold text-white text-center mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t('common:mobile.desktop_required.title', 'Desktop Ervaring Aanbevolen')}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-base text-blue-100 text-center mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {t(
            'common:mobile.desktop_required.description',
            'Onze interactieve demo biedt de beste ervaring op desktop met 3D visualisaties en real-time data.'
          )}
        </motion.p>

        {/* Card with options */}
        <motion.div
          className="bg-bg-card border border-white/10 rounded-xl p-6 space-y-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Option 1: Open in Desktop */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              {t('common:mobile.desktop_required.option1', '1. Open op Desktop')}
            </h3>
            <Button
              variant="cta"
              size="lg"
              onClick={handleOpenDesktop}
              className="w-full h-12 font-semibold touch-manipulation"
              glow
            >
              <Monitor className="mr-2 h-5 w-5" />
              <span>{t('common:actions.open_desktop', 'Open in Nieuw Tabblad')}</span>
            </Button>
          </div>

          {/* Option 2: Email Link */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              {t('common:mobile.desktop_required.option2', '2. Email Link naar Mijzelf')}
            </h3>
            {!emailSent ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jouw@email.nl"
                  className="flex-1 px-4 py-3 rounded-lg bg-bg-primary border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-accent-primary transition-colors"
                  disabled={isSubmitting}
                />
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleEmailLink}
                  disabled={isSubmitting}
                  className="h-12 px-4 touch-manipulation"
                >
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-sm text-center">
                ✓ {t('common:mobile.desktop_required.email_sent', 'Link verzonden!')}
              </div>
            )}
          </div>

          {/* Option 3: Book Call */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">
              {t('common:mobile.desktop_required.option3', '3. Plan een Persoonlijke Demo')}
            </h3>
            <Button
              variant="outline"
              size="lg"
              onClick={handleBookCall}
              className="w-full h-12 border-accent-primary text-accent-primary hover:bg-accent-primary/10 touch-manipulation"
            >
              <Calendar className="mr-2 h-5 w-5" />
              <span>{t('common:cta.book_demo', 'Boek Demo')}</span>
            </Button>
          </div>

          {/* Option 4: Continue Mobile (optional) */}
          {showMobileOption && onContinueMobile && (
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={onContinueMobile}
                className="w-full text-sm text-blue-300 hover:text-blue-200 transition-colors py-2 flex items-center justify-center gap-2"
              >
                <span>
                  {t('common:mobile.desktop_required.continue_mobile', 'Toch doorgaan op mobile')}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          className="flex items-center justify-center gap-2 text-xs text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span>{t('common:trust.no_signup_required', '✨ Geen registratie vereist')}</span>
        </motion.div>
      </motion.div>
    </div>
  )
}

DesktopOnlyNotice.displayName = 'DesktopOnlyNotice'

