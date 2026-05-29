import type { PersonaConfig } from './types'
import type { Tool } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'
import { getPersona } from './persona-router'
import { buildFlagshipTools } from './tools/flagship-tools'
import type { ChatbotLocale } from './tool-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyToolRecord = Record<string, Tool<any, any>>

const FLAGSHIP_PERSONA_IDS = new Set(['clyde', 'flagship'])

/**
 * Returns AI SDK tool() definitions for a persona, built for the given locale so
 * card-producing tools render in the visitor's language. Clyde uses the flagship
 * tool set; 'flagship' is kept as an alias for the persisted store.
 */
export function createPersonaTools(
  persona: PersonaConfig,
  locale: ChatbotLocale = 'nl'
): AnyToolRecord {
  return FLAGSHIP_PERSONA_IDS.has(persona.id) ? buildFlagshipTools(locale) : {}
}

/**
 * Manual tool execution path (backup if streamText auto-execution is not used).
 * Validates tool availability by persona before executing.
 */
export async function executeToolCall(
  personaId: string,
  toolName: string,
  args: unknown
): Promise<unknown> {
  const persona = getPersona(personaId)

  if (!(toolName in persona.tools)) {
    throw new Error(`Tool ${toolName} not available for persona ${personaId}`)
  }

  const tools = FLAGSHIP_PERSONA_IDS.has(personaId) ? buildFlagshipTools('nl') : undefined
  if (!tools || !(toolName in tools)) {
    return { error: `Tool ${toolName} not implemented for persona ${personaId}` }
  }

  const toolDef = tools[toolName]
  if (toolDef && 'execute' in toolDef && typeof toolDef.execute === 'function') {
    return (toolDef.execute as (args: unknown) => Promise<unknown>)(args)
  }

  return { error: `Tool ${toolName} has no execute handler` }
}

/**
 * Reference implementation showing the AI SDK tool() + Zod pattern.
 * Phase 16 implementers use this as a template for real tool definitions.
 */
export const DEMO_TOOL = tool({
  description: 'A demo tool that echoes input — shows the AI SDK tool() pattern',
  inputSchema: z.object({
    input: z.string().describe('The text to echo back'),
  }),
  execute: async ({ input }) => ({
    echo: input,
    timestamp: new Date().toISOString(),
  }),
})
