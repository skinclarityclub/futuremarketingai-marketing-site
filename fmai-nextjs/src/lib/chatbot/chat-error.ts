export type ChatFailure = { kind: 'rate-limit'; minutes: number } | { kind: 'failed' }

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
  } catch {
    // not JSON: a network or server error
  }
  return { kind: 'failed' }
}
