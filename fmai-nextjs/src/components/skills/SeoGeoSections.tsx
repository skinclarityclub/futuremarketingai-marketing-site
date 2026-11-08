// Ported by hand from the approved prototype design/ronde1b/golf9-seo-geo.tpl.html (2026-11-02 website-audit folder,
// golf 9c, Daley's choices 2026-11-08). Same markup and classes; every text node is a key under skills-seo-geo.
// The screens are real captures from the demo environment (Dagspa Luwte, luwte.demo). The AI assistants named here are
// the ones the GEO tracker asks (ChatGPT, Perplexity, Google AI Overviews); the weekly report runs on Fridays.
import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['site', 'proposal', 'report'] as const
const ROW_KEYS = ['health', 'positions', 'visits', 'citations', 'quality', 'reports'] as const
const FAQ_KEYS = ['engines', 'citation', 'often', 'blogs'] as const
const GEO_ARTICLE = '/kennisbank/geo-generative-engine-optimization'
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

type Shot = { key: string; src: string; width: number; height: number; priority?: boolean }

export async function SeoGeoSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'skills-seo-geo' })
  const demo = <span className="g6-demo">{t('demo')}</span>
  const blog = (c: ReactNode) => (
    <Link href="/skills/blog-factory" prefetch={false}>
      {c}
    </Link>
  )
  const faqLink = { blogs: blog } as Record<string, (c: ReactNode) => ReactNode>

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
    <div className="g6" id="g6-sg">
      <section className="g6-hero" aria-labelledby="sg-h1">
        <div className="g6-in">
          <Breadcrumbs path="/skills/seo-geo" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="sg-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-sg-def">{t('hero.definition')}</p>
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
          {shot({ key: 'hero', src: '/proof/seo-overzicht.webp', width: 2200, height: 1394, priority: true })}
        </div>
      </section>

      <section className="g6-sec" id="geo" aria-labelledby="sg-geo">
        <div className="g6-in">
          {head('sg-geo', 'geo')}
          {shot({ key: 'geo', src: '/proof/seo-citaties.webp', width: 2200, height: 968 })}
          <div className="g6-links">
            {/* the kennisbank articles are Dutch only, like the article link on /skills/social-media */}
            <Link className="g6-lk" href={GEO_ARTICLE} locale="nl" prefetch={false}>
              {t('geo.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="voorstel" aria-labelledby="sg-voorstel">
        <div className="g6-in">
          {head('sg-voorstel', 'proposal')}
          {shot({ key: 'proposal', src: '/proof/seo-voorstellen.webp', width: 2200, height: 1048 })}
        </div>
      </section>

      <section className="g6-sec" id="meten" aria-labelledby="sg-meten">
        <div className="g6-in">
          {head('sg-meten', 'measure')}
          <div className="g6-body">
            <div className="g6-tw">
              <table>
                <caption>{t('measure.table.caption')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('measure.table.colMeasure')}</th>
                    <th scope="col">{t('measure.table.colWhat')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ROW_KEYS.map((k) => (
                    <tr key={k}>
                      <th scope="row">{t(`measure.table.rows.${k}.k`)}</th>
                      <td>{t(`measure.table.rows.${k}.v`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="rapport" aria-labelledby="sg-rapport">
        <div className="g6-in">
          {head('sg-rapport', 'report')}
          {shot({ key: 'report', src: '/proof/seo-rapporten.webp', width: 2200, height: 578 })}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/reporting" prefetch={false}>
              {t('report.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sg-vragen">
        <div className="g6-in">
          {head('sg-vragen', 'faq')}
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

      <section className="g6-sec g6-end" aria-labelledby="sg-slot">
        <div className="g6-in">
          {head('sg-slot', 'end')}
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
