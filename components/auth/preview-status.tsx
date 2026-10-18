'use client'

import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/provider'

export function PreviewStatus({ show, text }: { show: boolean; text: string }) {
  const { t } = useLanguage()

  return (
    <div role="status" aria-live="polite">
      {show ? (
        <div className="flex gap-2.5 rounded-lg border border-gain/30 bg-gain/10 p-3">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-gain" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold">{t.auth.previewTitle}</p>
            <p className="mt-0.5 leading-relaxed text-muted-foreground">{text}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
