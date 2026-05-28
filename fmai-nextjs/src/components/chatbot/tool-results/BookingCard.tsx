'use client'

import { motion } from 'motion/react'
import { Calendar, ArrowRight, Clock, MessageCircle, ShieldCheck } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export interface BookingCardData {
  action: string
  url: string
  reason?: string
}

const TRUST_SIGNALS = [
  { icon: MessageCircle, label: 'Persoonlijk gesprek' },
  { icon: Clock, label: 'Reactie binnen 24u' },
  { icon: ShieldCheck, label: 'Geen verplichtingen' },
]

export function BookingCard({ data }: { data: BookingCardData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4"
    >
      <div className="rounded-xl bg-gradient-to-br from-accent-system/15 to-accent-secondary/10 border border-accent-system/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-system/20">
            <Calendar className="h-5 w-5 text-accent-system" />
          </div>
          <div>
            <p className="font-sans text-sm font-semibold text-text-primary">Plan een gesprek</p>
            <p className="text-xs text-text-secondary">Samen kijken of het past</p>
          </div>
        </div>
        {data?.reason && (
          <p className="mt-3 text-xs leading-relaxed text-text-secondary border-t border-accent-system/15 pt-3">
            {data.reason}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TRUST_SIGNALS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border-primary bg-bg-elevated/60 p-3 text-center"
          >
            <Icon className="h-3.5 w-3.5 text-accent-system/70" />
            <span className="text-[10px] leading-tight text-text-secondary">{label}</span>
          </div>
        ))}
      </div>

      <Link
        href="/apply"
        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-system/20 transition-all duration-200 hover:shadow-accent-system/30 hover:opacity-95"
      >
        Plan een gesprek
        <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  )
}

export default BookingCard
