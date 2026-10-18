'use client'

import { FlaskConical } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function DemoBadge({ className }: { className?: string }) {
  const { t } = useLanguage()

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-brand-violet/40 bg-brand-violet/15 px-2 py-0.5 text-xs font-bold tracking-widest text-violet-200',
        className,
      )}
    >
      <FlaskConical className="size-3.5" aria-hidden="true" />
      {t.trade.badge}
    </span>
  )
}
