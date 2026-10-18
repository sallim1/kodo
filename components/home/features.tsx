'use client'

import {
  BookOpen,
  CandlestickChart,
  ChartPie,
  Gauge,
  ListOrdered,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { useLanguage } from '@/lib/i18n/provider'

const FEATURE_ICONS: LucideIcon[] = [CandlestickChart, ListOrdered, ChartPie, Gauge, BookOpen, ShieldCheck]

export function Features() {
  const { t } = useLanguage()
  const { features } = t

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="features-title"
          eyebrow={features.eyebrow}
          title={features.title}
          description={features.description}
          align="center"
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, index) => {
            const Icon = FEATURE_ICONS[index]
            return (
              <li
                key={item.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand-violet/40"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-brand-blue/20 to-brand-violet/20 text-brand-blue transition-transform group-hover:scale-105">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
