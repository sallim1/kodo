'use client'

import { ChangeBadge } from '@/components/change-badge'
import { DemoBadge } from '@/components/trade/demo-badge'
import type { MarketPair } from '@/data/markets'
import { formatCompactUsd, formatPrice } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import { getPairStats } from '@/lib/trading/simulation'
import { cn } from '@/lib/utils'

interface PriceHeaderProps {
  pair: MarketPair
  price: number
  previousPrice: number
}

export function PriceHeader({ pair, price, previousPrice }: PriceHeaderProps) {
  const { t } = useLanguage()
  const stats = getPairStats(pair, price)
  const direction = price > previousPrice ? 'up' : price < previousPrice ? 'down' : 'flat'

  const items = [
    { label: t.trade.stats.high, value: formatPrice(stats.high) },
    { label: t.trade.stats.low, value: formatPrice(stats.low) },
    { label: t.trade.stats.volume, value: `${formatCompactUsd(stats.volume)} USDT` },
  ]

  return (
    <section
      aria-label={t.trade.stats.price}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between ltr:lg:gap-8"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 ltr:min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold" dir="ltr">
              {pair.base}/{pair.quote}
            </h2>
            <DemoBadge />
          </div>
          <p className="text-xs text-muted-foreground">
            {pair.name} · {t.trade.simulatedPrice}
          </p>
        </div>
        <p
          dir="ltr"
          aria-label={`${t.trade.stats.price}: ${formatPrice(price)} USDT`}
          className={cn(
            'text-3xl font-bold tracking-tight tabular-nums transition-colors sm:text-4xl',
            direction === 'up' && 'text-gain',
            direction === 'down' && 'text-loss',
          )}
        >
          {formatPrice(price)}
        </p>
        <div className="flex items-center gap-2">
          <ChangeBadge value={stats.change} />
          <span className="text-xs text-muted-foreground">{t.trade.stats.change}</span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-4 border-t border-border pt-4 lg:border-t-0 lg:pt-0 ltr:lg:shrink-0 ltr:lg:gap-x-8">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-muted-foreground ltr:lg:whitespace-nowrap">{item.label}</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums" dir="ltr">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
