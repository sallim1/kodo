import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  description: string
  align?: 'start' | 'center'
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'start',
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
