// Generated from the approved prototype (design/ronde1b/home-7.html, #start and #prijs and #vragen and #afsluiting) by
// design/ronde1b/tools/port/port_section.py in the 2026-11-02 website-audit folder. While the design still
// iterates, change the prototype and regenerate; once it is final, this file is the source.
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import './start.css'

type HomeT = Awaited<ReturnType<typeof getTranslations>>

export function StartPrijsVragenView({ t }: { t: HomeT }) {
  return (
    <>
      <section id="start" className="gf5" aria-labelledby="start-h">
        {' '}
        <div className="gf5-in">
          {' '}
          <div className="gf5-hd">
            {' '}
            <h2 className="gf5-h" id="start-h">
              {t("start.title")}
            </h2>
            {' '}
            <p className="gf5-p">
              {t("start.sub")}
            </p>
            {' '}
          </div>
          {' '}
          <ol className="gs-weeks">
            {' '}
            <li className="gs-wk">
              <p className="gs-n">
                {t("start.weekLabels.n1")}
              </p>
              <h3 className="gs-t">
                {t("start.weekTitles.n1")}
              </h3>
              {' '}
              <dl className="gs-dl">
                <div>
                  <dt>
                    {t("start.rowLabels.n1")}
                  </dt>
                  <dd>{t.rich("start.rowTexts.n1", { b: (c) => <b>{c}</b> })}</dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n2")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n2")}
                  </dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n3")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n3")}
                  </dd>
                </div>
              </dl>
            </li>
            {' '}
            <li className="gs-wk">
              <p className="gs-n">
                {t("start.weekLabels.n2")}
              </p>
              <h3 className="gs-t">
                {t("start.weekTitles.n2")}
              </h3>
              {' '}
              <dl className="gs-dl">
                <div>
                  <dt>
                    {t("start.rowLabels.n4")}
                  </dt>
                  <dd>{t.rich("start.rowTexts.n4", { b: (c) => <b>{c}</b> })}</dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n5")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n5")}
                  </dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n6")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n6")}
                  </dd>
                </div>
              </dl>
            </li>
            {' '}
            <li className="gs-wk">
              <p className="gs-n">
                {t("start.weekLabels.n3")}
              </p>
              <h3 className="gs-t">
                {t("start.weekTitles.n3")}
              </h3>
              {' '}
              <dl className="gs-dl">
                <div>
                  <dt>
                    {t("start.rowLabels.n7")}
                  </dt>
                  <dd>{t.rich("start.rowTexts.n7", { b: (c) => <b>{c}</b> })}</dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n8")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n8")}
                  </dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n9")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n9")}
                  </dd>
                </div>
              </dl>
            </li>
            {' '}
            <li className="gs-wk">
              <p className="gs-n">
                {t("start.weekLabels.n4")}
              </p>
              <h3 className="gs-t">
                {t("start.weekTitles.n4")}
              </h3>
              {' '}
              <dl className="gs-dl">
                <div>
                  <dt>
                    {t("start.rowLabels.n10")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n10")}
                  </dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n11")}
                  </dt>
                  <dd>
                    {t("start.rowTexts.n11")}
                  </dd>
                </div>
                <div>
                  <dt>
                    {t("start.rowLabels.n12")}
                  </dt>
                  <dd>{t.rich("start.rowTexts.n12", { b: (c) => <b>{c}</b> })}</dd>
                </div>
              </dl>
            </li>
            {' '}
          </ol>
          {' '}
          <div className="gf5-act">
            {' '}
            <Link className="gf5-btn" href="/apply" prefetch={false}>
              {t("start.cta")}
            </Link>
            {' '}
            <p className="gf5-sm">
              {t("start.note")}
            </p>
            {' '}
            <Link className="gf5-lk" href="/how-it-works" prefetch={false}>
              {t("start.links.n1")}
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
      <section id="prijs" className="gf5" aria-labelledby="prijs-h">
        {' '}
        <div className="gf5-in">
          {' '}
          <div className="gf5-hd">
            {' '}
            <h2 className="gf5-h" id="prijs-h">
              {t("prijs.title")}
            </h2>
            {' '}
            <p className="gf5-p">
              {t("prijs.sub")}
            </p>
            {' '}
          </div>
          {' '}
          <div className="gp-fd">
            {' '}
            <div className="gp-main">
              {' '}
              <p className="gp-k">
                {t("prijs.labels.n1")}
              </p>
              {' '}
              <p className="gp-big">{t.rich("prijs.price", { b: (c) => <b>{c}</b> })}</p>
              {' '}
              <ul className="gp-in">
                {' '}
                <li>
                  {t("prijs.lists.n1")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n2")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n3")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n4")}
                </li>
                {' '}
              </ul>
              {' '}
              <p className="gp-def">
                {t("prijs.definition")}
              </p>
              {' '}
            </div>
            {' '}
            <div className="gp-sum">
              {' '}
              <p className="gp-k">
                {t("prijs.labels.n2")}
              </p>
              {' '}
              <ul className="gp-pm">
                {' '}
                <li>
                  <b>
                    {t("prijs.perBrand.n1")}
                  </b>
                  <span>
                    {t("prijs.perBrand.n2")}
                  </span>
                </li>
                {' '}
                <li>
                  <b>
                    {t("prijs.perBrand.n3")}
                  </b>
                  <span>
                    {t("prijs.perBrand.n4")}
                  </span>
                </li>
                {' '}
                <li>
                  <b>
                    {t("prijs.perBrand.n5")}
                  </b>
                  <span>
                    {t("prijs.perBrand.n6")}
                  </span>
                </li>
                {' '}
              </ul>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <p className="gp-ent">
            {t("prijs.regular")}
          </p>
          {' '}
          <div className="gp-fit">
            {' '}
            <div className="gp-col">
              <h3 className="gp-ch">
                {t("prijs.fitTitles.n1")}
              </h3>
              {' '}
              <ul>
                {' '}
                <li>
                  {t("prijs.lists.n5")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n6")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n7")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n8")}
                </li>
                {' '}
              </ul>
            </div>
            {' '}
            <div className="gp-col">
              <h3 className="gp-ch">
                {t("prijs.fitTitles.n2")}
              </h3>
              {' '}
              <ul>
                {' '}
                <li>
                  {t("prijs.lists.n9")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n10")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n11")}
                </li>
                {' '}
                <li>
                  {t("prijs.lists.n12")}
                </li>
                {' '}
              </ul>
            </div>
            {' '}
          </div>
          {' '}
          <div className="gf5-act">
            {' '}
            <Link className="gf5-btn" href="/apply" prefetch={false}>
              {t("prijs.cta")}
            </Link>
            {' '}
            <Link className="gf5-lk" href="/pricing" prefetch={false}>
              {t("prijs.links.n1")}
              <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </Link>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
      <section id="vragen" className="gf5" aria-labelledby="vragen-h">
        {' '}
        <div className="gf5-in">
          {' '}
          <div className="gf5-hd">
            {' '}
            <h2 className="gf5-h" id="vragen-h">
              {t("vragen.title")}
            </h2>
            {' '}
            <p className="gf5-p">
              {t("vragen.sub")}
            </p>
            {' '}
          </div>
          {' '}
          <div className="gv-list">
            {' '}
            <details className="gv-q" open>
              <summary>
                {t("vragen.questions.n1")}
              </summary>
              <p>
                {t("vragen.answers.n1")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n2")}
              </summary>
              <p>
                {t("vragen.answers.n2")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n3")}
              </summary>
              <p>
                {t("vragen.answers.n3")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n4")}
              </summary>
              <p>
                {t("vragen.answers.n4")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n5")}
              </summary>
              <p>
                {t("vragen.answers.n5")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n6")}
              </summary>
              <p>
                {t("vragen.answers.n6")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n7")}
              </summary>
              <p>
                {t("vragen.answers.n7")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n8")}
              </summary>
              <p>
                {t("vragen.answers.n8")}
              </p>
            </details>
            {' '}
            <details className="gv-q">
              <summary>
                {t("vragen.questions.n9")}
              </summary>
              <p>
                {t("vragen.answers.n9")}
              </p>
            </details>
            {' '}
          </div>
          {' '}
          <ul className="gv-kb">
            {' '}
            <li>
              <Link className="gf5-lk" href="/kennisbank/clyde-vs-jasper-chatgpt-semrush" prefetch={false}>
                {t("vragen.links.n1")}
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
            {' '}
            <li>
              <Link className="gf5-lk" href="/kennisbank/marketingbureau-schalen-met-ai" prefetch={false}>
                {t("vragen.links.n2")}
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
            {' '}
            <li>
              <Link className="gf5-lk" href="/kennisbank/ai-marketing-agent-geheugen-en-leren" prefetch={false}>
                {t("vragen.links.n3")}
                <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
            {' '}
          </ul>
          {' '}
        </div>
        {' '}
      </section>
      <section id="afsluiting" className="gf5" aria-labelledby="afsluiting-h">
        {' '}
        <div className="gf5-in">
          {' '}
          <div className="ga-band">
            {' '}
            <Image src="/home/klanten/portret-huidig.webp" width={400} height={400} sizes="(max-width: 599px) 112px, (max-width: 860px) 112px, 152px" className="ga-pt" alt={t("afsluiting.alt.portret-huidig")} loading="lazy" decoding="async" />
            {' '}
            <div className="ga-tx">
              {' '}
              <h2 className="gf5-h" id="afsluiting-h">
                {t("afsluiting.title")}
              </h2>
              {' '}
              <p className="gf5-p">
                {t("afsluiting.sub")}
              </p>
              {' '}
              <div className="gf5-act">
                {' '}
                <Link className="gf5-btn" href="/apply" prefetch={false}>
                  {t("afsluiting.cta")}
                </Link>
                {' '}
                <Link className="gf5-lk" href="/assessment" prefetch={false}>
                  {t("afsluiting.links.n1")}
                  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </Link>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </section>
    </>
  )
}

export async function StartPrijsVragenSecties() {
  const t = await getTranslations('home')
  return <StartPrijsVragenView t={t} />
}
