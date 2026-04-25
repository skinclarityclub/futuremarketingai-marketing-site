import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { MAX_PARTNERS_PER_YEAR } from '@/lib/constants'

/**
 * Globally-substituted ICU placeholders.
 *
 * next-intl 4.x removed `defaultTranslationValues`, so we pre-substitute
 * a small set of app-wide constants into the message catalog at config
 * time. Every t() call site for these keys gets the substituted value
 * without prop-drilling.
 *
 * Add new globals here when they are app-wide constants (not page-local).
 */
const GLOBAL_PLACEHOLDERS: Record<string, string | number> = {
  maxPartners: MAX_PARTNERS_PER_YEAR,
}

/**
 * Walk every string value in a JSON-shaped object tree and replace
 * `{placeholder}` tokens that match GLOBAL_PLACEHOLDERS keys.
 * Page-local ICU args (`{taken}`, `{total}`, `{count}`, etc.) are left
 * untouched so per-call-site interpolation continues to work.
 */
function substituteGlobals(node: unknown): unknown {
  if (typeof node === 'string') {
    let out = node
    for (const [key, value] of Object.entries(GLOBAL_PLACEHOLDERS)) {
      // Match `{key}` exactly. ICU spec disallows whitespace inside the braces
      // for simple replacement patterns, so a literal token match is safe.
      const token = `{${key}}`
      if (out.includes(token)) {
        out = out.split(token).join(String(value))
      }
    }
    return out
  }
  if (Array.isArray(node)) {
    return node.map(substituteGlobals)
  }
  if (node && typeof node === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node)) {
      result[key] = substituteGlobals(value)
    }
    return result
  }
  return node
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }
  const rawMessages = (await import(`../../messages/${locale}.json`)).default
  return {
    locale,
    messages: substituteGlobals(rawMessages) as typeof rawMessages,
  }
})
