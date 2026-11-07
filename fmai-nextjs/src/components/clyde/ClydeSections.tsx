// Ported by hand from the approved prototype design/ronde1b/golf8-clyde.tpl.html (2026-11-02 website-audit folder,
// golf 8a, r4, Daley's yes 2026-11-07). Same markup and classes; every text node is a key under skills-clyde.
// The screens are real captures from the demo environment (Nova Digital, Dagspa Luwte); the WhatsApp conversation and
// the client's Ask Clyde card are rebuilt scenes with their own caption.
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Arrow } from '@/components/proof/Arrow'
import '@/components/proof/proof.css'

const FACT_KEYS = ['where', 'memory', 'stop'] as const
const ROLE_ROWS = ['r1', 'r2', 'r3'] as const
const ROLE_COLS = ['self', 'proposes', 'you'] as const
const MODE_KEYS = ['concept', 'report', 'silent'] as const
const STOP_KEYS = ['publish', 'whatsapp', 'task', 'client'] as const
const FAQ_KEYS = ['assistant', 'whatsapp', 'split', 'client', 'app'] as const
// --w is half the pixel width of the 2x capture, so a real screen is never shown larger than it is (proof.css)
const fit = (w: number) => ({ '--w': `${w}px` }) as CSSProperties

function ClydeMark() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <g stroke="#00d4aa" strokeWidth="30">
        <line x1="145" y1="143" x2="256" y2="256" />
        <line x1="256" y1="256" x2="340" y2="396" />
        <line x1="256" y1="256" x2="367" y2="143" />
      </g>
      <circle cx="145" cy="143" r="38" fill="#00d4aa" />
      <circle cx="256" cy="256" r="38" fill="#00d4aa" />
      <circle cx="340" cy="396" r="38" fill="#00d4aa" />
      <circle cx="367" cy="143" r="46" fill="#f5a623" />
    </svg>
  )
}

export async function ClydeSections({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'skills-clyde' })
  const demo = <span className="g6-demo">{t('demo')}</span>

  return (
    <div className="g6" id="g6-cl">
      <section className="g6-hero" aria-labelledby="cl-h1">
        <div className="g6-in">
          <Breadcrumbs path="/skills/clyde" locale={locale} className="g6-crumb" />
          <div className="g6-hero-g">
            <div className="g6-hero-t">
              <p className="g6-eb">{t('hero.eyebrow')}</p>
              <h1 className="g6-h1" id="cl-h1">
                {t('hero.title')}
              </h1>
              <p className="g6-def speakable-cl-def">{t('hero.definition')}</p>
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
              <div className="g6-win">
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('hero.shot.bar')}</span>
                </div>
                <Image
                  src="/proof/clyde-overzicht.webp"
                  width={2366}
                  height={1662}
                  sizes="(max-width: 1200px) 92vw, 1056px"
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

      <section className="g6-sec" aria-labelledby="cl-scherm">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-scherm">
              {t('screen.title')}
            </h2>
            <p className="g6-p">{t('screen.sub')}</p>
          </div>
          <div className="g6-body g6-split g6-even">
            <div className="g6-copy">
              <p className="g6-sm">{t('screen.note')}</p>
            </div>
            <figure className="g6-shot g6-scene">
              <div>
                <div className="g6-win g6-narrow">
                  <div className="g6-winbar">
                    <i />
                    <i />
                    <i />
                    <span>{t('screen.shot.bar')}</span>
                  </div>
                  <Image
                    src="/proof/clyde-paneel.webp"
                    width={796}
                    height={1162}
                    sizes="400px"
                    alt={t('screen.shot.alt')}
                    loading="lazy"
                  />
                </div>
                <figcaption className="g6-cap">
                  <span>{t('screen.shot.caption')}</span>
                  {demo}
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-voorjou">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-voorjou">
              {t('forYou.title')}
            </h2>
            <p className="g6-p">{t('forYou.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win g6-fit" style={fit(819)}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('forYou.shot.bar')}</span>
                </div>
                <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('forYou.shot.scrollLabel')}>
                  <Image
                    src="/proof/clyde-voorjou.webp"
                    width={1638}
                    height={1020}
                    sizes="819px"
                    alt={t('forYou.shot.alt')}
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('forYou.shot.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-wa">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-wa">
              {t('whatsapp.title')}
            </h2>
            <p className="g6-p">{t('whatsapp.sub')}</p>
          </div>
          <div className="g6-body g6-split g6-even">
            <div className="g6-copy">
              <p className="g6-p">{t('whatsapp.body')}</p>
            </div>
            <figure className="g6-shot g6-scene">
              <div>
                <div className="g6-wa" role="img" aria-label={t('whatsapp.scene.label')}>
                  <p className="g6-wa-top">
                    <ClydeMark />
                    <span>
                      Clyde<small>{t('whatsapp.scene.org')}</small>
                    </span>
                  </p>
                  <div className="g6-wa-b">
                    <p className="g6-wa-m g6-me">
                      {t('whatsapp.scene.m1')}
                      <small>09:12</small>
                    </p>
                    <p className="g6-wa-m">
                      {t('whatsapp.scene.m2')}
                      <small>09:12</small>
                    </p>
                    <p className="g6-wa-m g6-me">
                      {t('whatsapp.scene.m3')}
                      <small>09:13</small>
                    </p>
                    <p className="g6-wa-m">
                      {t('whatsapp.scene.m4')}
                      <small>09:13</small>
                    </p>
                    <p className="g6-wa-k">
                      <span>{t('whatsapp.scene.run')}</span>
                      <span>{t('whatsapp.scene.cancel')}</span>
                    </p>
                  </div>
                </div>
                <figcaption className="g6-cap">
                  <span>{t('whatsapp.caption')}</span>
                  {demo}
                </figcaption>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-geheugen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-geheugen">
              {t('memory.title')}
            </h2>
            <p className="g6-p">{t('memory.sub')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win g6-fit" style={fit(742)}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('memory.shot.bar')}</span>
                </div>
                <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('memory.shot.scrollLabel')}>
                  <Image
                    src="/proof/clyde-geheugen.webp"
                    width={1484}
                    height={724}
                    sizes="742px"
                    alt={t('memory.shot.alt')}
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('memory.shot.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/memory" prefetch={false}>
              {t('memory.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-klant">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-klant">
              {t('client.title')}
            </h2>
            <p className="g6-p">{t('client.sub')}</p>
          </div>
          <div className="g6-body g6-split g6-even">
            <div className="g6-copy">
              <p className="g6-sm">{t('client.note')}</p>
            </div>
            <figure className="g6-shot">
              <div className="g6-win g6-narrow" role="img" aria-label={t('client.scene.label')}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('client.scene.bar')}</span>
                </div>
                <div className="g6-app g6-solo">
                  <div className="g6-app-main">
                    <p className="g6-app-h">{t('client.scene.head')}</p>
                    <p className="g6-ask">
                      <span className="g6-chip">{t('client.scene.q1')}</span>
                      <span className="g6-chip">{t('client.scene.q2')}</span>
                      <span className="g6-chip">{t('client.scene.q3')}</span>
                    </p>
                  </div>
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('client.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/client-portal" prefetch={false}>
              {t('client.link')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-wie">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-wie">
              {t('roles.title')}
            </h2>
            <p className="g6-p">{t('roles.sub')}</p>
          </div>
          <div className="g6-body">
            {/* on a phone each row becomes a card; role= keeps the table semantics once CSS sets display:block */}
            <div className="g6-tw g6-stack">
              <table role="table" aria-label={t('roles.tableLabel')}>
                <thead role="rowgroup">
                  <tr role="row">
                    {ROLE_COLS.map((c) => (
                      <th role="columnheader" scope="col" key={c}>
                        {t(`roles.cols.${c}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {ROLE_ROWS.map((r) => (
                    <tr role="row" key={r}>
                      {ROLE_COLS.map((c) => (
                        <td role="cell" data-l={t(`roles.cols.${c}`)} key={c}>
                          {t(`roles.rows.${r}.${c}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="g6-body">
            <div className="g6-cards g6-three">
              {MODE_KEYS.map((k) => (
                <div className="g6-card" key={k}>
                  <p className="g6-eb">{t(`roles.modes.${k}.label`)}</p>
                  <p>{t(`roles.modes.${k}.text`)}</p>
                </div>
              ))}
            </div>
            <p className="g6-src">{t('roles.modesNote')}</p>
          </div>
          <div className="g6-body">
            <figure className="g6-shot">
              <div className="g6-win g6-fit" style={fit(754)}>
                <div className="g6-winbar">
                  <i />
                  <i />
                  <i />
                  <span>{t('roles.day.bar')}</span>
                </div>
                <div className="g6-scroll" tabIndex={0} role="region" aria-label={t('roles.day.scrollLabel')}>
                  <Image
                    src="/proof/clyde-dag.webp"
                    width={1508}
                    height={579}
                    sizes="754px"
                    alt={t('roles.day.alt')}
                    loading="lazy"
                  />
                </div>
              </div>
              <figcaption className="g6-cap">
                <span>{t('roles.day.caption')}</span>
                {demo}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-stop">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-stop">
              {t('stop.title')}
            </h2>
            <p className="g6-p">{t('stop.sub')}</p>
          </div>
          <div className="g6-body">
            <h3 className="g6-wk-t">{t('stop.listTitle')}</h3>
            <ol className="g6-list g6-one">
              {STOP_KEYS.map((k) => (
                <li className="g6-li" key={k}>
                  <h3>{t(`stop.items.${k}.title`)}</h3>
                  <p>{t(`stop.items.${k}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="g6-links">
            <Link className="g6-lk" href="/#regie" prefetch={false}>
              {t('stop.links.regie')} <Arrow />
            </Link>
            <Link className="g6-lk" href="/trust" prefetch={false}>
              {t('stop.links.trust')} <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="g6-sec" aria-labelledby="cl-vragen">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-vragen">
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
                      <Link href="/client-portal" prefetch={false}>
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

      <section className="g6-sec g6-end" aria-labelledby="cl-slot">
        <div className="g6-in">
          <div className="g6-hd">
            <h2 className="g6-h2" id="cl-slot">
              {t('end.title')}
            </h2>
            <p className="g6-p">{t('end.sub')}</p>
          </div>
          <div className="g6-act">
            <Link className="g6-btn" href="/apply" prefetch={false}>
              {t('end.cta')}
            </Link>
            <Link className="g6-lk" href="/client-portal" prefetch={false}>
              {t('end.links.portal')} <Arrow />
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
