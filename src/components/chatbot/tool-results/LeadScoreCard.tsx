import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react'

export interface LeadScoreData {
  score: number
  stage?: string
  qualification?: string // tool returns 'qualification', card expects 'stage'
  recommendation?: string
  factors?: string[]
  nextSteps?: string[] // tool returns 'nextSteps', card expects 'factors'
  // ROI estimate data
  monthlySavings?: number | string
  annualSavings?: number | string
  hoursReclaimed?: number | string
  roi?: string
  roiPercent?: number // tool returns roiPercent (number), card expects roi (string)
  paybackPeriod?: string
  paybackPeriodMonths?: number // tool returns paybackPeriodMonths (number), card expects paybackPeriod (string)
  teamSize?: number
  // ROI estimate breakdown
  breakdown?: {
    hoursSavedPerWeek?: number
    timeSavedMonthly?: string
    costSavedMonthly?: number
    subscriptionCost?: number
  }
  // ROI info from get_roi_info (raw format)
  hoursSavedPerMonth?: number
  laborSavingsPerMonth?: number
  toolSavingsPerMonth?: number
  totalMonthlySavings?: number
  implementationTime?: string
  // ROI info from get_roi_info (structured format)
  metrics?: { label: string; value: string }[]
}

function scoreColor(score: number): string {
  if (score <= 30) {
    return 'text-red-400'
  }
  if (score <= 60) {
    return 'text-accent-human'
  }
  return 'text-accent-system'
}

function scoreBg(score: number): string {
  if (score <= 30) {
    return 'bg-red-400'
  }
  if (score <= 60) {
    return 'bg-accent-human'
  }
  return 'bg-accent-system'
}

function stageBadgeClass(stage: string): string {
  switch (stage) {
    case 'cold':
      return 'bg-blue-500/20 text-blue-400'
    case 'warm':
      return 'bg-accent-human/20 text-accent-human'
    case 'hot':
      return 'bg-red-500/20 text-red-400'
    case 'qualified':
      return 'bg-accent-system/20 text-accent-system'
    default:
      return 'bg-text-secondary/20 text-text-secondary'
  }
}

function formatMoney(value: number | string | undefined): string | null {
  if (value === undefined || value === null) {
    return null
  }
  if (typeof value === 'string') {
    return value
  }
  return `€${value.toLocaleString()}`
}

const ROI_ICONS = [TrendingUp, DollarSign, Clock, Users]

export function LeadScoreCard({ data }: { data: LeadScoreData }) {
  // Normalize tool field names to card field names
  // qualify_lead: qualification → stage, nextSteps → factors
  const stage = data.stage || data.qualification
  const factors = data.factors || data.nextSteps

  // get_roi_estimate: roiPercent → roi, paybackPeriodMonths → paybackPeriod, breakdown.hoursSavedPerWeek → hoursReclaimed
  const roi =
    data.roi ||
    (data.roiPercent !== null && data.roiPercent !== undefined ? `${data.roiPercent}%` : undefined)
  const paybackPeriod =
    data.paybackPeriod ||
    (data.paybackPeriodMonths !== null && data.paybackPeriodMonths !== undefined
      ? `${data.paybackPeriodMonths} month${data.paybackPeriodMonths !== 1 ? 's' : ''}`
      : undefined)
  const hoursReclaimed = data.hoursReclaimed || data.breakdown?.hoursSavedPerWeek
  const monthlySavings = data.monthlySavings || data.totalMonthlySavings
  const annualSavings = data.annualSavings

  // ROI metrics format (from get_roi_info or get_roi_estimate)
  const hasRoiData =
    monthlySavings ||
    annualSavings ||
    hoursReclaimed ||
    data.metrics ||
    data.hoursSavedPerMonth ||
    data.totalMonthlySavings

  if (hasRoiData && !data.score) {
    // Auto-construct metrics from get_roi_info raw format
    let autoMetrics: { label: string; value: string }[] | undefined
    if (!data.metrics && (data.hoursSavedPerMonth || data.totalMonthlySavings)) {
      autoMetrics = [
        ...(data.hoursSavedPerMonth !== null && data.hoursSavedPerMonth !== undefined
          ? [{ label: 'Hours Saved/mo', value: String(data.hoursSavedPerMonth) }]
          : []),
        ...(data.totalMonthlySavings !== null && data.totalMonthlySavings !== undefined
          ? [{ label: 'Monthly Savings', value: formatMoney(data.totalMonthlySavings) || '' }]
          : []),
        ...(data.annualSavings !== null && data.annualSavings !== undefined
          ? [{ label: 'Annual Savings', value: formatMoney(data.annualSavings) || '' }]
          : []),
        ...(data.laborSavingsPerMonth !== null && data.laborSavingsPerMonth !== undefined
          ? [{ label: 'Labor Savings/mo', value: formatMoney(data.laborSavingsPerMonth) || '' }]
          : []),
        ...(data.toolSavingsPerMonth !== null && data.toolSavingsPerMonth !== undefined
          ? [{ label: 'Tool Savings/mo', value: formatMoney(data.toolSavingsPerMonth) || '' }]
          : []),
        ...(data.implementationTime
          ? [{ label: 'Implementation', value: data.implementationTime }]
          : []),
      ]
    }

    const metricsToShow = data.metrics ||
      autoMetrics || [
        ...(monthlySavings
          ? [{ label: 'Monthly Savings', value: formatMoney(monthlySavings) || '' }]
          : []),
        ...(annualSavings
          ? [{ label: 'Annual Savings', value: formatMoney(annualSavings) || '' }]
          : []),
        ...(hoursReclaimed ? [{ label: 'Hours Reclaimed/mo', value: String(hoursReclaimed) }] : []),
        ...(roi ? [{ label: 'ROI', value: roi }] : []),
        ...(paybackPeriod ? [{ label: 'Payback Period', value: paybackPeriod }] : []),
        ...(data.teamSize ? [{ label: 'Team Size', value: String(data.teamSize) }] : []),
      ]

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-3"
      >
        <div className="rounded-xl bg-gradient-to-br from-accent-success/15 to-accent-system/10 border border-accent-success/20 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent-success" />
            <p className="font-sans text-sm font-semibold text-text-primary">ROI Projection</p>
          </div>
          {data.recommendation && (
            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
              {data.recommendation}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {metricsToShow.map((m, i) => {
            const Icon = ROI_ICONS[i % ROI_ICONS.length]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * i, duration: 0.2 }}
                className="rounded-xl border border-border-primary bg-bg-elevated/80 p-3"
              >
                <Icon className="h-3.5 w-3.5 text-accent-system/60 mb-1" />
                <p className="font-mono text-lg font-bold text-accent-system">{m.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-text-secondary">
                  {m.label}
                </p>
              </motion.div>
            )
          })}
        </div>

        {factors && factors.length > 0 && (
          <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Key Factors
            </p>
            <ul className="space-y-1">
              {factors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-system" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        <a
          href="/contact"
          className="block rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3 text-center text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Get your personalized ROI analysis
        </a>
      </motion.div>
    )
  }

  // Lead score format
  const clamped = Math.max(0, Math.min(100, data.score || 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-3"
    >
      {/* Score header */}
      <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <motion.span
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className={`font-mono text-4xl font-bold ${scoreColor(clamped)}`}
          >
            {clamped}
          </motion.span>
          <div>
            {stage && (
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${stageBadgeClass(stage)}`}
              >
                {stage.toUpperCase()}
              </span>
            )}
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              Lead Score
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full rounded-full bg-bg-elevated">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${scoreBg(clamped)}`}
          />
        </div>
      </div>

      {/* Recommendation */}
      {data.recommendation && (
        <div className="rounded-xl border border-accent-system/20 bg-accent-system/5 p-3">
          <p className="text-xs font-semibold text-accent-system mb-1">Recommendation</p>
          <p className="text-xs leading-relaxed text-text-secondary">{data.recommendation}</p>
        </div>
      )}

      {/* Factors */}
      {factors && factors.length > 0 && (
        <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Assessment Factors
          </p>
          <ul className="space-y-1.5">
            {factors.map((factor, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.2 }}
                className="flex items-start gap-2 text-xs text-text-secondary"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-system/60" />
                {factor}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* ROI metrics if present alongside score */}
      {hasRoiData && (
        <div className="grid grid-cols-2 gap-2">
          {monthlySavings && (
            <div className="rounded-lg border border-border-primary bg-bg-elevated/80 p-3 text-center">
              <p className="font-mono text-sm font-bold text-accent-success">
                {formatMoney(monthlySavings)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                Monthly Savings
              </p>
            </div>
          )}
          {annualSavings && (
            <div className="rounded-lg border border-border-primary bg-bg-elevated/80 p-3 text-center">
              <p className="font-mono text-sm font-bold text-accent-success">
                {formatMoney(annualSavings)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary">
                Annual Savings
              </p>
            </div>
          )}
        </div>
      )}

      <a
        href="/contact"
        className="block rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3 text-center text-xs font-medium text-white transition-opacity hover:opacity-90"
      >
        Book a discovery call
      </a>
    </motion.div>
  )
}

export default LeadScoreCard
