import type { ComponentType } from 'react'
import { AlertCircle } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { LeadScoreCard } from './LeadScoreCard'
import { KBArticleCard } from './KBArticleCard'
import { TicketCard } from './TicketCard'
import { ServiceCard } from './ServiceCard'

// Re-export all cards
export { ProductCard, LeadScoreCard, KBArticleCard, TicketCard, ServiceCard }
export type { ProductCardData } from './ProductCard'
export type { LeadScoreData } from './LeadScoreCard'
export type { KBArticleData } from './KBArticleCard'
export type { TicketData } from './TicketCard'
export type { ServiceCardData } from './ServiceCard'

// ---------------------------------------------------------------------------
// Tool name -> Card component mapping
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TOOL_CARD_MAP: Record<string, ComponentType<{ data: any }>> = {
  // E-commerce persona
  search_products: ProductCard,
  get_product_details: ProductCard,
  build_routine: ProductCard,
  add_to_cart_suggestion: ProductCard,
  // Lead-gen persona
  qualify_lead: LeadScoreCard,
  get_roi_estimate: LeadScoreCard,
  get_pricing_info: ServiceCard,
  schedule_demo: ServiceCard,
  // Support persona
  search_knowledge_base: KBArticleCard,
  create_ticket: TicketCard,
  check_status: TicketCard,
  escalate_to_human: TicketCard,
  // Concierge persona
  get_services: ServiceCard,
  get_case_study: ServiceCard,
  navigate_to_page: ServiceCard,
  book_call: ServiceCard,
  // Demo-guide persona
  explain_module: ServiceCard,
  get_roi_info: LeadScoreCard,
  book_demo: ServiceCard,
}

// ---------------------------------------------------------------------------
// ToolLoadingCard — skeleton while tool executes
// ---------------------------------------------------------------------------
function ToolLoadingCard({ toolName }: { toolName: string }) {
  return (
    <div className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
      <p className="animate-pulse font-mono text-xs text-text-secondary">Loading {toolName}...</p>
      <div className="mt-2 h-16 animate-pulse rounded-lg bg-bg-elevated/50" />
    </div>
  )
}

// ---------------------------------------------------------------------------
// ToolErrorCard — error state
// ---------------------------------------------------------------------------
function ToolErrorCard() {
  return (
    <div className="my-2 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
      <span className="text-xs text-red-400">Something went wrong</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ToolResultRenderer — routes tool invocation parts to correct card
// ---------------------------------------------------------------------------
interface ToolResultRendererProps {
  // ToolInvocationUIPart from AI SDK — use any to avoid tight coupling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  part: any
}

export function ToolResultRenderer({ part }: ToolResultRendererProps) {
  // Loading states
  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return <ToolLoadingCard toolName={part.toolName} />
  }

  // Error state
  if (part.state === 'output-error') {
    return <ToolErrorCard />
  }

  // Output available — route to correct card
  if (part.state === 'output-available') {
    const Card = TOOL_CARD_MAP[part.toolName]
    if (!Card) {
      // Unknown tool — render raw JSON as fallback
      return (
        <pre className="my-1 overflow-x-auto rounded-lg bg-bg-elevated/50 p-2 font-mono text-xs text-text-secondary">
          {JSON.stringify(part.output, null, 2)}
        </pre>
      )
    }
    return <Card data={part.output} />
  }

  return null
}

export default ToolResultRenderer
