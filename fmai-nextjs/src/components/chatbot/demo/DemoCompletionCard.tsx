'use client'

import { useLocale } from 'next-intl'
import { motion } from 'motion/react'
import { PartyPopper, ArrowRight, RotateCcw } from 'lucide-react'

interface DemoCompletionCardProps {
  scenarioTitle: string
  durationSeconds: number
  onTryAnother: () => void
  onBookCall: () => void
  onEndDemo: () => void
}

type CompletionLocale = 'nl' | 'en' | 'es'

const COMPLETION_COPY: Record<
  CompletionLocale,
  { title: string; min: string; social: string; bookCall: string; tryAnother: string; endDemo: string }
> = {
  nl: {
    title: 'Demo voltooid',
    min: 'min',
    social: '86% van de prospects plant een gesprek na deze demo',
    bookCall: 'Plan een gesprek',
    tryAnother: 'Probeer een ander',
    endDemo: 'Stop demo',
  },
  en: {
    title: 'Demo Complete',
    min: 'min',
    social: '86% of prospects book a call after this demo',
    bookCall: 'Book a call',
    tryAnother: 'Try another',
    endDemo: 'End demo',
  },
  es: {
    title: 'Demo completada',
    min: 'min',
    social: 'El 86% de los prospectos agenda una llamada tras esta demo',
    bookCall: 'Agendar una llamada',
    tryAnother: 'Probar otro',
    endDemo: 'Terminar demo',
  },
}

export function DemoCompletionCard({
  scenarioTitle,
  durationSeconds,
  onTryAnother,
  onBookCall,
  onEndDemo,
}: DemoCompletionCardProps) {
  const durationMin = Math.ceil(durationSeconds / 60)
  const rawLocale = useLocale()
  const copy = COMPLETION_COPY[(rawLocale === 'en' || rawLocale === 'es' ? rawLocale : 'nl') as CompletionLocale]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="mx-1 rounded-xl border border-accent-system/20 bg-gradient-to-br from-accent-system/10 to-accent-human/5 p-4 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-system/20">
          <PartyPopper className="h-4 w-4 text-accent-system" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{copy.title}</p>
          <p className="mt-0.5 text-xs text-text-quiet">
            {scenarioTitle} · {durationMin} {copy.min}
          </p>
          <p className="mt-2 text-[11px] text-accent-system/70">{copy.social}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onBookCall}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-accent-system/40 bg-accent-system/20 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/30"
        >
          {copy.bookCall} <ArrowRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onTryAnother}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-text-quiet transition-colors hover:text-white"
        >
          <RotateCcw className="h-3 w-3" /> {copy.tryAnother}
        </button>
        <button
          type="button"
          onClick={onEndDemo}
          className="cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-xs text-text-faint transition-colors hover:text-text-quiet"
        >
          {copy.endDemo}
        </button>
      </div>
    </motion.div>
  )
}
