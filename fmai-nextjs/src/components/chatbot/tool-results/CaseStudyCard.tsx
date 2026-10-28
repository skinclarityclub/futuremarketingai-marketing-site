'use client'

import { useCardCopy } from './cardI18n'
import { CardFooter, CardShell, CardTitle, Dot } from './CardShell'

export interface CaseStudyData {
  caseStudy: {
    client: string
    industry: string
    challenge?: string
    solution?: string
    results: string[]
    testimonial?: string
    url?: string
  }
}

// The tool ends its results with this line when no figures are published; it must stay visible.
const HONESTY = /^(Gemeten resultaten|Measured|Resultados medidos)/i

export function CaseStudyCard({ data }: { data: CaseStudyData }) {
  const { t } = useCardCopy()
  const study = data.caseStudy
  if (!study) return null

  const results = study.results ?? []
  const last = results[results.length - 1]
  const honesty = last && HONESTY.test(last) ? last : undefined
  const bullets = (honesty ? results.slice(0, -1) : results).slice(0, 3)

  return (
    <CardShell>
      <CardTitle title={study.client} sub={study.industry} />
      <ul className="flex list-none flex-col gap-1.5 p-0">
        {bullets.map((result, i) => (
          <li key={i} className="relative pl-4 leading-[1.45] text-text-primary/80">
            <Dot />
            {result}
          </li>
        ))}
      </ul>
      {study.url ? (
        <CardFooter note={honesty} href="/case-studies/skinclarity-club" label={t.readCase} />
      ) : (
        honesty && <p className="text-xs text-text-secondary/70">{honesty}</p>
      )}
    </CardShell>
  )
}

export default CaseStudyCard
