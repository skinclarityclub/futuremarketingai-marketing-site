# Research: Phase 11 EAA Accessibility Compliance

## 1. WCAG 2.2 Level AA criteria mapped to each fix

| Success criterion | Level | Fix in this phase | Plan |
|---|---|---|---|
| **1.3.5** Identify input purpose | AA | `autoComplete` tokens on 8 ApplicationForm fields (`name`, `email`, `organization`, `organization-title`, `off` on tier selects + honeypot) and on ContactForm | 11-03 |
| **1.4.3** Contrast minimum (4.5:1 normal, 3:1 large) | AA | Raise `--color-text-muted` from `#5a6378` (3.23:1 on `#0a0d14`) to `#8C98AD` (6.67:1) | 11-02 |
| **2.1.1** Keyboard | A | Skills mega-menu opens on Enter/Space, navigable with ArrowUp/ArrowDown, closes on Escape | 11-01 |
| **2.3.3** Animation from interactions (AAA) / **2.3.1** three flashes (A) | A + AAA | Wrap all 17 `globals.css` keyframes + the 4 inline `fadeInUp` animations on `page.tsx:87,96,110,118,126` inside `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }` | 11-02 |
| **2.4.1** Bypass blocks | A | `<a href="#main" class="sr-only focus:not-sr-only focus:absolute ...">Ga direct naar inhoud</a>` as first child of `<body>` + `id="main"` on `<main>` in `PageShell.tsx` | 11-01 |
| **2.4.3** Focus order (after modal close) | A | `BookingModal` stores `document.activeElement` in a ref before opening, calls `triggerRef.current?.focus()` on close | 11-01 |
| **2.4.7** Focus visible | AA | Global `*:focus-visible { outline: 2px solid var(--color-accent-system); outline-offset: 2px; border-radius: 2px; }` in `globals.css` | 11-01 |
| **2.4.11** Focus not obscured (minimum) — new in 2.2 | AA | `html { scroll-padding-top: 5rem; }` in `globals.css` — header is 64 px (`h-16`); 5rem (80 px) gives safe margin | 11-01 |
| **3.1.1** Language of page | A | Already PASS — `<html lang={locale}>` at `layout.tsx:52` via next-intl. Verify only. | N/A (verify) |
| **3.3.1** Error identification | A | ApplicationForm: per-field `<p id="{field}-err" role="alert">` rendered when Zod returns a per-field error | 11-03 |
| **3.3.3** Error suggestion | AA | i18n-localised Zod messages in NL/EN/ES tell the user how to fix (e.g. `"Vul een geldig e-mailadres in, inclusief @"`) | 11-03 |
| **4.1.2** Name, role, value | A | Skills button gets `aria-expanded`, `aria-controls="skills-menu"`, `aria-haspopup="menu"`. Menu container gets `id="skills-menu"` + `role="menu"` (already has) | 11-01 |
| **4.1.3** Status messages (new in 2.1) | AA | `aria-live="polite"` on submit-button status region in ApplicationForm + ContactForm | 11-03 |

**Source**: W3C WCAG 2.2 Recommendation, 2023-10-05. Dutch summary at `toegankelijkheid.nl/wcag/wcag-2-2`.

## 2. Dutch + EU legal context

- **EAA** — Directive (EU) 2019/882, transposed into Dutch law via *Wet implementatie Europese toegankelijkheidsrichtlijn* (WIETR). In force 2025-06-28. Applies to electronic commerce services. The `/apply` form qualifies as service-initiation.
- **Enforcement in NL**: Autoriteit Consument en Markt (ACM) supervises. Individual complaints via College voor de Rechten van de Mens. Fines up to EUR 900.000 or 10% of turnover for businesses in severe breach.
- **Technical baseline**: EN 301 549 v3.2.1 (harmonised standard) points at WCAG 2.1 AA. WCAG 2.2 is a strict superset; building to 2.2 AA is forward-compatible.
- **Public-sector deadlines and monitoring**: Besluit digitale toegankelijkheid overheid — not us, but the same WCAG test suite is re-used by the Digitoegankelijk NL auditors.
- **Reference**: `toegankelijkheid.nl`, `digitoegankelijk.nl`, `accessibility.eu`.

## 3. Keyboard-accessible disclosure menu pattern

The correct interaction model for a navigation dropdown with sub-links is the **WAI-ARIA menu button pattern** (APG 1.2), not a plain disclosure. But for a NAV mega-menu the simpler *disclosure* pattern is also acceptable and more robust in screen readers because `role="menu"` suppresses text reading.

### Recommended: hybrid (disclosure wrapping a list of links)

```tsx
// Trigger
<button
  ref={triggerRef}
  aria-expanded={skillsOpen}
  aria-controls="skills-menu"
  aria-haspopup="true"
  onClick={() => setSkillsOpen((v) => !v)}
  onKeyDown={(e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSkillsOpen(true); /* focus first item on next frame */ }
    if (e.key === 'Escape') setSkillsOpen(false)
  }}
>
  Skills <ChevronDown />
</button>

// Panel
<div
  id="skills-menu"
  role="menu"
  onKeyDown={handleMenuKeyDown} // ArrowUp/ArrowDown/Home/End/Escape/Tab-out
>
  {items.map((item, i) => (
    <Link
      key={item.href}
      href={item.href}
      role="menuitem"
      tabIndex={i === focusIndex ? 0 : -1}
      ref={(el) => { itemRefs.current[i] = el }}
      onClick={() => setSkillsOpen(false)}
    >
      ...
    </Link>
  ))}
</div>
```

Keyboard contract (ARIA APG):

- Enter / Space on trigger: toggle menu, focus first item if opening.
- ArrowDown on trigger: open menu, focus first item.
- ArrowDown / ArrowUp inside menu: cycle through menu items.
- Home / End inside menu: first / last item.
- Escape: close menu, return focus to trigger.
- Tab inside menu: close menu, continue tab order after trigger.
- Click outside: close menu (keep existing `document.addEventListener('click', ...)` but guard against self-click).

**Critical current bug**: `HeaderClient.tsx:174-180` attaches a blanket `document.addEventListener('click', () => setSkillsOpen(false))` which fights the `onClick` toggle on line 215 (the menu closes on the same click that opens it). Replace with a `useOnClickOutside` hook that accepts the dropdown ref and skips clicks inside it.

References:
- W3C WAI-ARIA Authoring Practices 1.2 — "Menu Button" and "Disclosure (Show/Hide)" patterns
- Radix UI `DropdownMenu` — production-grade reference
- Reach UI `Menu` — source code reference (smaller, easier to read)

## 4. React 19 + Next.js 16 focus-return pattern

```tsx
const triggerRef = useRef<HTMLElement | null>(null)

const openBooking = () => {
  triggerRef.current = document.activeElement as HTMLElement
  setOpen(true)
}

const closeBooking = () => {
  setOpen(false)
  // Wait for AnimatePresence exit + DOM cleanup
  requestAnimationFrame(() => {
    triggerRef.current?.focus()
  })
}
```

For `BookingModal`, the trigger is outside the modal (in `BookingCTA`). Store the element in the `useBookingStore` Zustand store (`triggerEl: HTMLElement | null`), set it in `openBooking`, call `.focus()` in the modal's close-effect.

React 19 does not change focus management; `useRef<T | null>(null)` with a lazy assignment is the idiomatic pattern.

## 5. Tailwind 4 `sr-only` + `focus:not-sr-only`

Tailwind 4 (in use here via `@import 'tailwindcss'` in `globals.css:1`) ships these utilities as standard:

```css
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
.focus\:not-sr-only:focus, .focus-visible\:not-sr-only:focus-visible { position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal; }
```

The skip link pattern:

```tsx
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent-system focus:text-bg-deep focus:font-semibold focus:shadow-lg"
>
  {t('skipToContent')}
</a>
```

`z-[200]` sits above the fixed header (`z-50`) and above the BookingModal (`z-[60]`).

Confirmed present in `node_modules/tailwindcss/dist/preflight.css` equivalent for v4. Not deprecated.

## 6. Complete `prefers-reduced-motion` pattern

The minimal, most reliable pattern is one media block nesting all animation selectors:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .blob-warm,
  .blob-cool,
  .blob-mixed {
    animation: none !important;
  }
}
```

The `0.01ms` trick preserves animation events (so code that listens for `animationend` still fires) while effectively freezing the UI. For Framer Motion, the `useReducedMotion()` hook is already respected in components like `FloatingButton.tsx:17` — no change needed there.

**Caveat on `!important`**: Tailwind 4 generates some utilities with specificity `0,1,0`. Using `!important` inside the media query is a common and accepted escape hatch (see Andy Bell, Cube CSS) because the rule expresses user preference, not author preference.

**Alternative without `!important`**: explicitly list every keyframe class selector. More verbose but safer. Given the codebase has 17 keyframes and 5 inline animations, the global sweep is preferable.

Inline `style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}` animations at `page.tsx:87,96,110,118,126` are covered by the universal selector rule because inline styles are overridden by `!important` declarations of equal or higher specificity (inline style beats stylesheet but `!important` in stylesheet beats inline without `!important`).

## 7. Contrast math

Using the sRGB luminance formula from WCAG 2.1 §1.4.3:

- Background `#0a0d14` — relative luminance ≈ 0.00535
- Current muted `#5a6378` — relative luminance ≈ 0.12924 — ratio = (0.12924 + 0.05) / (0.00535 + 0.05) = **3.23**
- Target muted `#8C98AD` — relative luminance ≈ 0.29125 — ratio = (0.29125 + 0.05) / (0.00535 + 0.05) = **6.67**
- Check against `#111520` (surface) — luminance ≈ 0.00865 — ratio = 0.29125 + 0.05 / 0.00865 + 0.05 = **5.79** (still AA)
- Check against `#1a1f2e` (elevated) — luminance ≈ 0.01437 — ratio = **5.22** (still AA)

All three primary dark surfaces pass `4.5:1` with `#8C98AD`. Verification command:

```bash
npx @adobe/leonardo-contrast-colors --fg "#8C98AD" --bg "#0a0d14" # prints ratio
```

Or online: `webaim.org/resources/contrastchecker/?fcolor=8C98AD&bcolor=0a0d14` — must show **6.67:1 — PASS AA Normal, FAIL AAA Normal, PASS AA Large, PASS AAA Large**. (AAA normal requires 7:1 — acceptable gap, not in scope.)

## 8. next-intl 4.8 locale-aware `<html lang>`

Already applied automatically via the app-router pattern:

```tsx
// src/app/[locale]/layout.tsx:51-54
<html lang={locale} ...>
```

next-intl 4.8 does **not** inject `lang` itself — the developer must pass it. Verified at line 52 of `layout.tsx`. No further action.

For verifying per-locale the attribute renders: `curl -s http://localhost:3000/nl | head -5 | grep '<html'` should return `<html lang="nl" ...>`.

## 9. Axe-core + Lighthouse verification commands

```bash
# Install once (already available via npx without install)
npx @axe-core/cli http://localhost:3000/nl --exit

# Keyboard audit via Playwright (ties in with phase 09.4 plan if ever created)
npx playwright test --grep @a11y

# Lighthouse a11y audit
npx lighthouse http://localhost:3000/nl --only-categories=accessibility --output=json --output-path=./a11y.json --chrome-flags="--headless"

# Manual contrast spot-check (fast, no install)
node -e "const fg = [0x8C,0x98,0xAD]; const bg = [0x0a,0x0d,0x14]; const lin = c => c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); const L = rgb => 0.2126*lin(rgb[0]/255) + 0.7152*lin(rgb[1]/255) + 0.0722*lin(rgb[2]/255); const r = (Math.max(L(fg),L(bg))+0.05)/(Math.min(L(fg),L(bg))+0.05); console.log(r.toFixed(2))"
```

Expected: axe reports 0 critical for 2.4.1, 2.1.1, 1.4.3, 2.4.7, 3.3.1, 4.1.2. Lighthouse a11y score rises from current baseline (unmeasured) to ≥95.

## 10. Hardcoded-string inventory for 11-03

From audit 07 §A.6 + section 5 contact-form comparison, strings to localise in ContactForm:

| File:line | EN literal | NL target | EN target | ES target |
|---|---|---|---|---|
| `ContactForm.tsx:66` | `'Network error. Please check your connection and try again.'` | `'Netwerkfout. Controleer je verbinding en probeer het opnieuw.'` | Keep EN | `'Error de red. Verifica tu conexión e intenta de nuevo.'` |
| `ContactForm.tsx:85` | `'Message sent!'` | `'Bericht verstuurd.'` | Keep EN | `'Mensaje enviado.'` |
| `ContactForm.tsx:86-87` | `'Thank you for reaching out. We will get back to you within 24 hours.'` | `'Bedankt voor je bericht. Ik reageer binnen 1 tot 2 werkdagen.'` (IK-stem per style guide) | Keep EN, contraction: `'we\'ll'` | `'Gracias por contactar. Te responderé en 1 a 2 días hábiles.'` |
| `ContactForm.tsx:94` | `'Send another message'` | `'Verstuur nog een bericht'` | Keep EN | `'Enviar otro mensaje'` |
| `ContactForm.tsx:58` | `'Something went wrong. Please try again.'` | `'Er ging iets mis. Probeer het opnieuw.'` | Keep EN | `'Algo salió mal. Por favor, intenta de nuevo.'` |
| `ContactForm.tsx:189` | `'Sending...'` | `'Versturen...'` | Keep EN | `'Enviando...'` |

Note: per `CLAUDE.md` global rule, no em-dashes in user-facing copy — use komma / punt / dubbele punt. None of these proposed NL/ES strings use em-dashes.

## 11. Current `<html lang>` test

```bash
npm run dev &
sleep 5
for loc in nl en es; do
  echo -n "$loc: "
  curl -s "http://localhost:3000/$loc" | grep -oE '<html[^>]*lang="[^"]+"' | head -1
done
```

Expected:
```
nl: <html lang="nl"
en: <html lang="en"
es: <html lang="es"
```

This is phase-0 sanity; already confirmed via code read at `layout.tsx:52`.

## 12. Open questions / noted-but-deferred

- **Focus trap re-query for Calendly iframe** — cross-origin iframe cannot be queried; proper fix requires `focus-trap-react` library. Out of scope for this phase; noted in audit 07 §6.
- **Mobile hamburger ≥44px** — raise `p-2` → `p-3` at `HeaderClient.tsx:347`. Tiny fix, could be included opportunistically in 11-01.
- **Touch targets on footer social icons** — out of scope, P2.
- **Pricing "Most popular" badge as i18n key** — out of scope, T-8 batch.
- **`VoiceDemoFAB` + `FloatingButton` collision** — both use `right-6 bottom-6`. VoiceDemoFAB is only on `/skills/voice-agent`, FloatingButton (chat) is on all pages — they stack on exactly one route. Fix: shift VoiceDemoFAB to `bottom-24 right-6` when chat is present, or hide chat on that route. Low urgency; could be added as an opportunistic task in 11-01 task 6.
