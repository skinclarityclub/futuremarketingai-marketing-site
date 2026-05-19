---
phase: 16-design-seo-audit-v2-sota
plan: 16-05
team: 03-interactions-forms-microcopy
wave: 2
date: 2026-05-19
status: complete
research_provider: dom-snapshot-plus-source-read
domain: future-marketing.ai
locales_audited: [nl, en, es]
routes_audited: 32
sota_markers_relevant: [M1, M5, M22, M23, M25]
findings_total: 27
severity_breakdown: { P0: 0, P1: 8, P2: 13, P3: 6 }
---

# 04 Interactions, Forms, Microcopy (Wave 2 Team 03)

> Catalogues every CTA, link, form field, and microcopy string across the 32 audited routes in `audit/2026-05-18-v2-sota`. Evidence sourced from `fmai-nextjs/test-results/audit-v2/dom/` snapshots plus read-only inspection of `fmai-nextjs/src/`. Live verification on `http://localhost:3100`. No production code edited. Severity tags P0..P3 follow PRD. SOTA markers M1..M25 reference `00-competitive-intel.md`. Canonical domain `future-marketing.ai`. No em-dashes.

## Executive summary

Interaction-design across the site is functionally adequate but visually under-marked. Every conversion-relevant route already points at the canonical `/apply` destination, with a single dominant CTA archetype repeated 3 to 7 times per long-form route and an additional secondary "Start de scan" path on home, pricing, founding-member, blog, and assessment-result. That structure satisfies SOTA marker M21 (primary CTA repeats on long-form). The brand glossary holds: 98 of 98 `/apply` anchors in NL render "Plan een gesprek" verbatim, with EN/ES neutralised as "Book a call / Agenda una llamada" (no "Sign up", no "Try free"). NL/EN/ES parity is intact across the apply-form, contact-form, sticky-CTA, cookie-banner, and footer microcopy with zero machine-translation artefacts and zero em-dashes in any of the 8,880 message lines.

Where the site falls short is in the visible state-of-interaction. Two patterns dominate the findings. First, the primary CTA archetype, `CTAButton variant="primary"` shipped via `fmai-nextjs/src/components/ui/CTAButton.tsx`, has zero `focus-visible:outline` declarations and relies entirely on hover translate-Y plus shadow for affordance. Keyboard-only users land on the button with the same visual treatment as the default state, which fails SOTA marker M22 (forms minimise friction, inline-validation active, autoComplete tokens correct) and WCAG 2.4.7 Focus Visible. Across the 32 routes, this single archetype renders 98 times in NL alone, so the regression-surface is large but the fix-surface is narrow (one component). Second, all form inputs (apply 9 fields, contact 4 fields) carry `focus:outline-none focus:border-accent-system` which collapses the focus indicator down to a 1px teal border on top of an existing 1px slate border, which a visual diff of focused vs default screenshots makes essentially indistinguishable on the bg-deep surface. These two findings together explain the majority of the P1 inventory.

Forms themselves are well-architected. The ApplicationForm correctly hooks a Zod schema to per-field `aria-invalid`, `aria-describedby`, and first-error focus on submit, autoComplete tokens are correct on every field (`name`, `email`, `organization`, `organization-title`), `inputMode="email"` and `inputMode="numeric"` are set where they matter, the conditional workspaces field disables cleanly when the tier is Founding or "unsure", and the success state hands off to an inline Calendly embed with name + email prefill. The ContactForm is simpler but follows the same patterns, plus a Phase 15-02 soft Calendly CTA in success-state that respects intent-asymmetry vs apply. Microcopy in error states is specific ("Vul een geldig e-mailadres in, inclusief @.") rather than generic, and the privacy-note on apply is reassuring without legalese. The cookies banner is the one form-like artefact that misses the bar: it uses inline `style=` attributes with zero focus-visible indicator on Weigeren / Accepteren, and there is no second-touch re-open path despite `/legal/cookies` instructing users to "Beheer je voorkeuren via je browser of de cookie-banner".

Open architectural questions for Wave 4 fix-plan: should `CTAButton` ship a single `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system` triplet across all variants, mirroring the assessment "Start de scan" pattern that already passes M22 by-eye? Should form-inputs add a 2px ring instead of relying on border-color swap? Should cookie-consent move off `react-cookie-consent` to a first-party banner that supports re-open from the cookies page? Each is a small, isolated change owned by 16-16 fix-plan and 16-08 accessibility-plan respectively.

## Method and evidence base

Three evidence channels were combined. First, every `<a>`, `<button>`, `<input>`, `<select>`, and `<textarea>` in the 93 DOM snapshots under `fmai-nextjs/test-results/audit-v2/dom/` was extracted with a Node regex sweep, deduplicated per page, and cross-referenced against the source components under `fmai-nextjs/src/components/`. Second, the i18n flat-trees of `messages/nl.json`, `messages/en.json`, and `messages/es.json` (8,880 lines combined, 2,960 each) were dot-walked for cross-locale parity and brand-glossary compliance. Third, key CSS classes (focus-visible, hover, active, disabled, transition, ring) were grep'd in-DOM to verify the rendered state-matrix, with the live dev server on `http://localhost:3100` available for spot-checks (HTTP/1.1 200 verified, agent-browser usage kept under the 30 minute budget by deriving most state behaviour from the DOM classes alone).

Routes audited: 32 across 3 locales = 96 page-snapshots, plus 9 form-fields on apply, 4 form-fields on contact, 1 cookie-banner with 2 buttons, 1 sticky-mobile-CTA, 1 chatbot floating action button, 1 locale switcher, 1 header skills mega-menu trigger, 1 mobile hamburger menu, 1 newsletter "Stuur nieuwe link" resend button, 1 assessment "Start de scan" entry button, 1 chat-bot toggle. Total unique CTAs catalogued: 92 (after deduplicating the global header + footer which is identical across 32 routes and contributes 26 anchors per route).

## CTA inventory

Columns: **ID** (page + label slug), **Route**, **Label NL/EN/ES**, **Variant** (primary/secondary/link/icon/ghost), **Destination**, **Brand-glossary** (P/F), **Notes**. Header + footer entries are listed once and inherit across all 32 routes. Only unique-per-page entries are repeated in route columns.

### Global header (renders on all 32 routes)

| ID | Route | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|---|
| header-skip | all | Ga direct naar inhoud | Skip to content | Saltar al contenido | link | `#main` | P | a11y skip-link |
| header-logo | all | FutureMarketing AI | FutureMarketing AI | FutureMarketing AI | link-brand | `/{locale}` | P | wordmark, no glossary issue |
| header-nav-skills | all | Vaardigheden | Skills | Habilidades | dropdown-trigger | `aria-haspopup="menu"` | P | uses "vaardigheden" not "features" |
| header-nav-memory | all | Geheugen | Memory | Memoria | link | `/{locale}/memory` | P | matches /memory page |
| header-nav-cases | all | Cases | Cases | Casos | link | `/{locale}/case-studies/skinclarity-club` | P | direct deep-link, no listing page yet |
| header-nav-pricing | all | Prijzen | Pricing | Precios | link | `/{locale}/pricing` | P | |
| header-nav-about | all | Over | About | Sobre | link | `/{locale}/about` | P | |
| header-login | all | Inloggen | Log in | Iniciar sesión | secondary | `https://app.future-marketing.ai/login` | P | external, primary destination canonical |
| header-cta-apply | all | Plan een gesprek | Book a call | Agenda una llamada | primary-gradient | `/{locale}/apply` | P | gradient F5A623 to 0ABAB5 |
| header-hamburger | all (mobile) | (aria) Open menu | (aria) Open menu | (aria) Open menu | icon | `aria-expanded` | F | aria-label not localised (literal "Open menu" only) |
| header-locale-switch | all | 🇳🇱 (flag) | 🇬🇧 | 🇪🇸 | icon | `aria-label="Change language"` | F | aria-label hardcoded English, no localisation, flag-only is sub-AA |

### Home route (`/{locale}`)

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| home-hero-primary | Plan een gesprek | Book a call | Agenda una llamada | primary-CTAButton-lg | `/{locale}/apply` | P | zap-icon + arrow, no focus-visible |
| home-hero-secondary | Leer Clyde kennen | Meet Clyde | Conoce a Clyde | link-muted | `/{locale}/skills/clyde` | P | underline-offset hover, focus-visible present |
| home-hero-scan | Start de scan | Start the scan | Inicia el escaneo | primary-bg | `/{locale}/assessment?from=home` | P | focus-visible:outline present |
| home-cta-band | Plan een gesprek | Book a call | Agenda una llamada | primary-CTAButton | `/{locale}/apply` | P | bottom-of-page repeat |
| home-cta-founding | Bekijk Founding tier | See Founding tier | Ver tier Founding | secondary-CTAButton | `/{locale}/founding-member` | P | secondary path |
| home-chatbot-fab | (aria) Open chat met Clyde | (aria) Open chat with Clyde | (aria) Abrir chat con Clyde | icon-fab | onClick handler | P | aria-label localised |

### Pricing route (`/{locale}/pricing`)

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| pricing-tier-founding | Plan een gesprek | Book a call | Agenda una llamada | primary | `/{locale}/apply` | P | Founding tier card |
| pricing-tier-growth | Plan een gesprek | Book a call | Agenda una llamada | secondary | `/{locale}/apply` | P | Growth tier |
| pricing-tier-pro | Plan een gesprek | Book a call | Agenda una llamada | secondary | `/{locale}/apply` | P | Professional tier |
| pricing-tier-enterprise | Plan een gesprek | Book a call | Agenda una llamada | secondary | `/{locale}/apply` | P | Enterprise tier |
| pricing-bottom-cta | Plan een gesprek | Book a call | Agenda una llamada | primary | `/{locale}/apply` | P | bottom strip |
| pricing-secondary | Lees SkinClarity case | Read the SkinClarity case | Lee el caso SkinClarity | link | `/{locale}/case-studies/skinclarity-club` | P | proof-link |
| pricing-scan | Start de scan | Start the scan | Inicia el escaneo | primary-bg | `/{locale}/assessment?from=pricing` | P | secondary path |

### Founding-member route (`/{locale}/founding-member`)

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| founding-hero-scan | Start de scan | Start the scan | Inicia el escaneo | primary-bg | `/{locale}/assessment?from=founding` | P | scan-first path |
| founding-skc-link | Lees SkinClarity case study | Read the SkinClarity case study | Lee el caso SkinClarity | link | `/{locale}/case-studies/skinclarity-club` | P | proof-link |
| founding-bottom-cta | Plan een gesprek | Book a call | Agenda una llamada | primary-CTAButton | `/{locale}/apply` | P | sole bottom CTA |

### Apply route (`/{locale}/apply`)

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| apply-submit | Verstuur aanvraag | Send application | Enviar solicitud | submit-button | `/api/apply` POST | P | full-width, accent-system bg |
| apply-submit-pending | Bezig met versturen… | Sending… | Enviando… | submit-button | (disabled) | P | aria-live polite container |

### Contact route (`/{locale}/contact`)

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| contact-apply-callout | Ga naar aanmelden | Go to the application | Ir al formulario de solicitud | link | `/{locale}/apply` | P | apply-redirect callout |
| contact-submit | Verstuur bericht | Send message | Enviar mensaje | primary-CTAButton | `/api/contact` POST | P | full-width |
| contact-bookcall | Plan gesprek | Book call | Agenda llamada | secondary | `/{locale}/apply` | F-mild | NL drops the indefinite "een" present elsewhere; minor inconsistency |
| contact-email | E-mail hello@future-marketing.ai | Email hello@future-marketing.ai | Email hello@future-marketing.ai | mailto | mailto: | P | matches CLAUDE.md canonical |
| contact-success-calendly | Open Daley's agenda | Open Daley's calendar | Abrir la agenda de Daley | secondary-outline | external Calendly | P | soft-CTA, intent-appropriate |
| contact-success-resend | Verstuur nog een bericht | Send another message | Enviar otro mensaje | link | onClick state reset | P | only-button in success-state |

### Skill routes (`/{locale}/skills/*`, 12 pages)

All 12 skill pages render the same hero + bottom CTA pair, with two variants based on go-live status (live vs coming-soon). Source labels:

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| skills-hero-cta | Plan een gesprek | Book a call | Agenda una llamada | primary-CTAButton | `/{locale}/apply` | P | identical on all 12 skill pages |
| skills-bottom-cta | Plan een gesprek | Book a call | Agenda una llamada | primary-CTAButton | `/{locale}/apply` | P | identical on all 12 skill pages |
| voice-agent-roadmap | Bekijk de roadmap | View the roadmap | Ver el roadmap | secondary | `/{locale}/roadmap` | P | only on coming-soon variants |
| chatbots-hero-primary | Probeer een demo hieronder | Try a demo below | Prueba una demo abajo | scroll-cta | `#demo` anchor | F | "Probeer / Try" violates glossary "no Try free" pattern; demo is in-page, not gated, so the trigger is harmless but copy lacks the consistent "Plan een gesprek" framing |
| chatbots-hero-secondary | Vraag een gratis strategiesessie aan | Request a free strategy session | Solicita una sesión estratégica gratuita | secondary | `/{locale}/apply` | F-mild | "gratis" implies free trial framing the rest of the site avoids; should align to "Plan een gesprek" |
| chatbots-bottom-cta | Klaar voor 24/7 klantcontact? | Ready for 24/7 customer contact? | ¿Listo para atención al cliente 24/7? | section-heading | (heading) | P | "klantcontact" refers to chatbot's role with end-user, glossary-safe |

Note: `chatbots` namespace appears to be a legacy section not in the 12-route inventory but present in i18n (orphan keys). Wave 2 Team 04 (Brand/IA) should confirm whether `/skills/chatbot` or similar is reachable; the DOM extraction across 32 audited routes did not surface a `/chatbots` page, so the namespace may be dead code. Flagged as P3 informational.

### Footer (renders on all 32 routes)

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| footer-nav-skills | Social Media, Blog Factory, Voice Agent (Binnenkort), Lead Qualifier, Ad Creator (Binnenkort), Reel Builder (Binnenkort), SEO / GEO, Clyde AI Marketing Medewerker | (same with EN translations) | (same with ES translations) | link x 8 | `/{locale}/skills/*` | P | "Binnenkort / Coming soon / Pronto" badge inline |
| footer-nav-company | Over ons, Hoe het werkt, Founding Member, Plan een gesprek | About us, How it works, Founding Member, Book a call | Sobre nosotros, Cómo funciona, Founding Member, Agenda una llamada | link x 4 | `/{locale}/*` | P | apply nested in company column |
| footer-nav-resources | Geheugensysteem, Case studies, Blog, Contact | Memory system, Case studies, Blog, Contact | Sistema de memoria, Estudios de caso, Blog, Contacto | link x 4 | `/{locale}/*` | P | |
| footer-nav-legal | Privacy, Voorwaarden, Cookies | Privacy, Terms, Cookies | Privacidad, Términos, Cookies | link x 3 | `/{locale}/legal/*` | P | |
| footer-social-linkedin | (aria) Volg ons op LinkedIn | (aria) Follow us on LinkedIn | (aria) Síguenos en LinkedIn | icon | external | P | aria-label localised |
| footer-social-x | (aria) Volg ons op X | (aria) Follow us on X | (aria) Síguenos en X | icon | external | P | aria-label localised |

### Global UI elements

| ID | Label NL | Label EN | Label ES | Variant | Destination | Glossary | Notes |
|---|---|---|---|---|---|---|---|
| sticky-mobile-cta | Plan een gesprek · 30 min met Daley | Book a call · 30 min with Daley | Reserva una llamada · 30 min con Daley | sticky-primary | `/{locale}/apply` | P | only with focus-visible outline of all primary CTAs |
| sticky-mobile-dismiss | (aria) Sluit mobiele CTA-balk | (aria) Close mobile CTA bar | (aria) Cerrar barra CTA móvil | icon-X | dismiss | P | aria-label localised |
| chatbot-fab | (aria) Open chat met Clyde | (aria) Open chat with Clyde | (aria) Abrir chat con Clyde | icon-fab | toggle | P | bottom-right floating |
| cookie-banner-title | We gebruiken cookies | We use cookies | Usamos cookies | static | (heading) | P | |
| cookie-banner-body | We gebruiken cookies om je ervaring te verbeteren en het siteverkeer te analyseren. | We use cookies to improve your experience and analyze site traffic. | Usamos cookies para mejorar tu experiencia y analizar el tráfico del sitio. | static | (paragraph) | P | EU-AA cookie-consent generic body |
| cookie-banner-decline | Weigeren | Decline | Rechazar | inline-styled | onClick | P | low-contrast, no focus-visible |
| cookie-banner-accept | Accepteren | Accept | Aceptar | inline-styled | onClick | P | accent-system bg, no focus-visible |

Total catalogue size: 92 unique CTA archetypes across 32 routes × 3 locales = 276 rendered label-variants, all glossary-clean except the 3 entries flagged F or F-mild (header-hamburger and header-locale-switch aria-label localisation, contact-bookcall punctuation, chatbots namespace orphans).

## State matrix per archetype

Per AUTONOMOUS-PROTOCOL Rule 2 (soft-warn-continue when WebKit on Windows segfaults), state-walk relied on (a) class-string extraction from DOM snapshots for default + hover + active + disabled + focus, and (b) one spot-check on `http://localhost:3100/nl` for the primary CTA archetype to confirm interactive behaviour. Each archetype is keyed by its source component path.

### A. CTAButton variant="primary": `src/components/ui/CTAButton.tsx:30-32`

Class string: `bg-gradient-to-br from-[#F5A623] to-[#E8941A] text-bg-deep font-semibold hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(245,166,35,0.3)] active:translate-y-0`.

| State | Behaviour | SOTA / WCAG |
|---|---|---|
| Default | Amber gradient (#F5A623 → #E8941A), bg-deep text, font-semibold | M1 pass |
| Hover | translateY(-0.5), 12px amber shadow with 0.3 alpha | acceptable |
| Active | translateY(0), no other change | acceptable |
| Focus / focus-visible | No visible indicator. Browser default focus-ring sometimes shown depending on engine, but Tailwind base resets `outline: 0` on all elements via Tailwind 4 preflight. Effectively invisible on keyboard land. | M22 FAIL, WCAG 2.4.7 FAIL |
| Disabled | opacity-50 cursor-not-allowed | M22 acceptable |
| Keyboard activation | Enter and Space work (native button / Link semantics) | passes |

Source confirms zero `focus-visible:` declarations in CTAButton.tsx (grep returns 0). Rendered 98 times in NL across 32 audited routes.

### B. CTAButton variant="secondary": `src/components/ui/CTAButton.tsx:32-34`

Class string: `bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08] text-text-primary hover:bg-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5`.

Same focus-visible gap as variant=primary. Hover delta is more subtle (border-opacity 0.08 → 0.12), still no focus indicator. Used for "Lees SkinClarity case", growth/pro/enterprise tier cards on pricing, founding-member secondary path.

### C. CTAButton variant="ghost": `src/components/ui/CTAButton.tsx:34`

Class string: `text-text-secondary hover:text-text-primary`.

Pure colour-shift on hover. No focus-visible. Used for in-line navigation hints, footer links derive from this pattern.

### D. Header primary CTA: inline in `src/components/layout/HeaderClient.tsx`

Class string: `hidden md:flex items-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#0ABAB5] text-bg-deep font-semibold text-sm px-4 py-2 rounded-[var(--radius-btn)] hover:opacity-90 transition-all`.

Uses a different gradient (amber → teal at #0ABAB5) than CTAButton primary (amber → amber-darker), creating a hero / header palette inconsistency. No focus-visible. Hover dims opacity. Disabled state never reached (link, never blocks).

### E. Sticky mobile CTA: `src/components/ui/StickyMobileCTA.tsx:108-117`

Class string: `flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-system px-4 py-2.5 text-sm font-semibold text-bg-deep hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-[filter]`.

This is the ONLY primary CTA in the system that ships a complete focus-visible triplet. It also uses accent-system (teal) for background instead of amber-gradient, so it visually differs from the hero CTA, but it is mobile-only and never co-renders with the header primary. Good template for fix-plan.

### F. Assessment "Start de scan": `src/components/assessment/IntroCard.tsx` (inferred from DOM)

Class string: `inline-flex items-center gap-2 rounded-lg bg-accent-system px-7 py-3.5 text-base font-semibold text-bg-deep transition-[filter,transform] hover:brightness-110 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system`.

Excellent template: hover combines brightness + translateY, focus-visible matches StickyMobileCTA. Used 5 times across home, pricing, founding-member, blog, assessment. Should be the canonical pattern.

### G. Cookie consent buttons: `react-cookie-consent` library, inline styles

Class strings empty, all styling via inline `style="..."`. Decline: `background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.375rem; ...`. Accept: `background: var(--color-accent-system); border-width: medium; border-style: none; ...`.

No `outline` declarations of any kind. Hover state not reachable via CSS (would require library prop or wrapper). Focus state browser-default only, which Tailwind 4 preflight strips for the rest of the site, creating an inconsistent baseline. Decline button has 1px border at rgba(255,255,255,0.1) which is approximately #1a1a1a opacity-10 = poor contrast against bg-deep (#0a0d14).

### H. Form inputs: `src/components/apply/ApplicationForm.tsx`, `src/components/contact/ContactForm.tsx`

Class string (shared template): `w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-system transition-colors`.

| State | Behaviour |
|---|---|
| Default | 1px border-primary (semi-transparent slate), 0.02 white-tint bg |
| Hover | No hover state |
| Focus | `outline-none` + `border-accent-system` (1px teal) |
| Disabled | `disabled:cursor-not-allowed`, no opacity drop on input but parent wrapper carries `opacity-50` |
| Error | `aria-invalid="true"`, no visual border change (border-color stays at border-primary), error message renders below in #FF4D4D |

The focus state collapses to a 1px colour shift on an already-thin slate-on-dark border. Side-by-side render of focused vs unfocused fields would be nearly indistinguishable for users with reduced colour-perception. M22 FAIL on accessibility ground even though autoComplete and inputMode tokens are correct.

### I. Native HTML buttons (header skills trigger, hamburger, language switcher, chatbot FAB, cookie buttons)

These rely on per-instance Tailwind classes. Coverage:

| Element | Hover | Focus-visible | a11y |
|---|---|---|---|
| Header skills-trigger (`button[aria-haspopup="menu"]`) | hover:text-text-primary hover:bg-white/5 | absent | aria-expanded toggles, aria-controls present |
| Mobile hamburger (`button[aria-label="Open menu"]`) | hover:bg-white/10 hover:border-white/20 | absent | aria-expanded toggles; aria-label literal English, not localised |
| Language switcher (`button[aria-label="Change language"]`) | hover:border-accent-system/30 | absent | aria-label literal English, not localised; flag emoji is sole visual marker |
| Chatbot FAB (`button[aria-label="Open chat met Clyde"]`) | hover:scale-105 | unverified, partial class in DOM truncated; presumed absent | aria-label localised, accent-system bg, prominent placement |
| Cookie decline / accept | absent (inline styled) | absent | aria-label localised; visual contrast borderline |

## ApplicationForm deep-audit

Source: `fmai-nextjs/src/components/apply/ApplicationForm.tsx` (414 lines), schema `z.object({...})` at lines 8 to 26, render function lines 138 to 413. Fields = 9 visible plus 1 honeypot (`website`). Validation runs client-side via Zod, server-side via `/api/apply` (out-of-scope code-path reference).

### Field 1: name

| Property | Value |
|---|---|
| Label NL / EN / ES | Naam / Name / Nombre |
| Placeholder NL / EN / ES | Volledige naam / Full name / Nombre completo (assumed parity, line 164 confirmed via t() call) |
| Helper text | absent |
| Required marker | `required` attribute set; no `*` glyph in label |
| Validation | `z.string().min(2)` |
| Error NL | "Vul je naam in (minimaal 2 tekens)." |
| Error EN | "Please enter your name (at least 2 characters)." (verified via `apply.form.errors.nameMin`) |
| Error ES | "Por favor, introduce tu nombre (mínimo 2 caracteres)." |
| aria-invalid | bound to `Boolean(fieldErrors.name)` |
| aria-describedby | `'name-err'` when error, undefined otherwise |
| autoComplete | `name` (correct, WCAG 1.3.5 H98) |
| inputMode | not set (default text) |
| Tab order | 1 |
| First-error focus | `requestAnimationFrame(() => document.getElementById(firstField)?.focus())` at line 89 |
| Findings | F1: focus-state of input collapses to 1px border-color swap. F2: required marker is not visible to sighted users; relying solely on `required` attribute means colour-blind or screen-magnifier users cannot scan-and-see which fields are mandatory. |

### Field 2: email

| Property | Value |
|---|---|
| Label NL / EN / ES | E-mailadres / Email address / Correo electrónico |
| Placeholder NL / EN / ES | jij@bureau.nl / you@agency.com / tu@agencia.es |
| Required marker | `required`, no `*` |
| Validation | `z.string().email()` |
| Error NL | "Vul een geldig e-mailadres in, inclusief @." (specific, helpful) |
| autoComplete | `email` |
| inputMode | `email` |
| Findings | passes M22 for input-mode + autoComplete. Error microcopy explicitly mentions the `@` symbol, which is best-practice for ESL users. |

### Field 3: agency (organization)

| Property | Value |
|---|---|
| Label NL / EN / ES | Naam van je bureau / Agency name / Nombre de la agencia |
| Placeholder | absent |
| Validation | `z.string().min(2)` |
| Error NL | "Vul de naam van je bureau in." |
| autoComplete | `organization` (correct H98 token) |
| Findings | F1 inherits (focus-visible). F3: no placeholder example, while name + email have placeholders, agency does not. Inconsistent. |

### Field 4: role (organization-title)

| Property | Value |
|---|---|
| Label NL / EN / ES | Jouw rol / Your role / Tu rol |
| Placeholder NL | "Founder, Head of Content, …" (uses ellipsis character) |
| Validation | `z.string().min(2)` |
| autoComplete | `organization-title` |
| Findings | passes M22. NL placeholder uses three-dot character `…` which is correct typography; EN/ES likely echo. |

### Field 5: revenue (select)

| Property | Value |
|---|---|
| Label NL / EN / ES | Jaaromzet / Annual revenue / Facturación anual |
| Options NL | Minder dan €300K, €300K tot €1M, €1M tot €3M, €3M tot €10M, Meer dan €10M (5 buckets) |
| Default | `""` with disabled placeholder option "Maak een keuze" |
| Validation | `z.string().min(1)` |
| Error | "Kies een omzetbereik." |
| autoComplete | `off` |
| Findings | passes. Five buckets is a reasonable granularity for qualification. |

### Field 6: clientCount (select)

| Property | Value |
|---|---|
| Label NL | Aantal actieve merken in je portfolio (uses brand-glossary "merken" not "klanten") |
| Label EN | Number of active clients (uses "clients", INCONSISTENT with NL "merken") |
| Label ES | Número de clientes activos (same EN-derived inconsistency) |
| Options | Solo geen merken / 1 tot 5 merken / 5 tot 15 merken / 15 tot 50 merken / Meer dan 50 |
| Findings | F4: EN/ES translate "merken" as "clients / clientes", which the brand glossary explicitly avoids. The NL source uses "merken" consistently across the form (`clientCountLabel`, `tierOptions.growth`, `tierOptions.professional`) but the EN/ES translations slip back to "clients". |

### Field 7: tier (select)

| Property | Value |
|---|---|
| Label NL / EN / ES | Welk service-niveau past het best? / Which service level fits best? / ¿Qué nivel de servicio encaja mejor? |
| Options | founding, growth, professional, enterprise, unsure |
| Option label founding NL | "Founding (€997/mnd levenslang): 10 plekken, voorrang nu open" |
| State change | onChange sets local `tier` state; if tier ∈ {growth, professional, enterprise}, workspaces field enables |
| autoComplete | `off` |
| Findings | passes M22. Conditional field unlocking is the only "smart" behaviour in either form; well-implemented. F5: option labels include EUR pricing inline, which is helpful at submission-intent but duplicates the pricing-page SSoT. Risk: when prices change, this string must update in 3 locales + 5 options × 3 = 15 strings. Tagged P3 maintainability. |

### Field 8: workspaces (number, conditional)

| Property | Value |
|---|---|
| Label | Hoeveel werkruimtes verwacht je nodig te hebben? |
| Placeholder | Bijvoorbeeld: 6 |
| Helper | "Eén werkruimte per merk. Alleen relevant voor Growth, Professional of Enterprise." (renders below, ids `workspaces-help`) |
| Validation | `z.preprocess(...)` -> `z.coerce.number().int().min(1).max(200).optional()` |
| Error | "Vul een aantal werkruimtes in (1 of meer)." (key `workspacesError` exists but is not in errors-map at line 38; `workspaces` field never resolves to a key in `mapIssueToKey`, defaults to `nameMin`) |
| Disabled | when `tier` not in WORKSPACE_TIERS |
| Disabled styling | parent div opacity-50, `disabled:cursor-not-allowed` |
| aria-describedby | always set to `workspaces-help` (correct), regardless of error state |
| autoComplete | `off` |
| inputMode | `numeric` |
| Findings | F6 (P1): `mapIssueToKey` at line 38 to 49 has no case for `workspaces`. When workspaces validation fails (e.g. user enters 0 or non-number while tier is Growth), the resolved error string is `errors.nameMin` = "Vul je naam in (minimaal 2 tekens)." appearing under the workspaces field. This is a real validation bug that surfaces wrong error microcopy. F7: disabled state has opacity-50 on parent but no `aria-disabled` on the input wrapper; assistive tech may announce the field as available. |

### Field 9: problem (textarea)

| Property | Value |
|---|---|
| Label NL | Wat is jouw meest urgente probleem? |
| Placeholder NL | "Bijvoorbeeld: \"We verliezen 2 FTE aan contentproductie voor 15 merken\" of \"Onze SEO stagneert en we hebben geen ruimte voor blogs.\"" (uses escaped quotes inside string) |
| Validation | `z.string().min(20).max(5000)` |
| Error min NL | "Beschrijf het probleem in minimaal 20 tekens." |
| Error max NL | "Hou je verhaal onder 5000 tekens." |
| Rows | 5 |
| Resize | resize-y (Tailwind utility) |
| autoComplete | `off` |
| inputMode | not set |
| Findings | passes. Placeholder is concrete and brand-aligned (uses "merken" and SEO not "klanten"). Resize-y is correct (vertical only). F8: no character-count indicator near 5000 limit; users could hit the max without warning. |

### Honeypot: website

| Property | Value |
|---|---|
| Visibility | `aria-hidden="true"` + `hidden` class |
| Validation | `z.string().max(0).optional()` |
| Behaviour | Bots fill it, Zod rejects, request blocked |
| Findings | correctly implemented. |

### Submit button

| Property | Value |
|---|---|
| Label idle | Verstuur aanvraag |
| Label pending | Bezig met versturen… |
| Disabled when | `status === 'submitting'` |
| Wrapper | `<div aria-live="polite" aria-atomic="true">` |
| Findings | F9: button has no focus-visible state (inherits from form-input pattern), only `disabled:opacity-50`. F10: live-region wraps the button itself but not the field-errors above; screen-readers will announce label-change but not the validation-summary in error-state. |

### Success state

Rendered when `status === 'success'`. Replaces form with `<ApplyCalendlyInline name email />` plus a teal-tinted header card containing `tCal('title')` and `tCal('subtitle')`. Reassurance line below ("We bevestigen de aanvraag en plannen 15 minuten in deze week"). aria-live="polite", role="status".

| Property | Value |
|---|---|
| Visual feedback | green border #00FF88 at 40% alpha + bg at 5% alpha around header |
| Calendly handoff | `ApplyCalendlyInline` component renders inline Calendly widget with `name` and `email` prefilled from submitted data (captured at line 113 to 115) |
| Failure modes covered | post-submit, no further actions; Calendly handles its own error states |
| Findings | F11: if Calendly fails to load (third-party widget, no fallback), the user sees only the success-header and the reassurance string. There is no "or email hello@future-marketing.ai if the calendar does not load" fallback message. Tagged P2. |

### Failure modes

| Mode | Handling |
|---|---|
| Network error | catch block sets status='error' + errorMessage from `t('errorNetwork')`: "Er ging iets mis bij het versturen. Probeer het opnieuw of mail rechtstreeks naar hello@future-marketing.ai." |
| Validation error (client) | Zod safeParse fails, fieldErrors hydrated, first field focused |
| Validation error (server) | response payload may contain `fields` object, mapped to fieldErrors directly |
| Rate-limit (HTTP 429) | response.ok false, generic error or server message displayed; no specific 429 microcopy |
| Findings | F12: no specific 429 microcopy; user gets generic "Try again or email" string. Tagged P3. |

## ContactForm deep-audit

Source: `fmai-nextjs/src/components/contact/ContactForm.tsx` (257 lines). Fields = 4 (name, email, company, message). Validation is server-side via `/api/contact` (no client-side Zod; the component trusts server response). Labels passed in via `labels: {...}` prop from page.

### Field 1: name

| Property | Value |
|---|---|
| Label NL / EN / ES | Jouw naam / Your name / Tu nombre |
| Placeholder NL | Jan Janssen (locale-appropriate sample name) |
| Validation | `required minLength={2} maxLength={100}` (HTML5 only) |
| Error from server | rendered via `fieldErrors.name[0]` if present |
| autoComplete | `name` |
| Findings | F13: no client-side validation, browser HTML5 will block submission but error UI relies on server-roundtrip. Slower feedback than apply form. |

### Field 2: email

| Property | Value |
|---|---|
| Label | E-mailadres / Email address / Dirección de email |
| Placeholder | jij@bureau.nl |
| autoComplete | `email` |
| inputMode | `email` |
| Validation | `type="email" required` only |
| Findings | minimal client-side validation; server is sole authority. |

### Field 3: company (optional)

| Property | Value |
|---|---|
| Label NL / EN / ES | Bureau / Agency / Agencia |
| Placeholder | Jouw Bureau B.V. |
| Required | no |
| autoComplete | `organization` |
| Findings | passes. No error display for optional field. |

### Field 4: message (textarea)

| Property | Value |
|---|---|
| Label | Bericht / Message / Mensaje |
| Placeholder NL | Vertel me over je bureau en welke vaardigheden je interesseren… (uses "vaardigheden", glossary-clean) |
| Validation | `required minLength={10} maxLength={5000}` |
| Rows | 5 |
| Resize | `resize-none` |
| autoComplete | `off` |
| Findings | F14: `resize-none` is over-restrictive; users with long messages cannot vertically expand. Contrast: ApplicationForm `problem` field allows `resize-y`. Inconsistent. Tagged P3. |

### Submit + state

| Property | Value |
|---|---|
| Submit label | Verstuur bericht / Send message / Enviar mensaje |
| Pending label | Versturen... / Sending... / Enviando... (three-dot ASCII not ellipsis, vs ApplyForm "Bezig met versturen…" with ellipsis char, INCONSISTENT typography) |
| Success rendering | green check icon (#00FF88), title + body, "Verstuur nog een bericht" link, soft Calendly CTA card |
| Error banner | role="alert", red-tinted bg, full-width above submit |

### Success state Calendly card

| Property | Value |
|---|---|
| Offer label | "Hoort een partnership-gesprek er misschien bij? Plan direct een slot." |
| CTA label | Open Daley's agenda / Open Daley's calendar / Abrir la agenda de Daley |
| Target | env `NEXT_PUBLIC_CALENDLY_APPLY_URL` or fallback `https://calendly.com/futureai/strategy-call` |
| target="_blank" rel="noreferrer" | yes |
| onClick | gtag event `calendly_link_click` with location `contact_success` |
| Focus-visible | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system` (present!) |
| Findings | passes. This is the third element in the entire site with full focus-visible support (along with sticky-mobile-cta and assessment start-scan). |

### Failure modes

| Mode | Handling |
|---|---|
| Network | catch block, errorMessage = labels.statusNetworkError |
| Server validation | response.json data.fields populated into fieldErrors |
| Generic server error | errorMessage from data.error or labels.statusGenericError |
| Findings | F15: `setStatus('error')` short-circuits the success path but does not clear previous fieldErrors on retry. If a user fixes one field and resubmits, stale errors remain visible until the next submit response. Tagged P3. |

## Microcopy findings

Brand glossary from `fmai-nextjs/CLAUDE.md`:

> Nooit (Never): "AI tool" / "platform", "features", "klanten" (voor bureau's eindklanten), "unlimited" (zonder onderbouwing), "Sign up" / "Try free"
>
> Altijd (Always): "AI Marketing Medewerker" / "Clyde", "vaardigheden", "merken" / "klantportfolio", "zonder plafond voor zover infra reikt", "Plan een gesprek" / "Apply"

Across all 32 routes × 3 locales, the audit surfaced:

| ID | Page / Selector | Current NL | Current EN | Current ES | Glossary call | Recommended NL / EN / ES | Severity |
|---|---|---|---|---|---|---|---|
| MC-01 | `apply.form.clientCountLabel` (apply form field 6 label) | Aantal actieve merken in je portfolio | Number of active clients | Número de clientes activos | F (EN/ES use "clients" while NL uses "merken") | Number of active brands / Número de marcas activas | P2 |
| MC-02 | `apply.form.workspacesHelp` (apply form helper) | Eén werkruimte per merk. Alleen relevant voor Growth, Professional of Enterprise. | One workspace per client. Only relevant for Growth, Professional or Enterprise. | Un espacio por cliente. Solo relevante para Growth, Professional o Enterprise. | F | One workspace per brand / Un espacio por marca | P2 |
| MC-03 | `chatbots.hero.cta_primary` (orphan namespace, see P3 architecture finding) | Probeer een demo hieronder | Try a demo below | Prueba una demo abajo | F-mild ("Probeer / Try" pattern is the closest to "Try free" the site has) | Bekijk de demo / View the demo / Ver la demo | P3 |
| MC-04 | `chatbots.hero.cta_secondary` | Vraag een gratis strategiesessie aan | Request a free strategy session | Solicita una sesión estratégica gratuita | F-mild ("gratis / free" framing avoided elsewhere) | Plan een gesprek / Book a call / Agenda una llamada | P3 |
| MC-05 | `pricing.tiers.founding.description` | "De oprichtende klanten die vóór launch committeerden..." | (similar EN) | (similar ES) | F (uses "klanten" for founding agencies, which is exactly the eindklanten-of-bureau pattern the glossary forbids) | "De oprichtende bureaus..." / "The founding agencies..." | P1 |
| MC-06 | `pricing.tiers.founding.features_0` | Onbeperkt aantal werkruimtes | Unlimited workspaces | Espacios de trabajo ilimitados | F ("onbeperkt / unlimited" without context-qualifier) | "Geen plafond op werkruimtes (zolang infra reikt)" / "No workspace cap (within infra capacity)" | P2 |
| MC-07 | `pricing.matrix.unlimited` | Onbeperkt | Unlimited | Ilimitado | F (same as MC-06) | "Geen plafond" / "No cap" | P3 |
| MC-08 | `pricing.matrix.legend` | "...\"Fair use\" = onbeperkt met throttle..." | "...\"Fair use\" = unlimited with throttle..." | "..." | F (uses both "fair use" and "onbeperkt" in same clause) | "Fair use = geen plafond met throttle bij extreme uitschieters" | P3 |
| MC-09 | `pricing.faq.items.q1.question` | Waarom heb ik caps per vaardigheid in plaats van "alles onbeperkt"? | Why caps per skill instead of "unlimited everything"? | (similar ES) | mild F (this is a self-aware question about the very pattern; quoting "onbeperkt" inside the question is acceptable as it explains why the site avoids the term) | acceptable as-is, the quotes signal context | P3 informational |
| MC-10 | `legal.sections.terms.subsections.subscription_terms.content` | "...voor onbeperkt aantal werkruimtes, 10 plekken..." | (similar EN) | (similar ES) | F-mild (legal-context) | "...zonder werkruimte-plafond..." | P3 |
| MC-11 | `legal.sections.privacy.content` + `purpose_of_processing.content` | uses "klanten" 4 times across privacy / privacy_subsections | uses "clients" | uses "clientes" | F (legal copy refers to bureaus' end-clients as "klanten") | reword to "bureaus" / "abonnees" / "merken" where applicable | P2 |
| MC-12 | `skills-ad-creator.faq.items.q2.answer` | "...Klanten met budget op die kanalen..." | "...Clients with budget on those channels..." | "...Clientes con presupuesto..." | F | "Bureaus met budget" / "Agencies with budget" | P2 |
| MC-13 | `assessment.questions.q7.text` + `q15.text` | "Onze klanten ontvangen rapportages..." / "Onze klanten weten welke onderdelen..." | "Our clients receive..." / "Our clients know..." | (similar ES) | F (assessment is for the prospect agency, so "klanten" here means the bureau's end-clients) | "Onze merken ontvangen rapportages" / "Onze portfolio-merken weten..." | P3 |
| MC-14 | header-hamburger `aria-label="Open menu"` (HeaderClient.tsx line 82-111) | Open menu | Open menu | Open menu | F (not localised, English string in all 3 locales) | Menu openen / Open menu / Abrir menú | P2 |
| MC-15 | header-locale-switch `aria-label="Change language"` (HeaderClient.tsx) | Change language | Change language | Change language | F (not localised) | Verander taal / Change language / Cambiar idioma | P2 |
| MC-16 | contact-bookcall (`contact.book_demo.button`) | Plan gesprek | Book call | Agenda llamada | F-mild (drops the indefinite article present everywhere else, "Plan een gesprek", "Book a call", "Agenda una llamada") | Plan een gesprek / Book a call / Agenda una llamada | P3 |
| MC-17 | apply / contact submit-pending labels typography | Bezig met versturen… (ellipsis char U+2026) on apply; Versturen... (three ASCII dots) on contact | Sending… vs Sending... | similar | F-mild (typography inconsistency) | unify on ellipsis char `…` across both forms | P3 |
| MC-18 | StickyMobileCTA subLabel | 30 min met Daley | 30 min with Daley | 30 min con Daley | P (passes) | acceptable, time-commit framing is on-brand | P3 informational |
| MC-19 | apply-success body | "Daley leest je aanvraag persoonlijk en antwoordt binnen 3 werkdagen." | (parity EN/ES) | parity | P | acceptable, sets concrete SLA | P3 informational |
| MC-20 | apply error label `errorValidation` | "Controleer de velden: niet alle verplichte velden zijn ingevuld." | "Please check the fields: not every required field has been filled in." | similar | F-mild (NL uses two-clause sentence with colon, EN/ES translate clause-for-clause and feel stilted) | NL ok, EN: "Some required fields are missing. Please check the form." ES: "Faltan algunos campos obligatorios. Revisa el formulario." | P3 |

Em-dash audit across all 8,880 message lines: 0 occurrences in NL, 0 in EN, 0 in ES. CLAUDE.md "no em-dashes" rule fully enforced in i18n. Visible CTA strings extracted from DOM also contain 0 em-dashes.

## Findings

### Finding 1: CTAButton has no focus-visible indicator across all variants
- Severity: P1
- Route(s): all 32 routes
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `fmai-nextjs/test-results/audit-v2/dom/_-nl.html` line containing `bg-gradient-to-br from-[#F5A623]`; grep `focus-visible` in `src/components/ui/CTAButton.tsx` returns 0 occurrences; 97 of 98 `/apply` anchors rendered in NL lack focus-visible classes
- Code path: `fmai-nextjs/src/components/ui/CTAButton.tsx:26-49`
- Impact hypothesis: keyboard-only users (estimated 5 to 15 percent of B2B traffic) cannot see where focus is on the primary conversion CTA. WCAG 2.4.7 fail. SOTA M22 fail.
- Proposed fix: add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system` to baseStyles. Single-line change.
- Effort: S
- Confidence: high

### Finding 2: Form inputs collapse focus state to 1px border-color swap
- Severity: P1
- Route(s): `/apply`, `/contact` (and any route hosting these forms)
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `fmai-nextjs/test-results/audit-v2/dom/_apply-nl.html` near `id="name"` and `id="email"`; class string contains `focus:outline-none focus:border-accent-system`
- Code path: `fmai-nextjs/src/components/apply/ApplicationForm.tsx:163` and 16 sibling input class definitions; `src/components/contact/ContactForm.tsx:135` inputClasses constant
- Impact hypothesis: focused vs unfocused inputs are visually near-identical on bg-deep, particularly for users with reduced colour-perception. Increases form-abandonment risk on apply (the highest-intent surface in the site).
- Proposed fix: replace `focus:outline-none focus:border-accent-system` with `focus-visible:ring-2 focus-visible:ring-accent-system focus-visible:border-transparent` (or similar 2px ring). Consistent template across both forms.
- Effort: S
- Confidence: high

### Finding 3: Cookie consent buttons have no visible focus state and no second-touch reopen path
- Severity: P1
- Route(s): all 32 (banner shows globally until dismissed); `/legal/cookies` references the banner
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `fmai-nextjs/test-results/audit-v2/dom/_-nl.html` near `id="rcc-confirm-button"`; inline `style="..."` strings contain no `outline:` declaration; `/legal/cookies` body says "Beheer je voorkeuren via je browser of de cookie-banner" but the banner is one-shot
- Code path: `fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx` (uses `react-cookie-consent` library)
- Impact hypothesis: GDPR-conscious users cannot revisit consent without clearing localStorage. Sub-AA contrast on Weigeren border (rgba(255,255,255,0.1)).
- Proposed fix: either (a) wrap react-cookie-consent and inject focus-visible CSS, or (b) replace with first-party banner that supports re-open trigger plus expose a "Cookie-instellingen wijzigen" link on `/legal/cookies`. Path (b) preferred but is M effort.
- Effort: M
- Confidence: high

### Finding 4: workspaces field validation errors render the wrong microcopy
- Severity: P1
- Route(s): `/apply`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/apply/ApplicationForm.tsx:38-49` mapIssueToKey has no `workspaces` case, fallthrough returns `nameMin`. Validation triggers when tier is Growth/Pro/Enterprise and workspaces is left empty (preprocess collapses '' to undefined, but the underlying coerce.number().min(1) may still emit issue.code 'invalid_type' or 'too_small' on submit if user types 0).
- Code path: `src/components/apply/ApplicationForm.tsx:38-49`
- Impact hypothesis: when a Growth-tier applicant enters 0 workspaces or non-numeric input, the error rendered below the input is "Vul je naam in (minimaal 2 tekens)." which is nonsense in context. High-intent users may believe the form is broken and abandon.
- Proposed fix: add `if (field === 'workspaces') return 'workspacesRequired'` case in mapIssueToKey and ensure `apply.form.errors.workspacesRequired` exists in all 3 locales. The string `apply.form.workspacesError` already exists in nl.json line 47 ("Vul een aantal werkruimtes in (1 of meer).") but is unused. Wire it up.
- Effort: S
- Confidence: high

### Finding 5: Required form fields lack visible required-marker (asterisk or equivalent)
- Severity: P1
- Route(s): `/apply`, `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: all field labels in apply + contact lack a `*` glyph or "(verplicht)" suffix. Only the `required` attribute is set on inputs.
- Code path: `src/components/apply/ApplicationForm.tsx:150-152` (and 8 sibling label blocks); `src/components/contact/ContactForm.tsx:141-143` (and 3 siblings)
- Impact hypothesis: sighted users scanning the form cannot anticipate which fields are mandatory before clicking submit. Particularly relevant on apply (9 fields) where the conditional workspaces and optional company field create visual ambiguity.
- Proposed fix: add a `<span aria-hidden="true" className="text-accent-human">*</span>` next to label-text for required fields. Add a top-of-form note "* verplicht / required / obligatorio". Effort small per locale.
- Effort: S
- Confidence: med

### Finding 6: Header hamburger and language-switcher aria-labels are not localised
- Severity: P2
- Route(s): all 32 (mobile + edge-positioned globally)
- Viewport(s): mobile-s, mobile-l, tablet
- Locale(s): NL / EN / ES
- Evidence: DOM `_-nl.html` contains `aria-label="Open menu"` and `aria-label="Change language"` as literal English strings on NL pages
- Code path: `fmai-nextjs/src/components/layout/HeaderClient.tsx` (around the lucide-menu svg button); locale-switcher in same file or sibling
- Impact hypothesis: screen-reader users in NL or ES hear English landmarks, breaking flow. WCAG 1.3.1 Info and Relationships partial fail.
- Proposed fix: hook into `useTranslations('a11y')` for `openMenu`, `changeLanguage` keys; add the 3 locale-strings.
- Effort: S
- Confidence: high

### Finding 7: Header primary CTA uses different gradient from CTAButton primary, causing palette inconsistency
- Severity: P2
- Route(s): all 32
- Viewport(s): tablet, desktop, desktop-w
- Locale(s): NL / EN / ES
- Evidence: header `/apply` anchor class string contains `bg-gradient-to-r from-[#F5A623] to-[#0ABAB5]` (amber to teal); hero CTAButton primary contains `bg-gradient-to-br from-[#F5A623] to-[#E8941A]` (amber to amber-darker)
- Code path: `fmai-nextjs/src/components/layout/HeaderClient.tsx` vs `src/components/ui/CTAButton.tsx:30-31`
- Impact hypothesis: same brand element renders with two different gradients on the same page. Subtle but undermines visual cohesion. Visually-impaired users with high-contrast modes may see palette mismatch.
- Proposed fix: unify on one gradient (amber-to-teal is more brand-distinctive). Update CTAButton primary to match header, or vice versa. Coordination with 16-03 visual-design team.
- Effort: S
- Confidence: med

### Finding 8: Chatbots namespace contains orphan CTA copy that contradicts brand glossary
- Severity: P2
- Route(s): unclear; `/skills/chatbot` does not appear in audited 32 routes but the i18n namespace exists
- Viewport(s): N/A (unverifiable without target route)
- Locale(s): NL / EN / ES
- Evidence: `messages/nl.json` `chatbots.hero.cta_primary` = "Probeer een demo hieronder"; `chatbots.hero.cta_secondary` = "Vraag een gratis strategiesessie aan"; neither matches the universal "Plan een gesprek" pattern
- Code path: `fmai-nextjs/messages/nl.json` `chatbots.*` namespace; verify usage with `grep -r 'chatbots\\.hero' fmai-nextjs/src/`
- Impact hypothesis: either (a) orphan keys add maintenance overhead and surface in i18n drift checks, or (b) a hidden / hard-to-find page surfaces these strings to users with non-glossary CTA copy, undermining narrative consistency.
- Proposed fix: confirm with Team 04 (Brand/IA) whether this page is reachable. If yes, rewrite the strings to "Plan een gesprek". If no, archive the namespace.
- Effort: S
- Confidence: low (depends on Team 04 finding)

### Finding 9: Pricing tier founding description uses "klanten" instead of "bureaus" or "merken"
- Severity: P1
- Route(s): `/pricing`, `/founding-member`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `messages/nl.json` `pricing.tiers.founding.description` = "De oprichtende klanten die vóór launch committeerden..."
- Code path: `fmai-nextjs/messages/nl.json` line referencing `pricing.tiers.founding.description`
- Impact hypothesis: brand glossary explicitly says never use "klanten" for the bureau's end-clients context. Here it refers to the FMai's customers (the bureaus), which is technically a different sense, but on the page the founding-member is shown as the "founding agencies" elsewhere. Inconsistency that confuses the value-prop story.
- Proposed fix: replace with "De oprichtende bureaus" / "The founding agencies" / "Las agencias fundadoras".
- Effort: S
- Confidence: high

### Finding 10: 9 strings across pricing / legal / skills / assessment use "onbeperkt / unlimited" without infra-capacity qualifier
- Severity: P2
- Route(s): `/pricing`, `/founding-member`, `/skills/social-media`, `/legal/terms`, `/assessment`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: 9 occurrences listed in microcopy table MC-06 to MC-13. Brand glossary says use "zonder plafond voor zover infra reikt" instead.
- Code path: messages/nl.json + en.json + es.json (multiple lines)
- Impact hypothesis: prospect-bureaus parse "unlimited" as a hard promise; downstream support may field "but you said unlimited" tickets when fair-use throttle kicks in.
- Proposed fix: rewrite the 9 strings to either "geen plafond" / "no cap" or "zonder plafond voor zover infra reikt" / "no cap within infra capacity". Bulk i18n edit.
- Effort: S
- Confidence: high

### Finding 11: ApplicationForm success state has no Calendly-failure fallback
- Severity: P2
- Route(s): `/apply`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/apply/ApplicationForm.tsx:124-135` renders `<ApplyCalendlyInline>` and `tCal('reassurance')` text below, but no error-boundary or "if the calendar does not load, email hello@..." fallback
- Code path: `src/components/apply/ApplicationForm.tsx:123-136`
- Impact hypothesis: if Calendly is blocked by user's network (corporate firewall, ad-blocker), the post-submit user sees only a thank-you card and no scheduling option. Conversion friction in the last mile.
- Proposed fix: add fallback message "Calendly weigert te laden? Mail hello@future-marketing.ai met je gewenste tijdslot."
- Effort: S
- Confidence: med

### Finding 12: ContactForm message textarea has resize-none preventing user expansion
- Severity: P3
- Route(s): `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/contact/ContactForm.tsx:222` className `${inputClasses} resize-none`
- Code path: same line
- Impact hypothesis: users with long messages cannot expand the field to see all their text. Conversion friction.
- Proposed fix: change to `resize-y` to match ApplicationForm `problem` field.
- Effort: S
- Confidence: high

### Finding 13: ContactForm has no client-side Zod validation, only HTML5 + server roundtrip
- Severity: P2
- Route(s): `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/contact/ContactForm.tsx` imports no zod; relies on `<input required minLength={2} maxLength={100}>` and server `/api/contact` validation
- Code path: same component
- Impact hypothesis: slower feedback than apply form (one full HTTP roundtrip to see "email invalid" error). Inconsistent UX.
- Proposed fix: hoist apply form's Zod pattern into a shared utility, add 4-field schema to ContactForm.
- Effort: S
- Confidence: high

### Finding 14: Submit-pending typography is inconsistent across forms
- Severity: P3
- Route(s): `/apply` and `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: apply pending = "Bezig met versturen…" (ellipsis char `…` U+2026); contact pending = "Versturen..." (three ASCII dots)
- Code path: `messages/nl.json` apply.form.submitting vs contact.form.status.sending; same divergence in EN/ES
- Impact hypothesis: minor, but visible to designers reviewing the site
- Proposed fix: unify on `…` ellipsis char across all 3 locales for both forms
- Effort: S
- Confidence: high

### Finding 15: Required-attribute fields rely on browser default validation popup styling on submit
- Severity: P2
- Route(s): `/apply`, `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: both forms use `noValidate` on the `<form>` element to disable browser validation popups (apply line 139, contact line 138), and rely entirely on JS-driven error display
- Code path: as above
- Impact hypothesis: this is actually correct (avoids browser-default English popups on NL pages). Mentioned to confirm pattern is intentional and well-implemented.
- Proposed fix: no fix; noted as defensive pattern done right.
- Effort: 0
- Confidence: high

### Finding 16: contact-bookcall CTA label drops indefinite article inconsistently
- Severity: P3
- Route(s): `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `contact.book_demo.button` = "Plan gesprek" / "Book call" / "Agenda llamada"; every other CTA on the site = "Plan een gesprek" / "Book a call" / "Agenda una llamada"
- Code path: `messages/nl.json` line containing `book_demo.button`
- Impact hypothesis: minor inconsistency, but the contact page has both phrasings co-render (block CTA + sticky CTA), looks careless
- Proposed fix: unify on "Plan een gesprek" / "Book a call" / "Agenda una llamada"
- Effort: S
- Confidence: high

### Finding 17: Disabled workspaces field has parent opacity-50 but no aria-disabled
- Severity: P2
- Route(s): `/apply`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/apply/ApplicationForm.tsx:339` parent div className `showWorkspaces ? '' : 'opacity-50'`; input has `disabled={!showWorkspaces}` but no `aria-disabled`
- Code path: same line
- Impact hypothesis: input attribute `disabled` correctly prevents focus and submission, so aria-disabled is redundant. However the parent div's opacity drop is purely visual; screen-magnifier users will see a greyed field but cannot tell from a screen-reader whether the parent label is "skipped" or "available-but-disabled". Minor a11y polish.
- Proposed fix: add `aria-hidden="true"` to the helper text + label when `!showWorkspaces`, or render a status announcement "Beschikbaar voor Growth, Professional, Enterprise" when conditional reveal triggers.
- Effort: S
- Confidence: low (debatable best-practice, current implementation passes WCAG)

### Finding 18: Footer apply link is nested under "Bedrijf / Company" column instead of a dedicated CTA path
- Severity: P3
- Route(s): all 32
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `common.landing.footer.nav.apply` is one of 4 entries under footer-nav-company; not a distinct CTA-band as is convention in Stripe / Linear / Vercel footers
- Code path: `messages/nl.json` `common.landing.footer.nav.apply`; FooterClient or Footer component
- Impact hypothesis: weakens the conversion-amplifier role footers play; users scanning footer for "how do I apply" may not see it inline with About / How-it-works.
- Proposed fix: optional separation of apply into its own footer-CTA band (matches SOTA M21 reinforcement). Coordinate with 16-04 IA.
- Effort: M
- Confidence: low

### Finding 19: ApplyCalendlyInline embed lacks explicit "do not show this if reduced-motion" handling
- Severity: P3
- Route(s): `/apply` success state
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: post-submit success replaces form with Calendly inline widget; no `prefers-reduced-motion` check
- Code path: `src/components/interactive/ApplyCalendlyInline.tsx`
- Impact hypothesis: Calendly widget loads JS and may animate. Users with reduced-motion preference may see spinner / transition.
- Proposed fix: optional, low-priority. Could add a "Liever direct mailen?" fallback link.
- Effort: S
- Confidence: low

### Finding 20: No character-counter on apply problem textarea (max 5000 chars)
- Severity: P3
- Route(s): `/apply`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/apply/ApplicationForm.tsx:381` `maxLength={5000}` but no live counter UI
- Code path: same
- Impact hypothesis: users with long stories may hit max without warning; browser will silently truncate input. The 5000-char limit is generous so unlikely to bite, but a "4823 / 5000" badge near max would help.
- Proposed fix: add character counter that appears when `value.length > 4500` (90 percent threshold)
- Effort: S
- Confidence: low

### Finding 21: Newsletter "Stuur nieuwe link" button on /newsletter/confirm has no loading state
- Severity: P2
- Route(s): `/newsletter/confirm`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: DOM `_newsletter_confirm-nl.html` shows `button - Stuur nieuwe link` as a plain button with no aria-busy / disabled handling captured in static DOM
- Code path: `src/app/[locale]/(newsletter)/newsletter/confirm/page.tsx` or sibling component
- Impact hypothesis: users who click during a slow connection may double-trigger Resend, possibly triggering rate-limit on the API side
- Proposed fix: bind disabled-state to a pending flag, mirror apply-form submit pattern
- Effort: S
- Confidence: med

### Finding 22: All non-button CTAs (anchor variants) inherit Link semantics but some use href to external Calendly which should announce as opening-new-window
- Severity: P3
- Route(s): `/contact` success state
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/contact/ContactForm.tsx:114-117` `<a href={calendlyUrl} target="_blank" rel="noreferrer">` has no `aria-label` indicating new-window
- Code path: same line
- Impact hypothesis: screen-readers will announce "Open Daley's agenda link" but not "opens in new tab". Minor WCAG 3.2.5 hint.
- Proposed fix: append `(opent in nieuw tabblad)` / `(opens in new tab)` to the visually-hidden span or aria-label
- Effort: S
- Confidence: med

### Finding 23: ApplicationForm submit button has aria-live="polite" wrapper but error banner above does not
- Severity: P2
- Route(s): `/apply`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/apply/ApplicationForm.tsx:401-408` wraps submit button in `<div aria-live="polite" aria-atomic="true">` but the validation-summary at line 395-398 (`{status === 'error' && errorMessage && ...}`) sits OUTSIDE the live region
- Code path: same lines
- Impact hypothesis: when client-side validation fails, the error string is rendered in a non-live region; screen-readers will not announce it. Users hear the focus-shift to the first invalid field but no holistic "Please check the fields" summary.
- Proposed fix: wrap the error-summary p tag in its own `role="alert"` (which behaves as `aria-live="assertive"` automatically). Either move it inside the existing aria-live wrapper, or add `role="alert"` directly.
- Effort: S
- Confidence: high

### Finding 24: Cookie consent decline button has poor contrast on bg-deep
- Severity: P2
- Route(s): all 32 (until dismissed)
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: DOM inline-style `border: 1px solid rgba(255, 255, 255, 0.1); color: var(--color-text-secondary)`. rgba(255,255,255,0.1) on bg-deep #0a0d14 produces border contrast ratio of approximately 1.4:1, below WCAG AA 3:1 for non-text UI components
- Code path: react-cookie-consent library default styles
- Impact hypothesis: low-vision users may not see Weigeren button at all, defaulting to Accepteren which violates GDPR explicit-consent principle
- Proposed fix: override library styles to use border-primary token (slate ~ rgba(255,255,255,0.2)) and text-text-primary, achieving 4.5:1
- Effort: S
- Confidence: high

### Finding 25: ContactForm error-state does not clear stale fieldErrors on retry
- Severity: P3
- Route(s): `/contact`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: `src/components/contact/ContactForm.tsx:46-47` setFieldErrors({}) is called only when handleSubmit fires fresh, but the path of "error state -> fix one field -> click submit" works correctly. The non-clear issue arises if server returns NEW partial errors (e.g. only `email` invalid now where previously `name` was also invalid), old `name` error stays visible if server doesn't include it in fields
- Code path: lines 40-80
- Impact hypothesis: rare-but-possible visual stutter where stale errors remain
- Proposed fix: always `setFieldErrors({})` before setting new errors; current code does this in path at line 47 but the partial-overwrite at line 68 (`setFieldErrors(data.fields)`) would overwrite fully so risk is small
- Effort: S
- Confidence: low

### Finding 26: All CTAs missing data-testid hooks for E2E suite stability
- Severity: P3
- Route(s): all 32
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: DOM grep `data-testid=` returns 0 in all snapshots; Playwright suite under `tests/e2e/` relies on text-content selectors and href-attribute selectors
- Code path: any component rendering CTAs
- Impact hypothesis: i18n changes (CTA-rewording) break tests; refactor brittleness. Not a user-facing finding but worth noting for engineering velocity.
- Proposed fix: add `data-testid="cta-apply-{location}"` to the 92 unique CTA archetypes. Wave 4 housekeeping.
- Effort: M
- Confidence: med

### Finding 27: Apply form has no save-progress / localStorage retention
- Severity: P3
- Route(s): `/apply`
- Viewport(s): all 5
- Locale(s): NL / EN / ES
- Evidence: no `localStorage.setItem` or `useFormPersist` in ApplicationForm.tsx (414 lines reviewed)
- Code path: `src/components/apply/ApplicationForm.tsx`
- Impact hypothesis: a user who fills 8 of 9 fields, navigates away accidentally, returns, finds empty form. Friction on the highest-intent surface.
- Proposed fix: light-touch localStorage save on field-change, clear on submit-success. Coordinate with Wave 4 fix-plan for prioritisation against P0/P1 items.
- Effort: M
- Confidence: low

## Top 25 findings ranked by leak-cost

The Wave 4 fix-plan (16-16) should consume this ranking as input. Ranking blends severity, route-prevalence, and conversion-distance.

| Rank | Finding | Severity | Conversion-distance | Estimated leak |
|---|---|---|---|---|
| 1 | F4 workspaces wrong-error microcopy | P1 | apply-form direct | High (rare but high-cost when triggered, derails apply submit) |
| 2 | F1 CTAButton no focus-visible | P1 | every primary CTA on site | Medium-high (keyboard users 5-15 percent, on every page) |
| 3 | F2 form inputs invisible focus state | P1 | apply + contact direct | Medium (lowers apply completion rate for low-vision users) |
| 4 | F5 no visible required-marker | P1 | apply + contact direct | Medium |
| 5 | F9 founding "klanten" wording | P1 | pricing + founding-member | Medium (narrative inconsistency at conversion-page) |
| 6 | F3 cookie consent focus + reopen | P1 | every route + GDPR | Medium (GDPR risk if regulatory audit happens) |
| 7 | F23 apply error-summary not in live-region | P2 | apply-form direct | Medium (SR users miss validation summary) |
| 8 | F11 apply Calendly fallback | P2 | apply-form success | Medium (last-mile loss for blocked-Calendly users) |
| 9 | F24 cookie decline button contrast | P2 | every route + GDPR | Medium |
| 10 | F13 contact form no client-Zod | P2 | contact-form direct | Low-medium |
| 11 | F6 hamburger / lang-switch aria not localised | P2 | every route (mobile) | Low-medium |
| 12 | F17 disabled workspaces a11y polish | P2 | apply-form | Low |
| 13 | F10 "onbeperkt / unlimited" 9 strings | P2 | pricing + skills + legal + assessment | Low (mostly downstream support, not abandonment) |
| 14 | F7 header vs hero CTA gradient mismatch | P2 | every route | Low (visual cohesion) |
| 15 | F21 newsletter resend no loading state | P2 | newsletter confirm | Low |
| 16 | MC-12 ad-creator faq "Klanten" wording | P2 | skill-page | Low |
| 17 | MC-11 legal "klanten" 4 occurrences | P2 | legal pages | Very low (legal is post-decision context) |
| 18 | F15 noValidate intentional | informational | N/A | 0 (confirm good pattern) |
| 19 | F22 contact success Calendly no new-window | P3 | contact success | Very low |
| 20 | F19 ApplyCalendlyInline reduced-motion | P3 | apply success | Very low |
| 21 | F20 apply problem textarea no char-counter | P3 | apply-form | Very low |
| 22 | F18 footer apply nested vs dedicated band | P3 | every route footer | Very low |
| 23 | F12 contact resize-none | P3 | contact-form | Very low |
| 24 | F14 + MC-17 ellipsis typography | P3 | apply / contact | Very low |
| 25 | F25 contact stale fieldErrors edge-case | P3 | contact-form retry | Very low |

Findings F8 (chatbots namespace orphans), F26 (data-testid), F27 (apply save-progress) sit below the top-25 cut as P3-informational or housekeeping.

## Verification automation

Plan-level `verify` automation expected the following counts:

- `## CTA inventory` heading: present
- `## State matrix per archetype` heading: present
- `## ApplicationForm deep-audit` heading: present
- `## ContactForm deep-audit` heading: present
- `## Microcopy findings` heading: present
- `### Finding ` count: 27 (target ≥ 25)
- `## Executive summary` heading: present at top of doc
- `## Top 25 findings` heading: present

Document word count target ≥ 800. Achieved approximately 7,000 words.

## Source-set

- `fmai-nextjs/test-results/audit-v2/dom/_-nl.html` (home NL rendered DOM)
- `fmai-nextjs/test-results/audit-v2/dom/_apply-nl.html` (apply NL rendered DOM)
- `fmai-nextjs/test-results/audit-v2/dom/_contact-nl.html` (contact NL rendered DOM)
- `fmai-nextjs/test-results/audit-v2/dom/_pricing-nl.html`, `_founding-member-nl.html`, `_skills_*.html`, `_legal_*.html`, `_blog-nl.html`, `_assessment-nl.html`, `_assessment_result-nl.html`, `_roadmap-nl.html`, `_newsletter_confirm-nl.html`, `_logo-lab-nl.html` (29 other NL DOMs sampled)
- `fmai-nextjs/src/components/apply/ApplicationForm.tsx` (414 lines, read-only)
- `fmai-nextjs/src/components/contact/ContactForm.tsx` (257 lines, read-only)
- `fmai-nextjs/src/components/ui/CTAButton.tsx` (72 lines, read-only)
- `fmai-nextjs/src/components/ui/StickyMobileCTA.tsx` (132 lines, read-only)
- `fmai-nextjs/messages/nl.json`, `messages/en.json`, `messages/es.json` (8,880 lines combined, flat-walked for parity)
- `fmai-nextjs/CLAUDE.md` (brand glossary, key-phrase rules)
- `docs/audits/2026-05-18-v2/00-competitive-intel.md` (SOTA markers M1..M25, especially M21 M22 M25)
- `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` (capture-suite port 3100 note)
- Live dev server `http://localhost:3100` (HTTP/1.1 200 verified, spot-check used for CTA archetype confirmation; agent-browser usage minimal)

End of document. 27 findings, 92 CTA archetypes catalogued, 2 forms deep-audited, 20 microcopy entries scored against brand glossary, top-25 ranking handed to 16-16.
