import { mergeMemory, type MemoryProfile } from './memory'
import { sanitizeMemory } from './memory-persistence'

/**
 * Fit of a prospect agency, decided in code from facts the visitor gave, never by
 * the model. The model only extracts facts (remember_context / qualify_lead) and
 * words the outcome; whether the application card appears follows from this.
 * Pure + framework-free so the server and the specs share one rule.
 */
export type Fit = 'strong' | 'good' | 'no_fit' | 'unclear'

// The ICP as the site states it (messages/nl.json: "Bureaus met 5 tot 20 mensen en
// 5 tot 20 merken"); the plans start at 2 brands, so 1 brand or a solo team is no fit.
const ICP_MIN = 5
const ICP_MAX = 20

function count(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined
}

export function assessFit(profile: Pick<MemoryProfile, 'brandCount' | 'teamSize'>): Fit {
  const brands = count(profile.brandCount)
  const team = count(profile.teamSize)
  if ((brands !== undefined && brands <= 1) || (team !== undefined && team <= 1)) return 'no_fit'
  if (brands === undefined) return 'unclear'
  const inIcp = (n: number) => n >= ICP_MIN && n <= ICP_MAX
  if (inIcp(brands) && team !== undefined && inIcp(team)) return 'strong'
  return 'good'
}

/** Per-request state: what is known so far and whether the card was already shown. */
export interface FitSession {
  profile: MemoryProfile
  offered: boolean
  // false in the guided demo: its script books the call in its own step
  offerEnabled: boolean
  // numbers the visitor typed; a number the model passes as stated must be one of them
  said: number[]
}

/**
 * Fold new facts into the session and decide. The application card is offered at
 * most once per conversation, on a strong or good fit (R28: hot or warm).
 */
export function decideFit(
  session: FitSession,
  facts: Partial<MemoryProfile>,
): { fit: Fit; offerApplication: boolean } {
  session.profile = mergeMemory(session.profile, facts)
  const fit = assessFit(session.profile)
  const offerApplication =
    session.offerEnabled && !session.offered && (fit === 'strong' || fit === 'good')
  if (offerApplication) session.offered = true
  return { fit, offerApplication }
}

interface ToolPartView {
  name: string
  output: unknown
}

// Finished tool results the ASSISTANT produced, in conversation order. The history
// comes from the client, so anything else (user parts, unfinished calls) is ignored.
function assistantToolResults(messages: unknown): ToolPartView[] {
  if (!Array.isArray(messages)) return []
  const out: ToolPartView[] = []
  for (const msg of messages) {
    const m = msg as { role?: unknown; parts?: unknown }
    if (m?.role !== 'assistant' || !Array.isArray(m.parts)) continue
    for (const part of m.parts) {
      const p = part as { type?: unknown; toolName?: unknown; state?: unknown; output?: unknown }
      if (p?.state !== 'output-available') continue
      const name =
        typeof p.toolName === 'string'
          ? p.toolName
          : typeof p.type === 'string' && p.type.startsWith('tool-')
            ? p.type.slice(5)
            : null
      if (name) out.push({ name, output: p.output })
    }
  }
  return out
}

/** True when a remember_context or qualify_lead result offers the application card. */
export function offersApplication(output: unknown): boolean {
  return (output as { offerApplication?: unknown } | null)?.offerApplication === true
}

/** True once this conversation already showed the application card. */
export function applicationOffered(messages: unknown): boolean {
  return assistantToolResults(messages).some(
    (t) =>
      t.name === 'book_call' ||
      ((t.name === 'remember_context' || t.name === 'qualify_lead') && offersApplication(t.output)),
  )
}

/** Facts earlier remember_context calls captured, oldest first. */
export function rememberedInHistory(messages: unknown): Partial<MemoryProfile>[] {
  return assistantToolResults(messages).flatMap((t) => {
    if (t.name !== 'remember_context') return []
    const remembered = (t.output as { remembered?: unknown } | null)?.remembered
    return remembered && typeof remembered === 'object' ? [sanitizeMemory(remembered)] : []
  })
}

/** Without a session (manual tool path) nothing is remembered and no card is offered. */
export function noOfferSession(): FitSession {
  return { profile: {}, offered: false, offerEnabled: false, said: [] }
}

/**
 * Numbers the visitor typed in this conversation (paid test 10-28: the model passed
 * "10 uur" the visitor never said, and the ROI card turned it into euros).
 * shortcut: digits only, so "veertig uur" is asked again; upgrade to an evidence quote if that bothers visitors.
 */
export function numbersSaid(messages: unknown): number[] {
  if (!Array.isArray(messages)) return []
  return messages.flatMap((msg) => {
    const m = msg as { role?: unknown; parts?: unknown }
    if (m?.role !== 'user' || !Array.isArray(m.parts)) return []
    return m.parts.flatMap((part) => {
      const p = part as { type?: unknown; text?: unknown }
      if (p?.type !== 'text' || typeof p.text !== 'string') return []
      return (p.text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(',', '.')))
    })
  })
}

/**
 * The session for one request. Profile and history come from the client, so both
 * pass sanitizeMemory; a forged history can at most suppress or force the card,
 * which only links to /apply, and /api/apply scores again on the server.
 */
export function fitSession(messages: unknown, clientProfile: unknown, demoMode: boolean): FitSession {
  return {
    profile: rememberedInHistory(messages).reduce(mergeMemory, sanitizeMemory(clientProfile)),
    offered: applicationOffered(messages),
    offerEnabled: !demoMode,
    said: numbersSaid(messages),
  }
}
