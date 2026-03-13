export interface LeadScoreData {
  score: number
  stage?: string
  recommendation?: string
  factors?: string[]
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

export function LeadScoreCard({ data }: { data: LeadScoreData }) {
  const clamped = Math.max(0, Math.min(100, data.score))

  return (
    <div
      className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md transition-colors duration-200 hover:border-accent-system/30"
      style={{ animation: 'fadeIn 0.3s ease-in' }}
    >
      {/* Score + Stage */}
      <div className="flex items-center gap-3">
        <span className={`font-mono text-3xl font-bold ${scoreColor(clamped)}`}>{clamped}</span>
        {data.stage && (
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-xs ${stageBadgeClass(data.stage)}`}
          >
            {data.stage}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-text-secondary">
        Lead Score
      </p>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full rounded-full bg-bg-elevated">
        <div
          className={`h-full rounded-full transition-all duration-500 ${scoreBg(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>

      {/* Recommendation */}
      {data.recommendation && (
        <p className="mt-2 text-xs text-text-secondary">{data.recommendation}</p>
      )}

      {/* Factors */}
      {data.factors && data.factors.length > 0 && (
        <ul className="mt-2 space-y-0.5">
          {data.factors.map((factor, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-secondary/50" />
              {factor}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LeadScoreCard
