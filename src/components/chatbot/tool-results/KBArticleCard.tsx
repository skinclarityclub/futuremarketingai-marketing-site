import { FileText } from 'lucide-react'

export interface KBArticleData {
  title: string
  snippet?: string
  source?: string
  url?: string
  relevance?: number
}

export function KBArticleCard({ data }: { data: KBArticleData }) {
  const Wrapper = data.url ? 'a' : 'div'
  const wrapperProps = data.url
    ? { href: data.url, target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={`my-2 block w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md transition-colors duration-200 hover:border-accent-system/30${data.url ? ' cursor-pointer' : ''}`}
      style={{ animation: 'fadeIn 0.3s ease-in' }}
    >
      {/* Title */}
      <p className="font-sans text-sm font-medium text-text-primary">{data.title}</p>

      {/* Snippet */}
      {data.snippet && (
        <p className="mt-1 line-clamp-3 text-xs text-text-secondary">{data.snippet}</p>
      )}

      {/* Source + Relevance row */}
      <div className="mt-2 flex items-center justify-between">
        {data.source && (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-text-secondary/70" />
            <span className="font-mono text-xs text-text-secondary/70">{data.source}</span>
          </div>
        )}

        {data.relevance !== undefined && (
          <span className="font-mono text-xs text-accent-system">
            {Math.round(data.relevance * 100)}% match
          </span>
        )}
      </div>

      {/* CTA */}
      {data.url && (
        <span className="mt-2 inline-block text-xs text-accent-system hover:underline">
          Read More
        </span>
      )}
    </Wrapper>
  )
}

export default KBArticleCard
