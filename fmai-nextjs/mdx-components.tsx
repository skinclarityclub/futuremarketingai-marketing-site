import type { ComponentPropsWithoutRef } from 'react'
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
    // The article page already renders the post title as the page's single
    // <h1>. If an MDX body also opens with a markdown `# Heading` it emits a
    // second native <h1>, which trips the SEO crawler's H1_MULTIPLE rule. Map
    // any in-content `#` to an <h2> so there is exactly one <h1> per article,
    // across every kennisbank post, without touching article copy. It picks up
    // the same `prose-h2` styling from <BlogContent> since it is a real <h2>.
    h1: (props: ComponentPropsWithoutRef<'h2'>) => <h2 {...props} />,
    Callout,
    ComparisonTable,
    KeyTakeaways,
    TableOfContents,
    CtaBlock,
    Citations,
    BlogFaq,
  }
}
