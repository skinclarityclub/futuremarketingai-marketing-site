'use client'

import { useCardCopy } from './cardI18n'
import { CardShell, CardTitle } from './CardShell'

// Serves get_roi_estimate: the visitor's own hours and the price, no saving (none is measured).
export interface LeadScoreData {
  teamHoursPerWeek?: number
  teamHoursPerMonth?: number
  brandCount?: number
  subscription?: number
}

export function LeadScoreCard({ data }: { data: LeadScoreData }) {
  const { t, money } = useCardCopy()
  const figures = [
    data.teamHoursPerWeek !== undefined && {
      label: t.perWeekManual,
      value: t.hours(data.teamHoursPerWeek),
    },
    data.teamHoursPerMonth !== undefined && {
      label: t.perMonthManual,
      value: t.hours(data.teamHoursPerMonth),
    },
    data.subscription !== undefined &&
      data.brandCount !== undefined && {
        label: t.subscription(data.brandCount),
        value: money(data.subscription),
      },
  ].filter((f): f is { label: string; value: string } => !!f && !!f.value)

  return (
    <CardShell>
      <CardTitle title={t.hoursHeader} />
      <div className="grid grid-cols-3 gap-2">
        {figures.map((f) => (
          <div key={f.label} data-roi-figure className="min-w-0">
            <p className="font-mono text-sm font-bold text-accent-system">{f.value}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-text-secondary">{f.label}</p>
          </div>
        ))}
      </div>
      <p className="border-t border-border-primary pt-2.5 text-xs text-text-secondary/70">{t.ownHoursNote}</p>
    </CardShell>
  )
}

export default LeadScoreCard
