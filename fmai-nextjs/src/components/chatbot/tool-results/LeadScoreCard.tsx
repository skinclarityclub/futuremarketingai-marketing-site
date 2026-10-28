'use client'

import { useCardCopy } from './cardI18n'
import { CardShell, CardTitle } from './CardShell'

// Serves get_roi_estimate only; qualify_lead decides fit and renders no card of its own.
export interface LeadScoreData {
  monthlySavings?: number | string
  roiPercent?: number
  paybackPeriodMonths?: number
  breakdown?: {
    teamSize?: number
    teamHoursPerWeek?: number
    hoursCapPerPerson?: number
    hourlyRate?: number
    rateAssumed?: boolean
    subscriptionCost?: number
  }
}

export function LeadScoreCard({ data }: { data: LeadScoreData }) {
  const { t, money, payback } = useCardCopy()
  const b = data.breakdown
  const figures = [
    { label: t.monthlySavings, value: money(data.monthlySavings) },
    {
      label: t.roi,
      value:
        data.roiPercent !== undefined && data.roiPercent !== null ? `${data.roiPercent}%` : null,
    },
    {
      label: t.payback,
      value:
        data.paybackPeriodMonths !== undefined && data.paybackPeriodMonths !== null
          ? payback(data.paybackPeriodMonths)
          : null,
    },
  ].filter((f) => f.value)

  return (
    <CardShell>
      <CardTitle title={t.roiHeader} />
      <div className="grid grid-cols-3 gap-2">
        {figures.map((f) => (
          <div key={f.label} data-roi-figure className="min-w-0">
            <p className="font-mono text-sm font-bold text-accent-system">{f.value}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-text-secondary">{f.label}</p>
          </div>
        ))}
      </div>
      {b?.teamSize !== undefined &&
        b.teamHoursPerWeek !== undefined &&
        b.hoursCapPerPerson !== undefined &&
        b.hourlyRate !== undefined &&
        b.subscriptionCost !== undefined && (
          <p className="border-t border-border-primary pt-2.5 text-xs text-text-secondary/70">
            {t.assumptions({
              team: b.teamSize,
              teamHours: b.teamHoursPerWeek,
              cap: b.hoursCapPerPerson,
              rate: money(b.hourlyRate) ?? '',
              rateAssumed: b.rateAssumed === true,
              subscription: money(b.subscriptionCost) ?? '',
            })}
          </p>
        )}
    </CardShell>
  )
}

export default LeadScoreCard
