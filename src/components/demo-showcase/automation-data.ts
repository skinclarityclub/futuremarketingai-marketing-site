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
    outcomeMetric: '50-70% meer gekwalificeerde leads',
    before: {
      title: 'Handmatige lead triage',
      items: [
        'Sales rep beoordeelt elke lead handmatig',
        '4+ uur/dag besteed aan ongekwalificeerde prospects',
        'Warme leads wachten uren op eerste contact',
        'Geen consistente scoringscriteria binnen het team',
      ],
      metric: '4 uur/dag',
      metricLabel: 'Verspild aan ongekwalificeerde leads',
    },
    after: {
      title: 'AI-gestuurde lead intelligentie',
      items: [
        'Elke lead realtime gescoord bij binnenkomst',
        'Top prospects direct naar de juiste rep gerouteerd',
        'Responstijd daalt van uren naar minuten',
        'Consistente AI-scoring op basis van uw conversiedata',
      ],
      metric: '30 min/dag',
      metricLabel: 'Bekijken van voorgekwalificeerde leads',
    },
    workflow: [
      { icon: Database, label: 'Lead komt binnen', detail: 'Formulier, ad of referral' },
      { icon: Zap, label: 'AI scoort lead', detail: 'Op basis van fit-signalen' },
      { icon: UserCheck, label: 'Route naar rep', detail: 'Beste match voor deal' },
      { icon: Bell, label: 'Direct alert', detail: 'Slack + CRM update' },
    ],
  },
  {
    id: 'sales-sequences',
    title: 'Sales Follow-up Sequences',
    outcomeMetric: '320% meer omzet uit email',
    before: {
      title: 'Handmatige opvolging chaos',
      items: [
        'Reps vergeten op te volgen na 2e email',
        'Hetzelfde generieke bericht naar elke prospect',
        'Geen tracking van opens, kliks of reacties',
        '79% van leads converteert nooit door gebrek aan opvolging',
      ],
      metric: '79%',
      metricLabel: 'Leads verloren door geen opvolging',
    },
    after: {
      title: 'Adaptieve AI-sequences',
      items: [
        'Gepersonaliseerde opvolgingen automatisch verstuurd',
        'Past aan op basis van gedrag (opens, kliks)',
        'Warme leads direct geëscaleerd naar sales',
        'Elke lead krijgt het juiste bericht op het juiste moment',
      ],
      metric: '3.2x',
      metricLabel: 'Meer omzet uit geautomatiseerde email',
    },
    workflow: [
      { icon: Send, label: 'Eerste outreach', detail: 'Gepersonaliseerd door AI' },
      { icon: Mail, label: 'Gedrag getrackt', detail: 'Opens, kliks, reacties' },
      { icon: Zap, label: 'AI past sequence aan', detail: 'Volgende beste actie' },
      { icon: UserCheck, label: 'Warme lead naar sales', detail: 'Of nurture gaat door' },
    ],
  },
  {
    id: 'appointment-scheduling',
    title: 'Appointment Scheduling & No-shows',
    outcomeMetric: '50% minder no-shows',
    before: {
      title: 'Email pingpong',
      items: [
        '5+ emails heen en weer om een tijd te vinden',
        'Gemiddeld 3 dagen om één meeting te boeken',
        '20-30% no-show rate vreet aan omzet',
        'Geen automatische herinneringen of bevestigingen',
      ],
      metric: '20-30%',
      metricLabel: 'Omzet verloren aan no-shows',
    },
    after: {
      title: 'Eén-klik boeking + slimme herinneringen',
      items: [
        'Prospect kiest een tijd in 10 seconden',
        'Automatische bevestiging + 3 herinneringsmomenten',
        'No-show rate daalt naar 5-10%',
        'Herplannen automatisch afgehandeld',
      ],
      metric: '10 sec',
      metricLabel: 'Van klik tot geboekte meeting',
    },
    workflow: [
      { icon: Calendar, label: 'Prospect klikt link', detail: 'Eén-stap boeking' },
      { icon: Clock, label: 'Auto-bevestiging', detail: 'Direct email + SMS' },
      { icon: Bell, label: 'Slimme herinneringen', detail: '-24u, -2u, -15min' },
      { icon: BarChart3, label: 'Analytics getrackt', detail: 'Opkomst, herplanningen' },
    ],
  },
]
