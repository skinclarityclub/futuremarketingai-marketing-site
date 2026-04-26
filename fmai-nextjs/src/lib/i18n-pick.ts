/**
 * pick — extract a subset of top-level keys from an object.
 *
 * Used to scope next-intl message namespaces passed to NextIntlClientProvider:
 * the full message tree stays server-side via getMessages(), but only a curated
 * subset is serialized into the RSC hydration payload.
 *
 * Avoids a lodash dependency (~70 KB ghost for one function).
 *
 * @example
 *   const messages = await getMessages()
 *   <NextIntlClientProvider messages={pick(messages, ['common', 'nav'])} locale={locale}>
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const out = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      out[key] = obj[key]
    }
  }
  return out
}
