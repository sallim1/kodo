'use client'

import { Info, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useLanguage } from '@/lib/i18n/provider'

export const authLinkClass =
  'rounded-sm font-medium text-brand-blue underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring'

type AuthCardProps = {
  icon: LucideIcon
  title: string
  description: string
  footer: ReactNode
  children: ReactNode
}

export function AuthCard({ icon: Icon, title, description, footer, children }: AuthCardProps) {
  const { t } = useLanguage()

  return (
    <section aria-labelledby="auth-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 start-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-violet/15 blur-3xl rtl:translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 -end-32 size-[24rem] rounded-full bg-brand-blue/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-7xl justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-violet/15 text-brand-violet">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h1 id="auth-title" className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

            <p className="mt-5 flex gap-2 rounded-lg border border-brand-blue/30 bg-brand-blue/10 p-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-blue" aria-hidden="true" />
              <span>{t.auth.previewNotice}</span>
            </p>

            <div className="mt-6">{children}</div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>
    </section>
  )
}
