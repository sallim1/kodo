'use client'

import { FlaskConical } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/provider'

export function DemoBanner() {
  const { t } = useLanguage()

  return (
    <div role="note" className="border-b border-brand-violet/30 bg-brand-violet/10">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs text-foreground sm:text-sm">
        <FlaskConical className="hidden size-4 shrink-0 text-brand-violet sm:block" aria-hidden="true" />
        {t.banner.text}
      </p>
    </div>
  )
}
