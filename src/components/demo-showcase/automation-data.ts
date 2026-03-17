import {
  Database,
  Mail,
  Calendar,
  UserCheck,
  Send,
  Clock,
  Bell,
  BarChart3,
  Zap,
} from 'lucide-react'
import type { WorkflowStep } from './AnimatedWorkflow'

export interface AutomationUseCase {
  id: string
  title: string
  outcomeMetric: string
  before: {
    title: string
    items: string[]
    metric: string
    metricLabel: string
  }
  after: {
    title: string
    items: string[]
    metric: string
    metricLabel: string
  }
  workflow: WorkflowStep[]
}

export const automationUseCases: AutomationUseCase[] = [
  {
    id: 'lead-scoring',
    title: 'Lead Scoring & Routing',
    outcomeMetric: '50-70% more qualified leads',
    before: {
      title: 'Manual lead triage',
      items: [
        'Sales rep reviews every lead manually',
        '4+ hours/day sorting through unqualified prospects',
        'Hot leads wait hours before first contact',
        'No consistent scoring criteria across team',
      ],
      metric: '4 hrs/day',
      metricLabel: 'Wasted on unqualified leads',
    },
    after: {
      title: 'AI-powered lead intelligence',
      items: [
        'Every lead scored in real-time on entry',
        'Top prospects routed to the right rep instantly',
        'Response time drops from hours to minutes',
        'Consistent AI scoring based on your conversion data',
      ],
      metric: '30 min/day',
      metricLabel: 'Reviewing pre-qualified leads',
    },
    workflow: [
      { icon: Database, label: 'Lead enters CRM', detail: 'Form, ad, or referral' },
      { icon: Zap, label: 'AI scores lead', detail: 'Based on fit signals' },
      { icon: UserCheck, label: 'Route to rep', detail: 'Best match for deal' },
      { icon: Bell, label: 'Instant alert', detail: 'Slack + CRM update' },
    ],
  },
  {
    id: 'sales-sequences',
    title: 'Sales Follow-up Sequences',
    outcomeMetric: '320% more revenue from email',
    before: {
      title: 'Manual follow-up chaos',
      items: [
        'Reps forget to follow up after 2nd email',
        'Same generic message to every prospect',
        'No tracking of opens, clicks, or replies',
        '79% of leads never convert due to lack of follow-up',
      ],
      metric: '79%',
      metricLabel: 'Leads lost to no follow-up',
    },
    after: {
      title: 'Adaptive AI sequences',
      items: [
        'Personalized follow-ups sent automatically',
        'Adapts based on recipient behavior (opens, clicks)',
        'Hot leads escalated to sales immediately',
        'Every lead gets the right message at the right time',
      ],
      metric: '3.2x',
      metricLabel: 'More revenue from automated email',
    },
    workflow: [
      { icon: Send, label: 'Initial outreach', detail: 'Personalized by AI' },
      { icon: Mail, label: 'Behavior tracked', detail: 'Opens, clicks, replies' },
      { icon: Zap, label: 'AI adapts sequence', detail: 'Next best action' },
      { icon: UserCheck, label: 'Hot lead to sales', detail: 'Or nurture continues' },
    ],
  },
  {
    id: 'appointment-scheduling',
    title: 'Appointment Scheduling & No-shows',
    outcomeMetric: '50% fewer no-shows',
    before: {
      title: 'Email ping-pong',
      items: [
        '5+ emails back and forth to find a time',
        '3 days average to book one meeting',
        '20-30% no-show rate eats into revenue',
        'No automated reminders or confirmations',
      ],
      metric: '20-30%',
      metricLabel: 'Revenue lost to no-shows',
    },
    after: {
      title: 'One-click booking + smart reminders',
      items: [
        'Prospect picks a time in 10 seconds',
        'Automated confirmation + 3 reminder touchpoints',
        'No-show rate drops to 5-10%',
        'Rescheduling handled automatically',
      ],
      metric: '10 sec',
      metricLabel: 'From click to booked meeting',
    },
    workflow: [
      { icon: Calendar, label: 'Prospect clicks link', detail: 'One-step booking' },
      { icon: Clock, label: 'Auto-confirmation', detail: 'Instant email + SMS' },
      { icon: Bell, label: 'Smart reminders', detail: '-24h, -2h, -15min' },
      { icon: BarChart3, label: 'Analytics tracked', detail: 'Show rates, reschedules' },
    ],
  },
]
