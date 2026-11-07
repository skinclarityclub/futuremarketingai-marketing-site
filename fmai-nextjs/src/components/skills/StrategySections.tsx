// Ported by hand from the approved prototype design/ronde1b/golf9-strategy.tpl.html (2026-11-02 website-audit folder,
// golf 9a, Daley's choices 2026-11-08). Same markup and classes; every text node is a key under skills-strategy.
// The screens are real captures from the demo environment (Dagspa Luwte). The strategy page is cut into two shots
// because the app joins goal and audience with a dash we do not show on the site (app finding, golf9-ONTWERP.md).
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['client', 'agenda', 'decide'] as const
const CARD_KEYS = ['discuss', 'seen', 'irrelevant'] as const
const FAQ_KEYS = ['what', 'source', 'adjust', 'client'] as const
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

type Shot = { key: string; src: string; width: number; height: number; priority?: boolean }

export async function StrategySections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'skills-strategy' })
  const demo = <span className="g6-demo">{t('demo')}</span>

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
    <div className="g6" id="g6-st">
      <section className="g6-hero" aria-labelledby="st-h1">
        <div className="g6-in">
          <Breadcrumbs path="/skills/strategy" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="st-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-st-def">{t('hero.definition')}</p>
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
          {shot({ key: 'hero', src: '/proof/strategie-top.webp', width: 1720, height: 460, priority: true })}
        </div>
      </section>

      <section className="g6-sec" id="strategie" aria-labelledby="st-wie">
        <div className="g6-in">
          {head('st-wie', 'who')}
          {shot({ key: 'who', src: '/proof/strategie-wie.webp', width: 1720, height: 590 })}
        </div>
      </section>

      <section className="g6-sec" id="agenda" aria-labelledby="st-agenda">
        <div className="g6-in">
          {head('st-agenda', 'agenda')}
          {shot({ key: 'agenda', src: '/home/week/agenda.jpg', width: 1720, height: 1098 })}
          <div className="g6-links">
            <Link className="g6-lk" href="/#een-week-met-clyde" prefetch={false}>
              {t('agenda.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* target of the 301 from /skills/research (next.config.ts) */}
      <section className="g6-sec" id="research" aria-labelledby="st-research">
        <div className="g6-in">
          {head('st-research', 'research')}
          {shot({ key: 'research', src: '/home/week/analyse.jpg', width: 1592, height: 1060 })}
        </div>
      </section>

      <section className="g6-sec" id="beslissen" aria-labelledby="st-beslissen">
        <div className="g6-in">
          {head('st-beslissen', 'decide')}
          <div className="g6-body">
            <div className="g6-cards g6-three">
              {CARD_KEYS.map((k) => (
                <div className="g6-card" key={k}>
                  <p className="g6-eb">{t(`decide.cards.${k}.label`)}</p>
                  <p>{t(`decide.cards.${k}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/clyde" prefetch={false}>
              {t('decide.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="st-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="st-vragen">
              {t('faq.title')}
            </h2>
            <p className="g6-p">{t('faq.sub')}</p>
          </div>
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`faq.items.${k}.q`)}</summary>
                <p>
                  {t.rich(`faq.items.${k}.a`, {
                    link: (c) => (
                      <Link href="/client-portal" prefetch={false}>
                        {c}
                      </Link>
                    ),
                  })}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="st-slot">
        <div className="g6-in">
          {head('st-slot', 'end')}
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/skills" prefetch={false}>
              {t('end.links.hub')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/social-media" prefetch={false}>
              {t('end.links.social')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/seo-geo" prefetch={false}>
              {t('end.links.seo')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
