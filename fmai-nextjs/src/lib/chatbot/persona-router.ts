import type { PersonaConfig } from './types'

const PERSONA_REGISTRY = new Map<string, PersonaConfig>()

export function registerPersona(config: PersonaConfig): void {
  if (!config.id || typeof config.id !== 'string') {
    throw new Error('PersonaConfig.id must be a non-empty string')
  }
  if (!config.staticPrefix || typeof config.staticPrefix !== 'string') {
    throw new Error('PersonaConfig.staticPrefix must be a non-empty string')
  }
  PERSONA_REGISTRY.set(config.id, config)
}

export function getPersona(personaId: string): PersonaConfig {
  const config = PERSONA_REGISTRY.get(personaId)
  if (!config) {
    const available: string[] = []
    PERSONA_REGISTRY.forEach((_value, key) => {
      available.push(key)
    })
    throw new Error(`Persona not found: ${personaId}. Available: ${available.join(', ')}`)
  }
  return config
}

export function hasPersona(personaId: string): boolean {
  return PERSONA_REGISTRY.has(personaId)
}

export function getRegisteredPersonaIds(): string[] {
  const ids: string[] = []
  PERSONA_REGISTRY.forEach((_value, key) => {
    ids.push(key)
  })
  return ids
}
