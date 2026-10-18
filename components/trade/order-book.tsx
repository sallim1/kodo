'use client'

import { useMemo } from 'react'
import type { MarketPair } from '@/data/markets'
import { AMOUNT_DECIMALS, DEFAULT_AMOUNT_DECIMALS } from '@/data/trading'
import { formatAmount, formatPrice } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import { generateOrderBook } from '@/lib/trading/simulation'
import type { BookLevel } from '@/lib/trading/types'
import { cn } from '@/lib/utils'

interface OrderBookProps {
  pair: MarketPair
  price: number
  previousPrice: number
  tick: number
  onSelectPrice: (price: number) => void
  className?: string
}

interface BookRowProps {
  level: BookLevel
  side: 'ask' | 'bid'
  maxTotal: number
  decimals: number
  label: string
  onSelect: (price: number) => void
}

function BookRow({ level, side, maxTotal, decimals, label, onSelect }: BookRowProps) {
  const depth = Math.min(100, (level.total / maxTotal) * 100)

  return (
    <li>
      <button
        type="button"
        aria-label={`${label}: ${formatPrice(level.price)}`}
        onClick={() => onSelect(level.price)}
        className="relative grid h-6 w-full grid-cols-3 items-center gap-2 px-3 text-xs tabular-nums outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span
          aria-hidden="true"
          style={{ width: `${depth}%` }}
          className={cn('absolute inset-y-0.5 end-0 rounded-s-sm', side === 'ask' ? 'bg-loss/12' : 'bg-gain/12')}
        />
        <span className={cn('relative text-start font-medium', side === 'ask' ? 'text-loss' : 'text-gain')}>
          {formatPrice(level.price)}
        </span>
        <span className="relative text-center">{formatAmount(level.amount, decimals)}</span>
        <span className="relative text-end text-muted-foreground">{formatAmount(level.total, decimals)}</span>
      </button>
    </li>
  )
}

export function OrderBook({ pair, price, previousPrice, tick, onSelectPrice, className }: OrderBookProps) {
  const { t } = useLanguage()
  const decimals = AMOUNT_DECIMALS[pair.base] ?? DEFAULT_AMOUNT_DECIMALS
  const step = Math.floor(tick / 2)
  const book = useMemo(() => generateOrderBook(pair, price, step), [pair, price, step])
  const maxTotal = Math.max(book.asks[0]?.total ?? 1, book.bids[book.bids.length - 1]?.total ?? 1)
  const rising = price >= previousPrice

  return (
    <section
      aria-label={t.trade.book.title}
      className={cn('flex flex-col rounded-2xl border border-border bg-card py-4 sm:py-5', className)}
    >
      <div className="flex items-center justify-between gap-2 px-4 sm:px-5">
        <h2 className="text-sm font-semibold">{t.trade.book.title}</h2>
        <span className="text-xs text-muted-foreground">{t.trade.book.sample}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 px-3 text-xs text-muted-foreground">
        <span className="text-start">{t.trade.book.price}</span>
        <span className="text-center">{t.trade.book.amount}</span>
        <span className="text-end">{t.trade.book.total}</span>
      </div>

      <ul aria-label={t.trade.book.asks} className="mt-1">
        {book.asks.map((level) => (
          <BookRow
            key={level.price}
            level={level}
            side="ask"
            maxTotal={maxTotal}
            decimals={decimals}
            label={t.trade.book.usePrice}
            onSelect={onSelectPrice}
          />
        ))}
      </ul>

      <div className="my-2 flex items-center justify-between gap-2 border-y border-border bg-muted/50 px-3 py-2 sm:px-4">
        <span
          dir="ltr"
          className={cn('text-lg font-bold tabular-nums', rising ? 'text-gain' : 'text-loss')}
        >
          {formatPrice(price)}
        </span>
        <span className="text-xs text-muted-foreground">
          {t.trade.book.spread}{' '}
          <span className="font-semibold text-foreground tabular-nums" dir="ltr">
            {formatPrice(book.spread)}
          </span>
        </span>
      </div>

      <ul aria-label={t.trade.book.bids}>
        {book.bids.map((level) => (
          <BookRow
            key={level.price}
            level={level}
            side="bid"
            maxTotal={maxTotal}
            decimals={decimals}
            label={t.trade.book.usePrice}
            onSelect={onSelectPrice}
          />
        ))}
      </ul>
    </section>
  )
}
