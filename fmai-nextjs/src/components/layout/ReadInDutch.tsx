import { Link } from '@/i18n/navigation'

// /en is a translation of the Dutch site. A Dutch visitor who lands here gets a visible way to the source text,
// no redirect (siteplan golf 0). The text stays Dutch on purpose, hence lang="nl".
export function ReadInDutch({ href }: { href: '/' | '/about' }) {
  return (
    <p lang="nl" className="text-center text-sm text-text-secondary">
      <Link
        href={href}
        locale="nl"
        hrefLang="nl"
        className="underline underline-offset-4 hover:text-text-primary transition-colors"
      >
        Lees dit in het Nederlands
      </Link>
    </p>
  )
}
