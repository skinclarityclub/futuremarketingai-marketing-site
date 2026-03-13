import type { PersonaConfig } from './types'
import type { Tool } from 'ai'
import { tool } from 'ai'
import { z } from 'zod'
import { getPersona } from './persona-router'
import { conciergeTools } from './tools/concierge-tools'
import { ecommerceTools } from './tools/ecommerce-tools'
import { leadgenTools } from './tools/leadgen-tools'
import { supportTools } from './tools/support-tools'
import { demoGuideTools } from './tools/demo-guide-tools'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyToolRecord = Record<string, Tool<any, any>>

/**
 * Maps persona ID to its AI SDK tool definitions.
 * Uses Tool<any, any> because each persona has differently-typed tool schemas.
 */
const PERSONA_TOOLS: Record<string, AnyToolRecord> = {
  concierge: conciergeTools,
  ecommerce: ecommerceTools,
  leadgen: leadgenTools,
  support: supportTools,
  'demo-guide': demoGuideTools,
}

/**
 * Factory that takes a PersonaConfig and returns AI SDK tool() wrapped versions.
 */
export function createPersonaTools(persona: PersonaConfig): AnyToolRecord {
  return PERSONA_TOOLS[persona.id] ?? {}
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

  const tools = PERSONA_TOOLS[personaId]
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
