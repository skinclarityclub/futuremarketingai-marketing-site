'use client'

import type { ComponentType } from 'react'
import { AlertCircle } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { LeadScoreCard } from './LeadScoreCard'
import { KBArticleCard } from './KBArticleCard'
import { TicketCard } from './TicketCard'
import { ServiceCard } from './ServiceCard'
import { CaseStudyCard } from './CaseStudyCard'
import { BookingCard } from './BookingCard'
import { MemoryCard } from './MemoryCard'
import { NavigationButton } from '../NavigationButton'
import { useChatChrome } from '../useChatChrome'

export {
  ProductCard,
  LeadScoreCard,
  KBArticleCard,
  TicketCard,
  ServiceCard,
  CaseStudyCard,
  BookingCard,
  MemoryCard,
}
export type { ProductCardData } from './ProductCard'
export type { LeadScoreData } from './LeadScoreCard'
export type { KBArticleData } from './KBArticleCard'
export type { TicketData } from './TicketCard'
export type { ServiceCardData } from './ServiceCard'
export type { CaseStudyData } from './CaseStudyCard'
export type { BookingCardData } from './BookingCard'
export type { MemoryCardData } from './MemoryCard'

// Scoring is for the sales team, not the visitor: no card, and no JSON fallback either.
export const HIDDEN_TOOLS = new Set(['qualify_lead'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOL_CARD_MAP: Record<string, ComponentType<{ data: any }>> = {
  search_products: ProductCard,
  get_product_details: ProductCard,
  build_routine: ProductCard,
  add_to_cart_suggestion: ProductCard,
  qualify_lead: LeadScoreCard,
  get_roi_estimate: LeadScoreCard,
  get_pricing_info: ServiceCard,
  schedule_demo: ServiceCard,
  search_knowledge_base: KBArticleCard,
  create_ticket: TicketCard,
  check_status: TicketCard,
  escalate_to_human: TicketCard,
  get_skills: ServiceCard,
  get_case_study: CaseStudyCard,
  book_call: BookingCard,
  remember_context: MemoryCard,
}

function ToolLoadingCard() {
  const { loading } = useChatChrome()
  return (
    <div className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
      <p className="animate-pulse font-mono text-xs text-text-secondary">{loading}</p>
      <div className="mt-2 h-16 animate-pulse rounded-lg bg-bg-elevated/50" />
    </div>
  )
}

function ToolErrorCard() {
  const { somethingWrong } = useChatChrome()
  return (
    <div className="my-2 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
      <span className="text-xs text-red-400">{somethingWrong}</span>
    </div>
  )
}

// Part shape comes from the AI SDK's UIMessage tool parts and is too dynamic
// to type narrowly here; we treat it as a structural object and narrow per
// state. unknown forces explicit checks at use-sites.
interface ToolResultRendererProps {
  part: {
    state?: string
    toolName?: string
    output?: unknown
    [key: string]: unknown
  }
}

export function ToolResultRenderer({ part }: ToolResultRendererProps) {
  const toolName = part.toolName ?? 'unknown'
  if (HIDDEN_TOOLS.has(toolName)) return null
  if (part.state === 'input-streaming' || part.state === 'input-available')
    return <ToolLoadingCard />
  if (part.state === 'output-error') return <ToolErrorCard />
  if (part.state === 'output-available') {
    if (toolName === 'navigate_to_page' && part.output) {
      const { url, label, description } = part.output as {
        url?: string
        label?: string
        description?: string
      }
      return (
        <div className="my-2 space-y-1.5">
          {description && <p className="text-xs text-text-secondary">{description}</p>}
          {url && label && <NavigationButton url={url} label={label} />}
        </div>
      )
    }
    const Card = TOOL_CARD_MAP[toolName]
    if (!Card)
      return (
        <pre className="my-1 overflow-x-auto rounded-lg bg-bg-elevated/50 p-2 font-mono text-xs text-text-secondary">
          {JSON.stringify(part.output, null, 2)}
        </pre>
      )
    // One stable hook for every card: tests and audits select on it, not on styling classes.
    return (
      <div data-tool-card={toolName}>
        <Card data={part.output} />
      </div>
    )
  }
  return null
}

export default ToolResultRenderer
