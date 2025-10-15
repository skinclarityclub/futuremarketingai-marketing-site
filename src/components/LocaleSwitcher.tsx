/**
 * Locale Switcher Component
 * Converted from Next.js to React Router
 * Source: locale-switcher.tsx
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

interface LocaleSwitcherProps {
  className?: string
}

export const LocaleSwitcher: React.FC<LocaleSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ]

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (langCode: string) => {
    void i18n.changeLanguage(langCode)
  }

  return (
    <div className={cn('relative group', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-white hover:bg-white/10"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden md:inline">{currentLanguage.label}</span>
        <span className="text-lg">{currentLanguage.flag}</span>
      </Button>

      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-2 space-y-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-left',
                i18n.language === lang.code
                  ? 'bg-blue-500/20 text-white'
                  : 'text-blue-100 hover:bg-white/10'
              )}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
