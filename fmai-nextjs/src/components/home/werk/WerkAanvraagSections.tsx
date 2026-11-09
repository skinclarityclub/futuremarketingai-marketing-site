// Generated from the approved prototype (design/ronde1b/home-5.html, #werk and #aanvraag) by
// design/ronde1b/tools/port/port_section.py in the 2026-11-02 website-audit folder. While the design still
// iterates, change the prototype and regenerate; once it is final, this file is the source.
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import './werk.css'

type HomeT = Awaited<ReturnType<typeof getTranslations>>

export function WerkAanvraagView({ t }: { t: HomeT }) {
  return (
    <>
      <section id="werk" className="gf3" aria-labelledby="werk-h">
        {' '}
        <div className="gf3-in">
          {' '}
          <div className="gf3-hd">
            {' '}
            <h2 className="gf3-h" id="werk-h">
              {t("werk.title")}
            </h2>
            {' '}
            <p className="gf3-p">
              {t("werk.sub")}
            </p>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div className="wc-band" role="region" aria-label={t("werk.aria.n1")} tabIndex={0}>
          {' '}
          <ul className="wc-track">
            {' '}
            <li className="wc-it" data-f="feed">
              <div className="wc-media">
                <Image src="/home/werk/havermoed_posts_havermoed-drie-zakken-1.webp" width={1080} height={1350} sizes="(max-width: 599px) 230px, (max-width: 860px) 230px, 288px" alt={t("werk.alt.havermoed_posts_havermoed-drie-zakken-1")} loading="lazy" decoding="async" />
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/werk/havermoed_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n1")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n2")}
                </p>
                <p className="wc-tx" lang="nl">
                  {t("werk.screens.n3")}
                </p>
              </div>
            </li>
            {' '}
            <li className="wc-it" data-f="feed">
              <div className="wc-media">
                <Image src="/home/werk/meerkade_posts_meerkade-zo-gaat-een-controle-1.webp" width={1080} height={1350} sizes="(max-width: 599px) 230px, (max-width: 860px) 230px, 288px" alt={t("werk.alt.meerkade_posts_meerkade-zo-gaat-een-controle-1")} loading="lazy" decoding="async" />
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/hero3/meerkade_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n4")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n5")}
                </p>
                <p className="wc-tx" lang="nl">
                  {t("werk.screens.n6")}
                </p>
              </div>
            </li>
            {' '}
            <li className="wc-it" data-f="feed">
              <div className="wc-media">
                <Image src="/home/werk/krijtenstaal_posts_krijtenstaal-goblet-squat-1.webp" width={1080} height={1350} sizes="(max-width: 599px) 230px, (max-width: 860px) 230px, 288px" alt={t("werk.alt.krijtenstaal_posts_krijtenstaal-goblet-squat-1")} loading="lazy" decoding="async" />
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/hero3/krijtenstaal_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n7")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n8")}
                </p>
                <p className="wc-tx" lang="nl">
                  {t("werk.screens.n9")}
                </p>
              </div>
            </li>
            {' '}
            <li className="wc-it" data-f="feed">
              <div className="wc-media">
                <Image src="/home/werk/luwte_posts_luwte-eerste-keer-1.webp" width={1080} height={1350} sizes="(max-width: 599px) 230px, (max-width: 860px) 230px, 288px" alt={t("werk.alt.luwte_posts_luwte-eerste-keer-1")} loading="lazy" decoding="async" />
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n10")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n11")}
                </p>
                <p className="wc-tx" lang="nl">
                  {t("werk.screens.n12")}
                </p>
              </div>
            </li>
            {' '}
            <li className="wc-it" data-f="feed">
              <div className="wc-media">
                <Image src="/home/werk/veldlijn_posts_veldlijn-van-0740-tot-0742-1.webp" width={1080} height={1350} sizes="(max-width: 599px) 230px, (max-width: 860px) 230px, 288px" alt={t("werk.alt.veldlijn_posts_veldlijn-van-0740-tot-0742-1")} loading="lazy" decoding="async" />
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/werk/veldlijn_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n13")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n14")}
                </p>
                <p className="wc-tx" lang="nl">
                  {t("werk.screens.n15")}
                </p>
              </div>
            </li>
            {' '}
            <li className="wc-it" data-f="story">
              <div className="wc-media">
                <video src="/home/hero3/h3-luwte-reel.mp4" poster="/home/hero3/h3-luwte-poster.jpg" width="1080" height="1920" controls muted playsInline preload="none" aria-label={t("werk.aria.n2")}>
                </video>
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n16")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n17")}
                </p>
                <p className="wc-tx" lang="nl">
                  {t("werk.screens.n18")}
                </p>
              </div>
            </li>
            {' '}
          </ul>
          {' '}
        </div>
        {' '}
        <div className="gf3-in">
          {' '}
          <p className="gf3-demo wc-demo">
            {t("werk.demo")}
          </p>
          {' '}
          <div className="wc-more">
            {' '}
            <figure className="wc-bfig">
              <div className="wc-bm">
                <div className="wc-blog" data-app="" lang="nl">
                  <Image src="/home/werk/luwte_logo.png" width={512} height={195} sizes="(max-width: 599px) 58px, (max-width: 860px) 58px, 58px" className="wc-blogo" alt={t("werk.alt.luwte_logo")} />
                  {' '}
                  <p className="wc-bt">
                    {t("werk.screens.n19")}
                  </p>
                  {' '}
                  <p className="wc-bi">
                    {t("werk.screens.n20")}
                  </p>
                  {' '}
                  <p className="wc-bh">
                    {t("werk.screens.n21")}
                  </p>
                  {' '}
                  <p className="wc-bb">
                    {t("werk.screens.n22")}
                  </p>
                </div>
              </div>
              {' '}
              <div className="wc-cap" data-app="">
                <p className="wc-br">
                  <span className="wc-mk">
                    <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 18px, (max-width: 860px) 18px, 18px" alt="" />
                  </span>
                  {t("werk.screens.n23")}
                </p>
                <p className="wc-fm">
                  {t("werk.screens.n24")}
                </p>
              </div>
              {' '}
              <figcaption className="gf3-demo">
                {t("werk.blogDemo")}
              </figcaption>
            </figure>
            {' '}
            <div className="wc-what">
              {' '}
              <ul className="wc-list" aria-label={t("werk.aria.n3")}>
                {' '}
                <li>
                  <Link className="wc-ln" href="/skills/strategy" prefetch={false}>
                    <b>
                      {t("werk.list.n1")}
                    </b>
                    <span>
                      {t("werk.list.n2")}
                    </span>
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
                {' '}
                <li>
                  <Link className="wc-ln" href="/skills/social-media" prefetch={false}>
                    <b>
                      {t("werk.list.n3")}
                    </b>
                    <span>
                      {t("werk.list.n4")}
                    </span>
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
                {' '}
                <li>
                  <Link className="wc-ln" href="/skills/blog-factory" prefetch={false}>
                    <b>
                      {t("werk.list.n5")}
                    </b>
                    <span>
                      {t("werk.list.n6")}
                    </span>
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
                {' '}
                <li>
                  <Link className="wc-ln" href="/skills/lead-qualifier" prefetch={false}>
                    <b>
                      {t("werk.list.n7")}
                    </b>
                    <span>
                      {t("werk.list.n8")}
                    </span>
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
                {' '}
                <li>
                  <Link className="wc-ln" href="/skills/reporting" prefetch={false}>
                    <b>
                      {t("werk.list.n9")}
                    </b>
                    <span>
                      {t("werk.list.n10")}
                    </span>
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
                {' '}
                <li>
                  <Link className="wc-ln" href="/skills/seo-geo" prefetch={false}>
                    <b>
                      {t("werk.list.n11")}
                    </b>
                    <span>
                      {t("werk.list.n12")}
                    </span>
                    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
                {' '}
              </ul>
              {' '}
              <p className="wc-ch">
                {t("werk.channels")}
              </p>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
      <section id="aanvraag" className="gf3" aria-labelledby="aanvraag-h">
        {' '}
        <div className="gf3-in">
          {' '}
          <div className="gf3-hd">
            {' '}
            <h2 className="gf3-h" id="aanvraag-h">
              {t("aanvraag.title")}
            </h2>
            {' '}
            <p className="gf3-p">
              {t("aanvraag.sub")}
            </p>
            {' '}
          </div>
          {' '}
          <div className="aq-body">
            {' '}
            <figure className="aq-crop" role="region" aria-label={t("aanvraag.aria.n1")} tabIndex={0}>
              <Image src="/home/werk/g3-dm-regel-rust.png" width={1545} height={250} sizes="(max-width: 599px) 600px, (max-width: 860px) 691px, 760px" alt={t("aanvraag.alt.g3-dm-regel-rust")} loading="lazy" decoding="async" />
            </figure>
            {' '}
            <div className="aq-fun" data-app="">
              {' '}
              <ol className="aq-steps">
                {' '}
                <li>
                  <b className="aq-n">
                    {t("aanvraag.screens.n1")}
                  </b>
                  <span className="aq-l">
                    {t("aanvraag.screens.n2")}
                  </span>
                </li>
                {' '}
                <li>
                  <svg className="aq-ar aq-arh" viewBox="0 0 72 16" aria-hidden="true">
                    <path pathLength="1" d="M1 8H69M62 2l7 6-7 6" />
                  </svg>
                  <svg className="aq-ar aq-arv" viewBox="0 0 16 40" aria-hidden="true">
                    <path pathLength="1" d="M8 1V37M2 30l6 7 6-7" />
                  </svg>
                  <b className="aq-n">
                    {t("aanvraag.screens.n3")}
                  </b>
                  <span className="aq-l">
                    {t("aanvraag.screens.n4")}
                  </span>
                </li>
                {' '}
                <li>
                  <svg className="aq-ar aq-arh" viewBox="0 0 72 16" aria-hidden="true">
                    <path pathLength="1" d="M1 8H69M62 2l7 6-7 6" />
                  </svg>
                  <svg className="aq-ar aq-arv" viewBox="0 0 16 40" aria-hidden="true">
                    <path pathLength="1" d="M8 1V37M2 30l6 7 6-7" />
                  </svg>
                  <b className="aq-n">
                    {t("aanvraag.screens.n5")}
                  </b>
                  <span className="aq-l">
                    {t("aanvraag.screens.n6")}
                  </span>
                </li>
                {' '}
              </ol>
              {' '}
              <p className="aq-demo">
                {t("aanvraag.screens.n7")}
              </p>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <p className="gf3-demo aq-fix">
            {t("aanvraag.demo")}
          </p>
          {' '}
        </div>
        {' '}
      </section>
    </>
  )
}

export async function WerkAanvraagSections() {
  const t = await getTranslations('home')
  return <WerkAanvraagView t={t} />
}
