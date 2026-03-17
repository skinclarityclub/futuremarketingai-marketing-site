# Research: Blog Content Review & Approval UI in Next.js

> Research date: 2026-03-17
> Stack context: Next.js 16, Radix UI + shadcn/ui, Tailwind CSS 4, Supabase, Drizzle ORM, TanStack React Query, Server Actions, dark theme

---

## 1. MDX Preview Rendering in React

### Library Comparison

| Library                  | Approach           | Bundle Size         | Import Support         | RSC Support      | Status                    |
| ------------------------ | ------------------ | ------------------- | ---------------------- | ---------------- | ------------------------- |
| `next-mdx-remote`        | Compiler only      | Small output        | No imports in MDX      | Partial          | Poorly maintained (2025+) |
| `next-mdx-remote-client` | Compiler (fork)    | Small output        | Supports import/export | Full App Router  | Actively maintained       |
| `mdx-bundler`            | Compiler + bundler | 400%+ larger output | Full import resolution | No (client-only) | Stable                    |
| `@mdx-js/mdx` (direct)   | Low-level compiler | Minimal             | Manual                 | Full             | Official package          |

### Recommendation: `next-mdx-remote-client`

Best fit for a dashboard preview panel:

- Fork of `next-mdx-remote` with MDX v3 support
- Provides `MDXRemote` as a React Server Component for server-side rendering
- Separate exports for App Router and Pages Router (fully isolated)
- Supports import/export statements in MDX source (can be disabled)
- Smaller output than `mdx-bundler` for equivalent content

### Real-time Preview Pattern

```tsx
// Client component with debounced MDX compilation
'use client'
import { useState, useDeferredValue } from 'react'
import { evaluate } from '@mdx-js/mdx'

function MDXPreview({ source }: { source: string }) {
  const deferredSource = useDeferredValue(source)
  // Compile MDX on-the-fly with evaluate()
  // Use error boundary to catch compilation errors gracefully
}
```

For real-time preview without full page reload:

- Use `@mdx-js/mdx`'s `evaluate()` function client-side for instant preview
- Debounce input (300-500ms) to avoid recompiling on every keystroke
- Wrap preview in React Error Boundary to handle MDX syntax errors
- Use `useDeferredValue` to keep the editor responsive during compilation

### Recommended Remark/Rehype Plugins

| Plugin                                     | Purpose                                                              |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `rehype-pretty-code`                       | Syntax highlighting powered by Shiki (build-time, no runtime JS)     |
| `remark-gfm`                               | GitHub Flavored Markdown (tables, strikethrough, task lists)         |
| `rehype-slug` + `rehype-autolink-headings` | Anchor links for headings                                            |
| `rehype-toc` / `remark-toc`                | Auto-generate table of contents from headings                        |
| `rehype-mdx-import-media`                  | Convert image paths to static imports for Next.js Image optimization |
| `remark-math` + `rehype-katex`             | Math formula rendering (if needed)                                   |
| `rehype-external-links`                    | Add `target="_blank"` and `rel="noopener"` to external links         |

---

## 2. Rich Text / Markdown Editors for Next.js

### Editor Comparison

| Editor                   | Foundation      | Bundle Size    | MDX Components     | shadcn/ui Integration                | Best For              |
| ------------------------ | --------------- | -------------- | ------------------ | ------------------------------------ | --------------------- |
| **TipTap**               | ProseMirror     | ~150KB         | Via custom nodes   | Excellent (multiple shadcn wrappers) | WYSIWYG with toolbar  |
| **MDXEditor**            | Lexical         | ~851KB gzipped | Native MDX support | Manual styling needed                | Direct MDX editing    |
| **CodeMirror 6**         | Custom          | ~150KB         | Syntax only        | Manual                               | Code-first editing    |
| **Monaco Editor**        | VS Code engine  | ~2MB+          | Syntax only        | Manual                               | Full IDE experience   |
| **Milkdown**             | ProseMirror     | ~200KB         | Via plugins        | Manual, requires heavy customization | Plugin-driven WYSIWYG |
| **@uiw/react-md-editor** | Native textarea | ~4.6KB gzipped | No                 | Manual                               | Lightweight markdown  |
| **Plate**                | Slate.js        | ~200KB         | Via plugins        | Built for shadcn                     | shadcn-native editing |

### Recommendation: TipTap + shadcn/ui

TipTap is the strongest choice for this stack:

1. **Headless architecture** -- full control over UI, pairs naturally with shadcn/ui and Radix primitives
2. **shadcn/ui wrappers already exist**: `minimal-tiptap`, `shadcn-tiptap-editor`, `reactjs-tiptap-editor` -- all production-ready
3. **Features out of the box**: Markdown input/output, code blocks, tables, mentions, comments, image handling
4. **Static Renderer** can render TipTap JSON as React components without an editor instance (useful for preview)
5. **Custom node extensions** allow embedding React components (e.g., callout boxes, product embeds)

**Split-pane pattern**: TipTap editor on the left, MDX preview (via `next-mdx-remote-client`) on the right. TipTap outputs Markdown, which feeds the MDX compiler for the preview.

### Alternative: MDXEditor for direct MDX editing

If users need to write raw MDX with JSX components inline, MDXEditor is purpose-built for this. Trade-off is the 851KB bundle and less integration with shadcn/ui.

---

## 3. SERP Preview Components

### Google Search Result Specifications (2026)

| Element                        | Font                 | Pixel Width Limit | Character Estimate | Notes                              |
| ------------------------------ | -------------------- | ----------------- | ------------------ | ---------------------------------- |
| **Title**                      | 20px Arial (desktop) | 600px             | ~55-60 characters  | Truncated with ellipsis via CSS    |
| **URL / Breadcrumb**           | 14px Arial           | 600px             | ~70 characters     | Shows domain > path as breadcrumbs |
| **Meta Description** (desktop) | 14px Arial           | 920px             | ~158 characters    | Truncated at word boundaries       |
| **Meta Description** (mobile)  | 14px Arial           | 680px             | ~120 characters    | Shorter on mobile                  |

### Existing React Libraries

| Library              | npm         | Features                                                       |
| -------------------- | ----------- | -------------------------------------------------------------- |
| `react-serp-preview` | v1.1.0      | Pixel-based title truncation (600px default)                   |
| `serp-preview`       | Active      | Google, Bing, Yahoo, Google Mobile previews; styled-components |
| `meta-preview`       | Lightweight | Basic Google preview with title, description, URL              |

### Build-Your-Own Approach (Recommended)

Existing libraries are outdated (4+ years old). Better to build a custom component:

```tsx
// Use Canvas API for pixel-accurate width measurement
function measureTextWidth(text: string, font: string): number {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.font = font
  return ctx.measureText(text).width
}

// Truncate to pixel width, not character count
function truncateToPixelWidth(text: string, font: string, maxWidth: number): string {
  let truncated = text
  while (measureTextWidth(truncated + '...', font) > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, truncated.lastIndexOf(' '))
  }
  return truncated.length < text.length ? truncated + '...' : text
}
```

**Key implementation details**:

- Use Google's actual fonts: 20px Arial for titles, 14px Arial for descriptions
- Measure with Canvas API for pixel-accurate truncation (not character count)
- Show desktop and mobile previews side by side (use tabs or toggle)
- Real-time character/pixel counter with color-coded feedback:
  - Green: within limits
  - Yellow: approaching limit (90%+)
  - Red: exceeds limit
- Show truncated preview live as user types

### Component Structure

```
<SerpPreview>
  <SerpPreviewToggle mode="desktop" | "mobile" />
  <SerpTitle value={title} maxPixels={600} />
  <SerpUrl value={url} />
  <SerpDescription value={description} maxPixels={920 | 680} />
  <SerpCharacterCounter current={length} max={limit} />
</SerpPreview>
```

---

## 4. Content Scoring Visualizations

### shadcn/ui + Recharts (Recommended Stack)

shadcn/ui has built-in chart components powered by Recharts that you can copy-paste directly. This is the natural fit for the existing stack.

### Visualization Patterns by Score Type

| Score Type                                                 | Best Visualization            | Why                             |
| ---------------------------------------------------------- | ----------------------------- | ------------------------------- |
| **Overall quality score**                                  | Circular progress / gauge     | Single number, instant glance   |
| **Multi-dimensional scores** (SEO, readability, structure) | Radar chart                   | Shows balance across dimensions |
| **Individual metrics** (keyword density, word count)       | Progress bars with thresholds | Easy comparison against target  |
| **Pass/fail checks** (has meta description, has images)    | Color-coded badges/chips      | Binary status at a glance       |
| **Score history over revisions**                           | Sparkline / area chart        | Trend over time                 |

### Radar Chart for Multi-Dimensional Quality

```tsx
import { RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'

const scoreData = [
  { metric: 'SEO', score: 85 },
  { metric: 'Readability', score: 72 },
  { metric: 'Structure', score: 90 },
  { metric: 'Keywords', score: 65 },
  { metric: 'Length', score: 80 },
  { metric: 'Originality', score: 95 },
]
```

### Color System for Scores

```
0-39   -> Red    (destructive)   -- Needs major work
40-69  -> Yellow (warning)       -- Needs improvement
70-84  -> Blue   (default)       -- Good
85-100 -> Green  (success)       -- Excellent
```

Map these to shadcn/ui badge variants and Tailwind color classes. In dark theme, use slightly brighter/more saturated versions for visibility.

### Recommended Component Layout

```
+---------------------------+------------------+
| Radar Chart               | Overall Score    |
| (SEO, Readability,        | (circular gauge) |
|  Structure, Keywords,     |                  |
|  Length, Originality)      | 82/100           |
+---------------------------+------------------+
| Individual Metric Bars                        |
| SEO Score        [=========----] 85/100       |
| Readability      [=======------] 72/100       |
| Keyword Density  [=====-] 2.3% (target: 1-3%)|
| Word Count       [========-----] 1,247 words  |
+-----------------------------------------------+
| Pass/Fail Checks                              |
| [x] Meta title    [x] Meta desc   [ ] Alt txt |
| [x] Internal links [x] H2 headings            |
+-----------------------------------------------+
```

---

## 5. Approval Workflow UI Patterns

### Core UX Principles

1. **Undo over confirmation** -- Instead of "Are you sure?" dialogs, perform the action immediately and show an undo toast. Reduces anxiety and feels faster. Reserve confirmation dialogs for truly destructive/irreversible actions.

2. **Contextual actions** -- Show approve/reject buttons in context (on the review card, in the preview panel), not buried in menus.

3. **Progressive disclosure** -- Show simple approve/reject first; reveal "reject with feedback" or "request changes" on interaction.

### Recommended Flow

```
Draft -> In Review -> [Approve] -> Scheduled/Published
                   -> [Request Changes] -> Draft (with feedback)
                   -> [Reject] -> Rejected (with reason)
```

### Implementation Patterns

**Approval Actions Component**:

```tsx
<ReviewActions>
  <Button variant="default" onClick={approve}>
    Approve
  </Button>
  <Button variant="outline" onClick={requestChanges}>
    Request Changes
  </Button>
  <Button variant="destructive" onClick={reject}>
    Reject
  </Button>
</ReviewActions>
```

**Feedback on rejection**: Use a `Dialog` (shadcn/ui AlertDialog) that opens when "Request Changes" or "Reject" is clicked. Include a textarea for feedback and optional category tags (SEO issues, tone, factual errors, etc.).

**Bulk operations**:

- Checkbox selection on review list items
- Floating action bar appears when items are selected: "Approve Selected (3)" / "Reject Selected (3)"
- Use optimistic updates via TanStack Query `useMutation` with `onMutate` for instant feedback

**Keyboard shortcuts** (implement with `useEffect` + `keydown`):
| Shortcut | Action |
|---|---|
| `A` | Approve current item |
| `R` | Reject / Request changes |
| `J` / `K` | Navigate between review items |
| `Cmd+Enter` | Submit feedback |
| `Cmd+Z` | Undo last action |
| `Space` | Toggle selection for bulk |

**Undo pattern**:

```tsx
// After approval action
const { undo } = useMutation({
  mutationFn: approvePost,
  onSuccess: () => {
    toast({
      title: 'Post approved',
      action: <ToastAction onClick={undoApproval}>Undo</ToastAction>,
      duration: 8000, // 8 seconds to undo
    })
  },
})
```

### Status Badge Design

| Status            | Badge Variant           | Icon          |
| ----------------- | ----------------------- | ------------- |
| Draft             | `secondary`             | PenLine       |
| In Review         | `outline` (blue border) | Eye           |
| Changes Requested | `warning`               | MessageCircle |
| Approved          | `default` (green)       | CheckCircle   |
| Rejected          | `destructive`           | XCircle       |
| Published         | `default`               | Globe         |

---

## 6. Side-by-Side Comparison Views

### React Diff Libraries

| Library                      | Features                                                     | Recommendation                         |
| ---------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| **`react-diff-viewer`**      | Split/inline view, word diff, line highlight, GitHub-style   | Best for text/markdown diff            |
| **`react-diff-view`**        | Token system for syntax highlighting, inline edits           | Best for code-heavy content            |
| **`@git-diff-view`**         | React/Vue/Solid support, GitHub UI, SSR, syntax highlighting | Most feature-rich, actively maintained |
| **Monaco Editor diffEditor** | Full IDE diff experience                                     | Overkill for blog content              |

### Recommendation: `react-diff-viewer` or `@git-diff-view`

For blog content comparison, `react-diff-viewer` is the simplest choice:

- Split view (side-by-side) and unified view (inline) toggle
- Word-level diff highlighting within changed lines
- Color coding: green for additions, red for deletions
- Line numbers for reference

### Implementation Pattern

```tsx
import ReactDiffViewer from 'react-diff-viewer'

;<ReactDiffViewer
  oldValue={previousVersion.content}
  newValue={currentVersion.content}
  splitView={true}
  useDarkTheme={true}
  showDiffOnly={false} // Show full document with changes highlighted
  leftTitle={`v${previousVersion.number} - ${previousVersion.date}`}
  rightTitle={`v${currentVersion.number} - ${currentVersion.date}`}
/>
```

### Version History UX

```
+-------------------------------------------+
| Version History                            |
| v3 (current) - Mar 17, 2026 - In Review   |
| v2           - Mar 15, 2026 - Changes Req. |
| v1           - Mar 14, 2026 - Draft        |
+-------------------------------------------+
| Compare: [v2] vs [v3 (current)]     [View] |
+-------------------------------------------+
| Left (v2)          | Right (v3)            |
| Old content with   | New content with      |
| [-deleted text-]   | [+added text+]        |
+-------------------------------------------+
```

**Key features to implement**:

- Version selector dropdowns to compare any two versions
- Metadata diff (title, description, tags changed)
- Statistics: lines added/removed, word count change
- Toggle between split view and inline view
- Collapse unchanged sections for long documents

---

## 7. Real-time Status Updates

### Architecture: Supabase Realtime + TanStack Query

The recommended pattern is to use TanStack Query as the primary data/cache layer, with Supabase Realtime triggering cache invalidation.

### Implementation

```tsx
// hooks/useRealtimeReviewStatus.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeReviewStatus(blogPostId?: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('blog-review-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_posts',
          filter: blogPostId ? `id=eq.${blogPostId}` : undefined,
        },
        (payload) => {
          // Invalidate specific queries based on change type
          queryClient.invalidateQueries({ queryKey: ['blog-posts'] })

          if (payload.new?.id) {
            queryClient.invalidateQueries({
              queryKey: ['blog-post', payload.new.id],
            })
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          // Reconnect and reload data on error
          queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [blogPostId, queryClient, supabase])
}
```

### Supabase Cache Helpers

The `@supabase-cache-helpers/postgrest-react-query` package automates this:

- Parses Supabase queries into deterministic TanStack Query keys
- Auto-populates cache on mutations using schema knowledge
- Single line of code for fetch + subscribe + mutate with cache sync

### Error Handling and Reliability

Critical considerations:

- **Monitor subscription status** -- handle `CHANNEL_ERROR` and `TIMED_OUT` by reloading data and resubscribing
- **Reconnection logic** -- on reconnect, invalidate all relevant queries to catch any missed events
- **Optimistic updates** for user-initiated changes (approve/reject) -- don't wait for Realtime round-trip
- **Use Realtime for multi-user awareness** (e.g., "Sarah is reviewing this post") and cross-tab sync
- **Use TanStack Query mutations** for the user's own actions with `onMutate` optimistic updates

### When to Use Each

| Scenario                        | Approach                                        |
| ------------------------------- | ----------------------------------------------- |
| User approves a post            | TanStack `useMutation` with optimistic update   |
| Another reviewer changes status | Supabase Realtime triggers `invalidateQueries`  |
| Initial page load               | TanStack `useQuery` with Server Action prefetch |
| Presence ("who's reviewing")    | Supabase Realtime Presence channel              |

---

## 8. Dark Theme Blog Preview

### Problem

The dashboard uses a dark theme, but the blog will render on a light-themed public website. Reviewers need to see how the content will actually look.

### Approach Comparison

| Approach                          | Isolation Level         | Complexity | Performance                          | Recommendation             |
| --------------------------------- | ----------------------- | ---------- | ------------------------------------ | -------------------------- |
| **iframe**                        | Complete CSS isolation  | Medium     | Slightly heavier (separate document) | Best for accurate preview  |
| **CSS scoping with `data-theme`** | Partial (risk of leaks) | Low        | Best                                 | Good for simple content    |
| **Shadow DOM**                    | Strong isolation        | High       | Good                                 | Overkill for this use case |
| **CSS `all: revert` wrapper**     | Moderate                | Low        | Best                                 | Quick solution, imperfect  |

### Recommendation: iframe for Accurate Preview

An iframe creates a completely separate document context with its own stylesheets, preventing any CSS from the dark dashboard from affecting the preview.

```tsx
// components/BlogPreview.tsx
'use client'
import { useRef, useEffect, useState } from 'react'

function BlogPreview({ htmlContent, cssHref }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(600)

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return

    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html data-theme="light">
      <head>
        <link rel="stylesheet" href="${cssHref}" />
        <style>
          body {
            margin: 0; padding: 24px;
            font-family: 'Inter', sans-serif;
            background: white; color: #1a1a1a;
          }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `)
    doc.close()

    // Auto-resize iframe to content height
    const observer = new ResizeObserver(() => {
      setHeight(doc.body.scrollHeight + 48)
    })
    observer.observe(doc.body)
    return () => observer.disconnect()
  }, [htmlContent, cssHref])

  return (
    <iframe
      ref={iframeRef}
      className="w-full rounded-lg border"
      style={{ height }}
      sandbox="allow-same-origin"
      title="Blog preview"
    />
  )
}
```

### Alternative: CSS Scoping with `data-theme`

For a lighter approach (when exact pixel-perfect preview isn't critical):

```tsx
<div data-theme="light" className="blog-preview-scope">
  {/* Override CSS variables for light theme */}
  <style>{`
    [data-theme="light"].blog-preview-scope {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      /* ... all shadcn light theme variables */
    }
  `}</style>
  <article className="prose prose-lg">{renderedMDXContent}</article>
</div>
```

### Toggle Between Preview Modes

Offer reviewers the option to toggle:

- **Light preview** (how it looks on the website) -- default
- **Dark preview** (adapted to dashboard theme) -- for comfortable reading during review
- **Mobile preview** (narrow width iframe) -- responsive check

---

## Summary: Recommended Architecture

```
+------------------------------------------------------------------+
|                    Blog Review Dashboard                          |
+------------------------------------------------------------------+
| [List View]          | [Detail View]                             |
|                      |                                           |
| Post 1 [In Review]  | Tab: Edit | Preview | SEO | Versions     |
| Post 2 [Draft]      |                                           |
| Post 3 [Approved]   | +------- Edit Tab -------+                |
|                      | | TipTap Editor          |                |
| [Bulk: Approve (2)] | | (shadcn/ui toolbar)    |                |
|                      | +------------------------+                |
|                      |                                           |
|                      | +------- Preview Tab ----+                |
|                      | | iframe (light theme)   |                |
|                      | | MDX rendered via        |                |
|                      | | next-mdx-remote-client |                |
|                      | +------------------------+                |
|                      |                                           |
|                      | +------- SEO Tab --------+                |
|                      | | SERP Preview           |                |
|                      | | (desktop + mobile)     |                |
|                      | | Score Radar Chart      |                |
|                      | | Metric Progress Bars   |                |
|                      | +------------------------+                |
|                      |                                           |
|                      | +------- Versions Tab ---+                |
|                      | | react-diff-viewer      |                |
|                      | | Side-by-side diff      |                |
|                      | +------------------------+                |
|                      |                                           |
|                      | [Request Changes] [Approve] [Reject]      |
+------------------------------------------------------------------+
```

### Key Package Decisions

| Concern               | Package                                         | Rationale                                                         |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| MDX preview rendering | `next-mdx-remote-client`                        | RSC support, small output, maintained fork                        |
| Editor                | TipTap + `minimal-tiptap`                       | Headless, shadcn-native, Markdown output                          |
| SERP preview          | Custom component                                | Existing libraries outdated; use Canvas API for pixel measurement |
| Charts/scores         | shadcn/ui Charts (Recharts)                     | Already in the stack, copy-paste components                       |
| Diff view             | `react-diff-viewer`                             | Simple, split/inline, dark theme support                          |
| Realtime              | Supabase Realtime + TanStack Query invalidation | Best of both: caching + live updates                              |
| Dark/light preview    | iframe isolation                                | Complete CSS isolation, accurate preview                          |

### Key Rehype/Remark Plugins

`rehype-pretty-code`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-toc`, `rehype-mdx-import-media`, `rehype-external-links`

---

## Sources

- [Next.js MDX Guide](https://nextjs.org/docs/pages/guides/mdx)
- [next-mdx-remote-client](https://github.com/ipikuka/next-mdx-remote-client)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [mdx-bundler](https://github.com/kentcdodds/mdx-bundler)
- [MDX Getting Started](https://mdxjs.com/docs/getting-started/)
- [MDXEditor](https://mdxeditor.dev/)
- [5 Best Markdown Editors for React](https://strapi.io/blog/top-5-markdown-editors-for-react)
- [Best 6 Shadcn Tiptap Editors](https://shadcnstudio.com/blog/shadcn-tiptap-editors)
- [minimal-tiptap](https://github.com/Aslam97/minimal-tiptap)
- [reactjs-tiptap-editor](https://github.com/hunghg255/reactjs-tiptap-editor)
- [TipTap React Docs](https://tiptap.dev/docs/editor/getting-started/install/react)
- [TipTap Static Renderer](https://tiptap.dev/docs/editor/api/utilities/static-renderer)
- [Pixel-Accurate SERP Preview Tools](https://dev.to/frontendtoolstech/pixel-accurate-serp-preview-tools-for-google-url-metadata-combined-57aa)
- [Meta Length Checker 2026](https://mrs.digital/tools/meta-length-checker/)
- [react-serp-preview (npm)](https://www.npmjs.com/package/react-serp-preview)
- [serp-preview (GitHub)](https://github.com/pedroparra/serp-preview)
- [Page Title & Meta Description Pixel Width - Screaming Frog](https://www.screamingfrog.co.uk/blog/page-title-meta-description-lengths-by-pixel-width/)
- [shadcn/ui Charts](https://ui.shadcn.com/charts/radar)
- [shadcn/ui Charts Overview](https://www.shadcn.io/charts)
- [8 Best React Chart Libraries 2025](https://embeddable.com/blog/react-chart-libraries)
- [Approval Workflow UI Patterns - Nicelydone](https://nicelydone.club/tags/approval-workflow)
- [Confirmation Dialogs UX - UX Planet](https://uxplanet.org/confirmation-dialogs-how-to-design-dialogues-without-irritation-7b4cf2599956)
- [Reusable Confirmation Dialog React/Next.js](https://medium.com/@hrupanjan/building-a-flexible-confirmation-dialog-system-in-react-or-next-js-with-typescript-1e57965b523b)
- [react-diff-viewer](https://github.com/praneshr/react-diff-viewer)
- [react-diff-view](https://github.com/otakustay/react-diff-view)
- [@git-diff-view](https://github.com/MrWangJustToDo/git-diff-view)
- [Supabase with TanStack Query](https://makerkit.dev/blog/saas/supabase-react-query)
- [React Query + Next.js + Supabase Cache Helpers](https://supabase.com/blog/react-query-nextjs-app-router-cache-helpers)
- [Next.js + TanStack Query + Supabase Guide](https://silvestri.co/blog/nextjs-tanstack-query-supabase-guide)
- [Supabase Realtime with Next.js](https://supabase.com/docs/guides/realtime/realtime-with-nextjs)
- [Rehype Pretty Code](https://rehype-pretty.pages.dev/)
- [MDX Plugins Guide - chris.lu](https://chris.lu/web_development/tutorials/next-js-static-first-mdx-starterkit/mdx-plugins)
- [Dark Mode Guide 2025](https://medium.com/design-bootcamp/the-ultimate-guide-to-implementing-dark-mode-in-2025-bbf2938d2526)
- [Rendering in iframe in React](https://dev.to/graftini/rendering-in-an-iframe-in-a-react-app-2boa)
