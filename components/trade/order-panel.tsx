'use client'

import { useId, useState } from 'react'
import { Tabs, TabsList, TabsTab } from '@/components/ui/tabs'
import type { MarketPair } from '@/data/markets'
import { AMOUNT_DECIMALS, DEFAULT_AMOUNT_DECIMALS, FEE_RATE } from '@/data/trading'
import { formatAmount, formatUsd } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import { getPriceDecimals } from '@/lib/trading/simulation'
import type { OrderSide, OrderType, PlaceOrderInput, PresetPrice } from '@/lib/trading/types'
import { cn } from '@/lib/utils'

const QUICK_PERCENTS = [25, 50, 75, 100] as const
const NUMERIC_INPUT = /^\d*\.?\d*$/

interface OrderPanelProps {
  pair: MarketPair
  price: number
  usdt: number
  holding: number
  presetPrice: PresetPrice | null
  onPlace: (input: PlaceOrderInput) => void
}

export function OrderPanel({ pair, price, usdt, holding, presetPrice, onPlace }: OrderPanelProps) {
  const { t } = useLanguage()
  const ids = useId()
  const amountDecimals = AMOUNT_DECIMALS[pair.base] ?? DEFAULT_AMOUNT_DECIMALS
  const priceDecimals = getPriceDecimals(pair.price)

  const [side, setSide] = useState<OrderSide>('buy')
  const [type, setType] = useState<OrderType>('market')
  const [limitPrice, setLimitPrice] = useState(() => price.toFixed(priceDecimals))
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [appliedPresetKey, setAppliedPresetKey] = useState<number | null>(null)

  if (presetPrice && presetPrice.key !== appliedPresetKey) {
    setAppliedPresetKey(presetPrice.key)
    setType('limit')
    setLimitPrice(presetPrice.price.toFixed(priceDecimals))
    setNotice(null)
  }

  const executionPrice = type === 'market' ? price : Number(limitPrice)
  const amountValue = Number(amount)
  const total = executionPrice > 0 && amountValue > 0 ? executionPrice * amountValue : 0
  const fee = total * FEE_RATE

  function getError(): string | null {
    if (type === 'limit' && !(executionPrice > 0)) return t.trade.order.errors.price
    if (!(amountValue > 0)) return t.trade.order.errors.amount
    if (side === 'buy' && total + fee > usdt + 1e-9) return t.trade.order.errors.funds
    if (side === 'sell' && amountValue > holding + 1e-9) return t.trade.order.errors.holdings
    return null
  }

  const error = getError()
  const visibleError = error !== null && (submitted || amount !== '') ? error : null

  function handleAmountChange(value: string) {
    if (!NUMERIC_INPUT.test(value)) return
    setAmount(value)
    setNotice(null)
  }

  function handlePriceChange(value: string) {
    if (!NUMERIC_INPUT.test(value)) return
    setLimitPrice(value)
    setNotice(null)
  }

  function applyPercent(percent: number) {
    if (!(executionPrice > 0)) return
    const max = side === 'buy' ? usdt / (executionPrice * (1 + FEE_RATE)) : holding
    const factor = 10 ** amountDecimals
    const value = Math.floor(((max * percent) / 100) * factor) / factor
    setAmount(value > 0 ? value.toFixed(amountDecimals) : '')
    setNotice(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (error) return

    onPlace({ side, orderType: type, price: executionPrice, amount: amountValue })
    setNotice(type === 'market' ? t.trade.order.success.filled : t.trade.order.success.placed)
    setAmount('')
    setSubmitted(false)
  }

  const isBuy = side === 'buy'
  const availableLabel = isBuy
    ? `${formatUsd(usdt)} USDT`
    : `${formatAmount(holding, amountDecimals)} ${pair.base}`

  return (
    <section aria-label={t.trade.order.title} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h2 className="text-sm font-semibold">{t.trade.order.title}</h2>

      <div role="group" aria-label={t.trade.order.side} className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        {(['buy', 'sell'] as const).map((value) => {
          const active = side === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSide(value)
                setSubmitted(false)
                setNotice(null)
              }}
              className={cn(
                'h-9 rounded-md text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                active && value === 'buy' && 'bg-gain text-background',
                active && value === 'sell' && 'bg-loss text-background',
                !active && 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.trade.order[value]}
            </button>
          )
        })}
      </div>

      <Tabs
        value={type}
        onValueChange={(value) => {
          setType(value as OrderType)
          setSubmitted(false)
          setNotice(null)
        }}
        className="mt-3"
      >
        <TabsList aria-label={t.trade.order.type}>
          <TabsTab value="market">{t.trade.order.market}</TabsTab>
          <TabsTab value="limit">{t.trade.order.limit}</TabsTab>
        </TabsList>
      </Tabs>

      <p className="mt-3 text-xs text-muted-foreground">
        {type === 'market' ? t.trade.order.marketHint : t.trade.order.limitHint}
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-3 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.trade.order.available}</span>
          <span className="font-semibold text-foreground tabular-nums" dir="ltr">
            {availableLabel}
          </span>
        </div>

        <div>
          <label htmlFor={`${ids}-price`} className="mb-1 block text-xs text-muted-foreground">
            {t.trade.order.price}
          </label>
          <div className="flex h-10 items-center rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <input
              id={`${ids}-price`}
              dir="ltr"
              inputMode="decimal"
              autoComplete="off"
              disabled={type === 'market'}
              value={type === 'market' ? '' : limitPrice}
              placeholder={type === 'market' ? t.trade.order.marketPrice : '0.00'}
              onChange={(event) => handlePriceChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm tabular-nums outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <span className="ms-2 text-xs font-semibold text-muted-foreground">USDT</span>
          </div>
        </div>

        <div>
          <label htmlFor={`${ids}-amount`} className="mb-1 block text-xs text-muted-foreground">
            {t.trade.order.amount}
          </label>
          <div className="flex h-10 items-center rounded-lg border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <input
              id={`${ids}-amount`}
              dir="ltr"
              inputMode="decimal"
              autoComplete="off"
              value={amount}
              placeholder="0.00"
              aria-invalid={visibleError !== null}
              aria-describedby={visibleError ? `${ids}-error` : undefined}
              onChange={(event) => handleAmountChange(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm tabular-nums outline-none placeholder:text-muted-foreground"
            />
            <span className="ms-2 text-xs font-semibold text-muted-foreground">{pair.base}</span>
          </div>
        </div>

        <div role="group" aria-label={t.trade.order.quickAmount} className="grid grid-cols-4 gap-2">
          {QUICK_PERCENTS.map((percent) => (
            <button
              key={percent}
              type="button"
              onClick={() => applyPercent(percent)}
              className="h-8 rounded-md border border-border text-xs font-semibold text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {percent}%
            </button>
          ))}
        </div>

        <dl className="space-y-1.5 rounded-lg bg-muted/60 p-3 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t.trade.order.total}</dt>
            <dd className="font-semibold tabular-nums" dir="ltr">
              {formatUsd(total)} USDT
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">{t.trade.order.fee}</dt>
            <dd className="font-semibold tabular-nums" dir="ltr">
              {formatUsd(fee)} USDT
            </dd>
          </div>
        </dl>

        {visibleError ? (
          <p id={`${ids}-error`} role="alert" className="text-xs font-medium text-loss">
            {visibleError}
          </p>
        ) : null}
        <p role="status" className={cn('text-xs font-medium text-gain', !notice && 'sr-only')}>
          {notice}
        </p>

        <button
          type="submit"
          className={cn(
            'h-11 w-full rounded-lg text-sm font-bold text-background outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring',
            isBuy ? 'bg-gain' : 'bg-loss',
          )}
        >
          {isBuy ? t.trade.order.submitBuy : t.trade.order.submitSell} {pair.base}
        </button>
        <p className="text-center text-xs text-muted-foreground">{t.trade.order.simulatedNote}</p>
      </form>
    </section>
  )
}
