// Generated from the approved prototype (design/ronde1b/home-4.html, #week) by
// design/ronde1b/tools/port/port_section.py in the 2026-11-02 website-audit folder. While the design still
// iterates, change the prototype and regenerate; once it is final, this file is the source.
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import { WeekScrub } from './WeekScrub'
import './week.css'

type WeekT = Awaited<ReturnType<typeof getTranslations>>

// Labels on the thread per day; WeekScrub swaps them as the active day changes.
const LABELS = ['ts.0', 'ts.1', 'ts.2', 'ts.3', 'ts.4', 'ts.5', 'ts.6'] as const

export function WeekView({ t }: { t: WeekT }) {
  return (
    <section id="een-week-met-clyde" className="wk" aria-labelledby="wk-h">
      <svg width="0" height="0" style={{ position: 'absolute' } as CSSProperties} aria-hidden="true">
        <defs>
          <symbol id="i-ig" viewBox="0 0 24 24">
            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
          </symbol>
          <symbol id="i-fb" viewBox="0 0 24 24">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
          </symbol>
          <symbol id="i-li" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </symbol>
          <symbol id="i-tt" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </symbol>
          <symbol id="i-x" viewBox="0 0 24 24">
            <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
          </symbol>
          <symbol id="i-th" viewBox="0 0 24 24">
            <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
          </symbol>
          <symbol id="i-yt" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </symbol>
          <symbol id="i-heart" viewBox="0 0 24 24">
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.600-7.500 10.200-7.500 10.200z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </symbol>
          <symbol id="i-chat" viewBox="0 0 24 24">
            <path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </symbol>
          <symbol id="i-send" viewBox="0 0 24 24">
            <path d="M21 3L3 10.500l7 2.500 2.500 7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </symbol>
          <symbol id="i-check" viewBox="0 0 24 24">
            <path d="M5 12.5l4.2 4.2L19 7" />
          </symbol>
          <symbol id="i-nd" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3.4" fill="currentColor" />
            <path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="18.4" cy="5.6" r="1.7" fill="currentColor" />
          </symbol>
        </defs>
      </svg>
      {' '}
      <div className="wk-glow">
      </div>
      {' '}
      <div className="wk-stage">
        {' '}
        <div className="wk-left">
          {' '}
          <h2 className="wk-h" id="wk-h">{t.rich("title", { br: () => <br /> })}</h2>
          {' '}
          <p className="wk-sub">
            {t("sub")}
          </p>
          {' '}
          <ol className="wk-rail" id="rail" aria-label={t("railLabel")}>
            {' '}
            <li data-i="0" className="on">
              <button type="button" aria-current="step">
                <span className="d mono">
                  {t("rail.0.day")}
                </span>
                <span className="t">
                  {t("rail.0.name")}
                </span>
              </button>
            </li>
            {' '}
            <li data-i="1">
              <button type="button">
                <span className="d mono">
                  {t("rail.1.day")}
                </span>
                <span className="t">
                  {t("rail.1.name")}
                </span>
              </button>
            </li>
            {' '}
            <li data-i="2">
              <button type="button">
                <span className="d mono">
                  {t("rail.2.day")}
                </span>
                <span className="t">
                  {t("rail.2.name")}
                </span>
              </button>
            </li>
            {' '}
            <li data-i="3">
              <button type="button">
                <span className="d mono">
                  {t("rail.3.day")}
                </span>
                <span className="t">
                  {t("rail.3.name")}
                </span>
              </button>
            </li>
            {' '}
            <li data-i="4">
              <button type="button">
                <span className="d mono">
                  {t("rail.4.day")}
                </span>
                <span className="t">
                  {t("rail.4.name")}
                </span>
              </button>
            </li>
            {' '}
            <li data-i="5">
              <button type="button">
                <span className="d mono">
                  {t("rail.5.day")}
                </span>
                <span className="t">
                  {t("rail.5.name")}
                </span>
              </button>
            </li>
            {' '}
            <li data-i="6">
              <button type="button">
                <span className="d mono">
                  {t("rail.6.day")}
                </span>
                <span className="t">
                  {t("rail.6.name")}
                </span>
              </button>
            </li>
            {' '}
          </ol>
          {' '}
          <div className="wk-thread" id="thread" aria-hidden="true">
            <span className="mk">
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
            <span className="mono" id="tstate">{t('ts.0')}</span>
          </div>
          {' '}
          <div className="wk-desc" id="desc" aria-live="polite">
            {' '}
            <p className="on">
              {t("desc.0")}
            </p>
            {' '}
            <p>
              {t("desc.1")}
            </p>
            {' '}
            <p>
              {t("desc.2")}
            </p>
            {' '}
            <p>
              {t("desc.3")}
            </p>
            {' '}
            <p>
              {t("desc.4")}
            </p>
            {' '}
            <p>
              {t("desc.5")}
            </p>
            {' '}
            <p>
              {t("desc.6")}
            </p>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div className="wk-scene" id="wscene" inert aria-hidden="true">
          <div className="wk-world" id="world">
            {' '}
            <div data-i="0" className="st on">
              <div className="ag win">
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
                        <use href="#i-nd" />
                      </svg>
                    </i>
                    {t("screens.s0.n1")}
                  </span>
                </div>
                <div className="wb sh">
                  <Image src="/home/week/dagstart.jpg" width={1520} height={1108} sizes="(max-width: 860px) 92vw, 1011px" className="shot" alt={t("alt.dagstart")} />
                  <div className="rib">
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
                    <b>
                      {t("screens.s0.n2")}
                    </b>
                    <span className="sep">
                    </span>
                    <span>
                      {t("screens.s0.n3")}
                    </span>
                    <span className="rtn">
                      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="8.5" />
                        <path d="M12 7.5V12l3 2" />
                      </svg>
                      {t("screens.s0.n4")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl">
                <div className="wa">
                  <div className="wahead">
                    <span className="wal">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" style={{ fill: "currentColor" } as CSSProperties} />
                      </svg>
                    </span>
                    <b>
                      {t("screens.s0.n5")}
                    </b>
                    <span>
                      {t("screens.s0.n6")}
                    </span>
                  </div>
                  <div className="bub">
                    {t("screens.s0.n7")}
                    <span className="watime">
                      {t("screens.s0.n8")}
                    </span>
                  </div>
                  <div className="wabtns">
                    <button type="button" tabIndex={-1}>
                      {t("screens.s0.n9")}
                    </button>
                    <button type="button" tabIndex={-1}>
                      {t("screens.s0.n10")}
                    </button>
                  </div>
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="st" data-i="1">
              <div className="ag win">
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
                        <use href="#i-nd" />
                      </svg>
                    </i>
                    {t("screens.s1.n1")}
                  </span>
                </div>
                <div className="wb sh">
                  <Image src="/home/week/analyse.jpg" width={1592} height={1060} sizes="(max-width: 860px) 92vw, 1011px" className="shot" alt={t("alt.analyse")} />
                  <div className="rib">
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
                    <b>
                      {t("screens.s1.n2")}
                    </b>
                    <span className="sep">
                    </span>
                    <span>
                      {t("screens.s1.n3")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl">
                <div className="vj">
                  <p className="mono">
                    {t("screens.s1.n4")}
                  </p>
                  <b>
                    {t("screens.s1.n5")}
                  </b>
                  <p>
                    {t("screens.s1.n6")}
                  </p>
                  <div className="vjb">
                    <span className="ok">
                      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12.5l4.2 4.2L19 7" />
                      </svg>
                      {t("screens.s1.n7")}
                    </span>
                    <span className="no">
                      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 7l10 10M17 7L7 17" />
                      </svg>
                      {t("screens.s1.n8")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {' '}
            <div className="st solo" data-i="2">
              <div className="ag win">
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
                        <use href="#i-nd" />
                      </svg>
                    </i>
                    {t("screens.s2.n1")}
                  </span>
                </div>
                <div className="wb sh">
                  <Image src="/home/week/strategie.jpg" width={1720} height={1290} sizes="(max-width: 860px) 92vw, 855px" className="shot" alt={t("alt.strategie")} />
                  <div className="rib">
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
                    <b>
                      {t("screens.s2.n2")}
                    </b>
                    <span className="sep">
                    </span>
                    <span>
                      {t("screens.s2.n3")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl">
                <div className="mnote">
                  <p className="mono">
                    {t("screens.s2.n4")}
                  </p>
                  <p className="ms">
                    {t("screens.s2.n5")}
                  </p>
                  <p className="mb">
                    {t("screens.s2.n6")}
                  </p>
                  <span className="chip chip-ok">
                    <i>
                    </i>
                    {t("screens.s2.n7")}
                  </span>
                </div>
                <div className="ag-mini win">
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
                          <use href="#i-nd" />
                        </svg>
                      </i>
                      {t("screens.s2.n8")}
                    </span>
                  </div>
                  <div className="wb sh">
                    <Image src="/home/week/agenda.jpg" width={1720} height={1098} sizes="(max-width: 860px) 92vw, 491px" className="shot" alt={t("alt.agenda")} />
                  </div>
                </div>
              </div>
            </div>
            {' '}
            <div className="st solo" data-i="3">
              {' '}
              <div className="ag win">
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
                        <use href="#i-nd" />
                      </svg>
                    </i>
                    {t("screens.s3.n1")}
                  </span>
                </div>
                {' '}
                <div className="wb sh">
                  <Image src="/home/week/maken.jpg" width={780} height={1242} sizes="(max-width: 860px) 92vw, 465px" className="shot" alt={t("alt.maken")} />
                  <div className="rib">
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
                    <b>
                      {t("screens.s3.n2")}
                    </b>
                    <span className="sep">
                    </span>
                    <span>
                      {t("screens.s3.n3")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl">
                <div className="win mem">
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
                          <use href="#i-nd" />
                        </svg>
                      </i>
                      {t("screens.s3.n4")}
                    </span>
                  </div>
                  <div className="wb sh">
                    <Image src="/home/week/geheugen.jpg" width={1484} height={724} sizes="(max-width: 860px) 1484px, 699px" className="shot" alt={t("alt.geheugen")} />
                  </div>
                </div>
              </div>
            </div>
            {' '}
            <div className="st" data-i="4">
              {' '}
              <div className="ag win">
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
                        <use href="#i-nd" />
                      </svg>
                    </i>
                    {t("screens.s4.n1")}
                  </span>
                </div>
                {' '}
                <div className="wb sh">
                  <Image src="/home/week/deck.jpg" width={1720} height={1062} sizes="(max-width: 860px) 92vw, 907px" className="shot" alt={t("alt.deck")} />
                  <div className="rib">
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
                    <b>
                      {t("screens.s4.n2")}
                    </b>
                    <span className="sep">
                    </span>
                    <span className="swt">
                      <span className="a">
                        {t("screens.s4.n3")}
                        <span className="typing">
                          <i>
                          </i>
                          <i>
                          </i>
                          <i>
                          </i>
                        </span>
                      </span>
                      <span className="b">
                        {t("screens.s4.n4")}
                      </span>
                    </span>
                    <span className="rtn">
                      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="8.5" />
                        <path d="M12 7.5V12l3 2" />
                      </svg>
                      {t("screens.s4.n5")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl">
                <div className="phone" aria-label={t("screens.s4.n6")}>
                  {' '}
                  <div className="scr">
                    <span className="notch">
                    </span>
                    {' '}
                    <div className="portal">
                      {' '}
                      <div className="ptop">
                        <span className="plogo nd" aria-hidden="true">
                          <svg>
                            <use href="#i-nd" />
                          </svg>
                        </span>
                        <div>
                          <p className="pname">
                            {t("screens.s4.n7")}
                          </p>
                          <p className="psub">
                            {t("screens.s4.n8")}
                          </p>
                        </div>
                      </div>
                      {' '}
                      <div className="ptabs">
                        <span className="on">
                          {t("screens.s4.n9")}
                        </span>
                        <span>
                          {t("screens.s4.n10")}
                        </span>
                        <span>
                          {t("screens.s4.n11")}
                        </span>
                      </div>
                      {' '}
                      <div className="pcard">
                        {' '}
                        <div className="car">
                          <div className="slides">
                            <div className="cover cv-rose">
                              <span className="tag">
                                {t("screens.s4.n12")}
                              </span>
                              {t("screens.s4.n13")}
                            </div>
                            <div className="cover cv-rose s2">
                              <span className="tag">
                                {t("screens.s4.n14")}
                              </span>
                              <span className="big1">
                                {t("screens.s4.n15")}
                              </span>
                              {t("screens.s4.n16")}
                            </div>
                            <div className="cover cv-rose s3">
                              <span className="tag">
                                {t("screens.s4.n17")}
                              </span>
                              {t("screens.s4.n18")}
                              <span className="pill">
                                {t("screens.s4.n19")}
                              </span>
                            </div>
                          </div>
                          <div className="dots">
                            <i>
                            </i>
                            <i>
                            </i>
                            <i>
                            </i>
                          </div>
                        </div>
                        {' '}
                        <p className="pcap">
                          {t("screens.s4.n20")}
                        </p>
                        {' '}
                        <div className="pmeta">
                          <span>
                            {t("screens.s4.n21")}
                          </span>
                          <span>
                            {t("screens.s4.n22")}
                          </span>
                        </div>
                        {' '}
                        <div className="pact">
                          <button className="pbtn pbtn-ok" type="button">
                            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 12.5l4.2 4.2L19 7" />
                            </svg>
                            {t("screens.s4.n23")}
                          </button>
                          <button className="pbtn pbtn-alt" type="button">
                            {t("screens.s4.n24")}
                          </button>
                          <span className="pdone">
                            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 12.5l4.2 4.2L19 7" />
                            </svg>
                            {t("screens.s4.n25")}
                          </span>
                          <span className="tap">
                          </span>
                        </div>
                        {' '}
                      </div>
                      {' '}
                      <div className="pcard">
                        <div className="cover cv-plum">
                          <span className="tag">
                            {t("screens.s4.n26")}
                          </span>
                          {t("screens.s4.n27")}
                        </div>
                      </div>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="st" data-i="5">
              <div className="ag fan">
                <div className="hubglow">
                </div>
                <div style={{ "--dx": "-350px", "--dy": "-80px", "--z": "60px", "--r": "16deg", "--w": "200px", "--k": "0" } as CSSProperties} className="fc dk c-ig">
                  <div className="fh">
                    <i className="gl gl-ig">
                      <svg>
                        <use href="#i-ig" />
                      </svg>
                    </i>
                    <b>
                      {t("screens.s5.n1")}
                    </b>
                  </div>
                  <i className="cover cv-rose sq">
                  </i>
                  <div className="fa">
                    <svg className="ia">
                      <use href="#i-heart" />
                    </svg>
                    <svg className="ia">
                      <use href="#i-chat" />
                    </svg>
                    <svg className="ia">
                      <use href="#i-send" />
                    </svg>
                  </div>
                  <p className="fx">{t.rich("screens.s5.n2", { b: (c) => <b>{c}</b> })}</p>
                </div>
                <div style={{ "--dx": "-80px", "--dy": "-235px", "--z": "-20px", "--r": "10deg", "--w": "270px", "--k": "1" } as CSSProperties} className="fc lt c-li">
                  <div className="fh">
                    <i className="gl gl-li">
                      <svg>
                        <use href="#i-li" />
                      </svg>
                    </i>
                    <b>
                      {t("screens.s5.n3")}
                    </b>
                    <span>
                      {t("screens.s5.n4")}
                    </span>
                  </div>
                  <p className="fx">
                    {t("screens.s5.n5")}
                  </p>
                  <i className="cover cv-rose wd">
                  </i>
                  <div className="fr">
                    <span>
                      {t("screens.s5.n6")}
                    </span>
                    <span>
                      {t("screens.s5.n7")}
                    </span>
                    <span>
                      {t("screens.s5.n8")}
                    </span>
                  </div>
                </div>
                <div style={{ "--dx": "220px", "--dy": "-180px", "--z": "120px", "--r": "-14deg", "--w": "130px", "--k": "2" } as CSSProperties} className="fc dk c-tt">
                  <i className="cover cv-plum tall">
                  </i>
                  <div className="side">
                    <i>
                    </i>
                    <i>
                    </i>
                    <i>
                    </i>
                  </div>
                  <p className="cap">{t.rich("screens.s5.n9", { b: (c) => <b>{c}</b>, br: () => <br /> })}</p>
                  <i className="gl gl-tt tk">
                    <svg>
                      <use href="#i-tt" />
                    </svg>
                  </i>
                </div>
                <div style={{ "--dx": "400px", "--dy": "-235px", "--z": "20px", "--r": "-14deg", "--w": "230px", "--k": "3" } as CSSProperties} className="fc dk c-x">
                  <div className="fh">
                    <i className="gl gl-x">
                      <svg>
                        <use href="#i-x" />
                      </svg>
                    </i>
                    <b>
                      {t("screens.s5.n10")}
                    </b>
                    <span>
                      {t("screens.s5.n11")}
                    </span>
                  </div>
                  <p className="fx">
                    {t("screens.s5.n12")}
                  </p>
                  <div className="lk">
                    <i className="cover cv-rose">
                    </i>
                    <span>
                      {t("screens.s5.n13")}
                    </span>
                  </div>
                </div>
                <div style={{ "--dx": "400px", "--dy": "30px", "--z": "-40px", "--r": "-16deg", "--w": "220px", "--k": "4" } as CSSProperties} className="fc dk c-th">
                  <div className="fh">
                    <i className="gl gl-th">
                      <svg>
                        <use href="#i-th" />
                      </svg>
                    </i>
                    <b>
                      {t("screens.s5.n14")}
                    </b>
                  </div>
                  <p className="fx">
                    {t("screens.s5.n15")}
                  </p>
                  <div className="fa">
                    <svg className="ia">
                      <use href="#i-heart" />
                    </svg>
                    <svg className="ia">
                      <use href="#i-chat" />
                    </svg>
                    <svg className="ia">
                      <use href="#i-send" />
                    </svg>
                  </div>
                </div>
                <div style={{ "--dx": "220px", "--dy": "210px", "--z": "80px", "--r": "-12deg", "--w": "230px", "--k": "5" } as CSSProperties} className="fc lt c-fb">
                  <div className="fh">
                    <i className="gl gl-fb">
                      <svg>
                        <use href="#i-fb" />
                      </svg>
                    </i>
                    <b>
                      {t("screens.s5.n16")}
                    </b>
                    <span>
                      {t("screens.s5.n17")}
                    </span>
                  </div>
                  <p className="fx">
                    {t("screens.s5.n18")}
                  </p>
                  <i className="cover cv-rose wd2">
                  </i>
                  <div className="fr">
                    <span>
                      {t("screens.s5.n19")}
                    </span>
                    <span>
                      {t("screens.s5.n20")}
                    </span>
                    <span>
                      {t("screens.s5.n21")}
                    </span>
                  </div>
                </div>
                <div style={{ "--dx": "-250px", "--dy": "190px", "--z": "40px", "--r": "12deg", "--w": "250px", "--k": "6" } as CSSProperties} className="fc dk c-yt">
                  <i className="cover cv-plum yt16">
                  </i>
                  <span className="dur">
                    {t("screens.s5.n22")}
                  </span>
                  <div className="ytm">
                    <i className="gl gl-yt">
                      <svg>
                        <use href="#i-yt" />
                      </svg>
                    </i>
                    <div>
                      <b>
                        {t("screens.s5.n23")}
                      </b>
                      <span>
                        {t("screens.s5.n24")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hub">
                  <i className="cover cv-rose">
                  </i>
                </div>
                <div className="hubbar">
                  <span className="chip chip-soon">
                    <i>
                    </i>
                    {t("screens.s5.n25")}
                  </span>
                  <button className="pz" type="button" tabIndex={-1}>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <rect x="4" y="3" width="2.6" height="10" rx="1" style={{ fill: "currentColor" } as CSSProperties} />
                      <rect x="9.4" y="3" width="2.6" height="10" rx="1" style={{ fill: "currentColor" } as CSSProperties} />
                    </svg>
                    {t("screens.s5.n26")}
                  </button>
                </div>
              </div>
              <div className="cl">
                <div className="dmn">
                  <p className="mono">
                    <i className="gl gl-ig">
                      <svg>
                        <use href="#i-ig" />
                      </svg>
                    </i>
                    {t("screens.s5.n27")}
                  </p>
                  <p className="dq">
                    {t("screens.s5.n28")}
                  </p>
                  <p className="da">
                    {t("screens.s5.n29")}
                  </p>
                </div>
              </div>
              {' '}
            </div>
            {' '}
            <div className="st" data-i="6">
              <div className="ag win">
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
                        <use href="#i-nd" />
                      </svg>
                    </i>
                    {t("screens.s6.n1")}
                  </span>
                </div>
                <div className="wb sh">
                  <Image src="/home/week/rapport.jpg" width={1536} height={524} sizes="(max-width: 860px) 92vw, 1011px" className="shot" alt={t("alt.rapport")} />
                  <div className="loop full">
                    <svg className="ck">
                      <use href="#i-check" />
                    </svg>
                    <b>
                      {t("screens.s6.n2")}
                    </b>
                    <span>
                      {t("screens.s6.n3")}
                    </span>
                    <span className="rtn">
                      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="12" r="8.5" />
                        <path d="M12 7.5V12l3 2" />
                      </svg>
                      {t("screens.s6.n4")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="cl">
                <div className="wa" aria-label={t("screens.s6.n5")}>
                  {' '}
                  <div className="wahead">
                    <span className="wal">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" style={{ fill: "currentColor" } as CSSProperties} />
                      </svg>
                    </span>
                    <b>
                      {t("screens.s6.n6")}
                    </b>
                    <span>
                      {t("screens.s6.n7")}
                    </span>
                  </div>
                  {' '}
                  <div className="bub">
                    <div className="pdf">
                      <span className="pi">
                        {t("screens.s6.n8")}
                      </span>
                      <div>
                        <b>
                          {t("screens.s6.n9")}
                        </b>
                        <span>
                          {t("screens.s6.n10")}
                        </span>
                      </div>
                    </div>
                    {t("screens.s6.n11")}
                  </div>
                  {' '}
                </div>
              </div>
              {' '}
            </div>
            {' '}
          </div>
        </div>
        {' '}
      </div>
      {' '}
      <WeekScrub labels={LABELS.map((k) => t(k))} />
    </section>
  )
}

export async function WeekSection() {
  const t = await getTranslations('home.week')
  return <WeekView t={t} />
}
