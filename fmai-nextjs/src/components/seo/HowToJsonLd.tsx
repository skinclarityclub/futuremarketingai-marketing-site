import { JsonLd } from '@/components/seo/JsonLd'

interface HowToStep {
  name: string
  text: string
}

interface HowToJsonLdProps {
  name: string
  description?: string
  steps: HowToStep[]
}

export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        ...(description ? { description } : {}),
        step: steps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }}
    />
  )
}
