// Generated from the approved prototype (design/ronde1b/home-6.html, #waarom and #klanten) by
// design/ronde1b/tools/port/port_section.py in the 2026-11-02 website-audit folder. While the design still
// iterates, change the prototype and regenerate; once it is final, this file is the source.
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import './klanten.css'

type HomeT = Awaited<ReturnType<typeof getTranslations>>

export function WaaromKlantenView({ t }: { t: HomeT }) {
  return (
    <>
      <section id="waarom" className="gf4" aria-labelledby="waarom-h">
        {' '}
        <div className="gf4-in">
          {' '}
          <div className="gf4-hd">
            {' '}
            <h2 className="gf4-h" id="waarom-h">
              {t("waarom.title")}
            </h2>
            {' '}
            <p className="gf4-p">
              {t("waarom.sub")}
            </p>
            {' '}
          </div>
          {' '}
          <div className="gw-body">
            {' '}
            <div className="gw-left">
              {' '}
              <figure className="gw-fig">
                {' '}
                <div className="gw-win" id="gw-win" data-app="" role="group" aria-label={t("waarom.windowLabel")}>
                  {' '}
                  <div className="gw-top">
                    <p className="gw-cl">
                      <span className="gw-dot" aria-hidden="true">
                      </span>
                      {t("waarom.screens.n1")}
                    </p>
                  </div>
                  {' '}
                  <ul className="gw-tabs" id="gw-tabs" aria-label={t("waarom.tabsLabel")}>
                    <li>
                      {t("waarom.screens.n2")}
                    </li>
                    <li>
                      {t("waarom.screens.n3")}
                    </li>
                    <li>
                      {t("waarom.screens.n4")}
                    </li>
                    <li>
                      {t("waarom.screens.n5")}
                    </li>
                    <li>
                      {t("waarom.screens.n6")}
                    </li>
                    <li className="gw-on">
                      {t("waarom.screens.n7")}
                    </li>
                  </ul>
                  {' '}
                  <div className="gw-main">
                    {' '}
                    <p className="gw-t">
                      {t("waarom.screens.n8")}
                    </p>
                    {' '}
                    <p className="gw-k">
                      {t("waarom.screens.n9")}
                    </p>
                    {' '}
                    <ul className="gw-rows">
                      {' '}
                      <li>
                        <b>
                          {t("waarom.screens.n10")}
                        </b>
                        <span>
                          {t("waarom.screens.n11")}
                        </span>
                        <em>
                          {t("waarom.screens.n12")}
                        </em>
                      </li>
                      {' '}
                      <li>
                        <b>
                          {t("waarom.screens.n13")}
                        </b>
                        <span>
                          {t("waarom.screens.n14")}
                        </span>
                        <em>
                          {t("waarom.screens.n15")}
                        </em>
                      </li>
                      {' '}
                      <li>
                        <b>
                          {t("waarom.screens.n16")}
                        </b>
                        <span>
                          {t("waarom.screens.n17")}
                        </span>
                        <em>
                          {t("waarom.screens.n18")}
                        </em>
                      </li>
                      {' '}
                      <li>
                        <b>
                          {t("waarom.screens.n19")}
                        </b>
                        <span>
                          {t("waarom.screens.n20")}
                        </span>
                        <em>
                          {t("waarom.screens.n21")}
                        </em>
                      </li>
                      {' '}
                      <li>
                        <b>
                          {t("waarom.screens.n22")}
                        </b>
                        <span>
                          {t("waarom.screens.n23")}
                        </span>
                        <em>
                          {t("waarom.screens.n24")}
                        </em>
                      </li>
                      {' '}
                    </ul>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                <figcaption>
                  <p className="gw-fc">
                    {t("waarom.caption")}
                  </p>
                  <p className="gf4-demo">
                    {t("waarom.demo")}
                  </p>
                </figcaption>
                {' '}
              </figure>
              {' '}
              <p className="gw-nb">
                {t("waarom.replaces")}
              </p>
              {' '}
            </div>
            {' '}
            <div className="gw-right">
              {' '}
              <div className="gw-tw" role="region" aria-labelledby="gw-tc" tabIndex={0}>
                {' '}
                <table className="gw-tab">
                  {' '}
                  <caption id="gw-tc" className="gw-sr">
                    {t("waarom.table.caption")}
                  </caption>
                  {' '}
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="gw-sr">
                          {t("waarom.table.head.n1")}
                        </span>
                      </th>
                      <th scope="col" className="gw-cy">
                        {t("waarom.table.head.n2")}
                      </th>
                      <th scope="col">
                        {t("waarom.table.head.n3")}
                      </th>
                      <th scope="col">
                        {t("waarom.table.head.n4")}
                      </th>
                    </tr>
                  </thead>
                  {' '}
                  <tbody>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n1")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n1")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n2")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n3")}
                      </td>
                    </tr>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n2")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n4")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n5")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n6")}
                      </td>
                    </tr>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n3")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n7")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n8")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n9")}
                      </td>
                    </tr>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n4")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n10")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n11")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n12")}
                      </td>
                    </tr>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n5")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n13")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n14")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n15")}
                      </td>
                    </tr>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n6")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n16")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n17")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n18")}
                      </td>
                    </tr>
                    {' '}
                    <tr>
                      <th scope="row">
                        {t("waarom.table.rows.n7")}
                      </th>
                      <td className="gw-cy">
                        {t("waarom.table.cells.n19")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n20")}
                      </td>
                      <td>
                        {t("waarom.table.cells.n21")}
                      </td>
                    </tr>
                    {' '}
                  </tbody>
                  {' '}
                </table>
                {' '}
              </div>
              {' '}
              <p className="gw-eu">
                {t("waarom.dataLine")}
              </p>
              {' '}
              <p className="gw-src">
                {t("waarom.sources.n1")}{' '}
                <a href="https://help.openai.com/en/articles/8542115-chatgpt-business-general-faq" rel="nofollow noopener" target="_blank">
                  {t("waarom.sources.n2")}
                </a>
                {t("waarom.sources.n3")}{' '}
                <a href="https://help.openai.com/en/articles/10169521-projects-in-chatgpt" rel="nofollow noopener" target="_blank">
                  {t("waarom.sources.n4")}
                </a>
                {t("waarom.sources.n5")}{' '}
                <a href="https://planable.io/pricing/" rel="nofollow noopener" target="_blank">
                  {t("waarom.sources.n6")}
                </a>
                {t("waarom.sources.n7")}{' '}
                <a href="https://www.aicollegas.nl/wat-we-doen/ai-agents" rel="nofollow noopener" target="_blank">
                  {t("waarom.sources.n8")}
                </a>
                {t("waarom.sources.n9")}
              </p>
              {' '}
              <p className="gw-links">
                <Link className="gf4-lk" href="/alternatives" prefetch={false}>
                  {t("waarom.links.n1")}
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link className="gf4-lk" href="/kennisbank/clyde-vs-jasper-chatgpt-semrush" locale="nl" prefetch={false}>
                  {t("waarom.links.n2")}
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </p>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
      <section id="klanten" className="gf4" aria-labelledby="klanten-h">
        {' '}
        <div className="gf4-in">
          {' '}
          <div className="gf4-hd">
            {' '}
            <h2 className="gf4-h" id="klanten-h">
              {t("klanten.title")}
            </h2>
            {' '}
            <p className="gf4-p">
              {t("klanten.sub")}
            </p>
            {' '}
          </div>
          {' '}
          <div className="ek-grid">
            {' '}
            <article className="ek-card ek-skc" aria-labelledby="ek-skc-h">
              {' '}
              <h3 className="ek-n" id="ek-skc-h">
                {t("klanten.names.n1")}
              </h3>
              {' '}
              <p className="ek-d">
                {t("klanten.text.n1")}
              </p>
              {' '}
              <p className="ek-d">
                {t("klanten.text.n2")}
              </p>
              {' '}
              <ul className="ek-posts" role="list" aria-label={t("klanten.aria.n1")}>
                {' '}
                <li>
                  <Image src="/home/klanten/skc-club-boodschappen.webp" width={720} height={900} sizes="(max-width: 599px) 95px, (max-width: 860px) 212px, 159px" alt={t("klanten.alt.skc-club-boodschappen")} loading="lazy" decoding="async" />
                  <p className="ek-pl">
                    {t("klanten.postLabels.n1")}
                  </p>
                  <p className="ek-pf" data-app="">
                    {t("klanten.screens.n1")}
                  </p>
                </li>
                {' '}
                <li>
                  <Image src="/home/klanten/skc-shop-enzympeeling.webp" width={720} height={900} sizes="(max-width: 599px) 95px, (max-width: 860px) 212px, 159px" alt={t("klanten.alt.skc-shop-enzympeeling")} loading="lazy" decoding="async" />
                  <p className="ek-pl">
                    {t("klanten.postLabels.n2")}
                  </p>
                  <p className="ek-pf" data-app="">
                    {t("klanten.screens.n2")}
                  </p>
                </li>
                {' '}
                <li>
                  <Image src="/home/klanten/skc-huid-conservering.webp" width={720} height={900} sizes="(max-width: 599px) 95px, (max-width: 860px) 212px, 159px" alt={t("klanten.alt.skc-huid-conservering")} loading="lazy" decoding="async" />
                  <p className="ek-pl">
                    {t("klanten.postLabels.n3")}
                  </p>
                  <p className="ek-pf" data-app="">
                    {t("klanten.screens.n3")}
                  </p>
                </li>
                {' '}
              </ul>
              {' '}
              <div className="ek-foot">
                <p className="ek-meta">
                  {t("klanten.meta.n1")}
                </p>
                <Link className="gf4-lk" href="/case-studies/skinclarity-club" prefetch={false}>
                  {t("klanten.links.n1")}
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
              {' '}
            </article>
            {' '}
            <article className="ek-card ek-sl" aria-labelledby="ek-sl-h">
              {' '}
              <div className="ek-hd">
                <Image src="/home/klanten/sl-logo.webp" width={100} height={96} sizes="(max-width: 599px) 29px, (max-width: 860px) 29px, 29px" className="ek-logo" alt="" loading="lazy" decoding="async" />
                <h3 className="ek-n" id="ek-sl-h">
                  {t("klanten.names.n2")}
                </h3>
              </div>
              {' '}
              <p className="ek-d">
                {t("klanten.text.n3")}
              </p>
              {' '}
              <p className="ek-d">
                {t("klanten.text.n4")}
              </p>
              {' '}
              <ul className="ek-posts" role="list" aria-label={t("klanten.aria.n2")}>
                {' '}
                <li>
                  <Image src="/home/klanten/sl-same-leads.webp" width={720} height={900} sizes="(max-width: 599px) 95px, (max-width: 860px) 212px, 159px" alt={t("klanten.alt.sl-same-leads")} loading="lazy" decoding="async" />
                  <p className="ek-pl">
                    {t("klanten.postLabels.n4")}
                  </p>
                  <p className="ek-pf" data-app="">
                    {t("klanten.screens.n4")}
                  </p>
                </li>
                {' '}
                <li>
                  <Image src="/home/klanten/sl-three-kinds.webp" width={720} height={900} sizes="(max-width: 599px) 95px, (max-width: 860px) 212px, 159px" alt={t("klanten.alt.sl-three-kinds")} loading="lazy" decoding="async" />
                  <p className="ek-pl">
                    {t("klanten.postLabels.n5")}
                  </p>
                  <p className="ek-pf" data-app="">
                    {t("klanten.screens.n5")}
                  </p>
                </li>
                {' '}
                <li>
                  <Image src="/home/klanten/sl-not-right-now.webp" width={720} height={900} sizes="(max-width: 599px) 95px, (max-width: 860px) 212px, 159px" alt={t("klanten.alt.sl-not-right-now")} loading="lazy" decoding="async" />
                  <p className="ek-pl">
                    {t("klanten.postLabels.n6")}
                  </p>
                  <p className="ek-pf" data-app="">
                    {t("klanten.screens.n6")}
                  </p>
                </li>
                {' '}
              </ul>
              {' '}
              <div className="ek-foot">
                <p className="ek-meta">
                  {t("klanten.meta.n2")}
                </p>
              </div>
              {' '}
            </article>
            {' '}
            <article className="ek-me" aria-labelledby="ek-me-h">
              {' '}
              <Image src="/home/klanten/portret-huidig.webp" width={400} height={400} sizes="(max-width: 599px) 112px, (max-width: 860px) 112px, 112px" className="ek-pt" alt={t("klanten.alt.portret-huidig")} loading="lazy" decoding="async" />
              {' '}
              <h3 className="ek-n" id="ek-me-h">
                {t("klanten.names.n3")}
              </h3>
              {' '}
              <p className="ek-role">
                {t("klanten.role")}
              </p>
              {' '}
              <p className="ek-d">
                {t("klanten.text.n5")}
              </p>
              {' '}
              <div className="ek-foot">
                <Link className="gf4-lk" href="/about" prefetch={false}>
                  {t("klanten.links.n2")}
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
              {' '}
            </article>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
    </>
  )
}

export async function WaaromKlantenSections() {
  const t = await getTranslations('home')
  return <WaaromKlantenView t={t} />
}
