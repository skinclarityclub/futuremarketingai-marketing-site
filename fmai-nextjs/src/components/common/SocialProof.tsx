import { GlassCard } from '@/components/ui/GlassCard'

interface SocialProofProps {
  quote: string
  author: string
  role: string
  company?: string
}

export function SocialProof({ quote, author, role, company }: SocialProofProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <GlassCard>
        <blockquote className="text-center">
          <span className="block text-6xl text-accent-system/20 leading-none mb-4">&ldquo;</span>
          <p className="text-lg text-text-secondary italic leading-relaxed">{quote}</p>
          <footer className="mt-6">
            <span className="text-text-primary font-semibold">{author}</span>
            <span className="text-text-muted ml-2">
              {role}
              {company && `, ${company}`}
            </span>
          </footer>
        </blockquote>
      </GlassCard>
    </div>
  )
}
