'use client'

import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import { SectionHeading } from '@/components/section-heading'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

export function Faq() {
  const { t } = useLanguage()
  const { faq } = t
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="faq-title"
          eyebrow={faq.eyebrow}
          title={faq.title}
          description={faq.description}
          align="center"
        />
        <div className="mt-10 flex flex-col gap-3">
          {faq.items.map((item, index) => {
            const open = openIndex === index
            const buttonId = `${baseId}-button-${index}`
            const panelId = `${baseId}-panel-${index}`
            return (
              <div key={item.question} className="rounded-xl border border-border bg-card">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-start font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.question}
                    <ChevronDown
                      className={cn('size-5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
                  <p className="px-5 pb-5 leading-relaxed text-muted-foreground">{item.answer}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
