import { cache } from 'react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
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
  return { method, userAgent: h.get('user-agent'), referrerHost }
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
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">{page.firstName}, hier is de video die ik je beloofde.</h1>
    </main>
  )
}
