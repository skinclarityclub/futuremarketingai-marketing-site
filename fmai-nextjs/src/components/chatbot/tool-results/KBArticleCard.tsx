'use client'

import { motion } from 'motion/react'
import { FileText, BookOpen, ExternalLink } from 'lucide-react'

export interface KBArticleData {
  title: string
  snippet?: string
  content?: string
  source?: string
  url?: string
  relevance?: number
  category?: string
  articles?: KBArticleData[]
}

function RelevanceBadge({ relevance }: { relevance: number }) {
  const pct = Math.round(relevance * 100)
  const color =
    pct >= 80 ? 'text-accent-success' : pct >= 50 ? 'text-accent-system' : 'text-text-secondary'
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 rounded-full bg-bg-elevated">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`h-full rounded-full ${pct >= 80 ? 'bg-accent-success' : pct >= 50 ? 'bg-accent-system' : 'bg-text-secondary/50'}`}
        />
      </div>
      <span className={`font-mono text-[10px] font-bold ${color}`}>{pct}%</span>
    </div>
  )
}

function SingleArticle({ data, index }: { data: KBArticleData; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index ?? 0) * 0.08, duration: 0.25 }}
      className="rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-system/15">
          <FileText className="h-4 w-4 text-accent-system" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-text-primary">{data.title}</p>
          {data.category && (
            <span className="mt-0.5 inline-block rounded-full bg-accent-system/10 px-2 py-0.5 text-[10px] font-medium text-accent-system">
              {data.category}
            </span>
          )}
        </div>
      </div>
      {(data.snippet || data.content) && (
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          {data.snippet || data.content}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {data.source && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3 text-text-secondary/60" />
              <span className="font-mono text-[10px] text-text-secondary/60">{data.source}</span>
            </div>
          )}
          {data.relevance !== undefined && <RelevanceBadge relevance={data.relevance} />}
        </div>
        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent-system hover:underline"
          >
            Read <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function KBArticleCard({ data }: { data: KBArticleData }) {
  if (data.articles && data.articles.length > 0) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-4 w-4 text-accent-system" />
          <p className="font-sans text-sm font-semibold text-text-primary">
            Knowledge Base Results
          </p>
          <span className="ml-auto font-mono text-xs text-text-secondary">
            {data.articles.length} article{data.articles.length > 1 ? 's' : ''}
          </span>
        </div>
        {data.articles.map((article, i) => (
          <SingleArticle key={article.title || i} data={article} index={i} />
        ))}
      </div>
    )
  }
  return (
    <div className="w-full">
      <SingleArticle data={data} />
    </div>
  )
}

export default KBArticleCard
