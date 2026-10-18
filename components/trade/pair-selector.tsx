'use client'

import type { MarketPair } from '@/data/markets'
import { formatChange } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import { getPairStats } from '@/lib/trading/simulation'
import { cn } from '@/lib/utils'

interface PairSelectorProps {
  pairs: MarketPair[]
  prices: Record<string, number>
  selectedId: string
  onSelect: (pairId: string) => void
}

export function PairSelector({ pairs, prices, selectedId, onSelect }: PairSelectorProps) {
  const { t } = useLanguage()

  return (
    <div
      role="group"
      aria-label={t.trade.pairsLabel}
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
    >
      {pairs.map((pair) => {
        const change = getPairStats(pair, prices[pair.id] ?? pair.price).change
        const selected = pair.id === selectedId
        return (
          <button
            key={pair.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(pair.id)}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-2 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'border-brand-violet/60 bg-brand-violet/15'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            <span className="text-sm font-semibold" dir="ltr">
              {pair.base}/{pair.quote}
            </span>
            <span
              dir="ltr"
              className={cn('text-xs font-semibold tabular-nums', change >= 0 ? 'text-gain' : 'text-loss')}
            >
              {formatChange(change)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
