'use client'

import { ShieldAlert } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { BalanceCard } from '@/components/trade/balance-card'
import { CandlestickChart } from '@/components/trade/candlestick-chart'
import { DemoBadge } from '@/components/trade/demo-badge'
import { OrderBook } from '@/components/trade/order-book'
import { OrderPanel } from '@/components/trade/order-panel'
import { OrdersPanel } from '@/components/trade/orders-panel'
import { PairSelector } from '@/components/trade/pair-selector'
import { PriceHeader } from '@/components/trade/price-header'
import { marketPairs } from '@/data/markets'
import { useLanguage } from '@/lib/i18n/provider'
import { summarizeAccount } from '@/lib/trading/demo-account'
import type { PlaceOrderInput, PresetPrice } from '@/lib/trading/types'
import { useDemoAccount } from '@/lib/trading/use-demo-account'
import { useSimulatedPrices } from '@/lib/trading/use-simulated-prices'

export function TradeWorkspace() {
  const { t } = useLanguage()
  const [pairId, setPairId] = useState(marketPairs[0].id)
  const [presetPrice, setPresetPrice] = useState<PresetPrice | null>(null)
  const [account, dispatch] = useDemoAccount()
  const { prices, previous, tick } = useSimulatedPrices(marketPairs)

  const pair = marketPairs.find((item) => item.id === pairId) ?? marketPairs[0]
  const price = prices[pair.id]
  const holding = account.holdings[pair.base] ?? 0
  const summary = useMemo(() => summarizeAccount(account, marketPairs, prices), [account, prices])

  useEffect(() => {
    if (tick > 0) dispatch({ type: 'tick', prices, now: Date.now() })
  }, [prices, tick])

  const handlePlace = useCallback(
    (input: PlaceOrderInput) => {
      dispatch({ type: 'place', pair, ...input, now: Date.now() })
    },
    [pair],
  )

  const handleSelectBookPrice = useCallback((value: number) => {
    setPresetPrice((current) => ({ price: value, key: (current?.key ?? 0) + 1 }))
  }, [])

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.trade.title}</h1>
        <DemoBadge className="text-sm" />
      </div>

      <div
        role="note"
        className="mt-4 flex items-start gap-3 rounded-xl border border-brand-violet/30 bg-brand-violet/10 p-3.5 sm:items-center"
      >
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-violet-300 sm:mt-0" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">{t.trade.disclaimerTitle}. </strong>
          {t.trade.disclaimer}
        </p>
      </div>

      <div className="mt-4">
        <PairSelector
          pairs={marketPairs}
          prices={prices}
          selectedId={pair.id}
          onSelect={(id) => {
            setPairId(id)
            setPresetPrice(null)
          }}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_280px_320px]">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-2 xl:col-span-1 xl:col-start-1 xl:row-start-1">
          <PriceHeader pair={pair} price={price} previousPrice={previous[pair.id]} />
          <CandlestickChart pair={pair} price={price} />
        </div>

        <div className="flex min-w-0 flex-col gap-4 xl:col-start-3 xl:row-span-2 xl:row-start-1">
          <OrderPanel
            key={pair.id}
            pair={pair}
            price={price}
            usdt={account.usdt}
            holding={holding}
            presetPrice={presetPrice}
            onPlace={handlePlace}
          />
          <BalanceCard
            pair={pair}
            summary={summary}
            holding={holding}
            onReset={() => dispatch({ type: 'reset' })}
          />
        </div>

        <OrderBook
          pair={pair}
          price={price}
          previousPrice={previous[pair.id]}
          tick={tick}
          onSelectPrice={handleSelectBookPrice}
          className="min-w-0 xl:col-start-2 xl:row-span-2 xl:row-start-1"
        />

        <OrdersPanel
          orders={account.orders}
          trades={account.trades}
          onCancel={(orderId) => dispatch({ type: 'cancel', orderId, now: Date.now() })}
          className="md:col-span-2 xl:col-span-1 xl:col-start-1 xl:row-start-2"
        />
      </div>
    </div>
  )
}
