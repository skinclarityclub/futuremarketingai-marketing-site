import type { ChatLocale } from './useChatChrome'
import type { MemoryProfile } from '@/lib/chatbot/memory'

/**
 * A localized "welcome back" greeting derived from the persisted profile, or null
 * when there is not enough to personalize (no agencyName). Used client-side as the
 * chat's opening bubble for a returning visitor, so it stays free of API calls.
 * Plain commas/periods only (no em-dashes per brand copy rules).
 */
export function welcomeBackMessage(locale: ChatLocale, p: MemoryProfile): string | null {
  if (!p.agencyName) return null
  const brands =
    p.brandCount != null && p.niche
      ? {
          nl: `${p.brandCount} ${p.niche}-merken`,
          en: `${p.brandCount} ${p.niche} brands`,
          es: `${p.brandCount} marcas de ${p.niche}`,
        }[locale]
      : null
  if (locale === 'en') {
    return brands
      ? `Welcome back. Still ${brands} at ${p.agencyName}? What can I work on?`
      : `Welcome back, ${p.agencyName}. What can I work on?`
  }
  if (locale === 'es') {
    return brands
      ? `Bienvenido de nuevo. ¿Sigues con ${brands} en ${p.agencyName}? ¿En qué trabajo?`
      : `Bienvenido de nuevo, ${p.agencyName}. ¿En qué trabajo?`
  }
  return brands
    ? `Welkom terug. Nog steeds ${brands} bij ${p.agencyName}? Waar wil je verder?`
    : `Welkom terug, ${p.agencyName}. Waar wil je verder?`
}
