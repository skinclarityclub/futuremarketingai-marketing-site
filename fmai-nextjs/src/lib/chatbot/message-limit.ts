export const MESSAGE_LIMIT = 15

// Warn only in the last 3 messages; at the limit the widget blocks instead.
export function limitState(count: number, limit = MESSAGE_LIMIT) {
  const remaining = Math.max(0, limit - count)
  return { remaining, warn: remaining > 0 && remaining <= 3, atLimit: remaining === 0 }
}
