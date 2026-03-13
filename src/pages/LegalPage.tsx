import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { LoadingFallback } from '../components'

/**
 * LegalPage - Displays Privacy Policy, Cookie Policy, or Terms of Service
 *
 * Routes:
 * - /privacy -> Privacy Policy
 * - /cookies -> Cookie Policy
 * - /terms -> Terms of Service
 *
 * Automatically selects language (NL/EN) based on i18n
 */
export function LegalPage() {
  const { i18n } = useTranslation()
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const lang = i18n.language.startsWith('nl') ? 'nl' : 'en'

  const docMap: Record<string, { file: string; title: string; titleNl: string }> = {
    privacy: {
      file: 'privacy-policy',
      title: 'Privacy Policy',
      titleNl: 'Privacybeleid',
    },
    cookies: {
      file: 'cookie-policy',
      title: 'Cookie Policy',
      titleNl: 'Cookiebeleid',
    },
    terms: {
      file: 'terms',
      title: 'Terms of Service',
      titleNl: 'Servicevoorwaarden',
    },
  }

  useEffect(() => {
    const loadDocument = async () => {
      if (!type || !docMap[type]) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const doc = docMap[type]
        const response = await fetch(`/legal/${doc.file}-${lang}.md`)

        if (!response.ok) {
          throw new Error('Document not found')
        }

        const text = await response.text()
        setContent(text)
        setError(false)
      } catch (err) {
        console.error('Failed to load legal document:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [type, lang])

  if (loading) {
    return <LoadingFallback fullScreen message="Loading document..." />
  }

  if (error || !type || !docMap[type]) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center p-12">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold font-display text-text-primary mb-4">404</h1>
          <p className="text-text-secondary mb-6">
            {lang === 'nl' ? 'Document niet gevonden' : 'Document not found'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-accent-system hover:bg-accent-system/90 text-bg-deep rounded-btn transition-colors"
          >
            {lang === 'nl' ? 'Terug naar Demo' : 'Back to Demo'}
          </button>
        </div>
      </div>
    )
  }

  const doc = docMap[type]
  const title = lang === 'nl' ? doc.titleNl : doc.title

  return (
    <div className="min-h-screen bg-bg-deep">
      {/* Header */}
      <header
        className="border-b border-border-primary bg-bg-surface sticky top-0 z-50"
        style={{ animation: 'fadeIn 0.5s ease-out' }}
      >
        <div className="max-w-7xl mx-auto px-12 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display text-text-primary">{title}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border-primary hover:border-accent-system rounded-btn transition-all"
          >
            {lang === 'nl' ? 'Terug naar Demo' : 'Back to Demo'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main
        className="max-w-7xl mx-auto px-12 py-12"
        style={{ animation: 'fadeIn 0.8s ease-out 0.2s both' }}
      >
        <article className="prose prose-invert prose-lg max-w-none">
          <div className="bg-white/[0.02] border border-border-primary rounded-card p-8 md:p-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom component styling for better readability
                h1: ({ children, ...props }) => (
                  <h1 className="text-4xl font-bold font-display text-text-primary mb-6" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2
                    className="text-3xl font-bold font-display text-text-primary mt-12 mb-4"
                    {...props}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3
                    className="text-2xl font-semibold font-display text-text-secondary mt-8 mb-3"
                    {...props}
                  >
                    {children}
                  </h3>
                ),
                p: ({ children, ...props }) => (
                  <p className="text-text-secondary leading-relaxed mb-4" {...props}>
                    {children}
                  </p>
                ),
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-accent-system hover:text-accent-system/80 underline transition-colors"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                ),
                ul: ({ children, ...props }) => (
                  <ul
                    className="list-disc list-inside text-text-secondary space-y-2 mb-4"
                    {...props}
                  >
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol
                    className="list-decimal list-inside text-text-secondary space-y-2 mb-4"
                    {...props}
                  >
                    {children}
                  </ol>
                ),
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto mb-6">
                    <table
                      className="min-w-full border-collapse border border-border-primary"
                      {...props}
                    >
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th
                    className="border border-border-primary bg-bg-elevated px-4 py-2 text-left text-text-primary font-semibold"
                    {...props}
                  >
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td
                    className="border border-border-primary px-4 py-2 text-text-secondary"
                    {...props}
                  >
                    {children}
                  </td>
                ),
                code: ({ children, ...props }) => (
                  <code
                    className="bg-bg-elevated text-accent-system px-2 py-1 rounded-sm text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ),
                hr: ({ ...props }) => <hr className="border-border-primary my-8" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Footer Links */}
        <div
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-text-muted"
          style={{ animation: 'fadeIn 0.8s ease-out 0.4s both' }}
        >
          {Object.entries(docMap)
            .filter(([key]) => key !== type)
            .map(([key, doc]) => (
              <button
                key={key}
                onClick={() => navigate(`/${key}`)}
                className="hover:text-accent-system transition-colors underline"
              >
                {lang === 'nl' ? doc.titleNl : doc.title}
              </button>
            ))}
        </div>
      </main>
    </div>
  )
}

export default LegalPage
