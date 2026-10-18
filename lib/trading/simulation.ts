import type { MarketPair } from '@/data/markets'
import { ORDER_BOOK_LEVELS } from '@/data/trading'
import type { BookLevel, Candle, OrderBookSnapshot } from './types'

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function getPriceDecimals(price: number): number {
  return price >= 1 ? 2 : 4
}

/**
 * Builds a deterministic, simulated candle history that ends at the pair's
 * sample price. The same pair and interval always produce the same shape.
 */
export function generateCandles(
  pair: MarketPair,
  intervalSeconds: number,
  count: number,
  nowSeconds: number,
): Candle[] {
  const random = createRandom(hashString(`${pair.id}:${intervalSeconds}`))
  const volatility = Math.min(0.012, 0.0016 * Math.sqrt(intervalSeconds / 60))
  const trendBias = pair.change24h >= 0 ? 0.00012 : -0.00012

  const closes: number[] = [1]
  const raw: { open: number; high: number; low: number; close: number }[] = []

  for (let i = 0; i < count; i += 1) {
    const open = closes[closes.length - 1]
    const close = open * (1 + (random() - 0.5) * 2 * volatility + trendBias)
    const high = Math.max(open, close) * (1 + random() * volatility * 0.7)
    const low = Math.min(open, close) * (1 - random() * volatility * 0.7)
    closes.push(close)
    raw.push({ open, high, low, close })
  }

  const scale = pair.price / closes[closes.length - 1]
  const bucket = Math.floor(nowSeconds / intervalSeconds) * intervalSeconds
  const decimals = getPriceDecimals(pair.price) + 2
  const round = (value: number) => Number(value.toFixed(decimals))

  return raw.map((candle, index) => ({
    time: bucket - (count - 1 - index) * intervalSeconds,
    open: round(candle.open * scale),
    high: round(candle.high * scale),
    low: round(candle.low * scale),
    close: round(candle.close * scale),
  }))
}

/**
 * Builds a simulated order book around the given price. `step` changes the
 * amounts slightly so the book appears to move while staying deterministic.
 */
export function generateOrderBook(pair: MarketPair, price: number, step: number): OrderBookSnapshot {
  const decimals = getPriceDecimals(pair.price)
  const minStep = 10 ** -decimals
  const gap = Math.max(price * 0.0002, minStep)
  const round = (value: number) => Number(value.toFixed(decimals))

  const baseRandom = createRandom(hashString(`${pair.id}:book`))
  const jitterRandom = createRandom(hashString(`${pair.id}:book:${step}`))

  const buildSide = (direction: 1 | -1): BookLevel[] => {
    let running = 0
    const levels: BookLevel[] = []
    for (let i = 0; i < ORDER_BOOK_LEVELS; i += 1) {
      const notional = 4_000 + baseRandom() * 56_000
      const amount = (notional / price) * (0.8 + jitterRandom() * 0.4)
      running += amount
      levels.push({
        price: round(price + direction * gap * (i + 1)),
        amount,
        total: running,
      })
    }
    return levels
  }

  const asksBestFirst = buildSide(1)
  const bids = buildSide(-1)

  return {
    asks: [...asksBestFirst].reverse(),
    bids,
    spread: round(asksBestFirst[0].price - bids[0].price),
  }
}

export interface PairStats {
  change: number
  high: number
  low: number
  volume: number
}

export function getPairStats(pair: MarketPair, price: number): PairStats {
  const drift = (price / pair.price - 1) * 100
  const range = Math.abs(pair.change24h) / 100
  return {
    change: pair.change24h + drift,
    high: Math.max(price, pair.price * (1 + 0.012 + range * 0.6)),
    low: Math.min(price, pair.price * (1 - 0.014 - range * 0.6)),
    volume: pair.volume24h,
  }
}

export function nextSimulatedPrice(current: number, anchor: number): number {
  const noise = (Math.random() - 0.5) * 2 * 0.0007
  const pull = (anchor - current) * 0.003
  const next = current * (1 + noise) + pull
  const min = anchor * 0.92
  const max = anchor * 1.08
  return Math.min(max, Math.max(min, next))
}
