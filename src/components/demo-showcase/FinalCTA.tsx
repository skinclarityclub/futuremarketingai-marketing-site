import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useCalendlyBooking } from '../../hooks/useCalendlyBooking'

const CalendlyModal = lazy(() => import('../common/CalendlyModal'))

export const FinalCTA = () => {
  const calendly = useCalendlyBooking()

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          {/* Calendar icon */}
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent-system/10">
            <Calendar className="h-6 w-6 text-accent-system" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl font-bold text-white">Laten we praten</h2>

          {/* Subtext */}
          <p className="text-text-secondary text-lg leading-relaxed max-w-lg">
            15 minuten. Geen verplichtingen. We bespreken uw grootste automation-kans en of FMai de
            juiste fit is.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => calendly.open('demo_final_cta')}
            className="bg-accent-system text-bg-deep rounded-btn px-8 py-4 font-medium text-lg hover:brightness-110 transition-all cursor-pointer"
          >
            Plan uw discovery call
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6">
            <span className="text-xs text-text-muted">Gratis</span>
            <span className="text-xs text-text-muted">15 minuten</span>
            <span className="text-xs text-text-muted">Geen verplichtingen</span>
          </div>
        </motion.div>
      </div>

      {/* Calendly Modal (lazy loaded) */}
      {calendly.isOpen && (
        <Suspense fallback={null}>
          <CalendlyModal
            isOpen={calendly.isOpen}
            onClose={calendly.close}
            url={calendly.calendlyUrl}
            prefill={calendly.prefillData}
          />
        </Suspense>
      )}
    </section>
  )
}

export default FinalCTA
