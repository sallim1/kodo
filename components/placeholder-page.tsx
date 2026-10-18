'use client'

import { ArrowLeft, Construction } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export type PlaceholderKey = 'demo' | 'signIn' | 'signUp' | 'privacy' | 'terms'

export function PlaceholderPage({ pageKey }: { pageKey: PlaceholderKey }) {
  const { t } = useLanguage()
  const page = t.placeholder.pages[pageKey]

  return (
    <section aria-labelledby="placeholder-title" className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-violet/15 text-brand-violet">
        <Construction className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-blue">{t.placeholder.badge}</p>
      <h1 id="placeholder-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {page.title}
      </h1>
      <p className="mt-4 text-muted-foreground">{page.text}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t.placeholder.description}</p>
      <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 h-10 gap-2 px-5')}>
        <ArrowLeft className="rtl:rotate-180" aria-hidden="true" />
        {t.placeholder.back}
      </Link>
    </section>
  )
}
