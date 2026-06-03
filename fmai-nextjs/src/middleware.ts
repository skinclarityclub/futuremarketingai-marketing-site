import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

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
