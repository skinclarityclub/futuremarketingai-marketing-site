import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('errors')

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-accent-system">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-text-primary">{t('notFound.title')}</h1>
      <p className="mt-2 text-lg text-text-secondary">{t('notFound.description')}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-accent-system px-6 py-3 text-sm font-medium text-bg-deep transition-colors hover:bg-accent-system/80"
      >
        {t('notFound.backHome')}
      </Link>
    </main>
  )
}
