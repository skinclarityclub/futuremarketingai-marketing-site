'use client'

import { motion } from 'motion/react'
import { Ticket, Clock, AlertTriangle, CheckCircle, ArrowUpCircle, Headphones } from 'lucide-react'

export interface TicketData {
  ticketId: string
  status?: string
  category?: string
  priority?: string
  summary?: string
  subject?: string
  description?: string
  createdAt?: string
  estimatedResponse?: string
  escalated?: boolean
  agent?: string
  department?: string
  action?: string
  message?: string
  estimatedWait?: string
  reason?: string
}

function statusConfig(status: string) {
  switch (status) {
    case 'open':
      return { class: 'bg-accent-system/20 text-accent-system', icon: Ticket, label: 'Open' }
    case 'in-progress':
      return { class: 'bg-accent-human/20 text-accent-human', icon: Clock, label: 'In Progress' }
    case 'resolved':
      return { class: 'bg-green-500/20 text-green-400', icon: CheckCircle, label: 'Resolved' }
    case 'escalated':
      return { class: 'bg-amber-500/20 text-amber-400', icon: ArrowUpCircle, label: 'Escalated' }
    case 'closed':
      return {
        class: 'bg-text-secondary/20 text-text-secondary',
        icon: CheckCircle,
        label: 'Closed',
      }
    default:
      return { class: 'bg-text-secondary/20 text-text-secondary', icon: Ticket, label: status }
  }
}

function priorityConfig(priority: string) {
  switch (priority) {
    case 'urgent':
      return { class: 'text-red-400 bg-red-500/15', dot: 'bg-red-400' }
    case 'high':
      return { class: 'text-amber-400 bg-amber-500/15', dot: 'bg-amber-400' }
    case 'medium':
      return { class: 'text-accent-human bg-accent-human/15', dot: 'bg-accent-human' }
    default:
      return { class: 'text-text-secondary bg-text-secondary/15', dot: 'bg-text-secondary' }
  }
}

export function TicketCard({ data }: { data: TicketData }) {
  const isEscalated = data.escalated || data.action === 'escalate'
  const estimatedResponse = data.estimatedResponse || data.estimatedWait
  const summaryText = data.summary || data.reason || data.message
  const statusCfg = statusConfig(data.status || (isEscalated ? 'escalated' : 'open'))
  const StatusIcon = statusCfg.icon
  const isHighPriority = data.priority === 'high' || data.priority === 'urgent'
  const prioCfg = data.priority ? priorityConfig(data.priority) : null

  if (isEscalated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-3"
      >
        <div className="rounded-xl bg-gradient-to-br from-accent-human/15 to-accent-secondary/10 border border-accent-human/20 p-4">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-accent-human" />
            <p className="font-sans text-sm font-semibold text-text-primary">
              Escalated to Human Agent
            </p>
          </div>
          {data.agent && (
            <p className="mt-1.5 text-xs text-text-secondary">
              Agent: <span className="font-medium text-text-primary">{data.agent}</span>
            </p>
          )}
          {data.department && (
            <p className="text-xs text-text-secondary">
              Department: <span className="font-medium text-text-primary">{data.department}</span>
            </p>
          )}
          {summaryText && (
            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{summaryText}</p>
          )}
          {estimatedResponse && (
            <p className="mt-2 text-xs text-accent-system">
              Estimated response: {estimatedResponse}
            </p>
          )}
        </div>
        {data.ticketId && (
          <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-text-secondary">Ticket #{data.ticketId}</span>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-xs font-bold ${statusCfg.class}`}
              >
                {statusCfg.label}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-3"
    >
      <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="h-4 w-4 text-accent-system" />
            <span className="font-mono text-sm font-bold text-text-primary">#{data.ticketId}</span>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${statusCfg.class}`}
          >
            {statusCfg.label}
          </span>
        </div>
        {prioCfg && (
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${prioCfg.class}`}
            >
              {isHighPriority && <AlertTriangle className="h-3 w-3" />}
              {data.priority}
            </span>
            {data.category && <span className="text-xs text-text-secondary">{data.category}</span>}
          </div>
        )}
      </div>
      {(data.subject || summaryText || data.description) && (
        <div className="rounded-xl border border-border-primary bg-bg-elevated/80 p-3">
          {data.subject && (
            <p className="font-sans text-xs font-semibold text-text-primary">{data.subject}</p>
          )}
          {(summaryText || data.description) && (
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              {summaryText || data.description}
            </p>
          )}
        </div>
      )}
      <div className="flex items-center gap-4 px-1">
        {data.createdAt && (
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <Clock className="h-3 w-3" />
            Created: {data.createdAt}
          </div>
        )}
        {estimatedResponse && (
          <div className="flex items-center gap-1.5 text-xs text-accent-system">
            <Clock className="h-3 w-3" />
            ETA: {estimatedResponse}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default TicketCard
