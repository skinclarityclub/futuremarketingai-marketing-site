import { getTranslations } from 'next-intl/server'

type LayerKey = 'hot' | 'warm' | 'cold' | 'context'

const LAYERS: Array<{
  key: LayerKey
  accent: string
  borderAccent: string
  glyph: string
}> = [
  { key: 'hot', accent: 'text-[#FF4D4D]', borderAccent: 'border-[#FF4D4D]/40', glyph: '🔥' },
  { key: 'warm', accent: 'text-[#F5A623]', borderAccent: 'border-[#F5A623]/40', glyph: '☀' },
  { key: 'cold', accent: 'text-accent-system', borderAccent: 'border-accent-system/40', glyph: '❄' },
  { key: 'context', accent: 'text-accent-human', borderAccent: 'border-accent-human/40', glyph: '◆' },
]

export async function MemoryLayersDiagram({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'memory.layers' })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {LAYERS.map(({ key, accent, borderAccent, glyph }) => (
        <div
          key={key}
          className={`rounded-[var(--radius-card)] border ${borderAccent} bg-white/[0.02] backdrop-blur-sm p-6 transition-all duration-500 hover:bg-white/[0.04]`}
        >
          <div className={`text-2xl ${accent} mb-3`} aria-hidden>
            {glyph}
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">{t(`${key}.name`)}</h3>
          <p className="text-xs text-text-muted uppercase tracking-wide mb-3">
            {t(`${key}.window`)}
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{t(`${key}.description`)}</p>
        </div>
      ))}
    </div>
  )
}
