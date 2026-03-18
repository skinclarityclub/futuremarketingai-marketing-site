import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('errors')

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-bold text-[#00D4FF]">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">{t('notFound.title')}</h1>
      <p className="mt-2 text-lg text-gray-400">{t('notFound.description')}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-[#00D4FF] px-6 py-3 text-sm font-medium text-[#050814] transition-colors hover:bg-[#00D4FF]/80"
      >
        {t('notFound.backHome')}
      </Link>
    </main>
  )
}
