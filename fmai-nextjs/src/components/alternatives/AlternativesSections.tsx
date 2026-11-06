// Ported by hand from the approved prototype design/ronde1b/golf6-alternatives.tpl.html (2026-11-02 website-audit
// folder, golf 6), like HowItWorksSections. Same markup and classes; every text node is a key under alternatives.
// Prices and features of the other tools were fetched again on the day of PR 6b (Codex search, 2026-11-07);
// re-check them on these pages before changing the copy, and keep home.waarom.table on the same amounts.
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['routes', 'perRoute', 'sources'] as const
const COLS = ['workspace', 'approval', 'memory', 'publishes', 'data', 'price'] as const
const ROW_KEYS = ['clyde', 'diy', 'lindy', 'sintra', 'gosocio', 'aidelly', 'storychief', 'planable', 'aicollegas'] as const
const FAQ_KEYS = ['chatgpt', 'lindy', 'oneClient'] as const

const SRC = {
  chatgptBusiness: 'https://help.openai.com/en/articles/8542115-chatgpt-business-general-faq',
  chatgptResidency: 'https://help.openai.com/en/articles/20001418-where-your-chatgpt-business-content-is-stored',
  chatgptProjects: 'https://help.openai.com/en/articles/10169521-projects-in-chatgpt',
  planable: 'https://planable.io/pricing/',
} as const

// Every page a table cell or card leans on. diy cites its pages by name (rich text); the others show the URL.
const TOOLS = [
  { key: 'diy', id: 'zelf-doen', sources: [] },
  {
    key: 'lindy',
    sources: [
      'https://www.lindy.ai/',
      'https://www.lindy.ai/pricing',
      'https://www.lindy.ai/hire/social-media-manager',
      'https://www.lindy.ai/security',
    ],
  },
  {
    key: 'sintra',
    sources: [
      'https://sintra.ai/pricing',
      'https://sintra.ai/ai-employees/social-media-manager',
      'https://help.sintra.ai/en/articles/12638328-sintra-workspace-features-and-their-interaction',
      'https://sintra.ai/legal/data-processing-agreement',
    ],
  },
  { key: 'gosocio', sources: ['https://gosocio.ai/', 'https://gosocio.ai/pricing', 'https://gosocio.ai/about'] },
  {
    key: 'aidelly',
    sources: [
      'https://www.aidelly.ai/pricing',
      'https://www.aidelly.ai/mcp',
      'https://www.aidelly.ai/docs/app/brand-profile',
      'https://www.aidelly.ai/gdpr',
    ],
  },
  {
    key: 'storychief',
    sources: [
      'https://www.storychief.io/pricing',
      'https://www.storychief.io/train-ai-on-your-business',
      'https://www.storychief.io/distribution',
      'https://get.storychief.io/hubfs/gdpr/Security_in_StoryChief.pdf',
    ],
  },
  {
    key: 'planable',
    sources: [
      SRC.planable,
      'https://planable.io/product/',
      'https://planable.io/processors/',
      'https://help.planable.io/hc/en-us/articles/27960528842396-Brand-context-for-AI-generated-content',
    ],
  },
  {
    key: 'aicollegas',
    sources: [
      'https://aicollegas.nl/wat-we-doen/ai-partnership',
      'https://www.aicollegas.nl/wat-we-doen/ai-agents',
      'https://aicollegas.nl/sectoren/marketing',
      'https://aicollegas.nl/algemene-voorwaarden',
    ],
  },
] as const

function ext(href: string, c: ReactNode) {
  return (
    <a href={href} rel="nofollow">
      {c}
    </a>
  )
}
const shortUrl = (href: string) => href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')

export async function AlternativesSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'alternatives' })
  // #waarom only exists on the Dutch home; the English home has the comparison table
  const whyAnchor = locale === 'nl' ? '/#waarom' : '/#comparison-table'

  return (
    <div className="g6" id="g6-alternatives">
      <section className="g6-hero" aria-labelledby="alt-h1">
        <div className="g6-in">
          <Breadcrumbs path="/alternatives" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="alt-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-alternatives-summary">{t('hero.definition')}</p>
              <p className="g6-date">{t('hero.checked')}</p>
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

      <section className="g6-sec" aria-labelledby="alt-tabel">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="alt-tabel">
              {t('table.title')}
            </h2>
            <p className="g6-p">{t('table.sub')}</p>
          </div>
          <div className="g6-body">
            <div className="g6-tw" tabIndex={0} role="region" aria-labelledby="alt-cap">
              <table className="g6-sticky g6-wide">
                <caption id="alt-cap">{t('table.caption')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('table.cols.route')}</th>
                    {COLS.map((c) => (
                      <th scope="col" key={c}>
                        {t(`table.cols.${c}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROW_KEYS.map((r) => (
                    <tr key={r} className={r === 'clyde' ? 'g6-us' : undefined}>
                      <th scope="row">{t(`table.rows.${r}.name`)}</th>
                      {COLS.map((c) => (
                        <td key={c}>{t(`table.rows.${r}.${c}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="g6-src">
              {t.rich('table.source', {
                mail: (c) => <a href="mailto:hello@future-marketing.ai">{c}</a>,
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="alt-clyde">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="alt-clyde">
              {t('clyde.title')}
            </h2>
            <div className="g6-txt">
              <p className="g6-p">{t('clyde.p1')}</p>
              <p className="g6-p">{t('clyde.p2')}</p>
            </div>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/pricing" prefetch={false}>
              {t('clyde.links.pricing')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('clyde.links.trust')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="alt-tools">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="alt-tools">
              {t('tools.title')}
            </h2>
            <p className="g6-p">{t('tools.sub')}</p>
          </div>
          <div className="g6-body g6-tools">
            {TOOLS.map((tool) => {
              const name = t(`tools.items.${tool.key}.name`)
              return (
                <article className="g6-card g6-tool" key={tool.key} id={'id' in tool ? tool.id : undefined}>
                  <p className="g6-eb">{t(`tools.items.${tool.key}.eyebrow`)}</p>
                  <h3>{name}</h3>
                  <dl>
                    <div>
                      <dt>{t('tools.labels.what')}</dt>
                      <dd>{t(`tools.items.${tool.key}.what`)}</dd>
                    </div>
                    <div>
                      <dt>{tool.key === 'diy' ? t('tools.labels.pickThis') : t('tools.labels.pickThem', { name })}</dt>
                      <dd>{t(`tools.items.${tool.key}.pickThem`)}</dd>
                    </div>
                    <div>
                      <dt>{t('tools.labels.pickClyde')}</dt>
                      <dd>{t(`tools.items.${tool.key}.pickClyde`)}</dd>
                    </div>
                  </dl>
                  <p className="g6-src">
                    {tool.key === 'diy' ? (
                      t.rich('tools.items.diy.source', {
                        business: (c) => ext(SRC.chatgptBusiness, c),
                        residency: (c) => ext(SRC.chatgptResidency, c),
                        projects: (c) => ext(SRC.chatgptProjects, c),
                        planable: (c) => ext(SRC.planable, c),
                      })
                    ) : (
                      <>
                        {t(tool.sources.length > 1 ? 'tools.labels.sources' : 'tools.labels.source')}{' '}
                        {tool.sources.map((href, i) => (
                          <span key={href}>
                            {i > 0 && ', '}
                            <a href={href} rel="nofollow">
                              {shortUrl(href)}
                            </a>
                          </span>
                        ))}
                      </>
                    )}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="alt-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="alt-vragen">
              {t('faq.title')}
            </h2>
            <p className="g6-p">{t('faq.sub')}</p>
          </div>
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`faq.items.${k}.q`)}</summary>
                <p>{t(`faq.items.${k}.a`)}</p>
              </details>
            ))}
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href={whyAnchor} prefetch={false}>
              {t('faq.links.why')} <Arrow />
            </Link>
            {/* The comparison article only exists in Dutch; on /en the link text says so */}
            <Link className="g6-lk" href="/kennisbank/clyde-vs-jasper-chatgpt-semrush" locale="nl" prefetch={false}>
              {t('faq.links.kennisbank')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="alt-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="alt-slot">
              {t('end.title')}
            </h2>
            <p className="g6-p">{t('end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('end.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
