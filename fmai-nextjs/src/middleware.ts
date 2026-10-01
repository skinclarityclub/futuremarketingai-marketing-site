import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)
  // next-intl adds the locale prefix with a 307. Temporary tells Google the
  // unprefixed URL is the real one, so it indexed /kennisbank/<slug> and
  // /skills/email-management next to their /nl/ twins, and for
  // meetbare-ai-marketing-resultaten it picked the unprefixed URL as canonical
  // over the /nl/ page we declared (Search Console, 2026-10-01). A 308 passes
  // the signal on to the prefixed URL. The root stays 307: it negotiates the
  // visitor's language, and that answer can change per visitor.
  if (response.status === 307 && request.nextUrl.pathname !== '/') {
    return new NextResponse(null, { status: 308, headers: response.headers })
  }
  return response
}

export const config = {
  // Match every path EXCEPT api routes, Next internals, and files with an
  // extension (static assets like .jpg/.png, sitemap.xml, robots.txt, llms.txt).
  // The previous narrow matcher ['/', '/(en|nl|es)/:path*'] let unprefixed paths
  // (e.g. /blog) bypass next-intl, so they rendered through the passthrough root
  // layout (src/app/layout.tsx) which has no <html>/<body> — Next.js 16 then throws
  // "Missing <html> and <body> tags in the root layout". Routing every extensionless
  // path through next-intl pushes it into [locale]/ (which DOES render html/body):
  // real pages redirect to the default locale, genuine 404s hit [locale]/not-found.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
