/**
 * Root-level not-found fallback.
 *
 * WHY: <html>/<body> live in src/app/[locale]/layout.tsx (next-intl), and the root
 * src/app/layout.tsx is a passthrough (`return children`). Any path that resolves to
 * the BUILTIN root not-found (an unmatched non-localized route, or a stale dev route
 * manifest) would otherwise render through that passthrough with no <html>/<body> and
 * throw Next.js 16's "Missing <html> and <body> tags in the root layout"
 * (NEXT_MISSING_ROOT_TAGS). This component renders a complete document itself so that
 * case degrades to a normal 404 page instead of a runtime error.
 *
 * Self-contained on purpose: it renders outside the locale/provider tree, so no
 * next-intl, no Tailwind layer dependency — inline styles only, plain <a>.
 */
export default function GlobalNotFound() {
  return (
    <html lang="nl">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          background: '#0a0d14',
          color: '#e8ecf4',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00d4aa' }}>
          404
        </p>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 600, maxWidth: '32rem' }}>
          Deze pagina bestaat niet
        </h1>
        <p style={{ margin: 0, color: '#9ba3b5', maxWidth: '32rem', lineHeight: 1.6 }}>
          De link is mogelijk verouderd of verkeerd getypt. Ga terug naar de homepage of bekijk de kennisbank.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <a
            href="/nl"
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              background: '#00d4aa',
              color: '#0a0d14',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Naar de homepage
          </a>
          <a
            href="/nl/kennisbank"
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #1a1f2e',
              color: '#e8ecf4',
              textDecoration: 'none',
            }}
          >
            Naar de kennisbank
          </a>
        </div>
      </body>
    </html>
  )
}
