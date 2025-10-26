/**
 * Calendly Booking Message Component (2025 Best Practices)
 *
 * Renders an interactive Calendly booking prompt with:
 * - Smart event type selection based on ICP score
 * - Pre-filled user information
 * - Primary CTA to open Calendly modal
 * - Secondary CTA to decline (optional)
 * - Full WCAG 2.1 AA accessibility compliance
 * - Error handling and fallback options
 * - Lazy-loaded modal for optimal performance
 */

import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { useTranslation } from 'react-i18next'
import { useCalendlyBooking } from '../../../hooks/useCalendlyBooking'
import { useChatStore } from '../../../stores/chatStore'
import { usePersonalizationStore } from '../../../stores/personalizationStore'
import { trackGA4Event } from '../../../utils/ga4'
import { hotjarEvent, HotjarEvents } from '../../../utils/hotjar'
import { glassCard } from '../styles/glassmorphism'

// Lazy load CalendlyModal for better performance
const CalendlyModal = lazy(() =>
  import('../../common/CalendlyModal').then((m) => ({ default: m.CalendlyModal }))
)

const messageFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

interface CalendlyBookingProps {
  content: string
  prefillData?: {
    name?: string
    email?: string
    company?: string
    notes?: string
  }
  ctaText?: string
  secondaryCtaText?: string
}

export default function CalendlyBooking({
  content,
  prefillData,
  ctaText = '📅', // Emoji only, actual text comes from translation
  secondaryCtaText = '', // Actual text comes from translation
}: CalendlyBookingProps) {
  const { t } = useTranslation(['common', 'calendly'])
  const [declined, setDeclined] = useState(false)
  const [bookingCompleted, setBookingCompleted] = useState(false)
  const calendly = useCalendlyBooking()
  const { addSystemMessage } = useChatStore()
  const { icpScore } = usePersonalizationStore()

  // Listen for Calendly booking completion
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        setBookingCompleted(true)

        // Track booking completion with detailed analytics
        const icpTier = icpScore?.overall
          ? icpScore.overall >= 80
            ? 'enterprise'
            : icpScore.overall >= 60
              ? 'strategic'
              : icpScore.overall >= 40
                ? 'standard'
                : 'discovery'
          : 'unknown'

        // GA4 Event
        trackGA4Event('calendly_booking_completed_ai_assistant', {
          event_category: 'conversion',
          event_label: 'AI Assistant Demo Booking',
          value: 1,
          event_type: calendly.eventType.id,
          event_duration: calendly.eventType.duration,
          icp_score: icpScore?.overall || 0,
          icp_tier: icpTier,
          source: 'ai_assistant_chat',
        })

        // Hotjar Event - Critical conversion!
        hotjarEvent(HotjarEvents.CALENDLY_BOOKING_COMPLETED)

        console.log('📅 AI Assistant Calendly Booking Completed:', {
          eventType: calendly.eventType.name,
          duration: calendly.eventType.duration,
          icpScore: icpScore?.overall,
          icpTier,
        })

        // Add success message to chat after a short delay
        setTimeout(() => {
          addSystemMessage(
            `🎉 **Fantastisch!** Je demo is ingepland.\n\nJe ontvangt een bevestigingsmail met alle details en een kalender uitnodiging. Ik kijk ernaar uit om je te ontmoeten!\n\n**In de tussentijd:**\n• Voel je vrij om nog meer **modules te verkennen**\n• Probeer de **ROI Calculator** om je potentiële besparingen te zien\n• Stel gerust nog vragen als je die hebt`,
            ['Verken modules', 'Bereken ROI']
          )
        }, 1500)
      }
    }

    if (calendly.isOpen) {
      window.addEventListener('message', handleCalendlyEvent)
      return () => window.removeEventListener('message', handleCalendlyEvent)
    }

    return undefined
  }, [calendly.isOpen, calendly.eventType, icpScore, addSystemMessage])

  const handleBooking = () => {
    // Track CTA click
    trackGA4Event('calendly_cta_clicked_ai_assistant', {
      event_category: 'engagement',
      event_label: 'AI Assistant Demo CTA Click',
      event_type: calendly.eventType.id,
      icp_score: icpScore?.overall || 0,
    })

    console.log('📅 AI Assistant Calendly CTA Clicked:', {
      eventType: calendly.eventType.name,
      icpScore: icpScore?.overall,
    })

    // Open Calendly with pre-filled data from personalization store
    // The hook will automatically select the right event type based on ICP score
    calendly.open(
      'AI Assistant Chat',
      prefillData
        ? {
            name: prefillData.name,
            email: prefillData.email,
            customAnswers: {
              a2: prefillData.company ? `Bedrijf: ${prefillData.company}` : undefined,
              a10: prefillData.notes,
            },
          }
        : undefined
    )
  }

  const handleDecline = () => {
    // Track decline
    trackGA4Event('calendly_declined_ai_assistant', {
      event_category: 'engagement',
      event_label: 'AI Assistant Demo Declined',
      event_type: calendly.eventType.id,
      icp_score: icpScore?.overall || 0,
    })

    console.log('📅 AI Assistant Calendly Declined:', {
      eventType: calendly.eventType.name,
      icpScore: icpScore?.overall,
    })

    setDeclined(true)
  }

  // Show confirmation after successful booking
  if (bookingCompleted) {
    return (
      <motion.div
        variants={messageFadeIn}
        initial="hidden"
        animate="visible"
        className="flex gap-3 items-start"
      >
        {/* Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>

        {/* Message Content */}
        <div className={`${glassCard} px-4 py-3 max-w-[85%]`}>
          <div
            className="text-sm text-gray-200 leading-relaxed prose prose-sm max-w-none
            prose-p:my-1 prose-p:leading-relaxed
            prose-strong:font-bold prose-strong:text-white"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
          </div>

          {/* Success Indicator */}
          <div className="mt-3 p-3 rounded-lg bg-green-950/30 border border-green-900/50">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <div className="text-sm text-green-200">
                <p className="font-semibold">Demo ingepland!</p>
                <p className="text-xs">Check je email voor de bevestiging</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (declined) {
    return (
      <motion.div
        variants={messageFadeIn}
        initial="hidden"
        animate="visible"
        className="flex gap-3 items-start"
      >
        {/* Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>

        {/* Message Content */}
        <div className={`${glassCard} px-4 py-3 max-w-[85%]`}>
          <div className="text-sm text-gray-200 leading-relaxed">
            <p>Geen probleem! Neem gerust je tijd om het platform verder te verkennen.</p>
            <p className="mt-2 text-xs text-gray-400">
              💡 Tip: Probeer de <strong>ROI Calculator</strong> of verken een paar{' '}
              <strong>modules</strong> om een beter gevoel te krijgen voor de mogelijkheden.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        variants={messageFadeIn}
        initial="hidden"
        animate="visible"
        className="flex gap-3 items-start"
        role="region"
        aria-label={t('common:accessibility.demo_booking')}
      >
        {/* Avatar */}
        <div
          className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold"
          aria-hidden="true"
        >
          AI
        </div>

        {/* Message Content */}
        <div className={`${glassCard} px-4 py-3 max-w-[85%]`}>
          {/* Message Text with Markdown Support */}
          <div
            className="text-sm text-gray-200 leading-relaxed prose prose-sm max-w-none
            prose-p:my-1 prose-p:leading-relaxed
            prose-strong:font-bold prose-strong:text-white
            prose-em:italic
            prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
            prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
            prose-li:my-0.5
            prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1
            prose-h1:text-lg prose-h2:text-base prose-h3:text-sm"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
          </div>

          {/* Calendly CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border border-blue-900/50"
            role="complementary"
            aria-labelledby="booking-title"
          >
            {/* Event Type Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-2xl"
                role="img"
                aria-label={calendly.eventType.priority >= 3 ? 'Premium event' : 'Standard event'}
              >
                {calendly.eventType.priority >= 3 ? '⭐' : '📅'}
              </span>
              <div>
                <p
                  id="booking-title"
                  className="text-sm font-semibold text-gray-100"
                >
                  {calendly.eventType.name}
                </p>
                <p className="text-xs text-gray-400">
                  {calendly.eventType.duration} minuten • Persoonlijke demo
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-2"
              role="group"
              aria-label={t('common:accessibility.booking_actions')}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`${ctaText} - Opens scheduling modal`}
              >
                {ctaText}
              </motion.button>

              {secondaryCtaText && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDecline}
                  className="px-4 py-2.5 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)')}
                  aria-label={`${secondaryCtaText} - Dismiss booking invitation`}
                >
                  {secondaryCtaText}
                </motion.button>
              )}
            </div>

            {/* Trust Indicators */}
            <div
              className="mt-3 pt-3 border-t border-blue-900/50 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400"
              role="list"
              aria-label={t('common:accessibility.trust_indicators')}
            >
              <span role="listitem">{t('calendly:modal.trust_signals.no_obligations')}</span>
              <span role="listitem">{t('calendly:modal.trust_signals.free_advice')}</span>
              <span role="listitem">{t('calendly:modal.trust_signals.instant_booking')}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Calendly Modal - Lazy loaded with Suspense */}
      {calendly.isOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
              <div
                className="bg-white rounded-lg p-6 shadow-xl"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-100">Scheduling laden...</p>
                </div>
              </div>
            </div>
          }
        >
          <CalendlyModal
            isOpen={calendly.isOpen}
            onClose={calendly.close}
            url={calendly.calendlyUrl}
            prefill={calendly.prefillData}
          />
        </Suspense>
      )}
    </>
  )
}
