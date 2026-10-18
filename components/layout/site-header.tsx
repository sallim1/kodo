'use client'

import { FlaskConical, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { Logo } from '@/components/brand/logo'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { buttonVariants } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'markets', href: '/#markets' },
  { key: 'demo', href: '/demo' },
  { key: 'learn', href: '/#learn' },
] as const

const demoButtonClass =
  'h-9 gap-1.5 bg-linear-to-r from-brand-blue to-brand-violet px-3.5 font-semibold text-white shadow-lg shadow-brand-violet/25 hover:brightness-110 sm:px-4'

export function SiteHeader() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={t.nav.logoLabel}
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </Link>

        <nav aria-label={t.nav.label} className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden md:inline-flex" />
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost' }), 'hidden h-9 px-3 lg:inline-flex')}
          >
            {t.nav.signIn}
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: 'outline' }), 'hidden h-9 px-3.5 lg:inline-flex')}
          >
            {t.nav.createAccount}
          </Link>
          <Link href="/demo" className={cn(buttonVariants(), demoButtonClass)}>
            <FlaskConical aria-hidden="true" />
            <span className="sm:hidden">{t.nav.demoShort}</span>
            <span className="hidden sm:inline">{t.nav.demo}</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-border bg-background lg:hidden">
        <nav aria-label={t.nav.label} className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t.nav[link.key]}
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={closeMenu}
              className={cn(buttonVariants({ variant: 'outline' }), 'h-10')}
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className={cn(buttonVariants({ variant: 'outline' }), 'h-10')}
            >
              {t.nav.createAccount}
            </Link>
          </div>
          <LanguageSwitcher className="mt-3 self-start md:hidden" />
        </nav>
      </div>
    </header>
  )
}
