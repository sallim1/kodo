'use client'

import { Check, FlaskConical, Wallet } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function DemoAccount() {
  const { t } = useLanguage()
  const { demo } = t

  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-brand-violet/30 bg-linear-to-br from-brand-blue/15 via-card to-brand-violet/15 p-6 sm:p-10 lg:p-12">
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-violet/15 px-3 py-1 text-xs font-semibold text-brand-violet">
                <FlaskConical className="size-3.5" aria-hidden="true" />
                {demo.badge}
              </span>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-brand-blue">{demo.eyebrow}</p>
              <h2 id="demo-title" className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {demo.title}
              </h2>
              <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">{demo.description}</p>

              <ul className="mt-6 flex flex-col gap-3">
                {demo.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gain/15 text-gain">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/demo"
                className={cn(
                  buttonVariants(),
                  'mt-8 h-12 gap-2 bg-linear-to-r from-brand-blue to-brand-violet px-6 text-base font-semibold text-white shadow-lg shadow-brand-violet/25 hover:brightness-110',
                )}
              >
                {demo.cta}
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-6 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Wallet className="size-5" aria-hidden="true" />
                </span>
                <p className="font-semibold">{demo.wallet.title}</p>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">{demo.wallet.balanceLabel}</p>
              <p dir="ltr" className="mt-1 text-start text-4xl font-bold tabular-nums">
                10,000.00 <span className="text-xl text-muted-foreground">USDT</span>
              </p>
              <dl className="mt-6 divide-y divide-border border-t border-border">
                {demo.wallet.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-3 text-sm">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
