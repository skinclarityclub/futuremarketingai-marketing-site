export type ChatFailure =
  | { kind: 'rate-limit'; minutes: number }
  | { kind: 'rejected'; reason: 'personal' | 'too-long' }
  | { kind: 'failed' }

// The AI SDK throws the raw response body as the Error message on a non-2xx,
// so the 429 body from engine.ts (resetAt = ms timestamp) arrives as a JSON string.
export function classifyChatError(error: Error | undefined, now = Date.now()): ChatFailure | null {
  if (!error) return null
  try {
    const body = JSON.parse(error.message)
    if (body?.error === 'Rate limit exceeded') {
      const minutes =
        typeof body.resetAt === 'number' ? Math.max(1, Math.ceil((body.resetAt - now) / 60000)) : 1
      return { kind: 'rate-limit', minutes }
    }
    // security.ts validation reasons (English, engine.ts answers them with a 400):
    // retrying resends the same text, so these get their own non-retry line.
    // Any other body stays 'failed' on purpose: only the two known prefixes are rejections.
    if (typeof body?.error === 'string') {
      if (body.error.startsWith("Please don't share personal information"))
        return { kind: 'rejected', reason: 'personal' }
      if (body.error.startsWith('Message too long')) return { kind: 'rejected', reason: 'too-long' }
    }
  } catch {
    // not JSON: a network or server error
  }
  return { kind: 'failed' }
}
