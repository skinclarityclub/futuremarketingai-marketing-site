import { getTranslations } from 'next-intl/server'
import { SKILLS_DATA, type SkillData, type TierKey } from '@/lib/skills-data'

const TIERS: Array<{ key: TierKey; labelKey: string }> = [
  { key: 'PARTNER', labelKey: 'partner' },
  { key: 'GROWTH', labelKey: 'growth' },
  { key: 'PROFESSIONAL', labelKey: 'professional' },
  { key: 'ENTERPRISE', labelKey: 'enterprise' },
  { key: 'FOUNDING_MEMBER', labelKey: 'founding' },
]

function renderCap(
  skill: SkillData,
  tier: TierKey,
  labels: { fairUse: string; unlimited: string; notAvailable: string; addOn: string; perMonth: string },
): { text: string; tone: 'ok' | 'bad' | 'neutral' | 'strong' } {
  // Group A skills (no tierCaps) = fair use on all tiers
  if (!skill.tierCaps) {
    return { text: labels.fairUse, tone: 'ok' }
  }

  const cap = skill.tierCaps[tier]
  if (!cap) {
    return { text: labels.notAvailable, tone: 'bad' }
  }

  if (cap.included === -1) {
    return { text: labels.unlimited, tone: 'strong' }
  }

  if (cap.included === 0) {
    // add-on path has a label like "add-on €97"
    if (cap.label && cap.label.toLowerCase().includes('add-on')) {
      return { text: cap.label, tone: 'neutral' }
    }
    return { text: labels.notAvailable, tone: 'bad' }
  }

  // Use the richer label if set (e.g. "30 min/mo"), otherwise just "N/mo"
  return { text: cap.label ?? `${cap.included}${labels.perMonth}`, tone: 'ok' }
}

const TONE_CLASSES = {
  ok: 'text-text-primary',
  bad: 'text-text-muted',
  neutral: 'text-[#F5A623]',
  strong: 'text-accent-system font-medium',
} as const

export async function SkillsTierMatrix({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'pricing.matrix' })
  const tTiers = await getTranslations({ locale, namespace: 'pricing.tiers' })

  const labels = {
    fairUse: t('fairUse'),
    unlimited: t('unlimited'),
    notAvailable: t('notAvailable'),
    addOn: t('addOn'),
    perMonth: t('perMonth'),
  }

  return (
    <div className="overflow-x-auto border border-border-primary rounded-xl bg-white/[0.02] backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-primary">
            <th className="text-left px-4 py-3 font-semibold text-text-primary sticky left-0 bg-bg-deep/80 backdrop-blur-sm">
              {t('skillHeader')}
            </th>
            {TIERS.map(({ labelKey }) => (
              <th key={labelKey} className="text-center px-3 py-3 font-semibold text-text-primary whitespace-nowrap">
                {tTiers(`${labelKey}.name`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SKILLS_DATA.map((skill) => (
            <tr key={skill.id} className="border-b border-border-primary/50 last:border-0">
              <td className="px-4 py-3 text-text-secondary sticky left-0 bg-bg-deep/80 backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-text-primary">{skill.name}</span>
                  {skill.status === 'coming_soon' && (
                    <span className="text-[10px] uppercase tracking-wide text-[#F5A623] mt-0.5">
                      Coming soon
                    </span>
                  )}
                </div>
              </td>
              {TIERS.map(({ key }) => {
                const cell = renderCap(skill, key, labels)
                return (
                  <td
                    key={key}
                    className={`text-center px-3 py-3 whitespace-nowrap ${TONE_CLASSES[cell.tone]}`}
                  >
                    {cell.text}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
