import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/blog/Callout'
import { ComparisonTable } from '@/components/blog/ComparisonTable'
import { KeyTakeaways } from '@/components/blog/KeyTakeaways'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { CtaBlock } from '@/components/blog/CtaBlock'
import { Citations } from '@/components/blog/Citations'
import { BlogFaq } from '@/components/blog/BlogFaq'

// Custom components available inside every MDX article. Prose styling for native
// elements (h2/p/a/...) is applied by the <BlogContent> wrapper, not here.
export function useMDXComponents(): MDXComponents {
  return {
    Callout,
    ComparisonTable,
    KeyTakeaways,
    TableOfContents,
    CtaBlock,
    Citations,
    BlogFaq,
  }
}
