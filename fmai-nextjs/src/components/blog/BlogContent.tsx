interface BlogContentProps {
  children: React.ReactNode
}

export function BlogContent({ children }: BlogContentProps) {
  return (
    <article
      className="prose prose-invert max-w-none
        prose-headings:text-text-primary
        prose-p:text-text-secondary
        prose-a:text-accent-system
        prose-strong:text-text-primary
        prose-code:text-accent-system
        prose-blockquote:border-accent-system
        prose-li:text-text-secondary
        prose-hr:border-border-primary"
    >
      {children}
    </article>
  )
}
