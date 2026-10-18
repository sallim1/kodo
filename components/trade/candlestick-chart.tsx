'use client'

import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import type { MarketPair } from '@/data/markets'
import { CANDLE_COUNT, DEFAULT_TIMEFRAME, TIMEFRAMES, type TimeframeId } from '@/data/trading'
import { useLanguage } from '@/lib/i18n/provider'
import { generateCandles, getPriceDecimals } from '@/lib/trading/simulation'
import type { Candle } from '@/lib/trading/types'
import { cn } from '@/lib/utils'

const GAIN = '#3ddc84'
const LOSS = '#f4606b'
const TEXT = '#9aa3b8'
const GRID = 'rgba(255, 255, 255, 0.05)'
const BORDER = 'rgba(255, 255, 255, 0.1)'

interface CandlestickChartProps {
  pair: MarketPair
  price: number
}

export function CandlestickChart({ pair, price }: CandlestickChartProps) {
  const { t } = useLanguage()
  const [timeframe, setTimeframe] = useState<TimeframeId>(DEFAULT_TIMEFRAME)
  const containerRef = useRef<HTMLDivElement>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const lastCandleRef = useRef<Candle | null>(null)
  const priceRef = useRef(price)
  const intervalSeconds = TIMEFRAMES.find((item) => item.id === timeframe)?.seconds ?? 900

  useEffect(() => {
    priceRef.current = price
  }, [price])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const decimals = getPriceDecimals(pair.price)
    const chart: IChartApi = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: TEXT,
        fontSize: 12,
      },
      grid: { vertLines: { color: GRID }, horzLines: { color: GRID } },
      rightPriceScale: { borderColor: BORDER },
      timeScale: { borderColor: BORDER, timeVisible: true, secondsVisible: false },
      crosshair: { vertLine: { labelBackgroundColor: '#4f46e5' }, horzLine: { labelBackgroundColor: '#4f46e5' } },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: GAIN,
      downColor: LOSS,
      borderVisible: false,
      wickUpColor: GAIN,
      wickDownColor: LOSS,
      priceFormat: { type: 'price', precision: decimals, minMove: 10 ** -decimals },
    })

    const candles = generateCandles(pair, intervalSeconds, CANDLE_COUNT, Math.floor(Date.now() / 1000))
    series.setData(candles.map((candle) => ({ ...candle, time: candle.time as UTCTimestamp })))
    chart.timeScale().fitContent()

    seriesRef.current = series
    lastCandleRef.current = candles[candles.length - 1]

    return () => {
      seriesRef.current = null
      lastCandleRef.current = null
      chart.remove()
    }
  }, [pair, intervalSeconds])

  useEffect(() => {
    const series = seriesRef.current
    const last = lastCandleRef.current
    if (!series || !last) return

    const bucket = Math.floor(Date.now() / 1000 / intervalSeconds) * intervalSeconds
    const next: Candle =
      bucket > last.time
        ? { time: bucket, open: last.close, high: Math.max(last.close, price), low: Math.min(last.close, price), close: price }
        : { ...last, high: Math.max(last.high, price), low: Math.min(last.low, price), close: price }

    lastCandleRef.current = next
    series.update({ ...next, time: next.time as UTCTimestamp })
  }, [price, intervalSeconds])

  return (
    <section aria-label={t.trade.chart.title} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">{t.trade.chart.title}</h2>
        <div role="group" aria-label={t.trade.chart.timeframes} className="flex gap-1 rounded-lg bg-muted p-1">
          {TIMEFRAMES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === timeframe}
              onClick={() => setTimeframe(item.id)}
              className={cn(
                'h-7 min-w-10 rounded-md px-2.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                item.id === timeframe
                  ? 'bg-brand-violet/30 text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        dir="ltr"
        role="img"
        aria-label={`${t.trade.chart.label} ${pair.base}/${pair.quote}`}
        className="mt-3 h-72 w-full sm:h-96"
      />
      <p className="mt-3 text-xs text-muted-foreground">{t.trade.chart.note}</p>
    </section>
  )
}
