// Ported by hand from the approved prototype design/ronde1b/golf6-trust.tpl.html (2026-11-02 website-audit folder,
// golf 6), like HowItWorksSections. Same markup and classes; every text node is a key under trust. The chain in
// "Wat je je klant vertelt" carries no GDPR role names: Daley's processor agreement (docs/legal) names the agency the
// controller and FMai the processor, so "agency = processor, FMai = sub-processor" was not what it says (2026-11-07).
import type { ReactNode } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['hosting', 'model', 'dpa'] as const
const CHAIN_KEYS = ['client', 'agency', 'fmai'] as const
const HOSTING_KEYS = ['app', 'database', 'server', 'queues'] as const
const MODEL_KEYS = ['anthropic', 'openai'] as const
const MODEL_COLS = ['training', 'retention', 'contract'] as const
const RETENTION_KEYS = ['chats', 'leads', 'inbox', 'uploads'] as const
const LIMIT_KEYS = ['zdr', 'model', 'cdn'] as const
const FAQ_KEYS = ['allowed', 'providers', 'training', 'cancel', 'dpa'] as const

const PRIVACY_EMAIL = 'privacy@future-marketing.ai'
// Re-read on the day of PR 6b (Codex search, 2026-11-07); the copy in trust.model paraphrases these pages.
const SOURCES = {
  anthropicTerms: 'https://www.anthropic.com/legal/commercial-terms',
  anthropicRetention:
    'https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data',
  anthropicDpa: 'https://www.anthropic.com/legal/data-processing-addendum',
  openaiData: 'https://developers.openai.com/api/docs/guides/your-data',
  openaiDpa: 'https://openai.com/policies/data-processing-addendum/',
} as const

function privacyLink(anchor: string, c: ReactNode) {
  return (
    <Link href={`/legal/privacy#${anchor}`} prefetch={false}>
      {c}
    </Link>
  )
}
const mail = (c: ReactNode) => <a href={`mailto:${PRIVACY_EMAIL}`}>{c}</a>

export async function TrustSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'trust' })
  const subProcessors = (c: ReactNode) => privacyLink('privacy-sub_processors', c)
  // #regie only exists on the Dutch home; the English home shows the same idea under #people
  const approvalAnchor = locale === 'nl' ? '/#regie' : '/#people'

  return (
    <div className="g6" id="g6-trust">
      <section className="g6-hero" aria-labelledby="tr-h1">
        <div className="g6-in">
          <Breadcrumbs path="/trust" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="tr-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-trust-summary">{t('hero.definition')}</p>
              <p className="g6-date">{t('hero.updated')}</p>
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

      <section className="g6-sec" aria-labelledby="tr-klant">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-klant">
              {t('chain.title')}
            </h2>
            <p className="g6-p">{t('chain.sub')}</p>
          </div>
          <div className="g6-body">
            <ol className="g6-list g6-one">
              {CHAIN_KEYS.map((k) => (
                <li className="g6-li" key={k}>
                  <h3>{t(`chain.items.${k}.title`)}</h3>
                  <p>{t.rich(`chain.items.${k}.text`, { link: subProcessors })}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-hosting">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-hosting">
              {t('hosting.title')}
            </h2>
            <p className="g6-p">{t('hosting.sub')}</p>
          </div>
          <div className="g6-body g6-cards">
            {HOSTING_KEYS.map((k) => (
              <div className="g6-card" key={k}>
                <h3>{t(`hosting.${k}.title`)}</h3>
                <p className="g6-place">{t(`hosting.${k}.place`)}</p>
                <p>{t(`hosting.${k}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-model">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-model">
              {t('model.title')}
            </h2>
            <p className="g6-p">{t('model.sub')}</p>
          </div>
          <div className="g6-body">
            <div className="g6-tw" tabIndex={0} role="region" aria-labelledby="tr-model-cap">
              <table className="g6-sticky">
                <caption id="tr-model-cap">{t('model.caption')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('model.cols.provider')}</th>
                    {MODEL_COLS.map((c) => (
                      <th scope="col" key={c}>
                        {t(`model.cols.${c}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODEL_KEYS.map((k) => (
                    <tr key={k}>
                      <th scope="row">{t(`model.${k}.name`)}</th>
                      {MODEL_COLS.map((c) => (
                        <td key={c}>{t(`model.${k}.${c}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="g6-src">
              {t.rich('model.sources', {
                terms: (c) => <a href={SOURCES.anthropicTerms}>{c}</a>,
                retention: (c) => <a href={SOURCES.anthropicRetention}>{c}</a>,
                adpa: (c) => <a href={SOURCES.anthropicDpa}>{c}</a>,
                openai: (c) => <a href={SOURCES.openaiData}>{c}</a>,
                odpa: (c) => <a href={SOURCES.openaiDpa}>{c}</a>,
                link: subProcessors,
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-gescheiden">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-gescheiden">
              {t('separate.title')}
            </h2>
            <div className="g6-txt">
              <p className="g6-p">{t('separate.p1')}</p>
              <p className="g6-p">{t('separate.p2')}</p>
            </div>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('separate.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-akkoord">
        <div className="g6-in">
          <div className="g6-split">
            <div className="g6-copy">
              <h2 className="g6-h2" id="tr-akkoord">
                {t('approval.title')}
              </h2>
              <p className="g6-p">{t('approval.sub')}</p>
              <div className="g6-links">
                <Link className="g6-lk" href={approvalAnchor} prefetch={false}>
                  {t('approval.link')} <Arrow />
                </Link>
              </div>
            </div>
            <figure className="g6-shot">
              <div className="g6-win">
                <div className="g6-winbar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>{t('approval.bar')}</span>
                </div>
                <Image
                  src="/proof/akkoord-luwte.webp"
                  width={1720}
                  height={1020}
                  sizes="(max-width: 860px) 100vw, 700px"
                  alt={t('approval.alt')}
                  loading="lazy"
                />
              </div>
              <figcaption className="g6-cap">
                <span>{t('approval.caption')}</span>
                <span className="g6-demo">{t('approval.demo')}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-bewaren">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-bewaren">
              {t('retention.title')}
            </h2>
            <p className="g6-p">{t.rich('retention.sub', { link: (c) => privacyLink('privacy-data_retention', c) })}</p>
          </div>
          <div className="g6-body">
            <div className="g6-tw" tabIndex={0} role="region" aria-labelledby="tr-bew-cap">
              <table>
                <caption id="tr-bew-cap">{t('retention.caption')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('retention.cols.what')}</th>
                    <th scope="col">{t('retention.cols.term')}</th>
                  </tr>
                </thead>
                <tbody>
                  {RETENTION_KEYS.map((k) => (
                    <tr key={k}>
                      <th scope="row">{t(`retention.${k}.what`)}</th>
                      <td>{t(`retention.${k}.term`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-niet">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-niet">
              {t('limits.title')}
            </h2>
            <p className="g6-p">{t('limits.sub')}</p>
          </div>
          <div className="g6-body g6-cards g6-three">
            {LIMIT_KEYS.map((k) => (
              <div className="g6-card" key={k}>
                <h3>{t(`limits.${k}.title`)}</h3>
                <p>{t(`limits.${k}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="tr-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-vragen">
              {t('faq.title')}
            </h2>
            <p className="g6-p">{t('faq.sub')}</p>
          </div>
          <div className="g6-body g6-faq">
            {FAQ_KEYS.map((k) => (
              <details className="g6-q" key={k}>
                <summary>{t(`faq.items.${k}.q`)}</summary>
                <p>{t.rich(`faq.items.${k}.a`, { link: subProcessors, mail })}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="g6-sec g6-end" aria-labelledby="tr-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="tr-slot">
              {t('end.title')}
            </h2>
            <p className="g6-p">{t('end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <a className="g6-lk" href={`mailto:${PRIVACY_EMAIL}`}>
              {t('end.link')} <Arrow />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
