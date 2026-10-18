'use client'

import { RotateCcw, Wallet } from 'lucide-react'
import { useState } from 'react'
import { DemoBadge } from '@/components/trade/demo-badge'
import type { MarketPair } from '@/data/markets'
import { AMOUNT_DECIMALS, DEFAULT_AMOUNT_DECIMALS } from '@/data/trading'
import { formatAmount, formatChange, formatUsd } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import type { AccountSummary } from '@/lib/trading/demo-account'
import { cn } from '@/lib/utils'

interface BalanceCardProps {
  pair: MarketPair
  summary: AccountSummary
  holding: number
  onReset: () => void
}

export function BalanceCard({ pair, summary, holding, onReset }: BalanceCardProps) {
  const { t } = useLanguage()
  const [resetNotice, setResetNotice] = useState(false)
  const amountDecimals = AMOUNT_DECIMALS[pair.base] ?? DEFAULT_AMOUNT_DECIMALS
  const pnlPositive = summary.pnl >= 0

  const rows = [
    { label: t.trade.balance.inOrders, value: `${formatUsd(summary.reservedUsdt)} USDT` },
    { label: `${t.trade.balance.holding} (${pair.base})`, value: `${formatAmount(holding, amountDecimals)} ${pair.base}` },
    { label: t.trade.balance.equity, value: `${formatUsd(summary.equity)} USDT` },
  ]

  return (
    <section
      aria-label={t.trade.balance.title}
      className="rounded-2xl border border-border bg-linear-to-br from-brand-blue/10 via-card to-brand-violet/10 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Wallet className="size-4 text-brand-blue" aria-hidden="true" />
          {t.trade.balance.title}
        </h2>
        <DemoBadge />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t.trade.balance.available}</p>
      <p className="text-3xl font-bold tracking-tight tabular-nums" dir="ltr">
        {formatUsd(summary.available)} <span className="text-base font-semibold text-muted-foreground">USDT</span>
      </p>

      <dl className="mt-4 space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-semibold tabular-nums" dir="ltr">
              {row.value}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3">
          <dt className="text-muted-foreground">{t.trade.balance.pnl}</dt>
          <dd
            dir="ltr"
            className={cn('font-semibold tabular-nums', pnlPositive ? 'text-gain' : 'text-loss')}
          >
            {pnlPositive ? '+' : '-'}
            {formatUsd(Math.abs(summary.pnl))} ({formatChange(summary.pnlPercent)})
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => {
          onReset()
          setResetNotice(true)
        }}
        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        {t.trade.balance.reset}
      </button>
      <p role="status" className="mt-2 min-h-4 text-xs text-muted-foreground">
        {resetNotice ? t.trade.balance.resetDone : t.trade.balance.note}
      </p>
    </section>
  )
}
