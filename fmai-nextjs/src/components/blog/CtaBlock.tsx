import { ArrowRight } from 'lucide-react'
import { CTAButton } from '@/components/ui/CTAButton'

interface CtaBlockProps {
  title: string
  body?: string
  /** Locale-relative href (CTAButton routes via next-intl). Defaults to /apply. */
  href?: string
  label: string
}

/**
 * Mid- or end-of-article conversion block. Every cornerstone article should
 * carry exactly one, pointing at the application-gated funnel.
 */
export function CtaBlock({ title, body, href = '/apply', label }: CtaBlockProps) {
  return (
    <div className="my-10 rounded-2xl border border-accent-human/20 bg-gradient-to-br from-bg-surface/60 to-bg-elevated/40 p-8 text-center">
      <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
      {body && <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">{body}</p>}
      <div className="mt-6 flex justify-center">
        <CTAButton href={href} icon={<ArrowRight className="h-4 w-4" />}>
          {label}
        </CTAButton>
      </div>
    </div>
  )
}
