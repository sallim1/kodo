'use client'

import { ArrowRight, FlaskConical, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { HeroVisual } from '@/components/home/hero-visual'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function Hero() {
  const { t } = useLanguage()
  const { hero } = t

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-brand-violet/15 blur-3xl rtl:translate-x-1/2"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -end-40 size-[28rem] rounded-full bg-brand-blue/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-gain" aria-hidden="true" />
            {hero.badge}
          </p>
          <h1
            id="hero-title"
            className="mt-5 text-balance text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {hero.titleLead}{' '}
            <span className="bg-linear-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/demo"
              className={cn(
                buttonVariants(),
                'h-12 gap-2 bg-linear-to-r from-brand-blue to-brand-violet px-6 text-base font-semibold text-white shadow-lg shadow-brand-violet/25 hover:brightness-110',
              )}
            >
              <FlaskConical aria-hidden="true" />
              {hero.primaryCta}
            </Link>
            <Link
              href="/#markets"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-12 gap-2 px-6 text-base font-semibold')}
            >
              {hero.secondaryCta}
              <ArrowRight className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd dir="ltr" className="text-start text-lg font-bold tabular-nums sm:text-2xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-xs leading-snug text-muted-foreground sm:text-sm">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}
