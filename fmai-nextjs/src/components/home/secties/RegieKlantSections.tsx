// Generated from the approved prototype (design/ronde1b/home-4.html, #regie and #klant) by
// design/ronde1b/tools/port/port_section.py in the 2026-11-02 website-audit folder. While the design still
// iterates, change the prototype and regenerate; once it is final, this file is the source.
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { getTranslations } from 'next-intl/server'
import { RegieKlantSwitch } from './RegieKlantSwitch'
import './secties.css'

type HomeT = Awaited<ReturnType<typeof getTranslations>>

export function RegieKlantView({ t }: { t: HomeT }) {
  return (
    <>
      <section id="regie" className="sx" aria-labelledby="rg-h">
        <svg width="0" height="0" style={{ position: 'absolute' } as CSSProperties} aria-hidden="true">
          <defs>
            <symbol viewBox="0 0 24 24" id="sx-i-check">
              <path d="M5 12.5l4.2 4.2L19 7" />
            </symbol>
            <symbol viewBox="0 0 24 24" id="sx-i-nd">
              <circle cx="12" cy="12" r="3.4" fill="currentColor" />
              <path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="18.4" cy="5.6" r="1.7" fill="currentColor" />
            </symbol>
          </defs>
        </svg>
        {' '}
        <div className="sx-in">
          {' '}
          <div className="sx-copy">
            {' '}
            <h2 className="sx-h" id="rg-h">
              {t("regie.title")}
            </h2>
            {' '}
            <ul className="sx-l">
              {' '}
              <li>
                {t("regie.lines.n1")}
              </li>
              {' '}
              <li>
                {t("regie.lines.n2")}
              </li>
              {' '}
              <li>
                {t("regie.lines.n3")}
              </li>
              {' '}
            </ul>
            {' '}
          </div>
          {' '}
          <p className="sx-sr">
            {t("regie.sceneDescription")}
          </p>
          {' '}
          <div className="sx-screen" data-screen="" aria-hidden="true" inert>
            {' '}
            <div className="sx-ly sx-back" data-layer="back">
              <div className="sx-win">
                {' '}
                <div className="sx-bar">
                  <span className="sx-dots">
                    <i>
                    </i>
                    <i>
                    </i>
                    <i>
                    </i>
                  </span>
                </div>
                {' '}
                <div className="sx-vj">
                  {' '}
                  <p className="sx-vjt">
                    {t("regie.screens.n1")}
                  </p>
                  {' '}
                  <div className="sx-parts">
                    {' '}
                    <div className="sx-part">
                      <p>
                        {t("regie.screens.n2")}
                      </p>
                      <i className="sx-sk" style={{ "--w": "78%" } as CSSProperties}>
                      </i>
                      <i className="sx-sk" style={{ "--w": "56%" } as CSSProperties}>
                      </i>
                    </div>
                    {' '}
                    <div className="sx-part">
                      <p>
                        {t("regie.screens.n3")}
                      </p>
                      <i className="sx-sk" style={{ "--w": "66%" } as CSSProperties}>
                      </i>
                      <i className="sx-sk" style={{ "--w": "44%" } as CSSProperties}>
                      </i>
                    </div>
                    {' '}
                    <div className="sx-part">
                      <p>
                        {t("regie.screens.n4")}
                      </p>
                      <i className="sx-sk" style={{ "--w": "60%" } as CSSProperties}>
                      </i>
                    </div>
                    {' '}
                    <div className="sx-part sx-part-up">
                      <p>
                        {t("regie.screens.n5")}
                      </p>
                      <i className="sx-sk" style={{ "--w": "70%" } as CSSProperties}>
                      </i>
                    </div>
                    {' '}
                  </div>
                </div>
              </div>
            </div>
            {' '}
            <div className="sx-ly sx-mid" data-layer="mid">
              <div className="sx-card sx-up">
                {' '}
                <p className="sx-ct">
                  {t("regie.screens.n6")}
                </p>
                {' '}
                <p className="sx-intro">
                  {t("regie.screens.n7")}
                </p>
                {' '}
                <div className="sx-slot">
                  {' '}
                  <div className="sx-row">
                    {' '}
                    <div className="sx-rt">
                      <p className="sx-sent">
                        {t("regie.screens.n8")}
                      </p>
                      {' '}
                      <p className="sx-meta">
                        <span>
                          {t("regie.screens.n9")}
                        </span>
                        <span>
                          {t("regie.screens.n10")}
                        </span>
                      </p>
                    </div>
                    {' '}
                    <div className="sx-acts">
                      <span className="sx-b sx-b-fill sx-pz">
                        {t("regie.screens.n11")}
                      </span>
                      <span className="sx-b sx-b-line">
                        {t("regie.screens.n12")}
                      </span>
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <div className="sx-toast" data-toast="">
                    <svg className="sx-tk">
                      <use href="#sx-i-check" />
                    </svg>
                    {' '}
                    <div className="sx-tt">
                      <p className="sx-t1">
                        {t("regie.screens.n13")}
                      </p>
                      <p className="sx-t2">
                        {t("regie.screens.n14")}
                      </p>
                    </div>
                    {' '}
                    <span className="sx-b sx-b-fill sx-b-xs">
                      {t("regie.screens.n15")}
                    </span>
                  </div>
                  {' '}
                </div>
              </div>
            </div>
            {' '}
            <div className="sx-ly sx-front" data-layer="front">
              <div className="sx-card sx-crisis">
                {' '}
                <div className="sx-chd">
                  <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 24px, (max-width: 860px) 24px, 28px" className="sx-mk" alt="" />
                  <p className="sx-ct">
                    {t("regie.screens.n16")}
                  </p>
                </div>
                {' '}
                <p className="sx-desc">
                  {t("regie.screens.n17")}
                </p>
                {' '}
                <span className="sx-b sx-b-red">
                  {t("regie.screens.n18")}
                </span>
                {' '}
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
      <section id="klant" className="sx" data-on="" aria-labelledby="kl-h">
        {' '}
        <div className="sx-in">
          {' '}
          <div className="sx-copy">
            {' '}
            <h2 className="sx-h" id="kl-h">
              {t("klant.title")}
            </h2>
            {' '}
            <ul className="sx-l">
              {' '}
              <li>
                {t("klant.lines.n1")}
              </li>
              {' '}
              <li>
                {t("klant.lines.n2")}
              </li>
              {' '}
              <li>
                {t("klant.lines.n3")}
              </li>
              {' '}
            </ul>
            {' '}
          </div>
          {' '}
          <p className="sx-sr">
            {t("klant.sceneDescription")}
          </p>
          {' '}
          <div className="sx-screen" data-screen="" aria-hidden="true" inert>
            {' '}
            <div className="sx-ly sx-back" data-layer="back">
              <div className="sx-card sx-wl">
                {' '}
                <p className="sx-ct">
                  {t("klant.screens.n1")}
                </p>
                {' '}
                <p className="sx-desc">
                  {t("klant.screens.n2")}
                </p>
                {' '}
                <div className="sx-swr">
                  <span className="sx-sw sx-sw-ag">
                    <i>
                    </i>
                  </span>
                  <span className="sx-swl">
                    {t("klant.screens.n3")}
                  </span>
                </div>
                {' '}
              </div>
            </div>
            {' '}
            <div className="sx-ly sx-mid" data-layer="mid">
              <div className="sx-win sx-portal">
                {' '}
                <div className="sx-bar">
                  <span className="sx-dots">
                    <i>
                    </i>
                    <i>
                    </i>
                    <i>
                    </i>
                  </span>
                </div>
                {' '}
                <div className="sx-pb">
                  {' '}
                  <div className="sx-side">
                    {' '}
                    <div className="sx-sh">
                      <Image src="/home/hero3/luwte_mark.png" width={512} height={512} sizes="(max-width: 599px) 24px, (max-width: 860px) 24px, 28px" className="sx-mk" alt="" />
                      <p>
                        {t("klant.screens.n4")}
                      </p>
                    </div>
                    {' '}
                    <div className="sx-nav">
                      <p>
                        {t("klant.screens.n5")}
                      </p>
                      <p className="sx-on">
                        <i className="sx-tint">
                        </i>
                        <span className="sx-c0">
                          {t("klant.screens.n6")}
                        </span>
                        <span className="sx-c1">
                          {t("klant.screens.n7")}
                        </span>
                      </p>
                      <p>
                        {t("klant.screens.n8")}
                      </p>
                      <p>
                        {t("klant.screens.n9")}
                      </p>
                    </div>
                    {' '}
                    <div className="sx-foot">
                      <p className="sx-ag">
                        <span className="sx-ndm">
                          <svg>
                            <use href="#sx-i-nd" />
                          </svg>
                        </span>
                        {t("klant.screens.n10")}
                      </p>
                      <p className="sx-out">
                        <svg className="ic" viewBox="0 0 24 24">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        {t("klant.screens.n11")}
                      </p>
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <div className="sx-main">
                    {' '}
                    <div className="sx-post">
                      <Image src="/home/hero3/h3-luwte-poster.jpg" width={540} height={960} sizes="(max-width: 599px) 72px, (max-width: 860px) 72px, 112px" className="sx-pst" alt="" />
                      {' '}
                      <div className="sx-pc">
                        <span className="sx-chip">
                          {t("klant.screens.n12")}
                        </span>
                        {' '}
                        <div className="sx-pacts">
                          <span className="sx-b sx-b-fill sx-pok">
                            <i className="sx-tint">
                            </i>
                            <span>
                              {t("klant.screens.n13")}
                            </span>
                          </span>
                          <span className="sx-b sx-b-line">
                            {t("klant.screens.n14")}
                          </span>
                        </div>
                      </div>
                      {' '}
                    </div>
                  </div>
                  {' '}
                </div>
              </div>
            </div>
            {' '}
            <div className="sx-ly sx-front" data-layer="front">
              <div className="sx-card sx-wr">
                {' '}
                <p className="sx-ct">
                  {t("klant.screens.n15")}
                </p>
                {' '}
                <div className="sx-swr">
                  <span className="sx-sw sx-sw-pt">
                    <i className="sx-tint">
                    </i>
                    <i>
                    </i>
                  </span>
                  <span className="sx-swl">
                    {t("klant.screens.n16")}
                  </span>
                </div>
                {' '}
              </div>
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
      <RegieKlantSwitch />
    </>
  )
}

export async function RegieKlantSections() {
  const t = await getTranslations('home')
  return <RegieKlantView t={t} />
}
