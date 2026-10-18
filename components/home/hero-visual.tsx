'use client'

import { heroCandles, sampleAsks, sampleBids, type OrderBookRow } from '@/data/hero-preview'
import { formatPrice } from '@/lib/format'
import { useLanguage } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

const CHART_WIDTH = 600
const CHART_HEIGHT = 240
const PADDING = 10

function CandleChart() {
  const lows = heroCandles.map((candle) => candle.low)
  const highs = heroCandles.map((candle) => candle.high)
  const min = Math.min(...lows)
  const max = Math.max(...highs)
  const scaleY = (value: number) =>
    PADDING + ((max - value) / (max - min)) * (CHART_HEIGHT - PADDING * 2)
  const step = CHART_WIDTH / heroCandles.length
  const bodyWidth = step * 0.56

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="h-auto w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          x2={CHART_WIDTH}
          y1={CHART_HEIGHT * ratio}
          y2={CHART_HEIGHT * ratio}
          className="stroke-border"
          strokeDasharray="3 6"
        />
      ))}
      {heroCandles.map((candle, index) => {
        const x = index * step + step / 2
        const up = candle.close >= candle.open
        const top = scaleY(Math.max(candle.open, candle.close))
        const bodyHeight = Math.max(2, Math.abs(scaleY(candle.open) - scaleY(candle.close)))
        const colorClass = up ? 'fill-gain stroke-gain' : 'fill-loss stroke-loss'
        return (
          <g key={index} className={colorClass}>
            <line x1={x} x2={x} y1={scaleY(candle.high)} y2={scaleY(candle.low)} strokeWidth="1.5" />
            <rect x={x - bodyWidth / 2} y={top} width={bodyWidth} height={bodyHeight} rx="1.5" stroke="none" />
          </g>
        )
      })}
    </svg>
  )
}

function OrderRows({ rows, tone }: { rows: OrderBookRow[]; tone: 'gain' | 'loss' }) {
  return (
    <>
      {rows.map((row) => (
        <div key={row.price} className="flex items-center justify-between text-xs tabular-nums">
          <span className={tone === 'gain' ? 'text-gain' : 'text-loss'}>{formatPrice(row.price)}</span>
          <span className="text-muted-foreground">{row.size.toFixed(3)}</span>
        </div>
      ))}
    </>
  )
}

export function HeroVisual({ className }: { className?: string }) {
  const { t } = useLanguage()
  const visual = t.hero.visual

  return (
    <figure className={cn('relative', className)}>
      <div
        role="img"
        aria-label={visual.label}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-brand-violet/10"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2" dir="ltr">
            <span className="text-sm font-bold">{visual.pair}</span>
            <span className="rounded bg-gain/12 px-1.5 py-0.5 text-xs font-semibold text-gain">+2.14%</span>
          </div>
          <span className="rounded-full border border-brand-violet/40 bg-brand-violet/10 px-2.5 py-0.5 text-xs font-medium text-brand-violet">
            {visual.simulated}
          </span>
        </div>

        <div className="grid sm:grid-cols-[1fr_11rem]">
          <div dir="ltr" className="p-4">
            <CandleChart />
          </div>
          <div className="hidden flex-col gap-2 border-s border-border p-4 sm:flex">
            <p className="text-xs font-semibold text-muted-foreground">{visual.orderBook}</p>
            <div dir="ltr" className="flex flex-col gap-1.5">
              <OrderRows rows={sampleAsks} tone="loss" />
              <div className="my-1 border-t border-border" />
              <OrderRows rows={sampleBids} tone="gain" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-border bg-muted/40 px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">{visual.balance}</p>
            <p dir="ltr" className="text-start text-base font-bold tabular-nums">
              10,000.00 USDT
            </p>
          </div>
          <span className="rounded-lg bg-gain px-4 py-2 text-xs font-bold text-background">{visual.buy}</span>
          <span className="rounded-lg bg-loss px-4 py-2 text-xs font-bold text-background">{visual.sell}</span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">{visual.caption}</figcaption>
    </figure>
  )
}
