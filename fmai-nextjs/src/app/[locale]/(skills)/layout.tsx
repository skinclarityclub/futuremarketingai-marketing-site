import type { ReactNode } from 'react'
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { pick } from '@/lib/i18n-pick'
import { GLOBAL_CLIENT_NAMESPACES } from '@/lib/i18n-namespaces'

/**
 * Scoped NextIntlClientProvider for the (skills) route group.
 *
 * Why: a nested provider REPLACES (not extends) its parent's message subset
 * for the subtree below it. So the root layout's GLOBAL_CLIENT_NAMESPACES
 * pick has to be re-included here, plus skills-specific namespaces that are
 * consumed by client components mounted only on skill routes.
 *
 * Skills-specific client consumers (audited 2026-04-27):
 *   - DemoPlayground / MultiPlatformShowcase / PersonaSelector / DemoContextCard
 *     all call useTranslations('chatbots') and are mounted on
 *     /skills/lead-qualifier (and possibly future skill demos).
 *
 * The 12 skills-* namespaces themselves are server-only today (consumed by
 * SkillPageTemplate via getTranslations()) but are included here as cheap
 * insurance — adding them to the dynamic skills set costs nothing on
 * non-skill routes (this layout never executes for them) and removes a
 * future foot-gun if a skill page introduces a client widget.
 *
 * @see .planning/phases/13-performance-bundle-cleanup/i18n-client-usage.md
 * @see 13-02-PLAN.md Task 4
 */

const SKILLS_CLIENT_EXTRA = ['chatbots'] as const

function getSkillsNamespaces(messages: Record<string, unknown>): string[] {
  return Object.keys(messages).filter((k) => k.startsWith('skills-'))
}

export default async function SkillsLayout({ children }: { children: ReactNode }) {
  const messages = await getMessages()
  const skillsNamespaces = getSkillsNamespaces(messages)

  // Build the full pick list as a string array (NextIntlClientProvider's
  // messages prop is happy with an arbitrary subset — pick() keeps it typed).
  const namespaces = [
    ...GLOBAL_CLIENT_NAMESPACES,
    ...SKILLS_CLIENT_EXTRA,
    ...skillsNamespaces,
  ] as readonly (keyof typeof messages)[]

  return (
    <NextIntlClientProvider messages={pick(messages, namespaces)}>
      {children}
    </NextIntlClientProvider>
  )
}
