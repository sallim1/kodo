export interface Candle {
  open: number
  high: number
  low: number
  close: number
}

export interface OrderBookRow {
  price: number
  size: number
}

function createSeededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildCandles(count: number): Candle[] {
  const random = createSeededRandom(11)
  const candles: Candle[] = []
  let price = 100

  for (let index = 0; index < count; index += 1) {
    const open = price
    const close = open + (random() - 0.42) * 6
    const high = Math.max(open, close) + random() * 3
    const low = Math.min(open, close) - random() * 3
    candles.push({ open, high, low, close })
    price = close
  }

  return candles
}

/** Deterministic illustrative candles, identical on server and client. */
export const heroCandles: Candle[] = buildCandles(40)

export const sampleAsks: OrderBookRow[] = [
  { price: 67862.4, size: 0.412 },
  { price: 67855.1, size: 0.826 },
  { price: 67848.9, size: 0.254 },
]

export const sampleBids: OrderBookRow[] = [
  { price: 67836.2, size: 0.538 },
  { price: 67829.7, size: 0.911 },
  { price: 67821.3, size: 0.367 },
]
