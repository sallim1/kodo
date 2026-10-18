import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatChange } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ChangeBadge({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0
  const Icon = positive ? ArrowUpRight : ArrowDownRight

  return (
    <span
      dir="ltr"
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold tabular-nums',
        positive ? 'bg-gain/12 text-gain' : 'bg-loss/12 text-loss',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {formatChange(value)}
    </span>
  )
}
