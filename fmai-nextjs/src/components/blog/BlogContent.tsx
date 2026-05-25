interface BlogContentProps {
  children: React.ReactNode
}

export function BlogContent({ children }: BlogContentProps) {
  return (
    <article
      className="prose prose-invert max-w-none
        prose-headings:font-display
        prose-headings:tracking-tight
        prose-headings:text-text-primary
        prose-h2:mt-12
        prose-p:text-text-secondary
        prose-p:leading-relaxed
        prose-a:text-accent-system
        prose-a:no-underline
        hover:prose-a:underline
        prose-strong:text-text-primary
        prose-code:rounded
        prose-code:bg-bg-elevated
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:text-accent-system
        prose-code:before:content-none
        prose-code:after:content-none
        prose-pre:rounded-xl
        prose-pre:border
        prose-pre:border-border-primary
        prose-pre:bg-bg-deep
        prose-blockquote:border-accent-system
        prose-blockquote:text-text-secondary
        prose-li:text-text-secondary
        prose-hr:border-border-primary"
    >
      {children}
    </article>
  )
}
