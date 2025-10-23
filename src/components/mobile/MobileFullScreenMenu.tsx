import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X, ArrowRight, LogIn, Home, Sparkles, Calculator, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * MobileFullScreenMenu - Full-screen accessible mobile menu overlay
 *
 * Features:
 * - Headless UI Dialog for accessibility
 * - Full-screen overlay with backdrop
 * - Large touch targets (min 48x48px)
 * - Clear visual hierarchy
 * - Keyboard navigation support
 * - Focus trapping
 * - Screen reader friendly
 *
 * Usage:
 * ```tsx
 * <MobileFullScreenMenu
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onDemoClick={handleDemoClick}
 * />
 * ```
 */

interface MenuItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface MobileFullScreenMenuProps {
  isOpen: boolean
  onClose: () => void
  onDemoClick?: (e: React.MouseEvent) => void
  navLinks?: MenuItem[]
}

export const MobileFullScreenMenu: React.FC<MobileFullScreenMenuProps> = ({
  isOpen,
  onClose,
  onDemoClick,
  navLinks = [],
}) => {
  const { t } = useTranslation(['landing', 'common'])
  const location = useLocation()

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  // Default nav links if none provided
  const defaultNavLinks: MenuItem[] = [
    {
      label: t('landing:header.nav.features', 'Features'),
      href: '/#features',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: t('landing:header.nav.pricing', 'Pricing'),
      href: '/#pricing',
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      label: t('landing:header.nav.contact', 'Contact'),
      href: '/#contact',
      icon: <Mail className="w-5 h-5" />,
    },
  ]

  const menuItems = navLinks.length > 0 ? navLinks : defaultNavLinks

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl" />
        </Transition.Child>

        {/* Full-screen container */}
        <div className="fixed inset-0 overflow-y-auto safe-area-inset">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full transform bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 safe-area-inset flex flex-col">
                {/* Header with close button */}
                <div className="flex items-center justify-between mb-8">
                  <Dialog.Title className="text-2xl font-bold text-white">
                    {t('landing:header.menu_title', 'Menu')}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="
                      p-3 rounded-xl
                      bg-white/5 hover:bg-white/10
                      text-white
                      transition-colors
                      min-w-touch min-h-touch
                      flex items-center justify-center
                    "
                    aria-label={t('common:actions.close_menu', 'Close menu')}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links - Scrollable */}
                <nav
                  className="flex-1 flex flex-col space-y-2 overflow-y-auto"
                  aria-label={t('landing:header.mobile_nav_aria', 'Mobile navigation')}
                >
                  {/* Home Link */}
                  <Link
                    to="/"
                    onClick={onClose}
                    className={`
                      flex items-center gap-4
                      px-6 py-4
                      rounded-2xl
                      text-lg font-medium
                      transition-all duration-200
                      min-h-touch
                      ${
                        isActiveLink('/')
                          ? 'bg-gradient-primary text-white shadow-lg shadow-accent-primary/20'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Home className="w-5 h-5" aria-hidden="true" />
                    <span>{t('landing:header.nav.home', 'Home')}</span>
                  </Link>

                  {/* Dynamic Menu Items */}
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-4
                        px-6 py-4
                        rounded-2xl
                        text-lg font-medium
                        transition-all duration-200
                        min-h-touch
                        ${
                          isActiveLink(item.href)
                            ? 'bg-gradient-primary text-white shadow-lg shadow-accent-primary/20'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {item.icon && <span aria-hidden="true">{item.icon}</span>}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Divider */}
                <div className="h-px bg-white/10 my-6" />

                {/* Primary CTA - Always Visible (Bottom) */}
                <div className="flex flex-col space-y-3 safe-area-bottom">
                  {/* Demo CTA */}
                  {onDemoClick && (
                    <motion.button
                      onClick={(e) => {
                        onDemoClick(e)
                        onClose()
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="
                        w-full px-6 py-4
                        bg-gradient-primary
                        text-white text-lg font-semibold
                        rounded-2xl
                        shadow-xl shadow-accent-primary/30
                        hover:shadow-2xl hover:shadow-accent-primary/40
                        transition-all duration-200
                        flex items-center justify-center gap-3
                        min-h-touch
                      "
                    >
                      <span>{t('landing:header.try_demo', 'Try Demo')}</span>
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </motion.button>
                  )}

                  {/* Login Button */}
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="
                      w-full px-6 py-4
                      bg-white/5 hover:bg-white/10
                      text-white text-lg font-medium
                      rounded-2xl
                      transition-all duration-200
                      flex items-center justify-center gap-3
                      min-h-touch
                    "
                  >
                    <LogIn className="w-5 h-5" aria-hidden="true" />
                    <span>{t('landing:header.login', 'Login')}</span>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MobileFullScreenMenu
