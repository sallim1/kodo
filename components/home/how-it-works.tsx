'use client'

import { SectionHeading } from '@/components/section-heading'
import { useLanguage } from '@/lib/i18n/provider'

export function HowItWorks() {
  const { t } = useLanguage()
  const { how } = t

  return (
    <section id="learn" aria-labelledby="learn-title" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="learn-title"
          eyebrow={how.eyebrow}
          title={how.title}
          description={how.description}
          align="center"
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {how.steps.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl border border-border bg-card p-6">
              <span
                dir="ltr"
                className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-brand-blue to-brand-violet text-lg font-bold text-white"
              >
                <span className="sr-only">{how.stepLabel} </span>
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
