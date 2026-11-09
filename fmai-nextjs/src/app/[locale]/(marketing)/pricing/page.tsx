import type { Metadata } from 'next'
import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PricingJsonLd } from '@/components/seo/PricingJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { CTAButton } from '@/components/ui/CTAButton'
import { WorkspaceSlider } from '@/components/pricing/WorkspaceSlider'
import { FoundingCounter } from '@/components/founding/FoundingCounter'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
import { CREDIT_PACKS, FOUNDING, PRICING_CHECKED_ON, REGULAR_EXPECTED, formatEur, foundingPrice } from '@/lib/pricing-data'
import { ArrowRight } from 'lucide-react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'pricing', path: '/pricing' })
}

const FOUNDING_LIST = ['n1', 'n2', 'n3', 'n4', 'n5'] as const
const INCLUDED_KEYS = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'] as const
// Plan A1.4 §3: the balanced month per brand, channel by channel (placements over 4 weeks).
const MONTH_ROWS = ['n1', 'n2', 'n3', 'n4', 'n5'] as const
const MONTH_EXTRAS = ['n1', 'n2', 'n3'] as const
const EXAMPLE_BRANDS = [5, 10, 15] as const
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11'] as const
const CTA_LINKS = [
  { key: 'n1', href: '/alternatives' },
  { key: 'n2', href: '/trust' },
  { key: 'n3', href: '/how-it-works' },
] as const

// Golf 5 home tokens (start.css), as utilities: the page reads as the home's #prijs.
const SECTION = 'border-t border-white/[0.06] bg-[#0a0d14] px-6 py-[clamp(56px,8vh,96px)] lg:px-12'
const KICK = 'font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#5eead4]'
const H2 =
  'mt-4 max-w-[22ch] text-[clamp(30px,3.4vw,48px)] font-bold leading-[1.08] tracking-[-0.03em] text-[#f4f7fb] [text-wrap:balance]'
const LEAD = 'mt-4 max-w-[62ch] text-[17px] leading-[1.6] text-[#c4ccd8]'
const BODY = 'text-[15.5px] leading-[1.6] text-[#c4ccd8]'
const DOT =
  'relative pl-5 before:absolute before:left-0.5 before:top-[0.62em] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[#2dd4bf]'
const TABLE_WRAP = 'mt-8 overflow-x-auto rounded-[14px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'
const TABLE = 'w-full min-w-[560px] border-separate border-spacing-0 text-left text-[14.5px] leading-[1.45]'
const TH_HEAD = 'px-4 pb-3 pt-4 align-bottom text-[13.5px] font-semibold text-[#c4ccd8]'
const TH_ROW = 'sticky left-0 border-t border-white/[0.07] bg-[#0a0d14] px-4 py-3 align-top font-semibold text-[#f4f7fb]'
const TD = 'border-t border-white/[0.07] px-4 py-3 align-top tabular-nums text-[#c4ccd8]'

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'pricing' })

  // The slider is a client island; the global client payload only ships
  // GLOBAL_CLIENT_NAMESPACES, so scope a provider here with just the subtree
  // it reads (the whole namespace would ship the FAQ twice).
  const { pricing } = (await getMessages()) as {
    pricing: { example: { slider: AbstractIntlMessages } }
  }
  const pricingMessages = { pricing: { example: { slider: pricing.example.slider } } }

  const eur = (n: number) => formatEur(n, locale)
  const [pack1, pack2, pack3] = CREDIT_PACKS
  // One value bag for every string: copy never carries its own price or count.
  const v = {
    price: eur(FOUNDING.price),
    included: FOUNDING.includedWorkspaces,
    extra: eur(FOUNDING.pricePerExtraWorkspace),
    max: FOUNDING.maxWorkspaces,
    creditsPerBrand: eur(FOUNDING.creditsPerBrand),
    credits: eur(FOUNDING.creditsPerBrand * FOUNDING.includedWorkspaces),
    lock: FOUNDING.priceLockMonths,
    loyalty: FOUNDING.loyaltyDiscountPct,
    regularMin: eur(REGULAR_EXPECTED.min),
    regularMax: eur(REGULAR_EXPECTED.max),
    regularBrands: REGULAR_EXPECTED.brands,
    spots: FOUNDING_SPOTS_TOTAL,
    taken: FOUNDING_SPOTS_TAKEN,
    perBrand: eur(Math.round(FOUNDING.price / FOUNDING.includedWorkspaces)),
    price10: eur(foundingPrice(10)),
    price15: eur(foundingPrice(15)),
    pack1Credits: eur(pack1.credits),
    pack1Price: eur(pack1.price),
    pack3Credits: eur(pack3.credits),
    pack3Price: eur(pack3.price),
    pack2Credits: eur(pack2.credits),
    pack2Price: eur(pack2.price),
  }
  const checkedOn = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(PRICING_CHECKED_ON))

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/pricing"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ]}
        locale={locale}
      />
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`, v),
          answer: t(`faq.items.${key}.answer`, v),
        }))}
        path="/pricing"
        locale={locale}
      />
      <PricingJsonLd locale={locale} />
      <Breadcrumbs path="/pricing" locale={locale} />

      {/* 1. Hero */}
      <section className="bg-[#0a0d14] px-6 pb-[clamp(48px,7vh,80px)] pt-24 lg:px-12" aria-labelledby="pricing-hero">
        <div className="mx-auto max-w-6xl">
          <p className={KICK}>{t('hero.eyebrow')}</p>
          <h1
            id="pricing-hero"
            className="mt-4 text-[clamp(40px,5.2vw,76px)] font-bold leading-[1.02] tracking-[-0.04em] text-[#f4f7fb]"
          >
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-[60ch] text-[clamp(17px,1.4vw,20px)] leading-[1.55] text-[#c4ccd8]">
            {t('hero.lead', v)}
          </p>
          <p className="mt-4 text-sm text-[#8f9aae]">
            <time dateTime={PRICING_CHECKED_ON}>{t('hero.checked', { date: checkedOn })}</time>
          </p>
        </div>
      </section>

      {/* 2. Founding: the offer of today (target of the /founding-member 301) */}
      <section id="founding" className={`${SECTION} scroll-mt-24`} aria-labelledby="founding-title">
        <div className="mx-auto max-w-6xl">
          <p className={KICK}>{t('founding.eyebrow')}</p>
          <h2 id="founding-title" className={H2}>
            {t('founding.title')}
          </h2>
          <p className={LEAD}>{t('founding.sub', v)}</p>
          <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-[18px] bg-[#0e121b] shadow-[0_0_0_1px_rgba(0,212,170,0.28),0_30px_70px_-40px_rgba(0,0,0,0.9)] lg:grid-cols-[7fr_5fr]">
            <div className="flex flex-col gap-4 p-[clamp(24px,2.6vw,40px)]">
              <p className="text-lg leading-tight text-[#c4ccd8]">
                <b className="mr-1.5 text-[clamp(56px,5.6vw,84px)] font-bold leading-none tracking-[-0.04em] text-[#f4f7fb]">
                  €{v.price}
                </b>
                {t('founding.perMonth')}
              </p>
              <ul className="mt-1 flex flex-col gap-2">
                {FOUNDING_LIST.map((key) => (
                  <li key={key} className={`${DOT} text-[15.5px] leading-normal text-[#dfe5ee]`}>
                    {t(`founding.list.${key}`, v)}
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-normal text-[#8f9aae]">{t('founding.definition')}</p>
            </div>
            <div className="flex flex-col gap-4 border-t border-white/[0.07] p-[clamp(24px,2.6vw,40px)] lg:border-l lg:border-t-0">
              <h3 className="text-xl font-bold tracking-[-0.02em] text-[#f4f7fb]">{t('founding.whyTitle', v)}</h3>
              <p className={BODY}>{t('founding.why', v)}</p>
              <p className={BODY}>{t('founding.after', v)}</p>
              <FoundingCounter className="self-start" />
              <CTAButton
                href="/apply"
                size="lg"
                className="w-full justify-center px-5 text-base sm:w-auto sm:self-start sm:px-8 sm:text-lg"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {t('founding.cta')}
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What is in it, in the language of the home */}
      <section className={SECTION} aria-labelledby="included-title">
        <div className="mx-auto max-w-6xl">
          <p className={KICK}>{t('included.eyebrow')}</p>
          <h2 id="included-title" className={H2}>
            {t('included.title')}
          </h2>
          <p className={LEAD}>{t('included.sub')}</p>
          <ul className="mt-10 grid grid-cols-1 gap-[clamp(12px,1.4vw,20px)] sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED_KEYS.map((key) => (
              <li
                key={key}
                className="flex flex-col gap-2 rounded-2xl border-t-2 border-[rgba(0,212,170,0.5)] bg-[#0e121b] p-[clamp(18px,1.8vw,24px)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-[#f4f7fb]">
                  {t(`included.items.${key}.title`)}
                </h3>
                <p className="text-[15px] leading-normal text-[#c4ccd8]">{t(`included.items.${key}.body`)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-normal text-[#8f9aae]">{t('included.soon')}</p>
        </div>
      </section>

      {/* 4. What 1,500 credits per brand typically buy: the balanced month (plan A1.4 §3) */}
      <section id="month" className={`${SECTION} scroll-mt-24`} aria-labelledby="month-title">
        <div className="mx-auto max-w-6xl">
          <p className={KICK}>{t('month.eyebrow')}</p>
          <h2 id="month-title" className={H2}>
            {t('month.title', v)}
          </h2>
          <p className={LEAD}>{t('month.sub', v)}</p>
          <div className={TABLE_WRAP} role="region" aria-labelledby="month-caption" tabIndex={0}>
            <table className={TABLE}>
              <caption id="month-caption" className="caption-top px-4 pt-4 text-left text-sm text-[#8f9aae]">
                {t('month.caption')}
              </caption>
              <thead>
                <tr>
                  {(['n1', 'n2', 'n3'] as const).map((key) => (
                    <th key={key} scope="col" className={TH_HEAD}>
                      {t(`month.head.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTH_ROWS.map((key) => (
                  <tr key={key}>
                    <th scope="row" className={TH_ROW}>
                      {t(`month.rows.${key}.channel`)}
                    </th>
                    <td className={TD}>{t(`month.rows.${key}.rhythm`)}</td>
                    <td className={TD}>{t(`month.rows.${key}.mix`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-8 flex max-w-[70ch] flex-col gap-2">
            {MONTH_EXTRAS.map((key) => (
              <li key={key} className={`${DOT} ${BODY}`}>
                {t(`month.extras.${key}`, v)}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[70ch] text-sm leading-normal text-[#8f9aae]">{t('month.notIncluded')}</p>
          <p className="mt-2 max-w-[70ch] text-sm leading-normal text-[#8f9aae]">{t('month.guideline', v)}</p>
        </div>
      </section>

      {/* 5. Worked example: price per client brand at 5, 10 and 15, plus the slider */}
      <section className={SECTION} aria-labelledby="example-title">
        <div className="mx-auto max-w-6xl">
          <p className={KICK}>{t('example.eyebrow')}</p>
          <h2 id="example-title" className={H2}>
            {t('example.title')}
          </h2>
          <p className={LEAD}>{t('example.sub', v)}</p>
          <div className={TABLE_WRAP} role="region" aria-labelledby="example-title" tabIndex={0}>
            <table className={TABLE}>
              <caption className="sr-only">{t('example.caption')}</caption>
              <thead>
                <tr>
                  {(['n1', 'n2', 'n3', 'n4'] as const).map((key) => (
                    <th key={key} scope="col" className={TH_HEAD}>
                      {t(`example.head.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_BRANDS.map((brands) => {
                  const founding = foundingPrice(brands)
                  return (
                    <tr key={brands}>
                      <th scope="row" className={TH_ROW}>
                        {t('example.brands', { count: brands })}
                      </th>
                      <td className={`${TD} font-semibold text-[#f4f7fb]`}>€{eur(founding)}</td>
                      <td className={TD}>€{eur(Math.round(founding / brands))}</td>
                      <td className={TD}>{eur(FOUNDING.creditsPerBrand * brands)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <NextIntlClientProvider locale={locale} messages={pricingMessages}>
              <WorkspaceSlider locale={locale} initialWorkspaces={FOUNDING.includedWorkspaces} />
            </NextIntlClientProvider>
          </div>
          <p className="mt-6 max-w-[70ch] text-sm leading-normal text-[#8f9aae]">{t('example.regular', v)}</p>
        </div>
      </section>

      {/* 6. Credits, in plain words; top-ups as a side note */}
      <section id="credits" className={`${SECTION} scroll-mt-24`} aria-labelledby="credits-title">
        <div className="mx-auto max-w-6xl">
          <p className={KICK}>{t('credits.eyebrow')}</p>
          <h2 id="credits-title" className={H2}>
            {t('credits.title')}
          </h2>
          <p className={LEAD}>{t('credits.body1')}</p>
          <p className={LEAD}>{t('credits.body2', v)}</p>
          <h3 className="mt-10 text-[17px] font-semibold text-[#f4f7fb]">{t('credits.packsTitle')}</h3>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CREDIT_PACKS.map((pack) => (
              <li
                key={pack.credits}
                className="flex flex-col gap-1 rounded-xl bg-[#0e121b] px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <span className="text-sm text-[#a3adbd]">
                  {t('credits.packCredits', { credits: eur(pack.credits) })}
                </span>
                <span className="font-mono text-lg font-bold text-[#f4f7fb]">€{eur(pack.price)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[70ch] text-sm leading-normal text-[#8f9aae]">{t('credits.packsNote')}</p>
        </div>
      </section>

      {/* 7. Questions */}
      <section className={SECTION} aria-labelledby="pricing-faq">
        <div className="mx-auto max-w-4xl">
          <p className={KICK}>{t('faq.eyebrow')}</p>
          <h2 id="pricing-faq" className={`${H2} mb-10`}>
            {t('faq.title')}
          </h2>
          <FaqAccordion
            items={FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.question`, v),
              answer: t(`faq.items.${key}.answer`, v),
            }))}
          />
        </div>
      </section>

      {/* 8. Close */}
      <section className={SECTION} aria-labelledby="pricing-cta">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 rounded-[20px] bg-[radial-gradient(60%_90%_at_0_100%,rgba(0,212,170,0.07),transparent_70%),#0e121b] p-[clamp(28px,4vw,56px)] shadow-[0_0_0_1px_rgba(0,212,170,0.22)]">
            <p className={KICK}>{t('cta.eyebrow')}</p>
            <h2 id="pricing-cta" className={`${H2} mt-0`}>
              {t('cta.title')}
            </h2>
            <p className={`${BODY} max-w-[56ch] text-[17px]`}>{t('cta.description')}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-4">
              <CTAButton
                href="/apply"
                size="lg"
                className="px-5 text-base sm:px-8 sm:text-lg"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {t('cta.primary')}
              </CTAButton>
            </div>
            <ul className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {CTA_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5eead4] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#5eead4]"
                  >
                    {t(`cta.links.${key}`)}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
