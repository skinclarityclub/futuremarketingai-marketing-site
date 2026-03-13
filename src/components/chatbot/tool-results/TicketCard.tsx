export interface TicketData {
  ticketId: string
  status: string
  category?: string
  priority?: string
  summary?: string
  createdAt?: string
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-accent-system/20 text-accent-system'
    case 'in-progress':
      return 'bg-accent-human/20 text-accent-human'
    case 'resolved':
      return 'bg-green-500/20 text-green-400'
    case 'closed':
      return 'bg-text-secondary/20 text-text-secondary'
    default:
      return 'bg-text-secondary/20 text-text-secondary'
  }
}

export function TicketCard({ data }: { data: TicketData }) {
  const isHighPriority = data.priority === 'high' || data.priority === 'urgent'

  return (
    <div
      className="my-2 w-full rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md transition-colors duration-200 hover:border-accent-system/30"
      style={{ animation: 'fadeIn 0.3s ease-in' }}
    >
      {/* Header row: Ticket ID + Status */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-text-secondary">#{data.ticketId}</span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-xs ${statusBadgeClass(data.status)}`}
        >
          {data.status}
        </span>
      </div>

      {/* Priority + Category */}
      <div className="mt-2 flex items-center gap-2">
        {isHighPriority && <span className="font-mono text-xs text-red-400">{data.priority}</span>}
        {data.category && <span className="text-xs text-text-secondary">{data.category}</span>}
      </div>

      {/* Summary */}
      {data.summary && <p className="mt-1 text-xs text-text-secondary">{data.summary}</p>}

      {/* Created date */}
      {data.createdAt && (
        <p className="mt-2 font-mono text-xs text-text-secondary/50">{data.createdAt}</p>
      )}
    </div>
  )
}

export default TicketCard
