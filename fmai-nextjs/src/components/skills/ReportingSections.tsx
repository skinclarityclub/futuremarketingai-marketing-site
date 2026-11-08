// Ported by hand from the approved prototype design/ronde1b/golf9-reporting.tpl.html (2026-11-02 website-audit folder,
// golf 9c, Daley's choices 2026-11-08). Same markup and classes; every text node is a key under skills-reporting.
// The screens are real captures from the demo environment (Dagspa Luwte). "Met uitleg in gewone taal" is true only
// with REPORT_CLYDE_TEXT=on on fma-app, which Daley switched on 2026-11-08 before this page merged.
import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['client', 'source', 'portal'] as const
const CARD_KEYS = ['week', 'month', 'ask'] as const
const FAQ_KEYS = ['client', 'sources', 'missing', 'often'] as const
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

type Shot = { key: string; src: string; width: number; height: number; priority?: boolean }

export async function ReportingSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'skills-reporting' })
  const demo = <span className="g6-demo">{t('demo')}</span>
  const portal = (c: ReactNode) => (
    <Link href="/client-portal" prefetch={false}>
      {c}
    </Link>
  )
  const seo = (c: ReactNode) => (
    <Link href="/skills/seo-geo" prefetch={false}>
      {c}
    </Link>
  )
  const faqLink = { client: portal, often: seo } as Record<string, (c: ReactNode) => ReactNode>

  // every screen here is wider than a phone, so each scrolls inside its window there
  const shot = ({ key, src, width, height, priority }: Shot) => (
    <div className="g6-body">
      <figure className="g6-shot">
        <div className="g6-win g6-fit" style={fit(width / 2)}>
          <div className="g6-winbar">
            <i />
            <i />
            <i />
            <span>{t(`${key}.shot.bar`)}</span>
          </div>
          <div className="g6-scroll" tabIndex={0} role="region" aria-label={t(`${key}.shot.scrollLabel`)}>
            <Image
              src={src}
              width={width}
              height={height}
              sizes={`${width / 2}px`}
              alt={t(`${key}.shot.alt`)}
              {...(priority ? { priority: true } : { loading: 'lazy' as const })}
            />
          </div>
        </div>
        <figcaption className="g6-cap">
          <span>{t(`${key}.shot.caption`)}</span>
          {demo}
        </figcaption>
      </figure>
    </div>
  )

  const head = (id: string, key: string) => (
    <div className="g6-hd">
      <h2 className="g6-h2" id={id}>
        {t(`${key}.title`)}
      </h2>
      <p className="g6-p">{t(`${key}.sub`)}</p>
    </div>
  )

  return (
    <div className="g6" id="g6-rp">
      <section className="g6-hero" aria-labelledby="rp-h1">
        <div className="g6-in">
          <Breadcrumbs path="/skills/reporting" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="rp-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-rp-def">{t('hero.definition')}</p>
            </div>
            <dl className="g6-facts" aria-label={t('hero.factsLabel')}>
              {FACT_KEYS.map((k) => (
                <div key={k}>
                  <dt>{t(`hero.facts.${k}.label`)}</dt>
                  <dd>{t(`hero.facts.${k}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
          {shot({ key: 'hero', src: '/proof/rapport-resultaten.webp', width: 2200, height: 1262, priority: true })}
        </div>
      </section>

      <section className="g6-sec" id="cijfers" aria-labelledby="rp-cijfers">
        <div className="g6-in">
          {head('rp-cijfers', 'figures')}
          {shot({ key: 'figures', src: '/proof/rapport-kanalen.webp', width: 2200, height: 862 })}
        </div>
      </section>

      <section className="g6-sec" id="uitleg" aria-labelledby="rp-uitleg">
        <div className="g6-in">
          {head('rp-uitleg', 'explain')}
          <div className="g6-body">
            <div className="g6-cards g6-three">
              {CARD_KEYS.map((k) => (
                <div className="g6-card" key={k}>
                  <p className="g6-eb">{t(`explain.cards.${k}.label`)}</p>
                  <p>{t(`explain.cards.${k}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="portaal" aria-labelledby="rp-portaal">
        <div className="g6-in">
          {head('rp-portaal', 'portal')}
          {shot({ key: 'portal', src: '/proof/rapport-portaal.webp', width: 2200, height: 1334 })}
          <div className="g6-links">
            <Link className="g6-lk" href="/client-portal" prefetch={false}>
              {t('portal.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="rp-vragen">
        <div className="g6-in">
          {head('rp-vragen', 'faq')}
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`faq.items.${k}.q`)}</summary>
                <p>{faqLink[k] ? t.rich(`faq.items.${k}.a`, { link: faqLink[k] }) : t(`faq.items.${k}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="rp-slot">
        <div className="g6-in">
          {head('rp-slot', 'end')}
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/skills" prefetch={false}>
              {t('end.links.hub')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/seo-geo" prefetch={false}>
              {t('end.links.seo')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/social-media" prefetch={false}>
              {t('end.links.social')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
