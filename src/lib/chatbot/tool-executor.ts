import type { PersonaConfig } from './types'
import { tool } from 'ai'
import { z } from 'zod'
import { getPersona } from './persona-router'

/**
 * Factory that takes a PersonaConfig and returns AI SDK tool() wrapped versions.
 * Phase 15: returns empty record. Phase 16 fills in actual tool definitions.
 */
export function createPersonaTools(
  _persona: PersonaConfig
): Record<string, ReturnType<typeof tool>> {
  // Actual tool definitions come in Phase 16 per persona
  return {}
}

/**
 * Manual tool execution path (backup if streamText auto-execution is not used).
 * Validates tool availability by persona before executing.
 * Phase 15: returns stub. Phase 16 fills in actual handlers.
 */
export async function executeToolCall(
  personaId: string,
  toolName: string,
  _args: unknown
): Promise<unknown> {
  const persona = getPersona(personaId)

  if (!(toolName in persona.tools)) {
    throw new Error(`Tool ${toolName} not available for persona ${personaId}`)
  }

  // Phase 16 fills in actual tool execution handlers
  return { error: 'Tool execution not yet implemented' }
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
