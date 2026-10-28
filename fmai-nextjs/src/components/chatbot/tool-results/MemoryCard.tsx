import type { MemoryProfile } from '@/lib/chatbot/memory'

// Field labels for the memory sheet (the card itself is now the one-line RememberedLine).
export type Loc = 'nl' | 'en' | 'es'
export function loc(value: string): Loc {
  return value === 'en' || value === 'es' ? value : 'nl'
}

export const FIELD_LABELS: Record<Loc, Record<keyof MemoryProfile, string>> = {
  nl: {
    agencyName: 'Bureau',
    niche: 'Niche',
    brandCount: 'Merken',
    teamSize: 'Teamgrootte',
    painPoint: 'Pijnpunt',
    goal: 'Doel',
  },
  en: {
    agencyName: 'Agency',
    niche: 'Niche',
    brandCount: 'Brands',
    teamSize: 'Team size',
    painPoint: 'Pain point',
    goal: 'Goal',
  },
  es: {
    agencyName: 'Agencia',
    niche: 'Nicho',
    brandCount: 'Marcas',
    teamSize: 'Tamaño del equipo',
    painPoint: 'Punto de dolor',
    goal: 'Objetivo',
  },
}
