import type { Metadata } from 'next'
import { LogoAtlas } from '@/components/brand/logos/LogoAtlas'
import { LogoBracket } from '@/components/brand/logos/LogoBracket'
import { LogoEcho } from '@/components/brand/logos/LogoEcho'
import { LogoBicore } from '@/components/brand/logos/LogoBicore'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'
import { LogoFold } from '@/components/brand/logos/LogoFold'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'

export const metadata: Metadata = {
  title: 'Logo Lab — FutureMarketingAI',
  robots: { index: false, follow: false },
}

interface Variant {
  key: string
  name: string
  tagline: string
  concept: string
  craft: string
  reference: string
  Logo: React.ComponentType<{ size?: number }>
}

const VARIANTS: Variant[] = [
  {
    key: 'bicore',
    name: 'V3-A — Bicore',
    tagline: 'Twee hemisferen, brein zonder anatomie',
    concept:
      'Brein gereduceerd tot zijn meest essentiële waarheid: twee hemisferen, gescheiden door een fissuur. Geen gyri, geen gekkigheid. Links teal (AI/systeem), rechts amber (mens). De 2px tussenruimte is de corpus callosum — waar ze elkaar ontmoeten.',
    craft:
      'Intentionele asymmetrie: rechter hemisfeer is 1px hoger (echte hersenen zijn nooit perfect symmetrisch). Subtle Q-curve op flat sides → suggereert binnenste curve. Pure kleuren, géén gradient. Beide hemisferen bewegen 0.4px uit en weer in (4.5s) — alsof ze ademen samen.',
    reference: 'Cohere split-cell logic, hemisphere-symbolics zonder medical illustration',
    Logo: LogoBicore,
  },
  {
    key: 'synapse',
    name: 'V3-B — Synapse',
    tagline: 'Vier nodes, één vurende verbinding',
    concept:
      'Brein gereduceerd tot één vurend fragment: vier nodes, drie verbindingen. De minimum visuele eenheid van "denken". Eén node is amber: de vurende synapse, de AI-gedachte.',
    craft:
      'Nodes op een impliciet 8px raster. Verbindingen zijn 1px hairlines (zwaardere lijnen lezen als goedkoop diagram). Amber firing-line heeft een traveling dash (4-16, 1.8s) — refereert aan signal propagation. Halo op de amber node + subtiele scale. Vier elementen, niet vijf — bewuste reductie.',
    reference: 'Neural network glyphs op designer-niveau (vs cliché spider-web), Replit prompt-dots reduction',
    Logo: LogoSynapse,
  },
  {
    key: 'fold',
    name: 'V3-C — Fold',
    tagline: 'Eén cortex-fold + synapse-punt',
    concept:
      'In plaats van een brein, een gyrus-vouw tekenen — de essentie van een brein. Eén elegante Ω-achtige curve, geometrisch geconstrueerd, géén anatomie. Amber dot zit in het basin van de fold: de synapse, het denkmoment.',
    craft:
      'Single open stroke, geen gevulde shape. Stroke-width 2.4px, stroke-linecap round, stroke-linejoin round (drie momenten van craft). De fold gebruikt vijf opeenvolgende Q-curves die elkaar logisch volgen — niet random. Dot in basin breathing 3s. Pure teal stroke, pure amber dot.',
    reference: 'Linear L (single elegant geometric move), Vercel ▲ (essentie zonder decoratie)',
    Logo: LogoFold,
  },
  {
    key: 'atlas',
    name: 'V2-A — Atlas',
    tagline: 'Modulaire F uit 7 cellen (géén brein)',
    concept:
      'F gebouwd uit 7 discrete 5×5 cellen op een 6.5px raster. Constructie-principe zichtbaar. Eén amber cel rechtsboven = AI-accent én "richting" (top-right = forward).',
    craft:
      'Pure kleuren, géén gradient. Subtiele rx=1 rounding op cellen voor premium feel. Optical pitch: 6.5px (getest op 16px schaal). Alleen amber-cel pulseert (3s, 0.92↔1.0 opacity).',
    reference: 'Mistral M (Sylvain Boyer), Cohere cells (Pentagram)',
    Logo: LogoAtlas,
  },
  {
    key: 'bracket',
    name: 'V2-B — Bracket',
    tagline: 'F als open frame (géén brein)',
    concept:
      'F gereduceerd tot drie essentiële strokes. Het "ontbrekende" rechtsonder-deel van de F wordt intentioneel negative space, bewoond door één amber dot.',
    craft:
      'Mid-bar 4px korter dan top-bar (optical truth). rx=1.6 op stems. Dot 2px solid + 3.4px halo @ 32% opacity → 2.8s pulse. Negative space is het concept.',
    reference: 'Anthropic A-mark, Linear L (negative-space ligature)',
    Logo: LogoBracket,
  },
  {
    key: 'echo',
    name: 'V2-C — Echo',
    tagline: 'Twee crescents in dialoog (géén brein)',
    concept:
      'Twee asymmetrische lensvormen kijken elkaar aan over 2px stilte. Boven teal, onder amber. Abstracte dialoog.',
    craft:
      'Quadratic bezier paths, intentionele asymmetrie in dichtheid. Crescents bewegen 0.8px naar elkaar en terug (4s).',
    reference: 'Cohere "new nature", Wolff Olins motion-as-life',
    Logo: LogoEcho,
  },
]

function SizeRow({
  label,
  size,
  Logo,
}: {
  label: string
  size: number
  Logo: React.ComponentType<{ size?: number }>
}) {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-t border-border-primary first:border-t-0">
      <span className="text-xs font-mono text-text-muted w-20 shrink-0">{label}</span>
      <div className="flex items-center gap-2.5">
        <Logo size={size} />
        <span
          className="font-display font-bold tracking-tight whitespace-nowrap"
          style={{ fontSize: size * 0.75 }}
        >
          <span className="text-text-primary">FutureMarketing</span>
          <span className="text-accent-system">AI</span>
        </span>
      </div>
    </div>
  )
}

function VariantCard({ variant }: { variant: Variant }) {
  const { name, tagline, concept, craft, reference, Logo } = variant
  return (
    <article className="rounded-2xl border border-border-primary bg-bg-surface/40 backdrop-blur-sm overflow-hidden">
      <header className="px-6 pt-6 pb-4 border-b border-border-primary">
        <h2 className="font-display font-bold text-xl text-text-primary leading-tight">
          {name}
        </h2>
        <p className="text-sm text-accent-system mt-1.5 font-medium">{tagline}</p>
      </header>

      <div className="bg-bg-deep">
        <SizeRow label="Header 30" size={30} Logo={Logo} />
        <SizeRow label="Display 56" size={56} Logo={Logo} />
        <div className="flex items-center gap-4 py-4 px-6 border-t border-border-primary">
          <span className="text-xs font-mono text-text-muted w-20 shrink-0">Favicon 16</span>
          <div className="w-8 h-8 rounded bg-bg-deep border border-border-primary flex items-center justify-center">
            <Logo size={16} />
          </div>
          <span className="text-xs text-text-muted">browser tab</span>
        </div>
        <div className="flex items-center gap-4 py-4 px-6 border-t border-border-primary">
          <span className="text-xs font-mono text-text-muted w-20 shrink-0">App 80</span>
          <div className="w-24 h-24 rounded-2xl bg-bg-elevated border border-border-primary flex items-center justify-center">
            <Logo size={80} />
          </div>
        </div>
      </div>

      <div className="px-6 py-5 border-t border-border-primary space-y-3 text-sm">
        <div>
          <div className="text-xs uppercase tracking-widest text-text-muted mb-1.5 font-mono">
            Concept
          </div>
          <p className="text-text-secondary leading-relaxed">{concept}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-text-muted mb-1.5 font-mono">
            Craft notes
          </div>
          <p className="text-text-secondary leading-relaxed">{craft}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-text-muted mb-1.5 font-mono">
            Reference
          </div>
          <p className="text-text-secondary leading-relaxed italic">{reference}</p>
        </div>
      </div>
    </article>
  )
}

export default function LogoLabPage() {
  return (
    <main className="min-h-screen bg-bg-deep px-6 lg:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 max-w-3xl space-y-4">
          <EyebrowLabel>Logo Lab. V3 iteration. brein erbij</EyebrowLabel>
          <h1 className="font-display font-bold text-4xl lg:text-5xl text-text-primary leading-tight">
            Zes varianten. drie met brein, drie zonder
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Eerste drie (V3-A/B/C) interpreteren &quot;brein&quot; op designer-niveau:
            geabstraheerd, geen anatomische gyri. Laatste drie (V2-A/B/C) blijven
            niet-brein-georiënteerd ter vergelijking. Alle zes volgen dezelfde vijf
            principes: pure kleuren (géén gradients), geometrische constructie,
            negative space als concept, optical adjustments, één sterk idee.
          </p>
          <p className="text-base text-text-muted leading-relaxed mt-4">
            Elke kaart toont vier maten (header 30px, display 56px, favicon 16px, app
            80px) plus concept-, craft- en referentie-notes. Animaties zijn live —
            bewust minimaal: één beweging per logo.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {VARIANTS.map((variant) => (
            <VariantCard key={variant.key} variant={variant} />
          ))}
        </div>

        <footer className="mt-16 max-w-3xl text-sm text-text-muted space-y-2">
          <p>
            Zeg de variant-key (atlas / bracket / echo) en eventueel detail-wensen,
            dan installeer ik die in de echte header + favicon + OG image. Voor
            verdere iteratie binnen één variant: zeg wat er nog niet klopt.
          </p>
          <p>
            Route is <code className="text-accent-system">noindex,nofollow</code> en
            niet gelinkt vanaf navigatie.
          </p>
        </footer>
      </div>
    </main>
  )
}
