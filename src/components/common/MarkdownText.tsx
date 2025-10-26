/**
 * MarkdownText Component
 *
 * Reusable component for rendering Markdown formatted text
 * Use this wherever you need to display text with **bold**, *italic*, bullets, etc.
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { Components } from 'react-markdown'

interface MarkdownTextProps {
  children: string
  className?: string
  /** Variant for different text contexts */
  variant?: 'default' | 'compact' | 'inverted'
}

export default function MarkdownText({
  children,
  className = '',
  variant = 'default',
}: MarkdownTextProps) {
  // Base prose classes
  const baseClasses = 'prose prose-sm max-w-none'

  // Variant-specific classes
  const variantClasses = {
    default: `
      prose-p:my-2 prose-p:leading-relaxed
      prose-strong:font-bold prose-strong:text-white
      prose-em:italic prose-em:text-gray-300
      prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5
      prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5
      prose-li:my-1 prose-li:leading-relaxed
      prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
      prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
      prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
    `,
    compact: `
      prose-p:my-1 prose-p:leading-snug
      prose-strong:font-bold prose-strong:text-white
      prose-em:italic
      prose-ul:my-1 prose-ul:list-disc prose-ul:pl-4
      prose-ol:my-1 prose-ol:list-decimal prose-ol:pl-4
      prose-li:my-0.5 prose-li:leading-snug
      prose-headings:font-bold prose-headings:mt-2 prose-headings:mb-1
      prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
    `,
    inverted: `
      prose-invert
      prose-p:my-2 prose-p:leading-relaxed
      prose-strong:font-bold prose-strong:text-white
      prose-em:italic prose-em:text-gray-200
      prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5
      prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5
      prose-li:my-1 prose-li:leading-relaxed
      prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
      prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline
    `,
  }

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  // Custom components wrapper to apply className
  const components: Components = {
    // Wrap entire content in a div with the className
    p: ({ children }) => <p className="prose-p">{children}</p>,
    strong: ({ children }) => <strong className="prose-strong">{children}</strong>,
    em: ({ children }) => <em className="prose-em">{children}</em>,
    ul: ({ children }) => <ul className="prose-ul">{children}</ul>,
    ol: ({ children }) => <ol className="prose-ol">{children}</ol>,
    li: ({ children }) => <li className="prose-li">{children}</li>,
    h1: ({ children }) => <h1 className="prose-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="prose-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="prose-h3">{children}</h3>,
    a: ({ children, href }) => (
      <a href={href} className="prose-a" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    code: ({ children }) => <code className="prose-code">{children}</code>,
  }

  return (
    <div className={combinedClasses}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
