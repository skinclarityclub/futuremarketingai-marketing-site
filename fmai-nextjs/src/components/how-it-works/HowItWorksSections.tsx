// Ported by hand from the approved prototype design/ronde1b/golf6-how-it-works.tpl.html (2026-11-02 website-audit
// folder, golf 6). Same markup and classes; every text node is a key under how-it-works. port_section.py was not
// used: it expects home sections with ids, a sprite and five style blocks, golf 6 has none of the three.
import type { ReactNode } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

export const WEEK_KEYS = ['w1', 'w2', 'w3', 'w4'] as const
const ROW_KEYS = ['delivers', 'clyde', 'done'] as const
const FACT_KEYS = ['duration', 'time', 'after'] as const
const SUPPLY_KEYS = ['site', 'channels', 'strategy', 'approver'] as const
const FAQ_KEYS = ['live', 'time', 'it', 'guide', 'cost'] as const
const b = (c: ReactNode) => <b>{c}</b>

export async function HowItWorksSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'how-it-works' })
  // #klant only exists on the Dutch home; the English home shows the same idea under #people
  const clientAnchor = locale === 'nl' ? '/#klant' : '/#people'

  return (
    <div className="g6" id="g6-how-it-works">
      <section className="g6-hero" aria-labelledby="hiw-h1">
        <div className="g6-in">
          <Breadcrumbs path="/how-it-works" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="hiw-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def">{t('hero.definition')}</p>
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
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="hiw-weken">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="hiw-weken">
              {t('weeks.title')}
            </h2>
            <p className="g6-p">{t('weeks.sub')}</p>
          </div>
          <div className="g6-body">
            <ol className="g6-weeks">
              {WEEK_KEYS.map((w) => (
                <li className="g6-wk" key={w}>
                  <div>
                    <p className="g6-wk-n">{t(`weeks.items.${w}.label`)}</p>
                    <h3 className="g6-wk-t">{t(`weeks.items.${w}.title`)}</h3>
                  </div>
                  {ROW_KEYS.map((r) => (
                    <dl key={r}>
                      <dt>{t(`weeks.rows.${r}`)}</dt>
                      <dd>{t.rich(`weeks.items.${w}.${r}`, { b })}</dd>
                    </dl>
                  ))}
                </li>
              ))}
            </ol>
            <p className="g6-sum">
              <span>{t.rich('weeks.sumFirst', { b })}</span>
              <span>{t.rich('weeks.sumAfter', { b })}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="hiw-aanleveren">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="hiw-aanleveren">
              {t('supply.title')}
            </h2>
            <p className="g6-p">{t('supply.sub')}</p>
          </div>
          <div className="g6-body">
            <ol className="g6-list">
              {SUPPLY_KEYS.map((k) => (
                <li className="g6-li" key={k}>
                  <h3>{t(`supply.items.${k}.title`)}</h3>
                  <p>{t(`supply.items.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="hiw-agenda">
        <div className="g6-in">
          <div className="g6-split">
            <div className="g6-copy">
              <h2 className="g6-h2" id="hiw-agenda">
                {t('agenda.title')}
              </h2>
              <p className="g6-p">{t('agenda.sub')}</p>
            </div>
            <figure className="g6-shot">
              <div className="g6-win">
                <div className="g6-winbar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{t('agenda.bar')}</span>
                </div>
                <Image
                  src="/proof/agenda-luwte.webp"
                  width={1720}
                  height={1098}
                  sizes="(max-width: 860px) 100vw, 700px"
                  alt={t('agenda.alt')}
                  loading="lazy"
                />
              </div>
              <figcaption className="g6-cap">
                <span>{t('agenda.caption')}</span>
                <span className="g6-demo">{t('agenda.demo')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="hiw-daarna">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="hiw-daarna">
              {t('after.title')}
            </h2>
            <p className="g6-p">{t('after.sub')}</p>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/#een-week-met-clyde" prefetch={false}>
              {t('after.links.week')} <Arrow />
            </Link>
            <Link className="g6-lk" href={clientAnchor} prefetch={false}>
              {t('after.links.client')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('after.links.memory')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="hiw-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="hiw-vragen">
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
                      <Link href="/pricing" prefetch={false}>
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

      <section className="g6-sec g6-end" aria-labelledby="hiw-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="hiw-slot">
              {t('end.title')}
            </h2>
            <p className="g6-p">{t('end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/pricing" prefetch={false}>
              {t('end.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
