// Generated from the approved prototype (design/ronde1b/home-4.html, #hero) by
// design/ronde1b/tools/port/port_section.py in the 2026-11-02 website-audit folder. While the design still
// iterates, change the prototype and regenerate; once it is final, this file is the source.
import Image, { getImageProps } from 'next/image'
import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { HeroLoop } from './HeroLoop'
import { FIRST_FRAME_SCRIPT } from './heroFrame'
import './hero3.css'

type HeroT = Awaited<ReturnType<typeof getTranslations>>

export function Hero3View({ t }: { t: HeroT }) {
  return (
    <section id="hero" data-b="0" data-a="back" aria-labelledby="h1" data-fab-quiet="">
      <svg width="0" height="0" style={{ position: 'absolute' } as CSSProperties} aria-hidden="true">
        <defs>
          <symbol viewBox="0 0 24 24" id="h3-i-ig">
            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
          </symbol>
          <symbol viewBox="0 0 24 24" id="h3-i-li">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </symbol>
          <symbol viewBox="0 0 24 24" id="h3-i-tt">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </symbol>
          <symbol viewBox="0 0 24 24" id="h3-i-heart">
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.600-7.500 10.200-7.500 10.200z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </symbol>
          <symbol viewBox="0 0 24 24" id="h3-i-chat">
            <path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </symbol>
          <symbol viewBox="0 0 24 24" id="h3-i-send">
            <path d="M21 3L3 10.500l7 2.500 2.500 7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </symbol>
          <symbol viewBox="0 0 24 24" id="h3-i-nd">
            <circle cx="12" cy="12" r="3.4" fill="currentColor" />
            <path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="18.4" cy="5.6" r="1.7" fill="currentColor" />
          </symbol>
        </defs>
      </svg>
      {' '}
      {' '}
      <div className="grain">
      </div>
      <div className="floor">
      </div>
      {' '}
      <div className="orb o1" data-d="30">
      </div>
      <div className="orb o2" data-d="-20">
      </div>
      <div className="orb o3" data-d="12">
      </div>
      {' '}
      <div className="copy">
        {' '}
        <h1 className="h1" id="h1">
          {t("title")}
        </h1>
        {' '}
        <p className="def speakable-hero">{t.rich("def", { nw: (c) => <span className="nw">{c}</span> })}</p>
        {' '}
        <div className="ctas">
          <Link className="btn btn-amber" href="/apply" prefetch={false}>
            {t("cta.primary")}
          </Link>
          <a className="btn btn-ghost" href="#een-week-met-clyde">
            {t("cta.secondary")}
          </a>
        </div>
        {' '}
        <p className="proof pd speakable-tldr">
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.2 4.2L19 7" />
          </svg>
          {t("proof.desktop")}
        </p>
        {' '}
        <p className="proof pm">
          <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5l4.2 4.2L19 7" />
          </svg>
          {t("proof.mobile")}
        </p>
        {' '}
        <p className="hdemo">
          {t("demo")}
        </p>
        {' '}
      </div>
      {' '}
      <div className="ctrl">
        <button className="pausebtn" id="pause" type="button" aria-label={t("pause.pause")}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="4" y="3" width="2.6" height="10" rx="1" style={{ fill: "currentColor" } as CSSProperties} />
            <rect x="9.4" y="3" width="2.6" height="10" rx="1" style={{ fill: "currentColor" } as CSSProperties} />
          </svg>
        </button>
      </div>
      {' '}
      <p className="sr">
        {t("sceneDescription")}
      </p>
      {' '}
      <div className="stage" id="stage">
        <div className="scene" id="scene" inert aria-hidden="true">
          {' '}
          <svg width="0" height="0" style={{ position: "absolute" } as CSSProperties}>
            <defs>
              <symbol viewBox="0 0 24 24" id="h3-i-clock">
                <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <path d="M12 7.6V12l3 1.9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </symbol>
              <symbol viewBox="0 0 24 24" id="h3-i-due">
                <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
                <path d="M12 7.9v4.6M12 16.1v.2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </symbol>
            </defs>
          </svg>
          {' '}
          <div className="ly L-back" data-z="-130">
            <div className="plate">
            </div>
            <span className="cap">
              <i>
              </i>
              {t("screens.n1")}
            </span>
            {' '}
            <div className="win h3win">
              <div className="winbar">
                <span className="dots">
                  <i>
                  </i>
                  <i>
                  </i>
                  <i>
                  </i>
                </span>
                <span className="path">
                  <i className="ndm" aria-hidden="true">
                    <svg>
                      <use href="#h3-i-nd" />
                    </svg>
                  </i>
                  {t("screens.n2")}
                </span>
                <span className="h3day">
                  {t("screens.n3")}
                </span>
              </div>
              {' '}
              <div className="h3body">
                <picture>
                  <source media="(max-width:599px)" srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                  <img {...getImageProps({ src: "/home/hero3/h3-kal.jpg", width: 1252, height: 858, sizes: "(max-width: 860px) 532px, 532px", alt: t("alt.h3-kal"), fetchPriority: "high", loading: "eager" }).props} alt={t("alt.h3-kal")} className="shot" />
                </picture>
                {' '}
                <span className="h3ring" data-r="1" style={{ left: "0.26%", top: "16.28%", width: "32.71%", height: "16.15%" } as CSSProperties}>
                </span>
                <span className="h3ring" data-r="2" style={{ left: "0.26%", top: "30.97%", width: "32.71%", height: "45.75%" } as CSSProperties}>
                </span>
                <span className="h3ring" data-r="3" style={{ left: "67.03%", top: "82.95%", width: "32.71%", height: "16.15%" } as CSSProperties}>
                </span>
                {' '}
                <div className="kc" data-at="1" style={{ left: ".96%", top: "17.48%" } as CSSProperties}>
                  <span className="kt">
                    <svg>
                      <use href="#h3-i-clock" />
                    </svg>
                    {t("screens.n4")}
                  </span>
                  <p>
                    <span>
                      {t("screens.n5")}{' '}
                    </span>
                    {t("screens.n6")}
                  </p>
                </div>
                {' '}
                <div className="kc" data-at="3" style={{ left: "67.73%", top: "84.15%" } as CSSProperties}>
                  <span className="kt">
                    <svg>
                      <use href="#h3-i-clock" />
                    </svg>
                    {t("screens.n7")}
                  </span>
                  <p>
                    <span>
                      {t("screens.n8")}{' '}
                    </span>
                    {t("screens.n9")}
                  </p>
                </div>
                {' '}
                <div className="kc kp" data-at="2" style={{ left: ".96%", top: "32.17%" } as CSSProperties}>
                  <span className="kt">
                    <svg>
                      <use href="#h3-i-due" />
                    </svg>
                    {t("screens.n10")}
                  </span>
                  <p>
                    <span>
                      {t("screens.n11")}{' '}
                    </span>
                    {t("screens.n12")}
                  </p>
                </div>
                {' '}
                <div className="kc kp" data-at="2" style={{ left: ".96%", top: "47.09%" } as CSSProperties}>
                  <span className="kt">
                    <svg>
                      <use href="#h3-i-due" />
                    </svg>
                    {t("screens.n13")}
                  </span>
                  <p>
                    <span>
                      {t("screens.n14")}{' '}
                    </span>
                    {t("screens.n15")}
                  </p>
                </div>
                {' '}
                <div className="kc kp" data-at="2" style={{ left: ".96%", top: "61.77%" } as CSSProperties}>
                  <span className="kt">
                    <svg>
                      <use href="#h3-i-due" />
                    </svg>
                    {t("screens.n16")}
                  </span>
                  <p>
                    <span>
                      {t("screens.n17")}{' '}
                    </span>
                    {t("screens.n18")}
                  </p>
                </div>
                {' '}
              </div>
            </div>
          </div>
          {' '}
          <div className="ly L-mid" data-z="10">
            <div className="plate">
            </div>
            <span className="cap">
              <i>
              </i>
              {t("screens.n19")}
            </span>
            {' '}
            <div className="status h3st">
              <span className="cav">
                <svg viewBox="0 0 512 512" aria-hidden="true">
                  <line className="mk-l1" x1="145" y1="143" x2="256" y2="256" />
                  <line className="mk-l1" x1="256" y1="256" x2="340" y2="396" />
                  <line className="mk-l2" x1="256" y1="256" x2="367" y2="143" />
                  <circle className="mk-h" cx="367" cy="143" r="48" />
                  <circle className="mk-t" cx="145" cy="143" r="36" />
                  <circle className="mk-t" cx="256" cy="256" r="36" />
                  <circle className="mk-t" cx="340" cy="396" r="36" />
                  <circle className="mk-a" cx="367" cy="143" r="36" />
                </svg>
              </span>
              {' '}
              <div className="h3sb">
                <span className="who">
                  {t("screens.n20")}
                  <span className="live">
                  </span>
                </span>
                {' '}
                <span className="txt">
                  <span className="on">
                    <b>
                      {t("screens.n21")}
                    </b>
                    <small>
                      {t("screens.n22")}
                    </small>
                  </span>
                  <span>
                    <b>
                      <Image src="/home/hero3/meerkade_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 32px" className="smk" alt={t("alt.meerkade_mark")} loading="eager" />
                      {t("screens.n23")}
                    </b>
                    <small>
                      {t("screens.n24")}
                    </small>
                  </span>
                  <span>
                    <b>
                      <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 32px" className="smk" alt={t("alt.luwte_mark")} loading="eager" />
                      {t("screens.n25")}
                    </b>
                    <small>
                      {t("screens.n26")}
                    </small>
                  </span>
                  <span>
                    <b>
                      <Image src="/home/hero3/krijtenstaal_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 35px" className="smk" alt={t("alt.krijtenstaal_mark")} loading="eager" />
                      {t("screens.n27")}
                    </b>
                    <small>
                      {t("screens.n28")}
                    </small>
                  </span>
                  <span>
                    <b>
                      <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 32px" className="smk" alt={t("alt.luwte_mark")} loading="eager" />
                      {t("screens.n29")}
                    </b>
                    <small>
                      {t("screens.n30")}
                    </small>
                  </span>
                </span>
              </div>
            </div>
          </div>
          {' '}
          <div className="ly L-front" data-z="140">
            <div className="plate">
            </div>
            <span className="cap">
              <i>
              </i>
              {t("screens.n31")}
            </span>
            {' '}
            <div className="fan">
              {' '}
              <div className="phone" data-d="0" data-at="1">
                <div className="scr">
                  <span className="notch">
                  </span>
                  <div className="portal">
                    {' '}
                    <div className="btop">
                      <Image src="/home/hero3/meerkade_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 32px" className="bmk" alt="" loading="eager" />
                      <div className="bid">
                        <p className="bnm">
                          {t("screens.n32")}
                        </p>
                        <p className="psub">
                          <span className="pf pf-li">
                            <svg>
                              <use href="#h3-i-li" />
                            </svg>
                          </span>
                          {t("screens.n33")}
                        </p>
                      </div>
                    </div>
                    {' '}
                    <div className="pv pv-li">
                      {' '}
                      <p className="lit">
                        {t("screens.n34")}
                      </p>
                      {' '}
                      <div className="lii" style={{ backgroundImage: "url(/home/hero3/meerkade_posts_meerkade-li-twintig-minuten-1.webp)" } as CSSProperties}>
                      </div>
                      <div className="lia">
                        <svg viewBox="0 0 24 24">
                          <path d="M7 11v9H4v-9zM7 11l4-7c1.5 0 2.3 1 2 2.5L12.5 10H19a1.6 1.6 0 0 1 1.6 1.9l-1.3 6.6A2 2 0 0 1 17.4 20H7" />
                        </svg>
                        <svg>
                          <use href="#h3-i-chat" />
                        </svg>
                        <svg viewBox="0 0 24 24">
                          <path d="M5 9l3-3 3 3M8 6v9a3 3 0 0 0 3 3h3M19 15l-3 3-3-3M16 18V9a3 3 0 0 0-3-3h-3" />
                        </svg>
                        <svg>
                          <use href="#h3-i-send" />
                        </svg>
                      </div>
                    </div>
                    {' '}
                    <div className="pact">
                      <button className="pbtn pbtn-ok" type="button">
                        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                        {t("screens.n35")}
                      </button>
                      <button className="pbtn pbtn-alt" type="button">
                        {t("screens.n36")}
                      </button>
                      <span className="pdone">
                        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                        {t("screens.n37")}
                      </span>
                      <span className="tap">
                      </span>
                    </div>
                    {' '}
                  </div>
                </div>
              </div>
              {' '}
              <div className="phone" data-d="1" data-at="2">
                <div className="scr">
                  <span className="notch">
                  </span>
                  <div className="portal">
                    {' '}
                    <div className="btop">
                      <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 32px" className="bmk" alt="" loading="eager" />
                      <div className="bid">
                        <p className="bnm">
                          {t("screens.n38")}
                        </p>
                        <p className="psub">
                          <span className="pf pf-tt">
                            <svg>
                              <use href="#h3-i-tt" />
                            </svg>
                          </span>
                          {t("screens.n39")}
                        </p>
                      </div>
                    </div>
                    {' '}
                    <div className="pv pv-tt">
                      <video src="/home/hero3/h3-luwte-reel.mp4" poster="/home/hero3/h3-luwte-poster.jpg" muted loop playsInline preload="metadata">
                      </video>
                      {' '}
                      <div className="ttr">
                        <svg>
                          <use href="#h3-i-heart" />
                        </svg>
                        <svg>
                          <use href="#h3-i-chat" />
                        </svg>
                        <svg>
                          <use href="#h3-i-send" />
                        </svg>
                      </div>
                      {' '}
                      <div className="ttc">
                        <p>
                          {t("screens.n40")}
                        </p>
                        <p className="tg">
                          {t("screens.n41")}
                        </p>
                      </div>
                      <span className="ttp">
                        <i>
                        </i>
                      </span>
                    </div>
                    {' '}
                    <div className="pact">
                      <button className="pbtn pbtn-ok" type="button">
                        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                        {t("screens.n42")}
                      </button>
                      <button className="pbtn pbtn-alt" type="button">
                        {t("screens.n43")}
                      </button>
                      <span className="pdone">
                        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                        {t("screens.n44")}
                      </span>
                      <span className="tap">
                      </span>
                    </div>
                    {' '}
                  </div>
                </div>
              </div>
              {' '}
              <div className="phone" data-d="2" data-at="3">
                <div className="scr">
                  <span className="notch">
                  </span>
                  <div className="portal">
                    {' '}
                    <div className="btop">
                      <Image src="/home/hero3/krijtenstaal_mark.png" width={512} height={512} sizes="(max-width: 599px) 32px, (max-width: 860px) 32px, 35px" className="bmk" alt="" loading="eager" />
                      <div className="bid">
                        <p className="bnm">
                          {t("screens.n45")}
                        </p>
                        <p className="psub">
                          <span className="pf pf-ig">
                            <svg>
                              <use href="#h3-i-ig" />
                            </svg>
                          </span>
                          {t("screens.n46")}
                        </p>
                      </div>
                    </div>
                    {' '}
                    <div className="pv pv-st" style={{ backgroundImage: "url(/home/hero3/krijtenstaal_posts_krijtenstaal-story-proeftraining-1.webp)" } as CSSProperties}>
                      <span className="stb">
                        <i>
                        </i>
                      </span>
                      {' '}
                      <div className="stf">
                        <span>
                        </span>
                        <svg>
                          <use href="#h3-i-heart" />
                        </svg>
                        <svg>
                          <use href="#h3-i-send" />
                        </svg>
                      </div>
                    </div>
                    {' '}
                    <div className="pact">
                      <button className="pbtn pbtn-ok" type="button">
                        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                        {t("screens.n47")}
                      </button>
                      <button className="pbtn pbtn-alt" type="button">
                        {t("screens.n48")}
                      </button>
                      <span className="pdone">
                        <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 12.5l4.2 4.2L19 7" />
                        </svg>
                        {t("screens.n49")}
                      </span>
                      <span className="tap">
                      </span>
                    </div>
                    {' '}
                  </div>
                </div>
              </div>
              {' '}
            </div>
          </div>
          {' '}
          <div className="ly L-wa" data-z="210">
            <div className="wa" aria-label={t("screens.n50")}>
              <div className="wahead">
                <span className="wal">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" style={{ fill: "currentColor" } as CSSProperties} />
                  </svg>
                </span>
                <b>
                  {t("screens.n51")}
                </b>
                <span>
                  {t("screens.n52")}
                </span>
              </div>
              <div className="bub">
                <div className="pdf">
                  <span className="pi">
                    {t("screens.n53")}
                  </span>
                  <div>
                    <b>
                      {t("screens.n54")}
                    </b>
                    <span>
                      {t("screens.n55")}
                    </span>
                  </div>
                </div>
                {t("screens.n56")}
              </div>
            </div>
          </div>
          {' '}
        </div>
      </div>
      {' '}
      <HeroLoop pauseLabel={t('pause.pause')} playLabel={t('pause.play')} />
      <script dangerouslySetInnerHTML={{ __html: FIRST_FRAME_SCRIPT }} />
    </section>
  )
}

export async function Hero3Section() {
  const t = await getTranslations('home.hero3')
  return <Hero3View t={t} />
}
