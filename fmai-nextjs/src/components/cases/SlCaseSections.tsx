// Ported by hand from the approved prototype design/ronde1b/golf7-saleslobe.tpl.html (2026-11-02 website-audit folder,
// golf 7b, r4, Paul's yes on the mockup 2026-11-07). Same markup and classes; every text node of ours is a key under
// case_studies.sl. The quoted posts and the voice-round openings below are SalesLobe's own English text (rows 57596 and
// 57600, stemronde-1 C1), shown verbatim with lang="en" in every locale, so they are constants and not translated.
// Excluded on purpose: the LinkedIn documents (Paul's avatar on every slide) and the posts the case rules refuse.
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['channels', 'since', 'october'] as const
// LinkedIn text post of 23 October 2026 (row 57596), the first four paragraphs; the fifth names Corty
const LI_POST = [
  'When I was cold calling, "not right now" was one of the best answers I could get.',
  "It wasn't a no. It was a door someone left open.",
  'In email it\'s the same. "Not right now" and "not interested" look alike in a busy inbox, and they need completely different follow-ups. One is a nurture. The other is: stop, remove, move on.',
  'Mix them up and you either lose a deal that was coming, or keep emailing someone who asked you not to.',
] as const
// Instagram carousel of 27 October 2026 (row 57600): caption and hashtags
const IG_CAPTION = [
  '"Not right now" ≠ "not interested"',
  'One is a door left open. The other is a clear stop. Treat them the same and it costs you either way.',
  'Save this for your next inbox session.',
] as const
const IG_TAGS = '#coldemail #outboundsales #leadgen #salestips #agencyowner'
const SLIDES = ['s01', 's02', 's03', 's04', 's05', 's06'] as const
// the opening of post C1 in the three tones of the voice round; Paul picked B
const VERSIONS = [
  ['a', 'Most AI reply tools give you one switch. On or off.'],
  ['b', "I've sold phones in a shop, made cold calls, sold software, and today I run email outbound for clients."],
  ['c', '"Can AI answer our cold email replies?" Yes. In seconds.'],
] as const
const CHOICE_KEYS = ['who', 'spelling', 'emoji', 'cta', 'numbers', 'autopilot'] as const
const STEP_KEYS = ['concept', 'approve', 'live'] as const
const FAQ_KEYS = ['channels', 'language', 'voice', 'results'] as const

export async function SlCaseSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'case_studies' })

  return (
    <div className="g6" id="g6-sl">
      <section className="g6-hero" aria-labelledby="sl-h1">
        <div className="g6-in">
          <Breadcrumbs path="/case-studies/saleslobe" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('sl.hero.eyebrow')}</p>
              <h1 className="g6-h1" id="sl-h1">
                {t('sl.hero.title')}
              </h1>
              <p className="g6-def speakable-sl-def">{t('sl.hero.definition')}</p>
            </div>
            <dl className="g6-facts" aria-label={t('sl.hero.factsLabel')}>
              {FACT_KEYS.map((k) => (
                <div key={k}>
                  <dt>{t(`sl.hero.facts.${k}.label`)}</dt>
                  <dd>{t(`sl.hero.facts.${k}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sl-twee">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sl-twee">
              {t('sl.two.title')}
            </h2>
            <p className="g6-p">{t('sl.two.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-two">
                <div className="g6-quote">
                  <p className="g6-eb">{t('sl.two.liLabel')}</p>
                  <div lang="en">
                    {LI_POST.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <p className="g6-sm">{t('sl.two.liNote')}</p>
                </div>
                <div className="g6-quote">
                  <p className="g6-eb">{t('sl.two.igLabel')}</p>
                  <Image
                    src="/proof/sl-notnow-s01.webp"
                    width={720}
                    height={900}
                    sizes="260px"
                    alt={t('sl.two.igAlt')}
                    loading="lazy"
                  />
                  <div lang="en">
                    {IG_CAPTION.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <p className="g6-sm" lang="en">
                    {IG_TAGS}
                  </p>
                </div>
              </div>
              <figcaption className="g6-cap">
                <span className="g6-real">{t('sl.two.caption')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sl-slides">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sl-slides">
              {t('sl.slides.title')}
            </h2>
            <p className="g6-p">{t('sl.slides.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              {/* six columns of at least 140px, so below ~960px the strip scrolls sideways inside its frame (proof.css) */}
              <div className="g6-strip" tabIndex={0} role="region" aria-label={t('sl.slides.stripLabel')}>
                {SLIDES.map((s, i) => (
                  <div className="g6-post" key={s}>
                    <Image
                      src={`/proof/sl-notnow-${s}.webp`}
                      width={720}
                      height={900}
                      sizes="(max-width: 960px) 150px, 190px"
                      alt={t(`sl.slides.alts.${s}`)}
                      loading="lazy"
                    />
                    <p>{t('sl.slides.of', { n: i + 1 })}</p>
                  </div>
                ))}
              </div>
              <figcaption className="g6-cap">
                <span className="g6-real">{t('sl.slides.caption')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sl-stem">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sl-stem">
              {t('sl.voice.title')}
            </h2>
            <p className="g6-p">{t('sl.voice.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <p className="g6-sm">{t('sl.voice.note')}</p>
              <div className="g6-cards g6-three g6-vs">
                {VERSIONS.map(([v, text]) => (
                  <div className={v === 'b' ? 'g6-card g6-pick' : 'g6-card'} key={v}>
                    <p className="g6-eb">{t(`sl.voice.versions.${v}`)}</p>
                    <p lang="en">{text}</p>
                  </div>
                ))}
              </div>
              <figcaption className="g6-cap">
                <span className="g6-real">{t('sl.voice.caption')}</span>
              </figcaption>
            </figure>
          </div>
          <div className="g6-body g6-split">
            <div className="g6-copy">
              <h3 className="g6-wk-t">{t('sl.voice.choicesTitle')}</h3>
              <p className="g6-sm">{t('sl.voice.choicesSub')}</p>
            </div>
            <dl className="g6-facts" aria-label={t('sl.voice.choicesLabel')}>
              {CHOICE_KEYS.map((k) => (
                <div key={k}>
                  <dt>{t(`sl.voice.choices.${k}.label`)}</dt>
                  <dd>{t(`sl.voice.choices.${k}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sl-live">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sl-live">
              {t('sl.live.title')}
            </h2>
            <p className="g6-p">{t('sl.live.sub')}</p>
          </div>
          <div className="g6-body">
            <ol className="g6-list g6-one">
              {STEP_KEYS.map((k) => (
                <li className="g6-li" key={k}>
                  <h3>{t(`sl.live.steps.${k}.title`)}</h3>
                  <p>{t(`sl.live.steps.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('sl.live.links.memory')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/case-studies/skinclarity-club" prefetch={false}>
              {t('sl.live.links.skc')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="sl-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sl-vragen">
              {t('sl.faq.title')}
            </h2>
            <p className="g6-p">{t('sl.faq.sub')}</p>
          </div>
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`sl.faq.items.${k}.q`)}</summary>
                <p>{t(`sl.faq.items.${k}.a`)}</p>
              </details>
            ))}
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/case-studies" prefetch={false}>
              {t('sl.faq.links.all')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="sl-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="sl-slot">
              {t('sl.end.title')}
            </h2>
            <p className="g6-p">{t('sl.end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('sl.end.cta')}
            </Link>
            <Link className="g6-lk" href="/case-studies" prefetch={false}>
              {t('sl.end.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
