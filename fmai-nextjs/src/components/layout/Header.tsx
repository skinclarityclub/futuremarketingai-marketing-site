import { HeaderClient } from './HeaderClient'

interface HeaderProps {
  locale: string
}

export async function Header({ locale }: HeaderProps) {
  return <HeaderClient locale={locale} />
}
