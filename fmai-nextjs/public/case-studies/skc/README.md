# SKC Case Study Assets

Drop the Sindy headshot here as `sindy-headshot.jpg`.

## Required spec

- Filename: `sindy-headshot.jpg` (lowercase, hyphenated, .jpg extension)
- Dimensions: minimum 800x800 pixels, square or portrait
- Format: JPEG, sRGB color profile
- Source: photo collected during 2026-04 Sindy interview (see `docs/interviews/2026-04-sindy-skc-interview-brief.md`)
- Consent: written agreement from Sindy to publish on `https://future-marketing.ai/case-studies/skinclarity-club`

## Wiring

The component `src/components/case-studies/SkcTestimonialBlock.tsx` reads
`/case-studies/skc/sindy-headshot.jpg` via the `case_studies.skc.testimonial.photoSrc` i18n key.

The component is NOT yet rendered into the case-study page until this file lands.
See `15-03-PLAN.md` Task 6 (browser verification gate).
