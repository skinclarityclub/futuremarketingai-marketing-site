import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { LoadingFallback } from '../components'

/**
 * LegalPage - Displays Privacy Policy, Cookie Policy, or Terms of Service
 *
 * Routes:
 * - /privacy → Privacy Policy
 * - /cookies → Cookie Policy
 * - /terms → Terms of Service
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-slate-300 mb-6">
            {lang === 'nl' ? 'Document niet gevonden' : 'Document not found'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-600 hover:border-indigo-500 rounded-lg transition-all"
          >
            {lang === 'nl' ? '← Terug naar Demo' : '← Back to Demo'}
          </button>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <article className="prose prose-invert prose-lg max-w-none">
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom component styling for better readability
                h1: ({ children, ...props }) => (
                  <h1 className="text-4xl font-bold text-white mb-6" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-3xl font-bold text-white mt-12 mb-4" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-2xl font-semibold text-slate-200 mt-8 mb-3" {...props}>
                    {children}
                  </h3>
                ),
                p: ({ children, ...props }) => (
                  <p className="text-slate-300 leading-relaxed mb-4" {...props}>
                    {children}
                  </p>
                ),
                a: ({ children, href, ...props }) => (
                  <a
                    href={href}
                    className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4" {...props}>
                    {children}
                  </ol>
                ),
                table: ({ children, ...props }) => (
                  <div className="overflow-x-auto mb-6">
                    <table
                      className="min-w-full border-collapse border border-slate-700"
                      {...props}
                    >
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th
                    className="border border-slate-700 bg-slate-800 px-4 py-2 text-left text-white font-semibold"
                    {...props}
                  >
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td className="border border-slate-700 px-4 py-2 text-slate-300" {...props}>
                    {children}
                  </td>
                ),
                code: ({ children, ...props }) => (
                  <code
                    className="bg-slate-800 text-indigo-300 px-2 py-1 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ),
                hr: ({ ...props }) => <hr className="border-slate-700 my-8" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-400"
        >
          {Object.entries(docMap)
            .filter(([key]) => key !== type)
            .map(([key, doc]) => (
              <button
                key={key}
                onClick={() => navigate(`/${key}`)}
                className="hover:text-indigo-400 transition-colors underline"
              >
                {lang === 'nl' ? doc.titleNl : doc.title}
              </button>
            ))}
        </motion.div>
      </motion.main>
    </div>
  )
}

export default LegalPage
