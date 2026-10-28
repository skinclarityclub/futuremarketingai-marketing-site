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
  // numbers the visitor typed, per unit; a number the model passes as stated must be one of them
  said: Said
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
  return { profile: {}, offered: false, offerEnabled: false, said: { hours: [], brands: [], people: [] } }
}

// The word right after a number gives its unit (Codex R1: in "8 mensen, 6 merken" the 6
// passed as hours, so 48 = 6 x 8 reached the card as team hours). A Dutch head may carry a
// prefix from this closed list ("marketinguren", "teamleden", "skincare-merken"); u, h and man
// never do. Open prefixes read "facturen" as hours and "keurmerken" or "CE-merken" as brands (Codex R3, R4).
const COMPOUND_PREFIX = String.raw`(?:(?:klant|marketing|team|werk|man|kantoor|skincare|beauty)-?)?`
const UNIT_WORDS: Record<keyof Said, { compound: string; bare: string }> = {
  hours: { compound: 'uur|uren', bare: 'u|h|hrs?|hours?|horas?' },
  brands: { compound: 'merken|merk|klanten|klant', bare: 'brands?|clients?|marcas?|clientes?' },
  people: {
    compound: "mensen|personen|medewerkers?|collega'?s|leden",
    bare: 'man|fte|persoon|people|persons?|employees|staff|personas?|empleados?',
  },
}

export type Said = { hours: number[]; brands: number[]; people: number[] }

/**
 * Numbers the visitor typed in this conversation, by the unit written after them (paid
 * test 10-28: the model passed "10 uur" the visitor never said, and the card turned it into euros).
 * shortcut: digits plus a unit word only, so "veertig uur", "team van 8" or "8 vaste klanten" is asked again; upgrade to an evidence quote if that bothers visitors.
 */
export function unitsSaid(messages: unknown): Said {
  const texts = !Array.isArray(messages)
    ? []
    : messages.flatMap((msg) => {
        const m = msg as { role?: unknown; parts?: unknown }
        if (m?.role !== 'user' || !Array.isArray(m.parts)) return []
        return m.parts.flatMap((part) => {
          const p = part as { type?: unknown; text?: unknown }
          return p?.type === 'text' && typeof p.text === 'string' ? [p.text] : []
        })
      })
  // A number starts a whole token (not the 30 of "14:30", the 1 of "4e1" or "4e+1", never
  // mid-digits, which also keeps a long digit run linear: Codex R2-R4) and the unit ends one
  // ("H&M" is no hour). Built per call, not at import, because the browser loads this module.
  const read = ({ compound, bare }: { compound: string; bare: string }) => {
    const re = new RegExp(
      String.raw`(?<![\p{L}\p{N}_.,:+-])(\d+(?:[.,]\d+)?)\s*(?:${COMPOUND_PREFIX}(?:${compound})|(?:${bare}))(?![\p{L}\p{N}_&'’-])`,
      'giu',
    )
    const found = texts.flatMap((t) => [...t.matchAll(re)].map((m) => Number(m[1].replace(',', '.'))))
    // A real chat types a handful; the cap bounds the hours x people search on a forged history (Codex R3).
    return [...new Set(found)].slice(-50)
  }
  return { hours: read(UNIT_WORDS.hours), brands: read(UNIT_WORDS.brands), people: read(UNIT_WORDS.people) }
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
    said: unitsSaid(messages),
  }
}
