// Ported by hand from the approved prototype design/ronde1b/golf9-social-media.tpl.html (2026-11-02 website-audit folder,
// golf 9b, Daley's choices 2026-11-08). Same markup and classes; every text node is a key under skills-social-media.
// The screens are real captures from the demo environment (Dagspa Luwte). The month view is cut to 16-29 November
// because the week of 11 November shows the same post three times plus an internal task (app finding, golf9-ONTWERP.md).
import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['client', 'day', 'approve'] as const
const CARD_KEYS = ['posts', 'carousels', 'channels'] as const
const FAQ_KEYS = ['multi', 'approval', 'channels', 'client'] as const
const ARTICLE = '/kennisbank/contentkalender-maken-meerdere-klanten'
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

type Shot = { key: string; src: string; width: number; height: number; priority?: boolean }

export async function SocialMediaSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'skills-social-media' })
  const demo = <span className="g6-demo">{t('demo')}</span>
  // the kennisbank articles are Dutch only, like the link on /client-portal
  const article = (c: ReactNode) => (
    <Link href={ARTICLE} locale="nl" prefetch={false}>
      {c}
    </Link>
  )
  const portal = (c: ReactNode) => (
    <Link href="/client-portal" prefetch={false}>
      {c}
    </Link>
  )
  const faqLink = { multi: article, client: portal } as Record<string, (c: ReactNode) => ReactNode>

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
    <div className="g6" id="g6-sm">
      <section className="g6-hero" aria-labelledby="sm-h1">
        <div className="g6-in">
          <Breadcrumbs path="/skills/social-media" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="sm-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-sm-def">{t('hero.definition')}</p>
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
          {shot({ key: 'hero', src: '/proof/social-dagen.webp', width: 2200, height: 1032, priority: true })}
        </div>
      </section>

      <section className="g6-sec" id="review" aria-labelledby="sm-review">
        <div className="g6-in">
          {head('sm-review', 'review')}
          <div className="g6-body">
            <div className="g6-cards g6-three">
              {CARD_KEYS.map((k) => (
                <div className="g6-card" key={k}>
                  <p className="g6-eb">{t(`review.cards.${k}.label`)}</p>
                  <p>{t(`review.cards.${k}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="kalender" aria-labelledby="sm-kalender">
        <div className="g6-in">
          {head('sm-kalender', 'calendar')}
          {shot({ key: 'calendar', src: '/proof/social-maand.webp', width: 2200, height: 432 })}
          <div className="g6-links">
            <Link className="g6-lk" href={ARTICLE} locale="nl" prefetch={false}>
              {t('calendar.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="klant" aria-labelledby="sm-klant">
        <div className="g6-in">
          {head('sm-klant', 'client')}
          {/* the same capture as the calendar on /client-portal (g8/portal/p-kalender) */}
          {shot({ key: 'client', src: '/proof/portaal-kalender.webp', width: 1906, height: 1404 })}
          <div className="g6-links">
            <Link className="g6-lk" href="/client-portal" prefetch={false}>
              {t('client.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="saleslobe" aria-labelledby="sm-bewijs">
        <div className="g6-in">
          {head('sm-bewijs', 'saleslobe')}
          <div className="g6-links">
            <Link className="g6-lk" href="/case-studies/saleslobe" prefetch={false}>
              {t('saleslobe.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sm-vragen">
        <div className="g6-in">
          {head('sm-vragen', 'faq')}
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

      <section className="g6-sec g6-end" aria-labelledby="sm-slot">
        <div className="g6-in">
          {head('sm-slot', 'end')}
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/skills" prefetch={false}>
              {t('end.links.hub')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/blog-factory" prefetch={false}>
              {t('end.links.blog')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/reporting" prefetch={false}>
              {t('end.links.reporting')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
