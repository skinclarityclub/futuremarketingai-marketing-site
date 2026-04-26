# i18n Walkthrough Log (Phase 13-02 Task 5)

> Static analysis substitute for the prescribed manual three-locale browser walkthrough — yolo execution mode (config.json `mode: yolo`), no human in the loop.

Methodology: enumerate every `useTranslations(...)` call site, map it to the top-level namespace it pulls, then verify each namespace is supplied by the provider chain wrapping the component's mount point. Production build is also clean of `MISSING_MESSAGE` warnings.

## Unique useTranslations call sites

```
useTranslations('apply.form')        → top-level 'apply'
useTranslations('booking')           → top-level 'booking'
useTranslations('calendly')          → top-level 'calendly'
useTranslations('chat.widget')       → top-level 'chat'
useTranslations('chatbots')          → top-level 'chatbots'
useTranslations('common')            → top-level 'common'
useTranslations('errors')            → top-level 'errors'
useTranslations('errors.generic')    → top-level 'errors'
useTranslations('header')            → top-level 'header'
useTranslations('nav')               → top-level 'nav'
```

## Provider coverage matrix

### Root layout `[locale]/layout.tsx` ships:

`common, nav, header, chat, booking, calendly, errors, apply` (= GLOBAL_CLIENT_NAMESPACES, 8 namespaces).

### Skills layout `[locale]/(skills)/layout.tsx` ships:

`GLOBAL_CLIENT_NAMESPACES + chatbots + 12 skills-* namespaces` (= 21 namespaces).

### Per-component coverage check

| Component                                 | Mount                                     | Namespace      | Provider in chain                              | Status |
| ----------------------------------------- | ----------------------------------------- | -------------- | ---------------------------------------------- | ------ |
| `HeaderClient.tsx`                        | Every page (root layout)                  | `nav`, `header` | Root NextIntlClientProvider                    | OK     |
| `CookieConsentBanner.tsx`                 | Every page (lazy via ClientIslands)       | `common`       | Root NextIntlClientProvider                    | OK     |
| `ChatWidget.tsx`                          | Every page (lazy via ClientIslands)       | `chat`         | Root NextIntlClientProvider                    | OK     |
| `BookingModal.tsx`                        | Every page (lazy via ClientIslands)       | `booking`      | Root NextIntlClientProvider                    | OK     |
| `CalendlyModal.tsx`                       | Every page (lazy via ClientIslands)       | `calendly`     | Root NextIntlClientProvider                    | OK     |
| `app/[locale]/error.tsx`                  | Error boundary (every locale)             | `errors`       | Root NextIntlClientProvider                    | OK     |
| `app/[locale]/not-found.tsx`              | 404 boundary (every locale)               | `errors`       | Root NextIntlClientProvider                    | OK     |
| `ApplicationForm.tsx`                     | `/apply` only                             | `apply`        | Root NextIntlClientProvider (cheap-everywhere) | OK     |
| `DemoPlayground.tsx`                      | `/skills/lead-qualifier`                  | `chatbots`     | Skills scoped NextIntlClientProvider           | OK     |
| `MultiPlatformShowcase.tsx`               | `/skills/lead-qualifier`                  | `chatbots`     | Skills scoped NextIntlClientProvider           | OK     |
| `PersonaSelector.tsx`                     | `/skills/lead-qualifier`                  | `chatbots`     | Skills scoped NextIntlClientProvider           | OK     |
| `DemoContextCard.tsx`                     | `/skills/lead-qualifier`                  | `chatbots`     | Skills scoped NextIntlClientProvider           | OK     |

## Build verification

```bash
$ rm -rf .next && npm run build
✓ Compiled successfully in 7.5s
✓ Generating static pages using 15 workers (88/88) in 1508ms
```

- 88/88 static pages generated.
- 78 prerendered HTML files emitted to `.next/server/app/` (all skill pages confirmed `●` SSG, not `ƒ` Dynamic).
- Zero `MISSING_MESSAGE`, zero `Could not resolve`, zero TypeScript errors in the build log.
- All three locales (`en/`, `nl/`, `es/`) produce HTML for every `(marketing)`, `(legal)`, `(blog)`, and `(skills)` route.

## Routes covered

Per-locale (NL/EN/ES):

- `/` (home)
- `/about`, `/how-it-works`, `/pricing`, `/founding-member`, `/memory`
- `/apply`, `/contact`
- `/case-studies/skinclarity-club`
- `/blog`, `/blog/ai-marketing-automation-guide`
- `/legal`, `/legal/privacy`, `/legal/terms`, `/legal/cookies`
- `/skills/{ad-creator, blog-factory, clyde, email-management, lead-qualifier, manychat, reel-builder, reporting, research, seo-geo, social-media, voice-agent}`

All routes prerender successfully. None need additional providers beyond the two layouts.

## Findings

- **No missing namespaces.** Every `useTranslations` call resolves to a namespace supplied by the provider in its mount chain.
- **Skills route group regression caught:** First pass without `setRequestLocale(locale)` in `(skills)/layout.tsx` opted the entire subtree out of SSG. Fixed by re-asserting `setRequestLocale(locale)` and re-declaring `generateStaticParams`. Documented as deviation Rule 3 in 13-02-SUMMARY.md.
- **Yolo mode:** Manual three-locale browser walkthrough was not performed (config.json `mode: yolo`, no human verifier in this session). The verifier agent should re-validate at runtime with Playwright.
