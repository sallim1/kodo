'use client'

import { TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { useLanguage } from '@/lib/i18n/provider'

export function SiteFooter() {
  const { t } = useLanguage()
  const { footer } = t

  const columns = [
    {
      title: footer.columns.platform,
      links: [
        { label: footer.links.home, href: '/' },
        { label: footer.links.markets, href: '/#markets' },
        { label: footer.links.demo, href: '/demo' },
      ],
    },
    {
      title: footer.columns.resources,
      links: [
        { label: footer.links.learn, href: '/#learn' },
        { label: footer.links.features, href: '/#features' },
        { label: footer.links.faq, href: '/#faq' },
      ],
    },
    {
      title: footer.columns.legal,
      links: [
        { label: footer.links.privacy, href: '/privacy' },
        { label: footer.links.terms, href: '/terms' },
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{footer.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="text-sm font-semibold">{column.title}</p>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <aside
          aria-labelledby="demo-disclaimer-title"
          className="mt-10 flex items-start gap-3 rounded-xl border border-brand-violet/30 bg-brand-violet/10 p-4"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-brand-violet" aria-hidden="true" />
          <div>
            <p id="demo-disclaimer-title" className="text-sm font-semibold">
              {footer.disclaimerTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{footer.disclaimer}</p>
          </div>
        </aside>

        <p className="mt-8 text-sm text-muted-foreground">
          <span dir="ltr">&copy; {new Date().getFullYear()}</span> Bitget. {footer.rights}
        </p>
      </div>
    </footer>
  )
}
