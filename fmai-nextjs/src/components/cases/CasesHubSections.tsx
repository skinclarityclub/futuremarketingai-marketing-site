// Ported by hand from the approved prototype design/ronde1b/golf7-cases.tpl.html (2026-11-02 website-audit folder,
// golf 7, r3, Daley's yes 2026-11-07). Same markup and classes; every text node is a key under case_studies.hub.
// Golf 7b (Paul's yes 2026-11-07): the SalesLobe card shows the first three slides of the "not right now" carousel and
// links to its case. Golf 7c (2026-11-10, Daley's choices): both cards wear the client's brand, the SKC card shows the
// covers of the home card, and SkinClarity Club is in the present tense again (new posts scheduled for 12 Nov).
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import { SKC_POSTS, SL_POSTS } from '@/components/home/klanten/posts'
import '@/components/proof/proof.css'

const FACT_KEYS = ['clients', 'channels', 'approval'] as const
const SL_SLIDES = ['s01', 's02', 's03'] as const
// the three slides are one carousel, posted with the home card's "not right now" post
const [, SL_N, SL_ISO] = SL_POSTS[0]
const FAQ_KEYS = ['real', 'agency', 'live', 'results'] as const
const POST_SIZES = '(max-width: 599px) 40vw, (max-width: 860px) 30vw, 180px'

export async function CasesHubSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'case_studies' })
  const tk = await getTranslations({ locale, namespace: 'home.klanten' })

  return (
    <div className="g6" id="g6-cases">
      <section className="g6-hero" aria-labelledby="cs-h1">
        <div className="g6-in">
          <Breadcrumbs path="/case-studies" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hub.hero.eyebrow')}</p>
              <h1 className="g6-h1" id="cs-h1">
                {t('hub.hero.title')}
              </h1>
              <p className="g6-def speakable-cases-def">{t('hub.hero.definition')}</p>
            </div>
            <dl className="g6-facts" aria-label={t('hub.hero.factsLabel')}>
              {FACT_KEYS.map((k) => (
                <div key={k}>
                  <dt>{t(`hub.hero.facts.${k}.label`)}</dt>
                  <dd>{t(`hub.hero.facts.${k}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cs-klanten">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cs-klanten">
              {t('hub.clients.title')}
            </h2>
            <p className="g6-p">{t('hub.clients.sub')}</p>
          </div>
          <div className="g6-body g6-two g6-clients">
            <article className="g6-card g6-case g6-brand g6-skc">
              <figure className="g6-shot">
                <div className="g6-posts" role="region" tabIndex={0} aria-label={t('hub.clients.skc.postsLabel')}>
                  {SKC_POSTS.map(([img, n, iso]) => (
                    <div className="g6-post" key={img}>
                      <Image
                        src={`/home/klanten/${img}.webp`}
                        width={720}
                        height={900}
                        sizes={POST_SIZES}
                        alt={tk(`alt.${img}`)}
                        loading="lazy"
                      />
                      <p className="g6-pl">{tk(`postLabels.${n}`)}</p>
                      <p className="g6-pf">
                        <time dateTime={iso}>{tk(`dates.${n}`)}</time>
                      </p>
                    </div>
                  ))}
                </div>
              </figure>
              <p className="g6-eb">{t('hub.clients.skc.eyebrow')}</p>
              <h3>{t('hub.clients.skc.title')}</h3>
              <p className="g6-p">{t('hub.clients.skc.text')}</p>
              <div className="g6-links">
                <Link className="g6-lk" href="/case-studies/skinclarity-club" prefetch={false}>
                  {t('hub.clients.skc.link')} <Arrow />
                </Link>
              </div>
            </article>
            <article className="g6-card g6-case g6-brand g6-sl">
              <figure className="g6-shot">
                <div className="g6-posts" role="region" tabIndex={0} aria-label={t('hub.clients.sl.postsLabel')}>
                  {SL_SLIDES.map((s, i) => (
                    <div className="g6-post" key={s}>
                      <Image
                        src={`/proof/sl-notnow-${s}.webp`}
                        width={720}
                        height={900}
                        sizes={POST_SIZES}
                        alt={t(`sl.slides.alts.${s}`)}
                        loading="lazy"
                      />
                      <p className="g6-pl">{t('sl.slides.of', { n: i + 1 })}</p>
                      {/* the date once, under the first slide, so both cards keep two label lines */}
                      {i === 0 && (
                        <p className="g6-pf">
                          <time dateTime={SL_ISO}>{tk(`dates.${SL_N}`)}</time>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </figure>
              <p className="g6-eb">{t('hub.clients.sl.eyebrow')}</p>
              <h3>{t('hub.clients.sl.title')}</h3>
              <p className="g6-p">{t('hub.clients.sl.text')}</p>
              <div className="g6-links">
                <Link className="g6-lk" href="/case-studies/saleslobe" prefetch={false}>
                  {t('hub.clients.sl.link')} <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cs-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cs-vragen">
              {t('hub.faq.title')}
            </h2>
            <p className="g6-p">{t('hub.faq.sub')}</p>
          </div>
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`hub.faq.items.${k}.q`)}</summary>
                <p>{t(`hub.faq.items.${k}.a`)}</p>
              </details>
            ))}
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('hub.faq.links.memory')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/how-it-works" prefetch={false}>
              {t('hub.faq.links.start')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="cs-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cs-slot">
              {t('hub.end.title')}
            </h2>
            <p className="g6-p">{t('hub.end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('hub.end.cta')}
            </Link>
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('hub.end.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
