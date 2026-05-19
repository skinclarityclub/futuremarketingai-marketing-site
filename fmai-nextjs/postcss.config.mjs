/**
 * PostCSS pipeline.
 *
 * `discard-host-in-theme-layer`: strips the `:host` selector from rules
 * inside `@layer theme { ... }`. Tailwind 4 emits its default token block as
 * `@layer theme { :root, :host { ... } }`, a known WebKit/Safari pre-16.4
 * compatibility hotspot (Tailwind Discussions #15556 + #15284). The `:host`
 * pseudo is meaningful only inside a shadow-DOM context; the marketing
 * site has no shadow-DOM consumers, so dropping it is safe and prevents the
 * unforgiving-selector-list parse path from invalidating `:root` in older
 * Safari builds. Pairs with `@theme inline` in `src/app/globals.css`, which
 * handles the custom-token block.
 */
const discardHostInThemeLayer = () => ({
  postcssPlugin: 'discard-host-in-theme-layer',
  AtRule(atRule) {
    if (atRule.name === 'layer' && atRule.params.trim() === 'theme') {
      atRule.walkRules((rule) => {
        if (!rule.selector.includes(':host')) return
        const cleaned = rule.selector
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && s !== ':host')
          .join(', ')
        rule.selector = cleaned.length > 0 ? cleaned : ':root'
      })
    }
  },
})
discardHostInThemeLayer.postcss = true

const config = {
  plugins: [
    '@tailwindcss/postcss',
    discardHostInThemeLayer(),
  ],
}

export default config
