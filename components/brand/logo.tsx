import { cn } from '@/lib/utils'
import { BRAND_NAME } from '@/lib/brand'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-8 shrink-0', className)}
    >
      <rect width="32" height="32" rx="9" className="fill-brand-violet" />
      <rect width="32" height="32" rx="9" fill="url(#logo-gradient)" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect x="6.5" y="17" width="4.5" height="8" rx="1.5" fill="#fff" fillOpacity=".7" />
      <rect x="13.75" y="11.5" width="4.5" height="13.5" rx="1.5" fill="#fff" fillOpacity=".85" />
      <rect x="21" y="6" width="4.5" height="19" rx="1.5" fill="#fff" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-lg font-bold tracking-tight">{BRAND_NAME}</span>
    </span>
  )
}
