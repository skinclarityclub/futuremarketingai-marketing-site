// Ported by hand from the approved prototype design/ronde1b/golf6-memory.tpl.html (2026-11-02 website-audit folder,
// golf 6). Same markup and classes; every text node is a key under memory. The ChatGPT source was fetched again on
// the day of PR 6a (Codex search, 2026-11-07), which narrowed the second sentence of the ChatGPT card.
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['perClient', 'updated', 'kept'] as const
const SOURCE_KEYS = ['brand', 'strategy', 'memories', 'conversation'] as const
const FAQ_KEYS = ['leak', 'what', 'howLong', 'kept', 'where'] as const
const CHATGPT_PROJECTS_URL = 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt'
const KENNISBANK_ARTICLE = '/kennisbank/ai-marketing-agent-geheugen-en-leren'

export async function MemorySections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'memory' })
  // #waarom only exists on the Dutch home; the English home has the comparison table
  const routesAnchor = locale === 'nl' ? '/#waarom' : '/#comparison-table'

  const cards = (section: 'separate' | 'chatgpt' | 'month', keys: readonly string[]) => (
    <div className="g6-body g6-two">
      {keys.map((k) => (
        <div className="g6-card" key={k}>
          <p className="g6-eb">{t(`${section}.cards.${k}.eyebrow`)}</p>
          <h3>{t(`${section}.cards.${k}.title`)}</h3>
          <p>{t(`${section}.cards.${k}.text`)}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="g6" id="g6-memory">
      <section className="g6-hero" aria-labelledby="mem-h1">
        <div className="g6-in">
          <Breadcrumbs path="/memory" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="mem-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-memory-def">{t('hero.definition')}</p>
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

      <section className="g6-sec" aria-labelledby="mem-scherm">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-scherm">
              {t('screen.title')}
            </h2>
            <p className="g6-p">{t('screen.sub')}</p>
          </div>
          <figure className="g6-shot g6-body">
            <div className="g6-win">
              <div className="g6-winbar" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{t('screen.bar')}</span>
              </div>
              <Image
                src="/proof/geheugen-luwte.webp"
                width={2880}
                height={1800}
                sizes="(max-width: 1200px) 100vw, 1056px"
                alt={t('screen.alt')}
                loading="lazy"
              />
            </div>
            <figcaption className="g6-cap">
              <span>{t('screen.caption')}</span>
              <span className="g6-demo">{t('screen.demo')}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="mem-bronnen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-bronnen">
              {t('sources.title')}
            </h2>
            <p className="g6-p">{t('sources.sub')}</p>
          </div>
          <div className="g6-body">
            <ol className="g6-list">
              {SOURCE_KEYS.map((k) => (
                <li className="g6-li" key={k}>
                  <h3>{t(`sources.items.${k}.title`)}</h3>
                  <p>{t(`sources.items.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="mem-stem">
        <div className="g6-in">
          <div className="g6-split">
            <div className="g6-copy">
              <h2 className="g6-h2" id="mem-stem">
                {t('voice.title')}
              </h2>
              <p className="g6-p">{t('voice.sub')}</p>
            </div>
            <figure className="g6-shot">
              <blockquote className="g6-quote">
                <p className="g6-eb">{t('voice.label')}</p>
                <p>{t('voice.quote')}</p>
              </blockquote>
              <figcaption className="g6-cap">
                <span>{t('voice.caption')}</span>
                <span className="g6-demo">{t('voice.demo')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="mem-gescheiden">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-gescheiden">
              {t('separate.title')}
            </h2>
            <p className="g6-p">{t('separate.sub')}</p>
          </div>
          {cards('separate', ['separate', 'nightly'])}
          <div className="g6-links">
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('separate.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="mem-chatgpt">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-chatgpt">
              {t('chatgpt.title')}
            </h2>
            <p className="g6-p">{t('chatgpt.sub')}</p>
          </div>
          {cards('chatgpt', ['chatgpt', 'clyde'])}
          <p className="g6-src">
            {t.rich('chatgpt.source', { link: (c) => <a href={CHATGPT_PROJECTS_URL}>{c}</a> })}
          </p>
          <div className="g6-links">
            <Link className="g6-lk" href={routesAnchor} prefetch={false}>
              {t('chatgpt.links.routes')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/alternatives" prefetch={false}>
              {t('chatgpt.links.alternatives')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="mem-maand">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-maand">
              {t('month.title')}
            </h2>
            <p className="g6-p">{t('month.sub')}</p>
          </div>
          {cards('month', ['first', 'after'])}
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="mem-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-vragen">
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
                      <Link href="/trust" prefetch={false}>
                        {c}
                      </Link>
                    ),
                  })}
                </p>
              </details>
            ))}
          </div>
          <div className="g6-links">
            {/* the article is Dutch only; on /en this link opens the Dutch version and says so */}
            <Link className="g6-lk" href={KENNISBANK_ARTICLE} locale="nl" prefetch={false}>
              {t('faq.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="mem-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="mem-slot">
              {t('end.title')}
            </h2>
            <p className="g6-p">{t('end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/how-it-works" prefetch={false}>
              {t('end.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
