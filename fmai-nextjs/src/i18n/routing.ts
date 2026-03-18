import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nl', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
})
