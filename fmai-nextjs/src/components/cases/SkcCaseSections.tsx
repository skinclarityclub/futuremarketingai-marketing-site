// Ported by hand from the approved prototype design/ronde1b/golf7-skinclarity-club.tpl.html (2026-11-02 website-audit
// folder, golf 7, r3, Daley's yes 2026-11-07). Same markup and classes; every text node is a key under case_studies.skc.
// Present tense since 2026-11-10 (Daley's choice "loopt": new posts are scheduled for 12 Nov); the numbers and the period
// line wait until those posts are posted. Golf 7c: the hero and the voices sit on the SKC brand ground, with the same
// numbers, covers and post labels as the home card (home.klanten, posts.ts), so one recount updates both. The week is a
// real screen from the SKC workspace, so its caption carries the real-screen line, never the demo line.
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import { SKC_POSTS } from '@/components/home/klanten/posts'
import '@/components/proof/proof.css'

const STAT_KEYS = ['n1', 'n2', 'n3'] as const
const STEP_KEYS = ['concept', 'approve', 'live', 'memory'] as const
const FAQ_KEYS = ['who', 'three', 'notApproved', 'numbers'] as const

export async function SkcCaseSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'case_studies' })
  const tk = await getTranslations({ locale, namespace: 'home.klanten' })

  return (
    <div className="g6" id="g6-skc">
      <div className="g6-brand g6-skc">
        <section className="g6-hero" aria-labelledby="skc-h1">
          <div className="g6-in">
            <Breadcrumbs path="/case-studies/skinclarity-club" locale={locale} className="g6-crumb" />
            <div className="g6-hero-t">
              <Image src="/home/klanten/skc-logo-rond.webp" width={96} height={96} className="g6-logo" alt="" priority />
              <p className="g6-eb">{t('skc.hero.eyebrow')}</p>
              <h1 className="g6-h1" id="skc-h1">
                {t('skc.hero.title')}
              </h1>
              <p className="g6-def speakable-skc-def">{t('skc.hero.definition')}</p>
              <dl className="g6-stats" aria-label={t('skc.hero.factsLabel')}>
                {STAT_KEYS.map((k) => (
                  <div key={k}>
                    <dt>{tk(`stats.${k}.label`)}</dt>
                    <dd>{tk(`stats.${k}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="g6-sec" aria-labelledby="skc-stemmen">
          <div className="g6-in">
            <div className="g6-hd">
              <h2 className="g6-h2" id="skc-stemmen">
                {t('skc.voices.title')}
              </h2>
              <p className="g6-p">{t('skc.voices.sub')}</p>
            </div>
            <div className="g6-body">
              <div className="g6-posts" role="region" tabIndex={0} aria-label={t('skc.voices.postsLabel')}>
                {SKC_POSTS.map(([img, n, iso]) => (
                  <div className="g6-post" key={img}>
                    <Image
                      src={`/home/klanten/${img}.webp`}
                      width={720}
                      height={900}
                      sizes="(max-width: 599px) 44vw, (max-width: 860px) 30vw, 340px"
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
            </div>
          </div>
        </section>
      </div>

      <section className="g6-sec" aria-labelledby="skc-week">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="skc-week">
              {t('skc.week.title')}
            </h2>
            <p className="g6-p">{t('skc.week.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win">
                <div className="g6-winbar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{t('skc.week.bar')}</span>
                </div>
                {/* below 860px the image is 1000px wide and scrolls sideways inside this region (proof.css) */}
                <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('skc.week.scrollLabel')}>
                  <Image
                    src="/proof/skc-agenda-12okt.webp"
                    width={1568}
                    height={430}
                    sizes="(max-width: 860px) 1000px, 1056px"
                    alt={t('skc.week.alt')}
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('skc.week.caption')}</span>
                <span className="g6-real">{t('skc.week.real')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="skc-live">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="skc-live">
              {t('skc.live.title')}
            </h2>
            <p className="g6-p">{t('skc.live.sub')}</p>
          </div>
          <div className="g6-body">
            <ol className="g6-list">
              {STEP_KEYS.map((k) => (
                <li className="g6-li" key={k}>
                  <h3>{t(`skc.live.steps.${k}.title`)}</h3>
                  <p>{t(`skc.live.steps.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('skc.live.links.memory')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/skills/social-media" prefetch={false}>
              {t('skc.live.links.social')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/how-it-works" prefetch={false}>
              {t('skc.live.links.start')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="skc-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="skc-vragen">
              {t('skc.faq.title')}
            </h2>
            <p className="g6-p">{t('skc.faq.sub')}</p>
          </div>
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`skc.faq.items.${k}.q`)}</summary>
                <p>{t(`skc.faq.items.${k}.a`)}</p>
              </details>
            ))}
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/case-studies" prefetch={false}>
              {t('skc.faq.links.all')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('skc.faq.links.trust')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="skc-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="skc-slot">
              {t('skc.end.title')}
            </h2>
            <p className="g6-p">{t('skc.end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('skc.end.cta')}
            </Link>
            <Link className="g6-lk" href="/case-studies" prefetch={false}>
              {t('skc.end.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
