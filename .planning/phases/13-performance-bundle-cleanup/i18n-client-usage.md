# i18n Client Usage Audit (Phase 13-02 Task 1)

> Authoritative list of which top-level message namespaces are pulled by client code (`'use client'` + `useTranslations`). This is the contract for the `pick()` argument in Tasks 3-4.

Generated: 2026-04-27. Source command equivalent:

```bash
grep -rn "useTranslations(" fmai-nextjs/src --include="*.tsx" --include="*.ts"
```

## Methodology

For each `useTranslations('<namespace>.<sub>')` call, the top-level key is what `pick()` ships. For example `useTranslations('chat.widget')` requires the entire `chat` top-level key in the client provider. `useTranslations('apply.form')` requires the `apply` top-level key.

Cross-referenced each call site against:

- **Mount point** — is the component mounted globally (root layout / Header / Footer / ClientIslands), inside a route group, or inside a single page?
- **Server vs client** — components without `'use client'` calling `getTranslations()` need NO client provider entry.

## Global (mounted on every page via `[locale]/layout.tsx`)

These namespaces MUST be in `GLOBAL_CLIENT_NAMESPACES` because the components are rendered on every route in the locale layout subtree.

| Namespace   | Reason                                                                            |
| ----------- | --------------------------------------------------------------------------------- |
| `common`    | `CookieConsentBanner` (`useTranslations('common')`) inside locale layout          |
| `nav`       | `HeaderClient.tsx` line 98 (`useTranslations('nav')`) — Header is on every page   |
| `header`    | `HeaderClient.tsx` line 100 (`useTranslations('header')`) — mega-menu copy        |
| `chat`      | `ChatWidget.tsx` (`useTranslations('chat.widget')`) lazy-loaded via ClientIslands |
| `booking`   | `BookingModal.tsx` (`useTranslations('booking')`) lazy-loaded via ClientIslands   |
| `calendly`  | `CalendlyModal.tsx` (`useTranslations('calendly')`) lazy-loaded via ClientIslands |
| `errors`    | `error.tsx` + `not-found.tsx` (`useTranslations('errors[.generic]')`)             |

NOTE: `cookie_consent` is referenced in the plan but NOT a real top-level namespace — `CookieConsentBanner` actually uses `common` (verified: `src/components/interactive/CookieConsentBanner.tsx:15` calls `useTranslations('common')`). So we use `common`, not `cookie_consent`.

NOTE: ClientIslands lazy-loads ChatWidget/BookingModal/CalendlyIsland with `dynamic({ ssr: false })`. They mount on the client AFTER hydration but inside the locale layout's `NextIntlClientProvider` subtree — so their namespaces must be in the root pick list.

## Route group: `(skills)`

After full grep, **no client component under `src/components/skills/`** and **no `(skills)/skills/*/page.tsx`** has a `'use client'` directive or calls `useTranslations`. Specifically:

- `SkillPageTemplate.tsx` is a server component — uses `getTranslations({ locale, namespace })` from `next-intl/server`.
- All 12 skill `page.tsx` files (`ad-creator`, `blog-factory`, `clyde`, `email-management`, `lead-qualifier`, `manychat`, `reel-builder`, `reporting`, `research`, `seo-geo`, `social-media`, `voice-agent`) are server components.
- `VoiceDemoSection` mounted inside `voice-agent/page.tsx` does not call `useTranslations` (passes literal strings or props).

**Special case — `lead-qualifier`**: page imports `DemoPlayground`, `MultiPlatformShowcase`, `PersonaSelector`, `DemoContextCard` — all of which call `useTranslations('chatbots')`. So the **`chatbots`** namespace must be supplied to the client subtree of `/skills/lead-qualifier`. Since DemoPlayground is heavy and is the only client island that needs `chatbots`, the cleanest solution is to add `chatbots` to the `(skills)` group provider rather than per-page provider.

**Conclusion for skills layout:** Wrap `(skills)` route group in a scoped `NextIntlClientProvider` with the union of:

- `chatbots` (DemoPlayground subtree on lead-qualifier)
- All `skills-*` namespaces (none consumed client-side today, but cheap insurance against future client widgets and the runtime filter is automatic)

Because nested `NextIntlClientProvider` REPLACES the parent subset for its subtree, the scoped provider must also re-include the global names (`common`, `nav`, `header`, `chat`, `booking`, `calendly`, `errors`) so layout components rendered inside the skills subtree continue to find them. This is implemented as `[...GLOBAL_CLIENT_NAMESPACES, ...skillsNamespaces]`.

## Per-page scoped (NOT done in this plan — accepted risk)

These pages mount one client form each but are single-route. Adding a route-level provider is more code than just including the namespace globally for the affected pages.

| Namespace | Component                          | Mount route                  |
| --------- | ---------------------------------- | ---------------------------- |
| `apply`   | `ApplicationForm.tsx`              | `/[locale]/(marketing)/apply` |
| `contact` | `ContactForm.tsx` (props-only — no `useTranslations` direct, only labels via t() at page-level passed as props) | `/[locale]/(marketing)/contact` |

Because `ContactForm` does NOT call `useTranslations` directly (verified — Phase 11-03 design lifted the strings to page level and pipes them as props), the `contact` namespace is NOT needed in any client provider.

`ApplicationForm` DOES call `useTranslations('apply.form')`. Two options:

1. Add `apply` to `GLOBAL_CLIENT_NAMESPACES` (1 page penalty: every other page ships ~4-5 KB of unused apply translations).
2. Add `apply` to a `(marketing)/apply/layout.tsx` scoped provider.

Picked option 1 for now — `apply` translations are small (`messages/nl.json` shows < 5 KB), simpler than per-page layout. Documented as deviation Rule 3 since not in the original "global" list.

## Server-only (NOT in any client provider)

These namespaces are only consumed by server components calling `getTranslations()`. They MUST NOT be added to `pick()`. Not adding them is the entire point of this plan.

- `home` (page.tsx server)
- `pricing` (server pages, including `pricing.matrix`, `pricing.tiers` consumed by `SkillPageTemplate` server)
- `about` (server)
- `how-it-works` (server)
- `founding-member` (server)
- `memory` (server)
- `case_studies` (server)
- `case-studies` (n/a — actual key is `case_studies`)
- `blog` (server)
- `legal` (server pages)
- `landing` (server, used by Footer)
- `a11y` (server, root layout `getTranslations({namespace: 'a11y'})` for skipToContent)
- `chatbot` (singular, server-only; `chatbots` plural is client)
- `skills-*` (12 server-only namespaces — all skill pages render server-side via SkillPageTemplate)

## Final pick lists

```ts
// src/lib/i18n-namespaces.ts (or inline in layout)
export const GLOBAL_CLIENT_NAMESPACES = [
  'common',
  'nav',
  'header',
  'chat',
  'booking',
  'calendly',
  'errors',
  'apply', // ApplicationForm uses useTranslations('apply.form'); cheaper to ship globally than to add scoped provider for one route
] as const

// (skills) layout adds these on top of GLOBAL_CLIENT_NAMESPACES:
//   - 'chatbots' (DemoPlayground et al on lead-qualifier)
//   - all top-level keys starting with 'skills-' (computed at runtime)
```

## Sanity check vs message file

Top-level keys present in `messages/nl.json`:

```
a11y, about, apply, blog, booking, calendly, case_studies, chat, chatbot, chatbots,
common, contact, errors, founding-member, header, home, how-it-works, landing,
legal, memory, nav, pricing,
skills-ad-creator, skills-blog-factory, skills-clyde, skills-email-management,
skills-lead-qualifier, skills-manychat, skills-reel-builder, skills-reporting,
skills-research, skills-seo-geo, skills-social-media, skills-voice-agent
```

Total top-level keys: 34. Of those:

- **8 client-global** ship in root provider: `common, nav, header, chat, booking, calendly, errors, apply`
- **13 skills-scoped** ship only on `(skills)` routes: `chatbots` + 12 `skills-*`
- **13 server-only** never ship to client: `a11y, about, blog, case_studies, chatbot, contact, founding-member, home, how-it-works, landing, legal, memory, pricing`

Expected payload reduction per non-skills page: drop 13 server-only namespaces × ~3-15 KB each ≈ 50-100 KB raw / ~10-25 KB gz off the RSC hydration payload.
