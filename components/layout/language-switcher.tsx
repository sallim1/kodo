'use client'

import { Globe } from 'lucide-react'
import type { Language } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

const OPTIONS: { value: Language; label: string; name: string }[] = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'ar', label: 'عربي', name: 'العربية' },
]

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/60 p-0.5',
        className,
      )}
    >
      <Globe className="mx-1.5 size-4 text-muted-foreground" aria-hidden="true" />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          aria-pressed={language === option.value}
          aria-label={option.name}
          onClick={() => setLanguage(option.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
            language === option.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
