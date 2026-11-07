// Ported by hand from the approved prototype design/ronde1b/golf8-client-portal.tpl.html (2026-11-02 website-audit
// folder, golf 8a, r4, Daley's yes 2026-11-07). Same markup and classes; every text node is a key under client_portal.
// Three screens are real (calendar, phone, request form), captured as the viewer of the demo client Dagspa Luwte; the
// portal with white-label, the approval window and the Ask Clyde card are rebuilt scenes with their own caption, because
// white-label is on for no org yet, a viewer sees no approve buttons and Luwte has no strategy page.
// Brand content of the demo client (post title and caption, names) is Dutch in every locale, so it is marked lang="nl".
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['portal', 'approve', 'phone'] as const
const NAV_KEYS = ['dashboard', 'content', 'inbox', 'requests', 'calendar', 'reports'] as const
const ROW_KEYS = ['content', 'calendar', 'reports', 'strategy', 'media', 'requests'] as const
const WHO_ROWS = ['r1', 'r2', 'r3', 'r4'] as const
const WHO_COLS = ['clyde', 'you', 'client'] as const
const LINE_KEYS = ['l1', 'l2', 'l3'] as const
const FAQ_KEYS = ['brand', 'approver', 'whatsapp', 'price'] as const
const POST_TITLE = 'Welke behandeling past bij jou?'
const POST_CAPTION = 'Swipe door alle drie. Reageer RUST, dan sturen we je de link.'
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

function NovaMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.4" fill="currentColor" />
      <path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="18.4" cy="5.6" r="1.7" fill="currentColor" />
    </svg>
  )
}

export async function ClientPortalSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'client_portal' })
  const demo = <span className="g6-demo">{t('demo')}</span>

  return (
    <div className="g6" id="g6-cp">
      <section className="g6-hero" aria-labelledby="cp-h1">
        <div className="g6-in">
          <Breadcrumbs path="/client-portal" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="cp-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-cp-def">{t('hero.definition')}</p>
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
              <div className="g6-win" role="img" aria-label={t('hero.scene.label')}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('hero.scene.bar')}</span>
                </div>
                <div className="g6-app g6-wl">
                  <div className="g6-app-side">
                    <p className="g6-app-brand">
                      <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="26px" alt="" />
                      Dagspa Luwte
                    </p>
                    <p className="g6-app-nav">
                      {NAV_KEYS.map((k) => (
                        <span key={k} className={k === 'content' ? 'g6-on' : undefined}>
                          {t(`hero.scene.nav.${k}`)}
                        </span>
                      ))}
                    </p>
                    <p className="g6-app-foot">
                      <span className="g6-nd">
                        <NovaMark />
                      </span>
                      Nova Digital
                    </p>
                  </div>
                  <div className="g6-app-main">
                    <p className="g6-app-h">{t('hero.scene.head')}</p>
                    <div className="g6-sheet">
                      <Image src="/home/week/s1.webp" width={700} height={875} sizes="(max-width: 860px) 90vw, 240px" alt="" />
                      <div className="g6-col">
                        <p className="g6-app-when">{t('hero.scene.when')}</p>
                        <p className="g6-app-t" lang="nl">
                          {POST_TITLE}
                          <small>{POST_CAPTION}</small>
                        </p>
                        <p>
                          <span className="g6-chip">{t('hero.scene.status')}</span>
                        </p>
                        <p className="g6-acts">
                          <span className="g6-b g6-fill">{t('hero.scene.approve')}</span>
                          <span className="g6-b">{t('hero.scene.changes')}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('hero.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-ziet">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-ziet">
              {t('sees.title')}
            </h2>
            <p className="g6-p">{t('sees.sub')}</p>
          </div>
          <div className="g6-body">
            <div className="g6-tw">
              <table>
                <caption>{t('sees.tableCaption')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('sees.colIn')}</th>
                    <th scope="col">{t('sees.colDo')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ROW_KEYS.map((k) => (
                    <tr key={k}>
                      <th scope="row">{t(`sees.rows.${k}.label`)}</th>
                      <td>{t(`sees.rows.${k}.text`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win g6-fit" style={fit(953)}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('sees.shot.bar')}</span>
                </div>
                <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('sees.shot.scrollLabel')}>
                  <Image
                    src="/proof/portaal-kalender.webp"
                    width={1906}
                    height={1404}
                    sizes="953px"
                    alt={t('sees.shot.alt')}
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('sees.shot.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
          <div className="g6-links">
            {/* the kennisbank articles are Dutch only, like the link on /alternatives */}
            <Link className="g6-lk" href="/kennisbank/contentkalender-maken-meerdere-klanten" locale="nl" prefetch={false}>
              {t('sees.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-goed">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-goed">
              {t('approve.title')}
            </h2>
            <div className="g6-txt">
              <p className="g6-p">{t('approve.p1')}</p>
              <p className="g6-p">{t('approve.p2')}</p>
            </div>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-pair">
                <div className="g6-win" role="img" aria-label={t('approve.scene.label')}>
                  <div className="g6-winbar">
                    <i />
                    <i />
                    <i />
                    <span>{t('approve.scene.bar')}</span>
                  </div>
                  <div className="g6-app g6-solo">
                    <div className="g6-app-main">
                      <div className="g6-sheet">
                        <Image src="/home/week/s1.webp" width={700} height={875} sizes="(max-width: 860px) 90vw, 300px" alt="" loading="lazy" />
                        <div className="g6-col">
                          <p className="g6-app-when">{t('approve.scene.when')}</p>
                          <p className="g6-app-t" lang="nl">
                            {POST_TITLE}
                          </p>
                          <p className="g6-opts">
                            <span className="g6-b">{t('approve.scene.approve')}</span>
                            <span className="g6-b g6-on">{t('approve.scene.changes')}</span>
                            <span className="g6-b">{t('approve.scene.reject')}</span>
                          </p>
                          <p className="g6-fld">
                            <span>{t('approve.scene.field')}</span>
                            <span className="g6-box g6-tall">{t('approve.scene.placeholder')}</span>
                          </p>
                          <p>
                            <span className="g6-b g6-fill">{t('approve.scene.submit')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="g6-phone">
                  <div className="g6-phone-s">
                    <Image
                      src="/proof/portaal-telefoon.webp"
                      width={780}
                      height={1688}
                      sizes="282px"
                      alt={t('approve.phoneAlt')}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('approve.captionBuilt')}</span>
                <span>{t('approve.captionReal')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-aanvraag">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-aanvraag">
              {t('requests.title')}
            </h2>
            <p className="g6-p">{t('requests.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win g6-fit" style={fit(673)}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('requests.shot.bar')}</span>
                </div>
                <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('requests.shot.scrollLabel')}>
                  <Image
                    src="/proof/portaal-aanvraag.webp"
                    width={1346}
                    height={1380}
                    sizes="673px"
                    alt={t('requests.shot.alt')}
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('requests.shot.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-clyde">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-clyde">
              {t('clyde.title')}
            </h2>
            <p className="g6-p">{t('clyde.sub')}</p>
          </div>
          <div className="g6-body g6-split g6-even">
            <div className="g6-copy">
              <p className="g6-sm">{t('clyde.note')}</p>
            </div>
            <figure className="g6-shot">
              <div className="g6-win g6-narrow" role="img" aria-label={t('clyde.scene.label')}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('clyde.scene.bar')}</span>
                </div>
                <div className="g6-app g6-solo">
                  <div className="g6-app-main">
                    <p className="g6-app-h">{t('clyde.scene.head')}</p>
                    <p className="g6-ask">
                      <span className="g6-chip">{t('clyde.scene.q1')}</span>
                      <span className="g6-chip">{t('clyde.scene.q2')}</span>
                      <span className="g6-chip">{t('clyde.scene.q3')}</span>
                    </p>
                  </div>
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('clyde.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/skills/clyde" prefetch={false}>
              {t('clyde.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-wie">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-wie">
              {t('who.title')}
            </h2>
            <p className="g6-p">{t('who.sub')}</p>
          </div>
          <div className="g6-body">
            {/* on a phone each row becomes a card; role= keeps the table semantics once CSS sets display:block */}
            <div className="g6-tw g6-stack">
              <table role="table" aria-label={t('who.tableLabel')}>
                <thead role="rowgroup">
                  <tr role="row">
                    {WHO_COLS.map((c) => (
                      <th role="columnheader" scope="col" key={c}>
                        {t(`who.cols.${c}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {WHO_ROWS.map((r) => (
                    <tr role="row" key={r}>
                      {WHO_COLS.map((c) => (
                        <td role="cell" data-l={t(`who.cols.${c}`)} key={c}>
                          {t(`who.rows.${r}.${c}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-vertel">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-vertel">
              {t('tell.title')}
            </h2>
            <p className="g6-p">{t('tell.sub')}</p>
          </div>
          <div className="g6-body">
            <div className="g6-quote">
              <p className="g6-eb">{t('tell.label')}</p>
              {LINE_KEYS.map((k) => (
                <p key={k}>{t(`tell.lines.${k}`)}</p>
              ))}
            </div>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('tell.links.trust')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('tell.links.memory')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cp-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-vragen">
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

      <section className="g6-sec g6-end" aria-labelledby="cp-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cp-slot">
              {t('end.title')}
            </h2>
            <p className="g6-p">{t('end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/skills/clyde" prefetch={false}>
              {t('end.links.clyde')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('end.links.trust')} <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
