import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { VoorExperience } from '@/components/voor/VoorExperience'
import chapterData from '@/content/voor/outreach-chapters.json'
import { getVideoPage, SLUG_RE, type ViewRecord } from '@/lib/video-pages-app'

export const dynamic = 'force-dynamic'

// null when the middleware branch did not run (no x-voor-method): better a
// missed open than a scanner counted as one.
function recordFrom(h: Headers): ViewRecord | null {
  const method = h.get('x-voor-method')
  if (!method) return null
  const referer = h.get('referer')
  let referrerHost: string | null = null
  if (referer) {
    try {
      referrerHost = new URL(referer).host
    } catch {
      referrerHost = null
    }
  }
  // The app rejects longer values with a 400 (zod max 512 / 253), which would hide the page.
  const ua = h.get('user-agent')?.slice(0, 512) || null
  return { method, userAgent: ua, referrerHost: referrerHost?.slice(0, 253) || null }
}

// One view call shared by generateMetadata and the page.
const load = cache(async (slug: string) => getVideoPage(slug, recordFrom(await headers())))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()
  const page = await load(slug)
  if (!page) notFound()
  return {
    title: `Video voor ${page.agencyName}`,
    robots: { index: false, follow: false },
    openGraph: { images: [`/api/og/voor/${slug}`] },
  }
}

export default async function VoorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SLUG_RE.test(slug)) notFound()
  const page = await load(slug)
  if (!page) notFound()
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:pt-10">
      <p className="mb-6 text-sm font-semibold tracking-wide text-text-secondary">FutureMarketingAI</p>
      <span className="text-xs font-semibold uppercase tracking-widest text-accent-system">
        Voor {page.firstName} van {page.agencyName}
      </span>
      <h1 className="mb-6 mt-2 text-2xl font-semibold leading-tight sm:text-4xl">
        {page.firstName}, hier is de video die ik je beloofde.
      </h1>
      <VoorExperience
        slug={slug}
        firstName={page.firstName}
        agencyName={page.agencyName}
        email={page.email}
        bookingStart={page.bookingStart}
        chapters={chapterData.chapters}
        endCardSec={chapterData.endCardSec}
      />
      <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-text-secondary">
        FutureMarketingAI · future-marketing.ai
      </footer>
    </main>
  )
}
