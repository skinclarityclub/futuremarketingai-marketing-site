---
audit: FutureMarketingAI marketing site — UX / WCAG 2.2 AA / Mobile
date: 2026-04-24
scope: fmai-nextjs (Next.js 16 App Router, next-intl, desktop-first dark theme)
method: static code read-through, keyboard flow trace, WCAG 2.2 mapping, contrast math
status: READ-ONLY — no code changes
---

# 07 · UX + Accessibility + Mobile — deep audit

## 0. Executive summary (5 bullets)

1. **No skip-to-content link anywhere.** A grep across `src/` for `skip-to-content|skip-link` returns zero hits. Keyboard users must Tab past every header nav item (logo, Skills dropdown trigger, Memory, Case Studies, Pricing, About, Login, Apply CTA, locale switcher, hamburger) on every page — a WCAG 2.4.1 Bypass Blocks violation and the biggest single a11y regression.
2. **`prefers-reduced-motion` is honoured by Framer Motion (`useReducedMotion`) but NOT by the bulk of CSS keyframe animations.** `src/app/globals.css:308` only pauses `blob-warm/cool/mixed`. The remaining ~12 keyframes (`float`, `glow-pulse`, `data-flow`, `status-pulse`, `orbit-particle-float`, `blobFloat1–3`, `heroGridGlow`, `chatDotBounce`, `spin`, `spotlight`, inline `fadeInUp` on hero at `src/app/[locale]/page.tsx:87/96/110/118/126`) keep running. Vestibular-sensitive users see motion anyway.
3. **Color contrast is mostly solid — except `text-text-muted` (#5a6378) at small sizes.** On the #0a0d14 background the muted grey ratio is 3.23:1 (AA-Large only). It is used 269+ times across 48 files, frequently at `text-xs` / `text-[10px]` / `text-[11px]` (~46 occurrences) — notably the Skills mega-menu descriptions, footer copyright, pricing captions, apply reassurance note, privacy sub-labels. These FAIL WCAG 1.4.3 for normal text.
4. **Form UX on `/apply` has no per-field error binding, no `aria-invalid`, no autocomplete tokens, single generic error message, no inline Zod feedback.** Submission returns a one-shot `role="alert"` banner (`ApplicationForm.tsx:233`) regardless of which of the 8 fields failed. Screen-reader users cannot tell which field broke. EAA (European Accessibility Act) high-risk.
5. **BookingModal focus trap is half-correct but brittle; desktop dropdown Skills menu has no keyboard operation at all.** Header's Skills menu opens on `onMouseEnter` only (`HeaderClient.tsx:211-213`); clicking the chevron button does nothing (there's no `onClick` state toggle, and `useEffect` at line 174 closes the dropdown on any document click). Keyboard users tabbing to the Skills button cannot open the panel with Enter / Space. The 880px mega-menu with 12 skill links is effectively invisible to keyboard users.

---

## 1. UX score per page

Scores reflect hierarchy, CTA clarity, consistency, cognitive load. 0 = unusable, 10 = best-in-class.

| Page | Score | Rationale |
|---|---|---|
| `/` (home) | 7.0 | Strong hero hierarchy + gradient accent. Too many CTAs: hero has 2, services block has 2 more, CTA block has 2, trust strip has 1 — prospect is offered `/apply`, `/skills/clyde`, `/founding-member`, `/case-studies/skinclarity-club` in rotation. Counter badge (`1/10 founding`) does not repeat visually near the final CTA. FAQ section is server-rendered as `<dl>` without disclosure — users read all answers at once. |
| `/pricing` | 6.5 | 5-tier horizontal grid is information-dense; on md screens it reflows to 2 columns making enterprise + founding hang below the fold. Hardcoded "Most popular" string at line 127 ignores i18n (`pricing.tsx:127`). Skills matrix table is great on desktop but requires horizontal scroll on mobile with no affordance indicator. |
| `/apply` | 6.0 | Two-column form+expectations layout is clean. Missing: progress affordance (8 fields, no step indicator), no inline validation, no live character counter on the 5000-char `problem` textarea, no save-draft. The reassurance note at `apply/page.tsx:93` uses `text-xs text-text-muted` (fails contrast). |
| `/skills/[slug]` (template) | 7.0 | Consistent 6-section rhythm (hero → features → how → integrations → useCases → allocation → cta). Allocation table uses `text-right` numeric column — good. But the hero has only a single CTA and no secondary path for "not ready yet" users. |
| `/case-studies/skinclarity-club` | 7.5 | Good narrative arc. Missing proof-at-source: Instagram usernames render as text with no link-out. |
| `/memory` | n/a — not read in full |
| `/about` | n/a — not read in full |
| `/how-it-works` | n/a — not read in full |
| `/contact` | 6.5 | Mixes Apply callout + ContactForm + Email/address block. Decision paralysis: user sees 3 competing paths. Submit button says literal "Sending..." (hardcoded, not translated — `ContactForm.tsx:189`). Success state copy hardcoded English (`ContactForm.tsx:85-94`). |
| `/founding-member` | n/a — not read in full |
| `/legal/{privacy,terms,cookies}` | 7.0 | Sub-nav pill-switcher is intuitive. Single-column max-w-3xl reads well. `whitespace-pre-wrap` on body text preserves intent but risks awkward wrap on mobile. No table-of-contents for long privacy page despite having 9 subsections — jumping to "Data retention" is Ctrl-F only. |
| `/404` | 5.5 | Uses stale `#00D4FF` cyan + hardcoded "Back home" label (`not-found.tsx:9`). Doesn't match site's teal `#00d4aa` theme — a visual dialect break. |
| `/500 (error)` | 4.5 | All copy hardcoded English (`error.tsx:13-22`), shows raw `error.message` to user (potential info leak), purple `#A855F7` not in design system. |

---

## 2. WCAG 2.2 AA audit — criteria × status × evidence × fix

Legend: PASS / FAIL / PARTIAL / N/A

### 2.1 Perceivable

| SC | Criterion | Status | Evidence | Fix |
|---|---|---|---|---|
| 1.1.1 | Non-text content | PARTIAL | Decorative Spline preview has `alt=""` (`splite.tsx:82`) — correct. Lucide icons mostly inside labelled buttons OR with `aria-hidden` (`HeaderClient.tsx:262`, `page.tsx:261`). Some SVGs in contact page (email, location, clock) at `contact/page.tsx:130-199` lack `aria-hidden` — redundant decorative icons will be announced twice. | Add `aria-hidden="true"` to all decorative inline SVGs in `contact/page.tsx`, `apply/page.tsx`, `case-studies/skinclarity-club/page.tsx`. |
| 1.3.1 | Info and relationships | PARTIAL | Good: `<nav aria-label="Skills|Company|Resources">` in Footer. Good: `<dl>/<dt>/<dd>` for FAQ. Bad: hero on home uses `id="hero"` on the `<h1>` itself (`page.tsx:94`) and the section uses `aria-labelledby="hero"` — works, but the ID "hero" is more about the section than the heading content. Pricing tiers grid is a `<div>` grid, not `<ul>`; each tier card has no `<h3>` hierarchy to its features `<ul>` (`pricing/page.tsx:168-191`). | Wrap pricing tier cards in `<ul role="list">` with `<li>`. Use `<h3>` inside each card (already done) — ensure h3 precedes ul. |
| 1.3.2 | Meaningful sequence | PASS | Flex/grid reflow produces logical DOM order in all pages inspected. | — |
| 1.3.5 | Identify input purpose | FAIL | No `autocomplete` tokens on ApplicationForm (`ApplicationForm.tsx`) except the honeypot. Missing on name (`autocomplete="name"`), email (`email`), organization (`organization`), role (`organization-title`). Also missing on ContactForm (`ContactForm.tsx:110-174`). | Add `autoComplete` prop to every input; email fields should also set `inputMode="email"`. |
| 1.4.3 | Contrast (Minimum) — normal text | FAIL | `text-text-muted` = `#5a6378` on bg `#0a0d14` → **3.23:1**. Used at `text-xs`/`text-sm` 46+ times (Header dropdown descriptions at `HeaderClient.tsx:247,276`, Skills dropdown "Book a partnership call" subtitle at line 302, footer copyright at `Footer.tsx:193`, apply reassurance at `apply/page.tsx:93`, pricing onboarding label at `pricing/page.tsx:153`). | Raise muted token to `#8C98AD` (6.67:1). Keep `#5a6378` only for `text-xs` **disabled** states or ≥18pt bold. |
| 1.4.4 | Resize text | PASS | `maximumScale: 5` set in viewport config (`layout.tsx:22`). Good. |
| 1.4.10 | Reflow | PARTIAL | SkillsTierMatrix (`SkillsTierMatrix.tsx:63`) uses `overflow-x-auto` on a 6-column table. On 360px viewport the matrix requires 2-axis scroll-into-parent. No sticky first column on mobile (`.sticky left-0` class exists but `bg-bg-deep/80` blurs over scrolling content — acceptable). No visual affordance that the table scrolls horizontally. | Add a shadow-gradient edge hint + `role="region" aria-label="Pricing comparison table" tabIndex={0}` on the wrapper to make it keyboard-focusable and announce scrollability. |
| 1.4.11 | Non-text contrast | PARTIAL | Input border `border-border-primary` = `rgba(255,255,255,0.06)` = #181a21 on #0a0d14 → **1.4:1** (FAIL). Focus border switches to `border-accent-system` (#00d4aa) → 10.18:1 PASS. But the *resting* state of an unfocused input has no perceptible outline — users cannot locate the 8 form fields without clicking. | Raise `--color-border-primary` to `rgba(255,255,255,0.12)` (2.8:1) or add an explicit `border-white/20` on all form inputs. |
| 1.4.12 | Text spacing | PASS — no CSS `!important` overrides on line-height/letter-spacing that would break user styles. | — |
| 1.4.13 | Content on hover or focus | FAIL | Skills mega-menu (`HeaderClient.tsx:210-313`) appears on `onMouseEnter` and disappears on `onMouseLeave`. No `aria-describedby` tether, no hover-persistence mechanism, no keyboard-trigger. User cannot tab INTO the menu (it's not keyboard-reachable at all — see 2.1.1). | Convert to a proper disclosure pattern: button's `aria-expanded` toggled by `onClick` state, menu opens on click, Esc closes, arrow keys navigate menuitems. |

### 2.2 Operable

| SC | Criterion | Status | Evidence | Fix |
|---|---|---|---|---|
| 2.1.1 | Keyboard | FAIL | (a) Skills mega-menu desktop: button fires no onClick (`HeaderClient.tsx:215-226`); only hover opens it. Keyboard users cannot access 12 skill pages from header. (b) FloatingLocaleSwitcher has a single `aria-label="Change language"` but the dropdown options close on `mousedown` only — listen to blur/focusout would cover keyboard. (c) VoiceDemoFAB (`VoiceDemoFAB.tsx:41-51`) is a `motion.button` focusable, good; `aria-label="Scroll to voice demo"` good. (d) CTAButton emits `<a>` when href provided (`CTAButton.tsx:54-63`) and `<button>` otherwise — good. | Add onClick to Skills button that toggles a `setSkillsOpen(s => !s)`; remove the global document-click handler that fights with it; add `onKeyDown` handlers for ArrowDown into the first `menuitem`. |
| 2.1.2 | No keyboard trap | PASS | BookingModal (`BookingModal.tsx:56-85`) implements a focus-trap but with a Tab-only handler — Shift-Tab reversal wraps correctly. But the trap queries include hidden/disabled elements and does not re-query when content changes (Calendly iframe mounts late); late-added focusable children inside the iframe can trap you outside the trap. Tolerable for now but flaky. | Use `focus-trap-react` library or re-query on MutationObserver. |
| 2.1.4 | Character key shortcuts | N/A | No single-character shortcuts. | — |
| 2.4.1 | Bypass blocks | FAIL | **No skip-to-content link.** Confirmed by grep across entire `src/`. Header has 12+ tabbable elements before `<main>`. | Add `<a href="#main" className="sr-only focus:not-sr-only ...">Skip to content</a>` as first child of `<body>` in `src/app/[locale]/layout.tsx`. Add `id="main"` to `PageShell.tsx:8`. |
| 2.4.2 | Page titled | PASS | `generatePageMetadata` sets per-route titles. |
| 2.4.3 | Focus order | PARTIAL | Natural DOM order is mostly sensible. But `FloatingLocaleSwitcher` is `position: fixed top-20 left-4` (`FloatingLocaleSwitcher.tsx:66`) — it is NOT the first element after header in tab order (it depends on DOM insertion order in `LocaleLayout`: Header → FloatingLocaleSwitcher → children → Footer). Tab order is Header → LocaleSwitcher → main content. Fine for usability, but visually floats left while tab-focus teleports there unexpectedly. |
| 2.4.4 | Link purpose (in context) | PARTIAL | Footer links have text labels — PASS. Home "read case study →" (page.tsx:385) uses `→` unicode — screen reader reads "right arrow" which is okay. |
| 2.4.7 | Focus visible | FAIL | Most interactive elements rely on browser default focus ring. Several use `focus:outline-none focus:border-accent-system` on inputs (`ApplicationForm.tsx:95`, `contact`) — the border shift is a 2px color change from rgba(255,255,255,0.06) to #00d4aa, which IS visible BUT removing `outline` without a replacement ring means Windows High Contrast users lose the focus indicator entirely. Buttons (CTAButton, Header Skills button, Footer links) have no explicit `focus-visible:ring`. Only `chatbot/FloatingButton.tsx:31` has a proper ring. | Add a global utility `*:focus-visible { outline: 2px solid var(--color-accent-system); outline-offset: 2px; }` in `globals.css`, or add `focus-visible:ring-2 focus-visible:ring-accent-system` to CTAButton base styles. |
| 2.4.11 | Focus not obscured (minimum) | PARTIAL | The fixed header at `top-0` is 64px tall (`h-16`). When tabbing into a page-body `<a>` near the top after scrolling back, the header may obscure the focus ring. No `scroll-padding-top` set. | Add `html { scroll-padding-top: 5rem; }` to `globals.css`. |
| 2.5.3 | Label in name | PASS | Visible labels on form fields match their `htmlFor` programmatic labels. |
| 2.5.5 | Target size (enhanced AAA / 2.2 minimum 24px) | PARTIAL | Mobile hamburger `p-2` + `w-5 h-5` icon → ~36px hit area (FAIL for 2.5.8 minimum 24×24 is PASS, but below the AAA 44×44 and below Apple HIG 44pt). FloatingButton (chatbot) is `h-14 w-14` = 56px (PASS). LocaleSwitcher `w-10 h-10` = 40px (PASS 2.5.8). Footer social icons `w-4 h-4` with no explicit padding (`Footer.tsx:231,240`) — hit area equals the 16px icon — FAIL 2.5.8 (24×24 minimum). | Wrap footer social icons in `<a className="p-2 -m-2">` to extend hit area. Ensure hamburger icon button is ≥44px (`p-3`). |

### 2.3 Understandable

| SC | Criterion | Status | Evidence | Fix |
|---|---|---|---|---|
| 3.1.1 | Language of page | PASS | `<html lang={locale}>` set in `layout.tsx:52`. Excellent. |
| 3.1.2 | Language of parts | N/A | No mixed-language content. |
| 3.2.1 | On focus | PASS | No context changes on focus. |
| 3.2.2 | On input | PASS | Select inputs don't auto-submit. |
| 3.3.1 | Error identification | FAIL | ApplicationForm shows a single `<p role="alert">` with a generic `t('errorValidation')` string (`ApplicationForm.tsx:233`). Individual field errors from Zod are not surfaced. ContactForm does show `fieldErrors.name[0]` etc. (`ContactForm.tsx:120,136,176`) — good — but the pattern is inconsistent between forms. | Mirror ContactForm's per-field error rendering in ApplicationForm. Set `aria-invalid` on failed inputs and `aria-describedby` pointing to the error `<p>`. |
| 3.3.2 | Labels or instructions | PASS | All fields have visible `<label>`. |
| 3.3.3 | Error suggestion | PARTIAL | Errors are generic ("Validation failed"). No hint on how to fix. | Localise per-field Zod errors. |
| 3.3.4 | Error prevention (legal/financial) | N/A | No legal/financial submission. |

### 2.4 Robust

| SC | Criterion | Status | Evidence | Fix |
|---|---|---|---|---|
| 4.1.1 | Parsing | PASS (React) | JSX output is well-formed. |
| 4.1.2 | Name, role, value | PARTIAL | Skills button missing `aria-controls` pointing at the menu's id. Mobile Skills disclosure button missing `aria-controls` (`HeaderClient.tsx:378`). Dropdown has `role="menu"` but `Link` children don't have `role="menuitem"` wrappers (they have `role="menuitem"` at line 257 — good). LocaleSwitcher button missing `aria-expanded` and `aria-haspopup`. | Add `aria-controls="skills-menu" aria-expanded={skillsOpen}` + `id="skills-menu"` on the motion.div. Add `aria-expanded`/`aria-haspopup` to LocaleSwitcher. |
| 4.1.3 | Status messages | FAIL | Form submit loading state "Sending..."/"submitting..." text swap is not announced via `aria-live="polite"`. Toast-like error banner uses `role="alert"` but only in `ApplicationForm` — ContactForm's error message is a plain `<div>`. | Add `aria-live="polite"` to the submit button wrapper, and `role="status"` to loading indicators. |

---

## 3. Color contrast table

Ratios calculated per WCAG 2.1 relative-luminance formula. Background `#0a0d14` unless specified.

| Combination | Ratio | WCAG normal text (4.5) | WCAG large text (3.0) | Verdict |
|---|---|---|---|---|
| `text-primary` #e8ecf4 on bg | **16.41** | PASS AAA | PASS | ✅ |
| `text-secondary` #9ba3b5 on bg | **7.68** | PASS AAA | PASS | ✅ |
| `text-muted` #5a6378 on bg | **3.23** | **FAIL** | PASS | ❌ for body text |
| `accent-system` #00d4aa on bg | **10.18** | PASS AAA | PASS | ✅ |
| `accent-human` #f5a623 on bg | **9.59** | PASS AAA | PASS | ✅ |
| `accent-system` on bg-surface #111520 | **9.55** | PASS AAA | PASS | ✅ |
| `text-muted` on bg-surface | **3.03** | **FAIL** | PASS | ❌ |
| `text-secondary` on bg-surface | **7.20** | PASS AAA | PASS | ✅ |
| `bg-deep` on accent-system (button fg) | **10.18** | PASS AAA | PASS | ✅ |
| `bg-deep` on accent-human (amber CTA) | **9.59** | PASS AAA | PASS | ✅ |
| placeholder `text-muted` on input bg (~#0e1118) | **3.14** | **FAIL** | PASS | ❌ for placeholders |
| error `#FF4D4D` on bg (ApplicationForm:234) | **5.94** | PASS | PASS | ✅ |
| `red-400` #f87171 on bg (ContactForm:120) | **7.03** | PASS AAA | PASS | ✅ |
| success `#22c55e` on bg | **8.53** | PASS AAA | PASS | ✅ |
| Cookie banner `#00D4FF` (stale) on bg | **11.28** | PASS AAA | PASS | ✅ |
| Legacy 404 `#00D4FF` on #050814 | **12.00** | PASS AAA | PASS | ✅ — but color is off-brand |

### Recommended replacement
Replace `--color-text-muted: #5a6378` with `#8C98AD` (6.67:1 on bg). Keeps a visually soft hierarchy between primary / secondary / muted while ensuring AA for small text. 46+ usage sites would become compliant automatically.

---

## 4. Mobile experience score per key page

Method: simulated 360px viewport, considering component overrides, thumb-zone, sticky CTAs.

| Page | Score | Key issues |
|---|---|---|
| `/` home | 6.0 | HeroSpline desktop 3D is swapped for a CSS grid on mobile — good perf call. But the hero h1 still uses `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` starting at 36px which on 360px viewport fits but wraps awkwardly. The `hero.cta` + `hero.ctaSecondary` buttons stack via `flex-wrap` but `hero.ctaSecondary` at 8px padding could stack vertically and feels orphaned. No mobile sticky `Apply` CTA — user scrolling through long home must scroll back up. |
| `/pricing` | 5.0 | 5 tier cards reflow to 1 column on mobile — consumer reads 5 pages of vertical content before CTA. `SkillsTierMatrix` scrolls horizontally with no affordance. `font-mono text-3xl` price renders at 30px — readable. "Most popular" hardcoded badge overlaps "Founding" badge at center. |
| `/apply` | 6.5 | Two-column collapses to single column — fine. But 8 fields + expectations content = 2+ screen heights. No progress indicator. `select` dropdowns use native iOS/Android styling — fine. No `inputMode="email"` so Android doesn't show email keyboard. |
| `/skills/[slug]` | 7.0 | Template is mobile-friendly. Allocation table is narrow enough (2-col) to fit. |
| `/case-studies/skinclarity-club` | 6.5 | Good flow. Content tables may scroll horizontally. |
| `/legal/*` | 7.5 | Single-column prose works well. Sub-nav pills can wrap. |
| `/contact` | 6.0 | 3 CTA paths on one screen (Apply callout + Book demo card + email link). Decision paralysis persists on mobile. |

---

## 5. Form UX deep-dive — `/apply`

**File:** `src/components/apply/ApplicationForm.tsx`

### What works
- HTML5 honeypot (`website` field) is cleanly hidden with `aria-hidden="true"` + `tabIndex={-1}` + `autoComplete="off"` (lines 76-81). Excellent pattern.
- Client-side Zod schema matches server schema exactly (`api/apply/route.ts:16-27`) — no drift.
- `type="email"` triggers mobile email keyboard.
- `required`, `minLength`, `maxLength` set — native browser validation as a fallback.
- Success state is a distinct card (`lines 64-71`) not a banner — avoids confusion.

### What fails
| Issue | File:line | Impact | Fix |
|---|---|---|---|
| No per-field error rendering | `ApplicationForm.tsx:232-236` | Screen reader users cannot identify which of 8 fields failed | Track `fieldErrors: Record<string, string>` in state, render `<p id={`${name}-err`}>` under each input, bind with `aria-describedby` + `aria-invalid`. |
| No `autoComplete` on name/email/agency/role | entire form | Browsers won't autofill; slows mobile completion | `name` → `name`, `email` → `email`, `agency` → `organization`, `role` → `organization-title`. |
| No `inputMode` hints | all inputs | Mobile keyboards default to text | Set `inputMode="email"` on email. |
| Problem textarea has no character counter | line 220-229 | Users hit 5000 limit with no warning | Add live counter `{value.length}/5000`. |
| Submit button loading state "submitting" has no `aria-live` | line 243 | State change not announced | Wrap in `<span aria-live="polite">`. |
| No draft/autosave | entire form | User loses 8-field input on accidental navigation | `localStorage` persist + `onBeforeUnload` warning. |
| No progress indicator | — | 8 fields, user doesn't know how long it'll take | Add "Step 1 of 3" grouping. |
| `problem` min 20 chars — arbitrary | line 15 | Users hit threshold blindly | Show hint: "Describe your biggest bottleneck (min 20 chars)". |
| Error banner only shown in `error` state | line 232 | No recovery affordance — retry button missing | Add "Try again" action. |
| Success state has no "What next?" CTA | line 65-70 | User sees success, then stuck on page | Add secondary button to `/case-studies/skinclarity-club` or `/pricing`. |
| Client and server rate-limit mismatch | `api/apply/route.ts:30` 3/min per IP | Legitimate user hitting submit after brief network failure gets rate-limited | Show user-friendly 429 message: "Te veel pogingen, wacht 1 minuut". |
| `website` honeypot empty-string validation (`z.string().max(0).optional()`) | schema | If bots send `website=""` they may pass — okay; but also means a legit user could pass. Behaviour okay. | — |

### Contact form comparison
ContactForm (`src/components/contact/ContactForm.tsx`) partially solves these issues — it has per-field errors (lines 120, 136, 176), field-errors state, and uses `noValidate` so errors come from server. Yet it has its own issues: hardcoded English "Sending...", "Message sent!", "Network error." strings (lines 66, 85-87, 189). Both forms should converge on the same validated component.

---

## 6. Modal / overlay UX audit

### BookingModal — `src/components/booking/BookingModal.tsx`
**Pros:**
- Scroll lock on body (`line 27`).
- Close button focused on open (`line 29`).
- Escape key closes (`lines 39-46`).
- Backdrop click closes (`lines 49-54`).
- Focus trap on Tab (`lines 57-85`).
- `role="dialog" aria-modal="true" aria-label={t('title')}` (`line 97-99`).

**Cons:**
- Focus trap queries `focusable` ONCE in the effect (line 62). When `react-calendly` iframe mounts async, its internals are not in the queried list; if user tabs into the iframe (cross-frame focus) and tabs back out, they land outside the modal.
- No "return focus to trigger" behaviour. When user closes the modal, focus returns to `document.body` not to the original trigger button (the `BookingCTA` that opened it). Screen-reader context is lost.
- `aria-label={t('title')}` — good — but no `aria-describedby` pointing at the subtitle which describes the action (`line 127`).
- The modal max-height is `max-h-[90vh] overflow-y-auto` (line 107). On a 667px iPhone SE viewport, 90vh = 600px; minus 650px min-height of the Calendly widget = scroll inside scroll.

### ChatWidget — `src/components/chatbot/ChatWidget.tsx`
- `role="dialog" aria-modal="true"` on the floating panel (`lines 129-131`) — correct.
- No focus trap within ChatWidget. User tabbing inside can escape to body.
- Closes on Escape (`line 88`).

### CookieConsentBanner — `src/components/interactive/CookieConsentBanner.tsx`
- Uses `react-cookie-consent` library at bottom-fixed — OK.
- Banner is not modal and doesn't trap focus — correct (GDPR guidance does not require modality).
- Colors hardcoded `#050814` / `#00D4FF` — still uses the STALE palette (the codebase has moved to `#0a0d14` / `#00d4aa`). Visual dialect break. Fix: reference CSS vars `var(--color-bg-deep)` and `var(--color-accent-system)`.
- Missing `aria-label="Cookie consent"` on the outermost banner container.

### FloatingLocaleSwitcher — `src/components/common/FloatingLocaleSwitcher.tsx`
- Opens on click — good.
- Escape closes (`lines 46-52`).
- Missing `aria-expanded` and `aria-controls` on trigger button.
- Missing focus management: first dropdown item not focused on open.
- Uses flag emojis as primary indicator (`LOCALE_FLAGS`). Screen readers read them as country names — but the button's only accessible name is `aria-label="Change language"`; the current flag emoji is the only visual cue.

---

## 7. Keyboard navigation trace — 3 sample flows

### Flow A: home → apply (desktop, keyboard only)
1. Page loads. Focus starts at document.body.
2. Tab → logo link (`HeaderClient.tsx:195`). Visible ring: browser default only.
3. Tab → Skills trigger button (`line 215`). **PROBLEM**: Pressing Enter or Space does nothing — menu only opens on mouseEnter. User skips past without seeing 12 skill links.
4. Tab → Memory link.
5. Tab → Case Studies link.
6. Tab → Pricing link.
7. Tab → About link.
8. Tab → Login anchor.
9. Tab → Apply CTA (header primary button, `line 338-343`).
10. User could press Enter here — goes to `/apply`. Best-case: 9 keystrokes from page load to reach the apply CTA.
11. **There is no skip-link** — so on every page this 9-step ordeal repeats.
12. Tab → Mobile hamburger button (hidden on desktop but present in DOM) — check this isn't a trap.
13. Tab → FloatingLocaleSwitcher trigger.
14. Tab → H1 (not focusable) — skip.
15. Tab → Hero primary CTA (Apply). Also reaches apply.

**Keystrokes to Apply CTA**: 9 on home page. Compliant sites do this in 1 keystroke via skip-link.

### Flow B: pricing → apply
1. User navigates to `/pricing` (e.g., from footer link). Focus goes to body.
2. Header tabbing: 9 items to pass (see above).
3. Tab through 5 tier cards — each card has a primary `Apply` CTAButton as last tab stop.
4. Partner tier CTA → Growth tier CTA → Professional tier CTA → Enterprise tier CTA → Founding tier CTA.
5. Any of these Enters brings user to `/apply`.

**Issue**: The "Most popular" + "Founding" badge `<span>` does not have `aria-label` — a screen reader announces "Apply" then the tier name but the user has no audio cue that Professional is "Most popular" until they reach the text inside the card. Add `aria-describedby` on the card pointing at the badge.

### Flow C: skills (mega-menu) → apply
1. Desktop: user tabs to Skills button. **Dead end** — menu won't open with keyboard. User has to arrow down into the body and use in-body Skills section (which exists only on home page — `services` block).
2. User on any interior page (e.g., /about) cannot reach the 12 skill pages from the header via keyboard. **A 2.1.1 violation + a blocking UX failure.**

---

## 8. Top 20 UX / A11y fixes ranked by impact

| # | Fix | Page(s) | WCAG | Effort | Impact |
|---|---|---|---|---|---|
| 1 | Add global skip-to-content link | `layout.tsx` | 2.4.1 | S | ⬛⬛⬛⬛⬛ |
| 2 | Fix Skills mega-menu keyboard operation (onClick + aria-expanded + arrow-keys) | `HeaderClient.tsx:215-313` | 2.1.1, 4.1.2 | M | ⬛⬛⬛⬛⬛ |
| 3 | Raise `--color-text-muted` from #5a6378 → #8C98AD | `globals.css:18` | 1.4.3 | S | ⬛⬛⬛⬛⬛ |
| 4 | Per-field errors + `aria-invalid` + `aria-describedby` on ApplicationForm | `ApplicationForm.tsx` | 3.3.1, 4.1.2 | M | ⬛⬛⬛⬛ |
| 5 | Add `autoComplete` tokens to all form fields (Apply + Contact) | 2 files | 1.3.5 | S | ⬛⬛⬛⬛ |
| 6 | Extend `prefers-reduced-motion` to all CSS keyframes (float, glow-pulse, data-flow, etc.) + hero inline animations | `globals.css`, `page.tsx:87,96,110,118,126` | 2.3.3 | M | ⬛⬛⬛⬛ |
| 7 | Global `*:focus-visible` ring | `globals.css` | 2.4.7 | S | ⬛⬛⬛⬛ |
| 8 | Return focus to trigger when BookingModal closes | `BookingModal.tsx` | 2.4.3 | S | ⬛⬛⬛ |
| 9 | Raise input border opacity from 0.06 → 0.12–0.2 | `globals.css:19` or Tailwind class | 1.4.11 | S | ⬛⬛⬛ |
| 10 | Fix CookieBanner to use current palette (`#0a0d14`, `#00d4aa`) | `CookieConsentBanner.tsx:44-80` | brand consistency + 1.4.11 | S | ⬛⬛⬛ |
| 11 | Add `aria-expanded`/`aria-haspopup`/`aria-controls` to LocaleSwitcher | `FloatingLocaleSwitcher.tsx:67` | 4.1.2 | S | ⬛⬛⬛ |
| 12 | Localise hardcoded "Most popular", "Sending...", "Message sent!", "Try again" | `pricing/page.tsx:127`, `ContactForm.tsx:66,85,189`, `error.tsx:13-22` | 3.1.1 + i18n hygiene | S | ⬛⬛⬛ |
| 13 | Add horizontal scroll affordance to SkillsTierMatrix (region + shadow gradient + tabIndex=0) | `SkillsTierMatrix.tsx:63` | 1.4.10 | S | ⬛⬛⬛ |
| 14 | Make mobile hamburger button ≥44px (p-3 from p-2) | `HeaderClient.tsx:347` | 2.5.8 | XS | ⬛⬛⬛ |
| 15 | Extend footer social icon hit area via padding | `Footer.tsx:224-241` | 2.5.8 | XS | ⬛⬛ |
| 16 | Add `scroll-padding-top: 5rem` to `<html>` | `globals.css` | 2.4.11 | XS | ⬛⬛ |
| 17 | Pricing tier "Most popular" / "Founding" badges as `aria-describedby` on card | `pricing/page.tsx:116-130` | 1.3.1 | S | ⬛⬛ |
| 18 | Add `aria-hidden="true"` to decorative SVGs on /contact and /case-studies | multiple | 1.1.1 | S | ⬛⬛ |
| 19 | Error page (`error.tsx`) localise + suppress raw error.message | `error.tsx` | 3.1.1 + security | S | ⬛⬛ |
| 20 | Character counter on ApplicationForm problem textarea | `ApplicationForm.tsx:220` | UX | S | ⬛ |

Legend: impact ⬛⬛⬛⬛⬛ critical · XS <15min · S <1h · M 1-4h · L >4h

---

## 9. Mobile-specific fixes ranked

| # | Fix | Why |
|---|---|---|
| 1 | Add sticky bottom CTA bar on `/` and `/skills/*` ("Plan een gesprek") | Long scroll pages, no thumb-zone CTA. Standard on agency sites. |
| 2 | SkillsTierMatrix: horizontal-scroll affordance + swipe indicator + sticky first column | Current is a 6-col table with zero scroll hint — users think it's truncated. |
| 3 | Pricing: collapse tiers to a step-through carousel on <md — currently 5 stacked 1-col tiles | 5 scroll-heights of vertical content before CTA. Use `embla-carousel` or horizontal snap. |
| 4 | Mobile Header: move `Login` into the mobile drawer (currently hidden on md:hidden but appears in the drawer) — good. Also add the primary Apply CTA inside the drawer top. | Currently drawer has Skills + nav only, Apply CTA only accessible via header (always visible). User scanning drawer misses apply path. |
| 5 | Apply form: single-column on mobile (already), but group fields into 3 "sections" with H3 — chunking reduces cognitive load | Psychology of form length. |
| 6 | HeroSpline mobile fallback is a CSS grid floor (`HeroSpline.tsx:42-78`) — purely decorative. Ensure `aria-hidden="true"` on the outer `<div>` (currently `pointer-events-none` but not aria-hidden). | Screen readers describe invisible decorative structure. |
| 7 | FloatingLocaleSwitcher at `top-20 left-4` overlaps hero content on small screens. Consider moving below header or hiding on mobile when hamburger is present (drawer already has locale options? — no it doesn't). Add locale selection inside mobile drawer. | Real-estate + overlap with hero CTAs. |
| 8 | Set `inputMode="email"` on email inputs for Android soft keyboard hint | Saves 3 taps for mobile users to find @ key. |
| 9 | Ensure VoiceDemoFAB + ChatbotFAB don't stack at the same bottom-right position on mobile | Both are `fixed bottom-6 right-6 z-[40-61]`. VoiceDemoFAB at `right-6 bottom-6` collides with FloatingButton at `right-6 bottom-6`. Visual: chat button on top. UX: the one below is unreachable. Stagger or hide one. |
| 10 | Set `touch-action: manipulation` on all interactive buttons to eliminate any 300ms tap delay | Minor perf. |
| 11 | Disable `card-tilt` hover effect on touch explicitly (already guarded by `@media (hover: hover)` — OK) | Verify it doesn't trigger a "sticky hover" on tap. |
| 12 | Long FAQ on `/pricing` and `/` — convert `<dt>` to a disclosure `<button>` with `aria-expanded` for mobile content reduction | Saves 5+ screenfuls. |

---

## 10. Accessibility violations = legal risk (EU EAA compliance)

The European Accessibility Act (EAA, Directive 2019/882) takes effect 2025-06-28 and applies to digital services offered to EU consumers, including B2B SaaS / agency services where consumers can apply. Non-compliance exposes the business to enforcement by Dutch ACM / Autoriteit Persoonsgegevens.

**Site is a B2B agency marketing site with an application form.** EAA arguably applies to the `/apply` form as a contract-initiation step.

### High-risk violations (fix before 2025-06-28)
1. **Skip-to-content missing** (2.4.1) — single-digit effort, zero excuse.
2. **Skills mega-menu keyboard inoperable** (2.1.1) — blocks navigation to 12 pages. Directly prevents users with motor disabilities from accessing service descriptions.
3. **Form per-field errors missing on `/apply`** (3.3.1, 4.1.2) — prevents users with vision impairments from recovering from errors — blocks them from completing the primary conversion step.
4. **Focus indicators stripped without replacement** (2.4.7) — `focus:outline-none` on inputs without a ring replacement means users in Windows High Contrast / forced-colors can't see focus.
5. **Text contrast below AA for body copy** (1.4.3) — 46+ instances of `text-text-muted` at small sizes. Brand colors are all AAA; the muted grey is the single systemic failure.

### Medium-risk
6. **`autoComplete` missing** (1.3.5).
7. **Reduced motion not fully honoured** (2.3.3).
8. **Focus not returned to trigger after modal close** (2.4.3).

### Low-risk
9. Footer social icon hit area (2.5.8 is best-practice; legal minimum 24×24 may still pass).
10. Decorative SVGs without `aria-hidden` (1.1.1 — some redundancy only).

**Assessment:** the site is **not currently EAA-compliant** for the critical `/apply` conversion flow. A determined complaint would succeed on items 1, 2, 3, 5. Remediation ~1 week of focused work.

---

## 11. Information architecture & cohesion

### Navigation paths
- **Home →** Apply (hero CTA, final CTA, header CTA) ✓
- **Home →** Clyde (hero secondary CTA) — reaches orchestrator but not founding or pricing
- **Home →** Founding (CTA block only — not in header) — surprising, given business model
- **Home →** Case studies (trust strip + CTA) ✓
- **Skills (header) →** 12 skill pages via mega-menu — **desktop hover only, keyboard blocked**
- **Skills (footer) →** 7 skill pages (missing: blog-factory, reel-builder, email-management, manychat, research, voice-agent, lead-qualifier, reporting — wait, Footer has social_media, blog_factory, voice_agent, lead_qualifier, ad_creator, seo_geo, clyde + pricing — i.e. **footer lists only 7 of 12 skills**, missing `research`, `reporting`, `manychat`, `email_management`, `reel_builder`). Inconsistent with header which lists all 12.
- **Footer →** Founding ✓, Memory ✓, Case studies ✓, Blog ✓, Contact ✓, About ✓, How-it-works ✓
- **Anywhere →** Pricing ✓ (header + footer)

### IA issues
1. Footer skill list is out of sync with header mega-menu. Fix footer to include all 12 or explicitly mark "Featured skills" in Footer.
2. Header has no direct path to "Blog" — blog is footer-only. Consider adding.
3. Header has no "Contact" link — it's footer-only. For a high-touch partnership site, a Contact option in the header is expected.
4. Mobile drawer doesn't include Apply CTA prominently (header always-visible CTA gets lost in sticky state on some scroll behaviours).

---

## 12. Micro-interactions & consistency

### Button styles
- `CTAButton` (primary) — amber gradient, text-bg-deep. ✓ Consistent.
- `CTAButton` (secondary) — glassmorphic. ✓ Consistent.
- `BookingCTA` — mirrors CTAButton but is click-only (opens modal). ✓ Intentional.
- Hero mobile Apply button: `CTAButton` ✓.
- Header Apply: inline `<Link>` with gradient — **does NOT use CTAButton.** Inconsistent (HeaderClient.tsx:338-343 vs CTAButton.tsx).
- Contact applyCallout: raw `<a>` tag with hand-rolled classes (`contact/page.tsx:72-77`). Inconsistent.
- Legal sub-nav pills: custom pill style. Consistent within legal pages.
- Footer Apply: styled as a text link with accent color (`Footer.tsx:146`) — treated as a resource link not a CTA. **This is a bug** — the primary apply action is buried.

### Spacing
- Section padding `py-16` / `py-20` / `py-12` varies without clear rhythm. Most home sections are py-20, pricing is py-12/py-16 mixed.
- Container max-widths: `max-w-3xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, `max-w-7xl` — all appear across pages. No central design-token constant.

### Iconography
- Lucide React used throughout. ✓
- Custom inline SVGs in pricing (checkmark), services (arrow), contact (email, location, clock) — inconsistent. Switch inline to Lucide (`Check`, `ArrowUpRight`, `Mail`, `MapPin`, `Clock`).

---

## 13. Empty / loading / edge states

| State | Handled? | Evidence |
|---|---|---|
| Form submitting | ✓ | Both forms disable button + swap text. |
| Form success | ✓ | Both forms show success card. |
| Form generic error | ✓ | Both forms show banner. |
| Form per-field error | ✗ on Apply / ✓ on Contact | Inconsistent. |
| Form rate-limited (429) | ✗ | Generic error shown, no dedicated "wait a minute" messaging. |
| Form network error | ✓ | Caught with try/catch (ApplicationForm:58-61, ContactForm:65-68). |
| Spline scene failed to load | ✓ | Preview webp stays visible (splite.tsx:71-89). |
| Calendly iframe failed to load | ✗ | No fallback — user sees blank right panel. |
| LocaleSwitcher — no matching locale | N/A | Routes validated at middleware. |
| Pricing matrix — skill missing from tier | ✓ | `renderCap` returns "Niet beschikbaar" label (SkillsTierMatrix.tsx:23,36). |
| 404 | ✓ | Custom page with back-home CTA. |
| 500 | ✓ but poor | Shows raw error.message to user — info leak. |
| Empty blog | — | Not checked. |
| Cookie banner dismissed then revisited | ✓ | react-cookie-consent persists cookie 365 days. |

---

## 14. Appendix A — inventories

### A.1 Components detected (selected)
```
src/components/
├─ apply/ApplicationForm.tsx              (form, 8 fields, client-side)
├─ booking/
│  ├─ BookingModal.tsx                    (modal, focus trap, role=dialog)
│  └─ BookingCTA.tsx                      (client button triggering modal)
├─ chatbot/ (20+ files)                   (AI SDK, Zustand, demo scenarios)
├─ common/
│  ├─ FloatingLocaleSwitcher.tsx          (fixed top-left, escape-closeable)
│  ├─ PricingTiers.tsx
│  ├─ ProductMedia.tsx
│  ├─ SocialProof.tsx
│  └─ TrustMetrics.tsx
├─ contact/ContactForm.tsx                (form, 4 fields, per-field errors)
├─ hero/
│  ├─ GradientMesh.tsx                    (background decoration)
│  ├─ HeroSpline.tsx                      (desktop 3D + mobile CSS grid fallback)
│  └─ OrbitVisual.tsx
├─ home/IcpSection.tsx
├─ interactive/CookieConsentBanner.tsx    (bottom-fixed banner)
├─ layout/
│  ├─ Footer.tsx                          (3-col nav + legal + social)
│  ├─ Header.tsx                          (server wrapper)
│  ├─ HeaderClient.tsx                    (nav + mega-menu + mobile drawer)
│  └─ PageShell.tsx                       (<main> wrapper, pt-16)
├─ legal/LegalSectionPage.tsx             (shared privacy/terms/cookies render)
├─ memory/MemoryLayersDiagram.tsx
├─ motion/
│  ├─ LazySection.tsx                     (lazy content revealer)
│  └─ ScrollReveal.tsx                    (Framer Motion + reduced-motion OK)
├─ pricing/SkillsTierMatrix.tsx           (6-col table, horizontal-scroll)
├─ providers/
│  ├─ ClientIslands.tsx                   (chat + calendly + booking modal lazy)
│  └─ Providers.tsx
├─ seo/ (JsonLd components)
├─ skills/SkillPageTemplate.tsx           (shared template for 12 skill pages)
├─ ui/
│  ├─ CTAButton.tsx                       (primary/secondary/ghost × sm/md/lg)
│  ├─ GlassCard.tsx                       (bg-white/[0.02] backdrop-blur)
│  ├─ QuickAnswerBlock.tsx
│  ├─ SectionHeading.tsx                  (<h2 id={...}> typography)
│  ├─ card.tsx
│  ├─ splite.tsx                          (Spline wrapper + preview crossfade)
│  └─ spotlight.tsx
└─ voice/
   ├─ CallTranscript.tsx
   ├─ PhoneMockup.tsx
   ├─ VoiceDemoFAB.tsx                    (contextual FAB)
   ├─ VoiceDemoPhone.tsx
   ├─ VoiceDemoSection.tsx
   └─ WaveformVisualizer.tsx
```

### A.2 ARIA attribute usage count (search: `aria-*`)
- **113 total occurrences across 34 files**
- Most common: `aria-label`, `aria-hidden`, `aria-labelledby`, `aria-expanded`
- Missing: `aria-controls` (0 uses), `aria-live` (0 uses outside modal `role="alert"`), `aria-describedby` (almost no uses)

### A.3 Focus style usage
- `focus:outline-none focus:border-accent-system` — 8 instances (inputs).
- `focus-visible:ring-2` — 1 instance (FloatingButton).
- **The remaining ~100 interactive elements rely on browser default focus ring only.**

### A.4 `<img>` vs `<Image>`
- Zero `<img>` tags with `alt=` (only 1 `<img>` substring match, and it's inside a component name).
- `<Image>` (next/image): 1 instance — `splite.tsx:80` (Spline preview).
- **Site is image-sparse** — most visuals are CSS/SVG/3D. A11y surface for images is tiny.

### A.5 Animation keyframes
From `globals.css`:
```
glow-pulse, float, slide-up, slide-down, fade-in, status-pulse, data-flow,
spin, orbit-pulse, orbit-core-breathe, orbit-particle-float,
blobFloat1, blobFloat2, blobFloat3, chatDotBounce, spotlight, fadeInUp,
heroGridGlow
```
**Only `blobFloat1-3` are paused under `prefers-reduced-motion`.** The rest (17 of 18) keep running.

### A.6 Hardcoded English strings (locale escape hatches)
- `pricing/page.tsx:127` — `'Most popular'` (hard-coded, not from i18n).
- `ContactForm.tsx:66` — `'Network error. Please check your connection and try again.'`
- `ContactForm.tsx:85,87,94,189` — `'Message sent!'`, `'Thank you for reaching out...'`, `'Send another message'`, `'Sending...'`
- `error.tsx:13-22` — full page (`'Something went wrong'`, `'Try again'`, `'An unexpected error occurred.'`)
- `ApplicationForm.tsx` — uses `t()` throughout. Clean.
- `ChatWidget.tsx:107,110` — `'Demo limit reached.'`, `'Book a call'`.
- `ChatWidget.tsx:180` — `'Demo limit reached'`, `'Type a message...'`.

### A.7 Interactive element counts
- `onClick` handlers: 54 across 26 files.
- `onChange` handlers: ~20 (form fields).
- `<button>` elements: ~45.
- `<a>` / `<Link>` elements: ~80.
- `role="dialog"`: 2 (BookingModal, ChatWidget).
- `role="menu"`: 1 (Header skills mega-menu).
- `role="menuitem"`: 12 (skills in menu).
- `role="tablist"`/`tab`: 1 pair (PersonaSelector in chatbot).

### A.8 Landmark roles
- `<header>` — 1 (layout Header).
- `<main>` — 1 (PageShell).
- `<nav>` — 1 (main nav) + 3 (footer nav × 3).
- `<footer>` — 1 (Footer).
- `<article>` — 1 (legal page).
- `<address>` — 1 (contact page).
- No `<section>` landmarks with `aria-label` — many `aria-labelledby` referencing inner heading IDs. ✓ Correct pattern.

---

## 15. Summary matrix — action priority

| Priority | Fix | WCAG | Hours |
|---|---|---|---|
| P0 | Skip-to-content link | 2.4.1 | 0.5 |
| P0 | Skills mega-menu keyboard | 2.1.1 | 2 |
| P0 | `text-muted` contrast raise | 1.4.3 | 0.5 |
| P0 | ApplicationForm per-field errors | 3.3.1 | 2 |
| P1 | Global focus-visible ring | 2.4.7 | 0.5 |
| P1 | Extended reduced-motion coverage | 2.3.3 | 1 |
| P1 | `autoComplete` tokens everywhere | 1.3.5 | 0.5 |
| P1 | Return focus to trigger (BookingModal) | 2.4.3 | 0.5 |
| P1 | CookieBanner palette update | brand | 0.25 |
| P1 | Header Apply via CTAButton (consistency) | brand | 0.5 |
| P2 | Skills matrix scroll affordance | 1.4.10 | 0.5 |
| P2 | Mobile hamburger ≥44px hit area | 2.5.8 | 0.1 |
| P2 | Hardcoded English removal (4 sites) | 3.1.1 | 1 |
| P2 | 500 error page cleanup | 3.1.1 + security | 0.5 |
| P2 | `scroll-padding-top` | 2.4.11 | 0.05 |
| P3 | FAQ disclosure pattern mobile | UX | 2 |
| P3 | Mobile sticky Apply CTA | UX | 1 |
| P3 | Pricing tier mobile carousel | UX | 3 |
| P3 | Character counter problem textarea | UX | 0.25 |
| P3 | ApplicationForm progress indicator | UX | 1 |

**Total critical-path remediation: ~5.5 hours P0 + ~4 hours P1 = one focused day.**

---

_End of audit._
