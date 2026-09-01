import Image from 'next/image'

/**
 * Een echt scherm uit het product, met een bijschrift dat zegt wat je ziet.
 *
 * De site had tot 2026-09-01 NUL productscreenshots: `public/screenshots/` bevatte
 * alleen een .gitkeep en de hele site draaide op drie afbeeldingen (twee portretten
 * en een robot-render). Elke pagina beschreef het systeem en geen enkele toonde het.
 *
 * De beelden komen uit de demo-organisatie (fictief bureau "Nova Digital", fictieve
 * klanten), niet uit een klantaccount — daarom staat er geen echte klantdata op en
 * hoeft er niets geanonimiseerd te worden.
 */
export function AppScreenshot({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string
  alt: string
  caption: string
  priority?: boolean
}) {
  return (
    <figure className="mt-6">
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border-primary bg-bg-deep shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]">
        {/* Vensterbalk: maakt van een uitsnede een herkenbaar scherm in plaats van
            een zwevend plaatje, zonder een browser na te bootsen die er niet is. */}
        <div
          className="flex items-center gap-1.5 border-b border-border-primary bg-bg-surface/70 px-3 py-2"
          aria-hidden="true"
        >
          <span className="h-2 w-2 rounded-full bg-text-muted/40" />
          <span className="h-2 w-2 rounded-full bg-text-muted/30" />
          <span className="h-2 w-2 rounded-full bg-text-muted/20" />
        </div>
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1250}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 700px"
          className="w-full h-auto"
        />
      </div>
      <figcaption className="mt-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
        {caption}
      </figcaption>
    </figure>
  )
}
