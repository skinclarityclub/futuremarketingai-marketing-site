// Ported by hand from the approved prototype design/ronde1b/golf9-skills.tpl.html (2026-11-02 website-audit folder,
// golf 9a, Daley's choices 2026-11-08). Same markup and classes; every text node is a key under skills-index.
// The screens are real captures from the demo environment (Nova Digital, Dagspa Luwte), reused from the home.
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['workspace', 'approval', 'client'] as const
const TOOL_ROWS = ['memory', 'approval', 'client', 'reporting', 'count', 'price'] as const
const TOOL_COLS = ['what', 'tools', 'clyde'] as const
const SOON_KEYS = ['voice', 'reel'] as const
const FAQ_KEYS = ['need', 'colleague', 'team'] as const
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

type Shot = { key: string; src: string; width: number; height: number; scroll: boolean }

const SHOTS = {
  plan: { key: 'plan', src: '/home/week/analyse.jpg', width: 1592, height: 1060, scroll: true },
  make: { key: 'make', src: '/home/week/deck.jpg', width: 1720, height: 1062, scroll: true },
  approve: { key: 'approve', src: '/home/hero3/h3-kal.jpg', width: 1252, height: 858, scroll: false },
  leads: { key: 'leads', src: '/home/werk/g3-dm-regel-rust.png', width: 1545, height: 250, scroll: true },
  measure: { key: 'measure', src: '/home/week/rapport.jpg', width: 1536, height: 524, scroll: true },
} satisfies Record<string, Shot>

export async function SkillsHubSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'skills-index' })
  const demo = <span className="g6-demo">{t('demo')}</span>

  const shot = ({ key, src, width, height, scroll }: Shot) => {
    const w = width / 2
    const img = (
      <Image
        src={src}
        width={width}
        height={height}
        sizes={scroll ? `${w}px` : `(max-width: 860px) 92vw, ${w}px`}
        alt={t(`${key}.shot.alt`)}
        loading="lazy"
      />
    )
    return (
      <div className="g6-body">
        <figure className="g6-shot">
          <div className="g6-win g6-fit" style={fit(w)}>
            <div className="g6-winbar">
              <i />
              <i />
              <i />
              <span>{t(`${key}.shot.bar`)}</span>
            </div>
            {scroll ? (
              <div className="g6-scroll" tabIndex={0} role="region" aria-label={t(`${key}.shot.scrollLabel`)}>
                {img}
              </div>
            ) : (
              img
            )}
          </div>
          <figcaption className="g6-cap">
            <span>{t(`${key}.shot.caption`)}</span>
            {demo}
          </figcaption>
        </figure>
      </div>
    )
  }

  const head = (id: string, key: string) => (
    <div className="g6-hd">
      <h2 className="g6-h2" id={id}>
        {t(`${key}.title`)}
      </h2>
      <p className="g6-p">{t(`${key}.sub`)}</p>
    </div>
  )

  return (
    <div className="g6" id="g6-sk">
      <section className="g6-hero" aria-labelledby="sk-h1">
        <div className="g6-in">
          <Breadcrumbs path="/skills" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="sk-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-sk-def">{t('hero.definition')}</p>
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
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win g6-fit" style={fit(760)}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('hero.shot.bar')}</span>
                </div>
                <Image
                  src="/home/week/dagstart.jpg"
                  width={1520}
                  height={1108}
                  sizes="(max-width: 860px) 92vw, 760px"
                  alt={t('hero.shot.alt')}
                  priority
                />
              </div>
              <figcaption className="g6-cap">
                <span>{t('hero.shot.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sk-clyde">
        <div className="g6-in">
          {head('sk-clyde', 'clyde')}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/clyde" prefetch={false}>
              {t('clyde.links.clyde')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('clyde.links.memory')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="plannen" aria-labelledby="sk-plannen">
        <div className="g6-in">
          {head('sk-plannen', 'plan')}
          {shot(SHOTS.plan)}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/strategy" prefetch={false}>
              {t('plan.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="maken" aria-labelledby="sk-maken">
        <div className="g6-in">
          {head('sk-maken', 'make')}
          {shot(SHOTS.make)}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/social-media" prefetch={false}>
              {t('make.links.social')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/blog-factory" prefetch={false}>
              {t('make.links.blog')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/ad-manager" prefetch={false}>
              {t('make.links.ads')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="goedkeuren" aria-labelledby="sk-goedkeuren">
        <div className="g6-in">
          {head('sk-goedkeuren', 'approve')}
          {shot(SHOTS.approve)}
          <div className="g6-links">
            <Link className="g6-lk" href="/client-portal" prefetch={false}>
              {t('approve.links.portal')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/#regie" prefetch={false}>
              {t('approve.links.regie')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="aanvragen" aria-labelledby="sk-aanvragen">
        <div className="g6-in">
          {head('sk-aanvragen', 'leads')}
          {shot(SHOTS.leads)}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/lead-qualifier" prefetch={false}>
              {t('leads.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="meten" aria-labelledby="sk-meten">
        <div className="g6-in">
          {head('sk-meten', 'measure')}
          {shot(SHOTS.measure)}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/reporting" prefetch={false}>
              {t('measure.links.reporting')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/seo-geo" prefetch={false}>
              {t('measure.links.seo')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="ook" aria-labelledby="sk-ook">
        <div className="g6-in">
          {head('sk-ook', 'mail')}
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/email-management" prefetch={false}>
              {t('mail.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" id="tools" aria-labelledby="sk-tools">
        <div className="g6-in">
          {head('sk-tools', 'tools')}
          <div className="g6-body">
            {/* on a phone each row becomes a card; role= keeps the table semantics once CSS sets display:block */}
            <div className="g6-tw g6-stack">
              <table role="table" aria-label={t('tools.tableLabel')}>
                <thead role="rowgroup">
                  <tr role="row">
                    {TOOL_COLS.map((c) => (
                      <th role="columnheader" scope="col" key={c}>
                        {t(`tools.cols.${c}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {TOOL_ROWS.map((r) => (
                    <tr role="row" key={r}>
                      {TOOL_COLS.map((c) => (
                        <td role="cell" data-l={t(`tools.cols.${c}`)} key={c}>
                          {t(`tools.rows.${r}.${c}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/alternatives" prefetch={false}>
              {t('tools.links.alternatives')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/pricing" prefetch={false}>
              {t('tools.links.pricing')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* target of the 301s from /skills/voice-agent, /skills/reel-builder and /roadmap (next.config.ts) */}
      <section className="g6-sec" id="binnenkort" aria-labelledby="sk-binnenkort">
        <div className="g6-in">
          {head('sk-binnenkort', 'soon')}
          <div className="g6-body">
            <div className="g6-cards">
              {SOON_KEYS.map((k) => (
                <div className="g6-card" key={k}>
                  <p className="g6-eb">{t('soon.label')}</p>
                  <h3>{t(`soon.items.${k}.name`)}</h3>
                  <p>{t(`soon.items.${k}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sk-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sk-vragen">
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
                      <Link href="/skills/clyde" prefetch={false}>
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

      <section className="g6-sec g6-end" aria-labelledby="sk-slot">
        <div className="g6-in">
          {head('sk-slot', 'end')}
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/how-it-works" prefetch={false}>
              {t('end.links.how')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/pricing" prefetch={false}>
              {t('end.links.pricing')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
