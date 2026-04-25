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
import { NavigationButton } from '../NavigationButton'

export {
  ProductCard,
  LeadScoreCard,
  KBArticleCard,
  TicketCard,
  ServiceCard,
  CaseStudyCard,
  BookingCard,
}
export type { ProductCardData } from './ProductCard'
export type { LeadScoreData } from './LeadScoreCard'
export type { KBArticleData } from './KBArticleCard'
export type { TicketData } from './TicketCard'
export type { ServiceCardData } from './ServiceCard'
export type { CaseStudyData } from './CaseStudyCard'
export type { BookingCardData } from './BookingCard'

const SIDE_PANEL_TOOLS = new Set([
  'search_products',
  'get_product_details',
  'build_routine',
  'get_case_study',
  'explain_module',
  'get_roi_info',
  'get_roi_estimate',
  'get_pricing_info',
  'qualify_lead',
  'search_knowledge_base',
  'book_call',
  'get_skills',
  'create_ticket',
  'check_status',
  'escalate_to_human',
])
const INLINE_TOOLS = new Set(['navigate_to_page'])

export function shouldUseSidePanel(toolName: string): boolean {
  return SIDE_PANEL_TOOLS.has(toolName)
}
export { SIDE_PANEL_TOOLS, INLINE_TOOLS }

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
  explain_module: ServiceCard,
  get_roi_info: LeadScoreCard,
  book_demo: ServiceCard,
}

function ToolLoadingCard({ toolName }: { toolName: string }) {
  return (
    <div className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
      <p className="animate-pulse font-mono text-xs text-text-secondary">Loading {toolName}...</p>
      <div className="mt-2 h-16 animate-pulse rounded-lg bg-bg-elevated/50" />
    </div>
  )
}

function ToolErrorCard() {
  return (
    <div className="my-2 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
      <span className="text-xs text-red-400">Something went wrong</span>
    </div>
  )
}

interface ToolResultRendererProps {
  part: any
} // eslint-disable-line @typescript-eslint/no-explicit-any

export function ToolResultRenderer({ part }: ToolResultRendererProps) {
  if (part.state === 'input-streaming' || part.state === 'input-available')
    return <ToolLoadingCard toolName={part.toolName} />
  if (part.state === 'output-error') return <ToolErrorCard />
  if (part.state === 'output-available') {
    if (part.toolName === 'navigate_to_page' && part.output) {
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
    const Card = TOOL_CARD_MAP[part.toolName]
    if (!Card)
      return (
        <pre className="my-1 overflow-x-auto rounded-lg bg-bg-elevated/50 p-2 font-mono text-xs text-text-secondary">
          {JSON.stringify(part.output, null, 2)}
        </pre>
      )
    return <Card data={part.output} />
  }
  return null
}

export default ToolResultRenderer
